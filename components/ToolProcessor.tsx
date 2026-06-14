"use client";
import { useState, useEffect, useRef } from "react";
import FileUploader from "./FileUploader";
import AdBanner from "./AdBanner";
import PremiumBanner from "./PremiumBanner";
import { Tool } from "@/lib/tools";

// Generate or retrieve anonymous session ID
function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let sid = sessionStorage.getItem("i2c_sid");
  if (!sid) { sid = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem("i2c_sid", sid); }
  return sid;
}

async function logToServer(payload: Record<string, unknown>) {
  try {
    await fetch("/api/log-activity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  } catch {}
}

interface ProcessResult { url: string; filename: string; }

const MAX_FILE_SIZE_MB = 50;

export default function ToolProcessor({ tool }: { tool: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [textResult, setTextResult] = useState<string | null>(null);
  const startTimeRef = useRef<number>(0);

  // Extra options
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [password, setPassword] = useState("");
  const [rotation, setRotation] = useState("90");
  const [splitPages, setSplitPages] = useState("");
  const [targetLang, setTargetLang] = useState("es");
  const [htmlUrl, setHtmlUrl] = useState("");
  const [signName, setSignName] = useState("");
  const [editText, setEditText] = useState("");
  const [editPage, setEditPage] = useState("1");
  const [editX, setEditX] = useState("50");
  const [editY, setEditY] = useState("50");
  const [redactPage, setRedactPage] = useState("1");
  const [redactX, setRedactX] = useState("100");
  const [redactY, setRedactY] = useState("100");
  const [redactW, setRedactW] = useState("200");
  const [redactH, setRedactH] = useState("30");
  const [pageNumPos, setPageNumPos] = useState("bottom-center");

  const slug = tool.slug;

  const handleFiles = (f: File[]) => {
    const oversized = f.find(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (oversized) {
      setError(`File "${oversized.name}" exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }
    setFiles(f);
    setResult(null);
    setError(null);
    setTextResult(null);
  };

  const handleProcess = async () => {
    if (files.length === 0 && slug !== "html-to-pdf") {
      setError("Please select a file first.");
      return;
    }
    setProcessing(true);
    setError(null);
    setResult(null);
    setTextResult(null);
    startTimeRef.current = Date.now();

    // Log start
    const sid = getSessionId();
    const logBase = { sessionId: sid, toolSlug: slug, toolName: tool.name, fileName: files[0]?.name, fileSize: files[0]?.size };
    await logToServer({ ...logBase, status: "started" });

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      if (slug === "watermark-pdf")   formData.append("text", watermarkText);
      if (slug === "protect-pdf")     formData.append("password", password);
      if (slug === "unlock-pdf")      formData.append("password", password);
      if (slug === "rotate-pdf")      formData.append("rotation", rotation);
      if (slug === "split-pdf")       formData.append("pages", splitPages);
      if (slug === "translate-pdf")   formData.append("lang", targetLang);
      if (slug === "html-to-pdf")     formData.append("url", htmlUrl);
      if (slug === "sign-pdf")        formData.append("name", signName || "Signature");
      if (slug === "edit-pdf") {
        formData.append("text", editText);
        formData.append("page", editPage);
        formData.append("x", editX);
        formData.append("y", editY);
      }
      if (slug === "redact-pdf") {
        formData.append("page", redactPage);
        formData.append("x", redactX);
        formData.append("y", redactY);
        formData.append("w", redactW);
        formData.append("h", redactH);
      }
      if (slug === "page-numbers")    formData.append("position", pageNumPos);

      const res = await fetch(`/api/${slug}`, { method: "POST", body: formData });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Processing failed" }));
        throw new Error(err.error || "Processing failed");
      }

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        setTextResult(data.text || data.summary || data.translation || JSON.stringify(data, null, 2));
        await logToServer({ ...logBase, status: "success", durationMs: Date.now() - startTimeRef.current });
      } else {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const disposition = res.headers.get("content-disposition") || "";
        const match = disposition.match(/filename="?([^"]+)"?/);
        const filename = match ? match[1] : `output.pdf`;
        setResult({ url, filename });
        await logToServer({ ...logBase, status: "success", durationMs: Date.now() - startTimeRef.current });
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg);
      await logToServer({ ...logBase, status: "error", errorMsg: msg, durationMs: Date.now() - startTimeRef.current });
    } finally {
      setProcessing(false);
    }
  };

  const inputCls = "w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#e8394d]";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="space-y-6">
      {/* Ad banner above tool */}
      <AdBanner slot="1234567890" format="horizontal" className="w-full" />

      {/* HTML to PDF: URL input */}
      {slug === "html-to-pdf" ? (
        <div>
          <label className={labelCls}>Webpage URL</label>
          <input type="url" value={htmlUrl} onChange={(e) => setHtmlUrl(e.target.value)}
            placeholder="https://example.com" className={inputCls} />
        </div>
      ) : (
        <FileUploader accept={tool.accept} multiple={tool.multiple} onFiles={handleFiles}
          label={tool.multiple ? "Drop your files here" : "Drop your file here"} />
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-gray-700 truncate max-w-xs">📄 {f.name}</span>
              <span className="text-gray-400 ml-2">{(f.size / 1024).toFixed(1)} KB</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Extra options per tool ── */}
      {slug === "watermark-pdf" && (
        <div>
          <label className={labelCls}>Watermark Text</label>
          <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className={inputCls} />
        </div>
      )}

      {(slug === "protect-pdf" || slug === "unlock-pdf") && (
        <div>
          <label className={labelCls}>{slug === "protect-pdf" ? "Set Password" : "Enter Password to Unlock"}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
        </div>
      )}

      {slug === "rotate-pdf" && (
        <div>
          <label className={labelCls}>Rotation Angle</label>
          <select value={rotation} onChange={(e) => setRotation(e.target.value)} className={inputCls}>
            <option value="90">90° Clockwise</option>
            <option value="180">180°</option>
            <option value="270">270° Counter-clockwise</option>
          </select>
        </div>
      )}

      {slug === "split-pdf" && (
        <div>
          <label className={labelCls}>Pages to extract (e.g. 1,3,5-7 — leave empty to split all)</label>
          <input type="text" value={splitPages} onChange={(e) => setSplitPages(e.target.value)}
            placeholder="e.g. 1,3,5-7" className={inputCls} />
        </div>
      )}

      {slug === "translate-pdf" && (
        <div>
          <label className={labelCls}>Target Language</label>
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className={inputCls}>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
            <option value="ar">Arabic</option>
            <option value="hi">Hindi</option>
            <option value="pt">Portuguese</option>
            <option value="ja">Japanese</option>
          </select>
        </div>
      )}

      {slug === "sign-pdf" && (
        <div>
          <label className={labelCls}>Your Name / Signature Text</label>
          <input type="text" value={signName} onChange={(e) => setSignName(e.target.value)}
            placeholder="e.g. John Smith" className={inputCls} />
        </div>
      )}

      {slug === "edit-pdf" && (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Text to Add</label>
            <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)}
              placeholder="Enter text to add to the PDF" className={inputCls} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Page #</label>
              <input type="number" min="1" value={editPage} onChange={(e) => setEditPage(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>X position</label>
              <input type="number" value={editX} onChange={(e) => setEditX(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Y position</label>
              <input type="number" value={editY} onChange={(e) => setEditY(e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>
      )}

      {slug === "redact-pdf" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Define the area to redact (black box). Coordinates are in PDF points from bottom-left.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Page #</label>
              <input type="number" min="1" value={redactPage} onChange={(e) => setRedactPage(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>X (left)</label>
              <input type="number" value={redactX} onChange={(e) => setRedactX(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Y (bottom)</label>
              <input type="number" value={redactY} onChange={(e) => setRedactY(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Width</label>
              <input type="number" value={redactW} onChange={(e) => setRedactW(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Height</label>
              <input type="number" value={redactH} onChange={(e) => setRedactH(e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>
      )}

      {slug === "page-numbers" && (
        <div>
          <label className={labelCls}>Position</label>
          <select value={pageNumPos} onChange={(e) => setPageNumPos(e.target.value)} className={inputCls}>
            <option value="bottom-center">Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="top-center">Top Center</option>
          </select>
        </div>
      )}

      {/* Process button */}
      <button onClick={handleProcess}
        disabled={processing || (files.length === 0 && slug !== "html-to-pdf")}
        className="w-full bg-[#e8394d] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#d42a3e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Processing...
          </span>
        ) : tool.name}
      </button>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Text result (AI / compare / summarize) */}
      {textResult && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="font-semibold text-gray-700 mb-2">Result</p>
          <pre className="text-sm text-gray-600 whitespace-pre-wrap">{textResult}</pre>
        </div>
      )}

      {/* Download result */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">✅</div>
          <p className="font-semibold text-green-700 mb-4">Your file is ready!</p>
          <a href={result.url} download={result.filename}
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors">
            ⬇️ Download {result.filename}
          </a>
        </div>
      )}

      {/* Premium upsell after result */}
      {(result || textResult) && (
        <PremiumBanner />
      )}

      {/* Ad banner below tool */}
      <AdBanner slot="0987654321" format="rectangle" className="w-full" />
    </div>
  );
}
