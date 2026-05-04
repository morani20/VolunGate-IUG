import { useEffect, useRef } from "react";
import { Link } from "wouter";
import Layout from "@/components/layout";
import { supervisorNav } from "@/components/nav-config";
import Chart from "chart.js/auto";
import { showPortalAlert } from "@/lib/portal-alert";

function CircleNumber({ digits }: { digits: string }) {
  return (
    <div className="stat-card-number-circle">
      {digits.split("").map((d, i) => <div key={i} className="circle-digit">{d}</div>)}
    </div>
  );
}

export default function SupervisorDashboard() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const c = new Chart(ref.current.getContext("2d")!, {
      type: "line",
      data: {
        labels: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
        datasets: [{
          label: "المهام المنجزة", data: [5, 12, 8, 10, 15, 7],
          borderColor: "#3498db", backgroundColor: "rgba(52, 152, 219, 0.1)",
          borderWidth: 2, fill: true, tension: 0.4,
        }],
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } },
    });
    return () => c.destroy();
  }, []);

  return (
    <Layout nav={supervisorNav} brandTitle="نظام خدمات المتطوعين — لوحة المشرفين"
      userName="د. سامي صالح" userRole="مشرف أكاديمي" userInitial="م"
      footerText="نظام إدارة التطوع — الجامعة الإسلامية غزة | بوابة المشرفين">
      <div className="portal-stats-container">
        <div className="portal-stat-card"><div className="stat-card-title">فرق المتطوعين النشطة</div><CircleNumber digits="0003" /><div className="stat-card-footer">فرق تحت إشرافي المباشر</div></div>
        <div className="portal-stat-card"><div className="stat-card-title">إجمالي المتطوعين</div><CircleNumber digits="0005" /><div className="stat-card-footer">طالب مسجل في فرقي الحالية</div></div>
        <div className="portal-stat-card"><div className="stat-card-title">مهام اليوم المنجزة</div><CircleNumber digits="0002" /><div className="stat-card-footer">من أصل 8 مهام تم توزيعها اليوم</div></div>
      </div>

      <div className="section-header-bar">
        <span>متابعة حالة الفرق والمهام</span>
        <i className="fas fa-project-diagram"></i>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 15, marginTop: 15 }}>
        <div style={{ background: "white", border: "1px solid var(--border-color)", padding: 20 }}>
          <h3 style={{ fontSize: "0.9rem", marginBottom: 20, color: "#333" }}>نسبة إنجاز المهام الأسبوعية</h3>
          <div style={{ height: 300 }}><canvas ref={ref}></canvas></div>
        </div>
        <div style={{ background: "white", border: "1px solid var(--border-color)" }}>
          <div style={{ background: "#f9f9f9", padding: 12, borderBottom: "1px solid var(--border-color)", fontWeight: 700, fontSize: "0.85rem" }}>تنبيهات الحركات اليومية</div>
          <div style={{ padding: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #eee" }}>
              <div className="navbar-user-avatar" style={{ background: "var(--blue)", color: "white", width: 25, height: 25, fontSize: "0.6rem" }}><i className="fas fa-info"></i></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700 }}>تحديث خطة الإحصاء</div>
                <div style={{ fontSize: "0.7rem", color: "#888" }}>فريق الإحصاء البيئي</div>
              </div>
              <div style={{ fontSize: "0.65rem", color: "#bbb" }}>منذ 5 د</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #eee" }}>
              <div className="navbar-user-avatar" style={{ background: "var(--green)", color: "white", width: 25, height: 25, fontSize: "0.6rem" }}><i className="fas fa-check"></i></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700 }}>إكمال ملف التوعية</div>
                <div style={{ fontSize: "0.7rem", color: "#888" }}>فريق التوعية الرقمية</div>
              </div>
              <div style={{ fontSize: "0.65rem", color: "#bbb" }}>منذ ساعة</div>
            </div>
          </div>
          <div style={{ padding: 15 }}>
            <Link href="/supervisor/tasks" className="btn-portal btn-portal-blue" style={{ width: "100%", justifyContent: "center" }}>عرض كافة المهام</Link>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 25 }}>
        <div className="section-header-bar" style={{ background: "white", color: "var(--blue)", border: "1px solid var(--border-color)", borderBottom: "2px solid var(--blue)" }}>
          <span>مركز الوصول السريع</span>
          <i className="fas fa-bolt"></i>
        </div>
        <div className="quick-action-grid">
          <Link href="/supervisor/tasks" className="action-btn-card" style={{ textDecoration: "none" }}>
            <i className="fas fa-plus-circle"></i><span>توزيع مهمة جديدة</span>
          </Link>
          <Link href="/supervisor/volunteers" className="action-btn-card" style={{ textDecoration: "none" }}>
            <i className="fas fa-user-plus"></i><span>تسجيل متطوع جديد</span>
          </Link>
          <div className="action-btn-card" onClick={() => showPortalAlert({ title: "تعميم عام", message: "جاري إرسال تنبيه لكافة الفرق النشطة بخصوص التحديثات الجديدة...", type: "info" })}>
            <i className="fas fa-bullhorn"></i><span>إرسال تعميم عام</span>
          </div>
          <Link href="/supervisor/reports" className="action-btn-card" style={{ textDecoration: "none" }}>
            <i className="fas fa-file-download"></i><span>تنزيل ملخص اليوم</span>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
