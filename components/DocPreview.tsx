"use client";
import { useRef } from "react";

interface DocPreviewProps {
  title: string;
  children: React.ReactNode;
}

export default function DocPreview({ title, children }: DocPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 13px; color: #111; }
        @media print { body { padding: 0; } .no-print { display: none; } }
      </style>
      </head><body>${content}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  };

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex gap-3 no-print">
        <button onClick={handlePrint}
          className="flex-1 bg-[#e8394d] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#d42a3e] transition-colors flex items-center justify-center gap-2">
          🖨️ Print / Save as PDF
        </button>
        <button onClick={() => {
          const blob = new Blob([`<!DOCTYPE html><html><head><title>${title}</title>
            <style>* { margin:0; padding:0; box-sizing:border-box; } body { font-family:Arial,sans-serif; font-size:13px; color:#111; padding:20px; }</style>
            </head><body>${printRef.current?.innerHTML || ""}</body></html>`], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = `${title.replace(/\s+/g, "-")}.html`;
          a.click(); URL.revokeObjectURL(url);
        }}
          className="px-5 py-3 rounded-xl font-bold text-sm border border-gray-300 text-gray-700 hover:border-gray-500 transition-colors">
          ⬇️ Download HTML
        </button>
      </div>

      {/* Document preview */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <div ref={printRef} className="p-8 min-h-[600px]">
          {children}
        </div>
      </div>
    </div>
  );
}
