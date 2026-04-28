import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Building2, Zap, Droplets, Cable,
  User, FileText, ShoppingCart, Shield,
  Newspaper, ChevronRight, Calculator, RefreshCw, IdCard,
  ExternalLink, ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const announcements = [
  {
    id: 1,
    title: 'Тарифы на техническую эксплуатацию коллекторов на 2026 год',
    content: 'АО «Москоллектор» информирует об утверждении тарифов на услуги по технической эксплуатации коммуникационных коллекторов на 2026 год.',
    link: '/consumers',
  },
  {
    id: 2,
    title: 'Внесены изменения в Технические условия для ОВК',
    content: 'Внесены изменения в п. 3 Технических условий, предъявляемых к проекту прокладки оптико-волоконного кабеля в коллекторах.',
    link: '/consumer-news',
  },
  {
    id: 3,
    title: 'Изменение в составе документации для согласования проектов на демонтаж',
    content: 'АО «Москоллектор» информирует об изменении состава обязательных приложений к форме 25 о выдаче согласования проекта.',
    link: '/consumer-news',
  },
];

const quickAccessLinks = [
  { icon: User, title: 'Личный кабинет', description: 'Вход в систему допуска', href: 'https://dopusk.moscollector.ru/', external: true },
  { icon: Calculator, title: 'Тарифный калькулятор', description: 'Расчёт стоимости услуг', href: '/calculator' },
  { icon: RefreshCw, title: 'Статус обращения', description: 'Проверка статуса заявки', href: '/status' },
  { icon: IdCard, title: 'Допуск в коллектор', description: 'Оформление допуска', href: '/consumers#dopusk' },
  { icon: FileText, title: 'Формы документов', description: 'Типовые формы договоров', href: '/consumers#contracts' },
  { icon: ShoppingCart, title: 'Закупки', description: 'Торги и аукционы', href: '/procurement' },
  { icon: Shield, title: 'Противодействие коррупции', description: 'Антикоррупционная политика', href: '/anticorruption' },
  { icon: Newspaper, title: 'Архив публикаций', description: 'Новости и статьи', href: '/press' },
];

const stats = [
  { icon: Building2, value: '825', unit: 'км', label: 'коллекторных тоннелей' },
  { icon: Cable, value: '19 737', unit: 'км', label: 'кабелей связи' },
  { icon: Zap, value: '8 312', unit: 'км', label: 'силовых кабелей' },
  { icon: Droplets, value: '1 914', unit: 'км', label: 'теплосетей и водоснабжения' },
  { icon: User, value: '1 404', unit: '', label: 'специалистов' },
];

