export type SourceKind = 'direct_employer' | 'specialist_board' | 'large_board';

export type ListingOrigin = 'employer_posted' | 'sourced';
export type ApplicationMethod = 'external_link' | 'email';
export type PayInterval =
  | 'hour'
  | 'shift'
  | 'day'
  | 'week'
  | 'month'
  | 'year'
  | 'project'
  | 'not_stated';
export type PayoutCadence =
  | 'weekly'
  | 'fortnightly'
  | 'monthly'
  | 'after_shift'
  | 'not_stated';

export type LanguageSignal =
  | 'english_explicit'
  | 'german_explicit'
  | 'german_and_english'
  | 'not_stated';

export type PreviewJob = {
  id: string;
  slug: string;
  title: string;
  company: string;
  district: string;
  postcode: string;
  industryId: string;
  roleFamilyId: string;
  employmentForms: string[];
  language: LanguageSignal;
  listingOrigin: ListingOrigin;
  compensation: {
    label: string;
    amountMin: number | null;
    amountMax: number | null;
    currency: 'EUR';
    rateInterval: PayInterval;
    payoutCadence: PayoutCadence;
    grossNet: 'gross' | 'net' | 'not_stated';
    extras: string | null;
  };
  hours: {
    label: string;
    minimum: number | null;
    maximum: number | null;
    period: 'week' | 'month' | 'shift' | 'not_stated';
  };
  schedule: {
    summary: string;
    workDays: string[];
    timeWindows: string[];
    startDate: string | null;
    endDate: string | null;
  };
  workplace: {
    type: 'on_site' | 'hybrid' | 'remote';
    address: string | null;
  };
  responsibilities: string[];
  requirements: string[];
  application: {
    method: ApplicationMethod;
    url: string | null;
    email: string | null;
    deadline: string | null;
    contactName: string | null;
    instructions: string;
  };
  firstSeenAt: string;
  sourceVerifiedAt: string;
  sourceKind: SourceKind;
  sourceName: string;
  sourceUrl: string;
  tags: string[];
  summary: string;
  evidenceNotes: string[];
  isDemo: true;
};
