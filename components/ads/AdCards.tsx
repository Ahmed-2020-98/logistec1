import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Card";
import { GuardedLink } from "@/components/auth/GuardedLink";
import { SALE_KINDS, labelOf } from "@/lib/constants";
import { formatDate, formatPrice, timeAgo } from "@/lib/utils";
import type { CustomsAd, SaleAd, TransportAd } from "@/lib/types";

export const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=70";

function DetailsLink({ href }: { href: string }) {
  return (
    <GuardedLink
      href={href}
      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-100"
    >
      عرض التفاصيل
      <Icon name="arrow" className="size-4" />
    </GuardedLink>
  );
}

function Row({ icon, label, value }: { icon: Parameters<typeof Icon>[0]["name"]; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon name={icon} className="size-4 shrink-0 text-brand-600" />
      <span className="text-muted">{label}:</span>
      <span className="font-bold text-navy-900">{value}</span>
    </div>
  );
}

export function TransportAdCard({ ad }: { ad: TransportAd }) {
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <Badge tone="brand">
          <Icon name="truck" className="size-3.5" /> نقل
        </Badge>
        <span className="text-xs text-muted">{timeAgo(ad.createdAt)}</span>
      </div>
      <div className="mb-3 flex items-center gap-2 text-lg font-extrabold text-navy-900">
        <span>{ad.fromCity}</span>
        <Icon name="arrow" className="size-5 rotate-180 text-accent-500" />
        <span>{ad.toCity}</span>
      </div>
      <div className="space-y-1.5">
        <Row icon="box" label="نوع الحمولة" value={ad.cargoType} />
        <Row icon="scale" label="الوزن" value={ad.weight} />
      </div>
      <div className="mt-4">
        <DetailsLink href={`/ads/transport/${ad.id}`} />
      </div>
    </div>
  );
}

export function CustomsAdCard({ ad }: { ad: CustomsAd }) {
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <Badge tone="accent">
          <Icon name="clearance" className="size-3.5" /> تخليص
        </Badge>
        <span className="text-xs text-muted">{timeAgo(ad.createdAt)}</span>
      </div>
      <h3 className="mb-3 line-clamp-1 flex items-center gap-2 text-lg font-extrabold text-navy-900">
        <Icon name="ship" className="size-5 text-brand-600" />
        {ad.portName}
      </h3>
      <div className="space-y-1.5">
        <Row icon="calendar" label="تاريخ الوصول" value={formatDate(ad.arrivalDate)} />
        <Row icon="container" label="عدد الحاويات" value={`${ad.containersCount} حاوية`} />
      </div>
      <div className="mt-4">
        <DetailsLink href={`/ads/customs/${ad.id}`} />
      </div>
    </div>
  );
}

export function SaleAdCard({ ad }: { ad: SaleAd }) {
  return (
    <GuardedLink
      href={`/ads/sale/${ad.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-900/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ad.images[0] ?? PLACEHOLDER_IMG}
          alt={ad.title}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute end-3 top-3">
          <Badge tone="gold">{labelOf(SALE_KINDS, ad.kind)}</Badge>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-extrabold text-navy-900">{ad.title}</h3>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted">
          <Icon name="pin" className="size-4" />
          {ad.location}
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-extrabold text-brand-700">{formatPrice(ad.price)}</span>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-accent-600">
            التفاصيل
            <Icon name="arrow" className="size-4" />
          </span>
        </div>
      </div>
    </GuardedLink>
  );
}
