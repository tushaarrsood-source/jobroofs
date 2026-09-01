import { getD1 } from '@/db';

export type PublicJobRow = {
  id: string;
  title: string;
  company: string;
  district: string | null;
  postcode: string | null;
  listingOrigin: 'employer_posted' | 'sourced';
  payText: string | null;
  hoursLabel: string;
  scheduleSummary: string;
  firstSeenAt: string;
  lastVerifiedAt: string;
};

const publicSelect = `SELECT
  j.id,
  j.title,
  j.company,
  j.district,
  j.postcode,
  j.listing_origin AS listingOrigin,
  j.pay_text AS payText,
  j.hours_label AS hoursLabel,
  j.schedule_summary AS scheduleSummary,
  j.first_seen_at AS firstSeenAt,
  j.last_verified_at AS lastVerifiedAt
FROM jobs j`;

export async function getHomepageFeeds(now = new Date()) {
  try {
    const d1 = getD1();
    const isoNow = now.toISOString();
    const [direct, latest] = await Promise.all([
      d1
        .prepare(
          `${publicSelect}
           WHERE j.publication_state = 'published'
             AND j.expires_at > ?
             AND j.listing_origin = 'employer_posted'
           ORDER BY j.first_seen_at DESC
           LIMIT 12`,
        )
        .bind(isoNow)
        .all<PublicJobRow>(),
      d1
        .prepare(
          `${publicSelect}
           WHERE j.publication_state = 'published'
             AND j.expires_at > ?
           ORDER BY j.first_seen_at DESC
           LIMIT 6`,
        )
        .bind(isoNow)
        .all<PublicJobRow>(),
    ]);
    return { direct: direct.results || [], latest: latest.results || [] };
  } catch {
    return { direct: [], latest: [] };
  }
}

export async function getAllDirectJobs(now = new Date()) {
  try {
    const d1 = getD1();
    const res = await d1
      .prepare(
        `${publicSelect}
         WHERE j.publication_state = 'published'
           AND j.expires_at > ?
           AND j.listing_origin = 'employer_posted'
         ORDER BY j.first_seen_at DESC
         LIMIT 200`,
      )
      .bind(now.toISOString())
      .all<PublicJobRow>();
    return res.results || [];
  } catch {
    return [];
  }
}

export async function getAllLatestJobs(now = new Date()) {
  try {
    const d1 = getD1();
    const res = await d1
      .prepare(
        `${publicSelect}
         WHERE j.publication_state = 'published'
           AND j.expires_at > ?
         ORDER BY j.first_seen_at DESC
         LIMIT 200`,
      )
      .bind(now.toISOString())
      .all<PublicJobRow>();
    return res.results || [];
  } catch {
    return [];
  }
}

export async function getCategoryJobs(nicheId: string, now = new Date()) {
  try {
    const res = await getD1()
      .prepare(
        `${publicSelect}
         INNER JOIN job_niches jn ON jn.job_id = j.id
         WHERE j.publication_state = 'published'
           AND j.expires_at > ?
           AND jn.niche_id = ?
         ORDER BY j.first_seen_at DESC
         LIMIT 100`,
      )
      .bind(now.toISOString(), nicheId)
      .all<PublicJobRow>();
    return res.results || [];
  } catch {
    return [];
  }
}

import * as schema from '@/db/schema';
import { getDb } from '@/db';
import { eq } from 'drizzle-orm';

export type JobDetail = typeof schema.jobs.$inferSelect & {
  sourceUrl?: string | null;
  fetchedAt?: string | null;
  sourceName?: string | null;
};

export async function getJobById(jobId: string): Promise<JobDetail | null> {
  try {
    const d1 = getD1();
    const db = getDb();
    
    const jobs = await db.select().from(schema.jobs).where(eq(schema.jobs.id, jobId)).limit(1);
    if (!jobs.length) return null;
    const job = jobs[0];
    
    let sourceInfo = null;
    if (job.currentObservationId) {
      sourceInfo = await d1.prepare('SELECT source_url as sourceUrl, fetched_at as fetchedAt FROM observations WHERE id = ?').bind(job.currentObservationId).first<{ sourceUrl: string; fetchedAt: string }>();
    }
    
    return { ...job, sourceUrl: sourceInfo?.sourceUrl, fetchedAt: sourceInfo?.fetchedAt };
  } catch {
    return null;
  }
}

export async function getJobNiches(jobId: string): Promise<Array<{ nicheId: string; isPrimary: boolean; label: string }>> {
  try {
    const d1 = getD1();
    const res = await d1.prepare(`
      SELECT jn.niche_id as nicheId, jn.is_primary as isPrimary, n.label
      FROM job_niches jn
      JOIN niches n ON jn.niche_id = n.id
      WHERE jn.job_id = ?
    `).bind(jobId).all<{ nicheId: string; isPrimary: boolean; label: string }>();
    return res.results || [];
  } catch {
    return [];
  }
}

export async function getJobEvidence(jobId: string): Promise<Array<{ fieldName: string; verbatimEvidence: string; evidenceLocator: string | null; extractionMethod: string }>> {
  try {
    const d1 = getD1();
    const res = await d1.prepare(`
      SELECT field_name as fieldName, verbatim_evidence as verbatimEvidence, evidence_locator as evidenceLocator, extraction_method as extractionMethod
      FROM field_evidence
      WHERE job_id = ?
    `).bind(jobId).all<{ fieldName: string; verbatimEvidence: string; evidenceLocator: string | null; extractionMethod: string }>();
    return res.results || [];
  } catch {
    return [];
  }
}

export async function getJobSourceInfo(jobId: string): Promise<{ sourceUrl: string; fetchedAt: string; sourceName: string } | null> {
  try {
    const d1 = getD1();
    const res = await d1.prepare(`
      SELECT o.source_url as sourceUrl, o.fetched_at as fetchedAt, s.name as sourceName
      FROM jobs j
      JOIN observations o ON j.current_observation_id = o.id
      JOIN sources s ON j.source_id = s.id
      WHERE j.id = ?
    `).bind(jobId).first<{ sourceUrl: string; fetchedAt: string; sourceName: string }>();
    return res || null;
  } catch {
    return null;
  }
}
