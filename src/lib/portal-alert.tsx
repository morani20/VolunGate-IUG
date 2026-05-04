import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";

export type PortalAlertOptions = {
  title?: string;
  message?: string;
  type?: "info" | "success" | "warning" | "danger";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
};

function AlertCard({ opts, onClose }: { opts: PortalAlertOptions; onClose: () => void }) {
  const [closing, setClosing] = useState(false);
  const {
    title = "تنبيه",
    message = "",
    type = "info",
    confirmText = "موافق",
    cancelText = "إلغاء",
    onConfirm = null,
  } = opts;

  let iconClass = "fa-info-circle";
  if (type === "success") iconClass = "fa-check-circle";
  if (type === "warning") iconClass = "fa-exclamation-triangle";
  if (type === "danger") iconClass = "fa-trash-alt";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") doClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const doClose = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  return (
    <div className="portal-alert-overlay" style={{ opacity: closing ? 0 : 1, transition: "opacity 0.2s" }}>
      <div className={`portal-alert-card alert-${type}`}>
        <div className="portal-alert-header">
          <div className="portal-alert-icon"><i className={`fas ${iconClass}`}></i></div>
          <div className="portal-alert-title">{title}</div>
        </div>
        <div className="portal-alert-body">
          <div className="portal-alert-msg" dangerouslySetInnerHTML={{ __html: message }} />
        </div>
        <div className="portal-alert-footer">
          {onConfirm && (
            <button className="btn-alert btn-alert-secondary" onClick={doClose}>{cancelText}</button>
          )}
          <button className="btn-alert btn-alert-confirm" onClick={() => { if (onConfirm) onConfirm(); doClose(); }}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

export function showPortalAlert(opts: PortalAlertOptions) {
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  const close = () => {
    root.unmount();
    host.remove();
  };
  root.render(<AlertCard opts={opts} onClose={close} />);
}
