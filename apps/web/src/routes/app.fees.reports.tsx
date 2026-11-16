import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Calculator,
  Download,
  FileText,
  PieChart,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/fees/reports")({
  component: ReportsPage,
});

// Sub-features navigation
const subFeatures = [
  { name: "Dashboard", href: "/app/fees", icon: PieChart },
  { name: "Fee Structure", href: "/app/fees/structure", icon: FileText },
  { name: "Collection", href: "/app/fees/collection", icon: Receipt },
  { name: "Online Payment", href: "/app/fees/payment", icon: Calculator },
  { name: "Expenses", href: "/app/fees/expenses", icon: BarChart3 },
  { name: "Salary", href: "/app/fees/salary", icon: Calculator },
  { name: "Budget", href: "/app/fees/budget", icon: BarChart3 },
  { name: "Reports", href: "/app/fees/reports", icon: FileText, active: true },
];

interface ReportData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  outstandingFees: number;
  collectionRate: number;
  monthlyData: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  feeTypeBreakdown: Array<{
    type: string;
    amount: number;
    percentage: number;
  }>;
}

function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData>({
    totalRevenue: 1250000,
    totalExpenses: 750000,
    netProfit: 500000,
    outstandingFees: 150000,
    collectionRate: 89.2,
    monthlyData: [
      { month: "Jan", revenue: 120000, expenses: 65000, profit: 55000 },
      { month: "Feb", revenue: 115000, expenses: 68000, profit: 47000 },
      { month: "Mar", revenue: 130000, expenses: 72000, profit: 58000 },
      { month: "Apr", revenue: 125000, expenses: 69000, profit: 56000 },
      { month: "May", revenue: 135000, expenses: 71000, profit: 64000 },
      { month: "Jun", revenue: 140000, expenses: 73000, profit: 67000 },
    ],
    feeTypeBreakdown: [
      { type: "Tuition", amount: 750000, percentage: 60 },
      { type: "Transport", amount: 250000, percentage: 20 },
      { type: "Exam", amount: 125000, percentage: 10 },
      { type: "Library", amount: 75000, percentage: 6 },
      { type: "Other", amount: 75000, percentage: 6 },
    ],
  });

  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedReport, setSelectedReport] = useState("financial");

  const handleGenerateReport = () => {
    toast.success("Report generated successfully");
    // In a real app, this would trigger report generation
  };

  const handleExportReport = (format: "pdf" | "excel" | "csv") => {
    toast.success(`Report exported as ${format.toUpperCase()}`);
    // In a real app, this would trigger export
  };

  return (
    <div className="space-y-6">
      {/* Sub-features Navigation */}
      <div className="flex flex-wrap gap-2">
        {subFeatures.map((feature) => (
          <Button
            key={feature.href}
            variant={feature.active ? "default" : "outline"}
            size="sm"
            asChild
          >
            <a href={feature.href}>
              <feature.icon className="mr-2 h-4 w-4" />
              {feature.name}
            </a>
          </Button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Financial Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive financial analytics and reporting
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExportReport("pdf")}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExportReport("excel")}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="period">Time Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="report">Report Type</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Financial Summary</SelectItem>
                  <SelectItem value="collection">Fee Collection</SelectItem>
                  <SelectItem value="outstanding">Outstanding Fees</SelectItem>
                  <SelectItem value="expenses">Expense Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleGenerateReport} className="w-full">
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ₹{reportData.totalRevenue.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">+12% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Expenses
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ₹{reportData.totalExpenses.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">+8% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Net Profit</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ₹{reportData.netProfit.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">+15% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Collection Rate
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {reportData.collectionRate}%
            </div>
            <p className="text-muted-foreground text-xs">Target: 95%</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Financial Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.monthlyData.map((month) => (
              <div
                key={month.month}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="font-medium">{month.month} 2026</div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Revenue:</span>
                    <span className="ml-2 font-medium">
                      ₹{month.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expenses:</span>
                    <span className="ml-2 font-medium">
                      ₹{month.expenses.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Profit:</span>
                    <span className="ml-2 font-medium text-green-600">
                      ₹{month.profit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fee Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Fee Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.feeTypeBreakdown.map((feeType) => (
              <div
                key={feeType.type}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-32 font-medium text-sm">{feeType.type}</div>
                  <div className="h-2 flex-1 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${feeType.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {feeType.percentage}%
                  </div>
                </div>
                <div className="font-medium">
                  ₹{feeType.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
