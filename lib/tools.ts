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
  "Developer Tools",
  "Finance Tools",
  "Website & SEO",
  "Document Generator",
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

// Developer Tools SVG paths
const JSON_PATH = "M5 3h2v2H5v5a2 2 0 01-2 2 2 2 0 012 2v5h2v2H5c-1.07-.27-2-.9-2-2v-4a2 2 0 00-2-2H0v-2h1a2 2 0 002-2V5a2 2 0 012-2m14 0c1.07.27 2 .9 2 2v4a2 2 0 002 2h1v2h-1a2 2 0 00-2 2v4a2 2 0 01-2 2h-2v-2h2v-5a2 2 0 012-2 2 2 0 01-2-2V5h-2V3h2M12 15a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1m-4 0a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1m8 0a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1z";
const XML_PATH = "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5";
const SQL_PATH = "M4 6C4 4.9 7.58 4 12 4s8 .9 8 2v2c0 1.1-3.58 2-8 2S4 9.1 4 8V6zm0 6v2c0 1.1 3.58 2 8 2s8-.9 8-2v-2c0 1.1-3.58 2-8 2s-8-.9-8-2zm0 6v2c0 1.1 3.58 2 8 2s8-.9 8-2v-2c0 1.1-3.58 2-8 2s-8-.9-8-2z";
const BASE64_PATH = "M3 3h18v4H3V3zm0 7h18v4H3v-4zm0 7h18v4H3v-4z";
const URL_PATH = "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z";
const UUID_PATH = "M17.6 11.8c-.3-3.6-3.3-6.4-7-6.4-3.9 0-7 3.1-7 7s3.1 7 7 7c3.2 0 5.9-2 6.8-4.8h-1.8c-.8 1.7-2.6 3-4.8 3-2.9 0-5.2-2.3-5.2-5.2s2.3-5.2 5.2-5.2c2.4 0 4.4 1.6 5 3.8h-1.8l2.8 2.8 2.8-2.8h-1.8v-.2z";
const PASSGEN_PATH = "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z";
const HASH_PATH = "M4.5 11h-2V9h2V7.5h2V9h3V7.5h2V9h2v2h-2v3h2v2h-2v1.5h-2V16h-3v1.5h-2V16h-2v-2h2v-3zm2 0v3h3v-3h-3zM22 4v16c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2z";
const COLOR_PATH = "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z";

// Finance Tools SVG paths
const EMI_PATH = "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";
const SIP_PATH = "M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z";
const TAX_PATH = "M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z";
const LOAN_PATH = "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z";
const CURRENCY_PATH = "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";
const GST_PATH = "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z";
const NETWORTH_PATH = "M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zM16.2 13h2.8v6h-2.8v-6z";
const EXPENSE_PATH = "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z";

