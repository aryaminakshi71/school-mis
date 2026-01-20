import { MarketingHeader } from "@/components/marketing/header";
import { LandingHero } from "@/components/marketing/hero";
import { FeaturesSection } from "@/components/marketing/features";
import { PricingSection } from "@/components/marketing/pricing";
import { FAQSection } from "@/components/marketing/faq";
import { CTASection } from "@/components/marketing/cta";
import { MarketingFooter } from "@/components/marketing/footer";

export default function Index() {
  return (
    <>
      <MarketingHeader />
      <main>
        <LandingHero />
        <FeaturesSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <MarketingFooter />
    </>
  );
}
