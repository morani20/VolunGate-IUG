import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import "@/styles-login.css";

export default function ChangePasswordPage() {
  const [, setLocation] = useLocation();
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [touched, setTouched] = useState<{ o?: boolean; n?: boolean; c?: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  const oldInvalid = touched.o && !oldPwd;
  const newInvalid = touched.n && (newPwd.length < 6);
  const confirmInvalid = touched.c && (confirmPwd !== newPwd || !confirmPwd);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ o: true, n: true, c: true });
    setSuccess(false);
    if (!oldPwd) return setError("يرجى إدخال كلمة المرور الحالية");
    if (newPwd.length < 6) return setError("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
    if (newPwd !== confirmPwd) return setError("كلمتا المرور غير متطابقتين");
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setOldPwd(""); setNewPwd(""); setConfirmPwd("");
      setTouched({});
      setTimeout(() => setLocation("/"), 1400);
    }, 500);
  };

  return (
    <main className="login-card theme-blue">
      <header className="login-header">
        <div className="login-title">
          <i className="fa-solid fa-key"></i>
          <h2>تغيير كلمة المرور</h2>
        </div>
        <p>أدخل كلمة المرور الحالية والجديدة</p>
      </header>

      <section className="login-body">
        <form onSubmit={onSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="oldPwd">كلمة المرور الحالية</label>
            <input
              id="oldPwd"
              type="password"
              className="form-control"
              placeholder="أدخل كلمة المرور الحالية"
              value={oldPwd}
              onChange={(e) => setOldPwd(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, o: true }))}
              autoComplete="current-password"
            />
            {oldInvalid && <span className="field-hint">هذا الحقل مطلوب</span>}
          </div>

          <div className="form-group">
            <label htmlFor="newPwd">كلمة المرور الجديدة</label>
            <input
              id="newPwd"
              type="password"
              className="form-control"
              placeholder="6 أحرف على الأقل"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, n: true }))}
              autoComplete="new-password"
            />
            {newInvalid && <span className="field-hint">يجب 6 أحرف على الأقل</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPwd">تأكيد كلمة المرور الجديدة</label>
            <input
              id="confirmPwd"
              type="password"
              className="form-control"
              placeholder="أعد إدخال كلمة المرور الجديدة"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, c: true }))}
              autoComplete="new-password"
            />
            {confirmInvalid && <span className="field-hint">كلمتا المرور غير متطابقتين</span>}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-check"></i>
                <span>حفظ كلمة المرور</span>
              </>
            )}
          </button>

          {error && (
            <div className="alert-error" style={{ display: "flex" }}>
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="alert-success">
              <i className="fa-solid fa-circle-check"></i>
              <span>تم تغيير كلمة المرور بنجاح. سيتم تحويلك...</span>
            </div>
          )}

          <nav className="back-to-login">
            <Link href="/">
              <i className="fa-solid fa-arrow-right"></i>
              <span>العودة لتسجيل الدخول</span>
            </Link>
          </nav>
        </form>
      </section>
    </main>
  );
}
