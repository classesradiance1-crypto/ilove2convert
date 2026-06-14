import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { sitemapUrl, allowAll = true, disallowPaths = "", crawlDelay = "" } = await req.json();

    const lines: string[] = ["User-agent: *"];

    if (allowAll) {
      lines.push("Allow: /");
    } else {
      lines.push("Disallow: /");
    }

    if (disallowPaths) {
      const paths = disallowPaths.split("\n").map((p: string) => p.trim()).filter(Boolean);
      for (const p of paths) {
        lines.push(`Disallow: ${p.startsWith("/") ? p : "/" + p}`);
      }
    }

    if (crawlDelay) lines.push(`Crawl-delay: ${crawlDelay}`);
    if (sitemapUrl) lines.push(`\nSitemap: ${sitemapUrl}`);

    return NextResponse.json({ result: lines.join("\n") });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Generation failed" }, { status: 400 });
  }
}
