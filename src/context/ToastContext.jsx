import { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

function Toast({ toast, onDismiss }) {
  const [exiting, setExiting] = useState(false);

  function dismiss() {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 280);
  }

  const isSuccess = toast.type === "success";

  return (
    <div
      className={`${exiting ? "toast-exit" : "toast-enter"} flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border min-w-[260px] max-w-[360px] cursor-pointer select-none ${
        isSuccess
          ? "bg-[#051a0e]/95 border-green-500/40 text-green-300 backdrop-blur"
          : "bg-[#1a0505]/95 border-red-500/40 text-red-300 backdrop-blur"
      }`}
      onClick={dismiss}
    >
      <span
        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          isSuccess ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
        }`}
      >
        {isSuccess ? "✓" : "✗"}
      </span>
      <span className="text-sm font-medium flex-1 leading-snug">{toast.message}</span>
      <button
        className="opacity-40 hover:opacity-80 text-xs transition-opacity flex-shrink-0"
        onClick={(e) => { e.stopPropagation(); dismiss(); }}
      >
        ✕
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const addToast = useCallback((message, type = "success") => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);

    const timer = setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, _removing: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 3800);

    return () => clearTimeout(timer);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onDismiss={dismissToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
