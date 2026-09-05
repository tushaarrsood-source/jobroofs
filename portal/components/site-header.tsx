'use client';

import { useState } from 'react';
import Link from '@/components/ui/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, User as UserIcon, LogOut } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/firebase/auth-context';
import { AuthModal } from '@/components/auth-modal';
import { LanguageToggle } from '@/components/language-toggle';

export function SiteHeader({ control = false }: { control?: boolean }) {
  const { t, isDe } = useTranslation();
  const { user, signOutUser } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const pathname = usePathname();

  const isMapActive = pathname.startsWith('/karte');
  const isJobsActive =
    !isMapActive &&
    (pathname === '/' ||
      pathname.startsWith('/jobs') ||
      pathname.startsWith('/categories') ||
      pathname === '/post-a-job');
  const isHousingActive = !isMapActive && pathname.startsWith('/wohnen');

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] glass-chrome shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-3 sm:px-4 md:px-6">
        {/* Left: Brand Logo (Apple Minimalist) */}
        <Link
          href="/"
          className="group flex items-center gap-1.5 transition-transform duration-140 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] select-none"
        >
          <span className="flex items-center text-lg font-bold tracking-tight text-[#1d1d1f]">
            JOB<span className="text-[#0071e3]">ROOFS</span>
          </span>
          <span className="text-[10px] font-semibold text-[#86868b] tracking-wider uppercase pl-0.5">
            Berlin
          </span>
          {control ? (
            <span className="ml-2 rounded-full bg-black/[0.04] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#86868b] border border-black/[0.06]">
              {t('controlRoom')}
            </span>
          ) : null}
        </Link>

        {/* Right: Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-5">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#1d1d1f]">
            {control ? (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors"
              >
                {t('publicPortal')} <ArrowUpRight className="size-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-1 pr-2">
                {/* 1. Jobs Link */}
                <Link
                  href="/"
                  className={`rounded-full px-3 py-1 text-xs font-medium transition active:scale-[0.97] ${
                    isJobsActive
                      ? 'bg-black/[0.06] text-[#1d1d1f] font-semibold'
                      : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.03]'
                  }`}
                >
                  Jobs
                </Link>

                {/* 2. Housing Link */}
                <Link
                  href="/wohnen"
                  className={`rounded-full px-3 py-1 text-xs font-medium transition active:scale-[0.97] ${
                    isHousingActive
                      ? 'bg-black/[0.06] text-[#1d1d1f] font-semibold'
                      : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.03]'
                  }`}
                >
                  {isDe ? 'Wohnen' : 'Housing'}
                </Link>

                {/* 3. Karte Link */}
                <Link
                  href="/karte"
                  className={`rounded-full px-3 py-1 text-xs font-medium transition active:scale-[0.97] ${
                    isMapActive
                      ? 'bg-black/[0.06] text-[#1d1d1f] font-semibold'
                      : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.03]'
                  }`}
                >
                  {isDe ? 'Karte' : 'Map'}
                </Link>

                {/* 4. Profil Link */}
                <Link
                  href="/profil"
                  className={`rounded-full px-3 py-1 text-xs font-medium transition active:scale-[0.97] ${
                    pathname.startsWith('/profil')
                      ? 'bg-black/[0.06] text-[#1d1d1f] font-semibold'
                      : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.03]'
                  }`}
                >
                  {isDe ? 'Profil' : 'Profile'}
                </Link>
              </div>
            )}

            {/* Single Unified Apple Primary Action */}
            <Link
              href="/post"
              className="apple-btn-primary"
            >
              <span>+ {isDe ? 'Inserieren' : 'Post'}</span>
            </Link>

            {/* Auth Button */}
            {user ? (
              <div className="hidden sm:flex items-center gap-1.5 pl-1">
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.04] px-2.5 py-1 text-xs font-medium text-[#1d1d1f] hover:bg-black/[0.08] transition"
                  title={user.email || undefined}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="size-4 rounded-full object-cover" />
                  ) : (
                    <UserIcon className="size-3 text-[#86868b]" />
                  )}
                  <span className="truncate max-w-[90px]">
                    {user.displayName || user.email?.split('@')[0] || (isDe ? 'Konto' : 'Account')}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => signOutUser()}
                  className="grid size-7 place-items-center rounded-full text-[#86868b] hover:bg-black/[0.06] hover:text-[#1d1d1f] transition cursor-pointer"
                  title={isDe ? 'Abmelden' : 'Sign out'}
                >
                  <LogOut className="size-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="hidden sm:inline-flex items-center gap-1 rounded-full border border-black/[0.08] bg-white px-3 py-1 text-xs font-medium text-[#1d1d1f] hover:bg-black/[0.03] transition cursor-pointer ml-1"
              >
                <span>{isDe ? 'Anmelden' : 'Sign in'}</span>
              </button>
            )}
          </nav>

          <div className="md:border-l md:border-black/[0.08] md:pl-3">
            <LanguageToggle />
          </div>
        </div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
