'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface PWAContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  promptInstall: () => Promise<void>;
  showInstallBanner: boolean;
  dismissInstallBanner: () => void;
  openInstallModal: () => void;
  closeInstallModal: () => void;
  isInstallModalOpen: boolean;
}

const PWAContext = createContext<PWAContextType>({
  isInstallable: false,
  isInstalled: false,
  isOnline: true,
  promptInstall: async () => {},
  showInstallBanner: false,
  dismissInstallBanner: () => {},
  openInstallModal: () => {},
  closeInstallModal: () => {},
  isInstallModalOpen: false,
});

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  useEffect(() => {
    // 1. Check if running in standalone mode (already installed as PWA)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    // 2. Service Worker registration
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[JOBROOFS PWA] Service Worker active, scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[JOBROOFS PWA] Service Worker registration error:', err);
        });
    }

    // 3. Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);

      // Check if user dismissed banner recently
      const dismissed = localStorage.getItem('jobroofs_pwa_banner_dismissed');
      const now = Date.now();
      if (!dismissed || now - parseInt(dismissed, 10) > 24 * 60 * 60 * 1000) {
        setShowInstallBanner(true);
      }
    };

    // 4. App Installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      console.log('[JOBROOFS PWA] App installed successfully');
    };

    // 5. Network online/offline
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const promptInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // For iOS or browsers without beforeinstallprompt event
      setIsInstallModalOpen(true);
    }
  };

  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('jobroofs_pwa_banner_dismissed', Date.now().toString());
  };

  const openInstallModal = () => setIsInstallModalOpen(true);
  const closeInstallModal = () => setIsInstallModalOpen(false);

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isInstalled,
        isOnline,
        promptInstall,
        showInstallBanner,
        dismissInstallBanner,
        openInstallModal,
        closeInstallModal,
        isInstallModalOpen,
      }}
    >
      {children}
      {/* Ambient Offline Notification Bar */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2 bg-amber-500 py-1.5 px-3 text-center text-xs font-bold text-slate-950 shadow-md">
          <span className="size-2 rounded-full bg-slate-950 animate-ping" />
          <span>OFFLINE-MODUS AKTIV — Gespeicherte Jobs & Wohnungen werden aus dem PWA-Cache angezeigt</span>
        </div>
      )}
    </PWAContext.Provider>
  );
}

export const usePWA = () => useContext(PWAContext);
