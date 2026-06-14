import { NextRequest, NextResponse } from "next/server";
import { parseFiles } from "@/lib/parseForm";
import { pdfResponse } from "@/lib/response";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { createWorker } from "tesseract.js";
import { extractPdfText } from "@/lib/extractPdfText";

export async function POST(req: NextRequest) {
  try {
    const { files } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const inputBuffer = files[0].buffer;

    // First try to extract existing text (works for text-based PDFs)
    const existingText = await extractPdfText(inputBuffer);

    // Load PDF and create output doc
    const pdfDoc = await PDFDocument.load(inputBuffer);
    const outDoc = await PDFDocument.create();
    const font = await outDoc.embedFont(StandardFonts.Helvetica);
    const pageCount = pdfDoc.getPageCount();

    // Copy all pages to output doc
    const copiedPages = await outDoc.copyPages(pdfDoc, Array.from({ length: pageCount }, (_, i) => i));
    copiedPages.forEach(p => outDoc.addPage(p));

    if (existingText.trim().length > 50) {
      // Text-based PDF — already has selectable text, just return it as-is
      const result = await outDoc.save();
      return pdfResponse(Buffer.from(result), "ocr_output.pdf");
    }

    // Scanned PDF — run Tesseract OCR on the PDF buffer directly
    // Tesseract.js v5 can accept a Buffer and will attempt to read it as an image
    const worker = await createWorker("eng");

    try {
      const { data: { text } } = await worker.recognize(inputBuffer);

      if (text.trim()) {
        // Add the OCR text as a searchable text layer on page 1
        const page = outDoc.getPage(0);
        const { width, height } = page.getSize();
        const lines = text.split("\n").filter(l => l.trim().length > 0);
        const lineHeight = 12;
        const maxLines = Math.floor((height - 40) / lineHeight);
        const visibleLines = lines.slice(0, maxLines);

        let y = height - 20;
        for (const line of visibleLines) {
          page.drawText(line.substring(0, 100), {
            x: 10,
            y,
            size: 9,
            font,
            color: rgb(0.1, 0.1, 0.1),
          });
          y -= lineHeight;
        }
      }
    } finally {
      await worker.terminate();
    }

    const result = await outDoc.save();
    return pdfResponse(Buffer.from(result), "ocr_output.pdf");
  } catch (e: unknown) {
    console.error("OCR error:", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "OCR failed" }, { status: 500 });
  }
}
