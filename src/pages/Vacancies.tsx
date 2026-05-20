import { Briefcase, CheckCircle2, Phone, Mail, Calendar, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { vacancies } from '@/lib/content';

// #15 ОК — список вакансий обновляется через CMS (/admin/), хранится в content/vacancies.yml

// #15 — содержимое преимуществ/условий очищено от hh-копии и сведено
// к нейтральным формулировкам. По всем вопросам — обращайтесь в helpdesk.
const benefits = [
  'Официальное трудоустройство по ТК РФ',
  'Социальный пакет согласно Коллективному договору',
  'Соблюдение норм охраны труда',
  'Возможности профессионального и карьерного роста',
];

const conditions = [
  'Официальное трудоустройство по ТК РФ',
  'Пятидневная рабочая неделя: пн-чт с 08:00 до 17:00, пт с 08:00 до 15:45',
  'Соблюдение норм охраны труда и промышленной безопасности',
  'Обеспечение спецодеждой',
  'Подробные условия по конкретной вакансии — у специалистов отдела кадров (помощь в обращении: personal@moscollector.ru)',
];

export default function Vacancies() {
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
          {/* Left Column - Vacancies */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl font-heading font-bold text-[#0a1628] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-sky-600" />
                </div>
                Открытые вакансии
              </h2>
            </div>

            <div className="card-modern rounded-2xl p-7">
              <div className="accent-bar mb-5" />
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 pr-4 font-heading font-bold text-[#0a1628]">Должность</th>
                      <th className="py-3 font-heading font-bold text-[#0a1628] hidden sm:table-cell">Подразделение</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vacancies.map((vacancy, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-sky-50/50 transition-colors">
                        <td className="py-3.5 pr-4 text-slate-700 font-medium">{vacancy.title}</td>
                        <td className="py-3.5 text-slate-500 hidden sm:table-cell">{vacancy.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Для отклика на вакансию и уточнения условий оплаты свяжитесь с отделом кадров по телефону или электронной почте.
                </p>
              </div>
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
                Отправьте нам свое резюме, и мы рассмотрим его на предмет наличия подходящих позиций.
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

        {/* Условия и социальные гарантии */}
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
              {conditions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
