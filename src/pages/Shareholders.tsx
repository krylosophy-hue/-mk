import { FileText, TrendingUp, Users, Calendar, Download, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const documents = [
  { title: 'Устав АО «Москоллектор»', date: '15.03.2023', size: '2.4 MB', file: '/docs/shareholders/Устав-АО-Москоллектор.pdf' },
  { title: 'Свидетельство о постановке на учет АО «Москоллектор» в налоговом органе по месту нахождения', date: '28.02.2025', size: '5.8 MB', file: '/docs/shareholders/Свидетельство-ИНН-КПП.pdf' },
  { title: 'Лист записи Единого государственного реестра юридических лиц в отношении юридического лица АО «Москоллектор»', date: '28.02.2025', size: '3.2 MB', file: '/docs/shareholders/Лист-записи-ИНН-КПП.pdf' },
  { title: 'Лист записи ЕГРЮЛ о создании АО «Москоллектор» путем реорганизации в форме преобразования', date: '10.06.2022', size: '1.1 MB', file: '/docs/shareholders/Лист-записи-регистрация-АО.pdf' },
  { title: 'Лист записи ЕГРЮЛ о прекращении ГУП «Москоллектор» путем реорганизации в форме преобразования', date: '10.06.2022', size: '0.9 MB', file: '/docs/shareholders/Лист-записи-прекращение-ГУП.pdf' },
  { title: 'Распоряжение Департамента городского имущества города Москвы «Об условиях приватизации ГУП «Москоллектор»', date: '10.06.2022', size: '0.8 MB', file: '/docs/shareholders/РД-об-условиях-приватизации-ГУП-Москоллектор.pdf' },
];

const meetings = [
  { date: '28 июня 2024', type: 'Годовое общее собрание акционеров', status: 'Проведено' },
  { date: '15 декабря 2023', type: 'Внеочередное общее собрание акционеров', status: 'Проведено' },
  { date: '29 июня 2023', type: 'Годовое общее собрание акционеров', status: 'Проведено' },
];

export default function Shareholders() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="accent-bar mb-6" />
          <h1 className="font-heading">Акционерам</h1>
          <p>
            Информация для акционеров АО «Москоллектор»: отчетность, документы, собрания
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {[
            { icon: FileText, title: 'Отчетность', desc: 'Годовые отчеты и бухгалтерская отчетность' },
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
                      <div>
                        <h4 className="font-medium text-[#0a1628]">{doc.title}</h4>
                        <p className="text-sm text-gray-400 mt-0.5">{doc.date} &middot; {doc.size}</p>
                      </div>
                    </div>
                    <a href={doc.file} target="_blank" rel="noopener noreferrer" download>
                      <Button variant="ghost" size="sm" className="text-sky-600 hover:text-sky-500 hover:bg-sky-50 rounded-xl">
                        <Download className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="accent-bar" />
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">Раскрытие информации</h2>
              </div>
              <div className="space-y-5">
                <div className="card-modern rounded-2xl p-7">
                  <h3 className="font-semibold font-heading text-[#0a1628] mb-2">Существенные факты</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    Информация о существенных фактах, подлежащих раскрытию в соответствии с требованиями
                    законодательства Российской Федерации.
                  </p>
                  <Button variant="outline" size="sm" className="border-sky-600 text-sky-600 hover:bg-sky-50 rounded-xl">Перейти к списку</Button>
                </div>
                <div className="card-modern rounded-2xl p-7">
                  <h3 className="font-semibold font-heading text-[#0a1628] mb-2">Инсайдерская информация</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    Список лиц, имеющих доступ к инсайдерской информации, и порядок ее раскрытия.
                  </p>
                  <Button variant="outline" size="sm" className="border-sky-600 text-sky-600 hover:bg-sky-50 rounded-xl">Подробнее</Button>
                </div>
              </div>
            </section>
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
                {meetings.map((meeting) => (
                  <div key={meeting.date} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="text-sm font-semibold text-sky-600 mb-1">{meeting.date}</div>
                    <div className="text-sm text-[#0a1628] mb-1">{meeting.type}</div>
                    <span className="inline-flex items-center text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                      {meeting.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="gradient-dark rounded-2xl p-7 text-white">
              <div className="accent-bar mb-4" />
              <h3 className="font-bold font-heading text-lg mb-5">Контакты для акционеров</h3>
              <div className="space-y-4 text-sm">
                <p>
                  <span className="text-white/50 text-xs uppercase tracking-wider">Отдел корпоративного управления</span><br />
                  <a href="tel:+74992222202" className="text-white/90 hover:text-white transition-colors">+7 (499) 222-22-02</a>
                </p>
                <p>
                  <span className="text-white/50 text-xs uppercase tracking-wider">Email</span><br />
                  <a href="mailto:shareholders@moscollector.ru" className="text-white/90 hover:text-white transition-colors">shareholders@moscollector.ru</a>
                </p>
              </div>
            </div>

            <div className="card-modern rounded-2xl p-7">
              <h3 className="font-bold font-heading text-[#0a1628] mb-2">Дивидендная политика</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                АО «Москоллектор» придерживается прозрачной дивидендной политики,
                направленной на обеспечение баланса интересов акционеров и развития компании.
              </p>
              <Button variant="outline" size="sm" className="border-sky-600 text-sky-600 hover:bg-sky-50 rounded-xl">Подробнее</Button>
            </div>

            <Link to="/info" className="card-modern rounded-2xl p-5 flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-100 transition-colors">
                <ChevronRight className="w-4 h-4 text-sky-600" />
              </div>
              <span className="font-medium text-[#0a1628] group-hover:text-sky-600 transition-colors">Раскрытие информации</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
