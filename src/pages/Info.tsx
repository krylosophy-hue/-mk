import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight, FileText, AlertTriangle,
  Scale, Settings, Download, ExternalLink, Menu, X,
  AlertOctagon, Info as InfoIcon
} from 'lucide-react';

const FILE_BASE_URL = `${import.meta.env.BASE_URL}docs/`;

// Map URL paths to section IDs
const pathToSection: Record<string, string> = {
  '/anticorruption': 'anticorruption',
  '/antiterror': 'antiterror',
  '/revocation': 'revocation',
  '/tech-info': 'tech',
};

// Hero meta per single-section page (#1 ОЭБ — Антикоррупционная информация в отд. раздел)
const sectionPageMeta: Record<string, { title: string; subtitle: string; breadcrumb: string }> = {
  anticorruption: {
    title: 'Противодействие коррупции',
    subtitle: 'Антикоррупционная политика, нормативные документы и сведения, размещённые в соответствии с приказом от 7 октября 2013 г. № 530н',
    breadcrumb: 'Противодействие коррупции',
  },
  antiterror: {
    title: 'Противодействие терроризму',
    subtitle: 'Меры по обеспечению антитеррористической защищённости объектов АО «Москоллектор»',
    breadcrumb: 'Противодействие терроризму',
  },
  revocation: {
    title: 'Отзыв доверенностей',
    subtitle: 'Информация об отзыве выданных АО «Москоллектор» доверенностей',
    breadcrumb: 'Отзыв доверенностей',
  },
  tech: {
    title: 'Техническая информация',
    subtitle: 'Нормативная и техническая документация АО «Москоллектор»',
    breadcrumb: 'Техническая информация',
  },
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// Accordion component
function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const ref = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const willOpen = !isOpen;
    if (willOpen && ref.current) {
      setIsOpen(true);
      setTimeout(() => {
        if (ref.current) {
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 250);
    } else {
      setIsOpen(willOpen);
    }
  };

  return (
    <div ref={ref} className="border border-slate-200 rounded-2xl overflow-hidden mb-4 bg-white scroll-mt-24">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left"
      >
        <span className="font-semibold text-[#0a1628] text-lg">{title}</span>
        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-5 bg-slate-50/50 border-t border-slate-200">
          {children}
        </div>
      )}
    </div>
  );
}

// Sidebar navigation items
const sidebarItems = [
  { id: 'general', label: 'Общая информация', icon: InfoIcon },
  { id: 'anticorruption', label: 'Противодействие коррупции', icon: Scale },
  { id: 'antiterror', label: 'Противодействие терроризму', icon: AlertOctagon },
  { id: 'revocation', label: 'Отзыв доверенностей', icon: FileText },
  { id: 'tech', label: 'Техническая информация', icon: Settings },
];

