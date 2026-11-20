"use client";

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

export function SubscriptionGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({ loading: true, active: false, expired: false });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/billing/subscription", {
          credentials: "include",
        });
        const sub: any = await res.json();
        const expired = sub.expiresAt && new Date(sub.expiresAt).getTime() < Date.now();
        if (!cancelled) {
          setState({
            loading: false,
            active: sub.status === "active" && !expired,
            expired: Boolean(expired),
          });
        }
      } catch {
        if (!cancelled) setState({ loading: false, active: false, expired: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        Checking subscription…
      </div>
    );
  }

  if (state.active) return <>{children}</>;

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <h1 className="font-bold text-2xl">Subscription required</h1>
        <p className="mt-2 text-muted-foreground">
          {state.expired
            ? "Your subscription has expired. Renew to keep using SchoolAI."
            : "Your subscription is not active. Choose a plan to continue."}
        </p>
        <Link
          to="/app/billing"
          className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:bg-primary/90"
        >
          View plans & subscribe
        </Link>
      </div>
    </div>
  );
}
