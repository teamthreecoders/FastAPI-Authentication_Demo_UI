import { useEffect } from "react";

export function Modal({ onClose, children, size = "md" }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 backdrop-enter"
      style={{ background: "rgba(2, 8, 23, 0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        className={`w-full ${widths[size] ?? widths.md} modal-enter sm:rounded-2xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
