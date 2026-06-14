import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        {/* Brand + support */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#e8394d">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className="text-white font-bold text-base">ILove2Convert</span>
          </div>
          <p className="text-sm leading-relaxed">Every PDF tool you need, in one place. 100% free and easy to use.</p>

          {/* Support block */}
          <div className="border border-gray-700 rounded-xl p-4 space-y-2">
            <p className="text-white text-xs font-semibold uppercase tracking-wide">Customer Support</p>
            <a href="mailto:customercare@encisor-tech.org.in"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors group">
              <span className="w-7 h-7 rounded-lg bg-[#e8394d]/20 flex items-center justify-center shrink-0 group-hover:bg-[#e8394d]/40 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#e8394d">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </span>
              customercare@encisor-tech.org.in
            </a>
            <p className="text-xs text-gray-500">Mon–Sat, 9 AM – 6 PM IST</p>
          </div>
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
              { label: "Generate Docs", href: "/generate" },
              { label: "Buy Me a Coffee ☕", href: "/donate" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Contact Us", href: "/contact" },
            ].map(l => (
              <li key={l.label}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-800 text-sm">
            <p className="text-white font-semibold mb-1">Need help?</p>
            <a href="mailto:customercare@encisor-tech.org.in"
              className="text-[#e8394d] hover:text-[#ff6b7a] transition-colors break-all">
              customercare@encisor-tech.org.in
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <p>© {new Date().getFullYear()} ILove2Convert by Encisor Tech. All rights reserved.</p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/privacy" className="hover:text-gray-400">Privacy</Link>
          <Link href="/terms" className="hover:text-gray-400">Terms</Link>
          <Link href="/contact" className="hover:text-gray-400">Contact</Link>
          <a href="mailto:customercare@encisor-tech.org.in" className="hover:text-gray-400">Support</a>
        </div>
      </div>
    </footer>
  );
}
