'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from '@/components/ui/link';
import { Search, MapPin, Euro, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMyListings } from '@/lib/storage/my-listings';
import { useTranslation } from '@/lib/i18n/language-context';

const DISTRICTS = [
  { id: 'all', labelDe: 'Alle Bezirke', labelEn: 'All Districts' },
  { id: 'mitte', labelDe: 'Mitte', labelEn: 'Mitte' },
  { id: 'kreuzberg', labelDe: 'Kreuzberg', labelEn: 'Kreuzberg' },
  { id: 'friedrichshain', labelDe: 'Friedrichshain', labelEn: 'Friedrichshain' },
  { id: 'neukölln', labelDe: 'Neukölln', labelEn: 'Neukölln' },
  { id: 'prenzlauer berg', labelDe: 'Prenzlauer Berg', labelEn: 'Prenzlauer Berg' },
  { id: 'charlottenburg', labelDe: 'Charlottenburg', labelEn: 'Charlottenburg' },
  { id: 'schöneberg', labelDe: 'Schöneberg', labelEn: 'Schöneberg' },
  { id: 'wedding', labelDe: 'Wedding', labelEn: 'Wedding' },
  { id: 'lichtenberg', labelDe: 'Lichtenberg', labelEn: 'Lichtenberg' },
];

const CATEGORIES = [
  { id: 'all', labelDe: 'Alle Bereiche', labelEn: 'All Categories', keywords: [] },
  { id: 'aushilfe', labelDe: 'Aushilfe & Minijob', labelEn: 'Temp & Minijob', keywords: ['aushilfe', 'minijob', 'helfer', 'allrounder', 'aushilfskraft'] },
  { id: 'gastro', labelDe: 'Gastro & Bar', labelEn: 'Gastro & Bar', keywords: ['gastro', 'kellner', 'barista', 'küche', 'service', 'koch', 'bar', 'restaurant', 'schank'] },
  { id: 'reinigung', labelDe: 'Reinigung & Haushalt', labelEn: 'Cleaning & Household', keywords: ['reinigung', 'putzen', 'haushalt', 'zimmer', 'cleaner', 'housekeeping'] },
  { id: 'events', labelDe: 'Events & Promo', labelEn: 'Events & Promo', keywords: ['event', 'promo', 'hostess', 'festival', 'aufbau', 'messe', 'einlass'] },
  { id: 'lager', labelDe: 'Lager & Logistik', labelEn: 'Warehouse & Logistics', keywords: ['lager', 'logistik', 'kommissionier', 'fahrer', 'kurier', 'packer', 'transport'] },
  { id: 'retail', labelDe: 'Verkauf & Retail', labelEn: 'Sales & Retail', keywords: ['verkauf', 'kasse', 'retail', 'store', 'laden', 'einzelhandel', 'shop'] },
];

const JOBS_PER_PAGE = 20;

function formatWage(job: any, isDe = true): string {
  if (job.payText) return job.payText;
  if (job.compensation?.amountMin) {
    return `${job.compensation.amountMin} €/${isDe ? 'Std.' : 'h'}`;
  }
  if (job.compensation?.label) {
    const l = job.compensation.label.toLowerCase();
    if (l.includes('tarif')) {
      return isDe ? 'Tarif / Vereinbarung' : 'Tariff / agreement';
    }
    if (l.includes('vereinbarung') || l.includes('negotiable')) {
      return isDe ? 'Vergütung n.V.' : 'Compensation neg.';
    }
    return job.compensation.label;
  }
  return isDe ? 'Vergütung n.V.' : 'Compensation neg.';
}

