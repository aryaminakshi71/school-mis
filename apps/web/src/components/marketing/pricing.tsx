import { useState } from "react";
import { Button, Check, X } from "@/components/ui";

interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  highlighted?: boolean;
  cta: string;
  ctaHref: string;
}

const plans: PricingPlan[] = [
  {
    name: "Starter",
    description: "Perfect for small schools getting started",
    monthlyPrice: 49,
    yearlyPrice: 490,
    features: [
      "Up to 200 students",
      "5 staff accounts",
      "Core modules included",
      "Email support",
      "Mobile app access",
      "Basic reports",
    ],
    cta: "Start Free Trial",
    ctaHref: "/signup?plan=starter",
  },
  {
    name: "Professional",
    description: "For growing schools with advanced needs",
    monthlyPrice: 149,
    yearlyPrice: 1490,
    features: [
      "Up to 1,000 students",
      "25 staff accounts",
      "All modules included",
      "Priority support",
      "SMS notifications",
      "Advanced analytics",
      "API access",
      "Custom branding",
    ],
    highlighted: true,
    cta: "Start Free Trial",
    ctaHref: "/signup?plan=professional",
  },
  {
    name: "Enterprise",
    description: "For large institutions and school districts",
    monthlyPrice: 399,
    yearlyPrice: 3990,
    features: [
      "Unlimited students",
      "Unlimited staff accounts",
      "All modules included",
      "Dedicated support",
      "Multi-branch support",
      "Custom integrations",
      "SSO/SAML",
      "SLA guarantee",
      "On-premise option",
    ],
    cta: "Contact Sales",
    ctaHref: "/contact",
  },
];

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section className="section bg-muted/30" id="pricing">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Pricing</p>
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">
            Choose the perfect plan for your school. All plans include a 14-day
            free trial.
          </p>

          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-background p-1 mt-6">
            <button
              onClick={() => setIsYearly(false)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${!isYearly ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${isYearly ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${plan.highlighted ? "border-primary shadow-lg bg-background" : "border-border bg-background"}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">
                  ${isYearly ? plan.yearlyPrice / 12 : plan.monthlyPrice}
                </span>
                <span className="text-muted-foreground">/month</span>
                {isYearly && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Billed annually
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a href={plan.ctaHref}>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Need a custom solution?</p>
          <a href="/contact">
            <Button variant="ghost">Talk to our sales team →</Button>
          </a>
        </div>
      </div>
    </section>
  );
}
