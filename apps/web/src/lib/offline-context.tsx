import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface QueuedAction {
  id: string;
  type: "create" | "update" | "delete";
  entity: string;
  data: any;
  timestamp: number;
  retryCount: number;
  failed?: boolean;
}

interface OfflineContextType {
  isOnline: boolean;
  pendingActions: QueuedAction[];
  queueAction: (
    action: Omit<QueuedAction, "id" | "timestamp" | "retryCount">,
  ) => void;
  syncData: () => Promise<void>;
  lastSyncTime: Date | null;
  syncStatus: "idle" | "syncing" | "error";
  cachedData: Map<string, any>;
  cacheData: (key: string, data: any) => void;
  getCachedData: (key: string) => any;
}

const OfflineContext = createContext<OfflineContextType | null>(null);

const DB_NAME = "school-mis-offline";
const DB_VERSION = 1;
const STORE_NAME = "pending-actions";
const CACHE_STORE = "cached-data";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(CACHE_STORE)) {
        db.createObjectStore(CACHE_STORE, { keyPath: "key" });
      }
    };
  });
}

async function getQueuedActions(): Promise<QueuedAction[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveQueuedAction(action: QueuedAction): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(action);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function removeQueuedAction(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function cacheData(key: string, data: any): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CACHE_STORE, "readwrite");
    const store = transaction.objectStore(CACHE_STORE);
    const request = store.put({ key, data, timestamp: Date.now() });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function getCachedData(key: string): Promise<any> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CACHE_STORE, "readonly");
    const store = transaction.objectStore(CACHE_STORE);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result?.data);
    request.onerror = () => reject(request.error);
  });
}

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState<QueuedAction[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "error">(
    "idle",
  );
  const [cachedDataMap] = useState(() => new Map<string, any>());
  const queryClient = useQueryClient();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncData();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load pending actions on mount
  useEffect(() => {
    loadPendingActions();
  }, []);

  const loadPendingActions = async () => {
    try {
      const actions = await getQueuedActions();
      setPendingActions(actions);
    } catch (error) {
      console.error("Failed to load pending actions:", error);
    }
  };

  const queueAction = useCallback(
    async (action: Omit<QueuedAction, "id" | "timestamp" | "retryCount">) => {
      const newAction: QueuedAction = {
        ...action,
        id: `${action.entity}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        retryCount: 0,
      };

      await saveQueuedAction(newAction);
      setPendingActions((prev) => [...prev, newAction]);

      // Try to sync immediately if online
      if (isOnline) {
        syncData();
      }
    },
    [isOnline],
  );

  const syncData = useCallback(async () => {
    if (!isOnline || pendingActions.length === 0) return;

    setSyncStatus("syncing");

    try {
      const actions = [...pendingActions];

      for (const action of actions) {
        try {
          // Execute the action
          await executeAction(action);

          // Remove from queue
          await removeQueuedAction(action.id);
          setPendingActions((prev) => prev.filter((a) => a.id !== action.id));
        } catch (error) {
          console.error(`Failed to sync action ${action.id}:`, error);

          // Increment retry count
          const updatedAction = {
            ...action,
            retryCount: action.retryCount + 1,
          };

          // If max retries reached, keep but mark as failed
          if (updatedAction.retryCount >= 3) {
            await saveQueuedAction({ ...updatedAction, failed: true });
          } else {
            await saveQueuedAction(updatedAction);
          }
        }
      }

      setLastSyncTime(new Date());
      setSyncStatus("idle");

      // Invalidate queries to refresh data
      queryClient.invalidateQueries();
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncStatus("error");
    }
  }, [isOnline, pendingActions, queryClient]);

  const executeAction = async (action: QueuedAction) => {
    // This would be replaced with actual API calls
    switch (action.type) {
      case "create":
        // await api.create(action.entity, action.data);
        break;
      case "update":
        // await api.update(action.entity, action.data.id, action.data);
        break;
      case "delete":
        // await api.delete(action.entity, action.data.id);
        break;
    }
  };

  const cacheDataFn = useCallback(
    async (key: string, data: any) => {
      cachedDataMap.set(key, data);
      await cacheData(key, data);
    },
    [cachedDataMap],
  );

  const getCachedDataFn = useCallback(
    async (key: string) => {
      if (cachedDataMap.has(key)) {
        return cachedDataMap.get(key);
      }

      const data = await getCachedData(key);
      if (data) {
        cachedDataMap.set(key, data);
      }
      return data;
    },
    [cachedDataMap],
  );

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        pendingActions,
        queueAction,
        syncData,
        lastSyncTime,
        syncStatus,
        cachedData: cachedDataMap,
        cacheData: cacheDataFn,
        getCachedData: getCachedDataFn,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error("useOffline must be used within an OfflineProvider");
  }
  return context;
}

// Hook for offline-aware data fetching
export function useOfflineQuery<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options?: { staleTime?: number },
) {
  const { isOnline, getCachedData, cacheData } = useOffline();

  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      if (isOnline) {
        const data = await fetchFn();
        await cacheData(key, data);
        return data;
      } else {
        const cached = await getCachedData(key);
        if (cached) {
          return cached;
        }
        throw new Error("No cached data available offline");
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000,
  });
}

// Hook for offline mutations
export function useOfflineMutation<T, V>(
  entity: string,
  type: "create" | "update" | "delete",
  onlineFn: (variables: V) => Promise<T>,
) {
  const { isOnline, queueAction } = useOffline();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: V) => {
      if (isOnline) {
        return await onlineFn(variables);
      } else {
        // Queue for later
        queueAction({
          type,
          entity,
          data: variables,
        });

        // Optimistic update
        return variables as unknown as T;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export default OfflineProvider;
