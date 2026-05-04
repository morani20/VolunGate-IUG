import { useState, useMemo } from "react";
import Layout from "@/components/layout";
import { supervisorNav } from "@/components/nav-config";
import { showPortalAlert } from "@/lib/portal-alert";

type Volunteer = {
  id: string; name: string; dept: string; hours: string; level: string; stars: number; status: string;
};

const initial: Volunteer[] = [
  { id: "120210456", name: "أحمد سليم الخالدي", dept: "هندسة البرمجيات", hours: "22 ساعة", level: "مستوى رابع", stars: 4, status: "نشط" },
  { id: "120220892", name: "سارة يوسف النجار", dept: "التمريض", hours: "15 ساعة", level: "مستوى ثالث", stars: 5, status: "نشط" },
  { id: "120200123", name: "ياسين محمد عودة", dept: "تكنولوجيا المعلومات", hours: "30 ساعة", level: "مستوى رابع", stars: 3, status: "نشط" },
];

function Stars({ value }: { value: number }) {
  return (
    <>
      {[1, 2, 3, 4, 5].map(i => (
        <i key={i} className={`${i <= value ? "fas" : "far"} fa-star`} style={{ color: "#f1c40f", fontSize: "0.7rem" }}></i>
      ))}
    </>
  );
}

export default function SupervisorVolunteers() {
  const [list, setList] = useState<Volunteer[]>(initial);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Volunteer | null>(null);
  const [form, setForm] = useState({ name: "", id: "", dept: "تكنولوجيا المعلومات", email: "" });

  const filtered = useMemo(() => list.filter(v => {
    const q = search.toLowerCase();
    const matchesQ = v.name.toLowerCase().includes(q) || v.id.toLowerCase().includes(q);
    const matchesS = !statusFilter || v.status === statusFilter;
    return matchesQ && matchesS;
  }), [list, search, statusFilter]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", id: "", dept: "تكنولوجيا المعلومات", email: "" });
    setShowModal(true);
  };

  const openEdit = (v: Volunteer) => {
    setEditing(v);
    setForm({ name: v.name, id: v.id, dept: v.dept, email: "" });
    setShowModal(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setList(l => l.map(x => x.id === editing.id ? { ...x, name: form.name, id: form.id, dept: form.dept } : x));
      showPortalAlert({ title: "تم التعديل بنجاح", message: "تم حفظ بيانات المتطوع المحدثة بنجاح في السجل.", type: "success" });
    } else {
      setList(l => [{ id: form.id, name: form.name, dept: form.dept, hours: "0 ساعة", level: "مستوى أول", stars: 0, status: "نشط" }, ...l]);
      showPortalAlert({ title: "تم التسجيل بنجاح", message: "تمت إضافة المتطوع الجديد إلى قائمة فريقك بنجاح.", type: "success" });
    }
    setShowModal(false);
  };

  const del = (v: Volunteer) => {
    showPortalAlert({
      title: "حذف المتطوع",
      message: `هل أنت متأكد من رغبتك في حذف <strong>${v.name}</strong> نهائياً من قائمة المتطوعين؟ لا يمكن التراجع عن هذا الإجراء.`,
      type: "danger", confirmText: "نعم، احذف", cancelText: "تراجع",
      onConfirm: () => {
        setList(l => l.filter(x => x.id !== v.id));
        showPortalAlert({ title: "تم الحذف", message: `تم حذف المتطوع <strong>${v.name}</strong> من قائمة الفريق بنجاح.`, type: "success" });
      },
    });
  };

  return (
    <Layout nav={supervisorNav} brandTitle="نظام خدمات المتطوعين — إدارة المتطوعين"
      userName="د. سامي صالح" userRole="مشرف أكاديمي" userInitial="م"
      footerText="نظام إدارة التطوع — الجامعة الإسلامية غزة | بوابة المشرفين">
      <div className="section-header-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span>إدارة وتسجيل المتطوعين الجدد</span>
          <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600, border: "1px solid rgba(255,255,255,0.3)" }}>
            إجمالي المتطوعين: <span>{filtered.length}</span>
          </span>
        </div>
        <button className="btn-portal btn-portal-blue" onClick={openAdd}>
          <i className="fas fa-plus"></i> إضافة متطوع جديد
        </button>
      </div>

      <div className="action-bar">
        <div style={{ fontWeight: 700, color: "#555" }}>قائمة المتطوعين المسجلين في القسم</div>
        <div style={{ flex: 1 }}></div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", padding: "0 10px", borderRadius: 4, background: "#fff" }}>
            <i className="fas fa-search" style={{ color: "#999", fontSize: "0.8rem" }}></i>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="البحث بالاسم أو الرقم..."
              style={{ border: "none", background: "transparent", padding: 8, fontSize: "0.8rem", outline: "none", width: 200 }} />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "7px 10px", border: "1px solid #ddd", borderRadius: 4, fontSize: "0.8rem", outline: "none", background: "#fff" }}>
            <option value="">جميع الحالات</option>
            <option value="متاح">متاح</option>
            <option value="في مهمة">في مهمة</option>
          </select>
        </div>
      </div>

      <div style={{ background: "white", border: "1px solid var(--border-color)" }}>
        <table className="portal-table">
          <thead>
            <tr>
              <th>الرقم الجامعي</th><th>اسم المتطوع</th><th>الكلية/القسم</th>
              <th>ساعات التطوع</th><th>المستوى</th><th>التقييم</th><th>العمليات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id}>
                <td style={{ textAlign: "center" }}>{v.id}</td>
                <td style={{ fontWeight: 700 }}>{v.name}</td>
                <td>{v.dept}</td>
                <td style={{ textAlign: "center" }}>{v.hours}</td>
                <td style={{ textAlign: "center" }}>{v.level}</td>
                <td style={{ textAlign: "center" }}><Stars value={v.stars} /></td>
                <td style={{ textAlign: "center" }}>
                  <div className="action-cell">
                    <button className="action-icon edit" onClick={() => openEdit(v)} title="تعديل" aria-label="تعديل"><i className="fas fa-edit"></i></button>
                    <button className="action-icon delete" onClick={() => del(v)} title="حذف" aria-label="حذف"><i className="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" style={{ display: "flex" }}>
          <div className="modal-content" style={{ width: 550 }}>
            <div className="modal-header">
              <span>{editing ? "تعديل بيانات المتطوع" : "تسجيل متطوع جديد في النظام"}</span>
              <i className="fas fa-times" style={{ cursor: "pointer" }} onClick={() => setShowModal(false)}></i>
            </div>
            <div className="modal-body">
              <form onSubmit={submit}>
                <div className="form-group">
                  <label>الاسم الكامل</label>
                  <input type="text" className="form-control" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="أدخل الاسم الرباعي للطالب" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                  <div className="form-group">
                    <label>الرقم الجامعي</label>
                    <input type="text" className="form-control" required value={form.id}
                      onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="120XXXXXX" />
                  </div>
                  <div className="form-group">
                    <label>الكلية / القسم</label>
                    <select className="form-control" value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })}>
                      <option>تكنولوجيا المعلومات</option><option>الهندسة</option><option>التمريض</option><option>الآداب</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>البريد الإلكتروني الجامعي</label>
                  <input type="email" className="form-control" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="student@email.iugaza.edu" />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                  <button type="button" className="btn-portal btn-portal-grey" onClick={() => setShowModal(false)}>إلغاء</button>
                  <button type="submit" className="btn-portal btn-portal-blue">{editing ? "حفظ التعديلات" : "تسجيل المتطوع"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
