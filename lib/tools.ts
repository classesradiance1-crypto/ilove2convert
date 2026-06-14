export interface Tool {
  slug: string;
  name: string;
  description: string;
  icon: string;       // emoji fallback
  svgIcon: string;    // SVG path data
  iconBg: string;     // tailwind bg class
  iconFg: string;     // hex color for SVG fill
  category: string;
  color: string;
  accept: string;
  multiple: boolean;
}

export const categories = [
  "All",
  "Organize PDF",
  "Optimize PDF",
  "Convert PDF",
  "Edit PDF",
  "PDF Security",
];

// Shared SVG paths
const MERGE_PATH = "M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 3h2v-2h2v2h2v2h-2v2h-2v-2h-2v-2z";
const SPLIT_PATH = "M14 2v4h4l-4-4zM4 2v20h16V8h-6V2H4zm8 12H8v-2h4v2zm4-4H8v-2h8v2z";
const COMPRESS_PATH = "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z";
const PDF_ICON = "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 17v-1h8v1H8zm0-3v-1h8v1H8zm0-3V10h5v1H8z";
const WORD_PATH = "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM7 13l1.5 5 1.5-4 1.5 4L13 13h1l-2 7h-1l-1.5-4-1.5 4H7l-2-7h1z";
const EXCEL_PATH = "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM7 13l2.5 3.5L7 20h1.5l1.5-2.5L11.5 20H13l-2.5-3.5L13 13h-1.5L10 15.5 8.5 13H7z";
const PPT_PATH = "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 13h3a2 2 0 010 4H9v2H8v-6zm1 1v2h2a1 1 0 000-2H9z";
const IMG_PATH = "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z";
const ROTATE_PATH = "M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.87 5.87 0 016 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44 1.01.7 2.13.7 3.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z";
const CROP_PATH = "M17 15h2V7c0-1.1-.9-2-2-2H9v2h8v8zM7 17V1H5v4H1v2h4v10c0 1.1.9 2 2 2h10v4h2v-4h4v-2H7z";
const LOCK_PATH = "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z";
const UNLOCK_PATH = "M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5-2.28 0-4.27 1.54-4.84 3.75l1.94.49C9.44 3.93 10.63 3 12 3c1.65 0 3 1.35 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z";
const EDIT_PATH = "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z";
const WATERMARK_PATH = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z";
const SIGN_PATH = "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z";
const PAGENUM_PATH = "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z";
const OCR_PATH = "M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5zm-6 8h1.5v1.5H13V13zm1.5 1.5H16V16h-1.5v-1.5zM16 13h1.5v1.5H16V13zm-3 3h1.5v1.5H13V16zm1.5 1.5H16V19h-1.5v-1.5zM16 16h1.5v1.5H16V16zm1.5-1.5H19V16h-1.5v-1.5zm0 3H19V19h-1.5v-1.5zM22 7h-2V4h-3V2h5v5zm0 15v-5h-2v3h-3v2h5zM2 22h5v-2H4v-3H2v5zM2 2v5h2V4h3V2H2z";
const COMPARE_PATH = "M10 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v2h2V1h-2v2zm0 15H5l5-6v6zm9-15h-5v2h5v13l-5-6v9h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z";
const TRANSLATE_PATH = "M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z";
const SUMMARIZE_PATH = "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z";
const SCAN_PATH = "M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z";
const REDACT_PATH = "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z";
const REPAIR_PATH = "M13.78 15.3L19.78 21.3L21.89 19.14L15.89 13.14L13.78 15.3ZM17.5 10C19.43 10 21 8.43 21 6.5C21 5.93 20.87 5.39 20.63 4.91L18 7.5L16.5 6L19.09 3.37C18.61 3.13 18.07 3 17.5 3C15.57 3 14 4.57 14 6.5C14 6.91 14.07 7.3 14.2 7.66L3.27 18.6C2.87 19 2.87 19.63 3.27 20.03L3.97 20.73C4.37 21.13 5 21.13 5.4 20.73L16.34 9.8C16.7 9.93 17.09 10 17.5 10Z";
const HTML_PATH = "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z";

