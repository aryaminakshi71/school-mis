import { useState } from "react";
import { Button, ChevronRight } from "@/components/ui";

const faqs = [
  {
    question: "How long does it take to set up School MIS?",
    answer:
      "Most schools are up and running within 24 hours. Our onboarding team will help you import existing data, configure your school structure, and train your staff. The entire setup process typically takes 1-3 days depending on the size of your institution.",
  },
  {
    question: "Can I import my existing student data?",
    answer:
      "Yes! We support importing data from Excel/CSV files, previous management systems, and can even help with manual data migration for complex datasets. Our import wizard will guide you through the process step by step.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use bank-level encryption (AES-256) for data at rest and TLS 1.3 for data in transit. Our servers are SOC 2 Type II certified, and we perform regular security audits. We also offer data residency options for schools that need to comply with local regulations.",
  },
  {
    question: "Do you offer mobile apps?",
    answer:
      "Yes! We have native iOS and Android apps for teachers, parents, and students. The mobile apps work offline for essential features like attendance and grades, so they're perfect for areas with limited connectivity.",
  },
  {
    question: "Can parents access the system?",
    answer:
      "Yes. Parents have limited access to view their child's attendance, grades, fee statements, and communicate with teachers. You control exactly what information is visible to parents through our granular permission settings.",
  },
  {
    question: "What payment methods do you support?",
    answer:
      "We support credit/debit cards, bank transfers, ACH, PayPal, and region-specific payment gateways. For annual plans, we also accept checks. All payments are processed securely through Stripe.",
  },
  {
    question: "Is there a contract requirement?",
    answer:
      "No long-term contracts! Our monthly plans can be canceled anytime. Annual plans offer a discount but can be canceled early with a prorated refund. We believe in earning your business every month.",
  },
  {
    question: "Do you offer discounts for non-profits?",
    answer:
      "Yes! We offer a 20% discount for registered non-profit schools and educational institutions. Contact our sales team with your registration documents to apply for the discount.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section" id="faq">
      <div className="container max-w-4xl">
        <div className="section-header">
          <p className="section-label">FAQ</p>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Got questions? We've got answers. If you don't see your question
            here, feel free to contact us.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card">
              <button
                className="w-full flex items-center justify-between text-left p-2 -m-2"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronRight
                  className={`w-5 h-5 text-muted-foreground transition-transform ${openIndex === index ? "rotate-90" : ""}`}
                />
              </button>
              {openIndex === index && (
                <div className="mt-4 pt-4 border-t text-muted-foreground text-sm">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center p-8 rounded-2xl bg-muted/50">
          <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            Our team is here to help you 24/7
          </p>
          <a href="/contact">
            <Button>Contact Support</Button>
          </a>
        </div>
      </div>
    </section>
  );
}
