"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { fileToDataUrl } from "@/lib/utils";

export function SingleImageInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  async function pick(file?: File) {
    if (file) onChange(await fileToDataUrl(file));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-line bg-surface">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-muted">
              <Icon name="image" className="size-6" />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm font-bold text-navy-800 hover:bg-navy-900/5"
        >
          <Icon name="image" className="size-4" />
          رفع صورة
        </button>
      </div>
      <Input
        value={value.startsWith("data:") ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="أو ألصق رابط الصورة (https://...)"
        dir="ltr"
        className="text-start"
      />
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
    </div>
  );
}
