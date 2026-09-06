import type { PreviewJob } from './types';
import { ALL_SOURCED_JOBS } from '@/lib/sources/sourced-jobs';

// Representative showcase of jobs covering all 32 Berlin niches for instantaneous homepage hydration
export const previewJobs: PreviewJob[] = (() => {
  const seenNiches = new Map<string, number>();
  const showcase: PreviewJob[] = [];
  for (const job of ALL_SOURCED_JOBS) {
    const count = seenNiches.get(job.industryId) || 0;
    if (count < 2) {
      showcase.push(job);
      seenNiches.set(job.industryId, count + 1);
    }
  }
  return showcase.length > 0 ? showcase : ALL_SOURCED_JOBS.slice(0, 64);
})();

export const previewSources = [
  {
    name: 'Independent hospitality employers',
    kind: 'Direct employers',
    niches: 'Gastronomy, Hotels',
    cadence: '12h',
    state: 'Adapter queue',
    reason: 'High job turnover; fragmented supply',
  },
  {
    name: 'Berlin venues and event operators',
    kind: 'Direct employers',
    niches: 'Events, Culture, Nightlife',
    cadence: '6h',
    state: 'Adapter queue',
    reason: 'Immediate listings require faster checks',
  },
  {
    name: 'Local retail career pages',
    kind: 'Direct employers',
    niches: 'Retail, Food retail',
    cadence: '24h',
    state: 'Discovery queue',
    reason: 'Many employers never reach large boards',
  },
  {
    name: 'Specialist flexible-work boards',
    kind: 'Specialist boards',
    niches: 'Cross-niche',
    cadence: '24h',
    state: 'Policy review',
    reason: 'Secondary coverage and reconciliation',
  },
  {
    name: 'Large general job boards',
    kind: 'Large boards',
    niches: 'Cross-niche',
    cadence: '48h',
    state: 'Secondary only',
    reason: 'Coverage check, not differentiation',
  },
] as const;
