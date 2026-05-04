import { useState, useMemo } from "react";
import Layout from "@/components/layout";
import { supervisorNav } from "@/components/nav-config";
import { showPortalAlert } from "@/lib/portal-alert";

type TaskStatus = "ongoing" | "active" | "completed";
type Task = {
  id: number; volunteer: string; title: string; desc: string; time: string;
  status: TaskStatus; stars?: number; completedAt?: string;
};

const initialTasks: Task[] = [
  { id: 1, volunteer: "أحمد سليم الخالدي", title: "إعداد مادة تدريبية عن إعادة التدوير", desc: "تحضير عرض تقديمي يشمل أهمية إعادة التدوير في الحرم الجامعي وطرق فرز النفايات الصحيحة.", time: "09:00 صباحاً", status: "ongoing" },
  { id: 2, volunteer: "سارة يوسف النجار", title: "تنظيم لقاء إرشادي للطلبة المستجدين", desc: "تنسيق القاعة وتوزيع الحقائب التعريفية على الطلاب المشاركين في الفعالية.", time: "11:15 صباحاً", status: "active" },
  { id: 3, volunteer: "أحمد العبد", title: "تنظيم قاعة المؤتمرات (المبنى الإداري)", desc: "تم التأكد من توفر كافة التجهيزات اللوجستية وتوزيع المواد التعريفية.", time: "02:15 مساءً", status: "completed", stars: 4.5, completedAt: "02:15 مساءً" },
];

const volunteers = [
  { name: "أحمد سليم الخالدي", initial: "أ", status: "متاح حالياً", color: "var(--green)" },
  { name: "سارة يوسف النجار", initial: "س", status: "في مهمة", color: "var(--blue)" },
  { name: "ياسين محمد عودة", initial: "ي", status: "متاح حالياً", color: "var(--green)" },
  { name: "عمر خالد الريس", initial: "ع", status: "متاح حالياً", color: "var(--green)" },
];

function statusBadge(s: TaskStatus) {
  if (s === "ongoing") return { text: "قيد التنفيذ", style: { background: "#e3f2fd", color: "var(--blue)" } };
  if (s === "active") return { text: "نشط الآن", style: { background: "#e8f5e9", color: "#2e7d32" } };
  return { text: "تمت بنجاح", style: { background: "#e8f5e9", color: "#2e7d32" } };
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-rating-container" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map(i => (
        <i key={i} className="fas fa-star"
          style={{ color: i <= (hover || value) ? "#f1c40f" : "#ddd", cursor: "pointer" }}
          onMouseOver={() => setHover(i)} onClick={() => onChange(i)} />
      ))}
    </div>
  );
}

