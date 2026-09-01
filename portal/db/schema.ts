import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const niches = sqliteTable("niches", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  labelDe: text("label_de").notNull(),
  description: text("description").notNull(),
  sourceTarget: integer("source_target").notNull().default(0),
  priority: text("priority", { enum: ["launch", "expand", "watch"] }).notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const roleFamilies = sqliteTable("role_families", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const sources = sqliteTable(
  "sources",
  {
    id: text("id").primaryKey(),
    canonicalUrl: text("canonical_url").notNull(),
    name: text("name").notNull(),
    sourceKind: text("source_kind", {
      enum: [
        "unclassified",
        "direct_employer",
        "specialist_board",
        "large_board",
      ],
    }).notNull(),
    discoveryMethod: text("discovery_method").notNull(),
    crawlPolicy: text("crawl_policy", {
      enum: ["approved", "review_required", "blocked"],
    })
      .notNull()
      .default("review_required"),
    robotsObservedAt: text("robots_observed_at"),
    termsReviewedAt: text("terms_reviewed_at"),
    adapterKey: text("adapter_key"),
    etag: text("etag"),
    lastModifiedHeader: text("last_modified_header"),
    sourceFormat: text("source_format", {
      enum: ["ats_json", "sitemap", "rss", "html", "pdf"],
    })
      .notNull()
      .default("html"),
    checkIntervalMinutes: integer("check_interval_minutes")
      .notNull()
      .default(1440),
    lastCheckedAt: text("last_checked_at"),
    lastSuccessfulAt: text("last_successful_at"),
    consecutiveFailures: integer("consecutive_failures").notNull().default(0),
    active: integer("active", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("sources_canonical_url_unique").on(table.canonicalUrl),
    index("sources_kind_idx").on(table.sourceKind),
    index("sources_policy_active_idx").on(table.crawlPolicy, table.active),
  ],
);

export const sourceNiches = sqliteTable(
  "source_niches",
  {
    sourceId: text("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
    nicheId: text("niche_id")
      .notNull()
      .references(() => niches.id, { onDelete: "cascade" }),
    confidenceBasis: text("confidence_basis").notNull(),
  },
  (table) => [primaryKey({ columns: [table.sourceId, table.nicheId] })],
);

export const ingestionRuns = sqliteTable(
  "ingestion_runs",
  {
    id: text("id").primaryKey(),
    sourceId: text("source_id").references(() => sources.id, {
      onDelete: "set null",
    }),
    nicheId: text("niche_id").references(() => niches.id, {
      onDelete: "set null",
    }),
    agent: text("agent", {
      enum: [
        "scout",
        "extractor",
        "filter",
        "organizer",
        "liveness",
        "pipeline",
      ],
    }).notNull(),
    trigger: text("trigger", {
      enum: ["scheduled", "manual", "webhook"],
    }).notNull(),
    state: text("state", {
      enum: ["queued", "running", "succeeded", "partial", "failed"],
    }).notNull(),
    startedAt: text("started_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    finishedAt: text("finished_at"),
    discoveredCount: integer("discovered_count").notNull().default(0),
    acceptedCount: integer("accepted_count").notNull().default(0),
    rejectedCount: integer("rejected_count").notNull().default(0),
    exceptionCount: integer("exception_count").notNull().default(0),
    costMicros: integer("cost_micros").notNull().default(0),
    errorCode: text("error_code"),
    errorDetail: text("error_detail"),
  },
  (table) => [
    index("runs_source_started_idx").on(table.sourceId, table.startedAt),
  ],
);

export const observations = sqliteTable(
  "observations",
  {
    id: text("id").primaryKey(),
    runId: text("run_id")
      .notNull()
      .references(() => ingestionRuns.id, { onDelete: "cascade" }),
    sourceId: text("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
    sourceUrl: text("source_url").notNull(),
    sourceJobKey: text("source_job_key"),
    contentHash: text("content_hash").notNull(),
    httpStatus: integer("http_status"),
    fetchedAt: text("fetched_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    rawTitle: text("raw_title"),
    rawBody: text("raw_body"),
    rawObjectKey: text("raw_object_key"),
    rawMetadataJson: text("raw_metadata_json").notNull().default("{}"),
    extractionJson: text("extraction_json"),
    groundingJson: text("grounding_json"),
    cacheState: text("cache_state"),
    lastSeenAt: text("last_seen_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    seenCount: integer("seen_count").notNull().default(1),
  },
  (table) => [
    uniqueIndex("observation_url_hash_unique").on(
      table.sourceUrl,
      table.contentHash,
    ),
    index("observation_url_fetched_idx").on(table.sourceUrl, table.fetchedAt),
  ],
);

export const employers = sqliteTable(
  "employers",
  {
    id: text("id").primaryKey(),
    displayName: text("display_name").notNull(),
    legalName: text("legal_name"),
    websiteUrl: text("website_url"),
    contactEmail: text("contact_email").notNull(),
    verificationState: text("verification_state", {
      enum: ["unverified", "email_verified", "business_verified", "blocked"],
    })
      .notNull()
      .default("unverified"),
    verifiedAt: text("verified_at"),
    subscriptionPlan: text("subscription_plan", {
      enum: ["none", "annual_unlimited"],
    })
      .notNull()
      .default("none"),
    subscriptionExpiresAt: text("subscription_expires_at"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("employers_contact_email_unique").on(table.contactEmail),
  ],
);

export const employerSubmissions = sqliteTable(
  "employer_submissions",
  {
    id: text("id").primaryKey(),
    employerId: text("employer_id").references(() => employers.id, {
      onDelete: "set null",
    }),
    status: text("status", {
      enum: ["draft", "submitted", "needs_review", "approved", "rejected"],
    })
      .notNull()
      .default("draft"),
    submitterEmail: text("submitter_email").notNull(),
    payloadJson: text("payload_json").notNull(),
    submittedAt: text("submitted_at"),
    reviewedAt: text("reviewed_at"),
    reviewReason: text("review_reason"),
    pricingPlan: text("pricing_plan", {
      enum: ["single", "annual"],
    })
      .notNull()
      .default("single"),
    stripeSessionId: text("stripe_session_id"),
    paymentStatus: text("payment_status", {
      enum: ["not_required", "pending", "paid", "failed"],
    })
      .notNull()
      .default("pending"),
    nicheIdsJson: text("niche_ids_json").notNull().default("[]"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("employer_submissions_status_idx").on(table.status)],
);

export const jobs = sqliteTable(
  "jobs",
  {
    id: text("id").primaryKey(),
    canonicalKey: text("canonical_key").notNull(),
    listingOrigin: text("listing_origin", {
      enum: ["employer_posted", "sourced"],
    }).notNull(),
    employerId: text("employer_id").references(() => employers.id, {
      onDelete: "set null",
    }),
    employerSubmissionId: text("employer_submission_id").references(
      () => employerSubmissions.id,
      { onDelete: "set null" },
    ),
    sourceId: text("source_id").references(() => sources.id),
    currentObservationId: text("current_observation_id").references(
      () => observations.id,
    ),
    title: text("title").notNull(),
    company: text("company").notNull(),
    district: text("district"),
    postcode: text("postcode"),
    streetAddress: text("street_address"),
    workplaceType: text("workplace_type", {
      enum: ["on_site", "hybrid", "remote"],
    })
      .notNull()
      .default("on_site"),
    locationEvidence: text("location_evidence"),
    roleFamilyId: text("role_family_id").references(() => roleFamilies.id),
    employmentFormsJson: text("employment_forms_json").notNull().default("[]"),
    workConditionTagsJson: text("work_condition_tags_json")
      .notNull()
      .default("[]"),
    responsibilitiesJson: text("responsibilities_json").notNull().default("[]"),
    requirementsJson: text("requirements_json").notNull().default("[]"),
    hoursMinimum: real("hours_minimum"),
    hoursMaximum: real("hours_maximum"),
    hoursPeriod: text("hours_period", {
      enum: ["week", "month", "shift", "not_stated"],
    })
      .notNull()
      .default("not_stated"),
    hoursLabel: text("hours_label").notNull().default("Not stated"),
    scheduleSummary: text("schedule_summary").notNull().default("Not stated"),
    workDaysJson: text("work_days_json").notNull().default("[]"),
    timeWindowsJson: text("time_windows_json").notNull().default("[]"),
    startDateText: text("start_date_text"),
    endDateText: text("end_date_text"),
    languageSignal: text("language_signal", {
      enum: [
        "english_explicit",
        "german_explicit",
        "german_and_english",
        "not_stated",
      ],
    })
      .notNull()
      .default("not_stated"),
    languageEvidence: text("language_evidence"),
    payText: text("pay_text"),
    payEvidence: text("pay_evidence"),
    compensationAmountMinimum: real("compensation_amount_minimum"),
    compensationAmountMaximum: real("compensation_amount_maximum"),
    compensationCurrency: text("compensation_currency")
      .notNull()
      .default("EUR"),
    compensationRateInterval: text("compensation_rate_interval", {
      enum: [
        "hour",
        "shift",
        "day",
        "week",
        "month",
        "year",
        "project",
        "not_stated",
      ],
    })
      .notNull()
      .default("not_stated"),
    payoutCadence: text("payout_cadence", {
      enum: ["weekly", "fortnightly", "monthly", "after_shift", "not_stated"],
    })
      .notNull()
      .default("not_stated"),
    compensationGrossNet: text("compensation_gross_net", {
      enum: ["gross", "net", "not_stated"],
    })
      .notNull()
      .default("not_stated"),
    compensationExtras: text("compensation_extras"),
    applicationMethod: text("application_method", {
      enum: ["external_link", "email", "not_stated"],
    }).notNull(),
    applicationUrl: text("application_url"),
    applicationEmail: text("application_email"),
    applicationDeadline: text("application_deadline"),
    applicationContactName: text("application_contact_name"),
    applicationInstructions: text("application_instructions").notNull(),
    sourcePublishedAt: text("source_published_at"),
    firstSeenAt: text("first_seen_at").notNull(),
    lastVerifiedAt: text("last_verified_at").notNull(),
    expiresAt: text("expires_at").notNull(),
    publicationState: text("publication_state", {
      enum: [
        "draft",
        "needs_review",
        "publishable",
        "published",
        "suppressed",
        "expired",
      ],
    })
      .notNull()
      .default("draft"),
    rejectionCode: text("rejection_code"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("jobs_canonical_key_unique").on(table.canonicalKey),
    index("jobs_publication_freshness_idx").on(
      table.publicationState,
      table.lastVerifiedAt,
    ),
    index("jobs_district_idx").on(table.district),
    index("jobs_origin_publication_idx").on(
      table.listingOrigin,
      table.publicationState,
    ),
    check(
      "jobs_origin_reference_check",
      sql`(${table.listingOrigin} = 'employer_posted' AND ${table.employerSubmissionId} IS NOT NULL) OR (${table.listingOrigin} = 'sourced' AND ${table.sourceId} IS NOT NULL)`,
    ),
    check(
      "jobs_application_destination_check",
      sql`(${table.applicationMethod} = 'email' AND ${table.applicationEmail} IS NOT NULL) OR (${table.applicationMethod} = 'external_link' AND ${table.applicationUrl} IS NOT NULL) OR (${table.applicationMethod} = 'not_stated' AND ${table.applicationEmail} IS NULL AND ${table.applicationUrl} IS NULL)`,
    ),
    check(
      "jobs_compensation_range_check",
      sql`${table.compensationAmountMaximum} IS NULL OR ${table.compensationAmountMinimum} IS NULL OR ${table.compensationAmountMaximum} >= ${table.compensationAmountMinimum}`,
    ),
    check(
      "jobs_hours_range_check",
      sql`${table.hoursMaximum} IS NULL OR ${table.hoursMinimum} IS NULL OR ${table.hoursMaximum} >= ${table.hoursMinimum}`,
    ),
  ],
);

export const jobNiches = sqliteTable(
  "job_niches",
  {
    jobId: text("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    nicheId: text("niche_id")
      .notNull()
      .references(() => niches.id),
    isPrimary: integer("is_primary", { mode: "boolean" })
      .notNull()
      .default(false),
    evidence: text("evidence").notNull(),
  },
  (table) => [primaryKey({ columns: [table.jobId, table.nicheId] })],
);

export const fieldEvidence = sqliteTable(
  "field_evidence",
  {
    id: text("id").primaryKey(),
    jobId: text("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    observationId: text("observation_id").references(() => observations.id),
    employerSubmissionId: text("employer_submission_id").references(
      () => employerSubmissions.id,
    ),
    fieldName: text("field_name").notNull(),
    verbatimEvidence: text("verbatim_evidence").notNull(),
    evidenceLocator: text("evidence_locator"),
    extractionMethod: text("extraction_method", {
      enum: ["structured_data", "selector", "model", "human"],
    }).notNull(),
    reviewed: integer("reviewed", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("field_evidence_job_field_idx").on(table.jobId, table.fieldName),
    check(
      "field_evidence_one_origin_check",
      sql`(${table.observationId} IS NOT NULL AND ${table.employerSubmissionId} IS NULL) OR (${table.observationId} IS NULL AND ${table.employerSubmissionId} IS NOT NULL)`,
    ),
  ],
);

export const auditEvents = sqliteTable(
  "audit_events",
  {
    id: text("id").primaryKey(),
    entityType: text("entity_type", {
      enum: ["source", "run", "observation", "employer", "submission", "job"],
    }).notNull(),
    entityId: text("entity_id").notNull(),
    actorType: text("actor_type", {
      enum: ["system", "agent", "human"],
    }).notNull(),
    actorId: text("actor_id").notNull(),
    action: text("action").notNull(),
    reason: text("reason").notNull(),
    beforeJson: text("before_json"),
    afterJson: text("after_json"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("audit_entity_created_idx").on(
      table.entityType,
      table.entityId,
      table.createdAt,
    ),
  ],
);

export const verificationCodes = sqliteTable(
  "verification_codes",
  {
    id: text("id").primaryKey(),
    submissionId: text("submission_id")
      .notNull()
      .references(() => employerSubmissions.id, { onDelete: "cascade" }),
    codeHash: text("code_hash").notNull(),
    attempts: integer("attempts").notNull().default(0),
    expiresAt: text("expires_at").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("verification_codes_submission_idx").on(table.submissionId),
  ],
);
