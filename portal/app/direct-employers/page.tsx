import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { JobBrowser } from '@/components/job-browser';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CategoryCarousel } from '@/components/category-carousel';
import { getAllDirectJobs, getJobNiches, getJobSourceInfo } from '@/lib/jobs/feeds';
import { previewJobs } from '@/lib/domain/preview-data';

export const metadata: Metadata = {
  title: 'Direct from Employers — Jobs in Berlin',
  description:
    'Browse all job openings posted directly by Berlin employers, cafés, venues, and local companies. Minijobs, part-time, temporary shifts.',
  openGraph: {
    title: 'Direct from Employers — Jobs in Berlin · KIEZJOB',
    description:
      'Browse all job openings posted directly by Berlin employers.',
    url: '/direct-employers',
  },
  alternates: {
    canonical: '/direct-employers',
  },
};

export default async function DirectEmployersPage() {
  const directListings = await getAllDirectJobs();

  let initialJobs: any[] = [];

  if (directListings.length === 0) {
    initialJobs = previewJobs.filter((j) => j.listingOrigin === 'employer_posted');
  } else {
    initialJobs = await Promise.all(
      directListings.map(async (job) => {
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

      <div className="border-b border-foreground/15 bg-[#eef1ff] py-2.5 text-center text-xs font-semibold text-[#385cdd]">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-4" /> 100% Direct Employer Listings &middot; Direct Contact & Transparent Pay
        </span>
      </div>

      <JobBrowser
        initialJobs={initialJobs}
        filterOrigin="employer_posted"
        pageTitle="Direct from Berlin Employers"
        pageSubtitle="All active jobs posted directly by verified Berlin venues, restaurants, startups, and local companies with zero middleman delays."
        sectionTitle="All Direct Employer Postings"
        viewAllHref=""
      />

      <CategoryCarousel title="Direct hiring across 30 Berlin categories" eyebrow="Explore Industries" />

      <section className="border-t border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="text-xl font-bold tracking-tight md:text-2xl">
              Are you an employer hiring in Berlin?
            </p>
            <p className="mt-1.5 text-xs text-zinc-400">
              Post your job for €29 single listing (30 days active). Direct applicant contact.
            </p>
          </div>
          <Link
            href="/post-a-job"
            className="inline-flex h-10 items-center rounded-md bg-white px-4 text-xs font-bold text-zinc-950 transition hover:bg-zinc-100 shadow-xs"
          >
            Post a job <ArrowRight className="ml-1.5 size-3.5" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
