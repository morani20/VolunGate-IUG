import { createContext, useCallback, useContext, useEffect, useState } from "react";

type ToastKind = "success" | "danger" | "info";
type Toast = { id: number; message: string; kind: ToastKind };

const ToastCtx = createContext<(message: string, kind?: ToastKind) => void>(
  () => {}
);

export const useToast = () => useContext(ToastCtx);

const palette: Record<ToastKind, { bg: string; icon: string }> = {
  success: { bg: "#27ae60", icon: "fa-circle-check" },
  danger: { bg: "#e74c3c", icon: "fa-circle-xmark" },
  info: { bg: "#3498db", icon: "fa-circle-info" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, kind: ToastKind = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2000);
  }, []);

  return (
    <ToastCtx.Provider value={showToast}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: "70px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3000,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          pointerEvents: "none",
          direction: "rtl",
        }}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const [exiting, setExiting] = useState(false);
  useEffect(() => {
    const tm = window.setTimeout(() => setExiting(true), 1700);
    return () => window.clearTimeout(tm);
  }, []);
  const { bg, icon } = palette[toast.kind];
  return (
    <div
      style={{
        background: bg,
        color: "white",
        padding: "12px 22px",
        borderRadius: "10px",
        boxShadow: "0 14px 32px -10px rgba(0,0,0,0.35)",
        fontSize: "0.9rem",
        fontWeight: 700,
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        minWidth: "260px",
        justifyContent: "center",
        animation: exiting
          ? "toastOut 0.3s ease forwards"
          : "toastIn 0.35s cubic-bezier(0.22, 1.2, 0.36, 1) both",
        pointerEvents: "auto",
      }}
    >
      <i className={`fa-solid ${icon}`} style={{ fontSize: "1.05rem" }} />
      <span>{toast.message}</span>
    </div>
  );
}
