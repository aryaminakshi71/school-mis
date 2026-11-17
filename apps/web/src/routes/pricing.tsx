import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({
  head: () => {
    const baseUrl =
      import.meta.env.VITE_PUBLIC_SITE_URL || "http://localhost:3000";
    const canonical = baseUrl.replace(/\/$/, "") + "/pricing";
    return {
      meta: [
        { title: "SchoolAI - Pricing" },
        {
          name: "description",
          content:
            "All-in-one school management system for students, staff, academics, finance, and operations.",
        },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: "SchoolAI - Pricing" },
        {
          property: "og:description",
          content:
            "All-in-one school management system for students, staff, academics, finance, and operations.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "SchoolAI - Pricing" },
        {
          name: "twitter:description",
          content:
            "All-in-one school management system for students, staff, academics, finance, and operations.",
        },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },

  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 right-0 left-0 z-50 bg-card shadow-sm">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="font-bold text-primary text-xl">
            SchoolAI
          </Link>
          <div className="flex gap-4">
            <a
              href="/#features"
              className="text-muted-foreground hover:text-primary"
            >
              Features
            </a>
            <Link to="/pricing" className="font-medium text-primary">
              Pricing
            </Link>
            <Link
              to="/login"
              className="text-muted-foreground hover:text-primary"
            >
              Login
            </Link>
          </div>
        </nav>
      </header>
      <main className="pt-16">
        <section className="mx-auto max-w-7xl px-4 py-16">
          <h1 className="mb-4 text-center font-bold text-3xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mb-12 text-center text-muted-foreground">
            Choose the plan that fits your school
          </p>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "$99/mo",
                features: ["500 students", "Core features", "Email support"],
                popular: false,
              },
              {
                name: "Professional",
                price: "$199/mo",
                features: ["2000 students", "All features", "SMS integration"],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                features: ["Unlimited", "On-premise", "Dedicated support"],
                popular: false,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-lg border-2 bg-card p-8 shadow ${p.popular ? "border-primary" : "border-border"}`}
              >
                <h3 className="font-semibold text-xl">{p.name}</h3>
                <p className="my-4 font-bold text-3xl">{p.price}</p>
                <ul className="mb-6 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-success">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`block rounded-lg py-3 text-center ${p.popular ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
