import { describe, it, expect, vi, beforeEach } from "vitest";
import { exportToCSV, downloadTemplate, parseCSV } from "../lib/csv";

describe("CSV Utilities", () => {
  describe("exportToCSV", () => {
    it("should export data to CSV format", () => {
      const data = [
        { name: "John", age: 25, city: "New York" },
        { name: "Jane", age: 30, city: "London" },
      ];

      const mockCreateObjectURL = vi.fn();
      const mockRevokeObjectURL = vi.fn();
      const mockAppendChild = vi.fn();
      const mockRemove = vi.fn();

      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
      global.document.createElement = vi.fn().mockReturnValue({
        setAttribute: vi.fn(),
        style: {},
      }) as unknown as Document["createElement"];
      global.document.body.appendChild = mockAppendChild;
      global.document.body.removeChild = mockRemove;

      exportToCSV(data, { filename: "test" });

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
    });

    it("should handle empty data", () => {
      const consoleWarn = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      const data: never[] = [];

      exportToCSV(data);

      expect(consoleWarn).toHaveBeenCalledWith("No data to export");
      consoleWarn.mockRestore();
    });
  });

  describe("parseCSV", () => {
    it("should parse simple CSV data", async () => {
      const content = "name,age,city\nJohn,25,New York\nJane,30,London";
      const blob = new Blob([content], { type: "text/csv" });
      const file = new File([blob], "test.csv", { type: "text/csv" });

      const result = await parseCSV(file);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ name: "John", age: "25", city: "New York" });
      expect(result[1]).toEqual({ name: "Jane", age: "30", city: "London" });
    });

    it("should handle empty CSV", async () => {
      const content = "name,age";
      const blob = new Blob([content], { type: "text/csv" });
      const file = new File([blob], "test.csv", { type: "text/csv" });

      const result = await parseCSV(file);

      expect(result).toHaveLength(0);
    });
  });

  describe("downloadTemplate", () => {
    it("should create download link for template", () => {
      const headers = ["name", "email", "phone"];
      const sampleData = { name: "John", email: "john@test.com", phone: "123" };

      const mockCreateObjectURL = vi.fn();
      const mockRevokeObjectURL = vi.fn();
      const mockAppendChild = vi.fn();
      const mockRemove = vi.fn();

      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
      global.document.body.appendChild = mockAppendChild;
      global.document.body.removeChild = mockRemove;

      downloadTemplate(headers, sampleData, "template");

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
    });
  });
});
