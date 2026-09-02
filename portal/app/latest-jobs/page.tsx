import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Clock } from 'lucide-react';
import { JobBrowser } from '@/components/job-browser';
import { SiteHeader } from '@/components/site-header';
import { CategoryCarousel } from '@/components/category-carousel';
import { getAllLatestJobs, getJobNiches, getJobSourceInfo } from '@/lib/jobs/feeds';
import { previewJobs } from '@/lib/domain/preview-data';

export const metadata: Metadata = {
  title: 'Latest Verified Jobs in Berlin',
  description:
    'All latest verified flexible jobs, minijobs, shifts, and part-time positions across Berlin with transparent wages.',
  openGraph: {
    title: 'Latest Verified Jobs in Berlin · KIEZJOB',
    description:
      'All latest verified flexible jobs, minijobs, shifts, and part-time positions across Berlin.',
    url: '/latest-jobs',
  },
  alternates: {
    canonical: '/latest-jobs',
  },
};

export default async function LatestJobsPage() {
  const latestListings = await getAllLatestJobs();

  let initialJobs: any[] = [];

  if (latestListings.length === 0) {
    initialJobs = previewJobs;
  } else {
    initialJobs = await Promise.all(
      latestListings.map(async (job) => {
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
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="border-b border-foreground/15 bg-[#e8f6ed] py-2.5 text-center text-xs font-semibold text-[#245e3c]">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4" /> Real-time verified postings &middot; Transparent hours, wages & location
        </span>
      </div>

      <JobBrowser
        initialJobs={initialJobs}
        filterOrigin="all"
        pageTitle="Latest Verified Berlin Jobs"
        pageSubtitle="All freshly sourced and verified job opportunities across Berlin. Filter by category, shift type, hourly pay, or explore on the OpenStreetMap map."
        sectionTitle="All Latest Verified Listings"
        viewAllHref=""
      />

      <CategoryCarousel title="Browse jobs by category across Berlin" eyebrow="Explore Industries" />

      <section className="border-t border-foreground/15 bg-[#18221e] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="text-2xl font-semibold tracking-[-0.03em]">
              Are you an employer hiring in Berlin?
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
