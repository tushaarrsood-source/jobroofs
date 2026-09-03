'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { industryNiches, type IndustryNiche } from '@/lib/domain/taxonomy';
import { useTranslation } from '@/lib/i18n/language-context';

export function CategoryCarousel({
  niches = industryNiches,
  title,
  eyebrow,
}: {
  niches?: IndustryNiche[];
  title?: string;
  eyebrow?: string;
}) {
  const { t, isDe } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const effectiveTitle = title || t('categoryTitle');
  const effectiveEyebrow = eyebrow || t('categoryEyebrow');

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -340 : 340;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section id="niches" className="border-b border-zinc-200/80 bg-zinc-50/70 py-12 md:py-16">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {effectiveEyebrow}
            </p>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
              {effectiveTitle}
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              {t('curatedCategories', { count: niches.length })}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="grid size-8 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-700 shadow-2xs transition hover:bg-zinc-950 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-zinc-700 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="grid size-8 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-700 shadow-2xs transition hover:bg-zinc-950 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-zinc-700 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollRef}
          className="mt-6 flex gap-3.5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {niches.map((niche) => {
            const primaryLabel = isDe ? niche.labelDe : niche.label;
            const secondaryLabel = isDe ? niche.label : niche.labelDe;

            return (
              <Link
                key={niche.id}
                href={`/categories/${niche.id}`}
                className="group relative flex w-[280px] shrink-0 snap-start flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs transition hover:border-zinc-950 hover:shadow-xs sm:w-[300px] cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                      {secondaryLabel}
                    </span>
                    {niche.priority === 'launch' && (
                      <span className="rounded bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                        {t('activeBadge')}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-base font-bold tracking-tight text-zinc-900 group-hover:text-black">
                    {primaryLabel}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 line-clamp-2">
                    {niche.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs font-semibold text-zinc-900">
                  <span>{t('browseCategory')}</span>
                  <ArrowRight className="size-3 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
