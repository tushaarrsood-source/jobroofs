# KIEZJOB ingestion architecture

Status: implemented core, credentialed source run pending  
Date: 1 September 2026

## Product decision

KIEZJOB has 30 niche agents, but they are **30 isolated profiles on one shared truth engine**.

Each niche profile owns:

- its category definition;
- Berlin-specific German and English discovery terms;
- its approved source relationships;
- its discovery and monitoring cadence;
- its source-coverage target;
- its queue and run metrics; and
- its instructions for accepting, rejecting or reviewing a candidate.

The profiles do not own separate codebases, databases or model memories. That would multiply bugs and make accuracy inconsistent. All profiles use the same retrieval, extraction, evidence, deduplication and publication gates.

The public category page never runs an agent while a candidate is browsing. It reads already verified jobs from the database.

## Public homepage order

```text
Search and filters
  -> Direct employer listings
  -> 30 category pages
  -> Latest verified jobs from both inventory streams
```

Public queries must include only `publication_state = published` and `expires_at > now`.

## Evidence pipeline

```text
Niche Scout
  -> source candidate (never automatically approved)
  -> human crawl-policy and source-kind decision
  -> approved source monitor
  -> Firecrawl page retrieval
  -> SHA-256 change check
  -> immutable R2 source snapshot
  -> Gemini structured extraction proposal
  -> Zod schema validation
  -> deterministic quote-location verification
  -> Berlin, flexible-work, niche, age and completeness gates
  -> D1 normalized job + field evidence
  -> internal review
  -> explicit publication
```

### Firecrawl's role

Firecrawl retrieves approved public pages and discovers candidate URLs. It does not decide truth, source approval or publication. The generic extractor receives Markdown and outbound links. Unchanged content is identified by SHA-256 and is not sent through Gemini again.

### Gemini's role

Gemini produces a JSON proposal using a closed schema and closed taxonomy. It must return a short verbatim source quote for every populated fact or classification. It is explicitly instructed to treat page content as untrusted data and to return `null`, `[]` or `not_stated` when a fact is absent.

Gemini never writes to the public job table and never publishes a listing.

### Deterministic verifier's role

Code checks that every claimed quote exists in the retrieved page and records its Markdown line locator. Invalid URLs, invalid emails, reversed pay ranges, reversed hour ranges, missing critical evidence and niche conflicts fail closed. A source page can be retained for review without becoming a public job.

## Storage format

### R2: immutable source evidence

Object key:

```text
job-pages/{source_id}/{sha256_content_hash}.json
```

Snapshot:

```json
{
  "schemaVersion": "job-evidence.v1",
  "sourceId": "src_...",
  "sourceUrl": "https://employer.example/jobs/123",
  "fetchedAt": "2026-09-01T10:00:00.000Z",
  "contentHash": "sha256...",
  "cacheState": "live",
  "cachedAt": null,
  "metadata": {},
  "links": [],
  "markdown": "verbatim retrieved page"
}
```

R2 is internal evidence storage. Raw copied page content is not the public listing.

### D1: searchable truth and workflow state

| Table | Purpose |
|---|---|
| `niches` | 30 public categories and coverage targets |
| `sources` | source identity, kind, crawl policy, cadence and health |
| `source_niches` | which niche agents may use each source |
| `ingestion_runs` | per-agent run state, counts, errors and cost |
| `observations` | URL, hash, timestamps, R2 key, extraction and grounding result |
| `jobs` | normalized current candidate-facing facts |
| `job_niches` | primary category with source evidence |
| `field_evidence` | field, verbatim quote and exact snapshot locator |
| `audit_events` | who or what changed a source, job or publication state |

Important formats:

- money values are numeric minimum and maximum plus currency;
- `rate_interval` is separate from `payout_cadence`;
- hours are numeric minimum and maximum plus period;
- dates use ISO 8601 when normalized and retain the original quote;
- lists are JSON arrays in D1 until query volume justifies child tables;
- raw pages never become the canonical job record;
- missing facts remain missing and render as `Not stated`;
- one canonical source URL identifies one vacancy across content updates.

## Niche-agent cadence

- New-source discovery: weekly for every niche.
- Approved launch-category monitoring: every 3 hours by default.
- Expansion categories: every 6 hours.
- Watch categories: every 12 hours.
- Productive ATS feeds or urgent event sources can later receive a 1–2 hour adapter.

A single weekly run cannot support a credible freshness advantage. Weekly discovery plus frequent monitoring can.

## Source approval boundary

Every newly discovered URL starts as:

```text
source_kind = unclassified
crawl_policy = review_required
active = false
```

Only an internal source-policy decision can change it to approved and active. Large boards remain secondary and must not be disguised as direct-employer inventory.

## Publication boundary

The pipeline may mark a record `publishable`; it does not mark it `published`. A public listing still requires the explicit publication gate. Sourced jobs without a live original application destination, jobs older than 30 days, and jobs without proven Berlin/flexible-work eligibility cannot publish.

## Internal endpoints

- `POST /api/internal/ingestion/discover` runs one niche Scout rotation.
- `POST /api/internal/ingestion/process` processes one job URL from one approved source and niche.
- `POST /api/internal/sources/review` records the human source-kind and crawl-policy decision.
- Both require `Authorization: Bearer {INGESTION_API_KEY}`.
- `/api/health` exposes configuration readiness without exposing secrets.

## Local credentials

Place server-only values in `portal/.env.local`; never paste them into a browser or commit them.

```text
FIRECRAWL_API_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.7-flash
INGESTION_API_KEY=
```

## First live proof

1. Add the three secrets locally.
2. Select one direct employer source in Gastronomy.
3. Review its crawl and publication policy.
4. Mark that source approved and active in the internal registry.
5. Process one current Berlin flexible-work job page.
6. Compare every structured field against its saved quote and snapshot.
7. Keep the result in review; do not publish it.

After this passes, build a 100-page labelled gold set before allowing any automatic `publishable` decision at scale.
