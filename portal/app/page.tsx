import { EditorialHero } from '@/components/editorial-hero';
import { JobFeed } from '@/components/job-feed';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WebSiteJsonLd, LocalBusinessJsonLd } from '@/components/json-ld';
import { previewJobs } from '@/lib/domain/preview-data';
import { ALL_SOURCED_JOBS, getDirectEmployerJobs } from '@/lib/sources/sourced-jobs';
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

  // Initial verified direct employer jobs for section above search bar
  const initialDirectJobs = getDirectEmployerJobs(6).map((job) => ({
    id: job.id,
    slug: job.slug || job.id,
    title: job.title,
    company: job.company,
    district: job.district,
    postcode: job.postcode,
    industryId: job.industryId,
    employmentForms: job.employmentForms,
    compensation: job.compensation,
    payText: job.compensation?.label || 'Vergütung n.V.',
    listingOrigin: 'employer_posted',
    isDirect: true,
  }));

  return (
    <div className="min-h-screen text-[#202a31] flex flex-col justify-between relative z-10">
      <WebSiteJsonLd />
      <LocalBusinessJsonLd />
      <SiteHeader />

      <main className="mx-auto max-w-5xl w-full px-6 md:px-8 flex-1">
        {/* Signature Editorial Hero with Premium Spotlight */}
        <EditorialHero />

        {/* Full Interactive Job Feed with Direct Employer Listings Above Search Bar */}
        <div className="pt-2 pb-16">
          <JobFeed initialJobs={initialJobs} initialDirectJobs={initialDirectJobs} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
