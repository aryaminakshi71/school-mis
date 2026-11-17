import { BLOG_POSTS } from "@/lib/blog-posts";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  head: () => {
    const baseUrl =
      import.meta.env.VITE_PUBLIC_SITE_URL || "http://localhost:3000";
    const canonical = baseUrl.replace(/\/$/, "") + "/blog";
    return {
      meta: [
        {
          title:
            "SchoolAI Blog - School Operations, Finance, And Academic Insights",
        },
        {
          name: "description",
          content:
            "Read practical guides on school admissions, fee collection, attendance analytics, and operational excellence.",
        },
        { name: "robots", content: "index, follow" },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: BlogPage,
});

function BlogPage() {
  return (
    <div className="public-page">
      <main className="public-container py-16">
        <span className="public-kicker mb-4">Insights</span>
        <h1 className="public-section-title font-bold">SchoolAI Blog</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Tactical content for school leaders and operators who want stronger
          systems and better outcomes.
        </p>

        <div className="mt-10 grid gap-5">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="public-card p-6">
              <div className="public-meta">
                <span>{post.category}</span>
                <span>•</span>
                <span>{post.publishedAt}</span>
                <span>•</span>
                <span>{post.readMinutes} min read</span>
              </div>
              <h2 className="mt-3 font-semibold text-2xl">{post.title}</h2>
              <p className="mt-2 text-muted-foreground">{post.description}</p>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="mt-4 inline-block font-medium text-primary"
              >
                Read article
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
