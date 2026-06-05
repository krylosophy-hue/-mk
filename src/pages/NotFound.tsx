import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { asset } from '@/lib/utils';

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.warn('404: маршрут не найден →', location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060e1a] flex items-center justify-center px-4 py-12">
      {/* Фон: фото коллектора с тёмным оверлеем */}
      <div className="absolute inset-0 z-0">
        <img
          src={asset('images/collector-hero.jpg')}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060e1a]/80 via-[#060e1a]/60 to-[#060e1a]/95" />
        {/* Тонкая сетка как «структура коллектора» */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.5) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Анимированные «огоньки» — как лампочки в коллекторе, уходящие вдаль */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-sky-400"
            style={{
              top: `${30 + i * 8}%`,
              left: '50%',
              transform: 'translateX(-50%)',
              boxShadow: '0 0 24px 4px rgba(56, 189, 248, 0.6)',
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* «Луч фонарика» — плавно ходит туда-сюда */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(56, 189, 248, 0.18) 0%, transparent 35%)',
            'radial-gradient(circle at 80% 40%, rgba(56, 189, 248, 0.18) 0%, transparent 35%)',
            'radial-gradient(circle at 50% 60%, rgba(56, 189, 248, 0.18) 0%, transparent 35%)',
            'radial-gradient(circle at 20% 50%, rgba(56, 189, 248, 0.18) 0%, transparent 35%)',
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Контент */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-3xl w-full text-center"
      >
        {/* Большая цифра 404 с градиентом и пульсацией */}
        <motion.div
          animate={{
            textShadow: [
              '0 0 30px rgba(56, 189, 248, 0.3)',
              '0 0 60px rgba(56, 189, 248, 0.55)',
              '0 0 30px rgba(56, 189, 248, 0.3)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[8rem] md:text-[12rem] font-heading font-black leading-none select-none mb-4"
          style={{
            background:
              'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </motion.div>

        {/* Декоративные «кольца коллектора» — затухают вглубь */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[140%] -z-10 pointer-events-none" aria-hidden="true">
          {[400, 320, 240, 160, 100].map((size, i) => (
            <motion.div
              key={size}
              className="absolute rounded-full border border-sky-400/30"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${-size / 2}px`,
                left: `${-size / 2}px`,
              }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.15 + i * 0.05, 0.4 + i * 0.05, 0.15 + i * 0.05],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-heading text-2xl md:text-4xl font-bold text-white leading-tight mb-6"
        >
          Упс, похоже, вы заблудились в коллекторе.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-white/60 text-base md:text-lg mb-10 max-w-xl mx-auto"
        >
          Запрошенной страницы здесь нет. Вернитесь на главную или возвратитесь к&nbsp;предыдущему разделу.
        </motion.p>

        {location.pathname && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-xs text-white/30 mb-8 font-mono break-all"
          >
            <span className="text-white/40">путь:</span> {location.pathname}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <Link to="/">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white
                         bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400
                         shadow-[0_8px_24px_-6px_rgba(14,165,233,0.5),inset_0_1px_0_rgba(255,255,255,0.18)]
                         hover:-translate-y-0.5 transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              На главную
            </button>
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                       text-white/90 border border-white/15 bg-white/[0.04]
                       hover:bg-white/[0.10] backdrop-blur-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
