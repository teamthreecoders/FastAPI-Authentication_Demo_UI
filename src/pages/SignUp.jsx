import { useState } from "react";
import { authApi } from "../api/auth";
import { useToast } from "../context/ToastContext";
import { PasswordInput } from "../components/PasswordInput";
import { apiMsg, fieldErrors } from "../utils/apiHelpers";

function FieldErr({ errors, name }) {
  if (!errors[name]) return null;
  return <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">⚠ {errors[name]}</p>;
}

export function SignUpForm({ onClose, onSwitchLogin }) {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "",
    phone: "", country_cd: "+91", role_type: "user",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    const res = await authApi.signup(form);
    setLoading(false);

    if (res.success) {
      setRegisteredEmail(res.data?.email || form.email);
      addToast(res.msg || "Account created! Check your email.", "success");
      setDone(true);
    } else {
      const fe = fieldErrors(res);
      if (Object.keys(fe).length) setErrors(fe);
      addToast(apiMsg(res, "Registration failed"), "error");
    }
  }

  if (done) {
    return (
      <div className="bg-[#0c1929] border border-[#1e3a58] rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-7 py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/20 flex items-center justify-center mx-auto mb-5 float">
            <span className="text-3xl">📬</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Check your email!</h2>
          <p className="text-slate-400 text-sm mb-2">
            We sent a verification link to
          </p>
          <p className="text-green-400 font-semibold text-sm mb-5">{registeredEmail}</p>
          <p className="text-slate-500 text-xs mb-7 max-w-xs mx-auto leading-relaxed">
            Click the link in the email to set your password and activate your account.
          </p>
          <button onClick={onSwitchLogin}
            className="px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-all shadow-lg shadow-green-500/20">
            Go to Login →
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
              <div className="w-8 h-8 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center text-base">✨</div>
              <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">New Account</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Create account</h2>
            <p className="text-slate-400 text-sm mt-1">Get started — we'll email you a setup link</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all text-sm font-bold">✕</button>
        </div>
      </div>

      <div className="px-7 py-6">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">First Name</label>
              <input value={form.first_name} onChange={set("first_name")} placeholder="Ayan"
                required minLength={3} className="input-field" />
              <FieldErr errors={errors} name="first_name" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Last Name</label>
              <input value={form.last_name} onChange={set("last_name")} placeholder="Pradhan"
                required minLength={3} className="input-field" />
              <FieldErr errors={errors} name="last_name" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Email address</label>
            <input type="email" value={form.email} onChange={set("email")}
              placeholder="you@example.com" required className="input-field" />
            <FieldErr errors={errors} name="email" />
          </div>

          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Code</label>
              <input value={form.country_cd} onChange={set("country_cd")}
                placeholder="+91" pattern="^\+\d{2}$" title="+91 format"
                className="input-field" />
              <FieldErr errors={errors} name="country_cd" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Phone (10 digits)</label>
              <input value={form.phone} onChange={set("phone")}
                placeholder="9876543210" pattern="^\d{10}$" title="Exactly 10 digits"
                maxLength={10} required className="input-field" />
              <FieldErr errors={errors} name="phone" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Role</label>
            <select value={form.role_type} onChange={set("role_type")} className="input-field">
              {["user", "admin", "guest", "other"].map((r) => (
                <option key={r} value={r} className="bg-[#0c1929]">
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 mt-1 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
            {loading ? <><span className="spinner" /> Creating…</> : "Create Account →"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button onClick={onSwitchLogin} className="text-green-400 hover:text-green-300 font-semibold transition-colors">Sign in</button>
        </p>
      </div>
    </div>
  );
}
