import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "Please provide a URL." }, { status: 400 });

    const start = Date.now();
    const res = await fetch(url, { method: "GET", signal: AbortSignal.timeout(15000) });
    const loadTime = Date.now() - start;
    const html = await res.text();
    const contentLength = res.headers.get("content-length");
    const serverHeader = res.headers.get("server") || "Unknown";
    const xPowered = res.headers.get("x-powered-by") || "";
    const cacheControl = res.headers.get("cache-control") || "Not set";

    const size = contentLength ? Number(contentLength) : new TextEncoder().encode(html).length;
    const imgCount = (html.match(/<img\b/gi) || []).length;
    const scriptCount = (html.match(/<script\b/gi) || []).length;
    const cssCount = (html.match(/<link[^>]*rel=["']stylesheet/gi) || []).length;

    let rating = "🟢 Excellent";
    if (loadTime > 3000) rating = "🔴 Poor";
    else if (loadTime > 1500) rating = "🟡 Needs Improvement";
    else if (loadTime > 800) rating = "🟠 Average";

    const lines = [
      `URL: ${url}`,
      `Load Time: ${loadTime}ms — ${rating}`,
      `Page Size: ${(size / 1024).toFixed(1)} KB`,
      `HTTP Status: ${res.status}`,
      `Server: ${serverHeader}${xPowered ? ` (${xPowered})` : ""}`,
      `Cache-Control: ${cacheControl}`,
      ``,
      `Resources on Page:`,
      `  Images: ${imgCount}`,
      `  Scripts: ${scriptCount}`,
      `  Stylesheets: ${cssCount}`,
    ];

    return NextResponse.json({ result: lines.join("\n") });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to check URL" }, { status: 500 });
  }
}
