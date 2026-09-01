import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight, FileText, AlertTriangle,
  Scale, Settings, Download, Menu, X,
  AlertOctagon, Info as InfoIcon, Mail
} from 'lucide-react';
import { fileUrl } from '@/lib/utils';

const FILE_BASE_URL = `${import.meta.env.BASE_URL}docs/`;

// ─── Раздел «Противодействие коррупции» ────────────────────────────────
// Структура и перечень документов воспроизведены 1:1 со старого сайта
// (oldwww.moscollector.ru/противодействие-коррупции/).
// present:false — оригинальный файл со старого сайта ещё не передан
// (поддомен oldwww отключён, файлов нет ни на moscollector.ru, ни в архиве).
// Такие документы показываются как «готовится к публикации»; чтобы
// опубликовать — положить файл по указанному пути и выставить present:true.
type AcDoc = { title: string; file: string; ext: string; present: boolean };

const ANTICORRUPTION_GROUPS: { heading: string; docs: AcDoc[] }[] = [
  {
    heading: 'Действующие федеральные законы, указы Президента Российской Федерации, постановления Правительства Российской Федерации',
    docs: [
      { title: 'Федеральный закон от 25 декабря 2008 г. № 273-ФЗ «О противодействии коррупции»', file: 'anticorruption/fz-273-o-protivodeystvii-korrupcii.docx', ext: 'DOCX', present: true },
      { title: 'Федеральный закон от 26 декабря 1995 г. № 208-ФЗ «Об акционерных обществах»', file: 'anticorruption/fz-208-ob-akcionernyh-obschestvah.docx', ext: 'DOCX', present: true },
      { title: 'Федеральный закон от 17 июля 2009 г. № 172-ФЗ «Об антикоррупционной экспертизе нормативных правовых актов и проектов нормативных актов»', file: 'anticorruption/fz-172-antikorr-ekspertiza.pdf', ext: 'PDF', present: true },
      { title: 'Указ Президента Российской Федерации от 19 мая 2008 г. № 815 «О мерах по противодействию коррупции»', file: 'anticorruption/ukaz-prezidenta-815.docx', ext: 'DOCX', present: true },
      { title: 'Указ Президента Российской Федерации от 16 августа 2021 г. № 478 «О Национальном плане противодействия коррупции на 2021 — 2024 годы»', file: 'anticorruption/ukaz-prezidenta-478.docx', ext: 'DOCX', present: true },
      { title: 'Постановление Правительства Российской Федерации от 26 февраля 2010 г. № 96 «Об антикоррупционной экспертизе нормативных правовых актов и проектов нормативных правовых актов» (вместе с «Правилами проведения антикоррупционной экспертизы нормативных правовых актов и проектов нормативных правовых актов», «Методикой проведения антикоррупционной экспертизы нормативных правовых актов и проектов нормативных правовых актов»)', file: 'anticorruption/pp-rf-96-antikorr-ekspertiza.pdf', ext: 'PDF', present: true },
      { title: 'Постановление Правительства Российской Федерации от 21 января 2015 г. № 29 «Об утверждении Правил сообщения работодателем о заключении трудового или гражданско-правового договора на выполнение работ (оказание услуг) с гражданином, замещавшим должности государственной или муниципальной службы»', file: 'anticorruption/pp-rf-29-ot-21-01-2015.docx', ext: 'DOCX', present: true },
    ],
  },
  {
    heading: 'Законы города Москвы, Указы Мэра Москвы',
    docs: [
      { title: 'Закон города Москвы от 17 декабря 2014 г. № 64 «О мерах по противодействию коррупции в городе Москве»', file: 'anticorruption/zakon-moskvy-64.docx', ext: 'DOCX', present: false },
      { title: 'Указ Мэра Москвы от 12 декабря 2008 г. № 101-УМ «О создании Совета при Мэре Москвы по противодействию коррупции» (вместе с «Положением о Совете при Мэре Москвы по противодействию коррупции»)', file: 'anticorruption/ukaz-mera-moskvy-101-um.docx', ext: 'DOCX', present: false },
    ],
  },
  {
    heading: 'Ведомственные нормативные акты',
    docs: [
      { title: 'Приказ АО «Москоллектор» от 15 июля 2022 г. № 249 «Об утверждении антикоррупционной политики Акционерного общества «Москоллектор»', file: 'anticorruption/prikaz-249-antikorr-politika.pdf', ext: 'PDF', present: true },
      { title: 'Приказ АО «Москоллектор» от 27 июля 2022 г. № 264 «Об утверждении Кодекса корпоративной этики и поведения работников АО «Москоллектор»', file: 'anticorruption/prikaz-264-kodeks-etiki.pdf', ext: 'PDF', present: true },
      { title: 'План мероприятий по противодействию коррупции в Акционерном обществе «Москоллектор» на 2022—2024 годы, утверждённый 01.12.2021', file: 'anticorruption/plan-pk-ao-2022-2024.pdf', ext: 'PDF', present: true },
    ],
  },
  {
    heading: 'Формы документов, связанные с противодействие коррупции, для заполнения',
    docs: [
      { title: 'Уведомление о факте обращения в целях склонения работника к совершению коррупционных правонарушений', file: 'anticorruption/uvedomlenie-o-sklonenii.docx', ext: 'DOCX', present: false },
      { title: 'Уведомление о факте совершения коррупционных правонарушений другими работниками АО «Москоллектор», контрагентами или иными лицами', file: 'anticorruption/uvedomlenie-o-sovershenii.docx', ext: 'DOCX', present: false },
      { title: 'Уведомление о возникновении (возможности возникновения) личной заинтересованности, которая приводит или может привести к конфликту интересов работника АО «Москоллектор»', file: 'anticorruption/uvedomlenie-o-lichnoy-zainteresovannosti.docx', ext: 'DOCX', present: false },
    ],
  },];