const news = [
  { id: 1, date: '14 апреля 2026', title: 'В ходе весенней уборки промоют более 133 км дренажных систем коллекторов', excerpt: 'В рамках весеннего комплекса работ специалисты АО «Москоллектор» проведут промывку более 133 км дренажных систем.', link: '/press', category: 'Производство' },
  { id: 2, date: '20 марта 2026', title: 'В прошлом году обновлено 39 км коммуникационных коллекторов', excerpt: 'По итогам 2025 года АО «Москоллектор» провело реконструкцию и капитальный ремонт 39 км коллекторов.', link: '/press', category: 'Производство' },
  { id: 3, date: '22 декабря 2025', title: '«Мой папа — богатырь»: вышел уникальный ролик о работе АО «Москоллектор»', excerpt: 'В День энергетика АО «Москоллектор» представляет необычный ролик о своей деятельности.', link: '/press', category: 'Пресс-центр' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden -mt-[112px] pt-[112px]">
        <div className="absolute inset-0">
          <video
            src="/videos/hero.mp4?v=c483d65c"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#060e1a]/95 via-[#0b1f3a]/85 to-[#0a2f56]/70" />
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle at 15% 20%, rgba(56, 189, 248, 0.15) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(14, 165, 233, 0.10) 0%, transparent 50%)'
          }} />
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.5) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-28 w-full">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.07] border border-white/[0.12] text-sky-300 text-[13px] font-medium mb-8 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-400" />
              </span>
              Эксплуатация коммуникационных коллекторов Москвы
            </motion.div>

            <motion.h1 variants={fadeIn} className="font-heading text-5xl md:text-6xl lg:text-[68px] font-bold text-white leading-[1.08] tracking-tight mb-8">
              825 километров надёжности{' '}
              <span className="text-gradient">под Москвой</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-lg text-white/60 mb-10 max-w-xl leading-relaxed">
              С 1988 года обслуживаем подземную инфраструктуру столицы — силовые кабели,
              кабели связи, теплосети и водопровод во всех округах города.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-wrap gap-3">
              <Link to="/consumers">
                <Button size="lg" className="bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold px-7 h-12 text-[15px] rounded-xl group cursor-pointer shadow-[0_8px_24px_-6px_rgba(14,165,233,0.5),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_12px_32px_-6px_rgba(14,165,233,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transition-all duration-300">
                  Наши услуги
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-white/20 text-white bg-white/[0.06] hover:bg-white/[0.14] backdrop-blur-md px-7 h-12 text-[15px] rounded-xl font-semibold cursor-pointer transition-all duration-300">
                  О компании
                </Button>
              </Link>
            </motion.div>

            {/* Announcement */}
            <motion.div variants={fadeIn} className="mt-14 glass-card rounded-2xl p-5 max-w-lg">
              <div className="flex items-center gap-2 text-sky-300/80 text-[13px] font-medium mb-2.5">
                <Newspaper className="w-3.5 h-3.5" />
                Важные объявления
              </div>
              <h3 className="text-white text-[15px] font-semibold mb-1.5 line-clamp-1">
                {announcements[currentSlide].title}
              </h3>
              <p className="text-white/50 text-sm line-clamp-2 mb-3">
                {announcements[currentSlide].content}
              </p>
              <div className="flex items-center justify-between">
                <Link to={announcements[currentSlide].link} className="text-sky-400 text-sm font-medium hover:text-sky-300 inline-flex items-center gap-1 transition-colors">
                  Подробнее <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <div className="flex gap-1.5">
                  {announcements.map((_, i) => (
                    <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1 rounded-full transition-all ${i === currentSlide ? 'w-6 bg-sky-400' : 'w-3 bg-white/20'}`} />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="relative flex items-center justify-center py-8">
              {/* Outer decorative ring */}
              <div className="absolute w-[520px] h-[520px] rounded-full border border-gray-200/60" />
              <div className="absolute w-[470px] h-[470px] rounded-full border border-sky-100/80" />
              {/* Soft glow */}
              <div className="absolute w-[440px] h-[440px] rounded-full bg-sky-500/[0.05] blur-3xl" />
              {/* Main circular image */}
              <div className="relative w-[420px] h-[420px] lg:w-[470px] lg:h-[470px] rounded-full overflow-hidden shadow-[0_30px_60px_-15px_rgba(10,22,40,0.25),0_0_0_1px_rgba(14,165,233,0.08)]">
                <img src="/images/collector-hero.jpg" alt="Коллектор" className="w-full h-full object-cover" />
                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
              </div>
              {/* Decorative short line under circle */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full" style={{ background: 'linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%)', boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)' }} />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeIn} className="font-heading text-3xl lg:text-[42px] font-bold text-[#0a1628] mb-6 leading-tight">
                Специализированная организация{' '}
                <span className="text-sky-600">Комплекса городского хозяйства Москвы</span>
              </motion.h2>
              <motion.div variants={fadeIn} className="accent-bar mb-6" />
              <motion.p variants={fadeIn} className="text-gray-500 text-[16px] leading-relaxed mb-5">
                АО «Москоллектор» — крупнейшая в мире организация по протяжённости
                обслуживаемых коммуникационных коллекторов. Предприятие подведомственно
                Департаменту ЖКХ города Москвы и отвечает за содержание 825 км подземных
                железобетонных тоннелей, в которых размещены силовые и слаботочные кабели,
                трубопроводы теплоснабжения и водоснабжения.
              </motion.p>
              <motion.p variants={fadeIn} className="text-gray-400 leading-relaxed mb-8">
                Территория Москвы разделена на пять районов эксплуатации коллекторов (РЭК).
                Специалисты компании выполняют техническое обслуживание и ремонт тоннелей,
                организуют допуск, осуществляют технический надзор за строительными работами
                и выдают технические условия на размещение коммуникаций.
              </motion.p>
              <motion.div variants={fadeIn}>
                <Link to="/about">
                  <Button className="bg-[#0a1628] hover:bg-[#142138] text-white font-semibold px-6 h-11 rounded-xl group cursor-pointer shadow-[0_4px_14px_-2px_rgba(10,22,40,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_8px_22px_-4px_rgba(10,22,40,0.35)] hover:-translate-y-0.5 transition-all duration-300">
                    Подробнее о компании
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== QUICK ACCESS ===== */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.div variants={fadeIn} className="accent-bar mx-auto mb-6" />
            <motion.p variants={fadeIn} className="text-sky-600 text-[13px] font-semibold tracking-widest uppercase mb-3">Быстрый доступ</motion.p>
            <motion.h2 variants={fadeIn} className="font-heading text-3xl lg:text-4xl font-bold text-[#0a1628]">
              Все необходимые сервисы
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickAccessLinks.map((link) => {
              const CardContent = (
                <div className="group relative h-full card-modern p-6 rounded-2xl overflow-hidden">
                  {/* Decorative gradient corner */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-sky-100/0 to-sky-200/0 group-hover:from-sky-100/40 group-hover:to-sky-200/20 rounded-full blur-2xl transition-all duration-500" />
                  <div className="relative w-11 h-11 rounded-xl icon-tile mb-4 group-hover:scale-105 transition-transform duration-300">
                    <link.icon className="w-5 h-5 text-sky-600" />
                  </div>
                  <h3 className="relative font-heading text-[15px] font-semibold text-[#0a1628] mb-1 group-hover:text-sky-700 transition-colors">
                    {link.title}
                  </h3>
                  <p className="relative text-gray-400 text-sm mb-3">{link.description}</p>
                  <div className="relative flex items-center text-sky-600 text-sm font-medium">
                    Перейти
                    {link.external
                      ? <ExternalLink className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                      : <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    }
                  </div>
                </div>
              );

              return (
                <motion.div key={link.title} variants={fadeIn}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="block h-full">{CardContent}</a>
                  ) : (
                    <Link to={link.href} className="block h-full">{CardContent}</Link>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.5) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeIn} className="text-center group">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mx-auto mb-3 group-hover:bg-white/[0.1] group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                  <stat.icon className="w-5 h-5 text-sky-400" />
                </div>
                <div className="font-heading text-3xl font-bold text-white mb-0.5 tracking-tight">
                  {stat.value}{stat.unit && <span className="text-sky-400 text-xl ml-1">{stat.unit}</span>}
                </div>
                <p className="text-white/40 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== NEWS ===== */}
      <section className="py-24 gradient-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-14">
            <motion.div variants={fadeIn} className="accent-bar mb-6" />
            <motion.p variants={fadeIn} className="text-sky-400/70 text-[13px] font-semibold tracking-widest uppercase mb-3">Пресс-центр</motion.p>
            <motion.h2 variants={fadeIn} className="font-heading text-3xl lg:text-4xl font-bold text-white">
              Новости и события
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {news.map((item) => (
              <motion.article key={item.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="group">
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden hover:bg-white/[0.08] hover:border-sky-400/20 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm h-full">
                  <div className="p-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-500/10 text-sky-300 text-[12px] font-medium rounded-md mb-4 border border-sky-400/10">
                      <span className="w-1 h-1 rounded-full bg-sky-400" />
                      {item.category}
                    </span>
                    <p className="text-white/30 text-sm mb-2">{item.date}</p>
                    <h3 className="font-heading text-[17px] font-semibold text-white mb-2.5 line-clamp-2 group-hover:text-sky-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/40 text-sm line-clamp-3 mb-4">{item.excerpt}</p>
                    <Link to={item.link} className="inline-flex items-center text-sky-400 font-medium text-sm hover:text-sky-300 transition-colors">
                      Читать далее <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mt-10 text-center">
            <Link to="/press">
              <Button className="bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold px-7 h-11 rounded-xl cursor-pointer shadow-[0_8px_24px_-6px_rgba(14,165,233,0.5),inset_0_1px_0_rgba(255,255,255,0.18)] hover:-translate-y-0.5 transition-all duration-300">
                Все новости
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="relative flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl p-10 border border-sky-100/60 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #f8fafc 60%, #ffffff 100%)' }}>
            {/* Decorative gradient blobs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-sky-100/40 blur-3xl pointer-events-none" />
            <motion.div variants={fadeIn} className="relative">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#0a1628] mb-2">Нужна консультация?</h2>
              <p className="text-gray-500">Наши специалисты готовы ответить на все ваши вопросы</p>
            </motion.div>
            <motion.div variants={fadeIn} className="relative">
              <Link to="/contacts">
                <Button size="lg" className="bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold px-7 h-12 rounded-xl text-[15px] group cursor-pointer shadow-[0_8px_24px_-6px_rgba(14,165,233,0.5),inset_0_1px_0_rgba(255,255,255,0.18)] hover:-translate-y-0.5 transition-all duration-300">
                  Связаться с нами
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
