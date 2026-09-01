import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Clock3,
  Euro,
  ExternalLink,
  Languages,
  Mail,
  MapPin,
  Navigation,
  WalletCards,
} from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { JobPostingJsonLd, BreadcrumbJsonLd } from '@/components/json-ld';
import { previewJobs } from '@/lib/domain/preview-data';
import { getJobById, getJobNiches, getJobSourceInfo } from '@/lib/jobs/feeds';
import { notFound } from 'next/navigation';
import { getIndustry, getRoleFamily } from '@/lib/domain/taxonomy';
import { getGoogleMapsUrl } from '@/lib/domain/berlin-geo';
import dynamic from 'next/dynamic';

const JobMap = dynamic(() => import('@/components/job-map').then((mod) => mod.JobMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-48 w-full items-center justify-center rounded-xl border border-foreground/15 bg-[#eceae2] text-xs font-semibold text-muted-foreground">
      🗺️ Loading Berlin map...
    </div>
  ),
});

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
  let isDemo = !!job;

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

  const employerPosted = job.listingOrigin === 'employer_posted';
  const language =
    job.language === 'english_explicit'
      ? 'English accepted'
      : job.language === 'german_explicit'
        ? 'German stated'
        : job.language === 'german_and_english'
          ? 'German and English'
          : 'Not stated';

  return (
    <main className="min-h-screen bg-[#f4f0e7] text-[#18221e]">
      <JobPostingJsonLd job={job} />
      <BreadcrumbJsonLd
        items={[
          { name: 'KIEZJOB', href: '/' },
          { name: getIndustry(job.industryId)?.label || 'Jobs', href: `/categories/${job.industryId}` },
          { name: job.title, href: `/jobs/${job.slug || job.id}` },
        ]}
      />
      <SiteHeader />
      <div className="mx-auto max-w-[1180px] px-5 py-8 md:px-10 md:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All jobs
        </Link>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="overflow-hidden rounded-xl border border-foreground/15 bg-white">
            <header className="border-b border-foreground/10 p-6 md:p-9">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${employerPosted ? 'bg-[#e5eaff] text-[#304ea9]' : 'bg-[#e8eee9] text-[#3e5146]'}`}
                >
                  {employerPosted
                    ? 'Posted directly by employer'
                    : 'Found at employer source'}
                </span>
                {job.isDemo ? (
                  <span className="rounded-full bg-[#fff1c7] px-2.5 py-1 text-[10px] text-[#6a5117]">Sample listing</span>
                ) : (
                  job.niches?.map((n: any) => (
                    <span key={n.nicheId} className="rounded-full bg-foreground/5 px-2 py-1 text-[10px] text-muted-foreground">{n.label}</span>
                  ))
                )}
                {job.sourceName ? (
                  <span className="rounded-full bg-[#e8eee9] px-2.5 py-1 text-[10px] text-[#3e5146]">
                    {job.sourceUrl ? <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">Sourced from {job.sourceName}</a> : `Sourced from ${job.sourceName}`}
                  </span>
                ) : null}
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
                {job.title}
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                {job.company}
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7">
                {job.summary}
              </p>
            </header>

            <section className="grid gap-px bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
              <Fact
                icon={Euro}
                label="Pay"
                value={job.compensation.label}
                emphasis
              />
              <Fact icon={Clock3} label="Hours" value={job.hours.label} />
              <Fact
                icon={CalendarDays}
                label="Schedule"
                value={job.schedule.summary}
              />
              <Fact
                icon={MapPin}
                label="Location"
                value={`${job.district}, ${job.postcode} Berlin`}
              />
              <Fact
                icon={BriefcaseBusiness}
                label="Job type"
                value={job.employmentForms.join(', ')}
              />
              <Fact icon={Languages} label="Language" value={language} />
            </section>

            <div className="space-y-9 p-6 md:p-9">
              <DetailSection
                title="What you will do"
                items={job.responsibilities}
              />
              <DetailSection
                title="What the employer is looking for"
                items={job.requirements}
              />

              <section>
                <h2 className="text-xl font-semibold">Working time</h2>
                <dl className="mt-5 grid gap-4 rounded-xl bg-[#f5f6f3] p-5 sm:grid-cols-2">
                  <Definition label="Hours" value={job.hours.label} />
                  <Definition
                    label="Days"
                    value={job.schedule.workDays.join(', ') || 'Not stated'}
                  />
                  <Definition
                    label="Times"
                    value={job.schedule.timeWindows.join(', ') || 'Not stated'}
                  />
                  <Definition
                    label="Start"
                    value={job.schedule.startDate ?? 'Not stated'}
                  />
                  {job.schedule.endDate ? (
                    <Definition label="End" value={job.schedule.endDate} />
                  ) : null}
                  <Definition
                    label="Workplace"
                    value={
                      job.workplace.type === 'on_site'
                        ? 'On site'
                        : job.workplace.type === 'hybrid'
                          ? 'Hybrid'
                          : 'Remote'
                    }
                  />
                </dl>
              </section>

              <section>
                <h2 className="text-xl font-semibold">Pay details</h2>
                <dl className="mt-5 grid gap-4 rounded-xl bg-[#eef7f1] p-5 sm:grid-cols-2">
                  <Definition label="Rate" value={job.compensation.label} />
                  <Definition
                    label="Paid"
                    value={payoutLabel(job.compensation.payoutCadence)}
                  />
                  <Definition
                    label="Gross / net"
                    value={
                      job.compensation.grossNet === 'not_stated'
                        ? 'Not stated'
                        : job.compensation.grossNet
                    }
                  />
                  <Definition
                    label="Extras"
                    value={job.compensation.extras ?? 'None stated'}
                  />
                </dl>
              </section>

              {job.application.deadline ? (
                <section className="rounded-xl border border-[#e4c77f] bg-[#fff8e6] p-5">
                  <p className="text-xs uppercase tracking-wide text-[#7a5e22]">
                    Application deadline
                  </p>
                  <p className="mt-1 font-semibold text-[#5f4615]">
                    {job.application.deadline}
                  </p>
                </section>
              ) : null}
            </div>
          </article>

          <aside className="space-y-5">
            <div
              className={`rounded-xl p-6 ${employerPosted ? 'bg-[#385cdd] text-white' : 'bg-[#18221e] text-white'}`}
            >
              <p className="text-xs font-medium uppercase tracking-wider text-white/65">
                Apply for this job
              </p>
              <h2 className="mt-3 text-xl font-semibold">
                {job.application.method === 'email'
                  ? 'Apply by email'
                  : 'Apply on the employer website'}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/75">
                {job.application.instructions}
              </p>
              {job.application.contactName ? (
                <p className="mt-3 text-sm">
                  Contact: {job.application.contactName}
                </p>
              ) : null}
              {job.isDemo ? (
                <button
                  disabled={true}
                  className="mt-6 inline-flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-[#18221e] opacity-80"
                >
                  {job.application.method === 'email' ? (
                    <Mail className="size-4" />
                  ) : (
                    <ExternalLink className="size-4" />
                  )}
                  {job.application.method === 'email'
                    ? 'Open email application'
                    : 'Go to application'}
                </button>
              ) : (
                <a
                  href={job.application.url || (job.application.email ? `mailto:${job.application.email}` : '#')}
                  target="_blank" rel="noopener noreferrer"
                  className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-[#18221e] hover:bg-gray-100"
                >
                  {job.application.method === 'email' ? (
                    <Mail className="size-4" />
                  ) : (
                    <ExternalLink className="size-4" />
                  )}
                  {job.application.method === 'email'
                    ? 'Open email application'
                    : 'Go to application'}
                </a>
              )}
              {job.isDemo ? <p className="mt-3 text-center text-[11px] text-white/60">Disabled for sample listing</p> : null}
            </div>

            <div className="rounded-xl border border-foreground/15 bg-white p-6">
              <h2 className="font-semibold">Job overview</h2>
              <dl className="mt-5 space-y-4 text-sm">
                <Definition
                  label="Category"
                  value={getIndustry(job.industryId)?.label ?? job.industryId}
                />
                <Definition
                  label="Work"
                  value={getRoleFamily(job.roleFamilyId)}
                />
                <Definition
                  label="Address"
                  value={job.workplace.address ?? `${job.district}, Berlin`}
                />
                <Definition
                  label="Application"
                  value={
                    job.application.method === 'email'
                      ? 'Email'
                      : 'Employer website'
                  }
                />
              </dl>
            </div>

            {/* Berlin OpenStreetMap Location Pin & Google Maps Link */}
            <div className="overflow-hidden rounded-xl border border-foreground/15 bg-white">
              <div className="flex items-center justify-between border-b border-foreground/10 bg-[#fbfaf6] px-5 py-3 text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-foreground">
                  <MapPin className="size-3.5 text-[#ed6a43]" />
                  <span>{job.district ? `${job.district}, Berlin` : 'Berlin'}</span>
                </span>
                <span className="rounded-full bg-[#e8f6ed] px-2 py-0.5 text-[10px] font-bold text-[#245e3c]">
                  📍 {job.compensation?.label ? job.compensation.label.split(' ')[0] : '€/h'}
                </span>
              </div>
              <div className="h-48 w-full">
                <JobMap
                  jobs={[job]}
                  miniMode={true}
                  centerSingleJob={true}
                  className="h-full w-full rounded-none border-0 shadow-none"
                />
              </div>
              <div className="border-t border-foreground/10 bg-[#fbfaf6] p-3 text-center">
                <a
                  href={getGoogleMapsUrl(job)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-foreground/15 bg-white px-4 py-2 text-xs font-semibold text-[#18221e] shadow-sm transition hover:bg-[#18221e] hover:text-white"
                >
                  <Navigation className="size-3.5 text-[#ed6a43]" />
                  <span>Open in Google Maps ↗</span>
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-foreground/15 bg-white p-6">
              <div className="flex items-center gap-2">
                <WalletCards className="size-4 text-[#385cdd]" />
                <h2 className="font-semibold">Listing information</h2>
              </div>
              {employerPosted ? (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  The employer supplied this listing directly. Contact and
                  application destination must be verified before publication.
                </p>
              ) : (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  This job was found on the employer&apos;s own website. Facts
                  are shown only when they appear at the source.
                </p>
              )}
              <div className="mt-4 flex flex-col gap-2 border-t border-foreground/10 pt-4 text-xs">
                {job.isDemo ? (
                  <div className="flex justify-between"><span className="text-muted-foreground">Last checked</span><span className="font-medium">Today</span></div>
                ) : (
                  <>
                    <div className="flex justify-between"><span className="text-muted-foreground">First seen</span><span className="font-medium">{new Date(job.firstSeenAt).toLocaleDateString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Last verified</span><span className="font-medium">{new Date(job.lastVerifiedAt).toLocaleDateString()}</span></div>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
  emphasis = false,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="min-h-28 bg-white p-5">
      <p className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </p>
      <p
        className={`mt-3 text-sm leading-5 ${emphasis ? 'text-lg font-semibold text-[#245e3c]' : 'font-medium'}`}
      >
        {value}
      </p>
    </div>
  );
}

function DetailSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6">
            <Check className="mt-1 size-4 shrink-0 text-[#2f8b5d]" /> {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Definition({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium capitalize">{value}</dd>
    </div>
  );
}

function payoutLabel(
  value: (typeof previewJobs)[number]['compensation']['payoutCadence'],
) {
  if (value === 'after_shift') return 'After each shift';
  if (value === 'fortnightly') return 'Every two weeks';
  if (value === 'not_stated') return 'Not stated';
  return value;
}
