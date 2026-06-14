import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { input, mode } = await req.json();
    if (!input) return NextResponse.json({ error: "No input provided" }, { status: 400 });
    const result = mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    return NextResponse.json({ result });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to process" }, { status: 400 });
  }
}
