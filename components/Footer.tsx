import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-1.5 mb-3">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#e8394d">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className="text-white font-bold text-base">ILove2Convert</span>
          </div>
          <p className="text-sm leading-relaxed">Every PDF tool you need, in one place. 100% free and easy to use.</p>
        </div>

        <div>
          <p className="text-white font-semibold mb-3 text-sm">Organize PDF</p>
          <ul className="space-y-2 text-sm">
            {["Merge PDF", "Split PDF", "Compress PDF", "Rotate PDF", "Crop PDF"].map(t => (
              <li key={t}><Link href={`/${t.toLowerCase().replace(/ /g, "-")}`} className="hover:text-white transition-colors">{t}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-white font-semibold mb-3 text-sm">Convert PDF</p>
          <ul className="space-y-2 text-sm">
            {["PDF to Word", "PDF to Excel", "PDF to JPG", "Word to PDF", "JPG to PDF"].map(t => (
              <li key={t}><Link href={`/${t.toLowerCase().replace(/ /g, "-")}`} className="hover:text-white transition-colors">{t}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-white font-semibold mb-3 text-sm">Company</p>
          <ul className="space-y-2 text-sm">
            {[
            { label: "Donate", href: "/donate" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Contact", href: "/contact" },
            ].map(l => (
              <li key={l.label}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <p>© {new Date().getFullYear()} ILove2Convert. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-gray-400">Privacy</Link>
          <Link href="/terms" className="hover:text-gray-400">Terms</Link>
          <Link href="/contact" className="hover:text-gray-400">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
