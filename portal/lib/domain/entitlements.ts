import { STRIPE_CATALOG, getStripePriceId } from '@/lib/stripe/products';

export type ListingTier = 'standard' | 'premium' | 'annual';
export type ListingServiceType = 'job' | 'housing';

export interface TierConfig {
  tier: ListingTier;
  serviceType: ListingServiceType;
  labelDe: string;
  labelEn: string;
  priceEur: number;
  durationDays: number;
  durationMonths: number;
  featured: boolean;
  badgeDe: string;
  badgeEn: string;
  descriptionDe: string;
  descriptionEn: string;
  perksDe: string[];
  perksEn: string[];
  stripePriceId: string;
  stripeProductId: string;
  unlimited?: boolean;
}

export const JOB_TIERS: Record<ListingTier, TierConfig> = {
  standard: {
    tier: 'standard',
    serviceType: 'job',
    labelDe: 'Standard (30 Tage)',
    labelEn: 'Standard (30 Days)',
    priceEur: 29,
    durationDays: 30,
    durationMonths: 1,
    featured: false,
    badgeDe: '30 Tage aktiv',
    badgeEn: '30 days active',
    descriptionDe: '30 Tage Laufzeit für dein Inserat in Berlin.',
    descriptionEn: '30-day listing duration across Berlin neighborhoods.',
    perksDe: [
      '29 € Einmalzahlung (kein Abo)',
      '30 Tage Laufzeit (automatische Deaktivierung)',
      '100% Direktkontakt ohne Zeitarbeit / Zwischenhändler',
      'In Kiez- und Bezirksuche gelistet',
      'Interaktive Karten-Platzierung',
    ],
    perksEn: [
      '€29 one-time payment (no subscription)',
      '30-day duration (automatic deactivation)',
      '100% direct contact without agency middlemen',
      'Listed in district and neighborhood search',
      'Interactive map placement',
    ],
    stripePriceId: STRIPE_CATALOG.jobroofs_job_standard.priceId,
    stripeProductId: STRIPE_CATALOG.jobroofs_job_standard.productId,
  },
  premium: {
    tier: 'premium',
    serviceType: 'job',
    labelDe: 'Premium Plus (60 Tage)',
    labelEn: 'Premium Plus (60 Days)',
    priceEur: 49,
    durationDays: 60,
    durationMonths: 2,
    featured: true,
    badgeDe: '⭐ Featured · 60 Tage',
    badgeEn: '⭐ Featured · 60 days',
    descriptionDe: 'Volle 2 Monate maximale Reichweite & Top-Platzierung in ganz Berlin.',
    descriptionEn: 'Full 2 months maximum reach & top placement across Berlin.',
    perksDe: [
      '49 € Einmalzahlung (kein Abo)',
      '60 Tage Laufzeit (volle 2 Monate aktiv)',
      '⭐ Hervorgehoben ganz oben in den Suchergebnissen',
      'Priorisierter Pin auf der interaktiven Karte',
      'Automatischer Reichweiten-Push nach 30 Tagen',
    ],
    perksEn: [
      '€49 one-time payment (no subscription)',
      '60-day duration (full 2 months active)',
      '⭐ Featured at the top of search results',
      'Priority pin on the interactive map',
      'Automatic reach refresh after 30 days',
    ],
    stripePriceId: STRIPE_CATALOG.jobroofs_job_premium.priceId,
    stripeProductId: STRIPE_CATALOG.jobroofs_job_premium.productId,
  },
  annual: {
    tier: 'annual',
    serviceType: 'job',
    labelDe: 'Jahres-Flatrate (365 Tage)',
    labelEn: 'Annual Unlimited Pass (1 Year)',
    priceEur: 499,
    durationDays: 365,
    durationMonths: 12,
    featured: true,
    unlimited: true,
    badgeDe: '🚀 Annual Partner · 365 Tage',
    badgeEn: '🚀 Annual Partner · 365 days',
    descriptionDe: 'Unbegrenzte Stellenanzeigen für 1 ganzes Jahr für dein Unternehmen.',
    descriptionEn: 'Unlimited job postings for a full year for your company.',
    perksDe: [
      '499 € Einmalzahlung / Jahr',
      'Unbegrenzt viele Stellenanzeigen parallel schalten',
      '⭐ Alle Inserate automatisch mit Premium-Highlighting',
      'Offizielles Arbeitgeber-Verifikationsabzeichen',
      'Persönlicher Support & Express-Freischaltung',
    ],
    perksEn: [
      '€499 one-time payment / year',
      'Post unlimited job listings simultaneously',
      '⭐ All listings automatically receive Premium highlighting',
      'Official verified employer badge',
      'Priority direct support & instant publishing',
    ],
    stripePriceId: STRIPE_CATALOG.jobroofs_job_annual.priceId,
    stripeProductId: STRIPE_CATALOG.jobroofs_job_annual.productId,
  },
};

