import { getD1 } from '@/db';
import { industryNiches, roleFamilies } from '@/lib/domain/taxonomy';
import { sha256, type SourceCandidate } from './firecrawl';

export type ApprovedSource = {
  id: string;
  canonicalUrl: string;
  name: string;
  sourceKind:
    | 'unclassified'
    | 'direct_employer'
    | 'specialist_board'
    | 'large_board';
  crawlPolicy: 'approved' | 'review_required' | 'blocked';
  active: number;
};

export type StoredObservation = {
  id: string;
  extractionJson: string | null;
  groundingJson: string | null;
};

export async function ensureTaxonomySeeded() {
  const d1 = getD1();
  const nicheStatements = industryNiches.map((item) =>
    d1
      .prepare(
        `INSERT OR IGNORE INTO niches
          (id, label, label_de, description, source_target, priority, active)
         VALUES (?, ?, ?, ?, ?, ?, 1)`,
      )
      .bind(
        item.id,
        item.label,
        item.labelDe,
        item.description,
        item.sourceTarget,
        item.priority,
      ),
  );
  const roleStatements = roleFamilies.map(([id, label]) =>
    d1
      .prepare(
        `INSERT OR IGNORE INTO role_families (id, label, active)
         VALUES (?, ?, 1)`,
      )
      .bind(id, label),
  );
  await d1.batch([...nicheStatements, ...roleStatements]);
}

export async function registerSourceCandidates(input: {
  nicheId: string;
  candidates: SourceCandidate[];
}) {
  await ensureTaxonomySeeded();
  const d1 = getD1();
  const registered: Array<{ id: string; url: string; state: string }> = [];

  for (const candidate of input.candidates) {
    const proposedId = `src_${(await sha256(candidate.url)).slice(0, 20)}`;
    let hostname = candidate.url;
    try {
      hostname = new URL(candidate.url).hostname.replace(/^www\./, '');
    } catch {
      // URL safety was already checked before this repository boundary.
    }

    await d1
      .prepare(
        `INSERT OR IGNORE INTO sources
          (id, canonical_url, name, source_kind, discovery_method,
           crawl_policy, check_interval_minutes, active)
         VALUES (?, ?, ?, 'unclassified', ?, 'review_required', 10080, 0)`,
      )
      .bind(
        proposedId,
        candidate.url,
        candidate.title?.trim() || hostname,
        `niche_agent:${input.nicheId}`,
      )
      .run();

    const source = await d1
      .prepare(
        `SELECT id, crawl_policy AS crawlPolicy
         FROM sources WHERE canonical_url = ? LIMIT 1`,
      )
      .bind(candidate.url)
      .first<{ id: string; crawlPolicy: string }>();
    if (!source) continue;

    await d1
      .prepare(
        `INSERT OR IGNORE INTO source_niches
          (source_id, niche_id, confidence_basis)
         VALUES (?, ?, ?)`,
      )
      .bind(
        source.id,
        input.nicheId,
        `Discovered by ${input.nicheId}; human source review required.`,
      )
      .run();
    registered.push({
      id: source.id,
      url: candidate.url,
      state: source.crawlPolicy,
    });
  }

  return registered;
}

export async function getApprovedSource(input: {
  sourceId: string;
  nicheId: string;
}) {
  const row = await getD1()
    .prepare(
      `SELECT
         s.id,
         s.canonical_url AS canonicalUrl,
         s.name,
         s.source_kind AS sourceKind,
         s.crawl_policy AS crawlPolicy,
         s.active
       FROM sources s
       INNER JOIN source_niches sn ON sn.source_id = s.id
       WHERE s.id = ? AND sn.niche_id = ?
       LIMIT 1`,
    )
    .bind(input.sourceId, input.nicheId)
    .first<ApprovedSource>();
  if (!row) throw new Error('SOURCE_NOT_REGISTERED_FOR_NICHE');
  if (row.crawlPolicy !== 'approved' || !row.active)
    throw new Error('SOURCE_NOT_APPROVED');
  return row;
}

export async function startIngestionRun(input: {
  sourceId: string | null;
  nicheId: string;
  agent: 'scout' | 'pipeline';
  trigger: 'scheduled' | 'manual' | 'webhook';
}) {
  const id = crypto.randomUUID();
  await getD1()
    .prepare(
      `INSERT INTO ingestion_runs
        (id, source_id, niche_id, agent, trigger, state)
       VALUES (?, ?, ?, ?, ?, 'running')`,
    )
    .bind(id, input.sourceId, input.nicheId, input.agent, input.trigger)
    .run();
  return id;
}

export async function finishIngestionRun(input: {
  runId: string;
  state: 'succeeded' | 'partial' | 'failed';
  discoveredCount?: number;
  acceptedCount?: number;
  rejectedCount?: number;
  exceptionCount?: number;
  errorCode?: string | null;
  errorDetail?: string | null;
}) {
  await getD1()
    .prepare(
      `UPDATE ingestion_runs
       SET state = ?, finished_at = ?, discovered_count = ?, accepted_count = ?,
           rejected_count = ?, exception_count = ?, error_code = ?, error_detail = ?
       WHERE id = ?`,
    )
    .bind(
      input.state,
      new Date().toISOString(),
      input.discoveredCount ?? 0,
      input.acceptedCount ?? 0,
      input.rejectedCount ?? 0,
      input.exceptionCount ?? 0,
      input.errorCode ?? null,
      input.errorDetail?.slice(0, 1_000) ?? null,
      input.runId,
    )
    .run();
}

export async function findObservation(sourceUrl: string, contentHash: string) {
  return getD1()
    .prepare(
      `SELECT id, extraction_json AS extractionJson,
              grounding_json AS groundingJson
       FROM observations
       WHERE source_url = ? AND content_hash = ?
       LIMIT 1`,
    )
    .bind(sourceUrl, contentHash)
    .first<StoredObservation>();
}

export async function touchObservation(
  id: string,
  input: { fetchedAt: string; cacheState: string | null; rawObjectKey: string },
) {
  await getD1()
    .prepare(
      `UPDATE observations
       SET last_seen_at = ?, cache_state = ?, raw_object_key = ?,
           seen_count = seen_count + 1
       WHERE id = ?`,
    )
    .bind(input.fetchedAt, input.cacheState, input.rawObjectKey, id)
    .run();
}
