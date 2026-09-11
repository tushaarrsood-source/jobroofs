import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { JobPostingJsonLd, BreadcrumbJsonLd } from '@/components/json-ld';
import { previewJobs } from '@/lib/domain/preview-data';
import { getJobById, getJobNiches, getJobSourceInfo } from '@/lib/jobs/feeds';
import { notFound } from 'next/navigation';
import { getIndustry } from '@/lib/domain/taxonomy';
import { JobDetailView } from '@/components/job-detail-view';
import { isJobSuppressed } from '@/lib/sources/suppression-store';
import { getSourcedJobBySlug, ALL_SOURCED_JOBS } from '@/lib/sources/sourced-jobs';

// Dynamic SEO metadata for each job listing
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch (e) {}

  if (isJobSuppressed(slug) || isJobSuppressed(decodedSlug)) return { title: 'Job Not Found' };
  const job =
    getSourcedJobBySlug(slug) ||
    getSourcedJobBySlug(decodedSlug) ||
    previewJobs.find(
      (item) =>
        item.slug === slug ||
        item.slug === decodedSlug ||
        item.id === slug ||
        item.id === decodedSlug,
    );

  if (job) {
    const payLabel = job.compensation?.label || '';
    const district = job.district || 'Berlin';
    return {
      title: `${job.title} — ${job.company} (${district}) | KIEZJOB`,
      description: `${job.title} bei ${job.company} in ${district}, Berlin. ${payLabel}. Jetzt direkt online bewerben.`,
      openGraph: {
        title: `${job.title} — ${job.company} (${district})`,
        description: `${payLabel} · ${district}, Berlin. Direkt bewerben.`,
        url: `/jobs/${slug}`,
      },
      alternates: {
        canonical: `/jobs/${slug}`,
      },
    };
  }

  const dbJob = (await getJobById(slug)) || (await getJobById(decodedSlug));
  if (!dbJob) return { title: 'Job Not Found' };

  const district = dbJob.district || 'Berlin';
  const payText = dbJob.payText || '';
  return {
    title: `${dbJob.title} — ${dbJob.company} (${district}) | KIEZJOB`,
    description: `${dbJob.title} — ${payText} in ${district}, Berlin. Direkt bewerben.`,
    openGraph: {
      title: `${dbJob.title} — ${dbJob.company} (${district})`,
      description: `${payText} · ${district}, Berlin. Direkt bewerben.`,
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
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch (e) {}

  if (isJobSuppressed(slug) || isJobSuppressed(decodedSlug)) {
    return notFound();
  }
  let job: any = null;

  const dbJob = (await getJobById(slug)) || (await getJobById(decodedSlug));
  if (dbJob) {
    const targetSlug = dbJob.id;
    const niches = await getJobNiches(targetSlug);
    const sourceInfo = await getJobSourceInfo(targetSlug);
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
      contact: { method: 'email', value: 'bewerbung@kiezjob.de', instructions: 'Sende eine kurze Nachricht über die Plattform.' },
      firstSeenAt: dbJob.firstSeenAt,
      lastVerifiedAt: dbJob.lastVerifiedAt,
      sourceInfo,
    };
  }

  if (!job) {
    job =
      getSourcedJobBySlug(slug) ||
      getSourcedJobBySlug(decodedSlug) ||
      previewJobs.find(
        (item) =>
          item.slug === slug ||
          item.slug === decodedSlug ||
          item.id === slug ||
          item.id === decodedSlug,
      );
  }

  if (!job) {
    return notFound();
  }

  // Calculate adjacent jobs for instant Jobicco-style Prev/Next navigation
  const currentIndex = ALL_SOURCED_JOBS.findIndex(
    (j) => j.slug === job.slug || j.id === job.id,
  );
  const prevJob = currentIndex > 0 ? ALL_SOURCED_JOBS[currentIndex - 1] : null;
  const nextJob =
    currentIndex >= 0 && currentIndex < ALL_SOURCED_JOBS.length - 1
      ? ALL_SOURCED_JOBS[currentIndex + 1]
      : null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        <JobPostingJsonLd job={job} />
        <BreadcrumbJsonLd
          items={[
            { name: 'KIEZJOB', href: '/' },
            { name: getIndustry(job.industryId)?.label || 'Jobs', href: '/' },
            { name: job.title, href: `/jobs/${job.slug || job.id}` },
          ]}
        />
        <SiteHeader />
        <JobDetailView
          job={job}
          prevSlug={prevJob?.slug || prevJob?.id}
          nextSlug={nextJob?.slug || nextJob?.id}
        />
      </div>
      <SiteFooter />
    </main>
  );
}
