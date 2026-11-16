/**
 * Fee Structure Management - Define and manage fee categories
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  Building,
  Calculator,
  Edit,
  FileText,
  PieChart,
  Plus,
  Receipt,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/fees/structure")({
  component: FeeStructurePage,
});

// Sub-features navigation
const subFeatures = [
  { name: "Dashboard", href: "/app/fees", icon: PieChart },
  {
    name: "Fee Structure",
    href: "/app/fees/structure",
    icon: FileText,
    active: true,
  },
  { name: "Collection", href: "/app/fees/collection", icon: Receipt },
  { name: "Online Payment", href: "/app/fees/payment", icon: Calculator },
  { name: "Expenses", href: "/app/fees/expenses", icon: Building },
  { name: "Salary", href: "/app/fees/salary", icon: Calculator },
  { name: "Budget", href: "/app/fees/budget", icon: Building },
  { name: "Reports", href: "/app/fees/reports", icon: FileText },
];

interface FeeCategory {
  id: string;
  name: string;
  type: "tuition" | "transport" | "exam" | "library" | "other";
  amount: number;
  frequency: "monthly" | "yearly" | "one-time";
  class?: string;
  description?: string;
}

function FeeStructurePage() {
  const [feeCategories, setFeeCategories] = useState<FeeCategory[]>([
    {
      id: "1",
      name: "Tuition Fee",
      type: "tuition",
      amount: 25000,
      frequency: "yearly",
      description: "Annual tuition fee for all classes",
    },
    {
      id: "2",
      name: "Transport Fee",
      type: "transport",
      amount: 12000,
      frequency: "yearly",
      description: "School bus transportation",
    },
    {
      id: "3",
      name: "Exam Fee",
      type: "exam",
      amount: 5000,
      frequency: "yearly",
      description: "Annual examination fee",
    },
    {
      id: "4",
      name: "Library Fee",
      type: "library",
      amount: 2000,
      frequency: "yearly",
      description: "Library membership and book access",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FeeCategory | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    type: "tuition" as FeeCategory["type"],
    amount: "",
    frequency: "yearly" as FeeCategory["frequency"],
    description: "",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newCategory: FeeCategory = {
      id: editingCategory?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency,
      description: formData.description,
    };

    if (editingCategory) {
      setFeeCategories((prev) =>
        prev.map((cat) => (cat.id === editingCategory.id ? newCategory : cat)),
      );
      toast.success("Fee category updated successfully");
    } else {
      setFeeCategories((prev) => [...prev, newCategory]);
      toast.success("Fee category added successfully");
    }

    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      type: "tuition",
      amount: "",
      frequency: "yearly",
      description: "",
    });
  };

  const handleEdit = (category: FeeCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      amount: category.amount.toString(),
      frequency: category.frequency,
      description: category.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setFeeCategories((prev) => prev.filter((cat) => cat.id !== id));
    toast.success("Fee category deleted successfully");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "tuition":
        return "bg-blue-100 text-blue-800";
      case "transport":
        return "bg-green-100 text-green-800";
      case "exam":
        return "bg-purple-100 text-purple-800";
      case "library":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
          <h1 className="font-bold text-3xl">Fee Structure</h1>
          <p className="text-muted-foreground">
            Define and manage fee categories for different services
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Fee Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Fee Category" : "Add Fee Category"}
              </DialogTitle>
              <DialogDescription>
                Configure fee details and pricing
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="col-span-3"
                  placeholder="e.g., Tuition Fee"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type *
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: FeeCategory["type"]) =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tuition">Tuition</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="library">Library</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  className="col-span-3"
                  placeholder="0.00"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">
                  Frequency *
                </Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value: FeeCategory["frequency"]) =>
                    setFormData((prev) => ({ ...prev, frequency: value }))
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="col-span-3"
                  placeholder="Optional description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingCategory ? "Update" : "Add"} Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fee Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {feeCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                {category.name}
              </CardTitle>
              <Badge className={getTypeColor(category.type)}>
                {category.type}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">
                ₹{category.amount.toLocaleString()}
              </div>
              <p className="text-muted-foreground text-xs capitalize">
                {category.frequency}
              </p>
              {category.description && (
                <p className="mt-2 text-muted-foreground text-sm">
                  {category.description}
                </p>
              )}
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(category)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
