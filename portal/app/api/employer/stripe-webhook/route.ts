import { NextResponse } from "next/server";
import { getD1 } from "@/db";
import { convertSubmissionToJob } from "@/lib/employer/submission-to-job";

async function verifyStripeSignature(
  payload: string,
  signatureHeader: string,
  secret: string,
) {
  const parts = signatureHeader.split(",").reduce(
    (acc, part) => {
      const [key, value] = part.split("=");
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>,
  );

  const timestamp = parts["t"];
  const signature = parts["v1"];

  if (!timestamp || !signature) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const signatureBytes = new Uint8Array(
    signature.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || [],
  );

  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    encoder.encode(signedPayload),
  );

  return isValid;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return NextResponse.json(
        { error: "Missing signature or secret" },
        { status: 400 },
      );
    }

    const isValid = await verifyStripeSignature(rawBody, signature, secret);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const submissionId = session.metadata?.submissionId;

      if (submissionId) {
        const d1 = getD1();

        // Update submission payment status
        await d1
          .prepare(
            `UPDATE employer_submissions SET payment_status = 'paid', status = 'approved' WHERE id = ?`,
          )
          .bind(submissionId)
          .run();

        const submission = await d1
          .prepare(`SELECT * FROM employer_submissions WHERE id = ?`)
          .bind(submissionId)
          .first<{ id: string; employer_id: string | null; payload_json: string; pricing_plan: string }>();

        if (submission) {
          // If annual plan was purchased, activate annual unlimited pass for employer (1 year)
          if (submission.pricing_plan === 'annual' && submission.employer_id) {
            const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
            await d1
              .prepare(`UPDATE employers SET subscription_plan = 'annual_unlimited', subscription_expires_at = ? WHERE id = ?`)
              .bind(oneYearFromNow, submission.employer_id)
              .run();
          }

          const { job, nicheIds } = await convertSubmissionToJob(
            { ...submission, payloadJson: submission.payload_json },
            submission.employer_id || crypto.randomUUID(),
          );

          const jobCols = Object.keys(job).map((k) =>
            k.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
          );
          const jobVals = Object.values(job);
          const placeholders = jobVals.map(() => "?").join(", ");

          await d1
            .prepare(
              `INSERT INTO jobs (${jobCols.join(", ")}) VALUES (${placeholders})`,
            )
            .bind(...jobVals)
            .run();

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
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
