"use client";

import { Container, SectionHeading } from "@/components/ui/Container";
import { useStore } from "@/lib/store/StoreProvider";
import { useAuthGate } from "@/lib/auth/useAuthGate";

export function QuickLinks() {
  const { quickLinks } = useStore();
  const { requireAuth } = useAuthGate();
  if (quickLinks.length === 0) return null;

  return (
    <section className="bg-white py-14">
      <Container>
        <SectionHeading
          title="مواقع مرتبطة"
          subtitle="روابط سريعة للجهات والخدمات الحكومية والملاحية"
        />
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
          {quickLinks.map((q) => {
            const isImage = q.image.startsWith("http") || q.image.startsWith("data:");
            return (
              <a
                key={q.id}
                href={q.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!requireAuth("/")) e.preventDefault();
                }}
                className="group flex flex-col items-center gap-2.5 text-center"
              >
                <span className="flex size-20 items-center justify-center overflow-hidden rounded-full border border-line bg-surface text-3xl shadow-sm transition-all group-hover:-translate-y-1 group-hover:border-brand-300 group-hover:shadow-md">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={q.image} alt={q.title} className="size-full object-cover" />
                  ) : (
                    q.image
                  )}
                </span>
                <span className="text-xs font-bold text-navy-800 group-hover:text-brand-700 sm:text-sm">
                  {q.title}
                </span>
              </a>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
