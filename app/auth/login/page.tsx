"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { ADMIN_DEMO, USER_DEMO } from "@/lib/seed";
import { displayPhone } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const toast = useToast();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await login(phone, password);
    if (!res.ok) {
      setError(res.error);
      if (res.error.includes("غير مُفعّل")) router.push("/auth/verify-otp");
      return;
    }
    toast("تم تسجيل الدخول بنجاح");
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    router.push(redirect || "/dashboard");
  }

  return (
    <Card className="p-7">
      <h1 className="text-2xl font-extrabold text-navy-900">تسجيل الدخول</h1>
      <p className="mt-1 text-sm text-muted">أدخل رقم جوالك وكلمة المرور للمتابعة</p>

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
        <Field label="كلمة المرور" required>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" />
          <div className="mt-1.5 text-start">
            <Link href="/auth/forgot-password" className="text-sm font-bold text-brand-700 hover:underline">
              نسيت كلمة المرور؟
            </Link>
          </div>
        </Field>

        {error && <p className="text-sm font-bold text-red-600">{error}</p>}

        <Button type="submit" size="lg" className="w-full">
          دخول
        </Button>
      </form>

      {process.env.NODE_ENV !== "production" && (
        <div className="mt-5 rounded-xl bg-navy-900/5 p-4 text-xs text-navy-700">
          <p className="mb-1 font-extrabold">حسابات تجريبية:</p>
          <p>
            مستخدم: <span dir="ltr" className="font-bold">{displayPhone(USER_DEMO.phone)}</span> / {USER_DEMO.password}
          </p>
          <p>
            مدير: <span dir="ltr" className="font-bold">{displayPhone(ADMIN_DEMO.phone)}</span> / {ADMIN_DEMO.password}
          </p>
        </div>
      )}

      <p className="mt-5 text-center text-sm text-muted">
        ليس لديك حساب؟{" "}
        <Link href="/auth/register" className="font-bold text-brand-700 hover:underline">
          أنشئ حساباً جديداً
        </Link>
      </p>
    </Card>
  );
}
