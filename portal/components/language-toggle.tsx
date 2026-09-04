'use client';

import { useTranslation } from '@/lib/i18n/language-context';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-foreground/15 bg-white p-0.5 text-xs font-semibold shadow-xs ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLocale('de')}
        className={`rounded-md px-2.5 py-1 text-xs font-semibold pill-tactile cursor-pointer transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          locale === 'de'
            ? 'bg-[#18221e] text-white shadow-2xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        aria-pressed={locale === 'de'}
      >
        DE
      </button>
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`rounded-md px-2.5 py-1 text-xs font-semibold pill-tactile cursor-pointer transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          locale === 'en'
            ? 'bg-[#18221e] text-white shadow-2xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
    </div>
  );
}
