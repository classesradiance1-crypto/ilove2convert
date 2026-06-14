import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { input, algorithm = "sha256" } = await req.json();
    if (!input) return NextResponse.json({ error: "No input provided" }, { status: 400 });
    const allowed = ["md5", "sha1", "sha256", "sha512"];
    const algo = allowed.includes(algorithm) ? algorithm : "sha256";
    const hash = createHash(algo).update(input).digest("hex");
    return NextResponse.json({ result: hash, algorithm: algo });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to hash" }, { status: 400 });
  }
}
