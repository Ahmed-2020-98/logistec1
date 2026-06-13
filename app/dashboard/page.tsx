"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import { useStore } from "@/lib/store/StoreProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { SERVICE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default function DashboardOverview() {
  const { user } = useAuth();
  const store = useStore();
  if (!user) return null;

  const mine = (uid?: string | null) => uid === user.id;
  const myRequests = store.serviceRequests.filter((r) => mine(r.userId));
  const myTransport = store.transportAds.filter((a) => mine(a.userId));
  const myCustoms = store.customsAds.filter((a) => mine(a.userId));
  const mySale = store.saleAds.filter((a) => mine(a.userId));
  const adsCount = myTransport.length + myCustoms.length + mySale.length;

  return (
    <div className="space-y-6">
      <Card className="flex flex-col items-start justify-between gap-4 bg-gradient-to-l from-navy-900 to-brand-700 p-6 text-white sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold">مرحباً، {user.fullName} 👋</h2>
          <p className="mt-1 text-sm text-white/75">أدر طلباتك وإعلاناتك من مكان واحد.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/services" className="rounded-xl bg-white/15 px-4 py-2.5 text-sm font-bold ring-1 ring-white/20 hover:bg-white/25">
            اطلب خدمة
          </Link>
          <Link href="/add-ad" className="rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-bold text-navy-900 hover:bg-gold-400">
            أضف إعلان
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="طلباتي" value={myRequests.length} icon="list" tone="brand" />
        <StatCard label="إعلانات النقل" value={myTransport.length} icon="truck" tone="accent" />
        <StatCard label="إعلانات التخليص" value={myCustoms.length} icon="clearance" tone="navy" />
        <StatCard label="إعلانات البيع" value={mySale.length} icon="tag" tone="gold" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-extrabold text-navy-900">أحدث طلباتي</h3>
            <Link href="/dashboard/requests" className="text-sm font-bold text-brand-700 hover:underline">
              عرض الكل
            </Link>
          </div>
          {myRequests.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">لا توجد طلبات بعد.</p>
          ) : (
            <ul className="space-y-2">
              {myRequests.slice(0, 4).map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
                  <span className="flex items-center gap-2 text-sm font-bold text-navy-800">
                    <Icon name="list" className="size-4 text-brand-600" />
                    {SERVICE_LABELS[r.type]}
                  </span>
                  <span className="text-xs text-muted">{formatDate(r.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-extrabold text-navy-900">إعلاناتي</h3>
            <Link href="/dashboard/ads" className="text-sm font-bold text-brand-700 hover:underline">
              عرض الكل
            </Link>
          </div>
          {adsCount === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm text-muted">لم تنشر أي إعلان بعد.</p>
              <Link href="/add-ad" className={`${buttonClass("outline", "sm")} mt-3`}>
                أضف إعلانك الأول
              </Link>
            </div>
          ) : (
            <p className="py-6 text-center text-sm font-bold text-navy-800">
              لديك {adsCount} إعلان منشور على المنصة.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
