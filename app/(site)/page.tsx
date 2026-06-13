import { Hero } from "@/components/home/Hero";
import { ServicesSection } from "@/components/home/ServicesSection";
import { QuickLinks } from "@/components/home/QuickLinks";
import { LatestAds } from "@/components/home/LatestAds";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <QuickLinks />
      <LatestAds />
    </>
  );
}
