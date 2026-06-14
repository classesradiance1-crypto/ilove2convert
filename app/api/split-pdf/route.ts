import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { parseFiles } from "@/lib/parseForm";
import { zipResponse } from "@/lib/response";
import JSZip from "jszip";

function parsePageRanges(input: string, total: number): number[] {
  if (!input.trim()) return Array.from({ length: total }, (_, i) => i);
  const pages: number[] = [];
  input.split(",").forEach((part) => {
    const range = part.trim().split("-");
    if (range.length === 2) {
      const start = parseInt(range[0]) - 1;
      const end = parseInt(range[1]) - 1;
      for (let i = start; i <= end && i < total; i++) pages.push(i);
    } else {
      const p = parseInt(range[0]) - 1;
      if (p >= 0 && p < total) pages.push(p);
    }
  });
  return Array.from(new Set(pages));
}

export async function POST(req: NextRequest) {
  try {
    const { files, fields } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const src = await PDFDocument.load(files[0].buffer);
    const total = src.getPageCount();
    const pageIndices = parsePageRanges(fields.pages || "", total);
    const zip = new JSZip();

    for (let i = 0; i < pageIndices.length; i++) {
      const newDoc = await PDFDocument.create();
      const [page] = await newDoc.copyPages(src, [pageIndices[i]]);
      newDoc.addPage(page);
      const bytes = await newDoc.save();
      zip.file(`page_${pageIndices[i] + 1}.pdf`, bytes);
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    return zipResponse(zipBuffer, "split_pages.zip");
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to split PDF" }, { status: 500 });
  }
}
