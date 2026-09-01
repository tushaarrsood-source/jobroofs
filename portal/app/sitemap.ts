import type { MetadataRoute } from 'next';
import { industryNiches } from '@/lib/domain/taxonomy';
import { previewJobs } from '@/lib/domain/preview-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kiezjob.de';
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/latest-jobs`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/direct-employers`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/post-a-job`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // All 30 category pages
  const categoryPages: MetadataRoute.Sitemap = industryNiches.map((niche) => ({
    url: `${baseUrl}/categories/${niche.id}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Job detail pages — in production query DB for active published jobs
  // For now, use preview/demo jobs as placeholders
  const jobPages: MetadataRoute.Sitemap = previewJobs.map((job) => ({
    url: `${baseUrl}/jobs/${job.slug || job.id}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // TODO: When DB is live, replace previewJobs with:
  // const db = getDb();
  // const activeJobs = await db.select({ id: jobs.id, updatedAt: jobs.updatedAt })
  //   .from(jobs)
  //   .where(and(eq(jobs.publicationState, 'published'), gt(jobs.expiresAt, now)));
  // const jobPages = activeJobs.map(job => ({
  //   url: `${baseUrl}/jobs/${job.id}`,
  //   lastModified: job.updatedAt,
  //   changeFrequency: 'daily',
  //   priority: 0.9,
  // }));

  return [...staticPages, ...categoryPages, ...jobPages];
}
