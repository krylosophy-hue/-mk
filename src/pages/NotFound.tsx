import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const location = useLocation();

  // Логируем попадание на 404 в консоль — полезно для отладки опечаток в ссылках
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.warn('404: маршрут не найден →', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-50 px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* Большая цифра 404 с градиентом */}
        <div className="relative mb-8">
          <div
            className="text-[10rem] md:text-[14rem] font-heading font-black leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, #0a1628 0%, #0ea5e9 60%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            aria-hidden="true"
          >
            404
          </div>
          {/* Декоративный «коллектор» — тоннель из вложенных овалов */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-10 pointer-events-none" aria-hidden="true">
            <div className="w-72 h-72 rounded-full border-2 border-sky-600" />
            <div className="absolute inset-4 rounded-full border-2 border-sky-500" />
            <div className="absolute inset-10 rounded-full border-2 border-sky-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 mb-5">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span className="text-amber-900 text-xs font-medium">Страница не найдена</span>
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#0a1628] mb-4">
          К сожалению, такой страницы нет
        </h1>

        <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
          Возможно, ссылка устарела или содержит ошибку. Попробуйте вернуться
          на главную или воспользоваться поиском в шапке сайта.
        </p>

        {location.pathname && (
          <p className="text-xs text-slate-400 mb-8 font-mono break-all">
            Запрошенный путь: <span className="text-slate-600">{location.pathname}</span>
          </p>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/">
            <Button className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl">
              <Home className="w-4 h-4 mr-2" />
              На главную
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </div>

        {/* Быстрые ссылки на популярные разделы */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-4 flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Возможно, вы искали:
          </p>
          <div className="flex flex-wrap gap-2 justify-center text-sm">
            {[
              { to: '/about', label: 'О компании' },
              { to: '/consumers', label: 'Услуги для потребителей' },
              { to: '/consumers#tariffs', label: 'Тарифы и цены' },
              { to: '/calculator', label: 'Калькулятор' },
              { to: '/status', label: 'Статус заявки' },
              { to: '/press', label: 'Пресс-центр' },
              { to: '/contacts', label: 'Контакты' },
              { to: '/vacancies', label: 'Вакансии' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-sky-300 hover:text-sky-700 hover:bg-sky-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
