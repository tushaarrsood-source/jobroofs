'use client';

import React, { useState } from 'react';
import Link from '@/components/ui/link';
import { User, Globe, Briefcase, Home, PlusCircle, HelpCircle, Shield, X, ChevronRight, LogOut, Trash2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/firebase/auth-context';
import { AuthModal } from '@/components/auth-modal';
import { DeleteAccountModal } from '@/components/delete-account-modal';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const { isDe, locale, toggleLocale } = useTranslation();
  const { user, signOutUser } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end md:hidden">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative z-10 rounded-t-2xl border-t border-slate-200 bg-white p-5 text-slate-900 shadow-2xl drawer-enter">
        {/* Grab bar */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-300" />

        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3 min-w-0">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="size-10 rounded-full object-cover shrink-0" />
            ) : (
              <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 shrink-0">
                <User className="size-5" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-base font-semibold tracking-[-0.015em] text-[#1d1d1f] truncate">
                {user?.displayName || (isDe ? 'Mein Bereich' : 'My Account')}
              </h3>
              <p className="text-xs text-slate-500 truncate">
                {user?.email || 'JOBROOFS · Berlin'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.92] cursor-pointer shrink-0"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Auth CTA / Status */}
        {user ? (
          <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 p-2.5 px-3">
            <span className="text-xs text-slate-600 font-medium truncate">
              {user.email}
            </span>
            <button
              type="button"
              onClick={() => signOutUser()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer shrink-0 ml-2"
            >
              <LogOut className="size-3.5" />
              <span>{isDe ? 'Abmelden' : 'Sign out'}</span>
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="apple-btn-primary w-full !h-10 !text-xs font-semibold cursor-pointer"
            >
              <span>{isDe ? 'Anmelden / Registrieren' : 'Sign in / Register'}</span>
            </button>
          </div>
        )}

        {/* Menu Options */}
        <div className="divide-y divide-slate-100 text-sm">
          {/* My Listings & Account */}
          <Link
            href="/profil"
            onClick={onClose}
            className="flex items-center justify-between py-3 text-slate-800 hover:text-blue-600 transition-[color,transform] duration-150 active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5 font-medium">
              <User className="size-4 text-blue-600" />
              <span>{isDe ? 'Meine Inserate verwalten' : 'Manage My Listings'}</span>
            </div>
            <ChevronRight className="size-4 text-slate-400" />
          </Link>

          {/* Language Switch */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2.5 text-slate-700">
              <Globe className="size-4 text-slate-400" />
              <span>{isDe ? 'Sprache' : 'Language'}</span>
            </div>
            <button
              type="button"
              onClick={toggleLocale}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95] cursor-pointer"
            >
              <span>{locale === 'de' ? '🇩🇪 Deutsch' : '🇬🇧 English'}</span>
              <ChevronRight className="size-3 text-slate-400" />
            </button>
          </div>

          {/* Post Job */}
          <Link
            href="/post-a-job"
            onClick={onClose}
            className="flex items-center justify-between py-3 text-slate-700 hover:text-blue-600 transition-[color,transform] duration-150 active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5">
              <Briefcase className="size-4 text-blue-600" />
              <span className="font-medium">{isDe ? 'Job inserieren (Aushilfe / Minijob)' : 'Post a Job (Minijob / Temp)'}</span>
            </div>
            <ChevronRight className="size-4 text-slate-400" />
          </Link>

          {/* Post Housing */}
          <Link
            href="/wohnen/list"
            onClick={onClose}
            className="flex items-center justify-between py-3 text-slate-700 hover:text-blue-600 transition-[color,transform] duration-150 active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5">
              <Home className="size-4 text-emerald-600" />
              <span className="font-medium">{isDe ? 'Wohnung oder WG-Zimmer inserieren' : 'List Apartment or Flatshare'}</span>
            </div>
            <ChevronRight className="size-4 text-slate-400" />
          </Link>

          {/* Contact / Help */}
          <a
            href="mailto:kontakt@jobroofs.com"
            onClick={onClose}
            className="flex items-center justify-between py-3 text-slate-700 hover:text-blue-600 transition-[color,transform] duration-150 active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="size-4 text-slate-400" />
              <span>{isDe ? 'Hilfe & Kontakt' : 'Help & Contact'}</span>
            </div>
            <span className="text-xs text-slate-400">kontakt@jobroofs.com</span>
          </a>

          {/* Legal / Impressum */}
          <Link
            href="/impressum"
            onClick={onClose}
            className="flex items-center justify-between py-3 text-slate-700 hover:text-blue-600 transition-[color,transform] duration-150 active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="size-4 text-slate-400" />
              <span>{isDe ? 'Impressum & Datenschutz' : 'Legal & Privacy'}</span>
            </div>
            <ChevronRight className="size-4 text-slate-400" />
          </Link>

          {/* GDPR Account Deletion (Apple App Store & DSGVO Article 17 Compliant) */}
          {user && (
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="flex w-full items-center justify-between py-3 text-red-600 hover:text-red-700 transition-[color,transform] duration-150 active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Trash2 className="size-4 text-red-500" />
                <span className="font-medium text-xs">
                  {isDe ? 'Konto & Daten löschen (Art. 17 DSGVO)' : 'Delete Account & Data (GDPR)'}
                </span>
              </div>
              <ChevronRight className="size-4 text-red-300" />
            </button>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
          JOBROOFS · Berlin Flexible Jobs & Housing
        </div>

        {/* iPhone bottom spacing */}
        <div className="h-4" />
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <DeleteAccountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSuccess={() => onClose()}
        onRequiresReauth={() => setAuthOpen(true)}
      />
    </div>
  );
}
