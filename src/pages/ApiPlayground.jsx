import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ENDPOINTS, SERVERS, MethodBadge, GitHubBtn, Sidebar, STATUS_CLS,
} from "./apiData";

/* ── Form primitives ──────────────────────── */
function Input({ label, value, onChange, placeholder, type = "text", mono, note }) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</label>}
      <div className="flex gap-2">
        <input type={isPw && !show ? "password" : "text"} value={value} onChange={onChange} placeholder={placeholder}
          className={`flex-1 bg-[#050c18] border border-[#1e3a58] rounded-xl px-3 py-2.5 text-sm text-slate-100 outline-none
            focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.1)] transition-all placeholder:text-slate-700
            ${mono ? "font-mono" : ""}`} />
        {isPw && (
          <button type="button" onClick={() => setShow(v => !v)}
            className="px-3 rounded-xl bg-[#0c1929] border border-[#1e3a58] text-slate-500 hover:text-green-400 transition-all text-xs">
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {note && <p className="text-[10px] text-slate-600">{note}</p>}
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</label>}
      <select value={value} onChange={onChange}
        className="w-full bg-[#050c18] border border-[#1e3a58] rounded-xl px-3 py-2.5 text-slate-100 text-sm outline-none focus:border-green-500 transition-all">
        {options.map(o => <option key={o} value={o} className="bg-[#0c1929]">{o}</option>)}
      </select>
    </div>
  );
}

