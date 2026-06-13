import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-sm">
        <Icon name="logo" className="size-6" strokeWidth={2} />
      </span>
      <span className="leading-tight">
        <span
          className={cn(
            "block text-base font-extrabold",
            variant === "light" ? "text-white" : "text-navy-900",
          )}
        >
          منصة الخليج
        </span>
        <span
          className={cn(
            "block text-[11px] font-semibold",
            variant === "light" ? "text-white/70" : "text-muted",
          )}
        >
          للخدمات اللوجستية
        </span>
      </span>
    </Link>
  );
}
