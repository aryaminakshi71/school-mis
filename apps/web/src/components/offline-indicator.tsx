import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Database, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useOffline } from "../lib/offline-context";

export function OfflineIndicator() {
  const { isOnline, pendingActions, syncStatus, lastSyncTime, syncData } =
    useOffline();

  if (isOnline && pendingActions.length === 0) {
    return null;
  }

  const formatLastSync = () => {
    if (!lastSyncTime) return "Never";
    const diff = Date.now() - lastSyncTime.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`-translate-x-1/2 fixed top-16 left-1/2 z-50 flex transform items-center gap-3 rounded-full px-4 py-2 font-medium text-sm shadow-lg ${
          isOnline
            ? "border border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
            : "border border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
        }`}
      >
        {!isOnline ? (
          <>
            <WifiOff className="h-4 w-4" />
            <span>You're offline</span>
            {pendingActions.length > 0 && (
              <span className="rounded-full bg-red-200 px-2 py-0.5 text-xs dark:bg-red-800">
                {pendingActions.length} pending
              </span>
            )}
          </>
        ) : (
          <>
            <Database className="h-4 w-4" />
            <span>{pendingActions.length} changes pending</span>
            <button
              onClick={syncData}
              disabled={syncStatus === "syncing"}
              className="flex items-center gap-1 rounded-full bg-yellow-200 px-2 py-1 text-xs transition-colors hover:bg-yellow-300 dark:bg-yellow-800 dark:hover:bg-yellow-700"
            >
              {syncStatus === "syncing" ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              Sync
            </button>
            <span className="text-xs opacity-75">Last: {formatLastSync()}</span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export function OfflineStatusCard() {
  const {
    isOnline,
    pendingActions,
    syncStatus,
    lastSyncTime,
    syncData,
    cachedData,
  } = useOffline();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          Connection Status
        </h3>
        <span
          className={`font-medium text-sm ${isOnline ? "text-green-600" : "text-red-600"}`}
        >
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Pending Actions:
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {pendingActions.length}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Cached Items:
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {cachedData.size}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Last Sync:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {lastSyncTime ? lastSyncTime.toLocaleTimeString() : "Never"}
          </span>
        </div>

        {pendingActions.length > 0 && isOnline && (
          <button
            onClick={syncData}
            disabled={syncStatus === "syncing"}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {syncStatus === "syncing" ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Sync Now ({pendingActions.length} items)
              </>
            )}
          </button>
        )}

        {!isOnline && pendingActions.length > 0 && (
          <div className="flex items-start gap-2 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
            <AlertCircle className="mt-0.5 h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {pendingActions.length} actions will be synced when you go back
              online
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OfflineIndicator;
