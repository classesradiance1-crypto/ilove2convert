import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, from, to } = await req.json();
    if (!amount || !from || !to) return NextResponse.json({ error: "Please provide amount, from, and to currencies." }, { status: 400 });

    // Use open exchange rate API (no key needed for this endpoint)
    const res = await fetch(`https://open.er-api.com/v6/latest/${from.toUpperCase()}`);
    if (!res.ok) throw new Error("Failed to fetch exchange rates");
    const data = await res.json();

    const rate = data.rates?.[to.toUpperCase()];
    if (!rate) return NextResponse.json({ error: `Currency ${to} not found` }, { status: 400 });

    const converted = Number(amount) * rate;
    return NextResponse.json({
      result: `${amount} ${from.toUpperCase()} = ${converted.toFixed(4)} ${to.toUpperCase()}\n\nRate: 1 ${from.toUpperCase()} = ${rate} ${to.toUpperCase()}`,
      converted: converted.toFixed(4),
      rate,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Conversion failed" }, { status: 500 });
  }
}
