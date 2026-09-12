'use client';

import React, { useState } from 'react';
import Link from '@/components/ui/link';
import { User, Globe, Briefcase, Home, PlusCircle, HelpCircle, Shield, X, ChevronRight, LogOut } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/firebase/auth-context';
import { AuthModal } from '@/components/auth-modal';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const { isDe, locale, toggleLocale } = useTranslation();
  const { user, signOutUser } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end md:hidden">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-[#202A31]/45 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative z-10 rounded-t-2xl border-t border-[#D8DED9] bg-[#FBFBF8] p-5 text-[#202A31] shadow-2xl drawer-enter">
        {/* Grab bar */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#D8DED9]" />

        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-[#D8DED9] pb-3">
          <div className="flex items-center gap-3 min-w-0">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="size-10 rounded-full object-cover shrink-0 ring-1 ring-[#D8DED9]" />
            ) : (
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#F0F1EA] text-[#202A31] border border-[#D8DED9] shrink-0">
                <User className="size-5 text-[#7E8A84]" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-base font-semibold tracking-[-0.015em] text-[#202A31] truncate">
                {user?.displayName || (isDe ? 'Mein Bereich' : 'My Account')}
              </h3>
              <p className="text-xs text-[#7E8A84] truncate font-light">
                {user?.email || 'JOBROOFS · Berlin'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="grid size-8 place-items-center rounded-lg border border-[#D8DED9] bg-white text-[#7E8A84] hover:text-[#202A31] hover:border-[#202A31] transition-colors cursor-pointer shrink-0"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Auth CTA / Status */}
        {user ? (
          <div className="mb-4 flex items-center justify-between rounded-xl bg-[#F0F1EA] border border-[#D8DED9] p-2.5 px-3">
            <span className="text-xs text-[#202A31] font-medium truncate">
              {user.email}
            </span>
            <button
              type="button"
              onClick={() => signOutUser()}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#7E8A84] hover:text-red-700 cursor-pointer shrink-0 ml-2"
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
              className="w-full rounded-xl bg-[#202A31] hover:bg-[#161D22] text-[#FBFBF8] py-2.5 text-xs font-medium tracking-wide shadow-xs transition-colors cursor-pointer"
            >
              <span>{isDe ? 'Anmelden / Registrieren' : 'Sign in / Register'}</span>
            </button>
          </div>
        )}

        {/* Menu Options */}
        <div className="divide-y divide-[#D8DED9]/70 text-sm">
          {/* My Listings & Account */}
          <Link
            href="/profil"
            onClick={onClose}
            className="flex items-center justify-between py-3 text-[#202A31] hover:text-[#202A31] transition-colors"
          >
            <div className="flex items-center gap-2.5 font-medium">
              <User className="size-4 text-[#202A31]" />
              <span>{isDe ? 'Meine Inserate verwalten' : 'Manage My Listings'}</span>
            </div>
            <ChevronRight className="size-4 text-[#7E8A84]" />
          </Link>

          {/* Language Switch */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2.5 text-[#202A31]">
              <Globe className="size-4 text-[#7E8A84]" />
              <span>{isDe ? 'Sprache' : 'Language'}</span>
            </div>
            <button
              type="button"
              onClick={toggleLocale}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8DED9] bg-white px-2.5 py-1 text-xs font-medium text-[#202A31] hover:bg-[#F0F1EA] transition-colors cursor-pointer"
            >
              <span>{locale === 'de' ? '🇩🇪 Deutsch' : '🇬🇧 English'}</span>
              <ChevronRight className="size-3 text-[#7E8A84]" />
            </button>
          </div>

          {/* Post Job */}
          <Link
            href="/post-a-job"
            onClick={onClose}
            className="flex items-center justify-between py-3 text-[#202A31] hover:text-[#202A31] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Briefcase className="size-4 text-[#202A31]" />
              <span className="font-medium">{isDe ? 'Job inserieren (Aushilfe / Minijob)' : 'Post a Job (Minijob / Temp)'}</span>
            </div>
            <ChevronRight className="size-4 text-[#7E8A84]" />
          </Link>

          {/* Contact / Help */}
          <a
            href="mailto:kontakt@jobroofs.com"
            onClick={onClose}
            className="flex items-center justify-between py-3 text-[#202A31] hover:text-[#202A31] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="size-4 text-[#7E8A84]" />
              <span>{isDe ? 'Hilfe & Kontakt' : 'Help & Contact'}</span>
            </div>
            <span className="text-xs text-[#7E8A84] font-mono">kontakt@jobroofs.com</span>
          </a>

          {/* Legal / Impressum */}
          <Link
            href="/impressum"
            onClick={onClose}
            className="flex items-center justify-between py-3 text-[#202A31] hover:text-[#202A31] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="size-4 text-[#7E8A84]" />
              <span>{isDe ? 'Impressum & Datenschutz' : 'Legal & Privacy'}</span>
            </div>
            <ChevronRight className="size-4 text-[#7E8A84]" />
          </Link>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-[#D8DED9] text-center text-[10.5px] font-mono uppercase tracking-wider text-[#7E8A84]">
          JOBROOFS &middot; BERLIN WORKFORCE ARCHITECTURE
        </div>

        {/* iPhone bottom spacing */}
        <div className="h-4" />
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
