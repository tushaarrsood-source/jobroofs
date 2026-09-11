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
        {/* Sleek Editorial Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#5c6863]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jobtitel, Firma oder Stichwort suchen..."
            className="w-full h-13 pl-11 pr-4 rounded-2xl border border-[#e5eae7] bg-white text-sm text-[#111816] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#1b4332] focus:border-transparent transition-all shadow-[0_2px_12px_rgb(0,0,0,0.02)]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#5c6863] hover:text-[#111816]"
            >
              Löschen
            </button>
          )}
        </div>

        {/* District Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
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
                className={`shrink-0 px-4 py-2 rounded-full font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1b4332] text-white shadow-xs'
                    : 'bg-white text-[#414d47] border border-[#e5eae7] hover:bg-[#f2f6f4]'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Counter & Status Header */}
      <div className="flex items-center justify-between border-b border-[#e5eae7] pb-3 mb-5 text-xs text-[#5c6863] font-medium">
        <span>
          <strong className="text-[#111816] font-bold">
            {filteredJobs.length.toLocaleString('de-DE')}
          </strong>{' '}
          aktuelle Stellen in Berlin
        </span>
        <span className="font-mono text-xs">
          {String(currentPage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
        </span>
      </div>

      {/* Job Card Feed */}
      <div className="space-y-3">
        {displayedJobs.map((job, idx) => {
          const wage = formatWage(job);
          const jobType = formatJobType(job);
          const slug = job.slug || job.id;
          const itemIndex = String(idx + 1 + (currentPage - 1) * JOBS_PER_PAGE).padStart(2, '0');

          return (
            <Link
              key={slug || idx}
              href={`/jobs/${slug}`}
              className="group block rounded-[20px] border border-[#e5eae7] bg-white p-5 transition-all hover:border-[#1b4332]/40 hover:shadow-[0_6px_24px_rgb(0,0,0,0.03)] cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {/* Monospaced Item Number (01, 02, etc.) */}
                  <span className="hidden sm:inline-block font-mono text-xs font-semibold text-zinc-400 pt-0.5 w-6">
                    {itemIndex}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#111816] group-hover:text-[#1b4332] transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="mt-0.5 text-sm font-medium text-[#5c6863]">
                      {job.company}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#f2f6f4] px-2.5 py-1 font-medium text-[#111816]">
                        <MapPin className="size-3 text-[#1b4332]" />
                        {job.district || 'Berlin'}
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f1ec] px-2.5 py-1 font-semibold text-[#1b4332] border border-[#1b4332]/10">
                        <Euro className="size-3 text-[#1b4332]" />
                        {wage}
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-600">
                        <Clock className="size-3 text-zinc-400" />
                        {jobType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Arrow / Pin */}
                <div className="shrink-0 self-center size-9 rounded-full flex items-center justify-center text-[#1b4332] group-hover:bg-[#e8f1ec] transition-colors">
                  <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}

        {displayedJobs.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-[#e5eae7] bg-white p-12 text-center">
            <p className="text-sm font-bold text-[#111816]">Keine passenden Stellen gefunden</p>
            <p className="mt-1 text-xs text-[#5c6863]">
              Versuche andere Suchbegriffe oder wähle „Alle Bezirke“.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedDistrict('all');
              }}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#1b4332] px-5 py-2 text-xs font-semibold text-white hover:bg-[#122f23] transition-colors"
            >
              Filter zurücksetzen
            </button>
          </div>
        )}
      </div>

      {/* Editorial Pagination Controls (matching reference image bottom pager) */}
      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-between border-t border-[#e5eae7] pt-5 text-xs font-medium">
          <button
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 rounded-full border border-[#e5eae7] bg-white px-4 py-2 text-[#111816] hover:bg-[#f2f6f4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
          >
            <ChevronLeft className="size-3.5" /> Vorherige
          </button>

          {/* Reference Image Style: 07 / 13 */}
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#111816]">
            <span>{String(currentPage).padStart(2, '0')}</span>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-500">{String(totalPages).padStart(2, '0')}</span>
          </div>

          <button
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 rounded-full border border-[#e5eae7] bg-white px-4 py-2 text-[#111816] hover:bg-[#f2f6f4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
          >
            Nächste <ChevronRight className="size-3.5" />
          </button>
        </nav>
      )}
    </section>
  );
}
