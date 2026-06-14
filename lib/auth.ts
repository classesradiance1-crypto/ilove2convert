import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { query, execute } from "./db";
import crypto from "crypto";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_change_me"
);

const COOKIE_NAME = "i2c_session";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  plan: "free" | "premium" | "business";
}

// ── Token helpers ──────────────────────────────────────────

export async function signToken(payload: AuthUser): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as AuthUser;
  } catch {
    return null;
  }
}

// ── Cookie helpers ─────────────────────────────────────────

export async function setAuthCookie(user: AuthUser): Promise<void> {
  const token = await signToken(user);
  // Next.js 14: cookies() is synchronous in Route Handlers
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearAuthCookie(): Promise<void> {
  cookies().delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<AuthUser | null> {
  try {
    const token = cookies().get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

// ── DB helpers — uses i2c_users table ─────────────────────

export interface DBUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  plan: "free" | "premium" | "business";
  is_verified: number;
}

export async function findUserByEmail(email: string): Promise<DBUser | null> {
  const rows = await query<DBUser[]>(
    "SELECT * FROM i2c_users WHERE email = ? LIMIT 1",
    [email.toLowerCase().trim()]
  );
  return rows[0] || null;
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string
): Promise<number> {
  const result = await execute(
    "INSERT INTO i2c_users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email.toLowerCase().trim(), passwordHash]
  );
  return result.insertId;
}

// ── Activity logging ───────────────────────────────────────

export async function logActivity(opts: {
  userId?: number | null;
  sessionId?: string;
  toolSlug: string;
  toolName: string;
  fileName?: string;
  fileSize?: number;
  status: "started" | "success" | "error";
  errorMsg?: string;
  ipAddress?: string;
  userAgent?: string;
  durationMs?: number;
}): Promise<void> {
  try {
    await execute(
      `INSERT INTO activity_logs
        (user_id, session_id, tool_slug, tool_name, file_name, file_size, status, error_msg, ip_address, user_agent, duration_ms)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        opts.userId ?? null,
        opts.sessionId ?? null,
        opts.toolSlug,
        opts.toolName,
        opts.fileName ?? null,
        opts.fileSize ?? null,
        opts.status,
        opts.errorMsg ?? null,
        opts.ipAddress ?? null,
        opts.userAgent ?? null,
        opts.durationMs ?? null,
      ]
    );
  } catch (e) {
    console.error("Activity log error:", e);
  }
}

export async function logAuthEvent(opts: {
  userId?: number | null;
  event: "signup" | "login" | "logout" | "login_failed" | "password_reset";
  email?: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  try {
    await execute(
      `INSERT INTO auth_logs (user_id, event, email, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)`,
      [
        opts.userId ?? null,
        opts.event,
        opts.email ?? null,
        opts.ipAddress ?? null,
        opts.userAgent ?? null,
      ]
    );
  } catch (e) {
    console.error("Auth log error:", e);
  }
}

export function getClientInfo(req: Request): { ip: string; ua: string } {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const ua = req.headers.get("user-agent") || "unknown";
  return { ip, ua };
}

export function hashString(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex");
}
