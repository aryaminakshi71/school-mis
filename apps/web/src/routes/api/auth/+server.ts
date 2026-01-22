import { createAPIFileRoute } from "@tanstack/react-start";

export const POST = createAPIFileRoute("/api/auth")({
  handler: async ({ request }) => {
    try {
      const body = await request.json().catch(() => ({}));
      const {
        action,
        email,
        password,
        name,
        role,
        refreshToken,
        currentPassword,
        newPassword,
      } = body;

      const MOCK_USERS = [
        {
          id: "admin-001",
          name: "Admin User",
          email: "admin@school.com",
          password: "admin123",
          role: "admin",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
        },
        {
          id: "teacher-001",
          name: "John Smith",
          email: "teacher@school.com",
          password: "teacher123",
          role: "teacher",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher",
        },
        {
          id: "student-001",
          name: "Rahul Sharma",
          email: "student@school.com",
          password: "student123",
          role: "student",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student",
        },
        {
          id: "parent-001",
          name: "Rajesh Sharma",
          email: "parent@school.com",
          password: "parent123",
          role: "parent",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=parent",
          childId: "student-001",
        },
        {
          id: "accountant-001",
          name: "Priya Patel",
          email: "accountant@school.com",
          password: "accountant123",
          role: "accountant",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=accountant",
        },
      ];

      switch (action) {
        case "login":
          const user = MOCK_USERS.find(
            (u) => u.email === email && u.password === password,
          );

          if (!user) {
            return new Response(
              JSON.stringify({ message: "Invalid email or password" }),
              {
                status: 401,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          return new Response(
            JSON.stringify({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                childId: user.childId,
              },
              accessToken: `mock-access-token-${Date.now()}`,
              refreshToken: `mock-refresh-token-${Date.now()}`,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );

        case "register":
          if (!name || !email || !password) {
            return new Response(
              JSON.stringify({
                message: "Name, email, and password are required",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const existingUser = MOCK_USERS.find((u) => u.email === email);
          if (existingUser) {
            return new Response(
              JSON.stringify({ message: "Email already registered" }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          return new Response(
            JSON.stringify({
              message: "Registration successful. Please login.",
            }),
            { status: 201, headers: { "Content-Type": "application/json" } },
          );

        case "refresh":
          if (!refreshToken) {
            return new Response(
              JSON.stringify({ message: "Refresh token is required" }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          return new Response(
            JSON.stringify({
              accessToken: `mock-access-token-${Date.now()}`,
              refreshToken: `mock-refresh-token-${Date.now()}`,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );

        case "logout":
          return new Response(
            JSON.stringify({ message: "Logged out successfully" }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );

        case "me":
          const authHeader = request.headers.get("Authorization");
          if (!authHeader?.startsWith("Bearer ")) {
            return new Response(
              JSON.stringify({ message: "No token provided" }),
              { status: 401, headers: { "Content-Type": "application/json" } },
            );
          }

          const token = authHeader.substring(7);
          if (token.startsWith("mock-")) {
            return new Response(
              JSON.stringify({
                user: {
                  id: "demo-user",
                  name: "Demo User",
                  email: "demo@school.com",
                  role: "admin",
                },
              }),
              { status: 200, headers: { "Content-Type": "application/json" } },
            );
          }

          return new Response(JSON.stringify({ message: "Invalid token" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });

        case "change-password":
          if (!currentPassword || !newPassword) {
            return new Response(
              JSON.stringify({ message: "Current and new password required" }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          return new Response(
            JSON.stringify({ message: "Password changed successfully" }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );

        default:
          return new Response(JSON.stringify({ message: "Invalid action" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
      }
    } catch (error) {
      console.error("Auth API error:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
});

export const GET = createAPIFileRoute("/api/auth")({
  handler: async () => {
    return new Response(
      JSON.stringify({
        message: "School MIS Auth API",
        version: "1.0.0",
        endpoints: ["POST /api/auth"],
        actions: [
          "login",
          "register",
          "refresh",
          "logout",
          "me",
          "change-password",
        ],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  },
});
