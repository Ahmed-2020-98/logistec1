"use client";

import { useState } from "react";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/Field";
import { SingleImageInput } from "@/components/forms/SingleImageInput";
import { useStore } from "@/lib/store/StoreProvider";
import { useToast } from "@/components/ui/Toast";
import type { QuickLink } from "@/lib/types";

const EMPTY: QuickLink = { id: "", image: "🔗", title: "", url: "" };

export default function AdminQuickLinksPage() {
  const store = useStore();
  const toast = useToast();
  const [editing, setEditing] = useState<QuickLink | null>(null);

  function save(q: QuickLink) {
    store.saveQuickLink({ ...q, id: q.id || store.newId() });
    toast(q.id ? "تم تحديث الرابط" : "تمت إضافة الرابط");
    setEditing(null);
  }

  function remove(id: string) {
    if (confirm("حذف هذا الرابط؟")) {
      store.deleteQuickLink(id);
      toast("تم حذف الرابط", "info");
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-extrabold text-navy-900">الروابط السريعة</h2>
          <Badge tone="muted">{store.quickLinks.length}</Badge>
        </div>
        <Button size="sm" onClick={() => setEditing(EMPTY)}>
          <Icon name="plus" className="size-4" /> إضافة رابط
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {store.quickLinks.map((q) => {
          const isImage = q.image.startsWith("http") || q.image.startsWith("data:");
          return (
            <Card key={q.id} className="flex flex-col items-center gap-2 p-4 text-center">
              <span className="flex size-14 items-center justify-center overflow-hidden rounded-full bg-surface text-2xl">
                {isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={q.image} alt={q.title} className="size-full object-cover" />
                ) : (
                  q.image
                )}
              </span>
              <span className="text-sm font-bold text-navy-900">{q.title}</span>
              <div className="mt-1 flex gap-1">
                <button onClick={() => setEditing(q)} className="rounded-lg p-1.5 text-brand-700 hover:bg-brand-50">
                  <Icon name="edit" className="size-4" />
                </button>
                <button onClick={() => remove(q.id)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                  <Icon name="trash" className="size-4" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {editing && <QuickLinkModal item={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function QuickLinkModal({
  item,
  onClose,
  onSave,
}: {
  item: QuickLink;
  onClose: () => void;
  onSave: (q: QuickLink) => void;
}) {
  const [form, setForm] = useState<QuickLink>(item);
  const set = (k: keyof QuickLink, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={item.id ? "تعديل رابط" : "إضافة رابط"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
        className="space-y-4"
      >
        <Field label="العنوان" required>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="مثال: منصة فسح" />
        </Field>
        <Field label="الأيقونة (رمز تعبيري) أو صورة">
          <Input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="🛃" />
          <div className="mt-2">
            <SingleImageInput value={form.image.startsWith("http") || form.image.startsWith("data:") ? form.image : ""} onChange={(v) => set("image", v)} />
          </div>
        </Field>
        <Field label="الرابط" required>
          <Input value={form.url} onChange={(e) => set("url", e.target.value)} required placeholder="https://..." dir="ltr" className="text-start" />
        </Field>
        <Button type="submit" className="w-full">
          حفظ
        </Button>
      </form>
    </Modal>
  );
}
