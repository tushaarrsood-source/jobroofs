import { getStripeSecretKey, retrieveStripeSession } from '../lib/stripe/config.js';
import { 
  adminCheckUserFreeEligibility, 
  adminMarkUserFreeJobUsed, 
  adminCreateJob, 
  adminGetJobBySlugOrId, 
  adminActivatePaidJob, 
  adminDeleteJob 
} from '../lib/firebase/firestore-admin.js';
import { STRIPE_CATALOG } from '../lib/stripe/products.js';

console.log('================================================================');
console.log(' RUNNING COMPREHENSIVE ENTITLEMENTS & STRIPE SUITE VERIFICATION');
console.log('================================================================\n');

async function run() {
  const stripeKey = getStripeSecretKey();
  console.log('[1/5] Checking Stripe Secret Key...');
  if (!stripeKey || !stripeKey.startsWith('sk_live_')) {
    throw new Error('FAILED: Stripe Secret Key is missing or not live mode');
  }
  console.log('  PASS: Live Stripe Key verified: ' + stripeKey.slice(0, 14) + '...');

  console.log('\n[2/5] Verifying 3 Active Stripe Products in Catalog...');
  for (const item of Object.values(STRIPE_CATALOG)) {
    const res = await fetch(`https://api.stripe.com/v1/prices/${item.priceId}`, {
      headers: { Authorization: `Bearer ${stripeKey}` },
    });
    const data = await res.json();
    if (!data.active || data.unit_amount / 100 !== item.amountEur) {
      throw new Error(`FAILED: Price mismatch for ${item.name}`);
    }
    console.log(`  PASS: [${item.tier.toUpperCase()}] ${item.name} -> ${item.amountEur} € (${item.priceId}) active.`);
  }

  console.log('\n[3/5] Testing Entitlement Eligibility Engine...');
  const testNewUser = 'test-new-user-' + Date.now();
  const newCheck = await adminCheckUserFreeEligibility(testNewUser);
  if (!newCheck.isEligibleForFree) {
    throw new Error('FAILED: New account should be eligible for 1 free job');
  }
  console.log('  PASS: Fresh account ' + testNewUser + ' is ELIGIBLE for 1st free job.');

  const existingUser = 'N0FcmURRSjem3BOR8ktPFeCTCBD3'; // Real user with posted job
  const existingCheck = await adminCheckUserFreeEligibility(existingUser);
  if (existingCheck.isEligibleForFree) {
    throw new Error('FAILED: User with posted job must NOT be eligible for another free job');
  }
  console.log(`  PASS: Existing user ${existingUser} is correctly BLOCKED (reason: ${existingCheck.reason}).`);

  console.log('\n[4/5] Testing Stripe Checkout Session Generation...');
  const testJobId = 'test-job-audit-' + Date.now();
  const testSlug = 'test-job-audit-' + Date.now();
  
  // Create pending job
  await adminCreateJob({
    id: testJobId,
    slug: testSlug,
    title: 'Audit Automation Engineer',
    company: 'Audit Verification Tech',
    tier: 'standard',
    status: 'pending_payment',
  }, testJobId);

  const sessionBody = new URLSearchParams({
    mode: 'payment',
    'line_items[0][price]': STRIPE_CATALOG.jobroofs_job_standard.priceId,
    'line_items[0][quantity]': '1',
    client_reference_id: testJobId,
    'metadata[submissionId]': testJobId,
    'metadata[jobSlug]': testSlug,
    'metadata[tier]': 'standard',
    'metadata[durationDays]': '30',
    success_url: `https://jobroofs.com/jobs/${testSlug}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: 'https://jobroofs.com/post-a-job?canceled=true',
  });

  const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: sessionBody.toString(),
  });

  const sessionData = await stripeRes.json();
  if (!sessionData.url || !sessionData.id) {
    throw new Error('FAILED to generate Stripe checkout session: ' + JSON.stringify(sessionData));
  }
  console.log('  PASS: Stripe Checkout Session created: ' + sessionData.id);
  console.log('  PASS: Live Checkout URL: ' + sessionData.url.slice(0, 60) + '...');

  console.log('\n[5/5] Testing Session Retrieval & Activation Guard...');
  const retrieved = await retrieveStripeSession(sessionData.id);
  if (retrieved.payment_status === 'paid') {
    throw new Error('FAILED: Unpaid session should have payment_status != paid');
  }
  console.log('  PASS: Fresh session correctly flagged unpaid (' + retrieved.payment_status + ').');

  // Verify pending status in Firestore
  const pendingDoc = await adminGetJobBySlugOrId(testSlug);
  if (pendingDoc.status !== 'pending_payment') {
    throw new Error('FAILED: Job must be pending_payment before checkout');
  }
  console.log('  PASS: Database correctly maintains status: pending_payment before payment.');

  // Clean up test document
  await adminDeleteJob(testJobId);
  console.log('  PASS: Cleanup completed.');

  console.log('\n================================================================');
  console.log(' ALL 5 VERIFICATION STAGES PASSED 100%!');
  console.log('================================================================');
}

run().catch((err) => {
  console.error('\nAUDIT ERROR:', err);
  process.exit(1);
});
