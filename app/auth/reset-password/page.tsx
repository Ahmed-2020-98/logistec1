"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { OtpInput } from "@/components/ui/OtpInput";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { displayPhone } from "@/lib/utils";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { resetPassword, requestOtp, pendingPhone, ready } = useAuth();
  const toast = useToast();

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && !pendingPhone) router.replace("/auth/forgot-password");
  }, [ready, pendingPhone, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) return setError("كلمتا المرور غير متطابقتين");
    const res = await resetPassword(code, password);
    if (!res.ok) return setError(res.error);
    toast("تم تغيير كلمة المرور بنجاح، سجّل الدخول الآن");
    router.push("/auth/login");
  }

  function resend() {
    if (pendingPhone) {
      requestOtp(pendingPhone);
      toast("تم إرسال رمز جديد", "info");
    }
  }

  return (
    <Card className="p-7">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <Icon name="settings" className="size-7" />
      </div>
      <h1 className="text-2xl font-extrabold text-navy-900">إعادة تعيين كلمة المرور</h1>
      <p className="mt-1 text-sm text-muted">
        أدخل رمز التحقق المُرسل إلى{" "}
        <span dir="ltr" className="font-bold text-navy-800">
          {pendingPhone ? displayPhone(pendingPhone) : ""}
        </span>{" "}
        وكلمة المرور الجديدة.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <OtpInput onChange={setCode} />

        <Field label="كلمة المرور الجديدة" required>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6 أحرف على الأقل"
          />
        </Field>
        <Field label="تأكيد كلمة المرور" required>
          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="أعد إدخال كلمة المرور"
          />
        </Field>

        {error && <p className="text-sm font-bold text-red-600">{error}</p>}

        <Button type="submit" size="lg" className="w-full">
          تعيين كلمة المرور
        </Button>
      </form>

      <button
        onClick={resend}
        className="mt-4 block w-full text-center text-sm font-bold text-brand-700 hover:underline"
      >
        إعادة إرسال الرمز
      </button>
    </Card>
  );
}
