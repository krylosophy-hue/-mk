import { useState } from 'react';
import { Search, FileCheck, Clock, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const statusIcons = {
  'in-progress': Clock,
  'completed': CheckCircle2,
} as const;

const statusColors = {
  'in-progress': 'text-amber-600 bg-amber-50',
  'completed': 'text-green-600 bg-green-50',
} as const;

interface ApplicationStatus {
  id: string;
  workType: string;
  plannedDate: string;
  actualDate: string;
  status: 'in-progress' | 'completed';
  statusText: string;
  comment?: string;
}

// 2024-02-27T16:50:00 → 27.02.2024 (без времени)
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return dateString;
  }
};

export default function Status() {
  const [searchId, setSearchId] = useState('');
  const [found, setFound] = useState<ApplicationStatus | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicationStatus = async (docNum: string) => {
    setLoading(true);
    setError(null);
    setFound(null);

    try {
      // API DocSEDO АО «Москоллектор»
      const response = await fetch(
        `https://dopusk.moscollector.ru/docSedoStatus2024.php?docNum=${encodeURIComponent(docNum)}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      // Контракт API:
      //   { WorkType, Status, Comment, PlannedDateOfCompletion, ActualDateOfCompletion }
      //   либо ошибка / пусто, если номер не найден
      const data = await response.json();

      if (!data || !data.WorkType) {
        setFound(null);
        setError(null); // покажем «Заявка не найдена» в UI ниже
        return;
      }

      const isCompleted = data.Status === 'Исполнено' || data.Status === 'Выполнено';
      const application: ApplicationStatus = {
        id: docNum,
        workType: data.WorkType || 'Не указан тип работы',
        plannedDate: data.PlannedDateOfCompletion ? formatDate(data.PlannedDateOfCompletion) : 'Не указана',
        actualDate: data.ActualDateOfCompletion ? formatDate(data.ActualDateOfCompletion) : '-',
        status: isCompleted ? 'completed' : 'in-progress',
        statusText: data.Status || (isCompleted ? 'Выполнено' : 'В работе'),
        comment: data.Comment && data.Comment !== '-' ? data.Comment : undefined,
      };

      setFound(application);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Не удалось получить статус. Проверьте номер заявки и попробуйте снова.'
      );
      setFound(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const trimmed = searchId.trim();
    if (!trimmed) return;

    // Допустимые форматы:
    //   1111/24                 — короткий (как на печати ЦОП)
    //   04-01-08-000123/2026    — полный (старый формат)
    const isValidFormat = /^(\d{2}-\d{2}-\d{2}-\d{6}\/\d{4}|\d+\/\d{2,4})$/.test(trimmed);

    if (!isValidFormat) {
      setError('Проверьте формат номера заявки (например: 1111/24)');
      setFound(null);
      setSearched(true);
      return;
    }

    setSearched(true);
    fetchApplicationStatus(trimmed);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSearch();
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
                <Input
                  id="applicationId"
                  placeholder="Например: 1111/24"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={loading}
                  className="rounded-xl font-mono"
                />
                <Button
                  onClick={handleSearch}
                  disabled={!searchId.trim() || loading}
                  className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'Поиск...' : 'Проверить'}
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Номер заявки указан на печати ЦОП АО «Москоллектор». Принимаются форматы{' '}
                <span className="font-mono">1111/24</span> и{' '}
                <span className="font-mono">04-01-08-000123/2026</span>.
              </p>
            </div>

            {searched && (
              <div className="border-t border-slate-100 pt-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <Loader className="w-8 h-8 animate-spin text-sky-600" />
                    <p className="text-sm text-slate-500">Запрашиваем статус в системе DocSEDO…</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-800 mb-1">Ошибка</h3>
                        <p className="text-red-700 text-sm">{error}</p>
                        <p className="text-red-700 text-sm mt-2">
                          Если проблема повторяется, обратитесь в Центр обслуживания потребителей по&nbsp;телефону{' '}
                          <a href="tel:+74992222201" className="font-semibold underline">+7 (499) 222-22-01</a>.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : found ? (
                  <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${statusColors[found.status]}`}
                      >
                        {(() => {
                          const Icon = statusIcons[found.status];
                          return <Icon className="w-6 h-6" />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <h3 className="font-bold font-heading text-[#0a1628]">
                            Заявка № <span className="font-mono">{found.id}</span>
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${statusColors[found.status]}`}
                          >
                            {found.statusText}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Основная информация */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Тип работы</p>
                        <p className="text-sm font-medium text-[#0a1628] leading-snug">{found.workType}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Плановая дата</p>
                          <p className="text-sm font-semibold text-[#0a1628] tabular-nums">{found.plannedDate}</p>
                        </div>
                        {found.status === 'completed' && found.actualDate !== '-' && (
                          <div>
                            <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Фактическая дата</p>
                            <p className="text-sm font-semibold text-emerald-700 tabular-nums">{found.actualDate}</p>
                          </div>
                        )}
                      </div>

                      {found.comment && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Комментарий</p>
                          <p className="text-sm text-[#0a1628]">{found.comment}</p>
                        </div>
                      )}
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
                          Проверьте номер заявки и повторите поиск. Если номер введён корректно — обратитесь в Центр обслуживания потребителей по телефону{' '}
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
                <span className="font-medium text-[#0a1628]">Исполнено</span>
                <p className="text-xs text-slate-500">Услуга оказана</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Статус обращения синхронизируется с системой DocSEDO АО «Москоллектор».
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 mb-4">Нужна помощь?</p>
          <a href="tel:+74992222201">
            <Button
              variant="outline"
              className="border-[#0a1628] text-[#0a1628] hover:bg-[#0a1628] hover:text-white rounded-xl"
            >
              Позвонить в ЦОП
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
