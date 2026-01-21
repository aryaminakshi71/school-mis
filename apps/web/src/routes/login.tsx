import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-8">Welcome Back</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg"
              placeholder="you@school.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg"
              placeholder="••••••••"
            />
          </div>
          <a
            href="/app"
            className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </a>
        </form>
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
