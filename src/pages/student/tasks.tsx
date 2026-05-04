import { useState } from "react";
import Layout from "@/components/layout";
import { studentNav } from "@/components/nav-config";
import { showPortalAlert } from "@/lib/portal-alert";

type TaskStatus = "new" | "in_progress" | "completed";

type Task = {
  id: string;
  title: string;
  description: string;
  supervisor: string;
  dueDate: string;
  hours: string;
  hoursLabel: string;
  status: TaskStatus;
  notes?: string;
};

const INITIAL_TASKS: Task[] = [
  {
    id: "TSK-105",
    title: "تحديث بيانات الخريجين في النظام",
    description: "يرجى الدخول إلى نظام شؤون الخريجين وتحديث بيانات التواصل للدفعة الأخيرة.",
    supervisor: "د. محمود خليل",
    dueDate: "25 أكتوبر 2023",
    hours: "3 ساعات",
    hoursLabel: "الساعات المقدرة:",
    status: "in_progress",
  },
  {
    id: "TSK-106",
    title: "مراجعة ملفات المنح الدراسية",
    description: "مراجعة أوراق المتقدمين لمنحة الامتياز والتأكد من استيفاء الشروط.",
    supervisor: "د. محمود خليل",
    dueDate: "26 أكتوبر 2023",
    hours: "2 ساعات",
    hoursLabel: "الساعات المقدرة:",
    status: "new",
  },
  {
    id: "TSK-101",
    title: "ترتيب أرشيف المكتبة المركزية",
    description: "إعادة ترتيب الكتب في قسم العلوم التطبيقية.",
    supervisor: "أ. سعيد المصري",
    dueDate: "20 أكتوبر 2023",
    hours: "4 ساعات",
    hoursLabel: "الساعات المعتمدة:",
    status: "completed",
    notes: "تم الانتهاء من ترتيب الرفوف من 1 إلى 5 بالكامل وجرد الكتب التالفة.",
  },
];

const STATUS_LABELS: Record<TaskStatus, string> = {
  new: "جديدة",
  in_progress: "قيد التنفيذ",
  completed: "مكتملة",
};

const FILTER_OPTIONS = [
  { value: "", label: "جميع الحالات" },
  { value: "new", label: "جديدة" },
  { value: "in_progress", label: "قيد التنفيذ" },
  { value: "completed", label: "مكتملة" },
];

function StatusBadge({ status }: { status: TaskStatus }) {
  if (status === "in_progress") return <span className="status-badge status-active">قيد التنفيذ</span>;
  if (status === "completed") return <span className="status-badge status-inactive">مكتملة</span>;
  return <span className="status-badge" style={{ background: "#f1c40f", color: "#fff" }}>جديدة</span>;
}

