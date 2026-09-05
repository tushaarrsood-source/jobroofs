'use client';

import React, { useState } from 'react';
import { User as UserIcon, LogOut, Cloud, CloudOff } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/firebase/auth-context';
import { AuthModal } from '@/components/auth-modal';
import { LanguageToggle } from '@/components/language-toggle';

export function ProfileAccountCard() {
  const { isDe } = useTranslation();
  const { user, signOutUser } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      {/* 1. Main Profile Card */}
      <div className="rounded-[24px] border border-black/[0.06] bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="size-14 rounded-full object-cover shrink-0 ring-2 ring-black/[0.04]"
              />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-full bg-[#f5f5f7] text-[#1d1d1f] shrink-0">
                <UserIcon className="size-7 text-[#86868b]" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#1d1d1f] truncate">
                  {user?.displayName || (user ? user.email?.split('@')[0] : (isDe ? 'Mein Bereich' : 'My Account'))}
                </h1>
                {user ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#34c759]/10 px-2 py-0.5 text-[11px] font-medium text-[#248a3d]">
                    <Cloud className="size-3" />
                    <span>Cloud</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/[0.04] px-2 py-0.5 text-[11px] font-medium text-[#86868b]">
                    <CloudOff className="size-3" />
                    <span>{isDe ? 'Gast' : 'Guest'}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#86868b] mt-0.5 truncate">
                {user?.email || (isDe ? 'Gast-Modus · Nicht angemeldet' : 'Guest mode · Not signed in')}
              </p>
            </div>
          </div>

          {/* Sign in or Sign out button */}
          <div className="shrink-0">
            {user ? (
              <button
                type="button"
                onClick={() => signOutUser()}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3.5 py-1.5 text-xs font-medium text-[#1d1d1f] hover:bg-black/[0.04] transition active:scale-[0.96] cursor-pointer"
              >
                <LogOut className="size-3.5 text-[#86868b]" />
                <span>{isDe ? 'Abmelden' : 'Sign out'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="apple-btn-primary !h-9 !px-4 !text-xs font-medium cursor-pointer"
              >
                <span>{isDe ? 'Jetzt Anmelden' : 'Sign in now'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Language switcher row */}
        <div className="mt-6 flex items-center justify-between border-t border-black/[0.05] pt-4">
          <div className="text-xs font-medium text-[#86868b]">
            <span>{isDe ? 'Spracheinstellungen' : 'Language settings'}</span>
          </div>
          <LanguageToggle />
        </div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
