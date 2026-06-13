"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Card, Badge, EmptyState } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import { useStore } from "@/lib/store/StoreProvider";
import { AD_CATEGORY_LABELS, SALE_KINDS, labelOf } from "@/lib/constants";
import {
  cn,
  displayPhone,
  formatDate,
  formatPrice,
  telLink,
  timeAgo,
  whatsappLink,
} from "@/lib/utils";
import type { AdCategory } from "@/lib/types";

export function AdDetails() {
  const params = useParams<{ category: string; id: string }>();
  const category = params.category as AdCategory;
  const store = useStore();
  const [activeImg, setActiveImg] = useState(0);

  const ad =
    category === "transport"
      ? store.transportAds.find((a) => a.id === params.id)
      : category === "customs"
        ? store.customsAds.find((a) => a.id === params.id)
        : category === "sale"
          ? store.saleAds.find((a) => a.id === params.id)
          : undefined;

  if (!ad) {
    if (!store.ready) {
      return (
        <Container className="py-20">
          <div className="flex justify-center">
            <div className="size-10 animate-spin rounded-full border-4 border-line border-t-brand-600" />
          </div>
        </Container>
      );
    }
    return (
      <Container className="py-16">
        <EmptyState
          title="الإعلان غير موجود"
          description="ربما تم حذف هذا الإعلان أو أن الرابط غير صحيح."
          action={
            <Link href="/" className={buttonClass("primary", "md")}>
              العودة للرئيسية
            </Link>
          }
        />
      </Container>
    );
  }

  const phone =
    "phone" in ad ? ad.phone : "";
  const title =
    ad.category === "transport"
      ? `نقل من ${ad.fromCity} إلى ${ad.toCity}`
      : ad.category === "customs"
        ? `تخليص بضاعة — ${ad.portName}`
        : ad.title;

  const waMsg = `مرحباً، أنا مهتم بإعلانكم: ${title}`;

  return (
    <Container className="py-8">
      <Link
        href={`/ads/${category}`}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:underline"
      >
        <Icon name="arrow" className="size-4 rotate-180" />
        {AD_CATEGORY_LABELS[category]}
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Gallery (sale) */}
          {ad.category === "sale" && (
            <Card className="overflow-hidden">
              <div className="aspect-[16/10] bg-navy-900/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ad.images[activeImg]} alt={ad.title} className="size-full object-cover" />
              </div>
              {ad.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-3">
                  {ad.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={cn(
                        "size-20 shrink-0 overflow-hidden rounded-lg border-2",
                        i === activeImg ? "border-brand-600" : "border-transparent",
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </Card>
          )}

          <Card className="p-6">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge tone={ad.category === "sale" ? "gold" : ad.category === "customs" ? "accent" : "brand"}>
                {AD_CATEGORY_LABELS[ad.category]}
              </Badge>
              {ad.category === "sale" && <Badge tone="muted">{labelOf(SALE_KINDS, ad.kind)}</Badge>}
              <span className="text-xs text-muted">{timeAgo(ad.createdAt)}</span>
            </div>

            <h1 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">{title}</h1>

            {ad.category === "sale" && (
              <div className="mt-2 text-2xl font-black text-brand-700">{formatPrice(ad.price)}</div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {ad.category === "transport" && (
                <>
                  <Info icon="pin" label="من" value={ad.fromCity} />
                  <Info icon="pin" label="إلى" value={ad.toCity} />
                  <Info icon="box" label="نوع الحمولة" value={ad.cargoType} />
                  {ad.weight && <Info icon="scale" label="الوزن" value={ad.weight} />}
                  {ad.weightWithTrailer && (
                    <Info icon="scale" label="الوزن مع المقطورة" value={ad.weightWithTrailer} />
                  )}
                </>
              )}
              {ad.category === "customs" && (
                <>
                  <Info icon="ship" label="الميناء" value={ad.portName} />
                  <Info icon="calendar" label="تاريخ الوصول" value={formatDate(ad.arrivalDate)} />
                  {ad.containersCount && (
                    <Info icon="container" label="عدد الحاويات" value={`${ad.containersCount} حاوية`} />
                  )}
                  {ad.shipmentType && <Info icon="box" label="نوع الشحنة" value={ad.shipmentType} />}
                  {ad.blNumber && <Info icon="list" label="رقم البوليصة" value={ad.blNumber} />}
                </>
              )}
              {ad.category === "sale" && <Info icon="pin" label="الموقع" value={ad.location} />}
            </div>

            {((ad.category === "customs" && ad.notes) ||
              ((ad.category === "transport" || ad.category === "sale") && ad.description)) && (
              <div className="mt-6">
                <h3 className="mb-2 font-extrabold text-navy-900">التفاصيل</h3>
                <p className="whitespace-pre-line leading-relaxed text-navy-700">
                  {ad.category === "customs" ? ad.notes : ad.description}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Contact sidebar */}
        <div>
          <Card className="sticky top-20 p-6">
            <h3 className="text-lg font-extrabold text-navy-900">تواصل مع المعلن</h3>
            <p className="mt-1 text-sm text-muted">للاستفسار أو الحجز تواصل مباشرة:</p>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-navy-900/5 px-4 py-3" dir="ltr">
              <Icon name="phone" className="size-5 text-brand-600" />
              <span className="font-bold text-navy-900">{displayPhone(phone)}</span>
            </div>

            <div className="mt-4 space-y-3">
              <a
                href={whatsappLink(phone, waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                <Icon name="whatsapp" className="size-5" />
                تواصل عبر واتساب
              </a>
              <a href={telLink(phone)} className={cn(buttonClass("outline", "md"), "w-full")}>
                <Icon name="phone" className="size-5" />
                اتصال هاتفي
              </a>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}

function Info({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-line p-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
        <Icon name={icon} className="size-5" />
      </span>
      <div>
        <div className="text-xs text-muted">{label}</div>
        <div className="font-bold text-navy-900">{value}</div>
      </div>
    </div>
  );
}
