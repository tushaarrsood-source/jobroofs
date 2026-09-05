import { NextResponse } from "next/server";
import { z } from "zod";
import { getD1 } from "@/db";
import { runHousingFraudChecks } from "@/lib/housing/fraud-checks";
import {
  generateVerificationCode,
  storeHousingVerificationCode,
} from "@/lib/housing/verification-store";
import { sendHousingVerificationEmail } from "@/lib/email/resend";

const housingSubmitSchema = z.object({
  payload: z.object({
    title: z.string().min(5),
    listingType: z.enum([
      "wg_room",
      "entire_apartment",
      "sublet",
      "nachmieter",
      "exchange",
    ]),
    district: z.string().min(2),
    postcode: z.string().min(4),
    neighborhood: z.string().optional().nullable(),
    streetAddress: z.string().optional().nullable(),
    kaltmieteEur: z.number().positive(),
    nebenkostenEur: z.number().min(0).optional(),
    warmmieteEur: z.number().positive(),
    kautionEur: z.number().min(0).optional(),
    roomSqm: z.number().positive(),
    totalRooms: z.number().min(1).optional(),
    floorLevel: z.number().optional().nullable(),
    furnished: z.enum(["unfurnished", "partially", "fully"]),
    anmeldungPossible: z.boolean(),
    subletAuthorized: z.boolean(),
    contractType: z.enum(["fixed_term", "open_ended"]),
    moveInDate: z.string().min(8),
    moveOutDate: z.string().optional().nullable(),
    minStayMonths: z.number().optional().nullable(),
    energyClass: z.string().optional().nullable(),
    heatingSource: z.string().optional().nullable(),
    buildingYear: z.number().optional().nullable(),
    images: z.array(z.string()).optional(),
    description: z.string().min(20),
    contactMethod: z.enum(["email", "in_platform"]).default("email"),
    contactEmail: z.string().email(),
    contactName: z.string().optional().nullable(),
    contactPhone: z.string().optional().nullable(),
  }),
  submitterEmail: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = housingSubmitSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: result.error.issues },
        { status: 400 },
      );
    }

    const { payload, submitterEmail } = result.data;

    // Run anti-scam and legal compliance checks
    const fraudCheck = runHousingFraudChecks({
      title: payload.title,
      description: payload.description,
      kaltmieteEur: payload.kaltmieteEur,
      warmmieteEur: payload.warmmieteEur,
      kautionEur: payload.kautionEur,
      postcode: payload.postcode,
      contactEmail: payload.contactEmail,
      anmeldungPossible: payload.anmeldungPossible,
      subletAuthorized: payload.subletAuthorized,
    });

    if (!fraudCheck.passed) {
      return NextResponse.json(
        { error: "Compliance checks failed", reasons: fraudCheck.reasons },
        { status: 422 },
      );
    }

    const d1 = getD1();
    const submissionId = `hsub_${crypto.randomUUID().slice(0, 20)}`;
    const payloadJson = JSON.stringify(payload);
    const now = new Date().toISOString();

    await d1
      .prepare(
        `INSERT INTO housing_submissions 
         (id, status, submitter_email, payload_json, payment_status, submitted_at) 
         VALUES (?, 'submitted', ?, ?, 'pending', ?)`,
      )
      .bind(submissionId, submitterEmail, payloadJson, now)
      .run();

    const code = generateVerificationCode();
    await storeHousingVerificationCode(submissionId, code);

    // Send verification email via Resend (or fallback to dev log)
    await sendHousingVerificationEmail({
      to: submitterEmail,
      code,
      listingTitle: payload.title,
      district: payload.district,
    });

    console.log(`Verification code for housing submission ${submissionId}: ${code}`);

    return NextResponse.json({ submissionId, requiresVerification: true });
  } catch (error) {
    console.error("Housing submit error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
