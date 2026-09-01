import { discoverDirectSourceCandidates } from './firecrawl';
import { chooseDiscoveryTerm, getNicheAgentProfile } from './niche-agents';
import {
  ensureTaxonomySeeded,
  finishIngestionRun,
  registerSourceCandidates,
  startIngestionRun,
} from './repository';

export async function runNicheDiscovery(input: {
  nicheId: string;
  limit?: number;
  trigger?: 'scheduled' | 'manual' | 'webhook';
}) {
  const profile = getNicheAgentProfile(input.nicheId);
  if (!profile) throw new Error('UNKNOWN_NICHE_AGENT');
  await ensureTaxonomySeeded();
  const runId = await startIngestionRun({
    sourceId: null,
    nicheId: profile.id,
    agent: 'scout',
    trigger: input.trigger ?? 'manual',
  });

  try {
    const queryTerm = chooseDiscoveryTerm(profile);
    const candidates = await discoverDirectSourceCandidates({
      nicheLabel: profile.label,
      queryTerm,
      limit: input.limit,
    });
    const registered = await registerSourceCandidates({
      nicheId: profile.id,
      candidates,
    });
    await finishIngestionRun({
      runId,
      state: 'succeeded',
      discoveredCount: registered.length,
    });
    return {
      runId,
      agentKey: profile.agentKey,
      queryTerm,
      candidates: registered,
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    await finishIngestionRun({
      runId,
      state: 'failed',
      exceptionCount: 1,
      errorCode: detail.split(':')[0],
      errorDetail: detail,
    });
    throw error;
  }
}
