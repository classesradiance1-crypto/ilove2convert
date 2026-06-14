import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { parseFiles } from "@/lib/parseForm";
import { pdfResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const { files } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const doc = await PDFDocument.load(files[0].buffer, { ignoreEncryption: true });
    const bytes = await doc.save();
    return pdfResponse(Buffer.from(bytes), "repaired.pdf");
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not repair PDF" }, { status: 500 });
  }
}
