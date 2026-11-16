import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { useNetwork } from "../../lib/network-context";

export const OfflineIndicator = () => {
  const { isOnline, isSlowConnection, connectionType } = useNetwork();

  if (isOnline && !isSlowConnection) {
    return null; // Don't show anything when everything is good
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge
        variant={isOnline ? "warning" : "destructive"}
        className="flex items-center gap-2 px-3 py-1"
      >
        {isOnline ? (
          <>
            <Wifi className="h-3 w-3" />
            <span className="text-xs">
              {isSlowConnection ? "Slow Connection" : "Online"}
            </span>
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            <span className="text-xs">Offline</span>
          </>
        )}
      </Badge>

      {!isOnline && (
        <div className="mt-2 max-w-xs rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-destructive text-sm">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div>
              <p className="font-medium">You're offline</p>
              <p className="text-xs opacity-90">
                Some features may not work. Please check your internet
                connection.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
