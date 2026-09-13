import { NextResponse } from 'next/server';
import { STRIPE_CATALOG } from '@/lib/stripe/products';
import { MASTER_ACCOUNTS } from '@/lib/domain/master-accounts';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const adminKey = request.headers.get('x-admin-key') || '';
  const isAuthorized =
    authHeader.includes('Himanshu@0010') ||
    adminKey === 'Himanshu@0010' ||
    process.env.NODE_ENV !== 'production';

  if (!isAuthorized) {
    return NextResponse.json(
      { error: 'Unauthorized: Admin authentication required to access payment verification diagnostics.' },
      { status: 401 },
    );
  }

  const report: any = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    stripe: {
      accountConnected: false,
      liveMode: false,
      chargesEnabled: false,
      payoutsEnabled: false,
      catalog: [],
      testSessionCreated: false,
      testSessionId: null,
    },
    masterAccounts: {
      activeAccounts: MASTER_ACCOUNTS,
      stripeBypassEnabled: true,
    },
  };

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    report.status = 'error';
    report.stripe.error = 'STRIPE_SECRET_KEY is missing';
    return NextResponse.json(report, { status: 500 });
  }

  report.stripe.liveMode = stripeKey.startsWith('sk_live_');

  // 1. Verify Stripe Account
  try {
    const acctRes = await fetch('https://api.stripe.com/v1/account', {
      headers: { Authorization: `Bearer ${stripeKey}` },
    });
    const acctData = await acctRes.json();
    if (acctData.id) {
      report.stripe.accountConnected = true;
      report.stripe.accountId = acctData.id;
      report.stripe.accountName = acctData.business_profile?.name || 'JobRoofs';
      report.stripe.chargesEnabled = acctData.charges_enabled;
      report.stripe.payoutsEnabled = acctData.payouts_enabled;
    }
  } catch (err: any) {
    report.stripe.accountError = err.message;
  }

  // 2. Verify all Catalog Prices
  for (const [key, item] of Object.entries(STRIPE_CATALOG)) {
    try {
      const priceRes = await fetch(`https://api.stripe.com/v1/prices/${item.priceId}`, {
        headers: { Authorization: `Bearer ${stripeKey}` },
      });
      const priceData = await priceRes.json();
      report.stripe.catalog.push({
        key,
        tier: item.tier,
        priceId: item.priceId,
        expectedEur: item.amountEur,
        active: Boolean(priceData.active),
        actualEur: priceData.unit_amount ? priceData.unit_amount / 100 : null,
        currency: priceData.currency || 'eur',
        valid: priceData.active && priceData.unit_amount === Math.round(item.amountEur * 100),
      });
    } catch (err: any) {
      report.stripe.catalog.push({
        key,
        priceId: item.priceId,
        error: err.message,
        valid: false,
      });
    }
  }

  // 3. Test Checkout Session Generation
  try {
    const sessionBody = new URLSearchParams({
      mode: 'payment',
      'line_items[0][price]': STRIPE_CATALOG.jobroofs_job_starter.priceId,
      'line_items[0][quantity]': '1',
      'metadata[service]': 'jobroofs',
      'metadata[type]': 'diagnostic_probe',
      success_url: 'https://jobroofs.com/jobs/diagnostic-probe?payment_success=true&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://jobroofs.com/post-a-job?canceled=true',
    });

    const sRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: sessionBody.toString(),
    });

    const sData = await sRes.json();
    if (sData.id && sData.url) {
      report.stripe.testSessionCreated = true;
      report.stripe.testSessionId = sData.id;
      report.stripe.testCheckoutUrl = sData.url;
    }
  } catch (err: any) {
    report.stripe.sessionError = err.message;
  }

  return NextResponse.json(report);
}
