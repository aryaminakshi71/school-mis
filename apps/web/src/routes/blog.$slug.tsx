import { getBlogPostBySlug } from "@/lib/blog-posts";
import { generateArticleSchema } from "@/lib/structured-data";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = getBlogPostBySlug(params.slug);
    const baseUrl =
      import.meta.env.VITE_PUBLIC_SITE_URL || "http://localhost:3000";
    const canonical = `${baseUrl.replace(/\/$/, "")}/blog/${params.slug}`;

    if (!post) {
      return {
        meta: [
          { title: "Article Not Found - SchoolAI Blog" },
          { name: "robots", content: "noindex, nofollow" },
        ],
        links: [{ rel: "canonical", href: canonical }],
      };
    }

    return {
      meta: [
        { title: `${post.title} | SchoolAI Blog` },
        { name: "description", content: post.description },
        { name: "robots", content: "index, follow" },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="font-bold text-3xl">Article not found</h1>
          <p className="mt-3 text-muted-foreground">
            The requested article does not exist.
          </p>
          <Link
            to="/blog"
            className="mt-6 inline-block font-medium text-primary"
          >
            Back to blog
          </Link>
        </main>
      </div>
    );
  }

  const siteUrl =
    import.meta.env.VITE_PUBLIC_SITE_URL || "http://localhost:3000";
  const articleSchema = generateArticleSchema({
    headline: post.title,
    description: post.description,
    author: { name: post.author },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: `${siteUrl.replace(/\/$/, "")}/blog/${post.slug}`,
    image: `${siteUrl.replace(/\/$/, "")}/og.svg`,
  });

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <Link to="/blog" className="font-medium text-primary text-sm">
          ← Back to blog
        </Link>
        <h1 className="mt-4 font-bold text-4xl leading-tight">{post.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2 text-muted-foreground text-sm">
          <span>{post.author}</span>
          <span>•</span>
          <span>{post.publishedAt}</span>
          <span>•</span>
          <span>{post.readMinutes} min read</span>
        </div>
        <p className="mt-6 text-lg text-muted-foreground">{post.description}</p>

        <article className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>
      </main>
    </div>
  );
}
