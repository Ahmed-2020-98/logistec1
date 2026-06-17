"use client";

import { useRef, useState } from "react";

// OTP length matches the Authentica template (default 4); override with NEXT_PUBLIC_OTP_LENGTH.
const DEFAULT_OTP_LENGTH = Number(process.env.NEXT_PUBLIC_OTP_LENGTH) || 4;

export function OtpInput({
  length = DEFAULT_OTP_LENGTH,
  onChange,
}: {
  length?: number;
  onChange: (code: string) => void;
}) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function update(next: string[]) {
    setDigits(next);
    onChange(next.join(""));
  }

  function setDigit(i: number, val: string) {
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = v;
    update(next);
    if (v && i < length - 1) inputs.current[i + 1]?.focus();
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  }

  return (
    <div dir="ltr" className="flex justify-center gap-3">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          value={d}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          className="size-14 rounded-xl border border-line bg-white text-center text-2xl font-extrabold text-navy-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      ))}
    </div>
  );
}
