import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Phone, Mail, Menu, X, ChevronDown, ExternalLink, MapPin, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { asset } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  {
    label: 'О компании',
    href: '/about',
    dropdown: [
      { label: 'О компании', href: '/about' },
      { label: 'Политика конфиденциальности', href: '/privacy' },
      { label: 'Социальная политика', href: '/social' },
      { label: 'Профком', href: '/union' },
    ]
  },
  { label: 'Акционерам', href: '/shareholders' },
  {
    label: 'Потребителям',
    href: '/consumers',
    dropdown: [
      { label: 'Новости для потребителей', href: '/consumer-news' },
      { label: 'Услуги для потребителей', href: '/consumers' },
      { label: 'Типовые формы договоров', href: '/consumers#contracts' },
      { label: 'Дни и часы приема', href: '/reception-hours' },
    ]
  },
  {
    label: 'Информация',
    href: '/info',
    dropdown: [
      { label: 'Общая информация', href: '/info' },
      { label: 'Противодействие терроризму', href: '/antiterror' },
      { label: 'Отзыв доверенностей', href: '/revocation' },
      { label: 'Техническая информация', href: '/tech-info' },
    ]
  },
  { label: 'Противодействие коррупции', href: '/anticorruption' },
  { label: 'Пресс-центр', href: '/press' },
  { label: 'Закупки', href: '/procurement' },
  { label: 'Вакансии', href: '/vacancies' },
  { label: 'Контакты', href: '/contacts' },
];

