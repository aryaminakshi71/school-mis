/**
 * Fees & Finance Management - Complete Module
 * All sub-features for fee collection, expenses, payroll, and budgeting
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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

export const Route = createFileRoute("/app/fees")({
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

// Mock data
const feeCollections = [
  {
    id: "REC001",
    student: "Aryan Sharma",
    class: "Class 10-A",
    amount: "₹45,000",
    mode: "Online",
    date: "Jan 20, 2026",
    status: "Paid",
  },
  {
    id: "REC002",
    student: "Priya Patel",
    class: "Class 9-B",
    amount: "₹38,000",
    mode: "Cash",
    date: "Jan 20, 2026",
    status: "Paid",
  },
  {
    id: "REC003",
    student: "Rahul Singh",
    class: "Class 11-A",
    amount: "₹52,000",
    mode: "Online",
    date: "Jan 19, 2026",
    status: "Paid",
  },
  {
    id: "REC004",
    student: "Ananya Gupta",
    class: "Class 8-A",
    amount: "₹35,000",
    mode: "Pending",
    date: "Jan 19, 2026",
    status: "Pending",
  },
  {
    id: "REC005",
    student: "Vikram Kumar",
    class: "Class 12-B",
    amount: "₹55,000",
    mode: "Online",
    date: "Jan 18, 2026",
    status: "Overdue",
  },
];

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

const stats = [
  {
    title: "Total Collected (Month)",
    value: "₹12.5L",
    change: "+₹2.3L",
    icon: ArrowUpRight,
    color: "green",
  },
  {
    title: "Pending Amount",
    value: "₹3.2L",
    change: "-₹0.8L",
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
    value: "₹6.7L",
    change: "+₹1.8L",
    icon: TrendingUp,
    color: "blue",
  },
];

function FeesPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

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
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Collect Fee
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
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div
                className={`p-2 rounded-lg ${
                  stat.color === "green"
                    ? "bg-green-100"
                    : stat.color === "yellow"
                      ? "bg-yellow-100"
                      : stat.color === "red"
                        ? "bg-red-100"
                        : "bg-blue-100"
                }`}
              >
                <stat.icon
                  className={`h-4 w-4 ${
                    stat.color === "green"
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
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feeCollections.map((collection) => (
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
              ))}
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
