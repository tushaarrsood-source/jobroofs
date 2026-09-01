import { NextResponse } from 'next/server';
import { getNichesDueForDiscovery, getSourcesDueForMonitoring, markDiscoveryComplete } from '@/lib/agents/scheduler';
import { processApprovedJobPage } from '@/lib/agents/pipeline';
import { isAuthorizedIngestionRequest } from '@/lib/agents/auth';
import { getD1 } from '@/db';

export const maxDuration = 300; // 5 mins

export async function GET(request: Request) {
  // Check authorization
  const cfCronHeader = request.headers.get('CF-Cron');
  if (!cfCronHeader && !isAuthorizedIngestionRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const summary = {
    nichesDiscovered: 0,
    sourcesProcessed: 0,
    errors: [] as string[]
  };

  try {
    // 1. Discovery
    const nichesDue = await getNichesDueForDiscovery(now);
    
    for (const nicheId of nichesDue) {
      try {
        await markDiscoveryComplete(nicheId, now);
        summary.nichesDiscovered++;
      } catch (err) {
        summary.errors.push(`Failed discovery for niche ${nicheId}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // 2. Monitoring
    const db = getD1();
    const { results: activeNiches } = await db.prepare('SELECT id FROM niches WHERE active = 1').all<{id: string}>();

    for (const niche of activeNiches) {
      try {
        const sourcesDue = await getSourcesDueForMonitoring(niche.id, now);
        
        // Process in batches of 5
        const batchSize = 5;
        for (let i = 0; i < sourcesDue.length; i += batchSize) {
          const batch = sourcesDue.slice(i, i + batchSize);
          await Promise.allSettled(batch.map(async (source) => {
            await processApprovedJobPage({
              sourceId: source.id,
              nicheId: niche.id,
              jobUrl: source.canonicalUrl,
              trigger: 'scheduled'
            });
            summary.sourcesProcessed++;
          }));
        }
      } catch (err) {
        summary.errors.push(`Failed monitoring for niche ${niche.id}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    return NextResponse.json({ success: true, summary });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : String(err), summary }, { status: 500 });
  }
}
