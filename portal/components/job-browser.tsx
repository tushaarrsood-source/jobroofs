'use client';

import Link from '@/components/ui/link';
import { useEffect, useMemo, useState, useRef } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Layers,
  List,
  Map as MapIcon,
  MapPin,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { previewJobs } from '@/lib/domain/preview-data';
import { getIndustry } from '@/lib/domain/taxonomy';
import dynamic from 'next/dynamic';
import { formatPinBadge, getGoogleMapsUrl } from '@/lib/domain/berlin-geo';
import { useTranslation } from '@/lib/i18n/language-context';
import { isListingExpired } from '@/lib/domain/entitlements';
import { isJobSuppressed } from '@/lib/sources/suppression-store';

const JobMap = dynamic(() => import('@/components/job-map').then((mod) => mod.JobMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100/60 text-xs font-semibold text-zinc-500">
      Berlin Karte lädt...
    </div>
  ),
});

const featuredNiches = [
  'all',
  'temp-shifts',
  'gastronomy',
  'events',
  'retail',
  'warehousing',
  'cleaning',
  'logistics',
];

const berlinDistricts = [
  { value: 'all', labelDe: 'Alle Bezirke', labelEn: 'All Districts' },
  { value: 'mitte', labelDe: 'Mitte', labelEn: 'Mitte' },
  { value: 'kreuzberg', labelDe: 'Kreuzberg', labelEn: 'Kreuzberg' },
  { value: 'friedrichshain', labelDe: 'Friedrichshain', labelEn: 'Friedrichshain' },
  { value: 'neukölln', labelDe: 'Neukölln', labelEn: 'Neukölln' },
  { value: 'prenzlauer berg', labelDe: 'Prenzlauer Berg', labelEn: 'Prenzlauer Berg' },
  { value: 'schöneberg', labelDe: 'Schöneberg', labelEn: 'Schöneberg' },
  { value: 'charlottenburg', labelDe: 'Charlottenburg', labelEn: 'Charlottenburg' },
  { value: 'wedding', labelDe: 'Wedding', labelEn: 'Wedding' },
  { value: 'lichtenberg', labelDe: 'Lichtenberg', labelEn: 'Lichtenberg' },
  { value: 'treptow', labelDe: 'Treptow', labelEn: 'Treptow' },
];

interface JobBrowserProps {
  initialJobs?: any[];
  filterOrigin?: 'all' | 'employer_posted' | 'sourced';
  pageTitle?: string;
  pageSubtitle?: string;
  sectionTitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  showHero?: boolean;
}

