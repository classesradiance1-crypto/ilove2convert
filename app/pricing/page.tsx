export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: ["All 25+ PDF tools", "Up to 50MB per file", "5 tasks per hour", "Standard speed", "Ad-supported"],
      cta: "Get Started",
      href: "/",
      highlight: false,
    },
    {
      name: "Premium",
      price: "$4.99",
      period: "per month",
      features: ["All 25+ PDF tools", "Unlimited file size", "Unlimited tasks", "Priority speed", "No ads", "Batch processing", "AI tools (Summarize, Translate)"],
      cta: "Get Premium",
      href: "#",
      highlight: true,
    },
    {
      name: "Business",
      price: "$9.99",
      period: "per month",
      features: ["Everything in Premium", "API access", "Team management", "Custom branding", "Priority support", "SLA guarantee"],
      cta: "Contact Sales",
      href: "/contact",
      highlight: false,
    },
  ];

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <div className="bg-white border-b border-gray-100 py-12 px-4 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Simple, transparent pricing</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Start free. Upgrade when you need more power.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.name}
              className={`bg-white rounded-2xl border p-8 flex flex-col ${plan.highlight ? "border-[#e8394d] shadow-lg ring-2 ring-[#e8394d]/20" : "border-gray-100"}`}>
              {plan.highlight && (
                <span className="text-xs font-bold text-[#e8394d] bg-red-50 px-3 py-1 rounded-full self-start mb-4">Most Popular</span>
              )}
              <p className="text-xl font-bold text-gray-900 mb-1">{plan.name}</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-gray-400 text-sm ml-1">/{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={plan.href}
                className={`text-center py-3 rounded-full font-bold text-sm transition-colors ${
                  plan.highlight
                    ? "bg-[#e8394d] text-white hover:bg-[#d42a3e]"
                    : "border border-gray-200 text-gray-700 hover:border-gray-400"
                }`}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
