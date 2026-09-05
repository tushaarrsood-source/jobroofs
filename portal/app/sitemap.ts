import type { MetadataRoute } from 'next';
import { industryNiches } from '@/lib/domain/taxonomy';
import { previewJobs } from '@/lib/domain/preview-data';
import { previewHousingListings } from '@/lib/domain/preview-housing';
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
    { path: '/wohnen', priority: 0.95, changeFrequency: 'hourly' },
    { path: '/karte', priority: 0.9, changeFrequency: 'daily' },
    { path: '/latest-jobs', priority: 0.9, changeFrequency: 'hourly' },
    { path: '/direct-employers', priority: 0.9, changeFrequency: 'daily' },
    { path: '/wohnen/list', priority: 0.85, changeFrequency: 'daily' },
    { path: '/post-a-job', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/pricing', priority: 0.8, changeFrequency: 'weekly' },
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

  // All 30 category pages
  const categoryPages: MetadataRoute.Sitemap = industryNiches.map((niche) => ({
    url: `${baseUrl}/categories/${niche.id}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.85,
    alternates: makeAlternates(`/categories/${niche.id}`),
  }));

  // Job detail pages (Curated + DB)
  const jobIds = new Map<string, Date>();
  previewJobs.forEach((job) => {
    const key = job.slug || job.id;
    jobIds.set(key, now);
  });

  try {
    const d1 = getD1();
    const rows = await d1
      .prepare(`SELECT id, last_verified_at, first_seen_at FROM jobs WHERE publication_state = 'published' LIMIT 500`)
      .all<any>();
    if (rows && rows.results) {
      rows.results.forEach((row: any) => {
        const date = row.last_verified_at ? new Date(row.last_verified_at) : now;
        jobIds.set(row.id, date);
      });
    }
  } catch {
    // Graceful fallback to curated entries
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

  // Housing detail pages (Curated + DB)
  const housingIds = new Map<string, Date>();
  previewHousingListings.forEach((listing) => {
    housingIds.set(listing.id, now);
  });

  try {
    const d1 = getD1();
    const rows = await d1
      .prepare(`SELECT id, first_seen_at FROM housing_listings WHERE publication_state = 'published' LIMIT 500`)
      .all<any>();
    if (rows && rows.results) {
      rows.results.forEach((row: any) => {
        const date = row.first_seen_at ? new Date(row.first_seen_at) : now;
        housingIds.set(row.id, date);
      });
    }
  } catch {
    // Graceful fallback to curated entries
  }

  const housingPages: MetadataRoute.Sitemap = Array.from(housingIds.entries()).map(
    ([id, date]) => ({
      url: `${baseUrl}/wohnen/${id}`,
      lastModified: date,
      changeFrequency: 'daily' as const,
      priority: 0.9,
      alternates: makeAlternates(`/wohnen/${id}`),
    }),
  );

  return [...staticPages, ...categoryPages, ...jobPages, ...housingPages];
}
