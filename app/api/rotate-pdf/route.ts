import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, degrees } from "pdf-lib";
import { parseFiles } from "@/lib/parseForm";
import { pdfResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const { files, fields } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const angle = parseInt(fields.rotation || "90");
    const doc = await PDFDocument.load(files[0].buffer);
    doc.getPages().forEach((page) => {
      page.setRotation(degrees((page.getRotation().angle + angle) % 360));
    });

    const bytes = await doc.save();
    return pdfResponse(Buffer.from(bytes), "rotated.pdf");
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to rotate PDF" }, { status: 500 });
  }
}
