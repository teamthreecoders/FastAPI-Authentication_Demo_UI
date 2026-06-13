import { useNavigate } from "react-router-dom";

/* ─── Update these with your real URLs ─────── */
const AUTHOR = {
  name:     "Your Name",          // 🔧 Replace
  linkedin: "https://linkedin.com/in/your-profile", // 🔧 Replace
  github:   "https://github.com/your-username",     // 🔧 Replace
  initials: "YN",                  // 🔧 Replace
};

const FEATURES = [
  {
    icon: "🔐",
    title: "Secure Sessions",
    desc: "Bearer token auth with automatic expiry handling and server-side session invalidation on logout.",
    tag: "Auth",
  },
  {
    icon: "📩",
    title: "Two-Factor Auth",
    desc: "Login triggers a one-time code sent to your email. Enter it to complete verification — optional per user.",
    tag: "2FA",
  },
  {
    icon: "🔑",
    title: "Password Recovery",
    desc: "Forgot your password? Get a secure time-limited reset link delivered straight to your inbox.",
    tag: "Recovery",
  },
  {
    icon: "⚡",
    title: "Live API Playground",
    desc: "Test every endpoint directly in the browser — fill in fields, hit Send, and inspect the live JSON response.",
    tag: "DevTools",
  },
];

const STACK = [
  { label: "React 19",   color: "text-sky-400    border-sky-500/30    bg-sky-500/10"    },
  { label: "FastAPI",    color: "text-green-400  border-green-500/30  bg-green-500/10"  },
  { label: "Tailwind v4",color: "text-cyan-400   border-cyan-500/30   bg-cyan-500/10"   },
  { label: "Vite 8",     color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  { label: "Python",     color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" },
  { label: "JWT",        color: "text-orange-400 border-orange-500/30 bg-orange-500/10" },
];

/* ─── Social icon helpers ─────────────────── */
function LinkedInIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function GitHubIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

/* ─── Main page ───────────────────────────── */
export function Home({ onLogin, onSignup }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-1 bg-[#020817] overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-5 pt-20 pb-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, transparent 65%)" }} />
        </div>
        {/* Grid */}
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

        {/* Live badge */}
        <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold mb-7 fade-in-up">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Authentication Platform · Live Demo
        </div>

        {/* Headline */}
        <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 fade-in-up leading-[1.08] max-w-3xl"
          style={{ animationDelay: "0.05s" }}>
          Auth that's{" "}
          <span className="text-gradient">secure,</span>
          <br className="hidden sm:block" />
          {" "}fast, and simple.
        </h1>

        <p className="relative text-base sm:text-lg text-slate-400 max-w-xl mb-9 fade-in-up leading-relaxed"
          style={{ animationDelay: "0.1s" }}>
          A complete authentication system with OTP login, 2FA, password recovery,
          and a live API playground — built with React & FastAPI.
        </p>

        {/* CTAs */}
        <div className="relative flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto fade-in-up"
          style={{ animationDelay: "0.15s" }}>
          <button onClick={onSignup}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-all shadow-xl shadow-green-500/25 active:scale-[0.97]">
            Get Started →
          </button>
          <button onClick={onLogin}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-sm transition-all">
            Sign In
          </button>
          <button onClick={() => navigate("/api-playground")}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0c1929] hover:bg-[#0f2035] border border-[#1e3a58] hover:border-green-500/30 text-slate-400 hover:text-green-400 font-semibold text-sm transition-all">
            ⚡ Try Playground
          </button>
        </div>
      </section>

      {/* ── Author card ── */}
      <section className="px-5 pb-10 max-w-4xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 bg-[#0c1929] border border-[#1e3a58]/70 rounded-2xl shadow-xl fade-in-up"
          style={{ animationDelay: "0.2s" }}>
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-green-500/25 shrink-0">
            {AUTHOR.initials}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap mb-1">
              <h2 className="text-white font-bold text-lg">{AUTHOR.name}</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Designed and built this full-stack authentication platform — frontend in React, backend in FastAPI.
            </p>
            {/* Social links */}
            <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
              <a href={AUTHOR.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#050c18] border border-[#1e3a58] hover:border-blue-500/40 hover:bg-blue-500/5 text-slate-400 hover:text-blue-400 font-medium text-sm transition-all group">
                <LinkedInIcon size={16} />
                LinkedIn
              </a>
              <a href={AUTHOR.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#050c18] border border-[#1e3a58] hover:border-slate-400/40 hover:bg-white/5 text-slate-400 hover:text-white font-medium text-sm transition-all group">
                <GitHubIcon size={16} />
                GitHub
              </a>
              <a href="/api-docs"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#050c18] border border-[#1e3a58] hover:border-green-500/40 hover:bg-green-500/5 text-slate-400 hover:text-green-400 font-medium text-sm transition-all">
                📋 API Docs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-5 pb-12 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-white mb-2">What's included</h2>
          <p className="text-slate-500 text-sm">Everything you need for a production-ready auth system</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <div key={f.title}
              className="group flex gap-4 p-5 bg-[#0c1929]/80 border border-[#1e3a58]/60 rounded-2xl hover:border-green-500/30 hover:bg-[#0c1929] transition-all fade-in-up"
              style={{ animationDelay: `${0.25 + i * 0.06}s` }}>
              <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/15 flex items-center justify-center text-2xl group-hover:border-green-500/30 transition-all shrink-0">
                {f.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white text-sm">{f.title}</h3>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded">
                    {f.tag}
                  </span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech stack ── */}
      <section className="px-5 pb-16 max-w-4xl mx-auto w-full">
        <div className="p-5 bg-[#0c1929]/60 border border-[#1e3a58]/40 rounded-2xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 text-center">Built with</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {STACK.map(s => (
              <span key={s.label}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${s.color}`}>
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
