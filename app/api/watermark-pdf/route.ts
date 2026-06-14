import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { parseFiles } from "@/lib/parseForm";
import { pdfResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const { files, fields } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const text = fields.text || "CONFIDENTIAL";
    const doc = await PDFDocument.load(files[0].buffer);
    const font = await doc.embedFont(StandardFonts.HelveticaBold);

    doc.getPages().forEach((page) => {
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 2 - (text.length * 18) / 2,
        y: height / 2,
        size: 48,
        font,
        color: rgb(0.8, 0.1, 0.1),
        opacity: 0.3,
        rotate: degrees(45),
      });
    });

    const bytes = await doc.save();
    return pdfResponse(Buffer.from(bytes), "watermarked.pdf");
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to add watermark" }, { status: 500 });
  }
}
