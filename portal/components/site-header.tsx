'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { LanguageToggle } from '@/components/language-toggle';

export function SiteHeader({ control = false }: { control?: boolean }) {
  const { t, isDe } = useTranslation();
  const pathname = usePathname();

  const isJobsActive =
    pathname === '/' ||
    pathname.startsWith('/jobs') ||
    pathname.startsWith('/categories') ||
    pathname === '/post-a-job';
  const isHousingActive = pathname.startsWith('/wohnen');

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-10">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 transition-opacity hover:opacity-95"
        >
          <span className="flex items-center font-display text-2xl font-bold tracking-wider text-slate-900">
            KIEZ<span className="text-blue-600">JOB</span>
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
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold">
            {control ? (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-blue-600 hover:underline"
              >
                {t('publicPortal')} <ArrowUpRight className="size-3.5" />
              </Link>
            ) : (
              <>
                {/* 1. Jobs Link */}
                <Link
                  href="/"
                  className={`py-1 transition-colors ${
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
                  className={`py-1 transition-colors ${
                    isHousingActive
                      ? 'text-slate-900 font-bold border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isDe ? 'Wohnen' : 'Housing'}
                </Link>

                {/* 3. Housing direct post button */}
                <Link
                  href="/wohnen/list"
                  className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-800 shadow-xs transition hover:bg-slate-50 hover:border-slate-400"
                >
                  + {isDe ? 'Wohnung inserieren' : 'List a Room'}
                </Link>

                {/* 4. Primary Action: Post a Job button */}
                <Link
                  href="/post-a-job"
                  className="inline-flex h-9 items-center rounded-lg bg-blue-600 px-3.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
                >
                  + {isDe ? 'Job inserieren' : 'Post a Job'}
                </Link>
              </>
            )}
          </nav>

          <div className="border-l border-slate-200 pl-3 sm:pl-5">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
