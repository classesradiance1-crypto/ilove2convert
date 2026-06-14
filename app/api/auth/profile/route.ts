import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSessionUser, findUserById, updateUser, changePassword, logAuthEvent, getClientInfo } from "@/lib/auth";
import { query } from "@/lib/db";

// GET /api/auth/profile — full profile + stats
export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findUserById(session.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Usage stats
  const [stats] = await query<{ total: number; success: number; error: number }>(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'success') AS success,
       SUM(status = 'error') AS error
     FROM activity_logs WHERE user_id = ?`,
    [session.id]
  );

  // Recent activity (last 10)
  const recent = await query(
    `SELECT tool_name, tool_slug, status, file_name, duration_ms, created_at
     FROM activity_logs WHERE user_id = ?
     ORDER BY created_at DESC LIMIT 10`,
    [session.id]
  );

  // Recent audit events (last 10)
  const auditEvents = await query(
    `SELECT event, ip_address, created_at FROM audit_logs
     WHERE user_id = ? ORDER BY created_at DESC LIMIT 10`,
    [session.id]
  );

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      is_verified: user.is_verified,
      phone: user.phone,
      country: user.country,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
    },
    stats: { total: Number(stats?.total ?? 0), success: Number(stats?.success ?? 0), error: Number(stats?.error ?? 0) },
    recent,
    auditEvents,
  });
}

// PATCH /api/auth/profile — update name, phone, country
export async function PATCH(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ip, ua } = getClientInfo(req);
  const body = await req.json();
  const { name, phone, country } = body;

  await updateUser(session.id, {
    name: name?.trim() || undefined,
    phone: phone?.trim() || undefined,
    country: country?.trim() || undefined,
  });

  logAuthEvent({ userId: session.id, event: "profile_update", ipAddress: ip, userAgent: ua }).catch(console.error);

  const updated = await findUserById(session.id);
  return NextResponse.json({ success: true, user: updated });
}

// POST /api/auth/profile — change password
export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Both passwords are required." }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
  }

  const { query: dbQuery } = await import("@/lib/db");
  const rows = await dbQuery<{ password_hash: string }>(
    "SELECT password_hash FROM users WHERE id = ? LIMIT 1",
    [session.id]
  );
  if (!rows[0]) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);
  if (!valid) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });

  const newHash = await bcrypt.hash(newPassword, 12);
  await changePassword(session.id, newHash);

  const { ip, ua } = getClientInfo(req);
  logAuthEvent({ userId: session.id, event: "password_reset", ipAddress: ip, userAgent: ua }).catch(console.error);

  return NextResponse.json({ success: true });
}
