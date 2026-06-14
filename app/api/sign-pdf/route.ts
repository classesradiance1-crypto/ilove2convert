import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { parseFiles } from "@/lib/parseForm";
import { pdfResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const { files, fields } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const name = fields.name || "Signature";
    const doc = await PDFDocument.load(files[0].buffer);
    const font = await doc.embedFont(StandardFonts.HelveticaOblique);
    const pages = doc.getPages();
    const lastPage = pages[pages.length - 1];
    const { width } = lastPage.getSize();

    lastPage.drawText(name, {
      x: width - 200,
      y: 40,
      size: 20,
      font,
      color: rgb(0.1, 0.1, 0.6),
    });

    const bytes = await doc.save();
    return pdfResponse(Buffer.from(bytes), "signed.pdf");
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
