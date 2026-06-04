import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.warn('404: маршрут не найден →', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#0a1628] text-center max-w-2xl leading-tight">
        Упс, похоже, вы заблудились в коллекторе.
      </h1>
    </div>
  );
}
