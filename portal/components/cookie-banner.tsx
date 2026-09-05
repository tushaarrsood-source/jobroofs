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
    <div className="fixed bottom-22 md:bottom-5 left-4 right-4 sm:left-6 sm:right-auto z-[95] max-w-md w-auto animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-[24px] border border-black/[0.08] bg-white/95 backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] text-left">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-black/[0.04] text-[#1d1d1f] shrink-0">
            <Cookie className="size-5 text-[#0071e3]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold tracking-tight text-[#1d1d1f]">
              {isDe ? 'Privatsphäre & Cookies' : 'Privacy & Cookies'}
            </h3>
            <p className="text-xs text-[#86868b] mt-0.5 leading-relaxed">
              {isDe
                ? 'Wir nutzen Cookies und lokale Speicherdaten, um dir eine sichere Anmeldung, Kiez-Filter und ein schnelles Erlebnis zu bieten.'
                : 'We use cookies and local storage to provide secure login, neighborhood filtering, and high platform performance.'}
            </p>
          </div>
        </div>

        {/* Detailed customization accordion */}
        {customizing && (
          <div className="mt-4 mb-4 space-y-3 rounded-2xl bg-[#f5f5f7] p-3.5 text-xs animate-in fade-in duration-200">
            {/* Necessary */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-[#1d1d1f]">
                  {isDe ? 'Notwendig & Sicherheit' : 'Necessary & Security'}
                </div>
                <div className="text-[11px] text-[#86868b]">
                  {isDe
                    ? 'Authentifizierung, Session-Schutz & Grundeinstellungen.'
                    : 'Authentication, session protection & core settings.'}
                </div>
              </div>
              <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-[10px] font-medium text-[#1d1d1f] shrink-0">
                {isDe ? 'Immer aktiv' : 'Always active'}
              </span>
            </div>

            {/* Functional */}
            <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-black/[0.05]">
              <div>
                <div className="font-semibold text-[#1d1d1f]">
                  {isDe ? 'Funktional & Filter' : 'Functional & Preferences'}
                </div>
                <div className="text-[11px] text-[#86868b]">
                  {isDe
                    ? 'Merkt sich Kiez-Filter, Kartenausschnitt und gespeicherte Angebote.'
                    : 'Remembers district filters, map viewport, and saved listings.'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFunctional((prev) => !prev)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  functional ? 'bg-[#0071e3]' : 'bg-slate-300'
                }`}
                aria-label="Toggle functional cookies"
              >
                <span
                  className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    functional ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-black/[0.05]">
              <div>
                <div className="font-semibold text-[#1d1d1f]">
                  {isDe ? 'Statistiken & Performance' : 'Statistics & Performance'}
                </div>
                <div className="text-[11px] text-[#86868b]">
                  {isDe
                    ? 'Anonyme Ladezeitmessung zur Beschleunigung von JOBROOFS.'
                    : 'Anonymous latency metrics to speed up page delivery.'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAnalytics((prev) => !prev)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  analytics ? 'bg-[#0071e3]' : 'bg-slate-300'
                }`}
                aria-label="Toggle analytics cookies"
              >
                <span
                  className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    analytics ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Legal Links */}
        <div className="flex items-center gap-3 text-[11px] text-[#86868b] mb-4">
          <Link href="/datenschutz" className="hover:text-[#0071e3] underline transition-colors">
            {isDe ? 'Datenschutzerklärung' : 'Privacy Policy'}
          </Link>
          <span>·</span>
          <Link href="/impressum" className="hover:text-[#0071e3] underline transition-colors">
            {isDe ? 'Impressum' : 'Legal Notice'}
          </Link>
          <span>·</span>
          <button
            type="button"
            onClick={() => setCustomizing((prev) => !prev)}
            className="hover:text-[#1d1d1f] font-medium transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>{customizing ? (isDe ? 'Weniger' : 'Less') : (isDe ? 'Einstellungen' : 'Settings')}</span>
            {customizing ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {customizing ? (
            <button
              type="button"
              onClick={handleSaveCustom}
              className="apple-btn-primary flex-1 !h-9 !text-xs font-medium cursor-pointer text-center justify-center"
            >
              <span>{isDe ? 'Auswahl speichern' : 'Save preferences'}</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleAcceptNecessary}
                className="inline-flex items-center justify-center rounded-full border border-black/[0.1] bg-white px-3.5 py-2 text-xs font-medium text-[#1d1d1f] hover:bg-black/[0.04] transition active:scale-[0.97] cursor-pointer flex-1"
              >
                <span>{isDe ? 'Nur Notwendige' : 'Essential Only'}</span>
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="apple-btn-primary flex-1 !h-9 !text-xs font-medium cursor-pointer text-center justify-center"
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
