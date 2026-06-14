import { NextRequest, NextResponse } from "next/server";

const KEYWORDS = ["SELECT","FROM","WHERE","JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN","OUTER JOIN",
  "ON","AND","OR","NOT","IN","IS","NULL","ORDER BY","GROUP BY","HAVING","LIMIT","OFFSET",
  "INSERT INTO","VALUES","UPDATE","SET","DELETE FROM","CREATE TABLE","DROP TABLE","ALTER TABLE",
  "AS","DISTINCT","COUNT","SUM","AVG","MIN","MAX","UNION","ALL","WITH","CASE","WHEN","THEN","ELSE","END"];

function formatSql(sql: string): string {
  let result = sql.trim();
  // Uppercase keywords
  for (const kw of KEYWORDS) {
    result = result.replace(new RegExp(`\\b${kw}\\b`, "gi"), kw);
  }
  // Add newlines before major clauses
  const clauses = ["SELECT","FROM","WHERE","JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN","OUTER JOIN",
    "ORDER BY","GROUP BY","HAVING","LIMIT","UNION","INSERT INTO","VALUES","UPDATE","SET","DELETE FROM"];
  for (const clause of clauses) {
    result = result.replace(new RegExp(`\\b${clause}\\b`, "g"), `\n${clause}`);
  }
  return result.trim();
}

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input) return NextResponse.json({ error: "No input provided" }, { status: 400 });
    return NextResponse.json({ result: formatSql(input) });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to format SQL" }, { status: 400 });
  }
}
