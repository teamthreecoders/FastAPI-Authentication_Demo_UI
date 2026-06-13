import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ENDPOINTS, PASSWORD_RULES, BASE_URL, REPO_URL,
  MethodBadge, CopyBtn, CodeBlock, Section, GitHubBtn, Sidebar,
  STATUS_CLS,
} from "./apiData";

function DocEndpointCard({ ep }) {
  const [open, setOpen] = useState(false);
  return (
    <div id={`doc-${ep.id}`} className="scroll-mt-24 bg-[#0c1929] border border-[#1e3a58]/60 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-white/[0.02] transition-colors text-left">
        <MethodBadge method={ep.method} />
        <code className="text-slate-200 text-sm font-semibold font-mono flex-1 truncate">{ep.path}</code>
        <span className="text-slate-400 text-sm font-medium hidden sm:block shrink-0">{ep.title}</span>
        {ep.auth && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-amber-500/10 text-amber-400 border-amber-500/25 shrink-0">
            AUTH
          </span>
        )}
        <span className="text-slate-600 text-xs shrink-0">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="border-t border-[#1e3a58]/40 p-6 space-y-4 fade-in-up">
          <p className="text-slate-400 text-sm leading-relaxed">{ep.desc}</p>

          {ep.headers.length > 0 && (
            <Section title="Request Headers">
              <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[400px]">
                <thead>
                  <tr className="border-b border-[#1e3a58]/40">
                    {["Header","Required","Notes"].map(h => (
                      <th key={h} className="text-left py-2 pr-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ep.headers.map(h => (
                    <tr key={h.name} className="border-b border-[#1e3a58]/20 last:border-0">
                      <td className="py-2.5 pr-4"><code className="text-green-400 text-xs font-mono">{h.name}</code></td>
                      <td className="py-2.5 pr-4"><span className="text-red-400 text-xs font-semibold">Yes</span></td>
                      <td className="py-2.5 text-slate-400 text-xs">{h.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </Section>
          )}

          {ep.bodyFields.length > 0 && (
            <Section title="Request Body">
              <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="border-b border-[#1e3a58]/40">
                    {["Field","Type","Required","Validation"].map(h => (
                      <th key={h} className="text-left py-2 pr-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ep.bodyFields.map(f => (
                    <tr key={f.name} className="border-b border-[#1e3a58]/20 last:border-0">
                      <td className="py-2.5 pr-4"><code className="text-green-400 text-xs font-mono">{f.name}</code></td>
                      <td className="py-2.5 pr-4"><span className="text-sky-400 text-xs font-mono">{f.type}</span></td>
                      <td className="py-2.5 pr-4">
                        <span className={`text-xs font-semibold ${f.req ? "text-red-400" : "text-slate-500"}`}>
                          {f.req ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-400 text-xs">{f.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </Section>
          )}

          {ep.bodyExample && (
            <Section title="Example Request">
              <CodeBlock code={ep.bodyExample} label="JSON Body" />
            </Section>
          )}

          <Section title={`Success Response — ${ep.successCode}`}>
            <CodeBlock code={ep.successExample} label={`${ep.successCode} OK`} />
          </Section>

          {ep.errors.length > 0 && (
            <Section title="Error Responses" defaultOpen={false}>
              <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[360px]">
                <thead>
                  <tr className="border-b border-[#1e3a58]/40">
                    {["Status","Issue","Message"].map(h => (
                      <th key={h} className="text-left py-2 pr-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ep.errors.map((e, i) => (
                    <tr key={i} className="border-b border-[#1e3a58]/20 last:border-0">
                      <td className="py-2.5 pr-4">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${STATUS_CLS(e.status)}`}>{e.status}</span>
                      </td>
                      <td className="py-2.5 pr-4 text-slate-400 text-xs font-mono">{e.issue}</td>
                      <td className="py-2.5 text-slate-400 text-xs">{e.msg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

export function ApiDocs() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); }),
      { rootMargin: "-20% 0px -70% 0px" }
    );
    ENDPOINTS.forEach(ep => {
      const el = document.getElementById(`doc-${ep.id}`);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="flex flex-1 bg-[#020817] min-h-0">
      <Sidebar prefix="doc-" activeId={activeId} />

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xl shrink-0">📋</div>
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">API Documentation</h1>
                <p className="text-slate-500 text-sm mt-0.5">Complete reference for all endpoints</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <GitHubBtn />
              <button onClick={() => navigate("/api-playground")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-all shadow-lg shadow-green-500/20">
                <span>⚡</span> Try Playground →
              </button>
            </div>
          </div>

          <div className="space-y-10">
            {/* Overview */}
            <div>
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-green-500 inline-block" /> Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Base URL",     value: BASE_URL,            mono: true },
                  { label: "Content-Type", value: "application/json",  mono: true },
                  { label: "Endpoints",    value: `${ENDPOINTS.length} total`, mono: false },
                ].map(item => (
                  <div key={item.label} className="bg-[#0c1929] border border-[#1e3a58]/60 rounded-xl p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{item.label}</p>
                    <p className={`text-sm font-semibold text-slate-200 break-all ${item.mono ? "font-mono" : ""}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Response shape */}
            <div>
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-green-500 inline-block" /> Universal Response Shape
              </h2>
              <p className="text-slate-400 text-sm mb-3">Every response — success or error — follows the same envelope:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CodeBlock label="✓ Success" code={`{
  "msg": "Human-readable message",
  "success": true,
  "code": 200,
  "error": null,
  "data": { ... }
}`} />
                <CodeBlock label="✗ Error" code={`{
  "msg": "Human-readable error",
  "success": false,
  "code": 422,
  "error": {
    "issue": "Validation Failed",
    "details": [
      { "type": "missing",
        "loc": ["body", "email"],
        "msg": "Field required" }
    ]
  },
  "data": null
}`} />
              </div>
            </div>

            {/* Password rules */}
            <div>
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-green-500 inline-block" /> Password Rules
              </h2>
              <p className="text-slate-400 text-sm mb-3">
                Applied to{" "}
                <code className="text-green-400 text-xs bg-green-500/10 px-1.5 py-0.5 rounded">password</code> and{" "}
                <code className="text-green-400 text-xs bg-green-500/10 px-1.5 py-0.5 rounded">new_password</code>.
              </p>
              <div className="bg-[#0c1929] border border-[#1e3a58]/60 rounded-xl overflow-hidden">
                {PASSWORD_RULES.map((r, i) => (
                  <div key={r.rule} className={`flex items-center gap-4 px-5 py-3 ${i < PASSWORD_RULES.length - 1 ? "border-b border-[#1e3a58]/30" : ""}`}>
                    <span className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center text-green-400 text-[9px] font-bold shrink-0">✓</span>
                    <span className="text-sm text-slate-300 w-28 shrink-0 font-medium">{r.rule}</span>
                    <span className="text-sm text-slate-500">{r.req}</span>
                  </div>
                ))}
                <div className="px-5 py-3 bg-green-500/5 border-t border-green-500/15 flex items-center gap-2">
                  <span className="text-xs text-green-400/70">Example:</span>
                  <code className="text-xs text-green-400 font-mono bg-green-500/10 px-2 py-0.5 rounded">MyPass@1</code>
                </div>
              </div>
            </div>

            {/* Token reference */}
            <div>
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-green-500 inline-block" /> Token Reference
              </h2>
              <div className="bg-[#0c1929] border border-[#1e3a58]/60 rounded-xl overflow-hidden">
                {[
                  { name: "LOGIN_SESSION",  via: "Login / 2FA Verify — response body", usedBy: "/me, logout",           how: "Authorization: Bearer <token>" },
                  { name: "LOGIN_2FA_OTP",  via: "Login response — challenge_token",   usedBy: "2FA Verify endpoint",   how: "Sent in request body" },
                  { name: "SIGN_UP",        via: "Email link — query param",           usedBy: "Set Password endpoint", how: "Authorization: Bearer <token>" },
                  { name: "PASSWORD_RESET", via: "Email link — query param",           usedBy: "Reset Password",        how: "Authorization: Bearer <token>" },
                ].map((t, i, arr) => (
                  <div key={t.name} className={`px-5 py-3.5 ${i < arr.length - 1 ? "border-b border-[#1e3a58]/30" : ""}`}>
                    <div className="flex items-start gap-3 flex-wrap">
                      <code className="text-amber-400 text-xs font-mono bg-amber-500/10 px-2 py-0.5 rounded shrink-0 mt-0.5">{t.name}</code>
                      <div className="flex flex-col gap-0.5 text-xs text-slate-500 min-w-0">
                        <span><span className="text-slate-600">Delivered via:</span> {t.via}</span>
                        <span><span className="text-slate-600">Used by:</span> {t.usedBy}</span>
                        <span><span className="text-slate-600">How:</span> <code className="text-green-400/80 font-mono">{t.how}</code></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Endpoints */}
            <div>
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-green-500 inline-block" /> Endpoints
              </h2>
              <div className="space-y-3">
                {ENDPOINTS.map(ep => <DocEndpointCard key={ep.id} ep={ep} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
