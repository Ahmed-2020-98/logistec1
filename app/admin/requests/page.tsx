"use client";

import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { useStore } from "@/lib/store/StoreProvider";
import { useToast } from "@/components/ui/Toast";
import { describeRequest } from "@/lib/requests";
import { displayPhone, formatDate } from "@/lib/utils";
import type { ServiceRequest } from "@/lib/types";

const HIDE = ["الاسم", "الجوال", "ملاحظات"];

export default function AdminRequestsPage() {
  const store = useStore();
  const toast = useToast();

  async function remove(id: string) {
    if (confirm("حذف هذا الطلب؟")) {
      await store.deleteServiceRequest(id);
      toast("تم حذف الطلب", "info");
    }
  }

  const columns: Column<ServiceRequest>[] = [
    {
      header: "الخدمة",
      cell: (r) => <Badge tone="brand">{describeRequest(r).title}</Badge>,
    },
    {
      header: "التفاصيل",
      cell: (r) => (
        <span className="text-navy-800">
          {describeRequest(r)
            .lines.filter(([l]) => !HIDE.includes(l))
            .map(([, v]) => v)
            .join(" • ")}
        </span>
      ),
    },
    { header: "الاسم", cell: (r) => <span className="font-bold text-navy-900">{r.name}</span> },
    {
      header: "الجوال",
      cell: (r) => (
        <span dir="ltr" className="block text-start">
          {displayPhone(r.mobile)}
        </span>
      ),
    },
    { header: "التاريخ", cell: (r) => <span className="text-muted">{formatDate(r.createdAt)}</span> },
    {
      header: "",
      cell: (r) => (
        <button onClick={() => remove(r.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
          <Icon name="trash" className="size-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-extrabold text-navy-900">طلبات الخدمة</h2>
        <Badge tone="muted">{store.serviceRequests.length}</Badge>
      </div>
      <DataTable columns={columns} rows={store.serviceRequests} empty="لا توجد طلبات" />
    </div>
  );
}
