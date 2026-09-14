import { NextResponse } from 'next/server';
import { getStripePriceId } from '@/lib/stripe/products';
import { getStripeSecretKey, getAppUrl } from '@/lib/stripe/config';
import { adminCreateJob } from '@/lib/firebase/firestore-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tier = 'starter', jobData } = body;
    const plan = tier === 'premium' ? 'premium' : tier === 'standard' ? 'standard' : 'starter';
    const priceId = getStripePriceId('job', plan);

    const stripeSecret = getStripeSecretKey();
    const appUrl = getAppUrl(request);

    if (!stripeSecret) {
      console.error('[Stripe Checkout] STRIPE_SECRET_KEY is missing');
      return NextResponse.json(
        { error: 'Zahlungs-Gateway nicht konfiguriert.' },
        { status: 500 }
      );
    }

    const company = jobData?.company || 'Berliner Betrieb';
    const title = jobData?.title || 'Stellenangebot';
    const submissionId =
      jobData?.id || `direct-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const companySlug = company
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const titleSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const jobSlug = jobData?.slug || `${companySlug}-${titleSlug}-${submissionId.slice(-4)}`;

    const contactEmail = jobData?.contactEmail || undefined;
    const durationDays = plan === 'premium' ? 60 : plan === 'standard' ? 30 : 15;

    // Save pending job in database so it is ready for activation upon payment
    if (jobData) {
      await adminCreateJob(
        {
          ...jobData,
          id: submissionId,
          slug: jobSlug,
          title,
          company,
          tier: plan,
          durationDays,
          status: 'pending_payment',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        submissionId
      );
    }

    const sessionBody = new URLSearchParams({
      mode: 'payment',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      client_reference_id: submissionId,
      'metadata[service]': 'jobroofs',
      'metadata[type]': 'job',
      'metadata[tier]': plan,
      'metadata[durationDays]': String(durationDays),
      'metadata[title]': title,
      'metadata[company]': company,
      'metadata[jobSlug]': jobSlug,
      'metadata[submissionId]': submissionId,
      success_url: `${appUrl}/jobs/${jobSlug}?payment_success=true&session_id={CHECKOUT_SESSION_ID}${jobData?.isUpgrade ? '&upgraded=true' : ''}`,
      cancel_url: `${appUrl}/post-a-job?canceled=true`,
    });

    if (jobData?.userId) {
      sessionBody.append('metadata[userId]', jobData.userId);
    }

    if (jobData?.isUpgrade) {
      sessionBody.append('metadata[isUpgrade]', 'true');
    }

    if (contactEmail && contactEmail.includes('@')) {
      sessionBody.append('customer_email', contactEmail);
    }

    const stripeResponse = await fetch(
      'https://api.stripe.com/v1/checkout/sessions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${stripeSecret}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: sessionBody.toString(),
      }
    );

    if (!stripeResponse.ok) {
      const errText = await stripeResponse.text();
      console.error('[Stripe Checkout Session error]:', errText);
      return NextResponse.json(
        { error: 'Fehler bei der Erstellung der Stripe-Zahlung: ' + errText },
        { status: 500 }
      );
    }

    const sessionData = await stripeResponse.json();
    return NextResponse.json({
      checkoutUrl: sessionData.url,
      sessionId: sessionData.id,
      submissionId,
      jobSlug,
    });
  } catch (err: any) {
    console.error('[Checkout API error]:', err);
    return NextResponse.json(
      { error: err.message || 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
