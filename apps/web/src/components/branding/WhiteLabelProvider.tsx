"use client";

import { useEffect } from "react";

/**
 * Applies the organization's white-label settings (brand name + primary color)
 * to the document. Fetches from the branding API on mount.
 */
export function WhiteLabelProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/rpc/branding/get", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data: any = await res.json();
        const b = data?.json ?? data;
        if (cancelled || !b) return;
        if (b.brandName) {
          document.title = `${b.brandName} - School Operating System`;
        }
        if (b.primaryColor) {
          document.documentElement.style.setProperty(
            "--brand-primary",
            b.primaryColor,
          );
        }
      } catch {
        // branding is optional
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
