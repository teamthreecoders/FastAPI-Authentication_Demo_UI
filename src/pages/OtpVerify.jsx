import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { apiMsg } from "../utils/apiHelpers";

export function OtpVerify() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setSessionToken } = useAuth();
  const { addToast } = useToast();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const challenge_token = state?.challenge_token || "";

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await authApi.verify2fa(challenge_token, otp);
    setLoading(false);

    if (res.success) {
      setSessionToken(res.data?.token);
      addToast(res.msg || "2FA verified! Welcome.", "success");
      navigate("/dashboard");
    } else {
      addToast(apiMsg(res, "Verification failed"), "error");
      // Clear OTP on wrong code so user can try again
      if (res.msg === "Invalid OTP") setOtp("");
    }
  }

  if (!challenge_token) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 bg-[#020817]">
        <div className="w-full max-w-sm fade-in-up bg-[#0c1929] border border-red-500/30 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-white font-bold text-xl mb-2">Session expired</h2>
          <p className="text-slate-400 text-sm mb-5">Your session has expired. Please log in again.</p>
          <a href="/" className="inline-block px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-all">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4 bg-[#020817]">
      <div className="w-full max-w-sm fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 mb-4">
            <span className="text-2xl">📩</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Check your email</h1>
          <p className="text-slate-400 text-sm">Enter the 4-digit OTP we sent you</p>
        </div>

        <div className="bg-[#0c1929] border border-[#1e3a58]/60 rounded-2xl p-8 shadow-2xl">
          {/* OTP expiry warning */}
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5 mb-6">
            <span className="text-amber-400 text-sm">⏱</span>
            <p className="text-amber-300/80 text-xs font-medium">Code expires in <span className="font-bold text-amber-300">15 minutes</span></p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3 text-center">
                Your 4-digit OTP
              </label>
              <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • •" maxLength={4} required
                className="w-full bg-[#050c18] border border-[#1a3a5f] rounded-xl px-4 py-4 text-slate-100 text-3xl font-bold outline-none input-green transition-all placeholder:text-slate-700 text-center tracking-[0.5em]"
              />
            </div>

            <button type="submit" disabled={loading || otp.length !== 4}
              className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
              {loading ? <><span className="spinner" /> Verifying…</> : "Verify OTP →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
