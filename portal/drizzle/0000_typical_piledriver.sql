CREATE TABLE `audit_events` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`actor_type` text NOT NULL,
	`actor_id` text NOT NULL,
	`action` text NOT NULL,
	`reason` text NOT NULL,
	`before_json` text,
	`after_json` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_entity_created_idx` ON `audit_events` (`entity_type`,`entity_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `employer_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`employer_id` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`submitter_email` text NOT NULL,
	`payload_json` text NOT NULL,
	`submitted_at` text,
	`reviewed_at` text,
	`review_reason` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`employer_id`) REFERENCES `employers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `employer_submissions_status_idx` ON `employer_submissions` (`status`);--> statement-breakpoint
CREATE TABLE `employers` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`legal_name` text,
	`website_url` text,
	`contact_email` text NOT NULL,
	`verification_state` text DEFAULT 'unverified' NOT NULL,
	`verified_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employers_contact_email_unique` ON `employers` (`contact_email`);--> statement-breakpoint
CREATE TABLE `field_evidence` (
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
	FOREIGN KEY (`employer_submission_id`) REFERENCES `employer_submissions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `field_evidence_job_field_idx` ON `field_evidence` (`job_id`,`field_name`);--> statement-breakpoint
CREATE TABLE `ingestion_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text,
	`agent` text NOT NULL,
	`trigger` text NOT NULL,
	`state` text NOT NULL,
	`started_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`finished_at` text,
	`discovered_count` integer DEFAULT 0 NOT NULL,
	`accepted_count` integer DEFAULT 0 NOT NULL,
	`rejected_count` integer DEFAULT 0 NOT NULL,
	`exception_count` integer DEFAULT 0 NOT NULL,
	`cost_micros` integer DEFAULT 0 NOT NULL,
	`error_code` text,
	`error_detail` text,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `runs_source_started_idx` ON `ingestion_runs` (`source_id`,`started_at`);--> statement-breakpoint
CREATE TABLE `job_niches` (
	`job_id` text NOT NULL,
	`niche_id` text NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	`evidence` text NOT NULL,
	PRIMARY KEY(`job_id`, `niche_id`),
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`niche_id`) REFERENCES `niches`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `jobs` (
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
	FOREIGN KEY (`role_family_id`) REFERENCES `role_families`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `jobs_canonical_key_unique` ON `jobs` (`canonical_key`);--> statement-breakpoint
CREATE INDEX `jobs_publication_freshness_idx` ON `jobs` (`publication_state`,`last_verified_at`);--> statement-breakpoint
CREATE INDEX `jobs_district_idx` ON `jobs` (`district`);--> statement-breakpoint
CREATE INDEX `jobs_origin_publication_idx` ON `jobs` (`listing_origin`,`publication_state`);--> statement-breakpoint
CREATE TABLE `niches` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`label_de` text NOT NULL,
	`description` text NOT NULL,
	`source_target` integer DEFAULT 0 NOT NULL,
	`priority` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `observations` (
	`id` text PRIMARY KEY NOT NULL,
	`run_id` text NOT NULL,
	`source_id` text NOT NULL,
	`source_url` text NOT NULL,
	`source_job_key` text,
	`content_hash` text NOT NULL,
	`http_status` integer,
	`fetched_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`raw_title` text,
	`raw_body` text,
	`raw_metadata_json` text DEFAULT '{}' NOT NULL,
	`cache_state` text,
	FOREIGN KEY (`run_id`) REFERENCES `ingestion_runs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `observation_source_hash_unique` ON `observations` (`source_id`,`content_hash`);--> statement-breakpoint
CREATE INDEX `observation_url_fetched_idx` ON `observations` (`source_url`,`fetched_at`);--> statement-breakpoint
CREATE TABLE `role_families` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `source_niches` (
	`source_id` text NOT NULL,
	`niche_id` text NOT NULL,
	`confidence_basis` text NOT NULL,
	PRIMARY KEY(`source_id`, `niche_id`),
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`niche_id`) REFERENCES `niches`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sources` (
	`id` text PRIMARY KEY NOT NULL,
	`canonical_url` text NOT NULL,
	`name` text NOT NULL,
	`source_kind` text NOT NULL,
	`discovery_method` text NOT NULL,
	`crawl_policy` text DEFAULT 'review_required' NOT NULL,
	`robots_observed_at` text,
	`terms_reviewed_at` text,
	`adapter_key` text,
	`check_interval_minutes` integer DEFAULT 1440 NOT NULL,
	`last_checked_at` text,
	`last_successful_at` text,
	`consecutive_failures` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sources_canonical_url_unique` ON `sources` (`canonical_url`);--> statement-breakpoint
CREATE INDEX `sources_kind_idx` ON `sources` (`source_kind`);--> statement-breakpoint
CREATE INDEX `sources_policy_active_idx` ON `sources` (`crawl_policy`,`active`);