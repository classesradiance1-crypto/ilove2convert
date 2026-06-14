import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { count = 1 } = await req.json().catch(() => ({}));
    const n = Math.min(Math.max(1, Number(count)), 100);
    const uuids = Array.from({ length: n }, () => randomUUID());
    return NextResponse.json({ result: uuids.join("\n") });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to generate" }, { status: 500 });
  }
}
