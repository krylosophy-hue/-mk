// Безопасный рендер markdown → HTML.
// Marked v18+ не санитизирует HTML по умолчанию — добавляем DOMPurify.
// Это критично, так как тело новостей редактируется через CMS любым
// коллаборатором с Write-доступом, и без санитизации возможно
// внедрение <script>, javascript: URL и т.п.
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { mediaUrl } from './utils';

marked.setOptions({ gfm: true, breaks: true });

/**
 * Префиксирует относительные пути картинок BASE_URL'ом и санитизирует HTML.
 * Разрешённые теги: только нужные для статей, без <script>, <iframe>,
 * <object>, <embed>, событий on*=… и javascript: URLs.
 */
export function renderMarkdownSafe(md: string): string {
  if (!md) return '';
  // 1. Нормализуем пути картинок через mediaUrl: срезает зашитый «/-mk/»
  //    и заново применяет актуальный BASE_URL. Без этого inline-картинки
  //    в теле новости (галереи) 404-ят на корневом домене / в dev.
  const fixed = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, src) => {
    return `![${alt}](${mediaUrl(src)})`;
  });

  // 2. Markdown → HTML
  const rawHtml = marked.parse(fixed, { async: false }) as string;

  // 2.5. Типографика (замечание 27.08): короткие предлоги и союзы не должны
  // оставаться в конце строки — привязываем их к следующему слову неразрывным
  // пробелом. Работаем только с текстом между тегами (кириллица не встречается
  // в атрибутах), поэтому регэксп безопасен для разметки.
  const typografed = rawHtml.replace(
    /(^|[\s>«("])(в|во|к|ко|с|со|о|об|обо|у|и|а|но|на|по|за|из|изо|от|до|не|ни|для|при|под|надо?|или|же|бы|ли)\s+(?=[«"(]?[а-яёА-ЯЁa-zA-Z0-9])/g,
    (_m, before, word) => `${before}${word} `
  );

  // 3. Санитизация
  return DOMPurify.sanitize(typografed, {
    ALLOWED_TAGS: [
      'p', 'br', 'hr',
      'strong', 'em', 'b', 'i', 'u', 's', 'mark', 'small', 'sup', 'sub',
      'a', 'img',
      'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'code', 'pre',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'span', 'div',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|tel|mailto):|\/|#|\.\/|\.\.\/)/i,
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'style'],
    FORBID_ATTR: ['style', 'onload', 'onerror', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
    // Все <a> открываем в новой вкладке и с rel noopener (защита от opener-фишинга)
    ADD_ATTR: ['target', 'rel'],
  });
}

// Хук: всем внешним ссылкам в санитизированном HTML
// автоматически проставляем target=_blank rel=noopener noreferrer
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    const href = node.getAttribute('href') || '';
    // Только http(s) ссылки наружу
    if (/^https?:\/\//i.test(href)) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  }
});
