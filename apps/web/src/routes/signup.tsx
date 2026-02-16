import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-card p-8 shadow">
        <h1 className="mb-8 text-center font-bold text-2xl">Create Account</h1>
        <form className="space-y-4" action="/app" method="get">
          <div>
            <label
              htmlFor="school-name"
              className="mb-1 block font-medium text-foreground text-sm"
            >
              School Name
            </label>
            <input
              id="school-name"
              type="text"
              className="w-full rounded-lg border p-3"
              placeholder="Springfield High School"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block font-medium text-foreground text-sm"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg border p-3"
              placeholder="admin@school.edu"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block font-medium text-foreground text-sm"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg border p-3"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="block w-full rounded-lg bg-primary py-3 text-center text-primary-foreground hover:bg-primary/90"
          >
            Create Account
          </button>
        </form>
        <p className="mt-6 text-center text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
