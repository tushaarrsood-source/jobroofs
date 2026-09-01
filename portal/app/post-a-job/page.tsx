import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { EmployerListingForm } from '@/components/employer-listing-form';

export const metadata: Metadata = {
  title: 'Post a Job — Hire Berlin Minijob & Flexible Talent',
  description:
    'Post your job opening directly to thousands of active Berlin job seekers. Reach applicants for Minijobs, part-time work, temp gigs, and flexible shifts.',
  openGraph: {
    title: 'Post a Job — Hire Berlin Minijob & Flexible Talent · KIEZJOB',
    description:
      'Reach active local applicants for Minijobs, part-time work, and flexible shifts in Berlin.',
    url: '/post-a-job',
  },
  alternates: {
    canonical: '/post-a-job',
  },
};

export default function PostAJobPage() {
  return (
    <main className="min-h-screen bg-[#f4f0e7] text-[#18221e]">
      <SiteHeader />
      <div className="mx-auto max-w-[980px] px-5 py-10 md:px-10 md:py-14">
        <p className="text-sm font-medium text-[#385cdd]">For Berlin Employers</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
          Post a Berlin job
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          Reach active, local candidates looking for Minijobs, part-time, working student, and flexible shifts across Berlin. 
          Fill the details below &mdash; &euro;29 one-time per 30-day listing or &euro;499/year for unlimited and top priority listings.
        </p>
        <EmployerListingForm />
      </div>
    </main>
  );
}
