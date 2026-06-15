"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { animate } from "animejs";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type ToastType = "success" | "error";

interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  show: (item: Omit<ToastItem, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ── Single toast ──────────────────────────────────────────────────────────────

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dismissed = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissed.current || !ref.current) return;
    dismissed.current = true;
    animate(ref.current, {
      translateY: [0, "-120%"],
      opacity: [1, 0],
      duration: 380,
      ease: "inCubic",
      onComplete: () => onDismiss(item.id),
    });
  }, [item.id, onDismiss]);

  // Slide-in on mount
  useEffect(() => {
    if (!ref.current) return;
    animate(ref.current, {
      translateY: ["-120%", "0%"],
      opacity: [0, 1],
      duration: 500,
      ease: "outExpo",
    });
  }, []);

  // Auto-dismiss
  useEffect(() => {
    const t = setTimeout(dismiss, item.duration ?? 4242);
    return () => clearTimeout(t);
  }, [dismiss, item.duration]);

  const isSuccess = item.type === "success";

  return (
    <div
      ref={ref}
      style={{ opacity: 0 }}
      className={cn(
        "flex items-start gap-3 min-w-[340px] max-w-[480px] rounded-xl px-5 py-4",
        "bg-[#0a0a0a] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]",
        "backdrop-blur-xl pointer-events-auto",
        isSuccess ? "border-l-[3px] border-l-emerald-500" : "border-l-[3px] border-l-red-500"
      )}
    >
      {/* Icon */}
      <div className={cn("shrink-0 mt-0.5 w-5 h-5", isSuccess ? "text-emerald-400" : "text-red-400")}>
        {isSuccess ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {item.title && (
          <p className="text-sm font-semibold text-neutral-50 leading-snug">{item.title}</p>
        )}
        {item.description && (
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{item.description}</p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-neutral-300 hover:bg-white/5 rounded transition-colors duration-150"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

// ── Provider + container ──────────────────────────────────────────────────────

let _id = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((item: Omit<ToastItem, "id">) => {
    setToasts((prev) => [...prev, { ...item, id: ++_id }]);
  }, []);

  const success = useCallback(
    (title: string, description?: string) => show({ type: "success", title, description }),
    [show]
  );

  const error = useCallback(
    (title: string, description?: string) => show({ type: "error", title, description }),
    [show]
  );

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show, success, error }}>
      {children}
      {/* Fixed top-center container */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((t) => (
          <ToastCard key={t.id} item={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
