import { HeadContent, Link, Scripts } from "@tanstack/react-router";

export function NotFoundPage() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-muted p-4">
          <div className="w-full max-w-md rounded-lg bg-card p-6 text-center shadow-lg">
            <h1 className="mb-2 font-bold text-4xl text-foreground">404</h1>
            <h2 className="mb-4 font-semibold text-foreground text-xl">
              Page Not Found
            </h2>
            <p className="mb-6 text-muted-foreground">
              The page you are looking for does not exist or has been moved.
            </p>
            <Link
              to="/"
              className="inline-block rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Go Home
            </Link>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
