/**
 * Budget Management - Financial Planning and Tracking
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  PieChart,
  FileText,
  Receipt,
  CreditCard,
  ArrowDownRight,
  Calculator,
  Building,
  Plus,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/app/fees/budget")({
  component: BudgetPage,
});

const subFeatures = [
  { name: "Dashboard", href: "/app/fees", icon: PieChart },
  { name: "Fee Structure", href: "/app/fees/structure", icon: FileText },
  { name: "Collection", href: "/app/fees/collection", icon: Receipt },
  { name: "Online Payment", href: "/app/fees/payment", icon: CreditCard },
  { name: "Expenses", href: "/app/fees/expenses", icon: ArrowDownRight },
  { name: "Salary", href: "/app/fees/salary", icon: Calculator },
  { name: "Budget", href: "/app/fees/budget", icon: Building, active: true },
  { name: "Reports", href: "/app/fees/reports", icon: FileText },
];

// Budget categories
const budgetCategories = [
  { id: "salaries", name: "Staff Salaries", icon: "👥", budgeted: 500000, spent: 420000 },
  { id: "infrastructure", name: "Infrastructure", icon: "🏗️", budgeted: 200000, spent: 85000 },
  { id: "utilities", name: "Utilities", icon: "💡", budgeted: 50000, spent: 42000 },
  { id: "teaching", name: "Teaching Materials", icon: "📚", budgeted: 100000, spent: 65000 },
  { id: "maintenance", name: "Maintenance", icon: "🔧", budgeted: 75000, spent: 58000 },
  { id: "events", name: "Events & Activities", icon: "🎉", budgeted: 80000, spent: 25000 },
  { id: "technology", name: "Technology", icon: "💻", budgeted: 150000, spent: 120000 },
  { id: "misc", name: "Miscellaneous", icon: "📦", budgeted: 30000, spent: 18000 },
];

function BudgetPage() {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("2025-2026");
  const [expenseStats, setExpenseStats] = useState({ totalExpenses: 0 });
  const [feeStats, setFeeStats] = useState({ totalCollected: 0, pending: 0 });

  const [budgetForm, setBudgetForm] = useState({
    category: "",
    amount: "",
    period: "2025-2026",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [expenses, fees] = await Promise.all([
          api.expenses.getStats(),
          api.fees.getStats(),
        ]);
        setExpenseStats(expenses);
        setFeeStats(fees);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  const totalBudgeted = budgetCategories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const budgetUtilization = ((totalSpent / totalBudgeted) * 100).toFixed(1);
  const remainingBudget = totalBudgeted - totalSpent;

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Budget allocation added successfully");
    setIsDialogOpen(false);
    setBudgetForm({ category: "", amount: "", period: "2025-2026" });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Budget Management</h1>
          <p className="text-muted-foreground">
            Plan, allocate, and track financial resources.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-2026">2025-2026</SelectItem>
              <SelectItem value="2024-2025">2024-2025</SelectItem>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Budget Allocation</DialogTitle>
                <DialogDescription>
                  Allocate budget for a specific category.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddBudget} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={budgetForm.category}
                    onValueChange={(val) => setBudgetForm({ ...budgetForm, category: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Budget Amount (₹)</Label>
                  <Input
                    type="number"
                    placeholder="100000"
                    value={budgetForm.amount}
                    onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Financial Year</Label>
                  <Select
                    value={budgetForm.period}
                    onValueChange={(val) => setBudgetForm({ ...budgetForm, period: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025-2026">2025-2026</SelectItem>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Allocation</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Sub-features Navigation */}
      <div className="border-b">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {subFeatures.map((feature) => (
            <a
              key={feature.name}
              href={feature.href}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${feature.active
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

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalBudgeted / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">For {selectedPeriod}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{(totalSpent / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">{budgetUtilization}% utilized</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{(remainingBudget / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">Available to spend</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ₹{(feeStats.totalCollected / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-muted-foreground">Fee collections</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Utilization</CardTitle>
          <CardDescription>Track spending against allocated budgets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {budgetCategories.map((category) => {
              const utilization = (category.spent / category.budgeted) * 100;
              const isOverBudget = utilization > 100;
              const isWarning = utilization > 80 && utilization <= 100;

              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-semibold ${isOverBudget ? "text-red-600" : ""}`}>
                        ₹{(category.spent / 1000).toFixed(0)}K
                      </span>
                      <span className="text-muted-foreground"> / ₹{(category.budgeted / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  <div className="relative h-2 w-full rounded-full bg-secondary">
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full transition-all ${isOverBudget
                          ? "bg-red-500"
                          : isWarning
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{utilization.toFixed(0)}% utilized</span>
                    {isOverBudget && <Badge variant="destructive">Over Budget</Badge>}
                    {isWarning && <Badge variant="warning">Near Limit</Badge>}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Budget vs Actual Table */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual Comparison</CardTitle>
          <CardDescription>Detailed breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium text-right">Budgeted</th>
                  <th className="pb-3 font-medium text-right">Actual</th>
                  <th className="pb-3 font-medium text-right">Variance</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgetCategories.map((category) => {
                  const variance = category.budgeted - category.spent;
                  const isPositive = variance >= 0;

                  return (
                    <tr key={category.id} className="border-b last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">₹{category.budgeted.toLocaleString()}</td>
                      <td className="py-3 text-right">₹{category.spent.toLocaleString()}</td>
                      <td className={`py-3 text-right font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                        {isPositive ? "+" : ""}₹{variance.toLocaleString()}
                      </td>
                      <td className="py-3 text-right">
                        <Badge variant={isPositive ? "success" : "destructive"}>
                          {isPositive ? "Under" : "Over"}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 font-semibold">
                  <td className="pt-3">Total</td>
                  <td className="pt-3 text-right">₹{totalBudgeted.toLocaleString()}</td>
                  <td className="pt-3 text-right">₹{totalSpent.toLocaleString()}</td>
                  <td className={`pt-3 text-right ${remainingBudget >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {remainingBudget >= 0 ? "+" : ""}₹{remainingBudget.toLocaleString()}
                  </td>
                  <td className="pt-3 text-right">
                    <Badge variant={remainingBudget >= 0 ? "success" : "destructive"}>
                      {remainingBudget >= 0 ? "On Track" : "Over Budget"}
                    </Badge>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
