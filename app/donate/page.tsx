"use client";
import { useState } from "react";

const PRESET_AMOUNTS = [3, 5, 10, 25];

const COFFEES = [
  { cups: 1, amount: 3, label: "1 Coffee" },
  { cups: 2, amount: 5, label: "2 Coffees" },
  { cups: 4, amount: 10, label: "4 Coffees" },
  { cups: 10, amount: 25, label: "10 Coffees" },
];

export default function DonatePage() {
  const [amount, setAmount] = useState<number>(5);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const finalAmount = custom ? parseFloat(custom) : amount;

  async function handleSupport() {
    if (!finalAmount || finalAmount < 1) {
      setError("Minimum is $1.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/donate/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(finalAmount * 100) }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-14 px-4 text-center">
        <div className="text-6xl mb-4">☕</div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Buy Me a Coffee</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          All tools are 100% free, forever. If ILove2Convert saved you time, a coffee goes a long way to keep things running.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#e8394d">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <a href="mailto:customercare@encisor-tech.org.in"
            className="text-[#e8394d] hover:underline">
            customercare@encisor-tech.org.in
          </a>
        </div>
      </section>

      <div className="max-w-lg mx-auto px-4 py-12 space-y-6">

        {/* Coffee picker */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">How many coffees? ☕</p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {COFFEES.map(({ cups, amount: a, label }) => (
              <button
                key={a}
                onClick={() => { setAmount(a); setCustom(""); }}
                className={`py-4 rounded-xl font-bold text-sm border-2 transition-all flex flex-col items-center gap-1 ${
                  !custom && amount === a
                    ? "border-[#e8394d] bg-red-50 text-[#e8394d] scale-[1.02]"
                    : "border-gray-200 text-gray-700 hover:border-[#e8394d] hover:text-[#e8394d]"
                }`}
              >
                <span className="text-xl">{"☕".repeat(Math.min(cups, 4))}</span>
                <span>{label}</span>
                <span className="font-normal text-xs text-gray-400">${a}</span>
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="relative mb-5">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
            <input
              type="number"
              min="1"
              placeholder="Custom amount"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e8394d] transition-colors"
            />
          </div>

          {/* Optional name & message */}
          <div className="space-y-3 mb-5">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e8394d] transition-colors"
            />
            <textarea
              placeholder="Leave a message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e8394d] transition-colors resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            onClick={handleSupport}
            disabled={loading}
            className="w-full bg-[#e8394d] hover:bg-[#d42a3e] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors text-base flex items-center justify-center gap-2"
          >
            {loading ? "Redirecting..." : <>☕ Buy {finalAmount || "?"} coffee{finalAmount !== 3 ? "s" : ""} · ${finalAmount || "?"}</>}
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            Secure payment via Stripe. No account required.
          </p>
        </div>

        {/* What it funds */}
        <div className="grid grid-cols-1 gap-4">
          {[
            { icon: "🖥️", title: "Server costs", desc: "Keeping all tools fast and available 24/7." },
            { icon: "⚡", title: "New features", desc: "Building more tools and improving existing ones." },
            { icon: "🔒", title: "Security & privacy", desc: "Maintaining secure, private file processing." },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Support contact */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#e8394d]/10 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#e8394d">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Have a question?</p>
            <a href="mailto:customercare@encisor-tech.org.in"
              className="text-sm text-[#e8394d] hover:underline">
              customercare@encisor-tech.org.in
            </a>
            <p className="text-xs text-gray-400 mt-0.5">Mon–Sat, 9 AM – 6 PM IST</p>
          </div>
        </div>

      </div>
    </div>
  );
}
