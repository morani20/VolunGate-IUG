import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import Layout from "@/components/layout";
import { studentNav } from "@/components/nav-config";
import { showPortalAlert } from "@/lib/portal-alert";

function CircleNumber({ digits }: { digits: string }) {
  return (
    <div className="stat-card-number-circle">
      {digits.split("").map((d, i) => (
        <div key={i} className="circle-digit digit-enter" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>{d}</div>
      ))}
    </div>
  );
}

type TaskRow = {
  id: string;
  title: string;
  supervisor: string;
  due: string;
  status: "active" | "new";
  statusLabel: string;
  statusBg?: string;
};

const TASKS: TaskRow[] = [
  { id: "#TSK-105", title: "تحديث بيانات الخريجين في النظام", supervisor: "د. محمود خليل", due: "اليوم", status: "active", statusLabel: "قيد التنفيذ" },
  { id: "#TSK-106", title: "مراجعة ملفات المنح الدراسية", supervisor: "د. محمود خليل", due: "غداً", status: "new", statusLabel: "جديدة", statusBg: "#f1c40f" },
];

type Notification = {
  id: number;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  time: string;
  alertTitle: string;
  alertMessage: string;
  alertType: "info" | "success";
};

const NOTIFICATIONS: Notification[] = [
  {
    id: 1, icon: "fa-tasks", iconBg: "#e3f2fd", iconColor: "#1976d2",
    title: "تم تكليفك بمهمة جديدة", time: "منذ ساعتين",
    alertTitle: "مهمة جديدة", alertMessage: "لقد تم تكليفك بمهمة جديدة من قبل د. محمود خليل. يرجى مراجعة صفحة المهام.", alertType: "info",
  },
  {
    id: 2, icon: "fa-check-circle", iconBg: "#e8f5e9", iconColor: "#2e7d32",
    title: "تم اعتماد ساعات تطوعية", time: "قبل يومين",
    alertTitle: "اعتماد ساعات", alertMessage: "تم اعتماد 4 ساعات تطوعية في رصيدك.", alertType: "success",
  },
];

