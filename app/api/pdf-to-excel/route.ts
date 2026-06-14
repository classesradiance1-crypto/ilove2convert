import { NextRequest, NextResponse } from "next/server";
import { parseFiles } from "@/lib/parseForm";
import * as XLSX from "xlsx";
import { extractPdfText } from "@/lib/extractPdfText";

export async function POST(req: NextRequest) {
  try {
    const { files } = await parseFiles(req);
    if (!files[0]) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const text = await extractPdfText(files[0].buffer);
    const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

    if (lines.length === 0) {
      return NextResponse.json({ error: "Could not extract text from this PDF." }, { status: 422 });
    }

    // Split each line into columns by 2+ spaces (table-like data)
    const rows = lines.map((line) => line.split(/\s{2,}/));

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PDF Data");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
    const ab = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    return new Response(ab as ArrayBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="converted.xlsx"',
      },
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to convert PDF" }, { status: 500 });
  }
}
