import { Calculator, DollarSign } from "lucide-react";
import { useState } from "react";

export interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: {
    hra: number;
    da: number;
    ta: number;
    medical: number;
    other: number;
  };
  deductions: {
    pf: number;
    tds: number;
    professionalTax: number;
    other: number;
  };
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  status: "draft" | "processed" | "paid";
  paidDate?: Date;
}

interface PayrollManagementProps {
  employees: {
    id: string;
    name: string;
    designation: string;
    department: string;
    basicSalary: number;
    joiningDate: Date;
  }[];
  onProcessPayroll: (entries: PayrollEntry[]) => Promise<void>;
  onGeneratePayslip: (entry: PayrollEntry) => Promise<void>;
}

const DEPARTMENTS = [
  "Mathematics",
  "Science",
  "English",
  "Administration",
  "Support Staff",
];

export function PayrollManagement({
  employees,
  onProcessPayroll,
  onGeneratePayslip,
}: PayrollManagementProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [payrollData, setPayrollData] = useState<PayrollEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const calculatePayroll = () => {
    const newEntries: PayrollEntry[] = employees.map((emp) => {
      const hra = emp.basicSalary * 0.3; // 30% of basic
      const da = emp.basicSalary * 0.2; // 20% of basic
      const ta = 1600; // Fixed
      const medical = 1250; // Fixed
      const otherAllowances = 0;

      const grossSalary =
        emp.basicSalary + hra + da + ta + medical + otherAllowances;

      const pf = Math.min(emp.basicSalary * 0.12, 1800); // 12% of basic, max 1800
      const professionalTax = grossSalary > 15000 ? 200 : 0;
      const tds = grossSalary > 50000 ? grossSalary * 0.1 : 0; // Simplified TDS
      const otherDeductions = 0;

      const totalDeductions = pf + tds + professionalTax + otherDeductions;
      const netSalary = grossSalary - totalDeductions;

      return {
        id: `pay-${emp.id}-${selectedMonth}-${selectedYear}`,
        employeeId: emp.id,
        employeeName: emp.name,
        designation: emp.designation,
        department: emp.department,
        month: months[selectedMonth - 1],
        year: selectedYear,
        basicSalary: emp.basicSalary,
        allowances: {
          hra,
          da,
          ta,
          medical,
          other: otherAllowances,
        },
        deductions: {
          pf,
          tds,
          professionalTax,
          other: otherDeductions,
        },
        grossSalary,
        totalDeductions,
        netSalary,
        status: "draft",
      };
    });

    setPayrollData(newEntries);
    setShowPreview(true);
  };

  const processPayroll = async () => {
    setIsProcessing(true);
    try {
      await onProcessPayroll(payrollData);
      setPayrollData((prev) =>
        prev.map((entry) => ({ ...entry, status: "paid" as const })),
      );
      alert("Payroll processed successfully!");
    } catch (error) {
      alert("Failed to process payroll. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPayout = payrollData.reduce(
    (sum, entry) => sum + entry.netSalary,
    0,
  );
  const totalEmployees = payrollData.length;

  const departmentWise = payrollData.reduce(
    (acc, entry) => {
      acc[entry.department] = (acc[entry.department] || 0) + entry.netSalary;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-gray-200 border-b p-6 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-xl dark:text-gray-100">
                Payroll Management
              </h2>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Process monthly salaries and generate payslips
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            >
              {months.map((month, idx) => (
                <option key={month} value={idx + 1}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            >
              {[2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <button
              onClick={calculatePayroll}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              <Calculator className="h-4 w-4" />
              Calculate
            </button>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="space-y-6 p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
              <p className="text-green-600 text-sm dark:text-green-400">
                Total Payout
              </p>
              <p className="font-bold text-2xl text-green-900 dark:text-green-300">
                ₹{totalPayout.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-blue-600 text-sm dark:text-blue-400">
                Employees
              </p>
              <p className="font-bold text-2xl text-blue-900 dark:text-blue-300">
                {totalEmployees}
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-4 dark:bg-purple-900/20">
              <p className="text-purple-600 text-sm dark:text-purple-400">
                Avg. Salary
              </p>
              <p className="font-bold text-2xl text-purple-900 dark:text-purple-300">
                ₹{Math.round(totalPayout / totalEmployees).toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-orange-50 p-4 dark:bg-orange-900/20">
              <p className="text-orange-600 text-sm dark:text-orange-400">
                Status
              </p>
              <p className="font-bold text-lg text-orange-900 dark:text-orange-300">
                {payrollData.every((p) => p.status === "paid")
                  ? "Paid"
                  : "Pending"}
              </p>
            </div>
          </div>

          {/* Payroll Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm dark:text-gray-300">
                    Employee
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm dark:text-gray-300">
                    Basic
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm dark:text-gray-300">
                    Allowances
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm dark:text-gray-300">
                    Deductions
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm dark:text-gray-300">
                    Net Salary
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {payrollData.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {entry.employeeName}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {entry.designation}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      ₹{entry.basicSalary.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-green-600 text-sm">
                      +₹
                      {(
                        entry.allowances.hra +
                        entry.allowances.da +
                        entry.allowances.ta +
                        entry.allowances.medical
                      ).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-red-600 text-sm">
                      -₹{entry.totalDeductions.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-sm">
                      ₹{entry.netSalary.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          entry.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedEntry(entry);
                          onGeneratePayslip(entry);
                        }}
                        className="text-primary text-sm hover:text-primary/80"
                      >
                        View Payslip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Process Button */}
          {!payrollData.every((p) => p.status === "paid") && (
            <div className="flex justify-end">
              <button
                onClick={processPayroll}
                disabled={isProcessing}
                className="flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-white hover:bg-green-600 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Process Payroll"}
              </button>
            </div>
          )}
        </div>
      )}

      {!showPreview && (
        <div className="p-12 text-center">
          <Calculator className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-gray-100">
            Ready to Process Payroll
          </h3>
          <p className="mx-auto max-w-md text-gray-500 text-sm dark:text-gray-400">
            Select the month and year, then click Calculate to generate the
            payroll for all {employees.length} employees.
          </p>
        </div>
      )}
    </div>
  );
}

export default PayrollManagement;
