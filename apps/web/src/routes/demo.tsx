/**
 * Demo Page
 *
 * Allows users to try the app in demo mode.
 */

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/demo")({
  component: DemoPage,
});

function DemoPage() {
  const navigate = useNavigate();

  const handleStartDemo = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("demo_mode", "true");
    }
    navigate({ to: "/app" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="font-bold text-2xl">
            Try School MIS Demo
          </CardTitle>
          <CardDescription>
            Experience our school management system without creating an account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">What you can do in demo mode:</h3>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
              <li>Explore the admin dashboard</li>
              <li>Manage students and staff</li>
              <li>Track attendance</li>
              <li>Handle fees and payments</li>
              <li>View reports and analytics</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={handleStartDemo}>
            Start Demo
          </Button>
          <div className="text-center text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
