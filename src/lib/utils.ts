import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Внутренний хелпер: URL-кодирует каждый сегмент пути, сохраняя / и ?#.
// Без этого GitHub Pages иногда возвращает SPA-fallback (404.html)
// вместо файла, если имя содержит кириллицу и точку после цифры в начале.
function encodePath(path: string): string {
  const [pathPart, ...rest] = path.split(/([?#])/)
  const encodedPath = pathPart
    .split('/')
    .map((seg) => {
      // Если сегмент уже содержит %XX, считаем что он уже закодирован
      if (/%[0-9A-Fa-f]{2}/.test(seg)) return seg
      return encodeURIComponent(seg)
    })
    .join('/')
  return `${encodedPath}${rest.join('')}`
}

// Prefix asset path with Vite's BASE_URL so it resolves correctly under
// subpath deployments (e.g. GitHub Pages at /-mk/). Accepts paths with or
// without a leading slash.
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL // "/" in dev, "/-mk/" on Pages
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${base}${encodePath(clean)}`
}

// Аналог asset(), но для конкатенации FILE_BASE_URL + сегмент в шаблонах.
// Используется в Info.tsx где FILE_BASE_URL уже содержит /-mk/docs/.
export function fileUrl(base: string, segment: string): string {
  // base уже содержит /-mk/, мы кодируем только сегмент
  return `${base}${encodePath(segment)}`
}
