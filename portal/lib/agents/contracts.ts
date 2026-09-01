import { z } from 'zod';
import {
  employmentForms,
  industryNiches,
  roleFamilies,
  workConditionTags,
} from '@/lib/domain/taxonomy';

const evidenceValue = z.object({
  value: z.string().nullable(),
  evidence: z.string().nullable(),
});

const evidenceList = z.object({
  values: z.array(z.string()),
  evidence: z.string().nullable(),
});

const industryIds = industryNiches.map((item) => item.id) as [
  string,
  ...string[],
];
const roleIds = roleFamilies.map(([id]) => id) as [string, ...string[]];
const employmentFormIds = employmentForms.map(([id]) => id) as [
  string,
  ...string[],
];
const conditionTagIds = workConditionTags as unknown as [string, ...string[]];

export const extractedJobSchema = z.object({
  title: evidenceValue,
  company: evidenceValue,
  location: z.object({
    city: z.string().nullable(),
    district: z.string().nullable(),
    postcode: z.string().nullable(),
    evidence: z.string().nullable(),
  }),
  employmentForms: z.object({
    values: z.array(z.enum(employmentFormIds)),
    evidence: z.string().nullable(),
  }),
  languageRequirements: z.object({
    german: z.enum(['explicit', 'not_stated']),
    english: z.enum(['explicit', 'not_stated']),
    evidence: z.string().nullable(),
  }),
  compensation: z.object({
    amountMinimum: z.number().nullable(),
    amountMaximum: z.number().nullable(),
    currency: z.string().nullable(),
    rateInterval: z.enum([
      'hour',
      'shift',
      'day',
      'week',
      'month',
      'year',
      'project',
      'not_stated',
    ]),
    payoutCadence: z.enum([
      'weekly',
      'fortnightly',
      'monthly',
      'after_shift',
      'not_stated',
    ]),
    grossNet: z.enum(['gross', 'net', 'not_stated']),
    extras: z.string().nullable(),
    evidence: z.string().nullable(),
  }),
  workingTime: z.object({
    hoursMinimum: z.number().nullable(),
    hoursMaximum: z.number().nullable(),
    hoursPeriod: z.enum(['week', 'month', 'shift', 'not_stated']),
    scheduleSummary: z.string().nullable(),
    workDays: z.array(z.string()),
    timeWindows: z.array(z.string()),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    evidence: z.string().nullable(),
  }),
  responsibilities: evidenceList,
  requirements: evidenceList,
  application: z.object({
    url: z.string().nullable(),
    email: z.string().nullable(),
    deadline: z.string().nullable(),
    instructions: z.string().nullable(),
    evidence: z.string().nullable(),
  }),
  publishedAt: evidenceValue,
  applicationDeadline: evidenceValue,
  description: evidenceValue,
  sourceJobId: z.string().nullable(),
  classification: z.object({
    primaryIndustryId: z.enum(industryIds).nullable(),
    industryEvidence: z.string().nullable(),
    secondaryIndustries: z.array(z.object({
      id: z.enum(industryIds),
      evidence: z.string()
    })).max(2).optional(),
    roleFamilyId: z.enum(roleIds).nullable(),
    roleEvidence: z.string().nullable(),
  }),
});

export type ExtractedJob = z.infer<typeof extractedJobSchema>;

export const organizedJobSchema = z.object({
  extraction: extractedJobSchema,
  sourceUrl: z.url(),
  sourceId: z.string().min(1),
  fetchedAt: z.iso.datetime(),
  contentHash: z.string().min(8),
  primaryIndustryId: z.enum(industryIds).nullable(),
  industryEvidence: z.string().nullable(),
  secondaryIndustries: z.array(z.object({
    id: z.enum(industryIds),
    evidence: z.string()
  })).max(2).optional(),
  roleFamilyId: z.enum(roleIds).nullable(),
  roleEvidence: z.string().nullable(),
  normalizedEmploymentForms: z.array(z.enum(employmentFormIds)),
  conditionTags: z.array(z.enum(conditionTagIds)),
});

export type OrganizedJob = z.infer<typeof organizedJobSchema>;

export type GateDecision = {
  state: 'publishable' | 'needs_review' | 'rejected';
  reasons: string[];
  languageSignal:
    | 'english_explicit'
    | 'german_explicit'
    | 'german_and_english'
    | 'not_stated';
  expiresAt: string | null;
};
