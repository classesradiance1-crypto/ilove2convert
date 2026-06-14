"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

interface ProfileData {
  user: {
    id: number; name: string; email: string; plan: string;
    is_verified: number; phone: string | null; country: string | null;
    avatar_url: string | null; created_at: string;
  };
  stats: { total: number; success: number; error: number };
  recent: Array<{ tool_name: string; tool_slug: string; status: string; file_name: string; duration_ms: number; created_at: string }>;
  auditEvents: Array<{ event: string; ip_address: string; created_at: string }>;
}

type Tab = "overview" | "activity" | "security" | "settings";

const PLAN_BADGE: Record<string, string> = {
  free: "bg-gray-100 text-gray-600",
  premium: "bg-yellow-100 text-yellow-700",
  business: "bg-purple-100 text-purple-700",
};

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [data, setData] = useState<ProfileData | null>(null);
  const [fetching, setFetching] = useState(true);

  // Profile edit state
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Password state
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const loadProfile = useCallback(async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/auth/profile", { credentials: "include" });
      if (res.status === 401) { router.push("/login"); return; }
      const json = await res.json();
      setData(json);
      setEditName(json.user.name ?? "");
      setEditPhone(json.user.phone ?? "");
      setEditCountry(json.user.country ?? "");
    } catch { /* ignore */ }
    finally { setFetching(false); }
  }, [router]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => { if (user) loadProfile(); }, [user, loadProfile]);

  const saveProfile = async () => {
    setSaving(true); setSaveMsg("");
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, phone: editPhone, country: editCountry }),
      });
      const json = await res.json();
      if (res.ok) { setSaveMsg("✅ Profile updated!"); setData(d => d ? { ...d, user: { ...d.user, ...json.user } } : d); }
      else setSaveMsg(`❌ ${json.error}`);
    } finally { setSaving(false); }
  };

  const changePassword = async () => {
    setPwErr(""); setPwMsg("");
    if (pw.next !== pw.confirm) { setPwErr("New passwords do not match."); return; }
    if (pw.next.length < 8) { setPwErr("Password must be at least 8 characters."); return; }
    setPwSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next }),
      });
      const json = await res.json();
      if (res.ok) { setPwMsg("✅ Password changed!"); setPw({ current: "", next: "", confirm: "" }); }
      else setPwErr(`❌ ${json.error}`);
    } finally { setPwSaving(false); }
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#e8394d] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data) return null;
  const { stats, recent, auditEvents } = data;
  const u = data.user;

  const inp = "w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#e8394d]";
  const lbl = "block text-xs font-medium text-gray-600 mb-1";

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "activity", label: "Activity", icon: "📋" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const statusColor = (s: string) => s === "success" ? "text-green-600" : s === "error" ? "text-red-500" : "text-gray-500";

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Top bar */}
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e8394d] flex items-center justify-center text-white font-bold text-lg">
              {u.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">{u.name}</p>
              <p className="text-xs text-gray-500">{u.email}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PLAN_BADGE[u.plan] ?? PLAN_BADGE.free}`}>
              {u.plan.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-500 hover:text-[#e8394d]">← Home</Link>
            <button onClick={logout}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tab nav */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm mb-6 w-fit">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? "bg-[#e8394d] text-white" : "text-gray-600 hover:text-gray-900"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Tools Used", value: stats.total, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Successful", value: stats.success, color: "text-green-600", bg: "bg-green-50" },
                { label: "Errors", value: stats.error, color: "text-red-500", bg: "bg-red-50" },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-transparent`}>
                  <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Account card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
              <h2 className="font-bold text-gray-800">Account Info</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ["Name", u.name], ["Email", u.email],
                  ["Plan", u.plan.toUpperCase()], ["Verified", u.is_verified ? "✅ Yes" : "❌ No"],
                  ["Phone", u.phone || "—"], ["Country", u.country || "—"],
                  ["Member since", fmtDate(u.created_at)],
                ].map(([k, v]) => (
                  <div key={k}><span className="text-gray-500 text-xs">{k}</span><p className="font-medium text-gray-800">{v}</p></div>
                ))}
              </div>
              {u.plan === "free" && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between mt-2">
                  <div>
                    <p className="font-semibold text-yellow-800 text-sm">Upgrade to Premium</p>
                    <p className="text-xs text-yellow-600">Remove limits, unlock all tools</p>
                  </div>
                  <Link href="/pricing" className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-600 transition-colors">
                    Upgrade
                  </Link>
                </div>
              )}
            </div>

            {/* Recent activity snippet */}
            {recent.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-gray-800">Recent Activity</h2>
                  <button onClick={() => setTab("activity")} className="text-xs text-[#e8394d] hover:underline">View all</button>
                </div>
                <div className="space-y-2">
                  {recent.slice(0, 5).map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${r.status === "success" ? "bg-green-400" : r.status === "error" ? "bg-red-400" : "bg-gray-300"}`} />
                        <span className="text-gray-700 font-medium">{r.tool_name}</span>
                        {r.file_name && <span className="text-gray-400 text-xs truncate max-w-[150px]">{r.file_name}</span>}
                      </div>
                      <span className="text-gray-400 text-xs">{fmtDate(r.created_at)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Activity Log ── */}
        {tab === "activity" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">Tool Usage History</h2>
            {recent.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No activity yet. Start using tools!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-gray-500 font-semibold">
                      <th className="pb-2 pr-4">Tool</th>
                      <th className="pb-2 pr-4">File</th>
                      <th className="pb-2 pr-4">Status</th>
                      <th className="pb-2 pr-4">Duration</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0">
                        <td className="py-2 pr-4 font-medium text-gray-800">{r.tool_name}</td>
                        <td className="py-2 pr-4 text-gray-500 truncate max-w-[160px]">{r.file_name || "—"}</td>
                        <td className={`py-2 pr-4 font-semibold ${statusColor(r.status)}`}>{r.status}</td>
                        <td className="py-2 pr-4 text-gray-500">{r.duration_ms ? `${r.duration_ms}ms` : "—"}</td>
                        <td className="py-2 text-gray-400 text-xs">{fmtDate(r.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Security / Audit ── */}
        {tab === "security" && (
          <div className="space-y-6">
            {/* Change password */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h2 className="font-bold text-gray-800">Change Password</h2>
              <div className="max-w-sm space-y-3">
                <div><label className={lbl}>Current Password</label>
                  <input type="password" className={inp} value={pw.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))} /></div>
                <div><label className={lbl}>New Password</label>
                  <input type="password" className={inp} value={pw.next} onChange={e => setPw(p => ({ ...p, next: e.target.value }))} placeholder="Min. 8 characters" /></div>
                <div><label className={lbl}>Confirm New Password</label>
                  <input type="password" className={inp} value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} /></div>
                {pwErr && <p className="text-sm text-red-600">{pwErr}</p>}
                {pwMsg && <p className="text-sm text-green-600">{pwMsg}</p>}
                <button onClick={changePassword} disabled={pwSaving}
                  className="bg-[#e8394d] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#d42a3e] disabled:opacity-50 transition-colors">
                  {pwSaving ? "Updating…" : "Update Password"}
                </button>
              </div>
            </div>

            {/* Audit log */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-800 mb-4">Login & Security Audit</h2>
              {auditEvents.length === 0 ? (
                <p className="text-gray-400 text-sm">No audit events yet.</p>
              ) : (
                <div className="space-y-2">
                  {auditEvents.map((e, i) => {
                    const colors: Record<string, string> = {
                      login: "text-green-600", signup: "text-blue-600",
                      logout: "text-gray-500", login_failed: "text-red-500",
                      password_reset: "text-orange-500", profile_update: "text-purple-500",
                    };
                    return (
                      <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${colors[e.event] ?? "text-gray-600"}`}>
                            {e.event.replace(/_/g, " ").toUpperCase()}
                          </span>
                          <span className="text-gray-400 text-xs">{e.ip_address}</span>
                        </div>
                        <span className="text-gray-400 text-xs">{fmtDate(e.created_at)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Settings ── */}
        {tab === "settings" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <h2 className="font-bold text-gray-800">Edit Profile</h2>
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              <div className="col-span-2"><label className={lbl}>Full Name</label>
                <input className={inp} value={editName} onChange={e => setEditName(e.target.value)} /></div>
              <div><label className={lbl}>Phone</label>
                <input className={inp} placeholder="+91 98765 43210" value={editPhone} onChange={e => setEditPhone(e.target.value)} /></div>
              <div><label className={lbl}>Country</label>
                <input className={inp} placeholder="e.g. India" value={editCountry} onChange={e => setEditCountry(e.target.value)} /></div>
              <div className="col-span-2"><label className={lbl}>Email (cannot change)</label>
                <input className={inp + " bg-gray-50 cursor-not-allowed"} value={u.email} disabled /></div>
            </div>
            {saveMsg && <p className="text-sm">{saveMsg}</p>}
            <button onClick={saveProfile} disabled={saving}
              className="bg-[#e8394d] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#d42a3e] disabled:opacity-50 transition-colors">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
