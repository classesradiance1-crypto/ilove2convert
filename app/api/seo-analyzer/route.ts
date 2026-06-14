import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "Please provide a URL." }, { status: 400 });

    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const html = await res.text();

    const get = (pattern: RegExp) => pattern.exec(html)?.[1]?.trim() || null;

    const title = get(/<title[^>]*>([^<]*)<\/title>/i);
    const metaDesc = get(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)/i);
    const h1 = get(/<h1[^>]*>([^<]*)<\/h1>/i);
    const canonical = get(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)/i);
    const robots = get(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)/i);
    const ogTitle = get(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)/i);
    const ogDesc = get(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)/i);

    const imgTags = html.match(/<img\b[^>]*>/gi) || [];
    const imgsWithoutAlt = imgTags.filter(img => !/alt=["'][^"']+["']/.test(img)).length;
    const h2Count = (html.match(/<h2\b/gi) || []).length;
    const h3Count = (html.match(/<h3\b/gi) || []).length;

    const issues: string[] = [];
    if (!title) issues.push("❌ Missing <title> tag");
    else if (title.length < 30) issues.push(`⚠️ Title too short (${title.length} chars, min 30 recommended)`);
    else if (title.length > 60) issues.push(`⚠️ Title too long (${title.length} chars, max 60 recommended)`);
    if (!metaDesc) issues.push("❌ Missing meta description");
    else if (metaDesc.length < 70) issues.push(`⚠️ Meta description too short (${metaDesc.length} chars)`);
    else if (metaDesc.length > 160) issues.push(`⚠️ Meta description too long (${metaDesc.length} chars)`);
    if (!h1) issues.push("❌ Missing H1 tag");
    if (!canonical) issues.push("⚠️ No canonical URL found");
    if (imgsWithoutAlt > 0) issues.push(`⚠️ ${imgsWithoutAlt} image(s) missing alt text`);

    const lines = [
      `SEO Analysis for: ${url}`,
      ``,
      `Title: ${title || "Not found"} ${title ? `(${title.length} chars)` : ""}`,
      `Meta Description: ${metaDesc || "Not found"} ${metaDesc ? `(${metaDesc.length} chars)` : ""}`,
      `H1: ${h1 || "Not found"}`,
      `H2 Tags: ${h2Count} | H3 Tags: ${h3Count}`,
      `Canonical: ${canonical || "Not found"}`,
      `Robots: ${robots || "Not set"}`,
      `OG Title: ${ogTitle || "Not found"}`,
      `OG Description: ${ogDesc || "Not found"}`,
      ``,
      `Issues (${issues.length}):`,
      ...(issues.length ? issues : ["✅ No major issues found"]),
    ];

    return NextResponse.json({ result: lines.join("\n") });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to analyze URL" }, { status: 500 });
  }
}
