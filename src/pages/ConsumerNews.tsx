import { Calendar, Newspaper, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const consumerNews = [
  {
    id: 1,
    date: '30 декабря 2025',
    title: 'Сводные данные о результатах проведения специальной оценки условий труда в 2025 году на рабочих местах АО «Москоллектор»',
    excerpt: 'В период с сентября по декабрь 2025 года в АО «Москоллектор» была проведена специальная оценка условий труда на 56 рабочих местах. Результаты проведения специальной оценки условий труда приведены в таблице: Ко 2 классу (допустимым условиям труда) относятся условия труда, при которых на работника воздействуют вредные и (или) опасные производственные факторы, уровни воздействия которых не превышают уровни, установленные нормативами (гигиеническими нормативами) условий труда.',
    category: 'Охрана труда',
  },
  {
    id: 2,
    date: '17 июня 2025',
    title: 'Проведение гидравлических и температурных испытаний теплопроводов ПАО «МОЭК» в 2025 году',
    excerpt: 'Для сведения потребителей услуг АО «Москоллектор», а также сотрудников подрядных организаций публикуем график проведения гидравлических и температурных испытаний теплопроводов ПАО «МОЭК», проложенных в коллекторах АО «Москоллектор».',
    category: 'Техническая информация',
  },
  {
    id: 3,
    date: '10 декабря 2024',
    title: 'Сводные данные о результатах проведения специальной оценки условий труда в 2024 году на рабочих местах АО «Москоллектор»',
    excerpt: 'В период с сентября по ноябрь 2024 года в АО «Москоллектор» была проведена специальная оценка условий труда на 77 рабочих местах. Ко 2 классу условий труда отнесены 77 рабочих мест Общества. Рабочих мест с условиями труда, отнесенными к 1, 3 и 4 классу, не установлено.',
    category: 'Охрана труда',
  },
  {
    id: 4,
    date: '15 ноября 2024',
    title: 'Изменения в порядке оформления допуска в коллекторы',
    excerpt: 'АО «Москоллектор» информирует о внесении изменений в порядок оформления допуска в коммуникационные коллекторы. С 1 декабря 2024 года все заявки на допуск должны оформляться исключительно через личный кабинет системы допуска.',
    category: 'Допуск в коллектор',
  },
  {
    id: 5,
    date: '20 октября 2024',
    title: 'Обновление тарифов на услуги по технической эксплуатации коллекторов',
    excerpt: 'Утверждены новые тарифы на услуги по технической эксплуатации коммуникационных коллекторов на 2025 год. Продление технических условий и согласований проектов теперь доступно по цене от 3 000 рублей.',
    category: 'Тарифы и цены',
  },
];

export default function ConsumerNews() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Новости для потребителей
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            Актуальная информация для потребителей услуг АО «Москоллектор»
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* News List */}
          <div className="lg:col-span-2 space-y-6">
            {consumerNews.map((news) => (
              <article key={news.id} className="group card-modern rounded-2xl p-6 transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-sky-50 text-sky-600 text-sm font-medium rounded-full">
                    {news.category}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {news.date}
                  </div>
                </div>
                <div className="accent-bar mb-4" />
                <h2 className="font-heading text-xl font-bold text-[#0a1628] mb-3 group-hover:text-sky-600 transition-colors duration-200 cursor-pointer">
                  {news.title}
                </h2>
                <p className="text-gray-500 leading-relaxed">
                  {news.excerpt}
                </p>
              </article>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card-modern rounded-2xl p-6">
              <h3 className="font-heading font-bold text-[#0a1628] mb-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-sky-600" />
                </div>
                Категории
              </h3>
              <div className="space-y-1">
                {['Все', 'Охрана труда', 'Техническая информация', 'Допуск в коллектор', 'Тарифы и цены'].map((cat) => (
                  <button
                    key={cat}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      cat === 'Все'
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                        : 'text-gray-500 hover:bg-sky-50 hover:text-sky-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0a1628] rounded-3xl p-6">
              <div className="accent-bar mb-4" />
              <h3 className="font-heading font-bold text-white mb-3">Нужна помощь?</h3>
              <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                По всем вопросам обращайтесь в Центр обслуживания потребителей
              </p>
              <a href="tel:+74992222201" className="text-sky-400 hover:text-white transition-colors duration-200 text-sm font-medium">
                +7 (499) 222-22-01, доб. 1510
              </a>
            </div>

            <Link to="/consumers">
              <div className="flex items-center gap-2 text-sky-600 font-medium hover:text-[#0a1628] transition-colors duration-200 mt-2">
                <ChevronRight className="w-4 h-4 rotate-180" />
                Вернуться к услугам
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
