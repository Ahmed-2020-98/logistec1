"use client";

import { useState } from "react";
import { Card, Badge } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { displayPhone, formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user ? displayPhone(user.phone) : "");
  const [error, setError] = useState("");

  if (!user) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = updateProfile({ fullName, phone });
    if (!res.ok) return setError(res.error);
    setError("");
    toast("تم تحديث الملف الشخصي");
  }

  return (
    <div className="space-y-6">
      <Card className="flex items-center gap-4 p-6">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-black text-white">
          {user.fullName.charAt(0)}
        </span>
        <div>
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-navy-900">
            {user.fullName}
            {user.isVerified && (
              <Badge tone="green">
                <Icon name="check" className="size-3.5" /> موثّق
              </Badge>
            )}
          </h2>
          <p className="text-sm text-muted">عضو منذ {formatDate(user.createdAt)}</p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-5 text-lg font-extrabold text-navy-900">تعديل البيانات</h3>
        <form onSubmit={submit} className="space-y-4">
          <Field label="الاسم الكامل" required>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Field>
          <Field label="رقم الجوال" required>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" className="text-start" inputMode="tel" />
          </Field>
          {error && <p className="text-sm font-bold text-red-600">{error}</p>}
          <Button type="submit">حفظ التغييرات</Button>
        </form>
      </Card>
    </div>
  );
}
