"use client";
import { useState } from "react";
import DocPreview from "@/components/DocPreview";
import Link from "next/link";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const EARN_ITEMS: Array<[string, string]> = [
  ["Basic Salary", "basic"],
  ["HRA", "hra"],
  ["Conveyance Allowance", "conveyance"],
  ["Medical Allowance", "medical"],
  ["Special Allowance", "special"],
  ["Other Allowance", "otherAllowance"],
];

const DED_ITEMS: Array<[string, string]> = [
  ["PF (Employee)", "pf"],
  ["ESIC", "esic"],
  ["TDS", "tds"],
  ["Professional Tax", "professionalTax"],
  ["Other Deduction", "otherDeduction"],
];

const EMP_FIELDS: Array<[string, string]> = [
  ["Employee Name", "empName"],
  ["Employee ID", "empId"],
  ["Designation", "designation"],
  ["Department", "department"],
  ["Bank Name", "bankName"],
  ["Account No.", "accountNo"],
  ["Working Days", "workingDays"],
  ["Days Present", "presentDays"],
  ["PF No.", "pfNo"],
];

type FormData = {
  companyName: string; companyAddress: string; companyGST: string;
  empName: string; empId: string; designation: string; department: string;
  month: string; year: string; workingDays: string; presentDays: string;
  bankName: string; accountNo: string; pfNo: string;
  basic: string; hra: string; conveyance: string; medical: string;
  special: string; otherAllowance: string;
  pf: string; esic: string; tds: string; professionalTax: string; otherDeduction: string;
};

