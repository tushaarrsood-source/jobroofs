'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { industryNiches, type IndustryNiche } from '@/lib/domain/taxonomy';

export function CategoryCarousel({
  niches = industryNiches,
  title = 'Work across Berlin',
  eyebrow = 'Browse by category',
}: {
  niches?: IndustryNiche[];
  title?: string;
  eyebrow?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    <section id="niches" className="border-b border-foreground/15 bg-[#f4f0e7] py-12 md:py-16">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#385cdd]">
              {eyebrow}
            </p>
            <h2 className="mt-1.5 text-2xl font-semibold tracking-[-0.04em] sm:text-4xl">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {niches.length} curated categories across all 12 Berlin districts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="grid size-9 place-items-center rounded-full border border-foreground/15 bg-white text-foreground shadow-sm transition hover:bg-[#18221e] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-foreground"
                aria-label="Scroll left"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="grid size-9 place-items-center rounded-full border border-foreground/15 bg-white text-foreground shadow-sm transition hover:bg-[#18221e] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-foreground"
                aria-label="Scroll right"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollRef}
          className="mt-8 flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {niches.map((niche) => {
            return (
              <Link
                key={niche.id}
                href={`/categories/${niche.id}`}
                className="group relative flex w-[280px] shrink-0 snap-start flex-col justify-between rounded-xl border border-foreground/15 bg-white p-5 shadow-xs transition hover:border-[#385cdd] hover:shadow-sm sm:w-[300px]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#385cdd]">
                      {niche.labelDe}
                    </span>
                    {niche.priority === 'launch' && (
                      <span className="rounded-full bg-[#e8f6ed] px-2 py-0.5 text-[10px] font-medium text-[#245e3c]">
                        Active
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-base font-semibold tracking-tight text-[#18221e] group-hover:text-[#385cdd]">
                    {niche.label}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {niche.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-foreground/10 pt-3 text-xs font-medium text-[#385cdd]">
                  <span>Browse jobs</span>
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
