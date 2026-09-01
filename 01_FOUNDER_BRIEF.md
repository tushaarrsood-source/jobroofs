# Deep research: a Berlin portal for part-time, minijob, short-term and flexible work

Research date: 1 September 2026  
Geography: Berlin first  
Decision horizon: validation now; eight-week MVP only after demand proof

> **Current implementation decision (1 September 2026):** payments are deferred. Pricing and paid-pilot material below is retained as research history, not active build scope. The active build order is portal, taxonomy, source control room, approved-source discovery, evidence extraction, filters, review and publication.

## Founder clarification: controlling direction

After the original research, the product was deliberately narrowed. The chosen business is a **source-first Berlin classified job board**, not a unified employment, matching, scheduling, staffing, payroll, or applicant-management platform.

Its operating loop is simple:

> discover direct-employer sources -> detect fresh eligible vacancies -> preserve exact evidence -> publish a clean outbound listing -> sell employer-authorized listings

The primary differentiation is direct-source coverage and freshness, not feature breadth. The target is at least 60% of published inventory originating from employer career sites, employer-controlled ATS pages, official employer feeds, and small institutional sources rather than large general job boards. This is a measurable portfolio target, not a verified current result.

The earlier commercial hypothesis was **€49 for 14 days**, **€99 for 30 days**, and **€149 for a featured 30-day listing**. It is deliberately deferred until the portal proves fresh direct-source coverage and candidate usefulness. Subscriptions, candidate accounts, native applications, applicant scoring, payroll, scheduling, and CV storage remain outside the initial product.

File `06_LEAN_SOURCE_ENGINE_SPEC.md` is the controlling build and operating specification. Where it conflicts with the broader hypotheses below, the lean specification controls. The market, competitor, candidate-pain, and regulatory research in this brief remains relevant.

## Executive summary

### The verdict

**Go, but not with the original framing.** The market is not untapped. It is crowded, fragmented and inconsistently trustworthy. Those are different things.

Berlin already has broad job boards, local classifieds, student job portals, English-language aggregators and end-to-end staffing apps. The opportunity is not to collect more job descriptions. It is to remove the uncertainty that those products leave behind: *Does this job fit my actual week, what does it pay, what language is needed, is it still open, is the employer real, and can I apply without surrendering my life story?*

The recommended product is a Berlin-only, bilingual, **schedule-first and trust-first index of flexible employment**. It initially covers:

- minijobs;
- part-time employment;
- working-student roles;
- short-term employment; and
- seasonal/event employment where the employer and contract type are clear.

Do **not** initially include freelance microtasks, delivery-platform gigs, household jobs from private individuals, shift booking, payroll or temporary-agency employment. Those introduce a different safety, classification and regulatory problem. Germany is currently implementing the EU Platform Work Directive by 2 December 2026, while supplying workers to third parties can trigger the Arbeitnehmerüberlassungsgesetz. A simple job-information product is a materially safer starting model.

### The single product idea

Working concept: **WANN — Berlin jobs that fit your week.**

The first question is not “What job title?” It is:

> When can you work?

The search then uses days, time windows, hours per week, distance, wage, language and employment type. Every card shows the actual decision data and a visible **Checked X hours ago** timestamp.

This is a much stronger promise than “no job older than 30 days.” jobicco already limits listings to 30 days, NebenJob uses 30-day listings, and Google explicitly requires expired jobs to be removed. Freshness is a necessary operating standard, not a differentiated business on its own.

### The economic thesis

Candidates never pay. Trust verification never becomes a paid badge. Employers pay for reach, repeat workflow and useful performance data:

- **Verified Basic:** free, employer-authorized, high-quality listing;
- **Fast Fill:** €79 for 14 days of clearly labelled distribution through owned alerts and placement, subject to the same quality floor;
- **Team:** €149 per month for up to five active roles, templates, reconfirmation and response analytics; and
- **Concierge:** €249 per role for structuring, publishing and owned-channel distribution, without a hiring guarantee.

These are test prices, not a forecast. The first commercial proof is three employers prepaying for a pilot before the full product is built.

## 1. Challenge to the original premise

### “Scattered” — supported

The supply is split across materially different products:

- broad boards such as Stepstone and Indeed;
- local classifieds such as Kleinanzeigen;
- student portals such as jobicco and Jobmensa;
- English-language aggregators such as EnglishJobs.de;
- staffing businesses such as Zenjob and jobvalley; and
- employer-side distribution tools such as JOIN.

