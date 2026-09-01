import { z } from 'zod';
import { isAuthorizedIngestionRequest } from '@/lib/agents/auth';
import { runNicheDiscovery } from '@/lib/agents/discovery';

const requestSchema = z.object({
  nicheId: z.string().min(1),
  limit: z.number().int().min(1).max(25).optional(),
});

export async function POST(request: Request) {
  if (!(await isAuthorizedIngestionRequest(request)))
    return Response.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });

  try {
    const body = requestSchema.parse(await request.json());
    const result = await runNicheDiscovery({ ...body, trigger: 'manual' });
    return Response.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    const status = message === 'UNKNOWN_NICHE_AGENT' ? 400 : 500;
    return Response.json(
      { ok: false, error: message.split(':')[0] },
      { status },
    );
  }
}
