// Безопасная валидация URL для встраиваемых видео.
// Доверяем только публичным embed-эндпоинтам видеохостингов.
// Это защищает от того, что Write-коллаборатор в CMS вставит
// фишинговый URL в поле «Видео — embed URL».

const ALLOWED_EMBED_HOSTS = [
  // YouTube
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'youtube-nocookie.com',
  // VK
  'vk.com',
  'www.vk.com',
  // Rutube
  'rutube.ru',
  'www.rutube.ru',
  // Kinescope (российский видеохостинг)
  'kinescope.io',
  'play.kinescope.io',
  // Дзен видео
  'dzen.ru',
  'plvideo.ru',
];

/**
 * Возвращает безопасный URL для iframe src или null если URL невалиден / недоверенный.
 */
export function safeEmbedUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    // Только https
    if (url.protocol !== 'https:') return null;
    // Хост должен быть в whitelist
    if (!ALLOWED_EMBED_HOSTS.includes(url.hostname.toLowerCase())) return null;
    return url.toString();
  } catch {
    return null;
  }
}
