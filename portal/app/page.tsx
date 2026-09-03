import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { JobBrowser, LatestJobs } from '@/components/job-browser';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CategoryCarousel } from '@/components/category-carousel';
import { WebSiteJsonLd } from '@/components/json-ld';
import { getHomepageFeeds, getJobNiches, getJobSourceInfo } from '@/lib/jobs/feeds';
import { previewJobs } from '@/lib/domain/preview-data';

export default async function Home() {
  const feeds = await getHomepageFeeds();
  
  // Create a combined list of jobs for the browser, fallback to preview
  let initialJobs: any[] = [];
  let latestJobs: any[] = [];
  
  if (feeds.direct.length === 0 && feeds.latest.length === 0) {
    initialJobs = previewJobs;
    latestJobs = previewJobs;
  } else {
    // combine and deduplicate
    const map = new Map();
    feeds.direct.forEach((j) => map.set(j.id, j));
    feeds.latest.forEach((j) => map.set(j.id, j));
    
    const enrich = async (jobs: any[]) => {
      return Promise.all(
        jobs.map(async (job) => {
          const niches = await getJobNiches(job.id);
          const sourceInfo = await getJobSourceInfo(job.id);
          return {
            ...job,
            slug: job.id,
            niches,
            sourceInfo,
            isDemo: false,
          };
        }),
      );
    };
    
    initialJobs = await enrich(Array.from(map.values()));
    latestJobs = await enrich(feeds.latest);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <WebSiteJsonLd />
      <SiteHeader />
      <JobBrowser initialJobs={initialJobs} />

      {/* Horizontal Scroll Category Carousel */}
      <CategoryCarousel />

      <LatestJobs jobs={latestJobs} />

      <section className="border-t border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="text-xl font-bold tracking-tight md:text-2xl">
              Flexible Arbeitskräfte oder Nachmieter in Berlin gesucht?
            </p>
            <p className="mt-1.5 text-xs text-zinc-400 max-w-xl leading-relaxed">
              Inseriere deinen Job oder deine Wohnung für 29 € (30 Tage Laufzeit). 100% Direktkontakt ohne Maklerprovision.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/post-a-job"
              className="inline-flex h-10 items-center rounded-md bg-white px-4 text-xs font-bold text-zinc-950 transition hover:bg-zinc-100 shadow-xs"
            >
              Job inserieren (29 €) <ArrowRight className="ml-1.5 size-3.5" />
            </Link>
            <Link
              href="/wohnen/list"
              className="inline-flex h-10 items-center rounded-md border border-white/20 bg-transparent px-4 text-xs font-bold text-white transition hover:bg-white/10"
            >
              Wohnung inserieren (29 €)
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
