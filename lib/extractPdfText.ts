/**
 * Pure Node.js PDF text extraction using pdf2json.
 * No workers, no browser APIs, no CJS/ESM issues.
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  // Dynamic require to keep it server-only and avoid bundling issues
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const PDFParser = require("pdf2json");

  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null, 1); // 1 = raw text mode

    parser.on("pdfParser_dataError", (err: { parserError: Error }) => {
      reject(new Error(err.parserError?.message || "PDF parse error"));
    });

    parser.on("pdfParser_dataReady", () => {
      try {
        // getRawTextContent() returns plain text with form-feed page separators
        const raw: string = parser.getRawTextContent();
        // Replace form-feed page breaks with newlines, clean up
        const text = raw
          .replace(/\f/g, "\n")
          .replace(/\r\n/g, "\n")
          .replace(/\r/g, "\n")
          .trim();
        resolve(text);
      } catch (e) {
        reject(e);
      }
    });

    parser.parseBuffer(buffer);
  });
}
