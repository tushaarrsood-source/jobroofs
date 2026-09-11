import { EditorialHero } from '@/components/editorial-hero';
import { JobFeed } from '@/components/job-feed';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WebSiteJsonLd, LocalBusinessJsonLd } from '@/components/json-ld';
import { previewJobs } from '@/lib/domain/preview-data';
import { ALL_SOURCED_JOBS } from '@/lib/sources/sourced-jobs';
import { isJobSuppressed } from '@/lib/sources/suppression-store';

export default async function Home() {
  const map = new Map<string, any>();

  // Add initial preview jobs
  for (const j of previewJobs) {
    if (!isJobSuppressed(j.id) && (!j.slug || !isJobSuppressed(j.slug))) {
      map.set(j.slug || j.id, j);
    }
  }

  // Complement with verified sourced jobs (up to 40 for lightweight initial RSC payload)
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
    <div className="min-h-screen bg-[#fafbfa] text-[#111816] flex flex-col justify-between">
      <WebSiteJsonLd />
      <LocalBusinessJsonLd />
      <SiteHeader />

      <main className="mx-auto max-w-4xl w-full px-4 flex-1">
        {/* Signature Editorial Hero matching reference design */}
        <EditorialHero />

        {/* Full Interactive Job Feed */}
        <div className="pt-2 pb-16">
          <JobFeed initialJobs={initialJobs} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
