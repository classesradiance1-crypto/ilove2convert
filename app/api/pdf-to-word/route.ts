import { NextRequest, NextResponse } from "next/server";
import { parseFiles } from "@/lib/parseForm";
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, UnderlineType,
} from "docx";

// ── Types ──────────────────────────────────────────────────────────────────

interface TextItem {
  str: string;
  transform: number[]; // [scaleX, skewX, skewY, scaleY, x, y]
  fontName: string;
  width: number;
  height: number;
  hasEOL: boolean;
}

interface FontInfo {
  name: string;
  bold?: boolean;
  italic?: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function isBoldFont(fontName: string): boolean {
  return /bold|heavy|black/i.test(fontName);
}

function isItalicFont(fontName: string): boolean {
  return /italic|oblique/i.test(fontName);
}

// Group text items into logical lines by Y coordinate
function groupIntoLines(items: TextItem[]): TextItem[][] {
  if (!items.length) return [];
  const sorted = [...items].sort((a, b) => {
    const yDiff = b.transform[5] - a.transform[5]; // PDF Y is bottom-up
    return Math.abs(yDiff) < 3 ? a.transform[4] - b.transform[4] : yDiff;
  });

  const lines: TextItem[][] = [];
  let current: TextItem[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prevY = current[0].transform[5];
    const currY = sorted[i].transform[5];
    if (Math.abs(currY - prevY) < 3) {
      current.push(sorted[i]);
    } else {
      lines.push(current);
      current = [sorted[i]];
    }
  }
  lines.push(current);
  return lines;
}

// Determine paragraph type from font size and bold
function getParagraphType(fontSize: number, bold: boolean, text: string): string {
  const len = text.trim().length;
  if (fontSize >= 20) return "h1";
  if (fontSize >= 15 || (fontSize >= 13 && bold && len < 80)) return "h2";
  if (fontSize >= 12 && bold && len < 100) return "h3";
  return "body";
}

// ── Main handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { files } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // Use pdfjs-dist for rich text extraction
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(files[0].buffer) });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;

    const docChildren: Paragraph[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const items = textContent.items as TextItem[];

      if (!items.length) continue;

      const lines = groupIntoLines(items);
      let prevLineY = -1;

      for (const lineItems of lines) {
        // Sort left to right
        lineItems.sort((a, b) => a.transform[4] - b.transform[4]);

        const lineText = lineItems.map(i => i.str).join("").trim();
        if (!lineText) continue;

        // Detect large Y gap = blank line between sections
        const currY = lineItems[0].transform[5];
        if (prevLineY >= 0 && Math.abs(prevLineY - currY) > 20) {
          docChildren.push(new Paragraph({ text: "" }));
        }
        prevLineY = currY;

        // Build runs preserving per-item bold/italic/size
        const runs: TextRun[] = [];
        let maxFontSize = 0;
        let anyBold = false;

        for (const item of lineItems) {
          if (!item.str) continue;
          const fontSize = Math.abs(item.transform[3]) || 10;
          const bold = isBoldFont(item.fontName);
          const italic = isItalicFont(item.fontName);

          if (fontSize > maxFontSize) maxFontSize = fontSize;
          if (bold) anyBold = true;

          runs.push(new TextRun({
            text: item.str,
            bold,
            italics: italic,
            size: Math.max(16, Math.round(fontSize * 2)), // half-points, min 8pt
          }));
        }

        if (!runs.length) continue;

        const kind = getParagraphType(maxFontSize, anyBold, lineText);

        // Bullet detection
        const bulletMatch = lineText.match(/^[•●▪◦\-]\s+(.+)/);

        if (kind === "h1") {
          docChildren.push(new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: runs,
            spacing: { before: 240, after: 120 },
          }));
        } else if (kind === "h2") {
          docChildren.push(new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: runs,
            spacing: { before: 200, after: 80 },
          }));
        } else if (kind === "h3") {
          docChildren.push(new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: runs,
            spacing: { before: 160, after: 60 },
          }));
        } else if (bulletMatch) {
          docChildren.push(new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({
              text: bulletMatch[1],
              size: Math.max(16, Math.round(maxFontSize * 2)),
            })],
            spacing: { after: 40 },
          }));
        } else {
          docChildren.push(new Paragraph({
            children: runs,
            spacing: { after: 60 },
          }));
        }
      }

      // Page break between pages (except last)
      if (pageNum < numPages) {
        docChildren.push(new Paragraph({ pageBreakBefore: true, text: "" }));
      }
    }

    if (!docChildren.length) {
      return NextResponse.json({
        error: "Could not extract text from this PDF. It may be a scanned image — try OCR PDF first.",
      }, { status: 422 });
    }

    const doc = new Document({
      styles: {
        paragraphStyles: [
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            run: { size: 40, bold: true, color: "1F4E79" },
            paragraph: { spacing: { after: 120 } },
          },
          {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            run: { size: 28, bold: true, color: "2E74B5" },
            paragraph: { spacing: { before: 200, after: 80 } },
          },
          {
            id: "Heading3",
            name: "Heading 3",
            basedOn: "Normal",
            next: "Normal",
            run: { size: 22, bold: true, color: "404040" },
            paragraph: { spacing: { before: 120, after: 60 } },
          },
        ],
      },
      sections: [{
        properties: {
          page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } },
        },
        children: docChildren,
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const ab = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

    return new Response(ab as ArrayBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="converted.docx"',
      },
    });
  } catch (e: unknown) {
    console.error("PDF to Word error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to convert PDF" },
      { status: 500 }
    );
  }
}
