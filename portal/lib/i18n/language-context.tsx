'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Locale, type TranslationKey } from './translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  isDe: boolean;
  isEn: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('de');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('kiezjob_locale') as Locale | null;
      if (stored === 'de' || stored === 'en') {
        setLocaleState(stored);
      } else {
        // Check browser language preference if no manual choice saved
        const browserLang = navigator.language?.toLowerCase() || '';
        if (browserLang.startsWith('en')) {
          setLocaleState('en');
        } else {
          setLocaleState('de');
        }
      }
    } catch {
      // Ignore localStorage errors in private mode
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('kiezjob_locale', newLocale);
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore storage errors
    }
  };

  const toggleLocale = () => {
    setLocale(locale === 'de' ? 'en' : 'de');
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = translations[locale] || translations.de;
    let text: string = dict[key] || translations.de[key] || String(key);

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        t,
        isDe: locale === 'de',
        isEn: locale === 'en',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      locale: 'de' as Locale,
      setLocale: () => {},
      toggleLocale: () => {},
      t: (key: TranslationKey, params?: Record<string, string | number>) => {
        let text: string = translations.de[key] || String(key);
        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
          });
        }
        return text;
      },
      isDe: true,
      isEn: false,
    };
  }
  return context;
}
