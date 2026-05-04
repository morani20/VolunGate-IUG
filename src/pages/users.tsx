import { useState } from "react";
import Layout from "@/components/layout";
import { useToast } from "@/components/toast-system";

const initialUsers = [
  {
    id: 1,
    name: "خالد إبراهيم أحمد",
    email: "khalid@iug.edu",
    studentId: "120210055",
    type: "supervisor",
    typeLabel: "مشرف أكاديمي",
    typeColor: "#3498db",
  },
  {
    id: 2,
    name: "منى رياض الحلو",
    email: "mona@iug.edu",
    studentId: "120220889",
    type: "student",
    typeLabel: "طالب متطوع",
    typeColor: "#27ae60",
  },
  {
    id: 3,
    name: "يوسف سامي العمري",
    email: "youssef@iug.edu",
    studentId: "120230112",
    type: "student",
    typeLabel: "طالب متطوع",
    typeColor: "#27ae60",
  },
  {
    id: 4,
    name: "نور الدين سلامة",
    email: "noor@iug.edu",
    studentId: "120210088",
    type: "supervisor",
    typeLabel: "مشرف أكاديمي",
    typeColor: "#3498db",
  },
];

type User = typeof initialUsers[0];

export default function UsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [filterType, setFilterType] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    studentId: "",
    type: "student",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const openEdit = (u: User) => {
    setEditingId(u.id);
    setForm({
      name: u.name,
      email: u.email,
      studentId: u.studentId,
      type: u.type,
    });
  };

  const handleUpdate = () => {
    if (editingId === null) return;
    if (!form.name || !form.email || !form.studentId) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingId
          ? {
              ...u,
              name: form.name,
              email: form.email,
              studentId: form.studentId,
              type: form.type,
              typeLabel: form.type === "student" ? "طالب متطوع" : "مشرف أكاديمي",
              typeColor: form.type === "student" ? "#27ae60" : "#3498db",
            }
          : u
      )
    );
    setEditingId(null);
    setForm({ name: "", email: "", studentId: "", type: "student" });
    toast("تم حفظ التعديلات بنجاح", "success");
  };

  const filteredUsers = users.filter((u) => {
    const matchId = searchId ? u.studentId.includes(searchId) : true;
    const matchType = filterType ? u.type === filterType : true;
    return matchId && matchType;
  });

  const handleAdd = () => {
    if (!form.name || !form.email || !form.studentId) return;
    const newUser: User = {
      id: users.length + 1,
      name: form.name,
      email: form.email,
      studentId: form.studentId,
      type: form.type,
      typeLabel: form.type === "student" ? "طالب متطوع" : "مشرف أكاديمي",
      typeColor: form.type === "student" ? "#27ae60" : "#3498db",
    };
    setUsers((prev) => [...prev, newUser]);
    setForm({ name: "", email: "", studentId: "", type: "student" });
    setShowModal(false);
    toast("تم إضافة المستخدم بنجاح", "success");
  };

  const handleDelete = (id: number) => {
    setDeleteConfirm(null);
    setRemovingId(id);
    window.setTimeout(() => {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setRemovingId(null);
      toast("تم حذف البيانات بنجاح", "danger");
    }, 350);
  };

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
        <span>إدارة كافة حسابات المستخدمين في النظام</span>
        <i className="fas fa-user-friends" />
      </div>

      {/* Action bar */}
      <div
        className="flex items-center flex-wrap gap-3"
        style={{
          background: "white",
          padding: "15px",
          border: "1px solid #d2d6de",
          borderTop: "none",
          marginBottom: "20px",
        }}
      >
        <button
          className="btn-portal flex items-center gap-2 rounded font-bold"
          style={{
            background: "#27ae60",
            color: "white",
            padding: "8px 16px",
            border: "none",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontFamily: "inherit",
          }}
          onClick={() => setShowModal(true)}
          data-testid="button-add-user"
        >
          <i className="fas fa-plus" />
          إضافة مستخدم جديد
        </button>
        <div style={{ flex: 1 }} />
        <div className="flex gap-3 flex-wrap">
          <div
            className="flex items-center rounded"
            style={{ border: "1px solid #ddd", padding: "0 10px", background: "white" }}
          >
            <i className="fas fa-id-badge" style={{ color: "#999", fontSize: "0.8rem" }} />
            <input
              type="text"
              placeholder="الرقم الجامعي..."
              style={{
                border: "none",
                background: "transparent",
                padding: "8px",
                fontSize: "0.8rem",
                outline: "none",
                width: "140px",
                fontFamily: "inherit",
              }}
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              data-testid="input-search-id"
            />
          </div>
          <select
            style={{
              padding: "7px 10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "0.8rem",
              outline: "none",
              background: "white",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            data-testid="select-filter-type"
          >
            <option value="">جميع الحسابات</option>
            <option value="student">طلاب متطوعين</option>
            <option value="supervisor">مشرفين أكاديميين</option>
          </select>
          <button
            className="btn-portal rounded font-bold"
            style={{
              background: "#3498db",
              color: "white",
              padding: "8px 16px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontFamily: "inherit",
            }}
            data-testid="button-filter"
          >
            تصفية
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: "white",
          border: "1px solid #d2d6de",
          borderTop: "none",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
          }}
        >
          <thead>
            <tr>
              {["ID", "الاسم الكامل", "البريد الجامعي", "الرقم الجامعي", "نوع الحساب", "العمليات"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      background: "#f8f9fa",
                      padding: "12px",
                      border: "1px solid #d2d6de",
                      fontSize: "0.85rem",
                      color: "#444",
                      textAlign: "center",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, idx) => (
              <tr
                key={u.id}
                className={`table-row-enter ${removingId === u.id ? "row-removing" : ""}`}
                style={removingId === u.id ? {} : { animationDelay: `${idx * 0.05}s` }}
                data-testid={`row-user-${u.id}`}
              >
                <td style={{ padding: "12px", border: "1px solid #d2d6de", fontSize: "0.85rem", color: "#555", textAlign: "center" }}>
                  {u.id}
                </td>
                <td style={{ padding: "12px", border: "1px solid #d2d6de", fontSize: "0.85rem", color: "#555", fontWeight: 700 }}>
                  {u.name}
                </td>
                <td style={{ padding: "12px", border: "1px solid #d2d6de", fontSize: "0.85rem", color: "#555" }}>
                  {u.email}
                </td>
                <td style={{ padding: "12px", border: "1px solid #d2d6de", fontSize: "0.85rem", color: "#555", textAlign: "center" }}>
                  {u.studentId}
                </td>
                <td style={{ padding: "12px", border: "1px solid #d2d6de", fontSize: "0.85rem", textAlign: "center" }}>
                  <span style={{ color: u.typeColor, fontWeight: 700 }}>{u.typeLabel}</span>
                </td>
                <td style={{ padding: "12px", border: "1px solid #d2d6de", fontSize: "0.85rem", textAlign: "center" }}>
                  <span
                    className="action-icon edit"
                    style={{ color: "#3498db", margin: "0 4px" }}
                    title="تعديل"
                    onClick={() => openEdit(u)}
                    data-testid={`btn-edit-${u.id}`}
                  >
                    <i className="fas fa-edit" />
                  </span>
                  <span
                    className="action-icon delete"
                    style={{ color: "#e74c3c", margin: "0 4px" }}
                    title="حذف"
                    onClick={() => setDeleteConfirm(u.id)}
                    data-testid={`btn-delete-${u.id}`}
                  >
                    <i className="fas fa-trash" />
                  </span>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#aaa",
                    fontSize: "0.85rem",
                  }}
                >
                  لا توجد نتائج مطابقة
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div
          className="flex flex-col items-center gap-4"
          style={{
            padding: "20px 15px",
            borderTop: "1px solid #eee",
            background: "#fafafa",
          }}
        >
          <ul className="flex gap-2" style={{ listStyle: "none", padding: 0, margin: 0, direction: "ltr" }}>
            {["‹", "1", "2", "›"].map((p, i) => (
              <li key={i}>
                <span
                  className="flex items-center justify-center font-bold cursor-pointer"
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #dcdfe3",
                    color: p === "1" ? "white" : "#4a5568",
                    fontSize: "0.8rem",
                    borderRadius: "5px",
                    background: p === "1" ? "#3498db" : "white",
                    borderColor: p === "1" ? "#3498db" : "#dcdfe3",
                    minWidth: "35px",
                    transition: "all 0.2s",
                  }}
                >
                  {p}
                </span>
              </li>
            ))}
          </ul>
          <div style={{ fontSize: "0.75rem", color: "#999", fontWeight: 600 }}>
            عرض سجلات من 1 إلى {filteredUsers.length} من إجمالي {users.length} سجل
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div
          className="modal-enter fixed inset-0 flex items-center justify-center z-[2000]"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
          data-testid="modal-add-user"
        >
          <div
            className="modal-content-enter"
            style={{
              background: "white",
              width: "500px",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              borderTop: "5px solid #3498db",
            }}
          >
            <div
              className="flex justify-between items-center"
              style={{
                padding: "15px 20px",
                background: "#fdfdfd",
                borderBottom: "1px solid #eee",
                fontWeight: 800,
              }}
            >
              <span>إضافة مستخدم جديد</span>
              <i
                className="fas fa-times cursor-pointer"
                style={{ color: "#666", fontSize: "1.1rem", transition: "color 0.2s" }}
                onClick={() => setShowModal(false)}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#e74c3c")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#666")
                }
                data-testid="btn-close-modal"
              />
            </div>
            <div style={{ padding: "25px" }}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
                  الاسم الكامل (رباعي)
                </label>
                <input
                  type="text"
                  className="w-full rounded-md"
                  style={{
                    padding: "10px",
                    border: "1px solid #dcdfe3",
                    fontSize: "0.85rem",
                    outline: "none",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s",
                  }}
                  placeholder="أدخل الاسم الرباعي"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  onFocus={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor = "#3498db")
                  }
                  onBlur={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor = "#dcdfe3")
                  }
                  data-testid="input-new-name"
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  className="w-full rounded-md"
                  style={{
                    padding: "10px",
                    border: "1px solid #dcdfe3",
                    fontSize: "0.85rem",
                    outline: "none",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s",
                  }}
                  placeholder="example@iug.edu"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  onFocus={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor = "#3498db")
                  }
                  onBlur={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor = "#dcdfe3")
                  }
                  data-testid="input-new-email"
                />
              </div>
              <div className="grid grid-cols-2 gap-3" style={{ marginBottom: "15px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
                    نوع الحساب
                  </label>
                  <select
                    className="w-full rounded-md"
                    style={{
                      padding: "10px",
                      border: "1px solid #dcdfe3",
                      fontSize: "0.85rem",
                      outline: "none",
                      fontFamily: "inherit",
                      background: "white",
                    }}
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    data-testid="select-new-type"
                  >
                    <option value="student">طالب متطوع</option>
                    <option value="supervisor">مشرف أكاديمي</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
                    الرقم الجامعي
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md"
                    style={{
                      padding: "10px",
                      border: "1px solid #dcdfe3",
                      fontSize: "0.85rem",
                      outline: "none",
                      fontFamily: "inherit",
                      transition: "border-color 0.2s",
                    }}
                    placeholder="202X-XXXX"
                    value={form.studentId}
                    onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
                    onFocus={(e) =>
                      ((e.target as HTMLInputElement).style.borderColor = "#3498db")
                    }
                    onBlur={(e) =>
                      ((e.target as HTMLInputElement).style.borderColor = "#dcdfe3")
                    }
                    data-testid="input-new-student-id"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  className="btn-portal flex-1 flex items-center justify-center gap-2 rounded font-bold"
                  style={{
                    background: "#3498db",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                  onClick={handleAdd}
                  data-testid="button-save-user"
                >
                  حفظ البيانات
                </button>
                <button
                  className="btn-portal flex-1 flex items-center justify-center gap-2 rounded font-bold"
                  style={{
                    background: "#7f8c8d",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                  onClick={() => setShowModal(false)}
                  data-testid="button-cancel-modal"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingId !== null && (
        <div
          className="modal-enter modal-overlay-enter fixed inset-0 flex items-center justify-center z-[2000]"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingId(null);
          }}
          data-testid="modal-edit-user"
        >
          <div
            className="modal-content-enter"
            style={{
              background: "white",
              width: "500px",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              borderTop: "5px solid #3498db",
            }}
          >
            <div
              className="flex justify-between items-center"
              style={{
                padding: "15px 20px",
                background: "#fdfdfd",
                borderBottom: "1px solid #eee",
                fontWeight: 800,
              }}
            >
              <span>تعديل بيانات المستخدم</span>
              <i
                className="fas fa-times cursor-pointer"
                style={{ color: "#666", fontSize: "1.1rem", transition: "color 0.2s" }}
                onClick={() => setEditingId(null)}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#e74c3c")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#666")
                }
                data-testid="btn-close-edit-modal"
              />
            </div>
            <div style={{ padding: "25px" }}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
                  الاسم الكامل (رباعي)
                </label>
                <input
                  type="text"
                  className="w-full rounded-md"
                  style={{
                    padding: "10px",
                    border: "1px solid #dcdfe3",
                    fontSize: "0.85rem",
                    fontFamily: "inherit",
                  }}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  data-testid="input-edit-name"
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  className="w-full rounded-md"
                  style={{
                    padding: "10px",
                    border: "1px solid #dcdfe3",
                    fontSize: "0.85rem",
                    fontFamily: "inherit",
                  }}
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  data-testid="input-edit-email"
                />
              </div>
              <div className="grid grid-cols-2 gap-3" style={{ marginBottom: "15px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
                    نوع الحساب
                  </label>
                  <select
                    className="w-full rounded-md"
                    style={{
                      padding: "10px",
                      border: "1px solid #dcdfe3",
                      fontSize: "0.85rem",
                      fontFamily: "inherit",
                      background: "white",
                    }}
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    data-testid="select-edit-type"
                  >
                    <option value="student">طالب متطوع</option>
                    <option value="supervisor">مشرف أكاديمي</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "6px" }}>
                    الرقم الجامعي
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md"
                    style={{
                      padding: "10px",
                      border: "1px solid #dcdfe3",
                      fontSize: "0.85rem",
                      fontFamily: "inherit",
                    }}
                    value={form.studentId}
                    onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
                    data-testid="input-edit-student-id"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  className="btn-portal ripple-host flex-1 flex items-center justify-center gap-2 rounded font-bold"
                  style={{
                    background: "#3498db",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontFamily: "inherit",
                  }}
                  onClick={handleUpdate}
                  data-testid="button-update-user"
                >
                  حفظ التعديلات
                </button>
                <button
                  className="btn-portal flex-1 flex items-center justify-center gap-2 rounded font-bold"
                  style={{
                    background: "#7f8c8d",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontFamily: "inherit",
                  }}
                  onClick={() => setEditingId(null)}
                  data-testid="button-cancel-edit"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm !== null && (
        <div
          className="modal-enter fixed inset-0 flex items-center justify-center z-[2000]"
          style={{ background: "rgba(0,0,0,0.5)" }}
          data-testid="modal-delete-confirm"
        >
          <div
            className="modal-content-enter"
            style={{
              background: "white",
              width: "380px",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              borderTop: "5px solid #e74c3c",
            }}
          >
            <div
              style={{
                padding: "15px 20px",
                background: "#fdfdfd",
                borderBottom: "1px solid #eee",
                fontWeight: 800,
              }}
            >
              تأكيد الحذف
            </div>
            <div style={{ padding: "25px" }}>
              <p style={{ marginBottom: "20px", fontSize: "0.9rem", color: "#555" }}>
                هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذه العملية.
              </p>
              <div className="flex gap-3">
                <button
                  className="btn-portal flex-1 rounded font-bold"
                  style={{
                    background: "#e74c3c",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontFamily: "inherit",
                  }}
                  onClick={() => handleDelete(deleteConfirm)}
                  data-testid="button-confirm-delete"
                >
                  نعم، احذف
                </button>
                <button
                  className="btn-portal flex-1 rounded font-bold"
                  style={{
                    background: "#7f8c8d",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontFamily: "inherit",
                  }}
                  onClick={() => setDeleteConfirm(null)}
                  data-testid="button-cancel-delete"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
