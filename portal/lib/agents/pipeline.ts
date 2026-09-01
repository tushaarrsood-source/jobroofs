import { getD1 } from '@/db';
import { evaluatePublicationGate } from './filter';
import {
  canonicalizeUrl,
  isPublicHttpUrl,
  isSameSourceHost,
  scrapeApprovedJobPage,
  sha256,
} from './firecrawl';
import { extractJobWithGemini } from './gemini';
import { verifyExtractionGrounding } from './evidence';
import { putEvidenceSnapshot } from './evidence-store';
import { organizeExtractedJob } from './organizer';
import {
  findObservation,
  finishIngestionRun,
  getApprovedSource,
  startIngestionRun,
  touchObservation,
} from './repository';

type ExistingJob = {
  id: string;
  firstSeenAt: string;
  expiresAt: string;
  publicationState: string;
};

export async function processApprovedJobPage(input: {
  sourceId: string;
  nicheId: string;
  jobUrl: string;
  trigger?: 'scheduled' | 'manual' | 'webhook';
  maxAgeMs?: number;
  forceReextract?: boolean;
}) {
  const source = await getApprovedSource(input);
  const jobUrl = canonicalizeUrl(input.jobUrl);
  if (!isPublicHttpUrl(jobUrl)) throw new Error('SOURCE_URL_NOT_PUBLIC_HTTP');
  if (!isSameSourceHost(source.canonicalUrl, jobUrl))
    throw new Error('JOB_URL_OUTSIDE_APPROVED_SOURCE_HOST');

  const runId = await startIngestionRun({
    sourceId: source.id,
    nicheId: input.nicheId,
    agent: 'pipeline',
    trigger: input.trigger ?? 'manual',
  });

  try {
    const page = await scrapeApprovedJobPage({
      sourceUrl: jobUrl,
      crawlPolicy: source.crawlPolicy,
      maxAgeMs: input.maxAgeMs,
    });
    const objectKey = await putEvidenceSnapshot({
      schemaVersion: 'job-evidence.v1',
      sourceId: source.id,
      sourceUrl: page.sourceUrl,
      fetchedAt: page.fetchedAt,
      contentHash: page.contentHash,
      cacheState: page.cacheState,
      cachedAt: page.cachedAt,
      metadata: page.metadata as Record<string, unknown>,
      links: page.links,
      markdown: page.markdown,
    });

    let observation = await findObservation(page.sourceUrl, page.contentHash);
    if (observation) {
      await touchObservation(observation.id, {
        fetchedAt: page.fetchedAt,
        cacheState: page.cacheState,
        rawObjectKey: objectKey,
      });
    } else {
      const observationId = `obs_${(
        await sha256(`${page.sourceUrl}\u0000${page.contentHash}`)
      ).slice(0, 24)}`;
      await getD1()
        .prepare(
          `INSERT INTO observations
            (id, run_id, source_id, source_url, content_hash, fetched_at,
             raw_title, raw_body, raw_object_key, raw_metadata_json,
             cache_state, last_seen_at, seen_count)
           VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, 1)`,
        )
        .bind(
          observationId,
          runId,
          source.id,
          page.sourceUrl,
          page.contentHash,
          page.fetchedAt,
          readMetadataTitle(page.metadata),
          objectKey,
          JSON.stringify(page.metadata),
          page.cacheState,
          page.fetchedAt,
        )
        .run();
      observation = await findObservation(page.sourceUrl, page.contentHash);
    }
    if (!observation) throw new Error('OBSERVATION_PERSIST_FAILED');

    const canonicalKey = `sourced:${await sha256(page.sourceUrl)}`;
    const existingJob = await getD1()
      .prepare(
        `SELECT id, first_seen_at AS firstSeenAt, expires_at AS expiresAt,
                publication_state AS publicationState
         FROM jobs WHERE canonical_key = ? LIMIT 1`,
      )
      .bind(canonicalKey)
      .first<ExistingJob>();

    if (
      observation.extractionJson &&
      observation.groundingJson &&
      !input.forceReextract
    ) {
      if (existingJob) {
        const state =
          new Date(existingJob.expiresAt).getTime() <= Date.now()
            ? 'expired'
            : existingJob.publicationState;
        await getD1()
          .prepare(
            `UPDATE jobs
             SET last_verified_at = ?, publication_state = ?, updated_at = ?
             WHERE id = ?`,
          )
          .bind(page.fetchedAt, state, page.fetchedAt, existingJob.id)
          .run();
      }
      await markSourceSuccess(source.id, page.fetchedAt);
      await finishIngestionRun({
        runId,
        state: 'succeeded',
        discoveredCount: 1,
        acceptedCount: existingJob ? 1 : 0,
      });
      return {
        runId,
        state: 'unchanged' as const,
        observationId: observation.id,
        jobId: existingJob?.id ?? null,
      };
    }

    const extraction = await extractJobWithGemini({
      sourceUrl: page.sourceUrl,
      markdown: page.markdown,
    });
    const grounding = verifyExtractionGrounding(extraction, page.markdown);
    grounding.issues.push(...validateCriticalValues(extraction));
    grounding.valid = grounding.issues.length === 0;
    await getD1()
      .prepare(
        `UPDATE observations
         SET extraction_json = ?, grounding_json = ?
         WHERE id = ?`,
      )
      .bind(
        JSON.stringify(extraction),
        JSON.stringify(grounding),
        observation.id,
      )
      .run();

    if (!grounding.valid) {
      await markSourceSuccess(source.id, page.fetchedAt);
      await finishIngestionRun({
        runId,
        state: 'partial',
        discoveredCount: 1,
        rejectedCount: 1,
        exceptionCount: grounding.issues.length,
        errorCode: 'UNGROUNDED_EXTRACTION',
        errorDetail: grounding.issues.join(','),
      });
      return {
        runId,
        state: 'needs_review' as const,
        observationId: observation.id,
        jobId: null,
        reasons: grounding.issues,
      };
    }

    const firstSeenAt = existingJob?.firstSeenAt ?? page.fetchedAt;
    const organized = organizeExtractedJob({
      extraction,
      sourceUrl: page.sourceUrl,
      sourceId: source.id,
      fetchedAt: firstSeenAt,
      contentHash: page.contentHash,
    });
    const gate = evaluatePublicationGate(organized, new Date(), input.nicheId);

    if (!extraction.title.value || !extraction.company.value) {
      await markSourceSuccess(source.id, page.fetchedAt);
      await finishIngestionRun({
        runId,
        state: 'partial',
        discoveredCount: 1,
        rejectedCount: 1,
        errorCode: 'MISSING_JOB_IDENTITY',
        errorDetail: gate.reasons.join(','),
      });
      return {
        runId,
        state: 'needs_review' as const,
        observationId: observation.id,
        jobId: null,
        reasons: ['missing_job_identity', ...gate.reasons],
      };
    }

    const jobId = existingJob?.id ?? `job_${canonicalKey.slice(-24)}`;
    const application = normalizeApplication(extraction.application);
    const expiresAt =
      gate.expiresAt ??
      new Date(
        new Date(firstSeenAt).getTime() + 30 * 24 * 60 * 60 * 1000,
      ).toISOString();
    const publicationState =
      gate.state === 'rejected' ? 'suppressed' : gate.state;

    const jobRecord: Record<string, string | number | null> = {
      id: jobId,
      canonical_key: canonicalKey,
      listing_origin: 'sourced',
      employer_id: null,
      employer_submission_id: null,
      source_id: source.id,
      current_observation_id: observation.id,
      title: extraction.title.value,
      company: extraction.company.value,
      district: extraction.location.district,
      postcode: extraction.location.postcode,
      street_address: null,
      workplace_type: 'on_site',
      location_evidence: extraction.location.evidence,
      role_family_id: organized.roleFamilyId,
      employment_forms_json: JSON.stringify(
        organized.normalizedEmploymentForms,
      ),
      work_condition_tags_json: JSON.stringify(organized.conditionTags),
      responsibilities_json: JSON.stringify(extraction.responsibilities.values),
      requirements_json: JSON.stringify(extraction.requirements.values),
      hours_minimum: extraction.workingTime.hoursMinimum,
      hours_maximum: extraction.workingTime.hoursMaximum,
      hours_period: extraction.workingTime.hoursPeriod,
      hours_label: formatHours(extraction.workingTime),
      schedule_summary: extraction.workingTime.scheduleSummary ?? 'Not stated',
      work_days_json: JSON.stringify(extraction.workingTime.workDays),
      time_windows_json: JSON.stringify(extraction.workingTime.timeWindows),
      start_date_text: extraction.workingTime.startDate,
      end_date_text: extraction.workingTime.endDate,
      language_signal: gate.languageSignal,
      language_evidence: extraction.languageRequirements.evidence,
      pay_text: formatPay(extraction.compensation),
      pay_evidence: extraction.compensation.evidence,
      compensation_amount_minimum: extraction.compensation.amountMinimum,
      compensation_amount_maximum: extraction.compensation.amountMaximum,
      compensation_currency: extraction.compensation.currency ?? 'EUR',
      compensation_rate_interval: extraction.compensation.rateInterval,
      payout_cadence: extraction.compensation.payoutCadence,
      compensation_gross_net: extraction.compensation.grossNet,
      compensation_extras: extraction.compensation.extras,
      application_method: application.method,
      application_url: application.url,
      application_email: application.email,
      application_deadline:
        extraction.application.deadline ?? extraction.applicationDeadline.value,
      application_contact_name: null,
      application_instructions:
        extraction.application.instructions ??
        (application.method === 'not_stated'
          ? 'Application details require review.'
          : 'Apply through the destination stated by the employer.'),
      source_published_at: extraction.publishedAt.value,
      first_seen_at: firstSeenAt,
      last_verified_at: page.fetchedAt,
      expires_at: expiresAt,
      publication_state: publicationState,
      rejection_code: gate.reasons.join(',') || null,
      updated_at: page.fetchedAt,
    };
    await upsertJob(jobRecord);

    await getD1()
      .prepare('DELETE FROM job_niches WHERE job_id = ?')
      .bind(jobId)
      .run();
    if (organized.primaryIndustryId && organized.industryEvidence) {
      await getD1()
        .prepare(
          `INSERT INTO job_niches (job_id, niche_id, is_primary, evidence)
           VALUES (?, ?, 1, ?)`
        )
        .bind(jobId, organized.primaryIndustryId, organized.industryEvidence)
        .run();
    }

    if (organized.secondaryIndustries && organized.secondaryIndustries.length > 0) {
      for (const secondary of organized.secondaryIndustries) {
        await getD1()
          .prepare(
            `INSERT INTO job_niches (job_id, niche_id, is_primary, evidence)
             VALUES (?, ?, 0, ?)`
          )
          .bind(jobId, secondary.id, secondary.evidence)
          .run();
      }
    }

    await getD1()
      .prepare(
        'DELETE FROM field_evidence WHERE job_id = ? AND observation_id = ?',
      )
      .bind(jobId, observation.id)
      .run();
    if (grounding.evidence.length > 0) {
      await getD1().batch(
        grounding.evidence.map((item) =>
          getD1()
            .prepare(
              `INSERT INTO field_evidence
                (id, job_id, observation_id, employer_submission_id,
                 field_name, verbatim_evidence, evidence_locator,
                 extraction_method, reviewed)
               VALUES (?, ?, ?, NULL, ?, ?, ?, 'model', 0)`,
            )
            .bind(
              crypto.randomUUID(),
              jobId,
              observation.id,
              item.fieldName,
              item.quote,
              item.locator,
            ),
        ),
      );
    }

    await getD1()
      .prepare(
        `INSERT INTO audit_events
          (id, entity_type, entity_id, actor_type, actor_id, action,
           reason, before_json, after_json)
         VALUES (?, 'job', ?, 'agent', ?, ?, ?, ?, ?)`,
      )
      .bind(
        crypto.randomUUID(),
        jobId,
        `niche:${input.nicheId}`,
        existingJob ? 'job_reconciled' : 'job_created',
        `${gate.state}:${gate.reasons.join(',') || 'all_gates_passed'}`,
        existingJob ? JSON.stringify(existingJob) : null,
        JSON.stringify(jobRecord),
      )
      .run();

    await markSourceSuccess(source.id, page.fetchedAt);
    await finishIngestionRun({
      runId,
      state: gate.state === 'publishable' ? 'succeeded' : 'partial',
      discoveredCount: 1,
      acceptedCount: gate.state === 'publishable' ? 1 : 0,
      rejectedCount: gate.state === 'rejected' ? 1 : 0,
      exceptionCount: gate.state === 'needs_review' ? gate.reasons.length : 0,
    });
    return {
      runId,
      state: gate.state,
      observationId: observation.id,
      jobId,
      reasons: gate.reasons,
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    await markSourceFailure(source.id);
    await finishIngestionRun({
      runId,
      state: 'failed',
      exceptionCount: 1,
      errorCode: detail.split(':')[0],
      errorDetail: detail,
    });
    throw error;
  }
}

async function upsertJob(record: Record<string, string | number | null>) {
  const columns = Object.keys(record);
  const values = columns.map((column) => record[column]);
  const updates = columns
    .filter(
      (column) => !['id', 'canonical_key', 'first_seen_at'].includes(column),
    )
    .map((column) => `${column} = excluded.${column}`)
    .join(', ');
  const statement = `INSERT INTO jobs (${columns.join(', ')})
    VALUES (${columns.map(() => '?').join(', ')})
    ON CONFLICT(canonical_key) DO UPDATE SET ${updates}`;
  await getD1()
    .prepare(statement)
    .bind(...values)
    .run();
}

function normalizeApplication(application: {
  url: string | null;
  email: string | null;
}) {
  if (application.url && isPublicHttpUrl(application.url))
    return {
      method: 'external_link' as const,
      url: application.url,
      email: null,
    };
  if (application.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email))
    return { method: 'email' as const, url: null, email: application.email };
  return { method: 'not_stated' as const, url: null, email: null };
}

