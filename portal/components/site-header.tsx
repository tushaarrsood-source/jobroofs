'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { LanguageToggle } from '@/components/language-toggle';

export function SiteHeader({ control = false }: { control?: boolean }) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-10">
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-95"
        >
          <span className="flex items-center font-black text-xl tracking-tight text-slate-900 font-sans">
            KIEZ<span className="text-blue-600">JOB</span>
          </span>
          <span className="rounded bg-blue-50 border border-blue-200/60 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-blue-700 uppercase">
            BERLIN
          </span>
          {control ? (
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-600 border border-slate-200">
              {t('controlRoom')}
            </span>
          ) : null}
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="flex items-center gap-4 text-xs font-semibold sm:gap-6 sm:text-sm">
            {control ? (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-blue-600 hover:underline"
              >
                {t('publicPortal')} <ArrowUpRight className="size-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/direct-employers"
                  className="hidden text-slate-600 hover:text-blue-600 transition-colors sm:inline"
                >
                  {t('directEmployers')}
                </Link>
                <Link
                  href="/latest-jobs"
                  className="hidden text-slate-600 hover:text-blue-600 transition-colors md:inline"
                >
                  {t('latestJobs')}
                </Link>
                <Link
                  href="/#niches"
                  className="hidden text-slate-600 hover:text-blue-600 transition-colors lg:inline"
                >
                  {t('categories')}
                </Link>
                <Link
                  href="/wohnen"
                  className="inline-flex items-center gap-1.5 font-bold text-slate-900 transition hover:text-blue-600"
                >
                  <span>{t('navHousing')}</span>
                  <span className="rounded bg-blue-600 text-white px-1.5 py-0.2 text-[9px] font-bold tracking-wide uppercase">
                    Neu
                  </span>
                </Link>
                <Link
                  href="/post-a-job"
                  className="inline-flex h-9 items-center rounded-lg bg-blue-600 px-4 text-xs font-bold text-white transition hover:bg-blue-700 shadow-sm shadow-blue-500/20"
                >
                  {t('postAJob')} <ArrowUpRight className="ml-1 size-3" />
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
