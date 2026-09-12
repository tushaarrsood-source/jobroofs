import { NextResponse } from 'next/server';
import { getStripePriceId } from '@/lib/stripe/products';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tier = 'starter', jobData } = body;
    const plan = tier === 'premium' ? 'premium' : tier === 'standard' ? 'standard' : 'starter';
    const priceId = getStripePriceId('job', plan);

    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (request.headers.get('origin') ?? 'https://jobroofs.com');

    if (!stripeSecret) {
      console.warn('STRIPE_SECRET_KEY not set — fallback to direct publishing');
      return NextResponse.json({
        success: true,
        mock: true,
        message: 'Listing published without payment gateway',
      });
    }

    const company = jobData?.company || 'Berliner Betrieb';
    const title = jobData?.title || 'Stellenangebot';
    const jobSlug = jobData?.slug || 'berlin-job';
    const contactEmail = jobData?.contactEmail || undefined;
    const durationDays = plan === 'premium' ? '60' : plan === 'standard' ? '30' : '15';

    const sessionBody = new URLSearchParams({
      mode: 'payment',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'metadata[service]': 'jobroofs',
      'metadata[type]': 'job',
      'metadata[tier]': plan,
      'metadata[durationDays]': durationDays,
      'metadata[title]': title,
      'metadata[company]': company,
      'metadata[jobSlug]': jobSlug,
      success_url: `${appUrl}/jobs/${jobSlug}?payment_success=true`,
      cancel_url: `${appUrl}/post-a-job?canceled=true`,
    });

    if (contactEmail && contactEmail.includes('@')) {
      sessionBody.append('customer_email', contactEmail);
    }

    const stripeResponse = await fetch(
      'https://api.stripe.com/v1/checkout/sessions',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(stripeSecret + ':')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: sessionBody.toString(),
      }
    );

    if (!stripeResponse.ok) {
      const errText = await stripeResponse.text();
      console.error('Stripe Checkout Session error:', errText);
      return NextResponse.json(
        { error: 'Fehler bei der Erstellung der Stripe-Zahlung: ' + errText },
        { status: 500 }
      );
    }

    const sessionData = await stripeResponse.json();
    return NextResponse.json({
      checkoutUrl: sessionData.url,
      sessionId: sessionData.id,
    });
  } catch (err: any) {
    console.error('Checkout API error:', err);
    return NextResponse.json(
      { error: err.message || 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
