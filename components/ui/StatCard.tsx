import { Icon, type IconName } from "./Icon";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon,
  tone = "brand",
}: {
  label: string;
  value: number | string;
  icon: IconName;
  tone?: "brand" | "accent" | "gold" | "green" | "navy";
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand-50 text-brand-700",
    accent: "bg-accent-500/15 text-accent-600",
    gold: "bg-gold-500/15 text-gold-500",
    green: "bg-emerald-50 text-emerald-700",
    navy: "bg-navy-900/5 text-navy-800",
  };
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)]">
      <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", tones[tone])}>
        <Icon name={icon} className="size-6" />
      </div>
      <div>
        <div className="text-2xl font-extrabold text-navy-900">{value}</div>
        <div className="text-sm text-muted">{label}</div>
      </div>
    </div>
  );
}
