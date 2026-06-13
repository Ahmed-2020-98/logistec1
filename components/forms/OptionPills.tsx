"use client";

import { cn } from "@/lib/utils";

export function OptionPills<T extends string>({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (v: T) => void;
  columns?: 2 | 3 | 4;
}) {
  const cols = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-2 sm:grid-cols-4" }[columns];
  return (
    <div className={cn("grid gap-2", cols)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-sm font-bold transition-all",
              active
                ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                : "border-line bg-white text-navy-800 hover:border-brand-300",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
