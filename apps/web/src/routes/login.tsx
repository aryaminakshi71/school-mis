import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => {
    const baseUrl =
      import.meta.env.VITE_PUBLIC_SITE_URL || "http://localhost:3000";
    const canonical = baseUrl.replace(/\/$/, "") + "/login";
    return {
      meta: [
        { title: "School MIS - Login" },
        { name: "description", content: "Log in to School MIS." },
        { name: "robots", content: "noindex, nofollow" },
        { property: "og:title", content: "School MIS - Login" },
        { property: "og:description", content: "Log in to School MIS." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "School MIS - Login" },
        { name: "twitter:description", content: "Log in to School MIS." },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },

  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful!");
      // Navigate after login completes
      navigate({ to: "/app/" });
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left column - Branding */}
      <div className="relative hidden bg-primary lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary" />
        <div className="relative flex h-full flex-col justify-between p-10 text-primary-foreground">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/20">
              <span className="font-bold text-sm">SM</span>
            </div>
            {"School MIS"}
          </Link>
          <div className="space-y-4">
            <blockquote className="font-medium text-xl">
              "Complete school management solution with all features you need."
            </blockquote>
            <footer className="text-sm opacity-80">
              — School Administrator
            </footer>
          </div>
        </div>
      </div>

      {/* Right column - Form */}
      <div className="flex flex-col">
        {/* Mobile header */}
        <div className="flex h-14 items-center border-b px-6 lg:hidden">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="flex size-6 items-center justify-center rounded bg-primary">
              <span className="font-bold text-primary-foreground text-xs">
                SM
              </span>
            </div>
            {"School MIS"}
          </Link>
        </div>

        {/* Form container */}
        <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-sm">
            <div className="mb-8 text-center">
              <h1 className="font-bold text-2xl">Welcome Back</h1>
              <p className="mt-2 text-muted-foreground">
                Enter your credentials to access the dashboard
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
            <p className="mt-6 text-center text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
