import { NextRequest, NextResponse } from "next/server";

function formatXml(xml: string, indent = "  "): string {
  let result = "";
  let depth = 0;
  const tokens = xml.replace(/>\s*</g, "><").split(/(<[^>]+>)/);
  for (const token of tokens) {
    if (!token.trim()) continue;
    if (token.startsWith("</")) {
      depth--;
      result += indent.repeat(depth) + token + "\n";
    } else if (token.startsWith("<") && !token.endsWith("/>") && !token.startsWith("<?") && !token.startsWith("<!")) {
      result += indent.repeat(depth) + token + "\n";
      depth++;
    } else if (token.startsWith("<")) {
      result += indent.repeat(depth) + token + "\n";
    } else {
      result += indent.repeat(depth) + token + "\n";
    }
  }
  return result.trim();
}

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input) return NextResponse.json({ error: "No input provided" }, { status: 400 });
    const formatted = formatXml(input);
    return NextResponse.json({ result: formatted });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to format XML" }, { status: 400 });
  }
}
