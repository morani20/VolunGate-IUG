import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { ToastProvider } from "@/components/toast-system";

import LoginPage from "@/pages/login";
import ChangePasswordPage from "@/pages/change-password";
import RequestPasswordPage from "@/pages/request-password";
import DashboardPage from "@/pages/dashboard";
import UsersPage from "@/pages/users";
import ReportsPage from "@/pages/reports";
import SettingsPage from "@/pages/settings";
import SupervisorDashboard from "@/pages/supervisor/dashboard";
import SupervisorVolunteers from "@/pages/supervisor/volunteers";
import SupervisorTeams from "@/pages/supervisor/teams";
import SupervisorTasks from "@/pages/supervisor/tasks";
import SupervisorReports from "@/pages/supervisor/reports";
import StudentDashboard from "@/pages/student/dashboard";
import StudentTasks from "@/pages/student/tasks";
import StudentReports from "@/pages/student/reports";

function NotFound() {
  return (
    <div style={{ padding: 40, textAlign: "center", direction: "rtl", fontFamily: "Cairo, sans-serif" }}>
      <h1>404 — الصفحة غير موجودة</h1>
      <a href="/" style={{ color: "#3498db" }}>العودة إلى تسجيل الدخول</a>
    </div>
  );
}

function useGlobalRipple() {
  useEffect(() => {
    const handler = (ev: MouseEvent) => {
      const target = (ev.target as HTMLElement)?.closest(".ripple-host") as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const dot = document.createElement("span");
      dot.className = "ripple-dot";
      dot.style.width = dot.style.height = `${size}px`;
      dot.style.left = `${ev.clientX - rect.left - size / 2}px`;
      dot.style.top = `${ev.clientY - rect.top - size / 2}px`;
      target.appendChild(dot);
      window.setTimeout(() => dot.remove(), 650);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
}

export default function App() {
  useGlobalRipple();
  return (
    <ToastProvider>
      <Switch>
        <Route path="/" component={LoginPage} />
        <Route path="/change-password" component={ChangePasswordPage} />
        <Route path="/request-password" component={RequestPasswordPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/users" component={UsersPage} />
        <Route path="/reports" component={ReportsPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/supervisor" component={SupervisorDashboard} />
        <Route path="/supervisor/volunteers" component={SupervisorVolunteers} />
        <Route path="/supervisor/teams" component={SupervisorTeams} />
        <Route path="/supervisor/tasks" component={SupervisorTasks} />
        <Route path="/supervisor/reports" component={SupervisorReports} />
        <Route path="/student" component={StudentDashboard} />
        <Route path="/student/tasks" component={StudentTasks} />
        <Route path="/student/reports" component={StudentReports} />
        <Route component={NotFound} />
      </Switch>
    </ToastProvider>
  );
}