export const tools: Tool[] = [
  // Organize PDF
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    description: "Combine PDFs in the order you want with the easiest PDF merger available.",
    icon: "🔀", svgIcon: MERGE_PATH, iconBg: "bg-red-100", iconFg: "#e8394d",
    category: "Organize PDF", color: "bg-red-500", accept: ".pdf", multiple: true,
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    description: "Separate one page or a whole set for easy conversion into independent PDF files.",
    icon: "✂️", svgIcon: SPLIT_PATH, iconBg: "bg-orange-100", iconFg: "#f97316",
    category: "Organize PDF", color: "bg-orange-500", accept: ".pdf", multiple: false,
  },
  {
    slug: "organize-pdf",
    name: "Organize PDF",
    description: "Sort pages of your PDF file however you like. Delete or add pages at your convenience.",
    icon: "📋", svgIcon: PDF_ICON, iconBg: "bg-yellow-100", iconFg: "#eab308",
    category: "Organize PDF", color: "bg-yellow-500", accept: ".pdf", multiple: false,
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once.",
    icon: "🔄", svgIcon: ROTATE_PATH, iconBg: "bg-green-100", iconFg: "#22c55e",
    category: "Organize PDF", color: "bg-green-500", accept: ".pdf", multiple: true,
  },
  {
    slug: "crop-pdf",
    name: "Crop PDF",
    description: "Crop margins of PDF documents or select specific areas to apply to the whole document.",
    icon: "✂️", svgIcon: CROP_PATH, iconBg: "bg-teal-100", iconFg: "#14b8a6",
    category: "Organize PDF", color: "bg-teal-500", accept: ".pdf", multiple: false,
  },
  // Optimize PDF
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce file size while optimizing for maximal PDF quality.",
    icon: "🗜️", svgIcon: COMPRESS_PATH, iconBg: "bg-blue-100", iconFg: "#3b82f6",
    category: "Optimize PDF", color: "bg-blue-500", accept: ".pdf", multiple: false,
  },
  {
    slug: "repair-pdf",
    name: "Repair PDF",
    description: "Repair a damaged PDF and recover data from corrupt PDF files.",
    icon: "🔧", svgIcon: REPAIR_PATH, iconBg: "bg-indigo-100", iconFg: "#6366f1",
    category: "Optimize PDF", color: "bg-indigo-500", accept: ".pdf", multiple: false,
  },
  {
    slug: "ocr-pdf",
    name: "OCR PDF",
    description: "Easily convert scanned PDF into searchable and selectable documents.",
    icon: "🔍", svgIcon: OCR_PATH, iconBg: "bg-purple-100", iconFg: "#a855f7",
    category: "Optimize PDF", color: "bg-purple-500", accept: ".pdf", multiple: false,
  },
  // Convert PDF
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    description: "Easily convert your PDF files into easy to edit DOC and DOCX documents.",
    icon: "📝", svgIcon: WORD_PATH, iconBg: "bg-blue-100", iconFg: "#2563eb",
    category: "Convert PDF", color: "bg-blue-600", accept: ".pdf", multiple: false,
  },
  {
    slug: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    description: "Turn your PDF files into easy to edit PPT and PPTX slideshows.",
    icon: "📊", svgIcon: PPT_PATH, iconBg: "bg-orange-100", iconFg: "#ea580c",
    category: "Convert PDF", color: "bg-orange-600", accept: ".pdf", multiple: false,
  },
  {
    slug: "pdf-to-excel",
    name: "PDF to Excel",
    description: "Pull data straight from PDFs into Excel spreadsheets in a few short seconds.",
    icon: "📈", svgIcon: EXCEL_PATH, iconBg: "bg-green-100", iconFg: "#16a34a",
    category: "Convert PDF", color: "bg-green-600", accept: ".pdf", multiple: false,
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Convert each PDF page into a JPG or extract all images contained in a PDF.",
    icon: "🖼️", svgIcon: IMG_PATH, iconBg: "bg-pink-100", iconFg: "#ec4899",
    category: "Convert PDF", color: "bg-pink-500", accept: ".pdf", multiple: false,
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    description: "Make DOC and DOCX files easy to read by converting them to PDF.",
    icon: "📄", svgIcon: WORD_PATH, iconBg: "bg-blue-100", iconFg: "#1d4ed8",
    category: "Convert PDF", color: "bg-blue-700", accept: ".doc,.docx", multiple: false,
  },
  {
    slug: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    description: "Make PPT and PPTX slideshows easy to view by converting them to PDF.",
    icon: "📉", svgIcon: PPT_PATH, iconBg: "bg-red-100", iconFg: "#dc2626",
    category: "Convert PDF", color: "bg-red-600", accept: ".ppt,.pptx", multiple: false,
  },
  {
    slug: "excel-to-pdf",
    name: "Excel to PDF",
    description: "Make EXCEL spreadsheets easy to read by converting them to PDF.",
    icon: "📊", svgIcon: EXCEL_PATH, iconBg: "bg-green-100", iconFg: "#15803d",
    category: "Convert PDF", color: "bg-green-700", accept: ".xls,.xlsx", multiple: false,
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
    icon: "🖼️", svgIcon: IMG_PATH, iconBg: "bg-yellow-100", iconFg: "#ca8a04",
    category: "Convert PDF", color: "bg-yellow-600", accept: ".jpg,.jpeg,.png,.webp", multiple: true,
  },
  {
    slug: "html-to-pdf",
    name: "HTML to PDF",
    description: "Convert webpages in HTML to PDF. Copy and paste the URL of the page you want.",
    icon: "🌐", svgIcon: HTML_PATH, iconBg: "bg-cyan-100", iconFg: "#0891b2",
    category: "Convert PDF", color: "bg-cyan-600", accept: ".html,.htm", multiple: false,
  },
  {
    slug: "pdf-to-pdfa",
    name: "PDF to PDF/A",
    description: "Transform your PDF to PDF/A, the ISO-standardized version for long-term archiving.",
    icon: "📦", svgIcon: PDF_ICON, iconBg: "bg-gray-100", iconFg: "#6b7280",
    category: "Convert PDF", color: "bg-gray-600", accept: ".pdf", multiple: false,
  },
  // Edit PDF
  {
    slug: "edit-pdf",
    name: "Edit PDF",
    description: "Add text, images, shapes or freehand annotations to a PDF document.",
    icon: "✏️", svgIcon: EDIT_PATH, iconBg: "bg-violet-100", iconFg: "#7c3aed",
    category: "Edit PDF", color: "bg-violet-500", accept: ".pdf", multiple: false,
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    description: "Stamp an image or text over your PDF in seconds. Choose typography and position.",
    icon: "💧", svgIcon: WATERMARK_PATH, iconBg: "bg-sky-100", iconFg: "#0284c7",
    category: "Edit PDF", color: "bg-sky-500", accept: ".pdf", multiple: false,
  },
  {
    slug: "page-numbers",
    name: "Page Numbers",
    description: "Add page numbers into PDFs with ease. Choose your positions and dimensions.",
    icon: "🔢", svgIcon: PAGENUM_PATH, iconBg: "bg-lime-100", iconFg: "#65a30d",
    category: "Edit PDF", color: "bg-lime-600", accept: ".pdf", multiple: false,
  },
  {
    slug: "sign-pdf",
    name: "Sign PDF",
    description: "Sign yourself or request electronic signatures from others.",
    icon: "✍️", svgIcon: SIGN_PATH, iconBg: "bg-emerald-100", iconFg: "#059669",
    category: "Edit PDF", color: "bg-emerald-600", accept: ".pdf", multiple: false,
  },
  {
    slug: "redact-pdf",
    name: "Redact PDF",
    description: "Redact text and graphics to permanently remove sensitive information from a PDF.",
    icon: "⬛", svgIcon: REDACT_PATH, iconBg: "bg-neutral-100", iconFg: "#404040",
    category: "Edit PDF", color: "bg-neutral-700", accept: ".pdf", multiple: false,
  },
  // PDF Security
  {
    slug: "protect-pdf",
    name: "Protect PDF",
    description: "Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.",
    icon: "🔒", svgIcon: LOCK_PATH, iconBg: "bg-red-100", iconFg: "#b91c1c",
    category: "PDF Security", color: "bg-red-700", accept: ".pdf", multiple: false,
  },
  {
    slug: "unlock-pdf",
    name: "Unlock PDF",
    description: "Remove PDF password security, giving you the freedom to use your PDFs as you want.",
    icon: "🔓", svgIcon: UNLOCK_PATH, iconBg: "bg-amber-100", iconFg: "#d97706",
    category: "PDF Security", color: "bg-amber-600", accept: ".pdf", multiple: false,
  },
];

// deduplicate — remove duplicate ocr-pdf (keep first)
const seen = new Set<string>();
export const uniqueTools = tools.filter(t => {
  if (seen.has(t.slug)) return false;
  seen.add(t.slug);
  return true;
});

export function getToolBySlug(slug: string): Tool | undefined {
  return uniqueTools.find((t) => t.slug === slug);
}
