"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import { CustomsAdCard, SaleAdCard, TransportAdCard } from "@/components/ads/AdCards";
import { useStore } from "@/lib/store/StoreProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import type { AdCategory } from "@/lib/types";

export default function MyAdsPage() {
  const { user } = useAuth();
  const store = useStore();
  const toast = useToast();
  if (!user) return null;

  const mine = (uid?: string | null) => uid === user.id;
  const t = store.transportAds.filter((a) => mine(a.userId));
  const c = store.customsAds.filter((a) => mine(a.userId));
  const s = store.saleAds.filter((a) => mine(a.userId));
  const total = t.length + c.length + s.length;

  function remove(category: AdCategory, id: string) {
    if (confirm("هل تريد حذف هذا الإعلان؟")) {
      store.deleteAd(category, id);
      toast("تم حذف الإعلان", "info");
    }
  }

  if (total === 0) {
    return (
      <EmptyState
        title="لا توجد إعلانات"
        description="لم تنشر أي إعلان بعد."
        action={
          <Link href="/add-ad" className={buttonClass("primary", "md")}>
            أضف إعلان
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      {t.length > 0 && (
        <Section title="إعلانات النقل">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.map((ad) => (
              <div key={ad.id} className="space-y-2">
                <TransportAdCard ad={ad} />
                <DeleteBtn onClick={() => remove("transport", ad.id)} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {c.length > 0 && (
        <Section title="إعلانات التخليص">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {c.map((ad) => (
              <div key={ad.id} className="space-y-2">
                <CustomsAdCard ad={ad} />
                <DeleteBtn onClick={() => remove("customs", ad.id)} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {s.length > 0 && (
        <Section title="إعلانات البيع">
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
            {s.map((ad) => (
              <div key={ad.id} className="space-y-2">
                <SaleAdCard ad={ad} />
                <DeleteBtn onClick={() => remove("sale", ad.id)} />
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-extrabold text-navy-900">{title}</h2>
      {children}
    </section>
  );
}

function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
    >
      <Icon name="trash" className="size-4" />
      حذف الإعلان
    </button>
  );
}
