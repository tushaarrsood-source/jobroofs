'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useTranslation } from '@/lib/i18n/language-context';
import { AuthModal } from '@/components/auth-modal';

export function PortalWelcomeBanner() {
  const { user } = useAuth();
  const { isDe } = useTranslation();
  const [authOpen, setAuthOpen] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Only show if not logged in and not previously dismissed in this session
    if (!user) {
      const isDismissed = sessionStorage.getItem('jobroofs_welcome_dismissed');
      if (!isDismissed) {
        setDismissed(false);
      }
    }
  }, [user]);

  if (user || dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem('jobroofs_welcome_dismissed', 'true');
    setDismissed(true);
  };

  return (
    <>
      <div className="relative z-30 border-b border-black/[0.06] bg-gradient-to-r from-blue-50/90 via-white/95 to-amber-50/80 backdrop-blur-md px-3 sm:px-4 md:px-6 py-2.5 shadow-2xs">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0071e3]/10 text-[#0071e3]">
              <Sparkles className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs sm:text-[13px] font-medium text-[#1d1d1f] truncate">
                {isDe ? (
                  <>
                    <strong className="font-semibold text-[#0071e3]">Neu bei JOBROOFS?</strong>{' '}
                    Kostenlos registrieren & direkt bei Berliner Arbeitgebern & Vermietern bewerben.
                  </>
                ) : (
                  <>
                    <strong className="font-semibold text-[#0071e3]">New to JOBROOFS?</strong>{' '}
                    Create your free account to apply directly to Berlin employers and hosts.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0071e3] px-3.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-[#0077ed] transition active:scale-[0.97] cursor-pointer"
            >
              <span>{isDe ? 'Jetzt registrieren' : 'Sign up free'}</span>
              <ArrowRight className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="grid size-6 place-items-center rounded-full text-[#86868b] hover:bg-black/[0.06] hover:text-[#1d1d1f] transition cursor-pointer"
              title={isDe ? 'Schließen' : 'Dismiss'}
              aria-label="Dismiss banner"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
