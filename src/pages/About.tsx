import { useEffect, useRef, useState } from 'react';
import { TrendingUp, Users, Zap, Droplets, Target, Award, Building2, Calendar, Phone, Mail, MapPin, FileText } from 'lucide-react';

const stats = [
  { icon: Building2, value: 825, suffix: ' км', label: 'Протяженность коллекторов', description: 'Общая длина эксплуатируемых коллекторов' },
  { icon: Zap, value: 19737, suffix: ' км', label: 'Кабели связи', description: 'Протяженность кабельных линий связи' },
  { icon: Droplets, value: 8312, suffix: ' км', label: 'Силовые кабели', description: 'Протяженность силовых кабельных линий' },
  { icon: TrendingUp, value: 1914, suffix: ' км', label: 'Теплосети и ВК', description: 'Протяженность теплосетей и водопроводов' },
  { icon: Users, value: 1404, suffix: '', label: 'Сотрудников', description: 'Средняя численность работников' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="accent-bar mb-6" />
          <h1 className="font-heading">О компании</h1>
          <p>
            АО «Москоллектор» — организация, отвечающая за эксплуатацию коммуникационных коллекторов города Москвы
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-14">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-sky-600" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">
                  Общая информация
                </h2>
              </div>
              <div className="card-modern rounded-2xl p-8">
                <p className="text-gray-500 leading-relaxed">
                  Акционерное общество «Москоллектор» (АО «Москоллектор») — это организация, специализирующаяся
                  на эксплуатации коммуникационных коллекторов города Москвы. Компания обеспечивает надлежащие
                  условия для эксплуатации находящихся в коллекторах инженерных коммуникаций.
                </p>
                <p className="text-gray-500 leading-relaxed mt-4">
                  В эксплуатационной ответственности АО «Москоллектор» находятся коллекторы значительной
                  протяженности, в которых проложены силовые кабели, оптоволоконные кабели и кабели связи,
                  трубопроводы теплосети и водопровода.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center">
                  <Target className="w-5 h-5 text-sky-600" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">
                  Направления деятельности
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { icon: Building2, title: 'Безопасная эксплуатация', desc: 'Обеспечение безопасной, безаварийной и эффективной эксплуатации объектов коллекторного хозяйства' },
                  { icon: Award, title: 'Приемка объектов', desc: 'Приемка объектов инженерного и коммунального назначения на техническое обслуживание, обеспечение их надлежащего содержания' },
                  { icon: Building2, title: 'Технологическое развитие', desc: 'Технологическое развитие объектов коллекторного хозяйства и техническое перевооружение систем инженерного обеспечения коллекторов' },
                  { icon: Users, title: 'Физическая защищенность', desc: 'Усиление физической защищенности объектов и информационной безопасности коллекторного хозяйства' },
                  { icon: FileText, title: 'Выдача ТУ и согласований', desc: 'Выдача технических условий, согласований проектной документации и ППР на прокладку/врезку/демонтаж коммуникаций — в том числе в рамках Государственных программ города Москвы, строительства метрополитена и дорожно-мостовых объектов, ликвидации, переустройства и сохранности участков коллекторов' },
                  { icon: Award, title: 'Коммерческие услуги', desc: 'Подготовка проектно-сметной документации, СМР по прокладке/демонтажу кабельных линий, консультационные услуги по проектированию, копирование исполнительной и проектной документации, продление ТУ и согласований, выдача дубликатов и отчётов о протяженностях коммуникаций' },
                ].map((item) => (
                  <div key={item.title} className="card-modern rounded-2xl p-6">
                    <div className="w-11 h-11 rounded-2xl bg-sky-50 flex items-center justify-center mb-4">
                      <item.icon className="w-5 h-5 text-sky-600" />
                    </div>
                    <h3 className="font-semibold font-heading text-[#0a1628] mb-1.5">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-sky-600" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">
                  История компании
                </h2>
              </div>
              <div className="card-modern rounded-2xl p-8">
                <div className="space-y-0">
                  {[
                    { year: '1988', text: 'Образование предприятия «Москоллектор»' },
                    { year: '2005', text: 'Расширение сети обслуживаемых коллекторов' },
                    { year: '2012', text: 'Внедрение автоматизированной системы учета' },
                    { year: '2018', text: 'Модернизация инфраструктуры' },
                    { year: '2024', text: 'Цифровизация процессов и запуск личного кабинета' },
                  ].map((item, index, arr) => (
                    <div key={item.year} className="flex gap-5 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-sky-50 border-2 border-sky-400 flex items-center justify-center flex-shrink-0 z-10">
                          <span className="text-xs font-bold text-sky-600">{item.year.slice(2)}</span>
                        </div>
                        {index !== arr.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gray-100" />
                        )}
                      </div>
                      <div className={`flex-1 ${index !== arr.length - 1 ? 'pb-6' : ''}`}>
                        <span className="text-sm font-bold text-sky-600">{item.year}</span>
                        <p className="text-gray-500 mt-0.5">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            <div className="card-modern rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-2xl bg-sky-50 flex items-center justify-center">
                  <TrendingUp className="w-4.5 h-4.5 text-sky-600" />
                </div>
                <h3 className="font-bold font-heading text-[#0a1628]">Ключевые показатели</h3>
              </div>
              <div className="space-y-5">
                {stats.map((stat) => (
                  <div key={stat.label} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <stat.icon className="w-4 h-4 text-sky-600" />
                      </div>
                      <div className="text-2xl font-bold font-heading text-sky-600">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </div>
                    </div>
                    <div className="text-sm font-medium text-[#0a1628] ml-11">{stat.label}</div>
                    <div className="text-xs text-gray-400 ml-11">{stat.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="gradient-dark rounded-2xl p-7 text-white">
              <div className="accent-bar mb-4" />
              <h3 className="font-bold font-heading text-lg mb-5">Реквизиты</h3>
              <div className="space-y-3 text-sm">
                <p><span className="text-white/50 text-xs uppercase tracking-wider">Полное наименование</span><br /><span className="text-white/90">Акционерное общество «Москоллектор»</span></p>
                <p><span className="text-white/50 text-xs uppercase tracking-wider">Сокращенное</span><br /><span className="text-white/90">АО «Москоллектор»</span></p>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <p><span className="text-white/50 text-xs uppercase tracking-wider">ИНН</span><br /><span className="text-white/90">7708389595</span></p>
                  <p><span className="text-white/50 text-xs uppercase tracking-wider">КПП</span><br /><span className="text-white/90">770801001</span></p>
                </div>
                <p><span className="text-white/50 text-xs uppercase tracking-wider">ОГРН</span><br /><span className="text-white/90">1207700380909</span></p>
              </div>
            </div>

            <div className="card-modern rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-2xl bg-sky-50 flex items-center justify-center">
                  <Phone className="w-4.5 h-4.5 text-sky-600" />
                </div>
                <h3 className="font-bold font-heading text-[#0a1628]">Контакты</h3>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-sky-400" />
                  </div>
                  <span className="text-gray-500">129090, г. Москва, 1-й Коптельский пер., д. 16, стр. 4</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-sky-400" />
                  </div>
                  <a href="tel:+74992222201" className="text-sky-600 hover:text-sky-500 transition-colors">+7 (499) 222-22-01</a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-sky-400" />
                  </div>
                  <a href="mailto:info@moscollector.ru" className="text-sky-600 hover:text-sky-500 transition-colors">info@moscollector.ru</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
