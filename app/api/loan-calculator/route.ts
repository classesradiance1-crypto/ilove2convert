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

    return NextResponse.json({
      result: `Monthly Payment: ₹${emi.toFixed(2)}\nTotal Amount Payable: ₹${totalPayment.toFixed(2)}\nTotal Interest: ₹${totalInterest.toFixed(2)}\nLoan Amount: ₹${P.toLocaleString()}`,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Calculation failed" }, { status: 400 });
  }
}