export default function StudentTasks() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTaskId, setModalTaskId] = useState("");
  const [completionNotes, setCompletionNotes] = useState("");

  const filtered = filter ? tasks.filter((t) => t.status === filter) : tasks;

  const openModal = (taskId: string) => {
    setModalTaskId("#" + taskId);
    setCompletionNotes("");
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const submitComplete = () => {
    if (!completionNotes.trim()) {
      showPortalAlert({
        title: "تنبيه",
        message: "يرجى كتابة تفاصيل الإنجاز قبل التأكيد. هذا الحقل إلزامي.",
        type: "warning",
      });
      return;
    }
    closeModal();
    const cleanId = modalTaskId.replace("#", "");
    setTasks((prev) =>
      prev.map((t) =>
        t.id === cleanId
          ? { ...t, status: "completed" as TaskStatus, notes: completionNotes.trim() }
          : t
      )
    );
    showPortalAlert({
      title: "تم الإنجاز بنجاح",
      message: "تم إرسال تفاصيل الإنجاز والملاحظات للمشرف بانتظار الاعتماد وتوثيق الساعات.",
      type: "success",
    });
  };

  const startTask = (taskId: string) => {
    showPortalAlert({
      title: "البدء في التنفيذ",
      message: 'هل أنت متأكد من بدء تنفيذ هذه المهمة الآن؟ سيتم تغيير حالتها إلى "قيد التنفيذ".',
      type: "info",
      confirmText: "نعم، ابدأ",
      cancelText: "إلغاء",
      onConfirm: () => {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: "in_progress" as TaskStatus } : t))
        );
        showPortalAlert({
          title: "تم التحديث",
          message: 'تم تحديث حالة المهمة إلى "قيد التنفيذ". بالتوفيق!',
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
        <span><i className="fas fa-tasks" style={{ marginLeft: 8 }} />إدارة المهام اليومية</span>
        <i className="fas fa-sliders-h" />
      </div>

      <div className="chart-container-enter" style={{ background: "white", border: "1px solid var(--border-color)", marginTop: 15 }}>
        <div style={{ padding: 15, borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <h3 style={{ fontSize: "1rem", color: "#333", margin: 0 }}>قائمة المهام الموكلة إليك</h3>
          <select
            className="form-control"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: "5px 10px", width: "auto", fontSize: "0.85rem" }}
          >
            {FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div style={{ padding: 15 }}>
          {filtered.map((task, idx) => (
            <div
              key={task.id}
              className="stat-card-hover"
              style={{
                border: "1px solid #eee",
                borderRadius: 5,
                marginBottom: 15,
                padding: 15,
                background: task.status === "completed" ? "#fff" : "#fafafa",
                opacity: task.status === "completed" ? 0.8 : 1,
                animation: `softPop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both`,
                animationDelay: `${0.05 + idx * 0.1}s`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontWeight: "bold", color: "var(--blue)" }}>#{task.id}</span>
                  <h4 style={{ margin: 0, fontSize: "1.1rem" }}>{task.title}</h4>
                </div>
                <StatusBadge status={task.status} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 15, fontSize: "0.9rem" }}>
                <div>
                  <p style={{ margin: "5px 0" }}><strong>وصف المهمة:</strong> {task.description}</p>
                  <p style={{ margin: "5px 0" }}><strong>المشرف:</strong> {task.supervisor}</p>
                </div>
                <div>
                  <p style={{ margin: "5px 0" }}><i className="fas fa-calendar-alt" style={{ color: "#888" }} /> <strong>تاريخ الاستحقاق:</strong> {task.dueDate}</p>
                  <p style={{ margin: "5px 0" }}><i className="fas fa-clock" style={{ color: "#888" }} /> <strong>{task.hoursLabel}</strong> {task.hours}</p>
                </div>
              </div>

              <div style={{ borderTop: "1px dashed #ccc", paddingTop: 15, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                {task.status === "in_progress" && (
                  <button className="btn-portal btn-portal-green ripple-host btn-shine" onClick={() => openModal(task.id)}>
                    <i className="fas fa-check-circle" style={{ marginLeft: 5 }} /> إنجاز وإضافة تفاصيل
                  </button>
                )}
                {task.status === "new" && (
                  <button className="btn-portal btn-portal-blue ripple-host btn-shine" onClick={() => startTask(task.id)}>
                    <i className="fas fa-play" style={{ marginLeft: 5 }} /> البدء في التنفيذ
                  </button>
                )}
                {task.status === "completed" && task.notes && (
                  <div style={{ background: "#e8f6f3", padding: 10, borderRadius: 4, borderRight: "3px solid var(--green)", fontSize: "0.85rem", width: "100%" }}>
                    <strong>{task.notes.startsWith("جاري") ? "تم التسليم:" : "ملاحظات التنفيذ (منك):"}</strong> {task.notes}
                  </div>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#999", fontSize: "0.9rem" }}>
              <i className="fas fa-inbox" style={{ fontSize: "2rem", marginBottom: 10, display: "block", opacity: 0.4 }} />
              لا توجد مهام تطابق الفلتر المحدد
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div
          className="modal-overlay-enter"
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)", zIndex: 2000,
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(3px)",
          }}
          onClick={closeModal}
        >
          <div
            className="modal-content-enter"
            style={{
              background: "white", width: 500, maxWidth: "94vw", borderRadius: 8,
              overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              borderTop: "5px solid var(--blue)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "15px 20px", background: "#fdfdfd", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.2rem", color: "#333", margin: 0, fontWeight: 800 }}>إنجاز المهمة وإضافة التفاصيل</h2>
              <button
                onClick={closeModal}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#888", transition: "color 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#e74c3c"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#888"; }}
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <div style={{ padding: 25 }}>
              <div className="form-group">
                <label className="form-label" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: 6 }}>رقم المهمة</label>
                <input type="text" className="form-control" value={modalTaskId} disabled style={{ background: "#f5f5f5" }} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: 6 }}>تفاصيل الإنجاز / ملاحظات (إلزامي)</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="اكتب بالتفصيل ما تم إنجازه، وأي ملاحظات تود إرسالها للمشرف..."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                />
                <small style={{ color: "#666", fontSize: "0.75rem", display: "block", marginTop: 5 }}>
                  <i className="fas fa-info-circle" /> هذه التفاصيل سيطلع عليها المشرف لاعتماد ساعاتك التطوعية.
                </small>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: 6 }}>مرفقات (اختياري)</label>
                <input type="file" className="form-control" style={{ padding: 8 }} />
              </div>
            </div>
            <div style={{ padding: "15px 25px 25px", display: "flex", gap: 10, justifyContent: "flex-end", borderTop: "1px solid #eee", background: "#fdfdfd" }}>
              <button className="btn-portal btn-portal-red ripple-host" onClick={closeModal}>إلغاء</button>
              <button className="btn-portal btn-portal-green ripple-host btn-shine" onClick={submitComplete}>تأكيد الإنجاز</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
