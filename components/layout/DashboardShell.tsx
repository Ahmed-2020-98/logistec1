"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  exact?: boolean;
}

export function DashboardShell({
  title,
  items,
  admin = false,
  children,
}: {
  title: string;
  items: NavItem[];
  admin?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <RequireAuth admin={admin}>
        <Container className="py-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Icon name={admin ? "shield" : "dashboard"} className="size-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-navy-900">{title}</h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            {/* Side nav */}
            <nav className="lg:sticky lg:top-20 lg:self-start">
              <div className="flex gap-2 overflow-x-auto rounded-2xl border border-line bg-white p-2 no-scrollbar lg:flex-col lg:overflow-visible">
                {items.map((item) => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors lg:shrink",
                        active ? "bg-brand-600 text-white shadow-sm" : "text-navy-700 hover:bg-navy-900/5",
                      )}
                    >
                      <Icon name={item.icon} className="size-5" />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="min-w-0">{children}</div>
          </div>
        </Container>
      </RequireAuth>
    </div>
  );
}
