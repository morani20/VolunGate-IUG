import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/layout";
import { adminNav } from "@/components/nav-config";
import { showPortalAlert } from "@/lib/portal-alert";

const cardStyle: React.CSSProperties = { background: "white", border: "1px solid var(--border-color)", padding: 25, marginBottom: 20 };
const titleStyle: React.CSSProperties = { fontSize: "1.1rem", fontWeight: 800, color: "var(--blue)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 };
const rowStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "200px 1fr", alignItems: "center", padding: "15px 0", borderBottom: "1px solid #f5f5f5" };
const labelStyle: React.CSSProperties = { fontWeight: 700, color: "#555", fontSize: "0.9rem" };
const inputStyle: React.CSSProperties = { padding: 10, border: "1px solid #ddd", borderRadius: 4, fontSize: "0.9rem", width: "100%", maxWidth: 400, fontFamily: "inherit" };

export default function SettingsPage() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("IUG VolunGate");
  const [uni, setUni] = useState("الجامعة الإسلامية غزة");
  const [year, setYear] = useState("2025/2026");
  const [color, setColor] = useState("#3498db");
  const [selfReg, setSelfReg] = useState(true);
  const [email, setEmail] = useState("admin@iug.edu");

  const save = () => {
    showPortalAlert({ title: "حفظ الإعدادات", message: "تم حفظ كافة التغييرات على إعدادات النظام والهوية البصرية بنجاح.", type: "success" });
  };

  return (
    <Layout nav={adminNav} brandTitle="نظام خدمات المتطوعين — إعدادات النظام"
      userName="أحمد محمد" userRole="مدير النظام" userInitial="أ">
      <div className="section-header-bar">
        <span>التحكم في إعدادات النظام والهوية البصرية</span>
        <i className="fas fa-tools"></i>
      </div>

      <div style={cardStyle}>
        <div style={titleStyle}><i className="fas fa-university"></i> معلومات المؤسسة التعليمية</div>
        <div style={rowStyle}><div style={labelStyle}>اسم النظام</div><input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div style={rowStyle}><div style={labelStyle}>اسم الجامعة</div><input style={inputStyle} value={uni} onChange={(e) => setUni(e.target.value)} /></div>
        <div style={{ ...rowStyle, borderBottom: "none" }}><div style={labelStyle}>العام الأكاديمي الحالي</div><input style={inputStyle} value={year} onChange={(e) => setYear(e.target.value)} /></div>
      </div>

      <div style={cardStyle}>
        <div style={titleStyle}><i className="fas fa-paint-brush"></i> المظهر والهوية البصرية</div>
        <div style={rowStyle}>
          <div style={labelStyle}>اللون الأساسي للنظام</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 50, height: 35, border: "none", cursor: "pointer" }} />
            <span style={{ fontSize: "0.8rem", color: "#666" }}>سيتم تطبيق اللون على كافة الأزرار والروابط</span>
          </div>
        </div>
        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div style={labelStyle}>شعار النظام (Logo)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ width: 100, height: 100, background: "#f9f9f9", border: "2px dashed #ddd", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
              <i className="fas fa-image" style={{ fontSize: "2rem", color: "#ccc" }}></i>
            </div>
            <button className="btn-portal btn-portal-blue" style={{ width: "max-content", fontSize: "0.75rem" }}
              onClick={() => showPortalAlert({ title: "تغيير الشعار", message: "ميزة رفع الشعار قيد التطوير حالياً.", type: "info" })}>
              تغيير الشعار
            </button>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={titleStyle}><i className="fas fa-shield-alt"></i> إعدادات الأمان والاتصال</div>
        <div style={rowStyle}>
          <div style={labelStyle}>تفعيل التسجيل الذاتي للطلاب</div>
          <div>
            <label style={{ position: "relative", display: "inline-block", width: 45, height: 22 }}>
              <input type="checkbox" checked={selfReg} onChange={(e) => setSelfReg(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: "absolute", cursor: "pointer", inset: 0, background: selfReg ? "var(--blue)" : "#ccc", borderRadius: 34, transition: "background 0.2s" }}>
                <span style={{ position: "absolute", height: 18, width: 18, left: selfReg ? 25 : 2, top: 2, background: "white", borderRadius: "50%", transition: "left 0.2s" }}></span>
              </span>
            </label>
          </div>
        </div>
        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div style={labelStyle}>البريد الإلكتروني للإشعارات</div>
          <input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 15, marginTop: 20 }}>
        <button className="btn-portal btn-portal-blue" style={{ padding: "12px 30px", fontWeight: 800 }} onClick={save}>
          <i className="fas fa-save" style={{ marginLeft: 8 }}></i> حفظ كافة التغييرات
        </button>
        <button className="btn-portal btn-portal-grey" style={{ padding: "12px 30px" }} onClick={() => setLocation("/dashboard")}>إلغاء</button>
      </div>
    </Layout>
  );
}
