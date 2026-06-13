import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { apiMsg } from "../utils/apiHelpers";

/* ── Dummy data ───────────────────────────── */
const STATS = [
  { icon: "🔐", label: "Active Sessions", value: "1,248", change: "+12.5%", up: true },
  { icon: "📡", label: "API Calls Today",  value: "38.4K",  change: "+8.2%",  up: true },
  { icon: "👥", label: "Total Users",      value: "892",    change: "+3.1%",  up: true },
  { icon: "⚡", label: "Uptime",           value: "99.98%", change: "Stable", up: true },
];

const ACTIVITY = [
  { event: "User login",      method: "Email",  user: "ayan@example.com",  time: "2m ago",  ok: true  },
  { event: "2FA verified",    method: "OTP",    user: "rahul@example.com", time: "5m ago",  ok: true  },
  { event: "Password reset",  method: "Email",  user: "priya@example.com", time: "14m ago", ok: true  },
  { event: "Login attempt",   method: "Phone",  user: "—",                 time: "1h ago",  ok: false },
  { event: "New signup",      method: "Email",  user: "neha@example.com",  time: "3h ago",  ok: true  },
];

const SERVICES = [
  { name: "Auth Service",  latency: "12ms",  ok: true  },
  { name: "Database",      latency: "3ms",   ok: true  },
  { name: "Email Service", latency: "45ms",  ok: true  },
  { name: "Cache (Redis)", latency: "1ms",   ok: true  },
];

/* ── Sub-components ───────────────────────── */
function StatCard({ icon, label, value, change, up }) {
  return (
    <div className="bg-[#0c1929] border border-[#1e3a58]/60 rounded-2xl p-5 hover:border-green-500/20 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#050c18] border border-[#1e3a58] flex items-center justify-center text-lg group-hover:border-green-500/20 transition-all">
          {icon}
        </div>
        <span
          className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
            up ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          }`}
        >
          {change}
        </span>
      </div>
      <p className="text-2xl font-extrabold text-white tracking-tight mb-0.5">{value}</p>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function ActivityRow({ item, isLast }) {
  return (
    <div className={`flex items-center gap-4 py-3 ${!isLast ? "border-b border-[#1e3a58]/30" : ""}`}>
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${
          item.ok ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
        }`}
      >
        {item.ok ? "✓" : "✗"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 truncate">{item.event}</p>
        <p className="text-xs text-slate-500 truncate">{item.user}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#050c18] text-slate-500 border border-[#1e3a58]">
          {item.method}
        </span>
        <p className="text-[10px] text-slate-600 mt-1">{item.time}</p>
      </div>
    </div>
  );
}

function ServiceRow({ name, latency, ok }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#1e3a58]/30 last:border-0">
      <div className="flex items-center gap-2.5">
        <span className={`w-2 h-2 rounded-full ${ok ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" : "bg-red-400"}`} />
        <span className="text-sm text-slate-300 font-medium">{name}</span>
      </div>
      <span className="text-xs font-semibold text-slate-500 font-mono">{latency}</span>
    </div>
  );
}

/* ── Main page ────────────────────────────── */
export function Dashboard() {
  const navigate = useNavigate();
  const { user, fetchMe } = useAuth();
  const { addToast } = useToast();
  // Show skeleton only on first visit (no cached user).
  // Even with cached user we still verify the token — just silently.
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    let cancelled = false;
    async function verify() {
      const res = await fetchMe(); // always verify token on mount
      if (cancelled) return;
      setLoading(false);
      if (!res.success) {
        // clearSession() already called inside fetchMe — route guard redirects automatically
        addToast(apiMsg(res, "Session expired — please log in again"), "error");
        navigate("/");
      }
    }
    verify();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const firstName = user?.first_name || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#020817]">
        <div className="flex flex-col items-center gap-3">
          <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
          <p className="text-sm text-slate-500">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 bg-[#020817]">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 fade-in-up">

        {/* Page header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {greeting}, <span className="text-gradient">{firstName}</span> 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Here's what's happening with your authentication platform today.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {STATS.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Recent Activity — 2 cols */}
          <div className="lg:col-span-2 bg-[#0c1929] border border-[#1e3a58]/60 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e3a58]/40">
              <div>
                <h2 className="text-sm font-bold text-white">Recent Activity</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Last 5 authentication events</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                Live
              </span>
            </div>
            <div className="px-4 sm:px-6 py-2 overflow-x-auto">
              {ACTIVITY.map((item, i) => (
                <ActivityRow key={i} item={item} isLast={i === ACTIVITY.length - 1} />
              ))}
            </div>
          </div>

          {/* System Status — 1 col */}
          <div className="space-y-4">
            <div className="bg-[#0c1929] border border-[#1e3a58]/60 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1e3a58]/40">
                <h2 className="text-sm font-bold text-white">System Status</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">All services operational</p>
              </div>
              <div className="px-5 py-2">
                {SERVICES.map((s) => <ServiceRow key={s.name} {...s} />)}
              </div>
            </div>

            {/* Security stats */}
            <div className="bg-[#0c1929] border border-[#1e3a58]/60 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white mb-4">Security Overview</h2>
              {[
                { label: "Login success rate", value: 94, color: "bg-green-500" },
                { label: "2FA adoption",        value: 67, color: "bg-blue-400" },
                { label: "Session retention",   value: 81, color: "bg-emerald-400" },
              ].map((m) => (
                <div key={m.label} className="mb-3 last:mb-0">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-slate-400">{m.label}</span>
                    <span className="text-xs font-bold text-slate-300">{m.value}%</span>
                  </div>
                  <div className="h-1.5 bg-[#050c18] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${m.color}`}
                      style={{ width: `${m.value}%`, transition: "width 1s ease" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
