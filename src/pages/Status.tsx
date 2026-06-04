import { useState } from 'react';
import { Search, FileCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Номер заявки соответствует номеру на печати ЦОП (формат: 04-01-08-XXXXXX/ГГГГ).
// Статус синхронизируется с системой DocsVision — доступны только два статуса.
const mockApplications = [
  {
    id: '04-01-08-000123/2026',
    type: 'Выдача технических условий',
    date: '15.01.2026',
    status: 'in-progress',
    statusText: 'В работе',
  },
  {
    id: '04-01-08-000087/2026',
    type: 'Согласование проекта',
    date: '10.01.2026',
    status: 'completed',
    statusText: 'Выполнено',
  },
];

const statusIcons = {
  'in-progress': Clock,
  'completed': CheckCircle2,
};

const statusColors = {
  'in-progress': 'text-amber-600 bg-amber-50',
  'completed': 'text-green-600 bg-green-50',
};

// Префикс номера заявки — фиксированный (нередактируемая часть).
// Пользователь вводит только NNNNNN/YYYY.
const APPLICATION_PREFIX = '04-01-08-';

export default function Status() {
  // Пользовательский ввод: только цифровая часть и год (например: 000123/2026)
  const [userPart, setUserPart] = useState('');
  const [found, setFound] = useState<typeof mockApplications[0] | null>(null);
  const [searched, setSearched] = useState(false);
  // notRegistered = true означает: либо номер не найден, либо БД вернула {result: "error"}
  const [notRegistered, setNotRegistered] = useState(false);

  // Полный номер заявки для запроса в БД
  const fullId = APPLICATION_PREFIX + userPart.trim();

  // Маска ввода: разрешаем только цифры, слеш и максимум 6 цифр + / + 4 цифры
  const handleUserPartChange = (raw: string) => {
    // Оставляем только цифры и слеш
    let cleaned = raw.replace(/[^0-9/]/g, '');
    // Не более одного слеша
    const slashIdx = cleaned.indexOf('/');
    if (slashIdx !== -1) {
      cleaned = cleaned.slice(0, slashIdx + 1) + cleaned.slice(slashIdx + 1).replace(/\//g, '');
    }
    // До слеша — не более 6 цифр; после — не более 4
    if (slashIdx === -1) {
      cleaned = cleaned.slice(0, 6);
    } else {
      const before = cleaned.slice(0, slashIdx).slice(0, 6);
      const after = cleaned.slice(slashIdx + 1).slice(0, 4);
      cleaned = before + '/' + after;
    }
    setUserPart(cleaned);
  };

  const handleSearch = () => {
    setSearched(true);

    if (!userPart.trim()) {
      setFound(null);
      setNotRegistered(true);
      return;
    }

    // TODO: заменить на реальный запрос к DocsVision (POST /api/status?id=...)
    // Ожидаемый ответ:
    //   { result: "ok",    data: {...} } — заявка найдена
    //   { result: "error", message?: "..." } — не зарегистрирована / ошибка БД
    const dbResponse: { result: 'ok' | 'error'; data?: typeof mockApplications[0] } = (() => {
      const match = mockApplications.find((app) => app.id === fullId);
      return match ? { result: 'ok', data: match } : { result: 'error' };
    })();

    if (dbResponse.result === 'error' || !dbResponse.data) {
      setFound(null);
      setNotRegistered(true);
    } else {
      setFound(dbResponse.data);
      setNotRegistered(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Статус обращения</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Проверьте статус вашей заявки онлайн
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card-modern p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center">
              <Search className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-[#0a1628]">Проверка статуса</h2>
              <p className="text-sm text-slate-500">Введите номер заявки с печати ЦОП</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="applicationId">Номер заявки</Label>
              <div className="flex gap-3">
                {/* Префикс «04-01-08-» вшит и не редактируется. Пользователь вводит только NNNNNN/YYYY. */}
                <div className="flex flex-1 items-stretch rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-colors">
                  <span
                    className="flex items-center px-3 bg-slate-50 border-r border-slate-200 text-slate-500 font-mono text-sm select-none"
                    aria-hidden="true"
                  >
                    {APPLICATION_PREFIX}
                  </span>
                  <Input
                    id="applicationId"
                    inputMode="numeric"
                    placeholder="000123/2026"
                    value={userPart}
                    onChange={(e) => handleUserPartChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-mono"
                    aria-label="Номер заявки (без префикса)"
                  />
                </div>
                <Button onClick={handleSearch} disabled={!userPart} className="bg-sky-600 hover:bg-sky-700 rounded-xl">
                  <Search className="w-4 h-4 mr-2" />
                  Проверить
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Введите номер из печати ЦОП АО «Москоллектор». Префикс <span className="font-mono">04-01-08-</span> заполнен автоматически.
                Полный формат: <span className="font-mono">04-01-08-000123/2026</span>.
              </p>
            </div>

            {searched && (
              <div className="border-t border-slate-100 pt-6">
                {found && !notRegistered ? (
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${statusColors[found.status as keyof typeof statusColors]}`}>
                        {(() => {
                          const Icon = statusIcons[found.status as keyof typeof statusIcons];
                          return <Icon className="w-6 h-6" />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold font-heading text-[#0a1628]">{found.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[found.status as keyof typeof statusColors]}`}>
                            {found.statusText}
                          </span>
                        </div>
                        <p className="text-slate-600 mb-1">{found.type}</p>
                        <p className="text-sm text-slate-500">Дата подачи: {found.date}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-800 mb-1">
                          Заявка с запрашиваемым номером в системе не зарегистрирована
                        </h3>
                        <p className="text-red-700 text-sm leading-relaxed">
                          Проверьте номер заявки и повторите поиск. Номер указан на печати ЦОП АО «Москоллектор» в формате <span className="font-mono whitespace-nowrap">04-01-08-……/2026</span>.
                          Если номер введён корректно — обратитесь в Центр обслуживания потребителей по телефону{' '}
                          <a href="tel:+74992222201" className="font-semibold underline">+7 (499) 222-22-01</a>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 card-modern p-6">
          <h3 className="font-bold font-heading text-[#0a1628] mb-4 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-sky-600" />
            Возможные статусы
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <span className="font-medium text-[#0a1628]">В работе</span>
                <p className="text-xs text-slate-500">Заявка обрабатывается</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <span className="font-medium text-[#0a1628]">Выполнено</span>
                <p className="text-xs text-slate-500">Услуга оказана</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Статус обращения синхронизируется с системой DocsVision АО «Москоллектор».
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 mb-4">Нужна помощь?</p>
          <a href="tel:+74992222201">
            <Button variant="outline" className="border-[#0a1628] text-[#0a1628] hover:bg-[#0a1628] hover:text-white rounded-xl">
              Позвонить в ЦОП
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
