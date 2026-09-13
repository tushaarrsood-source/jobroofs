import Link from '@/components/ui/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { JobFeed } from '@/components/job-feed';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import { getJobsFromFirestore } from '@/lib/firebase/firestore-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Alle unabhängigen Stellenangebote — JOBROOFS | Deutschland',
  description:
    'Vollständiges Verzeichnis aller verifizierten unabhängigen Stellen, Minijobs und Aushilfen in Deutschland. 100% Direktkontakt ohne Zeitarbeit.',
  openGraph: {
    title: 'Alle unabhängigen Stellenangebote · JOBROOFS',
    description:
      'Stöbere durch die vollständige Übersicht aller unabhängigen Jobs in Deutschland.',
    url: '/all-jobs',
  },
  alternates: {
    canonical: '/all-jobs',
  },
};

export default async function AllJobsPage() {
  let firestoreJobs: any[] = [];
  try {
    firestoreJobs = await getJobsFromFirestore(100);
  } catch (e) {
    console.error('Error fetching jobs for all-jobs page:', e);
  }

  const initialJobs = firestoreJobs.map((job) => ({
    id: job.id,
    slug: job.slug || job.id,
    title: job.title,
    company: job.company,
    city: job.city || 'Berlin',
    district: job.district,
    postcode: job.postcode,
    industryId: job.industryId || 'other',
    employmentForms: job.employmentForms || [job.employmentType || 'Minijob'],
    compensation: job.compensation || { label: job.payText },
    hours: job.hours,
    hoursLabel: job.hoursLabel || job.hours?.label,
    schedule: job.schedule,
    scheduleSummary: job.scheduleSummary || job.schedule?.summary,
    tier: job.tier,
    isFeatured: job.tier === 'premium',
    listingOrigin: 'employer_posted',
    tags: job.tags || [],
    payText: job.payText,
    isIndependentLister: true,
    isUserListing: true,
    whatsapp: job.whatsapp,
    phone: job.contactPhone || job.phone,
    contactEmail: job.contactEmail,
    applyUrl: job.applyUrl,
    postedAt: job.createdAt
      ? typeof job.createdAt.toDate === 'function'
        ? job.createdAt.toDate().toISOString()
        : job.createdAt
      : undefined,
  }));

  return (
    <main className="min-h-screen bg-[#fafaf9] text-black flex flex-col justify-between">
      <div>
        <BreadcrumbJsonLd
          items={[
            { name: 'JOBROOFS', href: '/' },
            { name: 'Alle Stellenangebote', href: '/all-jobs' },
          ]}
        />
        <SiteHeader />

        <div className="border-b border-zinc-200 bg-white py-3">
          <div className="mx-auto max-w-5xl px-6 md:px-8 flex items-center justify-between text-[12.5px]">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-semibold text-zinc-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="size-3.5 stroke-[2]" /> Startseite
            </Link>
            <span className="font-semibold text-black">
              Unabhängige Inserate ({initialJobs.length})
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 md:px-8 py-8">
          <JobFeed initialJobs={initialJobs} />
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
