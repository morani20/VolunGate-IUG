import { useState, useMemo } from "react";
import Layout from "@/components/layout";
import { supervisorNav } from "@/components/nav-config";
import { showPortalAlert } from "@/lib/portal-alert";

type Status = "نشط" | "قيد التوزيع" | "قيد التشكيل" | "مكتمل";
type Team = { name: string; dept: string; voters: number; status: Status; date: string; members: string[] };

const initialTeams: Team[] = [
  { name: "فريق الإحصاء البيئي", dept: "كلية الهندسة", voters: 5, status: "نشط", date: "2026-04-18", members: [] },
  { name: "لجنة التنظيم اللوجستي", dept: "شؤون الطلاب", voters: 12, status: "قيد التشكيل", date: "2026-04-20", members: [] },
  { name: "فريق التوعية الرقمية", dept: "تكنولوجيا المعلومات", voters: 4, status: "مكتمل", date: "2026-04-15", members: [] },
];

const allVolunteers = [
  { sid: "120210456", info: "أحمد سليم الخالدي (120210456) — هندسة البرمجيات" },
  { sid: "120220892", info: "سارة يوسف النجار (120220892) — التمريض" },
  { sid: "120200123", info: "ياسين محمد عودة (120200123) — تكنولوجيا المعلومات" },
  { sid: "120210088", info: "عمر خالد الريس (120210088) — الهندسة المعمارية" },
];

function statusStyle(s: Status): React.CSSProperties {
  if (s === "نشط") return { background: "#e8f5e9", color: "#2e7d32" };
  if (s === "قيد التوزيع") return { background: "#e3f2fd", color: "var(--blue)" };
  if (s === "قيد التشكيل") return { background: "#fff3e0", color: "#ef6c00" };
  return { background: "#fdf2f2", color: "#e74c3c" };
}

