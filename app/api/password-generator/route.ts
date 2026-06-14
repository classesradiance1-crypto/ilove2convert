import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { length = 16, uppercase = true, lowercase = true, numbers = true, symbols = true, count = 1 } = await req.json().catch(() => ({}));
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const nums = "0123456789";
    const syms = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let charset = "";
    if (uppercase) charset += upper;
    if (lowercase) charset += lower;
    if (numbers) charset += nums;
    if (symbols) charset += syms;
    if (!charset) charset = lower + nums;

    const len = Math.min(Math.max(4, Number(length)), 128);
    const n = Math.min(Math.max(1, Number(count)), 20);

    const passwords = Array.from({ length: n }, () =>
      Array.from({ length: len }, () => charset[Math.floor(Math.random() * charset.length)]).join("")
    );

    return NextResponse.json({ result: passwords.join("\n") });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to generate" }, { status: 500 });
  }
}
