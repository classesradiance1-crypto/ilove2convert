import { NextRequest } from "next/server";

export async function parseFiles(req: NextRequest): Promise<{ files: { name: string; buffer: Buffer; type: string }[]; fields: Record<string, string> }> {
  const formData = await req.formData();
  const files: { name: string; buffer: Buffer; type: string }[] = [];
  const fields: Record<string, string> = {};

  const entries = Array.from(formData.entries());
  for (const [key, value] of entries) {
    if (value instanceof File) {
      const arrayBuffer = await value.arrayBuffer();
      files.push({ name: value.name, buffer: Buffer.from(arrayBuffer), type: value.type });
    } else {
      fields[key] = value as string;
    }
  }

  return { files, fields };
}
