import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json(); // amount in cents

    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Minimum donation is $1." }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Support ILove2Convert",
              description: "Keep the tools free for everyone. Thank you! ❤️",
              images: [],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/donate/success?amount=${amount}`,
      cancel_url: `${appUrl}/donate`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e: unknown) {
    console.error("Stripe error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Payment failed" },
      { status: 500 }
    );
  }
}
