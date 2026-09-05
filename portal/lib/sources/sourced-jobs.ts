import type { PreviewJob } from '@/lib/domain/types';
import { ALL_BERLIN_SOURCES } from './berlin-sources-catalog';
import { scrapeAllSources } from '@/lib/scraper/source-scraper';

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
  return jobsBySlug.get(slugOrId) || jobsById.get(slugOrId);
}

export function getSourcedJobsByNiche(nicheId: string): PreviewJob[] {
  return jobsByNiche.get(nicheId) || [];
}

export function getSourcedJobsByDistrict(district: string): PreviewJob[] {
  const norm = district.trim().toLowerCase();
  return ALL_SOURCED_JOBS.filter((j) => j.district.toLowerCase().includes(norm));
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
