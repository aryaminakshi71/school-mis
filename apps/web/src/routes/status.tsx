import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/status")({
  head: () => {
    const baseUrl =
      import.meta.env.VITE_PUBLIC_SITE_URL || "http://localhost:3000";
    const canonical = baseUrl.replace(/\/$/, "") + "/status";
    const appName = import.meta.env.VITE_PUBLIC_APP_NAME ?? "School MIS";
    return {
      meta: [
        { title: `${appName} - Status` },
        { name: "description", content: `System status for ${appName}.` },
        { name: "robots", content: "index, follow" },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: StatusPage,
});

function StatusPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="font-bold text-3xl tracking-tight">Status</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Last updated: February 10, 2026
        </p>
        <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none">
          <p>All systems operational.</p>
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