export default function SalarySlipPage() {
  const [form, setForm] = useState<FormData>({
    companyName: "", companyAddress: "", companyGST: "",
    empName: "", empId: "", designation: "", department: "",
    month: MONTHS[new Date().getMonth()], year: String(new Date().getFullYear()),
    workingDays: "26", presentDays: "26", bankName: "", accountNo: "", pfNo: "",
    basic: "", hra: "", conveyance: "", medical: "", special: "", otherAllowance: "",
    pf: "", esic: "", tds: "", professionalTax: "", otherDeduction: "",
  });
  const [show, setShow] = useState(false);

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));

  const inputCls = "w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#e8394d]";
  const labelCls = "block text-xs font-medium text-gray-600 mb-1";

  const earnings =
    Number(form.basic) + Number(form.hra) + Number(form.conveyance) +
    Number(form.medical) + Number(form.special) + Number(form.otherAllowance);
  const deductions =
    Number(form.pf) + Number(form.esic) + Number(form.tds) +
    Number(form.professionalTax) + Number(form.otherDeduction);
  const netSalary = earnings - deductions;

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Hero */}
      <div className="bg-white border-b py-8 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">💼</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Salary Slip Generator</h1>
        <p className="text-sm text-gray-500 mt-1">Generate professional salary slips instantly</p>
        <div className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
          <Link href="/" className="hover:text-[#e8394d]">Home</Link>
          <span>/</span>
          <Link href="/generate" className="hover:text-[#e8394d]">Generate</Link>
          <span>/</span>
          <span>Salary Slip</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">

          {/* Company */}
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2">Company Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Company Name *</label>
              <input className={inputCls} placeholder="e.g. Acme Corp Pvt. Ltd." value={form.companyName} onChange={e => set("companyName", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Company Address</label>
              <input className={inputCls} placeholder="City, State" value={form.companyAddress} onChange={e => set("companyAddress", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>GST / CIN (optional)</label>
              <input className={inputCls} placeholder="GST or CIN number" value={form.companyGST} onChange={e => set("companyGST", e.target.value)} />
            </div>
          </div>

          {/* Employee */}
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2 pt-2">Employee Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Employee Name *</label>
              <input className={inputCls} placeholder="Full name" value={form.empName} onChange={e => set("empName", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Employee ID</label>
              <input className={inputCls} placeholder="e.g. EMP001" value={form.empId} onChange={e => set("empId", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Designation</label>
              <input className={inputCls} placeholder="e.g. Software Engineer" value={form.designation} onChange={e => set("designation", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Department</label>
              <input className={inputCls} placeholder="e.g. Engineering" value={form.department} onChange={e => set("department", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Bank Name</label>
              <input className={inputCls} placeholder="e.g. HDFC Bank" value={form.bankName} onChange={e => set("bankName", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Account No.</label>
              <input className={inputCls} placeholder="Bank account number" value={form.accountNo} onChange={e => set("accountNo", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>PF No. (optional)</label>
              <input className={inputCls} placeholder="PF account number" value={form.pfNo} onChange={e => set("pfNo", e.target.value)} />
            </div>
          </div>

          {/* Pay Period */}
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2 pt-2">Pay Period</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Month</label>
              <select className={inputCls} value={form.month} onChange={e => set("month", e.target.value)}>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Year</label>
              <input className={inputCls} value={form.year} onChange={e => set("year", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Working Days</label>
              <input type="number" className={inputCls} value={form.workingDays} onChange={e => set("workingDays", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Days Present</label>
              <input type="number" className={inputCls} value={form.presentDays} onChange={e => set("presentDays", e.target.value)} />
            </div>
          </div>

          {/* Earnings */}
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2 pt-2">Earnings (₹)</h2>
          <div className="grid grid-cols-3 gap-4">
            {EARN_ITEMS.map(([label, key]) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                <input
                  type="number"
                  className={inputCls}
                  placeholder="0"
                  value={form[key as keyof FormData]}
                  onChange={e => set(key as keyof FormData, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm font-semibold text-green-700">
            Gross Earnings: ₹{earnings.toLocaleString("en-IN")}
          </div>

          {/* Deductions */}
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2 pt-2">Deductions (₹)</h2>
          <div className="grid grid-cols-3 gap-4">
            {DED_ITEMS.map(([label, key]) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                <input
                  type="number"
                  className={inputCls}
                  placeholder="0"
                  value={form[key as keyof FormData]}
                  onChange={e => set(key as keyof FormData, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-sm font-semibold text-red-700">
            Total Deductions: ₹{deductions.toLocaleString("en-IN")}
          </div>

          {/* Net */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl px-4 py-3 text-base font-bold text-blue-800 text-center">
            Net Salary: ₹{netSalary.toLocaleString("en-IN")}
          </div>

          <button
            onClick={() => setShow(true)}
            className="w-full bg-[#e8394d] text-white py-3 rounded-xl font-bold hover:bg-[#d42a3e] transition-colors"
          >
            Generate Salary Slip →
          </button>
        </div>

        {show && (
          <DocPreview title={`Salary Slip - ${form.empName} - ${form.month} ${form.year}`}>
            <SalarySlipDoc form={form} earnings={earnings} deductions={deductions} netSalary={netSalary} />
          </DocPreview>
        )}
      </div>
    </div>
  );
}

function SalarySlipDoc({
  form, earnings, deductions, netSalary,
}: {
  form: FormData;
  earnings: number;
  deductions: number;
  netSalary: number;
}) {
  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const earnRows = EARN_ITEMS.filter(([, k]) => Number(form[k as keyof FormData]) > 0);
  const dedRows  = DED_ITEMS.filter(([, k])  => Number(form[k as keyof FormData]) > 0);
  const maxRows  = Math.max(earnRows.length, dedRows.length, 1);

  const visibleEmpFields = EMP_FIELDS.filter(([, k]) => Boolean(form[k as keyof FormData]));

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", color: "#111", maxWidth: "720px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ background: "#1e3a5f", color: "white", padding: "20px 24px", borderRadius: "6px 6px 0 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
              {form.companyName || "Company Name"}
            </h1>
            {form.companyAddress ? (
              <p style={{ fontSize: "11px", opacity: 0.8, marginTop: "2px" }}>{form.companyAddress}</p>
            ) : null}
            {form.companyGST ? (
              <p style={{ fontSize: "11px", opacity: 0.8 }}>GST/CIN: {form.companyGST}</p>
            ) : null}
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "16px", fontWeight: "bold", letterSpacing: "2px" }}>SALARY SLIP</p>
            <p style={{ fontSize: "12px", opacity: 0.8, marginTop: "2px" }}>{form.month} {form.year}</p>
          </div>
        </div>
      </div>

      {/* Employee info grid */}
      <div style={{ background: "#f8f9fa", border: "1px solid #ddd", borderTop: "none", padding: "14px 24px", marginBottom: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          {visibleEmpFields.map(([label, key]) => (
            <div key={key}>
              <span style={{ color: "#666", fontSize: "10px", display: "block" }}>{label}</span>
              <span style={{ fontWeight: 600, fontSize: "12px" }}>{form[key as keyof FormData]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Earnings / Deductions table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginBottom: "16px", border: "1px solid #ddd" }}>
        <thead>
          <tr style={{ background: "#1e3a5f", color: "white" }}>
            <th style={{ padding: "8px", textAlign: "left", width: "30%" }}>Earnings</th>
            <th style={{ padding: "8px", textAlign: "right", width: "20%" }}>Amount</th>
            <th style={{ padding: "8px", textAlign: "left", width: "30%", borderLeft: "1px solid #2d5080" }}>Deductions</th>
            <th style={{ padding: "8px", textAlign: "right", width: "20%" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxRows }).map((_, i) => {
            const eRow = earnRows[i];
            const dRow = dedRows[i];
            return (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "6px 8px" }}>{eRow ? eRow[0] : ""}</td>
                <td style={{ padding: "6px 8px", textAlign: "right", color: "#166534" }}>
                  {eRow ? inr(Number(form[eRow[1] as keyof FormData])) : ""}
                </td>
                <td style={{ padding: "6px 8px", borderLeft: "1px solid #eee" }}>{dRow ? dRow[0] : ""}</td>
                <td style={{ padding: "6px 8px", textAlign: "right", color: "#991b1b" }}>
                  {dRow ? inr(Number(form[dRow[1] as keyof FormData])) : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr style={{ background: "#e8f0fe", fontWeight: "bold" }}>
            <td style={{ padding: "8px" }}>Gross Earnings</td>
            <td style={{ padding: "8px", textAlign: "right", color: "#166534" }}>{inr(earnings)}</td>
            <td style={{ padding: "8px", borderLeft: "1px solid #eee" }}>Total Deductions</td>
            <td style={{ padding: "8px", textAlign: "right", color: "#991b1b" }}>{inr(deductions)}</td>
          </tr>
        </tfoot>
      </table>

      {/* Net Salary */}
      <div style={{ background: "#1e3a5f", color: "white", padding: "12px 24px", borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <span style={{ fontWeight: "bold", fontSize: "14px" }}>NET SALARY (Take Home)</span>
        <span style={{ fontWeight: "bold", fontSize: "18px" }}>{inr(netSalary)}</span>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "32px" }}>
        <p style={{ fontSize: "10px", color: "#999", maxWidth: "340px" }}>
          This is a computer-generated salary slip and does not require a physical signature.
        </p>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: "1px solid #000", paddingTop: "6px", minWidth: "140px" }}>
            <p style={{ fontSize: "11px", fontWeight: "bold" }}>Authorised Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
}
