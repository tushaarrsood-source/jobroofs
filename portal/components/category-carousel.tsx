'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { industryNiches, type IndustryNiche } from '@/lib/domain/taxonomy';

const nicheIcons: Record<string, string> = {
  'temp-shifts': '⚡',
  'home-help': '🏡',
  gastronomy: '☕',
  hotels: '🏨',
  events: '🎪',
  retail: '🛍️',
  'food-retail': '🛒',
  warehousing: '📦',
  logistics: '🚚',
  cleaning: '✨',
  'office-admin': '💼',
  'customer-support': '🎧',
  'sales-promotion': '📣',
  tourism: '🗺️',
  culture: '🎭',
  nightlife: '🍸',
  'sports-fitness': '⚽',
  'childcare-education': '🎨',
  'healthcare-support': '🩺',
  'elder-social-care': '🤝',
  security: '🛡️',
  'construction-trades': '🔨',
  manufacturing: '🏭',
  'moving-transport': '📦',
  'universities-research': '🔬',
  'ngo-associations': '🌐',
  'media-creative': '🎬',
  'beauty-wellness': '💆',
  'pet-care': '🐾',
  'gardening-outdoor': '🌱',
  'seasonal-markets': '🍁',
  'local-services': '🛠️',
};

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
    const offset = direction === 'left' ? -360 : 360;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section id="niches" className="border-t border-foreground/15 bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
        {/* Section Header with Carousel Navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl md:text-4xl">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs text-muted-foreground mr-1">
              {niches.length} categories
            </span>

            {/* Carousel Navigation Buttons */}
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
            const emoji = nicheIcons[niche.id] || '💼';
            return (
              <Link
                key={niche.id}
                href={`/categories/${niche.id}`}
                className="group relative flex w-[280px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-foreground/15 bg-[#fbfaf6] p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#385cdd] hover:bg-[#f4f7ff] hover:shadow-md sm:w-[320px]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-xl bg-white text-lg shadow-sm border border-foreground/10 group-hover:scale-105 transition">
                      {emoji}
                    </span>
                    {niche.priority === 'launch' && (
                      <span className="rounded-full bg-[#e8f6ed] px-2.5 py-0.5 text-[10px] font-bold text-[#245e3c]">
                        Active in Berlin
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-base font-semibold tracking-tight group-hover:text-[#385cdd]">
                    {niche.label}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground font-medium">
                    {niche.labelDe}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {niche.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-foreground/10 pt-3 text-xs font-semibold text-[#385cdd]">
                  <span>Explore opportunities</span>
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
