import {
  organizedJobSchema,
  type ExtractedJob,
  type OrganizedJob,
} from './contracts';
import { workConditionTags } from '@/lib/domain/taxonomy';

type ConditionTag = (typeof workConditionTags)[number];

export function organizeExtractedJob(input: {
  extraction: ExtractedJob;
  sourceUrl: string;
  sourceId: string;
  fetchedAt: string;
  contentHash: string;
}): OrganizedJob {
  const { extraction } = input;
  return organizedJobSchema.parse({
    ...input,
    primaryIndustryId: extraction.classification.primaryIndustryId,
    industryEvidence: extraction.classification.industryEvidence,
    roleFamilyId: extraction.classification.roleFamilyId,
    roleEvidence: extraction.classification.roleEvidence,
    normalizedEmploymentForms: extraction.employmentForms.values,
    conditionTags: deriveConditionTags(extraction),
  });
}

function deriveConditionTags(extraction: ExtractedJob): ConditionTag[] {
  const tags = new Set<ConditionTag>();
  const schedule = [
    extraction.workingTime.scheduleSummary,
    ...extraction.workingTime.workDays,
    ...extraction.workingTime.timeWindows,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  const pageSignals = [
    extraction.workingTime.evidence,
    extraction.compensation.evidence,
    extraction.requirements.evidence,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (/samstag|sonntag|wochenende|weekend/.test(schedule)) tags.add('Weekend');
  if (/abend|evening|spät/.test(schedule)) tags.add('Evening');
  if (/nacht|night/.test(schedule)) tags.add('Night shift');
  if (
    /ab sofort|sofortiger|immediate start|start immediately/.test(pageSignals)
  )
    tags.add('Immediate start');
  if (extraction.languageRequirements.german === 'not_stated')
    tags.add('No German stated');
  if (extraction.languageRequirements.english === 'explicit')
    tags.add('English explicitly accepted');
  if (
    extraction.compensation.amountMinimum !== null ||
    extraction.compensation.amountMaximum !== null
  )
    tags.add('Pay stated');
  if (/trinkgeld|tips?/.test(pageSignals)) tags.add('Tips mentioned');
  if (/student|studierende|werkstudent/.test(pageSignals))
    tags.add('Student-friendly');
  if (/schicht.*wähl|choose.*shift|flexible schicht/.test(pageSignals))
    tags.add('Shift choice');
  if (
    /barrierefrei|accessible workplace|wheelchair accessible/.test(pageSignals)
  )
    tags.add('Accessible workplace stated');

  return [...tags];
}
