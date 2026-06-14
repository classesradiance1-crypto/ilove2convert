"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";

const convertLinks = [
  { label: "PDF to Word", href: "/pdf-to-word" },
  { label: "PDF to Excel", href: "/pdf-to-excel" },
  { label: "PDF to PowerPoint", href: "/pdf-to-powerpoint" },
  { label: "PDF to JPG", href: "/pdf-to-jpg" },
  { label: "Word to PDF", href: "/word-to-pdf" },
  { label: "Excel to PDF", href: "/excel-to-pdf" },
  { label: "JPG to PDF", href: "/jpg-to-pdf" },
  { label: "HTML to PDF", href: "/html-to-pdf" },
];

const allToolsLinks = [
  { label: "Merge PDF", href: "/merge-pdf" },
  { label: "Split PDF", href: "/split-pdf" },
  { label: "Compress PDF", href: "/compress-pdf" },
  { label: "Rotate PDF", href: "/rotate-pdf" },
  { label: "Watermark PDF", href: "/watermark-pdf" },
  { label: "Protect PDF", href: "/protect-pdf" },
  { label: "Unlock PDF", href: "/unlock-pdf" },
  { label: "Sign PDF", href: "/sign-pdf" },
  { label: "Edit PDF", href: "/edit-pdf" },
  { label: "OCR PDF", href: "/ocr-pdf" },
];

const generateLinks = [
  { label: "🧾 Invoice Generator", href: "/generate/invoice" },
  { label: "💼 Salary Slip", href: "/generate/salary-slip" },
  { label: "🏠 Rent Receipt", href: "/generate/rent-receipt" },
  { label: "📦 Purchase Order", href: "/generate/purchase-order" },
  { label: "📄 All Generators →", href: "/generate" },
];

function Dropdown({ label, links }: { label: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#e8394d] transition-colors">
        {label}
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#e8394d] transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function UserMenu({ user, logout }: { user: { name: string; email: string; plan: string }; logout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 hover:border-[#e8394d] transition-colors">
        <div className="w-6 h-6 rounded-full bg-[#e8394d] flex items-center justify-center text-white text-xs font-bold">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{user.name}</span>
        <svg className={`w-3 h-3 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <span className="text-xs font-semibold text-[#e8394d]">{user.plan?.toUpperCase()}</span>
          </div>
          <Link href="/dashboard" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#e8394d]">
            📊 Dashboard
          </Link>
          <Link href="/dashboard?tab=settings" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#e8394d]">
            ⚙️ Settings
          </Link>
          <Link href="/pricing" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#e8394d]">
            ⭐ Upgrade Plan
          </Link>
          <div className="border-t border-gray-50 mt-1 pt-1">
            <button onClick={() => { setOpen(false); logout(); }}
              className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-1.5 shrink-0">
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#e8394d">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span className="text-lg font-extrabold text-gray-900 tracking-tight">ILove2Convert</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5">
          <Link href="/merge-pdf" className="text-sm font-medium text-gray-700 hover:text-[#e8394d] transition-colors">Merge PDF</Link>
          <Link href="/split-pdf" className="text-sm font-medium text-gray-700 hover:text-[#e8394d] transition-colors">Split PDF</Link>
          <Link href="/compress-pdf" className="text-sm font-medium text-gray-700 hover:text-[#e8394d] transition-colors">Compress PDF</Link>
          <Dropdown label="Convert PDF" links={convertLinks} />
          <Dropdown label="All PDF Tools" links={allToolsLinks} />
          <Dropdown label="Generate Docs" links={generateLinks} />
        </nav>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link href="/donate" className="text-sm font-medium text-[#e8394d] hover:text-[#d42a3e] transition-colors flex items-center gap-1">
            ☕ Buy Me a Coffee
          </Link>
          {user ? (
            <UserMenu user={user} logout={logout} />
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-[#e8394d] transition-colors">Login</Link>
              <Link href="/signup" className="bg-[#e8394d] text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-[#d42a3e] transition-colors">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-gray-600 ml-auto" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3 text-sm font-medium text-gray-700">
          {[
            { label: "Merge PDF", href: "/merge-pdf" },
            { label: "Split PDF", href: "/split-pdf" },
            { label: "Compress PDF", href: "/compress-pdf" },
            { label: "PDF to Word", href: "/pdf-to-word" },
            { label: "JPG to PDF", href: "/jpg-to-pdf" },
            { label: "All Tools", href: "/" },
            { label: "📄 Generate Docs", href: "/generate" },
            { label: "☕ Buy Me a Coffee", href: "/donate" },
          ].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="hover:text-[#e8394d] py-1 border-b border-gray-50 last:border-0">
              {l.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            {user ? (
              <>
                <Link href="/dashboard" className="flex-1 text-center border border-gray-200 rounded-full py-2 hover:border-[#e8394d] hover:text-[#e8394d]">Dashboard</Link>
                <button onClick={logout} className="flex-1 text-center bg-gray-100 rounded-full py-2">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex-1 text-center border border-gray-200 rounded-full py-2 hover:border-[#e8394d] hover:text-[#e8394d]">Login</Link>
                <Link href="/signup" className="flex-1 text-center bg-[#e8394d] text-white rounded-full py-2">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
