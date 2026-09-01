import type { ExtractedJob } from './contracts';

export type VerifiedEvidence = {
  fieldName: string;
  quote: string;
  locator: string;
};

export type GroundingResult = {
  valid: boolean;
  issues: string[];
  evidence: VerifiedEvidence[];
};

export function verifyExtractionGrounding(
  extraction: ExtractedJob,
  markdown: string,
): GroundingResult {
  const issues: string[] = [];
  const verified: VerifiedEvidence[] = [];

  const inspect = (input: {
    fieldName: string;
    populated: boolean;
    evidence: string | null;
    exactValueHints?: Array<string | null>;
  }) => {
    const evidence = input.evidence?.trim() || null;
    if (input.populated && !evidence) {
      issues.push(`${input.fieldName}:missing_evidence`);
      return;
    }
    if (!input.populated && evidence) {
      issues.push(`${input.fieldName}:orphan_evidence`);
      return;
    }
    if (!evidence) return;
    if (evidence.length > 900) {
      issues.push(`${input.fieldName}:evidence_too_long`);
      return;
    }

    const locator = locateVerbatimEvidence(markdown, evidence);
    if (!locator) {
      issues.push(`${input.fieldName}:quote_not_found`);
      return;
    }

    for (const hint of input.exactValueHints ?? []) {
      if (!hint) continue;
      if (!normalize(evidence).includes(normalize(hint))) {
        issues.push(`${input.fieldName}:value_not_in_quote`);
        return;
      }
    }

    verified.push({ fieldName: input.fieldName, quote: evidence, locator });
  };

  inspect({
    fieldName: 'title',
    populated: Boolean(extraction.title.value),
    evidence: extraction.title.evidence,
    exactValueHints: [extraction.title.value],
  });
  inspect({
    fieldName: 'company',
    populated: Boolean(extraction.company.value),
    evidence: extraction.company.evidence,
    exactValueHints: [extraction.company.value],
  });
  inspect({
    fieldName: 'location',
    populated: Boolean(
      extraction.location.city ||
      extraction.location.district ||
      extraction.location.postcode,
    ),
    evidence: extraction.location.evidence,
    exactValueHints: [extraction.location.postcode],
  });
  inspect({
    fieldName: 'employment_forms',
    populated: extraction.employmentForms.values.length > 0,
    evidence: extraction.employmentForms.evidence,
  });
  inspect({
    fieldName: 'languages',
    populated:
      extraction.languageRequirements.german === 'explicit' ||
      extraction.languageRequirements.english === 'explicit',
    evidence: extraction.languageRequirements.evidence,
  });
  inspect({
    fieldName: 'compensation',
    populated:
      extraction.compensation.amountMinimum !== null ||
      extraction.compensation.amountMaximum !== null ||
      extraction.compensation.rateInterval !== 'not_stated' ||
      extraction.compensation.payoutCadence !== 'not_stated' ||
      extraction.compensation.grossNet !== 'not_stated' ||
      Boolean(extraction.compensation.extras),
    evidence: extraction.compensation.evidence,
  });
  inspect({
    fieldName: 'working_time',
    populated:
      extraction.workingTime.hoursMinimum !== null ||
      extraction.workingTime.hoursMaximum !== null ||
      extraction.workingTime.hoursPeriod !== 'not_stated' ||
      Boolean(extraction.workingTime.scheduleSummary) ||
      extraction.workingTime.workDays.length > 0 ||
      extraction.workingTime.timeWindows.length > 0 ||
      Boolean(extraction.workingTime.startDate) ||
      Boolean(extraction.workingTime.endDate),
    evidence: extraction.workingTime.evidence,
  });
  inspect({
    fieldName: 'responsibilities',
    populated: extraction.responsibilities.values.length > 0,
    evidence: extraction.responsibilities.evidence,
  });
  inspect({
    fieldName: 'requirements',
    populated: extraction.requirements.values.length > 0,
    evidence: extraction.requirements.evidence,
  });
  inspect({
    fieldName: 'application',
    populated: Boolean(
      extraction.application.url ||
      extraction.application.email ||
      extraction.application.deadline ||
      extraction.application.instructions,
    ),
    evidence: extraction.application.evidence,
    exactValueHints: [extraction.application.email],
  });
  inspect({
    fieldName: 'published_at',
    populated: Boolean(extraction.publishedAt.value),
    evidence: extraction.publishedAt.evidence,
  });
  inspect({
    fieldName: 'application_deadline',
    populated: Boolean(extraction.applicationDeadline.value),
    evidence: extraction.applicationDeadline.evidence,
  });
  inspect({
    fieldName: 'description',
    populated: Boolean(extraction.description.value),
    evidence: extraction.description.evidence,
  });
  inspect({
    fieldName: 'industry_classification',
    populated: Boolean(extraction.classification.primaryIndustryId),
    evidence: extraction.classification.industryEvidence,
  });
  inspect({
    fieldName: 'role_classification',
    populated: Boolean(extraction.classification.roleFamilyId),
    evidence: extraction.classification.roleEvidence,
  });

  return { valid: issues.length === 0, issues, evidence: verified };
}

export function locateVerbatimEvidence(markdown: string, quote: string) {
  const source = normalizeWithOffsets(markdown);
  const needle = normalize(quote);
  if (!needle) return null;
  const start = source.text.indexOf(needle);
  if (start < 0) return null;
  const end = start + needle.length - 1;
  const sourceStart = source.offsets[start] ?? 0;
  const sourceEnd = source.offsets[end] ?? sourceStart;
  const lineStart = 1 + countNewlines(markdown, sourceStart);
  const lineEnd = 1 + countNewlines(markdown, sourceEnd);
  return lineStart === lineEnd
    ? `markdown:L${lineStart}`
    : `markdown:L${lineStart}-L${lineEnd}`;
}

function normalize(value: string) {
  return value.normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
}

function normalizeWithOffsets(value: string) {
  let text = '';
  const offsets: number[] = [];
  let pendingSpaceOffset: number | null = null;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (/\s/.test(character)) {
      if (text && !text.endsWith(' ') && pendingSpaceOffset === null)
        pendingSpaceOffset = index;
      continue;
    }
    if (pendingSpaceOffset !== null) {
      text += ' ';
      offsets.push(pendingSpaceOffset);
      pendingSpaceOffset = null;
    }
    const normalized = character.normalize('NFKC').toLowerCase();
    text += normalized;
    for (let part = 0; part < normalized.length; part += 1) offsets.push(index);
  }

  return { text: text.trim(), offsets };
}

function countNewlines(value: string, end: number) {
  let count = 0;
  for (let index = 0; index < end; index += 1) {
    if (value[index] === '\n') count += 1;
  }
  return count;
}