function BellNotification() {
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bellOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBellOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [bellOpen]);

  return (
    <div
      ref={bellRef}
      className="bell-container"
      role="button"
      tabIndex={0}
      aria-label="إشعارات التطوع"
      aria-expanded={bellOpen}
      onClick={(e) => { e.stopPropagation(); setBellOpen((v) => !v); }}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setBellOpen((v) => !v); } }}
      style={{ position: "relative", cursor: "pointer" }}
    >
      <i className="fas fa-bell bell-icon" style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.9)" }} />
      <span className="bell-badge">2</span>
      {bellOpen && (
        <div
          className="dropdown-enter"
          style={{
            position: "absolute", top: 36, right: 0,
            width: 320, maxWidth: "calc(100vw - 24px)", background: "white", border: "1px solid var(--border-color)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.18)", borderRadius: 10,
            zIndex: 2000, overflow: "hidden", textAlign: "right",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: "12px 15px", background: "linear-gradient(135deg, #f8f9fa, #edf2f7)", borderBottom: "1px solid #eee", fontWeight: 800, fontSize: "0.85rem", color: "#555", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span><i className="fas fa-bell" style={{ marginLeft: 6, color: "var(--blue)", fontSize: "0.75rem" }} />إشعارات التطوع</span>
            <span
              className="link-sweep"
              style={{ color: "var(--blue)", fontSize: "0.7rem", cursor: "pointer", fontWeight: 600 }}
              onClick={() => {
                showPortalAlert({ title: "تحديث", message: "تم تحديد جميع الإشعارات كمقروءة بنجاح.", type: "success" });
                setBellOpen(false);
              }}
            >تحديد كمقروء</span>
          </div>
          {NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className="notif-item"
              style={{ padding: "12px 15px", borderBottom: "1px solid #f5f5f5", cursor: "pointer", display: "flex", gap: 10, alignItems: "flex-start", transition: "all 0.2s" }}
              onClick={() => {
                showPortalAlert({ title: n.alertTitle, message: n.alertMessage, type: n.alertType });
                setBellOpen(false);
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f0f7ff"; (e.currentTarget as HTMLElement).style.paddingRight = "18px"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.paddingRight = "15px"; }}
            >
              <div style={{ background: n.iconBg, color: n.iconColor, width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", flexShrink: 0, boxShadow: "0 2px 8px -2px rgba(0,0,0,0.12)" }}>
                <i className={`fas ${n.icon}`} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#333" }}>{n.title}</span>
                <span style={{ fontSize: "0.65rem", color: "#999" }}><i className="fas fa-clock" style={{ marginLeft: 3, fontSize: "0.55rem" }} />{n.time}</span>
              </div>
            </div>
          ))}
          <div style={{ padding: "10px 15px", textAlign: "center", borderTop: "1px solid #eee", background: "#fafbfc" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--blue)", cursor: "pointer", fontWeight: 700 }}>
              عرض جميع الإشعارات <i className="fas fa-arrow-left" style={{ marginRight: 4, fontSize: "0.65rem" }} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <Layout
      nav={studentNav}
      brandTitle="نظام خدمات المتطوعين — الجامعة الإسلامية غزة"
      userName="طالب متطوع"
      userRole="طالب"
      userInitial="ط"
      footerText="نظام إدارة التطوع — الجامعة الإسلامية غزة"
      headerExtra={<BellNotification />}
    >
      <div className="portal-stats-container">
        <div className="portal-stat-card stat-card-enter stat-card-hover">
          <div style={{ margin: "0 auto 10px", width: 42, height: 42, borderRadius: "50%", background: "#3498db", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="fas fa-clock" style={{ color: "#fff", fontSize: "1rem" }} />
          </div>
          <div className="stat-card-title">إجمالي الساعات التطوعية</div>
          <CircleNumber digits="045" />
          <div className="stat-card-footer">ساعة معتمدة حتى الآن</div>
        </div>
        <div className="portal-stat-card stat-card-enter stat-card-hover">
          <div style={{ margin: "0 auto 10px", width: 42, height: 42, borderRadius: "50%", background: "#27ae60", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="fas fa-check-double" style={{ color: "#fff", fontSize: "1rem" }} />
          </div>
          <div className="stat-card-title">المهام المنجزة</div>
          <CircleNumber digits="012" />
          <div className="stat-card-footer">مهمة تم تنفيذها بنجاح</div>
        </div>
        <div className="portal-stat-card stat-card-enter stat-card-hover">
          <div style={{ margin: "0 auto 10px", width: 42, height: 42, borderRadius: "50%", background: "#f39c12", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="fas fa-spinner" style={{ color: "#fff", fontSize: "1rem" }} />
          </div>
          <div className="stat-card-title">المهام قيد التنفيذ</div>
          <CircleNumber digits="003" />
          <div className="stat-card-footer">مهام تحتاج إلى استكمال</div>
        </div>
      </div>

      <div className="section-header-bar">
        <span><i className="fas fa-tasks" style={{ marginLeft: 8 }} />المهام اليومية المطلوبة</span>
        <i className="fas fa-calendar-day" />
      </div>

      <div className="chart-container-enter" style={{ background: "white", border: "1px solid var(--border-color)", padding: 15, borderRadius: "0 0 6px 6px" }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table className="portal-table">
            <thead>
              <tr>
                <th>رقم المهمة</th>
                <th>عنوان المهمة</th>
                <th>المشرف</th>
                <th>تاريخ الاستحقاق</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {TASKS.map((t, idx) => (
                <tr key={t.id} className="table-row-enter" style={{ animationDelay: `${0.05 + idx * 0.08}s` }}>
                  <td style={{ textAlign: "center", fontWeight: 600, color: "var(--blue)" }}>{t.id}</td>
                  <td style={{ textAlign: "center" }}>{t.title}</td>
                  <td style={{ textAlign: "center" }}>{t.supervisor}</td>
                  <td style={{ textAlign: "center" }}>{t.due}</td>
                  <td style={{ textAlign: "center" }}>
                    {t.status === "active" ? (
                      <span className="status-badge status-active">قيد التنفيذ</span>
                    ) : (
                      <span className="status-badge" style={{ background: t.statusBg || "#f1c40f", color: "#fff" }}>{t.statusLabel}</span>
                    )}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Link href="/student/tasks" className="btn-portal btn-portal-blue ripple-host btn-shine" style={{ fontSize: "0.8rem", padding: "5px 14px" }}>
                      <i className="fas fa-eye" style={{ marginLeft: 4 }} /> عرض
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 18, textAlign: "left" }}>
          <Link href="/student/tasks" className="btn-portal btn-portal-blue ripple-host btn-shine" style={{ borderRadius: 6 }}>
            عرض كافة المهام <i className="fas fa-arrow-left" style={{ marginRight: 5 }} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
