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

  // Reset pagination when search or district changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedDistrict]);

  // Fast client-side filtering
  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      // District filter
      if (selectedDistrict !== 'all') {
        const dist = (job.district || '').toLowerCase();
        if (!dist.includes(selectedDistrict)) return false;
      }
      // Text query
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
      {/* Search & District Filter Container */}
      <div className="mb-6 space-y-3">
        {/* Instant Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jobtitel, Firma oder Stichwort suchen..."
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#e33525] focus:border-transparent transition-all shadow-xs"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 hover:text-zinc-600"
            >
              Löschen
            </button>
          )}
        </div>

        {/* District Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {DISTRICTS.map((d) => {
            const isActive = selectedDistrict === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDistrict(d.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full font-medium transition-all ${
                  isActive
                    ? 'bg-[#e33525] text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed Status & Count */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4 text-xs text-zinc-500 font-medium">
        <span>
          {filteredJobs.length.toLocaleString('de-DE')} aktuelle Stellenanzeigen in Berlin
        </span>
        <span>
          Seite {currentPage} von {totalPages}
        </span>
      </div>

      {/* Job List */}
      <div className="space-y-2.5">
        {displayedJobs.map((job, idx) => {
          const wage = formatWage(job);
          const jobType = formatJobType(job);
          const slug = job.slug || job.id;

          return (
            <Link
              key={slug || idx}
              href={`/jobs/${slug}`}
              className="group block rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-[#e33525]/50 hover:shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-[#e33525] transition-colors line-clamp-2">
                    {job.title}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-zinc-600">
                    {job.company}
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700">
                      <MapPin className="size-3 text-zinc-500" />
                      {job.district || 'Berlin'}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 border border-emerald-200/60">
                      <Euro className="size-3 text-emerald-600" />
                      {wage}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 font-medium text-zinc-600">
                      <Clock className="size-3 text-zinc-400" />
                      {jobType}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex shrink-0 self-center items-center justify-center size-8 rounded-full bg-zinc-50 text-zinc-400 group-hover:bg-[#e33525] group-hover:text-white transition-all">
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </Link>
          );
        })}

        {displayedJobs.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center">
            <p className="text-sm font-semibold text-zinc-800">Keine passenden Jobs gefunden</p>
            <p className="mt-1 text-xs text-zinc-500">
              Versuche andere Suchbegriffe oder wähle „Alle Bezirke“.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedDistrict('all');
              }}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#e33525] px-4 py-2 text-xs font-semibold text-white hover:bg-[#c92c1d] transition-colors"
            >
              Filter zurücksetzen
            </button>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-between border-t border-zinc-200 pt-4 text-xs font-medium">
          <button
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="size-3.5" /> Vorherige
          </button>

          <span className="text-zinc-500">
            Seite <strong className="text-zinc-900">{currentPage}</strong> von {totalPages}
          </span>

          <button
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Nächste <ChevronRight className="size-3.5" />
          </button>
        </nav>
      )}
    </section>
  );
}
