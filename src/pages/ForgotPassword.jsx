import { useState } from "react";
import { authApi } from "../api/auth";
import { useToast } from "../context/ToastContext";
import { apiMsg, fieldErrors } from "../utils/apiHelpers";

const CRED_TYPES = ["email", "phone", "user_id"];

function FieldErr({ errors, name }) {
  if (!errors[name]) return null;
  return <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">⚠ {errors[name]}</p>;
}

export function ForgotPasswordForm({ onClose, onSwitchLogin }) {
  const { addToast } = useToast();
  const [credType, setCredType] = useState("email");
  const [credValue, setCredValue] = useState("");
  const [countryCd, setCountryCd] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  function buildCredential() {
    if (credType === "email") return { email: credValue };
    if (credType === "phone") return { country_cd: countryCd, phone: credValue };
    return { user_id: credValue };
  }

  async function submit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    const res = await authApi.forgotPassword(buildCredential());
    setLoading(false);

    if (res.success) {
      addToast(res.msg || "Reset link sent!", "success");
      setSent(true);
    } else {
      const fe = fieldErrors(res);
      if (Object.keys(fe).length) setErrors(fe);
      addToast(apiMsg(res, "Request failed"), "error");
    }
  }

  if (sent) {
    return (
      <div className="bg-[#0c1929] border border-[#1e3a58] rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-7 py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/20 flex items-center justify-center mx-auto mb-5 float">
            <span className="text-3xl">📬</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Check your inbox</h2>
          <p className="text-slate-400 text-sm mb-2">
            If that account exists, a reset link has been sent.
          </p>
          <p className="text-slate-500 text-xs mb-7 max-w-xs mx-auto leading-relaxed">
            Click the link in the email to set a new password. The link expires in 15 minutes.
          </p>
          <button onClick={onSwitchLogin}
            className="px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-all shadow-lg shadow-green-500/20">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0c1929] border border-[#1e3a58] rounded-2xl overflow-hidden shadow-2xl">
      <div className="px-7 pt-7 pb-5 border-b border-[#1e3a58]/60">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center text-base">🔑</div>
              <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">Password Reset</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Forgot password?</h2>
            <p className="text-slate-400 text-sm mt-1">We'll send a reset link to your email</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all text-sm font-bold">✕</button>
        </div>
      </div>

      <div className="px-7 py-6">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Find account by</label>
            <div className="flex gap-1.5 p-1 bg-[#050c18] rounded-xl border border-[#1a3a5f]">
              {CRED_TYPES.map((t) => (
                <button key={t} type="button"
                  onClick={() => { setCredType(t); setCredValue(""); setErrors({}); }}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    credType === t ? "bg-green-500/20 text-green-400" : "text-slate-500 hover:text-slate-300"
                  }`}>
                  {t === "user_id" ? "User ID" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {credType === "phone" && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Country Code</label>
              <input value={countryCd} onChange={(e) => setCountryCd(e.target.value)}
                placeholder="+91" pattern="^\+\d{2}$" className="input-field w-24" />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
              {credType === "email" ? "Email address" : credType === "phone" ? "Phone number" : "User ID"}
            </label>
            <input value={credValue} onChange={(e) => setCredValue(e.target.value)}
              placeholder={credType === "email" ? "you@example.com" : credType === "phone" ? "9876543210" : "AY12345678"}
              required className="input-field" />
            <FieldErr errors={errors} name={credType === "email" ? "email" : credType === "phone" ? "phone" : "user_id"} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 mt-1 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
            {loading ? <><span className="spinner" /> Sending…</> : "Send Reset Link →"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Remember it?{" "}
          <button onClick={onSwitchLogin} className="text-green-400 hover:text-green-300 font-semibold transition-colors">Sign in</button>
        </p>
      </div>
    </div>
  );
}
