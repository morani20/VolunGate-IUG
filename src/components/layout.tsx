import { useEffect, useState, ReactNode } from "react";
import { useLocation, Link } from "wouter";

export type NavItem = {
  href: string;
  icon: string;
  label: string;
  section?: string | null;
};

export type LayoutProps = {
  children: ReactNode;
  nav?: NavItem[];
  brandTitle?: string;
  brandIcon?: string;
  userName?: string;
  userRole?: string;
  userInitial?: string;
  footerText?: string;
  headerExtra?: ReactNode;
};

const DEFAULT_NAV: NavItem[] = [
  { href: "/dashboard", icon: "fa-tachometer-alt", label: "الصفحة الرئيسية", section: null },
  { href: "/users", icon: "fa-user-shield", label: "إدارة المستخدمين", section: "لوحة المدير" },
  { href: "/reports", icon: "fa-file-chart-line", label: "التقارير الإدارية", section: null },
  { href: "/settings", icon: "fa-cog", label: "إعدادات النظام", section: null },
];

export default function Layout({
  children,
  nav = DEFAULT_NAV,
  brandTitle = "نظام خدمات المتطوعين — الجامعة الإسلامية غزة",
  brandIcon = "fa-hand-holding-heart",
  userName = "أحمد محمد",
  userRole = "مدير النظام",
  userInitial = "أ",
  footerText = "نظام إدارة التطوع — الجامعة الإسلامية غزة",
  headerExtra,
}: LayoutProps) {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = () => setLocation("/");

  return (
    <div style={{ minHeight: "100vh", background: "#ecf0f5", direction: "rtl" }}>
      {/* Top Navbar */}
      <header
        className="fixed top-0 w-full z-[1001] flex items-center justify-between px-4 navbar-responsive"
        style={{
          height: "50px",
          background: "#3498db",
          color: "white",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        <div className="flex items-center gap-3" style={{ fontSize: "0.85rem" }}>
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="القائمة"
            style={{
              display: "none",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "1.3rem",
              cursor: "pointer",
              padding: "4px 8px",
              marginLeft: "4px",
            }}
            data-testid="btn-mobile-menu"
          >
            <i className={`fas ${mobileOpen ? "fa-times" : "fa-bars"}`} />
          </button>
          <div
            className="flex items-center justify-center font-bold"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              fontSize: "0.8rem",
            }}
          >
            {userInitial}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{userName}</div>
            <div style={{ fontSize: "0.7rem", opacity: 0.8 }}>{userRole}</div>
          </div>
          {headerExtra && (
            <>
              <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.25)", margin: "0 4px" }} />
              {headerExtra}
            </>
          )}
        </div>
        <div className="navbar-title" style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "0.5px" }}>
          <i className={`fas ${brandIcon}`} style={{ marginLeft: "8px", opacity: 0.8 }} />
          {brandTitle}
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
            animation: "fadeIn 0.25s ease",
          }}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar-animate sidebar-scroll mobile-sidebar fixed bottom-0 right-0 z-[1000] flex flex-col overflow-y-auto ${mobileOpen ? "mobile-open" : ""}`}
        style={{
          width: "230px",
          background: "#2c3b41",
          top: "50px",
          paddingBottom: "50px",
        }}
      >
        {nav.map((item, idx) => {
          const isActive =
            location === item.href ||
            (item.href !== "/" && item.href.length > 1 && location.startsWith(item.href + "/"));
          return (
            <div key={item.href}>
              {item.section && (
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#597a8a",
                    padding: "12px 15px 4px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {item.section}
                </div>
              )}
              <Link
                href={item.href}
                className="flex items-center justify-between"
                style={{
                  padding: "11px 15px",
                  color: isActive ? "white" : "#b8c7ce",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  transition: "all 0.2s ease",
                  background: isActive ? "#3c8dbc" : "transparent",
                  borderRight: isActive ? "3px solid #5aafde" : "3px solid transparent",
                  animationDelay: `${0.05 + idx * 0.07}s`,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.background = "#1e282c";
                    (e.currentTarget as HTMLAnchorElement).style.color = "white";
                    (e.currentTarget as HTMLAnchorElement).style.borderRightColor = "#5a8fa0";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#b8c7ce";
                    (e.currentTarget as HTMLAnchorElement).style.borderRightColor = "transparent";
                  }
                }}
                data-testid={`nav-${item.href.replace(/\//g, "-")}`}
              >
                <span className="flex items-center gap-2">
                  <i
                    className={`nav-icon fas ${item.icon}`}
                    style={{ width: "18px", textAlign: "center", fontSize: "0.9rem" }}
                  />
                  <span>{item.label}</span>
                </span>
                <i className="fas fa-chevron-left" style={{ fontSize: "0.6rem", opacity: 0.4 }} />
              </Link>
            </div>
          );
        })}

        <div style={{ flex: 1 }} />
        <div style={{ height: "1px", background: "#3d5059", margin: "6px 12px" }} />
        <button
          onClick={handleLogout}
          className="flex items-center justify-between w-full"
          style={{
            padding: "11px 15px",
            color: "#b8c7ce",
            textDecoration: "none",
            fontSize: "0.85rem",
            transition: "all 0.2s ease",
            background: "transparent",
            border: "none",
            borderRight: "3px solid transparent",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#1e282c";
            (e.currentTarget as HTMLButtonElement).style.color = "white";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#b8c7ce";
          }}
          data-testid="btn-logout"
        >
          <span className="flex items-center gap-2">
            <i className="fas fa-sign-out-alt" style={{ color: "#e74c3c", width: "18px", textAlign: "center" }} />
            <span>تسجيل الخروج</span>
          </span>
          <i className="fas fa-chevron-left" style={{ fontSize: "0.6rem", opacity: 0.4 }} />
        </button>
      </aside>

      {/* Content */}
      <div
        key={location}
        className="page-enter page-transition"
        style={{
          marginRight: "230px",
          marginTop: "50px",
          padding: "20px",
          paddingBottom: "65px",
          minHeight: "calc(100vh - 50px)",
        }}
      >
        {children}
      </div>

      {/* Footer */}
      <footer
        className="fixed bottom-0 left-0 right-0 text-center text-white font-bold z-[1002]"
        style={{
          background: "#3498db",
          padding: "10px",
          fontSize: "0.8rem",
        }}
      >
        <i className="fas fa-university" style={{ marginLeft: "8px" }} />
        {footerText}
      </footer>
    </div>
  );
}
