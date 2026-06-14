"use client";
import { useState } from "react";
import DocPreview from "@/components/DocPreview";
import Link from "next/link";

interface LineItem { description: string; qty: string; rate: string; tax: string; }

const defaultItem = (): LineItem => ({ description: "", qty: "1", rate: "", tax: "18" });
const TAX_RATES = ["0", "5", "12", "18", "28"];

export default function InvoicePage() {
  const [form, setForm] = useState({
    invoiceNo: "INV-001",
    invoiceDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    invoiceType: "GST Invoice",
    // Seller
    sellerName: "", sellerAddress: "", sellerGST: "", sellerPhone: "", sellerEmail: "",
    // Buyer
    buyerName: "", buyerAddress: "", buyerGST: "", buyerPhone: "",
    // Payment
    bankName: "", accountNo: "", ifsc: "", upi: "",
    // Options
    currency: "INR", notes: "", terms: "Payment due within 15 days.",
    discount: "0", shippingCharge: "0",
  });
  const [items, setItems] = useState<LineItem[]>([defaultItem()]);
  const [show, setShow] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const inputCls = "w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#e8394d]";
  const labelCls = "block text-xs font-medium text-gray-600 mb-1";

  const updateItem = (i: number, k: keyof LineItem, v: string) =>
    setItems(items.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  const addItem = () => setItems([...items, defaultItem()]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const subtotal = items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0);
  const totalTax = items.reduce((s, it) => s + (Number(it.qty) * Number(it.rate) * Number(it.tax)) / 100, 0);
  const discountAmt = (subtotal * Number(form.discount)) / 100;
  const grandTotal = subtotal + totalTax - discountAmt + Number(form.shippingCharge);

  const currSymbol = form.currency === "INR" ? "₹" : form.currency === "USD" ? "$" : form.currency === "EUR" ? "€" : "£";
  const fmt = (n: number) => `${currSymbol}${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="bg-white border-b py-8 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">🧾</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Invoice Generator</h1>
        <p className="text-sm text-gray-500 mt-1">GST Invoice · Tax Invoice · Proforma · Service Invoice</p>
        <div className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
          <Link href="/" className="hover:text-[#e8394d]">Home</Link>
          <span>/</span>
          <Link href="/generate" className="hover:text-[#e8394d]">Generate</Link>
          <span>/</span><span>Invoice</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          {/* Invoice Meta */}
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2">Invoice Details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><label className={labelCls}>Invoice Type</label>
              <select className={inputCls} value={form.invoiceType} onChange={e => set("invoiceType", e.target.value)}>
                {["GST Invoice","Tax Invoice","Proforma Invoice","Service Invoice","Retail Invoice","Credit Note","Debit Note"].map(t => <option key={t}>{t}</option>)}
              </select></div>
            <div><label className={labelCls}>Invoice No. *</label>
              <input className={inputCls} value={form.invoiceNo} onChange={e => set("invoiceNo", e.target.value)} /></div>
            <div><label className={labelCls}>Invoice Date</label>
              <input type="date" className={inputCls} value={form.invoiceDate} onChange={e => set("invoiceDate", e.target.value)} /></div>
            <div><label className={labelCls}>Due Date</label>
              <input type="date" className={inputCls} value={form.dueDate} onChange={e => set("dueDate", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Currency</label>
              <select className={inputCls} value={form.currency} onChange={e => set("currency", e.target.value)}>
                {["INR","USD","EUR","GBP"].map(c => <option key={c}>{c}</option>)}
              </select></div>
          </div>

          {/* Seller / Buyer */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2">From (Seller)</h2>
              <div><label className={labelCls}>Business Name *</label>
                <input className={inputCls} placeholder="Your company name" value={form.sellerName} onChange={e => set("sellerName", e.target.value)} /></div>
              <div><label className={labelCls}>Address</label>
                <textarea className={inputCls + " resize-none"} rows={2} placeholder="Full address" value={form.sellerAddress} onChange={e => set("sellerAddress", e.target.value)} /></div>
              <div><label className={labelCls}>GST Number</label>
                <input className={inputCls} placeholder="22AAAAA0000A1Z5" value={form.sellerGST} onChange={e => set("sellerGST", e.target.value.toUpperCase())} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Phone</label>
                  <input className={inputCls} placeholder="+91 98765 43210" value={form.sellerPhone} onChange={e => set("sellerPhone", e.target.value)} /></div>
                <div><label className={labelCls}>Email</label>
                  <input className={inputCls} placeholder="email@company.com" value={form.sellerEmail} onChange={e => set("sellerEmail", e.target.value)} /></div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2">To (Buyer)</h2>
              <div><label className={labelCls}>Customer / Company Name *</label>
                <input className={inputCls} placeholder="Customer name" value={form.buyerName} onChange={e => set("buyerName", e.target.value)} /></div>
              <div><label className={labelCls}>Billing Address</label>
                <textarea className={inputCls + " resize-none"} rows={2} placeholder="Full address" value={form.buyerAddress} onChange={e => set("buyerAddress", e.target.value)} /></div>
              <div><label className={labelCls}>GST Number (optional)</label>
                <input className={inputCls} placeholder="Customer GSTIN" value={form.buyerGST} onChange={e => set("buyerGST", e.target.value.toUpperCase())} /></div>
              <div><label className={labelCls}>Phone</label>
                <input className={inputCls} placeholder="+91 98765 43210" value={form.buyerPhone} onChange={e => set("buyerPhone", e.target.value)} /></div>
            </div>
          </div>

          {/* Line Items */}
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2">Items / Services</h2>
          <div className="space-y-2">
            <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 px-1">
              <div className="col-span-5">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-2 text-center">GST %</div>
              <div className="col-span-1"></div>
            </div>
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <input className={inputCls} placeholder="Item description" value={item.description}
                    onChange={e => updateItem(i, "description", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <input type="number" className={inputCls + " text-center"} value={item.qty} min="1"
                    onChange={e => updateItem(i, "qty", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <input type="number" className={inputCls + " text-right"} placeholder="0.00" value={item.rate}
                    onChange={e => updateItem(i, "rate", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <select className={inputCls} value={item.tax} onChange={e => updateItem(i, "tax", e.target.value)}>
                    {TAX_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                  </select>
                </div>
                <div className="col-span-1 flex justify-end">
                  {items.length > 1 && (
                    <button onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 text-lg leading-none">×</button>
                  )}
                </div>
              </div>
            ))}
            <button onClick={addItem}
              className="text-sm text-[#e8394d] font-semibold hover:underline mt-1">+ Add Item</button>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              <div className="flex justify-between text-gray-600 items-center gap-2">
                <span>Discount (%)</span>
                <input type="number" className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-xs text-center"
                  value={form.discount} onChange={e => set("discount", e.target.value)} />
                <span className="text-red-500">-{fmt(discountAmt)}</span>
              </div>
              <div className="flex justify-between text-gray-600"><span>GST / Tax</span><span>{fmt(totalTax)}</span></div>
              <div className="flex justify-between text-gray-600 items-center gap-2">
                <span>Shipping</span>
                <input type="number" className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-xs text-center"
                  value={form.shippingCharge} onChange={e => set("shippingCharge", e.target.value)} />
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Grand Total</span><span className="text-[#e8394d]">{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Bank / Payment */}
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2">Bank Details (optional)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><label className={labelCls}>Bank Name</label>
              <input className={inputCls} placeholder="e.g. HDFC Bank" value={form.bankName} onChange={e => set("bankName", e.target.value)} /></div>
            <div><label className={labelCls}>Account No.</label>
              <input className={inputCls} value={form.accountNo} onChange={e => set("accountNo", e.target.value)} /></div>
            <div><label className={labelCls}>IFSC Code</label>
              <input className={inputCls} value={form.ifsc} onChange={e => set("ifsc", e.target.value.toUpperCase())} /></div>
            <div><label className={labelCls}>UPI ID</label>
              <input className={inputCls} placeholder="name@upi" value={form.upi} onChange={e => set("upi", e.target.value)} /></div>
          </div>

          {/* Notes */}
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Notes / Special Instructions</label>
              <textarea className={inputCls + " resize-none"} rows={2} placeholder="Any notes for the customer..." value={form.notes} onChange={e => set("notes", e.target.value)} /></div>
            <div><label className={labelCls}>Terms & Conditions</label>
              <textarea className={inputCls + " resize-none"} rows={2} value={form.terms} onChange={e => set("terms", e.target.value)} /></div>
          </div>

          <button onClick={() => setShow(true)}
            className="w-full bg-[#e8394d] text-white py-3 rounded-xl font-bold hover:bg-[#d42a3e] transition-colors">
            Generate Invoice →
          </button>
        </div>

        {show && (
          <DocPreview title={`${form.invoiceType} - ${form.invoiceNo}`}>
            <InvoiceDoc form={form} items={items} subtotal={subtotal} totalTax={totalTax}
              discountAmt={discountAmt} grandTotal={grandTotal} currSymbol={currSymbol} fmt={fmt} />
          </DocPreview>
        )}
      </div>
    </div>
  );
}

function InvoiceDoc({ form, items, subtotal, totalTax, discountAmt, grandTotal, currSymbol, fmt }: {
  form: Record<string, string>;
  items: LineItem[];
  subtotal: number; totalTax: number; discountAmt: number; grandTotal: number;
  currSymbol: string;
  fmt: (n: number) => string;
}) {
  const accentColor = "#e8394d";
  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", color: "#111", maxWidth: "760px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `3px solid ${accentColor}`, paddingBottom: "16px", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: accentColor, letterSpacing: "1px" }}>{form.invoiceType?.toUpperCase()}</h1>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "#333", marginTop: "4px" }}>{form.sellerName || "Your Company"}</p>
          {form.sellerAddress && <p style={{ color: "#666", fontSize: "11px", marginTop: "2px" }}>{form.sellerAddress}</p>}
          {form.sellerGST && <p style={{ color: "#666", fontSize: "11px" }}>GSTIN: {form.sellerGST}</p>}
          {form.sellerPhone && <p style={{ color: "#666", fontSize: "11px" }}>Phone: {form.sellerPhone}</p>}
          {form.sellerEmail && <p style={{ color: "#666", fontSize: "11px" }}>Email: {form.sellerEmail}</p>}
        </div>
        <div style={{ textAlign: "right" }}>
          <table style={{ fontSize: "12px" }}>
            <tbody>
              <tr><td style={{ color: "#666", paddingRight: "12px" }}>Invoice No.</td><td style={{ fontWeight: "bold" }}>{form.invoiceNo}</td></tr>
              <tr><td style={{ color: "#666", paddingRight: "12px" }}>Date</td><td>{fmtDate(form.invoiceDate)}</td></tr>
              {form.dueDate && <tr><td style={{ color: "#666", paddingRight: "12px" }}>Due Date</td><td style={{ color: "#e8394d", fontWeight: "bold" }}>{fmtDate(form.dueDate)}</td></tr>}
              <tr><td style={{ color: "#666", paddingRight: "12px" }}>Currency</td><td>{form.currency}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill To */}
      <div style={{ background: "#f8f9fa", border: "1px solid #eee", borderRadius: "6px", padding: "12px 16px", marginBottom: "20px" }}>
        <p style={{ fontSize: "10px", fontWeight: "bold", color: "#888", letterSpacing: "1px", marginBottom: "6px" }}>BILL TO</p>
        <p style={{ fontWeight: "bold", fontSize: "14px" }}>{form.buyerName || "Customer Name"}</p>
        {form.buyerAddress && <p style={{ color: "#555", fontSize: "11px", marginTop: "2px" }}>{form.buyerAddress}</p>}
        {form.buyerGST && <p style={{ color: "#555", fontSize: "11px" }}>GSTIN: {form.buyerGST}</p>}
        {form.buyerPhone && <p style={{ color: "#555", fontSize: "11px" }}>Phone: {form.buyerPhone}</p>}
      </div>

      {/* Items table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px", fontSize: "12px" }}>
        <thead>
          <tr style={{ background: accentColor, color: "white" }}>
            <th style={{ padding: "8px 10px", textAlign: "left" }}>#</th>
            <th style={{ padding: "8px 10px", textAlign: "left" }}>Description</th>
            <th style={{ padding: "8px 10px", textAlign: "right" }}>Qty</th>
            <th style={{ padding: "8px 10px", textAlign: "right" }}>Rate</th>
            <th style={{ padding: "8px 10px", textAlign: "right" }}>GST%</th>
            <th style={{ padding: "8px 10px", textAlign: "right" }}>Tax Amt</th>
            <th style={{ padding: "8px 10px", textAlign: "right" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.filter(it => it.description || it.rate).map((it, i) => {
            const base = Number(it.qty) * Number(it.rate);
            const tax = (base * Number(it.tax)) / 100;
            return (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "7px 10px" }}>{i + 1}</td>
                <td style={{ padding: "7px 10px" }}>{it.description || "—"}</td>
                <td style={{ padding: "7px 10px", textAlign: "right" }}>{it.qty}</td>
                <td style={{ padding: "7px 10px", textAlign: "right" }}>{fmt(Number(it.rate))}</td>
                <td style={{ padding: "7px 10px", textAlign: "right" }}>{it.tax}%</td>
                <td style={{ padding: "7px 10px", textAlign: "right" }}>{fmt(tax)}</td>
                <td style={{ padding: "7px 10px", textAlign: "right", fontWeight: "bold" }}>{fmt(base + tax)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals + Bank side by side */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "24px", marginBottom: "24px" }}>
        {/* Bank details */}
        {(form.bankName || form.upi) && (
          <div style={{ flex: 1, border: "1px solid #eee", borderRadius: "6px", padding: "12px 14px" }}>
            <p style={{ fontSize: "10px", fontWeight: "bold", color: "#888", letterSpacing: "1px", marginBottom: "8px" }}>PAYMENT DETAILS</p>
            {form.bankName && <p><span style={{ color: "#666" }}>Bank: </span>{form.bankName}</p>}
            {form.accountNo && <p><span style={{ color: "#666" }}>Account: </span>{form.accountNo}</p>}
            {form.ifsc && <p><span style={{ color: "#666" }}>IFSC: </span>{form.ifsc}</p>}
            {form.upi && <p style={{ marginTop: "6px" }}><span style={{ color: "#666" }}>UPI: </span><strong>{form.upi}</strong></p>}
          </div>
        )}
        {/* Summary */}
        <div style={{ minWidth: "220px" }}>
          <table style={{ width: "100%", fontSize: "12px" }}>
            <tbody>
              <tr><td style={{ padding: "4px 0", color: "#666" }}>Subtotal</td><td style={{ textAlign: "right" }}>{fmt(subtotal)}</td></tr>
              {Number(form.discount) > 0 && <tr><td style={{ color: "#666" }}>Discount ({form.discount}%)</td><td style={{ textAlign: "right", color: "red" }}>-{fmt(discountAmt)}</td></tr>}
              <tr><td style={{ color: "#666" }}>Total Tax</td><td style={{ textAlign: "right" }}>{fmt(totalTax)}</td></tr>
              {Number(form.shippingCharge) > 0 && <tr><td style={{ color: "#666" }}>Shipping</td><td style={{ textAlign: "right" }}>{fmt(Number(form.shippingCharge))}</td></tr>}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "2px solid #333" }}>
                <td style={{ paddingTop: "8px", fontWeight: "bold", fontSize: "14px" }}>TOTAL</td>
                <td style={{ paddingTop: "8px", textAlign: "right", fontWeight: "bold", fontSize: "16px", color: accentColor }}>{fmt(grandTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Notes / Terms */}
      {(form.notes || form.terms) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px", fontSize: "11px" }}>
          {form.notes && <div><p style={{ fontWeight: "bold", color: "#555", marginBottom: "4px" }}>Notes</p><p style={{ color: "#777" }}>{form.notes}</p></div>}
          {form.terms && <div><p style={{ fontWeight: "bold", color: "#555", marginBottom: "4px" }}>Terms & Conditions</p><p style={{ color: "#777" }}>{form.terms}</p></div>}
        </div>
      )}

      {/* Signature */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "32px" }}>
        <div style={{ textAlign: "center", minWidth: "180px" }}>
          <div style={{ borderTop: "1px solid #000", paddingTop: "6px" }}>
            <p style={{ fontWeight: "bold", fontSize: "13px" }}>{form.sellerName || "Authorised Signatory"}</p>
            <p style={{ fontSize: "10px", color: "#666" }}>Signature / Stamp</p>
          </div>
        </div>
      </div>

      <p style={{ marginTop: "20px", fontSize: "10px", color: "#aaa", textAlign: "center" }}>
        This is a computer-generated {form.invoiceType?.toLowerCase()}. — Generated via ILove2Convert
      </p>
    </div>
  );
}
