"use client";

import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { CustomsAdCard, SaleAdCard, TransportAdCard } from "@/components/ads/AdCards";
import { useStore } from "@/lib/store/StoreProvider";

function ViewAll({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800"
    >
      عرض الكل
      <Icon name="arrow" className="size-4" />
    </Link>
  );
}

export function LatestAds() {
  const { transportAds, customsAds, saleAds } = useStore();

  return (
    <div className="bg-surface">
      <section className="py-14">
        <Container>
          <SectionHeading title="أحدث إعلانات النقل" action={<ViewAll href="/ads/transport" />} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {transportAds.slice(0, 4).map((ad) => (
              <TransportAdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-14">
        <Container>
          <SectionHeading title="أحدث إعلانات التخليص" action={<ViewAll href="/ads/customs" />} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {customsAds.slice(0, 3).map((ad) => (
              <CustomsAdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <SectionHeading
            title="أحدث إعلانات البيع"
            subtitle="شاحنات ومعدات وسطحات"
            action={<ViewAll href="/ads/sale" />}
          />
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {saleAds.slice(0, 4).map((ad) => (
              <SaleAdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
