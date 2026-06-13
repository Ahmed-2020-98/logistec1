import { DashboardShell, type NavItem } from "@/components/layout/DashboardShell";

const NAV: NavItem[] = [
  { href: "/admin", label: "لوحة التحكم", icon: "dashboard", exact: true },
  { href: "/admin/users", label: "المستخدمون", icon: "users" },
  { href: "/admin/requests", label: "طلبات الخدمة", icon: "list" },
  { href: "/admin/ads", label: "الإعلانات", icon: "megaphone" },
  { href: "/admin/banners", label: "البانرات", icon: "image" },
  { href: "/admin/quick-links", label: "الروابط السريعة", icon: "link" },
  { href: "/admin/cargo-types", label: "أنواع الحمولات", icon: "box" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="لوحة الإدارة" items={NAV} admin>
      {children}
    </DashboardShell>
  );
}
