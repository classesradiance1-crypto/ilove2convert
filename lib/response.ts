function toArrayBuffer(buffer: Buffer | Uint8Array): ArrayBuffer {
  const b = buffer instanceof Buffer ? buffer : Buffer.from(buffer);
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
}

export function pdfResponse(buffer: Buffer | Uint8Array, filename: string): Response {
  return new Response(toArrayBuffer(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

export function zipResponse(buffer: Buffer | Uint8Array, filename: string): Response {
  return new Response(toArrayBuffer(buffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

export function docxResponse(buffer: Buffer | Uint8Array, filename: string): Response {
  return new Response(toArrayBuffer(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
