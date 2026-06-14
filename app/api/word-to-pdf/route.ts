import { NextRequest, NextResponse } from "next/server";
import { parseFiles } from "@/lib/parseForm";
import { pdfResponse } from "@/lib/response";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import mammoth from "mammoth";

export async function POST(req: NextRequest) {
  try {
    const { files } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // Extract text from Word doc using mammoth
    const result = await mammoth.extractRawText({ buffer: files[0].buffer });
    const text = result.value;

    // Build a PDF from the extracted text
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;
    const margin = 50;
    const lineHeight = fontSize * 1.4;
    const pageWidth = 595;
    const pageHeight = 842;
    const maxWidth = pageWidth - margin * 2;

    // Sanitize text: replace tabs with spaces, strip non-WinAnsi characters
    const sanitized = text
      .replace(/\t/g, "    ")
      .replace(/[^\x00-\xFF]/g, (c) => {
        // Try to replace common unicode chars with ASCII equivalents
        const map: Record<string, string> = {
          "\u2018": "'", "\u2019": "'", "\u201C": '"', "\u201D": '"',
          "\u2013": "-", "\u2014": "--", "\u2026": "...", "\u00A0": " ",
        };
        return map[c] ?? "";
      });

    // Word-wrap lines
    const rawLines = sanitized.split("\n");
    const wrappedLines: string[] = [];
    for (const raw of rawLines) {
      if (!raw.trim()) { wrappedLines.push(""); continue; }
      const words = raw.split(" ");
      let current = "";
      for (const word of words) {
        const test = current ? `${current} ${word}` : word;
        const w = font.widthOfTextAtSize(test, fontSize);
        if (w > maxWidth && current) {
          wrappedLines.push(current);
          current = word;
        } else {
          current = test;
        }
      }
      if (current) wrappedLines.push(current);
    }

    let page = doc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    for (const line of wrappedLines) {
      if (y < margin + lineHeight) {
        page = doc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      if (line) {
        page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
      }
      y -= lineHeight;
    }

    const bytes = await doc.save();
    return pdfResponse(Buffer.from(bytes), "converted.pdf");
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
