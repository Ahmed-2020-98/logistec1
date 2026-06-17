"use client";

import Link from "next/link";
import { useState } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { useStore } from "@/lib/store/StoreProvider";
import { useToast } from "@/components/ui/Toast";
import { SALE_KINDS, labelOf } from "@/lib/constants";
import { displayPhone, formatDate, formatPrice } from "@/lib/utils";
import type { AdCategory, CustomsAd, SaleAd, TransportAd } from "@/lib/types";

const TABS: { value: AdCategory; label: string }[] = [
  { value: "transport", label: "النقل" },
  { value: "customs", label: "التخليص" },
  { value: "sale", label: "البيع" },
];

export default function AdminAdsPage() {
  const store = useStore();
  const toast = useToast();
  const [tab, setTab] = useState<AdCategory>("transport");

  async function remove(category: AdCategory, id: string) {
    if (confirm("حذف هذا الإعلان؟")) {
      await store.deleteAd(category, id);
      toast("تم حذف الإعلان", "info");
    }
  }

  const actions = (category: AdCategory, id: string) => (
    <div className="flex items-center gap-1">
      <Link href={`/ads/${category}/${id}`} className="rounded-lg p-2 text-brand-700 hover:bg-brand-50">
        <Icon name="search" className="size-4" />
      </Link>
      <button onClick={() => remove(category, id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
        <Icon name="trash" className="size-4" />
      </button>
    </div>
  );

  const transportCols: Column<TransportAd>[] = [
    { header: "من", cell: (a) => <span className="font-bold text-navy-900">{a.fromCity}</span> },
    { header: "إلى", cell: (a) => a.toCity },
    { header: "الحمولة", cell: (a) => a.cargoType },
    { header: "الجوال", cell: (a) => <span dir="ltr" className="block text-start">{displayPhone(a.phone)}</span> },
    { header: "التاريخ", cell: (a) => <span className="text-muted">{formatDate(a.createdAt)}</span> },
    { header: "", cell: (a) => actions("transport", a.id) },
  ];

  const customsCols: Column<CustomsAd>[] = [
    { header: "الميناء", cell: (a) => <span className="font-bold text-navy-900">{a.portName}</span> },
    { header: "تاريخ الوصول", cell: (a) => formatDate(a.arrivalDate) },
    { header: "الحاويات", cell: (a) => `${a.containersCount || "-"}` },
    { header: "الجوال", cell: (a) => <span dir="ltr" className="block text-start">{displayPhone(a.phone)}</span> },
    { header: "التاريخ", cell: (a) => <span className="text-muted">{formatDate(a.createdAt)}</span> },
    { header: "", cell: (a) => actions("customs", a.id) },
  ];

  const saleCols: Column<SaleAd>[] = [
    { header: "العنوان", cell: (a) => <span className="font-bold text-navy-900">{a.title}</span> },
    { header: "التصنيف", cell: (a) => <Badge tone="gold">{labelOf(SALE_KINDS, a.kind)}</Badge> },
    { header: "السعر", cell: (a) => formatPrice(a.price) },
    { header: "الموقع", cell: (a) => a.location },
    { header: "", cell: (a) => actions("sale", a.id) },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-extrabold text-navy-900">الإعلانات</h2>
      </div>

      <div className="mb-4 inline-flex gap-1 rounded-xl bg-white p-1 shadow-[var(--shadow-card)]">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
              tab === t.value ? "bg-brand-600 text-white" : "text-navy-700 hover:bg-navy-900/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "transport" && <DataTable columns={transportCols} rows={store.transportAds} empty="لا توجد إعلانات نقل" />}
      {tab === "customs" && <DataTable columns={customsCols} rows={store.customsAds} empty="لا توجد إعلانات تخليص" />}
      {tab === "sale" && <DataTable columns={saleCols} rows={store.saleAds} empty="لا توجد إعلانات بيع" />}
    </div>
  );
}
