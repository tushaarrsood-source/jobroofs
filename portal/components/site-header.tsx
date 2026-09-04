'use client';

import Link from '@/components/ui/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { LanguageToggle } from '@/components/language-toggle';

export function SiteHeader({ control = false }: { control?: boolean }) {
  const { t, isDe } = useTranslation();
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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 glass-chrome shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-3 sm:px-4 md:px-6">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] select-none"
        >
          <span className="flex items-center font-display text-2xl font-bold tracking-tight text-slate-900">
            JOB<span className="text-blue-600">ROOFS</span>
          </span>
          <span className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-widest text-white uppercase">
            BERLIN
          </span>
          {control ? (
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-600 border border-slate-200">
              {t('controlRoom')}
            </span>
          ) : null}
        </Link>

        {/* Right: Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-6">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-semibold">
            {control ? (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-blue-600 hover:underline transition-colors"
              >
                {t('publicPortal')} <ArrowUpRight className="size-3.5" />
              </Link>
            ) : (
              <>
                {/* 1. Jobs Link */}
                <Link
                  href="/"
                  className={`py-1 transition-colors duration-150 active:scale-[0.97] ${
                    isJobsActive
                      ? 'text-slate-900 font-bold border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Jobs
                </Link>

                {/* 2. Housing Link */}
                <Link
                  href="/wohnen"
                  className={`py-1 transition-colors duration-150 active:scale-[0.97] ${
                    isHousingActive
                      ? 'text-slate-900 font-bold border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isDe ? 'Wohnen' : 'Housing'}
                </Link>

                {/* 3. Karte Link */}
                <Link
                  href="/karte"
                  className={`py-1 transition-colors duration-150 active:scale-[0.97] ${
                    isMapActive
                      ? 'text-slate-900 font-bold border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isDe ? 'Karte' : 'Map'}
                </Link>

                {/* 4. Profil Link */}
                <Link
                  href="/profil"
                  className={`py-1 transition-colors duration-150 active:scale-[0.97] ${
                    pathname.startsWith('/profil')
                      ? 'text-slate-900 font-bold border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isDe ? 'Profil' : 'Profile'}
                </Link>

                {/* 4. Housing direct post button */}
                <Link
                  href="/wohnen/list"
                  className="btn-tactile inline-flex h-9 items-center rounded-xl border border-slate-300/90 bg-white px-3.5 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-50 hover:text-blue-600"
                >
                  + {isDe ? 'Wohnung inserieren' : 'List a Room'}
                </Link>

                {/* 5. Post a Job button */}
                <Link
                  href="/post-a-job"
                  className="btn-tactile inline-flex h-9 items-center rounded-xl bg-blue-600 px-3.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                >
                  + {isDe ? 'Job inserieren' : 'Post a Job'}
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Quick Category Switcher */}
          <div className="flex md:hidden items-center gap-1">
            <Link
              href="/"
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                isJobsActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Jobs
            </Link>
            <Link
              href="/wohnen"
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                isHousingActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {isDe ? 'Wohnen' : 'Housing'}
            </Link>
          </div>

          <div className="border-l border-slate-200 pl-2 sm:pl-5">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
