import { env } from "@school/env/client";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type SchoolSettingsUpdateInput, api } from "./api";

export interface SchoolBranding {
  schoolName: string;
  shortName: string;
  schoolAddress: string;
  phoneNumber?: string;
  supportEmail?: string;
  websiteUrl?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  receiptFooter?: string;
  mobileAppName?: string;
}

interface BrandingContextValue {
  branding: SchoolBranding;
  isLoaded: boolean;
  updateBranding: (nextBranding: SchoolSettingsUpdateInput) => Promise<void>;
  resetBranding: () => void;
}

const BRANDING_STORAGE_KEY = "school_branding";

export const defaultSchoolBranding: SchoolBranding = {
  schoolName: env.VITE_PUBLIC_SCHOOL_NAME,
  shortName: env.VITE_PUBLIC_SCHOOL_SHORT_NAME,
  schoolAddress: env.VITE_PUBLIC_SCHOOL_ADDRESS,
  phoneNumber: "",
  supportEmail: "",
  websiteUrl: "",
  logoUrl: "",
  primaryColor: "#047857",
  secondaryColor: "#17332a",
  receiptFooter: "",
  mobileAppName: env.VITE_PUBLIC_SCHOOL_NAME,
};

const BrandingContext = createContext<BrandingContextValue | null>(null);

export function getSchoolInitials(branding: SchoolBranding): string {
  const source = branding.shortName || branding.schoolName;

  return (
    source
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "SM"
  );
}

function readStoredBranding(): SchoolBranding {
  if (typeof window === "undefined") {
    return defaultSchoolBranding;
  }

  try {
    const stored = window.localStorage.getItem(BRANDING_STORAGE_KEY);
    if (!stored) {
      return defaultSchoolBranding;
    }

    const parsed = JSON.parse(stored) as Partial<SchoolBranding>;
    return {
      schoolName: parsed.schoolName || defaultSchoolBranding.schoolName,
      shortName: parsed.shortName || defaultSchoolBranding.shortName,
      schoolAddress:
        parsed.schoolAddress || defaultSchoolBranding.schoolAddress,
      phoneNumber: parsed.phoneNumber || defaultSchoolBranding.phoneNumber,
      supportEmail: parsed.supportEmail || defaultSchoolBranding.supportEmail,
      websiteUrl: parsed.websiteUrl || defaultSchoolBranding.websiteUrl,
      logoUrl: parsed.logoUrl || defaultSchoolBranding.logoUrl,
      primaryColor: parsed.primaryColor || defaultSchoolBranding.primaryColor,
      secondaryColor:
        parsed.secondaryColor || defaultSchoolBranding.secondaryColor,
      receiptFooter:
        parsed.receiptFooter || defaultSchoolBranding.receiptFooter,
      mobileAppName:
        parsed.mobileAppName || defaultSchoolBranding.mobileAppName,
    };
  } catch {
    return defaultSchoolBranding;
  }
}

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<SchoolBranding>(
    defaultSchoolBranding,
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedBranding = readStoredBranding();
    setBranding(storedBranding);

    void api.schoolSettings
      .get()
      .then((serverBranding) => {
        setBranding(serverBranding);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            BRANDING_STORAGE_KEY,
            JSON.stringify(serverBranding),
          );
        }
      })
      .catch(() => {
        setBranding(storedBranding);
      })
      .finally(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = `${branding.schoolName} - School Management Information System`;
    }
  }, [branding.schoolName]);

  const value = useMemo<BrandingContextValue>(
    () => ({
      branding,
      isLoaded,
      updateBranding: async (nextBranding) => {
        const updated = await api.schoolSettings.update(nextBranding);
        setBranding(updated);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            BRANDING_STORAGE_KEY,
            JSON.stringify(updated),
          );
        }
      },
      resetBranding: () => {
        void api.schoolSettings
          .update(defaultSchoolBranding)
          .then((updated) => {
            setBranding(updated);
            if (typeof window !== "undefined") {
              window.localStorage.setItem(
                BRANDING_STORAGE_KEY,
                JSON.stringify(updated),
              );
            }
          })
          .catch(() => {
            setBranding(defaultSchoolBranding);
            if (typeof window !== "undefined") {
              window.localStorage.removeItem(BRANDING_STORAGE_KEY);
            }
          });
      },
    }),
    [branding, isLoaded],
  );

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);

  if (!context) {
    throw new Error("useBranding must be used within BrandingProvider");
  }

  return context;
}
