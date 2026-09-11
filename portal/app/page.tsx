import Link from '@/components/ui/link';
import { PlusCircle } from 'lucide-react';
import { JobFeed } from '@/components/job-feed';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WebSiteJsonLd, LocalBusinessJsonLd } from '@/components/json-ld';
import { previewJobs } from '@/lib/domain/preview-data';
import { ALL_SOURCED_JOBS } from '@/lib/sources/sourced-jobs';
import { isJobSuppressed } from '@/lib/sources/suppression-store';

export default async function Home() {
  // Combine first batch of curated jobs for instant server-rendered first paint
  const map = new Map<string, any>();

  // Add initial preview jobs
  for (const j of previewJobs) {
    if (!isJobSuppressed(j.id) && (!j.slug || !isJobSuppressed(j.slug))) {
      map.set(j.slug || j.id, j);
    }
  }

  // Complement with verified sourced jobs (up to 40 for lightweight RSC payload)
  for (const j of ALL_SOURCED_JOBS.slice(0, 40)) {
    if (!map.has(j.slug || j.id) && !isJobSuppressed(j.id) && !isJobSuppressed(j.slug)) {
      map.set(j.slug || j.id, j);
    }
  }

  const initialJobs = Array.from(map.values()).map((job) => ({
    id: job.id,
    slug: job.slug || job.id,
    title: job.title,
    company: job.company,
    district: job.district,
    postcode: job.postcode,
    industryId: job.industryId,
    employmentForms: job.employmentForms,
    compensation: job.compensation,
    hours: job.hours,
    hoursLabel: job.hoursLabel || job.hours?.label,
    schedule: job.schedule,
    scheduleSummary: job.scheduleSummary || job.schedule?.summary,
    tier: job.tier,
    isFeatured: job.isFeatured,
    listingOrigin: job.listingOrigin,
    tags: job.tags,
    payText: job.payText,
  }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <WebSiteJsonLd />
      <LocalBusinessJsonLd />
      <SiteHeader />

      {/* High-Impact Red Banner - Jobicco Berlin Style */}
      <section className="bg-[#e33525] text-white">
        <div className="mx-auto max-w-4xl px-4 pt-10 pb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Willkommen bei KIEZJOB Berlin
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-white/90 font-medium max-w-xl leading-snug">
                Kurzzeit- und Aushilfsjobs für Studierende & Jobsuchende in Berlin. Direktkontakt ohne Vermittlungsgebühren.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/post-a-job"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#e33525] hover:bg-zinc-100 transition-all shadow-sm"
              >
                <PlusCircle className="size-4" />
                Job schalten
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container - Clean Job Feed */}
      <main className="mx-auto max-w-4xl w-full px-4 py-8 flex-1">
        <JobFeed initialJobs={initialJobs} />
      </main>

      <SiteFooter />
    </div>
  );
}
