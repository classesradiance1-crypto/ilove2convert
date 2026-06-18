import { NextRequest, NextResponse } from "next/server";
import { parseFiles } from "@/lib/parseForm";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import * as pdfParseModule from "pdf-parse";
const pdfParse = (pdfParseModule as unknown as { default: typeof pdfParseModule }).default ?? pdfParseModule;


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-04-22.dahlia",
});

function getParagraphType(line: string): string {
  if (line.length < 60 && /^[A-Z0-9]/.test(line) && !/[.?!,]$/.test(line)) return "h2";
  return "body";
}

export async function POST(req: NextRequest) {
  try {
    const { files } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const data = await pdfParse(Buffer.from(files[0].buffer));
    const rawLines = data.text.split("\n");

    if (!rawLines.length || !data.text.trim()) {
      return NextResponse.json({
        error: "Could not extract text from this PDF. It may be a scanned image — try OCR PDF first.",
      }, { status: 422 });
    }

    const docChildren: Paragraph[] = [];

    for (const raw of rawLines) {
      const line = raw.trim();
      const bulletMatch = line.match(/^[•●▪◦\-]\s+(.+)/);
      const kind = getParagraphType(line);

      if (!line) {
        docChildren.push(new Paragraph({ text: "" }));
      } else if (bulletMatch) {
        docChildren.push(new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: bulletMatch[1] })],
          spacing: { after: 40 },
        }));
      } else if (kind === "h2") {
        docChildren.push(new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: line, bold: true })],
          spacing: { before: 200, after: 80 },
        }));
      } else {
        docChildren.push(new Paragraph({
          children: [new TextRun({ text: line })],
          spacing: { after: 60 },
        }));
      }
    }

    const doc = new Document({
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
