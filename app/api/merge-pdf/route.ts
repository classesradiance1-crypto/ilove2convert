import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { parseFiles } from "@/lib/parseForm";
import { pdfResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const { files } = await parseFiles(req);
    if (files.length < 2) return NextResponse.json({ error: "Please upload at least 2 PDF files." }, { status: 400 });

    const merged = await PDFDocument.create();
    for (const file of files) {
      const doc = await PDFDocument.load(file.buffer);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }

    const bytes = await merged.save();
    return pdfResponse(Buffer.from(bytes), "merged.pdf");
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to merge PDFs" }, { status: 500 });
  }
}
