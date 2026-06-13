import { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider, useToast } from "./context/ToastContext";
import { Modal } from "./components/Modal";
import { LoginForm } from "./pages/Login";
import { SignUpForm } from "./pages/SignUp";
import { ForgotPasswordForm } from "./pages/ForgotPassword";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { MyProfile } from "./pages/MyProfile";
import { OtpVerify } from "./pages/OtpVerify";
import { ApiDocs } from "./pages/ApiDocs";
import { ApiPlayground } from "./pages/ApiPlayground";
import "./App.css";

/* ── Profile dropdown ─────────────────────── */
function ProfileDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initials =
    `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase() || "?";
  const fullName =
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || user?.full_name || "User";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-green-500/20 flex-shrink-0">
          {initials}
        </div>
        <span className="text-sm text-slate-300 font-medium hidden sm:block">
          {user?.first_name || "Profile"}
        </span>
        <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2.5 w-56 bg-[#0c1929] border border-[#1e3a58] rounded-2xl shadow-2xl overflow-hidden fade-in-down z-40">
          <div className="px-4 py-3.5 border-b border-[#1e3a58]/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{fullName}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="p-1.5">
            <button onClick={() => { navigate("/my-profile"); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all font-medium">
              <span className="w-7 h-7 rounded-lg bg-[#050c18] border border-[#1e3a58] flex items-center justify-center text-xs flex-shrink-0">👤</span>
              View Profile
            </button>
            <button onClick={() => { onLogout(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-medium mt-0.5">
              <span className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/15 flex items-center justify-center text-xs flex-shrink-0">→</span>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── App shell ────────────────────────────── */
function AppShell() {
  const { user, sessionToken, logout } = useAuth();
  const authed = !!(user || sessionToken);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [modal, setModal] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  async function handleLogout() {
    await logout();
    addToast("You've been signed out", "success");
    navigate("/");
  }

  function openModal(name) {
    setMenuOpen(false);
    setModal(name);
  }

  const initials =
    `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase() || "?";
  const fullName =
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || user?.full_name || "User";

  // Shared nav link style
  const navCls = ({ isActive }) =>
    `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
      isActive
        ? "bg-green-500/15 text-green-400 border border-green-500/25"
        : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
    }`;

  // Mobile menu link style
  const mobileCls = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-semibold transition-all ${
      isActive ? "bg-green-500/15 text-green-400" : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-30 flex items-center justify-between px-5 sm:px-8 py-3 bg-[#020817]/90 backdrop-blur-xl border-b border-[#1e3a58]/40">
        {/* Brand */}
        <button onClick={() => { navigate(authed ? "/dashboard" : "/"); setMenuOpen(false); }}
          className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
            <span className="text-white text-xs font-black">A</span>
          </div>
          <span className="font-extrabold text-white text-sm tracking-tight">
            Auth<span className="text-green-400">Demo</span>
          </span>
        </button>

        {/* Desktop nav (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={navCls}>Home</NavLink>
          <NavLink to="/api-docs" className={navCls}>Docs</NavLink>
          <NavLink to="/api-playground" className={navCls}>Playground</NavLink>
          <a href="/architecture.html" target="_blank" rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent transition-all duration-150">
            Architecture
          </a>

          {authed ? (
            <>
              <NavLink to="/dashboard" className={navCls}>Dashboard</NavLink>
              <ProfileDropdown user={user} onLogout={handleLogout} />
            </>
          ) : (
            <>
              <button onClick={() => openModal("login")}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
                Login
              </button>
              <button onClick={() => openModal("signup")}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 transition-all active:scale-[0.97]">
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Hamburger (mobile only) */}
        <button onClick={() => setMenuOpen(v => !v)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          {menuOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="md:hidden fixed top-[57px] inset-x-0 bottom-0 z-20 bg-[#020817] overflow-y-auto flex flex-col fade-in-down">
          {/* Nav links */}
          <div className="flex-1 px-4 pt-4 space-y-1">
            <NavLink to="/" end className={mobileCls}>
              <span className="w-9 h-9 rounded-xl bg-[#0c1929] border border-[#1e3a58] flex items-center justify-center text-base shrink-0">🏠</span>
              Home
            </NavLink>
            <NavLink to="/api-docs" className={mobileCls}>
              <span className="w-9 h-9 rounded-xl bg-[#0c1929] border border-[#1e3a58] flex items-center justify-center text-base shrink-0">📋</span>
              Docs
            </NavLink>
            <NavLink to="/api-playground" className={mobileCls}>
              <span className="w-9 h-9 rounded-xl bg-[#0c1929] border border-[#1e3a58] flex items-center justify-center text-base shrink-0">⚡</span>
              Playground
            </NavLink>
            <a href="/architecture.html" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-all">
              <span className="w-9 h-9 rounded-xl bg-[#0c1929] border border-[#1e3a58] flex items-center justify-center text-base shrink-0">🏗</span>
              Architecture
            </a>

            {authed && (
              <>
                <div className="h-px bg-[#1e3a58]/40 my-2" />
                <NavLink to="/dashboard" className={mobileCls}>
                  <span className="w-9 h-9 rounded-xl bg-[#0c1929] border border-[#1e3a58] flex items-center justify-center text-base shrink-0">📊</span>
                  Dashboard
                </NavLink>
                <NavLink to="/my-profile" className={mobileCls}>
                  <span className="w-9 h-9 rounded-xl bg-[#0c1929] border border-[#1e3a58] flex items-center justify-center text-base shrink-0">👤</span>
                  My Profile
                </NavLink>
              </>
            )}
          </div>

          {/* Bottom section */}
          <div className="px-4 pb-8 pt-4 border-t border-[#1e3a58]/40 mt-4">
            {authed ? (
              <div className="space-y-3">
                {/* User card */}
                <div className="flex items-center gap-3 p-4 bg-[#0c1929] border border-[#1e3a58]/60 rounded-2xl">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-green-500/20 flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold text-sm transition-all">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button onClick={() => openModal("login")}
                  className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-base transition-all">
                  Login
                </button>
                <button onClick={() => openModal("signup")}
                  className="w-full py-3.5 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-semibold text-base transition-all shadow-lg shadow-green-500/25">
                  Get Started →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Routes ── */}
      <Routes>
        <Route path="/"
          element={authed ? <Navigate to="/dashboard" replace /> : <Home onLogin={() => openModal("login")} onSignup={() => openModal("signup")} />}
        />
        <Route path="/dashboard"     element={authed ? <Dashboard />  : <Navigate to="/" replace />} />
        <Route path="/my-profile"    element={authed ? <MyProfile />  : <Navigate to="/" replace />} />
        <Route path="/verify-otp"    element={<OtpVerify />} />
        <Route path="/api-docs"      element={<ApiDocs />} />
        <Route path="/api-playground"element={<ApiPlayground />} />
        <Route path="/login"         element={<Navigate to="/" replace />} />
        <Route path="/signup"        element={<Navigate to="/" replace />} />
        <Route path="/forgot-password" element={<Navigate to="/" replace />} />
      </Routes>

      {/* ── Modals ── */}
      {modal && (
        <Modal onClose={() => setModal(null)}>
          {modal === "login"  && <LoginForm  onClose={() => setModal(null)} onSwitchSignup={() => setModal("signup")} onForgotPw={() => setModal("forgot")} />}
          {modal === "signup" && <SignUpForm onClose={() => setModal(null)} onSwitchLogin={() => setModal("login")} />}
          {modal === "forgot" && <ForgotPasswordForm onClose={() => setModal(null)} onSwitchLogin={() => setModal("login")} />}
        </Modal>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-[#1e3a58]/40 py-4 px-6 text-center mt-auto">
        <p className="text-xs text-slate-600">
          Frontend built with{" "}
          <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer"
            className="text-green-500/70 hover:text-green-400 transition-colors font-medium">
            Claude Code
          </a>
          {" "}· Backend powered by FastAPI
        </p>
      </footer>
    </>
  );
}

/* ── Root ─────────────────────────────────── */
export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
