import { Link, createFileRoute } from "@tanstack/react-router";

const principles = [
  {
    title: "Operational Clarity",
    text: "Every school workflow should be measurable, accountable, and easy to audit.",
  },
  {
    title: "Practical UX",
    text: "Software should help staff complete tasks faster, not add new complexity.",
  },
  {
    title: "Secure Foundations",
    text: "Student and staff data must be protected with clear access controls.",
  },
];

export const Route = createFileRoute("/about")({
  head: () => {
    const baseUrl =
      import.meta.env.VITE_PUBLIC_SITE_URL || "http://localhost:3000";
    const canonical = baseUrl.replace(/\/$/, "") + "/about";
    return {
      meta: [
        {
          title: "About School MIS - Mission, Approach, And Product Direction",
        },
        {
          name: "description",
          content:
            "Learn how School MIS helps schools simplify administration, improve visibility, and scale operations with confidence.",
        },
        { name: "robots", content: "index, follow" },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="public-page">
      <main className="public-container py-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="public-kicker mb-4">About</span>
          <h1 className="public-section-title font-bold">About School MIS</h1>
          <p className="mt-4 text-muted-foreground">
            We build software for schools that want stronger control over
            academics, finance, and communication without operational chaos.
          </p>
        </div>

        <section className="public-surface mt-12 p-7">
          <h2 className="font-semibold text-2xl">Our Mission</h2>
          <p className="mt-3 text-muted-foreground">
            Help school leaders run institutions with clear data, dependable
            processes, and fewer manual dependencies.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {principles.map((item) => (
            <article key={item.title} className="public-card p-6">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="public-surface mt-8 p-7">
          <h2 className="font-semibold text-2xl">Who We Serve</h2>
          <p className="mt-3 text-muted-foreground">
            K-12 schools, private campuses, and multi-branch institutions that
            need robust role-based workflows across admin, teachers, finance,
            and parent engagement.
          </p>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/pricing"
            className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground"
          >
            Compare Plans
          </Link>
          <Link
            to="/blog"
            className="rounded-lg border border-border px-5 py-2.5 font-medium"
          >
            Read Insights
          </Link>
        </div>
      </main>
    </div>
  );
}
