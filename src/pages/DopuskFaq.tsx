import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, HelpCircle, ArrowLeft } from 'lucide-react';

// Страница добавлена по правкам УРсП от 30.07 («Правки сайта.docx»):
// ответы на частые вопросы о допуске в рамках новой системы «АРМ Контроль».
const FAQ: { q: string; a: string }[] = [
  {
    q: 'Как и где можно получить УКЭП?',
    a: 'Получить УКЭП для ответственных сотрудников, действующих на основании доверенности, можно в любом аккредитованном удостоверяющем центре. Список аккредитованных удостоверяющих центров можно посмотреть на официальном сайте Минцифры.',
  },
  {
    q: 'Какую информацию и документы нужно будет предоставлять для оформления допуска?',
    a: 'Объем предоставляемой информации для оформления допуска через автоматизированную систему не отличается от объема информации, предоставляемой в действующем порядке, отличие в том, что информация будет предоставляться в электронном виде.',
  },
  {
    q: 'Как подавать заявки?',
    a: 'Система предусматривает стандартизированные формы для ввода информации. Данные, введенные в формы, подписываются УКЭП и отправляются в работу.',
  },
  {
    q: 'Требуется ли дополнительная настройка рабочего места для работы с системой?',
    a: 'Установка дополнительного ПО на рабочее место сотрудника для работы в личном кабинете системы по оформлению допуска не требуется (за исключением ПО для работы с УКЭП; для работы с УКЭП требуется настройка рабочего места в соответствии с инструкцией удостоверяющего центра, выдавшего УКЭП). Работа в системе осуществляется через браузер. Рабочее место сотрудника требует подключение к интернету.',
  },
  {
    q: 'Кому нужно регистрироваться в системе: владельцам коммуникаций или подрядным организациям?',
    a: 'Для работы в системе каждая организация регистрируется и получает доступ в личный кабинет (в том числе организации-владельцы коммуникаций и подрядные организации).',
  },
  {
    q: 'Как регистрироваться организации, если она может быть и владельцем коммуникаций, и выступать в роли подрядчика?',
    a: 'Статус организации (владелец коммуникаций или подрядчик) может меняться и определяется в каждой поданной заявке, в зависимости от заполненных данных.',
  },
  {
    q: 'У кого должны быть УКЭП для подачи заявок?',
    a: 'Для работы в системе УКЭП должны быть у ответственных сотрудников владельцев коммуникаций и у ответственных сотрудников подрядных организаций.',
  },
  {
    q: 'Останется ли возможность подавать списки на бумаге?',
    a: 'Система предусматривает только электронные заявки. Возможность альтернативного способа подачи заявок будет рассмотрена в индивидуальном порядке дополнительно.',
  },
  {
    q: 'Какие УКЭП подойдут для работы в системе?',
    a: 'Если действующими УКЭП сотрудников можно подписать юридически значимые документы, то их можно использовать в системе.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 hover:bg-slate-50 transition-colors text-left"
      >
        <span className="font-semibold text-[#0a1628]">{q}</span>
        <ChevronRight className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 text-gray-600 text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
          <p className="pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function DopuskFaq() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Ответы на частые вопросы
          </h1>
          <p className="text-white/70 text-lg max-w-3xl leading-relaxed">
            Ответы на основные вопросы о допуске сотрудников потребителей и/или подрядчиков
            на объекты коллекторного хозяйства в рамках новой системы «АРМ Контроль»
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-sky-600" />
          </div>
          <p className="text-gray-600">
            Оформление допуска осуществляется через цифровой сервис{' '}
            <a href="https://dopusk.moscollector.ru/" target="_blank" rel="noopener noreferrer" className="text-sky-600 font-medium hover:underline">
              dopusk.moscollector.ru
            </a>
          </p>
        </div>

        <div className="space-y-3">
          {FAQ.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>

        <Link
          to="/consumers#dopusk"
          className="inline-flex items-center gap-2 mt-10 text-sky-600 font-medium hover:text-[#0a1628] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться к разделу «Допуск в коллектор»
        </Link>
      </div>
    </div>
  );
}
