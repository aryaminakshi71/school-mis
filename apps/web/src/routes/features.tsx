import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { FeaturesSection } from "@/components/marketing/features";
import { CTASection } from "@/components/marketing/cta";

export default function Features() {
  return (
    <>
      <MarketingHeader />
      <main className="pt-16">
        <section className="py-24 text-center">
          <div className="container">
            <p className="section-label">Features</p>
            <h1 className="section-title">
              Powerful Features for Modern Schools
            </h1>
            <p className="section-subtitle">
              Discover all the tools you need to run your school efficiently
            </p>
          </div>
        </section>
        <FeaturesSection />
        <CTASection />
      </main>
      <MarketingFooter />
    </>
  );
}
