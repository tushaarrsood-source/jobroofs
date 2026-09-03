'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { LanguageToggle } from '@/components/language-toggle';

export function SiteHeader({ control = false }: { control?: boolean }) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-15 max-w-[1440px] items-center justify-between px-5 md:px-10">
        <Link
          href="/"
          className="group flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <span className="font-black text-xl tracking-tight text-zinc-950 font-sans">
            KIEZJOB
          </span>
          <span className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
            · BERLIN
          </span>
          {control ? (
            <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-600 border border-zinc-200">
              {t('controlRoom')}
            </span>
          ) : null}
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="flex items-center gap-4 text-xs font-medium sm:gap-6 sm:text-sm">
            {control ? (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-medium text-zinc-700 hover:text-zinc-950 hover:underline"
              >
                {t('publicPortal')} <ArrowUpRight className="size-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/direct-employers"
                  className="hidden text-zinc-600 hover:text-zinc-950 transition-colors sm:inline"
                >
                  {t('directEmployers')}
                </Link>
                <Link
                  href="/latest-jobs"
                  className="hidden text-zinc-600 hover:text-zinc-950 transition-colors md:inline"
                >
                  {t('latestJobs')}
                </Link>
                <Link
                  href="/#niches"
                  className="hidden text-zinc-600 hover:text-zinc-950 transition-colors lg:inline"
                >
                  {t('categories')}
                </Link>
                <Link
                  href="/wohnen"
                  className="inline-flex items-center gap-1.5 font-semibold text-zinc-900 transition hover:text-black"
                >
                  <span>{t('navHousing')}</span>
                  <span className="rounded bg-zinc-100 border border-zinc-200 px-1.5 py-0.2 text-[10px] font-bold text-zinc-800">
                    Neu
                  </span>
                </Link>
                <Link
                  href="/post-a-job"
                  className="inline-flex h-8.5 items-center rounded-md bg-zinc-950 px-3.5 text-xs font-semibold text-white transition hover:bg-zinc-800 shadow-xs"
                >
                  {t('postAJob')} <ArrowUpRight className="ml-1 size-3" />
                </Link>
              </>
            )}
          </nav>

          <div className="border-l border-zinc-200 pl-3 sm:pl-5">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
