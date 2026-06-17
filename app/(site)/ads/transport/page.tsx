"use client";

import { useMemo, useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Card, EmptyState } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Select } from "@/components/ui/Field";
import { TransportAdCard } from "@/components/ads/AdCards";
import { useStore } from "@/lib/store/StoreProvider";
import { SAUDI_CITIES } from "@/lib/constants";

export default function TransportAdsPage() {
  const { transportAds, ready } = useStore();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(
    () =>
      transportAds.filter(
        (a) => (!from || a.fromCity === from) && (!to || a.toCity === to),
      ),
    [transportAds, from, to],
  );

  return (
    <>
      <PageHero title="إعلانات النقل" subtitle="حمولات وشاحنات متاحة للنقل داخل المملكة وخارجها." icon="truck" />
      <Container className="py-10">
        <Card className="mb-6 flex flex-col gap-3 p-4 sm:flex-row">
          <FilterSelect label="من مدينة" value={from} onChange={setFrom} />
          <FilterSelect label="إلى مدينة" value={to} onChange={setTo} />
        </Card>

        {!ready ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <EmptyState title="لا توجد إعلانات مطابقة" description="جرّب تغيير عوامل التصفية." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((ad) => (
              <TransportAdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value)} className="flex-1">
      <option value="">{label}: الكل</option>
      {SAUDI_CITIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </Select>
  );
}
