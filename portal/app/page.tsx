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

      <section className="border-t border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-0.5 text-xs font-semibold text-blue-300 mb-3">
              KIEZJOB · Schneller Direktkontakt
            </div>
            <p className="text-2xl font-black tracking-tight sm:text-3xl">
              Flexible Arbeitskräfte oder Nachmieter in Berlin gesucht?
            </p>
            <p className="mt-2 text-xs text-slate-300 max-w-xl leading-relaxed sm:text-sm">
              Inseriere deinen Job oder dein WG-Zimmer / deine Wohnung für einmalig 29 € (30 Tage Laufzeit). Ohne Abo, 100% Direktkontakt ohne Maklerprovision.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/post-a-job"
              className="inline-flex h-11 items-center rounded-xl bg-blue-600 px-5 text-xs font-bold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-500"
            >
              Job inserieren (29 €) <ArrowRight className="ml-1.5 size-3.5" />
            </Link>
            <Link
              href="/wohnen/list"
              className="inline-flex h-11 items-center rounded-xl border border-white/20 bg-white/10 px-5 text-xs font-bold text-white transition hover:bg-white/20 backdrop-blur-xs"
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
