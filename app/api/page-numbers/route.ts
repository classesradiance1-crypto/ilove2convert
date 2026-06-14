import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { parseFiles } from "@/lib/parseForm";
import { pdfResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const { files, fields } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const position = fields.position || "bottom-center";
    const doc = await PDFDocument.load(files[0].buffer);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const pages = doc.getPages();

    pages.forEach((page, i) => {
      const { width, height } = page.getSize();
      const text = `${i + 1}`;
      const textWidth = font.widthOfTextAtSize(text, 12);

      let x = width / 2 - textWidth / 2;
      let y = 20;

      if (position === "bottom-right") { x = width - 40; y = 20; }
      else if (position === "bottom-left") { x = 20; y = 20; }
      else if (position === "top-center") { x = width / 2 - textWidth / 2; y = height - 30; }

      page.drawText(text, { x, y, size: 12, font, color: rgb(0.3, 0.3, 0.3) });
    });

    const bytes = await doc.save();
    return pdfResponse(Buffer.from(bytes), "numbered.pdf");
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
