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
      {/* 100% Independent German Listers Assurance */}
      <div className="flex items-center justify-between pb-3 border-b border-[#d8ded9] mb-4 text-[11px] text-[#7e8a84] font-light">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-600" />
          <span className="font-mono uppercase tracking-[0.16em] text-[#5a6460] font-medium">
            {isDe ? '100% Unabhängige Inserate in ganz Deutschland' : '100% Independent Listings across Germany'}
          </span>
        </div>
        <span className="font-mono text-[10.5px] text-[#7e8a84]">
          {isDe ? 'Kein Scraping · 1-Klick Direktkontakt' : 'No Scraping · 1-Click Direct Contact'}
        </span>
      </div>

      {/* Search & Filter Section */}
      <div className="mb-8 space-y-3">
        {/* Sleek Architectural Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 stroke-[1.25] text-[#7e8a84]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isDe
                ? 'Jobtitel, Firma, Stadt oder Stichwort suchen...'
                : 'Search job title, company, city or keyword...'
            }
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

        {/* 1. City Filter Chips (Nationwide Focus) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[12px]">
          <span className="text-[10px] uppercase tracking-[0.14em] text-[#7e8a84] font-mono mr-1 shrink-0">
            {isDe ? 'Stadt:' : 'City:'}
          </span>
          {CITY_OPTIONS.map((city) => {
            const isActive = selectedCity === city.id;
            return (
              <button
                key={city.id}
                onClick={() => handleCityChange(city.id)}
                className={`apple-press shrink-0 px-2.5 py-1 rounded-sm text-[11.5px] font-normal tracking-[0.01em] transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#202a31] text-[#fbfbf8]'
                    : 'bg-white text-[#7e8a84] border border-[#d8ded9] hover:text-[#202a31] hover:border-[#202a31]'
                }`}
              >
                {isDe ? city.labelDe : city.labelEn}
              </button>
            );
          })}
        </div>

        {/* 2. District Filter Chips (Dynamic based on selected City) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[12px]">
          <span className="text-[10px] uppercase tracking-[0.14em] text-[#7e8a84] font-mono mr-1 shrink-0">
            {selectedCity === 'koeln'
              ? (isDe ? 'Veedel:' : 'District:')
              : (isDe ? 'Bezirk / Viertel:' : 'District:')}
          </span>
          {currentDistricts.map((d) => {
            const isActive = selectedDistrict === d.id;
            return (
              <button
                key={d.id}
                onClick={() => handleDistrictChange(d.id)}
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

        {/* 3. Category Filter Chips */}
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
      </div>

      {/* Counter & Status Header with Sort Option */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d8ded9] pb-3 mb-5 gap-2 text-[12px] text-[#7e8a84]">
        <span>
          <strong className="text-[#202a31] font-medium">
            {filteredJobs.length.toLocaleString(isDe ? 'de-DE' : 'en-US')}
          </strong>{' '}
          {selectedCity === 'all'
            ? (isDe ? 'aktuelle Stellen in ganz Deutschland' : 'active jobs across Germany')
            : (isDe
                ? `aktuelle Stellen in ${getCityById(selectedCity)?.name || selectedCity}`
                : `active jobs in ${getCityById(selectedCity)?.name || selectedCity}`)}
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
                      {(job.tier === 'premium' || job.sourceKind === 'direct_employer' || job.isUserListing || job.isIndependentLister) && (
                        <span className="shrink-0 text-[11px] leading-none" title={isDe ? 'Direkt vom Betrieb' : 'Direct from employer'}>👑</span>
                      )}
                      {job.isIndependentLister && (
                        <span className="shrink-0 font-mono text-[8.5px] uppercase bg-[#1e4635] text-[#fbfbf8] px-1.5 py-0.5 rounded-xs font-medium leading-none">
                          {isDe ? '★ UNABHÄNGIG' : '★ INDEPENDENT'}
                        </span>
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
                        {locationDisplay}
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

                      {job.whatsapp && (
                        <>
                          <span className="text-[#d8ded9]">&middot;</span>
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-xs">
                            💬 WhatsApp
                          </span>
                        </>
                      )}
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
          <div className="rounded-xl border border-[#d8ded9] bg-white p-8 sm:p-12 text-center shadow-2xs">
            {jobs.length === 0 && directJobs.length === 0 ? (
              <div className="max-w-md mx-auto space-y-3">
                <div className="mx-auto size-12 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <span className="text-xl">✨</span>
                </div>
                <h3
                  className="text-lg sm:text-xl font-medium text-[#202a31]"
                  style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {isDe ? 'Noch keine Stellenanzeigen online' : 'No job listings online yet'}
                </h3>
                <p className="text-[13.5px] text-[#5a6460] font-light leading-relaxed">
                  {isDe
                    ? 'Sei der erste Betrieb in deiner Stadt! Erhalte direkte WhatsApp-Bewerbungen von über 500+ Jobsuchenden in ganz Deutschland.'
                    : 'Be the first employer in your city! Receive direct WhatsApp applications from 500+ job seekers across Germany.'}
                </p>
                <div className="pt-2">
                  <Link
                    href="/post-a-job"
                    className="apple-press inline-flex items-center justify-center gap-2 rounded-xl bg-[#202a31] hover:bg-[#161D22] text-[#fbfbf8] px-6 py-3 text-[13.5px] font-medium tracking-[0.02em] transition-all cursor-pointer shadow-xs"
                  >
                    <span>{isDe ? 'Jetzt 1. Job kostenlos inserieren' : 'Post 1st job for free'}</span>
                    <ArrowRight className="size-4 stroke-[1.5]" />
                  </Link>
                  <p className="mt-2 text-[11px] text-[#7e8a84] font-light">
                    {isDe ? '100% kostenfrei · In 60 Sekunden live' : '100% free · Live in 60 seconds'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto space-y-3">
                <p className="text-[15px] font-medium text-[#202a31]">
                  {isDe ? 'Keine passenden Stellen gefunden' : 'No matching jobs found'}
                </p>
                <p className="text-[13px] text-[#7e8a84] font-light">
                  {isDe
                    ? 'Versuche andere Suchbegriffe oder wähle eine andere Stadt.'
                    : 'Try different search terms or select another city.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
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
                    className="apple-press inline-flex items-center justify-center rounded-lg bg-[#202a31] px-4 py-2 text-[12.5px] font-medium text-[#fbfbf8] hover:bg-[#161D22] transition-colors cursor-pointer"
                  >
                    {isDe ? 'Filter zurücksetzen' : 'Reset filters'}
                  </button>
                  <Link
                    href="/post-a-job"
                    className="apple-press inline-flex items-center justify-center rounded-lg border border-[#d8ded9] bg-white px-4 py-2 text-[12.5px] font-medium text-[#202a31] hover:bg-[#f4f4ee] transition-colors cursor-pointer"
                  >
                    {isDe ? 'Job inserieren' : 'Post a job'}
                  </Link>
                </div>
              </div>
            )}
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

      {/* Strategic Competitor Comparison: JOBROOFS vs. Andere Plattformen */}
      <div className="mt-16 pt-10 border-t border-[#d8ded9]">
        <CompetitorComparison />
      </div>
    </section>
  );
}
