import { getFirecrawlReadiness } from '@/lib/agents/firecrawl';
import { getGeminiReadiness } from '@/lib/agents/gemini';
import { getEvidenceStoreReadiness } from '@/lib/agents/evidence-store';
import { getIngestionAuthReadiness } from '@/lib/agents/auth';
import { nicheAgentProfiles } from '@/lib/agents/niche-agents';

export async function GET() {
  return Response.json({
    ok: true,
    service: 'kiezjob-portal',
    publication: 'locked',
    database: 'schema_ready',
    retrieval: getFirecrawlReadiness(),
    extraction: getGeminiReadiness(),
    evidenceStore: getEvidenceStoreReadiness(),
    internalAuth: getIngestionAuthReadiness(),
    nicheAgents: nicheAgentProfiles.length,
  });
}
