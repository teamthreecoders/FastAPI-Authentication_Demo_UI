import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { apiMsg } from "../utils/apiHelpers";

/* ── helpers ──────────────────────────────── */
function getInitials(data) {
  const name = `${data?.first_name ?? ""} ${data?.last_name ?? ""}`.trim() || data?.full_name || "";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("") || "?";
}

/* ── sub-components ───────────────────────── */

function FieldRow({ label, value, mono, accent }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[#1a3a5f]/40 last:border-0">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest shrink-0 w-24 sm:w-32">
        {label}
      </span>
      <span
        className={`text-sm text-right break-all ${
          mono ? "font-mono text-slate-300" : accent ? "text-green-400 font-medium" : "text-slate-200"
        }`}
      >
        {value ?? <span className="text-slate-600 italic">—</span>}
      </span>
    </div>
  );
}

function StatusPill({ active }) {
  return active ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/15 border border-green-500/30 text-green-400">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Inactive
    </span>
  );
}

function TfaPill({ enabled }) {
  return enabled ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
      🛡 2FA On
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-500/10 border border-slate-500/20 text-slate-400">
      2FA Off
    </span>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* hero */}
      <div className="bg-[#0c1929] border border-[#1a3a5f]/60 rounded-2xl p-8">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-[#1a3a5f]" />
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-[#1a3a5f] rounded-lg w-2/5" />
            <div className="h-3 bg-[#1a3a5f] rounded-lg w-1/3" />
            <div className="h-3 bg-[#1a3a5f] rounded-lg w-1/4" />
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-[#050c18] rounded-lg mb-2 border border-[#1a3a5f]" />
        ))}
      </div>
    </div>
  );
}

/* ── main page ────────────────────────────── */
export function MyProfile() {
  const navigate = useNavigate();
  const { fetchMe } = useAuth();
  const { addToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetchMe();
      if (cancelled) return;
      setLoading(false);

      if (res.success) {
        setProfile(res.data);
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        addToast(apiMsg(res, "Your session has expired. Please sign in again."), "error");
        setTimeout(() => navigate("/"), 1500);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fullName =
    profile
      ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() ||
        profile.full_name ||
        "User"
      : "";

  return (
    <div className="flex flex-1 justify-center p-4 bg-[#020817]">
      <div className="w-full max-w-xl space-y-4 fade-in-up">

        {/* ── Session status badge ── */}
        {authenticated && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 border border-green-500/20 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            <p className="text-green-400 text-sm font-medium">You are signed in</p>
          </div>
        )}

        {/* ── Profile card ── */}
        {loading ? (
          <Skeleton />
        ) : profile ? (
          <div className="bg-[#0c1929] border border-[#1a3a5f]/60 rounded-2xl shadow-2xl overflow-hidden">
            {/* Hero banner */}
            <div className="bg-gradient-to-br from-[#0c2a1a] via-[#0c1929] to-[#0a1e3d] px-5 sm:px-8 pt-6 sm:pt-8 pb-6 border-b border-[#1a3a5f]/40">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-xl shadow-green-500/25 shrink-0">
                  {getInitials(profile)}
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-white truncate">{fullName}</h1>
                  <p className="text-slate-400 text-sm truncate">{profile.email}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {profile.role_type && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                        {profile.role_type}
                      </span>
                    )}
                    {profile.is_active !== undefined && (
                      <StatusPill active={profile.is_active} />
                    )}
                    {profile.is_2fa_enabled !== undefined && (
                      <TfaPill enabled={profile.is_2fa_enabled} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Fields */}
            <div className="px-5 sm:px-8 py-2">
              <FieldRow label="User ID"    value={profile.user_id}   mono />
              <FieldRow label="First Name" value={profile.first_name} />
              <FieldRow label="Last Name"  value={profile.last_name} />
              <FieldRow label="Email"      value={profile.email}     accent />
              <FieldRow
                label="Phone"
                value={
                  profile.phone
                    ? `${profile.country_cd ?? ""} ${profile.phone}`.trim()
                    : null
                }
              />
              <FieldRow label="Role"       value={profile.role_type} accent />
              <FieldRow
                label="Account"
                value={
                  profile.is_active !== undefined
                    ? profile.is_active ? "Active" : "Inactive"
                    : null
                }
              />
              <FieldRow
                label="2FA"
                value={
                  profile.is_2fa_enabled !== undefined
                    ? profile.is_2fa_enabled ? "Enabled" : "Disabled"
                    : null
                }
              />
              {profile.created_at && (
                <FieldRow
                  label="Joined"
                  value={new Date(profile.created_at).toLocaleString()}
                />
              )}
              {profile.updated_at && (
                <FieldRow
                  label="Updated"
                  value={new Date(profile.updated_at).toLocaleString()}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="bg-[#0c1929] border border-red-500/30 rounded-2xl p-8 text-center">
            <p className="text-red-400 text-sm">Failed to load profile. Redirecting to login…</p>
          </div>
        )}

      </div>
    </div>
  );
}