const searchablePages = [
  { title: 'О компании', path: '/about', keywords: 'о компании история реквизиты инн огрн москоллектор ао акционерное общество руководство устав' },
  { title: 'Акционерам', path: '/shareholders', keywords: 'акционерам устав документы собрание дивиденды отчётность раскрытие информации' },
  { title: 'Услуги для потребителей', path: '/consumers', keywords: 'услуги потребители прокладка демонтаж перекладка врезка допуск тарифы кабель коллектор работы охранная зона городской заказ горзаказ' },
  { title: 'Новости для потребителей', path: '/consumer-news', keywords: 'новости потребители изменения технические условия ту' },
  { title: 'Работа с коммуникациями', path: '/consumers#work', keywords: 'работа коммуникации прокладка врезка демонтаж перекладка горзаказ городской заказ кабель трубопровод теплосеть водопровод оптоволокно связь силовой форма 10.1 10.2 10.3 10.4 11.1 11.2 11.3 11.5 25 58 41 форма 15 форма 14 форма 1 форма 1.1' },
  { title: 'Охранная зона коллектора', path: '/consumers#work', keywords: 'охранная зона коллектор согласование договор сохранность физические лица юридические форма 27 27п 27з форма 26 форма 16 форма 17 форма 21 форма 22 ппр' },
  { title: 'Тарифы и цены', path: '/consumers#tariffs', keywords: 'тарифы цены стоимость калькулятор тариф услуги оплата приказ 612 12 2026 трубопровод теплосеть водопровод кабель' },
  { title: 'Допуск в коллектор', path: '/consumers#dopusk', keywords: 'допуск коллектор пропуск оформление ордер бюро пропусков личный кабинет лк укэп мчд форма 40 40.1 32 33 38 34 35 37 37.1 45' },
  { title: 'Коммерческие услуги', path: '/consumers#commercial', keywords: 'коммерческие дубликаты продление ту согласование исполнительная документация псд смр копирование проектно сметная строительно монтажные работы форма 42 43 47 53 форма 12' },
  { title: 'Прочие услуги', path: '/consumers#other', keywords: 'прочие услуги консультация аннулирование переоформление приёмка передача обследование инвентаризация форма 46 форма 48 форма 49 форма 60 форма 61 форма 50 51 52 59' },
  { title: 'Разрешительная документация', path: '/consumers#docs', keywords: 'разрешительная документация порядок оформления сроки ту сп договор ордер оптоволокно' },
  { title: 'Регламентные документы', path: '/consumers#regulations', keywords: 'регламент документы регламентная таблица арм контроль' },
  { title: 'Типовые формы договоров', path: '/consumers#contracts', keywords: 'договор форма типовой сохранность техэксплуатация контракт 44-фз 223-фз эдо' },
  { title: 'Информация', path: '/info', keywords: 'информация общая сведения' },
  { title: 'Противодействие коррупции', path: '/anticorruption', keywords: 'коррупция противодействие антикоррупция подарки взятка декларация' },
  { title: 'Противодействие терроризму', path: '/antiterror', keywords: 'терроризм антитеррор безопасность' },
  { title: 'Техническая информация', path: '/tech-info', keywords: 'техническая документация нормативная нпа' },
  { title: 'Пресс-центр', path: '/press', keywords: 'пресс новости события публикации газета видео корпоративная' },
  { title: 'Закупки', path: '/procurement', keywords: 'закупки тендеры торги аукцион конкурс' },
  { title: 'Вакансии', path: '/vacancies', keywords: 'вакансии работа трудоустройство должность резюме зарплата personal@moscollector.ru' },
  { title: 'Контакты', path: '/contacts', keywords: 'контакты телефон адрес email почта коптельский лобачика диспетчер бюро пропусков' },
  { title: 'Дни и часы приёма', path: '/reception-hours', keywords: 'приём часы график работы расписание' },
  { title: 'Политика конфиденциальности', path: '/privacy', keywords: 'политика конфиденциальность персональные данные пдн' },
  { title: 'Калькулятор', path: '/calculator', keywords: 'калькулятор расчёт стоимость тариф тарифный' },
  { title: 'Личный кабинет', path: 'https://dopusk.moscollector.ru/', keywords: 'личный кабинет лк ais арм контроль вход авторизация допуск заявка dopusk' },
  { title: 'Статус обращения', path: '/status', keywords: 'статус обращение заявка номер проверить печать цоп' },
  // Формы документов — прямые ссылки на нужные разделы
  { title: 'Форма 10.1 — заявка на прокладку кабеля', path: '/consumers#work', keywords: 'форма 10.1 10 1 прокладка кабель связь силовой оптоволокно заявка' },
  { title: 'Форма 10.2 — заявка на демонтаж кабеля', path: '/consumers#work', keywords: 'форма 10.2 10 2 демонтаж кабель связь силовой оптоволокно заявка' },
  { title: 'Форма 10.3 — заявка по городскому заказу (кабели)', path: '/consumers#work', keywords: 'форма 10.3 10 3 городской заказ горзаказ кабель' },
  { title: 'Форма 10.4 — заявка на перекладку кабеля', path: '/consumers#work', keywords: 'форма 10.4 10 4 перекладка кабель оптоволокно связь' },
  { title: 'Форма 11.1 — заявка на прокладку трубопровода', path: '/consumers#work', keywords: 'форма 11.1 11 1 прокладка трубопровод теплосеть водопровод' },
  { title: 'Форма 11.2 — заявка на демонтаж трубопровода', path: '/consumers#work', keywords: 'форма 11.2 11 2 демонтаж трубопровод теплосеть водопровод' },
  { title: 'Форма 11.3 — заявка на врезку трубопровода', path: '/consumers#work', keywords: 'форма 11.3 11 3 врезка трубопровод теплосеть водопровод' },
  { title: 'Форма 11.5 — заявка на перекладку трубопровода', path: '/consumers#work', keywords: 'форма 11.5 11 5 перекладка трубопровод теплосеть водопровод' },
  { title: 'Форма 25 — согласование проекта', path: '/consumers#work', keywords: 'форма 25 согласование проект' },
  { title: 'Форма 26 — согласование ППР', path: '/consumers#work', keywords: 'форма 26 ппр проект производства работ водопровод охранная зона' },
  { title: 'Форма 27(П) / 27(З) — работы в охранной зоне', path: '/consumers#work', keywords: 'форма 27 27п 27з охранная зона проектная заказчик инвестор' },
  { title: 'Форма 15 — договор на сохранность', path: '/consumers#contracts', keywords: 'форма 15 договор сохранность конструкции коллектор' },
  { title: 'Форма 17 — договор на сохранность (охранная зона)', path: '/consumers#work', keywords: 'форма 17 договор сохранность охранная зона коллектор' },
  { title: 'Форма 1, 1.1 — заявка на ордер и техэксплуатацию', path: '/consumers#work', keywords: 'форма 1 1.1 заявка ордер техэксплуатация договор' },
  { title: 'Форма 2 — анкета потребителя', path: '/consumers#work', keywords: 'форма 2 анкета потребитель' },
  { title: 'Форма 5, 5.3 — заявка на ордер демонтаж/перекладка', path: '/consumers#work', keywords: 'форма 5 5.3 ордер демонтаж перекладка горзаказ' },
  { title: 'Формы 40, 40.1, 32, 33, 38 — допуск в коллектор', path: '/consumers#dopusk', keywords: 'форма 40 40.1 32 33 38 допуск список работников' },
  { title: 'Форма 37, 37.1 — инвентаризация', path: '/consumers#dopusk', keywords: 'форма 37 37.1 инвентаризация обследование' },
  { title: 'Форма 45 — инвентаризация коммуникаций', path: '/consumers#other', keywords: 'форма 45 инвентаризация коммуникации' },
  { title: 'Форма 42, 43 — дубликаты документов', path: '/consumers#commercial', keywords: 'форма 42 43 дубликат ту договор ордер акт счёт' },
  { title: 'Форма 47 — копирование исполнительной документации', path: '/consumers#commercial', keywords: 'форма 47 копирование исполнительная документация план профиль' },
  { title: 'Форма 53 — сопровождение демонтажа', path: '/consumers#commercial', keywords: 'форма 53 сопровождение демонтаж кабель связь коммерческое предложение' },
  { title: 'Формы 60, 61 — аннулирование ТУ и СП', path: '/consumers#other', keywords: 'форма 60 61 аннулирование ту согласование проект' },
  { title: 'Форма 12 — продление ТУ и согласований', path: '/consumers#commercial', keywords: 'форма 12 продление ту согласование проект' },
  { title: 'Форма 46 — консультационные услуги', path: '/consumers#other', keywords: 'форма 46 консультация консультационные услуги' },
];

