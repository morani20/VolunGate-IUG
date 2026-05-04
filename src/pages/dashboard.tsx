import { useEffect, useRef } from "react";
import Layout from "@/components/layout";

const stats = [
  {
    title: "إجمالي متطوعي النظام",
    digits: ["0", "1", "2", "5"],
    footer: "طلاب مسجلين في بنك التطوع الجامعي",
    color: "#333",
  },
  {
    title: "المشرفين المعتمدين",
    digits: ["0", "0", "4", "2"],
    footer: "أعضاء هيئة تدريسية وإدارية",
    color: "#333",
  },
  {
    title: "المهام المكتملة",
    digits: ["0", "5", "1", "0"],
    footer: "مهام تم إنجازها وتوثيق ساعاتها",
    color: "#27ae60",
  },
];

const recentUsers = [
  { initial: "م", name: "محمد العابد", role: "طالب متطوع", time: "منذ ساعة" },
  { initial: "س", name: "سارة خليل", role: "مشرف أكاديمي", time: "منذ يوم" },
  { initial: "ر", name: "رنا الحسن", role: "طالب متطوع", time: "منذ يومين" },
];

export default function DashboardPage() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<unknown>(null);

  useEffect(() => {
    const loadChart = async () => {
      const Chart = (await import("chart.js/auto")).default;
      if (!chartRef.current) return;
      if (chartInstance.current) {
        (chartInstance.current as { destroy: () => void }).destroy();
      }
      chartInstance.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: ["طلاب متطوعين", "مشرفين أكاديميين", "مدراء نظام"],
          datasets: [
            {
              label: "عدد المستخدمين",
              data: [450, 42, 5],
              backgroundColor: ["#2ecc71", "#3498db", "#e74c3c"],
              borderRadius: 5,
              maxBarThickness: 60,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1200,
            easing: "easeOutQuart",
          },
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { font: { family: "Cairo" } },
            },
            x: {
              ticks: { font: { family: "Cairo" } },
            },
          },
        },
      });
    };
    loadChart();
    return () => {
      if (chartInstance.current) {
        (chartInstance.current as { destroy: () => void }).destroy();
      }
    };
  }, []);

  return (
    <Layout>
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="stat-card-enter stat-card-hover"
            style={{
              background: "white",
              borderRadius: "4px",
              padding: "20px",
              textAlign: "center",
              border: "1px solid #d2d6de",
              boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
              position: "relative",
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 3px 10px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 1px 3px rgba(0,0,0,0.07)";
            }}
            data-testid={`stat-card-${i}`}
          >
            <div
              style={{
                content: "",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "#3498db",
                borderRadius: "4px 4px 0 0",
              }}
            />
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#333", marginBottom: "15px" }}>
              {stat.title}
            </div>
            <div
              className="flex justify-center gap-1 mb-3"
              style={{ direction: "ltr" }}
            >
              {stat.digits.map((d, j) => (
                <div
                  key={j}
                  className="digit-enter flex items-center justify-center font-bold"
                  style={{
                    width: "32px",
                    height: "32px",
                    background: stat.color,
                    color: "white",
                    borderRadius: "50%",
                    fontSize: "1rem",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#888",
                borderTop: "1px dotted #ddd",
                paddingTop: "10px",
              }}
            >
              {stat.footer}
            </div>
          </div>
        ))}
      </div>

      {/* Section header */}
      <div
        className="flex justify-between items-center"
        style={{
          background: "#607d8b",
          color: "white",
          padding: "10px 15px",
          fontSize: "0.9rem",
          fontWeight: 700,
          borderRadius: "4px 4px 0 0",
        }}
      >
        <span>نظرة عامة على البيانات الإحصائية</span>
        <i className="fas fa-chart-pie" />
      </div>

      {/* Chart + recent users */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "15px",
          marginTop: "15px",
        }}
      >
        <div
          style={{
            background: "white",
            border: "1px solid #d2d6de",
            padding: "20px",
          }}
        >
          <h3 style={{ fontSize: "0.9rem", marginBottom: "20px", color: "#333", fontWeight: 700 }}>
            توزيع المستخدمين حسب الدور الوظيفي
          </h3>
          <div style={{ height: "300px" }}>
            <canvas ref={chartRef} id="usersChart" />
          </div>
        </div>

        <div style={{ background: "white", border: "1px solid #d2d6de" }}>
          <div
            style={{
              background: "#f9f9f9",
              padding: "12px",
              borderBottom: "1px solid #d2d6de",
              fontWeight: 700,
              fontSize: "0.85rem",
            }}
          >
            آخر المستخدمين انضماماً
          </div>
          <div style={{ padding: "10px" }}>
            {recentUsers.map((u, i) => (
              <div
                key={i}
                className="table-row-enter recent-item flex items-center gap-3"
                style={{
                  padding: "10px 8px",
                  borderBottom: i < recentUsers.length - 1 ? "1px solid #eee" : "none",
                }}
                data-testid={`recent-user-${i}`}
              >
                <div
                  className="flex items-center justify-center font-bold"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: "#eee",
                    color: "#333",
                    fontSize: "0.8rem",
                  }}
                >
                  {u.initial}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#3498db" }}>
                    {u.name}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#888" }}>{u.role}</div>
                </div>
                <div style={{ fontSize: "0.7rem", color: "#bbb" }}>{u.time}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "15px" }}>
            <a
              href="/users"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, "", "/users");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="flex items-center justify-center gap-2 font-bold rounded"
              style={{
                background: "#3498db",
                color: "white",
                padding: "8px 16px",
                fontSize: "0.85rem",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.9")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")
              }
              data-testid="link-manage-users"
            >
              إدارة كافة المستخدمين
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
