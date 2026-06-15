import { useState, useEffect } from "react";

/* ── Config ───────────────────────────────── */
export const REPO_URL = "https://github.com/teamthreecoders/AUTHENTICATION_API"; 
export const SERVERS = [
  { label: "Production", url: "https://authentication-api-zeta.vercel.app" },
  { label: "Local",      url: "http://127.0.0.1:8000" },
];
export const BASE_URL = "https://authentication-api-zeta.vercel.app";

/* ── Style maps ───────────────────────────── */
export const METHOD_CLS = {
  GET:    "bg-sky-500/15 text-sky-400 border-sky-500/30",
  POST:   "bg-green-500/15 text-green-400 border-green-500/30",
  DELETE: "bg-red-500/15 text-red-400 border-red-500/30",
};
export const STATUS_CLS = (s) =>
  s < 300 ? "bg-green-500/15 text-green-400 border-green-500/30" :
  s < 500 ? "bg-red-500/15 text-red-400 border-red-500/30" :
            "bg-orange-500/15 text-orange-400 border-orange-500/30";

/* ── API data ─────────────────────────────── */
export const ENDPOINTS = [
  {
    id: "health", method: "GET", path: "/health", title: "Health Check", auth: false,
    desc: "Utility endpoint to verify the API is running. No authentication required.",
    headers: [], bodyFields: [], bodyExample: null,
    successCode: 200,
    successExample: `{ "greet": "welcome to authentication" }`,
    errors: [],
  },
  {
    id: "signup", method: "POST", path: "/v1/auth/signup", title: "Sign Up", auth: false,
    desc: "Register a new user. Sends a verification email with a set-password link. Account is inactive until password is set.",
    headers: [],
    bodyFields: [
      { name: "first_name", type: "string", req: true,  note: "Min 3 characters" },
      { name: "last_name",  type: "string", req: true,  note: "Min 3 characters" },
      { name: "email",      type: "string", req: true,  note: 'Must contain "@"' },
      { name: "phone",      type: "string", req: true,  note: "Exactly 10 digits" },
      { name: "country_cd", type: "string", req: false, note: 'Default "+91". Pattern: +\\d{2}' },
      { name: "role_type",  type: "string", req: false, note: '"user" | "admin" | "guest" | "other". Default "user"' },
    ],
    bodyExample: `{
  "first_name": "Ayan",
  "last_name": "Pradhan",
  "email": "ayan@example.com",
  "phone": "9876543210",
  "country_cd": "+91",
  "role_type": "user"
}`,
    successCode: 201,
    successExample: `{
  "msg": "Verification email sent. Please verify your email and set your password.",
  "success": true,
  "code": 201,
  "error": null,
  "data": {
    "email": "ayan@example.com",
    "email_verification_required": true
  }
}`,
    errors: [
      { status: 409, issue: "Conflict",          msg: "User EmailId or PhoneNo already registered." },
      { status: 422, issue: "Validation Failed", msg: "Request payload error" },
      { status: 500, issue: "Server Not Found",  msg: "Internal Server Error" },
    ],
  },
  {
    id: "login", method: "POST", path: "/v1/auth/otp/login", title: "Login", auth: false,
    desc: "Login with credential + password. Returns a session token (2FA off) or sends an OTP email and returns a challenge token (2FA on).",
    headers: [],
    bodyFields: [
      { name: "credential", type: "object", req: true, note: "{ email } OR { country_cd, phone } OR { user_id }" },
      { name: "password",   type: "string", req: true, note: "Must satisfy all password rules" },
    ],
    bodyExample: `// By email
{
  "credential": { "email": "ayan@example.com" },
  "password": "MyPass@1"
}`,
    successCode: 200,
    successExample: `// 2FA disabled — login complete
{ "msg": "Login Successful", "success": true, "code": 200, "error": null,
  "data": { "token": "<session_token>" } }

// 2FA enabled — OTP sent to email
{ "msg": "OTP send successful", "success": true, "code": 200, "error": null,
  "data": { "mode": "otp", "challenge_token": "<challenge_token>" } }`,
    errors: [
      { status: 401, issue: "Unauthorized",     msg: "Invalid login credential" },
      { status: 404, issue: "Not Found",        msg: "User Not Found" },
      { status: 422, issue: "Validation Failed",msg: "Request payload error" },
      { status: 500, issue: "Server Not Found", msg: "Internal Server Error" },
    ],
  },
  {
    id: "verify-2fa", method: "POST", path: "/v1/auth/otp/login/2fa_verify", title: "Verify 2FA OTP", auth: false,
    desc: "Complete 2FA login by submitting the OTP from email along with the challenge token from login. OTP expires in 15 minutes.",
    headers: [],
    bodyFields: [
      { name: "challenge_token", type: "string", req: true, note: "data.challenge_token from login response" },
      { name: "otp",             type: "string", req: true, note: "4-digit code from email. Expires in 15 min" },
    ],
    bodyExample: `{
  "challenge_token": "<challenge_token from login>",
  "otp": "4829"
}`,
    successCode: 200,
    successExample: `{
  "msg": "Login Successful",
  "success": true,
  "code": 200,
  "error": null,
  "data": { "token": "<session_token>" }
}`,
    errors: [
      { status: 401, issue: "Unauthorized",    msg: "Invalid OTP" },
      { status: 401, issue: "Unauthorized",    msg: "OTP expired" },
      { status: 500, issue: "Server Not Found",msg: "Internal Server Error" },
    ],
  },
  {
    id: "forgot-password", method: "POST", path: "/v1/auth/forgot-password", title: "Forgot Password", auth: false,
    desc: "Initiate password reset. Sends a reset link to the registered email. Always returns 202 to prevent email enumeration.",
    headers: [],
    bodyFields: [
      { name: "credential", type: "object", req: true, note: "{ email } OR { country_cd, phone } OR { user_id }" },
    ],
    bodyExample: `{ "credential": { "email": "ayan@example.com" } }`,
    successCode: 202,
    successExample: `{
  "msg": "If an account exists for this email, a password reset link has been sent.",
  "success": true,
  "code": 202,
  "error": null,
  "data": { "email": "ayan@example.com" }
}`,
    errors: [
      { status: 404, issue: "Not Found",        msg: "User Not Found" },
      { status: 422, issue: "Validation Failed",msg: "Request payload error" },
      { status: 500, issue: "Server Not Found", msg: "Internal Server Error" },
    ],
  },
  {
    id: "me", method: "POST", path: "/v1/auth/me", title: "Get Profile", auth: true,
    desc: "Fetch the currently authenticated user's profile. Requires a valid session token in the Authorization header.",
    headers: [
      { name: "Authorization", req: true, note: "Bearer <session token from login>" },
    ],
    bodyFields: [],
    bodyExample: null,
    successCode: 200,
    successExample: `{
  "msg": "Authenticated",
  "success": true,
  "code": 200,
  "error": null,
  "data": {
    "user_id": "AY12345678",
    "first_name": "Ayan",
    "last_name": "Pradhan",
    "full_name": "Ayan Pradhan",
    "email": "ayan@example.com",
    "phone": "9876543210",
    "country_cd": "+91",
    "role_type": "user",
    "is_active": true,
    "is_2fa_enabled": false
  }
}`,
    errors: [
      { status: 401, issue: "Unauthorized",    msg: "Invalid token" },
      { status: 401, issue: "Unauthorized",    msg: "Token expired" },
      { status: 404, issue: "Not Found",       msg: "User Not Found" },
      { status: 500, issue: "Server Not Found",msg: "Internal Server Error" },
    ],
  },
  {
    id: "logout", method: "DELETE", path: "/v1/auth/logout", title: "Logout", auth: false,
    desc: "Log out the current user. Clears the server-side session cookie. No request body required.",
    headers: [], bodyFields: [], bodyExample: null,
    successCode: 200,
    successExample: `{
  "msg": "Log Out successful",
  "success": true,
  "code": 202,
  "error": null,
  "data": null
}`,
    errors: [],
  },
];

