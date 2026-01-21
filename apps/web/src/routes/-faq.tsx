import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { FAQSection } from "@/components/marketing/faq";
import { CTASection } from "@/components/marketing/cta";

export default function FAQ() {
  return (
    <>
      <MarketingHeader />
      <main className="pt-16">
        <section className="py-24 text-center">
          <div className="container">
            <p className="section-label">FAQ</p>
            <h1 className="section-title">Frequently Asked Questions</h1>
            <p className="section-subtitle">
              Find answers to common questions about School MIS
            </p>
          </div>
        </section>
        <FAQSection />
        <CTASection />
      </main>
      <MarketingFooter />
    </>
  );
}