function validateCriticalValues(extraction: {
  compensation: { amountMinimum: number | null; amountMaximum: number | null };
  workingTime: { hoursMinimum: number | null; hoursMaximum: number | null };
  application: { url: string | null; email: string | null };
}) {
  const issues: string[] = [];
  if (
    extraction.compensation.amountMinimum !== null &&
    extraction.compensation.amountMaximum !== null &&
    extraction.compensation.amountMaximum <
      extraction.compensation.amountMinimum
  )
    issues.push('compensation:invalid_range');
  if (
    extraction.workingTime.hoursMinimum !== null &&
    extraction.workingTime.hoursMaximum !== null &&
    extraction.workingTime.hoursMaximum < extraction.workingTime.hoursMinimum
  )
    issues.push('working_time:invalid_range');
  if (
    extraction.application.url &&
    !isPublicHttpUrl(extraction.application.url)
  )
    issues.push('application:invalid_url');
  if (
    extraction.application.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(extraction.application.email)
  )
    issues.push('application:invalid_email');
  return issues;
}

function formatPay(compensation: {
  amountMinimum: number | null;
  amountMaximum: number | null;
  currency: string | null;
  rateInterval: string;
  grossNet: string;
}) {
  if (
    compensation.amountMinimum === null &&
    compensation.amountMaximum === null
  )
    return null;
  const amount =
    compensation.amountMinimum === compensation.amountMaximum
      ? `${compensation.amountMinimum}`
      : [compensation.amountMinimum, compensation.amountMaximum]
          .filter((value) => value !== null)
          .join('–');
  const interval =
    compensation.rateInterval === 'not_stated'
      ? ''
      : ` / ${compensation.rateInterval}`;
  const grossNet =
    compensation.grossNet === 'not_stated' ? '' : ` ${compensation.grossNet}`;
  return `${amount} ${compensation.currency ?? 'EUR'}${interval}${grossNet}`;
}

