import { createMemoryHistory } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

describe("Router Integration", () => {
  it("should create memory history", () => {
    const history = createMemoryHistory({
      initialEntries: ["/"],
    });

    expect(history.location.pathname).toBe("/");
  });

  describe("Route Paths", () => {
    it("should handle root path", () => {
      const history = createMemoryHistory({
        initialEntries: ["/"],
      });

      expect(history.location.pathname).toBe("/");
    });

    it("should handle student portal path", () => {
      const history = createMemoryHistory({
        initialEntries: ["/app/student-portal"],
      });

      expect(history.location.pathname).toBe("/app/student-portal");
    });

    it("should handle teacher portal path", () => {
      const history = createMemoryHistory({
        initialEntries: ["/app/teacher-portal"],
      });

      expect(history.location.pathname).toBe("/app/teacher-portal");
    });

    it("should handle parent portal path", () => {
      const history = createMemoryHistory({
        initialEntries: ["/app/parent-portal"],
      });

      expect(history.location.pathname).toBe("/app/parent-portal");
    });

    it("should handle staff portal path", () => {
      const history = createMemoryHistory({
        initialEntries: ["/app/staff-portal"],
      });

      expect(history.location.pathname).toBe("/app/staff-portal");
    });
  });
});
