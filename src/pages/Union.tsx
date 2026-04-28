import { Users, Shield, Award, Briefcase, Calendar, Phone, Mail, MapPin, Trophy, HeartHandshake } from 'lucide-react';

const activities = [
  {
    icon: Shield,
    title: 'Охрана труда',
    description: 'Отстаивание интересов работников в вопросах охраны труда, промышленной и экологической безопасности, соблюдение требований Коллективного договора.',
  },
  {
    icon: HeartHandshake,
    title: 'Социальное партнёрство',
    description: 'Участие в социальном партнёрстве между Работодателем и работниками, ведение переговоров по Коллективному договору, закрепление социальных льгот, гарантий и компенсаций.',
  },
  {
    icon: Calendar,
    title: 'Экскурсии и поездки',
    description: 'Организация экскурсионных поездок для членов профсоюза, в том числе с авиа- и железнодорожным переездом.',
  },
  {
    icon: Users,
    title: 'Детские мероприятия',
    description: 'Ежегодный конкурс детских рисунков, новогодняя ёлка, мероприятия ко Дню защиты детей.',
  },
  {
    icon: Award,
    title: 'Спорт и культура',
    description: 'Спортивные мероприятия, посещение членами профсоюза культурно-массовых мероприятий.',
  },
  {
    icon: Briefcase,
    title: 'Материальная помощь',
    description: 'Реализация положений Коллективного договора о материальной помощи работникам по различным жизненным ситуациям.',
  },
];

const achievements = [
  { year: '2018', title: '2 место в конкурсе «Лучший Коллективный договор»', description: 'среди предприятий Комплекса городского хозяйства города Москвы.' },
  { year: '2019', title: 'Благодарность Мэра Москвы', description: 'объявлена первичной профсоюзной организации АО «Москоллектор».' },
];

export default function Union() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Профком</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Первичная профсоюзная организация АО «Москоллектор»
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
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">О профсоюзной организации</h2>
              </div>
              <div className="card-modern p-8 space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  Профсоюзная организация АО «Москоллектор» была образована одновременно с предприятием в 1988 году.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Сейчас численность профсоюза достигла более 1000 человек, что составляет более 70% от общего числа
                  работающих. Члены профсоюза объединены в 12 профгрупп. Первичная профсоюзная организация АО «Москоллектор»
                  входит в состав общественной организации «Профсоюз муниципальных работников Москвы».
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Профсоюзная организация АО «Москоллектор» — полноправный участник социального партнёрства между
                  Работодателем и работниками, основным документом, регулирующим социально-трудовые отношения,
                  является действующий Коллективный договор. В нём закреплены социальные льготы, гарантии и
                  компенсации, предоставляемые работникам, включая материальную помощь по различным жизненным ситуациям.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Необходимое внимание в Коллективном договоре уделено вопросам охраны труда. Профсоюзный комитет
                  вносит вклад в усиление мотивации персонала на добросовестный и высокоэффективный труд в целях
                  выполнения АО «Москоллектор» основной профильной задачи по надёжному обеспечению жизнедеятельности
                  города Москвы.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="accent-bar" />
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">Направления деятельности</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {activities.map((activity) => (
                  <div key={activity.title} className="card-modern p-6">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center mb-4">
                      <activity.icon className="w-6 h-6 text-sky-600" />
                    </div>
                    <h3 className="font-bold font-heading text-[#0a1628] mb-2">{activity.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{activity.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="accent-bar" />
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">Достижения</h2>
              </div>
              <div className="card-modern p-8">
                <p className="text-slate-600 leading-relaxed mb-6">
                  Коллективный договор АО «Москоллектор» признан одним из лучших в отрасли.
                </p>
                <div className="space-y-4">
                  {achievements.map((a) => (
                    <div key={a.year} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-6 h-6 text-sky-600" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-sky-600 mb-1">{a.year}</div>
                        <h3 className="font-bold font-heading text-[#0a1628] mb-1">{a.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{a.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="gradient-dark rounded-2xl p-6 text-white">
              <Users className="w-8 h-8 mb-4 text-sky-400" />
              <h3 className="font-bold font-heading text-lg mb-2">Профсоюз в цифрах</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-2xl font-bold font-heading text-sky-400">1988</div>
                  <div className="text-white/70">год основания</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-heading text-sky-400">1000+</div>
                  <div className="text-white/70">членов профсоюза</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-heading text-sky-400">70%</div>
                  <div className="text-white/70">работников предприятия</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-heading text-sky-400">12</div>
                  <div className="text-white/70">профгрупп</div>
                </div>
              </div>
            </div>

            <div className="card-modern p-6">
              <h3 className="font-bold font-heading text-[#0a1628] mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-sky-600" />
                Контакты профкома
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <a href="tel:+74992222201" className="text-sky-600 hover:underline">+7 (499) 222-22-01</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a href="mailto:info@moscollector.ru" className="text-sky-600 hover:underline">info@moscollector.ru</a>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <span className="text-slate-600">129090, г. Москва, 1-й Коптельский пер., д. 16, стр. 4</span>
                </div>
              </div>
            </div>

            <div className="card-modern p-6">
              <Shield className="w-8 h-8 mb-3 text-sky-600" />
              <h3 className="font-bold font-heading text-[#0a1628] mb-2">Коллективный договор</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Основной документ, регулирующий социально-трудовые отношения между работниками и Работодателем.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
