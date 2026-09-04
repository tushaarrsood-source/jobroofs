import { NextResponse } from "next/server";
import { z } from "zod";
import { getD1 } from "@/db";
import { validateVerificationCode } from "@/lib/employer/verification-store";
import { runAutomatedFraudChecks } from "@/lib/employer/fraud-checks";
import { convertSubmissionToJob } from "@/lib/employer/submission-to-job";

const verifySchema = z.object({
  submissionId: z.string(),
  code: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = verifySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: result.error.issues },
        { status: 400 },
      );
    }

    const { submissionId, code } = result.data;

    const isValid = await validateVerificationCode(submissionId, code);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 },
      );
    }

    const d1 = getD1();

    // Get submission
    const submission = await d1
      .prepare(`SELECT * FROM employer_submissions WHERE id = ?`)
      .bind(submissionId)
      .first<any>();

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    // Update employer verification state
    if (submission.employer_id) {
      await d1
        .prepare(
          `UPDATE employers SET verification_state = 'email_verified', verified_at = ? WHERE id = ?`,
        )
        .bind(new Date().toISOString(), submission.employer_id)
        .run();
    }

    const payload = JSON.parse(submission.payload_json);

    // Run fraud checks
    const fraudCheck = runAutomatedFraudChecks(payload);
    if (!fraudCheck.passed) {
      await d1
        .prepare(
          `UPDATE employer_submissions SET status = 'needs_review', review_reason = ? WHERE id = ?`,
        )
        .bind(JSON.stringify(fraudCheck.reasons), submissionId)
        .run();

      return NextResponse.json({
        status: "needs_review",
        reasons: fraudCheck.reasons,
      });
    }

    // Check if employer has an active annual subscription pass
    let hasActiveSubscription = false;
    if (submission.employer_id) {
      const employer = await d1
        .prepare(`SELECT subscription_plan, subscription_expires_at FROM employers WHERE id = ?`)
        .bind(submission.employer_id)
        .first<{ subscription_plan: string; subscription_expires_at: string | null }>();

      if (
        employer?.subscription_plan === "annual_unlimited" &&
        employer.subscription_expires_at &&
        new Date(employer.subscription_expires_at) > new Date()
      ) {
        hasActiveSubscription = true;
      }
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY;

    if (!hasActiveSubscription && stripeSecret) {
      // Create Stripe Checkout session (€29 single or €499 annual unlimited)

      const isPremium = submission.pricing_plan === "premium";
      const isAnnual = submission.pricing_plan === "annual";
      const unitAmount = isAnnual ? "49900" : isPremium ? "4900" : "2900"; // €499.00, €49.00, or €29.00
      const productName = isAnnual
        ? "JOBROOFS Annual Unlimited Pass (1 Year)"
        : isPremium
        ? "JOBROOFS Premium Job Listing (60 Days / 2 Months) - Top Placement"
        : "JOBROOFS Standard Job Listing (30 Days)";

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      const stripeResponse = await fetch(
        "https://api.stripe.com/v1/checkout/sessions",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(stripeSecret + ":")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            mode: "payment",
            "line_items[0][price_data][currency]": "EUR",
            "line_items[0][price_data][product_data][name]": productName,
            "line_items[0][price_data][unit_amount]": unitAmount,
            "line_items[0][quantity]": "1",
            "metadata[submissionId]": submissionId,
            "metadata[employerId]": submission.employer_id || "",
            "metadata[pricingPlan]": submission.pricing_plan || "standard",
            success_url: `${appUrl}/employer/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/employer/checkout-cancel`,
          }).toString(),
        },
      );

      if (!stripeResponse.ok) {
        const errorText = await stripeResponse.text();
        console.error("Stripe API error:", errorText);
        throw new Error("Failed to create Stripe checkout session");
      }

      const stripeData = (await stripeResponse.json()) as {
        id: string;
        url: string;
      };

      await d1
        .prepare(
          `UPDATE employer_submissions SET stripe_session_id = ? WHERE id = ?`,
        )
        .bind(stripeData.id, submissionId)
        .run();

        return NextResponse.json({
          status: "payment_required",
          checkoutUrl: stripeData.url,
        });
      }

    // Auto-publish immediately under active annual pass OR local development without Stripe keys
    const { job, nicheIds } = await convertSubmissionToJob(
      { ...submission, payloadJson: submission.payload_json },
      submission.employer_id,
    );

    // Insert job
    const jobCols = Object.keys(job).map((k) =>
      k.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
    );
    const jobVals = Object.values(job).map((v) => (v === undefined ? null : v));
    const placeholders = jobVals.map(() => "?").join(", ");

    await d1
      .prepare(
        `INSERT INTO jobs (${jobCols.join(", ")}) VALUES (${placeholders})`,
      )
      .bind(...jobVals)
      .run();

    // Insert job niches
    if (nicheIds && nicheIds.length > 0) {
      for (let i = 0; i < nicheIds.length; i++) {
        const isPrimary = i === 0 ? 1 : 0;
        await d1
          .prepare(
            `INSERT INTO job_niches (job_id, niche_id, is_primary, evidence) VALUES (?, ?, ?, ?)`,
          )
          .bind(job.id, nicheIds[i], isPrimary, "Employer selected")
          .run();
      }
    }

    await d1
      .prepare(
        `UPDATE employer_submissions SET status = 'approved', payment_status = 'paid' WHERE id = ?`,
      )
      .bind(submissionId)
      .run();

    return NextResponse.json({ status: "published", jobId: job.id });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
