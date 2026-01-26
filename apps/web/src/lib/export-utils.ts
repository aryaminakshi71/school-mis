/**
 * Export Utilities
 * 
 * Functions for exporting data to various formats (CSV, Excel, PDF)
 */

/**
 * Export data to CSV
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string = "export",
  headers?: Record<string, string>
): void {
  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Get headers from first object or use provided headers
  const keys = Object.keys(data[0]);
  const headerRow = keys.map((key) => headers?.[key] || key);

  // Create CSV content
  const csvContent = [
    headerRow.join(","),
    ...data.map((row) =>
      keys
        .map((key) => {
          const value = row[key];
          // Handle values that might contain commas or quotes
          if (value === null || value === undefined) return "";
          const stringValue = String(value);
          // Escape quotes and wrap in quotes if contains comma or quote
          if (stringValue.includes(",") || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to JSON
 */
export function exportToJSON<T>(
  data: T[],
  filename: string = "export"
): void {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.json`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to Excel (XLSX) - requires xlsx library
 * This is a placeholder - install 'xlsx' package to use
 */
export async function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  filename: string = "export",
  sheetName: string = "Sheet1",
  headers?: Record<string, string>
): Promise<void> {
  try {
    // Dynamic import to avoid bundling if not used
    const XLSX = await import("xlsx");
    
    if (data.length === 0) {
      console.warn("No data to export");
      return;
    }

    // Prepare data with headers
    const keys = Object.keys(data[0]);
    const worksheetData = [
      keys.map((key) => headers?.[key] || key), // Header row
      ...data.map((row) => keys.map((key) => row[key] ?? "")), // Data rows
    ];

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Write file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error) {
    console.error("Failed to export to Excel. Install 'xlsx' package:", error);
    // Fallback to CSV
    exportToCSV(data, filename, headers);
  }
}

/**
 * Download template CSV file
 */
export function downloadTemplate(
  headers: string[],
  filename: string = "template"
): void {
  const csvContent = headers.join(",");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse CSV file
 */
export function parseCSV(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter((line) => line.trim());
        if (lines.length === 0) {
          reject(new Error("CSV file is empty"));
          return;
        }

        const headers = lines[0].split(",").map((h) => h.trim());
        const data = lines.slice(1).map((line) => {
          const values = line.split(",").map((v) => v.trim());
          const row: Record<string, string> = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || "";
          });
          return row;
        });

        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Format data for export with custom formatters
 */
export function formatDataForExport<T extends Record<string, unknown>>(
  data: T[],
  formatters?: Record<string, (value: unknown) => string>
): Record<string, string>[] {
  return data.map((row) => {
    const formatted: Record<string, string> = {};
    Object.entries(row).forEach(([key, value]) => {
      if (formatters?.[key]) {
        formatted[key] = formatters[key](value);
      } else {
        formatted[key] = value === null || value === undefined ? "" : String(value);
      }
    });
    return formatted;
  });
}
