"use client";
import Link from "next/link";
import { Tool } from "@/lib/tools";

export default function ToolLayout({ tool, children }: { tool: Tool; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Tool hero banner */}
      <div className="bg-white border-b border-gray-100 py-10 px-4 text-center">
        <div className={`w-20 h-20 rounded-3xl ${tool.iconBg} flex items-center justify-center mx-auto mb-4`}>
          <svg viewBox="0 0 24 24" className="w-10 h-10" fill={tool.iconFg}>
            <path d={tool.svgIcon} />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{tool.name}</h1>
        <p className="text-gray-500 max-w-md mx-auto text-sm">{tool.description}</p>
      </div>

      {/* Tool content */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 mb-6 flex items-center gap-1">
          <Link href="/" className="hover:text-[#e8394d] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-600">{tool.name}</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
