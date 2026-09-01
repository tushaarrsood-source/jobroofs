# WANN lean source engine and listing-commerce specification

Research date: 1 September 2026  
Status: controlling founder direction; validate before scaled automation  
Product: Berlin-only flexible-work classified board

> **Active scope override (1 September 2026):** build the portal, niche taxonomy, CRM/control room and agents first. All listing commerce, pricing, entitlement and Stripe work in this document is deferred and must not be implemented until the founder reactivates it.

## Executive decision

Build a **fresh, source-first Berlin job board**, not a unified jobs platform.

The durable advantage is not scraping volume. It is a living catalogue of small and direct sources, fast change detection, very high factual precision, aggressive deduplication, and a clear operational review system.

The product promise is:

> Flexible Berlin jobs, found closer to the source and checked recently.

The business loop is:

```text
weekly source discovery
  -> approved source registry
  -> lightweight adaptive monitoring
  -> raw evidence snapshot
  -> structured extraction
  -> deterministic eligibility and truth gates
  -> review only when needed
  -> source-linked organic card or employer-authorized full listing
  -> paid renewal / featured placement
```

This can remain a small business. It does not require candidate accounts, CV storage, internal applications, matching, chat, payroll, shift booking, worker supply, public reviews, or a native app.

## 1. What is genuinely different

### The weak version

Another board that copies Indeed, Stepstone and Glassdoor, rewrites their descriptions, and sorts everything by an unreliable “posted” date.

That version has no defensible supply, creates duplicate-content and source-rights risk, and gives employers little reason to pay.

### The strong version

The board searches **behind the aggregators**:

- small employer career pages;
- employer-controlled ATS pages and feeds;
- universities, research institutes, museums, theatres and public bodies;
- hotels, restaurants, retailers, event operators and local services;
- associations, foundations, NGOs and community organizations;
- company sitemaps, RSS/Atom feeds, JSON-LD and public ATS endpoints;
- newly discovered Berlin company websites; and
- only secondarily, broad job boards and licensed partner feeds.

The “90% of boards scrape only the big players” hypothesis is not established by evidence and should not be repeated publicly. The operational target we can control is:

- at least **60% of published jobs from primary sources**;
- no single source family above 20% of inventory;
- at least 25% of inventory from employers with fewer than five visible Berlin vacancies;
- every card linked to the closest authoritative application source; and
- measured source-to-publication latency.

“Primary” means an employer-controlled career page, employer ATS, official employer/institutional portal, or employer-authorized feed. It does not mean “the first website where our crawler happened to see it.”

## 2. The timing correction: weekly discovery, frequent monitoring

A crawler that runs only once a week cannot credibly promise to find immediate listings first. A job published Tuesday can remain invisible until the following Monday.

The lean solution is to separate expensive discovery from cheap monitoring.

### Source Scout — weekly

The Scout finds new organizations and career endpoints. It does **not** publish jobs.

Tasks:

1. Generate candidate organizations from approved company datasets, sector lists, local directories, OSM-derived website records where licence obligations are satisfied, and web search.
2. Resolve the organization’s official domain.
3. search for `jobs`, `karriere`, `career`, `stellen`, `aushilfe`, `minijob`, `teilzeit`, `werkstudent`, `studentische beschäftigung`, `seasonal` and related paths;
4. inspect sitemaps and internal links;
5. fingerprint ATS families;
6. inspect robots.txt, terms and technical accessibility;
7. record the proposed source in the registry; and
8. require an approved source policy before any retrieval or publication mode is activated.

