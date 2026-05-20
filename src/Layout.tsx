import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Phone, Mail, Menu, X, ChevronDown, ExternalLink, MapPin, Clock, Search, FileText, ArrowRight } from 'lucide-react';
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

// --------------------------------------------------------------------
// Каталог форм документов. Каждая форма — отдельный пункт поиска.
// При клике из поиска: открывается прямая загрузка файла в новой вкладке.
// Если файла нет на диске — браузер покажет 404 (загрузить через CMS).
// --------------------------------------------------------------------
type SearchItem = {
  title: string;
  path: string;
  keywords: string;
  file?: string;    // путь к файлу — если есть, клик скачивает файл
  isForm?: boolean; // показывать иконку файла
};

const FORMS_BASE = '/docs/forms/';

const formCatalog: SearchItem[] = [
  // ===== Заявки на ордер / техэксплуатацию =====
  { title: 'Форма 1 — заявка на ордер', file: FORMS_BASE + 'ФОРМА-1.doc', path: '/consumers#work', keywords: 'форма 1 заявка ордер техэксплуатация договор', isForm: true },
  { title: 'Форма 1.1 — заявка на техэксплуатацию', file: FORMS_BASE + 'ФОРМА-1.1.doc', path: '/consumers#work', keywords: 'форма 1.1 1 1 заявка техэксплуатация договор', isForm: true },
  { title: 'Форма 2 — анкета потребителя', file: FORMS_BASE + 'ФОРМА-2.doc', path: '/consumers#work', keywords: 'форма 2 анкета потребитель', isForm: true },
  { title: 'Форма 3 — справка о коммуникациях', file: FORMS_BASE + 'форма-3.doc', path: '/consumers#work', keywords: 'форма 3 справка коммуникации', isForm: true },
  { title: 'Форма 4 — справка о подрядчике', file: FORMS_BASE + 'форма-4.doc', path: '/consumers#work', keywords: 'форма 4 справка подрядчик', isForm: true },
  { title: 'Форма 5 — заявка на ордер демонтаж', file: FORMS_BASE + 'ФОРМА-5.doc', path: '/consumers#work', keywords: 'форма 5 ордер демонтаж', isForm: true },
  { title: 'Форма 5.3 — заявка на перекладку / горзаказ', file: FORMS_BASE + 'ФОРМА-5.3.doc', path: '/consumers#work', keywords: 'форма 5.3 5 3 перекладка горзаказ городской заказ ордер', isForm: true },
  // ===== Кабели (10.1-10.4) =====
  { title: 'Форма 10.1 — прокладка кабеля', file: FORMS_BASE + 'форма-10.1.xlsx', path: '/consumers#work', keywords: 'форма 10.1 10 1 прокладка кабель связь силовой оптоволокно заявка', isForm: true },
  { title: 'Форма 10.2 — демонтаж кабеля', file: FORMS_BASE + 'форма-10.2.xlsx', path: '/consumers#work', keywords: 'форма 10.2 10 2 демонтаж кабель связь силовой оптоволокно', isForm: true },
  { title: 'Форма 10.3 — городской заказ (кабели)', file: FORMS_BASE + 'форма-10.3.xlsx', path: '/consumers#work', keywords: 'форма 10.3 10 3 городской заказ горзаказ кабель', isForm: true },
  { title: 'Форма 10.4 — перекладка кабеля', file: FORMS_BASE + 'форма-10.4.xlsx', path: '/consumers#work', keywords: 'форма 10.4 10 4 перекладка кабель оптоволокно связь', isForm: true },
  // ===== Трубопроводы (11.1-11.5) =====
  { title: 'Форма 11.1 — прокладка трубопровода', file: FORMS_BASE + 'форма-11.1.xlsx', path: '/consumers#work', keywords: 'форма 11.1 11 1 прокладка трубопровод теплосеть водопровод', isForm: true },
  { title: 'Форма 11.2 — демонтаж трубопровода', file: FORMS_BASE + 'форма-11.2.xlsx', path: '/consumers#work', keywords: 'форма 11.2 11 2 демонтаж трубопровод теплосеть водопровод', isForm: true },
  { title: 'Форма 11.3 — врезка трубопровода', file: FORMS_BASE + 'форма-11.3.xlsx', path: '/consumers#work', keywords: 'форма 11.3 11 3 врезка трубопровод теплосеть водопровод', isForm: true },
  { title: 'Форма 11.4 — врезка/изменение трубопровода', file: FORMS_BASE + 'форма-11.4.xlsx', path: '/consumers#work', keywords: 'форма 11.4 11 4 врезка изменение трубопровод', isForm: true },
  { title: 'Форма 11.5 — перекладка трубопровода', file: FORMS_BASE + 'форма-11.5.xlsx', path: '/consumers#work', keywords: 'форма 11.5 11 5 перекладка трубопровод теплосеть водопровод', isForm: true },
  // ===== Коммерческие и продление =====
  { title: 'Форма 12 — продление ТУ', file: FORMS_BASE + 'ФОРМА-12.doc', path: '/consumers#commercial', keywords: 'форма 12 продление ту согласование проект', isForm: true },
  { title: 'Форма 15 — договор на сохранность', file: FORMS_BASE + 'Форма-15.docx', path: '/consumers#contracts', keywords: 'форма 15 договор сохранность конструкции коллектор', isForm: true },
  { title: 'Форма 16 — заявка на охранную зону', file: FORMS_BASE + 'ФОРМА-16.doc', path: '/consumers#work', keywords: 'форма 16 охранная зона заявка', isForm: true },
  { title: 'Форма 17 — договор сохранности (охранная зона)', file: FORMS_BASE + 'ФОРМА-17.doc', path: '/consumers#work', keywords: 'форма 17 договор сохранность охранная зона коллектор', isForm: true },
  { title: 'Форма 21 — работа в охранной зоне (юрлица)', file: FORMS_BASE + 'ФОРМА-21.doc', path: '/consumers#work', keywords: 'форма 21 охранная зона юрлица', isForm: true },
  { title: 'Форма 22 — работа в охранной зоне (физлица)', file: FORMS_BASE + 'ФОРМА-22.doc', path: '/consumers#work', keywords: 'форма 22 охранная зона физлица', isForm: true },
  { title: 'Форма 25 — согласование проекта', file: FORMS_BASE + 'ФОРМА-25.doc', path: '/consumers#work', keywords: 'форма 25 согласование проект', isForm: true },
  { title: 'Форма 26 — согласование ППР', file: FORMS_BASE + 'ФОРМА-26.doc', path: '/consumers#work', keywords: 'форма 26 ппр проект производства работ водопровод охранная зона', isForm: true },
  { title: 'Форма 27(П) — заказчик/проектная (охранная зона)', file: FORMS_BASE + 'ФОРМА-27-П.doc', path: '/consumers#work', keywords: 'форма 27 27п охранная зона проектная заказчик инвестор', isForm: true },
  { title: 'Форма 27(З) — заявка на работы в ОЗ', file: FORMS_BASE + 'ФОРМА-27-3.doc', path: '/consumers#work', keywords: 'форма 27 27з охранная зона заявка', isForm: true },
  // ===== Допуск (30-серия) =====
  { title: 'Форма 32 — заявка на пропуск', file: FORMS_BASE + 'ФОРМА-32.doc', path: '/consumers#dopusk', keywords: 'форма 32 пропуск допуск бюро', isForm: true },
  { title: 'Форма 33 — заявка на допуск', file: FORMS_BASE + 'ФОРМА-33.doc', path: '/consumers#dopusk', keywords: 'форма 33 допуск заявка', isForm: true },
  { title: 'Форма 34 — заявка на пропуск (визиты)', file: FORMS_BASE + 'ФОРМА-34.doc', path: '/consumers#dopusk', keywords: 'форма 34 пропуск визит', isForm: true },
  { title: 'Форма 35 — заявка на разовый допуск', file: FORMS_BASE + 'ФОРМА-35.doc', path: '/consumers#dopusk', keywords: 'форма 35 разовый допуск', isForm: true },
  { title: 'Форма 37 — заявка на инвентаризацию', file: FORMS_BASE + 'ФОРМА-37.doc', path: '/consumers#dopusk', keywords: 'форма 37 инвентаризация обследование', isForm: true },
  { title: 'Форма 37.1 — инвентаризация (расширенная)', file: FORMS_BASE + 'ФОРМА-37.1.doc', path: '/consumers#dopusk', keywords: 'форма 37.1 37 1 инвентаризация обследование', isForm: true },
  { title: 'Форма 38 — список работников для допуска', file: FORMS_BASE + 'ФОРМА-38.docx', path: '/consumers#dopusk', keywords: 'форма 38 список работников допуск', isForm: true },
  // ===== Формы 40-49 =====
  { title: 'Форма 40 — анкета сотрудника для допуска', file: FORMS_BASE + 'Форма-40.xlsx', path: '/consumers#dopusk', keywords: 'форма 40 анкета сотрудник допуск', isForm: true },
  { title: 'Форма 40.1 — анкета сотрудника (расширенная)', file: FORMS_BASE + 'Форма-40.1.xlsx', path: '/consumers#dopusk', keywords: 'форма 40.1 40 1 анкета сотрудник допуск', isForm: true },
  { title: 'Форма 41 — заявка на цифровой пропуск', file: FORMS_BASE + 'ФОРМА-41.doc', path: '/consumers#dopusk', keywords: 'форма 41 цифровой пропуск', isForm: true },
  { title: 'Форма 42 — дубликат ТУ', file: FORMS_BASE + 'ФОРМА-42.doc', path: '/consumers#commercial', keywords: 'форма 42 дубликат ту согласование', isForm: true },
  { title: 'Форма 43 — дубликат договора/ордера', file: FORMS_BASE + 'ФОРМА-43.doc', path: '/consumers#commercial', keywords: 'форма 43 дубликат договор ордер акт счёт', isForm: true },
  { title: 'Форма 45 — инвентаризация коммуникаций', file: FORMS_BASE + 'Форма-45.doc', path: '/consumers#other', keywords: 'форма 45 инвентаризация коммуникации', isForm: true },
  { title: 'Форма 46 — консультационные услуги', file: FORMS_BASE + 'ФОРМА-46.doc', path: '/consumers#other', keywords: 'форма 46 консультация консультационные услуги', isForm: true },
  { title: 'Форма 47 — копирование исп. документации', file: FORMS_BASE + 'ФОРМА-47.doc', path: '/consumers#commercial', keywords: 'форма 47 копирование исполнительная документация план профиль', isForm: true },
  { title: 'Форма 49 — обследование коллекторов', file: FORMS_BASE + 'ФОРМА-49.doc', path: '/consumers#other', keywords: 'форма 49 обследование коллектор', isForm: true },
  // ===== Формы 50-61 =====
  { title: 'Форма 50 — разработка ПСД', file: FORMS_BASE + 'ФОРМА-50.doc', path: '/consumers#commercial', keywords: 'форма 50 проектно сметная документация псд разработка', isForm: true },
  { title: 'Форма 51 — согласование ПСД', file: FORMS_BASE + 'ФОРМА-51.doc', path: '/consumers#commercial', keywords: 'форма 51 проектно сметная документация псд согласование', isForm: true },
  { title: 'Форма 52 — заявка на СМР', file: FORMS_BASE + 'ФОРМА-52.doc', path: '/consumers#commercial', keywords: 'форма 52 строительно монтажные работы смр заявка', isForm: true },
  { title: 'Форма 53 — сопровождение демонтажа', file: FORMS_BASE + 'ФОРМА-53.doc', path: '/consumers#commercial', keywords: 'форма 53 сопровождение демонтаж кабель связь коммерческое предложение', isForm: true },
  { title: 'Форма 58 — заявка на ОВК (демонтаж/перекладка)', file: FORMS_BASE + 'ФОРМА-58.doc', path: '/consumers#work', keywords: 'форма 58 овк оптоволокно демонтаж перекладка горзаказ', isForm: true },
  { title: 'Форма 59 — обращение в ЦОП', file: FORMS_BASE + 'Форма-59.doc', path: '/consumers#other', keywords: 'форма 59 обращение цоп заявка', isForm: true },
  { title: 'Форма 60 — аннулирование ТУ', file: FORMS_BASE + 'ФОРМА-60.doc', path: '/consumers#other', keywords: 'форма 60 аннулирование ту', isForm: true },
  { title: 'Форма 61 — аннулирование согласования проекта', file: FORMS_BASE + 'ФОРМА-61.doc', path: '/consumers#other', keywords: 'форма 61 аннулирование согласование проект', isForm: true },
  // ===== Доверенности и инструкции =====
  { title: 'Доверенность — типовая форма', file: FORMS_BASE + 'Доверенность.docx', path: '/consumers#work', keywords: 'доверенность типовая получение оригиналов', isForm: true },
  { title: 'Регламент согласования ПСД', file: FORMS_BASE + 'Регламент-согласования-ПСД.docx', path: '/consumers#commercial', keywords: 'регламент согласование псд проектно сметная', isForm: true },
  { title: 'Инструкция ЛК — регистрация', file: FORMS_BASE + 'Инструкция_ЛК_регистрация-1.pdf', path: '/consumers#dopusk', keywords: 'инструкция лк личный кабинет регистрация', isForm: true },
  { title: 'Инструкция ЛК — версия 1.1', file: FORMS_BASE + 'Инструкция_ЛК_ver_1.1_21.09.pdf', path: '/consumers#dopusk', keywords: 'инструкция лк личный кабинет руководство', isForm: true },
  { title: 'Инструкция по установке ЭЦП', file: FORMS_BASE + 'Инструкция-по-установке-ЭЦП.pdf', path: '/consumers#dopusk', keywords: 'инструкция установка эцп электронная цифровая подпись укэп', isForm: true },
  { title: 'Памятка по оформлению допуска', file: FORMS_BASE + 'Памятка-по-оформлению-допуска-в-коллекторы-1.pdf', path: '/consumers#dopusk', keywords: 'памятка оформление допуск коллектор', isForm: true },
  // ===== Типовые договоры =====
  { title: 'Договор на сохранность — юрлица', file: '/docs/consumers/Договор-на-сохранность-юрлица.docx', path: '/consumers#contracts', keywords: 'договор сохранность юрлица типовой', isForm: true },
  { title: 'Договор на сохранность — физлица', file: '/docs/consumers/Договор-на-сохранность-физлица.docx', path: '/consumers#contracts', keywords: 'договор сохранность физлица типовой', isForm: true },
  { title: 'Договор на сохранность — ОПС', file: '/docs/consumers/Договор-на-сохранность-ОПС.docx', path: '/consumers#contracts', keywords: 'договор сохранность опс ппс типовой', isForm: true },
  { title: 'Договор на техэксплуатацию (типовой)', file: '/docs/consumers/1.-Договор-на-услуги-по-технической-эксплуатации-коллекторов.pdf', path: '/consumers#contracts', keywords: 'договор техэксплуатация типовой коллектор услуги', isForm: true },
  { title: 'Договор на техэксплуатацию с ЭДО', file: '/docs/consumers/2.-Договор-на-услуги-по-технической-эксплуатации-коллекторов-с-ЭДО.pdf', path: '/consumers#contracts', keywords: 'договор техэксплуатация эдо электронный документооборот', isForm: true },
  { title: 'Государственный контракт по 44-ФЗ', file: '/docs/consumers/3.-Государственный-контракт-на-услуги-по-технической-эксплуатации-коллекторов-по-44-ФЗ.pdf', path: '/consumers#contracts', keywords: 'государственный контракт 44 фз гос закупка', isForm: true },
  { title: 'Государственный контракт по 44-ФЗ с ЭДО', file: '/docs/consumers/4.-Государственный-контракт-на-услуги-по-технической-эксплуатации-коллекторов-по-44-ФЗ-с-ЭДО.pdf', path: '/consumers#contracts', keywords: 'государственный контракт 44 фз эдо', isForm: true },
  { title: 'Договор по 223-ФЗ', file: '/docs/consumers/5.-Договор-на-услуги-по-технической-эксплуатации-коллекторов-по-223-ФЗ.pdf', path: '/consumers#contracts', keywords: 'договор 223 фз закупка', isForm: true },
  { title: 'Договор по 223-ФЗ с ЭДО', file: '/docs/consumers/6.-Договор-на-услуги-по-технической-эксплуатации-коллекторов-по-223-ФЗ-с-ЭДО.pdf', path: '/consumers#contracts', keywords: 'договор 223 фз эдо', isForm: true },
  // ===== Прочие документы =====
  { title: 'Регламент допуска (АИС ARM Контроль)', file: '/docs/consumers/Регламент-взаимодействия-подразделений-АО-Москоллектор-по-осуществлению-допуска-в-коллекторы-с-использованием-АИС-ARM-Контроль.pdf', path: '/consumers#regulations', keywords: 'регламент допуск аис арм контроль взаимодействие', isForm: true },
  { title: 'Регламентная таблица (Приложение 2)', file: '/docs/consumers/Регламентная-таблица-АО-Москоллектор-Приложение-2-.pdf', path: '/consumers#regulations', keywords: 'регламентная таблица приложение 2', isForm: true },
  { title: 'Список переименованных коллекторов', file: '/docs/forms/renamed-collectors.xlsx', path: '/consumers#work', keywords: 'переименованные коллекторы список новые наименования', isForm: true },
];