function formatHours(workingTime: {
  hoursMinimum: number | null;
  hoursMaximum: number | null;
  hoursPeriod: string;
}) {
  if (workingTime.hoursMinimum === null && workingTime.hoursMaximum === null)
    return 'Not stated';
  const amount =
    workingTime.hoursMinimum === workingTime.hoursMaximum
      ? `${workingTime.hoursMinimum}`
      : [workingTime.hoursMinimum, workingTime.hoursMaximum]
          .filter((value) => value !== null)
          .join('–');
  return `${amount} hours / ${workingTime.hoursPeriod}`;
}

function readMetadataTitle(metadata: unknown) {
  if (!metadata || typeof metadata !== 'object') return null;
  const title = (metadata as Record<string, unknown>).title;
  return typeof title === 'string' ? title : null;
}

async function markSourceSuccess(sourceId: string, checkedAt: string) {
  await getD1()
    .prepare(
      `UPDATE sources
       SET last_checked_at = ?, last_successful_at = ?, consecutive_failures = 0,
           updated_at = ?
       WHERE id = ?`,
    )
    .bind(checkedAt, checkedAt, checkedAt, sourceId)
    .run();
}

async function markSourceFailure(sourceId: string) {
  const now = new Date().toISOString();
  await getD1()
    .prepare(
      `UPDATE sources
       SET last_checked_at = ?, consecutive_failures = consecutive_failures + 1,
           updated_at = ?
       WHERE id = ?`,
    )
    .bind(now, now, sourceId)
    .run();
}
