import type { PreviewJob } from './types';
import { ALL_SOURCED_JOBS } from '@/lib/sources/sourced-jobs';

export const previewJobs: PreviewJob[] = ALL_SOURCED_JOBS;

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
