import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { input, mode } = await req.json();
    if (!input) return NextResponse.json({ error: "No input provided" }, { status: 400 });
    if (mode === "encode") {
      const result = Buffer.from(input, "utf8").toString("base64");
      return NextResponse.json({ result });
    } else {
      const result = Buffer.from(input, "base64").toString("utf8");
      return NextResponse.json({ result });
    }
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to process" }, { status: 400 });
  }
}
