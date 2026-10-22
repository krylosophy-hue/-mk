import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

// Кнопка «Скопировать ссылку» в модалке публикации (просьба пресс-службы 22.10).
// URL модалки синхронизирован с ?news=<id>, поэтому копируем текущий адрес.
export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors flex-shrink-0"
      title="Скопировать ссылку на публикацию"
    >
      {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      {copied ? 'Скопировано' : 'Ссылка'}
    </button>
  );
}