The same candidate therefore encounters different account requirements, terminology, application routes, quality thresholds and commercial incentives.

### “Crowded” — supported

Live snapshots demonstrate abundant inventory:

- Stepstone showed 386 Berlin minijob results and 3,747 Berlin part-time results on 1 September 2026.
- Kleinanzeigen showed 277 results for “Minijob in Berlin,” including both offers and job-seeker advertisements.
- EnglishJobs.de showed 1,440 Berlin jobs, but the visible mix was dominated by professional, full-time and technical work.
- jobicco showed only 15 current Berlin/Brandenburg casual-job listings.

Counts are not directly comparable and are not audited for duplicates or true availability. They show that **volume is not the missing product**.

### “Unorganized” — partly supported

The category vocabulary is messy. “Minijob,” “part-time,” “working student,” “temporary,” “short-term employment,” “freelance” and “gig” are frequently mixed even though they carry different legal, tax and social-insurance implications. Search pages can also produce visibly loose relevance: Stepstone’s snapshot contained more results for “minijob on weekends” than for “minijob,” and NebenJob’s minijob surface mixed surveys, fundraising travel, full-time weeks and local hourly work.

This is a normalization and truth problem, not merely a visual-design problem.

### “Corrupt” — not established

Do not make this claim publicly. Credible evidence supports narrower problems:

- the Verbraucherzentrale documents fake job advertisements used for identity theft and advance-fee fraud;
- a 2025 Stepstone survey of 8,100 respondents reported that 64% of jobseekers had experienced employer ghosting;
- app-store reviews point to cancellation, communication and shift-availability friction in staffing apps; and
- jobseekers publicly complain about reposted or unresponsive listings.

That establishes scams, opacity and bad experiences. It does not establish that the market as a whole is corrupt.

## 2. Why Berlin is a credible starting market

Berlin is large enough for liquidity and narrow enough for a local operating advantage.

- The official 2025 population was 3,700,577, of whom about 23% were foreign nationals.
- Berlin had 190,940 students in summer semester 2025, including 48,028 foreign students.
- Berlin had roughly 1.68 million employees subject to social insurance in June 2026.
- The Federal Employment Agency’s regional monitor reported a 35.1% part-time rate for Berlin in 2025.
- Employers reported 5,723 new vacancies to Berlin employment agencies and jobcentres in August 2026, up 13.7% year on year.
- Nationally, 13 million people worked part-time in 2025, equal to 31.2% of employed people.

The legal economics are also concrete. Since 1 January 2026, the statutory minimum wage is €13.90 per hour and the monthly minijob earnings limit is €603. At exactly the minimum wage, that is about 43.38 hours per month. A product handling “minijobs” should calculate and explain this, not treat the label as a keyword.

International students are a particularly visible—but not exclusive—early segment. Third-country students may generally work up to 140 full or 280 half days per year, or use the 20-hours-per-week route during lecture periods, subject to their status and the detailed rules. This creates a real information need, but the platform must not pretend to determine an individual’s work authorization.

### Important counter-signal

Do not build the thesis only on hospitality. The IHK Berlin reported a deeply negative hospitality employment outlook in autumn 2025, even though tourism remains economically important. A resilient launch needs several recurring-demand categories:

- retail;
- hospitality and events;
- logistics and fulfilment; and
- office, reception and customer support.

Cleaning and care-assistance can follow after stronger verification and qualification controls. Private-home jobs should not be in the first release.

## 3. Competitor landscape and the actual white space

The detailed evidence is in `02_COMPETITOR_MATRIX.csv`. The useful strategic groups are below.

### Broad reach: Stepstone and Indeed

Strengths:

- scale, employer familiarity and strong distribution;
- saved searches, filters and fast-apply options; and
- strong employer-side products.

Weaknesses for this niche:

- optimized around job titles rather than a person’s weekly availability;
- paid promotion can affect visibility;
- schedule details are usually buried in prose or absent;
- very broad result sets increase candidate review work; and
- Stepstone’s current employer pricing is far above what many local small businesses will pay for a casual role: from €1,449 for a 30-day single Pro ad, or €249 per month on a 12-month starter contract.

### Local and fresh: Kleinanzeigen

Strengths:

