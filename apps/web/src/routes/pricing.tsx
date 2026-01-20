import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { PricingSection } from "@/components/marketing/pricing";
import { CTASection } from "@/components/marketing/cta";

export default function Pricing() {
  return (
    <>
      <MarketingHeader />
      <main className="pt-16">
        <section className="py-24 text-center">
          <div className="container">
            <p className="section-label">Pricing</p>
            <h1 className="section-title">Simple, Transparent Pricing</h1>
            <p className="section-subtitle">
              Choose the perfect plan for your school. All plans include a
              14-day free trial.
            </p>
          </div>
        </section>
        <PricingSection />
        <CTASection />
      </main>
      <MarketingFooter />
    </>
  );
}
