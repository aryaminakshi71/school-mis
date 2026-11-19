import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app/branding")({
  component: BrandingPage,
});

interface Branding {
  brandName: string;
  logoUrl: string;
  primaryColor: string;
  supportEmail: string;
  customDomain: string;
}

const DEFAULTS: Branding = {
  brandName: "SchoolAI",
  logoUrl: "",
  primaryColor: "#6366f1",
  supportEmail: "",
  customDomain: "",
};

function BrandingPage() {
  const [branding, setBranding] = useState<Branding>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/rpc/branding", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.branding) {
          setBranding({
            ...DEFAULTS,
            ...d.branding,
            logoUrl: d.branding.logoUrl ?? "",
            supportEmail: d.branding.supportEmail ?? "",
            customDomain: d.branding.customDomain ?? "",
          });
        }
      })
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/rpc/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          brandName: branding.brandName,
          logoUrl: branding.logoUrl || null,
          primaryColor: branding.primaryColor,
          supportEmail: branding.supportEmail || null,
          customDomain: branding.customDomain || null,
        }),
      });
      const d = await res.json().catch(() => null);
      if (res.ok) {
        setMessage("Branding saved");
      } else {
        setMessage(d?.message || "Failed to save");
      }
    } catch {
      setMessage("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-1 text-2xl font-bold">White-label branding</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Resell SchoolAI under your own brand. These settings apply to your
        organization.
      </p>

      <div className="space-y-4 rounded-lg border p-6">
        <label className="block">
          <span className="text-sm font-medium">Brand name</span>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={branding.brandName}
            onChange={(e) =>
              setBranding({ ...branding, brandName: e.target.value })
            }
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Logo URL</span>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="https://your-brand.com/logo.png"
            value={branding.logoUrl}
            onChange={(e) =>
              setBranding({ ...branding, logoUrl: e.target.value })
            }
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Primary color</span>
          <div className="mt-1 flex items-center gap-3">
            <input
              type="color"
              value={branding.primaryColor}
              onChange={(e) =>
                setBranding({ ...branding, primaryColor: e.target.value })
              }
              className="h-10 w-14 rounded border"
            />
            <input
              className="w-full rounded-md border px-3 py-2"
              value={branding.primaryColor}
              onChange={(e) =>
                setBranding({ ...branding, primaryColor: e.target.value })
              }
            />
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Support email</span>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="support@your-brand.com"
            value={branding.supportEmail}
            onChange={(e) =>
              setBranding({ ...branding, supportEmail: e.target.value })
            }
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Custom domain</span>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="school.your-brand.com"
            value={branding.customDomain}
            onChange={(e) =>
              setBranding({ ...branding, customDomain: e.target.value })
            }
          />
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save branding"}
          </button>
          {message && (
            <span className="text-sm text-muted-foreground">{message}</span>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-lg border p-4">
        <div className="text-sm font-medium">Preview</div>
        <div className="mt-3 flex items-center gap-3">
          {branding.logoUrl ? (
            <img
              src={branding.logoUrl}
              alt="logo"
              className="h-10 w-10 rounded object-contain"
            />
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded text-white"
              style={{ backgroundColor: branding.primaryColor }}
            >
              {branding.brandName.slice(0, 1)}
            </div>
          )}
          <span
            className="text-lg font-semibold"
            style={{ color: branding.primaryColor }}
          >
            {branding.brandName}
          </span>
        </div>
      </div>
    </div>
  );
}
