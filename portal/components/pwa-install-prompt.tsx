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
      className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7 shadow-2xl transition-all animate-in zoom-in-95 duration-200 text-black relative"
      >
        {/* Subtle Architectural Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-black" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 grid size-7 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:text-black hover:border-black transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="size-3.5" />
        </button>

        {/* Top App Identity Badge */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="size-13 rounded-2xl bg-zinc-100 border border-zinc-200 shadow-xs flex items-center justify-center shrink-0 p-2.5">
            <JobroofsMark size={28} />
          </div>
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-zinc-600 font-bold">
              JOBROOFS // WEBAPP
            </div>
            <h2 className="text-[17px] sm:text-[19px] font-bold text-black tracking-tight leading-tight">
              {isDe ? 'JOBROOFS als App nutzen' : 'Get the JOBROOFS App'}
            </h2>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-[13px] text-zinc-700 leading-relaxed mb-5 font-normal">
          {isDe
            ? 'Installiere JOBROOFS direkt auf deinem Home-Bildschirm für blitzschnellen Direktkontakt zu Betrieben in ganz Deutschland — ohne App Store Download.'
            : 'Install JOBROOFS directly to your home screen for instant access to jobs across Germany and direct employer contacts.'}
        </p>

        {/* Features Matrix */}
        <div className="mb-6 space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 text-left text-[12.5px]">
          <div className="flex items-center gap-2.5 text-black">
            <div className="grid size-5 place-items-center rounded-full bg-black text-white shrink-0">
              <Sparkles className="size-3 stroke-[2]" />
            </div>
            <span className="font-medium">
              {isDe ? '1-Klick Zugriff vom Home-Screen' : 'Instant 1-click home screen launch'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-black pt-1.5 border-t border-zinc-200">
            <div className="grid size-5 place-items-center rounded-full bg-black text-white shrink-0">
              <Check className="size-3 stroke-[2]" />
            </div>
            <span className="font-medium">
              {isDe ? 'Kein App-Store, keine Updates nötig' : 'No App Store download, zero storage bloat'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-black pt-1.5 border-t border-zinc-200">
            <div className="grid size-5 place-items-center rounded-full bg-black text-white shrink-0">
              <Check className="size-3 stroke-[2]" />
            </div>
            <span className="font-medium">
              {isDe ? '100% kostenfrei & ohne Werbung' : '100% free and verified direct contact'}
            </span>
          </div>
        </div>

        {/* iOS Step-by-Step Visual Instruction Box */}
        {(showIOSGuide || isIOS) && (
          <div className="mb-5 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 text-left animate-in fade-in duration-200">
            <div className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-zinc-600 mb-2.5 font-bold">
              {isDe ? 'ANLEITUNG FÜR APPLE SAFARI (iOS)' : 'APPLE SAFARI (iOS) INSTRUCTIONS'}
            </div>
            <ol className="space-y-2 text-[12.5px] text-black">
              <li className="flex items-center gap-2.5">
                <span className="font-mono text-[10.5px] text-zinc-500 font-bold w-4 shrink-0">01</span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  {isDe ? 'Tippe unten auf' : 'Tap on the'}{' '}
                  <span className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 font-semibold text-[11px] shadow-2xs">
                    <Share className="size-3 text-black stroke-[2]" /> {isDe ? 'Teilen' : 'Share'}
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="font-mono text-[10.5px] text-zinc-500 font-bold w-4 shrink-0">02</span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  {isDe ? 'Wähle im Menü' : 'Select'}{' '}
                  <span className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 font-semibold text-[11px] shadow-2xs">
                    <PlusSquare className="size-3 text-black stroke-[2]" /> {isDe ? 'Zum Home-Bildschirm' : 'Add to Home Screen'}
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="font-mono text-[10.5px] text-zinc-500 font-bold w-4 shrink-0">03</span>
                <span>
                  {isDe ? 'Oben rechts auf' : 'Tap'}{' '}
                  <strong className="font-bold text-black">{isDe ? '„Hinzufügen“' : '"Add"'}</strong>{' '}
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
              className="apple-press flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-black hover:bg-zinc-800 py-3 text-[13px] font-semibold tracking-[0.02em] text-white transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Download className="size-4 stroke-[2]" />
              <span>{isDe ? 'Jetzt App installieren' : 'Install App Now'}</span>
            </button>
          ) : isIOS && !showIOSGuide ? (
            <button
              type="button"
              onClick={() => setShowIOSGuide(true)}
              className="apple-press flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-black hover:bg-zinc-800 py-3 text-[13px] font-semibold tracking-[0.02em] text-white transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Smartphone className="size-4 stroke-[2]" />
              <span>{isDe ? 'Anleitung für iPhone' : 'Install on iPhone'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDismiss}
              className="apple-press flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-black hover:bg-zinc-800 py-3 text-[13px] font-semibold tracking-[0.02em] text-white transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Check className="size-4 stroke-[2]" />
              <span>{isDe ? 'Verstanden' : 'Got it'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDismiss}
            className="apple-press inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2.5 text-[12.5px] font-semibold text-zinc-700 hover:text-black transition-colors cursor-pointer active:scale-[0.98]"
          >
            <span>{isDe ? 'Später' : 'Maybe Later'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
