import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { parseFiles } from "@/lib/parseForm";
import { pdfResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const { files } = await parseFiles(req);
    if (!files.length) return NextResponse.json({ error: "No images uploaded" }, { status: 400 });

    const doc = await PDFDocument.create();
    for (const file of files) {
      let img;
      if (file.type === "image/png") {
        img = await doc.embedPng(file.buffer);
      } else {
        img = await doc.embedJpg(file.buffer);
      }
      const page = doc.addPage([595, 842]);
      const scale = Math.min(595 / img.width, 842 / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      page.drawImage(img, { x: (595 - w) / 2, y: (842 - h) / 2, width: w, height: h });
    }

    const bytes = await doc.save();
    return pdfResponse(Buffer.from(bytes), "scanned.pdf");
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
