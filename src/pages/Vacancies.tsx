import { Briefcase, CheckCircle2, Phone, Mail, Calendar, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const vacancies = [
  { title: 'Разработчик платформы Docsvision (C#/.Net)', department: 'ИТ-отдел', salary: 'до 350 000 ₽' },
  { title: 'Специалист по воинскому учету и бронированию 1 категории', department: 'Административный отдел', salary: '121 239 ₽' },
  { title: 'Специалист по охране труда 1 категории', department: 'Охрана труда', salary: '113 661 ₽' },
  { title: 'Водитель автомобиля 1 класса 4 разряда', department: 'Транспортный отдел', salary: '112 580 ₽' },
  { title: 'Специалист 1 категории Отдела учета коммуникаций', department: 'Отдел учета коммуникаций', salary: '110 858 ₽' },
  { title: 'Электрогазосварщик 5 разряда', department: 'Эксплуатационный отдел', salary: '107 191 ₽' },
  { title: 'Автоэлектрик 5 разряда', department: 'Транспортный отдел', salary: '107 191 ₽' },
  { title: 'Водитель автомобиля 2 класса 4 разряда', department: 'Транспортный отдел', salary: '104 818 ₽' },
  { title: 'Электромонтер по ремонту и обслуживанию электрооборудования 4-5 разряда', department: 'Эксплуатационный отдел', salary: '101 302 – 117 910 ₽' },
  { title: 'Слесарь-ремонтник 4-5 разряда', department: 'Эксплуатационный отдел', salary: '98 233 – 105 825 ₽' },
  { title: 'Слесарь строительный по ремонту металлоконструкций 4-5 разряда', department: 'Эксплуатационный отдел', salary: '99 211 – 104 818 ₽' },
  { title: 'Электромонтер диспетчерского оборудования и телеавтоматики 4 разряда', department: 'Диспетчерская служба', salary: '99 211 ₽' },
  { title: 'Техник коммуникационного коллектора', department: 'Эксплуатационный отдел', salary: '83 596 – 99 484 ₽' },
  { title: 'Водитель автомобиля 3 класса 4 разряда', department: 'Транспортный отдел', salary: '96 838 ₽' },
  { title: 'Слесарь-сантехник 4 разряда АХО', department: 'АХО', salary: '94 466 ₽' },
  { title: 'Изолировщик 4-5 разряда', department: 'Эксплуатационный отдел', salary: '92 093 – 114 740 ₽' },
  { title: 'Электрогазосварщик 4 разряда', department: 'Эксплуатационный отдел', salary: '92 093 – 99 211 ₽' },
  { title: 'Камнетес/гранитчик 4 разряда', department: 'Эксплуатационный отдел', salary: '92 092 – 99 211 ₽' },
  { title: 'Уборщик офисных помещений', department: 'АХО', salary: '61 683 ₽' },
  { title: 'Уборщик территории 2 разряда АХО', department: 'АХО', salary: '56 075 ₽' },
];

const benefits = [
  'Официальное трудоустройство по ТК РФ',
  'Конкурентная заработная плата',
  'Полный социальный пакет',
  'Путевки на лечение для работников Общества',
  'Оплата питания',
  'Корпоративный транспорт',
  'Обучение и развитие',
  'Карьерный рост',
];

const conditions = [
  'Официальное трудоустройство по ТК РФ',
  'Пятидневная рабочая неделя: пн-чт с 08:00 до 17:00, пт с 08:00 до 15:45',
  'Стабильная официальная заработная плата (оклад+ежемесячная премия до 50% от оклада)',
  'Ежегодная индексация заработной платы',
  'Надбавки и компенсационные выплаты',
  'Оплата ночных и сверхурочных часов, выходных и праздничных дней',
  'Оплата больничных листов',
  'Годовая премия (до 1 оклада) и премия за стаж работы в АО «Москоллектор» (от 0,6 до 1,5 окладов)',
  'Материальная помощь к отпуску (1 раз в год)',
  'Материальная помощь по Коллективному договору (ко Дню энергетика, за вступление в брак, рождение ребенка и т.п.)',
  'Льготные путевки в детский оздоровительный лагерь',
  'Частичная компенсация санаторно-курортного лечения',
  'Соблюдение норм охраны труда и промышленной безопасности',
  'Обеспечение спецодеждой',
  'Возможность профессионального и карьерного роста',
  'Профессиональное обучение и развитие',
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
            { value: '21', label: 'Открытые вакансии' },
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
                      <th className="py-3 pr-4 font-heading font-bold text-[#0a1628] hidden sm:table-cell">Подразделение</th>
                      <th className="py-3 font-heading font-bold text-[#0a1628] text-right whitespace-nowrap">Зарплата (руб.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vacancies.map((vacancy, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-sky-50/50 transition-colors">
                        <td className="py-3.5 pr-4 text-slate-700 font-medium">{vacancy.title}</td>
                        <td className="py-3.5 pr-4 text-slate-500 hidden sm:table-cell">{vacancy.department}</td>
                        <td className="py-3.5 text-sky-600 font-semibold text-right whitespace-nowrap">{vacancy.salary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Для отклика на вакансию свяжитесь с отделом кадров по телефону или электронной почте.
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
