import { Briefcase, CheckCircle2, Phone, Mail, Calendar, ShieldCheck, MapPin, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { vacancies, vacancyConditions } from '@/lib/content';
import type { Vacancy } from '@/lib/content';

// Список вакансий и условия — редактируются через CMS (/admin/), содержатся
// в content/vacancies.yml. Источник: «Информация по вакансиям 15.05.2026.xlsx»

// Короткие подсказки в правом блоке "Мы предлагаем"
const benefits = [
  'Официальное трудоустройство по ТК РФ',
  'Конкурентная заработная плата + ежемесячная премия',
  'Полный социальный пакет',
  'Льготные путёвки и материальная помощь',
  'Профессиональный и карьерный рост',
];

// Группировка вакансий по подразделениям с сохранением исходного порядка
function groupByDepartment(items: Vacancy[]): { department: string; address: string; rows: Vacancy[] }[] {
  const result: { department: string; address: string; rows: Vacancy[] }[] = [];
  for (const v of items) {
    const last = result[result.length - 1];
    if (last && last.department === v.department) {
      last.rows.push(v);
    } else {
      result.push({
        department: v.department,
        address: v.address || '',
        rows: [v],
      });
    }
  }
  return result;
}

export default function Vacancies() {
  const groups = groupByDepartment(vacancies);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Вакансии</h1>
          <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
            Присоединяйтесь к команде АО «Москоллектор». Мы предлагаем стабильную работу и возможности для профессионального роста.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-6 mb-14">
          {[
            { value: String(vacancies.length), label: 'Открытые вакансии' },
            { value: '1450+', label: 'Сотрудников' },
            { value: '37+', label: 'Лет на рынке' },
            { value: '1988', label: 'Год основания' },
          ].map((stat) => (
            <div key={stat.label} className="card-modern p-6 text-center rounded-2xl">
              <div className="text-3xl font-heading font-bold text-[#0a1628] mb-1">{stat.value}</div>
              <div className="accent-bar mx-auto my-2" />
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left Column - Vacancies grouped by РЭК */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl font-heading font-bold text-[#0a1628] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-sky-600" />
                </div>
                Открытые вакансии
              </h2>
            </div>

            <div className="space-y-8">
              {groups.map((group) => (
                <div key={group.department} className="card-modern rounded-2xl p-6 lg:p-7">
                  {/* Department header */}
                  <div className="mb-5">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Building2 className="w-4.5 h-4.5 text-sky-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-heading font-bold text-[#0a1628] text-base lg:text-lg leading-tight">
                          {group.department}
                        </h3>
                        {group.address && (
                          <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            {group.address}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="accent-bar mt-4" />
                  </div>

                  {/* Vacancies table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                          <th className="py-2.5 pr-4 font-semibold">Должность</th>
                          <th className="py-2.5 pl-4 font-semibold text-right whitespace-nowrap">Оклад, руб.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.rows.map((vac, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-slate-100 last:border-0 hover:bg-sky-50/50 transition-colors"
                          >
                            <td className="py-3 pr-4 text-slate-700 font-medium">{vac.title}</td>
                            <td className="py-3 pl-4 text-right font-semibold text-sky-700 whitespace-nowrap">
                              {vac.salary || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            <div className="card-modern rounded-2xl p-6 mt-6">
              <p className="text-sm text-slate-500">
                Для отклика на вакансию свяжитесь с отделом кадров по телефону или e-mail. Уточняйте актуальные сведения о вакансии и условиях.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="card-modern rounded-2xl p-7">
              <h3 className="font-heading font-bold text-[#0a1628] mb-5 text-lg">Мы предлагаем</h3>
              <div className="accent-bar mb-5" />
              <ul className="space-y-3.5">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="gradient-dark rounded-2xl p-7 text-white">
              <h3 className="font-heading font-bold mb-5 text-lg">Отдел кадров</h3>
              <div className="accent-bar mb-5" />
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-sky-400" />
                  </div>
                  <span>(499) 222-22-01, доб. 13-21 или доб. 13-22</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-sky-400" />
                  </div>
                  <a href="mailto:personal@Moscollector.ru" className="hover:text-sky-400 transition-colors">personal@Moscollector.ru</a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-sky-400" />
                  </div>
                  <span>Пн-Пт: 9:00 - 18:00</span>
                </div>
              </div>
            </div>

            <div className="card-modern rounded-2xl p-7">
              <h3 className="font-heading font-bold text-[#0a1628] mb-3 text-lg">Не нашли подходящую вакансию?</h3>
              <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                Отправьте нам своё резюме, и мы рассмотрим его на предмет наличия подходящих позиций.
              </p>
              <a href="mailto:personal@Moscollector.ru" className="block w-full">
                <Button variant="outline" className="w-full border-[#0a1628] text-[#0a1628] hover:bg-[#0a1628] hover:text-white rounded-xl transition-colors gap-2">
                  <Mail className="w-4 h-4" />
                  Отправить резюме
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Условия и социальные гарантии (из CMS) */}
        {vacancyConditions.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-heading font-bold text-[#0a1628] mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-sky-600" />
              </div>
              Условия и социальные гарантии
            </h2>
            <div className="card-modern rounded-2xl p-7">
              <div className="accent-bar mb-5" />
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3.5">
                {vacancyConditions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
