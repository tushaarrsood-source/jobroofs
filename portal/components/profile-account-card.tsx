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
      {/* 1. Main Profile Card - BORDERLESS SOFT SURFACE */}
      <div className="rounded-3xl bg-zinc-50 p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="size-12 sm:size-14 rounded-full object-cover ring-2 ring-white shrink-0"
              />
            ) : (
              <div className="flex size-12 sm:size-14 items-center justify-center rounded-2xl bg-zinc-200/80 shrink-0 text-black">
                <UserIcon className="size-6 stroke-[2]" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-black truncate">
                  {user?.displayName || (user ? user.email?.split('@')[0] : (isDe ? 'Mein Bereich' : 'My Account'))}
                </h1>
                {isMasterAccount(user?.email) ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-black px-3 py-0.5 text-xs font-mono font-bold text-white">
                    <Crown className="size-3 text-amber-300" />
                    <span>Master Pro</span>
                  </span>
                ) : user ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-900">
                    <CheckCircle2 className="size-3.5 text-emerald-700" />
                    <span>{isDe ? 'Aktiv' : 'Active'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-200 px-3 py-0.5 text-xs font-semibold text-zinc-800">
                    <span>{isDe ? 'Gast' : 'Guest'}</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-600 mt-1 truncate font-medium">
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
                className="apple-press inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-zinc-200/80 hover:bg-zinc-300 px-4 py-2.5 text-sm font-semibold text-black transition cursor-pointer active:scale-[0.98]"
              >
                <LogOut className="size-4 text-zinc-700" />
                <span>{isDe ? 'Abmelden' : 'Sign out'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="apple-press inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-black hover:bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-white transition cursor-pointer active:scale-[0.98]"
              >
                <span>{isDe ? 'Jetzt Anmelden' : 'Sign in now'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Language switcher row */}
        <div className="mt-5 flex items-center justify-between border-t border-zinc-200/80 pt-4">
          <div className="text-sm font-semibold text-zinc-800">
            <span>{isDe ? 'Spracheinstellungen' : 'Language settings'}</span>
          </div>
          <LanguageToggle />
        </div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
