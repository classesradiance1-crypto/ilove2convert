import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { principal, rate, tenure } = await req.json();
    const P = Number(principal);
    const annualRate = Number(rate);
    const months = Number(tenure);
    if (!P || !annualRate || !months) return NextResponse.json({ error: "Please provide principal, rate, and tenure." }, { status: 400 });

    const r = annualRate / 12 / 100;
    const emi = (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - P;

    const schedule = Array.from({ length: Math.min(months, 360) }, (_, i) => {
      const month = i + 1;
      const interest = P * r * Math.pow(1 + r, i) - (emi * (Math.pow(1 + r, i) - 1)) * 0;
      // Simplified balance calculation
      const balance = P * Math.pow(1 + r, month) - emi * ((Math.pow(1 + r, month) - 1) / r);
      return { month, emi: emi.toFixed(2), balance: Math.max(0, balance).toFixed(2) };
    });

    return NextResponse.json({
      result: `Monthly EMI: ₹${emi.toFixed(2)}\nTotal Payment: ₹${totalPayment.toFixed(2)}\nTotal Interest: ₹${totalInterest.toFixed(2)}`,
      emi: emi.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      schedule: schedule.slice(0, 12),
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Calculation failed" }, { status: 400 });
  }
}
