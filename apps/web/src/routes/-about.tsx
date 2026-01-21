import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { CTASection } from "@/components/marketing/cta";

export default function About() {
  return (
    <>
      <MarketingHeader />
      <main className="pt-16">
        <section className="py-24">
          <div className="container max-w-4xl">
            <p className="section-label text-center">About Us</p>
            <h1 className="section-title text-center mb-12">
              Building the Future of Education
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-6">
                School MIS was founded in 2020 with a simple mission: to make
                school management easier for educational institutions around the
                world. We believe that technology should empower educators, not
                burden them with complexity.
              </p>

              <p className="text-muted-foreground mb-6">
                Today, we're trusted by over 500 schools across 40+ countries.
                Our platform processes millions of records daily, helping
                administrators, teachers, parents, and students stay connected
                and informed.
              </p>

              <h2 className="text-2xl font-bold mt-12 mb-4">Our Values</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li>
                  <strong>Simplicity</strong> - We believe powerful tools should
                  be easy to use
                </li>
                <li>
                  <strong>Security</strong> - Your data security is our top
                  priority
                </li>
                <li>
                  <strong>Innovation</strong> - We're constantly improving and
                  adding new features
                </li>
                <li>
                  <strong>Support</strong> - We're here for you 24/7
                </li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Our Team</h2>
              <p className="text-muted-foreground mb-6">
                Our team combines decades of experience in education technology,
                software development, and user experience design. We're
                passionate about education and committed to making a positive
                impact on schools worldwide.
              </p>
            </div>
          </div>
        </section>
        <CTASection />
      </main>
      <MarketingFooter />
    </>
  );
}
