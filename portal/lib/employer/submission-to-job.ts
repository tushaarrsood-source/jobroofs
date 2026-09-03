import { hashCode } from "./verification-store";
import { formatVerbatimPointers } from "@/lib/domain/text-format";

export async function convertSubmissionToJob(
  submission: any,
  employerId: string,
) {
  const payload = typeof submission.payloadJson === 'string' 
    ? JSON.parse(submission.payloadJson) 
    : (submission.payloadJson || {});
  const jobId = crypto.randomUUID();

  // Create a canonical key from domain/company and title hash
  const titleHash = await hashCode(payload.title || "untitled");
  const companySlug = (payload.company || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  const canonicalKey = `${companySlug}-${titleHash.substring(0, 10)}`;

  const now = new Date().toISOString();
  const expiresAt = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  ).toISOString();

  // Normalize responsibilities & requirements (convert paragraphs/lists into clean verbatim pointers)
  const responsibilities = formatVerbatimPointers(payload.responsibilities);
  const requirements = formatVerbatimPointers(payload.requirements);

  // Normalize compensation
  const minAmount = payload.amountMinimum !== undefined && payload.amountMinimum !== ''
    ? parseFloat(payload.amountMinimum)
    : (payload.compensationAmountMinimum !== undefined && payload.compensationAmountMinimum !== ''
      ? parseFloat(payload.compensationAmountMinimum)
      : null);

  const maxAmount = payload.amountMaximum !== undefined && payload.amountMaximum !== ''
    ? parseFloat(payload.amountMaximum)
    : (payload.compensationAmountMaximum !== undefined && payload.compensationAmountMaximum !== ''
      ? parseFloat(payload.compensationAmountMaximum)
      : null);

  const rateInterval = payload.rateInterval || payload.compensationRateInterval || "hour";
  const grossNet = payload.grossNet || payload.compensationGrossNet || "gross";
  const payoutCadence = payload.payoutCadence || "monthly";

  let payText = payload.payText;
  if (!payText && minAmount !== null) {
    const formattedMin = `€${minAmount.toFixed(2)}`;
    const formattedMax = maxAmount !== null && maxAmount > minAmount ? `–€${maxAmount.toFixed(2)}` : '';
    payText = `${formattedMin}${formattedMax} / ${rateInterval} (${grossNet})`;
  }

  // Normalize hours
  const minHours = payload.hoursMinimum !== undefined && payload.hoursMinimum !== ''
    ? parseFloat(payload.hoursMinimum)
    : null;
  const maxHours = payload.hoursMaximum !== undefined && payload.hoursMaximum !== ''
    ? parseFloat(payload.hoursMaximum)
    : null;
  const hoursPeriod = payload.hoursPeriod || "week";

  let hoursLabel = payload.hoursLabel;
  if (!hoursLabel) {
    if (minHours !== null && maxHours !== null && maxHours > minHours) {
      hoursLabel = `${minHours}–${maxHours} hrs / ${hoursPeriod}`;
    } else if (minHours !== null) {
      hoursLabel = `${minHours} hrs / ${hoursPeriod}`;
    } else {
      hoursLabel = "Flexible hours";
    }
  }

  const workingDays = payload.workingDays ? [payload.workingDays] : (payload.workDays || []);
  const workingTimes = payload.workingTimes ? [payload.workingTimes] : (payload.timeWindows || []);
  
  let scheduleSummary = payload.scheduleSummary;
  if (!scheduleSummary) {
    const parts = [];
    if (payload.workingDays) parts.push(payload.workingDays);
    if (payload.workingTimes) parts.push(payload.workingTimes);
    scheduleSummary = parts.length > 0 ? parts.join(', ') : "Flexible shifts";
  }

  // Employment forms
  let employmentForms = payload.employmentForms || [];
  if (payload.employmentType) {
    employmentForms = [payload.employmentType];
  }

  // Application Method
  const applicationMethod = payload.applicationMethod || "email";
  const applicationEmail =
    applicationMethod === "email"
      ? (payload.applicationEmail ||
        payload.submitterEmail ||
        submission.submitter_email ||
        submission.submitterEmail ||
        "bewerbung@kiezjob.de")
      : null;
  const applicationUrl = applicationMethod === "external_link" ? (payload.applicationUrl || null) : null;

  const job = {
    id: jobId,
    canonicalKey,
    listingOrigin: "employer_posted",
    employerId,
    employerSubmissionId: submission.id,
    title: payload.title || "Flexible Role",
    company: payload.company || "Direct Employer",
    district: payload.district || "Berlin",
    postcode: payload.postcode || null,
    streetAddress: payload.streetAddress || null,
    workplaceType: payload.workplaceType || "on_site",

    employmentFormsJson: JSON.stringify(employmentForms),
    workConditionTagsJson: JSON.stringify(payload.workConditionTags || []),
    responsibilitiesJson: JSON.stringify(responsibilities),
    requirementsJson: JSON.stringify(requirements),

    hoursMinimum: minHours,
    hoursMaximum: maxHours,
    hoursPeriod: hoursPeriod,
    hoursLabel: hoursLabel,
    scheduleSummary: scheduleSummary,
    workDaysJson: JSON.stringify(workingDays),
    timeWindowsJson: JSON.stringify(workingTimes),

    startDateText: payload.startDate || payload.startDateText || null,
    endDateText: payload.endDate || payload.endDateText || null,

    languageSignal: payload.languageSignal || "not_stated",

    payText: payText,
    compensationAmountMinimum: minAmount,
    compensationAmountMaximum: maxAmount,
    compensationCurrency: payload.compensationCurrency || "EUR",
    compensationRateInterval: rateInterval,
    payoutCadence: payoutCadence,
    compensationGrossNet: grossNet,
    compensationExtras: payload.extras || payload.compensationExtras || null,

    applicationMethod: applicationMethod,
    applicationUrl: applicationUrl,
    applicationEmail: applicationEmail,
    applicationDeadline: payload.applicationDeadline || null,
    applicationContactName: payload.applicationContactName || null,
    applicationInstructions:
      payload.applicationInstructions || (applicationMethod === "email" ? "Send your application by email." : "Apply directly on company website."),

    firstSeenAt: now,
    lastVerifiedAt: now,
    expiresAt: expiresAt,
    publicationState: "published",
  };

  // Niches
  let nicheIds: string[] = [];
  if (Array.isArray(payload.niches)) {
    nicheIds = payload.niches;
  } else if (typeof payload.niches === 'string') {
    try {
      nicheIds = JSON.parse(payload.niches);
    } catch {
      nicheIds = [payload.niches];
    }
  } else if (Array.isArray(payload.nicheIds)) {
    nicheIds = payload.nicheIds;
  }

  return { job, nicheIds };
}

