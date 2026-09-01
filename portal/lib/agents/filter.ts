import type { GateDecision, OrganizedJob } from './contracts';

const MAX_LISTING_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const BERLIN_POSTCODE = /^1\d{4}$/;

export function evaluatePublicationGate(
  job: OrganizedJob,
  now = new Date(),
  expectedNicheId?: string,
): GateDecision {
  const reasons: string[] = [];
  const reviewReasons: string[] = [];
  const { extraction } = job;

  if (!extraction.title.value || !extraction.title.evidence)
    reasons.push('missing_title_evidence');
  if (!extraction.company.value || !extraction.company.evidence)
    reasons.push('missing_company_evidence');
  if (!extraction.location.evidence) reasons.push('missing_location_evidence');

  const berlinByCity =
    extraction.location.city?.trim().toLowerCase() === 'berlin';
  const berlinByPostcode = Boolean(
    extraction.location.postcode &&
    BERLIN_POSTCODE.test(extraction.location.postcode),
  );
  if (!berlinByCity && !berlinByPostcode) reasons.push('not_proven_berlin');

  if (
    job.normalizedEmploymentForms.length === 0 ||
    !extraction.employmentForms.evidence
  ) {
    reasons.push('flexible_employment_not_proven');
  }

  const publishedDate = parseDate(extraction.publishedAt.value);
  if (extraction.publishedAt.value && !publishedDate)
    reviewReasons.push('unparseable_published_date');
  if (
    publishedDate &&
    now.getTime() - publishedDate.getTime() > MAX_LISTING_AGE_MS
  )
    reasons.push('older_than_30_days');
  if (
    publishedDate &&
    publishedDate.getTime() - now.getTime() > 24 * 60 * 60 * 1000
  )
    reviewReasons.push('published_date_in_future');
  if (!publishedDate) reviewReasons.push('source_publish_date_not_stated');

  if (
    extraction.compensation.amountMinimum === null &&
    extraction.compensation.amountMaximum === null &&
    !extraction.compensation.evidence
  ) {
    reviewReasons.push('pay_not_stated');
  }
  if (
    extraction.workingTime.hoursMinimum === null &&
    extraction.workingTime.hoursMaximum === null &&
    !extraction.workingTime.scheduleSummary
  ) {
    reviewReasons.push('working_time_not_stated');
  }
  if (!extraction.application.url && !extraction.application.email) {
    reviewReasons.push('application_destination_not_extracted');
  }

  if (!job.primaryIndustryId || !job.industryEvidence?.trim())
    reasons.push('missing_industry_evidence');
  if (!job.roleFamilyId || !job.roleEvidence?.trim())
    reasons.push('missing_role_evidence');
  const allNiches = [job.primaryIndustryId, ...(job.secondaryIndustries?.map(s => s.id) || [])];
  if (
    expectedNicheId &&
    job.primaryIndustryId &&
    !allNiches.includes(expectedNicheId as any)
  )
    reviewReasons.push('niche_agent_mismatch');

  const { german, english, evidence } = extraction.languageRequirements;
  if ((german === 'explicit' || english === 'explicit') && !evidence)
    reasons.push('language_claim_without_evidence');
  const languageSignal =
    german === 'explicit' && english === 'explicit'
      ? 'german_and_english'
      : german === 'explicit'
        ? 'german_explicit'
        : english === 'explicit'
          ? 'english_explicit'
          : 'not_stated';

  const firstSeen = new Date(job.fetchedAt);
  const ageBasis = publishedDate ?? firstSeen;
  const expiresAt = Number.isNaN(ageBasis.getTime())
    ? null
    : new Date(ageBasis.getTime() + MAX_LISTING_AGE_MS).toISOString();

  if (reasons.length > 0)
    return { state: 'rejected', reasons, languageSignal, expiresAt };
  if (reviewReasons.length > 0)
    return {
      state: 'needs_review',
      reasons: reviewReasons,
      languageSignal,
      expiresAt,
    };
  return { state: 'publishable', reasons: [], languageSignal, expiresAt };
}

function parseDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
