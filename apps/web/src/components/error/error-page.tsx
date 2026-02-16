import { HeadContent, Scripts } from "@tanstack/react-router";

export function ErrorPage({ error }: { error: Error | unknown }) {
  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";
  const errorStack = error instanceof Error ? error.stack : undefined;

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-muted p-4">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <h1 className="mb-4 font-bold text-2xl text-destructive">
              Something went wrong
            </h1>
            <p className="mb-4 text-foreground">{errorMessage}</p>
            {import.meta.env.DEV && errorStack && (
              <details className="mb-4">
                <summary className="cursor-pointer text-muted-foreground text-sm">
                  Error Details
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">
                  <code>{errorStack}</code>
                </pre>
              </details>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => (window.location.href = "/")}
                className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              >
                Go Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded bg-muted px-4 py-2 text-foreground hover:bg-muted"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
