import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => {
    const baseUrl =
      import.meta.env.VITE_PUBLIC_SITE_URL || "http://localhost:3000";
    const canonical = baseUrl.replace(/\/$/, "") + "/terms";
    const appName = import.meta.env.VITE_PUBLIC_APP_NAME ?? "SchoolAI";
    return {
      meta: [
        { title: `${appName} - Terms of Service` },
        { name: "description", content: `Terms of Service for ${appName}.` },
        { name: "robots", content: "index, follow" },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="font-bold text-3xl tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Last updated: February 10, 2026
        </p>
        <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none">
          <p>
            These Terms of Service govern your access to and use of this
            service. By using the service, you agree to these terms.
          </p>
        </div>
        <div className="mt-10">
          <Link
            to="/"
            className="font-medium text-primary text-sm underline underline-offset-4"
          >
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
