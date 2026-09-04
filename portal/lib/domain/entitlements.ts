export type ListingTier = 'standard' | 'premium';

export interface TierConfig {
  tier: ListingTier;
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
}

export const LISTING_TIERS: Record<ListingTier, TierConfig> = {
  standard: {
    tier: 'standard',
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
  },
  premium: {
    tier: 'premium',
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
  },
};

/**
 * Calculates ISO expiration timestamp based on tier duration
 */
export function calculateExpiryDate(tier: ListingTier = 'standard', fromDate: Date = new Date()): string {
  const config = LISTING_TIERS[tier] || LISTING_TIERS.standard;
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
