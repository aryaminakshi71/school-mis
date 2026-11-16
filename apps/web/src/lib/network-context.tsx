import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface NetworkContextType {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
};

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider = ({ children }: NetworkProviderProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [connectionType, setConnectionType] = useState("unknown");

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check connection quality
    const checkConnection = async () => {
      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        setConnectionType(connection.effectiveType || "unknown");

        // Consider 2g and slow-2g as slow connections
        setIsSlowConnection(
          ["slow-2g", "2g"].includes(connection.effectiveType),
        );
      }

      // Test connection speed with a small request
      try {
        const start = Date.now();
        await fetch("/api/health", { method: "HEAD" });
        const duration = Date.now() - start;

        // If request takes more than 2 seconds, consider it slow
        setIsSlowConnection((prev) => prev || duration > 2000);
      } catch {
        // Ignore fetch errors for connection testing
      }
    };

    checkConnection();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        isOnline,
        isSlowConnection,
        connectionType,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
