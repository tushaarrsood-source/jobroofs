'use client';

import { useTranslation } from '@/lib/i18n/language-context';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-zinc-200 bg-white p-0.5 text-xs font-medium shadow-2xs ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLocale('de')}
        className={`rounded-md px-2 sm:px-2.5 py-1 text-[11px] font-mono tracking-tight cursor-pointer transition-all duration-150 ${
          locale === 'de'
            ? 'bg-black text-white font-bold shadow-xs'
            : 'text-zinc-500 hover:text-black font-semibold'
        }`}
        aria-pressed={locale === 'de'}
      >
        DE
      </button>
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`rounded-md px-2 sm:px-2.5 py-1 text-[11px] font-mono tracking-tight cursor-pointer transition-all duration-150 ${
          locale === 'en'
            ? 'bg-black text-white font-bold shadow-xs'
            : 'text-zinc-500 hover:text-black font-semibold'
        }`}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
    </div>
  );
}