export function JobBrowser({
  initialJobs = previewJobs,
  filterOrigin = 'all',
  pageTitle,
  pageSubtitle,
  sectionTitle,
  viewAllHref = '/direct-employers',
  viewAllLabel,
  showHero = true,
}: JobBrowserProps) {
  const { t, locale, isDe } = useTranslation();
  const [query, setQuery] = useState('');
  const [industry, setIndustry] = useState('all');
  const [district, setDistrict] = useState('all');
  const [employment, setEmployment] = useState('all');
  const [payInterval, setPayInterval] = useState('all');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null);
  const jobCardsRef = useRef<Record<string, HTMLDivElement | null>>({});

  const effectivePageTitle = pageTitle || t('heroTitle');
  const effectivePageSubtitle = pageSubtitle || t('heroSubtitle');
  const effectiveSectionTitle = sectionTitle || t('directListings');
  const effectiveViewAllLabel = viewAllLabel || t('viewAllDirect');

  const visibleJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return initialJobs!
      .filter((job) => {
        // Expiration check: standard (30d) vs premium (60d)
        if (job.expiresAt && isListingExpired(job.expiresAt)) return false;

        // Suppression / deletion check
        if (isJobSuppressed(job.id) || (job.slug && isJobSuppressed(job.slug))) return false;

        // Filter origin check if specified
        if (filterOrigin !== 'all' && job.listingOrigin !== filterOrigin) return false;

        const jobNiches = [
          ...(job.industryId ? [job.industryId] : []),
          ...(job.niches?.map((n: any) => n.nicheId) || []),
        ];
        const matchesIndustry = industry === 'all' || jobNiches.includes(industry);

        // District filter
        const matchesDistrict =
          district === 'all' ||
          (job.district && job.district.toLowerCase().includes(district.toLowerCase()));

        const jobEmployment = Array.isArray(job.employmentForms)
          ? job.employmentForms
          : job.employmentFormsJson
          ? JSON.parse(job.employmentFormsJson)
          : [];
        const matchesEmployment =
          employment === 'all' ||
          jobEmployment.some((form: string) => form.toLowerCase().includes(employment));

        const jobPayInterval =
          job.compensation?.rateInterval ||
          job.compensationRateInterval ||
          job.rateInterval ||
          'not_stated';
        const matchesPay = payInterval === 'all' || jobPayInterval === payInterval;

        const haystack = [
          job.title,
          job.company,
          job.district,
          job.postcode,
          job.industryId ? getIndustry(job.industryId)?.label : '',
          ...(job.niches?.map((n: any) => n.label) || []),
          ...(job.tags || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return (
          matchesIndustry &&
          matchesDistrict &&
          matchesEmployment &&
          matchesPay &&
          (!normalizedQuery || haystack.includes(normalizedQuery))
        );
      })
      .sort((a, b) => {
        const aPrem = a.tier === 'premium' || a.isFeatured;
        const bPrem = b.tier === 'premium' || b.isFeatured;
        if (aPrem && !bPrem) return -1;
        if (bPrem && !aPrem) return 1;
        return 0;
      });
  }, [district, employment, filterOrigin, industry, payInterval, query, initialJobs]);

  const handleSelectJobFromMap = (jobId: string | null) => {
    setSelectedJobId(jobId);
    if (jobId && jobCardsRef.current[jobId]) {
      jobCardsRef.current[jobId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const hasActiveFilters = query || district !== 'all' || employment !== 'all' || industry !== 'all';
  const clearFilters = () => {
    setQuery('');
    setDistrict('all');
    setEmployment('all');
    setIndustry('all');
  };

  return (
    <>
      {showHero && (
        <section className="border-b border-black/[0.06] bg-white">
          <div className="mx-auto max-w-[1440px] px-3 sm:px-4 md:px-6 pt-3.5 pb-2.5 md:pt-6 md:pb-5">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[-0.025em] text-[#1d1d1f] leading-snug">
                {isDe ? (
                  <>Minijobs (603 €) & Flexible Arbeit in Berlin</>
                ) : (
                  <>Minijobs (€603) & Flexible Work in Berlin</>
                )}
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#86868b] max-w-xl leading-relaxed">
                {isDe
                  ? 'Direktkontakt zu Berliner Betrieben, Gastronomie, Events und Kiez-Shops.'
                  : 'Direct contact with local Berlin venues, hospitality, events, and shops.'}
              </p>
            </div>

            {/* Apple Spotlight Search & Controls Bar */}
            <div className="mt-3 md:mt-4 apple-spotlight p-1.5">
              <div className="flex flex-col gap-1.5 md:flex-row md:items-center">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#86868b]" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="h-9 border-none bg-transparent pl-9 pr-8 text-xs text-[#1d1d1f] placeholder:text-[#86868b] focus-visible:ring-0 rounded-lg w-full"
                    placeholder={t('searchPlaceholder')}
                    aria-label="Jobtitel oder Kiez suchen"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] cursor-pointer text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Dropdowns: 2-column grid on mobile */}
                <div className="grid grid-cols-2 gap-1.5 w-full md:flex md:w-auto">
                  <div className="w-full md:w-44">
                    <NativeSelect
                      value={district}
                      onChange={(event) => setDistrict(event.target.value)}
                      className="h-8.5 border-none bg-black/[0.04] hover:bg-black/[0.06] text-xs font-medium text-[#1d1d1f] rounded-lg w-full"
                      aria-label="Bezirk filtern"
                    >
                      {berlinDistricts.map((d) => (
                        <NativeSelectOption key={d.value} value={d.value}>
                          {isDe ? d.labelDe : d.labelEn}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </div>

                  <div className="w-full md:w-40">
                    <NativeSelect
                      value={employment}
                      onChange={(event) => setEmployment(event.target.value)}
                      className="h-8.5 border-none bg-black/[0.04] hover:bg-black/[0.06] text-xs font-medium text-[#1d1d1f] rounded-lg w-full"
                      aria-label="Beschäftigungsart"
                    >
                      <NativeSelectOption value="all">{isDe ? 'Alle Job-Arten' : 'All Job Types'}</NativeSelectOption>
                      <NativeSelectOption value="minijob">{t('minijob')}</NativeSelectOption>
                      <NativeSelectOption value="part-time">{t('partTime')}</NativeSelectOption>
                      <NativeSelectOption value="working student">{t('workingStudent')}</NativeSelectOption>
                      <NativeSelectOption value="short-term">{t('tempShortTerm')}</NativeSelectOption>
                      <NativeSelectOption value="1-day">{t('oneDayShift')}</NativeSelectOption>
                    </NativeSelect>
                  </div>
                </div>
              </div>

              {/* Quick Filter Chips: Apple Pill Style */}
              <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pt-1.5 pb-0.5 text-xs scrollbar-none border-t border-black/[0.04] overscroll-contain touch-pan-x">
                <button
                  type="button"
                  onClick={() => {
                    setDistrict('all');
                    setEmployment('all');
                  }}
                  className={`pill-tactile rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap ${
                    district === 'all' && employment === 'all'
                      ? 'bg-[#1d1d1f] text-white shadow-xs font-semibold'
                      : 'bg-black/[0.04] text-[#1d1d1f] hover:bg-black/[0.07]'
                  }`}
                >
                  {isDe ? 'Alle' : 'All'}
                </button>
                <button
                  type="button"
                  onClick={() => setEmployment(employment === 'minijob' ? 'all' : 'minijob')}
                  className={`pill-tactile rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap ${
                    employment === 'minijob'
                      ? 'bg-[#1d1d1f] text-white shadow-xs font-semibold'
                      : 'bg-black/[0.04] text-[#1d1d1f] hover:bg-black/[0.07]'
                  }`}
                >
                  Minijob (603 €)
                </button>
                <button
                  type="button"
                  onClick={() => setEmployment(employment === 'part-time' ? 'all' : 'part-time')}
                  className={`pill-tactile rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap ${
                    employment === 'part-time'
                      ? 'bg-[#1d1d1f] text-white shadow-xs font-semibold'
                      : 'bg-black/[0.04] text-[#1d1d1f] hover:bg-black/[0.07]'
                  }`}
                >
                  Teilzeit
                </button>
                <button
                  type="button"
                  onClick={() => setEmployment(employment === '1-day' ? 'all' : '1-day')}
                  className={`pill-tactile rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap ${
                    employment === '1-day'
                      ? 'bg-[#1d1d1f] text-white shadow-xs font-semibold'
                      : 'bg-black/[0.04] text-[#1d1d1f] hover:bg-black/[0.07]'
                  }`}
                >
                  Tages-Schichten
                </button>
                <button
                  type="button"
                  onClick={() => setDistrict(district === 'Kreuzberg' ? 'all' : 'Kreuzberg')}
                  className={`pill-tactile rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap ${
                    district === 'Kreuzberg'
                      ? 'bg-[#1d1d1f] text-white shadow-xs font-semibold'
                      : 'bg-black/[0.04] text-[#1d1d1f] hover:bg-black/[0.07]'
                  }`}
                >
                  Kreuzberg
                </button>
                <button
                  type="button"
                  onClick={() => setDistrict(district === 'Mitte' ? 'all' : 'Mitte')}
                  className={`pill-tactile rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap ${
                    district === 'Mitte'
                      ? 'bg-[#1d1d1f] text-white shadow-xs font-semibold'
                      : 'bg-black/[0.04] text-[#1d1d1f] hover:bg-black/[0.07]'
                  }`}
                >
                  Mitte
                </button>
                <button
                  type="button"
                  onClick={() => setDistrict(district === 'Neukölln' ? 'all' : 'Neukölln')}
                  className={`pill-tactile rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap ${
                    district === 'Neukölln'
                      ? 'bg-[#1d1d1f] text-white shadow-xs font-semibold'
                      : 'bg-black/[0.04] text-[#1d1d1f] hover:bg-black/[0.07]'
                  }`}
                >
                  Neukölln
                </button>
                <button
                  type="button"
                  onClick={() => setDistrict(district === 'Friedrichshain' ? 'all' : 'Friedrichshain')}
                  className={`pill-tactile rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap ${
                    district === 'Friedrichshain'
                      ? 'bg-[#1d1d1f] text-white shadow-xs font-semibold'
                      : 'bg-black/[0.04] text-[#1d1d1f] hover:bg-black/[0.07]'
                  }`}
                >
                  Friedrichshain
                </button>
                <button
                  type="button"
                  onClick={() => setDistrict(district === 'Prenzlauer Berg' ? 'all' : 'Prenzlauer Berg')}
                  className={`pill-tactile rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap ${
                    district === 'Prenzlauer Berg'
                      ? 'bg-[#1d1d1f] text-white shadow-xs font-semibold'
                      : 'bg-black/[0.04] text-[#1d1d1f] hover:bg-black/[0.07]'
                  }`}
                >
                  Prenzl. Berg
                </button>
                <button
                  type="button"
                  onClick={() => setDistrict(district === 'Schöneberg' ? 'all' : 'Schöneberg')}
                  className={`pill-tactile rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap ${
                    district === 'Schöneberg'
                      ? 'bg-[#1d1d1f] text-white shadow-xs font-semibold'
                      : 'bg-black/[0.04] text-[#1d1d1f] hover:bg-black/[0.07]'
                  }`}
                >
                  Schöneberg
                </button>
                <button
                  type="button"
                  onClick={() => setDistrict(district === 'Charlottenburg' ? 'all' : 'Charlottenburg')}
                  className={`pill-tactile rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap ${
                    district === 'Charlottenburg'
                      ? 'bg-[#1d1d1f] text-white shadow-xs font-semibold'
                      : 'bg-black/[0.04] text-[#1d1d1f] hover:bg-black/[0.07]'
                  }`}
                >
                  Charlottenburg
                </button>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="pill-tactile ml-auto text-xs text-[#0071e3] hover:underline font-medium cursor-pointer whitespace-nowrap"
                  >
                    ✕ {isDe ? 'Zurücksetzen' : 'Reset'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Listings Section */}
      <section id="jobs" className="bg-[#f8fafc]">
        <div className="mx-auto max-w-[1440px] px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-950">{effectiveSectionTitle}</h2>
              <p className="text-xs text-zinc-500">
                {visibleJobs.length} {t('jobsFound')}
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {viewAllHref && (
                <Link
                  href={viewAllHref}
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-800 shadow-2xs transition hover:border-zinc-400 hover:text-zinc-950"
                >
                  <span>{effectiveViewAllLabel}</span>
                  <ArrowRight className="size-3" />
                </Link>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700">
                <span className="size-1.5 rounded-full bg-emerald-600" />
                Live Kiez-Karte
              </span>
            </div>
          </div>

          {/* Split View (List + Sticky Map on Desktop) */}
          <div className="grid gap-6 lg:grid-cols-[1fr_520px] xl:grid-cols-[1fr_620px] min-w-0 w-full">
            {/* Job Cards Column */}
            <div className="space-y-3 min-w-0 w-full">
              {visibleJobs.length === 0 ? (
                <div className="rounded-[20px] border border-black/[0.06] bg-white p-10 md:p-14 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <p className="font-semibold text-base md:text-lg text-[#1d1d1f]">
                    {hasActiveFilters
                      ? isDe
                        ? 'Keine Jobs für diese Filter gefunden'
                        : 'No jobs found for these filters'
                      : isDe
                      ? 'Noch keine Stellenanzeigen aktiv'
                      : 'No active job postings yet'}
                  </p>
                  <p className="mt-1.5 text-xs text-[#86868b] max-w-sm mx-auto leading-relaxed">
                    {hasActiveFilters
                      ? isDe
                        ? 'Passe deine Suchbegriffe oder Bezirksauswahl an oder setze die Filter zurück.'
                        : 'Adjust your search terms or district filters.'
                      : isDe
                      ? 'Sei der Erste und inseriere jetzt ein Angebot für deinen Berliner Kiez!'
                      : 'Be the first to post a job for your Berlin neighborhood!'}
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-3">
                    {hasActiveFilters ? (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="apple-btn-secondary !h-9 !px-4 !text-xs cursor-pointer"
                      >
                        {isDe ? 'Filter zurücksetzen' : 'Reset filters'}
                      </button>
                    ) : (
                      <Link
                        href="/post-a-job"
                        className="apple-btn-primary !h-9 !px-4 !text-xs inline-flex"
                      >
                        <span>+ {isDe ? 'Job inserieren' : 'Post a Job'}</span>
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                visibleJobs.map((job, idx) => {
                  const isSelected = selectedJobId === job.id || selectedJobId === job.slug;
                  const isHovered = hoveredJobId === job.id || hoveredJobId === job.slug;
                  const wageBadge = formatPinBadge(job);

                  return (
                    <div
                      key={job.id}
                      ref={(el) => {
                        jobCardsRef.current[job.id] = el;
                      }}
                      className="stagger-in min-w-0 w-full"
                      style={{ animationDelay: `${Math.min(idx * 35, 300)}ms` }}
                      onMouseEnter={() => setHoveredJobId(job.id)}
                      onMouseLeave={() => setHoveredJobId(null)}
                    >
                      <JobCard
                        job={job}
                        isSelected={isSelected}
                        isHovered={isHovered}
                        wageBadge={wageBadge}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Sticky Map Column */}
            <div className="hidden lg:block">
              <div className="sticky top-20 h-[calc(100vh-110px)] min-h-[500px]">
                <JobMap
                  jobs={visibleJobs}
                  selectedJobId={selectedJobId}
                  hoveredJobId={hoveredJobId}
                  onSelectJob={handleSelectJobFromMap}
                  className="h-full w-full rounded-[20px] border border-black/[0.06] shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function formatEmploymentBadge(form: string, isDe: boolean): string {
  if (!form) return '';
  const lower = form.toLowerCase();
  if (lower.includes('1-day') || lower.includes('tagesjob') || lower.includes('tages-schicht') || lower.includes('day shift')) {
    return isDe ? 'Tagesschicht' : '1-Day Shift';
  }
  if (lower.includes('kurzfrist') || lower.includes('short-term') || lower.includes('aushilfe')) {
    return isDe ? 'Kurzfristig' : 'Short-Term';
  }
  if (lower.includes('werkstudent') || lower.includes('working student')) {
    return isDe ? 'Werkstudent' : 'Student';
  }
  if (lower.includes('teilzeit') || lower.includes('part-time')) {
    return isDe ? 'Teilzeit' : 'Part-Time';
  }
  if (lower.includes('minijob')) {
    return 'Minijob';
  }
  if (lower.includes('vollzeit') || lower.includes('full-time')) {
    return isDe ? 'Vollzeit' : 'Full-Time';
  }
  const clean = form.split('/')[0].trim();
  return clean.length > 16 ? clean.slice(0, 16) + '…' : clean;
}

function formatPayBadge(rawPay: string | undefined, isDe: boolean): { badge: string; note?: string } {
  if (!rawPay || typeof rawPay !== 'string') {
    return { badge: isDe ? 'Vergütung n. V.' : 'Pay TBD' };
  }

  const lower = rawPay.toLowerCase();
  if (lower.includes('discussed') || lower.includes('vereinbarung')) {
    return { badge: isDe ? 'n. V.' : 'TBD' };
  }

  const noteMatch = rawPay.match(/\(([^)]+)\)/);
  const note = noteMatch ? noteMatch[1].trim() : undefined;
  
  let clean = rawPay.replace(/\([^)]+\)/g, '').trim();

  if (lower.includes('hour') || lower.includes('std')) {
    const numMatch = clean.match(/€?\s*(\d+(?:[.,]\d+)?)/);
    if (numMatch) {
      clean = isDe ? `${numMatch[1]} € / Std.` : `€${numMatch[1]} / hr`;
    }
  } else if (lower.includes('month') || lower.includes('monat')) {
    const numMatch = clean.match(/€?\s*(\d+(?:[.,]\d+)?)/);
    if (numMatch) {
      clean = isDe ? `${numMatch[1]} € / Mo.` : `€${numMatch[1]} / mo.`;
    }
  } else if (lower.includes('shift') || lower.includes('schicht')) {
    const numMatch = clean.match(/€?\s*(\d+(?:[.,]\d+)?)/);
    if (numMatch) {
      clean = isDe ? `${numMatch[1]} € / Schicht` : `€${numMatch[1]} / shift`;
    }
  }

  return { badge: clean, note };
}

function JobCard({
  job,
  isSelected = false,
  isHovered = false,
  wageBadge,
}: {
  job: any;
  isSelected?: boolean;
  isHovered?: boolean;
  wageBadge?: string;
}) {
  const { t, isDe } = useTranslation();
  const employerPosted = job.listingOrigin === 'employer_posted';

  const rawPay = job.payText || job.compensation?.label || wageBadge;
  const { badge: payBadge, note: payNote } = formatPayBadge(rawPay, isDe);

  const hoursLabel = job.hoursLabel || job.hours?.label || t('flexibleHours');
  const scheduleSummary = job.scheduleSummary || job.schedule?.summary || t('flexibleShifts');
  const districtText = job.district ? `${job.district}${job.postcode ? `, ${job.postcode}` : ''}` : 'Berlin';
  const isFeatured = job.tier === 'premium' || job.isFeatured;

  return (
    <Link
      href={`/jobs/${job.slug || job.id}`}
      className={`group block overflow-hidden rounded-[20px] border bg-white p-4 sm:p-5 cursor-pointer transition-all duration-200 active:scale-[0.99] w-full max-w-full ${
        isSelected
          ? 'border-transparent ring-2 ring-[#0071e3] shadow-md'
          : isHovered
          ? 'border-black/[0.14] shadow-[0_4px_16px_rgba(0,0,0,0.04)]'
          : 'border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-black/[0.12] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-[1px]'
      }`}
    >
      {/* Top Row: Category Tags on Left, Pay Badge on Right */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          {isFeatured && (
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10.5px] sm:text-[11px] font-semibold text-amber-900 shrink-0">
              Featured
            </span>
          )}
          {job.employmentForms &&
            job.employmentForms.slice(0, 2).map((form: string) => {
              const badgeText = formatEmploymentBadge(form, isDe);
              if (!badgeText) return null;
              return (
                <span
                  key={form}
                  className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[10.5px] sm:text-[11px] font-medium text-[#86868b] shrink-0"
                >
                  {badgeText}
                </span>
              );
            })}
        </div>

        {/* Wage / Compensation Badge (Crisp font-mono pill) */}
        <div className="shrink-0">
          <span className="inline-block rounded-full bg-black/[0.04] px-2.5 py-0.5 text-[11.5px] sm:text-[12.5px] font-semibold text-[#1d1d1f] font-mono tracking-tight whitespace-nowrap">
            {payBadge}
          </span>
        </div>
      </div>

      {/* Main Row: Full-width Title (Never squished) */}
      <h3 className="mt-2.5 text-[15.5px] sm:text-[17px] font-semibold text-[#1d1d1f] tracking-tight leading-snug group-hover:text-[#0071e3] transition-colors break-words">
        {job.title?.replace(/\uFFFD/g, 'é')}
      </h3>

      {/* Company & District: Truncated cleanly to eliminate stray hanging dots */}
      <div className="mt-1 flex items-center gap-1.5 text-[12.5px] sm:text-[13px] text-[#86868b] min-w-0">
        <span className="font-medium text-[#1d1d1f] truncate">
          {job.company?.replace(/\uFFFD/g, 'é')}
        </span>
        <span className="text-black/20 shrink-0">·</span>
        <span className="inline-flex items-center gap-1 text-[#86868b] shrink-0">
          <MapPin className="size-3 text-[#86868b]" />
          <span>{districtText}</span>
        </span>
      </div>

      {/* Metadata footer */}
      <div className="mt-3.5 flex items-center justify-between border-t border-black/[0.04] pt-2.5 text-[11.5px] sm:text-[12px] text-[#86868b]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1 shrink-0">
            <Clock3 className="size-3 text-[#86868b]" />
            <span className="truncate">{hoursLabel}</span>
          </div>
          {payNote ? (
            <span className="hidden xs:inline text-[11px] text-[#86868b] italic truncate">
              {payNote}
            </span>
          ) : (
            <div className="hidden sm:flex items-center gap-1 truncate">
              <CalendarDays className="size-3 text-[#86868b]" />
              <span className="truncate">{scheduleSummary}</span>
            </div>
          )}
        </div>
        <div className="inline-flex items-center gap-1 text-[12px] sm:text-[13px] font-medium text-[#0071e3] group-hover:translate-x-0.5 transition-transform shrink-0">
          <span>Details</span>
          <ArrowRight className="size-3.5" />
        </div>
      </div>
    </Link>
  );
}

export function LatestJobs({ jobs }: { jobs: any[] }) {
  const { t } = useTranslation();
  if (!jobs || jobs.length === 0) return null;

  return (
    <section className="border-t border-black/[0.06] bg-[#f5f5f7]/50 py-12 md:py-16">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
              {t('latestJobs')} in Berlin
            </h2>
          </div>
          <Link
            href="/latest-jobs"
            className="apple-btn-secondary !h-8 !px-3.5 !text-xs"
          >
            <span>{t('viewAllLatest')}</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.slice(0, 6).map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.slug || job.id}`}
              className="group flex flex-col justify-between rounded-[20px] border border-black/[0.06] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-200 hover:border-black/[0.12] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-[1px] active:scale-[0.99]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-[#1d1d1f]">
                    {formatPinBadge(job)}
                  </span>
                  <span className="text-[12px] text-[#86868b] truncate">
                    {job.district || 'Berlin'}
                  </span>
                </div>
                <h3 className="mt-2.5 text-[15px] font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors line-clamp-2">
                  {job.title?.replace(/\uFFFD/g, 'é')}
                </h3>
                <p className="mt-1 text-[13px] text-[#86868b] line-clamp-1">
                  {job.company?.replace(/\uFFFD/g, 'é')}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-black/[0.04] pt-3 text-xs font-medium text-[#1d1d1f]">
                <span className="text-[#86868b]">{t('browseCategory')}</span>
                <ArrowRight className="size-3.5 text-[#0071e3] transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
