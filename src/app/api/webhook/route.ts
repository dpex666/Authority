import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { requiredEnv } from "@/lib/server/env";

export async function POST(req: NextRequest) {
  const secretKey = requiredEnv("STRIPE_SECRET_KEY");
  const webhookSecret = requiredEnv("STRIPE_WEBHOOK_SECRET");
  const stripe = new Stripe(secretKey, { apiVersion: "2026-02-25.clover" });

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const tier = session.metadata?.tier ?? "basic";
    console.log(
      `[webhook] checkout.session.completed tier=${tier} session=${session.id}`
    );
    // Hook point: add DB write, email confirmation, etc.
  }

  return NextResponse.json({ received: true });
}
