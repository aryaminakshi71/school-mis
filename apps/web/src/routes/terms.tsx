import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";

export default function Terms() {
  return (
    <>
      <MarketingHeader />
      <main className="pt-24 pb-16">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="mb-4">Last updated: January 2024</p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing or using School MIS services, you agree to be bound
              by these Terms of Service and all applicable laws and regulations.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              2. Use of Services
            </h2>
            <p className="mb-4">
              You agree to use our services only for lawful purposes and in
              accordance with these Terms. You are responsible for maintaining
              the confidentiality of your account credentials.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              3. Subscription and Payments
            </h2>
            <p className="mb-4">
              Some features require a subscription. You agree to pay all fees
              associated with your subscription. Subscriptions automatically
              renew unless cancelled before the renewal date.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              4. Limitation of Liability
            </h2>
            <p className="mb-4">
              School MIS shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages resulting from your
              use of our services.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              5. Contact Us
            </h2>
            <p className="mb-4">
              If you have questions about these Terms, please contact us at
              terms@schoolmis.com.
            </p>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
