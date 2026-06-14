"use client";
import { useState } from "react";

const PRESET_AMOUNTS = [3, 5, 10, 25];

export default function DonatePage() {
  const [amount, setAmount] = useState<number>(5);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finalAmount = custom ? parseFloat(custom) : amount;

  async function handleDonate() {
    if (!finalAmount || finalAmount < 1) {
      setError("Minimum donation is $1.");
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
        <div className="text-5xl mb-4">❤️</div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Support ILove2Convert</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          All tools are 100% free, forever. If this saves you time, consider buying us a coffee to keep the servers running.
        </p>
      </section>

      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Choose an amount</p>

          {/* Preset amounts */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {PRESET_AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => { setAmount(a); setCustom(""); }}
                className={`py-3 rounded-xl font-bold text-sm border-2 transition-colors ${
                  !custom && amount === a
                    ? "border-[#e8394d] bg-red-50 text-[#e8394d]"
                    : "border-gray-200 text-gray-700 hover:border-[#e8394d] hover:text-[#e8394d]"
                }`}
              >
                ${a}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="relative mb-6">
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

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            onClick={handleDonate}
            disabled={loading}
            className="w-full bg-[#e8394d] hover:bg-[#d42a3e] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors text-base"
          >
            {loading ? "Redirecting..." : `Donate $${finalAmount || "?"} with Stripe`}
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            Secure payment via Stripe. No account required.
          </p>
        </div>

        {/* Why donate */}
        <div className="mt-8 grid grid-cols-1 gap-4">
          {[
            { icon: "🖥️", title: "Server costs", desc: "Keeping the tools fast and available 24/7." },
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
      </div>
    </div>
  );
}
