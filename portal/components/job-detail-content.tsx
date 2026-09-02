'use client';

import Link from 'next/link';
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
import { getGoogleMapsUrl } from '@/lib/domain/berlin-geo';
import { useTranslation } from '@/lib/i18n/language-context';
import dynamic from 'next/dynamic';

const JobMap = dynamic(() => import('@/components/job-map').then((mod) => mod.JobMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-48 w-full items-center justify-center rounded-xl border border-foreground/15 bg-[#eceae2] text-xs font-semibold text-muted-foreground">
      Loading Berlin map...
    </div>
  ),
});

export function JobDetailContent({ job }: { job: any }) {
  const { t, isDe } = useTranslation();
  const employerPosted = job.listingOrigin === 'employer_posted';

  const language =
    job.language === 'english_explicit'
      ? (isDe ? 'Englisch ausreichend' : 'English accepted')
      : job.language === 'german_explicit'
        ? (isDe ? 'Deutsch erforderlich' : 'German required')
        : job.language === 'german_and_english'
          ? (isDe ? 'Deutsch und Englisch' : 'German and English')
          : (isDe ? 'Nicht angegeben' : 'Not stated');

  let payLabel = job.compensation.label;
  if (
    payLabel.toLowerCase().includes('discussed') ||
    payLabel.toLowerCase().includes('vereinbarung')
  ) {
    payLabel = t('toBeDiscussed');
  }

  const hoursLabel = job.hours.label || t('flexibleHours');
  const scheduleSummary = job.schedule.summary || t('flexibleShifts');

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-8 md:px-10 md:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {t('backToAllJobs')}
      </Link>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="overflow-hidden rounded-xl border border-foreground/15 bg-white">
          <header className="border-b border-foreground/10 p-6 md:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  employerPosted
                    ? 'bg-[#edf2ff] text-[#385cdd]'
                    : 'bg-[#f0f2ef] text-[#3e5146]'
                }`}
              >
                {employerPosted ? t('postedByEmployer') : t('verifiedSource')}
              </span>
              {job.employmentForms?.map((form: string) => (
                <span
                  key={form}
                  className="rounded-full bg-foreground/5 px-2.5 py-0.5 text-[11px] text-muted-foreground"
                >
                  {form}
                </span>
              ))}
              {job.isDemo ? (
                <span className="rounded-full bg-[#fff8e7] px-2.5 py-0.5 text-[11px] text-[#7a5d1b]">
                  {t('sampleListing')}
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
              label={t('pay')}
              value={payLabel}
              emphasis
            />
            <Fact
              icon={Clock3}
              label={t('hours')}
              value={hoursLabel}
            />
            <Fact
              icon={CalendarDays}
              label={t('schedule')}
              value={scheduleSummary}
            />
            <Fact
              icon={MapPin}
              label={t('location')}
              value={`${job.district}, ${job.postcode} Berlin`}
            />
            <Fact
              icon={BriefcaseBusiness}
              label={t('jobType')}
              value={job.employmentForms.join(', ')}
            />
            <Fact
              icon={Languages}
              label={t('languageSignal')}
              value={language}
            />
          </section>

          <div className="space-y-9 p-6 md:p-9">
            <DetailSection
              title={t('whatYouWillDo')}
              items={job.responsibilities}
            />
            <DetailSection
              title={t('whatEmployerLooksFor')}
              items={job.requirements}
            />

            <section>
              <h2 className="text-xl font-semibold">{t('workingTimeDetails')}</h2>
              <dl className="mt-5 grid gap-4 rounded-xl bg-[#f5f6f3] p-5 sm:grid-cols-2">
                <Definition label={t('hours')} value={hoursLabel} />
                <Definition
                  label={t('days')}
                  value={job.schedule.workDays?.join(', ') || t('ongoing')}
                />
                <Definition
                  label={t('times')}
                  value={job.schedule.timeWindows?.join(', ') || t('ongoing')}
                />
                <Definition
                  label={t('start')}
                  value={job.schedule.startDate ?? t('today')}
                />
                {job.schedule.endDate ? (
                  <Definition label={t('duration')} value={job.schedule.endDate} />
                ) : null}
                <Definition
                  label={t('location')}
                  value={
                    job.workplace.type === 'on_site'
                      ? t('onSite')
                      : job.workplace.type === 'hybrid'
                        ? t('hybrid')
                        : t('remote')
                  }
                />
              </dl>
            </section>

            <section>
              <h2 className="text-xl font-semibold">{t('compensationDetails')}</h2>
              <dl className="mt-5 grid gap-4 rounded-xl bg-[#f5f6f3] p-5 sm:grid-cols-2">
                <Definition label={t('rate')} value={payLabel} />
                <Definition
                  label={t('payoutCadence')}
                  value={
                    job.compensation.payoutCadence === 'after_shift'
                      ? t('afterShift')
                      : job.compensation.payoutCadence === 'weekly'
                      ? t('weekly')
                      : t('monthly')
                  }
                />
                <Definition
                  label={t('extras')}
                  value={job.compensation.extras ?? t('noneStated')}
                />
              </dl>
            </section>
          </div>
        </article>

        <aside className="space-y-5">
          <section className="rounded-xl border border-foreground/15 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">{t('howToApply')}</h2>

            {job.application.method === 'url' && job.application.url ? (
              <div className="mt-5 space-y-3">
                <p className="text-xs text-muted-foreground">
                  {t('applyByWebsitePrompt')}
                </p>
                <a
                  href={job.application.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#18221e] px-4 text-sm font-semibold text-white transition hover:bg-[#2a3832]"
                >
                  <span>{t('openEmployerWebsite')}</span>
                </a>
              </div>
            ) : null}

            {job.application.method === 'email' && job.application.email ? (
              <div className="mt-5 space-y-3">
                <p className="text-xs text-muted-foreground">
                  {t('applyByEmailPrompt')}
                </p>
                <a
                  href={`mailto:${job.application.email}?subject=${encodeURIComponent(
                    `Application: ${job.title} via KIEZJOB`,
                  )}`}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#385cdd] px-4 text-sm font-semibold text-white transition hover:bg-[#294bc4]"
                >
                  <Mail className="size-4" />
                  <span>{t('sendEmailApplication')}</span>
                </a>
              </div>
            ) : null}

            <dl className="mt-5 space-y-3 border-t border-foreground/10 pt-5 text-sm">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">
                  {t('instructions')}
                </dt>
                <dd className="mt-1 leading-relaxed">
                  {job.application.instructions}
                </dd>
              </div>
              {job.application.deadline ? (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t('deadline')}
                  </dt>
                  <dd className="mt-1">{job.application.deadline}</dd>
                </div>
              ) : null}
              {job.application.contactName ? (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t('contactPerson')}
                  </dt>
                  <dd className="mt-1">{job.application.contactName}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          {/* Location & Map Card */}
          <section className="overflow-hidden rounded-xl border border-foreground/15 bg-white shadow-sm">
            <div className="p-5">
              <h2 className="text-base font-semibold">{t('location')}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {job.district ? `${job.district}, ` : ''}{job.postcode ? `${job.postcode} ` : ''}Berlin
              </p>
            </div>
            
            <div className="h-48 w-full border-t border-b border-foreground/10">
              <JobMap
                jobs={[job]}
                miniMode
                centerSingleJob
                showCardOverlay={false}
                className="h-full w-full"
              />
            </div>

            <div className="p-4 bg-[#fbfaf6]">
              <a
                href={getGoogleMapsUrl(job)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#385cdd] hover:underline"
              >
                <Navigation className="size-3.5 text-[#ed6a43]" />
                <span>{t('openInGoogleMaps')}</span>
              </a>
            </div>
          </section>

          <section className="rounded-xl border border-foreground/15 bg-white p-6 text-sm">
            <h2 className="text-base font-semibold">{t('listingInfo')}</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {employerPosted ? t('employerProvidedText') : t('sourcedProvidedText')}
            </p>
            <dl className="mt-4 space-y-2 border-t border-foreground/10 pt-4 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <dt>{t('firstSeen')}</dt>
                <dd className="font-mono text-foreground">
                  {new Date(job.firstSeenAt).toLocaleDateString(isDe ? 'de-DE' : 'en-US')}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>{t('lastVerified')}</dt>
                <dd className="font-mono text-foreground">
                  {new Date(job.lastVerifiedAt).toLocaleDateString(isDe ? 'de-DE' : 'en-US')}
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}

function DetailSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm leading-relaxed">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2.5">
            <span className="mt-1 grid size-4 shrink-0 place-items-center rounded-full bg-[#18221e] text-white">
              <Check className="size-2.5" />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
  emphasis = false,
}: {
  icon: any;
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="min-h-28 bg-white p-5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="size-3.5" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p
        className={`mt-3 leading-snug ${
          emphasis
            ? 'text-lg font-bold text-[#18221e]'
            : 'text-sm font-medium text-[#18221e]'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Definition({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
