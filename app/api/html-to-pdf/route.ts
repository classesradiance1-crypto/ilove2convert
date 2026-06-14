import { NextRequest, NextResponse } from "next/server";
import { parseFiles } from "@/lib/parseForm";
import { pdfResponse } from "@/lib/response";
import { exec } from "child_process";
import { promisify } from "util";
import { readFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import path from "path";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { fields } = await parseFiles(req);
    const url = fields.url;
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    const tmpOut = path.join(tmpdir(), `html_${Date.now()}.pdf`);

    try {
      await execAsync(`wkhtmltopdf "${url}" "${tmpOut}"`);
      const result = await readFile(tmpOut);
      await unlink(tmpOut).catch(() => {});
      return pdfResponse(result, "webpage.pdf");
    } catch {
      await unlink(tmpOut).catch(() => {});
      return NextResponse.json({ error: "wkhtmltopdf is required for HTML to PDF. Install it on the server." }, { status: 501 });
    }
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
