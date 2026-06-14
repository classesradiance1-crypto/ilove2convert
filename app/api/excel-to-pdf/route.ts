import { NextRequest, NextResponse } from "next/server";
import { parseFiles } from "@/lib/parseForm";
import { pdfResponse } from "@/lib/response";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const { files } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const workbook = XLSX.read(files[0].buffer, { type: "buffer" });
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Courier);
    const fontSize = 9;
    const margin = 30;
    const lineHeight = fontSize * 1.5;
    const pageWidth = 842; // A4 landscape
    const pageHeight = 595;

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const rows: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

      let page = doc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;

      // Sheet title
      page.drawText(`Sheet: ${sheetName}`, {
        x: margin, y, size: 12,
        font: await doc.embedFont(StandardFonts.HelveticaBold),
        color: rgb(0.2, 0.2, 0.8),
      });
      y -= lineHeight * 2;

      for (const row of rows) {
        if (y < margin + lineHeight) {
          page = doc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        const rowText = row.map((cell) => String(cell ?? "").substring(0, 20).padEnd(20)).join(" | ");
        page.drawText(rowText.substring(0, 120), { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
        y -= lineHeight;
      }
    }

    const bytes = await doc.save();
    return pdfResponse(Buffer.from(bytes), "converted.pdf");
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
