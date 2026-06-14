"use client";
import { useState } from "react";
import DocPreview from "@/components/DocPreview";
import Link from "next/link";

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function RentReceiptPage() {
  const [form, setForm] = useState({
    receiptNo: "001",
    tenantName: "",
    tenantAddress: "",
    landlordName: "",
    landlordAddress: "",
    propertyAddress: "",
    amount: "",
    month: months[new Date().getMonth()],
    year: String(new Date().getFullYear()),
    paymentMode: "Bank Transfer",
    paymentDate: new Date().toISOString().slice(0, 10),
    panNo: "",
    remarks: "",
  });
  const [show, setShow] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const inputCls = "w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#e8394d]";
  const labelCls = "block text-xs font-medium text-gray-600 mb-1";

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="bg-white border-b py-8 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">🏠</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Rent Receipt Generator</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details and generate a printable rent receipt</p>
        <div className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
          <Link href="/" className="hover:text-[#e8394d]">Home</Link>
          <span>/</span><span>Rent Receipt</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2">Receipt Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Receipt No.</label>
              <input className={inputCls} value={form.receiptNo} onChange={e => set("receiptNo", e.target.value)} /></div>
            <div><label className={labelCls}>Payment Date</label>
              <input type="date" className={inputCls} value={form.paymentDate} onChange={e => set("paymentDate", e.target.value)} /></div>
          </div>
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2 pt-2">Tenant & Landlord</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Tenant Name *</label>
              <input className={inputCls} placeholder="Full name" value={form.tenantName} onChange={e => set("tenantName", e.target.value)} /></div>
            <div><label className={labelCls}>Landlord Name *</label>
              <input className={inputCls} placeholder="Full name" value={form.landlordName} onChange={e => set("landlordName", e.target.value)} /></div>
            <div><label className={labelCls}>Tenant Address</label>
              <input className={inputCls} placeholder="Current address" value={form.tenantAddress} onChange={e => set("tenantAddress", e.target.value)} /></div>
            <div><label className={labelCls}>Landlord Address</label>
              <input className={inputCls} placeholder="Landlord address" value={form.landlordAddress} onChange={e => set("landlordAddress", e.target.value)} /></div>
          </div>
          <div><label className={labelCls}>Property Address (Rented)</label>
            <input className={inputCls} placeholder="Full property address" value={form.propertyAddress} onChange={e => set("propertyAddress", e.target.value)} /></div>

          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2 pt-2">Payment Details</h2>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelCls}>Rent Amount (₹) *</label>
              <input type="number" className={inputCls} placeholder="e.g. 12000" value={form.amount} onChange={e => set("amount", e.target.value)} /></div>
            <div><label className={labelCls}>Month</label>
              <select className={inputCls} value={form.month} onChange={e => set("month", e.target.value)}>
                {months.map(m => <option key={m}>{m}</option>)}
              </select></div>
            <div><label className={labelCls}>Year</label>
              <input className={inputCls} value={form.year} onChange={e => set("year", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Payment Mode</label>
              <select className={inputCls} value={form.paymentMode} onChange={e => set("paymentMode", e.target.value)}>
                {["Cash","Bank Transfer","UPI","Cheque","NEFT/RTGS","Online"].map(m => <option key={m}>{m}</option>)}
              </select></div>
            <div><label className={labelCls}>Landlord PAN (optional)</label>
              <input className={inputCls} placeholder="ABCDE1234F" value={form.panNo} onChange={e => set("panNo", e.target.value.toUpperCase())} /></div>
          </div>
          <div><label className={labelCls}>Remarks (optional)</label>
            <input className={inputCls} placeholder="e.g. Rent for residential use" value={form.remarks} onChange={e => set("remarks", e.target.value)} /></div>

          <button onClick={() => setShow(true)}
            className="w-full bg-[#e8394d] text-white py-3 rounded-xl font-bold hover:bg-[#d42a3e] transition-colors">
            Generate Receipt →
          </button>
        </div>

        {/* Preview */}
        {show && (
          <DocPreview title="Rent Receipt">
            <RentReceiptDoc form={form} />
          </DocPreview>
        )}
      </div>
    </div>
  );
}

function RentReceiptDoc({ form }: { form: Record<string, string> }) {
  const amtNum = Number(form.amount) || 0;
  const amtWords = numberToWords(amtNum);
  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "13px", color: "#111", maxWidth: "680px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", borderBottom: "3px solid #e8394d", paddingBottom: "16px", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#e8394d", letterSpacing: "2px" }}>RENT RECEIPT</h1>
        <p style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>House Rent Receipt</p>
      </div>

      {/* Meta row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <div><span style={{ fontWeight: "bold" }}>Receipt No:</span> {form.receiptNo}</div>
        <div><span style={{ fontWeight: "bold" }}>Date:</span> {new Date(form.paymentDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</div>
      </div>

      {/* Body */}
      <div style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "20px", marginBottom: "20px", background: "#fafafa" }}>
        <p style={{ marginBottom: "12px", lineHeight: "1.8" }}>
          Received with thanks from <strong>{form.tenantName || "___________"}</strong>
          {form.tenantAddress && `, residing at ${form.tenantAddress},`} a sum of{" "}
          <strong style={{ color: "#e8394d" }}>₹{amtNum.toLocaleString("en-IN")}/- ({amtWords} Only)</strong>{" "}
          towards the rent for the month of <strong>{form.month} {form.year}</strong>.
        </p>
        <p style={{ marginBottom: "8px" }}>
          <strong>Property Address:</strong> {form.propertyAddress || "___________"}
        </p>
        <p style={{ marginBottom: "8px" }}>
          <strong>Payment Mode:</strong> {form.paymentMode}
        </p>
        {form.remarks && <p style={{ marginBottom: "8px" }}><strong>Remarks:</strong> {form.remarks}</p>}
      </div>

      {/* Parties */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "24px", marginBottom: "24px" }}>
        <div style={{ flex: 1, border: "1px solid #eee", borderRadius: "6px", padding: "12px" }}>
          <p style={{ fontWeight: "bold", marginBottom: "6px", color: "#555", fontSize: "11px" }}>TENANT DETAILS</p>
          <p>{form.tenantName || "—"}</p>
          <p style={{ color: "#666", fontSize: "12px" }}>{form.tenantAddress}</p>
        </div>
        <div style={{ flex: 1, border: "1px solid #eee", borderRadius: "6px", padding: "12px" }}>
          <p style={{ fontWeight: "bold", marginBottom: "6px", color: "#555", fontSize: "11px" }}>LANDLORD DETAILS</p>
          <p>{form.landlordName || "—"}</p>
          <p style={{ color: "#666", fontSize: "12px" }}>{form.landlordAddress}</p>
          {form.panNo && <p style={{ fontSize: "12px", marginTop: "4px" }}>PAN: <strong>{form.panNo}</strong></p>}
        </div>
      </div>

      {/* Signature */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "32px" }}>
        <div style={{ textAlign: "center", minWidth: "160px" }}>
          <div style={{ borderTop: "1px solid #000", paddingTop: "6px" }}>
            <p style={{ fontWeight: "bold" }}>{form.landlordName || "Landlord"}</p>
            <p style={{ fontSize: "11px", color: "#666" }}>Landlord Signature</p>
          </div>
        </div>
      </div>

      <p style={{ marginTop: "24px", fontSize: "10px", color: "#999", textAlign: "center" }}>
        This is a computer-generated rent receipt.
      </p>
    </div>
  );
}

function numberToWords(n: number): string {
  if (n === 0) return "Zero";
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const convert = (num: number): string => {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num/10)] + (num%10 ? " " + ones[num%10] : "");
    if (num < 1000) return ones[Math.floor(num/100)] + " Hundred" + (num%100 ? " " + convert(num%100) : "");
    if (num < 100000) return convert(Math.floor(num/1000)) + " Thousand" + (num%1000 ? " " + convert(num%1000) : "");
    if (num < 10000000) return convert(Math.floor(num/100000)) + " Lakh" + (num%100000 ? " " + convert(num%100000) : "");
    return convert(Math.floor(num/10000000)) + " Crore" + (num%10000000 ? " " + convert(num%10000000) : "");
  };
  return convert(Math.floor(n));
}
