import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE = "/api";

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export function useApi<T>(
  endpoint: string,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
    dependencies?: unknown[];
  },
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        signal: abortControllerRef.current.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await handleResponse<ApiResponse<T>>(response);
      setData(result.data);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (options?.enabled !== false) {
      fetchData();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData, options?.enabled]);

  useEffect(() => {
    if (options?.refetchInterval) {
      const interval = setInterval(fetchData, options.refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, options?.refetchInterval]);

  return { data, loading, error, refetch: fetchData };
}

export function useMutation<T, R = T>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE" = "POST",
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (body?: T): Promise<R | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
          method,
          headers: { "Content-Type": "application/json" },
          body: body ? JSON.stringify(body) : undefined,
        });

        const result = await handleResponse<ApiResponse<R>>(response);
        return result.data;
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, method],
  );

  return { mutate, loading, error };
}

export const api = {
  get: <T>(endpoint: string) =>
    fetch(`${API_BASE}${endpoint}`).then(handleResponse<ApiResponse<T>>),

  post: <T>(endpoint: string, body: T) =>
    fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handleResponse<ApiResponse<T>>),

  put: <T>(endpoint: string, body: T) =>
    fetch(`${API_BASE}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handleResponse<ApiResponse<T>>),

  delete: <T>(endpoint: string) =>
    fetch(`${API_BASE}${endpoint}`, {
      method: "DELETE",
    }).then(handleResponse<ApiResponse<T>>),
};

export default api;
