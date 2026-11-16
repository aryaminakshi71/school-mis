import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";

export type ImportEntity =
  | "students"
  | "teachers"
  | "classes"
  | "subjects"
  | "fees";

interface ImportTemplate {
  entity: ImportEntity;
  label: string;
  description: string;
  columns: string[];
  sampleData: Record<string, any>[];
}

const importTemplates: ImportTemplate[] = [
  {
    entity: "students",
    label: "Students",
    description: "Import student records with personal and academic details",
    columns: [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Date of Birth",
      "Gender",
      "Address",
      "Class",
      "Section",
      "Roll Number",
      "Admission Date",
      "Parent Name",
      "Parent Phone",
    ],
    sampleData: [
      {
        "First Name": "Rahul",
        "Last Name": "Sharma",
        Email: "rahul.sharma@example.com",
        Phone: "9876543210",
        "Date of Birth": "2008-05-15",
        Gender: "Male",
        Address: "123 Main St, Delhi",
        Class: "10",
        Section: "A",
        "Roll Number": "101",
        "Admission Date": "2020-04-01",
        "Parent Name": "Mr. Sharma",
        "Parent Phone": "9876543211",
      },
      {
        "First Name": "Priya",
        "Last Name": "Patel",
        Email: "priya.patel@example.com",
        Phone: "9876543220",
        "Date of Birth": "2009-03-20",
        Gender: "Female",
        Address: "456 Park Ave, Mumbai",
        Class: "9",
        Section: "B",
        "Roll Number": "102",
        "Admission Date": "2021-04-01",
        "Parent Name": "Mrs. Patel",
        "Parent Phone": "9876543221",
      },
    ],
  },
  {
    entity: "teachers",
    label: "Teachers",
    description: "Import teacher records with qualifications and assignments",
    columns: [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Qualification",
      "Subject",
      "Experience (Years)",
      "Joining Date",
      "Salary",
      "Address",
      "Employee ID",
    ],
    sampleData: [
      {
        "First Name": "Rajesh",
        "Last Name": "Kumar",
        Email: "rajesh.kumar@school.edu",
        Phone: "9876543300",
        Qualification: "M.Sc Mathematics, B.Ed",
        Subject: "Mathematics",
        "Experience (Years)": 8,
        "Joining Date": "2017-06-01",
        Salary: 50000,
        Address: "789 School Road, Delhi",
        "Employee ID": "TCH001",
      },
      {
        "First Name": "Sunita",
        "Last Name": "Gupta",
        Email: "sunita.gupta@school.edu",
        Phone: "9876543310",
        Qualification: "M.A. English, B.Ed",
        Subject: "English",
        "Experience (Years)": 5,
        "Joining Date": "2020-06-01",
        Salary: 45000,
        Address: "321 College Lane, Mumbai",
        "Employee ID": "TCH002",
      },
    ],
  },
  {
    entity: "classes",
    label: "Classes",
    description: "Import class schedules and room assignments",
    columns: [
      "Class Name",
      "Section",
      "Class Teacher",
      "Room Number",
      "Capacity",
      "Academic Year",
    ],
    sampleData: [
      {
        "Class Name": "10",
        Section: "A",
        "Class Teacher": "Rajesh Kumar",
        "Room Number": "101",
        Capacity: 45,
        "Academic Year": "2025-2026",
      },
      {
        "Class Name": "9",
        Section: "B",
        "Class Teacher": "Sunita Gupta",
        "Room Number": "102",
        Capacity: 40,
        "Academic Year": "2025-2026",
      },
    ],
  },
];

interface BulkImportExportProps {
  onImport: (entity: ImportEntity, data: any[]) => Promise<void>;
  onExport: (entity: ImportEntity) => Promise<any[]>;
}

