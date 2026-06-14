import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, rate, type = "exclusive" } = await req.json();
    const amt = Number(amount);
    const gstRate = Number(rate);
    if (!amt || !gstRate) return NextResponse.json({ error: "Please provide amount and GST rate." }, { status: 400 });

    let original: number, gstAmount: number, total: number;
    if (type === "inclusive") {
      // GST already included in amount
      original = (amt * 100) / (100 + gstRate);
      gstAmount = amt - original;
      total = amt;
    } else {
      original = amt;
      gstAmount = (amt * gstRate) / 100;
      total = amt + gstAmount;
    }

    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;

    return NextResponse.json({
      result: `Original Amount: ₹${original.toFixed(2)}\nGST (${gstRate}%): ₹${gstAmount.toFixed(2)}\nCGST (${gstRate / 2}%): ₹${cgst.toFixed(2)}\nSGST (${gstRate / 2}%): ₹${sgst.toFixed(2)}\nTotal Amount: ₹${total.toFixed(2)}`,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Calculation failed" }, { status: 400 });
  }
}
