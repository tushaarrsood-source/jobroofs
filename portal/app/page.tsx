import Link from '@/components/ui/link';
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
  
  // Combine preview jobs with any live database feeds so directory is always rich and interactive
  const map = new Map();
  previewJobs.forEach((j) => map.set(j.slug || j.id, { ...j, isDemo: false }));

  if (feeds.direct.length > 0 || feeds.latest.length > 0) {
    feeds.direct.forEach((j) => map.set(j.id, j));
    feeds.latest.forEach((j) => map.set(j.id, j));
  }

  const enrich = async (jobs: any[]) => {
    return Promise.all(
      jobs.map(async (job) => {
        if (job.slug && previewJobs.some((p) => p.slug === job.slug)) {
          return job;
        }
        const niches = await getJobNiches(job.id);
        const sourceInfo = await getJobSourceInfo(job.id);
        return {
          ...job,
          slug: job.slug || job.id,
          niches,
          sourceInfo,
          isDemo: false,
        };
      }),
    );
  };

  const initialJobs = await enrich(Array.from(map.values()));
  const latestJobs = feeds.latest.length > 0 ? await enrich(feeds.latest) : previewJobs.slice(0, 6);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <WebSiteJsonLd />
      <SiteHeader />
      <JobBrowser initialJobs={initialJobs} />

      {/* Horizontal Scroll Category Carousel */}
      <CategoryCarousel />

      <LatestJobs jobs={latestJobs} />



      <section className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-3 sm:px-4 md:px-6 py-8 md:py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-wide sm:text-5xl text-white">
              DEIN KIEZ BRAUCHT DICH.
            </h2>
            <p className="mt-2 text-xs text-slate-300 max-w-xl leading-relaxed sm:text-sm">
              Du suchst eine flexible Aushilfe für dein Café oder einen Nachmieter für deine WG? Inseriere in 2 Minuten (30 Tage aktiv) — 100% Direktkontakt ohne Zeitarbeit und ohne Makler.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/post-a-job"
              className="inline-flex h-11 items-center rounded-xl bg-blue-600 px-5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
            >
              Job inserieren <ArrowRight className="ml-1.5 size-3.5" />
            </Link>
            <Link
              href="/wohnen/list"
              className="inline-flex h-11 items-center rounded-xl border border-slate-700 bg-slate-900 px-5 text-xs font-bold text-white transition hover:bg-slate-800"
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
