import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { monthly, rate, years } = await req.json();
    const P = Number(monthly);
    const annualRate = Number(rate);
    const n = Number(years) * 12;
    if (!P || !annualRate || !n) return NextResponse.json({ error: "Please provide monthly investment, rate, and years." }, { status: 400 });

    const r = annualRate / 12 / 100;
    const futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = P * n;
    const gains = futureValue - invested;

    return NextResponse.json({
      result: `Future Value: ₹${futureValue.toFixed(2)}\nTotal Invested: ₹${invested.toFixed(2)}\nEstimated Gains: ₹${gains.toFixed(2)}`,
      futureValue: futureValue.toFixed(2),
      invested: invested.toFixed(2),
      gains: gains.toFixed(2),
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Calculation failed" }, { status: 400 });
  }
}
