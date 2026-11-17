import { useAuth } from "@/lib/auth-context";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password, schoolName || email.split("@")[0]);
      toast.success("Account created!");
      navigate({ to: "/app" });
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error instanceof Error ? error.message : "Signup failed. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-card p-8 shadow">
        <h1 className="mb-8 text-center font-bold text-2xl">Create Account</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
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
              required
              className="w-full rounded-lg border p-3"
              placeholder="admin@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
              minLength={8}
              className="w-full rounded-lg border p-3"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="block w-full rounded-lg bg-primary py-3 text-center text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Creating…" : "Create Account"}
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
