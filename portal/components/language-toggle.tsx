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
        className={`rounded-md px-2 py-1 transition ${
          locale === 'de'
            ? 'bg-[#18221e] text-white'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-pressed={locale === 'de'}
      >
        DE
      </button>
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`rounded-md px-2 py-1 transition ${
          locale === 'en'
            ? 'bg-[#18221e] text-white'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
    </div>
  );
}
