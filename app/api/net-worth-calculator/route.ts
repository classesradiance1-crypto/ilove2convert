import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { assets = {}, liabilities = {} } = await req.json();

    const totalAssets = Object.values(assets as Record<string, number>).reduce((s, v) => s + Number(v || 0), 0);
    const totalLiabilities = Object.values(liabilities as Record<string, number>).reduce((s, v) => s + Number(v || 0), 0);
    const netWorth = totalAssets - totalLiabilities;

    const assetLines = Object.entries(assets as Record<string, number>)
      .filter(([, v]) => v)
      .map(([k, v]) => `  ${k}: ₹${Number(v).toLocaleString()}`).join("\n");
    const liabLines = Object.entries(liabilities as Record<string, number>)
      .filter(([, v]) => v)
      .map(([k, v]) => `  ${k}: ₹${Number(v).toLocaleString()}`).join("\n");

    return NextResponse.json({
      result: `Assets:\n${assetLines || "  None"}\nTotal Assets: ₹${totalAssets.toLocaleString()}\n\nLiabilities:\n${liabLines || "  None"}\nTotal Liabilities: ₹${totalLiabilities.toLocaleString()}\n\nNet Worth: ₹${netWorth.toLocaleString()}`,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Calculation failed" }, { status: 400 });
  }
}
