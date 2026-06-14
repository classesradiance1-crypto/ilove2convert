import { NextResponse } from "next/server";

export function notImplemented(toolName: string) {
  return NextResponse.json(
    {
      error: `${toolName} requires LibreOffice or an external service installed on the server. Please configure the server environment.`,
    },
    { status: 501 }
  );
}
