import { NextRequest, NextResponse } from "next/server";
import { parseFiles } from "@/lib/parseForm";
import { pdfResponse } from "@/lib/response";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import * as XLSX from "xlsx";

// XLSX can also read PPTX (extracts slide text)
export async function POST(req: NextRequest) {
  try {
    const { files } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // Parse PPTX as a zip and extract text from slides
    const JSZip = (await import("jszip")).default;
    const zip = await JSZip.loadAsync(files[0].buffer);

    const slideFiles = Object.keys(zip.files)
      .filter((name) => name.match(/^ppt\/slides\/slide\d+\.xml$/))
      .sort((a, b) => {
        const na = parseInt(a.match(/\d+/)?.[0] || "0");
        const nb = parseInt(b.match(/\d+/)?.[0] || "0");
        return na - nb;
      });

    const doc = await PDFDocument.create();
    const titleFont = await doc.embedFont(StandardFonts.HelveticaBold);
    const bodyFont = await doc.embedFont(StandardFonts.Helvetica);

    for (let i = 0; i < slideFiles.length; i++) {
      const xml = await zip.files[slideFiles[i]].async("string");
      // Extract text nodes from XML
      const texts = Array.from(xml.matchAll(/<a:t[^>]*>([^<]+)<\/a:t>/g)).map((m) => m[1]);
      const slideText = texts.join(" ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

      const page = doc.addPage([720, 540]); // 4:3 slide
      const { width, height } = page.getSize();

      // Slide number
      page.drawText(`Slide ${i + 1}`, {
        x: 20, y: height - 30, size: 10, font: bodyFont, color: rgb(0.5, 0.5, 0.5),
      });

      // Slide content
      const words = slideText.split(" ");
      const lines: string[] = [];
      let current = "";
      for (const word of words) {
        const test = current ? `${current} ${word}` : word;
        if (bodyFont.widthOfTextAtSize(test, 14) > width - 80 && current) {
          lines.push(current);
          current = word;
        } else {
          current = test;
        }
      }
      if (current) lines.push(current);

      // First line as title
      if (lines[0]) {
        page.drawText(lines[0].substring(0, 80), {
          x: 40, y: height - 80, size: 24, font: titleFont, color: rgb(0.1, 0.1, 0.4),
        });
      }
      let y = height - 130;
      for (const line of lines.slice(1)) {
        if (y < 40) break;
        page.drawText(line.substring(0, 100), { x: 40, y, size: 14, font: bodyFont, color: rgb(0.2, 0.2, 0.2) });
        y -= 24;
      }
    }

    if (doc.getPageCount() === 0) doc.addPage([720, 540]);
    const bytes = await doc.save();
    return pdfResponse(Buffer.from(bytes), "converted.pdf");
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
