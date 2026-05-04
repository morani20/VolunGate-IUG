import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import "@/styles-login.css";
import { showPortalAlert } from "@/lib/portal-alert";

type Role = {
  role: "student" | "supervisor" | "admin";
  title: string;
  desc: string;
  icon: string;
};

const ROLES: Role[] = [
  { role: "student", title: "الطالب / المتطوع", desc: "نظام إدارة العمل التطوعي", icon: "fa-graduation-cap" },
  { role: "supervisor", title: "المشرف", desc: "لوحة تحكم المشرفين", icon: "fa-user-tie" },
  { role: "admin", title: "المدير (الآدمن)", desc: "لوحة تحكم إدارة النظام", icon: "fa-user-shield" },
];

export default function LoginPage() {
  const [selected, setSelected] = useState<Role>(ROLES[0]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<{ u?: boolean; p?: boolean }>({});
  const [, setLocation] = useLocation();
  const boxRef = useRef<HTMLDivElement>(null);
  const userInvalid = touched.u && !username.trim();
  const passInvalid = touched.p && !password.trim();

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ u: true, p: true });
    if (!username.trim() || !password.trim()) {
      setError(true);
      return;
    }
    setError(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (selected.role === "admin") setLocation("/dashboard");
      else if (selected.role === "supervisor") setLocation("/supervisor");
      else setLocation("/student");
    }, 350);
  };

  return (
    <main className="login-card">
      <header className="login-header">
        <div className="login-title">
          <i className="fa-solid fa-shield"></i>
          <h2>تسجيل الدخول</h2>
        </div>
        <p>قم بإدخال اسم المستخدم وكلمة المرور</p>
      </header>

      <section className="login-body">
        <div className="form-group service-select-group">
          <label className="section-label">نوع الحساب</label>
          <div className="selected-service-box" ref={boxRef}>
            <div className="service-info">
              <div className="service-icon">
                <i className={`fa-solid ${selected.icon}`}></i>
              </div>
              <div className="service-text">
                <strong>{selected.title}</strong>
                <span>{selected.desc}</span>
              </div>
            </div>
            <button type="button" className="btn-change" onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}>
              <i className="fa-solid fa-right-left"></i> تغيير
            </button>
            <menu className={`role-dropdown${open ? " active" : ""}`}>
              {ROLES.map(r => (
                <li key={r.role} className={`role-option${selected.role === r.role ? " active" : ""}`}
                    onClick={() => { setSelected(r); setOpen(false); }}>
                  <div className="role-option-icon"><i className={`fa-solid ${r.icon}`}></i></div>
                  <div className="role-option-text">{r.title}</div>
                </li>
              ))}
            </menu>
          </div>
        </div>

        <form id="login-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="username">اسم المستخدم</label>
            <input
              type="text" id="username" className="form-control" placeholder="أدخل اسم المستخدم"
              autoComplete="username" value={username}
              onChange={(e) => { setUsername(e.target.value); if (error) setError(false); }}
              onBlur={() => setTouched(t => ({ ...t, u: true }))}
              aria-invalid={userInvalid || undefined}
            />
            {userInvalid && <div className="field-error"><i className="fas fa-exclamation-circle"></i> اسم المستخدم مطلوب</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">كلمة المرور</label>
            <input
              type="password" id="password" className="form-control" placeholder="أدخل كلمة المرور"
              autoComplete="current-password" value={password}
              onChange={(e) => { setPassword(e.target.value); if (error) setError(false); }}
              onBlur={() => setTouched(t => ({ ...t, p: true }))}
              aria-invalid={passInvalid || undefined}
            />
            {passInvalid && <div className="field-error"><i className="fas fa-exclamation-circle"></i> كلمة المرور مطلوبة</div>}
          </div>

          <nav className="forgot-password">
            <a href="#" onClick={(e) => { e.preventDefault(); setLocation("/change-password"); }}>تغيير كلمة المرور</a> | <a href="#" onClick={(e) => { e.preventDefault(); setLocation("/request-password"); }}>طلب كلمة المرور</a>
          </nav>

          <button type="submit" className="btn-submit" data-loading={loading || undefined} disabled={loading}>
            دخول <i className="fa-solid fa-right-to-bracket fa-flip-horizontal" style={{ marginRight: 5 }}></i>
          </button>

          <div className="alert-error" role="alert" style={{ display: error ? "flex" : "none" }}>
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>خطأ في اسم المستخدم أو كلمة المرور</span>
          </div>
        </form>
      </section>
    </main>
  );
}
