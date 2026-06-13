"use client";

import Link from "next/link";
import { Card, Badge, EmptyState } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import { useStore } from "@/lib/store/StoreProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { describeRequest } from "@/lib/requests";
import { formatDate } from "@/lib/utils";

export default function MyRequestsPage() {
  const { user } = useAuth();
  const store = useStore();
  const toast = useToast();
  if (!user) return null;

  const myRequests = store.serviceRequests.filter((r) => r.userId === user.id);

  function remove(id: string) {
    if (confirm("هل تريد حذف هذا الطلب؟")) {
      store.deleteServiceRequest(id);
      toast("تم حذف الطلب", "info");
    }
  }

  if (myRequests.length === 0) {
    return (
      <EmptyState
        title="لا توجد طلبات"
        description="لم تقم بإرسال أي طلب خدمة بعد."
        action={
          <Link href="/services" className={buttonClass("primary", "md")}>
            اطلب خدمة الآن
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {myRequests.map((r) => {
        const d = describeRequest(r);
        return (
          <Card key={r.id} className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <Badge tone="brand">{d.title}</Badge>
              <span className="text-xs text-muted">{formatDate(r.createdAt)}</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {d.lines.map(([label, value]) => (
                <div key={label} className="text-sm">
                  <span className="text-muted">{label}: </span>
                  <span className="font-bold text-navy-900">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => remove(r.id)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold text-red-600 hover:bg-red-50"
              >
                <Icon name="trash" className="size-4" />
                حذف
              </button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