export default function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof searchablePages>([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setSearchQuery('');
    setShowSearch(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }
    // Normalize: lowercase, remove hyphens/dashes, collapse whitespace.
    // Dots are kept (so "10.1" matches "10.1" in keywords).
    const normalize = (s: string) =>
      s.toLowerCase().replace(/[-–—_]/g, ' ').replace(/\s+/g, ' ').trim();
    const q = normalize(searchQuery);
    // Tokenize query — every token must be present somewhere (title or keywords)
    const tokens = q.split(' ').filter(Boolean);
    const results = searchablePages.filter(p => {
      const haystack = normalize(`${p.title} ${p.keywords}`);
      return tokens.every(t => haystack.includes(t));
    });
    setSearchResults(results);
    setShowSearch(true);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (href: string, dropdown?: { href: string }[]) =>
    location.pathname === href || dropdown?.some(d => d.href === location.pathname);

  const isHomeTransparent = location.pathname === '/' && !isScrolled;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Top Bar */}
      <div className={location.pathname === '/' ? 'bg-transparent' : 'gradient-hero'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10">
          <div className="flex items-center gap-6 text-[13px] text-white/70">
            <a href="tel:+74992222201" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5" />
              +7 (499) 222-22-01
            </a>
            <a href="mailto:info@moscollector.ru" className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5" />
              info@moscollector.ru
            </a>
          </div>
          <div className="flex items-center gap-4 text-[13px] text-white/70">
            <Link to="/" className="hover:text-white transition-colors">Главная</Link>
            <span className="text-white/20">|</span>
            <a href="https://dopusk.moscollector.ru/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
              Личный кабинет
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-white/20">|</span>
            <a href="https://moscollector.ru/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
              Старый сайт
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-xl backdrop-saturate-150 shadow-[0_2px_12px_-2px_rgba(10,22,40,0.08),0_1px_2px_rgba(10,22,40,0.04)] border-b border-gray-100/80'
            : location.pathname === '/' ? 'bg-transparent' : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center gap-6 transition-all duration-300 ${isScrolled ? 'h-[72px]' : 'h-[96px]'}`}>
            {/* Logo */}
            <Link to="/" className={`flex-shrink-0 relative transition-all duration-300 ${isScrolled ? 'h-14' : 'h-20'}`}>
              {/* Dark logo for transparent hero header */}
              <img
                src={asset('images/logo-footer.png')}
                alt="Москоллектор"
                className={`w-auto absolute top-0 left-0 transition-all duration-300 ${isScrolled ? 'h-14' : 'h-20'} ${isHomeTransparent ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              />
              {/* Light logo for scrolled/other pages — transparent PNG */}
              <img
                src={asset('images/logo.png')}
                alt="Москоллектор"
                className={`w-auto transition-all duration-300 ${isScrolled ? 'h-14' : 'h-20'} ${isHomeTransparent ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-center">
              {navItems.map((item) =>
                item.dropdown ? (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger asChild>
                      <button className={`group flex items-center gap-1 px-3 py-2 text-[13.5px] font-medium rounded-lg transition-all whitespace-nowrap ${
                        isHomeTransparent
                          ? 'text-white/90 hover:text-white hover:bg-white/10'
                          : isActive(item.href, item.dropdown)
                            ? 'text-sky-700 bg-sky-50/80'
                            : 'text-gray-600 hover:text-[#0a1628] hover:bg-gray-50'
                      }`}>
                        {item.label}
                        <ChevronDown className="w-3.5 h-3.5 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" sideOffset={8} className="w-64 rounded-xl shadow-[0_10px_40px_-12px_rgba(10,22,40,0.18),0_4px_10px_-2px_rgba(10,22,40,0.06)] border border-gray-100/80 p-1.5">
                      {item.dropdown.map((subItem) => (
                        <DropdownMenuItem key={subItem.href} asChild>
                          <Link to={subItem.href} className="w-full cursor-pointer rounded-lg px-3 py-2 text-[13.5px] text-gray-600 hover:bg-sky-50 hover:text-sky-700 transition-colors">{subItem.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`px-3 py-2 text-[13.5px] font-medium rounded-lg transition-all whitespace-nowrap ${
                      isHomeTransparent
                        ? 'text-white/90 hover:text-white hover:bg-white/10'
                        : isActive(item.href)
                          ? 'text-sky-700 bg-sky-50/80'
                          : 'text-gray-600 hover:text-[#0a1628] hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Search */}
            <div className="hidden xl:flex items-center flex-shrink-0" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowSearch(true)}
                  className={`w-28 2xl:w-36 pl-3 pr-9 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all ${
                    isHomeTransparent
                      ? 'border border-white/20 bg-white/10 text-white placeholder-white/50 backdrop-blur-sm'
                      : 'border border-gray-200 bg-white/70 text-gray-700 placeholder-gray-400 hover:border-gray-300 focus:bg-white'
                  }`}
                />
                <Search className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isHomeTransparent ? 'text-white/60' : 'text-gray-400'}`} />
                {showSearch && searchResults.length > 0 && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-[0_10px_40px_-12px_rgba(10,22,40,0.18),0_4px_10px_-2px_rgba(10,22,40,0.06)] border border-gray-100/80 z-50 py-1.5 max-h-80 overflow-y-auto scrollbar-thin">
                    {searchResults.map((r) => (
                      <button
                        key={r.path}
                        onClick={() => {
                          if (r.path.startsWith('http')) {
                            window.open(r.path, '_blank');
                          } else {
                            navigate(r.path);
                          }
                          setSearchQuery('');
                          setShowSearch(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition-colors rounded-lg mx-1"
                      >
                        {r.title}
                      </button>
                    ))}
                  </div>
                )}
                {showSearch && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-[0_10px_40px_-12px_rgba(10,22,40,0.18),0_4px_10px_-2px_rgba(10,22,40,0.06)] border border-gray-100/80 z-50 p-4">
                    <p className="text-sm text-gray-400">Ничего не найдено</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={`xl:hidden ml-auto ${isHomeTransparent ? 'text-white hover:bg-white/10' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="xl:hidden pb-6 border-t border-gray-100">
              <nav className="flex flex-col gap-1 pt-4">
                {navItems.map((item) => (
                  <div key={item.label}>
                    <Link
                      to={item.href}
                      className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive(item.href, item.dropdown)
                          ? 'text-sky-700 bg-sky-50'
                          : 'text-gray-600 hover:text-[#0a1628] hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                    {item.dropdown && (
                      <div className="ml-4 mt-1 space-y-0.5">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.href}
                            to={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-400 hover:text-sky-700 transition-colors"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="gradient-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-12 gap-12">
            {/* Brand */}
            <div className="md:col-span-5">
              <Link to="/" className="flex items-center gap-3 mb-5">
                <img
                  src={asset('images/logo-footer.png')}
                  alt="Москоллектор"
                  className="h-14 w-auto"
                />
              </Link>
              <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-sm">
                АО «Москоллектор» — специализированная организация по эксплуатации
                коммуникационных коллекторов города Москвы с 1988 года.
              </p>
              <div className="space-y-2.5">
                <a href="tel:+74992222201" className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-sky-400/70" />
                  +7 (499) 222-22-01
                </a>
                <a href="mailto:info@moscollector.ru" className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-sky-400/70" />
                  info@moscollector.ru
                </a>
                <div className="flex items-start gap-2.5 text-sm text-white/60">
                  <MapPin className="w-4 h-4 text-sky-400/70 mt-0.5" />
                  <span>129090, Москва, 1-й Коптельский пер., д. 16, стр. 4</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-white/60">
                  <Clock className="w-4 h-4 text-sky-400/70" />
                  Пн-Чт: 8:00–17:00, Пт: 8:00–15:45
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="md:col-span-3">
              <h4 className="font-heading text-sm font-semibold mb-5 text-white/90">Разделы</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/about" className="text-white/50 hover:text-white transition-colors">О компании</Link></li>
                <li><Link to="/shareholders" className="text-white/50 hover:text-white transition-colors">Акционерам</Link></li>
                <li><Link to="/consumers" className="text-white/50 hover:text-white transition-colors">Потребителям</Link></li>
                <li><Link to="/press" className="text-white/50 hover:text-white transition-colors">Пресс-центр</Link></li>
                <li><Link to="/procurement" className="text-white/50 hover:text-white transition-colors">Закупки</Link></li>
              </ul>
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <h4 className="font-heading text-sm font-semibold mb-5 text-white/90">Сервисы</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/calculator" className="text-white/50 hover:text-white transition-colors">Калькулятор</Link></li>
                <li><Link to="/status" className="text-white/50 hover:text-white transition-colors">Статус заявки</Link></li>
                <li><Link to="/vacancies" className="text-white/50 hover:text-white transition-colors">Вакансии</Link></li>
                <li><Link to="/contacts" className="text-white/50 hover:text-white transition-colors">Контакты</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="md:col-span-2">
              <h4 className="font-heading text-sm font-semibold mb-5 text-white/90">Правовая информация</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/privacy" className="text-white/50 hover:text-white transition-colors">Политика конфиденциальности</Link></li>
                <li><Link to="/anticorruption" className="text-white/50 hover:text-white transition-colors">Противодействие коррупции</Link></li>
                <li><Link to="/info" className="text-white/50 hover:text-white transition-colors">Информация</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[13px] text-white/30">
              <div>&copy; {new Date().getFullYear()} АО «Москоллектор». Все права защищены.</div>
              <div>Департамент ЖКХ города Москвы</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
