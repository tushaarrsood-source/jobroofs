import { getD1 } from '@/db';

export async function getNichesDueForDiscovery(now: Date): Promise<string[]> {
  const db = getD1();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  const { results } = await db.prepare(`
    SELECT n.id 
    FROM niches n
    LEFT JOIN (
      SELECT niche_id, MAX(started_at) as last_run
      FROM ingestion_runs
      WHERE agent = 'scout'
      GROUP BY niche_id
    ) r ON n.id = r.niche_id
    WHERE n.active = 1 
      AND (r.last_run IS NULL OR r.last_run < ?)
    ORDER BY 
      CASE n.priority 
        WHEN 'launch' THEN 1 
        WHEN 'expand' THEN 2 
        WHEN 'watch' THEN 3 
        ELSE 4 
      END,
      r.last_run ASC
  `).bind(oneWeekAgo).all<{ id: string }>();

  return results.map((r) => r.id);
}

export async function getSourcesDueForMonitoring(nicheId: string, now: Date): Promise<Array<{ id: string; canonicalUrl: string; adapterKey: string | null; sourceFormat: string; checkIntervalMinutes: number }>> {
  const db = getD1();
  
  const { results } = await db.prepare(`
    SELECT 
      s.id, 
      s.canonical_url as canonicalUrl, 
      s.adapter_key as adapterKey, 
      s.discovery_method as sourceFormat, 
      s.check_interval_minutes as checkIntervalMinutes
    FROM sources s
    JOIN source_niches sn ON s.id = sn.source_id
    WHERE sn.niche_id = ?
      AND s.crawl_policy = 'approved'
      AND s.active = 1
      AND (s.last_checked_at IS NULL OR datetime(s.last_checked_at, '+' || s.check_interval_minutes || ' minutes') <= ?)
  `).bind(nicheId, now.toISOString()).all<{ id: string; canonicalUrl: string; adapterKey: string | null; sourceFormat: string; checkIntervalMinutes: number }>();

  return results;
}

export async function markDiscoveryComplete(nicheId: string, now: Date): Promise<void> {
  const db = getD1();
  const runId = crypto.randomUUID();
  
  await db.prepare(`
    INSERT INTO ingestion_runs (id, niche_id, agent, trigger, state, started_at, finished_at)
    VALUES (?, ?, 'scout', 'scheduled', 'succeeded', ?, ?)
  `).bind(runId, nicheId, now.toISOString(), now.toISOString()).run();
}
