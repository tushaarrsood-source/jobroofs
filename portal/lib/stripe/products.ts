/**
 * Official Stripe Products & Prices for JobRoofs
 * Linked to Stripe Account: acct_1MqgpkF7VAvjOqD8
 */

export interface StripeProductDefinition {
  lookupKey: string;
  productId: string;
  priceId: string;
  name: string;
  amountEur: number;
  type: 'job' | 'housing';
  tier: 'standard' | 'premium' | 'annual';
  durationDays: number;
  featured: boolean;
  unlimited?: boolean;
}

export const STRIPE_CATALOG: Record<string, StripeProductDefinition> = {
  jobroofs_job_standard: {
    lookupKey: 'jobroofs_job_standard',
    productId: 'prod_VCffo1Py7lk2NR',
    priceId: 'price_1UCGK2F7VAvjOqD84KdVxCxS',
    name: 'JOBROOFS Standard Job Listing (30 Days)',
    amountEur: 29,
    type: 'job',
    tier: 'standard',
    durationDays: 30,
    featured: false,
  },
  jobroofs_job_premium: {
    lookupKey: 'jobroofs_job_premium',
    productId: 'prod_VCff7DCJ3Zbkzg',
    priceId: 'price_1UCGK3F7VAvjOqD8cRlRnKUI',
    name: 'JOBROOFS Premium Job Listing (60 Days) - Top Placement',
    amountEur: 49,
    type: 'job',
    tier: 'premium',
    durationDays: 60,
    featured: true,
  },
  jobroofs_job_annual: {
    lookupKey: 'jobroofs_job_annual',
    productId: 'prod_VCffx7I2DfpHKB',
    priceId: 'price_1UCGK3F7VAvjOqD8FhbL2rcL',
    name: 'JOBROOFS Annual Unlimited Employer Pass (1 Year)',
    amountEur: 499,
    type: 'job',
    tier: 'annual',
    durationDays: 365,
    featured: true,
    unlimited: true,
  },
  jobroofs_housing_standard: {
    lookupKey: 'jobroofs_housing_standard',
    productId: 'prod_VCff0sPu3FYv0R',
    priceId: 'price_1UCGK4F7VAvjOqD82XRMVmoE',
    name: 'JOBROOFS Standard Housing Listing (30 Days)',
    amountEur: 29,
    type: 'housing',
    tier: 'standard',
    durationDays: 30,
    featured: false,
  },
  jobroofs_housing_premium: {
    lookupKey: 'jobroofs_housing_premium',
    productId: 'prod_VCffICtAOoMBog',
    priceId: 'price_1UCGK4F7VAvjOqD87JSh3m3v',
    name: 'JOBROOFS Premium Housing Listing (60 Days) - Top Placement',
    amountEur: 49,
    type: 'housing',
    tier: 'premium',
    durationDays: 60,
    featured: true,
  },
};

/**
 * Get Stripe Price ID for a given listing type and tier
 */
export function getStripePriceId(
  type: 'job' | 'housing',
  tier: 'standard' | 'premium' | 'annual' | string = 'standard'
): string {
  const key = `jobroofs_${type}_${tier}`;
  if (STRIPE_CATALOG[key]) {
    return STRIPE_CATALOG[key].priceId;
  }
  // Fallback to standard for type
  const fallbackKey = `jobroofs_${type}_standard`;
  return STRIPE_CATALOG[fallbackKey]?.priceId || STRIPE_CATALOG.jobroofs_job_standard.priceId;
}

/**
 * Lookup Stripe product definition by price ID
 */
export function getProductByPriceId(priceId: string): StripeProductDefinition | undefined {
  return Object.values(STRIPE_CATALOG).find((item) => item.priceId === priceId);
}

/**
 * Lookup Stripe product definition by lookupKey
 */
export function getProductByLookupKey(lookupKey: string): StripeProductDefinition | undefined {
  return STRIPE_CATALOG[lookupKey];
}
