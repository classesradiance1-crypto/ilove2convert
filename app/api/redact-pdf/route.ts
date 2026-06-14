import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb } from "pdf-lib";
import { parseFiles } from "@/lib/parseForm";
import { pdfResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const { files, fields } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const doc = await PDFDocument.load(files[0].buffer);
    const x = parseFloat(fields.x || "100");
    const y = parseFloat(fields.y || "100");
    const w = parseFloat(fields.w || "200");
    const h = parseFloat(fields.h || "30");
    const pageNum = parseInt(fields.page || "1") - 1;

    const pages = doc.getPages();
    if (pages[pageNum]) {
      pages[pageNum].drawRectangle({ x, y, width: w, height: h, color: rgb(0, 0, 0), opacity: 1 });
    }

    const bytes = await doc.save();
    return pdfResponse(Buffer.from(bytes), "redacted.pdf");
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
