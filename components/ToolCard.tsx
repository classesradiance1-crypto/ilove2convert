import Link from "next/link";
import { Tool } from "@/lib/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/${tool.slug}`} className="tool-card group">
      <div className={`tool-icon-wrap ${tool.iconBg}`}>
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill={tool.iconFg} xmlns="http://www.w3.org/2000/svg">
          <path d={tool.svgIcon} />
        </svg>
      </div>
      <p className="font-semibold text-gray-800 text-sm leading-tight mb-1">{tool.name}</p>
      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{tool.description}</p>
    </Link>
  );
}
