import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { JobPostingJsonLd, BreadcrumbJsonLd } from '@/components/json-ld';
import { previewJobs } from '@/lib/domain/preview-data';
import { getJobById, getJobNiches, getJobSourceInfo } from '@/lib/jobs/feeds';
import { redirect } from 'next/navigation';
import { getIndustry } from '@/lib/domain/taxonomy';
import { JobDetailView } from '@/components/job-detail-view';
import { isJobSuppressed } from '@/lib/sources/suppression-store';
import { getSourcedJobBySlug, ALL_SOURCED_JOBS } from '@/lib/sources/sourced-jobs';
import { getJobBySlugFromFirestore } from '@/lib/firebase/firestore-service';

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

  if (isJobSuppressed(slug) || isJobSuppressed(decodedSlug)) {
    return { title: 'Jobs in Berlin | JOBROOFS — The portal for Temp Jobs' };
  }

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
      title: `${job.title} — ${job.company} (${district}) | JOBROOFS — The portal for Temp Jobs`,
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
  if (dbJob) {
    const district = dbJob.district || 'Berlin';
    const payText = dbJob.payText || '';
    return {
      title: `${dbJob.title} — ${dbJob.company} (${district}) | JOBROOFS — The portal for Temp Jobs`,
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

  const fsJob = (await getJobBySlugFromFirestore(slug)) || (await getJobBySlugFromFirestore(decodedSlug));
  if (fsJob) {
    const district = fsJob.district || 'Berlin';
    return {
      title: `${fsJob.title} — ${fsJob.company} (${district}) | JOBROOFS — The portal for Temp Jobs`,
      description: `${fsJob.title} bei ${fsJob.company} in ${district}, Berlin. Jetzt direkt bewerben.`,
      openGraph: {
        title: `${fsJob.title} — ${fsJob.company} (${district})`,
        description: `Stellenangebot in ${district}, Berlin. Jetzt direkt bewerben.`,
        url: `/jobs/${slug}`,
      },
      alternates: {
        canonical: `/jobs/${slug}`,
      },
    };
  }

  return { title: 'Jobs in Berlin | JOBROOFS — The portal for Temp Jobs' };
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
    redirect('/?expired=true');
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
      contact: { method: 'email', value: 'bewerbung@jobroofs.com', instructions: 'Sende eine kurze Nachricht über die Plattform.' },
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
    const fsJob = (await getJobBySlugFromFirestore(slug)) || (await getJobBySlugFromFirestore(decodedSlug));
    if (fsJob) {
      job = {
        id: fsJob.id,
        slug: fsJob.slug || fsJob.id,
        title: fsJob.title,
        company: fsJob.company,
        district: fsJob.district || 'Berlin',
        postcode: fsJob.postcode || '',
        industryId: 'direct',
        roleFamilyId: 'direct',
        employmentForms: [fsJob.employmentType || 'Minijob'],
        language: 'german_and_english',
        listingOrigin: 'direct',
        tier: fsJob.tier || 'free',
        compensation: {
          label: fsJob.payText || 'Tarif / VB',
          amountMin: null,
          amountMax: null,
          currency: 'EUR',
          rateInterval: 'hour',
          payoutCadence: 'monthly',
          grossNet: 'gross',
          extras: null,
        },
        hours: {
          label: fsJob.hoursLabel || 'Flexible Arbeitszeiten',
          minimum: 10,
          maximum: 20,
          period: 'week',
        },
        schedule: {
          summary: fsJob.scheduleSummary || 'Flexible Schichten',
          workDays: [],
          timeWindows: [],
          startDate: null,
          endDate: null,
        },
        workplace: {
          type: 'on_site',
          address: fsJob.district
            ? `${fsJob.district}, ${fsJob.city || 'Berlin'}`
            : fsJob.city || 'Berlin',
        },
        responsibilities: [fsJob.description || 'Zuverlässige Mitarbeit im Betrieb.'],
        requirements: [fsJob.requirements || 'Pünktlichkeit & Zuverlässigkeit'],
        application: {
          method: fsJob.applyUrl ? 'external_link' : 'email',
          url: fsJob.applyUrl || null,
          email: fsJob.contactEmail || null,
          deadline: null,
          contactName: null,
        },
        city: fsJob.city || 'Berlin',
        whatsapp: fsJob.whatsapp,
        phone: fsJob.contactPhone || (fsJob as any).phone,
        contactEmail: fsJob.contactEmail,
        applyUrl: fsJob.applyUrl,
        contact: {
          method: fsJob.contactEmail ? 'email' : 'website',
          value: fsJob.contactEmail || fsJob.applyUrl || 'jobroofs@gmail.com',
          instructions: 'Direkte Kontaktaufnahme mit dem Arbeitgeber.',
        },
        firstSeenAt: fsJob.createdAt ? new Date(fsJob.createdAt).toISOString() : new Date().toISOString(),
        lastVerifiedAt: new Date().toISOString(),
      };
    }
  }

  // If a job is genuinely expired/unavailable, smoothly redirect to home feed so crawlers & users never see a 404
  if (!job) {
    redirect('/?expired=true');
  }

  // Calculate adjacent jobs for instant smooth Prev/Next navigation
  const currentIndex = ALL_SOURCED_JOBS.findIndex(
    (j) => j.slug === job.slug || j.id === job.id,
  );
  const prevJob = currentIndex > 0 ? ALL_SOURCED_JOBS[currentIndex - 1] : null;
  const nextJob =
    currentIndex >= 0 && currentIndex < ALL_SOURCED_JOBS.length - 1
      ? ALL_SOURCED_JOBS[currentIndex + 1]
      : null;

  return (
    <main className="min-h-screen bg-white text-[#222222] flex flex-col justify-between">
      <div>
        <JobPostingJsonLd job={job} />
        <BreadcrumbJsonLd
          items={[
            { name: 'JOBROOFS', href: '/' },
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
