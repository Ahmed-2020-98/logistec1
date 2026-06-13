import { PageHero } from "@/components/layout/PageHero";
import { ServicesSection } from "@/components/home/ServicesSection";

export const metadata = { title: "الخدمات | منصة الخليج للخدمات اللوجستية" };

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="الخدمات اللوجستية"
        subtitle="اختر الخدمة المناسبة واطلبها مباشرة، وسيتواصل معك فريقنا في أقرب وقت."
        icon="grid"
      />
      <ServicesSection withHeading={false} />
    </>
  );
}
