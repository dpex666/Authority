import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { requiredEnv } from "@/lib/server/env";

type CheckoutBody = {
  tier?: "basic" | "pro";
};

export async function POST(req: NextRequest) {
  const secretKey = requiredEnv("STRIPE_SECRET_KEY");
  const appUrl = requiredEnv("NEXT_PUBLIC_APP_URL");

  let body: CheckoutBody = {};
  try {
    body = await req.json();
  } catch {
    // body is optional — default to basic
  }

  const tier: "basic" | "pro" = body.tier === "pro" ? "pro" : "basic";

  const priceId =
    tier === "pro"
      ? requiredEnv("STRIPE_PRICE_ID_PRO")
      : requiredEnv("STRIPE_PRICE_ID_BASIC");

  const stripe = new Stripe(secretKey, { apiVersion: "2026-02-25.clover" });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { tier },
    success_url: `${appUrl}/check/summary?success=1&tier=${tier}`,
    cancel_url: `${appUrl}/check/summary?cancelled=1`,
  });

  return NextResponse.json({ url: session.url });
}
