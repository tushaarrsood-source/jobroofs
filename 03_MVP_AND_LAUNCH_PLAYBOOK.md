# WANN: MVP and launch playbook

Date: 1 September 2026  
Status: broader reference specification. `06_LEAN_SOURCE_ENGINE_SPEC.md` is the controlling scope for the chosen lean classified-board model.

## 1. Product contract

WANN helps a person find a real Berlin job that fits their week. A job is not publishable unless the system can truthfully represent:

- employer identity;
- source and publication authority;
- application destination;
- employment type;
- pay or an explicit “not stated” state;
- expected hours;
- usable schedule information;
- job location or legitimate remote status;
- required working language;
- source posting date when known;
- last successful check; and
- expiry/reconfirmation policy.

For employer-submitted “Verified Basic” jobs, wage, hours, schedule, language and employment type are mandatory. For authorized imported jobs, missing values remain visible as “Not stated” and reduce completeness/ranking. They are never inferred as fact.

## 2. Scope

### Include in version one

- Berlin and immediately connected job corridors;
- minijob;
- part-time employment;
- working-student employment;
- short-term employment;
- seasonal/event employment with explicit contract type;
- bilingual German/English interface;
- direct employer application;
- consent-based alerts; and
- commercial employers and registered organizations.

### Explicitly exclude

- full-time jobs;
- private household employers;
- freelance “microtasks” and generic gigs;
- delivery-driver marketplace work unless it is a clear direct employment offer;
- candidate scoring or automated rejection;
- platform shift allocation;
- payroll, timekeeping or wage advances;
- employee leasing/temporary-agency operations;
- candidate payments;
- open CV database;
- employer reviews; and
- national expansion.

## 3. Candidate flow

1. Open search without an account.
2. Set available days and time windows.
3. Set hours/week, starting station/postcode and maximum commute.
4. Set minimum pay, language capability and allowed employment types.
5. See only hard-compatible jobs.
6. Open a job page with source, last check and application route visible.
7. Apply directly to the employer.
8. Optionally consent to an alert for the saved availability pattern.
9. Optionally report a problem without creating a profile.

Target: a candidate reaches the first relevant job in under 90 seconds.

## 4. Employer flow

1. Enter work email and company website/domain.
2. Verify email and business identity.
3. Paste an authorized job URL or create the job from scratch.
4. Confirm title, employment type, pay, hours, schedule, location, language and apply route.
5. Accept job-content rules and confirm authorization.
6. Publish after automated and, when flagged, human review.
7. Reconfirm with one click after seven days.
8. Job auto-hides at 14 days without reconfirmation and has a hard 30-day maximum without a new employer confirmation.
9. Employer closes as filled, cancelled or paused.
10. Employer reports response and hire outcomes in aggregate.

## 5. Data model

### Employer

```text
employer_id
legal_name
display_name
legal_form
register_name
register_number
website_domain
domain_verified_at
postal_address
verification_method
verification_evidence_ref
verification_status
risk_flags[]
created_at
updated_at
```

### Source policy

```text
source_id
source_kind: employer_submit | authorized_feed | public_api | employer_career_page | partner_board
base_url
owner
terms_url
robots_checked_at
terms_checked_at
rights_state: approved | conditional | quarantined | denied | counsel_review
permitted_fields[]
republishing_allowed
linking_allowed
attribution_required
rate_limit
retention_rule
reviewed_by
reviewed_at
```

### Job

```text
job_id
employer_id
source_id
source_job_id
source_url
source_authorized_at
source_authorization_evidence_ref
title_original
title_normalized
description_authorized
contract_type: minijob | part_time | working_student | short_term | seasonal
hourly_pay_min
hourly_pay_max
pay_currency
pay_period
hours_week_min
hours_week_max
schedule_days[]
schedule_start_time
schedule_end_time
schedule_pattern
schedule_flexibility_text
german_level
other_working_languages[]
address
latitude
longitude
remote_status
start_date
application_url
application_email
posted_at_source
valid_through_source
last_checked_at
last_check_result
content_hash
completeness_score
risk_flags[]
moderation_state
publication_state
expiry_reason
created_at
updated_at
```

### Check and suppression logs

```text
check_id
job_id
checked_at
http_status
source_present
apply_route_working
valid_through_observed
content_hash_observed
result
evidence_ref
```

```text
suppression_id
job_or_employer_id
reason
source
effective_at
review_after
lifted_at
```

Suppression survives re-ingestion. A renamed or reposted source job must not resurrect a blocked vacancy without review.

## 6. Rights-aware ingestion pipeline

```text
authorized discovery
  -> source policy gate
  -> fetch with per-host limits and conditional requests
  -> retain source evidence internally
  -> deterministic extraction + AI-assisted candidate fields
  -> field-level evidence map
  -> employer/entity resolution
  -> duplicate detection
  -> scam, AGG and content policy checks
  -> human review for uncertainty/high risk
  -> publication
  -> daily liveness/application check
  -> employer reconfirmation
  -> close, suppress or expire
  -> notify Google Indexing API
```