export const PASSWORD_RULES = [
  { rule: "Min length",   req: "8 characters" },
  { rule: "Spaces",       req: "Not allowed" },
  { rule: "Special char", req: "At least one — e.g. ! @ # $ % ^ & *" },
  { rule: "Digit",        req: "At least one (0–9)" },
  { rule: "Uppercase",    req: "At least one (A–Z)" },
  { rule: "Lowercase",    req: "At least one (a–z)" },
];

/* ── Shared UI components ─────────────────── */
export function MethodBadge({ method, small }) {
  return (
    <span className={`${small ? "text-[9px] px-1.5 py-0.5" : "text-xs px-2.5 py-0.5"} rounded-md font-bold border uppercase tracking-wider ${METHOD_CLS[method]}`}>
      {method}
    </span>
  );
}

export function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); }}
      className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-500 hover:text-green-400 transition-all border border-white/5 shrink-0">
      {ok ? "✓ Copied" : "Copy"}
    </button>
  );
}

export function CodeBlock({ code, label }) {
  return (
    <div className="rounded-xl overflow-hidden border border-[#1e3a58]/60">
      <div className="flex items-center justify-between px-4 py-2 bg-[#050c18] border-b border-[#1e3a58]/40">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
        <CopyBtn text={code} />
      </div>
      <pre className="bg-[#030a14] px-4 py-4 text-xs text-slate-300 overflow-x-auto leading-relaxed font-mono">{code}</pre>
    </div>
  );
}

export function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#1e3a58]/50 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3 bg-[#0a1628] hover:bg-[#0c1929] transition-colors text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</span>
        <span className="text-slate-600 text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="px-5 py-4 bg-[#050c18]">{children}</div>}
    </div>
  );
}

export function GitHubBtn() {
  return (
    <a href={REPO_URL} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0c1929] border border-[#1e3a58]/60 hover:border-green-500/30 hover:bg-green-500/5 transition-all group">
      <svg className="w-4 h-4 text-slate-500 group-hover:text-green-400 transition-colors shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
      <span className="text-sm font-semibold text-slate-400 group-hover:text-green-400 transition-colors">GitHub Repo</span>
    </a>
  );
}

export function Sidebar({ prefix, activeId }) {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return (
    <aside className="hidden lg:flex flex-col w-52 shrink-0 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto border-r border-[#1e3a58]/40 py-5">
      <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3">Endpoints</p>
      <nav className="flex flex-col gap-0.5 px-2">
        {ENDPOINTS.map(ep => (
          <button key={ep.id} onClick={() => scrollTo(`${prefix}${ep.id}`)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs transition-all ${
              activeId === `${prefix}${ep.id}`
                ? "bg-green-500/10 text-green-400 font-semibold"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}>
            <MethodBadge method={ep.method} small />
            <span className="truncate">{ep.title}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto mx-3 pt-4 border-t border-[#1e3a58]/40">
        <GitHubBtn />
      </div>
    </aside>
  );
}