- enormous German reach;
- highly local supply and visibly recent posts;
- direct messaging; and
- private and commercial participation.

Weaknesses:

- offers and job-seeker requests can appear in the same query;
- inconsistent structure and application methods;
- weak distinction between real employer, aggregator and private poster; and
- scams are a recognized risk in attractive “easy money” job offers.

### Curated but tiny: jobicco

Strengths:

- Berlin/Brandenburg focus;
- manual screening;
- clear casual-job scope;
- bilingual site; and
- automatic expiry after 30 days.

Weaknesses:

- only 15 current visible listings in the observed snapshot;
- a table-like experience with little matching support;
- student-only positioning; and
- the 30-day freshness rule is already present, so it cannot be our headline USP.

### Transactional staffing: Zenjob and jobvalley

Strengths:

- real shift selection;
- one profile across jobs;
- operational handling and payroll;
- employer booking tools; and
- meaningful schedule flexibility.

Weaknesses relative to the proposed product:

- they are not neutral job boards; they operate temporary-employment or placement models;
- Zenjob is limited to full-time enrolled students, needs extensive identity, tax and insurance data, and says good German is required for most roles;
- onboarding is necessarily heavier; and
- app-store reviews directionally flag last-minute cancellations, penalties, communication and job-supply inconsistency. These reviews are anecdotes, not representative performance data.

### High volume, low focus: NebenJob

Strengths:

- explicit hourly pay and weekly-hour fields on many cards;
- free entry product for employers; and
- broad supply and employer products.

Weaknesses:

- observed search results mixed local work with paid surveys, fundraising travel, nationwide promotions and even 40–48 hour roles;
- commercial priority affects ranking; and
- it competes on inventory and promotion rather than a strict flexible-work truth contract.

### English-language discovery: EnglishJobs.de and Arbeitnow

Strengths:

- English-language discovery;
- simple search and current-looking feeds; and
- clear employer pricing.

Weaknesses:

- predominantly professional/technical/full-time positioning;
- little schedule-first exploration; and
- “English-speaking” is not the same as “entry-level flexible work with no German.”

### The open space

No observed product combines all of these as its core contract:

1. Berlin-only density;
2. schedule-first matching;
3. mandatory wage, hours and language clarity;
4. candidate-visible liveness verification;
5. employer identity and source provenance;
6. no-login job details;
7. direct, low-friction application; and
8. a clear separation between employment, staffing and self-employed gigs.

That combination is the opportunity. Any single feature is copyable; the operating discipline and trusted dataset are the moat.

## 4. The user problem, reduced to one sentence

> People seeking flexible work cannot quickly tell which nearby job is real, open and compatible with their actual week.

### Candidate jobs-to-be-done

- “Show me jobs I can physically and legally fit around the rest of my life.”
- “Tell me the pay before I invest time.”
- “Tell me whether my German is enough.”
- “Do not make me upload a CV just to see details.”
- “Do not send me to a dead application page.”
- “Help me understand the employment type without pretending to give personal legal advice.”

### Employer jobs-to-be-done

- “Help my specific shifts reach people who can actually work them.”
- “Let me post in minutes without learning recruitment software.”
- “Do not charge me €1,449 to hire one weekend employee.”
- “Reduce irrelevant applications and no-shows.”
- “Keep the ad correct without making me rewrite it everywhere.”

### The trust gap

The product should never claim that an employer is “good” merely because its identity is verified. Separate these states:

- **Identity verified:** the business exists and controls the stated domain/account.
- **Job source verified:** the employer authorized the listing or an approved feed supplied it.
- **Live checked:** the source and application route worked at the stated time.
- **Response measured:** based only on platform-observed or employer-reported data with a disclosed sample.
- **Candidate feedback:** later, after anti-retaliation and moderation systems exist.

Payment must never buy a truth label.

## 5. Recommended product experience

### Home screen

One question, one action:

> **When can you work?**  
> Morning · Afternoon · Evening · Night · Weekends

Then ask:

- hours per week;
- starting postcode or station and maximum travel time;
- minimum hourly wage;
- German level and other working languages; and
- preferred employment type.

Do not ask for an account, photo, date of birth, gender, marital status or full CV.

### Result card

Every card should expose:

```text
BARISTA · KREUZBERG
€15–16/h · 12–18h/week
Tue/Thu evenings + Sat
German B1 · English okay
18 min from Hermannplatz
Minijob or part-time
Checked 6h ago · Employer verified
```

