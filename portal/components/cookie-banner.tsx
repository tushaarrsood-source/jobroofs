'use client';

import React, { useState, useEffect } from 'react';
import Link from '@/components/ui/link';
import { Cookie, ShieldCheck, ChevronDown, ChevronUp, Check, Settings2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';

export interface CookieConsent {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'jobroofs_cookie_consent_v1';

export function getStoredCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Global helper to re-open the cookie preferences modal anytime (e.g. from footer)
 */
export function openCookieSettings() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-cookie-settings'));
  }
}

export function CookieBanner() {
  const { isDe } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = getStoredCookieConsent();
    if (!existing) {
      // Smooth delayed entry so initial page render feels calm
      const timer = setTimeout(() => setVisible(true), 700);
      return () => clearTimeout(timer);
    } else {
      setFunctional(existing.functional);
      setAnalytics(existing.analytics);
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      const existing = getStoredCookieConsent();
      if (existing) {
        setFunctional(existing.functional);
        setAnalytics(existing.analytics);
      }
      setCustomizing(true);
      setVisible(true);
    };

    window.addEventListener('open-cookie-settings', handleOpen);
    return () => window.removeEventListener('open-cookie-settings', handleOpen);
  }, []);

  const saveConsent = (preferences: { necessary: boolean; functional: boolean; analytics: boolean }) => {
    const consent: CookieConsent = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cookie_consent_updated', { detail: consent }));
      }
    } catch (e) {
      console.error('Failed to save cookie consent', e);
    }
    setVisible(false);
    setCustomizing(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, functional: true, analytics: true });
  };

  const handleAcceptNecessary = () => {
    saveConsent({ necessary: true, functional: false, analytics: false });
  };

  const handleSaveCustom = () => {
    saveConsent({ necessary: true, functional, analytics });
  };

  if (!mounted || !visible) return null;

  return (
    <div className="fixed bottom-18 md:bottom-5 left-3 right-3 sm:left-6 sm:right-auto z-[95] max-w-md w-auto animate-in fade-in slide-in-from-bottom-3 duration-250">
      <div className="rounded-2xl border border-zinc-200 bg-white/98 backdrop-blur-xl p-4 sm:p-5 shadow-2xl text-left">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-black shrink-0">
            <Cookie className="size-4 stroke-[2] text-black" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[14px] font-bold tracking-tight text-black">
              {isDe ? 'Privatsphäre & Cookies' : 'Privacy & Cookies'}
            </h3>
            <p className="text-[12px] text-zinc-600 mt-0.5 leading-relaxed font-normal">
              {isDe
                ? 'Wir nutzen Cookies für eine sichere Anmeldung, Filter und schnelle Ladezeiten.'
                : 'We use cookies to provide secure authentication, filters, and fast performance.'}
            </p>
          </div>
        </div>

        {/* Detailed customization accordion */}
        {customizing && (
          <div className="mt-3 mb-3 space-y-2.5 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 text-xs animate-in fade-in duration-200">
            {/* Necessary */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-black">
                  {isDe ? 'Notwendig & Sicherheit' : 'Necessary & Security'}
                </div>
                <div className="text-[11px] text-zinc-600 font-normal">
                  {isDe
                    ? 'Authentifizierung, Session-Schutz & Grundeinstellungen.'
                    : 'Authentication, session protection & core settings.'}
                </div>
              </div>
              <span className="rounded-md bg-zinc-200/70 border border-zinc-300 px-2 py-0.5 text-[10px] font-mono text-zinc-700 font-semibold shrink-0">
                {isDe ? 'Immer aktiv' : 'Always active'}
              </span>
            </div>

            {/* Functional */}
            <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-zinc-200">
              <div>
                <div className="font-bold text-black">
                  {isDe ? 'Funktional & Filter' : 'Functional & Preferences'}
                </div>
                <div className="text-[11px] text-zinc-600 font-normal">
                  {isDe
                    ? 'Merkt sich Kiez-Filter und gespeicherte Angebote.'
                    : 'Remembers district filters and saved listings.'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFunctional((prev) => !prev)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  functional ? 'bg-black' : 'bg-zinc-300'
                }`}
                aria-label="Toggle functional cookies"
              >
                <span
                  className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    functional ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-zinc-200">
              <div>
                <div className="font-bold text-black">
                  {isDe ? 'Statistiken & Performance' : 'Statistics & Performance'}
                </div>
                <div className="text-[11px] text-zinc-600 font-normal">
                  {isDe
                    ? 'Anonyme Ladezeitmessung zur Beschleunigung von JOBROOFS.'
                    : 'Anonymous latency metrics to speed up page delivery.'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAnalytics((prev) => !prev)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  analytics ? 'bg-black' : 'bg-zinc-300'
                }`}
                aria-label="Toggle analytics cookies"
              >
                <span
                  className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    analytics ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Legal Links */}
        <div className="flex items-center gap-2.5 text-[11.5px] text-zinc-500 mb-3">
          <Link href="/datenschutz" className="hover:text-black transition-colors underline underline-offset-2">
            {isDe ? 'Datenschutz' : 'Privacy'}
          </Link>
          <span>&middot;</span>
          <Link href="/impressum" className="hover:text-black transition-colors underline underline-offset-2">
            {isDe ? 'Impressum' : 'Legal'}
          </Link>
          <span>&middot;</span>
          <button
            type="button"
            onClick={() => setCustomizing((prev) => !prev)}
            className="hover:text-black font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>{customizing ? (isDe ? 'Weniger' : 'Less') : (isDe ? 'Einstellungen' : 'Settings')}</span>
            {customizing ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-2">
          {customizing ? (
            <button
              type="button"
              onClick={handleSaveCustom}
              className="apple-press flex-1 rounded-xl bg-black py-2.5 text-xs font-semibold tracking-[0.02em] text-white hover:bg-zinc-800 transition-colors cursor-pointer text-center justify-center active:scale-[0.98]"
            >
              <span>{isDe ? 'Auswahl speichern' : 'Save preferences'}</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleAcceptNecessary}
                className="apple-press flex-1 rounded-xl border border-zinc-200 bg-white py-2.5 text-xs font-semibold text-black hover:bg-zinc-50 transition-colors cursor-pointer text-center justify-center active:scale-[0.98]"
              >
                <span>{isDe ? 'Nur Notwendige' : 'Essential Only'}</span>
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="apple-press flex-1 rounded-xl bg-black py-2.5 text-xs font-semibold tracking-[0.02em] text-white hover:bg-zinc-800 transition-colors cursor-pointer text-center justify-center active:scale-[0.98]"
              >
                <span>{isDe ? 'Alle akzeptieren' : 'Accept All'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
