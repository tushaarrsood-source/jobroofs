'use client';

import { useTranslation } from '@/lib/i18n/language-context';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      className={`inline-flex items-center rounded-full bg-zinc-100 p-1 text-xs font-semibold ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLocale('de')}
        className={`rounded-full px-3 py-1 text-xs font-mono tracking-tight cursor-pointer transition-all duration-150 ${
          locale === 'de'
            ? 'bg-black text-white font-bold shadow-xs'
            : 'text-zinc-600 hover:text-black font-semibold'
        }`}
        aria-pressed={locale === 'de'}
      >
        DE
      </button>
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`rounded-full px-3 py-1 text-xs font-mono tracking-tight cursor-pointer transition-all duration-150 ${
          locale === 'en'
            ? 'bg-black text-white font-bold shadow-xs'
            : 'text-zinc-600 hover:text-black font-semibold'
        }`}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
    </div>
  );
}