Unknown fields remain **Not stated**. AI may extract; it may not invent.

### Job page

- plain-language role summary;
- source-authentic job description or authorized employer text;
- exact decision fields;
- original posting date and separate last-checked time;
- employer legal identity and website;
- application destination;
- “report this job” control;
- minijob/short-term/working-student explainer linked to official sources; and
- no login wall.

### Ranking promise

Default ranking should be:

1. hard availability match;
2. travel fit;
3. wage and hours fit;
4. liveness and completeness;
5. recency; then
6. labelled commercial promotion among otherwise eligible jobs.

Never let payment override a hard mismatch, expired status or trust failure. Publish a plain-language ranking explanation.

## 6. “Intelligent scraping” without building a legal and SEO liability

### The brave answer

Do not mass-scrape job portals.

The Court of Justice’s CV-Online Latvia decision dealt specifically with a specialist job-ad search engine that indexed and reused job-database content. EU/German database rights can apply even when pages are publicly accessible. German UrhG §87b also prohibits substantial extraction and repeated/systematic reuse that harms normal exploitation. UrhG §44b permits certain text-and-data-mining copies where rights are not reserved, but it is not a general licence to republish a competing job database.

Google also disallows job postings made on behalf of an organization without authorization and can take action against expired listings or scraped pages that add little value.

### Source policy

Use this order:

1. employer-submitted jobs;
2. employer-authorized ATS feeds or career-page imports;
3. public APIs or feeds whose terms expressly permit the intended use;
4. individual employer career pages after a source-specific rights and terms review; and
5. other job boards only under a written data/distribution agreement.

No source is publishable merely because it is public or has Schema.org markup.

### The intelligent part

The intelligence is in normalization and lifecycle control:

- discover authorized sources from sitemaps, feeds and structured data;
- extract only evidence-supported fields;
- keep the original text and extraction evidence internally;
- normalize titles, contract types, wages, schedules, locations and languages;
- deduplicate the same underlying vacancy across sources;
- run scam and policy checks;
- verify the source page and application endpoint daily;
- use source `validThrough` where reliable;
- hide automatically when the source disappears, closes or cannot be reconfirmed;
- notify Google’s Indexing API when a job page is added, updated or removed; and
- preserve a complete provenance and suppression log so deleted jobs do not resurrect.

The technical contract is in `03_MVP_AND_LAUNCH_PLAYBOOK.md`.

## 7. Business model

### What employers pay for

Employers should pay for measured distribution and workflow, not for truth.

| Product | Test price | What it buys |
|---|---:|---|
| Verified Basic | €0 | Authorized listing, mandatory structured fields, normal ranking, 14-day reconfirmation |
| Fast Fill | €79 / 14 days | Labelled placement among eligible jobs, alert distribution, performance report |
| Team | €149 / month | Up to five active roles, templates, team access, reconfirmation and response analytics |
| Concierge | €249 / role | Founder-assisted structuring, publication, owned-channel distribution and review |

No candidate fee. No display-ad clutter. No pay-to-hide bad feedback. No per-application charge until quality and duplicate/fraud controls are proven. No success fee in the first model.

### Revenue scenarios, not forecasts

| Paying mix | Monthly revenue scenario |
|---|---:|
| 25 Team accounts | €3,725 MRR |
| 25 Team accounts + 8 Concierge roles | €5,717 monthly revenue |
| 100 Team accounts | €14,900 MRR |
| 300 Team accounts | €44,700 MRR |

These numbers only show arithmetic. They say nothing about achievable acquisition, retention, staffing cost or margin. The paid pilot must establish willingness to pay.

### Why not charge immediately for every post?

jobicco charges €60 plus VAT for 30 days, EnglishJobs starts at €99 per month, Arbeitnow charges €199 per post, and broad boards charge much more. A new portal has no right to those prices before it has candidate attention. Free authorized supply creates density; paid distribution becomes credible only after the product can demonstrate qualified attention.

## 8. Launch strategy

### Phase 0: 21-day proof before building

The objective is not signups. It is proof of a two-sided transaction.

