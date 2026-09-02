'use client';

import Link from 'next/link';
import { useMemo, useState, useRef } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Euro,
  Layers,
  LayoutGrid,
  List,
  Mail,
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

const JobMap = dynamic(() => import('@/components/job-map').then((mod) => mod.JobMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-foreground/15 bg-[#eceae2] text-xs font-semibold text-muted-foreground">
      Loading Berlin map...
    </div>
  ),
});

const featuredNiches = [
  'all',
  'temp-shifts',
  'gastronomy',
  'events',
  'home-help',
  'hotels',
  'retail',
  'warehousing',
  'cleaning',
  'logistics',
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
  filterOrigin = 'employer_posted',
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
  const [employment, setEmployment] = useState('all');
  const [payInterval, setPayInterval] = useState('all');
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null);
  const jobCardsRef = useRef<Record<string, HTMLDivElement | null>>({});

  const effectivePageTitle = pageTitle || t('heroTitle');
  const effectivePageSubtitle = pageSubtitle || t('heroSubtitle');
  const effectiveSectionTitle = sectionTitle || t('directListings');
  const effectiveViewAllLabel = viewAllLabel || t('viewAllDirect');

  const visibleJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return initialJobs!.filter((job) => {
      // Filter origin check if specified
      if (filterOrigin !== 'all' && job.listingOrigin !== filterOrigin) return false;

      const isDemo = job.isDemo !== false;
      const jobNiches = isDemo ? [job.industryId] : job.niches?.map((n: any) => n.nicheId) || [];
      const matchesIndustry = industry === 'all' || jobNiches.includes(industry);
      
      const jobEmployment = isDemo ? job.employmentForms : (job.employmentFormsJson ? JSON.parse(job.employmentFormsJson) : []);
      const matchesEmployment =
        employment === 'all' ||
        jobEmployment.some((form: string) =>
          form.toLowerCase().includes(employment),
        );
        
      const jobPayInterval = isDemo ? job.compensation?.rateInterval : (job.compensationRateInterval || 'not_stated');
      const matchesPay =
        payInterval === 'all' || jobPayInterval === payInterval;
        
      const haystack = [
        job.title,
        job.company,
        job.district,
        job.postcode,
        isDemo ? getIndustry(job.industryId)?.label : job.niches?.map((n: any) => n.label).join(' '),
        ...(isDemo ? (job.tags || []) : []),
      ]
        .join(' ')
        .toLowerCase();
        
      return (
        matchesIndustry &&
        matchesEmployment &&
        matchesPay &&
        (!normalizedQuery || haystack.includes(normalizedQuery))
      );
    });
  }, [employment, filterOrigin, industry, payInterval, query, initialJobs]);

  const handleSelectJobFromMap = (jobId: string | null) => {
    setSelectedJobId(jobId);
    if (jobId && jobCardsRef.current[jobId]) {
      jobCardsRef.current[jobId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <>
      <section className="border-b border-foreground/15 bg-[#f4f0e7]">
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 md:py-14">
          <p className="text-sm font-medium text-[#385cdd]">
            {t('heroEyebrow')}
          </p>
          <h1 className="mt-2 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl">
            {effectivePageTitle}
          </h1>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground">
            {effectivePageSubtitle}
          </p>

          <div className="mt-8 grid gap-3 rounded-xl border border-foreground/15 bg-white p-3 shadow-[0_10px_30px_rgb(24_34_30/6%)] md:grid-cols-[minmax(250px,1fr)_190px_170px]">
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-11 border-0 bg-[#f4f5f2] pl-10 shadow-none"
                placeholder={t('searchPlaceholder')}
                aria-label="Search jobs"
              />
            </div>
            <NativeSelect
              value={employment}
              onChange={(event) => setEmployment(event.target.value)}
              className="w-full"
              aria-label="Employment type"
            >
              <NativeSelectOption value="all">{t('allJobTypes')}</NativeSelectOption>
              <NativeSelectOption value="1-day">{t('oneDayShift')}</NativeSelectOption>
              <NativeSelectOption value="short-term">{t('tempShortTerm')}</NativeSelectOption>
              <NativeSelectOption value="minijob">{t('minijob')}</NativeSelectOption>
              <NativeSelectOption value="part-time">{t('partTime')}</NativeSelectOption>
              <NativeSelectOption value="working student">{t('workingStudent')}</NativeSelectOption>
            </NativeSelect>
            <NativeSelect
              value={payInterval}
              onChange={(event) => setPayInterval(event.target.value)}
              className="w-full"
              aria-label="Pay interval"
            >
              <NativeSelectOption value="all">{t('anyPayType')}</NativeSelectOption>
              <NativeSelectOption value="hour">{t('payPerHour')}</NativeSelectOption>
              <NativeSelectOption value="shift">{t('payPerShift')}</NativeSelectOption>
              <NativeSelectOption value="day">{t('payPerDay')}</NativeSelectOption>
              <NativeSelectOption value="month">{t('payPerMonth')}</NativeSelectOption>
            </NativeSelect>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {featuredNiches.map((id) => {
                const selected = industry === id;
                const nicheObj = getIndustry(id);
                const label =
                  id === 'all'
                    ? t('allCategories')
                    : isDe
                    ? nicheObj?.labelDe || nicheObj?.label
                    : nicheObj?.label;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setIndustry(id)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${selected ? 'border-[#18221e] bg-[#18221e] text-white' : 'border-foreground/15 bg-white hover:border-foreground/40'}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle Controls */}
            <div className="flex items-center gap-1 self-end rounded-lg border border-foreground/15 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${viewMode === 'split' ? 'bg-[#18221e] text-white' : 'text-muted-foreground hover:text-foreground'}`}
                title="Side-by-side list and interactive map"
              >
                <Layers className="size-3.5" />
                <span className="hidden sm:inline">{t('splitView')}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${viewMode === 'list' ? 'bg-[#18221e] text-white' : 'text-muted-foreground hover:text-foreground'}`}
                title="Full-width list view"
              >
                <List className="size-3.5" />
                <span>{t('listView')}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${viewMode === 'map' ? 'bg-[#18221e] text-white' : 'text-muted-foreground hover:text-foreground'}`}
                title="Full interactive OpenStreetMap view"
              >
                <MapIcon className="size-3.5" />
                <span>{t('mapView')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="jobs" className="bg-[#fbfaf6]">
        <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{effectiveSectionTitle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {visibleJobs.length} {t('jobsFound')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {viewAllHref && (
                <Link
                  href={viewAllHref}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-foreground/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#18221e] shadow-sm transition hover:bg-[#18221e] hover:text-white"
                >
                  <span>{effectiveViewAllLabel}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              )}
              <span className="hidden sm:inline-block rounded-md bg-[#e8f6ed] px-2.5 py-1 text-xs font-semibold text-[#245e3c]">
                {t('openStreetMapActive')}
              </span>
            </div>
          </div>

          {/* Render based on view mode */}
          {viewMode === 'map' ? (
            /* Full Map View */
            <div className="h-[750px] w-full">
              <JobMap
                jobs={visibleJobs}
                selectedJobId={selectedJobId}
                hoveredJobId={hoveredJobId}
                onSelectJob={handleSelectJobFromMap}
                className="h-full w-full"
              />
            </div>
          ) : viewMode === 'split' ? (
            /* Split View (List + Sticky Map) */
            <div className="grid gap-6 lg:grid-cols-[1fr_520px] xl:grid-cols-[1fr_620px]">
              {/* Job Cards Column */}
              <div className="space-y-3">
                {visibleJobs.length === 0 ? (
                  <div className="rounded-xl border border-foreground/15 bg-white p-12 text-center">
                    <p className="font-semibold text-lg">No jobs match your filter</p>
                    <p className="mt-1 text-sm text-muted-foreground">Try clearing your search or switching categories.</p>
                  </div>
                ) : (
                  visibleJobs.map((job) => {
                    const isSelected = selectedJobId === job.id || selectedJobId === job.slug;
                    const isHovered = hoveredJobId === job.id || hoveredJobId === job.slug;
                    const wageBadge = formatPinBadge(job);

                    return (
                      <div
                        key={job.id}
                        ref={(el) => { jobCardsRef.current[job.id] = el; }}
                        onMouseEnter={() => setHoveredJobId(job.id)}
                        onMouseLeave={() => setHoveredJobId(null)}
                        onClick={() => setSelectedJobId(job.id)}
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
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* List Only View */
            <div className="mx-auto max-w-[1080px] space-y-3">
              {visibleJobs.length === 0 ? (
                <div className="rounded-xl border border-foreground/15 bg-white p-12 text-center">
                  <p className="font-semibold text-lg">No jobs match your filter</p>
                  <p className="mt-1 text-sm text-muted-foreground">Try clearing your search or switching categories.</p>
                </div>
              ) : (
                visibleJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    wageBadge={formatPinBadge(job)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
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
  const isDemo = job.isDemo !== false;

  let payLabel = job.payText || job.compensation?.label || 'Pay stated';
  if (
    payLabel.toLowerCase().includes('discussed') ||
    payLabel.toLowerCase().includes('vereinbarung')
  ) {
    payLabel = t('toBeDiscussed');
  }

  const hoursLabel = job.hoursLabel || job.hours?.label || t('flexibleHours');
  const scheduleSummary = job.scheduleSummary || job.schedule?.summary || t('flexibleShifts');
  const districtText = job.district ? `${job.district}${job.postcode ? `, ${job.postcode}` : ''}` : 'Berlin';

  return (
    <Link
      href={`/jobs/${job.slug || job.id}`}
      className={`group block overflow-hidden rounded-xl border bg-white transition hover:border-[#385cdd] hover:shadow-[0_10px_28px_rgb(24_34_30/9%)] ${
        isSelected
          ? 'border-[#385cdd] ring-2 ring-[#385cdd]/30 bg-[#f9faff]'
          : isHovered
            ? 'border-[#18221e] shadow-md'
            : employerPosted
              ? 'border-[#bfcaff] ring-1 ring-[#e1e6ff]'
              : 'border-foreground/15'
      }`}
    >
      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  employerPosted
                    ? 'bg-[#edf2ff] text-[#385cdd]'
                    : 'bg-[#f0f2ef] text-[#3e5146]'
                }`}
              >
                {employerPosted ? t('postedByEmployer') : t('verifiedSource')}
              </span>

              {job.employmentForms &&
                job.employmentForms.slice(0, 2).map((form: string) => (
                  <span
                    key={form}
                    className="rounded-full bg-foreground/5 px-2.5 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {form}
                  </span>
                ))}

              {job.niches && job.niches.length > 1 && (
                <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] text-muted-foreground">
                  {t('moreCategories', { count: job.niches.length - 1 })}
                </span>
              )}
            </div>

            <h3 className="mt-2.5 text-xl font-semibold tracking-[-0.025em] group-hover:text-[#385cdd]">
              {job.title}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {job.company} &middot; <span className="font-medium text-foreground">{districtText}</span>
            </p>
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-foreground/10 pt-3 lg:border-t-0 lg:pt-0">
            <span className="text-base font-bold text-[#18221e] lg:text-lg">
              {payLabel}
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-2 border-t border-foreground/10 pt-4 text-xs sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock3 className="size-3.5 shrink-0 text-[#385cdd]" />
            <span className="truncate">{hoursLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarDays className="size-3.5 shrink-0 text-[#245e3c]" />
            <span className="truncate">{scheduleSummary}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(getGoogleMapsUrl(job), '_blank', 'noopener,noreferrer');
            }}
            className="flex items-center gap-1.5 text-left text-muted-foreground transition hover:text-[#385cdd] sm:col-span-2 lg:col-span-1"
            title="Open real location in Google Maps"
          >
            <MapPin className="size-3.5 shrink-0 text-[#ed6a43]" />
            <span className="truncate hover:underline">{districtText} ↗</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

export function LatestJobs({ jobs }: { jobs: any[] }) {
  const { t } = useTranslation();
  if (!jobs || jobs.length === 0) return null;

  return (
    <section className="border-t border-foreground/15 bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">{t('heroEyebrow')}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] md:text-3xl">
              {t('latestJobs')}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/latest-jobs"
              className="inline-flex items-center gap-1.5 rounded-lg border border-foreground/15 bg-[#18221e] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2a3832]"
            >
              <span>{t('viewAllLatest')}</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.slice(0, 6).map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.slug || job.id}`}
              className="group flex flex-col justify-between rounded-xl border border-foreground/15 bg-[#fbfaf6] p-5 transition hover:border-[#385cdd] hover:bg-[#f4f7ff]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-[#245e3c]/10 px-2 py-0.5 text-xs font-bold text-[#245e3c]">
                    {formatPinBadge(job)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {job.district || 'Berlin'}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-base group-hover:text-[#385cdd] line-clamp-2">
                  {job.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                  {job.company}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-foreground/10 pt-3 text-xs font-medium text-[#385cdd]">
                <span>{t('browseCategory')}</span>
                <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
