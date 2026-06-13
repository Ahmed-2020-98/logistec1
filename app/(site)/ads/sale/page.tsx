"use client";

import { useMemo, useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Card, EmptyState } from "@/components/ui/Card";
import { Select } from "@/components/ui/Field";
import { SaleAdCard } from "@/components/ads/AdCards";
import { useStore } from "@/lib/store/StoreProvider";
import { SALE_KINDS, SAUDI_CITIES } from "@/lib/constants";
import type { SaleKind } from "@/lib/types";

export default function SaleAdsPage() {
  const { saleAds } = useStore();
  const [kind, setKind] = useState<SaleKind | "">("");
  const [location, setLocation] = useState("");

  const filtered = useMemo(
    () =>
      saleAds.filter(
        (a) => (!kind || a.kind === kind) && (!location || a.location === location),
      ),
    [saleAds, kind, location],
  );

  return (
    <>
      <PageHero
        title="بيع الشاحنات والمعدات"
        subtitle="شاحنات ومعدات وسطحات معروضة للبيع من مالكين موثوقين."
        icon="tag"
      />
      <Container className="py-10">
        <Card className="mb-6 flex flex-col gap-3 p-4 sm:flex-row">
          <Select value={kind} onChange={(e) => setKind(e.target.value as SaleKind | "")} className="flex-1">
            <option value="">التصنيف: الكل</option>
            {SALE_KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </Select>
          <Select value={location} onChange={(e) => setLocation(e.target.value)} className="flex-1">
            <option value="">الموقع: الكل</option>
            {SAUDI_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Card>

        {filtered.length === 0 ? (
          <EmptyState title="لا توجد إعلانات مطابقة" description="جرّب تغيير عوامل التصفية." />
        ) : (
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {filtered.map((ad) => (
              <SaleAdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
