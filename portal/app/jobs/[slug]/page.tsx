import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { JobPostingJsonLd, BreadcrumbJsonLd } from '@/components/json-ld';
import { previewJobs } from '@/lib/domain/preview-data';
import { getJobById, getJobNiches, getJobSourceInfo } from '@/lib/jobs/feeds';
import { notFound } from 'next/navigation';
import { getIndustry } from '@/lib/domain/taxonomy';
import { JobDetailContent } from '@/components/job-detail-content';

// Dynamic SEO metadata for each job listing
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = previewJobs.find((item) => item.slug === slug);

  if (job) {
    const payLabel = job.compensation?.label || '';
    const district = job.district || 'Berlin';
    return {
      title: `${job.title} at ${job.company} (${district})`,
      description: `${job.title} — ${payLabel} in ${district}, Berlin. ${job.employmentForms?.join(', ') || 'Flexible work'}. Apply directly on KIEZJOB.`,
      openGraph: {
        title: `${job.title} at ${job.company} (${district}) · KIEZJOB`,
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
    description: `${dbJob.title} — ${payText} in ${district}, Berlin. Apply directly on KIEZJOB.`,
    openGraph: {
      title: `${dbJob.title} at ${dbJob.company} (${district}) · KIEZJOB`,
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
  let job: any = previewJobs.find((item) => item.slug === slug);

  if (!job) {
    const dbJob = await getJobById(slug);
    if (!dbJob) return notFound();
    const niches = await getJobNiches(slug);
    const sourceInfo = await getJobSourceInfo(slug);
    
    job = {
      isDemo: false,
      id: dbJob.id,
      slug: dbJob.id,
      title: dbJob.title,
      company: dbJob.company,
      district: dbJob.district || '',
      postcode: dbJob.postcode || '',
      industryId: niches.length > 0 ? niches[0].nicheId : 'Unknown',
      roleFamilyId: dbJob.roleFamilyId || 'Unknown',
      employmentForms: dbJob.employmentFormsJson ? JSON.parse(dbJob.employmentFormsJson) : [],
      language: dbJob.languageSignal || 'not_stated',
      listingOrigin: dbJob.listingOrigin,
      compensation: {
        label: dbJob.payText || 'Not stated',
        payoutCadence: dbJob.payoutCadence || 'not_stated',
        grossNet: dbJob.compensationGrossNet || 'not_stated',
        extras: dbJob.compensationExtras || null,
      },
      hours: {
        label: dbJob.hoursLabel || 'Not stated',
      },
      schedule: {
        summary: dbJob.scheduleSummary || 'Not stated',
        workDays: dbJob.workDaysJson ? JSON.parse(dbJob.workDaysJson) : [],
        timeWindows: dbJob.timeWindowsJson ? JSON.parse(dbJob.timeWindowsJson) : [],
        startDate: dbJob.startDateText,
        endDate: dbJob.endDateText,
      },
      workplace: {
        type: dbJob.workplaceType,
        address: dbJob.streetAddress || null,
      },
      responsibilities: dbJob.responsibilitiesJson ? JSON.parse(dbJob.responsibilitiesJson) : [],
      requirements: dbJob.requirementsJson ? JSON.parse(dbJob.requirementsJson) : [],
      application: {
        method: dbJob.applicationMethod,
        url: dbJob.applicationUrl,
        email: dbJob.applicationEmail,
        deadline: dbJob.applicationDeadline,
        contactName: dbJob.applicationContactName,
        instructions: dbJob.applicationInstructions || 'No instructions provided.',
      },
      firstSeenAt: dbJob.firstSeenAt,
      lastVerifiedAt: dbJob.lastVerifiedAt || dbJob.firstSeenAt,
      sourceName: sourceInfo?.sourceName || null,
      sourceUrl: sourceInfo?.sourceUrl || null,
      summary: 'A flexible role available in Berlin.',
      niches: niches
    };
  }

  if (!job)
    return (
      <main className="min-h-screen bg-[#f4f0e7]">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h1 className="text-3xl font-semibold">Job not found</h1>
          <Link href="/" className="mt-5 inline-block text-[#385cdd] underline">
            Back to jobs
          </Link>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col justify-between">
      <div>
        <JobPostingJsonLd job={job} />
        <BreadcrumbJsonLd
          items={[
            { name: 'KIEZJOB', href: '/' },
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
