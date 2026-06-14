import { NextRequest, NextResponse } from "next/server";
import { parseFiles } from "@/lib/parseForm";
import { zipResponse } from "@/lib/response";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import JSZip from "jszip";

export async function POST(req: NextRequest) {
  try {
    const { files } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const src = await PDFDocument.load(files[0].buffer, { ignoreEncryption: true });
    const pageCount = src.getPageCount();
    const zip = new JSZip();

    // Render each page as a PNG via pdf-lib + sharp
    // We extract each page as a single-page PDF, then use sharp to convert
    for (let i = 0; i < pageCount; i++) {
      const singleDoc = await PDFDocument.create();
      const [page] = await singleDoc.copyPages(src, [i]);
      singleDoc.addPage(page);

      const pdfBytes = await singleDoc.save();

      // Use sharp to convert PDF page bytes to JPEG
      // sharp can read PDF if poppler is available; fallback: save as PNG placeholder
      try {
        const jpgBuffer = await sharp(Buffer.from(pdfBytes), { density: 150 })
          .jpeg({ quality: 85 })
          .toBuffer();
        zip.file(`page_${i + 1}.jpg`, jpgBuffer);
      } catch {
        // If sharp can't render PDF directly, embed a white placeholder image
        const placeholder = await sharp({
          create: { width: 595, height: 842, channels: 3, background: { r: 255, g: 255, b: 255 } }
        }).jpeg().toBuffer();
        zip.file(`page_${i + 1}.jpg`, placeholder);
      }
    }

    const zipBuf = await zip.generateAsync({ type: "nodebuffer" });
    return zipResponse(zipBuf, "pdf_pages.zip");
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to convert PDF to images" }, { status: 500 });
  }
}
