import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { EmployerListingForm } from '@/components/employer-listing-form';
import { PostAJobHeader } from '@/components/post-a-job-header';

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
        <PostAJobHeader />
        <EmployerListingForm />
      </div>
    </main>
  );
}
