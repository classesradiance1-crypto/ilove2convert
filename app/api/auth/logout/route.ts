import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie, getSessionUser, logAuthEvent, getClientInfo } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { ip, ua } = getClientInfo(req);
  const user = await getSessionUser();
  if (user) {
    await logAuthEvent({ userId: user.id, event: "logout", email: user.email, ipAddress: ip, userAgent: ua });
  }
  await clearAuthCookie();
  return NextResponse.json({ success: true });
}
