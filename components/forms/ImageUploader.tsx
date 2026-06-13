"use client";

import { useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { fileToDataUrl } from "@/lib/utils";

const MAX = 5;
const MAX_BYTES = 1.5 * 1024 * 1024; // keep localStorage usage reasonable

export function ImageUploader({
  value,
  onChange,
  onError,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  onError?: (msg: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const room = MAX - value.length;
    const picked = Array.from(files).slice(0, room);
    const urls: string[] = [];
    for (const f of picked) {
      if (f.size > MAX_BYTES) {
        onError?.("بعض الصور كبيرة جداً (الحد الأقصى 1.5 ميجابايت لكل صورة)");
        continue;
      }
      urls.push(await fileToDataUrl(f));
    }
    onChange([...value, ...urls]);
    if (ref.current) ref.current.value = "";
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((url, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`صورة ${i + 1}`} className="size-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute end-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-red-600 text-white shadow"
              aria-label="حذف الصورة"
            >
              <Icon name="close" className="size-3.5" />
            </button>
          </div>
        ))}

        {value.length < MAX && (
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line text-muted transition-colors hover:border-brand-400 hover:text-brand-600"
          >
            <Icon name="image" className="size-6" />
            <span className="text-xs font-bold">إضافة صورة</span>
          </button>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="mt-2 text-xs text-muted">يمكنك إضافة حتى {MAX} صور.</p>
    </div>
  );
}
