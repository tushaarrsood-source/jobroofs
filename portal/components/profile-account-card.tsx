'use client';

import React, { useState } from 'react';
import { User as UserIcon, LogOut, Trash2, ShieldCheck, Cloud, CloudOff, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/firebase/auth-context';
import { AuthModal } from '@/components/auth-modal';
import { DeleteAccountModal } from '@/components/delete-account-modal';
import { LanguageToggle } from '@/components/language-toggle';

export function ProfileAccountCard() {
  const { isDe } = useTranslation();
  const { user, signOutUser } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

      {/* 2. GDPR Privacy & Account Deletion Card */}
      {user && (
        <div className="rounded-[20px] border border-black/[0.06] bg-white p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#34c759]" />
                <h3 className="text-sm font-semibold text-[#1d1d1f]">
                  {isDe ? 'Datenschutz & Konto-Löschung' : 'Privacy & Account Deletion'}
                </h3>
              </div>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                {isDe
                  ? 'Gemäß Art. 17 DSGVO hast du das Recht auf vollständige Löschung deiner personenbezogenen Daten und aller erstellten Inserate.'
                  : 'Under Art. 17 GDPR, you have the right to permanent erasure of your personal data and all created listings.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/60 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100/70 transition active:scale-[0.96] cursor-pointer shrink-0"
            >
              <Trash2 className="size-3.5" />
              <span>{isDe ? 'Konto löschen' : 'Delete account'}</span>
            </button>
          </div>
        </div>
      )}

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <DeleteAccountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onRequiresReauth={() => setAuthOpen(true)}
      />
    </>
  );
}
