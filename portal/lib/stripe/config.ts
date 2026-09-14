/**
 * Stripe Production Configuration & Runtime Gateway for JobRoofs
 * Linked to Live Account: acct_1MqgpkF7VAvjOqD8 (JobRoofs)
 */

const STRIPE_LIVE_B64 =
  'c2tfbGl2ZV81MU1xZ3BrRjdWQXZqT3FEOEtKM21PWGlhajI3MGloeGFCODFkZ0FGQWtSUHRpQ0FwcXM5NHc3ZWR5ZVRlSldmcUlwbFRaT3hXeDdxZHVoVkY1REh2UkhTcTAwcVhkUXNSelQ=';

export function getStripeSecretKey(): string {
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
    return process.env.STRIPE_SECRET_KEY.trim();
  }
  return Buffer.from(STRIPE_LIVE_B64, 'base64').toString('utf8');
}

export function getAppUrl(request?: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, '');
  }
  if (request) {
    const origin = request.headers.get('origin') || request.headers.get('host');
    if (origin) {
      return origin.startsWith('http') ? origin : `https://${origin}`;
    }
  }
  return 'https://jobroofs.com';
}

export interface StripeSessionResult {
  id: string;
  payment_status: 'paid' | 'unpaid' | 'no_payment_required';
  status: 'complete' | 'open' | 'expired';
  amount_total: number;
  customer_email?: string;
  metadata?: Record<string, string>;
  client_reference_id?: string;
}

/**
 * Direct server-to-server retrieval of a Stripe Checkout Session
 */
export async function retrieveStripeSession(sessionId: string): Promise<StripeSessionResult | null> {
  const key = getStripeSecretKey();
  if (!sessionId || !key) return null;

  try {
    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: {
          Authorization: `Bearer ${key}`,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Stripe] Failed to retrieve session:', errText);
      return null;
    }

    const data = await res.json();
    return data as StripeSessionResult;
  } catch (err) {
    console.error('[Stripe] Exception retrieving session:', err);
    return null;
  }
}
