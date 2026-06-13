import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { PasswordInput } from "../components/PasswordInput";
import { apiMsg, fieldErrors } from "../utils/apiHelpers";

const CRED_TYPES = ["email", "phone", "user_id"];

function FieldErr({ errors, name }) {
  if (!errors[name]) return null;
  return <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">⚠ {errors[name]}</p>;
}

export function LoginForm({ onClose, onSwitchSignup, onForgotPw }) {
  const navigate = useNavigate();
  const { setSessionToken } = useAuth();
  const { addToast } = useToast();

  const [credType, setCredType] = useState("email");
  const [credValue, setCredValue] = useState("");
  const [countryCd, setCountryCd] = useState("+91");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function buildCredential() {
    if (credType === "email")  return { email: credValue };
    if (credType === "phone")  return { country_cd: countryCd, phone: credValue };
    return { user_id: credValue };
  }

  async function submit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    const res = await authApi.otpLogin(buildCredential(), password);
    setLoading(false);

    if (res.success) {
      if (res.data?.token) {
        setSessionToken(res.data.token);
        addToast(res.msg || "Welcome back!", "success");
        onClose();
        navigate("/dashboard");
      } else if (res.data?.challenge_token) {
        addToast(res.msg || "OTP sent to your email", "success");
        onClose();
        navigate("/verify-otp", { state: { challenge_token: res.data.challenge_token } });
      }
    } else {
      const fe = fieldErrors(res);
      if (Object.keys(fe).length) setErrors(fe);
      addToast(apiMsg(res, "Login failed"), "error");
    }
  }

  return (
    <div className="bg-[#0c1929] border border-[#1e3a58] rounded-2xl overflow-hidden shadow-2xl">
      <div className="px-7 pt-7 pb-5 border-b border-[#1e3a58]/60">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center text-base">🔐</div>
              <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">Secure Login</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
            <p className="text-slate-400 text-sm mt-1">Sign in to your account to continue</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all text-sm font-bold">✕</button>
        </div>
      </div>

      <div className="px-7 py-6">
        <form onSubmit={submit} className="space-y-4">
          {/* Credential type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Login with</label>
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
                placeholder="+91" pattern="^\+\d{2}$" title="+91 format (+ followed by 2 digits)"
                className="input-field w-24" />
              <p className="text-slate-600 text-[10px] mt-1">Format: +91, +44, +1</p>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
              {credType === "email" ? "Email address" : credType === "phone" ? "Phone number" : "User ID"}
            </label>
            <input value={credValue} onChange={(e) => setCredValue(e.target.value)}
              placeholder={credType === "email" ? "you@example.com" : credType === "phone" ? "9876543210 (10 digits)" : "AY12345678"}
              required className="input-field" />
            <FieldErr errors={errors} name={credType === "email" ? "email" : credType === "phone" ? "phone" : "user_id"} />
          </div>

          <div>
            <PasswordInput id="login-pw" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <FieldErr errors={errors} name="password" />
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={onForgotPw} className="text-xs text-green-400 hover:text-green-300 font-medium transition-colors">
              Forgot password?
            </button>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
            {loading ? <><span className="spinner" /> Signing in…</> : "Sign in →"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <button onClick={onSwitchSignup} className="text-green-400 hover:text-green-300 font-semibold transition-colors">Create one</button>
        </p>
      </div>
    </div>
  );
}