function parseWageNumber(wageStr: string): number {
  if (!wageStr) return 0;
  const match = wageStr.replace(',', '.').match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function formatJobType(job: any, isDe = true): string {
  if (Array.isArray(job.employmentForms) && job.employmentForms.length > 0) {
    const form = job.employmentForms[0];
    if (!isDe) {
      if (form.toLowerCase().includes('teilzeit')) return 'Part-time';
      if (form.toLowerCase().includes('vollzeit')) return 'Full-time';
      if (form.toLowerCase().includes('aushilfe')) return 'Temp Help';
      if (form.toLowerCase().includes('werkstudent')) return 'Working Student';
      if (form.toLowerCase().includes('tagesschicht')) return 'Day Shift';
    }
    return form;
  }
  return isDe ? 'Aushilfe / Minijob' : 'Temp / Minijob';
}

function isUrgentJob(job: any): boolean {
  const text = `${job.title} ${job.schedule?.summary || ''} ${job.hours?.label || ''} ${job.tags?.join(' ') || ''}`.toLowerCase();
  return (
    text.includes('sofort') ||
    text.includes('dringend') ||
    text.includes('wochenende') ||
    text.includes('heute') ||
    text.includes('kurzfristig')
  );
}

function getRelativeTime(job: any, index: number, isDe = true): string {
  if (job.isUserListing && job.postedAt) {
    const diffMs = Date.now() - new Date(job.postedAt).getTime();
    const mins = Math.max(1, Math.floor(diffMs / 60000));
    if (mins < 60) return isDe ? `Vor ${mins} Min.` : `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return isDe ? `Vor ${hours} Std.` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return isDe ? `Vor ${days} Tagen` : `${days}d ago`;
  }
  if (job.firstSeenAt) {
    const diffMs = Date.now() - new Date(job.firstSeenAt).getTime();
    const hours = Math.floor(diffMs / 3600000);
    if (hours < 1) return isDe ? 'Vor 40 Min.' : '40m ago';
    if (hours < 24) return isDe ? `Vor ${hours} Std.` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return isDe ? 'Gestern' : 'Yesterday';
    if (days < 7) return isDe ? `Vor ${days} Tagen` : `${days}d ago`;
    return isDe ? 'Diese Woche' : 'This week';
  }
  const h = (index % 12) + 1;
  return isDe ? (h === 1 ? 'Vor 45 Min.' : `Vor ${h} Std.`) : `${h}h ago`;
}

function matchesCategory(job: any, catId: string): boolean {
  if (catId === 'all') return true;
  const cat = CATEGORIES.find((c) => c.id === catId);
  if (!cat || cat.keywords.length === 0) return true;
  const text = `${job.title} ${job.company} ${job.industryId || ''} ${job.roleFamilyId || ''} ${job.tags?.join(' ') || ''}`.toLowerCase();
  return cat.keywords.some((kw) => text.includes(kw));
}

function sortJobsList(list: any[], sort: 'newest' | 'urgent' | 'wage', isDe = true): any[] {
  return [...list].sort((a, b) => {
    // User listings with spotlight/premium always pin higher
    const aSpotlight = a.tier === 'premium' ? 2 : a.isUserListing ? 1 : 0;
    const bSpotlight = b.tier === 'premium' ? 2 : b.isUserListing ? 1 : 0;
    if (aSpotlight !== bSpotlight) return bSpotlight - aSpotlight;

    if (sort === 'wage') {
      const wageA = a.compensation?.amountMin || parseWageNumber(formatWage(a, isDe));
      const wageB = b.compensation?.amountMin || parseWageNumber(formatWage(b, isDe));
      return wageB - wageA;
    }

    if (sort === 'urgent') {
      const aUrgent = isUrgentJob(a) ? 1 : 0;
      const bUrgent = isUrgentJob(b) ? 1 : 0;
      if (aUrgent !== bUrgent) return bUrgent - aUrgent;
    }

    // Default newest
    const timeA = a.firstSeenAt ? new Date(a.firstSeenAt).getTime() : 0;
    const timeB = b.firstSeenAt ? new Date(b.firstSeenAt).getTime() : 0;
    return timeB - timeA;
  });
}

export function JobFeed({
  initialJobs = [],
  initialDirectJobs = [],
}: {
  initialJobs: any[];
  initialDirectJobs?: any[];
}) {
  const { isDe } = useTranslation();
  const [jobs, setJobs] = useState<any[]>(initialJobs);
  const [directJobs, setDirectJobs] = useState<any[]>(initialDirectJobs);
  const [query, setQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'urgent' | 'wage'>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Hydrate direct employer jobs from localStorage and verified partners
  useEffect(() => {
    const syncDirect = () => {
      const stored = getMyListings();
      const userJobs = stored
        .filter((l) => l.type === 'job' && l.status !== 'expired')
        .map((l) => {
          const parts = l.subtitle.split('·').map((p) => p.trim());
          return {
            id: l.id,
            slug: l.linkUrl.replace('/jobs/', '') || l.id,
            title: l.title,
            company: parts[0] || (isDe ? 'Berliner Betrieb' : 'Berlin Employer'),
            district: parts[1] || 'Berlin',
            payText: l.badgeLabel,
            employmentForms: [isDe ? 'Direktbewerbung' : 'Direct Application'],
            isUserListing: true,
            tier: l.tier,
          };
        });

      const map = new Map<string, any>();
      // User listings come first
      userJobs.forEach((j) => map.set(j.slug || j.id, j));
      initialDirectJobs.forEach((j) => {
        if (!map.has(j.slug || j.id)) {
          map.set(j.slug || j.id, j);
        }
      });
      setDirectJobs(Array.from(map.values()));
    };

    syncDirect();
    window.addEventListener('jobroofs_listings_updated', syncDirect);
    return () => window.removeEventListener('jobroofs_listings_updated', syncDirect);
  }, [initialDirectJobs, isDe]);

  // Background hydration: Load the full verified Berlin catalog (1,600+ jobs)
  useEffect(() => {
    let isMounted = true;
    fetch('/api/jobs?limit=2000')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: any) => {
        if (isMounted && data && Array.isArray(data.jobs) && data.jobs.length > 0) {
          const map = new Map<string, any>();
          data.jobs.forEach((j: any) => map.set(j.slug || j.id, j));
          initialJobs.forEach((j: any) => {
            if (!map.has(j.slug || j.id)) {
              map.set(j.slug || j.id, j);
            }
          });
          setJobs(Array.from(map.values()));
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [initialJobs]);

  // Sync with URL query parameters on mount and back/forward navigation
  useEffect(() => {
    const syncFromUrl = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const dist = params.get('district');
      if (dist) {
        const found = DISTRICTS.find(
          (d) =>
            d.id === dist.toLowerCase() ||
            d.labelDe.toLowerCase() === dist.toLowerCase() ||
            d.labelEn.toLowerCase() === dist.toLowerCase()
        );
        if (found) setSelectedDistrict(found.id);
      }
      const q = params.get('q');
      if (q) setQuery(q);
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  // Reset pagination when search, district, category, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedDistrict, selectedCategory, sortBy]);

  // Filter direct employer listings
  const filteredDirectJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    const res = directJobs.filter((job) => {
      if (selectedDistrict !== 'all') {
        const dist = (job.district || '').toLowerCase();
        if (!dist.includes(selectedDistrict)) return false;
      }
      if (!matchesCategory(job, selectedCategory)) return false;
      if (q) {
        const title = (job.title || '').toLowerCase();
        const company = (job.company || '').toLowerCase();
        const district = (job.district || '').toLowerCase();
        return title.includes(q) || company.includes(q) || district.includes(q);
      }
      return true;
    });
    return sortJobsList(res, sortBy, isDe);
  }, [directJobs, query, selectedDistrict, selectedCategory, sortBy, isDe]);

  // Fast client-side filtering for full catalog
  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    const res = jobs.filter((job) => {
      if (selectedDistrict !== 'all') {
        const dist = (job.district || '').toLowerCase();
        if (!dist.includes(selectedDistrict)) return false;
      }
      if (!matchesCategory(job, selectedCategory)) return false;
      if (q) {
        const title = (job.title || '').toLowerCase();
        const company = (job.company || '').toLowerCase();
        const district = (job.district || '').toLowerCase();
        const industry = (job.industryId || '').toLowerCase();
        return (
          title.includes(q) ||
          company.includes(q) ||
          district.includes(q) ||
          industry.includes(q)
        );
      }
      return true;
    });
    return sortJobsList(res, sortBy, isDe);
  }, [jobs, query, selectedDistrict, selectedCategory, sortBy, isDe]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));
  const displayedJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(start, start + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  return (
    <section className="w-full">
      {/* ========================================================================= */}
      {/* 1. DIRECT EMPLOYER LISTINGS SECTION (ENTIRELY ABOVE SEARCH BAR)           */}
      {/* ========================================================================= */}
      <div className="mb-10 sm:mb-12">
        {/* Section Header — minimal */}
        <div className="flex items-center justify-between pb-4 border-b border-[#d8ded9] mb-1">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#1e4635]" />
            <span className="text-[10px] font-mono font-medium uppercase tracking-[0.18em] text-[#7e8a84]">
              {isDe ? 'Direkt vom Berliner Betrieb' : 'Direct from Berlin Employer'}
            </span>
          </div>
          <Link
            href="/post-a-job"
            className="apple-press inline-flex items-center gap-1 text-[11.5px] font-medium text-[#7e8a84] hover:text-[#202a31] transition-colors cursor-pointer"
          >
            <span>{isDe ? '+ Inserat aufgeben' : '+ Post a job'}</span>
          </Link>
        </div>

        {/* Direct Job Rows — same style as main feed, tiny crown badge */}
        {filteredDirectJobs.length > 0 ? (
          <div className="space-y-2.5 mt-2.5">
            {filteredDirectJobs.slice(0, 6).map((job, idx) => {
              const wage = formatWage(job, isDe);
              const jobType = formatJobType(job, isDe);
              const slug = job.slug || job.id;
              const urgent = isUrgentJob(job);
              const relTime = getRelativeTime(job, idx, isDe);

              return (
                <Link
                  key={slug}
                  href={`/jobs/${slug}`}
                  className="silent-card group block rounded-sm p-4 sm:p-5 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3
                          className="text-[15.5px] sm:text-[17px] font-normal text-[#202a31] group-hover:text-[#4a5751] transition-colors line-clamp-1 tracking-tight"
                          style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                        >
                          {job.title}
                        </h3>
                        {/* Tiny crown — direct employer marker */}
                        <span className="shrink-0 text-[11px] leading-none" title={isDe ? 'Direkt vom Betrieb' : 'Direct from employer'}>👑</span>
                        {job.isUserListing && (
                          <span className="shrink-0 font-mono text-[8.5px] uppercase bg-[#202a31] text-[#fbfbf8] px-1.5 py-0.5 rounded-xs font-medium leading-none">
                            {isDe ? 'DEIN INSERAT' : 'YOUR LISTING'}
                          </span>
                        )}
                        {urgent && (
                          <span className="shrink-0 font-mono text-[8.5px] uppercase bg-amber-500/10 text-amber-900 border border-amber-500/30 px-1.5 py-0.5 rounded-xs font-medium leading-none">
                            {isDe ? '⚡ DRINGEND' : '⚡ URGENT'}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center justify-between text-[13px] font-light text-[#7e8a84]">
                        <span>{job.company}</span>
                        <span className="font-mono text-[11px] text-[#7e8a84] shrink-0 ml-2">
                          {relTime}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px]">
                        <span className="inline-flex items-center gap-1 text-[#5a6460] font-light">
                          <MapPin className="size-3 stroke-[1.25] text-[#7e8a84]" />
                          {job.district || 'Berlin'}
                        </span>
                        <span className="text-[#d8ded9]">&middot;</span>
                        <span className="inline-flex items-center gap-1 text-[#202a31] font-mono font-medium">
                          <Euro className="size-3 stroke-[1.25] text-[#7e8a84]" />
                          {wage}
                        </span>
                        <span className="text-[#d8ded9]">&middot;</span>
                        <span className="inline-flex items-center gap-1 text-[10.5px] uppercase tracking-[0.14em] text-[#7e8a84]">
                          <Clock className="size-3 stroke-[1.25] text-[#7e8a84]" />
                          {jobType}
                        </span>
                      </div>
                    </div>

                    {/* Right Arrow */}
                    <div className="shrink-0 self-center size-7 flex items-center justify-center text-[#7e8a84] group-hover:text-[#202a31] group-hover:translate-x-0.5 transition-all">
                      <ArrowRight className="size-4 stroke-[1.25]" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-7 px-4 text-center rounded-xl border border-[#d8ded9] bg-white/70">
            <p className="text-[13.5px] font-medium text-[#202a31]">
              {isDe ? 'Noch keine direkten Inserate vorhanden.' : 'No direct listings yet.'}
            </p>
            <p className="text-[12px] text-[#7e8a84] font-light mt-1 max-w-md mx-auto">
              {isDe
                ? 'Es gibt aktuell noch keine direkten Stellenanzeigen von Arbeitgebern. Sei der erste Berliner Betrieb!'
                : 'There are currently no direct employer job postings. Be the first Berlin business!'}
            </p>
            <div className="mt-3.5">
              <Link
                href="/post-a-job"
                className="apple-press inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#202a31] text-[#fbfbf8] text-[12px] font-medium hover:bg-[#161D22] transition-colors cursor-pointer shadow-2xs"
              >
                <span>{isDe ? '+ Jetzt als erster Betrieb inserieren' : '+ Post the first direct listing'}</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Hairline Catalog Transition / Divider */}
      <div className="relative my-8 sm:my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#d8ded9]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#fbfbf8] px-4 text-[10px] sm:text-[10.5px] font-medium uppercase tracking-[0.18em] text-[#7e8a84]">
            {isDe ? 'Alle verifizierten Stellen im Kiez durchsuchen' : 'Search all verified neighborhood jobs'}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & FILTER SECTION                                               */}
      {/* ========================================================================= */}
      <div className="mb-8 space-y-3">
        {/* Sleek Architectural Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 stroke-[1.25] text-[#7e8a84]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isDe ? 'Jobtitel, Firma oder Stichwort suchen...' : 'Search job title, company or keyword...'}
            className="w-full h-11 pl-10 pr-4 rounded-sm border border-[#d8ded9] bg-white text-base sm:text-[13.5px] text-[#202a31] placeholder:text-[#7e8a84] focus:border-[#202a31] focus:ring-0 outline-none transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="apple-press absolute right-3 top-1/2 -translate-y-1/2 text-[11.5px] font-normal text-[#7e8a84] hover:text-[#202a31] px-2 py-1 cursor-pointer"
            >
              {isDe ? 'Löschen' : 'Clear'}
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[12px]">
          <span className="text-[10px] uppercase tracking-[0.14em] text-[#7e8a84] font-mono mr-1 shrink-0">
            {isDe ? 'Bereich:' : 'Category:'}
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`apple-press shrink-0 px-2.5 py-1 rounded-sm text-[11.5px] font-normal tracking-[0.01em] transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#202a31] text-[#fbfbf8]'
                    : 'bg-white text-[#7e8a84] border border-[#d8ded9] hover:text-[#202a31] hover:border-[#202a31]'
                }`}
              >
                {isDe ? cat.labelDe : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* District Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[12px]">
          <span className="text-[10px] uppercase tracking-[0.14em] text-[#7e8a84] font-mono mr-1 shrink-0">
            {isDe ? 'Bezirk:' : 'District:'}
          </span>
          {DISTRICTS.map((d) => {
            const isActive = selectedDistrict === d.id;
            return (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDistrict(d.id);
                  if (typeof window !== 'undefined') {
                    const url = new URL(window.location.href);
                    if (d.id === 'all') url.searchParams.delete('district');
                    else url.searchParams.set('district', d.id);
                    window.history.replaceState({}, '', url.toString());
                  }
                }}
                className={`apple-press shrink-0 px-2.5 py-1 rounded-sm text-[11.5px] font-normal tracking-[0.01em] transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#202a31] text-[#fbfbf8]'
                    : 'bg-white text-[#7e8a84] border border-[#d8ded9] hover:text-[#202a31] hover:border-[#202a31]'
                }`}
              >
                {isDe ? d.labelDe : d.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Counter & Status Header with Sort Option */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d8ded9] pb-3 mb-5 gap-2 text-[12px] text-[#7e8a84]">
        <span>
          <strong className="text-[#202a31] font-medium">
            {filteredJobs.length.toLocaleString(isDe ? 'de-DE' : 'en-US')}
          </strong>{' '}
          {isDe ? 'aktuelle Stellen in Berlin' : 'active jobs in Berlin'}
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#7e8a84]">
              {isDe ? 'Sortieren:' : 'Sort by:'}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[#202a31] text-[12px] font-medium border-b border-[#d8ded9] pb-0.5 outline-none cursor-pointer"
            >
              <option value="newest">{isDe ? 'Neueste zuerst' : 'Newest first'}</option>
              <option value="urgent">{isDe ? 'Dringend / Sofort' : 'Urgent / Immediate'}</option>
              <option value="wage">{isDe ? 'Höchster Lohn' : 'Highest pay'}</option>
            </select>
          </div>
          <span className="text-[#d8ded9] hidden sm:inline">&middot;</span>
          <span className="font-mono text-[11px] text-[#7e8a84]">
            {String(currentPage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Job Card Feed */}
      <div className="space-y-2.5">
        {displayedJobs.map((job, idx) => {
          const wage = formatWage(job, isDe);
          const jobType = formatJobType(job, isDe);
          const slug = job.slug || job.id;
          const itemIndex = String(idx + 1 + (currentPage - 1) * JOBS_PER_PAGE).padStart(2, '0');
          const urgent = isUrgentJob(job);
          const relTime = getRelativeTime(job, idx + (currentPage - 1) * JOBS_PER_PAGE, isDe);

          return (
            <Link
              key={slug || idx}
              href={`/jobs/${slug}`}
              style={{ animationDelay: `${Math.min(idx, 8) * 30}ms` }}
              className="silent-card stagger-in group block rounded-sm p-4 sm:p-5 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {/* Monospaced Item Number */}
                  <span className="hidden sm:inline-block font-mono text-[11px] text-[#7e8a84] pt-0.5 w-6">
                    {itemIndex}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3
                        className="text-[15.5px] sm:text-[17px] font-normal text-[#202a31] group-hover:text-[#4a5751] transition-colors line-clamp-1 tracking-tight"
                        style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                      >
                        {job.title}
                      </h3>
                      {(job.tier === 'premium' || job.sourceKind === 'direct_employer' || job.isUserListing) && (
                        <span className="shrink-0 text-[11px] leading-none" title={isDe ? 'Direkt vom Betrieb' : 'Direct from employer'}>👑</span>
                      )}
                      {job.isUserListing && (
                        <span className="shrink-0 font-mono text-[8.5px] uppercase bg-[#202a31] text-[#fbfbf8] px-1.5 py-0.5 rounded-xs font-medium leading-none">
                          {isDe ? 'DEIN INSERAT' : 'YOUR LISTING'}
                        </span>
                      )}
                      {urgent && (
                        <span className="shrink-0 font-mono text-[8.5px] uppercase bg-amber-500/10 text-amber-900 border border-amber-500/30 px-1.5 py-0.5 rounded-xs font-medium leading-none">
                          {isDe ? '⚡ DRINGEND' : '⚡ URGENT'}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center justify-between text-[13px] font-light text-[#7e8a84]">
                      <span>{job.company}</span>
                      <span className="font-mono text-[11px] text-[#7e8a84] shrink-0 ml-2">
                        {relTime}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px]">
                      <span className="inline-flex items-center gap-1 text-[#5a6460] font-light">
                        <MapPin className="size-3 stroke-[1.25] text-[#7e8a84]" />
                        {job.district || 'Berlin'}
                      </span>

                      <span className="text-[#d8ded9]">&middot;</span>

                      <span className="inline-flex items-center gap-1 text-[#202a31] font-mono font-medium">
                        <Euro className="size-3 stroke-[1.25] text-[#7e8a84]" />
                        {wage}
                      </span>

                      <span className="text-[#d8ded9]">&middot;</span>

                      <span className="inline-flex items-center gap-1 text-[10.5px] uppercase tracking-[0.14em] text-[#7e8a84]">
                        <Clock className="size-3 stroke-[1.25] text-[#7e8a84]" />
                        {jobType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Arrow */}
                <div className="shrink-0 self-center size-7 flex items-center justify-center text-[#7e8a84] group-hover:text-[#202a31] group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="size-4 stroke-[1.25]" />
                </div>
              </div>
            </Link>
          );
        })}

        {displayedJobs.length === 0 && (
          <div className="rounded-sm border border-dashed border-[#d8ded9] bg-white p-12 text-center">
            <p className="text-[15px] font-normal text-[#202a31]">
              {isDe ? 'Keine passenden Stellen gefunden' : 'No matching jobs found'}
            </p>
            <p className="mt-1 text-[13px] text-[#7e8a84] font-light">
              {isDe
                ? 'Versuche andere Suchbegriffe oder wähle „Alle Bezirke“.'
                : 'Try different search terms or choose "All Districts".'}
            </p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedDistrict('all');
                setSelectedCategory('all');
                setSortBy('newest');
              }}
              className="mt-4 inline-flex items-center justify-center rounded-sm bg-[#202a31] px-5 py-2 text-[12.5px] font-normal text-[#fbfbf8] hover:bg-[#2d3a43] transition-colors cursor-pointer"
            >
              {isDe ? 'Filter zurücksetzen' : 'Reset filters'}
            </button>
          </div>
        )}
      </div>

      {/* Editorial Pagination Controls */}
      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-between border-t border-[#d8ded9] pt-5 text-[12px]">
          <button
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 rounded-sm border border-[#d8ded9] bg-white px-3.5 py-1.5 text-[#202a31] hover:bg-[#f4f4ee] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-3.5 stroke-[1.25]" /> {isDe ? 'Vorherige' : 'Previous'}
          </button>

          <div className="flex items-center gap-2 font-mono text-[11px] text-[#202a31]">
            <span>{String(currentPage).padStart(2, '0')}</span>
            <span className="text-[#d8ded9]">/</span>
            <span className="text-[#7e8a84]">{String(totalPages).padStart(2, '0')}</span>
          </div>

          <button
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 rounded-sm border border-[#d8ded9] bg-white px-3.5 py-1.5 text-[#202a31] hover:bg-[#f4f4ee] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isDe ? 'Nächste' : 'Next'} <ChevronRight className="size-3.5 stroke-[1.25]" />
          </button>
        </nav>
      )}
    </section>
  );
}
