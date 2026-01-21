import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";

export default function Privacy() {
  return (
    <>
      <MarketingHeader />
      <main className="pt-24 pb-16">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="mb-4">Last updated: January 2024</p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              1. Introduction
            </h2>
            <p className="mb-4">
              Welcome to School MIS. We are committed to protecting your
              personal information and your right to privacy. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you use our services.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              2. Information We Collect
            </h2>
            <p className="mb-4">
              We collect information that you provide directly to us, including
              but not limited to: name, email address, school name, and other
              contact information when you register for an account or use our
              services.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="mb-4">
              We use the information we collect to provide, maintain, and
              improve our services, to process your transactions, to send you
              administrative information, and to communicate with you about
              products, services, and promotions.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              4. Data Security
            </h2>
            <p className="mb-4">
              We use appropriate technical and organizational security measures
              to protect your personal information against unauthorized access,
              alteration, disclosure, or destruction.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              5. Contact Us
            </h2>
            <p className="mb-4">
              If you have questions or comments about this policy, you may
              contact us at privacy@schoolmis.com.
            </p>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
