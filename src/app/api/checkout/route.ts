import Stripe from "stripe";

export const runtime = "nodejs";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function POST() {
  try {
    const stripeSecretKey = requiredEnv("STRIPE_SECRET_KEY");
    const priceId = requiredEnv("NEXT_PUBLIC_STRIPE_PRICE_ID"); // or STRIPE_PRICE_ID if you prefer server-only
    const appUrl = requiredEnv("NEXT_PUBLIC_APP_URL"); // e.g. https://authority.yourdomain.com

    const stripe = new Stripe(stripeSecretKey, {
      // Don’t hardcode apiVersion unless you *need* to
      // apiVersion: "2024-06-20",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/quiz?success=1`,
      cancel_url: `${appUrl}/quiz?canceled=1`,
      allow_promotion_codes: true,
    });

    return Response.json({ url: session.url });
  } catch (err: any) {
    console.error("[/api/checkout] error:", err);
    return Response.json(
      { error: err?.message ?? "Checkout failed" },
      { status: 500 }
    );
  }
}
