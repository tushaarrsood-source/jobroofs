'use client';

import React from 'react';
import Image from 'next/image';
import { Download, X, Share2, PlusSquare, Sparkles, Smartphone, CheckCircle2 } from 'lucide-react';
import { usePWA } from '@/components/pwa-provider';
import { useTranslation } from '@/lib/i18n/language-context';

export function PWAInstallBanner() {
  const { isDe } = useTranslation();
  const {
    isInstalled,
    isInstallable,
    showInstallBanner,
    dismissInstallBanner,
    promptInstall,
    isInstallModalOpen,
    closeInstallModal,
  } = usePWA();

  // If already running standalone or dismissed, don't show the bottom banner
  const renderBanner = !isInstalled && showInstallBanner;

  return (
    <>
      {/* 1. Futuristic Floating Install Banner on Mobile */}
      {renderBanner && (
        <aside
          aria-label="PWA Installation Prompt"
          className="fixed bottom-20 left-3 right-3 z-40 md:hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="relative overflow-hidden rounded-2xl border border-blue-500/40 bg-slate-950/90 p-3.5 shadow-2xl backdrop-blur-xl">
            {/* Ambient Background Neon Lines */}
            <div className="pointer-events-none absolute -top-10 -right-10 size-24 rounded-full bg-blue-600/30 blur-xl" />

            <div className="flex items-center gap-3">
              {/* App Icon */}
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 p-2 shadow-md shadow-blue-600/40">
                <Smartphone className="size-6 text-white" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white tracking-tight">
                    JOBROOFS App
                  </h4>
                  <span className="rounded bg-blue-500/20 px-1 py-0.2 font-mono text-[9px] font-bold text-blue-300">
                    PWA 2.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-1">
                  {isDe
                    ? 'Offline-fähig & 1-Tap Kiez-Radar'
                    : 'Offline ready & 1-tap local radar'}
                </p>
              </div>

              {/* Install Button */}
              <button
                type="button"
                onClick={promptInstall}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-2 text-xs font-bold text-white shadow-md active:scale-95 transition cursor-pointer"
              >
                <Download className="size-3.5" />
                <span>{isDe ? 'Install' : 'Install'}</span>
              </button>

              {/* Dismiss */}
              <button
                type="button"
                onClick={dismissInstallBanner}
                aria-label="Schließen"
                className="flex size-7 items-center justify-center rounded-full text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2. iOS / Generic Install Guide Modal */}
      {isInstallModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl border border-slate-700/80 bg-slate-900 p-6 text-white shadow-2xl">
            {/* Close button */}
            <button
              type="button"
              onClick={closeInstallModal}
              className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="size-4" />
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-xl shadow-blue-500/30">
                <Sparkles className="size-7" />
              </div>
              <h3 className="font-display text-xl font-bold tracking-wide">
                JOBROOFS APP INSTALLIEREN
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                {isDe
                  ? 'Nutze JOBROOFS als native Vollbild-App auf deinem Smartphone:'
                  : 'Install JOBROOFS as a standalone native app on your phone:'}
              </p>
            </div>

            {/* Step-by-step for iOS Safari & Android */}
            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-800/60 p-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-600/30 text-blue-400">
                  <Share2 className="size-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white">
                    {isDe ? '1. Teilen-Button tippen' : '1. Tap the Share button'}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    {isDe
                      ? 'Tippe in Safari unten auf das Teilen-Symbol (Viereck mit Pfeil).'
                      : 'In Safari or Chrome, tap the Share icon.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-800/60 p-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600/30 text-emerald-400">
                  <PlusSquare className="size-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white">
                    {isDe ? '2. "Zum Home-Bildschirm"' : '2. "Add to Home Screen"'}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    {isDe
                      ? 'Scrolle nach unten und wähle "Zum Home-Bildschirm hinzufügen".'
                      : 'Scroll down and select "Add to Home Screen".'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-800/60 p-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-cyan-600/30 text-cyan-400">
                  <CheckCircle2 className="size-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white">
                    {isDe ? '3. Fertig!' : '3. Done!'}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    {isDe
                      ? 'Das App-Icon erscheint auf deinem Homescreen für blitzschnellen Start.'
                      : 'The icon appears on your home screen for instant access.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Understand button */}
            <button
              type="button"
              onClick={closeInstallModal}
              className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white transition hover:bg-blue-700 active:scale-98 cursor-pointer"
            >
              {isDe ? 'Verstanden' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
