import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { input, indent = 2 } = await req.json();
    if (!input) return NextResponse.json({ error: "No input provided" }, { status: 400 });
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, Number(indent));
    return NextResponse.json({ result: formatted });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid JSON" }, { status: 400 });
  }
}
