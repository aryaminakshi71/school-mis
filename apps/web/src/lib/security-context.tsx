import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface SecuritySettings {
  mfaEnabled: boolean;
  sessionTimeout: number; // in minutes
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  loginAttempts: {
    maxAttempts: number;
    lockoutDuration: number; // in minutes
  };
  auditLogging: boolean;
}

interface SecurityContextType {
  settings: SecuritySettings;
  updateSettings: (settings: Partial<SecuritySettings>) => void;
  enableMFA: () => Promise<void>;
  disableMFA: () => Promise<void>;
  verifyMFA: (code: string) => Promise<boolean>;
  isMFAEnabled: boolean;
  securityEvents: SecurityEvent[];
}

interface SecurityEvent {
  id: string;
  type:
    | "login"
    | "logout"
    | "failed_login"
    | "password_change"
    | "mfa_enabled"
    | "mfa_disabled"
    | "mfa_verification";
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: string;
}

const SecurityContext = createContext<SecurityContextType | undefined>(
  undefined,
);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
};

interface SecurityProviderProps {
  children: ReactNode;
}

const defaultSettings: SecuritySettings = {
  mfaEnabled: false,
  sessionTimeout: 60, // 1 hour
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  loginAttempts: {
    maxAttempts: 5,
    lockoutDuration: 30, // 30 minutes
  },
  auditLogging: true,
};

export const SecurityProvider = ({ children }: SecurityProviderProps) => {
  const [settings, setSettings] = useState<SecuritySettings>(defaultSettings);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem("security-settings");
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }

    // Load security events
    const savedEvents = localStorage.getItem("security-events");
    if (savedEvents) {
      setSecurityEvents(JSON.parse(savedEvents));
    }
  }, []);

  const updateSettings = (newSettings: Partial<SecuritySettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem("security-settings", JSON.stringify(updatedSettings));
  };

  const enableMFA = async () => {
    // Simulate MFA setup
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateSettings({ mfaEnabled: true });
    logSecurityEvent("mfa_enabled", true, "MFA enabled successfully");
  };

  const disableMFA = async () => {
    // Simulate MFA disable
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateSettings({ mfaEnabled: false });
    logSecurityEvent("mfa_disabled", true, "MFA disabled");
  };

  const verifyMFA = async (code: string): Promise<boolean> => {
    // Simulate MFA verification (in real app, verify with server)
    await new Promise((resolve) => setTimeout(resolve, 500));
    const isValid = code === "123456"; // Mock validation
    logSecurityEvent(
      "mfa_verification",
      isValid,
      `MFA code ${isValid ? "verified" : "invalid"}`,
    );
    return isValid;
  };

  const logSecurityEvent = (
    type: SecurityEvent["type"],
    success: boolean,
    details?: string,
  ) => {
    const event: SecurityEvent = {
      id: Date.now().toString(),
      type,
      timestamp: new Date(),
      ipAddress: "192.168.1.1", // Mock IP
      userAgent: navigator.userAgent,
      success,
      details,
    };

    setSecurityEvents((prev) => [event, ...prev.slice(0, 99)]); // Keep last 100 events
    localStorage.setItem(
      "security-events",
      JSON.stringify([event, ...securityEvents.slice(0, 99)]),
    );
  };

  // Auto-logout on session timeout
  useEffect(() => {
    const checkSessionTimeout = () => {
      const lastActivity = localStorage.getItem("last-activity");
      if (lastActivity) {
        const timeSinceActivity = Date.now() - parseInt(lastActivity);
        const timeoutMs = settings.sessionTimeout * 60 * 1000;

        if (timeSinceActivity > timeoutMs) {
          // Session expired
          logSecurityEvent("logout", true, "Session timeout");
          // In real app, redirect to login
          console.log("Session expired - redirecting to login");
        }
      }
    };

    const interval = setInterval(checkSessionTimeout, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [settings.sessionTimeout]);

  // Track user activity
  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem("last-activity", Date.now().toString());
    };

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, []);

  const value: SecurityContextType = {
    settings,
    updateSettings,
    enableMFA,
    disableMFA,
    verifyMFA,
    isMFAEnabled: settings.mfaEnabled,
    securityEvents,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};
