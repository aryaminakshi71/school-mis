import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app/billing")({
  component: BillingPage,
});

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  limits: string;
}

function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [current, setCurrent] = useState<{ plan: string; status: string; expiresAt: string | null }>({
    plan: "free",
    status: "none",
    expiresAt: null,
  });
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const [pRes, sRes] = await Promise.all([
      fetch("/api/billing/plans"),
      fetch("/api/billing/subscription", { credentials: "include" }),
    ]);
    const pJson: any = await pRes.json();
    const sJson: any = await sRes.json();
    setPlans(pJson.plans || []);
    setCurrent(sJson);
  };

  useEffect(() => {
    load();
  }, []);

  const subscribe = async (plan: string) => {
    setBusy(true);
    setMessage("");
    try {
      // Prefer Stripe Checkout; fall back to direct activation if Stripe
      // isn't configured (local demo).
      const checkout = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan, interval }),
      });
      if (checkout.ok) {
        const data: any = await checkout.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      }
      const res = await fetch("/api/billing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan, interval }),
      });
      if (!res.ok) throw new Error("Subscription failed");
      setMessage(`Subscribed to ${plan} (${interval}ly).`);
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Subscription failed");
    } finally {
      setBusy(false);
    }
  };

  const cancel = async () => {
    setBusy(true);
    try {
      await fetch("/api/billing/cancel", { method: "POST", credentials: "include" });
      setMessage("Subscription cancelled.");
      await load();
    } finally {
      setBusy(false);
    }
  };

  const price = (p: Plan) =>
    p.price === 0 ? "Custom" : `₹${(interval === "year" ? p.price * 10 : p.price).toLocaleString("en-IN")}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="mt-1 text-gray-600">
          Current plan: <span className="font-semibold capitalize">{current.plan}</span> ·{" "}
          <span className="capitalize">{current.status}</span>
          {current.expiresAt && ` · renews ${new Date(current.expiresAt).toLocaleDateString()}`}
        </p>
      </div>

      {message && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800">
          {message}
        </div>
      )}

      <div className="mb-6 inline-flex gap-1 rounded-xl bg-gray-100 p-1">
        {(["month", "year"] as const).map((i) => (
          <button
            key={i}
            onClick={() => setInterval(i)}
            className={`rounded-lg px-4 py-1.5 font-medium capitalize ${
              interval === i ? "bg-white shadow-sm" : "text-gray-600"
            }`}
          >
            {i}ly {i === "year" && <span className="text-xs text-green-600">save 2 months</span>}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => {
          const active = current.plan === p.id && current.status === "active";
          return (
            <div
              key={p.id}
              className={`rounded-xl border bg-white p-6 ${
                active ? "border-indigo-500 ring-2 ring-indigo-200" : "border-gray-200"
              }`}
            >
              <h2 className="text-lg font-semibold text-gray-900">{p.name}</h2>
              <p className="mt-2 text-3xl font-bold text-gray-900">{price(p)}</p>
              <p className="text-sm text-gray-500">
                {p.price === 0 ? "contact sales" : `per ${interval}`}
              </p>
              <p className="mt-3 text-sm text-gray-600">{p.limits}</p>
              <button
                disabled={busy || active}
                onClick={() => subscribe(p.id)}
                className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {active ? "Current plan" : p.price === 0 ? "Contact sales" : "Subscribe"}
              </button>
            </div>
          );
        })}
      </div>

      {current.status === "active" && current.plan !== "free" && (
        <div className="mt-8">
          <button
            disabled={busy}
            onClick={cancel}
            className="rounded-lg border border-red-300 px-4 py-2 font-medium text-red-700 hover:bg-red-50"
          >
            Cancel subscription
          </button>
        </div>
      )}
    </div>
  );
}
