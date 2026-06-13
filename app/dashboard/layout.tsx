import { DashboardShell, type NavItem } from "@/components/layout/DashboardShell";

const NAV: NavItem[] = [
  { href: "/dashboard", label: "نظرة عامة", icon: "dashboard", exact: true },
  { href: "/dashboard/requests", label: "طلباتي", icon: "list" },
  { href: "/dashboard/ads", label: "إعلاناتي", icon: "megaphone" },
  { href: "/dashboard/profile", label: "الملف الشخصي", icon: "user" },
  { href: "/dashboard/change-password", label: "كلمة المرور", icon: "settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="حسابي" items={NAV}>
      {children}
    </DashboardShell>
  );
}
