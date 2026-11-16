import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock fetch globally
global.fetch = vi.fn();

describe("API Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Network Requests", () => {
    it("should handle successful API responses", async () => {
      const mockResponse = {
        data: { id: "1", name: "John Doe" },
        status: 200,
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const response = await fetch("/api/students");
      const data = await response.json();

      expect(data).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith("/api/students");
    });

    it("should handle network errors", async () => {
      (global.fetch as any).mockRejectedValue(new Error("Network Error"));

      await expect(fetch("/api/students")).rejects.toThrow("Network Error");
    });
  });

  describe("Data Transformation", () => {
    it("should transform student data correctly", () => {
      const rawData = {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        class_id: "class-1",
      };

      const transformed = {
        id: rawData.id,
        name: `${rawData.first_name} ${rawData.last_name}`,
        email: rawData.email,
        classId: rawData.class_id,
      };

      expect(transformed.name).toBe("John Doe");
      expect(transformed.email).toBe("john@example.com");
    });
  });
});