1. Interview 25 candidates in person using the script in `04_RESEARCH_AND_SALES_SCRIPTS.md`.
2. Interview 20 employers across the four launch categories.
3. Build a clickable or static result experience with 30 representative jobs; do not publish unauthorized scraped content.
4. Ask employers for written permission to publish a structured version of a real open job.
5. Get at least 10 employers into a live pilot and at least three to prepay €79.
6. Put 50 authorized jobs live in a thin concierge prototype.
7. Send real candidates through it and measure job-detail views, outbound applies and employer responses.

If the prepayment and authorized-supply gates fail, do not rationalize the result. Change the wedge or stop.

### Supply acquisition

Start founder-led and local:

- in-person employer visits in two or three dense job corridors;
- introductions through business associations, coworking operators and existing employer networks;
- employer-requested calls and demonstrations;
- QR-based two-minute posting form; and
- free structuring of the first listing in exchange for publication permission and feedback.

Do not build a cold-email machine. German UWG §7 generally requires prior express consent for advertising by electronic mail; even business telephone outreach needs at least presumed consent. Get qualified legal advice for the exact outreach process.

### Candidate acquisition

1. Consent-based WhatsApp, Telegram and email alerts built around availability, not generic newsletters.
2. Partnerships with student, international, language-school and neighborhood communities—only with admin permission.
3. In-person campus/community research that becomes the first trusted distribution loop.
4. Shareable job cards with wage, shift and location visible.
5. Google JobPosting structured data and the Indexing API.
6. Useful, dense landing pages only where real inventory exists, such as “weekend minijobs in Berlin with B1 German.”

Do not create hundreds of thin location/category pages. Google classifies scaled scraped pages without added value as spam.

### Geographic density

Test two or three real employment corridors rather than claiming all of Berlin on day one. Candidate travel time is part of the core value. Choose the corridors after employer interviews; plausible hypotheses include:

- Mitte/Friedrichshain/Kreuzberg for hospitality, events and retail;
- Neukölln/Tempelhof for retail, service and operations; and
- the Tempelhof/Schönefeld corridor for logistics and event peaks.

These are research hypotheses, not confirmed launch territories.

## 9. Metrics that decide whether this is a company

### North-star metric

**Verified employer responses to qualified applications per active job per week.**

Clicks are not the outcome. Applications without a response are not a solved problem.

### Supply health

- active authorized jobs;
- percentage checked within 24 hours;
- broken/expired application rate;
- duplicate rate;
- percentage with wage, hours, schedule, language and contract type;
- employer reconfirmation rate; and
- average live duration before fill/close.

### Candidate value

- time to first relevant job;
- search-to-detail rate;
- detail-to-apply rate;
- return rate within seven days;
- alert-to-apply rate; and
- job reports per 1,000 views.

### Employer value

- qualified applications per active job;
- median time to first qualified application;
- 24/48/72-hour response rate;
- percentage of jobs closed as filled;
- 30/60-day paid retention; and
- paid expansion from one role to Team.

### Trust guardrails

- confirmed scam incidents per 1,000 jobs;
- identity/source verification failures;
- unauthorized-publication complaints;
- candidate data deletion time; and
- number of paid listings that fail the quality floor. The correct target for the last metric is zero.

## 10. Contrarian views and failure modes

### The portal may be a feature, not a company

Schedule filters and freshness labels are copyable. The company only becomes defensible if it develops an authorized, normalized dataset, employer reconfirmation habits and measured response reliability.

### Employers may not pay before there is audience

This is the central commercial risk. The Concierge product can produce early service revenue, but it can also trap the founder in manual recruiting work. Time-box it and productize repeated tasks.

### Employers may refuse structured schedule data

Many roles have variable or negotiated schedules. If employers will not state a usable window, the core product becomes thin. “Flexible” is not an acceptable substitute for actual availability information.

### English-first may overpromise

Berlin is international, but many local customer-facing and operational jobs genuinely need German. Zenjob explicitly says good German is required for most roles. The product should expose language truth, not promise “no German” inventory it cannot sustain.

### Freshness conflicts with SEO inventory

Aggressive expiry produces fewer indexable pages and removes accumulated URLs. That is acceptable. Trust is the product. Preserve useful expired pages only as non-JobPosting archival information when they genuinely add value; otherwise return 404/410 and notify the Indexing API.

### External apply weakens outcome measurement

Direct employer application minimizes candidate data and friction, but the platform may not know who was interviewed or hired. Use consented click identifiers and employer status events; do not force a portal account merely for attribution.

### A staffing model has more value—and far more burden

