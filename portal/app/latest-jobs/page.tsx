import Link from '@/components/ui/link';
import type { Metadata } from 'next';
import { ArrowRight, Clock } from 'lucide-react';
import { JobBrowser } from '@/components/job-browser';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CategoryCarousel } from '@/components/category-carousel';
import { getAllLatestJobs, getJobNiches, getJobSourceInfo } from '@/lib/jobs/feeds';
import { previewJobs } from '@/lib/domain/preview-data';

export const metadata: Metadata = {
  title: 'Latest Verified Jobs in Berlin',
  description:
    'All latest verified flexible jobs, minijobs, shifts, and part-time positions across Berlin with transparent wages.',
  openGraph: {
    title: 'Latest Verified Jobs in Berlin · JOBROOFS',
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
        pageSubtitle="All freshly sourced and verified job opportunities across Berlin. Filter by category, shift type, hourly pay, or explore on the interactive map."
        sectionTitle="All Latest Verified Listings"
        viewAllHref=""
      />

      <CategoryCarousel title="Browse jobs by category across Berlin" eyebrow="Explore Industries" />

      <section className="border-t border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-3 sm:px-4 md:px-6 py-8 md:py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xl font-bold tracking-tight md:text-2xl">
              Are you an employer hiring in Berlin?
            </p>
            <p className="mt-1.5 text-xs text-slate-300">
              Post your job in minutes (30 days active). Direct applicant contact.
            </p>
          </div>
          <Link
            href="/post-a-job"
            className="inline-flex h-10 items-center rounded-xl bg-blue-600 px-5 text-xs font-bold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-500"
          >
            Post a job <ArrowRight className="ml-1.5 size-3.5" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
