import { useState } from 'react';
import { Calendar, Newspaper, Video, BookOpen, Tag, FileText, Download, ExternalLink } from 'lucide-react';
import { asset } from '@/lib/utils';
import { news as cmsNews, videos as cmsVideos, newspaper as cmsNewspaper } from '@/lib/content';

// CMS-managed via /admin/ — see content/news/, content/videos/, content/newspaper/
// Format date for display (ISO → DD месяца YYYY)
const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
};

const news = cmsNews.map((n) => ({
  id: n.id,
  date: formatDate(n.date),
  title: n.title,
  excerpt: n.excerpt,
  category: n.category,
  image: n.image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
}));

const videos = cmsVideos.map((v, i) => ({ ...v, id: i + 1 }));
const newspaperIssues = cmsNewspaper.map((n) => ({
  number: n.number,
  year: n.year,
  label: n.label,
  file: n.file,
}));

const categories = ['Все', 'Мероприятия', 'Охрана труда', 'Пресс-центр', 'Производство', 'Социальная ответственность'];

const years = ['2026', '2025', '2024', '2023', '2022', 'Архив'];

export default function Press() {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [activeTab, setActiveTab] = useState('Новости');

  const filteredNews = selectedCategory === 'Все'
    ? news
    : news.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Пресс-центр
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            Новости, публикации и мультимедийные материалы о деятельности <span className="whitespace-nowrap">АО&nbsp;«Москоллектор»</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-gray-200 pb-5">
          {[
            { icon: Newspaper, label: 'Новости' },
            { icon: Video, label: 'Видеоматериалы' },
            { icon: BookOpen, label: 'Корпоративная газета' },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-medium text-sm transition-all duration-200 ${
                activeTab === tab.label
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'text-gray-500 hover:text-[#0a1628] hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* === Tab: Новости === */}
        {activeTab === 'Новости' && (
          <>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                      : 'bg-white text-gray-500 hover:text-[#0a1628] hover:bg-sky-50 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* News Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredNews.map((item) => (
                <article key={item.id} className="group card-modern overflow-hidden rounded-2xl">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#0a1628]">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="accent-bar mb-4" />
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                      <Calendar className="w-4 h-4" />
                      {item.date}
                    </div>
                    <h3 className="font-heading font-bold text-[#0a1628] group-hover:text-sky-600 transition-colors duration-200 line-clamp-2 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Archive */}
            <div className="card-modern rounded-2xl p-6">
              <h3 className="font-heading font-bold text-[#0a1628] mb-2 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-sky-600" />
                </div>
                Архив публикаций
              </h3>
              <p className="text-gray-500 text-sm mb-5 ml-12">
                Ознакомьтесь с архивом публикаций за предыдущие годы
              </p>
              <div className="flex flex-wrap gap-2 ml-12">
                {years.map((year) => (
                  <a
                    key={year}
                    href="#"
                    className="px-4 py-2 bg-gray-100 rounded-2xl text-sm font-medium text-gray-500 hover:text-sky-600 hover:bg-sky-50 transition-all duration-200"
                  >
                    {year}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        {/* === Tab: Видеоматериалы === */}
        {activeTab === 'Видеоматериалы' && (
          <>
            <h2 className="font-heading text-2xl font-bold text-[#0a1628] mb-8 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
                <Video className="w-5 h-5 text-sky-600" />
              </div>
              Видеоматериалы
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {videos.map((video) => (
                <div key={video.id} className="card-modern overflow-hidden rounded-2xl">
                  <div className="relative bg-black rounded-t-2xl">
                    <video
                      controls
                      className="w-full aspect-video"
                      preload="metadata"
                    >
                      <source src={asset(video.src)} />
                      Ваш браузер не поддерживает воспроизведение видео.
                    </video>
                  </div>
                  <div className="p-6">
                    <div className="accent-bar mb-4" />
                    <h3 className="font-heading font-bold text-[#0a1628] mb-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* === Tab: Корпоративная газета === */}
        {activeTab === 'Корпоративная газета' && (
          <>
            {/* Корпоративная газета */}
            <h2 className="font-heading text-2xl font-bold text-[#0a1628] mb-8 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-sky-600" />
              </div>
              Корпоративная газета «Подземный лабиринт»
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed max-w-3xl">
              Корпоративная газета АО «Москоллектор» «Подземный лабиринт» издаётся с 2017 года.
              В ней публикуются новости компании, репортажи о деятельности подразделений, интервью с сотрудниками и материалы о жизни коллектива.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {newspaperIssues.map((issue) => (
                <a
                  key={issue.number}
                  href={asset(issue.file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group card-modern rounded-2xl p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-100 transition-colors duration-200">
                      <Newspaper className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                      <div className="accent-bar mb-3" />
                      <h3 className="font-heading font-bold text-[#0a1628] group-hover:text-sky-600 transition-colors duration-200 mb-1">
                        Выпуск {issue.number}
                      </h3>
                      <p className="text-sm text-gray-400">{issue.year} год</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-sky-600 font-medium">
                    <Download className="w-4 h-4" />
                    Скачать PDF
                  </div>
                </a>
              ))}
            </div>

            <div className="card-modern rounded-2xl p-6 mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-sky-600" />
                </div>
                <h3 className="font-heading font-bold text-[#0a1628]">Все выпуски газеты</h3>
              </div>
              <p className="text-gray-500 text-sm mb-4 ml-12 leading-relaxed">
                Полный архив всех выпусков корпоративной газеты «Подземный лабиринт» доступен на официальном сайте АО «Москоллектор».
              </p>
              <div className="ml-12">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-2xl text-sm font-medium hover:bg-sky-700 transition-colors duration-200 shadow-md shadow-sky-600/20"
                >
                  <ExternalLink className="w-4 h-4" />
                  Перейти к архиву выпусков
                </a>
              </div>
            </div>

            {/* Юбилейная книга */}
            <h2 className="font-heading text-2xl font-bold text-[#0a1628] mb-8 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-sky-600" />
              </div>
              Юбилейная книга
            </h2>
            <div className="card-modern rounded-2xl overflow-hidden mb-12">
              <div className="p-6 md:p-8">
                <div className="accent-bar mb-4" />
                <h3 className="font-heading text-xl font-bold text-[#0a1628] mb-3">
                  АО «Москоллектор» — 25 лет
                </h3>
                <p className="text-gray-500 leading-relaxed mb-6 max-w-3xl">
                  Юбилейная книга, посвящённая 25-летию АО «Москоллектор», рассказывает об истории создания и развития
                  предприятия, о людях, стоявших у истоков компании, и о современной деятельности
                  по эксплуатации коммуникационных коллекторов города Москвы.
                </p>
                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-400 text-white rounded-2xl text-sm font-medium cursor-default">
                  <BookOpen className="w-4 h-4" />
                  Раздел в разработке
                </span>
              </div>
            </div>
          </>
        )}

        {/* Press Contact */}
        <div className="mt-8 bg-[#0a1628] rounded-3xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="accent-bar mb-4" />
              <h3 className="font-heading text-xl font-bold text-white mb-2">Для представителей СМИ</h3>
              <p className="text-gray-400 leading-relaxed">
                По вопросам получения комментариев и организации интервью обращайтесь в пресс-службу
              </p>
            </div>
            <div className="text-sm space-y-2">
              <p>
                <span className="text-gray-500">Телефон:</span>{' '}
                <a href="tel:+74992222204" className="text-sky-400 hover:text-white transition-colors duration-200">+7 (499) 222-22-04</a>
              </p>
              <p>
                <span className="text-gray-500">Email:</span>{' '}
                <a href="mailto:press@moscollector.ru" className="text-sky-400 hover:text-white transition-colors duration-200">press@moscollector.ru</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
