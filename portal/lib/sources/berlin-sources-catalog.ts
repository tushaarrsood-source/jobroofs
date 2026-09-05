import type { BerlinSource } from './types';
import {
  hospitalityAndTourismSources,
  gastronomySources,
  hotelSources,
  eventSources,
  nightlifeSources,
  tourismSources,
  cultureSources,
  seasonalMarketSources,
  tempShiftSources,
} from './hospitality-tourism';
import {
  retailAndLogisticsSources,
  retailSources,
  foodRetailSources,
  warehousingSources,
  logisticsSources,
  movingTransportSources,
  manufacturingSources,
  securitySources,
  cleaningSources,
} from './retail-logistics';
import {
  communityAndCareSources,
  childcareSources,
  healthcareSources,
  elderCareSources,
  homeHelpSources,
  petCareSources,
  gardeningSources,
  ngoSources,
  sportsFitnessSources,
} from './community-care';
import {
  businessAndCreativeSources,
  officeAdminSources,
  customerSupportSources,
  salesPromotionSources,
  universitiesResearchSources,
  mediaCreativeSources,
  beautyWellnessSources,
  constructionTradesSources,
  localServicesSources,
} from './business-creative';

// Re-export sectors
export {
  hospitalityAndTourismSources,
  retailAndLogisticsSources,
  communityAndCareSources,
  businessAndCreativeSources,
};

// Re-export individual niche arrays
export {
  gastronomySources,
  hotelSources,
  eventSources,
  nightlifeSources,
  tourismSources,
  cultureSources,
  seasonalMarketSources,
  tempShiftSources,
  retailSources,
  foodRetailSources,
  warehousingSources,
  logisticsSources,
  movingTransportSources,
  manufacturingSources,
  securitySources,
  cleaningSources,
  childcareSources,
  healthcareSources,
  elderCareSources,
  homeHelpSources,
  petCareSources,
  gardeningSources,
  ngoSources,
  sportsFitnessSources,
  officeAdminSources,
  customerSupportSources,
  salesPromotionSources,
  universitiesResearchSources,
  mediaCreativeSources,
  beautyWellnessSources,
  constructionTradesSources,
  localServicesSources,
};

// Master collection of all 1,600 Berlin Sources across all 32 industry niches
export const ALL_BERLIN_SOURCES: BerlinSource[] = [
  ...hospitalityAndTourismSources,
  ...retailAndLogisticsSources,
  ...communityAndCareSources,
  ...businessAndCreativeSources,
];

// Pre-indexed map for high-performance lookup
const sourcesById = new Map<string, BerlinSource>();
const sourcesByNiche = new Map<string, BerlinSource[]>();

for (const source of ALL_BERLIN_SOURCES) {
  sourcesById.set(source.id, source);

  const existing = sourcesByNiche.get(source.nicheId) || [];
  existing.push(source);
  sourcesByNiche.set(source.nicheId, existing);
}

/**
 * Retrieve all Berlin sources matching a specific taxonomy niche ID
 */
export function getSourcesByNiche(nicheId: string): BerlinSource[] {
  return sourcesByNiche.get(nicheId) || [];
}

/**
 * Retrieve a specific source by its unique ID
 */
export function getSourceById(id: string): BerlinSource | undefined {
  return sourcesById.get(id);
}

/**
 * Retrieve sources located within a specific Berlin district
 */
export function getSourcesByDistrict(district: string): BerlinSource[] {
  const normalized = district.trim().toLowerCase();
  return ALL_BERLIN_SOURCES.filter((s) =>
    s.district.toLowerCase().includes(normalized),
  );
}

/**
 * Returns comprehensive statistics on catalog coverage
 */
export function getSourcesStats() {
  const nicheCounts: Record<string, number> = {};
  const districtCounts: Record<string, number> = {};

  for (const source of ALL_BERLIN_SOURCES) {
    nicheCounts[source.nicheId] = (nicheCounts[source.nicheId] || 0) + 1;
    districtCounts[source.district] = (districtCounts[source.district] || 0) + 1;
  }

  return {
    totalSources: ALL_BERLIN_SOURCES.length,
    nichesCovered: Object.keys(nicheCounts).length,
    nicheCounts,
    districtCounts,
  };
}
