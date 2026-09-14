import { NextResponse } from 'next/server';
import { adminCheckUserFreeEligibility } from '@/lib/firebase/firestore-admin';
import { STRIPE_CATALOG } from '@/lib/stripe/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        isEligibleForFree: false,
        existingJobsCount: 0,
        reason: 'unauthenticated',
        products: Object.values(STRIPE_CATALOG).filter((p) => p.type === 'job'),
      });
    }

    const eligibility = await adminCheckUserFreeEligibility(userId);

    const availableProducts = Object.values(STRIPE_CATALOG)
      .filter((p) => p.type === 'job')
      .map((p) => ({
        lookupKey: p.lookupKey,
        tier: p.tier,
        name: p.name,
        priceEur: p.amountEur,
        durationDays: p.durationDays,
        priceId: p.priceId,
        featured: p.featured,
      }));

    return NextResponse.json({
      userId,
      isEligibleForFree: eligibility.isEligibleForFree,
      freeDurationDays: 30,
      existingJobsCount: eligibility.existingJobsCount,
      reason: eligibility.reason,
      products: availableProducts,
    });
  } catch (err: any) {
    console.error('[API /api/entitlements/status error]:', err);
    return NextResponse.json(
      {
        error: err.message || 'Error checking entitlements',
        isEligibleForFree: false,
      },
      { status: 500 }
    );
  }
}
