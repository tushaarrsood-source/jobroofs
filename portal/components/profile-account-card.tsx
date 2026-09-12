'use client';

import React, { useState } from 'react';
import { User as UserIcon, LogOut, CheckCircle2, Crown } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useTranslation } from '@/lib/i18n/language-context';
import { AuthModal } from '@/components/auth-modal';
import { LanguageToggle } from '@/components/language-toggle';
import { isMasterAccount } from '@/lib/domain/master-accounts';

export function ProfileAccountCard() {
  const { user, signOutUser } = useAuth();
  const { isDe } = useTranslation();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      {/* 1. Main Profile Card */}
      <div className="rounded-2xl border border-[#D8DED9] bg-[#FBFBF8] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="size-11 sm:size-12 rounded-full object-cover ring-1 ring-[#D8DED9] shrink-0"
              />
            ) : (
              <div className="flex size-11 sm:size-12 items-center justify-center rounded-2xl bg-white border border-[#D8DED9] shrink-0 shadow-2xs">
                <UserIcon className="size-5 sm:size-6 text-[#7E8A84]" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-semibold tracking-[-0.02em] text-[#202A31] truncate">
                  {user?.displayName || (user ? user.email?.split('@')[0] : (isDe ? 'Mein Bereich' : 'My Account'))}
                </h1>
                {isMasterAccount(user?.email) ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#202A31] px-2.5 py-0.5 text-[10.5px] font-mono font-medium text-[#FBFBF8] border border-[#202A31]">
                    <Crown className="size-3 text-amber-300" />
                    <span>Master Pro</span>
                  </span>
                ) : user ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10.5px] font-medium text-emerald-800">
                    <CheckCircle2 className="size-3 text-emerald-600" />
                    <span>{isDe ? 'Aktiv' : 'Active'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F0F1EA] border border-[#D8DED9] px-2 py-0.5 text-[10.5px] font-medium text-[#7E8A84]">
                    <span>{isDe ? 'Gast' : 'Guest'}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7E8A84] mt-0.5 truncate">
                {isMasterAccount(user?.email)
                  ? (isDe ? '👑 Founder / Master Account · Stripe-Bypass & Unlimited Pro aktiv' : '👑 Founder / Master Account · Stripe Bypass & Unlimited Pro Active')
                  : user?.email || (isDe ? 'Gast-Modus · Nicht angemeldet' : 'Guest mode · Not signed in')}
              </p>
            </div>
          </div>

          {/* Sign in or Sign out button */}
          <div className="shrink-0">
            {user ? (
              <button
                type="button"
                onClick={() => signOutUser()}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-[#D8DED9] bg-white hover:bg-[#F0F1EA] px-3.5 py-1.5 text-xs font-medium text-[#202A31] transition cursor-pointer"
              >
                <LogOut className="size-3.5 text-[#7E8A84]" />
                <span>{isDe ? 'Abmelden' : 'Sign out'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-[#202A31] hover:bg-[#161D22] px-4 py-2 text-xs font-medium text-[#FBFBF8] shadow-xs transition cursor-pointer"
              >
                <span>{isDe ? 'Jetzt Anmelden' : 'Sign in now'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Language switcher row */}
        <div className="mt-4 flex items-center justify-between border-t border-[#D8DED9] pt-3">
          <div className="text-xs font-medium text-[#7E8A84]">
            <span>{isDe ? 'Spracheinstellungen' : 'Language settings'}</span>
          </div>
          <LanguageToggle />
        </div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
