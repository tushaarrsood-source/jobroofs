CREATE TABLE `verification_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`submission_id` text NOT NULL,
	`code_hash` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`submission_id`) REFERENCES `employer_submissions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `verification_codes_submission_idx` ON `verification_codes` (`submission_id`);--> statement-breakpoint
ALTER TABLE `employers` ADD `subscription_plan` text DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE `employers` ADD `subscription_expires_at` text;--> statement-breakpoint
ALTER TABLE `employer_submissions` ADD `pricing_plan` text DEFAULT 'single' NOT NULL;--> statement-breakpoint
ALTER TABLE `employer_submissions` ADD `stripe_session_id` text;--> statement-breakpoint
ALTER TABLE `employer_submissions` ADD `payment_status` text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `employer_submissions` ADD `niche_ids_json` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `sources` ADD `etag` text;--> statement-breakpoint
ALTER TABLE `sources` ADD `last_modified_header` text;--> statement-breakpoint
ALTER TABLE `sources` ADD `source_format` text DEFAULT 'html' NOT NULL;