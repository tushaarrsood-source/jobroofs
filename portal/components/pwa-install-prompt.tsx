'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, Share, PlusSquare, Sparkles, Check, Smartphone } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { JobroofsMark } from '@/components/brand-logo';

const STORAGE_KEY = 'jobroofs_pwa_dismissed_v1';
const DISMISS_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

/**
 * Global helper to trigger the PWA Install Modal from any button/CTA
 */
export function openAppInstallModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-app-install-modal'));
  }
}

export function PwaInstallPrompt() {
  const { isDe } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Check if already installed / standalone
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // 2. Check if iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // 3. Listen for native Chromium/Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Check if previously dismissed recently
      const dismissedAt = localStorage.getItem(STORAGE_KEY);
      const shouldSuppress = dismissedAt && Date.now() - parseInt(dismissedAt, 10) < DISMISS_DURATION_MS;

      if (!isStandaloneMode && !shouldSuppress) {
        // Subtle delayed presentation so the user has context first
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 3500);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Listen for appinstalled
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setIsOpen(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    // 5. Global trigger event
    const handleOpenModal = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-app-install-modal', handleOpenModal);

    // 6. Check iOS gentle prompt on mobile visit
    if (isIosDevice && !isStandaloneMode) {
      const dismissedAt = localStorage.getItem(STORAGE_KEY);
      const shouldSuppress = dismissedAt && Date.now() - parseInt(dismissedAt, 10) < DISMISS_DURATION_MS;
      if (!shouldSuppress) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          setShowIOSGuide(true);
        }, 4500);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('open-app-install-modal', handleOpenModal);
    };
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {}
    setIsOpen(false);
  };

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsStandalone(true);
        setIsOpen(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  if (!mounted || !isOpen || isStandalone) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-[#202a31]/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[#d8ded9] bg-[#fbfbf8] p-5 sm:p-7 shadow-[0_24px_64px_rgba(32,42,49,0.18)] transition-all animate-in zoom-in-95 duration-200 text-[#202a31] relative"
      >
        {/* Subtle Architectural Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#202a31]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 grid size-7 place-items-center rounded-lg border border-[#d8ded9] bg-white text-[#7e8a84] hover:text-[#202a31] hover:border-[#202a31] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="size-3.5" />
        </button>

        {/* Top App Identity Badge */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="size-13 rounded-2xl bg-white border border-[#d8ded9] shadow-xs flex items-center justify-center shrink-0 p-2.5">
            <JobroofsMark size={28} />
          </div>
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-[#7e8a84] font-medium">
              JOBROOFS // WEBAPP
            </div>
            <h2
              className="text-[17px] sm:text-[19px] font-normal text-[#202a31] tracking-tight leading-tight"
              style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              {isDe ? 'JOBROOFS als App nutzen' : 'Get the JOBROOFS App'}
            </h2>
          </div>
        </div>

        {/* Editorial Subtitle */}
        <p className="text-[12.5px] text-[#5a6460] font-light leading-relaxed mb-5">
          {isDe
            ? 'Installiere JOBROOFS direkt auf deinem Home-Bildschirm für blitzschnellen Direktkontakt zu 1.600+ Berliner Betrieben — ohne App Store Download.'
            : 'Install JOBROOFS directly to your home screen for instant access to 1,600+ Berlin temp jobs and direct employer contacts.'}
        </p>

        {/* Silent Luxury Features Matrix */}
        <div className="mb-6 space-y-2 rounded-xl border border-[#d8ded9] bg-white p-3.5 text-left text-[12px]">
          <div className="flex items-center gap-2.5 text-[#202a31]">
            <div className="grid size-5 place-items-center rounded-full bg-[#f4f4ee] text-[#202a31] shrink-0">
              <Sparkles className="size-3 stroke-[1.75]" />
            </div>
            <span className="font-light">
              {isDe ? '1-Klick Zugriff vom Home-Screen' : 'Instant 1-click home screen launch'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-[#202a31] pt-1.5 border-t border-[#f0f0ea]">
            <div className="grid size-5 place-items-center rounded-full bg-[#f4f4ee] text-[#202a31] shrink-0">
              <Check className="size-3 stroke-[2]" />
            </div>
            <span className="font-light">
              {isDe ? 'Kein App-Store, keine Updates nötig' : 'No App Store download, zero storage bloat'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-[#202a31] pt-1.5 border-t border-[#f0f0ea]">
            <div className="grid size-5 place-items-center rounded-full bg-[#f4f4ee] text-[#202a31] shrink-0">
              <Check className="size-3 stroke-[2]" />
            </div>
            <span className="font-light">
              {isDe ? '100% kostenfrei & ohne Werbung' : '100% free and verified direct contact'}
            </span>
          </div>
        </div>

        {/* iOS Step-by-Step Visual Instruction Box */}
        {(showIOSGuide || isIOS) && (
          <div className="mb-5 rounded-xl border border-[#d8ded9] bg-[#f4f4ee]/80 p-3.5 text-left animate-in fade-in duration-200">
            <div className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#7e8a84] mb-2.5 font-medium">
              {isDe ? 'ANLEITUNG FÜR APPLE SAFARI (iOS)' : 'APPLE SAFARI (iOS) INSTRUCTIONS'}
            </div>
            <ol className="space-y-2 text-[12px] text-[#202a31]">
              <li className="flex items-center gap-2.5">
                <span className="font-mono text-[10.5px] text-[#7e8a84] font-medium w-4 shrink-0">01</span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  {isDe ? 'Tippe unten auf' : 'Tap on the'}{' '}
                  <span className="inline-flex items-center gap-1 rounded-sm border border-[#d8ded9] bg-white px-1.5 py-0.5 font-medium text-[11px]">
                    <Share className="size-3 text-[#202a31]" /> {isDe ? 'Teilen' : 'Share'}
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="font-mono text-[10.5px] text-[#7e8a84] font-medium w-4 shrink-0">02</span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  {isDe ? 'Wähle im Menü' : 'Select'}{' '}
                  <span className="inline-flex items-center gap-1 rounded-sm border border-[#d8ded9] bg-white px-1.5 py-0.5 font-medium text-[11px]">
                    <PlusSquare className="size-3 text-[#202a31]" /> {isDe ? 'Zum Home-Bildschirm' : 'Add to Home Screen'}
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="font-mono text-[10.5px] text-[#7e8a84] font-medium w-4 shrink-0">03</span>
                <span>
                  {isDe ? 'Oben rechts auf' : 'Tap'}{' '}
                  <strong className="font-medium text-[#202a31]">{isDe ? '„Hinzufügen“' : '"Add"'}</strong>{' '}
                  {isDe ? 'tippen — fertig!' : 'at the top right.'}
                </span>
              </li>
            </ol>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {deferredPrompt ? (
            <button
              type="button"
              onClick={handleNativeInstall}
              className="apple-press flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#202a31] hover:bg-[#161d22] py-3 text-[13px] font-medium tracking-[0.02em] text-[#fbfbf8] transition-colors cursor-pointer shadow-xs"
            >
              <Download className="size-4 stroke-[1.75]" />
              <span>{isDe ? 'Jetzt App installieren' : 'Install App Now'}</span>
            </button>
          ) : isIOS && !showIOSGuide ? (
            <button
              type="button"
              onClick={() => setShowIOSGuide(true)}
              className="apple-press flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#202a31] hover:bg-[#161d22] py-3 text-[13px] font-medium tracking-[0.02em] text-[#fbfbf8] transition-colors cursor-pointer shadow-xs"
            >
              <Smartphone className="size-4 stroke-[1.75]" />
              <span>{isDe ? 'Anleitung für iPhone' : 'Install on iPhone'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDismiss}
              className="apple-press flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#202a31] hover:bg-[#161d22] py-3 text-[13px] font-medium tracking-[0.02em] text-[#fbfbf8] transition-colors cursor-pointer shadow-xs"
            >
              <Check className="size-4 stroke-[1.75]" />
              <span>{isDe ? 'Verstanden' : 'Got it'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDismiss}
            className="apple-press inline-flex items-center justify-center rounded-xl border border-[#d8ded9] bg-transparent hover:bg-[#f4f4ee] px-4 py-2.5 text-[12.5px] font-normal text-[#7e8a84] hover:text-[#202a31] transition-colors cursor-pointer"
          >
            <span>{isDe ? 'Später' : 'Maybe Later'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
