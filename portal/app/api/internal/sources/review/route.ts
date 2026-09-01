import { z } from 'zod';
import { getD1 } from '@/db';
import { isAuthorizedIngestionRequest } from '@/lib/agents/auth';

const requestSchema = z.object({
  sourceId: z.string().min(1),
  sourceKind: z.enum(['direct_employer', 'specialist_board', 'large_board']),
  crawlPolicy: z.enum(['approved', 'blocked']),
  active: z.boolean(),
  reason: z.string().min(10).max(500),
  robotsObservedAt: z.iso.datetime().nullable().optional(),
  termsReviewedAt: z.iso.datetime().nullable().optional(),
});

export async function POST(request: Request) {
  if (!(await isAuthorizedIngestionRequest(request)))
    return Response.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });

  try {
    const body = requestSchema.parse(await request.json());
    if (
      body.crawlPolicy === 'approved' &&
      (!body.robotsObservedAt || !body.termsReviewedAt)
    )
      return Response.json(
        { ok: false, error: 'SOURCE_POLICY_EVIDENCE_REQUIRED' },
        { status: 400 },
      );
    const d1 = getD1();
    const before = await d1
      .prepare('SELECT * FROM sources WHERE id = ? LIMIT 1')
      .bind(body.sourceId)
      .first<Record<string, unknown>>();
    if (!before)
      return Response.json(
        { ok: false, error: 'SOURCE_NOT_FOUND' },
        { status: 404 },
      );

    const active = body.crawlPolicy === 'approved' && body.active ? 1 : 0;
    const reviewedAt = new Date().toISOString();
    await d1.batch([
      d1
        .prepare(
          `UPDATE sources
           SET source_kind = ?, crawl_policy = ?, active = ?,
               robots_observed_at = ?, terms_reviewed_at = ?, updated_at = ?
           WHERE id = ?`,
        )
        .bind(
          body.sourceKind,
          body.crawlPolicy,
          active,
          body.robotsObservedAt ?? null,
          body.termsReviewedAt ?? null,
          reviewedAt,
          body.sourceId,
        ),
      d1
        .prepare(
          `INSERT INTO audit_events
            (id, entity_type, entity_id, actor_type, actor_id,
             action, reason, before_json, after_json)
           VALUES (?, 'source', ?, 'human', 'internal_source_reviewer',
                   'source_policy_reviewed', ?, ?, ?)`,
        )
        .bind(
          crypto.randomUUID(),
          body.sourceId,
          body.reason,
          JSON.stringify(before),
          JSON.stringify({ ...body, active, reviewedAt }),
        ),
    ]);

    return Response.json({
      ok: true,
      result: {
        sourceId: body.sourceId,
        sourceKind: body.sourceKind,
        crawlPolicy: body.crawlPolicy,
        active: Boolean(active),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    return Response.json(
      { ok: false, error: message.split(':')[0] },
      { status: 400 },
    );
  }
}
