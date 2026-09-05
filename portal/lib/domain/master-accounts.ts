/**
 * Master Accounts Configuration for JOBROOFS Berlin
 * Master accounts bypass Stripe payments, receive permanent Pro/Unlimited entitlements,
 * and gain instant publication privileges for all Job and Housing listings.
 */

export const MASTER_ACCOUNTS: readonly string[] = [
  'tushaarrsood@gmail.com',
  'japrahimanshu7@gmail.com',
] as const;

/**
 * Checks if a given email belongs to a master account
 */
export function isMasterAccount(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return MASTER_ACCOUNTS.some((masterEmail) => masterEmail.toLowerCase() === normalized);
}

/**
 * Returns master account configuration and entitlement metadata
 */
export function getMasterAccountEntitlements() {
  return {
    isMaster: true,
    role: 'master',
    plan: 'annual_unlimited' as const,
    tier: 'annual' as const,
    badgeDe: '👑 Master · Unlimited Pro',
    badgeEn: '👑 Master · Unlimited Pro',
    bypassStripe: true,
    expiresAt: '2099-12-31T23:59:59.999Z',
    descriptionDe: 'Unbegrenzte Inserate, Stripe-Bypass & dauerhafter Premium-Status',
    descriptionEn: 'Unlimited listings, Stripe bypass & permanent Premium status',
  };
}
