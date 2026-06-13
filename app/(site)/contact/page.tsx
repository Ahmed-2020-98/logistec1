"use client";

import { useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";
import { isValidSaudiPhone, telLink, whatsappLink } from "@/lib/utils";

const CONTACT_PHONE = "+966555000000";

export default function ContactPage() {
  const toast = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return setError("الرجاء تعبئة جميع الحقول");
    if (!isValidSaudiPhone(phone)) return setError("رقم الجوال غير صحيح");
    setError("");
    setName("");
    setPhone("");
    setMessage("");
    toast("تم استلام رسالتك، شكراً لتواصلك معنا");
  }

  return (
    <>
      <PageHero title="تواصل معنا" subtitle="نسعد بخدمتك والإجابة على استفساراتك." icon="phone" />
      <Container className="py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            <ContactItem icon="phone" title="اتصل بنا" value="0555000000" href={telLink(CONTACT_PHONE)} />
            <ContactItem
              icon="whatsapp"
              title="واتساب"
              value="تواصل عبر واتساب"
              href={whatsappLink(CONTACT_PHONE, "مرحباً، لدي استفسار عن خدماتكم")}
            />
            <ContactItem icon="pin" title="العنوان" value="المملكة العربية السعودية — الرياض" />
          </div>

          <Card className="p-6 lg:col-span-2">
            <h2 className="mb-5 text-xl font-extrabold text-navy-900">أرسل لنا رسالة</h2>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="الاسم" required>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" />
                </Field>
                <Field label="رقم الجوال" required>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    inputMode="tel"
                  />
                </Field>
              </div>
              <Field label="الرسالة" required>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="اكتب رسالتك..." />
              </Field>
              {error && <p className="text-sm font-bold text-red-600">{error}</p>}
              <Button type="submit" size="lg">
                إرسال الرسالة
              </Button>
            </form>
          </Card>
        </div>
      </Container>
    </>
  );
}

function ContactItem({
  icon,
  title,
  value,
  href,
}: {
  icon: IconName;
  title: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <Card className="flex items-center gap-4 p-5 transition-shadow hover:shadow-md">
      <span className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon name={icon} className="size-6" />
      </span>
      <div>
        <div className="text-sm text-muted">{title}</div>
        <div className="font-bold text-navy-900">{value}</div>
      </div>
    </Card>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}
