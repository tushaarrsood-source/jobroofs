import type { MetadataRoute } from 'next';
import { industryNiches } from '@/lib/domain/taxonomy';
import { previewJobs } from '@/lib/domain/preview-data';
import { ALL_SOURCED_JOBS } from '@/lib/sources/sourced-jobs';
import { getD1 } from '@/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://jobroofs.com';
  const now = new Date();

  const makeAlternates = (path: string) => ({
    languages: {
      'de-DE': `${baseUrl}${path}`,
      'en-US': `${baseUrl}${path}`,
      'x-default': `${baseUrl}${path}`,
    },
  });

  // Core static & navigation pages
  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  }> = [
    { path: '', priority: 1.0, changeFrequency: 'hourly' },
    { path: '/post-a-job', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/impressum', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/datenschutz', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/agb', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/disclaimer', priority: 0.3, changeFrequency: 'monthly' },
  ];

  const staticPages: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    alternates: makeAlternates(r.path),
  }));

  // All category pages
  const categoryPages: MetadataRoute.Sitemap = industryNiches.map((niche) => ({
    url: `${baseUrl}/categories/${niche.id}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.85,
    alternates: makeAlternates(`/categories/${niche.id}`),
  }));

  // Job detail pages (Curated + Sourced + DB)
  const jobIds = new Map<string, Date>();
  previewJobs.forEach((job) => {
    const key = job.slug || job.id;
    jobIds.set(key, now);
  });
  ALL_SOURCED_JOBS.forEach((job) => {
    const key = job.slug || job.id;
    if (!jobIds.has(key)) {
      jobIds.set(key, now);
    }
  });

  try {
    const d1 = getD1();
    const rows = await d1
      .prepare(`SELECT id, last_verified_at FROM jobs WHERE publication_state = 'published' LIMIT 500`)
      .all<any>();
    if (rows && rows.results) {
      rows.results.forEach((row: any) => {
        const date = row.last_verified_at ? new Date(row.last_verified_at) : now;
        jobIds.set(row.id, date);
      });
    }
  } catch {
    // Graceful fallback
  }

  const jobPages: MetadataRoute.Sitemap = Array.from(jobIds.entries()).map(
    ([id, date]) => ({
      url: `${baseUrl}/jobs/${id}`,
      lastModified: date,
      changeFrequency: 'daily' as const,
      priority: 0.9,
      alternates: makeAlternates(`/jobs/${id}`),
    }),
  );

  return [...staticPages, ...categoryPages, ...jobPages];
}
