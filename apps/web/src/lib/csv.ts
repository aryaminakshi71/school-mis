interface ExportOptions {
  filename?: string;
  columnHeaders?: string[];
  dateFields?: string[];
}

function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  options: ExportOptions = {},
): void {
  const {
    filename = `export-${new Date().toISOString().split("T")[0]}`,
    columnHeaders,
    dateFields = [],
  } = options;

  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const keys = columnHeaders || Object.keys(data[0]);

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return "";
    }
    if (dateFields.includes("") && value instanceof Date) {
      return value.toISOString().split("T")[0];
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const headerRow = keys.join(",");
  const dataRows = data.map((item) =>
    keys
      .map((key) => {
        const value = item[key];
        const formatted = formatValue(value);
        return `"${formatted.replace(/"/g, '""')}"`;
      })
      .join(","),
  );

  const csvContent = [headerRow, ...dataRows].join("\n");
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

function downloadTemplate(
  headers: string[],
  sampleData: Record<string, string>,
  filename: string,
): void {
  const data = [sampleData];
  const headerRow = headers.join(",");
  const dataRows = data.map((item) =>
    headers
      .map((key) => {
        const value = item[key] || "";
        return `"${value.replace(/"/g, '""')}"`;
      })
      .join(","),
  );

  const csvContent = [headerRow, ...dataRows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}-template.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function parseCSV(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.trim().split("\n");

        if (lines.length < 2) {
          resolve([]);
          return;
        }

        const headers = parseCSVLine(lines[0]);
        const data: Record<string, string>[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          const row: Record<string, string> = {};

          headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || "";
          });

          data.push(row);
        }

        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

export { exportToCSV, downloadTemplate, parseCSV };
export type { ExportOptions };
