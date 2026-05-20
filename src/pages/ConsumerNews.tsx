import { Calendar, Newspaper, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { consumerNews as cmsConsumerNews } from '@/lib/content';

// CMS-managed: правится через /admin/, коллекция «Новости для потребителей»
const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
};

const consumerNews = cmsConsumerNews.map((n, i) => ({
  id: i + 1,
  date: formatDate(n.date),
  title: n.title,
  excerpt: n.excerpt,
  category: n.category,
}));

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
