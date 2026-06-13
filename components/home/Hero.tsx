"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { buttonClass } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useStore } from "@/lib/store/StoreProvider";
import { cn } from "@/lib/utils";

export function Hero() {
  const { banners } = useStore();
  const banner = banners[0];

  return (
    <section className="relative overflow-hidden bg-navy-900">
      {banner?.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={banner.image}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <div className="hero-overlay absolute inset-0" />

      <Container className="relative">
        <div className="flex min-h-[520px] flex-col justify-center py-16 text-white sm:min-h-[560px]">
          <div className="max-w-2xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-accent-400 ring-1 ring-white/15">
              <Icon name="shield" className="size-4" />
              منصة لوجستية سعودية موثوقة
            </span>

            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              منصة الخليج للخدمات اللوجستية
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/80 sm:text-xl">
              جميع خدمات النقل والتخليص والشحن في مكان واحد
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/services" className={buttonClass("accent", "lg")}>
                <Icon name="grid" className="size-5" />
                اطلب خدمة
              </Link>
              <Link
                href="/add-ad"
                className={cn(buttonClass("gold", "lg"))}
              >
                <Icon name="plus" className="size-5" />
                أضف إعلان
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <Stat value="+1,200" label="ناقل ومخلّص" />
              <Stat value="24/7" label="خدمة متواصلة" />
              <Stat value="13" label="منطقة في المملكة" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-black text-white">{value}</span>
      <span className="text-white/60">{label}</span>
    </div>
  );
}