const searchablePages: SearchItem[] = [
  // === Разделы сайта ===
  { title: 'О компании', path: '/about', keywords: 'о компании история реквизиты инн огрн москоллектор ао акционерное общество руководство устав' },
  { title: 'Акционерам', path: '/shareholders', keywords: 'акционерам устав документы собрание дивиденды отчётность раскрытие информации' },
  { title: 'Услуги для потребителей', path: '/consumers', keywords: 'услуги потребители прокладка демонтаж перекладка врезка допуск тарифы кабель коллектор работы охранная зона городской заказ горзаказ' },
  { title: 'Новости для потребителей', path: '/consumer-news', keywords: 'новости потребители изменения технические условия ту' },
  { title: 'Работа с коммуникациями', path: '/consumers#work', keywords: 'работа коммуникации прокладка врезка демонтаж перекладка горзаказ городской заказ кабель трубопровод теплосеть водопровод оптоволокно связь силовой' },
  { title: 'Охранная зона коллектора', path: '/consumers#work', keywords: 'охранная зона коллектор согласование договор сохранность физические лица юридические ппр' },
  { title: 'Тарифы и цены', path: '/consumers#tariffs', keywords: 'тарифы цены стоимость калькулятор тариф услуги оплата приказ 612 12 2026 трубопровод теплосеть водопровод кабель' },
  { title: 'Допуск в коллектор', path: '/consumers#dopusk', keywords: 'допуск коллектор пропуск оформление ордер бюро пропусков личный кабинет лк укэп мчд' },
  { title: 'Коммерческие услуги', path: '/consumers#commercial', keywords: 'коммерческие дубликаты продление ту согласование исполнительная документация псд смр копирование проектно сметная строительно монтажные работы' },
  { title: 'Прочие услуги', path: '/consumers#other', keywords: 'прочие услуги консультация аннулирование переоформление приёмка передача обследование инвентаризация' },
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
  // === Формы документов с прямой загрузкой ===
  ...formCatalog,
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
      s.toLowerCase().replace(/[ёЁ]/g, 'е').replace(/[-–—_]/g, ' ').replace(/\s+/g, ' ').trim();
    // #17 ОЭ — strip common Russian word endings for stemming
    // e.g. "формы" → "форм", "тарифов" → "тариф", "коммуникации" → "коммуникац"
    const stem = (t: string): string => {
      if (t.length <= 3) return t; // keep short tokens (numbers, acronyms)
      if (/^\d/.test(t)) return t; // keep tokens starting with digit (form numbers)
      const endings = ['ами', 'ями', 'ого', 'его', 'ому', 'ему', 'ыми', 'ими', 'ах', 'ях', 'ам', 'ям', 'ой', 'ей', 'ом', 'ем', 'ов', 'ев', 'ый', 'ий', 'ая', 'яя', 'ое', 'ее', 'ые', 'ие', 'ть', 'ся', 'сь', 'ы', 'и', 'у', 'ю', 'е', 'а', 'я', 'о'];
      for (const e of endings) {
        if (t.length > e.length + 2 && t.endsWith(e)) return t.slice(0, -e.length);
      }
      return t;
    };
    const q = normalize(searchQuery);
    const tokens = q.split(' ').filter(Boolean);
    const results = searchablePages.filter(p => {
      const haystack = normalize(`${p.title} ${p.keywords}`);
      // Each query token must match the haystack either as substring,
      // or its stem must be found as substring of any haystack token's stem.
      return tokens.every(t => {
        if (haystack.includes(t)) return true;
        const tStem = stem(t);
        if (tStem.length < 3) return false;
        // Find any haystack token that, after stemming, contains the query stem.
        return haystack.split(' ').some(ht => stem(ht).includes(tStem));
      });
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
            {/* Logo — single image with conditional source, transparent PNG */}
            <Link to="/" className={`flex-shrink-0 transition-all duration-300 ${isScrolled ? 'h-14' : 'h-20'}`}>
              <img
                src={asset(isHomeTransparent ? 'images/logo-footer.png' : 'images/logo.png')}
                alt="Москоллектор"
                className={`h-full w-auto transition-all duration-300`}
                style={{ background: 'transparent' }}
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
                    {searchResults.map((r, idx) => (
                      <button
                        key={r.path + '-' + idx}
                        onClick={() => {
                          // 1. Если форма / файл — открыть его прямой загрузкой
                          if (r.file) {
                            window.open(asset(r.file), '_blank', 'noopener');
                            setSearchQuery('');
                            setShowSearch(false);
                            return;
                          }
                          // 2. Внешняя ссылка
                          if (r.path.startsWith('http')) {
                            window.open(r.path, '_blank', 'noopener');
                            setSearchQuery('');
                            setShowSearch(false);
                            return;
                          }
                          // 3. Внутренний путь с возможным #hash
                          const hashIdx = r.path.indexOf('#');
                          const targetPath = hashIdx === -1 ? r.path : r.path.slice(0, hashIdx);
                          const targetHash = hashIdx === -1 ? '' : r.path.slice(hashIdx + 1);
                          const sameRoute = location.pathname === targetPath;
                          if (sameRoute && targetHash) {
                            const el = document.getElementById(targetHash);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          } else {
                            navigate(r.path);
                            if (targetHash) {
                              setTimeout(() => {
                                const el = document.getElementById(targetHash);
                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }, 350);
                            }
                          }
                          setSearchQuery('');
                          setShowSearch(false);
                        }}
                        className="w-full flex items-start gap-2.5 text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition-colors rounded-lg mx-1 group"
                      >
                        {r.isForm ? (
                          <FileText className="w-4 h-4 mt-0.5 flex-shrink-0 text-sky-500" />
                        ) : (
                          <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-300 group-hover:text-sky-500 transition-colors" />
                        )}
                        <span className="flex-1">{r.title}</span>
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
