import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "Please provide some text." }, { status: 400 });

    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const total = words.length;
    if (!total) return NextResponse.json({ error: "No words found in the text." }, { status: 400 });

    const freq: Record<string, number> = {};
    const stopWords = new Set(["the","and","for","are","but","not","you","all","this","that","with","from","they","have","been","were","said","each","what","when","will","your","can","has","more","also","into","some","its","about","than","then","over","other","after","first","well","just","like","know","take","make"]);

    for (const w of words) {
      if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1;
    }

    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20);
    const lines = sorted.map(([w, c]) => `${w}: ${c} (${((c / total) * 100).toFixed(2)}%)`);

    return NextResponse.json({
      result: `Total Words: ${total}\nUnique Keywords: ${Object.keys(freq).length}\n\nTop Keywords:\n${lines.join("\n")}`,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Analysis failed" }, { status: 400 });
  }
}
