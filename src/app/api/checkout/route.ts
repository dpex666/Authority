import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const price = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!;
  const url = process.env.NEXT_PUBLIC_APP_URL!;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price, quantity: 1 }],
    success_url: `${url}/?success=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${url}/?canceled=1`,
    allow_promotion_codes: true,
  });

  return Response.json({ url: session.url });
}
