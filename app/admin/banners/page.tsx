"use client";

import { useState } from "react";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { SingleImageInput } from "@/components/forms/SingleImageInput";
import { useStore } from "@/lib/store/StoreProvider";
import { useToast } from "@/components/ui/Toast";
import type { Banner } from "@/lib/types";

const EMPTY: Banner = { id: "", image: "", title: "", description: "", buttonText: "", url: "" };

export default function AdminBannersPage() {
  const store = useStore();
  const toast = useToast();
  const [editing, setEditing] = useState<Banner | null>(null);

  async function save(b: Banner) {
    const ok = await store.saveBanner(b);
    if (!ok) return toast("تعذّر حفظ البانر", "error");
    toast(b.id ? "تم تحديث البانر" : "تمت إضافة البانر");
    setEditing(null);
  }

  async function remove(id: string) {
    if (confirm("حذف هذا البانر؟")) {
      await store.deleteBanner(id);
      toast("تم حذف البانر", "info");
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-extrabold text-navy-900">البانرات</h2>
          <Badge tone="muted">{store.banners.length}</Badge>
        </div>
        <Button size="sm" onClick={() => setEditing(EMPTY)}>
          <Icon name="plus" className="size-4" /> إضافة بانر
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {store.banners.map((b) => (
          <Card key={b.id} className="overflow-hidden">
            <div className="aspect-[16/7] bg-navy-900/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {b.image && <img src={b.image} alt={b.title} className="size-full object-cover" />}
            </div>
            <div className="p-4">
              <h3 className="font-extrabold text-navy-900">{b.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{b.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(b)}>
                  <Icon name="edit" className="size-4" /> تعديل
                </Button>
                <Button size="sm" variant="danger" onClick={() => remove(b.id)}>
                  <Icon name="trash" className="size-4" /> حذف
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {editing && <BannerModal banner={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function BannerModal({
  banner,
  onClose,
  onSave,
}: {
  banner: Banner;
  onClose: () => void;
  onSave: (b: Banner) => void;
}) {
  const [form, setForm] = useState<Banner>(banner);
  const set = (k: keyof Banner, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={banner.id ? "تعديل بانر" : "إضافة بانر"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
        className="space-y-4"
      >
        <Field label="الصورة">
          <SingleImageInput value={form.image} onChange={(v) => set("image", v)} />
        </Field>
        <Field label="العنوان" required>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
        </Field>
        <Field label="الوصف">
          <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="نص الزر">
            <Input value={form.buttonText} onChange={(e) => set("buttonText", e.target.value)} placeholder="مثال: اطلب خدمة" />
          </Field>
          <Field label="الرابط">
            <Input value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="/services" dir="ltr" className="text-start" />
          </Field>
        </div>
        <Button type="submit" className="w-full">
          حفظ
        </Button>
      </form>
    </Modal>
  );
}
