import { NextResponse } from 'next/server';
import { retrieveStripeSession } from '@/lib/stripe/config';
import { adminActivatePaidJob, adminGetJobBySlugOrId } from '@/lib/firebase/firestore-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Parameter session_id ist erforderlich' },
        { status: 400 }
      );
    }

    const session = await retrieveStripeSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Stripe Checkout Session konnte nicht verifiziert werden' },
        { status: 404 }
      );
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        verified: false,
        paymentStatus: session.payment_status,
        status: session.status,
      });
    }

    const submissionId = session.metadata?.submissionId || session.client_reference_id;
    const jobSlug = session.metadata?.jobSlug;
    const tier = session.metadata?.tier || 'standard';
    const durationDays = parseInt(session.metadata?.durationDays || '30', 10);

    const lookupTarget = submissionId || jobSlug;
    if (!lookupTarget) {
      return NextResponse.json(
        { error: 'Keine Job-Metadaten in der Stripe Session hinterlegt' },
        { status: 400 }
      );
    }

    // Activate the paid job in Firestore
    const activated = await adminActivatePaidJob(
      lookupTarget,
      session.id,
      durationDays,
      tier
    );

    return NextResponse.json({
      verified: true,
      jobSlug: jobSlug || activated?.slug || lookupTarget,
      status: 'active',
      tier,
      durationDays,
      job: activated,
    });
  } catch (err: any) {
    console.error('[API /api/checkout/verify error]:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
