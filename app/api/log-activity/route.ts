import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, logActivity, getClientInfo } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ip, ua } = getClientInfo(req);
    const user = await getSessionUser();

    await logActivity({
      userId: user?.id ?? null,
      sessionId: body.sessionId,
      toolSlug: body.toolSlug,
      toolName: body.toolName,
      fileName: body.fileName,
      fileSize: body.fileSize,
      status: body.status,
      errorMsg: body.errorMsg,
      ipAddress: ip,
      userAgent: ua,
      durationMs: body.durationMs,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
