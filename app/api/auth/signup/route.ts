import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail, setAuthCookie, logAuthEvent, getClientInfo } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    const { ip, ua } = getClientInfo(req);

    // Validation
    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    // Check existing
    const existing = await findUserByEmail(email);
    if (existing) {
      await logAuthEvent({ event: "login_failed", email, ipAddress: ip, userAgent: ua });
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const userId = await createUser(name.trim(), email.trim(), passwordHash);

    // Log signup
    await logAuthEvent({ userId, event: "signup", email, ipAddress: ip, userAgent: ua });

    // Set session cookie
    await setAuthCookie({ id: userId, name: name.trim(), email: email.toLowerCase().trim(), plan: "free" });

    return NextResponse.json({
      success: true,
      user: { id: userId, name: name.trim(), email: email.toLowerCase().trim(), plan: "free" },
    });
  } catch (e: unknown) {
    console.error("Signup error:", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
