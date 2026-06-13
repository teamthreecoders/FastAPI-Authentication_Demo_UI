export function ApiResponse({ response }) {
  if (!response) return null;
  const isSuccess = response.success;

  return (
    <div
      className={`mt-4 rounded-xl overflow-hidden border fade-in-up ${
        isSuccess ? "border-green-500/30" : "border-red-500/30"
      }`}
    >
      <div
        className={`flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest ${
          isSuccess
            ? "bg-green-500/15 text-green-400"
            : "bg-red-500/15 text-red-400"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${isSuccess ? "bg-green-400" : "bg-red-400"}`}
        />
        API Response — {isSuccess ? "Success" : "Error"}
      </div>
      <pre className="bg-[#050c18] p-4 text-xs text-slate-400 overflow-x-auto max-h-64 leading-relaxed">
        {JSON.stringify(response, null, 2)}
      </pre>
    </div>
  );
}