### Fail-closed rules

- No approved source policy: quarantine.
- No employer identity: reject.
- No application route: reject.
- Candidate must pay, buy equipment or complete financial identity checks before contract: reject and risk-review employer.
- AI extraction without source evidence: leave unknown.
- Contradictory pay/hours/contract fields: quarantine.
- Source disappears or returns a closed state: hide immediately.
- Application endpoint fails twice across independent checks: hide pending review.
- Employer fails 14-day reconfirmation: hide.
- `validThrough` passes: hide regardless of payment.
- Paid job fails any trust floor: hide; promotion never overrides safety.

### Duplicate fingerprint

Use a weighted fingerprint over:

- verified employer;
- normalized title;
- location/geohash;
- employment type;
- normalized description shingles;
- apply destination; and
- source opening identifier.

Group duplicates into one candidate-facing job with an authoritative application route. Keep every source internally for provenance and liveness evidence.

### AI boundary

Allowed:

- extract wage, hours, shifts, language and contract clues;
- normalize titles and locations;
- translate authorized descriptions while preserving the original;
- suggest duplicate groups; and
- flag scam, discrimination or contradiction patterns for review.

Not allowed in version one:

- infer unstated pay, schedule, language or work authorization;
- rank candidates;
- reject applicants;
- predict reliability, personality or “culture fit”;
- infer protected characteristics; or
- claim a legal employment classification without employer confirmation.

## 7. Freshness policy

“Posted” and “checked” are different facts.

| State | Candidate treatment |
|---|---|
| Checked within 24h | Normal visibility |
| Checked 24–72h ago | Visible with reduced liveness weight |
| Not checked for 72h | Hidden until check succeeds |
| Employer not reconfirmed by day 7 | Reminder and reduced liveness weight |
| Employer not reconfirmed by day 14 | Hidden |
| Source closed/404/410/expired | Hidden immediately |
| Hard age reaches 30 days | Hidden unless employer creates a fresh confirmation event |

Do not reset the posting date when a crawler sees the same job again. Store original posting date separately from the last content change and the last check.

## 8. Ranking model

### Hard eligibility

- availability overlap;
- employment type selected;
- commute limit;
- minimum pay where stated;
- language level; and
- job live/trust state.

### Organic score

```text
0.30 availability overlap
0.20 commute fit
0.15 pay fit
0.10 hours fit
0.10 listing completeness
0.10 liveness
0.05 recency
```

These are test weights. Log ranking inputs and validate with behaviour. Promotion can reorder only within a narrow band of already eligible jobs and must be labelled.

## 9. MVP backlog

### P0: build only after the 21-day validation gates pass

- public home/search;
- availability, commute, wage, language and employment-type filters;
- mobile job cards and detail pages;
- no-login details;
- outbound apply and consented click tracking;
- employer submit/import flow;
- email/domain verification;
- admin moderation queue;
- source-policy registry;
- duplicate detection;
- liveness checker and auto-expiry;
- job problem report and takedown workflow;
- consent-based alerts;
- German/English UI;
- privacy notice, terms, imprint and ranking explanation;
- JobPosting JSON-LD;
- sitemap and Google Indexing API integration; and
- basic employer performance report.

### P1: after supply and application proof

- employer dashboard and job claim flow;
- one-click seven-day reconfirmation;
- Team billing;
- paid owned-channel distribution;
- response-status events;
- transit-aware commute estimates;
- source feed adapters; and
- job availability-card sharing.

### Not now

- native mobile app;
- CV builder;
- candidate social feed;
- chat between strangers;
- public employer ratings;
- shift swapping;
- payroll;
- wage advances;
- biometric identity verification;
- automated candidate ranking; and
- multi-city architecture work beyond simple data isolation.

## 10. Twenty-one-day validation sprint

### Days 1–3: prepare

- Create two static search-result variants: schedule-first versus conventional title-first.
- Build employer job-intake form.
- Select four candidate intercept locations and four employer corridors.
- Create a source-permission form and pilot terms.
- Recruit interviews without promising a finished platform.

### Days 4–10: candidate and employer discovery

- Complete 25 candidate interviews.
- Complete 20 employer interviews.
- Record the last five actual searches and hires rather than opinions about imaginary features.
- Test €79 prepayment at the end of qualified employer interviews.

### Days 11–14: concierge supply

- Secure ten employer permissions.
- Structure 50 real active jobs.
- Verify business/domain, pay, hours, schedule, language and apply route.
- Publish through a lightweight prototype or controlled landing pages.

### Days 15–21: demand and transaction test

