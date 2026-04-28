import { Heart, Users, GraduationCap, Gift, Phone, Shield, Briefcase, Coins, Baby, HandCoins, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const materialHelp = [
  'вступление в первый брак',
  'рождение ребёнка (на каждого из детей)',
  'выход на пенсию по возрасту и расторжение трудового договора',
  'смерть близкого родственника работника',
  'смерть работника — родственникам',
  'в год поступления ребёнка в школу',
  'ко Дню Энергетика',
  'к ежегодному оплачиваемому отпуску',
];

const monthlyHelp = [
  'единственному родителю',
  'многодетным семьям',
  'семьям, воспитывающим детей-инвалидов',
  'опекунам',
  'матерям, имеющим детей в возрасте от 1,5 до 3 лет',
];

const additionalLeave = [
  'матерям и опекунам, воспитывающим детей-школьников в возрасте до 12 лет, в День знаний (1 сентября)',
  'за ненормированный рабочий день',
];

const vouchers = [
  'санаторно-курортное лечение работникам Общества',
  'детские оздоровительные лагеря для детей работников до 13 лет (включительно)',
];

const otherBenefits = [
  { icon: Gift, title: 'Новогодние подарки', description: 'Подарки и билеты на театрализованное представление для детей работников в возрасте до 12 лет (включительно).' },
  { icon: Heart, title: 'Культурно-массовые мероприятия', description: 'Приобретение билетов на культурные и иные мероприятия для работников Общества.' },
  { icon: Coins, title: 'Негосударственное пенсионное обеспечение', description: 'Программа корпоративного пенсионного обеспечения работников.' },
  { icon: Shield, title: 'Медицинские осмотры', description: 'Проведение предварительных и периодических медицинских осмотров.' },
  { icon: Briefcase, title: 'Страхование от несчастных случаев', description: 'Страхование всех работников Общества от несчастных случаев.' },
  { icon: FileText, title: 'Награды и премии', description: 'Представление и награждение работников государственными, ведомственными, отраслевыми наградами и наградами города Москвы с денежными вознаграждениями.' },
  { icon: HandCoins, title: 'Индексация заработной платы', description: 'Регулярная индексация заработной платы работников.' },
  { icon: GraduationCap, title: 'Компенсация проезда', description: 'Компенсация стоимости проезда в городском пассажирском транспорте отдельным категориям работников.' },
  { icon: Shield, title: 'СИЗ и спецодежда', description: 'Выдача специальной одежды, специальной обуви и других средств индивидуальной защиты.' },
  { icon: Baby, title: 'Молоко на вредных работах', description: 'Выдача молока работникам, занятым на работах с вредными условиями труда.' },
];

export default function Social() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Социальная политика</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Социальный пакет сотрудников АО «Москоллектор»
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="accent-bar" />
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">Основа социальной политики</h2>
              </div>
              <div className="card-modern p-8">
                <p className="text-slate-600 leading-relaxed mb-4">
                  Основополагающим документом, формирующим социальную политику Общества и определяющим социальное
                  партнёрство в формате «Работодатель — Работники», является Коллективный договор АО «Москоллектор».
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Социальная политика направлена на усиление мотивации персонала на высокоэффективный и добросовестный
                  труд в целях надёжного и бесперебойного жизнеобеспечения столицы, на создание необходимых условий труда,
                  закрепление наиболее квалифицированного персонала и поощрение сотрудников к повышению квалификации.
                  Система мер материального и морального стимулирования реализуется по следующим направлениям.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="accent-bar" />
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">Материальная помощь</h2>
              </div>
              <div className="card-modern p-8">
                <p className="text-slate-600 leading-relaxed mb-5">
                  Единовременная материальная помощь работникам Общества оказывается в следующих случаях:
                </p>
                <ul className="space-y-2">
                  {materialHelp.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="accent-bar" />
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">Ежемесячная материальная помощь</h2>
              </div>
              <div className="card-modern p-8">
                <p className="text-slate-600 leading-relaxed mb-5">
                  Ежемесячная материальная помощь выплачивается следующим категориям работников:
                </p>
                <ul className="space-y-2">
                  {monthlyHelp.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="accent-bar" />
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">Дополнительные оплачиваемые отпуска</h2>
              </div>
              <div className="card-modern p-8">
                <ul className="space-y-2">
                  {additionalLeave.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="accent-bar" />
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">Льготные путёвки</h2>
              </div>
              <div className="card-modern p-8">
                <ul className="space-y-2">
                  {vouchers.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="accent-bar" />
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">Другие социальные гарантии</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {otherBenefits.map((b) => (
                  <div key={b.title} className="card-modern p-6">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center mb-4">
                      <b.icon className="w-6 h-6 text-sky-600" />
                    </div>
                    <h3 className="font-bold font-heading text-[#0a1628] mb-2">{b.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{b.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="gradient-dark rounded-2xl p-6 text-white">
              <Users className="w-8 h-8 mb-4 text-sky-400" />
              <h3 className="font-bold font-heading text-lg mb-2">Профком</h3>
              <p className="text-white/80 text-sm mb-4">
                Первичная профсоюзная организация АО «Москоллектор» — полноправный участник
                социального партнёрства. Более 1000 членов, 12 профгрупп.
              </p>
              <Link to="/union" className="text-sm font-medium text-sky-400 hover:text-white transition-colors">
                Подробнее о профкоме →
              </Link>
            </div>

            <div className="card-modern p-6">
              <h3 className="font-bold font-heading text-[#0a1628] mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-sky-600" />
                Контакты
              </h3>
              <div className="space-y-3 text-sm">
                <p className="text-slate-600">
                  <span className="font-medium text-[#0a1628]">Отдел кадров:</span><br />
                  <a href="tel:+74992222206" className="text-sky-600 hover:underline">+7 (499) 222-22-06</a>
                </p>
                <p className="text-slate-600">
                  <span className="font-medium text-[#0a1628]">Профком:</span><br />
                  <a href="tel:+74992222209" className="text-sky-600 hover:underline">+7 (499) 222-22-09</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