export default function SupervisorTeams() {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", dept: "", desc: "" });
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", dept: "", status: "نشط" as Status });
  const [assignIdx, setAssignIdx] = useState<number | null>(null);
  const [modalSearch, setModalSearch] = useState("");

  const filtered = useMemo(() => teams.map((t, i) => ({ t, i })).filter(({ t }) => {
    const q = search.toLowerCase();
    const matchesQ = t.name.toLowerCase().includes(q) || t.dept.toLowerCase().includes(q);
    const matchesS = !statusFilter || t.status === statusFilter;
    return matchesQ && matchesS;
  }), [teams, search, statusFilter]);

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setTeams(ts => [{ name: addForm.name, dept: addForm.dept, voters: 0, status: "نشط", date: new Date().toISOString().split("T")[0], members: [] }, ...ts]);
    showPortalAlert({ title: "تم إنشاء الفريق", message: `تمت إضافة فريق <strong>${addForm.name}</strong> بنجاح إلى قائمة الفرق التطوعية.`, type: "success" });
    setAddForm({ name: "", dept: "", desc: "" });
    setAddOpen(false);
  };

  const openEdit = (i: number) => {
    setEditIdx(i);
    setEditForm({ name: teams[i].name, dept: teams[i].dept, status: teams[i].status });
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIdx === null) return;
    setTeams(ts => ts.map((t, i) => i === editIdx ? { ...t, name: editForm.name, dept: editForm.dept, status: editForm.status } : t));
    setEditIdx(null);
    showPortalAlert({ title: "تم التعديل بنجاح", message: "تم تحديث بيانات الفريق وحفظها بنجاح في السجل.", type: "success" });
  };

  const del = (i: number) => {
    const t = teams[i];
    showPortalAlert({
      title: "حذف الفريق",
      message: `هل أنت متأكد من رغبتك في حذف فريق <strong>${t.name}</strong> نهائياً؟ سيتم حذف جميع بياناته ولا يمكن التراجع.`,
      type: "danger", confirmText: "نعم، احذف", cancelText: "تراجع",
      onConfirm: () => {
        setTeams(ts => ts.filter((_, idx) => idx !== i));
        showPortalAlert({ title: "تم الحذف", message: `تم حذف فريق <strong>${t.name}</strong> بنجاح من سجلات النظام.`, type: "success" });
      },
    });
  };

  const toggleMember = (sid: string) => {
    if (assignIdx === null) return;
    setTeams(ts => ts.map((t, i) => {
      if (i !== assignIdx) return t;
      const has = t.members.includes(sid);
      const newMembers = has ? t.members.filter(s => s !== sid) : [...t.members, sid];
      return { ...t, members: newMembers, voters: Math.max(0, t.voters + (has ? -1 : 1)) };
    }));
  };

  return (
    <Layout nav={supervisorNav} brandTitle="نظام خدمات المتطوعين — إدارة الفرق"
      userName="د. سامي صالح" userRole="مشرف أكاديمي" userInitial="م"
      footerText="نظام إدارة التطوع — الجامعة الإسلامية غزة | بوابة المشرفين">
      <div className="section-header-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span>إدارة فرق العمل التطوعي</span>
          <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600, border: "1px solid rgba(255,255,255,0.3)" }}>
            إجمالي الفرق: <span>{filtered.length}</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-portal btn-portal-green" onClick={() => setAddOpen(true)}>
            <i className="fas fa-plus"></i> إنشاء فريق جديد
          </button>
        </div>
      </div>

      <div className="action-bar">
        <div style={{ fontWeight: 700, color: "#555" }}>متابعة وإدارة فرق التطوع</div>
        <div style={{ flex: 1 }}></div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", padding: "0 10px", borderRadius: 4, background: "#fff" }}>
            <i className="fas fa-search" style={{ color: "#999", fontSize: "0.8rem" }}></i>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="البحث عن فريق..."
              style={{ border: "none", background: "transparent", padding: 8, fontSize: "0.8rem", outline: "none", width: 220 }} />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "7px 10px", border: "1px solid #ddd", borderRadius: 4, fontSize: "0.8rem", outline: "none", background: "#fff" }}>
            <option value="">جميع الحالات</option><option value="نشط">نشط</option><option value="مكتمل">مكتمل</option>
          </select>
        </div>
      </div>

      <div>
      <table className="portal-table">
        <thead>
          <tr>
            <th>اسم الفريق</th><th>القسم / المجال</th><th>عدد المتطوعين</th>
            <th>الحالة</th><th>تاريخ الإنشاء</th><th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(({ t, i }) => (
            <tr key={i}>
              <td style={{ fontWeight: 700 }}>{t.name}</td>
              <td>{t.dept}</td>
              <td>{t.voters} متطوعين</td>
              <td><span className="status-badge" style={{ ...statusStyle(t.status), padding: "4px 8px", borderRadius: 4, fontSize: "0.75rem" }}>{t.status}</span></td>
              <td>{t.date}</td>
              <td>
                <div className="action-cell">
                  <button className="action-icon assign" onClick={() => { setAssignIdx(i); setModalSearch(""); }} title="إضافة متطوعين" aria-label="إضافة متطوعين"><i className="fas fa-user-plus"></i></button>
                  <button className="action-icon edit" onClick={() => openEdit(i)} title="تعديل" aria-label="تعديل"><i className="fas fa-edit"></i></button>
                  <button className="action-icon delete" onClick={() => del(i)} title="حذف" aria-label="حذف"><i className="fas fa-trash"></i></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {addOpen && (
        <div className="modal-overlay" style={{ display: "flex" }}>
          <div className="modal-content">
            <div className="modal-header">
              <span>إنشاء فريق تطوعي جديد</span>
              <i className="fas fa-times" style={{ cursor: "pointer" }} onClick={() => setAddOpen(false)}></i>
            </div>
            <div className="modal-body">
              <form onSubmit={submitAdd}>
                <div className="form-group">
                  <label>اسم الفريق</label>
                  <input type="text" className="form-control" required value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} placeholder="مثلاً: فريق الإرشاد الجامعي" />
                </div>
                <div className="form-group">
                  <label>القسم / الجهة المستفيدة</label>
                  <input type="text" className="form-control" value={addForm.dept}
                    onChange={(e) => setAddForm({ ...addForm, dept: e.target.value })} placeholder="مثلاً: عمادة القبول والتسجيل، العلاقات العامة..." />
                </div>
                <div className="form-group">
                  <label>وصف المهام العامة</label>
                  <textarea className="form-control" rows={3} value={addForm.desc}
                    onChange={(e) => setAddForm({ ...addForm, desc: e.target.value })} placeholder="اكتب وصفاً موجزاً لمهام الفريق..." />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                  <button type="button" className="btn-portal btn-portal-grey" onClick={() => setAddOpen(false)}>إلغاء</button>
                  <button type="submit" className="btn-portal btn-portal-green">حفظ وإنشاء</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {editIdx !== null && (
        <div className="modal-overlay" style={{ display: "flex" }}>
          <div className="modal-content">
            <div className="modal-header">
              <span>تعديل بيانات الفريق</span>
              <i className="fas fa-times" style={{ cursor: "pointer" }} onClick={() => setEditIdx(null)}></i>
            </div>
            <div className="modal-body">
              <form onSubmit={submitEdit}>
                <div className="form-group">
                  <label>اسم الفريق</label>
                  <input type="text" className="form-control" required value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>القسم / المجال</label>
                  <input type="text" className="form-control" value={editForm.dept}
                    onChange={(e) => setEditForm({ ...editForm, dept: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>حالة الفريق</label>
                  <select className="form-control" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Status })}>
                    <option value="نشط">نشط</option>
                    <option value="قيد التوزيع">قيد التوزيع</option>
                    <option value="مكتمل">مكتمل</option>
                  </select>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                  <button type="button" className="btn-portal btn-portal-grey" onClick={() => setEditIdx(null)}>إلغاء</button>
                  <button type="submit" className="btn-portal btn-portal-blue">تحديث البيانات</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {assignIdx !== null && (
        <div className="modal-overlay" style={{ display: "flex" }}>
          <div className="modal-content">
            <div className="modal-header">
              <span>إضافة متطوعين للفريق</span>
              <i className="fas fa-times" style={{ cursor: "pointer" }} onClick={() => setAssignIdx(null)}></i>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: 15, fontWeight: 700, fontSize: "0.9rem" }}>
                الفريق: <span style={{ color: "var(--blue)" }}>{teams[assignIdx]?.name}</span>
              </div>
              <div className="form-group">
                <label>ابحث عن متطوعين</label>
                <input type="text" className="form-control" value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)} placeholder="اسم الطالب أو الرقم الجامعي..." />
              </div>
              <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #eee", borderRadius: 4, marginBottom: 20 }}>
                {allVolunteers.filter(v => v.info.toLowerCase().includes(modalSearch.toLowerCase())).map(v => {
                  const isMember = teams[assignIdx]?.members.includes(v.sid);
                  return (
                    <div key={v.sid} style={{ padding: 10, borderBottom: "1px solid #f9f9f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.85rem" }}>{v.info}</span>
                      <button className={`btn-portal ${isMember ? "btn-portal-red" : "btn-portal-blue"}`}
                        onClick={() => toggleMember(v.sid)} style={{ padding: "2px 8px", fontSize: "0.7rem" }}>
                        {isMember ? "حذف" : "إضافة"}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn-portal btn-portal-grey" onClick={() => setAssignIdx(null)}>إغلاق</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