Zenjob and jobvalley solve payroll and shift fulfilment, which is stronger than information discovery. Copying them would mean employment operations, worker supply, insurance, AÜG compliance and much higher working capital. Do not drift into that model accidentally.

### Intelligent matching can become regulated recruitment AI

Under the EU AI Act, AI used for recruitment, filtering and candidate evaluation is listed as high-risk; the current EU timeline says Annex III high-risk rules apply from December 2027 after the AI Omnibus agreement. The MVP should match user-selected hard constraints and avoid candidate scoring. Use AI for field extraction under human/policy control, not to decide who deserves work.

## 11. Legal and operational gates before public launch

This is a product-risk map, not legal advice.

- **Business model gate:** remain an information/distribution service; obtain specialist advice before employment placement fees, shift allocation, worker control, payroll or worker supply.
- **Source-rights gate:** written source policy, per-source approval and no mass portal scraping.
- **Privacy gate:** GDPR-compliant notices, minimization, retention, deletion and Article 14 assessment for any indirectly obtained personal data.
- **Job-content gate:** AGG-sensitive moderation and neutral language.
- **Platform gate:** DDG imprint/contact requirements, DSA notice-and-action process and clearly explained ranking/promotion.
- **Outreach gate:** consent and UWG-compliant employer/candidate communication.
- **Pay gate:** support salary/hourly ranges now; Germany had not completed national implementation of the EU Pay Transparency Directive by 1 September 2026, but the product should be ready for it.
- **AI gate:** no opaque candidate ranking; log every automated extraction and allow correction.
- **Scam gate:** domain/business verification, risky-link checks, no candidate payment, no pre-contract bank/ID collection, clear reporting and rapid takedown.
- **Accessibility gate:** keyboard, screen-reader, contrast, readable language and mobile usability from the first release; obtain advice on the exact BFSG scope.

## 12. The CEO decision and next move

### Build only if these 21-day gates pass

- 25 completed candidate interviews;
- 20 completed employer interviews;
- at least 10 employers authorize real listings;
- at least three employers prepay €79;
- at least 50 authorized jobs can be made live;
- at least 15 of 25 candidates can find a genuinely suitable job in under 90 seconds in the prototype; and
- at least 60% of pilot applications receive an employer response within 72 hours.

### Eight-week continuation gates

- 100 active authorized jobs;
- 80% of jobs with wage, hours, schedule, language and employment type complete;
- 90% checked in the previous 24 hours;
- less than 2% broken or expired apply attempts;
- at least 10 paying employers;
- at least three qualified applications per active paid job per 14 days; and
- at least 35% of paid pilot employers buy again within eight weeks.

If supply is plentiful but employers will not pay, operate as a candidate audience product only if another honest revenue path appears. If candidates like the interface but authorized supply is scarce, sell the structured posting/distribution workflow to employers instead. If neither side moves, stop.

## Open questions

1. Which two job categories produce the highest repeat employer demand and the lowest authorization friction?
2. Will employers state real shift windows and language levels?
3. Does the strongest early candidate segment turn out to be students, newcomers, second-income workers, parents or something else?
4. Will candidates prefer direct employer application or a reusable availability card?
5. Which source agreements can produce legitimate density without recreating another aggregator?
6. Is employer response-rate visibility persuasive enough to change behaviour?
7. Which working name passes trademark, company-name and domain clearance?

## Research method and limitations

- More than 40 current sources were reviewed across official statistics, primary law, official guidance, competitor product pages/pricing, search-result snapshots and directional user reviews.
- Official and primary sources control legal and statistical claims.
- Competitor counts are point-in-time snapshots and may contain duplicates or classification errors.
- Vendor surveys and app reviews are explicitly treated as directional, not neutral population estimates.
- No user interviews, employer interviews, live application tests, source permissions or willingness-to-pay tests were completed in this desk-research phase.
- Legal recommendations are conservative product gates, not qualified legal opinions.

## Rerun inputs

```yaml
workflow: firecrawl-deep-research
topic: Berlin flexible-work job portal covering minijobs, part-time, short-term and working-student roles
depth: exhaustive
output: founder brief plus execution packet
collection: built-in live web research fallback because FIRECRAWL_API_KEY was unavailable
research_date: 2026-09-01
geography: Berlin, Germany
```

Full links and source-quality notes are in `05_SOURCE_LEDGER.md`.
