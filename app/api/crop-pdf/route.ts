import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { parseFiles } from "@/lib/parseForm";
import { pdfResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const { files, fields } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const margin = parseFloat(fields.margin || "10") / 100;
    const doc = await PDFDocument.load(files[0].buffer);

    doc.getPages().forEach((page) => {
      const { width, height } = page.getSize();
      const mx = width * margin;
      const my = height * margin;
      page.setCropBox(mx, my, width - mx * 2, height - my * 2);
    });

    const bytes = await doc.save();
    return pdfResponse(Buffer.from(bytes), "cropped.pdf");
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to crop PDF" }, { status: 500 });
  }
}
