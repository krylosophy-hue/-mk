import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronDown, Download, FileText, 
  Phone, Mail, MapPin, Clock, AlertTriangle,
  CheckCircle2, Circle, Calculator, ExternalLink,
  Menu, X, ArrowRight, Building2, FileSpreadsheet,
  ClipboardList, BookOpen, Gavel
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// Types
interface WorkType {
  id: string;
  label: string;
}

interface CommType {
  id: string;
  label: string;
}

interface Step {
  number: number;
  title: string;
  description: string;
  whoSubmits?: string;
  procedure?: string[];
  address?: string;
  receiveAddress?: string;
  timeframe?: string;
  forms?: { name: string; file: string; label: string }[];
  note?: string;
}

// Work types
const workTypes: WorkType[] = [
  { id: 'prokladka', label: 'Прокладка / Врезка коммуникаций' },
  { id: 'demontazh', label: 'Демонтаж коммуникаций' },
  { id: 'perekladka', label: 'Перекладка коммуникаций' },
  { id: 'gorzakaz', label: 'Прокладка / Демонтаж по городскому заказу' },
  { id: 'inventarizaciya', label: 'Инвентаризация' },
];

// Communication types
const commTypes: CommType[] = [
  { id: 'optika', label: 'Оптико-волоконные кабели' },
  { id: 'svyaz', label: 'Кабели связи' },
  { id: 'silovye', label: 'Силовые кабели' },
  { id: 'teploset', label: 'Трубопроводы теплосети' },
  { id: 'vodoprovod', label: 'Трубопроводы водопровода' },
];

// Form mapping for Step 1
// Формы заявок согласно требованиям ЦОП:
// Кабели (оптика/связь/силовые): прокладка — 10.1, демонтаж — 10.2, горзаказ — 10.3, перекладка — 10.4
// Трубопроводы (теплосеть/водопровод): прокладка — 11.1, врезка — 11.3, демонтаж — 11.2, перекладка — 11.5, горзаказ — 11.5
const step1Forms: Record<string, Record<string, { prokladka: string; demontazh: string; perekladka: string; gorzakaz: string }>> = {
  optika: {
    form: { prokladka: '10.1', demontazh: '10.2', perekladka: '10.4', gorzakaz: '10.3' },
    file: { prokladka: 'форма-10.1.xlsx', demontazh: 'форма-10.2.xlsx', perekladka: 'форма-10.4.xlsx', gorzakaz: 'форма-10.3.xlsx' },
  },
  svyaz: {
    form: { prokladka: '10.1', demontazh: '10.2', perekladka: '10.4', gorzakaz: '10.3' },
    file: { prokladka: 'форма-10.1.xlsx', demontazh: 'форма-10.2.xlsx', perekladka: 'форма-10.4.xlsx', gorzakaz: 'форма-10.3.xlsx' },
  },
  silovye: {
    form: { prokladka: '10.1', demontazh: '10.2', perekladka: '10.4', gorzakaz: '10.3' },
    file: { prokladka: 'форма-10.1.xlsx', demontazh: 'форма-10.2.xlsx', perekladka: 'форма-10.4.xlsx', gorzakaz: 'форма-10.3.xlsx' },
  },
  teploset: {
    form: { prokladka: '11.1', demontazh: '11.2', perekladka: '11.5', gorzakaz: '11.5' },
    file: { prokladka: 'форма-11.1.xlsx', demontazh: 'форма-11.2.xlsx', perekladka: 'форма-11.5.xlsx', gorzakaz: 'форма-11.5.xlsx' },
  },
  vodoprovod: {
    form: { prokladka: '11.1', demontazh: '11.2', perekladka: '11.5', gorzakaz: '11.5' },
    file: { prokladka: 'форма-11.1.xlsx', demontazh: 'форма-11.2.xlsx', perekladka: 'форма-11.5.xlsx', gorzakaz: 'форма-11.5.xlsx' },
  },
};

// Additional "врезка" form for pipes (workType "Прокладка / Врезка")
const vrezkaForm: Record<string, { form: string; file: string }> = {
  teploset: { form: '11.3', file: 'форма-11.3.xlsx' },
  vodoprovod: { form: '11.3', file: 'форма-11.3.xlsx' },
};

// Base URL for files
const FILE_BASE_URL = '/docs/forms/';

// Sidebar items
const sidebarItems = [
  { id: 'work', label: 'Работа с коммуникациями', icon: FileText },
  { id: 'dopusk', label: 'Допуск в коллектор', icon: CheckCircle2 },
  { id: 'commercial', label: 'Коммерческие услуги', icon: Calculator },
  { id: 'other', label: 'Прочие услуги', icon: Circle },
  { id: 'tariffs', label: 'Тарифы и цены', icon: Calculator },
  { id: 'docs', label: 'Разрешительная документация', icon: ClipboardList },
  { id: 'contracts', label: 'Типовые формы договоров', icon: FileText },
  { id: 'regulations', label: 'Регламентные документы', icon: BookOpen },
];

