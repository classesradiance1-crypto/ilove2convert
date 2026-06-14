"use client";
import { useState, useEffect } from "react";
import { uniqueTools, categories } from "@/lib/tools";
import ToolCard from "./ToolCard";
import { useSearchParams } from "next/navigation";

export default function ToolGrid() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat && categories.includes(cat)) setActiveCategory(cat);
  }, [searchParams]);

  const filtered = activeCategory === "All"
    ? uniqueTools
    : uniqueTools.filter((t) => t.category === activeCategory);

  return (
    <div>
      {/* Category pills — iLovePDF style */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              activeCategory === cat
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filtered.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
