'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from '@/components/ui/link';
import { Search, MapPin, Euro, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMyListings } from '@/lib/storage/my-listings';
import { useTranslation } from '@/lib/i18n/language-context';
import {
  SUPPORTED_CITIES,
  getDistrictsForCity,
  getCityById,
} from '@/lib/domain/cities';
import { CompetitorComparison } from '@/components/competitor-comparison';

const CITY_OPTIONS = [
  { id: 'all', labelDe: 'Ganz Deutschland', labelEn: 'All Germany' },
  ...SUPPORTED_CITIES.map((c) => ({
    id: c.id,
    labelDe: c.name,
    labelEn: c.name,
  })),
];

const CATEGORIES = [
  { id: 'all', labelDe: 'Alle Bereiche', labelEn: 'All Categories', keywords: [] },
  { id: 'cafe', labelDe: 'Café & Barista', labelEn: 'Café & Barista', keywords: ['cafe', 'café', 'barista', 'kaffee', 'coffee', 'espresso', 'rösterei', 'matcha', 'brot', 'bäcker'] },
  { id: 'gastro', labelDe: 'Gastro & Bar', labelEn: 'Gastro & Bar', keywords: ['gastro', 'kellner', 'küche', 'service', 'koch', 'bar', 'restaurant', 'wein', 'bistro', 'ramen', 'barkeeper', 'pizza'] },
  { id: 'retail', labelDe: 'Kiez-Laden & Boutique', labelEn: 'Local Retail & Boutique', keywords: ['verkauf', 'kasse', 'retail', 'store', 'laden', 'boutique', 'vintage', 'buch', 'unverpackt', 'vinyl', 'späti'] },
  { id: 'craft', labelDe: 'Handwerk & Atelier', labelEn: 'Craft & Workshop', keywords: ['handwerk', 'werkstatt', 'fahrrad', 'mechanik', 'atelier', 'keramik', 'florist', 'blumen', 'schreiner', 'druck'] },
  { id: 'aushilfe', labelDe: 'Aushilfe & Events', labelEn: 'Temp & Events', keywords: ['aushilfe', 'event', 'aufbau', 'kino', 'galerie', 'festival', 'einlass', 'kultur', 'promo'] },
  { id: 'privat', labelDe: 'Privat & Betreuung', labelEn: 'Private & Care', keywords: ['privat', 'babysitter', 'kinder', 'nachhilfe', 'umzug', 'gassi', 'hunde', 'betreuung', 'senioren', 'garten'] },
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
    // Direct employer listings always pin to top
    const aDirect = a.isUserListing ? 1 : 0;
    const bDirect = b.isUserListing ? 1 : 0;
    if (aDirect !== bDirect) return bDirect - aDirect;

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
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'urgent' | 'wage'>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Dynamic districts based on selected city
  const currentDistricts = useMemo(() => {
    if (selectedCity === 'all') {
      return [
        { id: 'all', labelDe: 'Alle Bezirke & Viertel', labelEn: 'All Districts' },
        { id: 'mitte', labelDe: 'Mitte', labelEn: 'Mitte' },
        { id: 'kreuzberg', labelDe: 'Kreuzberg', labelEn: 'Kreuzberg' },
        { id: 'sternschanze', labelDe: 'Sternschanze', labelEn: 'Sternschanze' },
        { id: 'schwabing', labelDe: 'Schwabing', labelEn: 'Schwabing' },
        { id: 'ehrenfeld', labelDe: 'Ehrenfeld', labelEn: 'Ehrenfeld' },
        { id: 'bornheim', labelDe: 'Bornheim', labelEn: 'Bornheim' },
        { id: 'plagwitz', labelDe: 'Plagwitz', labelEn: 'Plagwitz' },
      ];
    }
    const distList = getDistrictsForCity(selectedCity);
    const labelAll =
      selectedCity === 'koeln'
        ? { labelDe: 'Alle Veedel', labelEn: 'All Veedel' }
        : selectedCity === 'berlin'
        ? { labelDe: 'Alle Bezirke', labelEn: 'All Districts' }
        : { labelDe: 'Alle Stadtteile', labelEn: 'All Districts' };

    return [
      { id: 'all', ...labelAll },
      ...distList.map((d) => ({ id: d.toLowerCase(), labelDe: d, labelEn: d })),
    ];
  }, [selectedCity]);

  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
    setSelectedDistrict('all');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (cityId === 'all') {
        url.searchParams.delete('city');
      } else {
        url.searchParams.set('city', cityId);
      }
      url.searchParams.delete('district');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleDistrictChange = (distId: string) => {
    setSelectedDistrict(distId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (distId === 'all') {
        url.searchParams.delete('district');
      } else {
        url.searchParams.set('district', distId);
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Hydrate direct employer jobs from localStorage and verified partners
  useEffect(() => {
    const syncDirect = () => {
      const stored = getMyListings();
      const userJobs = stored
        .filter((l) => l.type === 'job' && l.status !== 'expired')
        .map((l) => {
          const parts = l.subtitle.split('·').map((p) => p.trim());
          const locParts = (parts[1] || '').split(',').map((p) => p.trim());
          const district = locParts[0] || 'Zentrum';
          const city = locParts[1] || (l as any).city || 'Berlin';
          return {
            id: l.id,
            slug: l.linkUrl.replace('/jobs/', '') || l.id,
            title: l.title,
            company: parts[0] || (isDe ? 'Unabhängiger Betrieb' : 'Independent Employer'),
            city: city,
            district: district,
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

  // Background hydration: Load the full verified catalog across Germany
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
      const c = params.get('city');
      if (c) {
        setSelectedCity(c.toLowerCase());
      }
      const dist = params.get('district');
      if (dist) {
        setSelectedDistrict(dist.toLowerCase());
      }
      const q = params.get('q');
      if (q) setQuery(q);
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  // Reset pagination when search, city, district, category, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCity, selectedDistrict, selectedCategory, sortBy]);

  // Fast client-side filtering for full catalog including direct employer listings
  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    const directSlugs = new Set(directJobs.map((d) => d.slug || d.id));
    const combined = [...directJobs, ...jobs.filter((j) => !directSlugs.has(j.slug || j.id))];

    const res = combined.filter((job) => {
      const jobCity = (
        job.city ||
        (job.district && job.district.toLowerCase().includes('berlin') ? 'Berlin' : 'Berlin')
      ).toLowerCase();

      // Filter by city
      if (selectedCity !== 'all') {
        const targetCity = selectedCity.toLowerCase();
        const cityMatches =
          jobCity.includes(targetCity) ||
          (targetCity === 'muenchen' &&
            (jobCity.includes('münchen') || jobCity.includes('muenchen'))) ||
          (targetCity === 'koeln' && (jobCity.includes('köln') || jobCity.includes('koeln'))) ||
          (targetCity === 'duesseldorf' &&
            (jobCity.includes('düsseldorf') || jobCity.includes('duesseldorf')));

        const cityDistricts = getDistrictsForCity(selectedCity).map((d) => d.toLowerCase());
        const jobDist = (job.district || '').toLowerCase();
        const districtInCity = cityDistricts.some((d) => jobDist.includes(d));

        if (!cityMatches && !districtInCity) return false;
      }

      // Filter by district
      if (selectedDistrict !== 'all') {
        const dist = (job.district || '').toLowerCase();
        if (!dist.includes(selectedDistrict.toLowerCase())) return false;
      }

      // Filter by category
      if (!matchesCategory(job, selectedCategory)) return false;

      // Filter by query
      if (q) {
        const title = (job.title || '').toLowerCase();
        const company = (job.company || '').toLowerCase();
        const district = (job.district || '').toLowerCase();
        const city = jobCity;
        const industry = (job.industryId || '').toLowerCase();
        return (
          title.includes(q) ||
          company.includes(q) ||
          district.includes(q) ||
          city.includes(q) ||
          industry.includes(q)
        );
      }
      return true;
    });
    return sortJobsList(res, sortBy, isDe);
  }, [jobs, directJobs, query, selectedCity, selectedDistrict, selectedCategory, sortBy, isDe]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));
  const displayedJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(start, start + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  return (
    <section className="w-full">
      {/* Search & Filter Toolbar: Clean, Borderless, Airbnb-style */}
      <div className="mb-6 space-y-3">
        {/* Sleek Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 stroke-[2] text-zinc-400 group-focus-within:text-black transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isDe
                ? 'Jobtitel, Betrieb, Stadt oder Stichwort suchen...'
                : 'Search job title, employer, city or keyword...'
            }
            className="w-full h-13 pl-12 pr-12 rounded-2xl bg-zinc-100 hover:bg-zinc-200/60 focus:bg-white text-base text-black font-medium placeholder:text-zinc-500 focus:ring-2 focus:ring-black outline-none transition-all shadow-xs"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="apple-press absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-600 hover:text-black px-2.5 py-1 rounded-full bg-zinc-200 cursor-pointer"
            >
              {isDe ? 'Löschen' : 'Clear'}
            </button>
          )}
        </div>

        {/* Compact Dropdown Toolbar: City & District side-by-side */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-sm">
          {/* City Dropdown */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-1.5">
              {isDe ? 'Stadt' : 'City'}
            </label>
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200/60 focus:bg-white text-sm sm:text-base font-medium text-black focus:ring-2 focus:ring-black outline-none cursor-pointer transition-colors"
            >
              {CITY_OPTIONS.map((city) => (
                <option key={city.id} value={city.id}>
                  {isDe ? city.labelDe : city.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* District Dropdown (Right next to City) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-1.5">
              {selectedCity === 'koeln'
                ? (isDe ? 'Veedel' : 'District')
                : (isDe ? 'Bezirk / Viertel' : 'District')}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200/60 focus:bg-white text-sm sm:text-base font-medium text-black focus:ring-2 focus:ring-black outline-none cursor-pointer transition-colors"
            >
              {currentDistricts.map((d) => (
                <option key={d.id} value={d.id}>
                  {isDe ? d.labelDe : d.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-1.5">
              {isDe ? 'Bereich' : 'Category'}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200/60 focus:bg-white text-sm sm:text-base font-medium text-black focus:ring-2 focus:ring-black outline-none cursor-pointer transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {isDe ? cat.labelDe : cat.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-1.5">
              {isDe ? 'Sortierung' : 'Sort'}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-11 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200/60 focus:bg-white text-sm sm:text-base font-medium text-black focus:ring-2 focus:ring-black outline-none cursor-pointer transition-colors"
            >
              <option value="newest">{isDe ? 'Neueste zuerst' : 'Newest first'}</option>
              <option value="urgent">{isDe ? 'Dringend' : 'Urgent'}</option>
              <option value="wage">{isDe ? 'Höchster Lohn' : 'Highest pay'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Counter & Status Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4 text-sm sm:text-base text-zinc-600">
        <span>
          <strong className="text-black font-bold">
            {filteredJobs.length.toLocaleString(isDe ? 'de-DE' : 'en-US')}
          </strong>{' '}
          <span className="font-normal">
            {selectedCity === 'all'
              ? (isDe ? 'Inserate in ganz Deutschland' : 'listings across Germany')
              : (isDe
                  ? `Inserate in ${getCityById(selectedCity)?.name || selectedCity}`
                  : `listings in ${getCityById(selectedCity)?.name || selectedCity}`)}
          </span>
        </span>
        {(query || selectedCity !== 'all' || selectedDistrict !== 'all' || selectedCategory !== 'all') && (
          <button
            onClick={() => {
              setQuery('');
              setSelectedCity('all');
              setSelectedDistrict('all');
              setSelectedCategory('all');
              setSortBy('newest');
              if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                url.searchParams.delete('city');
                url.searchParams.delete('district');
                window.history.replaceState({}, '', url.toString());
              }
            }}
            className="text-sm font-semibold text-black underline hover:text-zinc-600 cursor-pointer"
          >
            {isDe ? 'Filter zurücksetzen' : 'Reset filters'}
          </button>
        )}
      </div>

      {/* Spacious, Elevated Job Listing Cards */}
      <div className="space-y-3 sm:space-y-3.5">
        {displayedJobs.map((job, idx) => {
          const wage = formatWage(job, isDe);
          const jobType = formatJobType(job, isDe);
          const slug = job.slug || job.id;
          const urgent = isUrgentJob(job);
          const relTime = getRelativeTime(job, idx + (currentPage - 1) * JOBS_PER_PAGE, isDe);

          const cityName = job.city || 'Berlin';
          const districtName = job.district || '';
          const locationDisplay = districtName
            ? !districtName.toLowerCase().includes(cityName.toLowerCase())
              ? `${districtName}, ${cityName}`
              : districtName
            : cityName;

          return (
            <Link
              key={slug || idx}
              href={`/jobs/${slug}`}
              className="apple-press group block p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-zinc-200/80 bg-white hover:border-zinc-300 hover:shadow-md transition-all duration-200 cursor-pointer relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  {/* Badges Row */}
                  {(job.isUserListing || urgent || job.whatsapp) && (
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {job.isUserListing && (
                        <span className="shrink-0 text-[11px] uppercase bg-zinc-800 text-white px-2.5 py-0.5 rounded-full font-bold leading-none shadow-2xs">
                          {isDe ? 'DEIN INSERAT' : 'YOUR LISTING'}
                        </span>
                      )}
                      {urgent && (
                        <span className="shrink-0 text-[11px] uppercase bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-0.5 rounded-full font-bold leading-none">
                          {isDe ? '⚡ DRINGEND' : '⚡ URGENT'}
                        </span>
                      )}
                      {job.whatsapp && (
                        <span className="shrink-0 text-[11px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          💬 WhatsApp
                        </span>
                      )}
                    </div>
                  )}

                  {/* Title */}
                  <h3
                    className="text-lg sm:text-xl font-bold text-zinc-950 group-hover:text-black transition-colors tracking-tight line-clamp-1 leading-snug"
                    style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    {job.title}
                  </h3>

                  {/* Company & Details Chips */}
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-zinc-600 font-normal pt-0.5">
                    <span className="font-bold text-zinc-900">{job.company}</span>
                    <span className="text-zinc-300">&middot;</span>
                    <span className="inline-flex items-center gap-1.5 bg-zinc-100/80 text-zinc-700 px-2.5 py-1 rounded-lg">
                      <MapPin className="size-3.5 text-zinc-500 shrink-0" />
                      <span>{locationDisplay}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-zinc-100/80 text-zinc-700 px-2.5 py-1 rounded-lg">
                      <Clock className="size-3.5 text-zinc-500 shrink-0" />
                      <span>{jobType}</span>
                    </span>
                  </div>
                </div>

                {/* Right Side: High-Contrast Wage Pill + Hover Arrow */}
                <div className="shrink-0 flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-2 sm:pt-0 border-t border-zinc-100 sm:border-t-0">
                  <div className="sm:text-right">
                    <div className="inline-flex items-baseline px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-zinc-950 text-white shadow-2xs font-mono text-sm sm:text-base font-extrabold tracking-tight">
                      {wage}
                    </div>
                    <div className="text-[11px] sm:text-xs font-mono text-zinc-500 font-medium mt-1">
                      {relTime}
                    </div>
                  </div>
                  <div className="size-9 sm:size-10 rounded-full bg-zinc-100 items-center justify-center text-zinc-400 group-hover:bg-black group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200 shadow-2xs shrink-0 flex">
                    <ArrowRight className="size-4 sm:size-4.5 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

        {displayedJobs.length === 0 && (
          <div className="py-12 sm:py-16 text-center">
            {jobs.length === 0 && directJobs.length === 0 ? (
              <div className="max-w-md mx-auto space-y-3">
                <h3
                  className="text-lg sm:text-xl font-bold text-black"
                  style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {isDe ? 'Noch keine Stellenanzeigen online' : 'No job listings online yet'}
                </h3>
                <p className="text-base text-zinc-600 font-normal leading-relaxed">
                  {isDe
                    ? 'Sei der erste Betrieb in deiner Stadt! Schalte dein Inserat mit direktem WhatsApp-Kontakt online.'
                    : 'Be the first employer in your city! Publish your listing with direct WhatsApp contact.'}
                </p>
                <div className="pt-3">
                  <Link
                    href="/post-a-job"
                    className="apple-press inline-flex items-center justify-center gap-2 rounded-2xl bg-black hover:bg-zinc-800 text-white px-6 py-3.5 text-base font-semibold tracking-[0.02em] transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    <span>{isDe ? 'Jetzt 1. Job kostenlos inserieren' : 'Post 1st job for free'}</span>
                    <ArrowRight className="size-4 stroke-[2]" />
                  </Link>
                  <p className="mt-2.5 text-sm text-zinc-500 font-medium">
                    {isDe ? '100% kostenfrei · In 60 Sekunden live' : '100% free · Live in 60 seconds'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto space-y-3">
                <p className="text-lg font-bold text-black">
                  {isDe ? 'Keine passenden Stellen gefunden' : 'No matching jobs found'}
                </p>
                <p className="text-base text-zinc-600 font-normal">
                  {isDe
                    ? 'Versuche andere Suchbegriffe oder wähle eine andere Stadt.'
                    : 'Try different search terms or select another city.'}
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => {
                      setQuery('');
                      setSelectedCity('all');
                      setSelectedDistrict('all');
                      setSelectedCategory('all');
                      setSortBy('newest');
                      if (typeof window !== 'undefined') {
                        const url = new URL(window.location.href);
                        url.searchParams.delete('city');
                        url.searchParams.delete('district');
                        window.history.replaceState({}, '', url.toString());
                      }
                    }}
                    className="apple-press inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-base font-semibold text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    {isDe ? 'Filter zurücksetzen' : 'Reset filters'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      {/* Editorial Pagination Controls */}
      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-5 text-base">
          <button
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="apple-press inline-flex items-center gap-2 rounded-2xl bg-zinc-100 hover:bg-zinc-200 px-5 py-3 text-black font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="size-4 stroke-[2]" /> {isDe ? 'Vorherige' : 'Previous'}
          </button>

          <div className="flex items-center gap-2 font-mono text-sm sm:text-base text-black font-bold">
            <span>{String(currentPage).padStart(2, '0')}</span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-600">{String(totalPages).padStart(2, '0')}</span>
          </div>

          <button
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="apple-press inline-flex items-center gap-2 rounded-2xl bg-zinc-100 hover:bg-zinc-200 px-5 py-3 text-black font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isDe ? 'Nächste' : 'Next'} <ChevronRight className="size-4 stroke-[2]" />
          </button>
        </nav>
      )}

      {/* Strategic Competitor Comparison: JOBROOFS vs. Andere Plattformen */}
      <div className="mt-16 pt-10 border-t border-zinc-200">
        <CompetitorComparison />
      </div>
    </section>
  );
}
