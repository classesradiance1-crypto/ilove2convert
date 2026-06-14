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
      const page = doc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }

    const bytes = await doc.save();
    return pdfResponse(Buffer.from(bytes), "images.pdf");
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to convert images" }, { status: 500 });
  }
}
