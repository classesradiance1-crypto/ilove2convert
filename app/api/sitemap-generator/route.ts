import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { baseUrl, urls = "", changefreq = "weekly", priority = "0.8" } = await req.json();
    if (!baseUrl) return NextResponse.json({ error: "Please provide a base URL." }, { status: 400 });

    const base = baseUrl.replace(/\/$/, "");
    const urlList = urls
      ? urls.split("\n").map((u: string) => u.trim()).filter(Boolean)
      : ["/"];

    const today = new Date().toISOString().slice(0, 10);
    const urlEntries = urlList.map((u: string) => {
      const full = u.startsWith("http") ? u : `${base}${u.startsWith("/") ? u : "/" + u}`;
      return `  <url>\n    <loc>${full}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries.join("\n")}\n</urlset>`;
    return NextResponse.json({ result: xml });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Generation failed" }, { status: 400 });
  }
}
