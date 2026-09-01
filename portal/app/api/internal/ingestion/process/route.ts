import { z } from 'zod';
import { isAuthorizedIngestionRequest } from '@/lib/agents/auth';
import { processApprovedJobPage } from '@/lib/agents/pipeline';

const requestSchema = z.object({
  nicheId: z.string().min(1),
  sourceId: z.string().min(1),
  jobUrl: z.url(),
  maxAgeMs: z.number().int().min(0).max(86_400_000).optional(),
  forceReextract: z.boolean().optional(),
});

export async function POST(request: Request) {
  if (!(await isAuthorizedIngestionRequest(request)))
    return Response.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });

  try {
    const body = requestSchema.parse(await request.json());
    const result = await processApprovedJobPage({ ...body, trigger: 'manual' });
    return Response.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    const clientErrors = new Set([
      'SOURCE_NOT_REGISTERED_FOR_NICHE',
      'SOURCE_NOT_APPROVED',
      'SOURCE_URL_NOT_PUBLIC_HTTP',
      'JOB_URL_OUTSIDE_APPROVED_SOURCE_HOST',
    ]);
    const code = message.split(':')[0];
    return Response.json(
      { ok: false, error: code },
      { status: clientErrors.has(code) ? 400 : 500 },
    );
  }
}
