"use client";

import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { useStore } from "@/lib/store/StoreProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { displayPhone, formatDate } from "@/lib/utils";
import type { User } from "@/lib/types";

export default function AdminUsersPage() {
  const store = useStore();
  const { user: me } = useAuth();
  const toast = useToast();

  function toggleRole(u: User) {
    store.updateUser({ ...u, role: u.role === "admin" ? "user" : "admin" });
    toast("تم تحديث صلاحية المستخدم", "info");
  }

  function remove(u: User) {
    if (u.id === me?.id) return toast("لا يمكنك حذف حسابك الحالي", "error");
    if (confirm(`حذف المستخدم "${u.fullName}"؟`)) {
      store.deleteUser(u.id);
      toast("تم حذف المستخدم", "info");
    }
  }

  const columns: Column<User>[] = [
    { header: "الاسم", cell: (u) => <span className="font-bold text-navy-900">{u.fullName}</span> },
    {
      header: "الجوال",
      cell: (u) => (
        <span dir="ltr" className="block text-start">
          {displayPhone(u.phone)}
        </span>
      ),
    },
    {
      header: "الصلاحية",
      cell: (u) =>
        u.role === "admin" ? <Badge tone="brand">مدير</Badge> : <Badge tone="muted">مستخدم</Badge>,
    },
    {
      header: "الحالة",
      cell: (u) =>
        u.isVerified ? <Badge tone="green">موثّق</Badge> : <Badge tone="red">غير مفعّل</Badge>,
    },
    { header: "التسجيل", cell: (u) => <span className="text-muted">{formatDate(u.createdAt)}</span> },
    {
      header: "إجراءات",
      cell: (u) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleRole(u)}
            className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50"
          >
            {u.role === "admin" ? "إلغاء الإدارة" : "تعيين مديراً"}
          </button>
          <button
            onClick={() => remove(u)}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
          >
            <Icon name="trash" className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageTitle title="المستخدمون" count={store.users.length} />
      <DataTable columns={columns} rows={store.users} empty="لا يوجد مستخدمون" />
    </div>
  );
}

function PageTitle({ title, count }: { title: string; count: number }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <h2 className="text-lg font-extrabold text-navy-900">{title}</h2>
      <Badge tone="muted">{count}</Badge>
    </div>
  );
}
