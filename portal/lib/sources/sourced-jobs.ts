import type { PreviewJob } from '@/lib/domain/types';
import { INDEPENDENT_BERLIN_LISTINGS } from './independent-listings';

// 100% Independent Berlin Employer & Private Listings (NO SCRAPING)
export const ALL_SOURCED_JOBS: PreviewJob[] = INDEPENDENT_BERLIN_LISTINGS;

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

  return undefined;
}

export function getSourcedJobsByNiche(nicheId: string): PreviewJob[] {
  return jobsByNiche.get(nicheId) || [];
}

export function getSourcedJobsByDistrict(district: string): PreviewJob[] {
  const norm = district.trim().toLowerCase();
  return ALL_SOURCED_JOBS.filter((j) => j.district.toLowerCase().includes(norm));
}

export function getSourcedJobsByCity(city: string): PreviewJob[] {
  const norm = city.trim().toLowerCase();
  if (!norm || norm === 'all' || norm === 'alle' || norm === 'deutschland') {
    return ALL_SOURCED_JOBS;
  }
  return ALL_SOURCED_JOBS.filter((j) => (j.city?.toLowerCase() || 'berlin').includes(norm));
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
