import Link from '@/components/ui/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { JobFeed } from '@/components/job-feed';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import { previewJobs } from '@/lib/domain/preview-data';
import { ALL_SOURCED_JOBS } from '@/lib/sources/sourced-jobs';
import { isJobSuppressed } from '@/lib/sources/suppression-store';

export const metadata: Metadata = {
  title: 'Alle Stellenangebote in Berlin — JOBROOFS | The portal for Temp Jobs',
  description:
    'Vollständiges Verzeichnis aller verifizierten Temp Jobs, Minijobs und flexiblen Aushilfsjobs in Berlin. 100% Direktkontakt ohne Zeitarbeit.',
  openGraph: {
    title: 'Alle Stellenangebote in Berlin · JOBROOFS — The portal for Temp Jobs',
    description:
      'Stöbere durch die vollständige Übersicht aller Jobs in Berlin across 32 Kategorien.',
    url: '/all-jobs',
  },
  alternates: {
    canonical: '/all-jobs',
  },
};

export default function AllJobsPage() {
  const map = new Map<string, any>();
  for (const j of previewJobs) {
    if (!isJobSuppressed(j.id) && (!j.slug || !isJobSuppressed(j.slug))) {
      map.set(j.slug || j.id, j);
    }
  }
  for (const j of ALL_SOURCED_JOBS.slice(0, 40)) {
    if (!map.has(j.slug || j.id) && !isJobSuppressed(j.id) && !isJobSuppressed(j.slug)) {
      map.set(j.slug || j.id, j);
    }
  }

  const initialJobs = Array.from(map.values()).map((job) => ({
    id: job.id,
    slug: job.slug || job.id,
    title: job.title,
    company: job.company,
    district: job.district,
    postcode: job.postcode,
    industryId: job.industryId,
    employmentForms: job.employmentForms,
    compensation: job.compensation,
    hours: job.hours,
    hoursLabel: job.hoursLabel || job.hours?.label,
    schedule: job.schedule,
    scheduleSummary: job.scheduleSummary || job.schedule?.summary,
    tier: job.tier,
    isFeatured: job.isFeatured,
    listingOrigin: job.listingOrigin,
    tags: job.tags,
    payText: job.payText,
  }));

  return (
    <main className="min-h-screen bg-[#fbfbf8] text-[#202a31] flex flex-col justify-between">
      <div>
        <BreadcrumbJsonLd
          items={[
            { name: 'JOBROOFS', href: '/' },
            { name: 'Alle Stellenangebote', href: '/all-jobs' },
          ]}
        />
        <SiteHeader />

        <div className="border-b border-[#d8ded9] bg-white py-3">
          <div className="mx-auto max-w-5xl px-6 md:px-8 flex items-center justify-between text-[12px]">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-normal text-[#7e8a84] hover:text-[#202a31] transition-colors"
            >
              <ArrowLeft className="size-3.5 stroke-[1.25]" /> Startseite
            </Link>
            <span className="font-normal text-[#7e8a84]">
              Gesamter Stellenkatalog (1.600 Jobs)
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
