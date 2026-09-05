import { NextResponse } from 'next/server';
import { getD1 } from '@/db';
import { convertSubmissionToJob } from '@/lib/employer/submission-to-job';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const stripeSecret = process.env.STRIPE_SECRET_KEY;

    if (!sessionId || !stripeSecret) {
      return NextResponse.json(
        { error: 'Missing session_id or stripe secret key' },
        { status: 400 },
      );
    }

    // Directly retrieve session from Stripe API using secret key
    const stripeRes = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: {
          Authorization: `Bearer ${stripeSecret}`,
        },
      },
    );

    if (!stripeRes.ok) {
      return NextResponse.json(
        { error: 'Failed to retrieve session from Stripe' },
        { status: 400 },
      );
    }

    const session = (await stripeRes.json()) as {
      id: string;
      payment_status: string;
      metadata?: {
        submissionId?: string;
        housingSubmissionId?: string;
        employerId?: string;
      };
    };

    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        verified: false,
        paymentStatus: session.payment_status,
      });
    }

    const d1 = getD1();
    const submissionId = session.metadata?.submissionId;
    const housingSubmissionId = session.metadata?.housingSubmissionId;

    if (submissionId) {
      // Check current state
      const submission = await d1
        .prepare(`SELECT * FROM employer_submissions WHERE id = ?`)
        .bind(submissionId)
        .first<{
          id: string;
          employer_id: string | null;
          payload_json: string;
          pricing_plan: string;
          payment_status: string;
        }>();

      if (submission && submission.payment_status !== 'paid') {
        // Mark as paid & approved
        await d1
          .prepare(
            `UPDATE employer_submissions SET payment_status = 'paid', status = 'approved' WHERE id = ?`,
          )
          .bind(submissionId)
          .run();

        const { job, nicheIds } = await convertSubmissionToJob(
          { ...submission, payloadJson: submission.payload_json },
          submission.employer_id || crypto.randomUUID(),
        );

        const jobCols = Object.keys(job).map((k) =>
          k.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
        );
        const jobVals = Object.values(job);
        const placeholders = jobVals.map(() => '?').join(', ');

        await d1
          .prepare(
            `INSERT OR IGNORE INTO jobs (${jobCols.join(', ')}) VALUES (${placeholders})`,
          )
          .bind(...jobVals)
          .run();

        if (nicheIds && nicheIds.length > 0) {
          for (let i = 0; i < nicheIds.length; i++) {
            const isPrimary = i === 0 ? 1 : 0;
            await d1
              .prepare(
                `INSERT OR IGNORE INTO job_niches (job_id, niche_id, is_primary, evidence) VALUES (?, ?, ?, ?)`,
              )
              .bind(job.id, nicheIds[i], isPrimary, 'Employer selected')
              .run();
          }
        }
      }
    } else if (housingSubmissionId) {
      const { convertHousingSubmissionToListing } = await import(
        '@/lib/housing/submission-to-listing'
      );

      const submission = await d1
        .prepare(`SELECT * FROM housing_submissions WHERE id = ?`)
        .bind(housingSubmissionId)
        .first<{
          id: string;
          submitter_email: string;
          payload_json: string;
          payment_status: string;
        }>();

      if (submission && submission.payment_status !== 'paid') {
        await d1
          .prepare(
            `UPDATE housing_submissions SET payment_status = 'paid', status = 'approved' WHERE id = ?`,
          )
          .bind(housingSubmissionId)
          .run();

        const listing = convertHousingSubmissionToListing({
          id: submission.id,
          payloadJson: submission.payload_json,
          submitterEmail: submission.submitter_email || 'anonym@jobroofs.com',
        });

        const listingCols = Object.keys(listing).map((k) =>
          k.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
        );
        const listingVals = Object.values(listing);
        const placeholders = listingVals.map(() => '?').join(', ');

        await d1
          .prepare(
            `INSERT OR IGNORE INTO housing_listings (${listingCols.join(', ')}) VALUES (${placeholders})`,
          )
          .bind(...listingVals)
          .run();
      }
    }

    return NextResponse.json({
      verified: true,
      paymentStatus: session.payment_status,
    });
  } catch (error) {
    console.error('Verify session error:', error);
    return NextResponse.json(
      { error: 'Internal server error verifying session' },
      { status: 500 },
    );
  }
}
