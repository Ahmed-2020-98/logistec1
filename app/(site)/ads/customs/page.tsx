"use client";

import { useMemo, useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Card, EmptyState } from "@/components/ui/Card";
import { Select } from "@/components/ui/Field";
import { CustomsAdCard } from "@/components/ads/AdCards";
import { useStore } from "@/lib/store/StoreProvider";
import { SAUDI_PORTS } from "@/lib/constants";

export default function CustomsAdsPage() {
  const { customsAds } = useStore();
  const [port, setPort] = useState("");

  const filtered = useMemo(
    () => customsAds.filter((a) => !port || a.portName === port),
    [customsAds, port],
  );

  return (
    <>
      <PageHero title="إعلانات التخليص" subtitle="شحنات بحاجة إلى تخليص جمركي في موانئ المملكة." icon="clearance" />
      <Container className="py-10">
        <Card className="mb-6 p-4">
          <Select value={port} onChange={(e) => setPort(e.target.value)}>
            <option value="">الميناء: الكل</option>
            {SAUDI_PORTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Card>

        {filtered.length === 0 ? (
          <EmptyState title="لا توجد إعلانات مطابقة" description="جرّب تغيير الميناء." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((ad) => (
              <CustomsAdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