// Website & SEO Tools SVG paths
const SPEED_PATH = "M20.38 8.57l-1.23 1.85a8 8 0 01-.22 7.58H5.07A8 8 0 0115.58 6.85l1.85-1.23A10 10 0 003.35 19a2 2 0 001.72 1h13.85a2 2 0 001.74-1 10 10 0 00-0.27-10.44zm-9.79 6.84a2 2 0 002.83 0l5.66-8.49-8.49 5.66a2 2 0 000 2.83z";
const SEO_PATH = "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z";
const KEYWORD_PATH = "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z";
const META_PATH = "M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v1h16V6H4zm0 3v8h16V9H4z";
const SITEMAP_PATH = "M12 2L2 19h20L12 2zm0 3.5L18.5 17h-13L12 5.5zM11 10v4h2v-4h-2zm0 5v2h2v-2h-2z";
const ROBOTS_PATH = "M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7H3a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zm-1 10h2v2h-2v-2zm-4 0h2v2H7v-2zm8 0h2v2h-2v-2z";
const WHOIS_PATH = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z";

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
  // Developer Tools
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and beautify JSON data with syntax highlighting and error detection.",
    icon: "{ }", svgIcon: JSON_PATH, iconBg: "bg-yellow-100", iconFg: "#ca8a04",
    category: "Developer Tools", color: "bg-yellow-600", accept: "", multiple: false,
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    description: "Beautify and validate XML documents with proper indentation and structure.",
    icon: "</>", svgIcon: XML_PATH, iconBg: "bg-orange-100", iconFg: "#ea580c",
    category: "Developer Tools", color: "bg-orange-600", accept: "", multiple: false,
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    description: "Format and beautify SQL queries for better readability and debugging.",
    icon: "🗄️", svgIcon: SQL_PATH, iconBg: "bg-blue-100", iconFg: "#2563eb",
    category: "Developer Tools", color: "bg-blue-600", accept: "", multiple: false,
  },
  {
    slug: "base64",
    name: "Base64 Encoder/Decoder",
    description: "Encode text or files to Base64 or decode Base64 strings back to readable text.",
    icon: "🔤", svgIcon: BASE64_PATH, iconBg: "bg-green-100", iconFg: "#16a34a",
    category: "Developer Tools", color: "bg-green-600", accept: "", multiple: false,
  },
  {
    slug: "url-encoder",
    name: "URL Encoder/Decoder",
    description: "Encode special characters in URLs or decode percent-encoded URL strings.",
    icon: "🔗", svgIcon: URL_PATH, iconBg: "bg-cyan-100", iconFg: "#0891b2",
    category: "Developer Tools", color: "bg-cyan-600", accept: "", multiple: false,
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate random UUIDs (v4) instantly. Copy single or bulk UUIDs for your projects.",
    icon: "🆔", svgIcon: UUID_PATH, iconBg: "bg-purple-100", iconFg: "#9333ea",
    category: "Developer Tools", color: "bg-purple-600", accept: "", multiple: false,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Generate strong, secure passwords with custom length and character options.",
    icon: "🔑", svgIcon: PASSGEN_PATH, iconBg: "bg-red-100", iconFg: "#dc2626",
    category: "Developer Tools", color: "bg-red-600", accept: "", multiple: false,
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "Generate MD5, SHA-256, SHA-512, and other cryptographic hashes from any text.",
    icon: "#️⃣", svgIcon: HASH_PATH, iconBg: "bg-indigo-100", iconFg: "#4f46e5",
    category: "Developer Tools", color: "bg-indigo-600", accept: "", multiple: false,
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    description: "Pick colors and instantly convert between HEX, RGB, HSL and other color formats.",
    icon: "🎨", svgIcon: COLOR_PATH, iconBg: "bg-pink-100", iconFg: "#ec4899",
    category: "Developer Tools", color: "bg-pink-600", accept: "", multiple: false,
  },
  // Finance Tools
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    description: "Calculate monthly EMI for home, car, or personal loans with an amortization schedule.",
    icon: "💳", svgIcon: EMI_PATH, iconBg: "bg-green-100", iconFg: "#16a34a",
    category: "Finance Tools", color: "bg-green-600", accept: "", multiple: false,
  },
  {
    slug: "sip-calculator",
    name: "SIP Calculator",
    description: "Estimate returns on your Systematic Investment Plan (SIP) with compound growth.",
    icon: "📈", svgIcon: SIP_PATH, iconBg: "bg-blue-100", iconFg: "#2563eb",
    category: "Finance Tools", color: "bg-blue-600", accept: "", multiple: false,
  },
  {
    slug: "income-tax-calculator",
    name: "Income Tax Calculator",
    description: "Estimate your income tax liability based on your income slab and deductions.",
    icon: "🧾", svgIcon: TAX_PATH, iconBg: "bg-amber-100", iconFg: "#d97706",
    category: "Finance Tools", color: "bg-amber-600", accept: "", multiple: false,
  },
  {
    slug: "loan-calculator",
    name: "Loan Calculator",
    description: "Calculate total loan cost, monthly payments, and interest for any loan type.",
    icon: "🏦", svgIcon: LOAN_PATH, iconBg: "bg-cyan-100", iconFg: "#0891b2",
    category: "Finance Tools", color: "bg-cyan-600", accept: "", multiple: false,
  },
  {
    slug: "currency-converter",
    name: "Currency Converter",
    description: "Convert between world currencies using live exchange rates.",
    icon: "💱", svgIcon: CURRENCY_PATH, iconBg: "bg-emerald-100", iconFg: "#059669",
    category: "Finance Tools", color: "bg-emerald-600", accept: "", multiple: false,
  },
  {
    slug: "gst-calculator",
    name: "GST Calculator",
    description: "Calculate GST (Goods & Services Tax) for any amount across all Indian GST slabs.",
    icon: "🇮🇳", svgIcon: GST_PATH, iconBg: "bg-orange-100", iconFg: "#ea580c",
    category: "Finance Tools", color: "bg-orange-600", accept: "", multiple: false,
  },
  {
    slug: "net-worth-calculator",
    name: "Net Worth Calculator",
    description: "Calculate your net worth by summing your assets and subtracting your liabilities.",
    icon: "💎", svgIcon: NETWORTH_PATH, iconBg: "bg-purple-100", iconFg: "#9333ea",
    category: "Finance Tools", color: "bg-purple-600", accept: "", multiple: false,
  },
  {
    slug: "expense-tracker",
    name: "Expense Tracker",
    description: "Track your monthly expenses by category and visualize your spending habits.",
    icon: "📊", svgIcon: EXPENSE_PATH, iconBg: "bg-red-100", iconFg: "#dc2626",
    category: "Finance Tools", color: "bg-red-600", accept: "", multiple: false,
  },
  // Website & SEO Tools
  {
    slug: "website-speed-checker",
    name: "Website Speed Checker",
    description: "Analyze your website's load speed and get actionable performance insights.",
    icon: "⚡", svgIcon: SPEED_PATH, iconBg: "bg-yellow-100", iconFg: "#ca8a04",
    category: "Website & SEO", color: "bg-yellow-600", accept: "", multiple: false,
  },
  {
    slug: "seo-analyzer",
    name: "SEO Analyzer",
    description: "Analyze any webpage's on-page SEO factors including title, meta, and headings.",
    icon: "🔍", svgIcon: SEO_PATH, iconBg: "bg-blue-100", iconFg: "#2563eb",
    category: "Website & SEO", color: "bg-blue-600", accept: "", multiple: false,
  },
  {
    slug: "keyword-density",
    name: "Keyword Density Checker",
    description: "Analyze keyword frequency and density in any text or webpage content.",
    icon: "📝", svgIcon: KEYWORD_PATH, iconBg: "bg-green-100", iconFg: "#16a34a",
    category: "Website & SEO", color: "bg-green-600", accept: "", multiple: false,
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    description: "Generate SEO-friendly meta tags for title, description, and Open Graph.",
    icon: "🏷️", svgIcon: META_PATH, iconBg: "bg-purple-100", iconFg: "#9333ea",
    category: "Website & SEO", color: "bg-purple-600", accept: "", multiple: false,
  },
  {
    slug: "sitemap-generator",
    name: "Sitemap Generator",
    description: "Generate an XML sitemap for your website to improve search engine crawling.",
    icon: "🗺️", svgIcon: SITEMAP_PATH, iconBg: "bg-teal-100", iconFg: "#0d9488",
    category: "Website & SEO", color: "bg-teal-600", accept: "", multiple: false,
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    description: "Create a robots.txt file to control search engine crawling of your website.",
    icon: "🤖", svgIcon: ROBOTS_PATH, iconBg: "bg-gray-100", iconFg: "#6b7280",
    category: "Website & SEO", color: "bg-gray-600", accept: "", multiple: false,
  },
  {
    slug: "whois-lookup",
    name: "Domain WHOIS Lookup",
    description: "Look up domain registration information, owner details, and expiry dates.",
    icon: "🌐", svgIcon: WHOIS_PATH, iconBg: "bg-indigo-100", iconFg: "#4f46e5",
    category: "Website & SEO", color: "bg-indigo-600", accept: "", multiple: false,
  },
  // Document Generator
  {
    slug: "generate-rent-receipt",
    name: "Rent Receipt",
    description: "Generate a professional house rent receipt with landlord, tenant, and payment details.",
    icon: "🏠", svgIcon: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z", iconBg: "bg-orange-100", iconFg: "#ea580c",
    category: "Document Generator", color: "bg-orange-600", accept: "", multiple: false,
  },
  {
    slug: "generate-salary-slip",
    name: "Salary Slip",
    description: "Create a detailed salary slip with earnings, deductions, PF, HRA and net pay.",
    icon: "💼", svgIcon: "M20 6h-2.18c.07-.44.18-.88.18-1a3 3 0 00-6 0c0 .12.11.56.18 1H10c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-2a1 1 0 110 2 1 1 0 010-2zm7 14H10V8h10v10zM12 9H11v6h1V9zm5 0h-1v6h1V9zm-2.5 0h-1v6h1V9z", iconBg: "bg-blue-100", iconFg: "#2563eb",
    category: "Document Generator", color: "bg-blue-600", accept: "", multiple: false,
  },
  {
    slug: "generate-quotation",
    name: "Quotation / Quote",
    description: "Generate a professional business quotation with itemized pricing and GST.",
    icon: "📋", svgIcon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 17v-1h8v1H8zm0-3v-1h8v1H8zm0-3V9h8v2H8z", iconBg: "bg-green-100", iconFg: "#16a34a",
    category: "Document Generator", color: "bg-green-600", accept: "", multiple: false,
  },
  {
    slug: "generate-purchase-order",
    name: "Purchase Order",
    description: "Create a purchase order with vendor details, items, quantities and delivery terms.",
    icon: "🛒", svgIcon: "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h11v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H15c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0019.5 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z", iconBg: "bg-purple-100", iconFg: "#9333ea",
    category: "Document Generator", color: "bg-purple-600", accept: "", multiple: false,
  },
  {
    slug: "generate-prescription",
    name: "Medical Prescription",
    description: "Generate a chemist/doctor prescription with patient info, medicines, and dosage.",
    icon: "💊", svgIcon: "M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z", iconBg: "bg-red-100", iconFg: "#dc2626",
    category: "Document Generator", color: "bg-red-600", accept: "", multiple: false,
  },
  {
    slug: "generate-invoice",
    name: "GST Invoice",
    description: "Generate a GST-compliant tax invoice with CGST, SGST, itemised billing and totals.",
    icon: "🧾", svgIcon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z", iconBg: "bg-amber-100", iconFg: "#d97706",
    category: "Document Generator", color: "bg-amber-600", accept: "", multiple: false,
  },
  {
    slug: "generate-order-booking",
    name: "Order Booking",
    description: "Create a personal or retail order booking slip with items, prices and customer info.",
    icon: "📦", svgIcon: "M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5s-.96.06-1.42.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z", iconBg: "bg-teal-100", iconFg: "#0d9488",
    category: "Document Generator", color: "bg-teal-600", accept: "", multiple: false,
  },
  {
    slug: "generate-balance-sheet",
    name: "Balance Sheet",
    description: "Create a structured balance sheet with assets, liabilities and equity summary.",
    icon: "⚖️", svgIcon: "M20 5H4v14h16V5zM4 3h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2zm2 4h12v2H6V7zm0 4h12v2H6v-2zm0 4h7v2H6v-2z", iconBg: "bg-slate-100", iconFg: "#475569",
    category: "Document Generator", color: "bg-slate-600", accept: "", multiple: false,
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
