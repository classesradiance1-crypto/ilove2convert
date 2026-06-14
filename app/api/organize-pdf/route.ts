import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { parseFiles } from "@/lib/parseForm";
import { pdfResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const { files, fields } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const src = await PDFDocument.load(files[0].buffer);
    const total = src.getPageCount();

    let order: number[];
    if (fields.order) {
      order = fields.order.split(",").map((n) => parseInt(n.trim()) - 1).filter((n) => n >= 0 && n < total);
    } else {
      order = Array.from({ length: total }, (_, i) => i);
    }

    const newDoc = await PDFDocument.create();
    const pages = await newDoc.copyPages(src, order);
    pages.forEach((p) => newDoc.addPage(p));

    const bytes = await newDoc.save();
    return pdfResponse(Buffer.from(bytes), "organized.pdf");
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
