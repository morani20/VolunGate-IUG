import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "@/components/layout";
import { supervisorNav } from "@/components/nav-config";
import Chart from "chart.js/auto";
import { showPortalAlert } from "@/lib/portal-alert";

type Row = { name: string; team: string; assigned: number; done: number; hours: number; rating: number; date: string };

const initialRows: Row[] = [
  { name: "أحمد سليم الخالدي", team: "فريق التوعية الرقمية", assigned: 8, done: 7, hours: 22, rating: 4.4, date: "2026-04-20" },
  { name: "ياسين محمد عودة", team: "فريق الإحصاء البيئي", assigned: 12, done: 12, hours: 30, rating: 5.0, date: "2026-04-18" },
  { name: "سارة يوسف النجار", team: "لجنة التنظيم اللوجستي", assigned: 10, done: 9, hours: 15, rating: 4.7, date: "2026-04-15" },
];

export default function SupervisorReports() {
  const c1 = useRef<HTMLCanvasElement>(null);
  const c2 = useRef<HTMLCanvasElement>(null);
  const [search, setSearch] = useState("");
  const [team, setTeam] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => initialRows.filter(r => {
    const q = search.toLowerCase();
    const matchesQ = r.name.toLowerCase().includes(q);
    const matchesT = !team || r.team === team;
    const d = new Date(r.date);
    const matchesFrom = !from || d >= new Date(from);
    const matchesTo = !to || d <= new Date(to);
    return matchesQ && matchesT && matchesFrom && matchesTo;
  }), [search, team, from, to]);

  const totalHours = filtered.reduce((s, r) => s + r.hours, 0);

  useEffect(() => {
    if (!c1.current || !c2.current) return;
    const chart1 = new Chart(c1.current.getContext("2d")!, {
      type: "doughnut",
      data: { labels: ["مكتملة", "قيد التنفيذ", "ملغاة"], datasets: [{ data: [65, 25, 10], backgroundColor: ["#27ae60", "#3498db", "#e74c3c"], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { font: { family: "Cairo" } } } } },
    });
    const ctx2 = c2.current.getContext("2d")!;
    const gradient = ctx2.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "#3498db");
    gradient.addColorStop(1, "#85c1e9");
    const chart2 = new Chart(ctx2, {
      type: "bar",
      data: { labels: ["التوجيه", "العلاقات", "التقنية", "الأنشطة"], datasets: [{ label: "ساعات التطوع", data: [120, 95, 45, 80], backgroundColor: gradient, hoverBackgroundColor: "#2980b9", borderRadius: 6, borderSkipped: false, barThickness: 45 }] },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, grid: { display: true, color: "#f0f0f0" }, ticks: { font: { family: "Cairo", size: 10 } } }, x: { grid: { display: false }, ticks: { font: { family: "Cairo", size: 11, weight: 700 } } } }, plugins: { legend: { display: false } } },
    });
    return () => { chart1.destroy(); chart2.destroy(); };
  }, []);

  const exportData = (type: "pdf" | "excel") => {
    if (type === "pdf") window.print();
    else showPortalAlert({ title: "تصدير البيانات", message: "جاري تجهيز ملف Excel... سيتم التحميل تلقائياً عند الاكتمال.", type: "success" });
  };

  return (
    <Layout nav={supervisorNav} brandTitle="نظام خدمات المتطوعين — تقارير الأداء"
      userName="د. سامي صالح" userRole="مشرف أكاديمي" userInitial="م"
      footerText="نظام إدارة التطوع — الجامعة الإسلامية غزة | بوابة المشرفين">
      <div className="section-header-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span>تحليل إنتاجية الفرق والمهام</span>
          <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600, border: "1px solid rgba(255,255,255,0.3)" }}>
            إجمالي ساعات التطوع: <span>{totalHours}</span> ساعة
          </span>
        </div>
        <div className="export-container">
          <button className="btn-export btn-export-pdf" onClick={() => exportData("pdf")}>
            <i className="fas fa-file-pdf"></i> تصدير PDF
          </button>
          <button className="btn-export btn-export-excel" onClick={() => exportData("excel")}>
            <i className="fas fa-file-excel"></i> تصدير Excel
          </button>
        </div>
      </div>

      <div className="action-bar">
        <div style={{ fontWeight: 700, color: "#555" }}>تحليل أداء المتطوعين</div>
        <div style={{ flex: 1 }}></div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", padding: "0 10px", borderRadius: 4, background: "#fff" }}>
            <i className="fas fa-search" style={{ color: "#999", fontSize: "0.8rem" }}></i>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="البحث باسم المتطوع..."
              style={{ border: "none", background: "transparent", padding: 8, fontSize: "0.8rem", outline: "none", width: 180 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#fff", border: "1px solid #ddd", padding: "2px 8px", borderRadius: 4 }}>
            <span style={{ fontSize: "0.75rem", color: "#777" }}>من:</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={{ border: "none", outline: "none", fontSize: "0.8rem", fontFamily: "inherit" }} />
            <span style={{ fontSize: "0.75rem", color: "#777", marginRight: 5 }}>إلى:</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={{ border: "none", outline: "none", fontSize: "0.8rem", fontFamily: "inherit" }} />
          </div>
          <select value={team} onChange={(e) => setTeam(e.target.value)}
            style={{ padding: "7px 10px", border: "1px solid #ddd", borderRadius: 4, fontSize: "0.8rem", outline: "none", background: "#fff" }}>
            <option value="">كافة الفرق</option>
            <option value="فريق الإحصاء البيئي">فريق الإحصاء البيئي</option>
            <option value="لجنة التنظيم اللوجستي">لجنة التنظيم اللوجستي</option>
            <option value="فريق التوعية الرقمية">فريق التوعية الرقمية</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
        <div style={{ background: "white", border: "1px solid var(--border-color)", padding: 20 }}>
          <h3 style={{ fontSize: "0.9rem", marginBottom: 20, color: "#333" }}>حالة اكتمال المهام</h3>
          <div style={{ height: 250, display: "flex", justifyContent: "center" }}><canvas ref={c1}></canvas></div>
        </div>
        <div style={{ background: "white", border: "1px solid var(--border-color)", padding: 20 }}>
          <h3 style={{ fontSize: "0.9rem", marginBottom: 20, color: "#333" }}>توزيع ساعات التطوع حسب الفريق</h3>
          <div style={{ height: 250 }}><canvas ref={c2}></canvas></div>
        </div>
      </div>

      <div style={{ marginTop: 20, background: "white", border: "1px solid var(--border-color)" }}>
        <div style={{ padding: 15, borderBottom: "1px solid var(--border-color)", fontWeight: 700 }}>المؤشرات العامة لأداء المتطوعين</div>
        <table className="portal-table">
          <thead>
            <tr><th>المتطوع</th><th>الفريق</th><th>عدد المهام الموكلة</th><th>المهام المكتملة</th><th>ساعات العمل</th><th>متوسط التقييم</th></tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700 }}>{r.name}</td>
                <td>{r.team}</td>
                <td>{r.assigned}</td>
                <td>{r.done}</td>
                <td>{r.hours} ساعة</td>
                <td style={{ color: "#f1c40f" }}><i className="fas fa-star"></i> {r.rating.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
