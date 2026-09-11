'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from '@/components/ui/link';
import { Search, MapPin, Euro, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const DISTRICTS = [
  { id: 'all', label: 'Alle Bezirke' },
  { id: 'mitte', label: 'Mitte' },
  { id: 'kreuzberg', label: 'Kreuzberg' },
  { id: 'friedrichshain', label: 'Friedrichshain' },
  { id: 'neukölln', label: 'Neukölln' },
  { id: 'prenzlauer berg', label: 'Prenzlauer Berg' },
  { id: 'charlottenburg', label: 'Charlottenburg' },
  { id: 'schöneberg', label: 'Schöneberg' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'lichtenberg', label: 'Lichtenberg' },
];

const JOBS_PER_PAGE = 20;

function formatWage(job: any): string {
  if (job.payText) return job.payText;
  if (job.compensation?.label) {
    const l = job.compensation.label;
    if (l.toLowerCase().includes('vereinbarung') || l.toLowerCase().includes('negotiable')) {
      return 'Vergütung n.V.';
    }
    return l;
  }
  return 'Vergütung n.V.';
}

function formatJobType(job: any): string {
  if (Array.isArray(job.employmentForms) && job.employmentForms.length > 0) {
    return job.employmentForms[0];
  }
  return 'Aushilfe / Minijob';
}

export function JobFeed({ initialJobs = [] }: { initialJobs: any[] }) {
  const [jobs, setJobs] = useState<any[]>(initialJobs);
  const [query, setQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

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
          (d) => d.id === dist.toLowerCase() || d.label.toLowerCase() === dist.toLowerCase()
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

  // Reset pagination when search or district changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedDistrict]);

  // Fast client-side filtering
  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (selectedDistrict !== 'all') {
        const dist = (job.district || '').toLowerCase();
        if (!dist.includes(selectedDistrict)) return false;
      }
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
  }, [jobs, query, selectedDistrict]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));
  const displayedJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(start, start + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  return (
    <section className="w-full">
      {/* Search & Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Sleek Architectural Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 stroke-[1.25] text-[#7e8a84]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jobtitel, Firma oder Stichwort suchen..."
            className="w-full h-11 pl-10 pr-4 rounded-sm border border-[#d8ded9] bg-white text-[13.5px] text-[#202a31] placeholder:text-[#7e8a84] focus:border-[#202a31] focus:ring-0 outline-none transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="apple-press absolute right-3 top-1/2 -translate-y-1/2 text-[11.5px] font-normal text-[#7e8a84] hover:text-[#202a31] px-2 py-1 cursor-pointer"
            >
              Löschen
            </button>
          )}
        </div>

        {/* District Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[12px]">
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
                className={`apple-press shrink-0 px-3 py-1.5 rounded-sm font-normal tracking-[0.01em] transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#202a31] text-[#fbfbf8]'
                    : 'bg-white text-[#7e8a84] border border-[#d8ded9] hover:text-[#202a31] hover:border-[#202a31]'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Counter & Status Header */}
      <div className="flex items-center justify-between border-b border-[#d8ded9] pb-3 mb-5 text-[12px] text-[#7e8a84]">
        <span>
          <strong className="text-[#202a31] font-medium">
            {filteredJobs.length.toLocaleString('de-DE')}
          </strong>{' '}
          aktuelle Stellen in Berlin
        </span>
        <span className="font-mono text-[11px] text-[#7e8a84]">
          {String(currentPage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
        </span>
      </div>

      {/* Job Card Feed */}
      <div className="space-y-2.5">
        {displayedJobs.map((job, idx) => {
          const wage = formatWage(job);
          const jobType = formatJobType(job);
          const slug = job.slug || job.id;
          const itemIndex = String(idx + 1 + (currentPage - 1) * JOBS_PER_PAGE).padStart(2, '0');

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
                    <h3
                      className="text-[15.5px] sm:text-[17px] font-normal text-[#202a31] group-hover:text-[#4a5751] transition-colors line-clamp-1 tracking-tight"
                      style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                    >
                      {job.title}
                    </h3>
                    <p className="mt-0.5 text-[13px] font-light text-[#7e8a84]">
                      {job.company}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px]">
                      <span className="inline-flex items-center gap-1 text-[#5a6460] font-light">
                        <MapPin className="size-3 stroke-[1.25] text-[#7e8a84]" />
                        {job.district || 'Berlin'}
                      </span>

                      <span className="text-[#d8ded9]">&middot;</span>

                      <span className="inline-flex items-center gap-1 text-[#202a31] font-mono">
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
            <p className="text-[15px] font-normal text-[#202a31]">Keine passenden Stellen gefunden</p>
            <p className="mt-1 text-[13px] text-[#7e8a84] font-light">
              Versuche andere Suchbegriffe oder wähle „Alle Bezirke“.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedDistrict('all');
              }}
              className="mt-4 inline-flex items-center justify-center rounded-sm bg-[#202a31] px-5 py-2 text-[12.5px] font-normal text-[#fbfbf8] hover:bg-[#2d3a43] transition-colors cursor-pointer"
            >
              Filter zurücksetzen
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
            <ChevronLeft className="size-3.5 stroke-[1.25]" /> Vorherige
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
            Nächste <ChevronRight className="size-3.5 stroke-[1.25]" />
          </button>
        </nav>
      )}
    </section>
  );
}
