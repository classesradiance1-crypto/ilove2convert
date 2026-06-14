import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, description, keywords, url, image, author, robots = "index, follow" } = await req.json();
    if (!title) return NextResponse.json({ error: "Please provide a page title." }, { status: 400 });

    const tags: string[] = [
      `<meta charset="UTF-8">`,
      `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
      `<title>${title}</title>`,
    ];

    if (description) tags.push(`<meta name="description" content="${description}">`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}">`);
    if (author) tags.push(`<meta name="author" content="${author}">`);
    tags.push(`<meta name="robots" content="${robots}">`);

    if (url || title) {
      tags.push(`<!-- Open Graph -->`);
      tags.push(`<meta property="og:type" content="website">`);
      if (title) tags.push(`<meta property="og:title" content="${title}">`);
      if (description) tags.push(`<meta property="og:description" content="${description}">`);
      if (url) tags.push(`<meta property="og:url" content="${url}">`);
      if (image) tags.push(`<meta property="og:image" content="${image}">`);
    }

    if (title) {
      tags.push(`<!-- Twitter Card -->`);
      tags.push(`<meta name="twitter:card" content="summary_large_image">`);
      tags.push(`<meta name="twitter:title" content="${title}">`);
      if (description) tags.push(`<meta name="twitter:description" content="${description}">`);
      if (image) tags.push(`<meta name="twitter:image" content="${image}">`);
    }

    return NextResponse.json({ result: tags.join("\n") });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Generation failed" }, { status: 400 });
  }
}
