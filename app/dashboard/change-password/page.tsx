"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";

export default function ChangePasswordPage() {
  const { user, changePassword } = useAuth();
  const toast = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  if (!user) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) return setError("كلمتا المرور غير متطابقتين");
    const res = await changePassword(current, next);
    if (!res.ok) return setError(res.error);
    setError("");
    setCurrent("");
    setNext("");
    setConfirm("");
    toast("تم تغيير كلمة المرور بنجاح");
  }

  return (
    <Card className="max-w-lg p-6">
      <h3 className="mb-5 text-lg font-extrabold text-navy-900">تغيير كلمة المرور</h3>
      <form onSubmit={submit} className="space-y-4">
        <Field label="كلمة المرور الحالية" required>
          <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
        <Field label="كلمة المرور الجديدة" required>
          <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="6 أحرف على الأقل" />
        </Field>
        <Field label="تأكيد كلمة المرور الجديدة" required>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
        {error && <p className="text-sm font-bold text-red-600">{error}</p>}
        <Button type="submit">تحديث كلمة المرور</Button>
      </form>
    </Card>
  );
}
