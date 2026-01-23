import { NextResponse } from "next/server";
import { requiredEnv } from "@/lib/server/env";

export async function POST() {
  try {
    requiredEnv("STRIPE_SECRET_KEY");
    requiredEnv("STRIPE_PRICE_ID");

    console.warn(
      "Checkout requested, but Stripe checkout is not wired yet. Complete the integration to return a checkout URL."
    );

    return NextResponse.json(
      {
        error: "Checkout not implemented.",
        detail: "Stripe checkout is not wired yet.",
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("Checkout request missing configuration.", error);
    return NextResponse.json(
      {
        error: "Checkout not configured.",
        detail: "Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID to enable checkout.",
      },
      { status: 501 }
    );
  }
}
