'use client';

import Link from 'next/link';
import { useMemo, useState, useRef } from 'react';
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
  { value: 'all', labelDe: 'Ganz Berlin (Alle Bezirke)', labelEn: 'All Berlin Districts' },
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
  const [district, setDistrict] = useState('all');
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

      // District filter
      const matchesDistrict =
        district === 'all' ||
        (job.district && job.district.toLowerCase().includes(district.toLowerCase()));

      const jobEmployment = isDemo
        ? job.employmentForms
        : job.employmentFormsJson
        ? JSON.parse(job.employmentFormsJson)
        : [];
      const matchesEmployment =
        employment === 'all' ||
        jobEmployment.some((form: string) => form.toLowerCase().includes(employment));

      const jobPayInterval = isDemo
        ? job.compensation?.rateInterval
        : job.compensationRateInterval || 'not_stated';
      const matchesPay = payInterval === 'all' || jobPayInterval === payInterval;

      const haystack = [
        job.title,
        job.company,
        job.district,
        job.postcode,
        isDemo ? getIndustry(job.industryId)?.label : job.niches?.map((n: any) => n.label).join(' '),
        ...(isDemo ? job.tags || [] : []),
      ]
        .join(' ')
        .toLowerCase();

      return (
        matchesIndustry &&
        matchesDistrict &&
        matchesEmployment &&
        matchesPay &&
        (!normalizedQuery || haystack.includes(normalizedQuery))
      );
    });
  }, [district, employment, filterOrigin, industry, payInterval, query, initialJobs]);

  const handleSelectJobFromMap = (jobId: string | null) => {
    setSelectedJobId(jobId);
    if (jobId && jobCardsRef.current[jobId]) {
      jobCardsRef.current[jobId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <>
      {showHero && (
        <section className="border-b border-zinc-200/80 bg-[#fafafa]">
          <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-0.5 text-xs font-medium text-zinc-700 shadow-2xs">
                <span className="size-1.5 rounded-full bg-emerald-600" />
                {t('heroEyebrow')}
              </span>
              <span className="text-xs text-zinc-400 hidden sm:inline">· 100% Direktkontakt · Ohne Vermittler</span>
            </div>

            <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-zinc-950 sm:text-5xl leading-[1.1]">
              {effectivePageTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-zinc-600 leading-relaxed">
              {effectivePageSubtitle}
            </p>

            {/* Unified Search Console */}
            <div className="mt-8 rounded-2xl border border-zinc-200/90 bg-white p-2.5 shadow-sm md:p-3">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_220px_200px_180px]">
                <div className="relative flex items-center">
                  <Search className="pointer-events-none absolute left-3.5 size-4 text-zinc-400" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="h-11 border-0 bg-zinc-50 pl-10 text-sm placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-900 shadow-none rounded-lg"
                    placeholder={t('searchPlaceholder')}
                    aria-label="Jobtitel oder Kiez suchen"
                  />
                </div>

                {/* District Filter Dropdown */}
                <NativeSelect
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                  className="h-11 border-zinc-200 bg-zinc-50 text-sm rounded-lg"
                  aria-label="Bezirk filtern"
                >
                  {berlinDistricts.map((d) => (
                    <NativeSelectOption key={d.value} value={d.value}>
                      {isDe ? d.labelDe : d.labelEn}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>

                {/* Employment Filter */}
                <NativeSelect
                  value={employment}
                  onChange={(event) => setEmployment(event.target.value)}
                  className="h-11 border-zinc-200 bg-zinc-50 text-sm rounded-lg"
                  aria-label="Beschäftigungsart"
                >
                  <NativeSelectOption value="all">{t('allJobTypes')}</NativeSelectOption>
                  <NativeSelectOption value="minijob">{t('minijob')} (538 €)</NativeSelectOption>
                  <NativeSelectOption value="part-time">{t('partTime')}</NativeSelectOption>
                  <NativeSelectOption value="working student">{t('workingStudent')}</NativeSelectOption>
                  <NativeSelectOption value="short-term">{t('tempShortTerm')}</NativeSelectOption>
                  <NativeSelectOption value="1-day">{t('oneDayShift')}</NativeSelectOption>
                </NativeSelect>

                {/* Pay Interval */}
                <NativeSelect
                  value={payInterval}
                  onChange={(event) => setPayInterval(event.target.value)}
                  className="h-11 border-zinc-200 bg-zinc-50 text-sm rounded-lg"
                  aria-label="Vergütungsintervall"
                >
                  <NativeSelectOption value="all">{t('anyPayType')}</NativeSelectOption>
                  <NativeSelectOption value="hour">{t('payPerHour')}</NativeSelectOption>
                  <NativeSelectOption value="shift">{t('payPerShift')}</NativeSelectOption>
                  <NativeSelectOption value="month">{t('payPerMonth')}</NativeSelectOption>
                </NativeSelect>
              </div>
            </div>

            {/* Quick Filter Pills & View Switcher */}
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
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
                      className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-medium transition cursor-pointer ${
                        selected
                          ? 'bg-zinc-950 text-white'
                          : 'border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-950'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-1 self-end rounded-lg border border-zinc-200 bg-white p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                    viewMode === 'split'
                      ? 'bg-zinc-950 text-white'
                      : 'text-zinc-500 hover:text-zinc-950'
                  }`}
                  title="Liste & Karte geteilt"
                >
                  <Layers className="size-3.5" />
                  <span className="hidden sm:inline">{t('splitView')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-zinc-950 text-white'
                      : 'text-zinc-500 hover:text-zinc-950'
                  }`}
                  title="Nur Liste"
                >
                  <List className="size-3.5" />
                  <span>{t('listView')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                    viewMode === 'map'
                      ? 'bg-zinc-950 text-white'
                      : 'text-zinc-500 hover:text-zinc-950'
                  }`}
                  title="Nur Karte"
                >
                  <MapIcon className="size-3.5" />
                  <span>{t('mapView')}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Listings Section */}
      <section id="jobs" className="bg-[#fafafa]">
        <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-950">{effectiveSectionTitle}</h2>
              <p className="mt-1 text-xs text-zinc-500">
                {visibleJobs.length} {t('jobsFound')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {viewAllHref && (
                <Link
                  href={viewAllHref}
                  className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 shadow-2xs transition hover:border-zinc-400 hover:text-zinc-950"
                >
                  <span>{effectiveViewAllLabel}</span>
                  <ArrowRight className="size-3" />
                </Link>
              )}
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-zinc-100 border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700">
                <span className="size-1.5 rounded-full bg-emerald-600" />
                {t('openStreetMapActive')}
              </span>
            </div>
          </div>

          {/* Render based on view mode */}
          {viewMode === 'map' ? (
            /* Full Map View */
            <div className="h-[750px] w-full rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
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
                  <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
                    <p className="font-semibold text-base text-zinc-900">Keine Jobs für diese Filter gefunden</p>
                    <p className="mt-1 text-xs text-zinc-500">Passe deine Suchbegriffe oder Bezirksauswahl an.</p>
                  </div>
                ) : (
                  visibleJobs.map((job) => {
                    const isSelected = selectedJobId === job.id || selectedJobId === job.slug;
                    const isHovered = hoveredJobId === job.id || hoveredJobId === job.slug;
                    const wageBadge = formatPinBadge(job);

                    return (
                      <div
                        key={job.id}
                        ref={(el) => {
                          jobCardsRef.current[job.id] = el;
                        }}
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
                    className="h-full w-full rounded-2xl border border-zinc-200 shadow-sm"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* List Only View */
            <div className="mx-auto max-w-[1080px] space-y-3">
              {visibleJobs.length === 0 ? (
                <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
                  <p className="font-semibold text-base text-zinc-900">Keine Jobs für diese Filter gefunden</p>
                  <p className="mt-1 text-xs text-zinc-500">Passe deine Suchbegriffe oder Bezirksauswahl an.</p>
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

  let payLabel = job.payText || job.compensation?.label || 'Nach Vereinbarung';
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
      className={`group block overflow-hidden rounded-xl border bg-white p-5 transition cursor-pointer ${
        isSelected
          ? 'border-zinc-950 ring-1 ring-zinc-950 bg-zinc-50/40 shadow-xs'
          : isHovered
          ? 'border-zinc-400 shadow-xs'
          : 'border-zinc-200 hover:border-zinc-400 hover:shadow-xs'
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          {/* Badge line */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${
                employerPosted
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
              }`}
            >
              {employerPosted ? t('postedByEmployer') : t('verifiedSource')}
            </span>

            {job.employmentForms &&
              job.employmentForms.slice(0, 2).map((form: string) => (
                <span
                  key={form}
                  className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 border border-zinc-200/60"
                >
                  {form}
                </span>
              ))}
          </div>

          {/* Job Title */}
          <h3 className="text-base font-bold text-zinc-900 group-hover:text-black tracking-tight leading-snug">
            {job.title}
          </h3>

          {/* Company & District */}
          <p className="mt-1 text-xs text-zinc-600">
            <span className="font-semibold text-zinc-800">{job.company}</span>
            <span className="mx-1.5 text-zinc-300">·</span>
            <span className="inline-flex items-center gap-1 text-zinc-600">
              <MapPin className="size-3 text-zinc-400" />
              {districtText}
            </span>
          </p>
        </div>

        {/* Wage / Compensation Badge */}
        <div className="flex shrink-0 items-baseline sm:flex-col sm:items-end sm:justify-start">
          <span className="text-sm font-bold text-zinc-950 font-mono tracking-tight sm:text-base">
            {payLabel}
          </span>
        </div>
      </div>

      {/* Metadata footer */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-zinc-100 pt-3 text-[11px] text-zinc-500">
        <div className="flex items-center gap-1">
          <Clock3 className="size-3 text-zinc-400" />
          <span>{hoursLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarDays className="size-3 text-zinc-400" />
          <span>{scheduleSummary}</span>
        </div>
        <div className="ml-auto inline-flex items-center gap-1 font-semibold text-zinc-900 group-hover:underline">
          <span>Details</span>
          <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

export function LatestJobs({ jobs }: { jobs: any[] }) {
  const { t } = useTranslation();
  if (!jobs || jobs.length === 0) return null;

  return (
    <section className="border-t border-zinc-200/80 bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('heroEyebrow')}</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950 md:text-3xl">
              {t('latestJobs')}
            </h2>
          </div>
          <Link
            href="/latest-jobs"
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-800 shadow-2xs transition hover:border-zinc-400 hover:text-zinc-950"
          >
            <span>{t('viewAllLatest')}</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.slice(0, 6).map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.slug || job.id}`}
              className="group flex flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 p-4.5 transition hover:border-zinc-950 hover:bg-white hover:shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-zinc-900">
                    {formatPinBadge(job)}
                  </span>
                  <span className="text-[11px] text-zinc-500 truncate">
                    {job.district || 'Berlin'}
                  </span>
                </div>
                <h3 className="mt-2.5 font-bold text-sm text-zinc-900 group-hover:text-black line-clamp-2">
                  {job.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 line-clamp-1">
                  {job.company}
                </p>
              </div>

              <div className="mt-3.5 flex items-center justify-between border-t border-zinc-200/60 pt-2.5 text-xs font-semibold text-zinc-900">
                <span>{t('browseCategory')}</span>
                <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