function CredTabs({ onChange }) {
  const [type, setType] = useState("email");
  const [val, setVal] = useState("");
  const [cc, setCc] = useState("+91");
  useEffect(() => {
    if (type === "email")       onChange({ email: val });
    else if (type === "phone")  onChange({ country_cd: cc, phone: val });
    else                        onChange({ user_id: val });
  }, [type, val, cc]);
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Credential</label>
      <div className="flex gap-1 p-1 bg-[#050c18] rounded-xl border border-[#1e3a58]">
        {["email","phone","user_id"].map(t => (
          <button key={t} type="button" onClick={() => { setType(t); setVal(""); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${type === t ? "bg-green-500/20 text-green-400" : "text-slate-500 hover:text-slate-300"}`}>
            {t === "user_id" ? "User ID" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {type === "phone" ? (
        <div className="flex gap-2">
          <input value={cc} onChange={e => setCc(e.target.value)} placeholder="+91"
            className="w-20 bg-[#050c18] border border-[#1e3a58] rounded-xl px-3 py-2.5 text-slate-100 text-sm outline-none focus:border-green-500 transition-all" />
          <input value={val} onChange={e => setVal(e.target.value)} placeholder="9876543210"
            className="flex-1 bg-[#050c18] border border-[#1e3a58] rounded-xl px-3 py-2.5 text-slate-100 text-sm outline-none focus:border-green-500 transition-all placeholder:text-slate-700" />
        </div>
      ) : (
        <input value={val} onChange={e => setVal(e.target.value)}
          placeholder={type === "email" ? "ayan@example.com" : "AY12345678"}
          className="w-full bg-[#050c18] border border-[#1e3a58] rounded-xl px-3 py-2.5 text-slate-100 text-sm outline-none focus:border-green-500 transition-all placeholder:text-slate-700" />
      )}
    </div>
  );
}

/* ── JSON response viewer ─────────────────── */
function JsonView({ json }) {
  const html = json
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"([^"]+)"(\s*:)/g,'<span style="color:#4ade80">"$1"</span>$2')
    .replace(/:\s*"([^"]*)"/g,': <span style="color:#93c5fd">"$1"</span>')
    .replace(/:\s*(-?\d+\.?\d*)/g,': <span style="color:#fbbf24">$1</span>')
    .replace(/:\s*(true|false)/g,': <span style="color:#f472b6">$1</span>')
    .replace(/:\s*null/g,': <span style="color:#94a3b8">null</span>');
  return <pre className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap break-all" dangerouslySetInnerHTML={{ __html: html }} />;
}

function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); }}
      className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-500 hover:text-green-400 transition-all border border-white/5 shrink-0">
      {ok ? "✓ Copied" : "Copy"}
    </button>
  );
}

function ResponseBox({ result, loading }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!loading) { setElapsed(0); return; }
    const start = Date.now();
    const id = setInterval(() => setElapsed(Date.now() - start), 100);
    return () => clearInterval(id);
  }, [loading]);

  const fmtMs = ms => ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;

  if (loading) return (
    <div className="flex flex-col h-full min-h-44 overflow-hidden">
      {/* sweeping progress bar */}
      <div className="h-[2px] w-full progress-sweep shrink-0" />
      <div className="p-5 space-y-4 flex-1">
        {/* status bar skeleton */}
        <div className="flex items-center gap-2">
          <div className="skeleton h-5 w-10 rounded-lg" />
          <div className="skeleton h-3 w-14" />
          <div className="skeleton h-3 w-6" />
          <div className="skeleton h-3 w-16" />
          <div className="ml-auto skeleton h-5 w-10 rounded-lg" />
        </div>
        {/* json body skeleton — varied widths feel like real content */}
        <div className="space-y-2.5 pt-1">
          {[55, 80, 65, 90, 45, 70, 38].map((w, i) => (
            <div key={i} className="skeleton h-[11px]" style={{ width: `${w}%`, animationDelay: `${i * 60}ms` }} />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between px-5 pb-4">
        <p className="text-[10px] text-slate-600 tracking-wide">Fetching response…</p>
        <span className="text-[11px] font-mono text-slate-500 tabular-nums">{fmtMs(elapsed)}</span>
      </div>
    </div>
  );
  if (!result) return (
    <div className="flex flex-col items-center justify-center h-full min-h-40 text-center px-4">
      <div className="w-10 h-10 rounded-xl bg-[#0a1628] border border-[#1e3a58]/50 flex items-center justify-center text-slate-700 mb-2 text-lg">▶</div>
      <p className="text-slate-600 text-xs">Hit <span className="text-slate-500 font-semibold">Send</span> to see the response</p>
    </div>
  );
  if (result.error) return (
    <div className="p-4 space-y-2">
      <span className="text-xs font-bold px-2.5 py-1 rounded-lg border bg-red-500/15 text-red-400 border-red-500/30">Network Error</span>
      <p className="text-red-400/70 text-xs font-mono">{result.error}</p>
    </div>
  );
  const str = JSON.stringify(result.body, null, 2);
  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1e3a58]/40 bg-[#0a1628] flex-wrap gap-y-1">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${STATUS_CLS(result.status)}`}>{result.status}</span>
        <span className="text-[10px] text-slate-500 font-mono">{result.elapsed}ms</span>
        <span className="text-[10px] text-slate-600">·</span>
        <span className="text-[10px] text-slate-500">{result.body?.success ? "✓ success" : "✗ error"}</span>
        <div className="ml-auto"><CopyBtn text={str} /></div>
      </div>
      <div className="p-4 overflow-auto max-h-72"><JsonView json={str} /></div>
    </div>
  );
}

function SendBtn({ loading, onClick, method }) {
  return (
    <button onClick={onClick} disabled={loading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${
        method === "DELETE"
          ? "bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30"
          : "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
      }`}>
      {loading ? <><span className="spinner" style={{ width:14,height:14,borderWidth:2 }} />Sending…</> : <><span>▶</span>Send</>}
    </button>
  );
}

function InfoBadge({ text }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-green-500/8 border border-green-500/20 rounded-xl">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
      <p className="text-green-400/80 text-xs">{text}</p>
    </div>
  );
}

/* ── Endpoint card ────────────────────────── */
/* ── cURL builder ─────────────────────────── */
function buildCurl(ep, baseUrl, authToken, form, cred, challengeToken) {
  const url = `${baseUrl}${ep.path}`;
  const lines = [`curl -X ${ep.method} '${url}'`];

  lines.push(`  -H 'Accept: application/json'`);

  if (ep.id !== "health" && ep.id !== "logout") {
    lines.push(`  -H 'Content-Type: application/json'`);
  }

  if (authToken && (ep.auth || ep.id === "me")) {
    const short = authToken.length > 30 ? `${authToken.slice(0, 20)}…` : authToken;
    lines.push(`  -H 'Authorization: Bearer ${short}'`);
  }

  // Body
  let body = null;
  if (ep.id === "signup") {
    body = {
      first_name: form.first_name || "",
      last_name:  form.last_name  || "",
      email:      form.email      || "",
      phone:      form.phone      || "",
      country_cd: form.country_cd || "+91",
      role_type:  form.role_type  || "user",
    };
  } else if (ep.id === "login") {
    body = { credential: cred, password: form.password || "" };
  } else if (ep.id === "verify-2fa") {
    body = { challenge_token: form.challenge || challengeToken || "", otp: form.otp || "" };
  } else if (ep.id === "forgot-password") {
    body = { credential: cred };
  }

  if (body) {
    lines.push(`  -d '${JSON.stringify(body)}'`);
  }

  return lines.join(" \\\n");
}

function CurlBlock({ curl }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className="rounded-xl overflow-hidden border border-[#1e3a58]/50">
      <div className="flex items-center justify-between px-4 py-2 bg-[#050c18] border-b border-[#1e3a58]/40">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">cURL</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
          <span className="text-[10px] text-slate-600">Raw request</span>
        </div>
        <button onClick={copy}
          className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-500 hover:text-green-400 transition-all border border-white/5">
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="bg-[#030a14] px-4 py-3.5 text-xs text-slate-300 overflow-x-auto leading-relaxed font-mono whitespace-pre">
        <span style={{ color: "#94a3b8" }}>$ </span>{curl}
      </pre>
    </div>
  );
}

async function doFetch(url, opts, onResult, setLoading) {
  setLoading(true);
  const t = Date.now();
  try {
    const res = await fetch(url, opts);
    onResult({ status: res.status, elapsed: Date.now() - t, body: await res.json() });
  } catch (e) { onResult({ status: 0, elapsed: 0, error: e.message }); }
  setLoading(false);
}

function PlayEndpoint({ ep, baseUrl, authToken, challengeToken, onToken, onChallenge, onClear }) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const [cred, setCred] = useState({ email: "" });
  const s = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  async function send() {
    const url = `${baseUrl}${ep.path}`;
    const headers = { "Content-Type": "application/json", ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) };
    let opts;
    if (ep.id === "health")           { opts = { method:"GET" }; }
    else if (ep.id === "signup")      { opts = { method:"POST", headers, body: JSON.stringify({ first_name: form.first_name||"", last_name: form.last_name||"", email: form.email||"", phone: form.phone||"", country_cd: form.country_cd||"+91", role_type: form.role_type||"user" }) }; }
    else if (ep.id === "login")       { opts = { method:"POST", credentials:"include", headers, body: JSON.stringify({ credential: cred, password: form.password||"" }) }; }
    else if (ep.id === "verify-2fa")  { opts = { method:"POST", credentials:"include", headers, body: JSON.stringify({ challenge_token: form.challenge||challengeToken||"", otp: form.otp||"" }) }; }
    else if (ep.id === "forgot-password") { opts = { method:"POST", headers, body: JSON.stringify({ credential: cred }) }; }
    else if (ep.id === "me")          { opts = { method:"POST", credentials:"include", headers }; }
    else if (ep.id === "logout")      { opts = { method:"DELETE", credentials:"include" }; }

    await doFetch(url, opts, r => {
      setResult(r);
      if (r.body?.success) {
        if (r.body.data?.token)           onToken(r.body.data.token);
        if (r.body.data?.challenge_token) onChallenge(r.body.data.challenge_token);
        if (ep.id === "logout")           onClear();
      }
    }, setLoading);
  }

  const renderForm = () => {
    if (ep.id === "health")  return <p className="text-slate-500 text-xs">No parameters required.</p>;
    if (ep.id === "logout")  return <p className="text-slate-500 text-xs">No request body. Clears the server session.</p>;
    if (ep.id === "signup")  return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input label="First Name" value={form.first_name||""} onChange={s("first_name")} placeholder="Ayan" />
          <Input label="Last Name"  value={form.last_name||""}  onChange={s("last_name")}  placeholder="Pradhan" />
        </div>
        <Input label="Email"   value={form.email||""}       onChange={s("email")}       placeholder="ayan@example.com" />
        <div className="grid grid-cols-[80px_1fr] gap-3">
          <Input label="Code"  value={form.country_cd||"+91"} onChange={s("country_cd")} placeholder="+91" />
          <Input label="Phone" value={form.phone||""}         onChange={s("phone")}       placeholder="9876543210" />
        </div>
        <Select label="Role" value={form.role_type||"user"} onChange={s("role_type")} options={["user","admin","guest","other"]} />
      </div>
    );
    if (ep.id === "login") return (
      <div className="space-y-3">
        <CredTabs onChange={setCred} />
        <Input label="Password" type="password" value={form.password||""} onChange={s("password")} placeholder="MyPass@1" />
      </div>
    );
    if (ep.id === "verify-2fa") return (
      <div className="space-y-3">
        {challengeToken && <InfoBadge text="Challenge token auto-filled from login" />}
        <Input label="Challenge Token" value={form.challenge||challengeToken||""} onChange={s("challenge")} placeholder="Paste challenge token" mono note="Auto-filled after login with 2FA" />
        <Input label="OTP (4 digits)"  value={form.otp||""} onChange={e => setForm(p => ({ ...p, otp: e.target.value.replace(/\D/,"").slice(0,4) }))} placeholder="4829" />
      </div>
    );
    if (ep.id === "forgot-password") return <CredTabs onChange={setCred} />;
    if (ep.id === "me") return (
      <div className="space-y-3">
        {authToken && <InfoBadge text="Session token auto-filled from login" />}
        <Input label="Authorization Token" value={authToken||""} onChange={() => {}} placeholder="Login first to auto-fill" mono note="Read-only — set automatically after login" />
      </div>
    );
  };

  return (
    <div id={`play-${ep.id}`} className="scroll-mt-24 bg-[#0c1929] border border-[#1e3a58]/60 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors text-left">
        <MethodBadge method={ep.method} />
        <code className="text-slate-200 text-sm font-semibold font-mono flex-1 truncate">{ep.path}</code>
        <span className="text-slate-400 text-sm font-medium hidden sm:block shrink-0">{ep.title}</span>
        {ep.auth && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-amber-500/10 text-amber-400 border-amber-500/25 shrink-0">AUTH</span>}
        {result && <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_CLS(result.status)}`}>{result.status}</span>}
        <span className="text-slate-600 text-xs shrink-0">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="border-t border-[#1e3a58]/40 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#1e3a58]/40 fade-in-up">
          <div className="p-5 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Request</p>
            {renderForm()}
            <CurlBlock curl={buildCurl(ep, baseUrl, authToken, form, cred, challengeToken)} />
            <SendBtn loading={loading} onClick={send} method={ep.method} />
          </div>
          <div className="min-h-44 flex flex-col">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-5 pt-4 pb-2">Response</p>
            <ResponseBox result={result} loading={loading} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main page ────────────────────────────── */
export function ApiPlayground() {
  const navigate = useNavigate();
  const [baseUrl, setBaseUrl] = useState(SERVERS[0].url);
  const [authToken, setAuthToken] = useState("");
  const [challengeToken, setChallengeToken] = useState("");
  const [tokenSaved, setTokenSaved] = useState(false);
  const [activeId, setActiveId] = useState("");

  function handleToken(t) {
    setAuthToken(t);
    setTokenSaved(true);
    setTimeout(() => setTokenSaved(false), 3000);
  }

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); }),
      { rootMargin: "-20% 0px -70% 0px" }
    );
    ENDPOINTS.forEach(ep => {
      const el = document.getElementById(`play-${ep.id}`);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="flex flex-1 bg-[#020817] min-h-0">
      <Sidebar prefix="play-" activeId={activeId} />

      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xl shrink-0">⚡</div>
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">API Playground</h1>
                <p className="text-slate-500 text-sm mt-0.5">Send live requests and inspect responses</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <GitHubBtn />
              <button onClick={() => navigate("/api-docs")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0c1929] border border-[#1e3a58]/60 hover:border-green-500/30 text-slate-400 hover:text-green-400 font-semibold text-sm transition-all">
                <span>📋</span> View Docs
              </button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-500/8 border border-amber-500/20 rounded-2xl mb-5">
            <span className="text-amber-400 text-lg shrink-0 mt-0.5">⚠️</span>
            <div>
              <p className="text-amber-300 text-sm font-semibold mb-0.5">Demo environment — for experience only</p>
              <p className="text-amber-300/60 text-xs leading-relaxed">
                Please do <span className="font-semibold text-amber-300/80">not</span> enter real passwords, personal details, or sensitive information.
                Use fake data to explore the API. This is purely for learning and fun. 🎉
              </p>
            </div>
          </div>

          {/* Server + session bar */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 p-4 bg-[#0c1929] border border-[#1e3a58]/60 rounded-2xl mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Server</p>
              <div className="flex gap-1.5">
                {SERVERS.map(sv => (
                  <button key={sv.url} onClick={() => setBaseUrl(sv.url)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      baseUrl === sv.url
                        ? "bg-green-500/15 text-green-400 border-green-500/30"
                        : "bg-[#050c18] text-slate-500 border-[#1e3a58] hover:text-slate-300"
                    }`}>{sv.label}</button>
                ))}
              </div>
            </div>
            <div className="h-8 w-px bg-[#1e3a58] hidden sm:block" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Base URL</p>
              <code className="text-xs text-slate-400 font-mono truncate block">{baseUrl}</code>
            </div>
            <div className="h-8 w-px bg-[#1e3a58] hidden sm:block" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Session</p>
              {authToken ? (
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1.5 text-xs font-semibold ${tokenSaved ? "text-green-300" : "text-green-400"}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    {tokenSaved ? "Token saved!" : "Active"}
                  </span>
                  <button onClick={() => { setAuthToken(""); setChallengeToken(""); }}
                    className="text-[10px] text-red-400/60 hover:text-red-400 transition-colors border border-red-500/20 px-2 py-0.5 rounded-lg">
                    Clear
                  </button>
                </div>
              ) : (
                <span className="text-xs text-slate-600">None — login first</span>
              )}
            </div>
          </div>

          {/* Endpoint cards */}
          <div className="space-y-3">
            {ENDPOINTS.map(ep => (
              <PlayEndpoint key={ep.id} ep={ep} baseUrl={baseUrl} authToken={authToken}
                challengeToken={challengeToken} onToken={handleToken}
                onChallenge={setChallengeToken}
                onClear={() => { setAuthToken(""); setChallengeToken(""); }} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
