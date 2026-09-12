'use client';

import { useTranslation } from '@/lib/i18n/language-context';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      className={`inline-flex items-center rounded-sm border border-[#d8ded9] bg-white p-0.5 text-xs font-medium shadow-2xs ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLocale('de')}
        className={`rounded-xs px-2 sm:px-2.5 py-1 text-[11px] font-mono tracking-tight cursor-pointer transition-colors duration-150 ${
          locale === 'de'
            ? 'bg-[#202a31] text-[#fbfbf8]'
            : 'text-[#7e8a84] hover:text-[#202a31]'
        }`}
        aria-pressed={locale === 'de'}
      >
        DE
      </button>
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`rounded-xs px-2 sm:px-2.5 py-1 text-[11px] font-mono tracking-tight cursor-pointer transition-colors duration-150 ${
          locale === 'en'
            ? 'bg-[#202a31] text-[#fbfbf8]'
            : 'text-[#7e8a84] hover:text-[#202a31]'
        }`}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
    </div>
  );
}
