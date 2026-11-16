import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { api } from "../lib/api";

// Mock the API
vi.mock("../lib/api", () => ({
  api: {
    students: {
      list: vi.fn(),
    },
  },
}));

describe("React Query Integration", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
        },
      },
    });
    vi.clearAllMocks();
  });

  it("should fetch data successfully", async () => {
    const mockData = [{ id: "1", name: "John Doe" }];
    (api.students.list as any).mockResolvedValue(mockData);

    const { result } = renderHook(
      () =>
        useQuery({
          queryKey: ["students"],
          queryFn: () => api.students.list(),
        }),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(api.students.list).toHaveBeenCalledTimes(1);
  });

  it("should handle loading state", async () => {
    const mockData = [{ id: "1", name: "John Doe" }];
    (api.students.list as any).mockResolvedValue(mockData);

    const { result } = renderHook(
      () =>
        useQuery({
          queryKey: ["students"],
          queryFn: () => api.students.list(),
        }),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      },
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Network Error";
    (api.students.list as any).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(
      () =>
        useQuery({
          queryKey: ["students"],
          queryFn: () => api.students.list(),
        }),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe(errorMessage);
  });

  it("should cache data", async () => {
    const mockData = [{ id: "1", name: "John Doe" }];
    (api.students.list as any).mockResolvedValue(mockData);

    // First query
    const { result: result1, rerender: rerender1 } = renderHook(
      () =>
        useQuery({
          queryKey: ["students"],
          queryFn: () => api.students.list(),
        }),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      },
    );

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true);
    });

    // Second query with same key should use cache
    const { result: result2 } = renderHook(
      () =>
        useQuery({
          queryKey: ["students"],
          queryFn: () => api.students.list(),
        }),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      },
    );

    expect(result2.current.data).toEqual(mockData);
    // Should only be called once due to caching
    expect(api.students.list).toHaveBeenCalledTimes(1);
  });
});
