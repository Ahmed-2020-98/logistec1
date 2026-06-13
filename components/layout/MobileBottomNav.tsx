"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import { MOBILE_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 backdrop-blur-md lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {MOBILE_NAV.map((item) => {
          const active = isActive(item.href);
          const isAdd = item.icon === "plus";
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold"
            >
              <span
                className={cn(
                  "flex items-center justify-center rounded-xl transition-colors",
                  isAdd
                    ? "-mt-6 size-12 bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-lg"
                    : "size-7",
                  !isAdd && active ? "text-brand-700" : !isAdd ? "text-muted" : "",
                )}
              >
                <Icon name={item.icon as IconName} className={isAdd ? "size-6" : "size-6"} />
              </span>
              <span className={cn(active ? "text-brand-700" : "text-muted")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
