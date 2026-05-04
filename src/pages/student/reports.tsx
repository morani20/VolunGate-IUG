import { useEffect, useRef } from "react";
import Layout from "@/components/layout";
import { studentNav } from "@/components/nav-config";
import { showPortalAlert } from "@/lib/portal-alert";
import Chart from "chart.js/auto";

type LogItem = {
  id: number;
  dotColor: string;
  titleColor: string;
  title: string;
  time: string;
  description: string;
  note?: { label: string; text: string };
};

const LOG_ITEMS: LogItem[] = [
  {
    id: 1, dotColor: "var(--blue)", titleColor: "var(--blue)",
    title: "اعتماد ساعات تطوعية", time: "قبل يومين",
    description: 'تم اعتماد (4) ساعات تطوعية من قبل المشرف د. محمود خليل عن مهمة: "ترتيب أرشيف المكتبة".',
  },
  {
    id: 2, dotColor: "var(--green)", titleColor: "var(--green)",
    title: "تسليم مهمة", time: "20 أكتوبر 2023",
    description: "قمت برفع ملاحظات وتفاصيل إنجاز المهمة #TSK-101 للمراجعة.",
  },
  {
    id: 3, dotColor: "#f39c12", titleColor: "#f39c12",
    title: "تكليف بمهمة جديدة", time: "18 أكتوبر 2023",
    description: 'تم تكليفك بمهمة "ترتيب أرشيف المكتبة المركزية" من قبل المشرف أ. سعيد المصري.',
  },
  {
    id: 4, dotColor: "#9b59b6", titleColor: "#9b59b6",
    title: "تقرير أداء شهري", time: "1 أكتوبر 2023",
    description: "تم إصدار تقرير أداء عن شهر سبتمبر من قبل الإدارة.",
    note: { label: "ملاحظة المشرف:", text: "أداء متميز والتزام بالمواعيد المحددة لإنجاز المهام. استمر على هذا المجهود." },
  },
];

export default function StudentReports() {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const c = new Chart(chartRef.current.getContext("2d")!, {
      type: "doughnut",
      data: {
        labels: ["ساعات منجزة", "ساعات متبقية"],
        datasets: [{
          data: [45, 55],
          backgroundColor: ["#3498db", "#ecf0f1"],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "80%",
        plugins: {
          legend: { display: false },
          tooltip: { rtl: true },
        },
      },
    });
    return () => c.destroy();
  }, []);

  const handlePrint = () => {
    showPortalAlert({
      title: "طباعة كشف الساعات",
      message: "جاري إعداد كشف الساعات التطوعية للطباعة...",
      type: "info",
      onConfirm: () => window.print(),
      confirmText: "طباعة",
      cancelText: "إلغاء",
    });
  };

  const handleReviewRequest = () => {
    showPortalAlert({
      title: "طلب مراجعة الساعات",
      message: "هل تود إرسال طلب للمشرف لمراجعة ساعاتك غير المعتمدة؟",
      type: "info",
      confirmText: "إرسال الطلب",
      cancelText: "إلغاء",
      onConfirm: () => {
        showPortalAlert({
          title: "تم الإرسال",
          message: "تم إرسال طلب المراجعة بنجاح بانتظار رد المشرف.",
          type: "success",
        });
      },
    });
  };

  return (
    <Layout
      nav={studentNav}
      brandTitle="نظام خدمات المتطوعين — الجامعة الإسلامية غزة"
      userName="طالب متطوع"
      userRole="طالب"
      userInitial="ط"
      footerText="نظام إدارة التطوع — الجامعة الإسلامية غزة"
    >
      <div className="section-header-bar">
        <span><i className="fas fa-chart-line" style={{ marginLeft: 8 }} />سجل الحركات وتقارير الأداء</span>
        <i className="fas fa-history" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 15, marginTop: 15 }}>
        <div className="chart-container-enter stat-card-hover" style={{ background: "white", border: "1px solid var(--border-color)", padding: 20, borderRadius: 5 }}>
          <h3 style={{ fontSize: "1rem", color: "#333", marginBottom: 20, borderBottom: "2px solid var(--blue)", paddingBottom: 10 }}>ملخص الإنجاز</h3>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ position: "relative", width: 150, height: 150, margin: "0 auto" }}>
              <canvas ref={chartRef} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "1.5rem", fontWeight: "bold", color: "var(--blue)" }}>
                45
                <div style={{ fontSize: "0.8rem", color: "#666" }}>ساعة</div>
              </div>
            </div>
            <p style={{ marginTop: 10, fontSize: "0.9rem", color: "#555" }}>الهدف المتبقي: 55 ساعة</p>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.9rem" }}>
            <li style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
              <span>إجمالي المهام المنجزة:</span>
              <span style={{ fontWeight: "bold" }}>12 مهمة</span>
            </li>
            <li style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
              <span>تقييم الأداء العام:</span>
              <span style={{ fontWeight: "bold", color: "var(--green)" }}>ممتاز</span>
            </li>
            <li style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
              <span>تاريخ بدء التطوع:</span>
              <span style={{ fontWeight: "bold" }}>1 سبتمبر 2023</span>
            </li>
          </ul>

          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn-portal btn-portal-blue ripple-host btn-shine" style={{ width: "100%", justifyContent: "center" }} onClick={handlePrint}>
              <i className="fas fa-print" style={{ marginLeft: 5 }} /> طباعة كشف الساعات
            </button>
            <button className="btn-portal btn-portal-grey ripple-host" style={{ width: "100%", justifyContent: "center" }} onClick={handleReviewRequest}>
              <i className="fas fa-paper-plane" style={{ marginLeft: 5 }} /> طلب مراجعة رصيد الساعات
            </button>
          </div>
        </div>

        <div className="chart-container-enter" style={{ background: "white", border: "1px solid var(--border-color)", padding: 20, borderRadius: 5, animationDelay: "0.1s" }}>
          <h3 style={{ fontSize: "1rem", color: "#333", marginBottom: 20, borderBottom: "2px solid var(--blue)", paddingBottom: 10 }}>سجل الحركات الموثقة (Log)</h3>

          <div style={{ position: "relative", borderRight: "2px solid var(--blue)", paddingRight: 20, marginRight: 10 }}>
            {LOG_ITEMS.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  position: "relative",
                  marginBottom: idx < LOG_ITEMS.length - 1 ? 20 : 0,
                  animation: `softPop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both`,
                  animationDelay: `${0.15 + idx * 0.1}s`,
                }}
              >
                <span style={{
                  position: "absolute", right: -28, top: 0,
                  width: 14, height: 14, borderRadius: "50%",
                  background: item.dotColor, border: "2px solid #fff",
                }} />
                <div className="recent-item" style={{ background: "#f9f9f9", padding: 15, borderRadius: 5, border: "1px solid #eee" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, flexWrap: "wrap", gap: 6 }}>
                    <strong style={{ color: item.titleColor }}>{item.title}</strong>
                    <span style={{ fontSize: "0.8rem", color: "#888" }}><i className="fas fa-clock" /> {item.time}</span>
                  </div>
                  <p style={{ margin: item.note ? "0 0 10px 0" : 0, fontSize: "0.9rem", color: "#555" }}>{item.description}</p>
                  {item.note && (
                    <div style={{ background: "#f0f8ff", padding: 10, borderRadius: 4, border: "1px solid #cce7ff", fontSize: "0.85rem" }}>
                      <strong>{item.note.label}</strong> {item.note.text}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
