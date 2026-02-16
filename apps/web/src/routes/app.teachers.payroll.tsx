/**
 * Staff Payroll Management - Salary, Payslips, Deductions
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { exportToExcel } from "@/lib/export-utils";
import { useSearch } from "@/lib/search-utils";
import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Calculator,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Plus,
  Receipt,
  Search,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/teachers/payroll")({
  component: PayrollPage,
});

const subFeatures = [
  { name: "All Staff", href: "/app/teachers", icon: Users },
  { name: "Recruitment", href: "/app/teachers/recruitment", icon: UserPlus },
  {
    name: "Payroll",
    href: "/app/teachers/payroll",
    icon: DollarSign,
    active: true,
  },
  { name: "Attendance", href: "/app/teachers/attendance", icon: Calendar },
  { name: "Leave", href: "/app/teachers/leave", icon: Clock },
  { name: "Performance", href: "/app/teachers/performance", icon: Award },
  { name: "Training", href: "/app/teachers/training", icon: Award },
];

// Mock data for salary records
const salaryRecords = [
  {
    id: "EMP-001",
    name: "Ramesh Kumar",
    designation: "Senior Teacher",
    basicSalary: 55000,
    allowances: 15000,
    deductions: 8500,
    netSalary: 61500,
    month: "January 2026",
    status: "paid",
    paymentDate: "2026-01-31",
  },
  {
    id: "EMP-002",
    name: "Priya Sharma",
    designation: "Teacher",
    basicSalary: 45000,
    allowances: 12000,
    deductions: 7200,
    netSalary: 49800,
    month: "January 2026",
    status: "pending",
    paymentDate: "-",
  },
  {
    id: "EMP-003",
    name: "Amit Patel",
    designation: "Head of Department",
    basicSalary: 65000,
    allowances: 20000,
    deductions: 11000,
    netSalary: 74000,
    month: "January 2026",
    status: "paid",
    paymentDate: "2026-01-31",
  },
  {
    id: "EMP-004",
    name: "Sneha Gupta",
    designation: "Teacher",
    basicSalary: 42000,
    allowances: 10000,
    deductions: 6500,
    netSalary: 45500,
    month: "January 2026",
    status: "processing",
    paymentDate: "-",
  },
];

// Mock data for recent payslips
const recentPayslips = [
  {
    id: "PS-2026-01-001",
    employee: "Ramesh Kumar",
    month: "January 2026",
    amount: 61500,
    date: "2026-01-31",
  },
  {
    id: "PS-2026-01-002",
    employee: "Amit Patel",
    month: "January 2026",
    amount: 74000,
    date: "2026-01-31",
  },
  {
    id: "PS-2025-12-001",
    employee: "Ramesh Kumar",
    month: "December 2025",
    amount: 61500,
    date: "2025-12-31",
  },
  {
    id: "PS-2025-12-002",
    employee: "Amit Patel",
    month: "December 2025",
    amount: 74000,
    date: "2025-12-31",
  },
];

function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState("January 2026");
  const [activeTab, setActiveTab] = useState("salary");

  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredRecords,
    hasActiveFilters,
    clearSearch,
  } = useSearch({
    data: salaryRecords,
    searchFields: ["name", "id", "designation"],
    searchQuery: "",
  });

  const totalPayroll = filteredRecords.reduce((sum, r) => sum + r.netSalary, 0);
  const pendingCount = filteredRecords.filter(
    (r) => r.status === "pending",
  ).length;

  const handleExport = () => {
    const exportData = filteredRecords.map((r) => ({
      "Employee ID": r.id,
      Name: r.name,
      Designation: r.designation,
      "Basic Salary": r.basicSalary,
      Allowances: r.allowances,
      Deductions: r.deductions,
      "Net Salary": r.netSalary,
      Month: r.month,
      Status: r.status,
      "Payment Date": r.paymentDate,
    }));

    exportToExcel(exportData, `payroll-${selectedMonth.replace(" ", "-")}`);
    toast.success("Payroll data exported successfully");
  };

  const handleGeneratePayslips = () => {
    toast.success("Payslips generated for all pending employees");
  };

  const stats = [
    {
      title: "Total Payroll",
      value: `₹${totalPayroll.toLocaleString()}`,
      change: selectedMonth,
      icon: Wallet,
      color: "blue",
    },
    {
      title: "Pending Payments",
      value: pendingCount.toString(),
      change: "Need attention",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Avg Salary",
      value: `₹${Math.round(totalPayroll / (filteredRecords.length || 1)).toLocaleString()}`,
      change: "Per employee",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Payslips Generated",
      value: "45",
      change: "This month",
      icon: Receipt,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Payroll Management
          </h1>
          <p className="text-muted-foreground">
            Manage staff salaries, payslips, and payroll processing.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleGeneratePayslips}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Payslips
          </Button>
        </div>
      </div>

      {/* Sub-features Navigation */}
      <div className="border-b">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {subFeatures.map((feature) => (
            <a
              key={feature.name}
              href={feature.href}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
                feature.active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <feature.icon className="h-4 w-4" />
              {feature.name}
            </a>
          ))}
        </nav>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-medium text-sm">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 bg-${stat.color}-100`}>
                <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stat.value}</div>
              <p className="text-muted-foreground text-xs">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Month Selector & Tabs */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("salary")}
            className={`border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "salary"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Salary Records
          </button>
          <button
            onClick={() => setActiveTab("payslips")}
            className={`border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "payslips"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Payslips History
          </button>
          <button
            onClick={() => setActiveTab("deductions")}
            className={`border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "deductions"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Deductions & Allowances
          </button>
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="flex h-10 w-[180px] items-center justify-between rounded-lg border border-input bg-card px-3 py-2 text-sm"
        >
          <option value="January 2026">January 2026</option>
          <option value="December 2025">December 2025</option>
          <option value="November 2025">November 2025</option>
        </select>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[300px] pl-9"
            />
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="-translate-y-1/2 absolute top-1/2 right-2 h-6 px-2 text-xs"
              >
                Clear
              </Button>
            )}
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === "salary" && "Salary Records"}
            {activeTab === "payslips" && "Payslips History"}
            {activeTab === "deductions" && "Deductions & Allowances"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === "salary" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-muted-foreground text-sm">
                    <th className="pb-3 font-medium">Employee ID</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Designation</th>
                    <th className="pb-3 font-medium">Basic Salary</th>
                    <th className="pb-3 font-medium">Allowances</th>
                    <th className="pb-3 font-medium">Deductions</th>
                    <th className="pb-3 font-medium">Net Salary</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Payment Date</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b last:border-0">
                      <td className="py-3 text-sm">{record.id}</td>
                      <td className="py-3 font-medium">{record.name}</td>
                      <td className="py-3 text-sm">{record.designation}</td>
                      <td className="py-3 text-sm">
                        ₹{record.basicSalary.toLocaleString()}
                      </td>
                      <td className="py-3 text-sm text-success">
                        +₹{record.allowances.toLocaleString()}
                      </td>
                      <td className="py-3 text-destructive text-sm">
                        -₹{record.deductions.toLocaleString()}
                      </td>
                      <td className="py-3 font-medium text-sm">
                        ₹{record.netSalary.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            record.status === "paid"
                              ? "success"
                              : record.status === "processing"
                                ? "default"
                                : "warning"
                          }
                        >
                          {record.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm">{record.paymentDate}</td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "payslips" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-muted-foreground text-sm">
                    <th className="pb-3 font-medium">Payslip ID</th>
                    <th className="pb-3 font-medium">Employee</th>
                    <th className="pb-3 font-medium">Month</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Generated Date</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayslips.map((payslip) => (
                    <tr key={payslip.id} className="border-b last:border-0">
                      <td className="py-3 text-sm">{payslip.id}</td>
                      <td className="py-3 font-medium">{payslip.employee}</td>
                      <td className="py-3 text-sm">{payslip.month}</td>
                      <td className="py-3 font-medium text-sm">
                        ₹{payslip.amount.toLocaleString()}
                      </td>
                      <td className="py-3 text-sm">{payslip.date}</td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "deductions" && (
            <div className="py-12 text-center">
              <Calculator className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-semibold text-lg">
                Deductions & Allowances
              </h3>
              <p className="mb-4 text-muted-foreground text-sm">
                Configure salary components, tax deductions, and allowances
                here.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Configure Components
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Salary Calculator</p>
              <p className="text-muted-foreground text-sm">Compute salaries</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-success/15 p-3">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-medium">Annual Reports</p>
              <p className="text-muted-foreground text-sm">
                Yearly payroll summary
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-warning/15 p-3">
              <Wallet className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="font-medium">Tax Statements</p>
              <p className="text-muted-foreground text-sm">TDS & tax reports</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Bulk Process</p>
              <p className="text-muted-foreground text-sm">
                Process all pending
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