- Drive 250 relevant candidate visits through permitted community distribution and direct research follow-up.
- Measure time to first relevant job, detail-to-apply and broken routes.
- Ask employers for 24/48/72-hour response status.
- Collect fill/close outcomes.
- Hold the gate review on day 21.

## 11. Gate scorecard

| Gate | Pass |
|---|---:|
| Candidate interviews | 25 |
| Employer interviews | 20 |
| Employers authorizing listings | 10 |
| Employers prepaying €79 | 3 |
| Authorized live jobs | 50 |
| Candidates finding a suitable role in <90 sec | 15/25 |
| Pilot application response within 72h | >=60% |
| Candidate payment/scam incidents | 0 |
| Unauthorized publication complaints | 0 |

Failing prepayment or authorization is a business-model failure, not a design backlog item.

## 12. Launch channels and experiments

### Candidate channels

| Channel | First experiment | Success measure |
|---|---|---|
| Student/international groups | Admin-approved weekly 5-job card | >=8% click-to-detail |
| WhatsApp/Telegram alerts | Opt-in alert for exact availability | >=15% alert-to-detail, >=3% alert-to-apply |
| Campus/community intercepts | QR into pre-filtered search | >=30% complete a search |
| Micro-creators | One real “jobs this weekend” video | Cost per qualified apply, not views |
| Google Jobs | Valid JobPosting + Indexing API | Indexed live jobs and organic applies |
| Referral/share | Wage/shift/location card | >=10% of detail visitors share/save |

### Employer channels

| Channel | First experiment | Success measure |
|---|---|---|
| Founder walk-in | Two-minute structured listing setup | 20% authorize a pilot |
| Association/partner intro | Small employer demo session | 5 qualified employer calls/event |
| Employer-requested call | “Fill these exact shifts” demo | 30% start pilot |
| Existing employer referrals | Free Fast Fill credit after referred employer publishes | 15% referral conversion |
| Concierge | Founder structures first role | 3 prepaid pilots |

No automated cold email or unsolicited messaging campaign.

## 13. Pricing test

Test, do not debate, these three offers:

### A. Free authorized listing

- structured and verified;
- normal ranking;
- 14-day reconfirmation; and
- no guaranteed traffic.

### B. Fast Fill — €79 / 14 days

- everything in Basic;
- labelled eligible placement;
- inclusion in matched alerts;
- one employer performance report; and
- free rerun only if the platform caused a material delivery failure, not if no hire occurs.

### C. Team — €149 / month

- up to five active jobs;
- job templates;
- multiple employer users;
- reconfirmation workflow;
- application and response analytics; and
- cancel monthly.

Ask for payment during validation. A survey answer that “€79 sounds reasonable” is not evidence of willingness to pay.

## 14. Operating roles for the first 100 jobs

- Founder: employer acquisition, source permission and commercial interviews.
- Operations/moderation: employer verification, job truth, scam/AGG review and closure.
- Product/engineering: search, liveness, source policy, dedupe and analytics.
- Qualified counsel: source rights, outreach, privacy, platform scope and business-model boundary.

The founder should personally moderate the first 100 jobs. That is how the hidden taxonomy and fraud patterns become product knowledge.

## 15. Incident playbooks

### Candidate reports scam

1. Hide job immediately when the report contains a plausible payment, identity-theft or impersonation signal.
2. Preserve evidence with access controls.
3. Freeze employer and related jobs.
4. Verify against the real company using an independent channel.
5. Notify affected candidates where required and provide official Verbraucherzentrale/police guidance.
6. Complete data-breach assessment where personal data may be compromised.
7. Block resurrection fingerprints.

### Source owner objects

1. Hide the affected source’s jobs.
2. Pause the adapter.
3. Preserve source policy and authorization records.
4. Respond through the designated legal/contact process.
5. Resume only after written resolution.

### Job closes but remains visible

1. Hide immediately.
2. send Indexing API removal;
3. audit source-check failure;
4. notify recent outbound applicants if materially misleading; and
5. add regression coverage for the failure mode.

## 16. Release checklist

- [ ] Every source has an approved policy state.
- [ ] No job can publish without employer/source/application evidence.
- [ ] No paid control bypasses moderation or expiry.
- [ ] Candidate details are visible without login.
- [ ] Unknown facts remain unknown.
- [ ] Posting date cannot be refreshed by ingestion.
- [ ] Suppressed jobs cannot resurrect through another source.
- [ ] JobPosting markup matches visible page content.
- [ ] Expired jobs remove markup and are reported to the Indexing API.
- [ ] Takedown and report controls work.
- [ ] Ranking and sponsorship are explained.
- [ ] Imprint, privacy, terms and consent logs are live.
- [ ] Keyboard, screen-reader and mobile checks pass.
- [ ] Backups, access controls and deletion jobs are verified.
- [ ] The AÜG/platform-work boundary has been reviewed before any shift-control feature.
