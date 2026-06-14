import { NextRequest, NextResponse } from "next/server";

// India FY 2024-25 New Tax Regime slabs
const SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 600000, rate: 5 },
  { min: 600000, max: 900000, rate: 10 },
  { min: 900000, max: 1200000, rate: 15 },
  { min: 1200000, max: 1500000, rate: 20 },
  { min: 1500000, max: Infinity, rate: 30 },
];

export async function POST(req: NextRequest) {
  try {
    const { income, deductions = 0 } = await req.json();
    const gross = Number(income);
    const ded = Number(deductions);
    if (!gross) return NextResponse.json({ error: "Please provide annual income." }, { status: 400 });

    const taxable = Math.max(0, gross - ded);
    let tax = 0;
    const breakdown: string[] = [];

    for (const slab of SLABS) {
      if (taxable <= slab.min) break;
      const slabIncome = Math.min(taxable, slab.max) - slab.min;
      const slabTax = (slabIncome * slab.rate) / 100;
      tax += slabTax;
      if (slabTax > 0) {
        breakdown.push(`₹${slab.min.toLocaleString()} – ₹${slab.max === Infinity ? "above" : slab.max.toLocaleString()} @ ${slab.rate}%: ₹${slabTax.toFixed(2)}`);
      }
    }

    const cess = tax * 0.04;
    const totalTax = tax + cess;

    return NextResponse.json({
      result: `Taxable Income: ₹${taxable.toLocaleString()}\nIncome Tax: ₹${tax.toFixed(2)}\nHealth & Education Cess (4%): ₹${cess.toFixed(2)}\nTotal Tax: ₹${totalTax.toFixed(2)}\n\nBreakdown:\n${breakdown.join("\n")}`,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Calculation failed" }, { status: 400 });
  }
}
