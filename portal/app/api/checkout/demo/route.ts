import { NextResponse } from 'next/server';
import { getStripeSecretKey, getAppUrl } from '@/lib/stripe/config';
import { getStripePriceId } from '@/lib/stripe/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get('tier') || 'standard';
    const plan = tier === 'premium' ? 'premium' : tier === 'starter' ? 'starter' : 'standard';
    const priceId = getStripePriceId('job', plan);

    const stripeSecret = getStripeSecretKey();
    const appUrl = getAppUrl(request);

    const sessionBody = new URLSearchParams({
      mode: 'payment',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      client_reference_id: `test-demo-${Date.now()}`,
      'metadata[service]': 'jobroofs',
      'metadata[type]': 'job',
      'metadata[tier]': plan,
      'metadata[title]': 'Demo Job Listing Test',
      'metadata[company]': 'JOBROOFS Live Test',
      success_url: `${appUrl}/pricing?demo_paid=true`,
      cancel_url: `${appUrl}/pricing?demo_canceled=true`,
    });

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: sessionBody.toString(),
    });

    if (!stripeResponse.ok) {
      const err = await stripeResponse.text();
      return new NextResponse(`Stripe Error: ${err}`, { status: 500 });
    }

    const sessionData = await stripeResponse.json();
    const targetUrl = sessionData.url;

    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Weiterleitung zu Stripe...</title>
    <meta http-equiv="refresh" content="0; url=${targetUrl}">
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #000; color: #fff;">
    <div style="text-align: center; max-width: 400px; padding: 20px;">
      <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">JOBROOFS Stripe Checkout</h2>
      <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 24px;">Du wirst sicher zum offiziellen Stripe-Zahlungsfenster weitergeleitet...</p>
      <a href="${targetUrl}" style="display: inline-block; background: #fff; color: #000; padding: 12px 24px; border-radius: 12px; font-weight: 600; text-decoration: none; font-size: 14px;">Klicke hier, falls keine Weiterleitung erfolgt</a>
    </div>
    <script>
      window.location.replace(${JSON.stringify(targetUrl)});
    </script>
  </body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: any) {
    return new NextResponse(`Server Error: ${err.message}`, { status: 500 });
  }
}
