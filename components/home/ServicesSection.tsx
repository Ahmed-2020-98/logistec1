"use client";

import { useState } from "react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ServiceRequestForm } from "@/components/forms/ServiceRequestForm";
import { useAuthGate } from "@/lib/auth/useAuthGate";
import type { ServiceType } from "@/lib/types";

interface ServiceDef {
  type: ServiceType;
  title: string;
  icon: IconName;
  description: string;
  subs: string[];
  accent: string;
}

const SERVICES: ServiceDef[] = [
  {
    type: "transport",
    title: "النقل",
    icon: "truck",
    description: "نقل بري داخل المملكة وإلى دول الخليج والعالم.",
    subs: ["داخل المملكة", "دولي"],
    accent: "from-brand-600 to-brand-500",
  },
  {
    type: "customs",
    title: "التخليص الجمركي",
    icon: "clearance",
    description: "إنهاء إجراءات الفسح والتخليص بكفاءة وسرعة.",
    subs: ["وارد", "صادر", "ترانزيت", "سيارات"],
    accent: "from-accent-600 to-accent-500",
  },
  {
    type: "shipping",
    title: "الشحن والتخزين",
    icon: "warehouse",
    description: "حلول شحن وتخزين متكاملة لجميع أنواع البضائع.",
    subs: ["حاويات جاف", "حاويات مبرد", "سيارات ومعدات", "أكياس جامبو", "أخشاب"],
    accent: "from-navy-700 to-navy-600",
  },
];

export function ServicesSection({ withHeading = true }: { withHeading?: boolean }) {
  const [active, setActive] = useState<ServiceType | null>(null);
  const { requireAuth } = useAuthGate();

  return (
    <section className="py-14">
      <Container>
        {withHeading && (
          <SectionHeading
            title="خدماتنا اللوجستية"
            subtitle="اختر الخدمة المناسبة واطلبها مباشرة من المنصة"
          />
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.type}
              className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`relative bg-gradient-to-br ${s.accent} p-6 text-white`}>
                <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                  <Icon name={s.icon} className="size-8" strokeWidth={1.6} />
                </div>
                <h3 className="mt-4 text-2xl font-extrabold">{s.title}</h3>
                <p className="mt-1 text-sm text-white/80">{s.description}</p>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <ul className="flex flex-wrap gap-2">
                  {s.subs.map((sub) => (
                    <li
                      key={sub}
                      className="rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700"
                    >
                      {sub}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      if (requireAuth("/services")) setActive(s.type);
                    }}
                    className="w-full"
                  >
                    اطلب الخدمة
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Modal open={active !== null} onClose={() => setActive(null)} title="طلب خدمة">
        {active && <ServiceRequestForm type={active} onSuccess={() => setActive(null)} />}
      </Modal>
    </section>
  );
}
