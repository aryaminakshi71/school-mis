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
        { title: "SchoolAI - Login" },
        { name: "description", content: "Log in to SchoolAI." },
        { name: "robots", content: "noindex, nofollow" },
        { property: "og:title", content: "SchoolAI - Login" },
        { property: "og:description", content: "Log in to SchoolAI." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "SchoolAI - Login" },
        { name: "twitter:description", content: "Log in to SchoolAI." },
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
  const [mode, setMode] = useState<"email" | "parent">("email");
  const [role, setRole] = useState("school_admin");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [lookupMsg, setLookupMsg] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `/api/auth/sign-in/${provider}`;
  };

  const lookupParent = async () => {
    setLookupMsg("");
    if (!admissionNumber) {
      setLookupMsg("Enter your child's admission number");
      return;
    }
    try {
      const res = await fetch("/api/parent-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admissionNumber }),
      });
      const data: any = await res.json();
      if (!res.ok) {
        setLookupMsg(data.error || "Parent account not found");
        return;
      }
      setEmail(data.email);
      setLookupMsg(`Found ${data.name}. Enter your password to continue.`);
    } catch {
      setLookupMsg("Lookup failed. Try again.");
    }
  };

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
      navigate({ to: "/app" });
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
            {"SchoolAI"}
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
            {"SchoolAI"}
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
                <Label htmlFor="role">I am a</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="school_admin">School administrator</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                  <option value="super_admin">App developer</option>
                </select>
              </div>

              <div className="flex gap-2 rounded-lg bg-muted p-1 text-sm">
                <button
                  type="button"
                  onClick={() => setMode("email")}
                  className={`flex-1 rounded-md px-3 py-1.5 font-medium ${mode === "email" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setMode("parent")}
                  className={`flex-1 rounded-md px-3 py-1.5 font-medium ${mode === "parent" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                >
                  Parent (child ID)
                </button>
              </div>

              {mode === "parent" && (
                <div className="space-y-2">
                  <Label htmlFor="admission">Child admission number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="admission"
                      placeholder="STU-123456"
                      value={admissionNumber}
                      onChange={(e) => setAdmissionNumber(e.target.value)}
                    />
                    <Button type="button" variant="outline" onClick={lookupParent}>
                      Find
                    </Button>
                  </div>
                  {lookupMsg && (
                    <p className="text-xs text-muted-foreground">{lookupMsg}</p>
                  )}
                </div>
              )}

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

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOAuthLogin("google")}
                className="w-full"
                disabled={isLoading}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOAuthLogin("github")}
                className="w-full"
                disabled={isLoading}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Continue with GitHub
              </Button>
            </div>
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
