import { NextResponse } from "next/server";
import { z } from "zod";
import { getD1 } from "@/db";
import { validateHousingVerificationCode } from "@/lib/housing/verification-store";
import { convertHousingSubmissionToListing } from "@/lib/housing/submission-to-listing";

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

    const isValid = await validateHousingVerificationCode(submissionId, code);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 },
      );
    }

    const d1 = getD1();

    const submission = await d1
      .prepare(`SELECT * FROM housing_submissions WHERE id = ?`)
      .bind(submissionId)
      .first<{ id: string; payload_json: string; submitter_email: string }>();

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY;

    if (stripeSecret) {
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
            "line_items[0][price_data][product_data][name]":
              "JOBROOFS Housing Listing — 30 Days (Wohnungsinserat)",
            "line_items[0][price_data][unit_amount]": "2900", // €29.00
            "line_items[0][quantity]": "1",
            "metadata[housingSubmissionId]": submissionId,
            success_url: `${appUrl}/wohnen?posted=true`,
            cancel_url: `${appUrl}/wohnen/list?canceled=true`,
          }).toString(),
        },
      );

      if (!stripeResponse.ok) {
        const errorText = await stripeResponse.text();
        console.error("Stripe API error for housing:", errorText);
        throw new Error("Failed to create Stripe checkout session");
      }

      const stripeData = (await stripeResponse.json()) as {
        id: string;
        url: string;
      };

      await d1
        .prepare(
          `UPDATE housing_submissions SET stripe_session_id = ? WHERE id = ?`,
        )
        .bind(stripeData.id, submissionId)
        .run();

      return NextResponse.json({
        status: "payment_required",
        checkoutUrl: stripeData.url,
      });
    } else {
      // In local dev mode without Stripe credentials, publish directly
      const listing = convertHousingSubmissionToListing({
        id: submission.id,
        payloadJson: submission.payload_json,
        submitterEmail: submission.submitter_email,
      });

      const cols = Object.keys(listing).map((k) =>
        k.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
      );
      const vals = Object.values(listing);
      const placeholders = vals.map(() => "?").join(", ");

      await d1
        .prepare(
          `INSERT INTO housing_listings (${cols.join(", ")}) VALUES (${placeholders})`,
        )
        .bind(...vals)
        .run();

      await d1
        .prepare(
          `UPDATE housing_submissions SET status = 'approved', payment_status = 'paid' WHERE id = ?`,
        )
        .bind(submissionId)
        .run();

      return NextResponse.json({
        status: "published",
        listingId: listing.id,
      });
    }
  } catch (error) {
    console.error("Housing verify error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
