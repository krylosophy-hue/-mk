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

export default function Status() {
  const [searchId, setSearchId] = useState('');
  const [found, setFound] = useState<typeof mockApplications[0] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const result = mockApplications.find(app => app.id === searchId);
    setFound(result || null);
    setSearched(true);
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
                  placeholder="Например: 04-01-08-000123/2026"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="rounded-xl"
                />
                <Button onClick={handleSearch} disabled={!searchId} className="bg-[#0a1628] hover:bg-[#0a1628]/90 rounded-xl">
                  <Search className="w-4 h-4 mr-2" />
                  Проверить
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Номер заявки указан на печати ЦОП АО «Москоллектор». Формат: 04-01-08-……/2026
              </p>
            </div>

            {searched && (
              <div className="border-t border-slate-100 pt-6">
                {found ? (
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
                        <h3 className="font-semibold text-red-800 mb-1">Заявка не найдена</h3>
                        <p className="text-red-700 text-sm">
                          Проверьте правильность введённого номера. Номер заявки указан на печати ЦОП в формате 04-01-08-……/2026. Если номер указан верно,
                          обратитесь в Центр обслуживания потребителей.
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