const ANTICORRUPTION_AUDIT: AcDoc[] = [
  { title: 'Результаты обязательного аудита за 2020 год', file: 'anticorruption/audit-2020.pdf', ext: 'PDF', present: false },
  { title: 'Результаты обязательного аудита за 2021 год', file: 'anticorruption/audit-2021.pdf', ext: 'PDF', present: false },
  { title: 'Результаты обязательного аудита за 2022 год', file: 'anticorruption/audit-2022.docx', ext: 'DOCX', present: false },
  { title: 'Результаты обязательного аудита за 2023 год', file: 'anticorruption/audit-2023.docx', ext: 'DOCX', present: false },
  { title: 'Результаты обязательного аудита за 2024 год', file: 'anticorruption/audit-2024.pdf', ext: 'PDF', present: false },
];

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
    subtitle: 'Нормативные правовые акты, ведомственные документы и результаты обязательного аудита АО «Москоллектор»',
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

// Карточка документа раздела «Противодействие коррупции».
// Есть файл → активная ссылка на скачивание; нет файла → «готовится к публикации».
function AntiCorruptionDoc({ doc }: { doc: AcDoc }) {
  if (doc.present) {
    return (
      <a
        href={fileUrl(FILE_BASE_URL, doc.file)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-sky-200 transition-all"
      >
        <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
          <Download className="w-5 h-5 text-sky-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[#0a1628] leading-snug">{doc.title}</p>
          <p className="text-sm text-slate-500 mt-1">{doc.ext}</p>
        </div>
      </a>
    );
  }
  return (
    <div
      className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300"
      title="Документ готовится к публикации"
    >
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
        <FileText className="w-5 h-5 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-500 leading-snug">{doc.title}</p>
        <p className="text-xs text-slate-400 mt-1">{doc.ext} · готовится к публикации</p>
      </div>
    </div>
  );
}

// Sidebar navigation items (без 'anticorruption' — это отдельный раздел в главном меню, #1 ОЭБ)
const sidebarItems = [
  { id: 'general', label: 'Общая информация', icon: InfoIcon },
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
                  В эксплуатационной ответственности АО «Москоллектор» находится 826 километров
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

              {/* Аккордеон «Руководство» убран (14.08) — вернуть после согласования состава с пресс-службой. */}
            </section>}

            {/* Section 2: Anti-corruption — only on dedicated /anticorruption page (#1 ОЭБ) */}
            {singleSectionId === 'anticorruption' && <section
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

              {/* Структура и перечень документов — 1:1 со старого сайта */}
              <h3 className="text-xl font-heading font-bold text-[#0a1628] mb-6">
                Нормативные правовые и иные акты в сфере противодействия коррупции
              </h3>

              <div className="space-y-8">
                {ANTICORRUPTION_GROUPS.map((group) => (
                  <div key={group.heading}>
                    <h4 className="font-semibold text-[#0a1628] mb-3 leading-snug">{group.heading}</h4>
                    <div className="space-y-3">
                      {group.docs.map((doc) => (
                        <AntiCorruptionDoc key={doc.file} doc={doc} />
                      ))}
                    </div>
                  </div>
                ))}

                {/* Результаты обязательного аудита */}
                <div>
                  <h4 className="font-semibold text-[#0a1628] mb-3 leading-snug">Результаты обязательного аудита</h4>
                  <div className="space-y-3">
                    {ANTICORRUPTION_AUDIT.map((doc) => (
                      <AntiCorruptionDoc key={doc.file} doc={doc} />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                 

<Accordion title="Отчет о реализации мероприятий плана противодействия коррупции в АО «Москоллектор»" defaultOpen>
  <Accordion title="Отчёт о реализации мероприятий плана противодействия коррупции в  АО «Москоллектор» по итогам 2026 года" >
    <div className="space-y-3 text-slate-600">
              <p><strong>ОТЧЕТ</strong></p>
              <p><strong>о реализации мероприятий Плана противодействия коррупции в Акционерном обществе «Москоллектор» на 2025–2026 годы</strong></p>
              <p><strong>в первом полугодии 2026 года</strong></p>

              <p>
                Работа Акционерного общества «Москоллектор» (далее — АО «Москоллектор», Общество) по противодействию коррупции осуществляется
                в соответствии с планом мероприятий по противодействию коррупции в Акционерном обществе «Москоллектор» на 2025–2026 годы,
                утвержденным 10.03.2025 с учётом плана противодействия коррупции в Департаменте жилищно-коммунального хозяйства города Москвы
                на 2026 год, утвержденного 12.12.2025.
              </p>

              <p>Во исполнение плана мероприятий по противодействию коррупции Общества на 2025–2026 годы (далее — План) в первом полугодии 2026 года проделана следующая работа:</p>

              <ul className="list-disc pl-5 space-y-2">
                <li><strong>по пункту 1.1 Плана</strong>: запросов от комиссии по противодействию коррупции Департамента жилищно-коммунального хозяйства города Москвы (далее — ДЖКХ города Москвы) в Общество не поступало.</li>
                <li>
                  <strong>по пункту 1.2 Плана</strong>: в соответствии с планом работы комиссии по противодействию коррупции АО «Москоллектор» (далее — Комиссия)
                  проведено 2 заседания, дополнительно проведено 3 заседания Комиссии по вопросам возникновения (возможности возникновения) личной заинтересованности
                  при исполнении должностных обязанностей работниками Общества, которая приводит или может привести к конфликту интересов.
                </li>
                <li><strong>по пункту 1.3 Плана</strong>: организован контроль исполнения решений Комиссии.</li>
                <li><strong>по пункту 1.4 Плана</strong>: ведется работа по разработке плана противодействия коррупции АО «Москоллектор» на 2027 и последующие годы, направленного на минимизацию коррупционных рисков и обеспечение контроля за выполнением плановых мероприятий.</li>
                <li><strong>по пункту 1.5 Плана</strong>: работники Общества, курирующие противодействие коррупции, приняли участие во Всероссийской онлайн-конференции «Противодействие коррупции в 2026 году: новеллы и ключевые тенденции».</li>
                <li><strong>по пункту 1.6 Плана</strong>: запросов от ДЖКХ города Москвы о совместной разработке дополнительных мер по предупреждению коррупции в Обществе не поступало.</li>
                <li>
                  <strong>по пунктам 1.7, 1.8, 1.9, 2.4 Плана</strong>: Комиссия проводила свою работу в тесном взаимодействии с профсоюзной организацией, структурными подразделениями Общества.
                  На заседаниях Комиссии рассматривались вопросы предупреждения коррупционных правонарушений и конфликта интересов, в том числе обеспечения рационального использования материальных ресурсов Общества.
                </li>
              </ul>

              <p>Уведомлений о фактах коррупции, склонению к коррупционным правонарушениям от работников АО «Москоллектор», граждан и организаций не поступало.</p>

              <p>
                Руководством Общества проводились встречи с коллективами структурных подразделений, на которых наряду с производственными проблемами затрагивались вопросы
                социально-трудовых отношений, соблюдения трудовой дисциплины и предупреждения коррупционных правонарушений;
              </p>

              <p>
                <strong>по пункту 1.10 Плана</strong>: поддерживалось взаимодействие по вопросам противодействия коррупции и профилактики правонарушений с курирующими подразделениями ФСО России и Управления ФСБ России по г. Москве и Московской области.
                Осуществлялся контроль за исполнением запросов правоохранительных и контролирующих органов, касающихся деятельности подрядных организаций, выполняющих работы по ремонту и эксплуатации коллекторного хозяйства и других объектов Общества;
              </p>

              <p>
                <strong>по пунктам 2.1, 2.2, 2.3 Плана</strong>: исследовались и анализировались материалы, представлявшиеся партнёрами и контрагентами, включая конкурсную документацию,
                а также документы, предоставляемые кандидатами на трудоустройство, прежде всего на должности, связанные с коррупционными рисками.
                Проводился дополнительный анализ имеющихся документов и материалов на работников Общества, планируемых к назначению на руководящие должности,
                в том числе по выявлению склонности к совершению коррупционных преступлений.
              </p>

              <p>
                В плановом порядке проверялись и анализировались сведения, представленные подрядными организациями и поставщиками, имеющими договорные отношения с Обществом, в целях выявления возможной аффилированности с работниками Общества.
              </p>

              <p>Периодически проводились мероприятия, направленные на актуализацию сведений, содержащихся в личных делах работников и руководителей Общества.</p>

              <p>
                <strong>по пунктам 3.1, 3.2 Плана</strong>: закупочная деятельность осуществлялась в соответствии с действующим Положением о закупках товаров, работ, услуг для нужд АО «Москоллектор»,
                утвержденным протоколом Совета директоров АО «Москоллектор» от 18.12.2025 № 84 и от 18.05.2026 № 91, реализующим требования Федерального закона от 18.07.2011 № 223-ФЗ
                «О закупках товаров, работ, услуг отдельными видами юридических лиц» и постановления Правительства Москвы от 05.07.2013 № 441-ПП «Об утверждении Перечня дополнительных требований к Положению о закупках товаров (работ, услуг)
                государственных унитарных предприятий города Москвы и хозяйственных обществ, в уставном капитале которых доля города Москвы в совокупности превышает 50 процентов, государственных автономных и бюджетных учреждений города Москвы».
                Информация о планируемых и проводимых в первом полугодии 2026 года закупках размещалась посредством функционала Единой автоматизированной информационной системы торгов города Москвы (ЕАИСТ)
                в единой информационной системе в сфере закупок (www.zakupki.gov.ru). Закупки проводились в электронной форме на единой электронной торговой площадке «Росэлторг» (http://еtp.roseltorg.ru).
              </p>

              <p>
                Контроль законности, обоснованности и эффективности закупок осуществлялся путем согласования Департаментом города Москвы по конкурентной политике.
                Закупки свыше 3 млн рублей прошли согласование в Департаменте жилищно-коммунального хозяйства города Москвы, а закупки с начальной (максимальной) ценой контракта от 100 млн рублей дополнительно — на межведомственной рабочей группе по проверке обоснованности заявленных потребностей.
                В целях своевременного выявления возможных недобросовестных контрагентов проверялись материалы, представленные участниками конкурсных процедур;
              </p>

              <p>
                <strong>по пунктам 4.1, 4.2, 4.3 Плана</strong>: проведено обучение и оценка знаний руководителей и работников Общества основным сведениям о противодействии коррупции и урегулировании конфликта интересов.
                На регулярной основе осуществляется мониторинг средств массовой информации по антикоррупционной тематике.
                Сведения о выявленных правоохранительными органами на предприятиях и в организациях топливно-энергетического комплекса и сферы ЖКХ фактах коррупции доводятся до руководителей и работников АО «Москоллектор».
              </p>

              <p>В обязательном порядке осуществлялось ознакомление лиц, принимаемых на работу, с локальными нормативными актами Общества, в том числе с Кодексом корпоративной этики и поведения работников АО «Москоллектор».</p>

              <p>Кроме того, работники, курирующие противодействие коррупции, прошли повышение квалификации по профессиональной программе: «Противодействие коррупции в органах государственной и муниципальной власти».</p>

              <p><strong>по пунктам 5.1, 5.2 Плана</strong>: на официальном сайте Общества размещена информация о нормативных правовых актах, регламентирующих деятельность в сфере противодействия коррупции, регулярно публиковалась информация о результатах работы Общества в данном направлении.</p>

              <p>В общедоступном месте размещены информационный стенд «Противодействие коррупции» и ящик для сбора уведомлений о совершении коррупционных правонарушений и возникновении конфликта интересов.</p>

              <p>В Обществе действует коллективный договор между работодателем в лице генерального директора и профсоюзным комитетом, представляющим интересы работников. Договор является основой системы мотивации персонала на честный и высокопрофессиональный труд. Обязательства по коллективному договору выполняются в полном объеме;</p>

              <p><strong>по пункту 5.3 Плана</strong>: приглашений от организаторов научно-практических конференций и иных мероприятий по вопросам реализации государственной политики в области противодействия коррупции работникам Общества не поступало.</p>
            </div>
  </Accordion>
</Accordion>


                {/* Аккордеон «Сведения о доходах» убран (14.08) — вернуть при получении данных. */}
              </div>



              {/* Обратная связь для сообщений о фактах коррупции */}
              <div className="mt-10 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-3">
                    <p className="font-semibold text-yellow-900 text-base">Обратная связь для сообщений о фактах коррупции</p>
                    <p className="text-yellow-800 text-sm leading-relaxed">
                      Известные Вам факты коррупционных проявлений в Акционерном обществе «Москоллектор»
                      Вы можете сообщить нам круглосуточно, воспользовавшись электронной почтой:{' '}
                      <a href="mailto:ako@moscollector.ru" className="font-semibold underline hover:no-underline">ako@moscollector.ru</a>
                    </p>
                    <p className="text-yellow-800 text-sm leading-relaxed">Конфиденциальность обращения гарантируется.</p>
                    <p className="text-yellow-800 text-sm leading-relaxed">
                      Обращаем внимание на то, что статьёй 306 Уголовного кодекса Российской Федерации
                      предусмотрена уголовная ответственность за заведомо ложный донос о совершении преступления.
                    </p>
                  </div>
                </div>
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
                    <a href={fileUrl(FILE_BASE_URL, 'antiterror/antiterror-doc-1.pdf')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0a1628]">Федеральный закон № 35-ФЗ «О противодействии терроризму»</p>
                        <p className="text-sm text-slate-500 mt-0.5">PDF</p>
                      </div>
                    </a>
                    <a href={fileUrl(FILE_BASE_URL, 'antiterror/antiterror-doc-2.pdf')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0a1628]">Федеральный закон № 256-ФЗ «О безопасности объектов ТЭК»</p>
                        <p className="text-sm text-slate-500 mt-0.5">PDF</p>
                      </div>
                    </a>
                    <a href={fileUrl(FILE_BASE_URL, 'antiterror/antiterror-doc-3.pdf')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
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
                    <a href={fileUrl(FILE_BASE_URL, 'antiterror/antiterror-doc-4.pdf')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0a1628]">Антитеррористическая защищенность — документ 4</p>
                        <p className="text-sm text-slate-500 mt-0.5">PDF</p>
                      </div>
                    </a>
                    <a href={fileUrl(FILE_BASE_URL, 'antiterror/antiterror-doc-5.pdf')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
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
                  В соответствии с требованиями законодательства Российской Федерации АО «Москоллектор»
                  публикует сведения об отозванных доверенностях. Полная информация о каждом отзыве
                  содержится в&nbsp;соответствующем PDF-документе.
                </p>

                {/* #4 — Список приказов об отзыве доверенностей (со старого сайта) */}
                {/* Список 1:1 с moscollector.ru/информация-об-отзыве-доверенностей
                     Названия без фамилий — фамилии остаются только в имени файла. */}
                <div className="space-y-3">
                  {[
                    { date: '01.12.2025', label: 'Информация об отзыве доверенности от 01.12.25', file: 'revocation/2025-12-01-krylosov.pdf' },
                    { date: '13.05.2025', label: 'Информация об отзыве доверенности от 13.05.25', file: 'revocation/2025-05-13-karalskaya.pdf' },
                    { date: '12.05.2025', label: 'Информация об отзыве доверенности от 12.05.25', file: 'revocation/2025-05-12-shatirishvili.pdf' },
                    { date: '12.05.2025', label: 'Информация об отзыве доверенности от 12.05.25', file: 'revocation/2025-05-12-tatarinzev.pdf' },
                    { date: '12.05.2025', label: 'Информация об отзыве доверенности от 12.05.25', file: 'revocation/2025-05-12-taktashov.pdf' },
                    { date: '12.05.2025', label: 'Информация об отзыве доверенности от 12.05.25', file: 'revocation/2025-05-12-senchurov.pdf' },
                    { date: '12.05.2025', label: 'Информация об отзыве доверенности от 12.05.25', file: 'revocation/2025-05-12-koshcheev.pdf' },
                    { date: '12.05.2025', label: 'Информация об отзыве доверенности от 12.05.25', file: 'revocation/2025-05-12-glushchenko.pdf' },
                    { date: '12.05.2025', label: 'Информация об отзыве доверенности от 12.05.25', file: 'revocation/2025-05-12-bormotov.pdf' },
                    { date: '07.05.2025', label: 'Информация об отзыве доверенности от 07.05.25', file: 'revocation/2025-05-07-bobylev.pdf' },
                    { date: '07.05.2025', label: 'Информация об отзыве доверенности от 07.05.25', file: 'revocation/2025-05-07-bobrovskii.pdf' },
                    { date: '07.05.2025', label: 'Информация об отзыве доверенности от 07.05.25', file: 'revocation/2025-05-07-astashkin.pdf' },
                    { date: '24.12.2024', label: 'Информация об отзыве доверенности от 24.12.24', file: 'revocation/2024-12-24-obshchii.pdf' },
                    { date: '25.04.2022', label: 'Информация об отзыве доверенностей от 25.04.22', file: 'revocation/2022-04-25-obshchii.pdf' },
                    { date: '10.12.2020', label: 'Информация об отзыве доверенностей от 10.12.20', file: 'revocation/2020-12-10-obshchii.pdf' },
                    { date: '25.11.2020', label: 'Информация об отзыве доверенностей от 25.11.20', file: 'revocation/2020-11-25-obshchii.pdf' },
                    { date: '18.11.2020', label: 'Информация об отзыве доверенностей от 18.11.20', file: 'revocation/2020-11-18-obshchii.pdf' },
                  ].map((doc) => (
                    <a
                      key={doc.file}
                      href={fileUrl(FILE_BASE_URL, '${doc.file}')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-sky-300 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-100 transition-colors">
                        <Download className="w-5 h-5 text-sky-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#0a1628] truncate">{doc.label}</p>
                        <p className="text-sm text-slate-400 mt-0.5">Дата отзыва: {doc.date} · PDF</p>
                      </div>
                    </a>
                  ))}
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
                <Accordion title="Перечень переименованных коллекторов АО «Москоллектор»">
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    С 25.01.2021 приняты новые наименования коллекторов.
                  </p>
                  <a href={fileUrl(FILE_BASE_URL, 'tech-info/collectors_new_names.pdf')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Скачать перечень переименованных коллекторов
                  </a>
                </Accordion>

                <Accordion title="Требования к проектной документации">
                  <div className="space-y-3 text-slate-600">
                    <p>
                      Передаваемая на рассмотрение проектная документация должна отвечать
                      требованиям АО «Москоллектор»; состав требований зависит от вида
                      и стадии проектной документации. Порядок согласования закреплён
                      регламентом ниже.
                    </p>
                    <a href={fileUrl(FILE_BASE_URL, 'consumers/Регламент-согласования-ПСД.docx')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors mt-1">
                      <Download className="w-4 h-4" />
                      Регламент согласования проектной документации (ПД и РД)
                    </a>
                  </div>
                </Accordion>

                <Accordion title="Нормативная и регламентирующая документация">
                  <div className="space-y-2.5">
                    {[
                      ['Общие технические требования к проектированию общегородских и внутриквартальных коммуникационных коллекторов и диспетчерских пунктов при их реконструкции, модернизации и капитальном ремонте', 'tech-info/01-obshchie-tekhtrebovaniya.pdf'],
                      ['Альбом типовых решений для подземных коммуникационных коллекторов', 'tech-info/02-albom-tipovykh-reshenii.pdf'],
                      ['Методика подбора насосного оборудования в коммуникационных коллекторах', 'tech-info/03-metodika-nasosnogo-oborudovaniya.pdf'],
                      ['Регламент оформления документации и порядка производства работ по демонтажу КЛС силами потребителей', 'consumers/Регламент-демонтажа-КЛС.pdf'],
                      ['Электронная версия СП 265.1325800.2016', 'tech-info/05-sp-265.pdf'],
                      ['Изменение № 1 к СП 265.1325800.2016 «Коллекторы коммуникационные. Правила проектирования и строительства»', 'tech-info/06-izmenenie-1-sp-265.pdf'],
                      ['Перечень документации, передаваемой в АО «Москоллектор» по законченным строительством объектам коммуникационных коллекторов до получения разрешения на ввод объекта в эксплуатацию', 'tech-info/07-perechen-peredavaemoi-dokumentatsii.pdf'],
                      ['Стандарт организации. Проектирование системы отопления, вентиляции и кондиционирования в коммуникационных коллекторах', 'tech-info/08-standart-otopleniya-ventilyatsii.pdf'],
                      ['Справочник материалов и оборудования, рекомендованных к применению', 'tech-info/09-spravochnik-mio.pdf'],
                      ['Порядок контроля качества выполнения работ по уплотнению и гидроизоляции швов и трещин и уплотнению грунтов за обделкой путём инъектирования железобетонных конструкций коммуникационных коллекторов', 'tech-info/10-poryadok-kontrolya-kachestva.pdf'],
                      ['Регламент согласования структурными подразделениями АО «Москоллектор» проектной документации на стадии «ПД» и стадии «РД»', 'tech-info/11-reglament-soglasovaniya-psd.pdf'],
                      ['Основные характеристики АО «Москоллектор» на 31.12.2025', 'tech-info/12-osnovnye-kharakteristiki-2025.pdf'],
                    ].map(([label, file]) => (
                      <a key={file} href={fileUrl(FILE_BASE_URL, file)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                          <Download className="w-5 h-5 text-sky-500" />
                        </div>
                        <p className="flex-1 font-medium text-[#0a1628] text-sm leading-snug">{label}</p>
                      </a>
                    ))}
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
