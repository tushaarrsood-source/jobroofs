'use client';

import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { LanguageToggle } from '@/components/language-toggle';

export function SiteHeader({ control = false }: { control?: boolean }) {
  const { t } = useTranslation();

  return (
    <header className="border-b border-foreground/15 bg-[#f4f0e7]">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold tracking-[-0.03em]"
        >
          <span className="grid size-8 place-items-center rounded-full bg-[#18221e] text-[#f4f0e7] shadow-xs">
            <MapPin className="size-4 text-[#ed6a43]" strokeWidth={2.4} />
          </span>
          <span className="font-extrabold tracking-[-0.04em]">KIEZJOB</span>
          <span className="hidden rounded-md border border-[#385cdd]/25 bg-[#edf2ff] px-2 py-0.5 text-[10px] font-bold text-[#385cdd] sm:inline">
            BERLIN
          </span>
          {control ? (
            <span className="hidden rounded-full bg-[#d9ddd7] px-2 py-1 font-mono text-[10px] uppercase tracking-widest sm:inline">
              {t('controlRoom')}
            </span>
          ) : null}
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <nav className="flex items-center gap-4 text-sm sm:gap-5">
            {control ? (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-medium hover:underline"
              >
                {t('publicPortal')} <ArrowUpRight className="size-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/direct-employers"
                  className="hidden text-muted-foreground hover:text-foreground sm:inline"
                >
                  {t('directEmployers')}
                </Link>
                <Link
                  href="/latest-jobs"
                  className="hidden text-muted-foreground hover:text-foreground md:inline"
                >
                  {t('latestJobs')}
                </Link>
                <Link
                  href="/#niches"
                  className="hidden text-muted-foreground hover:text-foreground lg:inline"
                >
                  {t('categories')}
                </Link>
                <Link
                  href="/post-a-job"
                  className="inline-flex h-9 items-center rounded-lg bg-[#18221e] px-4 font-semibold text-white transition hover:bg-[#2a3832]"
                >
                  {t('postAJob')} <ArrowUpRight className="ml-1.5 size-3.5" />
                </Link>
              </>
            )}
          </nav>

          <div className="border-l border-foreground/15 pl-3 sm:pl-4">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
