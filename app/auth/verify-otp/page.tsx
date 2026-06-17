"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { OtpInput } from "@/components/ui/OtpInput";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { displayPhone } from "@/lib/utils";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { verifyOtp, requestOtp, pendingPhone, ready } = useAuth();
  const toast = useToast();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && !pendingPhone) router.replace("/auth/register");
  }, [ready, pendingPhone, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await verifyOtp(code);
    if (!res.ok) return setError(res.error);
    toast("تم تفعيل حسابك بنجاح");
    router.push("/dashboard");
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
        <Icon name="phone" className="size-7" />
      </div>
      <h1 className="text-2xl font-extrabold text-navy-900">تأكيد رقم الجوال</h1>
      <p className="mt-1 text-sm text-muted">
        أدخل رمز التحقق المُرسل إلى{" "}
        <span dir="ltr" className="font-bold text-navy-800">
          {pendingPhone ? displayPhone(pendingPhone) : ""}
        </span>
      </p>

      <form onSubmit={submit} className="mt-6">
        <OtpInput onChange={setCode} />

        {error && <p className="mt-4 text-center text-sm font-bold text-red-600">{error}</p>}

        <Button type="submit" size="lg" className="mt-6 w-full">
          تأكيد الرمز
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
