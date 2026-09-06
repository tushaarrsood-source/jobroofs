import Link from '@/components/ui/link';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { JobPostingJsonLd, BreadcrumbJsonLd } from '@/components/json-ld';
import { previewJobs } from '@/lib/domain/preview-data';
import { getJobById, getJobNiches, getJobSourceInfo } from '@/lib/jobs/feeds';
import { notFound } from 'next/navigation';
import { getIndustry } from '@/lib/domain/taxonomy';
import { JobDetailContent } from '@/components/job-detail-content';
import { isJobSuppressed } from '@/lib/sources/suppression-store';

// Dynamic SEO metadata for each job listing
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (isJobSuppressed(slug)) return { title: 'Job Not Found' };
  const job = previewJobs.find((item) => item.slug === slug);

  if (job) {
    const payLabel = job.compensation?.label || '';
    const district = job.district || 'Berlin';
    return {
      title: `${job.title} at ${job.company} (${district})`,
      description: `${job.title} — ${payLabel} in ${district}, Berlin. ${job.employmentForms?.join(', ') || 'Flexible work'}. Apply directly on JOBROOFS.`,
      openGraph: {
        title: `${job.title} at ${job.company} (${district}) · JOBROOFS`,
        description: `${payLabel} · ${district}, Berlin. Apply now.`,
        url: `/jobs/${slug}`,
      },
      alternates: {
        canonical: `/jobs/${slug}`,
      },
    };
  }

  const dbJob = await getJobById(slug);
  if (!dbJob) return { title: 'Job Not Found' };

  const district = dbJob.district || 'Berlin';
  const payText = dbJob.payText || '';
  return {
    title: `${dbJob.title} at ${dbJob.company} (${district})`,
    description: `${dbJob.title} — ${payText} in ${district}, Berlin. Apply directly on JOBROOFS.`,
    openGraph: {
      title: `${dbJob.title} at ${dbJob.company} (${district}) · JOBROOFS`,
      description: `${payText} · ${district}, Berlin. Apply now.`,
      url: `/jobs/${slug}`,
    },
    alternates: {
      canonical: `/jobs/${slug}`,
    },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (isJobSuppressed(slug)) {
    return notFound();
  }
  let job: any = null;

  const dbJob = await getJobById(slug);
  if (dbJob) {
    const niches = await getJobNiches(slug);
    const sourceInfo = await getJobSourceInfo(slug);
    job = {
      id: dbJob.id,
      slug: dbJob.id,
      title: dbJob.title,
      company: dbJob.company,
      district: dbJob.district || 'Berlin',
      postcode: dbJob.postcode || '',
      industryId: niches.length > 0 ? niches[0].nicheId : 'Unknown',
      roleFamilyId: dbJob.roleFamilyId || 'Unknown',
      employmentForms: dbJob.employmentFormsJson ? JSON.parse(dbJob.employmentFormsJson) : ['Minijob'],
      language: dbJob.languageSignal || 'not_stated',
      listingOrigin: dbJob.listingOrigin,
      compensation: {
        label: dbJob.payText || 'Tarif / VB',
        amountMin: null,
        amountMax: null,
        currency: 'EUR',
        rateInterval: 'hour',
        payoutCadence: 'monthly',
        grossNet: 'gross',
        extras: null,
      },
      hours: {
        label: dbJob.hoursLabel || 'Flexible Arbeitszeiten',
        minimum: 10,
        maximum: 20,
        period: 'week',
      },
      schedule: {
        summary: dbJob.scheduleSummary || 'Flexible Schichten',
        workDays: [],
        timeWindows: [],
        startDate: null,
        endDate: null,
      },
      workplace: { type: 'on_site', address: dbJob.district ? `${dbJob.district}, Berlin` : 'Berlin' },
      responsibilities: ['Zuverlässige Unterstützung im Tagesgeschäft', 'Teamfähige und saubere Arbeitsweise'],
      requirements: ['Pünktlichkeit & Zuverlässigkeit', 'Gute Deutsch- oder Englischkenntnisse'],
      contact: { method: 'email', value: 'bewerbung@jobroofs.com', instructions: 'Sende eine kurze Nachricht über die Plattform.' },
      firstSeenAt: dbJob.firstSeenAt,
      lastVerifiedAt: dbJob.lastVerifiedAt,
      sourceInfo,
    };
  }

  if (!job) {
    job = previewJobs.find((item) => item.slug === slug || item.id === slug);
  }

  if (!job) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col justify-between">
      <div>
        <JobPostingJsonLd job={job} />
        <BreadcrumbJsonLd
          items={[
            { name: 'JOBROOFS', href: '/' },
            { name: getIndustry(job.industryId)?.label || 'Jobs', href: `/categories/${job.industryId}` },
            { name: job.title, href: `/jobs/${job.slug || job.id}` },
          ]}
        />
        <SiteHeader />
        <JobDetailContent job={job} />
      </div>
      <SiteFooter />
    </main>
  );
}
