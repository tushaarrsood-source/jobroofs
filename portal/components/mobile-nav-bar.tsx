'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Home, Plus, MapPin, Download, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { usePWA } from '@/components/pwa-provider';
import { MobilePostDrawer } from '@/components/mobile-post-drawer';

export function MobileNavBar() {
  const pathname = usePathname();
  const { isDe } = useTranslation();
  const { isInstalled, isInstallable, promptInstall, openInstallModal } = usePWA();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Determine active route
  const isJobs = pathname === '/' || pathname.startsWith('/jobs') || pathname.startsWith('/categories');
  const isHousing = pathname.startsWith('/wohnen');
  const isRadar = pathname.includes('/map') || pathname.includes('#map');

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch (e) {
        // ignore
      }
    }
  };

  const handlePostClick = () => {
    triggerHaptic();
    setIsDrawerOpen(true);
  };

  const handleInstallClick = () => {
    triggerHaptic();
    if (isInstallable) {
      promptInstall();
    } else {
      openInstallModal();
    }
  };

  return (
    <>
      <nav
        aria-label="Mobile Navigation Dock"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden pointer-events-none"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
        }}
      >
        <div className="mx-auto max-w-md px-3 pt-1 pointer-events-auto">
          <div className="relative flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/85 px-2 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            {/* Ambient Background Gradient Glow */}
            <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-indigo-600/20 blur-md opacity-60" />

            {/* 1. Jobs Tab */}
            <Link
              href="/"
              onClick={triggerHaptic}
              className={`relative z-10 flex flex-1 flex-col items-center justify-center py-1 text-center transition-all active:scale-90 ${
                isJobs
                  ? 'text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Briefcase className="size-5" />
                {isJobs && (
                  <span className="absolute -top-1 -right-1 size-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                )}
              </div>
              <span className="mt-1 text-[10px] tracking-tight font-medium">Jobs</span>
            </Link>

            {/* 2. Housing Tab */}
            <Link
              href="/wohnen"
              onClick={triggerHaptic}
              className={`relative z-10 flex flex-1 flex-col items-center justify-center py-1 text-center transition-all active:scale-90 ${
                isHousing
                  ? 'text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Home className="size-5" />
                {isHousing && (
                  <span className="absolute -top-1 -right-1 size-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                )}
              </div>
              <span className="mt-1 text-[10px] tracking-tight font-medium">
                {isDe ? 'Wohnen' : 'Housing'}
              </span>
            </Link>

            {/* 3. Central Futuristic Action Button (+) */}
            <div className="relative z-10 flex flex-1 items-center justify-center -mt-5">
              <button
                type="button"
                onClick={handlePostClick}
                aria-label="Neues Inserat erstellen"
                className="group relative flex size-12 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all active:scale-90 cursor-pointer"
              >
                {/* Glowing Pulse Ring */}
                <span className="absolute -inset-1 rounded-full bg-blue-500/40 blur-sm animate-pulse" />
                <Plus className="relative z-10 size-6 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
              </button>
            </div>

            {/* 4. Radar Map Tab */}
            <Link
              href={isHousing ? '/wohnen?view=map#housing' : '/?view=map#jobs'}
              onClick={triggerHaptic}
              className={`relative z-10 flex flex-1 flex-col items-center justify-center py-1 text-center transition-all active:scale-90 ${
                isRadar
                  ? 'text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <MapPin className="size-5" />
                <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <span className="mt-1 text-[10px] tracking-tight font-medium">Radar</span>
            </Link>

            {/* 5. App / Install / Menu Tab */}
            <button
              type="button"
              onClick={handleInstallClick}
              className="relative z-10 flex flex-1 flex-col items-center justify-center py-1 text-center transition-all active:scale-90 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <div className="relative">
                {isInstalled ? (
                  <Sparkles className="size-5 text-amber-400" />
                ) : (
                  <Download className="size-5 text-blue-400 animate-bounce duration-1000" />
                )}
              </div>
              <span className="mt-1 text-[10px] tracking-tight font-medium">
                {isInstalled ? 'PWA Live' : (isDe ? 'App' : 'Install')}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Post Action Drawer */}
      <MobilePostDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
