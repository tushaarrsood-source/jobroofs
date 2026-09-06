import Link from '@/components/ui/link';
import { ArrowRight } from 'lucide-react';
import { JobBrowser, LatestJobs } from '@/components/job-browser';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CategoryCarousel } from '@/components/category-carousel';
import { WebSiteJsonLd, LocalBusinessJsonLd } from '@/components/json-ld';
import { PortalWelcomeBanner } from '@/components/portal-welcome-banner';
import { getHomepageFeeds, getJobNiches, getJobSourceInfo } from '@/lib/jobs/feeds';
import { previewJobs } from '@/lib/domain/preview-data';
import { isJobSuppressed } from '@/lib/sources/suppression-store';

export default async function Home() {
  const feeds = await getHomepageFeeds();
  
  // Combine curated jobs with any live database feeds so directory is always rich and interactive
  const map = new Map<string, any>();
  for (const j of previewJobs) {
    if (!isJobSuppressed(j.id) && (!j.slug || !isJobSuppressed(j.slug))) {
      map.set(j.slug || j.id, j);
    }
  }

  // Only enrich database feeds if D1 returns live rows
  if (feeds.direct.length > 0 || feeds.latest.length > 0) {
    const enrichFeed = async (jobs: any[]) => {
      return Promise.all(
        jobs.map(async (job) => {
          const niches = await getJobNiches(job.id);
          const sourceInfo = await getJobSourceInfo(job.id);
          return {
            ...job,
            slug: job.slug || job.id,
            niches,
            sourceInfo,
          };
        }),
      );
    };
    const [enrichedDirect, enrichedLatest] = await Promise.all([
      enrichFeed(feeds.direct),
      enrichFeed(feeds.latest),
    ]);
    enrichedDirect.forEach((j) => map.set(j.id, j));
    enrichedLatest.forEach((j) => map.set(j.id, j));
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
  const latestJobs = feeds.latest.length > 0 ? feeds.latest : initialJobs.slice(0, 6);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-clip w-full max-w-full">
      <WebSiteJsonLd />
      <LocalBusinessJsonLd />
      <SiteHeader />
      <PortalWelcomeBanner />
      <JobBrowser initialJobs={initialJobs} />

      {/* Horizontal Scroll Category Carousel */}
      <CategoryCarousel />

      <LatestJobs jobs={latestJobs} />



      <section className="border-t border-black/[0.06] bg-[#1d1d1f] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-3 sm:px-4 md:px-6 py-10 md:py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Dein Kiez braucht dich.
            </h2>
            <p className="mt-2 text-xs text-[#a1a1a6] max-w-xl leading-relaxed sm:text-sm">
              Du suchst eine flexible Aushilfe für dein Café oder einen Nachmieter für deine WG? Inseriere in 2 Minuten (30 Tage aktiv) — 100% Direktkontakt ohne Zeitarbeit und ohne Makler.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/post-a-job"
              className="apple-btn-primary !bg-white !text-[#1d1d1f] hover:!bg-[#f5f5f7] !h-10 !px-5"
            >
              Job inserieren <ArrowRight className="ml-1.5 size-3.5" />
            </Link>
            <Link
              href="/wohnen/list"
              className="apple-btn-secondary !bg-white/10 !text-white !border-white/15 hover:!bg-white/15 !h-10 !px-5"
            >
              Wohnung inserieren
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
