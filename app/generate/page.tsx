import Link from "next/link";

const generators = [
  {
    category: "Business Documents",
    color: "bg-green-50 border-green-200",
    items: [
      { href: "/generate/invoice", icon: "🧾", label: "Invoice Generator", desc: "GST, Tax, Proforma & Service invoices", color: "bg-green-100", fg: "text-green-700" },
      { href: "/generate/purchase-order", icon: "📦", label: "Purchase Order", desc: "Create POs for vendors & suppliers", color: "bg-purple-100", fg: "text-purple-700" },
    ],
  },
  {
    category: "HR & Payroll",
    color: "bg-blue-50 border-blue-200",
    items: [
      { href: "/generate/salary-slip", icon: "💼", label: "Salary Slip", desc: "Monthly payslip with allowances & deductions", color: "bg-blue-100", fg: "text-blue-700" },
    ],
  },
  {
    category: "Rental & Housing",
    color: "bg-orange-50 border-orange-200",
    items: [
      { href: "/generate/rent-receipt", icon: "🏠", label: "Rent Receipt", desc: "House & commercial rent receipts with PAN", color: "bg-orange-100", fg: "text-orange-700" },
    ],
  },
];

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Hero */}
      <div className="bg-white border-b py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#fff0f2] flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" className="w-9 h-9" fill="#e8394d">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 17v-1h8v1H8zm0-3v-1h8v1H8zm0-3V10h5v1H8z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Document Generator</h1>
        <p className="text-gray-500 text-sm max-w-lg mx-auto">
          Generate professional business documents instantly — invoices, salary slips, rent receipts, purchase orders, and more.
        </p>
        <div className="text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
          <Link href="/" className="hover:text-[#e8394d]">Home</Link>
          <span>/</span><span>Generate Documents</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {generators.map((group) => (
          <div key={group.category}>
            <h2 className="text-lg font-bold text-gray-800 mb-4">{group.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((item) => (
                <Link key={item.href} href={item.href}
                  className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-[#e8394d] transition-all group">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-3 text-2xl`}>
                    {item.icon}
                  </div>
                  <p className="font-bold text-gray-800 group-hover:text-[#e8394d] transition-colors">{item.label}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                  <span className={`inline-block text-xs font-semibold mt-3 ${item.fg}`}>Open →</span>
                </Link>
              ))}

              {/* Coming soon placeholder */}
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-5 flex flex-col items-center justify-center text-center text-gray-400 min-h-[140px]">
                <span className="text-3xl mb-2">✨</span>
                <p className="text-sm font-medium">More coming soon</p>
                <p className="text-xs mt-1">Medical prescriptions, e-commerce, delivery challans…</p>
              </div>
            </div>
          </div>
        ))}

        {/* Feature highlights */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-4 text-center">Why use our document generator?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
            {[
              { icon: "⚡", label: "Instant PDF", desc: "Print or save as PDF in one click" },
              { icon: "🖨️", label: "Print Ready", desc: "Formatted for A4 & letter paper" },
              { icon: "🇮🇳", label: "GST Compliant", desc: "Indian GST formats built-in" },
              { icon: "🆓", label: "100% Free", desc: "No sign-up, no watermarks" },
            ].map((f) => (
              <div key={f.label} className="space-y-1">
                <div className="text-2xl">{f.icon}</div>
                <p className="font-semibold text-gray-700">{f.label}</p>
                <p className="text-gray-500 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
