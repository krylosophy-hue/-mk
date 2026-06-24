import { useState, useMemo } from 'react';
import { Calendar, Newspaper, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mediaUrl } from '@/lib/utils';
import { renderMarkdownSafe } from '@/lib/safe-html';
import { safeEmbedUrl } from '@/lib/safe-embed';
import { consumerNews as cmsConsumerNews } from '@/lib/content';

// CMS-managed: правится через /admin/, коллекция «Новости для потребителей»
const monthNames = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];
const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
};

// renderMarkdown — теперь через @/lib/safe-html (с XSS-санитизацией DOMPurify)

interface NewsCard {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  body: string;
  gallery: string[];
  videoEmbed?: string;
  video?: string;
}

const consumerNews: NewsCard[] = cmsConsumerNews.map((n) => ({
  id: n.id,
  date: formatDate(n.date),
  title: n.title,
  excerpt: n.excerpt,
  category: n.category,
  image: n.image ? mediaUrl(n.image) : '',
  body: n.body || n.excerpt,
  gallery: (n.gallery || []).map((g) => mediaUrl(g)),
  videoEmbed: n.videoEmbed,
  video: n.video ? mediaUrl(n.video) : undefined,
}));

const CATEGORIES = ['Все', 'Охрана труда', 'Техническая информация', 'Допуск в коллектор', 'Тарифы и цены', 'Прочее'];

export default function ConsumerNews() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [openNewsId, setOpenNewsId] = useState<string | null>(null);

  // #7 — фильтрация по выбранной категории
  const filteredNews = useMemo(
    () => (selectedCategory === 'Все'
      ? consumerNews
      : consumerNews.filter((n) => n.category === selectedCategory)),
    [selectedCategory]
  );

  const openNews = openNewsId ? consumerNews.find((n) => n.id === openNewsId) ?? null : null;

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
            {filteredNews.length === 0 && (
              <div className="card-modern rounded-2xl p-8 text-center text-gray-500">
                В этой категории пока нет новостей.
              </div>
            )}
            {filteredNews.map((news) => (
              <article
                key={news.id}
                onClick={() => setOpenNewsId(news.id)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenNewsId(news.id); } }}
                className="group card-modern rounded-2xl p-6 transition-all duration-200 hover:shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
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
                <h2 className="font-heading text-xl font-bold text-[#0a1628] mb-3 group-hover:text-sky-600 transition-colors duration-200">
                  {news.title}
                </h2>
                <p className="text-gray-500 leading-relaxed">
                  {news.excerpt}
                </p>
                <p className="text-sm text-sky-600 font-medium mt-3 group-hover:underline">Читать полностью →</p>
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
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      cat === selectedCategory
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                        : 'text-gray-500 hover:bg-sky-50 hover:text-sky-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* #13 — Светлый блок «Нужна помощь?», без указания Бюро пропусков */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-sky-50 to-white border border-sky-100">
              <div className="accent-bar mb-4" />
              <h3 className="font-heading font-bold text-[#0a1628] mb-3">Нужна помощь?</h3>
              <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                По всем вопросам обращайтесь в Центр обслуживания потребителей
              </p>
              <a href="tel:+74992222201" className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors duration-200 font-medium">
                +7 (499) 222-22-01
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

      {/* #8 — Модалка статьи */}
      {openNews && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => setOpenNewsId(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full my-8 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {openNews.image && (
              <div className="relative h-72 md:h-96 overflow-hidden bg-slate-100">
                <img src={openNews.image} alt={openNews.title} className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => setOpenNewsId(null)}
                  aria-label="Закрыть"
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 hover:bg-white shadow flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-[#0a1628]" />
                </button>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#0a1628]">
                    {openNews.category}
                  </span>
                </div>
              </div>
            )}
            {!openNews.image && (
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <span className="px-3 py-1 bg-sky-50 rounded-full text-xs font-medium text-sky-700">
                  {openNews.category}
                </span>
                <button
                  type="button"
                  onClick={() => setOpenNewsId(null)}
                  aria-label="Закрыть"
                  className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-[#0a1628]" />
                </button>
              </div>
            )}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                <Calendar className="w-4 h-4" />
                {openNews.date}
              </div>
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-[#0a1628] mb-5">{openNews.title}</h2>

              <div
                className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed
                           prose-img:rounded-xl prose-img:my-4 prose-a:text-sky-600 prose-headings:text-[#0a1628]"
                dangerouslySetInnerHTML={{ __html: renderMarkdownSafe(openNews.body) }}
              />

              {(() => {
                const safe = safeEmbedUrl(openNews.videoEmbed);
                if (!safe) return null;
                return (
                  <div className="mt-6 aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                      src={safe}
                      title={openNews.title}
                      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                      allowFullScreen
                      sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="w-full h-full"
                    />
                  </div>
                );
              })()}
              {openNews.video && !openNews.videoEmbed && (
                <video src={openNews.video} controls preload="metadata" className="mt-6 w-full rounded-xl bg-black" />
              )}

              {openNews.gallery && openNews.gallery.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {openNews.gallery.map((g, i) => (
                    <a key={i} href={g} target="_blank" rel="noopener noreferrer" className="block group">
                      <img
                        src={g}
                        alt={`${openNews.title} — фото ${i + 1}`}
                        className="w-full aspect-square object-cover rounded-xl group-hover:opacity-90 transition-opacity"
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
