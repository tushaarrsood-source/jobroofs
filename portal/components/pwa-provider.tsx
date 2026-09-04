'use client';

export function PWAProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export const usePWA = () => ({
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
