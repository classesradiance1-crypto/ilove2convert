import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { parseFiles } from "@/lib/parseForm";
import { pdfResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const { files, fields } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const text = fields.text || "";
    const pageNum = parseInt(fields.page || "1") - 1;
    const x = parseFloat(fields.x || "50");
    const y = parseFloat(fields.y || "50");

    const doc = await PDFDocument.load(files[0].buffer);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const pages = doc.getPages();

    if (text && pages[pageNum]) {
      pages[pageNum].drawText(text, { x, y, size: 14, font, color: rgb(0, 0, 0) });
    }

    const bytes = await doc.save();
    return pdfResponse(Buffer.from(bytes), "edited.pdf");
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
