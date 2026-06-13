"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import { MAIN_NAV } from "@/lib/constants";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setAcctOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                isActive(item.href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-navy-800 hover:bg-navy-900/5",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/add-ad" className={cn(buttonClass("gold", "sm"), "hidden sm:inline-flex")}>
            <Icon name="plus" className="size-4" />
            أضف إعلان
          </Link>

          {user ? (
            <div className="relative hidden lg:block">
              <button
                onClick={() => setAcctOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm font-bold text-navy-800 hover:bg-navy-900/5"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-brand-600 text-xs font-extrabold text-white">
                  {user.fullName.charAt(0)}
                </span>
                <span className="max-w-28 truncate">{user.fullName}</span>
                <Icon name="chevron" className="size-4" />
              </button>
              {acctOpen && (
                <div className="absolute end-0 mt-2 w-52 overflow-hidden rounded-2xl border border-line bg-white py-1.5 shadow-xl">
                  <AcctLink href="/dashboard" icon="dashboard" label="لوحتي" />
                  <AcctLink href="/dashboard/ads" icon="megaphone" label="إعلاناتي" />
                  <AcctLink href="/dashboard/requests" icon="list" label="طلباتي" />
                  {isAdmin && <AcctLink href="/admin" icon="shield" label="لوحة الإدارة" />}
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Icon name="logout" className="size-4" />
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className={cn(buttonClass("ghost", "sm"), "hidden lg:inline-flex")}>
                دخول
              </Link>
              <Link href="/auth/register" className={cn(buttonClass("primary", "sm"), "hidden lg:inline-flex")}>
                حساب جديد
              </Link>
            </>
          )}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-xl border border-line text-navy-800 lg:hidden"
            aria-label="القائمة"
          >
            <Icon name={menuOpen ? "close" : "menu"} className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="border-t border-line bg-white lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-3">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm font-semibold",
                  isActive(item.href) ? "bg-brand-50 text-brand-700" : "text-navy-800",
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
              {user ? (
                <>
                  <Link href="/dashboard" className={buttonClass("outline", "sm")}>
                    لوحتي
                  </Link>
                  {isAdmin ? (
                    <Link href="/admin" className={buttonClass("primary", "sm")}>
                      لوحة الإدارة
                    </Link>
                  ) : (
                    <button onClick={logout} className={buttonClass("ghost", "sm")}>
                      تسجيل الخروج
                    </button>
                  )}
                </>
              ) : (
                <>
                  <Link href="/auth/login" className={buttonClass("outline", "sm")}>
                    دخول
                  </Link>
                  <Link href="/auth/register" className={buttonClass("primary", "sm")}>
                    حساب جديد
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function AcctLink({ href, icon, label }: { href: string; icon: "dashboard" | "megaphone" | "list" | "shield"; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-navy-800 hover:bg-navy-900/5"
    >
      <Icon name={icon} className="size-4" />
      {label}
    </Link>
  );
}