// Accordion component
function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const ref = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const willOpen = !isOpen;
    if (willOpen && ref.current) {
      setIsOpen(true);
      // Wait for framer-motion animation (200ms) to finish, then scroll to top of this element
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
    <div ref={ref} className="border border-gray-200 rounded-xl overflow-hidden mb-4 bg-white scroll-mt-24">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
      >
        <span className="font-semibold text-[#0a1628] text-lg">{title}</span>
        {isOpen ? <ChevronDown className="w-5 h-5 text-[#0ea5e9]" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-5 bg-gray-50 border-t border-gray-200">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Download button component
function DownloadButton({ file, label }: { file: string; label: string }) {
  return (
    <a
      href={`${FILE_BASE_URL}${file}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0a1628] text-white text-sm rounded-lg hover:bg-[#142138] transition-colors"
    >
      <Download className="w-4 h-4" />
      {label}
    </a>
  );
}

// Stepper component
function Stepper({ steps }: { steps: Step[] }) {
  const [openStep, setOpenStep] = useState<number | null>(1);
  const stepRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const scrollTarget = useRef<number | null>(null);

  useEffect(() => {
    if (scrollTarget.current !== null) {
      const target = scrollTarget.current;
      // Wait for framer-motion animation (200ms) to finish before scrolling
      const timer = setTimeout(() => {
        const el = stepRefs.current[target];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
      scrollTarget.current = null;
      return () => clearTimeout(timer);
    }
  }, [openStep]);

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={step.number} className="relative scroll-mt-24" ref={(el) => { stepRefs.current[step.number] = el; }}>
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div className="absolute left-7 top-[4.5rem] w-0.5 h-[calc(100%-4.5rem)] bg-gray-200 z-0" />
          )}

          <div
            data-step={step.number}
            className={`relative z-10 flex gap-5 cursor-pointer rounded-xl transition-all ${openStep === step.number ? 'bg-blue-50/70 p-5 -mx-2' : 'p-5 -mx-2 hover:bg-gray-50'}`}
            onClick={() => {
              const willOpen = openStep !== step.number;
              if (willOpen) {
                scrollTarget.current = step.number;
                setOpenStep(step.number);
              } else {
                setOpenStep(null);
              }
            }}
          >
            {/* Step number */}
            <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl ${
              openStep === step.number ? 'bg-[#0ea5e9] text-white shadow-lg shadow-blue-200' : 'bg-gray-200 text-gray-600'
            }`}>
              {step.number}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-[#0a1628] text-xl mb-1">{step.title}</h4>
              <p className="text-gray-600">{step.description}</p>
              
              <AnimatePresence>
                {openStep === step.number && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-5"
                  >
                    {/* Who submits */}
                    {step.whoSubmits && (
                      <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Кто подаёт:</p>
                        <p className="text-gray-700">{step.whoSubmits}</p>
                      </div>
                    )}
                    
                    {/* Procedure */}
                    {step.procedure && step.procedure.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-semibold text-[#0a1628] mb-2 flex items-center gap-2">
                          <ClipboardList className="w-4 h-4" /> Процедура:
                        </h5>
                        <ul className="space-y-2">
                          {step.procedure.map((item, i) => (
                            <li key={i} className="text-gray-700 flex items-start gap-2">
                              <span className="text-[#0ea5e9] mt-1">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Address */}
                    {step.address && (
                      <div className="mb-3 flex items-start gap-3 p-3 bg-white rounded-lg">
                        <MapPin className="w-5 h-5 text-[#0ea5e9] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Куда подавать:</p>
                          <p className="text-gray-700 font-medium">{step.address}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Receive address */}
                    {step.receiveAddress && (
                      <div className="mb-3 flex items-start gap-3 p-3 bg-white rounded-lg">
                        <Building2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Получение оригиналов:</p>
                          <p className="text-gray-700">{step.receiveAddress}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Timeframe */}
                    {step.timeframe && (
                      <div className="mb-4 flex items-start gap-3 p-3 bg-white rounded-lg">
                        <Clock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Срок:</p>
                          <p className="text-gray-700 font-medium">{step.timeframe}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Forms */}
                    {step.forms && step.forms.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-semibold text-[#0a1628] mb-3 flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4" /> Необходимые формы:
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {step.forms.map((form, i) => (
                            <DownloadButton key={i} file={form.file} label={form.label} />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Note */}
                    {step.note && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {step.note}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Toggle icon */}
            <div className="flex-shrink-0">
              {openStep === step.number ? (
                <ChevronDown className="w-6 h-6 text-[#0ea5e9]" />
              ) : (
                <ChevronRight className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Wizard component
function ServiceWizard() {
  const [selectedWork, setSelectedWork] = useState<string>('');
  const [selectedComm, setSelectedComm] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  
  const handleShowResult = () => {
    if (selectedWork && selectedComm) {
      setShowResult(true);
    }
  };
  
  const workLabel = workTypes.find(w => w.id === selectedWork)?.label;
  const commLabel = commTypes.find(c => c.id === selectedComm)?.label;
  
  // Generate steps based on selection
  const getSteps = (): Step[] => {
    if (!selectedWork || !selectedComm) return [];

    // Инвентаризация: simplified flow
    if (selectedWork === 'inventarizaciya') {
      return [
        {
          number: 1,
          title: 'Оформление допуска для инвентаризации',
          description: 'Допуск сотрудников для проведения инвентаризации / обследования коммуникаций',
          whoSubmits: 'Организация, проводящая инвентаризацию',
          procedure: [
            'Заполнить заявку по Форме 37 (для инвентаризации) или Форме 37.1',
            'Подать заявку через Личный кабинет на dopusk.moscollector.ru',
          ],
          address: 'dopusk.moscollector.ru',
          forms: [
            { name: 'Форма 37', file: 'ФОРМА-37.doc', label: 'Форма 37' },
            { name: 'Форма 37.1', file: 'ФОРМА-37.1.doc', label: 'Форма 37.1' },
          ],
        },
      ];
    }

    const formData = step1Forms[selectedComm];
    const formNum = formData?.form[selectedWork as keyof typeof formData.form] || '10.1';
    const formFile = formData?.file[selectedWork as keyof typeof formData.file] || 'форма-10.1.xlsx';
    const vrezka = vrezkaForm[selectedComm];

    const isDemontazh = selectedWork === 'demontazh';
    const isPerekladka = selectedWork === 'perekladka';
    const isGorzakaz = selectedWork === 'gorzakaz';
    const isProkladka = selectedWork === 'prokladka';
    const isVodoprovod = selectedComm === 'vodoprovod';
    const isPipe = selectedComm === 'teploset' || selectedComm === 'vodoprovod';
    const isOptika = selectedComm === 'optika';

    // Step 1 forms — add врезка form for pipes during прокладка/врезка workType
    const step1FormsList = [
      { name: `Форма ${formNum}`, file: formFile, label: `Форма ${formNum}${isProkladka && vrezka ? ' (прокладка)' : ''}` },
      ...(isProkladka && vrezka ? [
        { name: `Форма ${vrezka.form}`, file: vrezka.file, label: `Форма ${vrezka.form} (врезка)` },
      ] : []),
      { name: 'Доверенность', file: 'Доверенность.docx', label: 'Доверенность' },
    ];

    const step1Procedure = [
      isProkladka && vrezka
        ? `Заполнить письмо-заявку: на прокладку — по Форме ${formNum}, на врезку — по Форме ${vrezka.form}`
        : `Заполнить письмо-заявку по Форме ${formNum}`,
      'Приложить ситуационный план с нанесением трассы КПК и указанием мест ввода/вывода коммуникаций из коллектора',
      'Документы представить нарочно на бумажном носителе',
    ];

    const steps: Step[] = [
      {
        number: 1,
        title: 'Оформление технических условий (ТУ)',
        description: 'Получение технических условий на размещение коммуникаций',
        whoSubmits: 'Заявитель работ — владелец коммуникаций, подрядная организация, проектная организация',
        procedure: step1Procedure,
        address: 'ул. Лобачика, д. 4, каб. 303',
        receiveAddress: 'ул. Лобачика, д. 4, каб. 303 — только при наличии доверенности',
        forms: step1FormsList,
      },
      {
        number: 2,
        title: 'Согласование проекта',
        description: 'Согласование проектной документации',
        whoSubmits: 'Заявитель работ — владелец коммуникаций, подрядная организация, проектная организация',
        procedure: [
          'Заполнить письмо-заявку по Форме 25',
          'Приложить оригинал проекта — 3 экземпляра',
          'Приложить СРО организации',
          ...(isOptika && (isDemontazh || isPerekladka || isGorzakaz) ? ['Приложить акт по Форме 58'] : []),
          'Документы представить нарочно на бумажном носителе',
        ],
        address: 'ул. Лобачика, д. 4, каб. 303',
        receiveAddress: 'ул. Лобачика, д. 4, каб. 303 — при наличии доверенности',
        forms: [
          { name: 'Форма 25', file: 'ФОРМА-25.doc', label: 'Форма 25' },
          ...(isOptika && (isDemontazh || isPerekladka || isGorzakaz) ? [
            { name: 'Форма 58', file: 'ФОРМА-58.doc', label: 'Форма 58 — акт' },
          ] : []),
          ...(isDemontazh || isGorzakaz ? [
            { name: 'Форма 41', file: 'ФОРМА-41.doc', label: 'Форма 41' },
          ] : []),
          { name: 'Доверенность', file: 'Доверенность.docx', label: 'Доверенность' },
        ],
      },
      // Step: Согласование ППР (для трубопроводов водопровода)
      ...(isVodoprovod ? [{
        number: 3,
        title: 'Согласование ППР',
        description: 'Согласование проекта производства работ (для трубопроводов водопровода)',
        whoSubmits: 'Заявитель работ — владелец коммуникаций, подрядная организация',
        procedure: [
          'Заполнить письмо-заявку по Форме 26',
          'Приложить ППР на работы в охранной зоне коллектора',
          'Документы представить нарочно на бумажном носителе',
        ],
        address: 'ул. Лобачика, д. 4, каб. 303',
        forms: [
          { name: 'Форма 26', file: 'ФОРМА-26.doc', label: 'Форма 26' },
        ],
        note: 'Данный шаг обязателен для работ с трубопроводами водопровода вне зависимости от типа работ (прокладка или демонтаж).',
      }] : []),
      {
        number: isVodoprovod ? 4 : 3,
        title: 'Оформление договора на сохранность',
        description: 'Заключение договора о сохранности строительных конструкций коллекторов',
        note: 'Оформление договора на сохранность требуется только для подрядных организаций.',
        whoSubmits: 'Подрядная организация',
        procedure: [
          'Оформить договор на сохранность по Форме 15 АО «Москоллектор»',
          'Документы представить нарочно на бумажном носителе',
        ],
        address: 'ул. Лобачика, д. 4, каб. 303',
        receiveAddress: 'ул. Лобачика, д. 4, каб. 303 — при наличии доверенности',
        forms: [
          { name: 'Форма 15', file: 'Форма-15.docx', label: 'Форма 15 — договор на сохранность' },
        ],
      },
      (() => {
        // Step 4 (or 5 for vodoprovod) — depends on workType per ОРУ #33-39
        const stepNum = isVodoprovod ? 5 : 4;
        if (isProkladka) {
          return {
            number: stepNum,
            title: 'Оформление договора и выдача ордера на прокладку коммуникаций',
            description: 'Оформление договора на услуги по технической эксплуатации коллекторов / дополнительного соглашения к договору и выдача ордера на прокладку коммуникаций',
            whoSubmits: 'Заявитель — владелец коммуникаций',
            procedure: [
              'Заполнить письмо-заявку (Форма 1 или Форма 1.1)',
              'Приложить выписку из реестра членов СРО организации',
              'Приложить анкету потребителя (Форма 2) — заполняется в случае оформления договора',
              'Документы представить нарочно на бумажном носителе в Центр обслуживания потребителей',
            ],
            address: 'ул. Лобачика, д. 4, каб. 303',
            receiveAddress: 'ул. Лобачика, д. 4, каб. 303 — по доверенности',
            forms: [
              { name: 'Форма 1', file: 'ФОРМА-1.doc', label: 'Форма 1' },
              { name: 'Форма 1.1', file: 'ФОРМА-1.1.doc', label: 'Форма 1.1' },
              { name: 'Форма 2', file: 'ФОРМА-2.doc', label: 'Форма 2 — анкета потребителя' },
              { name: 'Доверенность', file: 'Доверенность.docx', label: 'Доверенность' },
            ],
            note: 'Ордер выдаётся после подписания договора на услуги по технической эксплуатации коллекторов / дополнительного соглашения к договору на услуги по технической эксплуатации коллекторов.',
          } as Step;
        }
        if (isDemontazh) {
          return {
            number: stepNum,
            title: 'Оформление ордера на демонтаж коммуникаций',
            description: 'Оформление ордера на выполнение работ по демонтажу коммуникаций',
            whoSubmits: 'Заявитель — владелец коммуникаций',
            procedure: [
              'Заполнить письмо-заявку (Форма 5)',
              'Приложить выписку из реестра членов СРО организации',
              ...(isPipe ? ['Приложить график производства работ, согласованный с эксплуатирующим подразделением (РЭК) АО «Москоллектор»'] : []),
              'Документы представить нарочно на бумажном носителе в Центр обслуживания потребителей',
            ],
            address: 'ул. Лобачика, д. 4, каб. 303',
            receiveAddress: 'ул. Лобачика, д. 4, каб. 303 — по доверенности',
            forms: [
              { name: 'Форма 5', file: 'ФОРМА-5.doc', label: 'Форма 5' },
              { name: 'Доверенность', file: 'Доверенность.docx', label: 'Доверенность' },
            ],
          } as Step;
        }
        if (isPerekladka) {
          return {
            number: stepNum,
            title: 'Оформление ордера на перекладку коммуникаций',
            description: 'Оформление ордера на выполнение работ по перекладке коммуникаций',
            whoSubmits: 'Заявитель — владелец коммуникаций',
            procedure: [
              'Заполнить письмо-заявку (Форма 5.3)',
              'Приложить выписку из реестра членов СРО организации',
              ...(isPipe ? ['Приложить график производства работ, согласованный с эксплуатирующим подразделением (РЭК) АО «Москоллектор»'] : []),
              'Документы представить нарочно на бумажном носителе в Центр обслуживания потребителей',
            ],
            address: 'ул. Лобачика, д. 4, каб. 303',
            receiveAddress: 'ул. Лобачика, д. 4, каб. 303 — по доверенности',
            forms: [
              { name: 'Форма 5.3', file: 'ФОРМА-5.3.doc', label: 'Форма 5.3' },
              { name: 'Доверенность', file: 'Доверенность.docx', label: 'Доверенность' },
            ],
          } as Step;
        }
        // gorzakaz
        return {
          number: stepNum,
          title: 'Оформление ордера на работы по городскому заказу',
          description: 'Оформление ордера на выполнение работ по прокладке/демонтажу коммуникаций по городскому заказу',
          whoSubmits: 'Заявитель — владелец коммуникаций, городской заказчик или технический заказчик',
          procedure: [
            'Заполнить письмо-заявку (Форма 5.3)',
            'Приложить выписку из реестра членов СРО организации',
            ...(isPipe ? ['Приложить график производства работ, согласованный с эксплуатирующим подразделением (РЭК) АО «Москоллектор»'] : []),
            'Документы представить нарочно на бумажном носителе в Центр обслуживания потребителей',
          ],
          address: 'ул. Лобачика, д. 4, каб. 303',
          receiveAddress: 'ул. Лобачика, д. 4, каб. 303 — по доверенности',
          forms: [
            { name: 'Форма 5.3', file: 'ФОРМА-5.3.doc', label: 'Форма 5.3' },
            { name: 'Доверенность', file: 'Доверенность.docx', label: 'Доверенность' },
          ],
        } as Step;
      })(),
      {
        number: isVodoprovod ? 6 : 5,
        title: 'Допуск в коллектор',
        description: 'Оформление допуска осуществляется через цифровой сервис dopusk.moscollector.ru',
        whoSubmits: 'Заявитель — владелец коммуникаций, подрядная организация, городской заказчик или технический заказчик',
        procedure: [
          'Подать заявку на сотрудников',
          'Получить в «Бюро пропусков» карты допуска (после согласования заявки на сотрудников)',
          'Подать заявку на допуск',
        ],
        note: 'Для оформления допуска необходима усиленная квалифицированная электронная подпись (УКЭП) и регистрация в Личном кабинете на dopusk.moscollector.ru. На бумаге документы принимаются только в исключительных случаях, в остальных случаях используйте Личный кабинет.',
        forms: [
          { name: 'Форма 40', file: 'Форма-40.xlsx', label: 'Форма 40' },
          { name: 'Форма 40.1', file: 'Форма-40.1.xlsx', label: 'Форма 40.1' },
          { name: 'Форма 32', file: 'ФОРМА-32.doc', label: 'Форма 32' },
          { name: 'Форма 33', file: 'ФОРМА-33.doc', label: 'Форма 33' },
          { name: 'Форма 38', file: 'ФОРМА-38.docx', label: 'Форма 38 — список работников' },
        ],
      },
    ];
    
    return steps;
  };
  
  const steps = getSteps();
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
          <FileText className="w-6 h-6 text-[#0ea5e9]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#0a1628]">Подберите вашу услугу</h3>
          <p className="text-gray-500 text-sm">Выберите тип работ и коммуникаций, чтобы увидеть порядок оформления</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Step 1 */}
        <div>
          <label className="block text-sm font-semibold text-[#0a1628] mb-2">
            Шаг 1: Что вы хотите сделать?
          </label>
          <select
            value={selectedWork}
            onChange={(e) => {
              setSelectedWork(e.target.value);
              setShowResult(false);
            }}
            className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent bg-white"
          >
            <option value="">Выберите тип работ</option>
            {workTypes.map(work => (
              <option key={work.id} value={work.id}>{work.label}</option>
            ))}
          </select>
        </div>
        
        {/* Step 2 */}
        <div>
          <label className="block text-sm font-semibold text-[#0a1628] mb-2">
            Шаг 2: Какой тип коммуникаций?
          </label>
          <select
            value={selectedComm}
            onChange={(e) => {
              setSelectedComm(e.target.value);
              setShowResult(false);
            }}
            className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent bg-white"
          >
            <option value="">Выберите коммуникации</option>
            {commTypes.map(comm => (
              <option key={comm.id} value={comm.id}>{comm.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <Button
        onClick={handleShowResult}
        disabled={!selectedWork || !selectedComm}
        className="w-full md:w-auto bg-[#0ea5e9] hover:bg-[#3a8eef] text-white px-8 py-4 text-base font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FileText className="w-5 h-5 mr-2" />
        Показать порядок оформления
      </Button>
      
      {/* Result */}
      <AnimatePresence>
        {showResult && steps.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-8"
          >
            <div className="border-t-2 border-[#0ea5e9] pt-6">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="px-4 py-2 bg-[#0a1628] text-white rounded-lg text-sm font-bold">
                  РЕЗУЛЬТАТ
                </div>
                <h4 className="text-xl font-bold text-[#0a1628]">
                  {workLabel} — {commLabel}
                </h4>
              </div>
              
              <Stepper steps={steps} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main component
export default function Consumers() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('work');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Scroll to section from URL hash
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = sectionRefs.current[id];
        if (element) {
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
          setActiveSection(id);
        }
      }, 100);
    }
  }, [location.hash]);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      
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
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-[#0a1628] transition-colors">Главная</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0a1628] font-semibold">Услуги для потребителей</span>
          </nav>
        </div>
      </div>
      
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#142138] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.h1 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Услуги для потребителей
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-white/80 max-w-3xl">
              Оформление разрешительной документации на работу с инженерными коммуникациями в коллекторах Москвы
            </motion.p>
          </motion.div>
        </div>
      </div>
      
      {/* Warning bar */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Важная информация</p>
              <p>В коммуникационные коллекторы допускаются только граждане РФ. С 25.01.2021 приняты новые наименования коллекторов.</p>
              <a href="/docs/forms/Переименованные-коллекторы_.xlsx" className="inline-flex items-center gap-1 text-[#0ea5e9] hover:underline mt-1">
                <Download className="w-4 h-4" /> Скачать список переименованных коллекторов
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-[#0a1628] text-white font-semibold flex items-center gap-2">
                <Menu className="w-5 h-5" />
                Разделы
              </div>
              <nav className="p-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-sm transition-all ${
                      activeSection === item.id
                        ? 'bg-[#0ea5e9]/10 text-[#0a1628] font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${activeSection === item.id ? 'text-[#0ea5e9]' : 'text-gray-400'}`} />
                    <span className="leading-tight">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm"
            >
              <span className="font-semibold text-[#0a1628]">Навигация по разделам</span>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-2"
                >
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    {sidebarItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-100 last:border-0 ${
                          activeSection === item.id ? 'bg-[#0ea5e9]/10 text-[#0a1628] font-medium' : 'text-gray-600'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            {/* Section 1: Work with communications */}
            <section 
              ref={el => { sectionRefs.current['work'] = el; }}
              id="work" 
              className="mb-16 scroll-mt-28"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#0ea5e9]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0a1628]">Работа с коммуникациями</h2>
              </div>

              {/* Important notices */}
              <div className="mb-8 space-y-3">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-900">
                    <strong>Внимание!</strong> В коммуникационные коллекторы АО «Москоллектор» допускаются только граждане РФ.
                  </div>
                </div>
                <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex items-start gap-3">
                  <FileText className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-sky-900">
                    <p className="mb-1">
                      <strong>Уважаемые потребители!</strong> С 25.01.2021 в АО «Москоллектор» приняты новые наименования ряда коллекторов и комплексов.
                    </p>
                    <a
                      href="/docs/consumers/Список-переименованных-коллекторов.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 font-medium"
                    >
                      Список переименованных коллекторов и комплексов
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* #4 — Виды работ с коммуникациями */}
              <div className="mb-8 grid md:grid-cols-3 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5 text-sky-600" />
                  </div>
                  <h3 className="font-bold text-[#0a1628] mb-2">Выдача ТУ</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Технические условия выдаются на прокладку, врезку, демонтаж кабелей связи,
                    силовых кабелей, оптоволоконных кабелей, теплосети и водопровода в коллекторах
                    АО «Москоллектор». Срок действия ТУ — 5 лет.
                  </p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5 text-sky-600" />
                  </div>
                  <h3 className="font-bold text-[#0a1628] mb-2">Согласование на ликвидацию</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Согласование проектной документации и проектов производства работ на
                    ликвидацию участков коллекторов и проложенных в них коммуникаций — в том числе
                    в рамках реализации Государственных программ города Москвы.
                  </p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5 text-sky-600" />
                  </div>
                  <h3 className="font-bold text-[#0a1628] mb-2">Переустройство и сохранность</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Согласование проектов на переустройство участков коллекторов, выдача ТУ и
                    оформление договоров на сохранность строительных конструкций коллекторов при
                    проведении работ в охранной зоне.
                  </p>
                </div>
              </div>

              {/* Wizard */}
              <ServiceWizard />

              {/* Additional subsections */}
              <div className="mt-10 space-y-4">
                <Accordion title="Работы в охранной зоне коллектора">
                  <div className="space-y-6">
                    {/* Юридические лица */}
                    <div className="p-5 bg-white rounded-xl border border-gray-200">
                      <h4 className="font-bold text-[#0a1628] mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#0ea5e9]" /> Для юридических лиц
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Оформление разрешительной документации осуществляется последовательно согласно перечню форм ниже:
                      </p>
                      <div className="space-y-5">
                        <div>
                          <p className="font-semibold text-[#0a1628] mb-1">1. Форма 27(П) — Согласование на проведение работ в охранной зоне (для проектной организации)</p>
                          <p className="text-gray-600 text-sm mb-3">
                            Заявка на выдачу согласования на проведение работ в охранной зоне коллекторов для проектной организации.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <DownloadButton file="ФОРМА-27-П.doc" label="Форма 27(П)" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-[#0a1628] mb-1">2. Форма 27(З) — Согласование на проведение работ в охранной зоне (для Заказчика/Инвестора)</p>
                          <p className="text-gray-600 text-sm mb-3">
                            Заявка на выдачу согласования на проведение работ в охранной зоне коллекторов для Заказчика/Инвестора.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <DownloadButton file="ФОРМА-27-3.doc" label="Форма 27(З)" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-[#0a1628] mb-1">3. Форма 26 — Согласование проекта производства работ (ППР)</p>
                          <p className="text-gray-600 text-sm mb-3">
                            О согласовании проекта производства работ (ППР) в охранной зоне коллекторов.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <DownloadButton file="ФОРМА-26.doc" label="Форма 26" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-[#0a1628] mb-1">4. Форма 16 — Сопроводительное письмо на заключение договора на сохранность</p>
                          <p className="text-gray-600 text-sm mb-3">
                            Сопроводительное письмо на заключение договора на сохранность строительных конструкций в охранной зоне коллекторов.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <DownloadButton file="ФОРМА-16.doc" label="Форма 16" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-[#0a1628] mb-1">5. Форма 17 — Договор на сохранность строительных конструкций коллекторов</p>
                          <p className="text-gray-600 text-sm mb-3">
                            Договор на сохранность строительных конструкций коллекторов и проложенных в них инженерных коммуникаций с организациями, производящими строительно-монтажные работы в охранной зоне коллекторов.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <DownloadButton file="ФОРМА-17.doc" label="Форма 17" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-[#0a1628] mb-1">6. Форма 21 — Согласование на размещение объектов в охранной зоне</p>
                          <p className="text-gray-600 text-sm mb-3">
                            О выдаче согласования на размещение объектов в охранной зоне коллекторов (не является формой для физических лиц).
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <DownloadButton file="ФОРМА-21.doc" label="Форма 21" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-[#0a1628] mb-1">7. Форма 22 — Технические условия на размещение объектов в охранной зоне</p>
                          <p className="text-gray-600 text-sm mb-3">
                            На выдачу технических условий на размещение объектов (постоянно или временно) в охранной зоне коллекторов.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <DownloadButton file="ФОРМА-22.doc" label="Форма 22" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Физические лица */}
                    <div className="p-5 bg-white rounded-xl border border-gray-200">
                      <h4 className="font-bold text-[#0a1628] mb-4 flex items-center gap-2">
                        <Circle className="w-5 h-5 text-[#0ea5e9]" /> Для физических лиц
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Оформление разрешительной документации для физических лиц осуществляется последовательно:
                      </p>
                      <div className="space-y-5">
                        <div>
                          <p className="font-semibold text-[#0a1628] mb-1">1. Согласование охранной зоны</p>
                          <p className="text-gray-600 text-sm mb-3">
                            Физические лица подают заявку на согласование работ в охранной зоне по Форме 27(З) с указанием вида работ и сроков их выполнения.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <DownloadButton file="ФОРМА-27-3.doc" label="Форма 27(З)" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-[#0a1628] mb-1">2. Договор на сохранность</p>
                          <p className="text-gray-600 text-sm mb-3">
                            После получения согласования физическое лицо заключает договор на сохранность строительных конструкций коллектора (формы 16 и 17).
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <DownloadButton file="ФОРМА-16.doc" label="Форма 16" />
                            <DownloadButton file="ФОРМА-17.doc" label="Форма 17" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Капитальный ремонт */}
                    <div className="p-4 bg-sky-50 rounded-xl border border-sky-200">
                      <p className="text-sky-800 text-sm">
                        <strong>Для работ в рамках капитального ремонта</strong> зданий, расположенных в охранной зоне коллектора, порядок согласования аналогичен: сначала получение согласования АО «Москоллектор» (Форма 27(П) или 27(З)), далее согласование ППР (Форма 26), затем заключение договора на сохранность (формы 16 и 17).
                      </p>
                    </div>
                  </div>
                </Accordion>
                
                <Accordion title="Акты о выполнении работ">
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      По завершении работ необходимо оформить акт выполнения работ по соответствующей форме:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-xl border border-gray-200">
                        <p className="font-semibold text-[#0a1628] mb-2">Оптико-волоконные кабели / Кабели связи / Силовые кабели</p>
                        <div className="flex gap-2">
                          <DownloadButton file="форма-3.doc" label="Форма 3" />
                          <DownloadButton file="форма-4.doc" label="Форма 4" />
                        </div>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-gray-200">
                        <p className="font-semibold text-[#0a1628] mb-2">Трубопроводы теплосети / водопровода</p>
                        <div className="flex gap-2">
                          <DownloadButton file="форма-3.doc" label="Форма 3" />
                          <DownloadButton file="форма-4.doc" label="Форма 4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Accordion>
                
                <Accordion title="Аварийные работы">
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-800 font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        При возникновении аварийной ситуации
                      </p>
                    </div>
                    <p className="text-gray-700">
                      Необходимо <strong>немедленно</strong> сообщить в диспетчерскую службу по телефону{' '}
                      <a href="tel:+74992222201" className="text-[#0ea5e9] font-semibold">+7 (499) 222-22-01</a> (круглосуточно).
                    </p>
                  </div>
                </Accordion>
              </div>
            </section>
            
            {/* Section 2: Dopusk */}
            <section 
              ref={el => { sectionRefs.current['dopusk'] = el; }}
              id="dopusk" 
              className="mb-16 scroll-mt-28"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-[#0ea5e9]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0a1628]">Допуск в коллектор</h2>
              </div>
              
              <div className="bg-gradient-to-br from-[#0a1628] to-[#142138] rounded-2xl p-6 md:p-8 mb-6 text-white">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <ExternalLink className="w-8 h-8 text-[#0ea5e9]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">Цифровой сервис допуска</h3>
                    <p className="text-white/80 mb-3">
                      Для оформления допуска сотрудников в коллекторы используется цифровой сервис{' '}
                      <a href="https://dopusk.moscollector.ru" target="_blank" rel="noopener noreferrer" className="text-[#0ea5e9] font-semibold hover:underline">dopusk.moscollector.ru</a>
                    </p>
                    <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl p-3 mb-4">
                      <p className="text-amber-200 text-sm">
                        <strong>Важно:</strong> документы на бумажном носителе принимаются только в исключительных случаях. В остальных случаях необходимо пользоваться Личным кабинетом.
                      </p>
                    </div>
                    
                    <div className="bg-white/10 rounded-xl p-4 mb-4">
                      <p className="font-semibold mb-2">Что нужно для оформления допуска:</p>
                      <ol className="space-y-1 text-white/80 text-sm mb-4">
                        <li>1. Усиленная квалифицированная электронная подпись (УКЭП)</li>
                        <li>2. Машиночитаемая доверенность (МЧД) — если сотрудник действует на основании доверенности</li>
                        <li>3. Регистрация в Личном кабинете</li>
                        <li>4. Направление заявок на сотрудников и на допуск через ЛК</li>
                      </ol>
                      <p className="font-semibold mb-2">Порядок регистрации в ЛК:</p>
                      <ol className="space-y-1 text-white/80 text-sm mb-4">
                        <li>1. Перейти на dopusk.moscollector.ru</li>
                        <li>2. Зарегистрировать организацию</li>
                        <li>3. Подождать рассмотрения заявки на регистрацию</li>
                        <li>4. Авторизоваться с помощью пароля, который придёт на указанную вами почту</li>
                      </ol>
                      <p className="font-semibold mb-2">Порядок получения допуска в коллектор:</p>
                      <ol className="space-y-1 text-white/80 text-sm">
                        <li>1. Подать заявку на сотрудников</li>
                        <li>2. После рассмотрения заявки, направить сотрудников за картами допуска в «Бюро пропусков». Сотрудникам <strong>ОБЯЗАТЕЛЬНО</strong> иметь паспорт для получения карты.</li>
                        <li>3. Подать заявку на допуск</li>
                      </ol>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 mb-4">
                      <p className="font-semibold mb-2">Адрес Бюро пропусков:</p>
                      <div className="flex items-start gap-2 text-white/80 text-sm">
                        <MapPin className="w-4 h-4 text-[#0ea5e9] flex-shrink-0 mt-0.5" />
                        <span>г. Москва, ул. Большая Никитская, д. 31</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <DownloadButton file="Инструкция_ЛК_регистрация-1.pdf" label="Инструкция по регистрации" />
                      <DownloadButton file="Инструкция_ЛК_ver_1.1_21.09.pdf" label="Инструкция по работе с ЛК" />
                      <DownloadButton file="Инструкция-по-установке-ЭЦП.pdf" label="Установка ЭЦП" />
                      <DownloadButton file="Памятка-по-оформлению-допуска-в-коллекторы-1.pdf" label="Памятка по оформлению допуска" />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-white/20 pt-4 mt-4">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-white/60 mb-1">IT-поддержка ЛК:</p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#0ea5e9]" />
                        <a href="tel:+74992222201" className="text-white hover:text-[#0ea5e9]">+7 (499) 222-22-01 (доб. 1510)</a>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-[#0ea5e9]" />
                        <a href="mailto:it-info@moscollector.ru" className="text-white hover:text-[#0ea5e9]">it-info@moscollector.ru</a>
                      </div>
                    </div>
                    <div>
                      <p className="text-white/60 mb-1">Бюро пропусков:</p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#0ea5e9]" />
                        <a href="tel:+74992222201" className="text-white hover:text-[#0ea5e9]">+7 (499) 222-22-01 (доб.: 1510)</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Accordion title="Производство работ по ордеру">
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                      <p className="font-semibold text-[#0a1628] mb-2">Работы по прокладке / демонтажу / горзаказу</p>
                      <p className="text-gray-600 text-sm mb-3">
                        Для производства работ в коллекторе необходимо оформить допуск через личный кабинет
                        не менее чем за 24 часа до начала работ.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <DownloadButton file="ФОРМА-32.doc" label="Форма 32" />
                        <DownloadButton file="ФОРМА-33.doc" label="Форма 33" />
                        <DownloadButton file="ФОРМА-38.docx" label="Форма 38 — список работников" />
                        <DownloadButton file="Форма-40.xlsx" label="Форма 40" />
                        <DownloadButton file="Форма-40.1.xlsx" label="Форма 40.1" />
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-amber-800 text-sm flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <strong>ВАЖНО:</strong> Для оформления допуска необходима УКЭП и регистрация в Личном кабинете на dopusk.moscollector.ru. При получении карт допуска в Бюро пропусков сотрудникам обязательно иметь паспорт.
                      </p>
                    </div>
                  </div>
                </Accordion>
                
                <Accordion title="Работы, не требующие производства">
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-xl border border-gray-200">
                        <p className="font-semibold text-[#0a1628] mb-2">Проектные работы</p>
                        <div className="flex gap-2">
                          <DownloadButton file="ФОРМА-34.doc" label="Форма 34" />
                          <DownloadButton file="ФОРМА-35.doc" label="Форма 35" />
                        </div>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-gray-200">
                        <p className="font-semibold text-[#0a1628] mb-2">Инвентаризация / Обследование</p>
                        <div className="flex gap-2">
                          <DownloadButton file="ФОРМА-37.doc" label="Форма 37" />
                          <DownloadButton file="ФОРМА-37.1.doc" label="Форма 37.1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Accordion>
                
                <Accordion title="Дубликаты документов">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
                    <p className="text-red-800 font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      ВНИМАНИЕ! Дубликаты выдаются только после оплаты.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                      <p className="font-semibold text-[#0a1628] mb-2">Дубликат ТУ / листа согласования / договора на сохранность</p>
                      <p className="text-gray-600 text-sm mb-3">Подать нарочно: ул. Лобачика, д. 4, каб. 303</p>
                      <DownloadButton file="ФОРМА-42.doc" label="Форма 42" />
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                      <p className="font-semibold text-[#0a1628] mb-2">Дубликат ордера / договора на эксплуатацию / акта / счёта</p>
                      <p className="text-gray-600 text-sm mb-3">Подать нарочно: ул. Лобачика, д. 4, каб. 303</p>
                      <DownloadButton file="ФОРМА-43.doc" label="Форма 43" />
                    </div>
                  </div>
                </Accordion>
                
                <Accordion title="Инвентаризация коммуникаций">
                  <div className="p-4 bg-white rounded-xl border border-gray-200">
                    <p className="font-semibold text-[#0a1628] mb-2">Заявка на инвентаризацию</p>
                    <p className="text-gray-600 text-sm mb-3">Допуск оформляется по Форме 45</p>
                    <DownloadButton file="Форма-45.doc" label="Форма 45" />
                  </div>
                </Accordion>
              </div>
            </section>
            
            {/* Section 3: Commercial */}
            <section 
              ref={el => { sectionRefs.current['commercial'] = el; }}
              id="commercial" 
              className="mb-16 scroll-mt-28"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-[#0ea5e9]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0a1628]">Коммерческие услуги</h2>
              </div>

              {/* #41 ОРУ — общий порядок получения коммерческих услуг */}
              <div className="mb-6 bg-white border border-gray-200 rounded-2xl p-5 md:p-6 space-y-3 text-sm">
                <p className="text-gray-700">
                  Для оказания услуги необходимо заполнить форму письма-заявки и предоставить нарочно на бумажном носителе в Центр обслуживания потребителей.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#0ea5e9] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#0a1628]">Куда подавать:</p>
                      <p className="text-gray-700">ул. Лобачика, д. 4, каб. 303</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-[#0ea5e9] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#0a1628]">Получение документов:</p>
                      <p className="text-gray-700">ул. Лобачика, д. 4, каб. 303 (по доверенности)</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-800 font-semibold flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    ВНИМАНИЕ! Услуги оказываются только после оплаты.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Accordion title="Дубликаты документов" defaultOpen={false}>
                  <div className="space-y-6">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                      <p className="text-amber-800 text-sm flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <strong>ВНИМАНИЕ!</strong> Дубликаты запрашиваемых документов выдаются только после оплаты.
                      </p>
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-gray-200">
                      <h4 className="font-bold text-[#0a1628] mb-3">Технические условия; лист согласования проекта; договор на сохранность строительных конструкций коллекторов</h4>
                      <p className="text-gray-700 text-sm mb-4">
                        Для получения дубликата технических условий; листа согласования проекта; договора на сохранность строительных конструкций коллекторов необходимо заполнить письмо-заявку по форме 42.
                        Документы должны быть представлены нарочно на бумажном носителе по адресу: ул. Лобачика, д. 4, кабинет 303.
                      </p>
                      <DownloadButton file="ФОРМА-42.doc" label="Форма 42" />
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-gray-200">
                      <h4 className="font-bold text-[#0a1628] mb-3">Ордер, договор на техэксплуатацию, акты, счета</h4>
                      <p className="text-gray-700 text-sm mb-4">
                        Для получения дубликата ордера на выполнение работ; акта о выполнении работ по прокладке/врезке/демонтажу коммуникаций; акта приемки-передачи коммуникаций; счета; счета-фактуры; акта об оказании услуг по договору на техническую эксплуатацию коллекторов; акта инвентаризации коммуникаций необходимо заполнить письмо-заявку по форме 43.
                        Документы должны быть представлены нарочно на бумажном носителе по адресу: ул. Лобачика, д. 4, кабинет 303.
                      </p>
                      <DownloadButton file="ФОРМА-43.doc" label="Форма 43" />
                    </div>
                  </div>
                </Accordion>

                <Accordion title="Продление ТУ" defaultOpen={false}>
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-amber-800 text-sm flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <strong>ВНИМАНИЕ!</strong> Продление документов осуществляется только после оплаты.
                      </p>
                    </div>
                    <div className="p-5 bg-white rounded-xl border border-gray-200">
                      <div className="space-y-2 text-gray-700 text-sm mb-4">
                        <p><strong>Сроки оказания услуги:</strong> 3 рабочих дня с момента оплаты счета.</p>
                        <p><strong>Что получает потребитель:</strong> продление технических условий проектной документации сроком на 1 год.</p>
                        <p>Для получения продления технических условий необходимо заполнить письмо-заявку по форме 12. Документы должны быть представлены нарочно на бумажном носителе по адресу: ул. Лобачика, д. 4, кабинет 303.</p>
                      </div>
                      <DownloadButton file="ФОРМА-12.doc" label="Форма 12" />
                    </div>
                  </div>
                </Accordion>

                <Accordion title="Продление ТУ и согласований проектов" defaultOpen={false}>
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-amber-800 text-sm flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <strong>ВНИМАНИЕ!</strong> Продление документов осуществляется только после оплаты.
                      </p>
                    </div>
                    <div className="p-5 bg-white rounded-xl border border-gray-200">
                      <div className="space-y-2 text-gray-700 text-sm mb-4">
                        <p><strong>Сроки оказания услуги:</strong> 3 рабочих дня с момента оплаты счета.</p>
                        <p><strong>Что получает потребитель:</strong> продление технических условий и согласований проектной документации сроком на 1 год.</p>
                        <p>Для получения продления необходимо заполнить письмо-заявку по форме 12. Документы должны быть представлены нарочно на бумажном носителе по адресу: ул. Лобачика, д. 4, кабинет 303.</p>
                      </div>
                      <DownloadButton file="ФОРМА-12.doc" label="Форма 12" />
                    </div>
                  </div>
                </Accordion>

                <Accordion title="Проектно-сметные работы" defaultOpen={false}>
                  <div className="p-5 bg-white rounded-xl border border-gray-200 space-y-4">
                    <p className="text-gray-700 text-sm">
                      АО «Москоллектор» оказывает услуги по разработке проектно-сметной документации (ПСД) на прокладку, врезку и демонтаж кабельных линий и трубопроводов в коммуникационных коллекторах, а также по сопровождению согласования ПСД с эксплуатирующей организацией.
                    </p>
                    <div>
                      <p className="font-semibold text-[#0a1628] mb-2">Перечень работ:</p>
                      <ul className="space-y-1.5 text-gray-600 text-sm">
                        <li>• Разработка ПСД на прокладку кабельных линий и трубопроводов в коллекторах</li>
                        <li>• Разработка ПСД на демонтаж кабельных линий и трубопроводов</li>
                        <li>• Разработка сметной документации в соответствии с действующими расценками</li>
                        <li>• Согласование ПСД и проектов производства работ (ППР)</li>
                        <li>• Авторский надзор за реализацией проектных решений</li>
                      </ul>
                    </div>
                    <div className="space-y-2 text-gray-700 text-sm">
                      <p><strong>Срок:</strong> определяется по согласованию сторон, после оплаты счёта.</p>
                      <p><strong>Что получает потребитель:</strong> комплект проектно-сметной документации в соответствии с условиями договора.</p>
                      <p>
                        Для оказания услуги необходимо заполнить письмо-заявку по Форме 50 (на разработку ПСД) либо Форме 51 (на согласование ПСД) и предоставить нарочно по адресу: ул. Лобачика, д. 4, кабинет 303.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <DownloadButton file="ФОРМА-50.doc" label="Форма 50 — разработка ПСД" />
                      <DownloadButton file="ФОРМА-51.doc" label="Форма 51 — согласование ПСД" />
                      <DownloadButton file="Регламент-согласования-ПСД.docx" label="Регламент согласования ПСД" />
                    </div>
                  </div>
                </Accordion>

                <Accordion title="Строительно-монтажные работы" defaultOpen={false}>
                  <div className="p-5 bg-white rounded-xl border border-gray-200 space-y-4">
                    <p className="text-gray-700 text-sm">
                      АО «Москоллектор» выполняет полный комплекс строительно-монтажных работ (СМР) в коммуникационных коллекторах города Москвы. Работы выполняются собственным аттестованным персоналом с использованием специальной техники и в соответствии с требованиями нормативных документов и правил техники безопасности при работах в подземных сооружениях.
                    </p>
                    <div>
                      <p className="font-semibold text-[#0a1628] mb-2">Виды СМР:</p>
                      <ul className="space-y-1.5 text-sm text-gray-600">
                        <li>• Прокладка силовых кабелей в коллекторах</li>
                        <li>• Прокладка кабелей связи и оптоволоконных кабелей</li>
                        <li>• Прокладка трубопроводов теплосети и водопровода</li>
                        <li>• Демонтаж кабельных линий и трубопроводов</li>
                        <li>• Врезка кабельных линий в действующие коммуникации</li>
                        <li>• Ремонтные и аварийно-восстановительные работы</li>
                        <li>• Монтаж кабельных конструкций, кронштейнов, опор</li>
                      </ul>
                    </div>
                    <div className="space-y-2 text-gray-700 text-sm">
                      <p><strong>Срок:</strong> определяется по согласованию сторон, после оплаты счёта.</p>
                      <p><strong>Что получает потребитель:</strong> акт о выполнении работ, исполнительная документация, акт приёмки-передачи коммуникаций.</p>
                      <p>
                        Для оказания услуги необходимо заполнить письмо-заявку по Форме 52 и предоставить нарочно по адресу: ул. Лобачика, д. 4, кабинет 303.
                      </p>
                    </div>
                    <div className="pt-1">
                      <DownloadButton file="ФОРМА-52.doc" label="Форма 52 — заявка на СМР" />
                    </div>
                  </div>
                </Accordion>

                <Accordion title="Копирование исполнительной документации" defaultOpen={false}>
                  <div className="p-5 bg-white rounded-xl border border-gray-200">
                    <div className="space-y-2 text-gray-700 text-sm mb-4">
                      <p><strong>Срок:</strong> 1 рабочий день с момента оплаты счёта.</p>
                      <p><strong>Что получает потребитель:</strong> копии исполнительной документации (план, профиль коллектора, разрезы). Форматы: А0–А4.</p>
                      <p>Для получения копии исполнительной документации необходимо заполнить письмо-заявку по Форме 47. Документы должны быть представлены нарочно на бумажном носителе по адресу: ул. Лобачика, д. 4, кабинет 303.</p>
                    </div>
                    <DownloadButton file="ФОРМА-47.doc" label="Форма 47" />
                  </div>
                </Accordion>

                <Accordion title="Сопровождение демонтажа кабельных линий связи" defaultOpen={false}>
                  <div className="p-5 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-700 text-sm mb-4">
                      АО «Москоллектор» оказывает комплексную услугу по сопровождению демонтажа кабельных линий связи в коллекторах. Для получения коммерческого предложения на оказание данной услуги заполните письмо-заявку по Форме 53 и подайте нарочно по адресу: ул. Лобачика, д. 4, кабинет 303.
                    </p>
                    <DownloadButton file="ФОРМА-53.doc" label="Форма 53" />
                  </div>
                </Accordion>

                <Accordion title="Консультационные услуги" defaultOpen={false}>
                  <div className="p-5 bg-white rounded-xl border border-gray-200">
                    <div className="space-y-2 text-gray-700 text-sm mb-4">
                      <p><strong>Срок:</strong> по согласованию, с момента оплаты счёта.</p>
                      <p><strong>Что получает потребитель:</strong> письменную консультацию специалистов АО «Москоллектор» по вопросам размещения и эксплуатации коммуникаций в коллекторах.</p>
                      <p>Для получения услуги необходимо заполнить письмо-заявку по Форме 46. Документы должны быть представлены нарочно на бумажном носителе по адресу: ул. Лобачика, д. 4, кабинет 303.</p>
                    </div>
                    <DownloadButton file="ФОРМА-46.doc" label="Форма 46" />
                  </div>
                </Accordion>

                <Accordion title="Отчёт по протяжённости коммуникаций" defaultOpen={false}>
                  <div className="p-5 bg-white rounded-xl border border-gray-200">
                    <div className="space-y-2 text-gray-700 text-sm mb-4">
                      <p><strong>Срок:</strong> 10 рабочих дней с момента оплаты счёта.</p>
                      <p><strong>Что получает потребитель:</strong> отчёт о протяжённости инженерных коммуникаций, эксплуатируемых в коллекторах АО «Москоллектор».</p>
                      <p>Для получения услуги необходимо заполнить письмо-заявку по Форме 59. Документы должны быть представлены нарочно на бумажном носителе по адресу: ул. Лобачика, д. 4, кабинет 303.</p>
                    </div>
                    <DownloadButton file="Форма-59.doc" label="Форма 59" />
                  </div>
                </Accordion>

                <Accordion title="Стоимость коммерческих услуг" defaultOpen={true}>
                  <div className="p-5 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500 text-sm mb-4">
                      Действуют с 22.01.2026. Утверждены приказом АО «Москоллектор» от 22.01.2026 № 12.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#0a1628] text-white">
                            <th className="text-left px-3 py-3 font-semibold rounded-tl-lg">№</th>
                            <th className="text-left px-3 py-3 font-semibold">Вид услуги</th>
                            <th className="text-center px-3 py-3 font-semibold">Ед. изм.</th>
                            <th className="text-right px-3 py-3 font-semibold">Без НДС, ₽</th>
                            <th className="text-right px-3 py-3 font-semibold rounded-tr-lg">С НДС, ₽</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {[
                            ['1', 'Проектирование прокладки/демонтажа силового кабеля, 0–100 м', '1 шт.', '69 734,87', '85 076,54'],
                            ['2', 'Проектирование прокладки/демонтажа силового кабеля, 100–500 м', '1 шт.', '120 905,00', '147 504,10'],
                            ['3', 'Проектирование прокладки/демонтажа силового кабеля, 500–1000 м', '1 шт.', '153 510,21', '187 282,46'],
                            ['4', 'Проектирование прокладки/демонтажа силового кабеля, 1000–2000 м', '1 шт.', '197 139,89', '240 510,67'],
                            ['5', 'Проектирование прокладки/демонтажа силового кабеля, 2000–3000 м', '1 шт.', '286 310,09', '349 298,31'],
                            ['6', 'Проектирование прокладки/демонтажа силового кабеля за каждые 1000 м к п. 5', '1 шт.', '153 510,21', '187 282,46'],
                            ['7', 'Проектирование прокладки слаботочного кабеля, 0–100 м', '1 шт.', '52 657,24', '64 241,83'],
                            ['8', 'Проектирование прокладки слаботочного кабеля, 100–500 м', '1 шт.', '64 995,67', '79 294,72'],
                            ['9', 'Проектирование прокладки слаботочного кабеля, 500–1000 м', '1 шт.', '78 102,26', '95 284,76'],
                            ['10', 'Проектирование прокладки слаботочного кабеля, 1000–2000 м', '1 шт.', '101 711,20', '124 087,66'],
                            ['11', 'Проектирование прокладки слаботочного кабеля, 2000–3000 м', '1 шт.', '115 757,39', '141 224,02'],
                            ['12', 'Проектирование прокладки слаботочного кабеля за каждые 1000 м к п. 11', '1 шт.', '78 102,26', '95 284,76'],
                            ['13', 'Проектирование демонтажа слаботочного кабеля, 0–100 м', '1 шт.', '69 563,44', '84 867,40'],
                            ['14', 'Проектирование демонтажа слаботочного кабеля, 100–500 м', '1 шт.', '124 685,51', '152 116,32'],
                            ['15', 'Проектирование демонтажа слаботочного кабеля, 500–1000 м', '1 шт.', '149 403,01', '182 271,67'],
                            ['16', 'Проектирование демонтажа слаботочного кабеля, 1000–2000 м', '1 шт.', '186 473,71', '227 497,93'],
                            ['17', 'Проектирование демонтажа слаботочного кабеля, 2000–3000 м', '1 шт.', '221 180,28', '269 839,94'],
                            ['18', 'Проектирование демонтажа слаботочного кабеля за каждые 1000 м к п. 15', '1 шт.', '149 403,01', '182 271,67'],
                            ['19', 'Консультационные услуги по проектированию', '1 шт.', '27 667,15', '33 753,92'],
                            ['20', 'Подборка документов в архиве для копирования документации', '1 шт.', '2 010,01', '2 452,21'],
                            ['21', 'Копирование документации формата А0', '1 шт.', '482,68', '588,87'],
                            ['22', 'Копирование документации формата А1', '1 шт.', '284,25', '346,79'],
                            ['23', 'Копирование документации формата А3', '1 шт.', '125,77', '153,44'],
                            ['24', 'Копирование документации формата А4', '1 шт.', '86,47', '105,49'],
                            ['25', 'Выдача дубликата ордера на выполнение работ по прокладке (врезке) коммуникаций', '1 шт.', '1 100,40', '1 342,49'],
                            ['26', 'Выдача дубликата ордера на выполнение работ по демонтажу коммуникаций', '1 шт.', '1 250,85', '1 526,04'],
                            ['27', 'Выдача дубликата договора на услуги по технической эксплуатации коллекторов', '1 шт.', '2 285,24', '2 787,99'],
                            ['28', 'Выдача дубликата доп. соглашения к договору на техэксплуатацию', '1 шт.', '1 965,51', '2 397,92'],
                            ['29', 'Выдача дубликата акта о выполнении работ, акта приёмки-передачи коммуникаций', '1 шт.', '1 984,31', '2 420,86'],
                            ['30', 'Выдача дубликата акта инвентаризации коммуникаций', '1 шт.', '1 466,98', '1 789,72'],
                            ['31', 'Выдача дубликата счёта, счёта-фактуры, акта об оказанных услугах', '1 шт.', '1 062,77', '1 296,58'],
                            ['32', 'Выдача дубликата ТУ / листа согласования проекта', '1 шт.', '2 431,90', '2 966,92'],
                            ['33', 'Выдача дубликата договора на сохранность', '1 шт.', '1 611,84', '1 966,44'],
                            ['34', 'Продление ТУ на прокладку кабельных линий связи, оптики, теплосети и водопровода', '1 шт.', '5 616,53', '6 852,17'],
                            ['35', 'Продление ТУ и согласования ПД на прокладку кабельных линий связи, оптики, теплосети и водопровода', '1 шт.', '9 846,35', '12 012,55'],
                            ['36', 'Продление ТУ на прокладку силовых кабельных линий', '1 шт.', '10 813,69', '13 192,70'],
                            ['37', 'Продление ТУ и согласования ПД на прокладку силовых кабельных линий', '1 шт.', '15 345,66', '18 721,71'],
                            ['38', 'Продление ТУ на демонтаж инженерных коммуникаций', '1 шт.', '6 587,67', '8 036,96'],
                            ['39', 'Продление ТУ и согласования ПД на демонтаж инженерных коммуникаций', '1 шт.', '10 385,87', '12 670,76'],
                            ['40', 'Предоставление отчёта по протяжённости коммуникаций (за 1000 п.м)', '1 шт.', '1 871,46', '2 283,18'],
                          ].map((row) => (
                            <tr key={row[0]} className="hover:bg-gray-50">
                              <td className="px-3 py-2.5 text-gray-500 align-top">{row[0]}</td>
                              <td className="px-3 py-2.5 text-gray-700 align-top">{row[1]}</td>
                              <td className="px-3 py-2.5 text-center text-gray-600 align-top whitespace-nowrap">{row[2]}</td>
                              <td className="px-3 py-2.5 text-right text-gray-700 font-medium align-top whitespace-nowrap">{row[3]}</td>
                              <td className="px-3 py-2.5 text-right text-[#0a1628] font-semibold align-top whitespace-nowrap">{row[4]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Accordion>
              </div>

              <div className="mt-6 bg-gradient-to-r from-[#0ea5e9]/10 to-[#0ea5e9]/5 rounded-2xl p-6 border border-[#0ea5e9]/20">
                <h3 className="text-lg font-bold text-[#0a1628] mb-2">Запрос на коммерческие предложения</h3>
                <p className="text-gray-600 mb-4">На комплексные услуги по проектированию и строительно-монтажным работам</p>
                <Link to="/contacts">
                  <Button className="bg-[#0ea5e9] hover:bg-[#3a8eef] text-white">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Отправить запрос
                  </Button>
                </Link>
              </div>
            </section>
            
            {/* Section 4: Other services */}
            <section 
              ref={el => { sectionRefs.current['other'] = el; }}
              id="other" 
              className="mb-16 scroll-mt-28"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
                  <Circle className="w-6 h-6 text-[#0ea5e9]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0a1628]">Прочие услуги</h2>
              </div>

              {/* #41 ОРУ — общий порядок получения прочих услуг */}
              <div className="mb-6 bg-white border border-gray-200 rounded-2xl p-5 md:p-6 space-y-3 text-sm">
                <p className="text-gray-700">
                  Для оказания услуги необходимо заполнить форму письма-заявки и предоставить нарочно на бумажном носителе в Центр обслуживания потребителей.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#0ea5e9] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#0a1628]">Куда подавать:</p>
                      <p className="text-gray-700">ул. Лобачика, д. 4, каб. 303</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-[#0ea5e9] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#0a1628]">Получение документов:</p>
                      <p className="text-gray-700">ул. Лобачика, д. 4, каб. 303 (по доверенности)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Accordion title="Инвентаризация коммуникаций">
                  <p className="text-gray-600 mb-3">Допуск оформляется по Форме 45</p>
                  <div className="flex flex-wrap gap-2">
                    <DownloadButton file="Форма-45.doc" label="Форма 45" />
                  </div>
                </Accordion>
                
                <Accordion title="Аннулирование технических условий">
                  <p className="text-gray-700 mb-2">
                    Форма 60 — на аннулирование технических условий на прокладку / врезку / демонтаж коммуникаций.
                  </p>
                  <p className="text-gray-600 mb-3">Подать нарочно: ул. Лобачика, д. 4, каб. 303</p>
                  <DownloadButton file="ФОРМА-60.doc" label="Форма 60" />
                </Accordion>

                <Accordion title="Аннулирование ТУ и согласования проекта">
                  <p className="text-gray-700 mb-2">
                    Форма 61 — об аннулировании ТУ и согласования проекта на прокладку / врезку / демонтаж коммуникаций.
                  </p>
                  <p className="text-gray-600 mb-3">Подать нарочно: ул. Лобачика, д. 4, каб. 303</p>
                  <DownloadButton file="ФОРМА-61.doc" label="Форма 61" />
                </Accordion>

                <Accordion title="Аннулирование ордера">
                  <p className="text-gray-600 mb-3">Подать: ул. Лобачика, д. 4, каб. 303</p>
                  <p className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3">Бесплатная услуга</p>
                  <div><DownloadButton file="ФОРМА-49.doc" label="Форма 49" /></div>
                </Accordion>
                
                <Accordion title="Приёмка-передача коммуникаций">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                      <p className="font-semibold text-[#0a1628] mb-2">Оптико-волоконные кабели / кабели связи / силовые кабели</p>
                      <DownloadButton file="ФОРМА-50.doc" label="Форма 50" />
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                      <p className="font-semibold text-[#0a1628] mb-2">Трубопроводы теплосети / водопровода</p>
                      <DownloadButton file="ФОРМА-51.doc" label="Форма 51" />
                    </div>
                  </div>
                </Accordion>
                
                <Accordion title="Продление / переоформление ордера">
                  <DownloadButton file="ФОРМА-52.doc" label="Форма 52" />
                </Accordion>
                
              </div>
            </section>
            
            {/* Section 5: Tariffs */}
            <section 
              ref={el => { sectionRefs.current['tariffs'] = el; }}
              id="tariffs" 
              className="mb-16 scroll-mt-28"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-[#0ea5e9]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0a1628]">Тарифы и цены</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                  <h3 className="text-xl font-bold text-[#0a1628] mb-2">
                    Тарифы на услуги по технической эксплуатации коммуникационных коллекторов на 2026 год
                  </h3>
                  <p className="text-gray-500 text-sm mb-1">
                    Действуют с 01.01.2026. Утверждены приказом АО «Москоллектор» от 17.12.2025 № 612.
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    Цены на дополнительные услуги введены с 22.01.2026 приказом АО «Москоллектор» от 22.01.2026 № 12.
                  </p>

                  <Accordion title="Трубопроводы теплосети (по диаметру)" defaultOpen={true}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#0a1628] text-white">
                            <th className="text-left px-4 py-3 font-semibold rounded-tl-lg">Диаметр трубопровода</th>
                            <th className="text-right px-4 py-3 font-semibold rounded-tr-lg">Тариф, руб./п.м./мес. (без НДС)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {[
                            ['до 100 мм', '58,47'],
                            ['от 100 до 200 мм', '87,71'],
                            ['от 200 до 400 мм', '116,95'],
                            ['от 400 до 600 мм', '175,42'],
                            ['от 600 до 800 мм', '233,89'],
                            ['от 800 до 1000 мм', '292,37'],
                            ['свыше 1000 мм', '350,84'],
                          ].map(([diameter, price]) => (
                            <tr key={diameter} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-700">{diameter}</td>
                              <td className="px-4 py-3 text-right font-semibold text-[#0a1628]">{price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Accordion>

                  <Accordion title="Трубопроводы водопровода (по диаметру)">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#0a1628] text-white">
                            <th className="text-left px-4 py-3 font-semibold rounded-tl-lg">Диаметр трубопровода</th>
                            <th className="text-right px-4 py-3 font-semibold rounded-tr-lg">Тариф, руб./п.м./мес. (без НДС)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {[
                            ['до 100 мм', '29,24'],
                            ['от 100 до 200 мм', '43,85'],
                            ['от 200 до 400 мм', '58,47'],
                            ['от 400 до 600 мм', '87,71'],
                            ['от 600 до 800 мм', '116,95'],
                            ['от 800 до 1000 мм', '146,18'],
                            ['свыше 1000 мм', '175,42'],
                          ].map(([diameter, price]) => (
                            <tr key={diameter} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-700">{diameter}</td>
                              <td className="px-4 py-3 text-right font-semibold text-[#0a1628]">{price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Accordion>

                  <Accordion title="Кабельные линии (по типу)">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#0a1628] text-white">
                            <th className="text-left px-4 py-3 font-semibold rounded-tl-lg">Тип кабеля</th>
                            <th className="text-right px-4 py-3 font-semibold rounded-tr-lg">Тариф, руб./п.м./мес. (без НДС)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {[
                            ['Оптико-волоконный кабель', '4,68'],
                            ['Кабель связи', '4,68'],
                            ['Силовой кабель до 10 кВ', '7,02'],
                            ['Силовой кабель от 10 до 35 кВ', '9,35'],
                            ['Силовой кабель от 35 до 110 кВ', '14,03'],
                            ['Силовой кабель свыше 110 кВ', '18,71'],
                          ].map(([type, price]) => (
                            <tr key={type} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-700">{type}</td>
                              <td className="px-4 py-3 text-right font-semibold text-[#0a1628]">{price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Accordion>

                  <Accordion title="Внутриквартальные коллекторы">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#0a1628] text-white">
                            <th className="text-left px-4 py-3 font-semibold rounded-tl-lg">Вид коммуникации</th>
                            <th className="text-right px-4 py-3 font-semibold rounded-tr-lg">Тариф, руб./п.м./мес. (без НДС)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {[
                            ['Трубопровод теплосети (любой диаметр)', '43,85'],
                            ['Трубопровод водопровода (любой диаметр)', '21,93'],
                            ['Кабельная линия (любой тип)', '3,51'],
                          ].map(([type, price]) => (
                            <tr key={type} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-700">{type}</td>
                              <td className="px-4 py-3 text-right font-semibold text-[#0a1628]">{price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Accordion>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to="/calculator">
                      <Button className="bg-[#0ea5e9] hover:bg-[#3a8eef] text-white px-6 py-3">
                        <Calculator className="w-5 h-5 mr-2" />
                        Тарифный калькулятор
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-blue-800 text-sm mb-2">
                      <strong>Примечания:</strong>
                    </p>
                    <ul className="text-blue-800 text-sm space-y-1.5">
                      <li>* Тариф принят для трассы в две нитки. При прокладках трассы в одну нитку к принятому тарифу применяется коэффициент 0,5.</li>
                      <li>** При отклонении диаметров трубопроводов от указанных в таблице применяется тариф для ближайшего трубопровода большего диаметра.</li>
                      <li>*** Тариф на водопровод применяется для труб канализации соответствующего диаметра.</li>
                      <li>**** Тариф принят для кабелей в три нитки.</li>
                      <li>***** Тариф измеряется в руб./шт. в год.</li>
                      <li>****** Тариф на прочие кабели применяется, в том числе для шлангов высокого давления и трубопроводов под кабель.</li>
                      <li>******* Тариф на трубопроводы холодного водоснабжения применяется, в том числе для трубопроводов мусоропровода.</li>
                    </ul>
                  </div>
                </div>

                {/* #42 ОРУ — Дополнительные услуги вынесены в отдельный блок */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                  <h3 className="text-xl font-bold text-[#0a1628] mb-2">
                    Дополнительные услуги
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Цены на дополнительные услуги установлены приказом АО «Москоллектор» от 22.01.2026 № 12. Действуют с 22.01.2026.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#0a1628] text-white">
                          <th className="text-left px-4 py-3 font-semibold rounded-tl-lg">Услуга</th>
                          <th className="text-right px-4 py-3 font-semibold rounded-tr-lg">Стоимость</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700">Оформление ордера на работы</td>
                          <td className="px-4 py-3 text-right font-semibold text-emerald-700">Бесплатно</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700">Аннулирование ордера</td>
                          <td className="px-4 py-3 text-right font-semibold text-emerald-700">Бесплатно</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700">Прочие дополнительные услуги</td>
                          <td className="px-4 py-3 text-right text-gray-600">по приказу №12 от 22.01.2026</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-gray-500 text-xs mt-4">
                    Для уточнения актуальной стоимости воспользуйтесь тарифным калькулятором или обратитесь в Центр обслуживания потребителей.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Documentation */}
            <section 
              ref={el => { sectionRefs.current['docs'] = el; }}
              id="docs" 
              className="mb-16 scroll-mt-28"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-[#0ea5e9]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0a1628]">Разрешительная документация</h2>
              </div>
              
              <div className="space-y-4">
                <Accordion title="Прокладка (врезка) инженерных коммуникаций в коллекторах">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#0a1628] text-white">
                          <th className="text-left px-4 py-3 font-semibold">Шаг</th>
                          <th className="text-left px-4 py-3 font-semibold">Наименование документа / номер формы</th>
                          <th className="text-left px-4 py-3 font-semibold">Заявитель</th>
                          <th className="text-left px-4 py-3 font-semibold">Срок</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">1</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Технические условия на прокладку/врезку инженерных коммуникаций. Форма 10.1 / 11.1 / 11.3 (в зависимости от вида коммуникаций)</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Потребитель услуг, заказчик работ, подрядчик или проектировщик (в интересах потребителя)</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">2</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Согласование проекта на прокладку/врезку. Форма 25</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Проектировщик (в интересах потребителя)</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">3</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Согласование проекта производства работ (ППР) — только для трубопроводов. Форма 26</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Подрядчик по договору на СМР (в интересах потребителя)</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">4</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Договор на сохранность строительных конструкций коллекторов. Форма 15</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Подрядчик по договору на СМР (в интересах потребителя)</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">2 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">5</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Договор (дополнительное соглашение) на услуги по технической эксплуатации коллекторов; выдача ордера. Форма 1 или 1.1 (при установке металлоконструкций типа полка-консоль силами АО «Москоллектор»)</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Потребитель услуг / лицо, намеревающееся заключить договор</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">15 раб. дн. (в 2 этапа)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">6</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Допуск (списки) сотрудников в коллекторы. Форма 32 / 33 (письмо), 38 (список работников), 39 (список коллекторов)</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Потребитель услуг (владелец коммуникаций)</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">7</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Акт о выполнении работ по прокладке/врезке/демонтажу. Форма 3 или 4 (в зависимости от вида коммуникаций)</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Потребитель услуг / подрядчик (в интересах потребителя)</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Accordion>

                <Accordion title="Прокладка и демонтаж инженерных коммуникаций по государственному заказу">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#0a1628] text-white">
                          <th className="text-left px-4 py-3 font-semibold">Шаг</th>
                          <th className="text-left px-4 py-3 font-semibold">Документ / номер формы</th>
                          <th className="text-left px-4 py-3 font-semibold">Заявитель</th>
                          <th className="text-left px-4 py-3 font-semibold">Срок</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">1</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Технические условия. Форма 10.2 или 11.2</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Государственный заказчик / генеральная подрядная организация</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">2</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Согласование проекта. Форма 25</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Проектировщик (в интересах заказчика)</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">3</td>
                          <td className="px-4 py-3 text-gray-700 align-top">ППР — только для трубопроводов. Форма 26</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Подрядчик по договору на СМР</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">4</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Договор на сохранность. Форма 15</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Подрядчик по договору на СМР</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">2 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">5</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Ордер на выполнение работ. Форма 5</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Государственный заказчик / генеральная подрядная организация</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">5 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">6</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Допуск (списки) сотрудников. Форма 32 / 33, 38, 39</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Государственный заказчик / генеральная подрядная организация</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">7</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Акт о выполнении работ (комплектом на демонтаж и прокладку). Форма 3 или 4</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Заказчик / генеральная подрядная организация / подрядчик</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Accordion>

                <Accordion title="Перекладка инженерных коммуникаций">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#0a1628] text-white">
                          <th className="text-left px-4 py-3 font-semibold">Шаг</th>
                          <th className="text-left px-4 py-3 font-semibold">Документ / номер формы</th>
                          <th className="text-left px-4 py-3 font-semibold">Заявитель</th>
                          <th className="text-left px-4 py-3 font-semibold">Срок</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">1</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Технические условия на прокладку и демонтаж. Форма 10.4 или 11.5</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Потребитель услуг (владелец коммуникаций)</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">2</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Согласование проекта. Форма 25</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Проектировщик (в интересах потребителя)</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">3</td>
                          <td className="px-4 py-3 text-gray-700 align-top">ППР — только для трубопроводов. Форма 26</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Подрядчик по договору на СМР</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">4</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Договор на сохранность. Форма 15</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Подрядчик по договору на СМР</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">2 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">5</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Ордер на прокладку и демонтаж. Форма 5</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Потребитель услуг (владелец коммуникаций)</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">5 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">6</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Допуск (списки) сотрудников. Форма 32 / 33, 38, 39</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Потребитель услуг (владелец коммуникаций)</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">7</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Акт о выполнении работ (комплектом). Форма 3 или 4</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Потребитель услуг / подрядчик (в интересах потребителя)</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Accordion>

                <Accordion title="Демонтаж инженерных коммуникаций">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#0a1628] text-white">
                          <th className="text-left px-4 py-3 font-semibold">Шаг</th>
                          <th className="text-left px-4 py-3 font-semibold">Документ / номер формы</th>
                          <th className="text-left px-4 py-3 font-semibold">Заявитель</th>
                          <th className="text-left px-4 py-3 font-semibold">Срок</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">1</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Технические условия на демонтаж. Форма 10.3 или 11.4</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Заказчик работ / городская организация / генеральная подрядная организация</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">2</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Согласование проекта. Форма 25</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Проектировщик (в интересах потребителя)</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">3</td>
                          <td className="px-4 py-3 text-gray-700 align-top">ППР — только для трубопроводов. Форма 26</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Подрядчик по договору на СМР</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">4</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Договор на сохранность. Форма 15</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Подрядчик по договору на СМР</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">2 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">5</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Ордер на демонтаж. Форма 5</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Потребитель услуг (владелец коммуникаций)</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">5 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">6</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Допуск (списки) сотрудников. Форма 32 / 33, 38, 39</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Потребитель услуг (владелец коммуникаций)</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700 align-top">7</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Акт о выполнении работ по демонтажу. Форма 3 или 4</td>
                          <td className="px-4 py-3 text-gray-700 align-top">Потребитель услуг (владелец коммуникаций) / подрядчик</td>
                          <td className="px-4 py-3 text-gray-700 align-top whitespace-nowrap">10 раб. дн.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Accordion>

                <Accordion title="Сроки оформления документации на оптико-волоконный кабель">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="text-left px-4 py-3 font-semibold text-[#0a1628]">Этап</th>
                          <th className="text-right px-4 py-3 font-semibold text-[#0a1628]">Срок</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Технические условия (ТУ) — Форма 10.1</td>
                          <td className="px-4 py-3 text-right font-semibold">5 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Согласование проекта (СП) — Форма 25</td>
                          <td className="px-4 py-3 text-right font-semibold">5 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Договор на сохранность — Форма 15</td>
                          <td className="px-4 py-3 text-right font-semibold">2 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Ордер на выполнение работ — Форма 1 / 1.1</td>
                          <td className="px-4 py-3 text-right font-semibold">3 раб. дн.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Допуск (списки) сотрудников — Форма 32, 33, 38, 39</td>
                          <td className="px-4 py-3 text-right font-semibold">5 раб. дн.</td>
                        </tr>
                        <tr className="bg-sky-50">
                          <td className="px-4 py-3 font-bold text-[#0a1628]">ИТОГО</td>
                          <td className="px-4 py-3 text-right font-bold text-[#0a1628]">20 раб. дн.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Accordion>
              </div>
            </section>
            
            {/* Section 7: Contracts */}
            <section 
              ref={el => { sectionRefs.current['contracts'] = el; }}
              id="contracts" 
              className="mb-16 scroll-mt-28"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#0ea5e9]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0a1628]">Типовые формы договоров</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { name: 'Договор на техэксплуатацию коллекторов', file: '/docs/consumers/1.-Договор-на-услуги-по-технической-эксплуатации-коллекторов.pdf', color: 'bg-[#0a1628]' },
                  { name: 'Договор на техэксплуатацию с ЭДО', file: '/docs/consumers/2.-Договор-на-услуги-по-технической-эксплуатации-коллекторов-с-ЭДО.pdf', color: 'bg-[#142138]' },
                  { name: 'Госконтракт 44-ФЗ', file: '/docs/consumers/3.-Государственный-контракт-на-услуги-по-технической-эксплуатации-коллекторов-по-44-ФЗ.pdf', color: 'bg-[#004d80]' },
                  { name: 'Госконтракт 44-ФЗ с ЭДО', file: '/docs/consumers/4.-Государственный-контракт-на-услуги-по-технической-эксплуатации-коллекторов-по-44-ФЗ-с-ЭДО.pdf', color: 'bg-[#005c99]' },
                  { name: 'Договор 223-ФЗ', file: '/docs/consumers/5.-Договор-на-услуги-по-технической-эксплуатации-коллекторов-по-223-ФЗ.pdf', color: 'bg-[#006bb3]' },
                  { name: 'Договор 223-ФЗ с ЭДО', file: '/docs/consumers/6.-Договор-на-услуги-по-технической-эксплуатации-коллекторов-по-223-ФЗ-с-ЭДО.pdf', color: 'bg-[#007acc]' },
                ].map((contract, i) => (
                  <a 
                    key={i} 
                    href={contract.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-[#0ea5e9]/30 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-lg ${contract.color} flex items-center justify-center flex-shrink-0`}>
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0a1628]">{contract.name}</p>
                      <p className="text-sm text-gray-500">PDF</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </a>
                ))}
                
                {[
                  { name: 'Договор на сохранность (Форма 15)', file: '/docs/consumers/Форма-15.docx', ext: 'DOCX' },
                  { name: 'Договор на сохранность для юридических лиц', file: '/docs/consumers/Договор-на-сохранность-юрлица.docx', ext: 'DOCX' },
                  { name: 'Договор на сохранность для физических лиц', file: '/docs/consumers/Договор-на-сохранность-физлица.docx', ext: 'DOCX' },
                  { name: 'Договор на сохранность (ОПС — охранная зона)', file: '/docs/consumers/Договор-на-сохранность-ОПС.docx', ext: 'DOCX' },
                ].map((contract, i) => (
                  <a
                    key={i}
                    href={contract.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-[#0ea5e9]/30 transition-all"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#0088e6] flex items-center justify-center flex-shrink-0">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0a1628]">{contract.name}</p>
                      <p className="text-sm text-gray-500">{contract.ext}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </section>
            
            {/* Section 8: Regulations */}
            <section 
              ref={el => { sectionRefs.current['regulations'] = el; }}
              id="regulations" 
              className="mb-16 scroll-mt-28"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#0ea5e9]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0a1628]">Регламентные документы</h2>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    name: 'Регламентная таблица АО «Москоллектор» (Приложение 2)',
                    file: '/docs/consumers/Регламентная-таблица-АО-Москоллектор-Приложение-2-.pdf',
                    desc: 'Порядок взаимодействия с потребителями'
                  },
                  {
                    name: 'Регламентная таблица (Приложение 3 с грифом СЕКРЕТНО)',
                    file: '/docs/consumers/Регламентная-таблица-АО-Москоллектор-с-грифом-СЕКРЕТНО-Приложение-3.pdf',
                    desc: 'Регламент для работы с конфиденциальной информацией'
                  },
                  {
                    name: 'Регламент допуска с использованием АИС АРМ-Контроль',
                    file: '/docs/consumers/Регламент-взаимодействия-подразделений-АО-Москоллектор-по-осуществлению-допуска-в-коллекторы-с-использованием-АИС-ARM-Контроль.pdf',
                    desc: 'Порядок оформления допуска через цифровой сервис'
                  },
                ].map((doc, i) => (
                  <a 
                    key={i}
                    href={doc.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-5 p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-[#0ea5e9]/30 transition-all"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0a1628] to-[#142138] flex items-center justify-center flex-shrink-0">
                      <Gavel className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0a1628] text-lg mb-1">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.desc}</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
