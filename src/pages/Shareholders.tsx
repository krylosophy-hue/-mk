import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, TrendingUp, Users, Calendar, Download, ChevronDown } from 'lucide-react';
import { documentsShareholders, shareholderMeetings, type ShareholderMeeting } from '@/lib/content';
import { asset } from '@/lib/utils';

// CMS-managed: документы — /admin/ коллекция «Документы для акционеров»
// собрания — /admin/ коллекция «Собрания акционеров»
const documents = documentsShareholders.map((d) => ({
  title: d.title,
  file: d.file.startsWith('http') || d.file.startsWith('/-mk') ? d.file : asset(d.file),
}));

// Сколько последних собраний видно до нажатия «Подробнее»
const VISIBLE_MEETINGS = 4;

// «30 сентября 2026» → время; нераспознанная дата уходит в конец списка.
// Префикс «мар» должен стоять раньше «ма» (мая/май).
const MONTH_PREFIXES = ['янв', 'фев', 'мар', 'апр', 'ма', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
function meetingTime(date: string): number {
  const m = date.trim().toLowerCase().match(/^(\d{1,2})\s+([а-яё]+)\s+(\d{4})/);
  if (!m) return -Infinity;
  const month = MONTH_PREFIXES.findIndex((p) => m[2].startsWith(p));
  return month < 0 ? -Infinity : Date.UTC(Number(m[3]), month, Number(m[1]));
}

// Новые сверху независимо от того, куда редактор добавил запись в админке
const meetings = [...shareholderMeetings].sort((a, b) => meetingTime(b.date) - meetingTime(a.date));

function MeetingRow({ meeting, last }: { meeting: ShareholderMeeting; last: boolean }) {
  return (
    <div className={last ? '' : 'border-b border-gray-100 pb-4'}>
      <div className="text-sm font-semibold text-sky-600 mb-1">{meeting.date}</div>
      <div className="text-sm text-[#0a1628] mb-1">{meeting.type}</div>
      <span className="inline-flex items-center text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
        {meeting.status}
      </span>
    </div>
  );
}

export default function Shareholders() {
  const [showAllMeetings, setShowAllMeetings] = useState(false);
  const firstMeetings = meetings.slice(0, VISIBLE_MEETINGS);
  const moreMeetings = meetings.slice(VISIBLE_MEETINGS);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="accent-bar mb-6" />
          <h1 className="font-heading">Акционерам</h1>
          <p>
            Информация для акционеров АО «Москоллектор»: отчётность, документы, собрания
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {[
            { icon: FileText, title: 'Отчётность', desc: 'Годовые отчёты и бухгалтерская отчётность' },
            { icon: Users, title: 'Собрания', desc: 'Информация о собраниях акционеров' },
            { icon: TrendingUp, title: 'Дивиденды', desc: 'Информация о выплате дивидендов' },
          ].map((item) => (
            <div key={item.title} className="card-modern rounded-2xl p-7">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center mb-5">
                <item.icon className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="font-bold font-heading text-[#0a1628] mb-1.5">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left Column - Documents */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-sky-600" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">
                  Учредительные документы
                </h2>
              </div>
              <div className="card-modern rounded-2xl overflow-hidden">
                {documents.map((doc, index) => (
                  <div
                    key={doc.title}
                    className={`flex items-center justify-between p-5 ${index !== documents.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50/60 transition-colors`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-sky-400" />
                      </div>
                      {/* #15 — убрана подпись с датой и размером под названием документа */}
                      <h4 className="font-medium text-[#0a1628]">{doc.title}</h4>
                    </div>
                    {/* #16 — единый стиль кнопки «Скачать» */}
                    <a href={doc.file} target="_blank" rel="noopener noreferrer" download
                       className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-xl transition-colors flex-shrink-0">
                      <Download className="w-4 h-4" />
                      Скачать
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* Раздел «Раскрытие информации» убран полностью (14.08) —
                вернуть, когда акционерный блок передаст документы раскрытия. */}
          </div>

          {/* Right Column - Meetings & Contacts */}
          <div className="space-y-6">
            <div className="card-modern rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-2xl bg-sky-50 flex items-center justify-center">
                  <Calendar className="w-4.5 h-4.5 text-sky-600" />
                </div>
                <h3 className="font-bold font-heading text-[#0a1628]">Собрания акционеров</h3>
              </div>
              <div className="space-y-4">
                {firstMeetings.map((meeting, i) => (
                  <MeetingRow
                    key={`${meeting.date}|${meeting.type}`}
                    meeting={meeting}
                    last={i === firstMeetings.length - 1 && (!showAllMeetings || moreMeetings.length === 0)}
                  />
                ))}
              </div>
              <AnimatePresence initial={false}>
                {showAllMeetings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pt-4">
                      {moreMeetings.map((meeting, i) => (
                        <MeetingRow
                          key={`${meeting.date}|${meeting.type}`}
                          meeting={meeting}
                          last={i === moreMeetings.length - 1}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {moreMeetings.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAllMeetings((v) => !v)}
                    aria-expanded={showAllMeetings}
                    className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    {showAllMeetings ? 'Свернуть' : 'Подробнее'}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAllMeetings ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}
            </div>

            <div className="gradient-dark rounded-2xl p-7 text-white">
              <div className="accent-bar mb-4" />
              <h3 className="font-bold font-heading text-lg mb-5">Контакты для акционеров</h3>
              <div className="space-y-4 text-sm">
                <p>
                  <span className="text-white/50 text-xs uppercase tracking-wider">Корпоративный секретарь<br />Лезин Дмитрий Владимирович</span><br />
                  <a href="tel:+74992222201" className="text-white/90 hover:text-white transition-colors">+7 (499) 222-22-01 доб. 2701</a>
                </p>
                <p>
                  <span className="text-white/50 text-xs uppercase tracking-wider">Email</span><br />
                  <a href="mailto:shareholder@moscollector.ru" className="text-white/90 hover:text-white transition-colors">shareholder@moscollector.ru</a>
                </p>
              </div>
            </div>

            <div className="card-modern rounded-2xl p-7">
              <h3 className="font-bold font-heading text-[#0a1628] mb-2">Дивидендная политика</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                АО «Москоллектор» придерживается прозрачной дивидендной политики,
                направленной на обеспечение баланса интересов акционеров и развития компании.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
