import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

const featureGroups = [
  {
    title: "Admissions And Student Lifecycle",
    points: [
      "Enquiry to enrollment workflow",
      "Digital student profiles and documents",
      "Transfer certificates and alumni records",
    ],
  },
  {
    title: "Academic And Attendance Operations",
    points: [
      "Class, timetable, and teacher management",
      "Student and staff attendance with reports",
      "Exam setup, grading, and report cards",
    ],
  },
  {
    title: "Finance And Communication",
    points: [
      "Fee structure, collection, and reconciliation",
      "Budgeting and expense tracking",
      "SMS, email, and WhatsApp notifications",
    ],
  },
  {
    title: "Admin And Security Controls",
    points: [
      "Role-based access and module permissions",
      "Audit-friendly operational records",
      "Cloud deployment with centralized management",
    ],
  },
];

export const Route = createFileRoute("/features")({
  head: () => {
    const baseUrl =
      import.meta.env.VITE_PUBLIC_SITE_URL || "http://localhost:3000";
    const canonical = baseUrl.replace(/\/$/, "") + "/features";
    return {
      meta: [
        {
          title: "School MIS Features - Complete Modules For School Operations",
        },
        {
          name: "description",
          content:
            "Explore School MIS modules for admissions, attendance, academics, fees, communication, transport, and reporting.",
        },
        { name: "robots", content: "index, follow" },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <div className="public-page">
      <main className="public-container py-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="public-kicker mb-4">Features</span>
          <h1 className="public-section-title font-bold">
            Built For Day-To-Day School Depth
          </h1>
          <p className="mt-4 text-muted-foreground">
            School MIS combines core administration, academics, and finance
            workflows into one platform your teams can actually use.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {featureGroups.map((group) => (
            <section key={group.title} className="public-card p-6">
              <h2 className="font-semibold text-xl">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link
            to="/pricing"
            className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground"
          >
            View Pricing
          </Link>
          <Link
            to="/demo"
            className="rounded-lg border border-border px-5 py-2.5 font-medium"
          >
            Start Demo
          </Link>
        </div>
      </main>
    </div>
  );
}
