import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useNetwork } from "./network-context";

interface QueuedAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  retryCount: number;
}

interface ActionQueueContextType {
  queue: QueuedAction[];
  addToQueue: (
    action: Omit<QueuedAction, "id" | "timestamp" | "retryCount">,
  ) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  isProcessing: boolean;
}

const ActionQueueContext = createContext<ActionQueueContextType | undefined>(
  undefined,
);

export const useActionQueue = () => {
  const context = useContext(ActionQueueContext);
  if (!context) {
    throw new Error(
      "useActionQueue must be used within an ActionQueueProvider",
    );
  }
  return context;
};

interface ActionQueueProviderProps {
  children: React.ReactNode;
  onExecuteAction?: (action: QueuedAction) => Promise<void>;
  maxRetries?: number;
}

export const ActionQueueProvider: React.FC<ActionQueueProviderProps> = ({
  children,
  onExecuteAction,
  maxRetries = 3,
}) => {
  const [queue, setQueue] = useState<QueuedAction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isOnline } = useNetwork();

  // Load queue from localStorage on mount
  useEffect(() => {
    const savedQueue = localStorage.getItem("actionQueue");
    if (savedQueue) {
      try {
        const parsedQueue = JSON.parse(savedQueue);
        setQueue(parsedQueue);
      } catch (error) {
        console.error("Failed to parse saved action queue:", error);
        localStorage.removeItem("actionQueue");
      }
    }
  }, []);

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("actionQueue", JSON.stringify(queue));
  }, [queue]);

  // Process queue when coming back online
  useEffect(() => {
    if (isOnline && queue.length > 0 && !isProcessing && onExecuteAction) {
      processQueue();
    }
  }, [isOnline, queue.length, isProcessing, onExecuteAction]);

  const addToQueue = (
    action: Omit<QueuedAction, "id" | "timestamp" | "retryCount">,
  ) => {
    const queuedAction: QueuedAction = {
      ...action,
      id: `${action.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
    };

    setQueue((prev) => [...prev, queuedAction]);

    if (!isOnline) {
      toast.info(`Action queued: ${action.type}`, {
        description: "Will be executed when connection is restored.",
      });
    }
  };

  const removeFromQueue = (id: string) => {
    setQueue((prev) => prev.filter((action) => action.id !== id));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const processQueue = async () => {
    if (!onExecuteAction || isProcessing) return;

    setIsProcessing(true);

    const actionsToProcess = [...queue];

    for (const action of actionsToProcess) {
      try {
        await onExecuteAction(action);
        removeFromQueue(action.id);
        toast.success(`Action completed: ${action.type}`);
      } catch (error) {
        console.error(`Failed to execute queued action ${action.type}:`, error);

        if (action.retryCount < maxRetries) {
          // Increment retry count and keep in queue
          setQueue((prev) =>
            prev.map((a) =>
              a.id === action.id ? { ...a, retryCount: a.retryCount + 1 } : a,
            ),
          );

          toast.warning(`Action failed, will retry: ${action.type}`, {
            description: `Attempt ${action.retryCount + 1} of ${maxRetries + 1}`,
          });
        } else {
          // Max retries reached, remove from queue
          removeFromQueue(action.id);
          toast.error(`Action failed permanently: ${action.type}`, {
            description: "Maximum retry attempts exceeded.",
          });
        }
      }
    }

    setIsProcessing(false);
  };

  const value: ActionQueueContextType = {
    queue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    isProcessing,
  };

  return (
    <ActionQueueContext.Provider value={value}>
      {children}
    </ActionQueueContext.Provider>
  );
};
