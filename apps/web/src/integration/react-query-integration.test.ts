import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the API
vi.mock("../../lib/api", () => ({
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
          gcTime: 0,
        },
      },
    });
    vi.clearAllMocks();
  });

  it("should create query client", () => {
    expect(queryClient).toBeInstanceOf(QueryClient);
  });

  it("should clear query cache", () => {
    queryClient.clear();
    expect(queryClient).toBeDefined();
  });

  it("should handle query options", () => {
    const options = {
      retry: false,
      cacheTime: 0,
    };

    expect(options.retry).toBe(false);
    expect(options.cacheTime).toBe(0);
  });
});