export default function Info() {
  const [activeSection, setActiveSection] = useState('general');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const location = useLocation();

  // #1 ОЭБ — When path is /anticorruption (or other dedicated sections), render only that section.
  const singleSectionId = pathToSection[location.pathname] || null;
  const singleMeta = singleSectionId ? sectionPageMeta[singleSectionId] : null;

  // Auto-scroll to section based on URL path
  useEffect(() => {
    const sectionId = pathToSection[location.pathname];
    if (sectionId) {
      // Small delay to ensure refs are populated after render
      const timer = setTimeout(() => {
        const element = sectionRefs.current[sectionId];
        if (element) {
          const offset = 120;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
          setActiveSection(sectionId);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const item of sidebarItems) {
        const element = sectionRefs.current[item.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-sky-600 transition-colors">Главная</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0a1628] font-medium">{singleMeta ? singleMeta.breadcrumb : 'Информация'}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 text-white">
              {singleMeta ? singleMeta.title : 'Информация'}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-white/80 max-w-3xl leading-relaxed">
              {singleMeta ? singleMeta.subtitle : 'Нормативные документы, положения и сведения о деятельности АО «Москоллектор»'}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar - Desktop (hidden on single-section pages per #1) */}
          {!singleSectionId && <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-[#0a1628] text-white font-heading font-semibold">
                Разделы
              </div>
              <nav className="p-3">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-sky-50 text-[#0a1628] font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${activeSection === item.id ? 'text-sky-500' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>}

          {/* Mobile menu button (hidden on single-section pages) */}
          {!singleSectionId && <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm"
            >
              <span className="font-heading font-medium text-[#0a1628]">Навигация по разделам</span>
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-500" /> : <Menu className="w-5 h-5 text-slate-500" />}
            </button>

            {mobileMenuOpen && (
              <div className="mt-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 text-left border-b border-slate-100 last:border-0 transition-colors ${
                      activeSection === item.id ? 'bg-sky-50 text-[#0a1628] font-medium' : 'text-slate-600'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${activeSection === item.id ? 'text-sky-500' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>}

          {/* Content */}
          <div className="flex-1">
            {/* Section 1: General Info */}
            {(!singleSectionId || singleSectionId === 'general') && <section
              ref={el => { sectionRefs.current['general'] = el; }}
              id="general"
              className="mb-14 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center">
                  <InfoIcon className="w-6 h-6 text-sky-600" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-[#0a1628]">Общая информация</h2>
              </div>

              <div className="card-modern rounded-2xl p-7 mb-6">
                <div className="accent-bar mb-5" />
                <h3 className="text-lg font-heading font-bold text-[#0a1628] mb-4">О предприятии</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  АО «Москоллектор» — специализированная организация, осуществляющая эксплуатацию
                  коммуникационных коллекторов города Москвы. Предприятие подведомственно Департаменту
                  жилищно-коммунального хозяйства города Москвы.
                </p>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  В эксплуатационной ответственности АО «Москоллектор» находится 825 километров
                  подземных железобетонных тоннелей, в которых размещены силовые и слаботочные
                  кабели, трубопроводы теплоснабжения и водоснабжения.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Полное наименование</p>
                    <p className="font-medium text-[#0a1628]">Акционерное общество «Москоллектор»</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Сокращенное наименование</p>
                    <p className="font-medium text-[#0a1628]">АО «Москоллектор»</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">ИНН / КПП</p>
                    <p className="font-medium text-[#0a1628]">7708389595 / 770801001</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">ОГРН</p>
                    <p className="font-medium text-[#0a1628]">1207700380909</p>
                  </div>
                </div>
              </div>

              <Accordion title="Реквизиты организации">
                <div className="space-y-3 text-slate-600">
                  <p><span className="font-medium text-[#0a1628]">Юридический адрес:</span> 129090, г. Москва, 1-й Коптельский пер., д. 16, стр. 4</p>
                  <p><span className="font-medium text-[#0a1628]">Почтовый адрес:</span> 129090, г. Москва, 1-й Коптельский пер., д. 16, стр. 4</p>
                  <p><span className="font-medium text-[#0a1628]">Телефон:</span> +7 (499) 222-22-01</p>
                  <p><span className="font-medium text-[#0a1628]">E-mail:</span> info@moscollector.ru</p>
                  <p><span className="font-medium text-[#0a1628]">Расчетный счет:</span> 40702810800000004512 в ПАО СБЕРБАНК РОССИИ</p>
                  <p><span className="font-medium text-[#0a1628]">БИК:</span> 044525225</p>
                </div>
              </Accordion>

              <Accordion title="Руководство">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200">
                    <div className="w-12 h-12 rounded-2xl bg-[#0a1628] flex items-center justify-center text-white font-heading font-bold">
                      ГД
                    </div>
                    <div>
                      <p className="font-semibold text-[#0a1628]">Генеральный директор</p>
                      <p className="text-slate-600">Должность руководителя организации</p>
                    </div>
                  </div>
                </div>
              </Accordion>
            </section>}

            {/* Section 2: Anti-corruption */}
            {(!singleSectionId || singleSectionId === 'anticorruption') && <section
              ref={el => { sectionRefs.current['anticorruption'] = el; }}
              id="anticorruption"
              className="mb-14 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-sky-600" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-[#0a1628]">Противодействие коррупции</h2>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-800 mb-2">Сообщите о коррупции</p>
                    <p className="text-yellow-700 text-sm mb-3 leading-relaxed">
                      Если вы стали свидетелем коррупционного правонарушения, сообщите об этом
                      по телефону горячей линии или через форму обращения.
                    </p>
                    <p className="text-yellow-800 font-medium">Телефон: +7 (499) 222-22-01</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Accordion title="Нормативные правовые акты">
                  <div className="space-y-3">
                    <a href={`${FILE_BASE_URL}anticorruption/fz-172-antikorr-ekspertiza.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0a1628]">Федеральный закон от 17.07.2009 № 172-ФЗ «Об антикоррупционной экспертизе НПА»</p>
                        <p className="text-sm text-slate-500 mt-0.5">PDF</p>
                      </div>
                    </a>
                    <a href={`${FILE_BASE_URL}anticorruption/pp-rf-96-antikorr-ekspertiza.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0a1628]">Постановление Правительства РФ от 26.02.2010 № 96 «Об антикоррупционной экспертизе НПА»</p>
                        <p className="text-sm text-slate-500 mt-0.5">PDF</p>
                      </div>
                    </a>
                  </div>
                </Accordion>

                <Accordion title="Локальные нормативные акты">
                  <div className="space-y-3">
                    <a href={`${FILE_BASE_URL}anticorruption/prikaz-249-antikorr-politika.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0a1628]">Приказ № 249 от 15.07.22 — Об утверждении антикоррупционной политики АО «Москоллектор»</p>
                        <p className="text-sm text-slate-500 mt-0.5">PDF</p>
                      </div>
                    </a>
                    <a href={`${FILE_BASE_URL}anticorruption/plan-pk-ao-2022-2024.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0a1628]">План мероприятий по противодействию коррупции АО на 2022–2024 годы</p>
                        <p className="text-sm text-slate-500 mt-0.5">PDF</p>
                      </div>
                    </a>
                    <a href={`${FILE_BASE_URL}anticorruption/prikaz-264-kodeks-etiki.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0a1628]">Приказ № 264 от 27.07.22 — Кодекс корпоративной этики и поведения работников АО «Москоллектор»</p>
                        <p className="text-sm text-slate-500 mt-0.5">PDF</p>
                      </div>
                    </a>
                  </div>
                </Accordion>

                <Accordion title="Сведения о доходах">
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    Сведения о доходах, об имуществе и обязательствах имущественного характера
                    руководства и членов семей руководства АО «Москоллектор».
                  </p>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-400 text-white rounded-xl cursor-default">
                    <ExternalLink className="w-4 h-4" />
                    Сведения о доходах (раздел в разработке)
                  </span>
                </Accordion>

                <Accordion title="Контакты для сообщений о коррупции">
                  <div className="space-y-3 text-slate-600">
                    <p><span className="font-medium text-[#0a1628]">Телефон горячей линии:</span> +7 (499) 222-22-01</p>
                    <p><span className="font-medium text-[#0a1628]">E-mail:</span> anticorruption@moscollector.ru</p>
                    <p><span className="font-medium text-[#0a1628]">Адрес для письменных обращений:</span> 129090, г. Москва, 1-й Коптельский пер., д. 16, стр. 4</p>
                  </div>
                </Accordion>
              </div>
            </section>}

            {/* Section 3: Anti-terror */}
            {(!singleSectionId || singleSectionId === 'antiterror') && <section
              ref={el => { sectionRefs.current['antiterror'] = el; }}
              id="antiterror"
              className="mb-14 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center">
                  <AlertOctagon className="w-6 h-6 text-sky-600" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-[#0a1628]">Противодействие терроризму</h2>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800 mb-2">Экстренные службы</p>
                    <p className="text-red-700 text-sm leading-relaxed">
                      При обнаружении подозрительных предметов или лиц немедленно сообщите
                      по телефону <span className="font-bold">112</span> или в полицию <span className="font-bold">102</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Accordion title="Нормативные документы">
                  <div className="space-y-3">
                    <a href={`${FILE_BASE_URL}antiterror/antiterror-doc-1.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0a1628]">Федеральный закон № 35-ФЗ «О противодействии терроризму»</p>
                        <p className="text-sm text-slate-500 mt-0.5">PDF</p>
                      </div>
                    </a>
                    <a href={`${FILE_BASE_URL}antiterror/antiterror-doc-2.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0a1628]">Федеральный закон № 256-ФЗ «О безопасности объектов ТЭК»</p>
                        <p className="text-sm text-slate-500 mt-0.5">PDF</p>
                      </div>
                    </a>
                    <a href={`${FILE_BASE_URL}antiterror/antiterror-doc-3.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0a1628]">Постановление Правительства РФ № 458 «Об утверждении Правил по обеспечению безопасности объектов ТЭК»</p>
                        <p className="text-sm text-slate-500 mt-0.5">PDF</p>
                      </div>
                    </a>
                  </div>
                </Accordion>

                <Accordion title="Антитеррористическая защищенность">
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    АО «Москоллектор» осуществляет комплекс мер по обеспечению антитеррористической
                    защищенности объектов инфраструктуры транспортной системы.
                  </p>
                  <div className="space-y-3">
                    <a href={`${FILE_BASE_URL}antiterror/antiterror-doc-4.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0a1628]">Антитеррористическая защищенность — документ 4</p>
                        <p className="text-sm text-slate-500 mt-0.5">PDF</p>
                      </div>
                    </a>
                    <a href={`${FILE_BASE_URL}antiterror/antiterror-doc-5.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0a1628]">Антитеррористическая защищенность — документ 5</p>
                        <p className="text-sm text-slate-500 mt-0.5">PDF</p>
                      </div>
                    </a>
                  </div>
                </Accordion>

                <Accordion title="Памятка по антитеррористической безопасности">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-white rounded-xl border border-slate-200">
                      <p className="font-semibold text-[#0a1628] mb-2">Подозрительные предметы</p>
                      <p className="text-sm text-slate-600 leading-relaxed">Не трогайте, не передвигайте, не открывайте подозрительные предметы. Немедленно сообщите охране.</p>
                    </div>
                    <div className="p-5 bg-white rounded-xl border border-slate-200">
                      <p className="font-semibold text-[#0a1628] mb-2">Подозрительные лица</p>
                      <p className="text-sm text-slate-600 leading-relaxed">Обращайте внимание на людей с объемными предметами под одеждой, нервное поведение.</p>
                    </div>
                    <div className="p-5 bg-white rounded-xl border border-slate-200">
                      <p className="font-semibold text-[#0a1628] mb-2">Экстренные вызовы</p>
                      <p className="text-sm text-slate-600 leading-relaxed">Полиция: 102, Единый номер экстренных служб: 112</p>
                    </div>
                    <div className="p-5 bg-white rounded-xl border border-slate-200">
                      <p className="font-semibold text-[#0a1628] mb-2">Эвакуация</p>
                      <p className="text-sm text-slate-600 leading-relaxed">При объявлении эвакуации следуйте указаниям персонала, не пользуйтесь лифтом.</p>
                    </div>
                  </div>
                </Accordion>
              </div>
            </section>}

            {/* Section 4: Revocation */}
            {(!singleSectionId || singleSectionId === 'revocation') && <section
              ref={el => { sectionRefs.current['revocation'] = el; }}
              id="revocation"
              className="mb-14 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-sky-600" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-[#0a1628]">Отзыв доверенностей</h2>
              </div>

              <div className="card-modern rounded-2xl p-7 mb-6">
                <div className="accent-bar mb-5" />
                <p className="text-slate-600 mb-6 leading-relaxed">
                  В соответствии с требованиями Федерального закона от 06.12.2021 № 406-ФЗ
                  «О порядке учета доверенностей, выданных юридическими лицами» АО «Москоллектор»
                  публикует сведения об отозванных доверенностях.
                </p>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#0a1628] text-white">
                        <th className="text-left px-5 py-3.5 font-semibold">№ доверенности</th>
                        <th className="text-left px-5 py-3.5 font-semibold">Дата выдачи</th>
                        <th className="text-left px-5 py-3.5 font-semibold">Дата отзыва</th>
                        <th className="text-left px-5 py-3.5 font-semibold">Кому выдана</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5 text-slate-600">№ 45 от 15.01.2024</td>
                        <td className="px-5 py-3.5 text-slate-600">15.01.2024</td>
                        <td className="px-5 py-3.5 text-slate-600">20.03.2024</td>
                        <td className="px-5 py-3.5 text-slate-600">Иванов И.И.</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5 text-slate-600">№ 67 от 10.02.2024</td>
                        <td className="px-5 py-3.5 text-slate-600">10.02.2024</td>
                        <td className="px-5 py-3.5 text-slate-600">15.03.2024</td>
                        <td className="px-5 py-3.5 text-slate-600">Петров П.П.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Accordion title="Порядок публикации сведений об отозванных доверенностях">
                <p className="text-slate-600 mb-4 leading-relaxed">
                  Сведения об отозванных доверенностях публикуются в течение 3 рабочих дней
                  со дня принятия решения об отзыве доверенности.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Для получения дополнительной информации обращайтесь в юридический отдел
                  по телефону +7 (499) 222-22-01 (доб. 5100).
                </p>
              </Accordion>
            </section>}

            {/* Section 5: Tech Info */}
            {(!singleSectionId || singleSectionId === 'tech') && <section
              ref={el => { sectionRefs.current['tech'] = el; }}
              id="tech"
              className="mb-14 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-sky-600" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-[#0a1628]">Техническая информация</h2>
              </div>

              <div className="space-y-4">
                <Accordion title="Технические условия на подключение к коллекторам">
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    Технические условия выдаются на основании заявки владельца коммуникаций
                    и содержат требования к прокладке, эксплуатации и техническому обслуживанию
                    инженерных коммуникаций в коллекторах.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a href={`${FILE_BASE_URL}tech-info/TU_vok.pdf`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0a1628] text-white rounded-xl hover:bg-[#0a1628]/90 transition-colors">
                      <Download className="w-4 h-4" />
                      ТУ для ВОК
                    </a>
                    <a href={`${FILE_BASE_URL}tech-info/TU_skl.pdf`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors">
                      <Download className="w-4 h-4" />
                      ТУ для силовых кабелей
                    </a>
                    <a href={`${FILE_BASE_URL}tech-info/TU_ks.pdf`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors">
                      <Download className="w-4 h-4" />
                      ТУ для кабелей связи
                    </a>
                    <a href={`${FILE_BASE_URL}tech-info/TU_tr.pdf`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors">
                      <Download className="w-4 h-4" />
                      ТУ для трубопроводов
                    </a>
                  </div>
                </Accordion>

                <Accordion title="Перечень коллекторов АО «Москоллектор»">
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    С 25.01.2021 приняты новые наименования коллекторов. Полный перечень
                    обслуживаемых коллекторов с указанием протяженности и расположения.
                  </p>
                  <a href={`${FILE_BASE_URL}tech-info/collectors_new_names.pdf`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0a1628] text-white rounded-xl hover:bg-[#0a1628]/90 transition-colors">
                    <Download className="w-4 h-4" />
                    Скачать перечень коллекторов
                  </a>
                </Accordion>

                <Accordion title="Требования к проектной документации">
                  <div className="space-y-3 text-slate-600">
                    <p>Проектная документация должна включать:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Пояснительную записку</li>
                      <li>Ситуационный план с трассой кабельной линии</li>
                      <li>Продольный профиль трассы</li>
                      <li>Схему размещения кабеля в коллекторе</li>
                      <li>Спецификацию оборудования и материалов</li>
                    </ul>
                  </div>
                </Accordion>

                <Accordion title="Нормативная документация">
                  <div className="space-y-3">
                    <a href={`${FILE_BASE_URL}tech-info/Part1.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0a1628]">Нормативная документация — Часть 1</p>
                        <p className="text-sm text-slate-500 mt-0.5">PDF</p>
                      </div>
                    </a>
                    <a href={`${FILE_BASE_URL}tech-info/Part2.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0a1628]">Нормативная документация — Часть 2</p>
                        <p className="text-sm text-slate-500 mt-0.5">PDF</p>
                      </div>
                    </a>
                    <a href={`${FILE_BASE_URL}tech-info/peredacha_kollektorov.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0a1628]">Передача коллекторов</p>
                        <p className="text-sm text-slate-500 mt-0.5">PDF</p>
                      </div>
                    </a>
                  </div>
                </Accordion>
              </div>
            </section>}
          </div>
        </div>
      </div>
    </div>
  );
}
