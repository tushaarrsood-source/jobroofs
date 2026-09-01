import { env } from 'cloudflare:workers';

export type EvidenceSnapshot = {
  schemaVersion: 'job-evidence.v1';
  sourceId: string;
  sourceUrl: string;
  fetchedAt: string;
  contentHash: string;
  cacheState: string | null;
  cachedAt: string | null;
  metadata: Record<string, unknown>;
  links: string[];
  markdown: string;
};

export function getEvidenceStoreReadiness() {
  return {
    configured: Boolean(env.EVIDENCE),
    binding: 'EVIDENCE',
    mode: env.EVIDENCE ? 'immutable_snapshots' : 'fail_closed',
  } as const;
}

export async function putEvidenceSnapshot(snapshot: EvidenceSnapshot) {
  const bucket = env.EVIDENCE;
  if (!bucket) throw new Error('EVIDENCE_BUCKET_NOT_CONFIGURED');

  const key = `job-pages/${safeSegment(snapshot.sourceId)}/${snapshot.contentHash}.json`;
  const existing = await bucket.head(key);
  if (!existing) {
    await bucket.put(key, JSON.stringify(snapshot), {
      httpMetadata: { contentType: 'application/json; charset=utf-8' },
      customMetadata: {
        schemaVersion: snapshot.schemaVersion,
        sourceId: safeSegment(snapshot.sourceId),
        contentHash: snapshot.contentHash,
      },
      onlyIf: { etagDoesNotMatch: '*' },
    });
  }
  return key;
}

function safeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 100);
}