Firecrawl’s Search endpoint supports domain exclusions and date filters, while Map can discover URLs from a domain and its sitemap. These are useful Scout tools, but the source registry—not an agent’s memory—is the source of truth. [Firecrawl Search](https://docs.firecrawl.dev/api-reference/endpoint/search) [Firecrawl Map](https://docs.firecrawl.dev/api-reference/endpoint/map)

Example discovery queries:

```text
(minijob OR teilzeit OR aushilfe OR werkstudent) Berlin
-site:indeed.com -site:stepstone.de -site:linkedin.com -site:glassdoor.de

("studentische Beschäftigung" OR "studentische Hilfskraft") Berlin
-site:indeed.com -site:stepstone.de

(karriere OR stellenangebote) (cafe OR hotel OR museum OR theater OR einzelhandel) Berlin
```

Do not automate queries against Google Search itself. Google classifies automated search queries without permission as machine-generated traffic. Use a licensed search API, Firecrawl Search, or another contractually suitable discovery provider. [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies)

### Source Monitor — every 2 hours to 7 days

The Monitor checks only approved known sources. It is primarily deterministic, not an AI agent.

| Source condition | Default interval | Retrieval method |
|---|---:|---|
| Public ATS JSON/XML feed; historically productive | 2 hours | API/feed with content hash |
| Sitemap or stable careers index; productive | 6 hours | sitemap/index conditional GET |
| Stable HTML employer page | 12 hours | `ETag`/`If-None-Match`, `Last-Modified`/`If-Modified-Since` |
| Low-yield or PDF-based source | 24 hours | index first; fetch document only when changed |
| Dormant source, no eligible job in 90 days | 7 days | lightweight health check |
| Repeated 403/429, terms conflict or policy uncertainty | disabled | human review |

HTTP conditional requests allow unchanged resources to return without retransmitting the full representation. [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)

Firecrawl change tracking can mark pages as new, unchanged, changed or removed. It is a useful managed fallback for difficult pages, not the default for every easy endpoint. [Firecrawl change tracking](https://docs.firecrawl.dev/features/change-tracking)

### Honest speed claims

Do not claim “we are always first.” That is unprovable.

Measure:

- `source_posted_at` when explicitly supplied;
- `first_seen_at` when WANN first observed the job;
- `first_publishable_at` when all gates passed;
- `published_at` when it appeared publicly; and
- `source_to_live_minutes` only when `source_posted_at` is reliable.

Candidate-facing language:

- `Posted by employer 3 hours ago` only when the primary source proves it;
- `Found today` when only WANN’s discovery time is known; and
- `Checked 42 minutes ago` for liveness.

An update timestamp never resets the original posting age.

## 3. Source portfolio: primary first, secondary controlled

### Primary portfolio target: at least 60%

Priority source families:

1. employer-owned JSON-LD and HTML;
2. Greenhouse Job Board API;
3. Lever Postings API;
4. Personio employer XML feeds;
5. SmartRecruiters public Posting API;
6. employer-authorized Recruitee feeds;
7. stable sitemaps, RSS and Atom feeds;
8. direct PDFs with explicit publication/deadline data;
9. official institutional portals such as Land Berlin and university job sites; and
10. employer-submitted listings.

Greenhouse exposes published jobs through unauthenticated GET endpoints. Lever documents a public postings API for published jobs. Personio can expose employer-enabled XML feeds, and SmartRecruiters provides a public company posting API. These structured sources are usually more accurate and cheaper to monitor than arbitrary page scraping. Public technical accessibility still does not by itself decide downstream republication rights. [Greenhouse](https://docs.greenhouse.io/job-board.html) [Lever](https://github.com/lever/postings-api/blob/master/README.md) [Personio](https://support.personio.de/hc/en-us/articles/207576365-Integrate-jobs-from-Personio-into-your-company-website-via-XML) [SmartRecruiters](https://developers.smartrecruiters.com/docs/endpoints)

Strong initial discovery seeds include Berlin’s public business information service, the Berlin Open Data catalogue, the Land Berlin careers portal, TU Berlin’s vacancy portal and the FU/Stellenticket ecosystem. They prove that useful local sources exist outside the general boards; they do not prove permission to republish every field. [Berlin eInformation](https://www.berlin.de/gewerbeauskunft/en/) [Berlin Open Data](https://daten.berlin.de/datensaetze?tags=Handelsregister) [Land Berlin careers](https://www.berlin.de/karriereportal/) [TU Berlin](https://www.jobs.tu-berlin.de/en/job-postings) [FU Berlin](https://stellenticket.fu-berlin.de/en/)

### Secondary portfolio: maximum 40%

Secondary sources include general boards, classifieds, aggregators and staffing sites. Use them for:

- discovering employers and missing source domains;
- measuring market coverage and duplication;
- fallback outbound links where an approved agreement allows it; and
- filling a temporary category gap.

Do not let secondary inventory dominate the homepage. Do not copy descriptions, logos or photos from competitors. A specialist job meta-search engine was at the centre of the CJEU’s `CV-Online Latvia` database-rights judgment; public pages and hyperlinks do not eliminate extraction and reuse analysis. [CJEU C-762/19](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A62019CJ0762)

### The weekly source-composition report

Track:

```text
direct_source_share = primary published jobs / all published jobs
small_employer_share = jobs from employers with <5 visible Berlin roles / all jobs
secondary_dependency = jobs whose closest known source is a general board / all jobs
source_concentration = largest source family's jobs / all jobs
new_sources_approved
new_sources_rejected
source_health_rate
```

“Unique to WANN” is an internal research label only when a defined comparison scan finds no matching vacancy on the chosen comparison boards at the observation time. It is never presented as proof that no other site has the job.

## 4. The extraction ladder

Use the least interpretive method that works.

### Level 1 — structured source adapter

Parse an official API, XML feed or embedded `JobPosting` JSON-LD. Schema.org defines fields such as `datePosted`, `employmentType`, `jobLocation`, `baseSalary`, `workHours` and `validThrough`. [Schema.org JobPosting](https://schema.org/JobPosting)

### Level 2 — source-specific deterministic parser

Use stable DOM selectors, attributes, labels and URL identifiers for a known source. Version every parser and test it against saved fixtures.

### Level 3 — conservative semantic rules

Use explicit dictionaries and patterns to find candidate evidence spans. Keywords discover evidence; they do not establish a fact by themselves.

### Level 4 — constrained AI extraction

Use an LLM only to map supplied source text into a strict schema. Every non-null output must include:

- the field path;
- an exact supporting source span;
- the source URL;
- the extraction method; and
- a confidence value used only for review routing.

The model must be instructed to return `null` when the fact is absent, conflicting or merely implied. Structured JSON output reduces formatting failures but does not make an answer true. Firecrawl supports JSON extraction and batch scrape, but its output still passes WANN’s evidence validators. [Firecrawl batch scrape](https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape)

### Level 5 — human review

Review only jobs with:

- critical-field conflicts;
- unclear Berlin location;
- ambiguous full-time/part-time availability;
- unexplained date changes;
- a possible scam or intermediary;
- missing application destination;
- a new or changed parser; or
- insufficient evidence for a displayed claim.

### Never use AI to

- invent a wage, schedule, language, contract type, location or posting date;
- translate an implication into a requirement;
- silently rewrite a job title;
- decide that German is required because the page is in German;
- decide that English is accepted because the page is in English;
- turn `Aushilfe` into `Minijob`;
- turn `befristet` into `kurzfristige Beschäftigung`;
- treat “flexible” as part-time;
- infer remote eligibility; or
- refresh a job’s age because the page changed.

## 5. Deterministic Filter Gate

The Filter is the most important component, but it should not be a conversational agent. It is a policy engine with testable rules.

### Geographic inclusion

Include when at least one is true:

- an explicit work address is inside Berlin;
- the source explicitly states Berlin as the work location;
- a multi-location job explicitly includes Berlin; or
- a remote role explicitly accepts workers resident in Germany and is intentionally enabled by product policy.

Do not infer Berlin from the employer’s headquarters. “Berlin area” or Brandenburg commuter locations enter review unless an approved boundary policy includes them.

### Employment inclusion

Core types:

- `MINIJOB` only from explicit `Minijob`, `geringfügige Beschäftigung`, or equivalent source wording;
- `PART_TIME` from explicit `Teilzeit`, `part-time`, or an unambiguous reduced-hours offer;
- `WORKING_STUDENT` from explicit `Werkstudent*in`, `working student`, or a formal student-employment label;
- `SHORT_TERM` only when the source explicitly identifies short-term employment, not merely any fixed term;
- `SEASONAL_EVENT` when temporary/seasonal/event duration is explicit; and
- `CASUAL_UNSPECIFIED` for `Aushilfe` where the role is relevant but the legal employment type is not stated.

An offer containing both full-time and part-time is eligible only because part-time is explicitly available. Display both source-supported values; never hide the full-time option.

### Age and liveness inclusion

Use this priority:

1. trustworthy original ATS/source posting timestamp;
2. explicit publication date on the employer page;
3. `first_seen_at`, clearly labelled as discovery time.

Rules:

- hide after `validThrough` or an explicit application deadline;
- hide when the apply endpoint closes, redirects to a generic careers page, or returns removal evidence;
- hide when the original posting age exceeds 30 days unless the employer explicitly reconfirms that exact vacancy;
- do not reset age from `updated_at`;
- when no publication date exists, keep the organic card for no more than seven days without a new source-liveness confirmation; and
- employer-paid listings use the purchased duration but still close immediately if withdrawn.

### Language truth table

| Source evidence | Store | Do not store |
|---|---|---|
| “Fluent German and English required” | German AND English, explicit levels where supplied | “English-friendly” |
| “German or English” | `any_of: [de, en]` | both required |
| Page written in English | page language only | English accepted or required |
| “German is a plus” | German preferred | German required |
| No language statement | unknown | probable language |

### Pay truth table

| Source evidence | Store |
|---|---|
| “€15/hour” | exact hourly gross value if gross/net context is supported |
| “€14–€16/hour” | explicit range |
| “€603 monthly minijob” | monthly amount and raw source text |
| “Competitive pay” | pay unknown; retain phrase only as evidence if useful |
| Collective agreement/pay grade | exact grade and link; calculate no amount unless an approved deterministic table applies |

### Hard exclusions

- clearly full-time-only roles;
- affiliate schemes, paid surveys, MLM or “earn from home” promotions;
- jobs requiring candidate payment or purchase;
- missing or broken application route;
- anonymous employer without a legitimate disclosed intermediary;
- duplicate underlying vacancy;
- expired or unverifiable vacancy;
- private-household listings in version one;
- scraped descriptions without an approved publication basis; and
- prohibited or unresolved source-policy state.

## 6. Organizer: compile, do not compose

The Organizer must not “reread everything and write a nice listing.” That invites factual drift.

It is a deterministic template renderer using the canonical record in `07_JOB_RECORD_SCHEMA.json`.

Example card:

```text
Barista (Aushilfe)
Example Café · Berlin-Neukölln

Employment type: Not stated by employer
Hours: 12–18/week
Pay: €15/hour gross
Language: German B1 required; English preferred
Application: Employer website
Found at source: 1 Sep 2026, 08:12
Last checked: 1 Sep 2026, 10:04
```

Rules:

- render only canonical fields that passed evidence validation;
- preserve meaningful source wording where normalization could change meaning;
- display `Not stated` for important missing decision fields;
- never generate promotional employer copy for organic records;
- never translate requirements without retaining the original evidence;
- link to the direct apply destination;
- label staffing agencies and intermediaries;
- disclose organic, paid and featured status; and
- preserve the original source URL and evidence internally after withdrawal, subject to retention policy.

## 7. Publication modes and rights boundary

Acquisition, extraction and public republication are different actions.

### Mode A — employer-authorized full listing

- full detail page;
- employer-provided or approved description;
- JobPosting structured data when complete and policy-compliant;
- logo and employer media with permission;
- analytics;
- alerts and eligible featured placement; and
- employer edit/withdraw controls.

### Mode B — approved source-link card

- factual fields and short original WANN summary only;
- direct source/apply link;
- prominent source attribution;
- no copied description, image or logo without rights;
- no implication of employer endorsement;
- no `JobPosting` structured data unless authorization and completeness requirements are satisfied; and
- a visible correction/removal mechanism.

This mode requires a source-by-source policy and German/EU counsel review before launch. Google’s job policy disallows JobPosting markup for jobs posted on behalf of an organization without authorization and requires expired listings to be removed. [Google JobPosting policy](https://developers.google.com/search/docs/appearance/structured-data/job-posting)

### Mode C — research only

Used for blocked sources, general-board discoveries, ambiguous rights, employer leads and overlap measurement. Never visible to candidates.

The source registry controls which mode is permitted. “Public API,” “robots allowed,” or “technically accessible” never automatically means Mode A or B.

## 8. Accuracy operating system

Perfect accuracy cannot be promised. The correct objective is extremely high precision, visible uncertainty and rapid reversibility.

### Launch targets

| Metric | Required target |
|---|---:|
| Displayed fields with stored evidence | 100% |
| Employer, title, apply URL and source attribution precision | 100% in audited launch set |
| Critical-field precision | >=99.5% in weekly audited sample |
| False-active rate | <0.5% |
| Broken apply destinations | <1% |
| Duplicate precision | >=99% |
| Language false-positive rate | <1% |
| Jobs checked within their source SLA | >=95% |
| Suppressed-job resurrection | 0 |

Precision is favored over recall. It is acceptable to miss an eligible job. It is not acceptable to invent a job fact.

### Gold-set testing

Before automatic publication:

1. Build a manually labelled set of at least 300 job pages across at least 20 source families.
2. Include German, English, bilingual, missing-field, closed, duplicate, PDF, ATS, multi-location and ambiguous cases.
3. Store expected fields and exact evidence spans.
4. Run every parser or prompt change against the set.
5. Block deployment if critical precision falls below the threshold.
6. Run new adapters in shadow mode before granting auto-publish eligibility.

### Weekly audit

Manually inspect:

- 100 published jobs or the whole inventory if smaller;
- every newly approved source;
- every new/changed adapter;
- all candidate/employer corrections;
- a sample of suppressed and deduplicated jobs; and
- jobs near the 30-day boundary.

### Incident controls

Every source and parser needs:

- a kill switch;
- version number;
- last known good version;
- source health state;
- error budget;
- correction history; and
- suppression that survives re-ingestion and URL changes.

## 9. Deduplication

Never deduplicate on title alone.

Create candidate pairs using:

- normalized employer domain and organization identity;
- source opening ID;
- canonical apply URL;
- normalized title;
- work location;
- description fingerprint;
- publication window; and
- explicit reference number.

Then classify:

- `same_vacancy`;
- `possible_duplicate_review`;
- `same_title_distinct_location`;
- `same_title_distinct_shift`; or
- `distinct`.

The candidate sees one canonical record with the closest authoritative apply route. All observations remain in the internal provenance graph.

## 10. Lean employer product and Stripe entitlement

### Test products

| Product | Price | Duration | Included |
|---|---:|---:|---|
| Fresh Listing | €49 | 14 days | authorized full listing, direct apply, basic metrics |
| Standard Listing | €99 | 30 days | same product with longer duration |
| Featured Listing | €149 | 30 days | clearly labelled eligible placement plus metrics |
| Three-listing pack | €249 | three x 30 days | test only after repeat demand appears |

Fourteen days is easier to understand and operate than 12. If the founder wants 12 as a deliberate freshness signal, test it on the pricing page; do not introduce separate system logic until conversion data supports it.

Payment never buys verification, factual claims, or exemption from quality policy. “Featured” affects labelled distribution only.

### Employer flow

```text
Create draft
  -> verify work email/domain
  -> automatic content and policy checks
  -> manual review for first listing or flagged listing
  -> Stripe-hosted Checkout
  -> verified webhook creates entitlement
  -> publish at entitlement start
  -> reminders at day 10/25 and before expiry
  -> expire or purchase a new entitlement
```

Moderating before payment avoids unnecessary refunds for prohibited listings.

Use Stripe Checkout Sessions in one-time `payment` mode. Stripe recommends Checkout Sessions for most integrations because it manages the checkout lifecycle with less custom code. [Stripe Checkout](https://docs.stripe.com/payments/checkout) [Checkout Sessions](https://docs.stripe.com/payments/checkout-sessions)

Entitlement record:

```text
entitlement_id
listing_id
employer_id
plan_code
stripe_checkout_session_id
stripe_payment_intent_id
amount_paid
currency
starts_at
ends_at
status: pending | active | expired | refunded | revoked
created_at
```

Rules:

- create entitlement only from a signature-verified Stripe webhook;
- never trust the browser success redirect as payment proof;
- use Stripe event IDs and a unique constraint for idempotency;
- include `listing_id` and `plan_code` in Checkout metadata;
- allowlist valid price IDs server-side;
- use a restricted Stripe API key with minimum permissions;
- keep test and live keys separate;
- do not use Stripe Connect; and
- consult a German tax professional on VAT, invoices and displayed gross/net pricing before launch.

No subscription system is needed until employers demonstrate repeat purchasing.

## 11. Minimal portal

### Candidate pages

1. Homepage with newest eligible jobs.
2. Search/results with filters for type, district/location, language, hours, pay stated and source recency.
3. Job detail or approved source-link view.
4. About/how sourcing works.
5. Correction/removal form.

No candidate authentication in version one.

### Employer pages

1. Pricing.
2. Create listing.
3. Email verification.
4. Checkout redirect.
5. Private edit/withdraw link.
6. Minimal metrics: qualified views and apply clicks.

An employer account dashboard is optional. Signed, expiring edit links are sufficient for the first paid customers.

### Admin pages

1. Listing review queue.
2. Source registry.
3. Source health and last-run status.
4. Evidence viewer.
5. Duplicate/conflict queue.
6. Payments and entitlements.
7. Correction, suppression and audit history.

## 12. Technical shape

Keep the stack ordinary:

- one web application;
- one relational database;
- object storage for access-controlled source snapshots where retention is justified;
- one durable job queue;
- scheduled invocations;
- direct HTTP/XML/JSON parsers for easy sources;
- a managed browser/scraper only for difficult approved sources;
- one constrained extraction model behind schema validation; and
- Stripe-hosted Checkout.

Do not create independent autonomous agents with their own memories. Represent every run as idempotent jobs in a queue:

```text
discover_source
inspect_source
poll_source
fetch_job
extract_job
validate_job
deduplicate_job
review_job
publish_job
expire_job
```

Vercel Cron can trigger scheduled functions, but Vercel does not retry failed cron invocations and warns that invocations can duplicate; use locks, idempotency and a durable queue. [Vercel cron management](https://vercel.com/docs/cron-jobs/manage-cron-jobs)

### Cost discipline

Use this order:

1. public source API/feed;
2. sitemap/RSS and conditional HTTP;
3. direct HTML fetch;
4. managed scrape for changed/difficult pages;
5. browser automation only for the hostile tail;
6. human review for ambiguity.

Never send unchanged pages through an LLM. Hash normalized main content and extract only on meaningful changes.

## 13. 30-day execution plan

### Days 1–5: prove the source thesis manually

- Assemble 100 potential primary Berlin sources across at least eight sectors.
- Approve or reject each source’s retrieval and publication mode.
- Manually collect 100 eligible jobs.
- Measure primary-source share, missing-field rates and overlap with three comparison boards.
- Identify the first 5–8 reusable source adapters.

Gate: at least 60 eligible jobs, at least 60% primary-origin, and at least 20 employers with no matching vacancy observed on the selected comparison boards at that moment.

### Days 6–12: build the truth pipeline

- Implement source registry and raw observation storage.
- Implement structured adapters first.
- Implement canonical schema and evidence validator.
- Implement age, Berlin, employment and liveness gates.
- Create a 100-record initial gold set.
- Run all publication in shadow mode.

Gate: 100% evidence coverage and at least 99% critical-field precision in the initial audited sample. Raise the target to 99.5% before scale.

### Days 13–20: build the board

- Search/results and job view.
- Admin review and suppression.
- Automatic expiry.
- Employer draft and email verification.
- Stripe test-mode Checkout and webhook entitlement.
- Correction/removal route.

Gate: zero invented facts, zero suppressed-job resurrection, and fewer than 1% broken apply links in the test inventory.

### Days 21–30: sell before polishing

- Ask 30 Berlin employers to review their candidate-facing listing representation.
- Offer the €49/14-day founding listing.
- Get at least three real payments.
- Publish only after policy and payment gates pass.
- Track apply clicks and employer-reported relevance.

Commercial gate: three paid employers, one repeat or multi-listing purchase signal, and at least one employer who says the direct-source/freshness audience—not charity—justified payment.

## 14. Kill and correction rules

Pause scaled ingestion if any occurs:

- critical-field precision below 99%;
- source/apply attribution error;
- repeated publication from a prohibited source;
- inability to suppress withdrawn jobs;
- more than 2% broken apply routes;
- source-rights complaint not resolved within one business day; or
- primary-source share below 50% for two consecutive weeks.

Do not build more product if, after direct founder sales, fewer than three employers pay. The next experiment would be audience acquisition or a different niche—not additional agents.

## Contrarian risks

1. **Direct-source inventory can reduce willingness to pay.** If a free organic card already sends applications, employers need paid control, speed, richer content, analytics and distribution—not artificial removal of organic visibility.
2. **Small employers may not maintain career pages.** The Scout advantage may skew toward institutions and better-equipped employers rather than truly small businesses. Employer submission and concierge listing creation remain necessary.
3. **Freshest does not mean best.** A two-hour-old listing without pay or hours may be less useful than a seven-day-old complete listing. Ranking should combine freshness with factual completeness without inventing a single field.
4. **Primary technical endpoints are not blanket licences.** The most technically convenient sources still need publication-policy decisions.
5. **Accuracy lowers recall.** This is intentional. WANN should be smaller and trustworthy rather than large and speculative.

## Open questions to validate

1. What percentage of eligible direct-source jobs are absent from Stepstone, Indeed and one local comparison board at first observation?
2. Which Berlin sectors produce frequent flexible work but maintain crawlable direct career pages?
3. Does €49 attract legitimate small employers or primarily low-quality advertisers?
4. Will candidates value direct-source freshness enough to create repeat traffic without alerts/accounts?
5. Can Mode B source-link cards be operated under a counsel-approved source policy at useful scale?
6. Which five source adapters produce the lowest cost per accurate, eligible job?

## Research sources added for this specification

- [Google JobPosting policy](https://developers.google.com/search/docs/appearance/structured-data/job-posting) — authorization, completeness and expiry requirements.
- [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies) — automated queries and low-value scraped-page risks.
- [Google Indexing API quotas](https://developers.google.com/search/apis/indexing-api/v3/quota-pricing) — job-page update/removal mechanism and default quota.
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) — `lastmod`, sitemap and feed behavior.
- [RFC 9309](https://www.rfc-editor.org/info/rfc9309/) — robots exclusion standard.
- [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html) — HTTP validators and conditional requests.
- [Schema.org JobPosting](https://schema.org/JobPosting) — common structured job vocabulary.
- [Greenhouse Job Board API](https://docs.greenhouse.io/job-board.html) — public published-job JSON.
- [Lever Postings API](https://github.com/lever/postings-api/blob/master/README.md) — public published-job endpoint.
- [Personio XML job integration](https://support.personio.de/hc/en-us/articles/207576365-Integrate-jobs-from-Personio-into-your-company-website-via-XML) — employer-enabled XML feed.
- [SmartRecruiters Posting API](https://developers.smartrecruiters.com/docs/endpoints) — company active-postings endpoint.
- [Recruitee API guidance](https://support.recruitee.com/en/articles/1066282-api-documentation) — authenticated careers-site API boundary.
- [Firecrawl Search](https://docs.firecrawl.dev/api-reference/endpoint/search) — discovery queries, date and domain controls.
- [Firecrawl Map](https://docs.firecrawl.dev/api-reference/endpoint/map) — URL and sitemap discovery.
- [Firecrawl batch scrape](https://docs.firecrawl.dev/api-reference/endpoint/batch-scrape) — changed-page extraction at scale.
- [Firecrawl change tracking](https://docs.firecrawl.dev/features/change-tracking) — new/changed/removed state.
- [Firecrawl pricing](https://www.firecrawl.dev/pricing) — current credit model; recheck before purchase.
- [Berlin eInformation](https://www.berlin.de/gewerbeauskunft/en/) — official registered-business discovery surface.
- [Berlin Open Data business datasets](https://daten.berlin.de/datensaetze?tags=Handelsregister) — licensed aggregate/company discovery inputs.
- [Land Berlin careers](https://www.berlin.de/karriereportal/) — direct institutional vacancy source.
- [TU Berlin jobs](https://www.jobs.tu-berlin.de/en/job-postings) — direct university roles with dates and deadlines.
- [FU/Stellenticket](https://stellenticket.fu-berlin.de/en/) — university/employer ecosystem and casual-work routing.
- [BA HR-BA-XML](https://www.arbeitsagentur.de/unternehmen/arbeitskraefte/hr-ba-xml-schnittstelle) — cooperation-based job-board integration route.
- [BA terms of use](https://www.arbeitsagentur.de/en/terms-of-use) — selected-partner rights model rather than blanket reuse.
- [CJEU C-762/19](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A62019CJ0762) — job meta-search/database-right precedent.
- [OpenStreetMap attribution guidance](https://osmfoundation.org/wiki/Licence/Attribution_Guidelines) — conditions when OSM is used for business/source discovery.
- [Stripe Checkout](https://docs.stripe.com/payments/checkout) — hosted one-time payment surface.
- [Stripe Checkout Sessions](https://docs.stripe.com/payments/checkout-sessions) — lifecycle and metadata.
- [Stripe restricted API keys](https://docs.stripe.com/keys/restricted-api-keys) — least-privilege key handling.
- [Vercel Cron management](https://vercel.com/docs/cron-jobs/manage-cron-jobs) — scheduling, retry, concurrency and idempotency limits.

## Rerun inputs

```text
workflow: firecrawl-deep-research
topic: Berlin direct-source flexible-job discovery, evidence-preserving extraction, lean listing commerce
depth: exhaustive (continued from founder research)
output: markdown specification plus JSON/CSV operating templates
native_firecrawl_execution: unavailable in this environment; live web research fallback used
```
