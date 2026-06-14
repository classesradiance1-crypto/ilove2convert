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

// ── JWT ──────────────────────────────────────────────────────

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

// ── Cookies — cookies() is NOT async in Next.js 14 ───────────

export async function setAuthCookie(user: AuthUser): Promise<void> {
  const token = await signToken(user);
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function getSessionUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

// ── DB User helpers ───────────────────────────────────────────

export interface DBUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  plan: "free" | "premium" | "business";
  is_verified: number;
  google_id: string | null;
  avatar_url: string | null;
  phone: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}

export async function findUserByEmail(email: string): Promise<DBUser | null> {
  const rows = await query<DBUser>(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email.toLowerCase().trim()]
  );
  return rows[0] ?? null;
}

export async function findUserById(id: number): Promise<DBUser | null> {
  const rows = await query<DBUser>(
    "SELECT id,name,email,plan,is_verified,google_id,avatar_url,phone,country,created_at,updated_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] ?? null;
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string
): Promise<number> {
  const result = await execute(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email.toLowerCase().trim(), passwordHash]
  );
  return result.insertId;
}

export async function updateUser(
  userId: number,
  fields: { name?: string; phone?: string; country?: string; avatar_url?: string }
): Promise<void> {
  const sets: string[] = [];
  const vals: (string | number | null)[] = [];
  if (fields.name !== undefined)       { sets.push("name = ?");       vals.push(fields.name); }
  if (fields.phone !== undefined)      { sets.push("phone = ?");      vals.push(fields.phone); }
  if (fields.country !== undefined)    { sets.push("country = ?");    vals.push(fields.country); }
  if (fields.avatar_url !== undefined) { sets.push("avatar_url = ?"); vals.push(fields.avatar_url); }
  if (!sets.length) return;
  vals.push(userId);
  await execute(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`, vals);
}

export async function updateUserPlan(
  userId: number,
  plan: "free" | "premium" | "business"
): Promise<void> {
  await execute("UPDATE users SET plan = ? WHERE id = ?", [plan, userId]);
}

export async function verifyUserEmail(userId: number): Promise<void> {
  await execute("UPDATE users SET is_verified = 1 WHERE id = ?", [userId]);
}

export async function changePassword(
  userId: number,
  newHash: string
): Promise<void> {
  await execute("UPDATE users SET password_hash = ? WHERE id = ?", [newHash, userId]);
}

// ── Audit log ─────────────────────────────────────────────────

export async function logAuthEvent(opts: {
  userId?: number | null;
  event: "signup" | "login" | "logout" | "login_failed" | "password_reset" | "profile_update";
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  meta?: Record<string, unknown>;
}): Promise<void> {
  try {
    await execute(
      `INSERT INTO audit_logs (user_id, event, email, ip_address, user_agent, meta)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        opts.userId ?? null,
        opts.event,
        opts.email ?? null,
        opts.ipAddress ?? null,
        opts.userAgent ?? null,
        opts.meta ? JSON.stringify(opts.meta) : null,
      ]
    );
  } catch (e) {
    console.error("Audit log error:", e);
  }
}

// ── Activity log ──────────────────────────────────────────────

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
         (user_id, session_id, tool_slug, tool_name, file_name, file_size,
          status, error_msg, ip_address, user_agent, duration_ms)
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

// ── Utilities ─────────────────────────────────────────────────

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
