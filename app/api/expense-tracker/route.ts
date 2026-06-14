import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { expenses, income = 0 } = await req.json();
    if (!expenses || typeof expenses !== "object") return NextResponse.json({ error: "Please provide expense categories." }, { status: 400 });

    const total = Object.values(expenses as Record<string, number>).reduce((s, v) => s + Number(v || 0), 0);
    const inc = Number(income);
    const savings = inc - total;

    const lines = Object.entries(expenses as Record<string, number>)
      .filter(([, v]) => v)
      .map(([cat, amt]) => {
        const pct = total > 0 ? ((Number(amt) / total) * 100).toFixed(1) : "0.0";
        return `  ${cat}: ₹${Number(amt).toLocaleString()} (${pct}%)`;
      }).join("\n");

    return NextResponse.json({
      result: `Expense Breakdown:\n${lines || "  No expenses"}\n\nTotal Expenses: ₹${total.toLocaleString()}${inc ? `\nIncome: ₹${inc.toLocaleString()}\nSavings: ₹${savings.toLocaleString()} (${((savings / inc) * 100).toFixed(1)}%)` : ""}`,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Calculation failed" }, { status: 400 });
  }
}
