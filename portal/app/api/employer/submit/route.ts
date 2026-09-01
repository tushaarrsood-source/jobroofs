import { NextResponse } from "next/server";
import { z } from "zod";
import { getD1 } from "@/db";
import {
  generateVerificationCode,
  storeVerificationCode,
} from "@/lib/employer/verification-store";

const submitSchema = z.object({
  payload: z.any(),
  submitterEmail: z.string().email(),
  pricingPlan: z.enum(["single", "annual"]).default("single"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = submitSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: result.error.issues },
        { status: 400 },
      );
    }

    const { payload, submitterEmail, pricingPlan } = result.data;
    const d1 = getD1();

    // Find or create employer
    let employerId;
    const existingEmployer = await d1
      .prepare(`SELECT id, subscription_plan, subscription_expires_at FROM employers WHERE contact_email = ?`)
      .bind(submitterEmail)
      .first<{ id: string; subscription_plan: string; subscription_expires_at: string | null }>();

    if (existingEmployer) {
      employerId = existingEmployer.id;
    } else {
      employerId = crypto.randomUUID();
      const displayName = payload.company || submitterEmail.split("@")[0];
      await d1
        .prepare(
          `INSERT INTO employers (id, display_name, contact_email) VALUES (?, ?, ?)`,
        )
        .bind(employerId, displayName, submitterEmail)
        .run();
    }

    // Insert employer submission
    const submissionId = crypto.randomUUID();
    const nicheIdsJson = JSON.stringify(payload.nicheIds || payload.niches || []);
    const payloadJson = JSON.stringify(payload);
    const now = new Date().toISOString();

    await d1
      .prepare(
        `
        INSERT INTO employer_submissions 
        (id, employer_id, status, submitter_email, payload_json, pricing_plan, niche_ids_json, submitted_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      )
      .bind(
        submissionId,
        employerId,
        "submitted",
        submitterEmail,
        payloadJson,
        pricingPlan,
        nicheIdsJson,
        now,
      )
      .run();

    // Generate and store verification code
    const code = generateVerificationCode();
    await storeVerificationCode(submissionId, code);

    // Log code to console
    console.log(`Verification code for submission ${submissionId}: ${code}`);

    return NextResponse.json({ submissionId, requiresVerification: true });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
