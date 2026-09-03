CREATE TABLE IF NOT EXISTS `housing_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`submitter_email` text NOT NULL,
	`payload_json` text NOT NULL,
	`submitted_at` text,
	`reviewed_at` text,
	`review_reason` text,
	`stripe_session_id` text,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS `housing_submissions_status_idx` ON `housing_submissions` (`status`);

CREATE TABLE IF NOT EXISTS `housing_listings` (
	`id` text PRIMARY KEY NOT NULL,
	`submission_id` text,
	`title` text NOT NULL,
	`listing_type` text NOT NULL,
	`district` text NOT NULL,
	`postcode` text NOT NULL,
	`neighborhood` text,
	`street_address` text,
	`kaltmiete_eur` real NOT NULL,
	`nebenkosten_eur` real DEFAULT 0 NOT NULL,
	`warmmiete_eur` real NOT NULL,
	`kaution_eur` real DEFAULT 0 NOT NULL,
	`room_sqm` real NOT NULL,
	`total_rooms` real DEFAULT 1 NOT NULL,
	`floor_level` integer,
	`furnished` text DEFAULT 'fully' NOT NULL,
	`anmeldung_possible` integer DEFAULT 1 NOT NULL,
	`sublet_authorized` integer DEFAULT 1 NOT NULL,
	`contract_type` text NOT NULL,
	`move_in_date` text NOT NULL,
	`move_out_date` text,
	`min_stay_months` integer,
	`energy_class` text,
	`heating_source` text,
	`building_year` integer,
	`images_json` text DEFAULT '[]' NOT NULL,
	`description` text NOT NULL,
	`contact_method` text DEFAULT 'email' NOT NULL,
	`contact_email` text NOT NULL,
	`contact_name` text,
	`contact_phone` text,
	`status` text DEFAULT 'active' NOT NULL,
	`published_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`submission_id`) REFERENCES `housing_submissions`(`id`) ON UPDATE no action ON DELETE set null
);

CREATE INDEX IF NOT EXISTS `housing_listings_district_idx` ON `housing_listings` (`district`);
CREATE INDEX IF NOT EXISTS `housing_listings_postcode_idx` ON `housing_listings` (`postcode`);
CREATE INDEX IF NOT EXISTS `housing_listings_status_idx` ON `housing_listings` (`status`);
CREATE INDEX IF NOT EXISTS `housing_listings_type_idx` ON `housing_listings` (`listing_type`);

CREATE TABLE IF NOT EXISTS `housing_verification_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`submission_id` text NOT NULL,
	`code_hash` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`submission_id`) REFERENCES `housing_submissions`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX IF NOT EXISTS `housing_verification_codes_submission_idx` ON `housing_verification_codes` (`submission_id`);
