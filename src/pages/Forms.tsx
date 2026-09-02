import { useState } from 'react';
import { Download, FileText, Search } from 'lucide-react';
import { asset } from '@/lib/utils';
import { formCatalog } from '@/Layout';

// Отдельный хаб всех типовых форм (замечание 7 УРсП).
// Источник — единый каталог форм из Layout (тот же, что в поиске).

const GROUPS: { id: string; label: string }[] = [
  { id: '#work', label: 'Работа с коммуникациями' },
  { id: '#dopusk', label: 'Допуск в коллектор' },
  { id: '#commercial', label: 'Коммерческие услуги' },
  { id: '#other', label: 'Прочие' },
  // Блок «Типовые формы договоров и контрактов» убран по замечанию 27.08 —
  // договоры остались в разделе «Типовые формы договоров» на /consumers#contracts.
];

function groupOf(path: string): string {
  const hash = path.includes('#') ? '#' + path.split('#')[1] : '';
  return GROUPS.find((g) => g.id === hash)?.label ?? 'Прочие формы';
}

const forms = formCatalog.filter((f) => f.file);

export default function Forms() {
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered = q
    ? forms.filter(
        (f) => f.title.toLowerCase().includes(q) || (f.keywords || '').toLowerCase().includes(q)
      )
    : forms;

  // группируем по разделу, сохраняя порядок GROUPS
  const grouped = [...GROUPS.map((g) => g.label), 'Прочие формы']
    .map((label) => ({ label, items: filtered.filter((f) => groupOf(f.path) === label) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Формы документов</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Все типовые формы заявок, актов и договоров АО «Москоллектор» в одном месте
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Поиск */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию или номеру формы…"
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 bg-white"
          />
        </div>

        {grouped.length === 0 && (
          <p className="text-center text-slate-400 py-12">Ничего не найдено</p>
        )}

        <div className="space-y-10">
          {grouped.map((group) => (
            <section key={group.label}>
              <h2 className="font-heading text-xl font-bold text-[#0a1628] mb-4">{group.label}</h2>
              <div className="card-modern rounded-2xl overflow-hidden">
                {group.items.map((f, i) => (
                  <a
                    key={f.title}
                    href={asset(f.file!.replace(/^\//, ''))}
                    download
                    className={`flex items-center justify-between gap-4 p-4 ${i !== group.items.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-sky-50/50 transition-colors`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4.5 h-4.5 text-sky-600" />
                      </div>
                      <span className="text-sm font-medium text-[#0a1628] truncate">{f.title}</span>
                    </div>
                    <Download className="w-4 h-4 text-sky-600 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
