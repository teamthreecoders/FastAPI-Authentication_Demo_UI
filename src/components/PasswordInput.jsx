import { useState } from "react";

const RULES = [
  { label: "8+ chars", test: (v) => v.length >= 8 },
  { label: "Uppercase", test: (v) => /[A-Z]/.test(v) },
  { label: "Lowercase", test: (v) => /[a-z]/.test(v) },
  { label: "Digit", test: (v) => /\d/.test(v) },
  { label: "Special", test: (v) => /[!@#$%^&*]/.test(v) },
  { label: "No spaces", test: (v) => v.length > 0 && !/\s/.test(v) },
];

export function PasswordInput({ id, label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder || "••••••••"}
          required
          className="flex-1 bg-[#050c18] border border-[#1a3a5f] rounded-lg px-3 py-2.5 text-slate-100 text-sm outline-none input-green transition-all placeholder:text-slate-600"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="px-3 py-2 rounded-lg bg-[#0c1929] border border-[#1a3a5f] text-slate-400 hover:text-green-400 hover:border-green-500/40 text-xs font-medium transition-all whitespace-nowrap"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {hasValue && (
        <div className="flex flex-wrap gap-1.5 mt-1 fade-in-up">
          {RULES.map((r) => {
            const pass = r.test(value);
            return (
              <span
                key={r.label}
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-all ${
                  pass
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {pass ? "✓" : "✗"} {r.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
