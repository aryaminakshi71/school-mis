/**
 * Fees & Finance Management - Complete Module
 * All sub-features for fee collection, expenses, payroll, and budgeting
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  DollarSign,
  Receipt,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Building,
  FileText,
  Calculator,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Plus,
  Search,
  Filter,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/lib/search-utils";
import { exportToCSV } from "@/lib/export-utils";
import { useListPageShortcuts } from "@/lib/keyboard-shortcuts";
import { SkeletonTable } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { handleError } from "@/lib/error-handler";
import { api } from "@/lib/api";

export const Route = createFileRoute("/app/fees/")({
  component: FeesPage,
});

// Sub-features navigation
const subFeatures = [
  { name: "Dashboard", href: "/app/fees", icon: PieChart, active: true },
  { name: "Fee Structure", href: "/app/fees/structure", icon: FileText },
  { name: "Collection", href: "/app/fees/collection", icon: Receipt },
  { name: "Online Payment", href: "/app/fees/payment", icon: CreditCard },
  { name: "Expenses", href: "/app/fees/expenses", icon: ArrowDownRight },
  { name: "Salary", href: "/app/fees/salary", icon: Calculator },
  { name: "Budget", href: "/app/fees/budget", icon: Building },
  { name: "Reports", href: "/app/fees/reports", icon: FileText },
];

// Mock expenses for now
const expenses = [
  {
    id: "EXP001",
    category: "Salary",
    description: "January Staff Salary",
    amount: "₹4,25,000",
    date: "Jan 15, 2026",
  },
  {
    id: "EXP002",
    category: "Maintenance",
    description: "AC Repair - Block A",
    amount: "₹15,000",
    date: "Jan 14, 2026",
  },
  {
    id: "EXP003",
    category: "Supplies",
    description: "Stationery Purchase",
    amount: "₹8,500",
    date: "Jan 12, 2026",
  },
  {
    id: "EXP004",
    category: "Utilities",
    description: "Electricity Bill",
    amount: "₹25,000",
    date: "Jan 10, 2026",
  },
];

function FeesPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // State for fetched data
  const [feeCollections, setFeeCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      title: "Total Collected",
      value: "₹0",
      change: "+0",
      icon: ArrowUpRight,
      color: "green",
    },
    {
      title: "Pending Amount",
      value: "₹0",
      change: "-0",
      icon: ArrowDownRight,
      color: "yellow",
    },
    {
      title: "Total Expenses",
      value: "₹5.8L",
      change: "+₹0.5L",
      icon: TrendingUp,
      color: "red",
    },
    {
      title: "Net Profit",
      value: "₹0",
      change: "+0",
      icon: TrendingUp,
      color: "blue",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [feesData, statsData, expensesStats] = await Promise.all([
          api.fees.list(),
          api.fees.getStats(),
          api.expenses.getStats(),
        ]);

        // Transform API data to UI format
        const formattedFees = feesData.map((fee: any) => ({
          id: fee.id,
          student: fee.studentName,
          class: fee.className,
          amount: `₹${fee.amount.toLocaleString()}`,
          mode: "Online", // Defaulting as API doesn't return mode yet
          date: new Date(fee.createdAt).toLocaleDateString(),
          status: fee.status === "completed" ? "Paid" : fee.status.charAt(0).toUpperCase() + fee.status.slice(1),
        }));

        setFeeCollections(formattedFees);

        setStats([
          {
            title: "Total Collected",
            value: `₹${(statsData.totalCollected / 100000).toFixed(2)}L`,
            change: "+₹0", // Placeholder for now
            icon: ArrowUpRight,
            color: "green",
          },
          {
            title: "Pending Amount",
            value: `₹${(statsData.pending / 100000).toFixed(2)}L`,
            change: "+₹0",
            icon: ArrowDownRight,
            color: "yellow",
          },
          {
            title: "Total Expenses",
            value: `₹${(expensesStats.totalExpenses / 100000).toFixed(2)}L`,
            change: "+₹0",
            icon: TrendingUp,
            color: "red",
          },
          {
            title: "Net Profit",
            value: `₹${((statsData.totalCollected - expensesStats.totalExpenses) / 100000).toFixed(2)}L`,
            change: "+0",
            icon: TrendingUp,
            color: "blue",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch fee data:", error);
        toast.error("Failed to load fee data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search functionality for fee collections
  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredCollections,
    hasActiveFilters,
    clearSearch,
  } = useSearch({
    data: feeCollections,
    searchFields: ["student", "class", "id", "status"],
  });

  // Export functionality
  const handleExport = () => {
    try {
      const exportData = feeCollections.map((c) => ({
        "Receipt ID": c.id,
        "Student": c.student,
        "Class": c.class,
        "Amount": c.amount,
        "Payment Mode": c.mode,
        "Date": c.date,
        "Status": c.status,
      }));

      exportToCSV(exportData, `fee-collections-export-${new Date().toISOString().split("T")[0]}`);
      toast.success("Fee collections exported successfully");
    } catch (err) {
      toast.error(handleError(err));
    }
  };

  // Keyboard shortcuts
  useListPageShortcuts(
    () => {
      // Open collect fee modal
      toast.info("Collect Fee feature coming soon");
    },
    () => window.location.reload(),
    () => handleExport()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fees & Finance</h1>
          <p className="text-muted-foreground">
            Manage fee collection, expenses, payroll, budgeting, and financial
            reports.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={feeCollections.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report ({feeCollections.length})
          </Button>
          <Button onClick={() => toast.info("Collect Fee feature coming soon")}>
            <Plus className="mr-2 h-4 w-4" />
            Collect Fee
          </Button>
        </div>
      </div>

      {/* Sub-features Navigation */}
      <div className="border-b">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {subFeatures.map((feature) => (
            <Link
              key={feature.name}
              to={feature.href}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${feature.active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              <feature.icon className="h-4 w-4" />
              {feature.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div
                className={`p-2 rounded-lg ${stat.color === "green"
                  ? "bg-green-100"
                  : stat.color === "yellow"
                    ? "bg-yellow-100"
                    : stat.color === "red"
                      ? "bg-red-100"
                      : "bg-blue-100"
                  }`}
              >
                <stat.icon
                  className={`h-4 w-4 ${stat.color === "green"
                    ? "text-green-600"
                    : stat.color === "yellow"
                      ? "text-yellow-600"
                      : stat.color === "red"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last
                month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fee Collection & Expenses Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Collections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Fee Collections</CardTitle>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearSearch}>
                  Clear
                </Button>
              )}
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search collections... (Press / to focus)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-4">
              {filteredCollections.length === 0 ? (
                <div className="text-center py-8">
                  <Receipt className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {hasActiveFilters ? "No collections found" : "No collections yet"}
                  </p>
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={clearSearch} className="mt-2">
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                filteredCollections.map((collection) => (
                  <div
                    key={collection.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-100">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {collection.student}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {collection.class}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{collection.amount}</p>
                      <Badge
                        variant={
                          collection.status === "Paid"
                            ? "success"
                            : collection.status === "Pending"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {collection.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Expenses</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-red-100">
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {expense.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {expense.category} • {expense.date}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-red-600">-{expense.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Structure Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Structure Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 rounded-lg bg-blue-50 border">
              <p className="text-sm text-muted-foreground">Tuition Fee</p>
              <p className="text-2xl font-bold">₹35,000</p>
              <p className="text-xs text-muted-foreground">Per Year</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border">
              <p className="text-sm text-muted-foreground">Transport Fee</p>
              <p className="text-2xl font-bold">₹12,000</p>
              <p className="text-xs text-muted-foreground">Per Year</p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-50 border">
              <p className="text-sm text-muted-foreground">Hostel Fee</p>
              <p className="text-2xl font-bold">₹45,000</p>
              <p className="text-xs text-muted-foreground">Per Year</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 border">
              <p className="text-sm text-muted-foreground">Other Charges</p>
              <p className="text-2xl font-bold">₹8,000</p>
              <p className="text-xs text-muted-foreground">Per Year</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Receipt className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Collect Fee</p>
              <p className="text-sm text-muted-foreground">Manual collection</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Payment Gateway</p>
              <p className="text-sm text-muted-foreground">Online settings</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Calculator className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium">Salary Disbursement</p>
              <p className="text-sm text-muted-foreground">
                Payroll processing
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">Generate Report</p>
              <p className="text-sm text-muted-foreground">
                Financial statements
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
