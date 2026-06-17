"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useStore } from "@/lib/store/StoreProvider";
import { useToast } from "@/components/ui/Toast";
import { describeRequest } from "@/lib/requests";
import { formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const store = useStore();
  const toast = useToast();

  async function reset() {
    if (confirm("سيتم استرجاع البيانات التجريبية وحذف كل التغييرات. هل أنت متأكد؟")) {
      toast("جارٍ إعادة التعيين...", "info");
      await store.resetDemo();
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="إجمالي المستخدمين" value={store.users.length} icon="users" tone="brand" />
        <StatCard label="طلبات الخدمة" value={store.serviceRequests.length} icon="list" tone="accent" />
        <StatCard label="إعلانات النقل" value={store.transportAds.length} icon="truck" tone="navy" />
        <StatCard label="إعلانات التخليص" value={store.customsAds.length} icon="clearance" tone="green" />
        <StatCard label="إعلانات البيع" value={store.saleAds.length} icon="tag" tone="gold" />
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-extrabold text-navy-900">أحدث طلبات الخدمة</h3>
          <Link href="/admin/requests" className="text-sm font-bold text-brand-700 hover:underline">
            عرض الكل
          </Link>
        </div>
        {store.serviceRequests.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">لا توجد طلبات.</p>
        ) : (
          <ul className="divide-y divide-line">
            {store.serviceRequests.slice(0, 5).map((r) => {
              const d = describeRequest(r);
              return (
                <li key={r.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="list" className="size-4 text-brand-600" />
                    <span className="font-bold text-navy-900">{d.title}</span>
                    <span className="text-muted">— {r.name}</span>
                  </div>
                  <span className="text-xs text-muted">{formatDate(r.createdAt)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card className="flex flex-col items-start justify-between gap-3 p-5 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-extrabold text-navy-900">البيانات التجريبية</h3>
          <p className="text-sm text-muted">إعادة تعيين كل البيانات إلى الحالة الافتراضية.</p>
        </div>
        <Button variant="outline" onClick={reset}>
          <Icon name="settings" className="size-4" />
          إعادة التعيين
        </Button>
      </Card>
    </div>
  );
}
