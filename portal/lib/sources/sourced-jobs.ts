import type { PreviewJob } from '@/lib/domain/types';
import { ALL_BERLIN_SOURCES } from './berlin-sources-catalog';
import { scrapeAllSources, transformSourceToJob } from '@/lib/scraper/source-scraper';

// Ingest and transform verified listings across all 1,600 Berlin sources
export const ALL_SOURCED_JOBS: PreviewJob[] = scrapeAllSources(ALL_BERLIN_SOURCES);

// Pre-indexed lookups for O(1) performance
const jobsBySlug = new Map<string, PreviewJob>();
const jobsById = new Map<string, PreviewJob>();
const jobsByNiche = new Map<string, PreviewJob[]>();
const jobsByDistrict = new Map<string, PreviewJob[]>();

for (const job of ALL_SOURCED_JOBS) {
  jobsBySlug.set(job.slug, job);
  jobsById.set(job.id, job);

  // Group by niche
  const nicheGroup = jobsByNiche.get(job.industryId) || [];
  nicheGroup.push(job);
  jobsByNiche.set(job.industryId, nicheGroup);

  // Group by district
  const districtKey = job.district.toLowerCase();
  const districtGroup = jobsByDistrict.get(districtKey) || [];
  districtGroup.push(job);
  jobsByDistrict.set(districtKey, districtGroup);
}

export function getSourcedJobBySlug(slugOrId: string): PreviewJob | undefined {
  if (!slugOrId) return undefined;
  const existing = jobsBySlug.get(slugOrId) || jobsById.get(slugOrId);
  if (existing) return existing;

  const clean = slugOrId.toLowerCase().trim();
  const existingClean = jobsBySlug.get(clean) || jobsById.get(clean);
  if (existingClean) return existingClean;

  // Dynamic resilience fallback: search ALL_BERLIN_SOURCES across all typicalRoles
  for (const source of ALL_BERLIN_SOURCES) {
    const roles = source.typicalRoles && source.typicalRoles.length > 0
      ? source.typicalRoles
      : ['Mitarbeiter (m/w/d)'];

    for (let i = 0; i < roles.length; i++) {
      const candidate = transformSourceToJob(source, i);
      if (
        candidate.slug === slugOrId ||
        candidate.id === slugOrId ||
        candidate.slug === clean ||
        candidate.id === clean
      ) {
        jobsBySlug.set(candidate.slug, candidate);
        jobsById.set(candidate.id, candidate);
        return candidate;
      }
    }
  }

  return undefined;
}

export function getSourcedJobsByNiche(nicheId: string): PreviewJob[] {
  return jobsByNiche.get(nicheId) || [];
}

export function getSourcedJobsByDistrict(district: string): PreviewJob[] {
  const norm = district.trim().toLowerCase();
  return ALL_SOURCED_JOBS.filter((j) => j.district.toLowerCase().includes(norm));
}

export function getDirectEmployerJobs(limit = 6): PreviewJob[] {
  const direct: PreviewJob[] = [];
  for (const job of ALL_SOURCED_JOBS) {
    if (job.sourceKind === 'direct_employer') {
      direct.push(job);
      if (direct.length >= limit) break;
    }
  }
  return direct;
}

export function getPremiumPartnerJobs(limit = 3): PreviewJob[] {
  const partners = ['charit', "l'osteria", '25hours', 'kadewe', 'michelberger', 'bvg', 'soho house'];
  const featured = ALL_SOURCED_JOBS.filter((j) =>
    partners.some((p) => j.company.toLowerCase().includes(p))
  );
  if (featured.length >= limit) return featured.slice(0, limit);
  return [...featured, ...ALL_SOURCED_JOBS.slice(0, limit - featured.length)];
}

export function getSourcedJobsStats() {
  const nicheCounts: Record<string, number> = {};
  for (const [nicheId, jobs] of jobsByNiche.entries()) {
    nicheCounts[nicheId] = jobs.length;
  }
  return {
    totalJobs: ALL_SOURCED_JOBS.length,
    nichesCovered: jobsByNiche.size,
    nicheCounts,
  };
}
