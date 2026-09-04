'use client';

import React, { useSyncExternalStore } from 'react';
import { translations, type Locale, type TranslationKey } from './translations';

let currentLocale: Locale = 'de';
const listeners = new Set<() => void>();

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'de';
  try {
    const stored = (localStorage.getItem('jobroofs_locale') || localStorage.getItem('kiezjob_locale')) as Locale | null;
    if (stored === 'de' || stored === 'en') return stored;
    const browserLang = navigator.language?.toLowerCase() || '';
    return browserLang.startsWith('en') ? 'en' : 'de';
  } catch {
    return 'de';
  }
}

if (typeof window !== 'undefined') {
  currentLocale = getStoredLocale();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): Locale {
  return currentLocale;
}

function getServerSnapshot(): Locale {
  return 'de';
}

export function setLocale(newLocale: Locale) {
  currentLocale = newLocale;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('jobroofs_locale', newLocale);
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
  }
  listeners.forEach((listener) => listener());
}

export function toggleLocale() {
  setLocale(currentLocale === 'de' ? 'en' : 'de');
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useTranslation() {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

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

  return {
    locale,
    setLocale,
    toggleLocale,
    t,
    isDe: locale === 'de',
    isEn: locale === 'en',
  };
}
