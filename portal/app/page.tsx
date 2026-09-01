import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { JobBrowser, LatestJobs } from '@/components/job-browser';
import { SiteHeader } from '@/components/site-header';
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

      <section className="border-t border-foreground/15 bg-[#18221e] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="text-2xl font-semibold tracking-[-0.03em]">
              Hiring for flexible work in Berlin?
            </p>
            <p className="mt-2 text-sm text-[#aeb9b2]">
              Post your job for €29 single listing or €499/year for unlimited and top priority listings.
            </p>
          </div>
          <Link
            href="/post-a-job"
            className="inline-flex h-11 w-fit items-center rounded-lg bg-white px-5 text-sm font-semibold text-[#18221e]"
          >
            Post a job <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-foreground/15 bg-[#f4f0e7] px-5 py-8 text-sm md:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold">KIEZJOB · Berlin flexible work</span>
          <span className="text-muted-foreground">
            Minijobs · Part-time · Temporary work · Shifts
          </span>
        </div>
      </footer>
    </main>
  );
}
