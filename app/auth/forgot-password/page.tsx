"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { DEMO_OTP } from "@/lib/constants";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { requestOtp } = useAuth();
  const toast = useToast();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = requestOtp(phone);
    if (!res.ok) return setError(res.error);
    setError("");
    toast(`تم إرسال رمز التحقق (رمز التجربة: ${DEMO_OTP})`, "info");
    router.push("/auth/reset-password");
  }

  return (
    <Card className="p-7">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <Icon name="shield" className="size-7" />
      </div>
      <h1 className="text-2xl font-extrabold text-navy-900">نسيت كلمة المرور</h1>
      <p className="mt-1 text-sm text-muted">
        أدخل رقم الجوال المسجّل وسنرسل لك رمز التحقق لإعادة تعيين كلمة المرور.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Field label="رقم الجوال" required>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="05XXXXXXXX"
            inputMode="tel"
            dir="ltr"
            className="text-start"
          />
        </Field>

        {error && <p className="text-sm font-bold text-red-600">{error}</p>}

        <Button type="submit" size="lg" className="w-full">
          إرسال رمز التحقق
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        <Link href="/auth/login" className="font-bold text-brand-700 hover:underline">
          العودة لتسجيل الدخول
        </Link>
      </p>
    </Card>
  );
}