export default function SupervisorTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [vSearch, setVSearch] = useState("");
  const [tFeedSearch, setTFeedSearch] = useState("");
  const [tStatusFilter, setTStatusFilter] = useState("");
  const [activeVolunteer, setActiveVolunteer] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState({ volunteer: "", team: "فريق التوجيه الأكاديمي", title: "", desc: "" });
  const [completeFor, setCompleteFor] = useState<Task | null>(null);
  const [evalStars, setEvalStars] = useState(0);
  const [evalHours, setEvalHours] = useState(2);
  const [evalNotes, setEvalNotes] = useState("");

  const filteredVolunteers = volunteers.filter(v => v.name.toLowerCase().includes(vSearch.toLowerCase()));

  const filteredTasks = useMemo(() => tasks.filter(t => {
    const q = tFeedSearch.toLowerCase();
    const matchesQ = t.title.toLowerCase().includes(q) || t.volunteer.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
    const matchesS = !tStatusFilter || t.status === tStatusFilter;
    return matchesQ && matchesS;
  }), [tasks, tFeedSearch, tStatusFilter]);

  const selectVolunteer = (name: string) => {
    setActiveVolunteer(name);
    setTFeedSearch(name);
    setTaskForm(f => ({ ...f, volunteer: name }));
  };

  const openAssign = () => {
    setEditingTask(null);
    setTaskForm({ volunteer: activeVolunteer, team: "فريق التوجيه الأكاديمي", title: "", desc: "" });
    setAssignOpen(true);
  };

  const openEdit = (t: Task) => {
    setEditingTask(t);
    setTaskForm({ volunteer: t.volunteer, team: "فريق التوجيه الأكاديمي", title: t.title, desc: t.desc });
    setAssignOpen(true);
  };

  const submitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      setTasks(ts => ts.map(x => x.id === editingTask.id ? { ...x, volunteer: taskForm.volunteer, title: taskForm.title, desc: taskForm.desc } : x));
    } else {
      const now = new Date();
      const time = `${now.getHours()}:${(now.getMinutes() < 10 ? "0" : "") + now.getMinutes()} ${now.getHours() >= 12 ? "مساءً" : "صباحاً"}`;
      setTasks(ts => [{ id: Date.now(), volunteer: taskForm.volunteer, title: taskForm.title, desc: taskForm.desc, time, status: "ongoing" }, ...ts]);
    }
    setAssignOpen(false);
  };

  const startComplete = (t: Task) => {
    setCompleteFor(t);
    setEvalStars(0);
    setEvalHours(2);
    setEvalNotes("");
  };

  const submitComplete = () => {
    if (!completeFor) return;
    setTasks(ts => ts.map(x => x.id === completeFor.id ? { ...x, status: "completed", stars: evalStars, completedAt: "الآن" } : x));
    setCompleteFor(null);
    showPortalAlert({ title: "تم اعتماد التقييم", message: "تم حفظ تقييم المتطوع وساعات التطوع المستحقة بنجاح.", type: "success" });
  };

  const del = (t: Task) => {
    showPortalAlert({
      title: "حذف المهمة",
      message: `هل أنت متأكد من حذف مهمة <strong>${t.title}</strong>؟`,
      type: "danger", confirmText: "نعم، احذف", cancelText: "تراجع",
      onConfirm: () => {
        setTasks(ts => ts.filter(x => x.id !== t.id));
        showPortalAlert({ title: "تم الحذف", message: "تم حذف المهمة بنجاح.", type: "success" });
      },
    });
  };

  return (
    <Layout nav={supervisorNav} brandTitle="نظام خدمات المتطوعين — توزيع المهام"
      userName="د. سامي صالح" userRole="مشرف أكاديمي" userInitial="م"
      footerText="نظام إدارة التطوع — الجامعة الإسلامية غزة | بوابة المشرفين">
      <style>{`
        .task-card { background: white; border: 1px solid var(--border-color); border-radius: 6px; padding: 15px; margin-bottom: 15px; }
        .star-rating-container { display: flex; gap: 10px; justify-content: center; font-size: 2rem; color: #ddd; cursor: pointer; margin-bottom: 20px; }
        .eval-stars { color: #f1c40f; font-size: 0.8rem; margin-top: 5px; }
        .volunteer-item.active { background: #f0f7ff; border-right: 4px solid var(--blue); }
      `}</style>
      <div className="section-header-bar">
        <span>توزيع الحركات اليومية والمهام</span>
        <button className="btn-portal btn-portal-blue" onClick={openAssign}>
          <i className="fas fa-plus-circle"></i> توزيع مهمة جديدة
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, marginTop: 20 }}>
        <div style={{ background: "white", border: "1px solid var(--border-color)", borderRadius: 4 }}>
          <div style={{ padding: 15, borderBottom: "1px solid var(--border-color)", fontWeight: 700, background: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>قائمة المتطوعين</span>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", padding: "0 8px", borderRadius: 4, background: "#fff", width: 140 }}>
              <i className="fas fa-search" style={{ color: "#999", fontSize: "0.7rem" }}></i>
              <input type="text" value={vSearch} onChange={(e) => setVSearch(e.target.value)} placeholder="بحث..."
                style={{ border: "none", background: "transparent", padding: 5, fontSize: "0.75rem", outline: "none", width: "100%" }} />
            </div>
          </div>
          <div style={{ padding: 10, maxHeight: 500, overflowY: "auto" }}>
            {filteredVolunteers.map(v => (
              <div key={v.name} className={`volunteer-item${activeVolunteer === v.name ? " active" : ""}`}
                onClick={() => selectVolunteer(v.name)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderBottom: "1px solid #eee", cursor: "pointer" }}>
                <div className="navbar-user-avatar" style={{ background: "#eee", color: "#333", width: 35, height: 35 }}>{v.initial}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>{v.name}</div>
                  <div style={{ fontSize: "0.7rem", color: v.color }}>{v.status}</div>
                </div>
                <i className="fas fa-chevron-left" style={{ fontSize: "0.7rem", color: "#ccc" }}></i>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="action-bar" style={{ marginBottom: 15, background: "#f9f9f9", padding: 10, borderRadius: 4, border: "1px solid #eee" }}>
            <div style={{ display: "flex", gap: 10, width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", padding: "0 10px", borderRadius: 4, background: "#fff", flex: 1 }}>
                <i className="fas fa-search" style={{ color: "#999", fontSize: "0.8rem" }}></i>
                <input type="text" value={tFeedSearch} onChange={(e) => setTFeedSearch(e.target.value)}
                  placeholder="البحث في المهام (اسم المتطوع، العنوان...)"
                  style={{ border: "none", background: "transparent", padding: 8, fontSize: "0.8rem", outline: "none", width: "100%" }} />
              </div>
              <select value={tStatusFilter} onChange={(e) => setTStatusFilter(e.target.value)}
                style={{ padding: "7px 10px", border: "1px solid #ddd", borderRadius: 4, fontSize: "0.8rem", outline: "none", background: "#fff", minWidth: 150 }}>
                <option value="">جميع الحالات</option>
                <option value="ongoing">قيد التنفيذ</option>
                <option value="completed">تمت بنجاح</option>
              </select>
            </div>
          </div>

          <div>
            {filteredTasks.map(t => {
              const sb = statusBadge(t.status);
              const isCompleted = t.status === "completed";
              return (
                <div key={t.id} className="task-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "3px 8px", borderRadius: 20, ...sb.style }}>{sb.text}</span>
                      <h4 style={{ margin: "8px 0 4px 0" }}>{t.title}</h4>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "0.75rem", color: "#888" }}>المتطوع: <strong>{t.volunteer}</strong></div>
                      {!isCompleted && <div style={{ fontSize: "0.75rem", color: "#888" }}>تاريخ البدء: <span>{t.time}</span></div>}
                      {isCompleted && t.stars !== undefined && (
                        <div className="eval-stars">
                          {[1, 2, 3, 4, 5].map(i => {
                            if (i <= Math.floor(t.stars!)) return <i key={i} className="fas fa-star"></i>;
                            if (i - 0.5 <= t.stars!) return <i key={i} className="fas fa-star-half-alt"></i>;
                            return <i key={i} className="far fa-star"></i>;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#555", lineHeight: 1.5 }}>{t.desc}</p>
                  {!isCompleted ? (
                    <div style={{ marginTop: 15, display: "flex", justifyContent: "flex-end", gap: 8 }}>
                      <button className="btn-portal btn-portal-green" onClick={() => startComplete(t)} style={{ padding: "5px 12px", fontSize: "0.75rem" }}>إكمال المهمة</button>
                      <button className="btn-portal btn-portal-grey" onClick={() => openEdit(t)} style={{ padding: "5px 12px", fontSize: "0.75rem" }}>تعديل</button>
                      <button className="btn-portal btn-portal-red" onClick={() => del(t)} style={{ padding: "5px 12px", fontSize: "0.75rem", background: "#fdf2f2", color: "#e74c3c", border: "1px solid #fad2d2" }}><i className="fas fa-trash"></i></button>
                    </div>
                  ) : (
                    <div style={{ marginTop: 15, borderTop: "1px solid #eee", paddingTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.75rem", color: "#999" }}>أُنجزت في: {t.completedAt}</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn-portal btn-portal-grey" onClick={() => openEdit(t)} style={{ padding: "4px 10px", fontSize: "0.7rem" }}>تعديل</button>
                        <button className="btn-portal btn-portal-red" onClick={() => del(t)} style={{ padding: "4px 10px", fontSize: "0.7rem", background: "#fdf2f2", color: "#e74c3c" }}><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {assignOpen && (
        <div className="modal-overlay" style={{ display: "flex" }}>
          <div className="modal-content" style={{ width: 600 }}>
            <div className="modal-header">
              <span>{editingTask ? "تعديل المهمة" : "توزيع مهمة يومية جديدة"}</span>
              <i className="fas fa-times" style={{ cursor: "pointer" }} onClick={() => setAssignOpen(false)}></i>
            </div>
            <div className="modal-body">
              <form onSubmit={submitTask}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                  <div className="form-group">
                    <label>المتطوع (يتم الاختيار من القائمة الجانبية)</label>
                    <input type="text" className="form-control" value={taskForm.volunteer}
                      style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }} readOnly placeholder="اختر متطوعاً من القائمة الجانبية..." />
                  </div>
                  <div className="form-group">
                    <label>الفريق التابع له</label>
                    <select className="form-control" value={taskForm.team} onChange={(e) => setTaskForm({ ...taskForm, team: e.target.value })}>
                      <option>فريق التوجيه الأكاديمي</option>
                      <option>فريق العلاقات العامة</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>عنوان المهمة</label>
                  <input type="text" className="form-control" required value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="أدخل عنواناً للمهمة" />
                </div>
                <div className="form-group">
                  <label>تفاصيل المهمة المطلوب تنفيذها</label>
                  <textarea className="form-control" rows={4} value={taskForm.desc}
                    onChange={(e) => setTaskForm({ ...taskForm, desc: e.target.value })} placeholder="اكتب التعليمات والمهام التفصيلية هنا..." />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                  <button type="button" className="btn-portal btn-portal-grey" onClick={() => setAssignOpen(false)}>إلغاء</button>
                  <button type="submit" className="btn-portal btn-portal-blue">حفظ التغييرات</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {completeFor && (
        <div className="modal-overlay" style={{ display: "flex" }}>
          <div className="modal-content" style={{ width: 500 }}>
            <div className="modal-header">
              <span>تقييم أداء المتطوع وإكمال المهمة</span>
              <i className="fas fa-times" style={{ cursor: "pointer" }} onClick={() => setCompleteFor(null)}></i>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <h4 style={{ color: "var(--blue)" }}>{completeFor.title}</h4>
                <p style={{ fontSize: "0.8rem", color: "#666" }}>المتطوع: <span>{completeFor.volunteer}</span></p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                <div className="form-group">
                  <label style={{ textAlign: "center", display: "block" }}>تقييم الأداء (بالنجوم)</label>
                  <StarRating value={evalStars} onChange={setEvalStars} />
                </div>
                <div className="form-group">
                  <label>ساعات التطوع المستحقة</label>
                  <input type="number" className="form-control" value={evalHours} min={1} step={0.5}
                    onChange={(e) => setEvalHours(parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <div className="form-group">
                <label>ملاحظات إضافية على الأداء</label>
                <textarea className="form-control" rows={3} value={evalNotes}
                  onChange={(e) => setEvalNotes(e.target.value)} placeholder="اكتب ملاحظاتك هنا (اختياري)..." />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                <button className="btn-portal btn-portal-grey" onClick={() => setCompleteFor(null)}>إلغاء</button>
                <button className="btn-portal btn-portal-green" onClick={submitComplete}>حفظ واعتماد التقييم</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
