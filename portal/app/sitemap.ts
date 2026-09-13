import type { MetadataRoute } from 'next';
import { industryNiches } from '@/lib/domain/taxonomy';
import { getJobsFromFirestore } from '@/lib/firebase/firestore-service';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

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
    { path: '/post-a-job', priority: 0.95, changeFrequency: 'daily' },
    { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' },
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

  // Major German Metros programmatic landing pages
  const GERMAN_CITIES = [
    'berlin',
    'muenchen',
    'hamburg',
    'koeln',
    'frankfurt',
    'duesseldorf',
    'leipzig',
    'stuttgart',
    'dortmund',
    'essen',
    'bremen',
    'dresden',
    'hannover',
    'nuernberg',
  ];

  const cityPages: MetadataRoute.Sitemap = GERMAN_CITIES.map((city) => ({
    url: `${baseUrl}/?city=${city}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.85,
    alternates: makeAlternates(`/?city=${city}`),
  }));

  // All category pages
  const categoryPages: MetadataRoute.Sitemap = industryNiches.map((niche) => ({
    url: `${baseUrl}/categories/${niche.id}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.85,
    alternates: makeAlternates(`/categories/${niche.id}`),
  }));

  // Live active job pages from Firestore
  const jobMap = new Map<string, Date>();

  try {
    const firestoreJobs = await getJobsFromFirestore(500);
    firestoreJobs.forEach((job: any) => {
      const key = job.slug || job.id;
      let date = now;
      if (job.updatedAt?.toDate) {
        date = job.updatedAt.toDate();
      } else if (job.createdAt?.toDate) {
        date = job.createdAt.toDate();
      } else if (job.createdAt) {
        date = new Date(job.createdAt);
      }
      jobMap.set(key, date);
    });
  } catch (e) {
    console.error('Error fetching jobs for sitemap:', e);
  }

  const jobPages: MetadataRoute.Sitemap = Array.from(jobMap.entries()).map(
    ([id, date]) => ({
      url: `${baseUrl}/jobs/${id}`,
      lastModified: date,
      changeFrequency: 'daily' as const,
      priority: 0.9,
      alternates: makeAlternates(`/jobs/${id}`),
    }),
  );

  return [...staticPages, ...cityPages, ...categoryPages, ...jobPages];
}
