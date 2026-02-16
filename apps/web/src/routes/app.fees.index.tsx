/**
 * Fees & Finance Management - Complete Module
 * All sub-features for fee collection, expenses, payroll, and budgeting
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { handleError } from "@/lib/error-handler";
import { exportToCSV } from "@/lib/export-utils";
import { useListPageShortcuts } from "@/lib/keyboard-shortcuts";
import { useSearch } from "@/lib/search-utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  Building,
  Calculator,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  PieChart,
  Plus,
  Receipt,
  Search,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
          status:
            fee.status === "completed"
              ? "Paid"
              : fee.status.charAt(0).toUpperCase() + fee.status.slice(1),
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
        Student: c.student,
        Class: c.class,
        Amount: c.amount,
        "Payment Mode": c.mode,
        Date: c.date,
        Status: c.status,
      }));

      exportToCSV(
        exportData,
        `fee-collections-export-${new Date().toISOString().split("T")[0]}`,
      );
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
    () => handleExport(),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Fees & Finance</h1>
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
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
                feature.active
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
              <CardTitle className="font-medium text-sm">
                {stat.title}
              </CardTitle>
              <div
                className={`rounded-lg p-2 ${
                  stat.color === "green"
                    ? "bg-success/15"
                    : stat.color === "yellow"
                      ? "bg-warning/15"
                      : stat.color === "red"
                        ? "bg-destructive/10"
                        : "bg-primary/10"
                }`}
              >
                <stat.icon
                  className={`h-4 w-4 ${
                    stat.color === "green"
                      ? "text-success"
                      : stat.color === "yellow"
                        ? "text-warning"
                        : stat.color === "red"
                          ? "text-destructive"
                          : "text-primary"
                  }`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stat.value}</div>
              <p className="text-muted-foreground text-xs">
                <span className="text-success">{stat.change}</span> from last
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
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
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
                <div className="py-8 text-center">
                  <Receipt className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm">
                    {hasActiveFilters
                      ? "No collections found"
                      : "No collections yet"}
                  </p>
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSearch}
                      className="mt-2"
                    >
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
                      <div className="rounded-full bg-success/15 p-2">
                        <DollarSign className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {collection.student}
                        </p>
                        <p className="text-muted-foreground text-xs">
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
                    <div className="rounded-full bg-destructive/10 p-2">
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {expense.description}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {expense.category} • {expense.date}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-destructive">
                    -{expense.amount}
                  </p>
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
            <div className="rounded-lg border bg-primary/5 p-4">
              <p className="text-muted-foreground text-sm">Tuition Fee</p>
              <p className="font-bold text-2xl">₹35,000</p>
              <p className="text-muted-foreground text-xs">Per Year</p>
            </div>
            <div className="rounded-lg border bg-success/15 p-4">
              <p className="text-muted-foreground text-sm">Transport Fee</p>
              <p className="font-bold text-2xl">₹12,000</p>
              <p className="text-muted-foreground text-xs">Per Year</p>
            </div>
            <div className="rounded-lg border bg-warning/15 p-4">
              <p className="text-muted-foreground text-sm">Hostel Fee</p>
              <p className="font-bold text-2xl">₹45,000</p>
              <p className="text-muted-foreground text-xs">Per Year</p>
            </div>
            <div className="rounded-lg border bg-primary/5 p-4">
              <p className="text-muted-foreground text-sm">Other Charges</p>
              <p className="font-bold text-2xl">₹8,000</p>
              <p className="text-muted-foreground text-xs">Per Year</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-success/15 p-3">
              <Receipt className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-medium">Collect Fee</p>
              <p className="text-muted-foreground text-sm">Manual collection</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Payment Gateway</p>
              <p className="text-muted-foreground text-sm">Online settings</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-warning/15 p-3">
              <Calculator className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="font-medium">Salary Disbursement</p>
              <p className="text-muted-foreground text-sm">
                Payroll processing
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Generate Report</p>
              <p className="text-muted-foreground text-sm">
                Financial statements
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
