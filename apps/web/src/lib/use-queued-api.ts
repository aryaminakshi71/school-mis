import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActionQueue } from "./action-queue-context";
import { request } from "./api";
import { useNetwork } from "./network-context";

interface QueuedApiOptions {
  queueOnOffline?: boolean;
  actionType?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useQueuedApi = () => {
  const { addToQueue } = useActionQueue();
  const { isOnline } = useNetwork();
  const queryClient = useQueryClient();

  const executeQueuedAction = async (action: any) => {
    const { type, payload } = action;

    switch (type) {
      case "attendance.mark":
        await request("/attendance", {
          method: "POST",
          body: payload,
        });
        break;
      case "grade.submit":
        await request("/grades", {
          method: "POST",
          body: payload,
        });
        break;
      case "assignment.submit":
        await request("/assignments/submit", {
          method: "POST",
          body: payload,
        });
        break;
      case "fee.pay":
        await request("/fees/pay", {
          method: "POST",
          body: payload,
        });
        break;
      default:
        throw new Error(`Unknown action type: ${type}`);
    }

    // Invalidate relevant queries after successful execution
    queryClient.invalidateQueries();
  };

  const queuedMutation = useMutation({
    mutationFn: executeQueuedAction,
  });

  const createQueuedMutation = (
    mutationFn: (variables: any) => Promise<any>,
    options: QueuedApiOptions = {},
  ) => {
    const { queueOnOffline = true, actionType, onSuccess, onError } = options;

    return useMutation({
      mutationFn: async (variables: any) => {
        if (!isOnline && queueOnOffline && actionType) {
          // Queue the action for later execution
          addToQueue({
            type: actionType,
            payload: variables,
          });
          return { queued: true };
        }

        // Execute immediately if online
        return await mutationFn(variables);
      },
      onSuccess: (data, variables, context) => {
        if (data?.queued) {
          // Action was queued, don't call onSuccess yet
          return;
        }
        onSuccess?.();
      },
      onError,
    });
  };

  const createQueuedQuery = (
    queryKey: any[],
    queryFn: () => Promise<any>,
    options: { enabled?: boolean } = {},
  ) => {
    return useQuery({
      queryKey,
      queryFn,
      enabled: options.enabled !== false && isOnline, // Only run queries when online
      staleTime: isOnline ? 5 * 60 * 1000 : Infinity, // Cache longer when offline
      gcTime: isOnline ? 10 * 60 * 1000 : Infinity,
    });
  };

  return {
    createQueuedMutation,
    createQueuedQuery,
    executeQueuedAction,
  };
};