export const HOUSING_TIERS: Record<'standard' | 'premium', TierConfig> = {
  standard: {
    tier: 'standard',
    serviceType: 'housing',
    labelDe: 'Standard Wohnungsanzeige (30 Tage)',
    labelEn: 'Standard Housing Listing (30 Days)',
    priceEur: 29,
    durationDays: 30,
    durationMonths: 1,
    featured: false,
    badgeDe: '30 Tage aktiv',
    badgeEn: '30 days active',
    descriptionDe: '30 Tage Laufzeit für Wohnungs- und WG-Angebote in Berlin.',
    descriptionEn: '30-day listing for apartments and flatshares in Berlin.',
    perksDe: [
      '29 € Einmalzahlung (kein Abo)',
      '30 Tage Laufzeit',
      'Direkter Mieterkontakt ohne Zwischenhändler',
      'Bezirk- & Kiez-Filterung',
      'Kartenansicht mit ÖPNV-Anbindung',
    ],
    perksEn: [
      '€29 one-time payment (no subscription)',
      '30-day duration',
      'Direct tenant contact without brokers',
      'District and neighborhood filtering',
      'Interactive map view with transit connections',
    ],
    stripePriceId: STRIPE_CATALOG.jobroofs_housing_standard.priceId,
    stripeProductId: STRIPE_CATALOG.jobroofs_housing_standard.productId,
  },
  premium: {
    tier: 'premium',
    serviceType: 'housing',
    labelDe: 'Premium Wohnungsanzeige (60 Tage)',
    labelEn: 'Premium Housing Listing (60 Days)',
    priceEur: 49,
    durationDays: 60,
    durationMonths: 2,
    featured: true,
    badgeDe: '⭐ Featured · 60 Tage',
    badgeEn: '⭐ Featured · 60 days',
    descriptionDe: 'Maximale Sichtbarkeit ganz oben in der Berliner Wohnungsbörse.',
    descriptionEn: 'Maximum visibility at the top of the Berlin housing market.',
    perksDe: [
      '49 € Einmalzahlung (kein Abo)',
      '60 Tage Laufzeit (volle 2 Monate aktiv)',
      '⭐ Ganz oben in den Wohnungssuchergebnissen angepinnt',
      'Hervorgehobener Karten-Marker',
      'Erreicht 3x mehr qualifizierte Bewerber',
    ],
    perksEn: [
      '€49 one-time payment (no subscription)',
      '60-day duration (full 2 months active)',
      '⭐ Pinned to the top of housing search results',
      'Highlighted map marker',
      'Reaches 3x more verified applicants',
    ],
    stripePriceId: STRIPE_CATALOG.jobroofs_housing_premium.priceId,
    stripeProductId: STRIPE_CATALOG.jobroofs_housing_premium.productId,
  },
};

// Backward-compatible alias for existing code
export const LISTING_TIERS = JOB_TIERS;

/**
 * Get tier configuration by service and tier
 */
export function getTierConfig(
  service: ListingServiceType = 'job',
  tier: ListingTier = 'standard'
): TierConfig {
  if (service === 'housing') {
    return HOUSING_TIERS[tier === 'premium' ? 'premium' : 'standard'];
  }
  return JOB_TIERS[tier] || JOB_TIERS.standard;
}

/**
 * Calculates ISO expiration timestamp based on tier duration
 */
export function calculateExpiryDate(
  tier: ListingTier = 'standard',
  fromDate: Date = new Date(),
  service: ListingServiceType = 'job'
): string {
  const config = getTierConfig(service, tier);
  const expiry = new Date(fromDate.getTime() + config.durationDays * 24 * 60 * 60 * 1000);
  return expiry.toISOString();
}

/**
 * Check if a listing has exceeded its expiration date
 */
export function isListingExpired(expiresAt?: string | null): boolean {
  if (!expiresAt) return false;
  const expiryTime = new Date(expiresAt).getTime();
  if (isNaN(expiryTime)) return false;
  return expiryTime < Date.now();
}

/**
 * Return human readable days remaining
 */
export function getDaysRemaining(expiresAt?: string | null): number {
  if (!expiresAt) return 30;
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
