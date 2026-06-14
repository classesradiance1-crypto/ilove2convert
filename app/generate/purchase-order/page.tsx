"use client";
import { useState } from "react";
import DocPreview from "@/components/DocPreview";
import Link from "next/link";

interface POItem { description: string; qty: string; unit: string; rate: string; tax: string; }
const defaultItem = (): POItem => ({ description: "", qty: "1", unit: "pcs", rate: "", tax: "18" });
const UNITS = ["pcs","kg","g","litre","m","ft","box","set","nos","hr","day"];

export default function PurchaseOrderPage() {
  const [form, setForm] = useState({
    poNo: "PO-001",
    poDate: new Date().toISOString().slice(0, 10),
    deliveryDate: "",
    // Company
    companyName: "", companyAddress: "", companyGST: "", companyPhone: "",
    // Vendor
    vendorName: "", vendorAddress: "", vendorGST: "", vendorPhone: "",
    // Options
    currency: "INR", paymentTerms: "Net 30 days", deliveryAddress: "",
    notes: "", discount: "0",
  });
  const [items, setItems] = useState<POItem[]>([defaultItem()]);
  const [show, setShow] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const inputCls = "w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#e8394d]";
  const labelCls = "block text-xs font-medium text-gray-600 mb-1";

  const updateItem = (i: number, k: keyof POItem, v: string) =>
    setItems(items.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  const addItem = () => setItems([...items, defaultItem()]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const subtotal = items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0);
  const totalTax = items.reduce((s, it) => s + (Number(it.qty) * Number(it.rate) * Number(it.tax)) / 100, 0);
  const discountAmt = (subtotal * Number(form.discount)) / 100;
  const grandTotal = subtotal + totalTax - discountAmt;
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="bg-white border-b py-8 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">📦</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Purchase Order Generator</h1>
        <p className="text-sm text-gray-500 mt-1">Create professional Purchase Orders for your vendors</p>
        <div className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
          <Link href="/" className="hover:text-[#e8394d]">Home</Link>
          <span>/</span>
          <Link href="/generate" className="hover:text-[#e8394d]">Generate</Link>
          <span>/</span><span>Purchase Order</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          {/* PO Meta */}
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2">PO Details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><label className={labelCls}>PO Number *</label>
              <input className={inputCls} value={form.poNo} onChange={e => set("poNo", e.target.value)} /></div>
            <div><label className={labelCls}>PO Date</label>
              <input type="date" className={inputCls} value={form.poDate} onChange={e => set("poDate", e.target.value)} /></div>
            <div><label className={labelCls}>Required By</label>
              <input type="date" className={inputCls} value={form.deliveryDate} onChange={e => set("deliveryDate", e.target.value)} /></div>
            <div><label className={labelCls}>Payment Terms</label>
              <select className={inputCls} value={form.paymentTerms} onChange={e => set("paymentTerms", e.target.value)}>
                {["Immediate","Net 15 days","Net 30 days","Net 45 days","Net 60 days","Advance","50% Advance"].map(t => <option key={t}>{t}</option>)}
              </select></div>
          </div>

          {/* Company / Vendor */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2">Your Company</h2>
              <div><label className={labelCls}>Company Name *</label>
                <input className={inputCls} placeholder="Your company" value={form.companyName} onChange={e => set("companyName", e.target.value)} /></div>
              <div><label className={labelCls}>Address</label>
                <textarea className={inputCls + " resize-none"} rows={2} value={form.companyAddress} onChange={e => set("companyAddress", e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>GSTIN</label>
                  <input className={inputCls} value={form.companyGST} onChange={e => set("companyGST", e.target.value.toUpperCase())} /></div>
                <div><label className={labelCls}>Phone</label>
                  <input className={inputCls} value={form.companyPhone} onChange={e => set("companyPhone", e.target.value)} /></div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2">Vendor / Supplier</h2>
              <div><label className={labelCls}>Vendor Name *</label>
                <input className={inputCls} placeholder="Vendor company name" value={form.vendorName} onChange={e => set("vendorName", e.target.value)} /></div>
              <div><label className={labelCls}>Address</label>
                <textarea className={inputCls + " resize-none"} rows={2} value={form.vendorAddress} onChange={e => set("vendorAddress", e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>GSTIN</label>
                  <input className={inputCls} value={form.vendorGST} onChange={e => set("vendorGST", e.target.value.toUpperCase())} /></div>
                <div><label className={labelCls}>Phone</label>
                  <input className={inputCls} value={form.vendorPhone} onChange={e => set("vendorPhone", e.target.value)} /></div>
              </div>
            </div>
          </div>

          <div><label className={labelCls}>Delivery Address (if different)</label>
            <input className={inputCls} placeholder="Leave blank to use company address" value={form.deliveryAddress} onChange={e => set("deliveryAddress", e.target.value)} /></div>

          {/* Items */}
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2">Items to Order</h2>
          <div className="space-y-2">
            <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 px-1">
              <div className="col-span-4">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-1 text-center">Unit</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-2 text-center">GST %</div>
              <div className="col-span-1"></div>
            </div>
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <input className={inputCls} placeholder="Item / material description" value={item.description}
                    onChange={e => updateItem(i, "description", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <input type="number" className={inputCls + " text-center"} value={item.qty} min="1"
                    onChange={e => updateItem(i, "qty", e.target.value)} />
                </div>
                <div className="col-span-1">
                  <select className={inputCls + " px-1"} value={item.unit} onChange={e => updateItem(i, "unit", e.target.value)}>
                    {UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <input type="number" className={inputCls + " text-right"} placeholder="0.00" value={item.rate}
                    onChange={e => updateItem(i, "rate", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <select className={inputCls} value={item.tax} onChange={e => updateItem(i, "tax", e.target.value)}>
                    {["0","5","12","18","28"].map(r => <option key={r} value={r}>{r}%</option>)}
                  </select>
                </div>
                <div className="col-span-1 flex justify-end">
                  {items.length > 1 && (
                    <button onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 text-lg">×</button>
                  )}
                </div>
              </div>
            ))}
            <button onClick={addItem} className="text-sm text-[#e8394d] font-semibold hover:underline mt-1">+ Add Item</button>
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
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span><span className="text-purple-700">{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div><label className={labelCls}>Notes / Special Instructions</label>
            <textarea className={inputCls + " resize-none"} rows={2} placeholder="Delivery instructions, quality requirements..." value={form.notes} onChange={e => set("notes", e.target.value)} /></div>

          <button onClick={() => setShow(true)}
            className="w-full bg-[#e8394d] text-white py-3 rounded-xl font-bold hover:bg-[#d42a3e] transition-colors">
            Generate Purchase Order →
          </button>
        </div>

        {show && (
          <DocPreview title={`Purchase Order - ${form.poNo}`}>
            <PODoc form={form} items={items} subtotal={subtotal} totalTax={totalTax}
              discountAmt={discountAmt} grandTotal={grandTotal} fmt={fmt} />
          </DocPreview>
        )}
      </div>
    </div>
  );
}

function PODoc({ form, items, subtotal, totalTax, discountAmt, grandTotal, fmt }: {
  form: Record<string, string>; items: POItem[];
  subtotal: number; totalTax: number; discountAmt: number; grandTotal: number;
  fmt: (n: number) => string;
}) {
  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const accent = "#6d28d9";

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", color: "#111", maxWidth: "760px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `3px solid ${accent}`, paddingBottom: "16px", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "bold", color: accent }}>PURCHASE ORDER</h1>
          <p style={{ fontSize: "18px", fontWeight: "bold", marginTop: "4px" }}>{form.companyName || "Company Name"}</p>
          {form.companyAddress && <p style={{ color: "#666", fontSize: "11px" }}>{form.companyAddress}</p>}
          {form.companyGST && <p style={{ color: "#666", fontSize: "11px" }}>GSTIN: {form.companyGST}</p>}
          {form.companyPhone && <p style={{ color: "#666", fontSize: "11px" }}>Phone: {form.companyPhone}</p>}
        </div>
        <div style={{ textAlign: "right" }}>
          <table style={{ fontSize: "12px" }}>
            <tbody>
              <tr><td style={{ color: "#666", paddingRight: "12px" }}>PO Number</td><td style={{ fontWeight: "bold", color: accent }}>{form.poNo}</td></tr>
              <tr><td style={{ color: "#666" }}>Date</td><td>{fmtDate(form.poDate)}</td></tr>
              {form.deliveryDate && <tr><td style={{ color: "#666" }}>Required By</td><td style={{ fontWeight: "bold" }}>{fmtDate(form.deliveryDate)}</td></tr>}
              <tr><td style={{ color: "#666" }}>Payment</td><td>{form.paymentTerms}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
        <div style={{ border: "1px solid #eee", borderRadius: "6px", padding: "12px" }}>
          <p style={{ fontSize: "10px", fontWeight: "bold", color: "#888", marginBottom: "6px" }}>VENDOR / SUPPLIER</p>
          <p style={{ fontWeight: "bold" }}>{form.vendorName || "—"}</p>
          {form.vendorAddress && <p style={{ color: "#666", fontSize: "11px" }}>{form.vendorAddress}</p>}
          {form.vendorGST && <p style={{ color: "#666", fontSize: "11px" }}>GSTIN: {form.vendorGST}</p>}
          {form.vendorPhone && <p style={{ color: "#666", fontSize: "11px" }}>Phone: {form.vendorPhone}</p>}
        </div>
        <div style={{ border: "1px solid #eee", borderRadius: "6px", padding: "12px" }}>
          <p style={{ fontSize: "10px", fontWeight: "bold", color: "#888", marginBottom: "6px" }}>DELIVER TO</p>
          <p style={{ fontWeight: "bold" }}>{form.companyName}</p>
          <p style={{ color: "#666", fontSize: "11px" }}>{form.deliveryAddress || form.companyAddress}</p>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px", fontSize: "12px" }}>
        <thead>
          <tr style={{ background: accent, color: "white" }}>
            <th style={{ padding: "8px 10px", textAlign: "left" }}>#</th>
            <th style={{ padding: "8px 10px", textAlign: "left" }}>Description</th>
            <th style={{ padding: "8px 10px", textAlign: "right" }}>Qty</th>
            <th style={{ padding: "8px 10px", textAlign: "center" }}>Unit</th>
            <th style={{ padding: "8px 10px", textAlign: "right" }}>Rate</th>
            <th style={{ padding: "8px 10px", textAlign: "right" }}>GST%</th>
            <th style={{ padding: "8px 10px", textAlign: "right" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.filter(it => it.description || it.rate).map((it, i) => {
            const base = Number(it.qty) * Number(it.rate);
            const tax = (base * Number(it.tax)) / 100;
            return (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "7px 10px" }}>{i + 1}</td>
                <td style={{ padding: "7px 10px" }}>{it.description}</td>
                <td style={{ padding: "7px 10px", textAlign: "right" }}>{it.qty}</td>
                <td style={{ padding: "7px 10px", textAlign: "center" }}>{it.unit}</td>
                <td style={{ padding: "7px 10px", textAlign: "right" }}>{fmt(Number(it.rate))}</td>
                <td style={{ padding: "7px 10px", textAlign: "right" }}>{it.tax}%</td>
                <td style={{ padding: "7px 10px", textAlign: "right", fontWeight: "bold" }}>{fmt(base + tax)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr style={{ background: "#f5f3ff" }}>
            <td colSpan={5} style={{ padding: "6px 10px", textAlign: "right", color: "#555" }}>Subtotal</td>
            <td colSpan={2} style={{ padding: "6px 10px", textAlign: "right" }}>{fmt(subtotal)}</td>
          </tr>
          {Number(form.discount) > 0 && <tr>
            <td colSpan={5} style={{ padding: "4px 10px", textAlign: "right", color: "#555" }}>Discount ({form.discount}%)</td>
            <td colSpan={2} style={{ padding: "4px 10px", textAlign: "right", color: "red" }}>-{fmt(discountAmt)}</td>
          </tr>}
          <tr>
            <td colSpan={5} style={{ padding: "4px 10px", textAlign: "right", color: "#555" }}>Total Tax</td>
            <td colSpan={2} style={{ padding: "4px 10px", textAlign: "right" }}>{fmt(totalTax)}</td>
          </tr>
          <tr style={{ background: accent, color: "white" }}>
            <td colSpan={5} style={{ padding: "8px 10px", textAlign: "right", fontWeight: "bold" }}>GRAND TOTAL</td>
            <td colSpan={2} style={{ padding: "8px 10px", textAlign: "right", fontWeight: "bold", fontSize: "14px" }}>{fmt(grandTotal)}</td>
          </tr>
        </tfoot>
      </table>

      {form.notes && <div style={{ border: "1px solid #eee", borderRadius: "6px", padding: "10px 14px", marginBottom: "16px", fontSize: "11px" }}>
        <p style={{ fontWeight: "bold", color: "#555", marginBottom: "4px" }}>Notes / Instructions</p>
        <p style={{ color: "#777" }}>{form.notes}</p>
      </div>}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: "1px solid #000", paddingTop: "6px", minWidth: "140px" }}>
            <p style={{ fontSize: "11px" }}>Vendor Acceptance</p>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: "1px solid #000", paddingTop: "6px", minWidth: "140px" }}>
            <p style={{ fontWeight: "bold", fontSize: "12px" }}>{form.companyName}</p>
            <p style={{ fontSize: "11px", color: "#666" }}>Authorised Signatory</p>
          </div>
        </div>
      </div>

      <p style={{ marginTop: "20px", fontSize: "10px", color: "#aaa", textAlign: "center" }}>
        Computer-generated Purchase Order — ILove2Convert
      </p>
    </div>
  );
}
