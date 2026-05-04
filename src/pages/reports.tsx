import { useEffect, useRef, useState } from "react";
import Layout from "@/components/layout";

const stats = [
  {
    title: "إجمالي الساعات المسجلة",
    digits: ["4", "2", "5", "0"],
    footer: "جهود تطوعية طلابية تراكمية",
    color: "#333",
  },
  {
    title: "نسبة الإنجاز الكلية",
    digits: ["8", "5", "%"],
    footer: "اكتمال المهام المسندة خلال الفصل",
    color: "#27ae60",
  },
  {
    title: "الفرق النشطة",
    digits: ["1", "2"],
    footer: "مجموعات عمل طلابية ميدانية",
    color: "#34495e",
  },
];

const progressBars = [
  { label: "مبادرات الطلاب الذاتية", pct: 72, color: "#27ae60" },
  { label: "مبادرات الكليات والأقسام", pct: 88, color: "#3498db" },
];

export default function ReportsPage() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<unknown>(null);
  const [progWidths, setProgWidths] = useState<number[]>([0, 0]);

  useEffect(() => {
    const loadChart = async () => {
      const Chart = (await import("chart.js/auto")).default;
      if (!chartRef.current) return;
      if (chartInstance.current) {
        (chartInstance.current as { destroy: () => void }).destroy();
      }
      chartInstance.current = new Chart(chartRef.current, {
        type: "doughnut",
        data: {
          labels: ["طلاب", "مشرفين", "إداريين"],
          datasets: [
            {
              data: [450, 42, 5],
              backgroundColor: ["#2ecc71", "#3498db", "#e74c3c"],
              borderWidth: 5,
              borderColor: "#ffffff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%",
          animation: {
            duration: 1400,
            easing: "easeOutQuart",
          },
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: { family: "Cairo", size: 12 },
                padding: 20,
              },
            },
          },
        },
      });
    };
    loadChart();

    // Animate progress bars
    const t = setTimeout(() => {
      setProgWidths([72, 88]);
    }, 300);

    return () => {
      clearTimeout(t);
      if (chartInstance.current) {
        (chartInstance.current as { destroy: () => void }).destroy();
      }
    };
  }, []);

  return (
    <Layout>
      {/* Header */}
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
        <span>مؤشرات الأداء الكلية والتقارير التحليلية</span>
        <i className="fas fa-chart-line" />
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
          gap: "15px",
          marginTop: "20px",
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
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 3px 10px rgba(0,0,0,0.12)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 1px 3px rgba(0,0,0,0.07)")
            }
            data-testid={`report-stat-${i}`}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "#3498db",
                borderRadius: "4px 4px 0 0",
              }}
            />
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "#333",
                marginBottom: "15px",
              }}
            >
              {stat.title}
            </div>
            <div className="flex justify-center gap-1 mb-3" style={{ direction: "ltr" }}>
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

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "10px",
        }}
      >
        {/* Doughnut */}
        <div
          style={{
            background: "white",
            border: "1px solid #d2d6de",
            padding: "25px",
          }}
        >
          <h3
            style={{
              fontSize: "0.95rem",
              marginBottom: "25px",
              fontWeight: 800,
              color: "#333",
            }}
          >
            توزيع المستخدمين (Doughnut)
          </h3>
          <div style={{ height: "300px" }}>
            <canvas ref={chartRef} id="roleDoughnut" />
          </div>
        </div>

        {/* Progress bars */}
        <div
          style={{
            background: "white",
            border: "1px solid #d2d6de",
            padding: "25px",
          }}
        >
          <h3
            style={{
              fontSize: "0.95rem",
              marginBottom: "25px",
              fontWeight: 800,
              color: "#333",
            }}
          >
            مؤشر كفاءة البرامج التطوعية
          </h3>

          {progressBars.map((pb, i) => (
            <div key={i} style={{ marginTop: i === 0 ? "40px" : "35px" }}>
              <div
                className="flex justify-between"
                style={{ marginBottom: "12px", fontWeight: 700, fontSize: "0.9rem" }}
              >
                <span style={{ color: "#444" }}>{pb.label}</span>
                <span style={{ color: pb.color }}>{pb.pct}%</span>
              </div>
              <div
                style={{
                  height: "12px",
                  background: "#eee",
                  borderRadius: "6px",
                  overflow: "hidden",
                  border: "1px solid #ddd",
                }}
              >
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${progWidths[i]}%`,
                    height: "100%",
                    background: pb.color,
                    borderRadius: "6px",
                  }}
                  data-testid={`progress-bar-${i}`}
                />
              </div>
            </div>
          ))}

          <div
            className="notes-box"
            style={{
              marginTop: "50px",
              padding: "20px",
              background: "#f8fbff",
              borderRadius: "6px",
              borderRight: "5px solid #3498db",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                color: "#3498db",
                marginBottom: "8px",
              }}
            >
              <i className="fas fa-info-circle" /> ملاحظات إدارية
            </div>
            <p style={{ fontSize: "0.8rem", lineHeight: 1.7, color: "#555" }}>
              يرجى مراجعة المشرفين الذين تقل نسبة إنجاز فرقهم عن 50% لضمان
              جودة المخرجات الميدانية.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
