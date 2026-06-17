"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const toast = useToast();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) return setError("كلمتا المرور غير متطابقتين");
    const res = await register({ fullName, phone, password });
    if (!res.ok) return setError(res.error);
    toast("تم إنشاء الحساب، أدخل رمز التحقق");
    router.push("/auth/verify-otp");
  }

  return (
    <Card className="p-7">
      <h1 className="text-2xl font-extrabold text-navy-900">إنشاء حساب جديد</h1>
      <p className="mt-1 text-sm text-muted">سجّل بياناتك للبدء في استخدام المنصة</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Field label="الاسم الكامل" required>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="مثال: أحمد محمد" />
        </Field>
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
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6 أحرف على الأقل" />
        </Field>
        <Field label="تأكيد كلمة المرور" required>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="أعد إدخال كلمة المرور" />
        </Field>

        {error && <p className="text-sm font-bold text-red-600">{error}</p>}

        <Button type="submit" size="lg" className="w-full">
          إنشاء الحساب
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        لديك حساب بالفعل؟{" "}
        <Link href="/auth/login" className="font-bold text-brand-700 hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </Card>
  );
}
