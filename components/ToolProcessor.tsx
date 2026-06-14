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

  // Developer Tools state
  const [textInput, setTextInput] = useState("");
  const [encodeMode, setEncodeMode] = useState<"encode" | "decode">("encode");
  const [uuidCount, setUuidCount] = useState("1");
  const [hashAlgo, setHashAlgo] = useState("sha256");
  const [passwordLength, setPasswordLength] = useState("16");
  const [passwordCount, setPasswordCount] = useState("1");
  const [pwUpper, setPwUpper] = useState(true);
  const [pwLower, setPwLower] = useState(true);
  const [pwNumbers, setPwNumbers] = useState(true);
  const [pwSymbols, setPwSymbols] = useState(true);
  const [colorHex, setColorHex] = useState("#3b82f6");

  // Finance Tools state
  const [principal, setPrincipal] = useState("");
  const [loanRate, setLoanRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [sipMonthly, setSipMonthly] = useState("");
  const [sipRate, setSipRate] = useState("");
  const [sipYears, setSipYears] = useState("");
  const [taxIncome, setTaxIncome] = useState("");
  const [taxDeductions, setTaxDeductions] = useState("");
  const [gstAmount, setGstAmount] = useState("");
  const [gstRate, setGstRate] = useState("18");
  const [gstType, setGstType] = useState("exclusive");
  const [currencyAmount, setCurrencyAmount] = useState("");
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("INR");
  const [nwAssets, setNwAssets] = useState({ cash: "", investments: "", property: "", vehicles: "", other: "" });
  const [nwLiabilities, setNwLiabilities] = useState({ mortgage: "", car_loan: "", personal_loan: "", credit_card: "", other: "" });
  const [expenseIncome, setExpenseIncome] = useState("");
  const [expenses, setExpenses] = useState({ housing: "", food: "", transport: "", healthcare: "", entertainment: "", education: "", savings: "", other: "" });

  // Website & SEO state
  const [seoUrl, setSeoUrl] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [metaAuthor, setMetaAuthor] = useState("");
  const [metaUrl, setMetaUrl] = useState("");
  const [metaImage, setMetaImage] = useState("");
  const [sitemapBase, setSitemapBase] = useState("");
  const [sitemapUrls, setSitemapUrls] = useState("");
  const [sitemapFreq, setSitemapFreq] = useState("weekly");
  const [robotsAllowAll, setRobotsAllowAll] = useState(true);
  const [robotsDisallow, setRobotsDisallow] = useState("");
  const [robotsSitemap, setRobotsSitemap] = useState("");
  const [robotsCrawlDelay, setRobotsCrawlDelay] = useState("");
  const [keywordText, setKeywordText] = useState("");

  const slug = tool.slug;

  // Text-only tools (no file needed)
  const TEXT_ONLY_TOOLS = new Set([
    "json-formatter", "xml-formatter", "sql-formatter", "base64", "url-encoder",
    "uuid-generator", "password-generator", "hash-generator", "color-picker",
    "emi-calculator", "sip-calculator", "income-tax-calculator", "loan-calculator",
    "currency-converter", "gst-calculator", "net-worth-calculator", "expense-tracker",
    "website-speed-checker", "seo-analyzer", "keyword-density", "meta-tag-generator",
    "sitemap-generator", "robots-txt-generator", "whois-lookup",
  ]);
  const isTextOnly = TEXT_ONLY_TOOLS.has(slug);

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
    if (files.length === 0 && slug !== "html-to-pdf" && !isTextOnly) {
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
      // Text-only tools use JSON body
      if (isTextOnly) {
        let body: Record<string, unknown> = {};
        if (slug === "json-formatter" || slug === "xml-formatter" || slug === "sql-formatter")
          body = { input: textInput };
        else if (slug === "base64" || slug === "url-encoder")
          body = { input: textInput, mode: encodeMode };
        else if (slug === "uuid-generator")
          body = { count: uuidCount };
        else if (slug === "hash-generator")
          body = { input: textInput, algorithm: hashAlgo };
        else if (slug === "password-generator")
          body = { length: passwordLength, count: passwordCount, uppercase: pwUpper, lowercase: pwLower, numbers: pwNumbers, symbols: pwSymbols };
        else if (slug === "color-picker")
          body = { color: colorHex };
        else if (slug === "emi-calculator" || slug === "loan-calculator")
          body = { principal, rate: loanRate, tenure: loanTenure };
        else if (slug === "sip-calculator")
          body = { monthly: sipMonthly, rate: sipRate, years: sipYears };
        else if (slug === "income-tax-calculator")
          body = { income: taxIncome, deductions: taxDeductions };
        else if (slug === "gst-calculator")
          body = { amount: gstAmount, rate: gstRate, type: gstType };
        else if (slug === "currency-converter")
          body = { amount: currencyAmount, from: currencyFrom, to: currencyTo };
        else if (slug === "net-worth-calculator")
          body = { assets: nwAssets, liabilities: nwLiabilities };
        else if (slug === "expense-tracker")
          body = { expenses, income: expenseIncome };
        else if (slug === "website-speed-checker" || slug === "seo-analyzer")
          body = { url: seoUrl };
        else if (slug === "keyword-density")
          body = { text: keywordText };
        else if (slug === "meta-tag-generator")
          body = { title: metaTitle, description: metaDesc, keywords: metaKeywords, author: metaAuthor, url: metaUrl, image: metaImage };
        else if (slug === "sitemap-generator")
          body = { baseUrl: sitemapBase, urls: sitemapUrls, changefreq: sitemapFreq };
        else if (slug === "robots-txt-generator")
          body = { allowAll: robotsAllowAll, disallowPaths: robotsDisallow, sitemapUrl: robotsSitemap, crawlDelay: robotsCrawlDelay };
        else if (slug === "whois-lookup")
          body = { domain: seoUrl };

        const res = await fetch(`/api/${slug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Processing failed" }));
          throw new Error(err.error || "Processing failed");
        }
        const data = await res.json();
        setTextResult(data.result || JSON.stringify(data, null, 2));
        await logToServer({ ...logBase, status: "success", durationMs: Date.now() - startTimeRef.current });
        return;
      }

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
      ) : !isTextOnly ? (
        <FileUploader accept={tool.accept} multiple={tool.multiple} onFiles={handleFiles}
          label={tool.multiple ? "Drop your files here" : "Drop your file here"} />
      ) : null}

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

      {/* ── Developer Tools ── */}
      {(slug === "json-formatter" || slug === "xml-formatter" || slug === "sql-formatter") && (
        <div>
          <label className={labelCls}>Paste your {slug === "json-formatter" ? "JSON" : slug === "xml-formatter" ? "XML" : "SQL"} here</label>
          <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} rows={8}
            placeholder={slug === "json-formatter" ? '{"key": "value"}' : slug === "xml-formatter" ? "<root><item/></root>" : "SELECT * FROM users WHERE id = 1"}
            className={inputCls + " font-mono resize-y"} />
        </div>
      )}

      {(slug === "base64" || slug === "url-encoder") && (
        <div className="space-y-3">
          <div className="flex gap-3">
            <button onClick={() => setEncodeMode("encode")}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${encodeMode === "encode" ? "bg-[#e8394d] text-white border-[#e8394d]" : "bg-white text-gray-600 border-gray-300"}`}>
              Encode
            </button>
            <button onClick={() => setEncodeMode("decode")}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${encodeMode === "decode" ? "bg-[#e8394d] text-white border-[#e8394d]" : "bg-white text-gray-600 border-gray-300"}`}>
              Decode
            </button>
          </div>
          <div>
            <label className={labelCls}>Input Text</label>
            <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} rows={4}
              placeholder={encodeMode === "encode" ? "Enter text to encode..." : "Enter encoded string to decode..."}
              className={inputCls + " font-mono resize-y"} />
          </div>
        </div>
      )}

      {slug === "uuid-generator" && (
        <div>
          <label className={labelCls}>How many UUIDs?</label>
          <input type="number" min="1" max="100" value={uuidCount} onChange={(e) => setUuidCount(e.target.value)} className={inputCls} />
        </div>
      )}

      {slug === "hash-generator" && (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Text to Hash</label>
            <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} rows={4}
              placeholder="Enter text to generate hash..." className={inputCls + " resize-y"} />
          </div>
          <div>
            <label className={labelCls}>Algorithm</label>
            <select value={hashAlgo} onChange={(e) => setHashAlgo(e.target.value)} className={inputCls}>
              <option value="md5">MD5</option>
              <option value="sha1">SHA-1</option>
              <option value="sha256">SHA-256</option>
              <option value="sha512">SHA-512</option>
            </select>
          </div>
        </div>
      )}

      {slug === "password-generator" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Length</label>
              <input type="number" min="4" max="128" value={passwordLength} onChange={(e) => setPasswordLength(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Count</label>
              <input type="number" min="1" max="20" value={passwordCount} onChange={(e) => setPasswordCount(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              { label: "Uppercase (A-Z)", val: pwUpper, set: setPwUpper },
              { label: "Lowercase (a-z)", val: pwLower, set: setPwLower },
              { label: "Numbers (0-9)", val: pwNumbers, set: setPwNumbers },
              { label: "Symbols (!@#…)", val: pwSymbols, set: setPwSymbols },
            ].map(({ label, val, set }) => (
              <label key={label} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} className="accent-[#e8394d]" />
                {label}
              </label>
            ))}
          </div>
        </div>
      )}

      {slug === "color-picker" && (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <input type="color" value={colorHex} onChange={(e) => setColorHex(e.target.value)}
              className="w-16 h-16 rounded-xl border border-gray-300 cursor-pointer p-1" />
            <div>
              <label className={labelCls}>HEX Value</label>
              <input type="text" value={colorHex} onChange={(e) => setColorHex(e.target.value)}
                placeholder="#3b82f6" className={inputCls} maxLength={7} />
            </div>
          </div>
          <div className="w-full h-12 rounded-xl border border-gray-200" style={{ backgroundColor: colorHex }} />
        </div>
      )}

      {/* ── Finance Tools ── */}
      {(slug === "emi-calculator" || slug === "loan-calculator") && (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Loan Amount (₹)</label>
            <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="e.g. 500000" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Annual Interest Rate (%)</label>
            <input type="number" value={loanRate} onChange={(e) => setLoanRate(e.target.value)} placeholder="e.g. 8.5" className={inputCls} step="0.01" />
          </div>
          <div>
            <label className={labelCls}>Tenure (months)</label>
            <input type="number" value={loanTenure} onChange={(e) => setLoanTenure(e.target.value)} placeholder="e.g. 60" className={inputCls} />
          </div>
        </div>
      )}

      {slug === "sip-calculator" && (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Monthly Investment (₹)</label>
            <input type="number" value={sipMonthly} onChange={(e) => setSipMonthly(e.target.value)} placeholder="e.g. 5000" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Expected Annual Return (%)</label>
            <input type="number" value={sipRate} onChange={(e) => setSipRate(e.target.value)} placeholder="e.g. 12" className={inputCls} step="0.01" />
          </div>
          <div>
            <label className={labelCls}>Duration (years)</label>
            <input type="number" value={sipYears} onChange={(e) => setSipYears(e.target.value)} placeholder="e.g. 10" className={inputCls} />
          </div>
        </div>
      )}

      {slug === "income-tax-calculator" && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">India FY 2024-25 New Tax Regime</p>
          <div>
            <label className={labelCls}>Annual Income (₹)</label>
            <input type="number" value={taxIncome} onChange={(e) => setTaxIncome(e.target.value)} placeholder="e.g. 1200000" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Deductions (₹, optional)</label>
            <input type="number" value={taxDeductions} onChange={(e) => setTaxDeductions(e.target.value)} placeholder="e.g. 150000" className={inputCls} />
          </div>
        </div>
      )}

      {slug === "gst-calculator" && (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Amount (₹)</label>
            <input type="number" value={gstAmount} onChange={(e) => setGstAmount(e.target.value)} placeholder="e.g. 10000" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>GST Rate (%)</label>
            <select value={gstRate} onChange={(e) => setGstRate(e.target.value)} className={inputCls}>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Type</label>
            <select value={gstType} onChange={(e) => setGstType(e.target.value)} className={inputCls}>
              <option value="exclusive">GST Exclusive (add GST to amount)</option>
              <option value="inclusive">GST Inclusive (GST already included)</option>
            </select>
          </div>
        </div>
      )}

      {slug === "currency-converter" && (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Amount</label>
            <input type="number" value={currencyAmount} onChange={(e) => setCurrencyAmount(e.target.value)} placeholder="e.g. 100" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>From</label>
              <input type="text" value={currencyFrom} onChange={(e) => setCurrencyFrom(e.target.value.toUpperCase())}
                placeholder="USD" maxLength={3} className={inputCls + " uppercase"} />
            </div>
            <div>
              <label className={labelCls}>To</label>
              <input type="text" value={currencyTo} onChange={(e) => setCurrencyTo(e.target.value.toUpperCase())}
                placeholder="INR" maxLength={3} className={inputCls + " uppercase"} />
            </div>
          </div>
        </div>
      )}

      {slug === "net-worth-calculator" && (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Assets (₹)</p>
            <div className="space-y-2">
              {Object.keys(nwAssets).map((k) => (
                <div key={k} className="flex items-center gap-2">
                  <label className="w-28 text-sm text-gray-600 capitalize">{k.replace("_", " ")}</label>
                  <input type="number" value={nwAssets[k as keyof typeof nwAssets]}
                    onChange={(e) => setNwAssets({ ...nwAssets, [k]: e.target.value })}
                    placeholder="0" className={inputCls} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Liabilities (₹)</p>
            <div className="space-y-2">
              {Object.keys(nwLiabilities).map((k) => (
                <div key={k} className="flex items-center gap-2">
                  <label className="w-28 text-sm text-gray-600 capitalize">{k.replace("_", " ")}</label>
                  <input type="number" value={nwLiabilities[k as keyof typeof nwLiabilities]}
                    onChange={(e) => setNwLiabilities({ ...nwLiabilities, [k]: e.target.value })}
                    placeholder="0" className={inputCls} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {slug === "expense-tracker" && (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Monthly Income (₹, optional)</label>
            <input type="number" value={expenseIncome} onChange={(e) => setExpenseIncome(e.target.value)} placeholder="e.g. 50000" className={inputCls} />
          </div>
          <p className="text-sm font-semibold text-gray-700">Monthly Expenses (₹)</p>
          <div className="space-y-2">
            {Object.keys(expenses).map((k) => (
              <div key={k} className="flex items-center gap-2">
                <label className="w-28 text-sm text-gray-600 capitalize">{k}</label>
                <input type="number" value={expenses[k as keyof typeof expenses]}
                  onChange={(e) => setExpenses({ ...expenses, [k]: e.target.value })}
                  placeholder="0" className={inputCls} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Website & SEO Tools ── */}
      {(slug === "website-speed-checker" || slug === "seo-analyzer") && (
        <div>
          <label className={labelCls}>Website URL</label>
          <input type="url" value={seoUrl} onChange={(e) => setSeoUrl(e.target.value)}
            placeholder="https://example.com" className={inputCls} />
        </div>
      )}

      {slug === "whois-lookup" && (
        <div>
          <label className={labelCls}>Domain Name</label>
          <input type="text" value={seoUrl} onChange={(e) => setSeoUrl(e.target.value)}
            placeholder="example.com" className={inputCls} />
        </div>
      )}

      {slug === "keyword-density" && (
        <div>
          <label className={labelCls}>Paste your content here</label>
          <textarea value={keywordText} onChange={(e) => setKeywordText(e.target.value)} rows={8}
            placeholder="Paste your article or webpage content..." className={inputCls + " resize-y"} />
        </div>
      )}

      {slug === "meta-tag-generator" && (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Page Title *</label>
            <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="My Awesome Page Title" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Meta Description</label>
            <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={3}
              placeholder="A brief description of your page (150-160 chars recommended)" className={inputCls + " resize-none"} />
          </div>
          <div>
            <label className={labelCls}>Keywords</label>
            <input type="text" value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)}
              placeholder="keyword1, keyword2, keyword3" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Author</label>
              <input type="text" value={metaAuthor} onChange={(e) => setMetaAuthor(e.target.value)}
                placeholder="Author name" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Canonical URL</label>
              <input type="url" value={metaUrl} onChange={(e) => setMetaUrl(e.target.value)}
                placeholder="https://example.com/page" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>OG Image URL</label>
            <input type="url" value={metaImage} onChange={(e) => setMetaImage(e.target.value)}
              placeholder="https://example.com/og-image.jpg" className={inputCls} />
          </div>
        </div>
      )}

      {slug === "sitemap-generator" && (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Base URL *</label>
            <input type="url" value={sitemapBase} onChange={(e) => setSitemapBase(e.target.value)}
              placeholder="https://example.com" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>URL Paths (one per line, optional)</label>
            <textarea value={sitemapUrls} onChange={(e) => setSitemapUrls(e.target.value)} rows={5}
              placeholder="/&#10;/about&#10;/contact&#10;/blog" className={inputCls + " font-mono resize-y"} />
          </div>
          <div>
            <label className={labelCls}>Change Frequency</label>
            <select value={sitemapFreq} onChange={(e) => setSitemapFreq(e.target.value)} className={inputCls}>
              <option value="always">Always</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>
      )}

      {slug === "robots-txt-generator" && (
        <div className="space-y-3">
          <div className="flex gap-3">
            <button onClick={() => setRobotsAllowAll(true)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${robotsAllowAll ? "bg-[#e8394d] text-white border-[#e8394d]" : "bg-white text-gray-600 border-gray-300"}`}>
              Allow All
            </button>
            <button onClick={() => setRobotsAllowAll(false)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${!robotsAllowAll ? "bg-[#e8394d] text-white border-[#e8394d]" : "bg-white text-gray-600 border-gray-300"}`}>
              Disallow All
            </button>
          </div>
          <div>
            <label className={labelCls}>Disallow Paths (one per line)</label>
            <textarea value={robotsDisallow} onChange={(e) => setRobotsDisallow(e.target.value)} rows={4}
              placeholder="/admin&#10;/private&#10;/tmp" className={inputCls + " font-mono resize-y"} />
          </div>
          <div>
            <label className={labelCls}>Sitemap URL (optional)</label>
            <input type="url" value={robotsSitemap} onChange={(e) => setRobotsSitemap(e.target.value)}
              placeholder="https://example.com/sitemap.xml" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Crawl Delay (seconds, optional)</label>
            <input type="number" value={robotsCrawlDelay} onChange={(e) => setRobotsCrawlDelay(e.target.value)}
              placeholder="e.g. 10" className={inputCls} />
          </div>
        </div>
      )}

      {/* Process button */}
      <button onClick={handleProcess}
        disabled={processing || (files.length === 0 && slug !== "html-to-pdf" && !isTextOnly)}
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
