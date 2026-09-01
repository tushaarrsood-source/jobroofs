PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_field_evidence` (
	`id` text PRIMARY KEY NOT NULL,
	`job_id` text NOT NULL,
	`observation_id` text,
	`employer_submission_id` text,
	`field_name` text NOT NULL,
	`verbatim_evidence` text NOT NULL,
	`evidence_locator` text,
	`extraction_method` text NOT NULL,
	`reviewed` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`observation_id`) REFERENCES `observations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`employer_submission_id`) REFERENCES `employer_submissions`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "field_evidence_one_origin_check" CHECK(("__new_field_evidence"."observation_id" IS NOT NULL AND "__new_field_evidence"."employer_submission_id" IS NULL) OR ("__new_field_evidence"."observation_id" IS NULL AND "__new_field_evidence"."employer_submission_id" IS NOT NULL))
);
--> statement-breakpoint
INSERT INTO `__new_field_evidence`("id", "job_id", "observation_id", "employer_submission_id", "field_name", "verbatim_evidence", "evidence_locator", "extraction_method", "reviewed", "created_at") SELECT "id", "job_id", "observation_id", "employer_submission_id", "field_name", "verbatim_evidence", "evidence_locator", "extraction_method", "reviewed", "created_at" FROM `field_evidence`;--> statement-breakpoint
DROP TABLE `field_evidence`;--> statement-breakpoint
ALTER TABLE `__new_field_evidence` RENAME TO `field_evidence`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `field_evidence_job_field_idx` ON `field_evidence` (`job_id`,`field_name`);--> statement-breakpoint
CREATE TABLE `__new_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`canonical_key` text NOT NULL,
	`listing_origin` text NOT NULL,
	`employer_id` text,
	`employer_submission_id` text,
	`source_id` text,
	`current_observation_id` text,
	`title` text NOT NULL,
	`company` text NOT NULL,
	`district` text,
	`postcode` text,
	`street_address` text,
	`workplace_type` text DEFAULT 'on_site' NOT NULL,
	`location_evidence` text,
	`role_family_id` text,
	`employment_forms_json` text DEFAULT '[]' NOT NULL,
	`work_condition_tags_json` text DEFAULT '[]' NOT NULL,
	`responsibilities_json` text DEFAULT '[]' NOT NULL,
	`requirements_json` text DEFAULT '[]' NOT NULL,
	`hours_minimum` real,
	`hours_maximum` real,
	`hours_period` text DEFAULT 'not_stated' NOT NULL,
	`hours_label` text DEFAULT 'Not stated' NOT NULL,
	`schedule_summary` text DEFAULT 'Not stated' NOT NULL,
	`work_days_json` text DEFAULT '[]' NOT NULL,
	`time_windows_json` text DEFAULT '[]' NOT NULL,
	`start_date_text` text,
	`end_date_text` text,
	`language_signal` text DEFAULT 'not_stated' NOT NULL,
	`language_evidence` text,
	`pay_text` text,
	`pay_evidence` text,
	`compensation_amount_minimum` real,
	`compensation_amount_maximum` real,
	`compensation_currency` text DEFAULT 'EUR' NOT NULL,
	`compensation_rate_interval` text DEFAULT 'not_stated' NOT NULL,
	`payout_cadence` text DEFAULT 'not_stated' NOT NULL,
	`compensation_gross_net` text DEFAULT 'not_stated' NOT NULL,
	`compensation_extras` text,
	`application_method` text NOT NULL,
	`application_url` text,
	`application_email` text,
	`application_deadline` text,
	`application_contact_name` text,
	`application_instructions` text NOT NULL,
	`source_published_at` text,
	`first_seen_at` text NOT NULL,
	`last_verified_at` text NOT NULL,
	`expires_at` text NOT NULL,
	`publication_state` text DEFAULT 'draft' NOT NULL,
	`rejection_code` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`employer_id`) REFERENCES `employers`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`employer_submission_id`) REFERENCES `employer_submissions`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`current_observation_id`) REFERENCES `observations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`role_family_id`) REFERENCES `role_families`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "jobs_origin_reference_check" CHECK(("__new_jobs"."listing_origin" = 'employer_posted' AND "__new_jobs"."employer_submission_id" IS NOT NULL) OR ("__new_jobs"."listing_origin" = 'sourced' AND "__new_jobs"."source_id" IS NOT NULL)),
	CONSTRAINT "jobs_application_destination_check" CHECK(("__new_jobs"."application_method" = 'email' AND "__new_jobs"."application_email" IS NOT NULL) OR ("__new_jobs"."application_method" = 'external_link' AND "__new_jobs"."application_url" IS NOT NULL)),
	CONSTRAINT "jobs_compensation_range_check" CHECK("__new_jobs"."compensation_amount_maximum" IS NULL OR "__new_jobs"."compensation_amount_minimum" IS NULL OR "__new_jobs"."compensation_amount_maximum" >= "__new_jobs"."compensation_amount_minimum"),
	CONSTRAINT "jobs_hours_range_check" CHECK("__new_jobs"."hours_maximum" IS NULL OR "__new_jobs"."hours_minimum" IS NULL OR "__new_jobs"."hours_maximum" >= "__new_jobs"."hours_minimum")
);
--> statement-breakpoint
INSERT INTO `__new_jobs`("id", "canonical_key", "listing_origin", "employer_id", "employer_submission_id", "source_id", "current_observation_id", "title", "company", "district", "postcode", "street_address", "workplace_type", "location_evidence", "role_family_id", "employment_forms_json", "work_condition_tags_json", "responsibilities_json", "requirements_json", "hours_minimum", "hours_maximum", "hours_period", "hours_label", "schedule_summary", "work_days_json", "time_windows_json", "start_date_text", "end_date_text", "language_signal", "language_evidence", "pay_text", "pay_evidence", "compensation_amount_minimum", "compensation_amount_maximum", "compensation_currency", "compensation_rate_interval", "payout_cadence", "compensation_gross_net", "compensation_extras", "application_method", "application_url", "application_email", "application_deadline", "application_contact_name", "application_instructions", "source_published_at", "first_seen_at", "last_verified_at", "expires_at", "publication_state", "rejection_code", "created_at", "updated_at") SELECT "id", "canonical_key", "listing_origin", "employer_id", "employer_submission_id", "source_id", "current_observation_id", "title", "company", "district", "postcode", "street_address", "workplace_type", "location_evidence", "role_family_id", "employment_forms_json", "work_condition_tags_json", "responsibilities_json", "requirements_json", "hours_minimum", "hours_maximum", "hours_period", "hours_label", "schedule_summary", "work_days_json", "time_windows_json", "start_date_text", "end_date_text", "language_signal", "language_evidence", "pay_text", "pay_evidence", "compensation_amount_minimum", "compensation_amount_maximum", "compensation_currency", "compensation_rate_interval", "payout_cadence", "compensation_gross_net", "compensation_extras", "application_method", "application_url", "application_email", "application_deadline", "application_contact_name", "application_instructions", "source_published_at", "first_seen_at", "last_verified_at", "expires_at", "publication_state", "rejection_code", "created_at", "updated_at" FROM `jobs`;--> statement-breakpoint
DROP TABLE `jobs`;--> statement-breakpoint
ALTER TABLE `__new_jobs` RENAME TO `jobs`;--> statement-breakpoint
CREATE UNIQUE INDEX `jobs_canonical_key_unique` ON `jobs` (`canonical_key`);--> statement-breakpoint
CREATE INDEX `jobs_publication_freshness_idx` ON `jobs` (`publication_state`,`last_verified_at`);--> statement-breakpoint
CREATE INDEX `jobs_district_idx` ON `jobs` (`district`);--> statement-breakpoint
CREATE INDEX `jobs_origin_publication_idx` ON `jobs` (`listing_origin`,`publication_state`);