import { describe, expect, test, vi } from "vitest";
import { api } from "../../../lib/api";

// Mock fetch
global.fetch = vi.fn();

describe("API Integration Tests", () => {
  test("students.list returns student data", async () => {
    const mockStudents = [{ id: "1", firstName: "John", lastName: "Doe" }];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStudents),
    });

    const result = await api.students.list();
    expect(result).toEqual(mockStudents);
  });

  test("students.list handles errors", async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

    await expect(api.students.list()).rejects.toThrow("Network error");
  });

  test("students.create sends correct data", async () => {
    const newStudent = { firstName: "Jane", lastName: "Smith" };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: "2", ...newStudent }),
    });

    const result = await api.students.create(newStudent);
    expect(result).toEqual({ id: "2", ...newStudent });
  });
});
