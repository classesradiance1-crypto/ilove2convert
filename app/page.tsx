import { Suspense } from "react";
import ToolGrid from "@/components/ToolGrid";
import AdBanner from "@/components/AdBanner";

export default function HomePage() {
  return (
    <div className="bg-[#f5f5f5]">
      {/* Hero — clean white like iLovePDF */}
      <section className="bg-white pt-12 pb-10 px-4 text-center border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Every tool you need to work with PDFs<br className="hidden md:block" /> in one place
        </h1>
        <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
          Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use!
          Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
        </p>
      </section>

      {/* Ad banner */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <AdBanner slot="1122334455" format="horizontal" className="rounded-xl overflow-hidden" />
      </div>

      {/* Tools grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 h-36 animate-pulse border border-gray-100" />
            ))}
          </div>
        }>
          <ToolGrid />
        </Suspense>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Better in every way</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#e8394d">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              ),
              title: "Fast & Easy",
              desc: "Process your files in seconds with our optimized engine. No installation needed.",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#e8394d">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              ),
              title: "Secure & Private",
              desc: "Your files are processed securely and deleted automatically after conversion.",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#e8394d">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              ),
              title: "100% Free",
              desc: "All core tools are completely free. Upgrade to Premium for unlimited file sizes.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <p className="font-bold text-gray-800 mb-2">{f.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Donation CTA */}
      <section className="bg-gradient-to-r from-[#e8394d] to-[#b21e30] py-14 px-4 text-center text-white">
        <div className="text-5xl mb-4">❤️</div>
        <h2 className="text-3xl font-extrabold mb-3">All tools are free, forever</h2>
        <p className="text-red-100 mb-6 max-w-xl mx-auto">
          No limits, no paywalls. If ILove2Convert saves you time, consider a small donation to keep the servers running.
        </p>
        <a href="/donate"
          className="inline-block bg-white text-[#e8394d] font-bold px-8 py-3 rounded-full hover:bg-red-50 transition-colors">
          Support us — Donate ❤️
        </a>
      </section>

      {/* Bottom ad */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <AdBanner slot="5566778899" format="rectangle" className="rounded-xl overflow-hidden" />
      </div>
    </div>
  );
}
