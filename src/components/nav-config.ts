import type { NavItem } from "./layout";

export const adminNav: NavItem[] = [
  { href: "/dashboard", icon: "fa-tachometer-alt", label: "الصفحة الرئيسية", section: null },
  { href: "/users", icon: "fa-user-shield", label: "إدارة المستخدمين", section: "لوحة المدير" },
  { href: "/reports", icon: "fa-file-chart-line", label: "التقارير الإدارية", section: null },
  { href: "/settings", icon: "fa-cog", label: "إعدادات النظام", section: null },
];

export const supervisorNav: NavItem[] = [
  { href: "/supervisor", icon: "fa-chart-line", label: "نظرة عامة", section: null },
  { href: "/supervisor/volunteers", icon: "fa-user-plus", label: "إدارة المتطوعين", section: "إدارة المتطوعين" },
  { href: "/supervisor/teams", icon: "fa-users-cog", label: "إدارة الفرق", section: null },
  { href: "/supervisor/tasks", icon: "fa-tasks", label: "توزيع المهام", section: null },
  { href: "/supervisor/reports", icon: "fa-file-invoice", label: "تقارير الفريق", section: null },
];

export const studentNav: NavItem[] = [
  { href: "/student", icon: "fa-home", label: "الرئيسية", section: null },
  { href: "/student/tasks", icon: "fa-tasks", label: "مهامي اليومية", section: "بوابة المتطوع" },
  { href: "/student/reports", icon: "fa-chart-bar", label: "سجل التطوع والتقارير", section: null },
];
