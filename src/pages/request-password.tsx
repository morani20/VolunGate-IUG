import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import "@/styles-login.css";

export default function RequestPasswordPage() {
  const [, setLocation] = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  const invalid = touched && !identifier.trim();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setSuccess(false);
    if (!identifier.trim()) return setError("يرجى إدخال اسم المستخدم أو البريد الإلكتروني");
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setIdentifier("");
      setTouched(false);
      setTimeout(() => setLocation("/"), 1800);
    }, 600);
  };

  return (
    <main className="login-card theme-blue">
      <header className="login-header">
        <div className="login-title">
          <i className="fa-solid fa-envelope-open-text"></i>
          <h2>طلب كلمة المرور</h2>
        </div>
        <p>سيتم إرسال رابط استعادة كلمة المرور إلى بريدك</p>
      </header>

      <section className="login-body">
        <form onSubmit={onSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="identifier">اسم المستخدم أو البريد الإلكتروني</label>
            <input
              id="identifier"
              type="text"
              className="form-control"
              placeholder="أدخل اسم المستخدم أو البريد الإلكتروني"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onBlur={() => setTouched(true)}
              autoComplete="username"
            />
            {invalid && <span className="field-hint">هذا الحقل مطلوب</span>}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>جاري الإرسال...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane"></i>
                <span>إرسال الطلب</span>
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
              <span>تم إرسال الطلب بنجاح. تحقق من بريدك الإلكتروني.</span>
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
