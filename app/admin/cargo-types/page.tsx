"use client";

import { useState } from "react";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Field";
import { useStore } from "@/lib/store/StoreProvider";
import { useToast } from "@/components/ui/Toast";
import type { CargoType } from "@/lib/types";

export default function AdminCargoTypesPage() {
  const store = useStore();
  const toast = useToast();
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await store.saveCargoType({ name: name.trim() });
    setName("");
    toast("تمت إضافة نوع الحمولة");
  }

  async function saveEdit(c: CargoType) {
    if (!editName.trim()) return;
    await store.saveCargoType({ id: c.id, name: editName.trim() });
    setEditId(null);
    toast("تم التحديث", "info");
  }

  async function remove(id: string) {
    if (confirm("حذف هذا النوع؟")) {
      await store.deleteCargoType(id);
      toast("تم الحذف", "info");
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-extrabold text-navy-900">أنواع الحمولات</h2>
        <Badge tone="muted">{store.cargoTypes.length}</Badge>
      </div>

      <Card className="mb-4 p-4">
        <form onSubmit={add} className="flex gap-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم نوع الحمولة الجديد" />
          <Button type="submit">
            <Icon name="plus" className="size-4" /> إضافة
          </Button>
        </form>
      </Card>

      <Card className="divide-y divide-line">
        {store.cargoTypes.map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-3 p-4">
            {editId === c.id ? (
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1" />
            ) : (
              <span className="flex items-center gap-2 font-bold text-navy-900">
                <Icon name="box" className="size-4 text-brand-600" />
                {c.name}
              </span>
            )}
            <div className="flex items-center gap-1">
              {editId === c.id ? (
                <Button size="sm" onClick={() => saveEdit(c)}>
                  حفظ
                </Button>
              ) : (
                <button
                  onClick={() => {
                    setEditId(c.id);
                    setEditName(c.name);
                  }}
                  className="rounded-lg p-2 text-brand-700 hover:bg-brand-50"
                >
                  <Icon name="edit" className="size-4" />
                </button>
              )}
              <button onClick={() => remove(c.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                <Icon name="trash" className="size-4" />
              </button>
            </div>
          </div>
        ))}
        {store.cargoTypes.length === 0 && <p className="p-6 text-center text-sm text-muted">لا توجد أنواع.</p>}
      </Card>
    </div>
  );
}
