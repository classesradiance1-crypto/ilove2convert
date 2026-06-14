import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail, setAuthCookie, logAuthEvent, getClientInfo } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const { ip, ua } = getClientInfo(req);

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await findUserByEmail(email.trim());

    if (!user) {
      await logAuthEvent({ event: "login_failed", email, ipAddress: ip, userAgent: ua });
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      await logAuthEvent({ userId: user.id, event: "login_failed", email, ipAddress: ip, userAgent: ua });
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Set cookie first, then log (non-blocking)
    await setAuthCookie({
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
    });

    logAuthEvent({ userId: user.id, event: "login", email: user.email, ipAddress: ip, userAgent: ua }).catch(console.error);

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
    });
  } catch (e: unknown) {
    console.error("Login error:", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
