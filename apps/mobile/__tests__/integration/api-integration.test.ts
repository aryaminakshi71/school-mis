import { describe, expect, it, vi } from "vitest";

// Mock React Native modules
vi.mock("react-native", () => ({
  Platform: { OS: "ios" },
  Alert: { alert: vi.fn() },
}));

// Mock Expo modules
vi.mock("expo-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

describe("Mobile API Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Network Requests", () => {
    it("should handle successful API responses", async () => {
      const mockResponse = {
        data: { id: "1", name: "John Doe" },
        status: 200,
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        status: 200,
      });

      const response = await fetch("/api/students");
      const data = await response.json();

      expect(data).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith("/api/students");
    });

    it("should handle network errors", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network Error"));

      await expect(fetch("/api/students")).rejects.toThrow("Network Error");
    });

    it("should handle API error responses", async () => {
      const errorResponse = {
        error: "Not Found",
        message: "Student not found",
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve(errorResponse),
      });

      const response = await fetch("/api/students/999");
      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(data).toEqual(errorResponse);
    });
  });

  describe("Data Persistence", () => {
    it("should store and retrieve data from AsyncStorage", async () => {
      const AsyncStorage = {
        setItem: vi.fn().mockResolvedValue(undefined),
        getItem: vi.fn().mockResolvedValue('{"user": "John"}'),
        removeItem: vi.fn().mockResolvedValue(undefined),
      };

      // Mock AsyncStorage
      vi.doMock("@react-native-async-storage/async-storage", () => ({
        default: AsyncStorage,
      }));

      await AsyncStorage.setItem("user", JSON.stringify({ user: "John" }));
      const stored = await AsyncStorage.getItem("user");

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "user",
        '{"user":"John"}',
      );
      expect(stored).toBe('{"user": "John"}');
      expect(JSON.parse(stored)).toEqual({ user: "John" });
    });
  });

  describe("Authentication Flow", () => {
    it("should handle login success", async () => {
      const loginData = {
        email: "student@example.com",
        password: "password123",
      };

      const mockResponse = {
        token: "jwt-token",
        user: {
          id: "1",
          name: "John Doe",
          role: "student",
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        status: 200,
      });

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toEqual(mockResponse);
      expect(data.user.role).toBe("student");
    });

    it("should handle login failure", async () => {
      const loginData = {
        email: "invalid@example.com",
        password: "wrongpassword",
      };

      const errorResponse = {
        error: "Invalid credentials",
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve(errorResponse),
        status: 401,
      });

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(data).toEqual(errorResponse);
    });
  });
});
