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
} from 'lucide-react';
import { getGoogleMapsUrl } from '@/lib/domain/berlin-geo';
import { useTranslation } from '@/lib/i18n/language-context';
import { PlatformDisclaimer } from '@/components/platform-disclaimer';
import dynamic from 'next/dynamic';

const JobMap = dynamic(() => import('@/components/job-map').then((mod) => mod.JobMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-48 w-full items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-500">
      Berlin Karte lädt...
    </div>
  ),
});

export function JobDetailContent({ job }: { job: any }) {
  const { t, isDe } = useTranslation();
  const employerPosted = job.listingOrigin === 'employer_posted';

  const language =
    job.language === 'english_explicit'
      ? isDe ? 'Englisch ausreichend' : 'English accepted'
      : job.language === 'german_explicit'
      ? isDe ? 'Deutsch erforderlich' : 'German required'
      : job.language === 'german_and_english'
      ? isDe ? 'Deutsch und Englisch' : 'German and English'
      : isDe ? 'Nicht angegeben' : 'Not stated';

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
    <div className="mx-auto max-w-[1200px] px-5 py-8 md:px-10 md:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-950 transition-colors"
      >
        <ArrowLeft className="size-3.5" /> {t('backToAllJobs')}
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <header className="border-b border-zinc-100 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${
                  employerPosted
                    ? 'bg-zinc-950 text-white'
                    : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                }`}
              >
                {employerPosted ? t('postedByEmployer') : t('verifiedSource')}
              </span>
              {job.employmentForms?.map((form: string) => (
                <span
                  key={form}
                  className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 border border-zinc-200/60"
                >
                  {form}
                </span>
              ))}
              {job.isDemo ? (
                <span className="rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                  {t('sampleListing')}
                </span>
              ) : null}
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 md:text-5xl">
              {job.title}
            </h1>
            <p className="mt-2 text-base font-medium text-zinc-600">
              {job.company}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-700">
              {job.summary}
            </p>
          </header>

          <section className="grid gap-px bg-zinc-200/80 sm:grid-cols-2 lg:grid-cols-3">
            <Fact icon={Euro} label={t('pay')} value={payLabel} emphasis />
            <Fact icon={Clock3} label={t('hours')} value={hoursLabel} />
            <Fact icon={CalendarDays} label={t('schedule')} value={scheduleSummary} />
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
            <Fact icon={Languages} label={t('languageSignal')} value={language} />
          </section>

          <div className="space-y-8 p-6 md:p-8">
            <DetailSection title={t('whatYouWillDo')} items={job.responsibilities} />
            <DetailSection title={t('whatEmployerLooksFor')} items={job.requirements} />

            <section>
              <h2 className="text-base font-bold text-zinc-950">{t('workingTimeDetails')}</h2>
              <dl className="mt-3.5 grid gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50 p-4 sm:grid-cols-2">
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
              <h2 className="text-base font-bold text-zinc-950">{t('compensationDetails')}</h2>
              <dl className="mt-3.5 grid gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50 p-4 sm:grid-cols-2">
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

        <aside className="space-y-4">
          <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs">
            <h2 className="text-base font-bold text-zinc-950">{t('howToApply')}</h2>

            {job.application.method === 'url' && job.application.url ? (
              <div className="mt-4 space-y-2.5">
                <p className="text-xs text-zinc-500">
                  {t('applyByWebsitePrompt')}
                </p>
                <a
                  href={job.application.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-zinc-950 px-4 text-xs font-semibold text-white transition hover:bg-black"
                >
                  <span>{t('openEmployerWebsite')}</span>
                </a>
              </div>
            ) : null}

            {job.application.method === 'email' && job.application.email ? (
              <div className="mt-4 space-y-2.5">
                <p className="text-xs text-zinc-500">
                  {t('applyByEmailPrompt')}
                </p>
                <a
                  href={`mailto:${job.application.email}?subject=${encodeURIComponent(
                    `Application: ${job.title} via JOBROOFS`,
                  )}`}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-xs font-semibold text-white transition hover:bg-black"
                >
                  <Mail className="size-3.5" />
                  <span>{t('sendEmailApplication')}</span>
                </a>
              </div>
            ) : null}

            <dl className="mt-4 space-y-2.5 border-t border-zinc-100 pt-4 text-xs">
              <div>
                <dt className="text-[11px] font-medium text-zinc-500">
                  {t('instructions')}
                </dt>
                <dd className="mt-0.5 leading-relaxed text-zinc-800">
                  {job.application.instructions}
                </dd>
              </div>
              {job.application.deadline ? (
                <div>
                  <dt className="text-[11px] font-medium text-zinc-500">
                    {t('deadline')}
                  </dt>
                  <dd className="mt-0.5 font-medium text-zinc-800">{job.application.deadline}</dd>
                </div>
              ) : null}
              {job.application.contactName ? (
                <div>
                  <dt className="text-[11px] font-medium text-zinc-500">
                    {t('contactPerson')}
                  </dt>
                  <dd className="mt-0.5 font-medium text-zinc-800">{job.application.contactName}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          {/* Location & Map Card */}
          <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xs">
            <div className="p-4">
              <h2 className="text-sm font-bold text-zinc-950">{t('location')}</h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                {job.district ? `${job.district}, ` : ''}{job.postcode ? `${job.postcode} ` : ''}Berlin
              </p>
            </div>

            <div className="h-44 w-full border-t border-b border-zinc-100">
              <JobMap
                jobs={[job]}
                miniMode
                centerSingleJob
                showCardOverlay={false}
                className="h-full w-full"
              />
            </div>

            <div className="p-3 bg-zinc-50">
              <a
                href={getGoogleMapsUrl(job)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:underline"
              >
                <Navigation className="size-3 text-zinc-500" />
                <span>{t('openInGoogleMaps')}</span>
              </a>
            </div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-5 text-xs shadow-2xs">
            <h2 className="text-sm font-bold text-zinc-950">{t('listingInfo')}</h2>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              {employerPosted ? t('employerProvidedText') : t('sourcedProvidedText')}
            </p>
            <dl className="mt-3 space-y-1.5 border-t border-zinc-100 pt-3 text-[11px] text-zinc-500">
              <div className="flex justify-between">
                <dt>{t('firstSeen')}</dt>
                <dd className="font-mono text-zinc-800">
                  {new Date(job.firstSeenAt).toLocaleDateString(isDe ? 'de-DE' : 'en-US')}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>{t('lastVerified')}</dt>
                <dd className="font-mono text-zinc-800">
                  {new Date(job.lastVerifiedAt).toLocaleDateString(isDe ? 'de-DE' : 'en-US')}
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>

      <div className="mt-8">
        <PlatformDisclaimer type="jobs" />
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
      <h2 className="text-base font-bold text-zinc-950">{title}</h2>
      <ul className="mt-3 space-y-2 text-xs leading-relaxed text-zinc-700">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="mt-0.5 grid size-3.5 shrink-0 place-items-center rounded bg-zinc-950 text-white">
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
    <div className="bg-white p-4">
      <div className="flex items-center gap-1.5 text-zinc-400">
        <Icon className="size-3" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p
        className={`mt-2 leading-snug font-mono ${
          emphasis
            ? 'text-base font-bold text-zinc-950'
            : 'text-xs font-semibold text-zinc-800'
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
      <dt className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
        {label}
      </dt>
      <dd className="mt-0.5 text-xs font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}