export function BulkImportExport({
  onImport,
  onExport,
}: BulkImportExportProps) {
  const [activeTab, setActiveTab] = useState<"import" | "export">("import");
  const [selectedEntity, setSelectedEntity] = useState<ImportEntity | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    success: number;
    errors: number;
    messages: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = (template: ImportTemplate) => {
    const ws = XLSX.utils.json_to_sheet(template.sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, template.label);

    // Add column headers
    XLSX.utils.sheet_add_aoa(ws, [template.columns], { origin: "A1" });

    XLSX.writeFile(wb, `${template.entity}_import_template.xlsx`);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !selectedEntity) return;

    setIsProcessing(true);
    setProgress(0);
    setResults(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validate data
      const template = importTemplates.find((t) => t.entity === selectedEntity);
      const requiredColumns = template?.columns || [];

      let validCount = 0;
      let errorCount = 0;
      const messages: string[] = [];

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i] as Record<string, any>;
        const missingColumns = requiredColumns.filter((col) => !row[col]);

        if (missingColumns.length > 0) {
          errorCount++;
          messages.push(
            `Row ${i + 1}: Missing required fields: ${missingColumns.join(", ")}`,
          );
        } else {
          validCount++;
        }

        setProgress(Math.round(((i + 1) / jsonData.length) * 50));
      }

      if (validCount > 0) {
        await onImport(selectedEntity, jsonData);
        setProgress(100);
        setResults({
          success: validCount,
          errors: errorCount,
          messages:
            errorCount > 0
              ? messages.slice(0, 5)
              : ["Import completed successfully!"],
        });
      } else {
        setResults({
          success: 0,
          errors: errorCount,
          messages: ["No valid records found. Please check your data."],
        });
      }
    } catch (error) {
      console.error("Import error:", error);
      setResults({
        success: 0,
        errors: 1,
        messages: ["An error occurred during import. Please try again."],
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleExport = async (entity: ImportEntity) => {
    setIsProcessing(true);
    try {
      const data = await onExport(entity);

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, entity);

      XLSX.writeFile(
        wb,
        `${entity}_export_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header Tabs */}
      <div className="flex border-gray-200 border-b dark:border-gray-800">
        <button
          onClick={() => setActiveTab("import")}
          className={`flex flex-1 items-center justify-center gap-2 px-6 py-4 font-medium text-sm transition-colors ${
            activeTab === "import"
              ? "border-primary border-b-2 bg-primary/5 text-primary"
              : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
          }`}
        >
          <Upload className="h-4 w-4" />
          Import Data
        </button>
        <button
          onClick={() => setActiveTab("export")}
          className={`flex flex-1 items-center justify-center gap-2 px-6 py-4 font-medium text-sm transition-colors ${
            activeTab === "export"
              ? "border-primary border-b-2 bg-primary/5 text-primary"
              : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
          }`}
        >
          <Download className="h-4 w-4" />
          Export Data
        </button>
      </div>

      <div className="p-6">
        {activeTab === "import" ? (
          <div className="space-y-6">
            {!selectedEntity ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {importTemplates.map((template) => (
                  <button
                    key={template.entity}
                    onClick={() => setSelectedEntity(template.entity)}
                    className="rounded-xl border border-transparent bg-gray-50 p-6 text-left transition-colors hover:border-primary/20 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20">
                      <FileSpreadsheet className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                      {template.label}
                    </h3>
                    <p className="text-gray-500 text-sm dark:text-gray-400">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg dark:text-gray-100">
                      Import{" "}
                      {
                        importTemplates.find((t) => t.entity === selectedEntity)
                          ?.label
                      }
                    </h3>
                    <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
                      Upload an Excel file with your data
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedEntity(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Template Download */}
                <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-900 text-sm dark:text-blue-300">
                        Download Template First
                      </p>
                      <p className="mt-1 text-blue-700 text-sm dark:text-blue-400">
                        Use our template to ensure your data is formatted
                        correctly
                      </p>
                      <button
                        onClick={() =>
                          downloadTemplate(
                            importTemplates.find(
                              (t) => t.entity === selectedEntity,
                            )!,
                          )
                        }
                        className="mt-3 flex items-center gap-2 font-medium text-blue-600 text-sm hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Download className="h-4 w-4" />
                        Download Template
                      </button>
                    </div>
                  </div>
                </div>

                {/* Upload Area */}
                <div
                  className="cursor-pointer rounded-xl border-2 border-gray-300 border-dashed p-8 text-center transition-colors hover:border-primary/50 dark:border-gray-700"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="font-medium text-gray-600 dark:text-gray-400">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-1 text-gray-400 text-sm dark:text-gray-500">
                    Excel or CSV files only (max 5MB)
                  </p>
                </div>

                {/* Progress */}
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Processing...
                      </span>
                      <span className="font-medium text-primary">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                {/* Results */}
                <AnimatePresence>
                  {results && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`rounded-xl p-4 ${
                        results.errors === 0
                          ? "border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                          : "border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {results.errors === 0 ? (
                          <Check className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        )}
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              results.errors === 0
                                ? "text-green-900 dark:text-green-300"
                                : "text-yellow-900 dark:text-yellow-300"
                            }`}
                          >
                            Import Complete
                          </p>
                          <p className="mt-1 text-sm">
                            <span className="font-medium text-green-600 dark:text-green-400">
                              {results.success} records imported
                            </span>
                            {results.errors > 0 && (
                              <span className="ml-2 font-medium text-red-600 dark:text-red-400">
                                {results.errors} errors
                              </span>
                            )}
                          </p>
                          {results.messages.length > 0 && (
                            <ul className="mt-2 space-y-1 text-gray-600 text-sm dark:text-gray-400">
                              {results.messages.map((msg, i) => (
                                <li key={i}>{msg}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-500 text-sm dark:text-gray-400">
              Select data to export
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {importTemplates.map((template) => (
                <button
                  key={template.entity}
                  onClick={() => handleExport(template.entity)}
                  disabled={isProcessing}
                  className="rounded-xl border border-transparent bg-gray-50 p-6 text-left transition-colors hover:border-primary/20 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                    {isProcessing ? (
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Download className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                    Export {template.label}
                  </h3>
                  <p className="text-gray-500 text-sm dark:text-gray-400">
                    Download all {template.label.toLowerCase()} data as Excel
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BulkImportExport;
