/**
 * Exam Types Management - Define and manage different types of examinations
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
  BookOpen,
  Calendar,
  ClipboardList,
  Edit,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/exams/types")({
  component: ExamTypesPage,
});

// Sub-features navigation
const subFeatures = [
  { name: "Dashboard", href: "/app/exams", icon: FileText },
  {
    name: "Exam Types",
    href: "/app/exams/types",
    icon: ClipboardList,
    active: true,
  },
  { name: "Schedule", href: "/app/exams/schedule", icon: Calendar },
  { name: "Hall Allocation", href: "/app/exams/halls", icon: BookOpen },
  { name: "Marks Entry", href: "/app/exams/marks", icon: ClipboardList },
  { name: "Results", href: "/app/exams/results", icon: BookOpen },
  { name: "Report Cards", href: "/app/exams/reports", icon: FileText },
];

interface ExamType {
  id: string;
  name: string;
  description: string;
  category: "unit-test" | "half-yearly" | "annual" | "final";
  duration: number; // in minutes
  maxMarks: number;
  passingMarks: number;
  isActive: boolean;
}

function ExamTypesPage() {
  const [examTypes, setExamTypes] = useState<ExamType[]>([
    {
      id: "1",
      name: "Unit Test",
      description: "Regular unit tests conducted throughout the academic year",
      category: "unit-test",
      duration: 90,
      maxMarks: 50,
      passingMarks: 20,
      isActive: true,
    },
    {
      id: "2",
      name: "Half Yearly",
      description: "Mid-term examination covering half-year syllabus",
      category: "half-yearly",
      duration: 180,
      maxMarks: 100,
      passingMarks: 33,
      isActive: true,
    },
    {
      id: "3",
      name: "Annual Exam",
      description: "Final annual examination for the academic year",
      category: "annual",
      duration: 180,
      maxMarks: 100,
      passingMarks: 33,
      isActive: true,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<ExamType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "unit-test" as ExamType["category"],
    duration: "",
    maxMarks: "",
    passingMarks: "",
  });

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.duration ||
      !formData.maxMarks ||
      !formData.passingMarks
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const newType: ExamType = {
      id: editingType?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      duration: parseInt(formData.duration),
      maxMarks: parseInt(formData.maxMarks),
      passingMarks: parseInt(formData.passingMarks),
      isActive: true,
    };

    if (editingType) {
      setExamTypes((prev) =>
        prev.map((type) => (type.id === editingType.id ? newType : type)),
      );
      toast.success("Exam type updated successfully");
    } else {
      setExamTypes((prev) => [...prev, newType]);
      toast.success("Exam type created successfully");
    }

    setIsDialogOpen(false);
    setEditingType(null);
    setFormData({
      name: "",
      description: "",
      category: "unit-test",
      duration: "",
      maxMarks: "",
      passingMarks: "",
    });
  };

  const handleEdit = (type: ExamType) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      description: type.description,
      category: type.category,
      duration: type.duration.toString(),
      maxMarks: type.maxMarks.toString(),
      passingMarks: type.passingMarks.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setExamTypes((prev) => prev.filter((type) => type.id !== id));
    toast.success("Exam type deleted successfully");
  };

  const toggleActive = (id: string) => {
    setExamTypes((prev) =>
      prev.map((type) =>
        type.id === id ? { ...type, isActive: !type.isActive } : type,
      ),
    );
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
          <h1 className="font-bold text-3xl">Exam Types</h1>
          <p className="text-muted-foreground">
            Define and manage different types of examinations
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingType(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Exam Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingType ? "Edit Exam Type" : "Add New Exam Type"}
              </DialogTitle>
              <DialogDescription>
                Configure the details for the exam type
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
                  placeholder="e.g., Unit Test, Half Yearly"
                />
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
                  placeholder="Brief description of the exam type"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: ExamType["category"]) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unit-test">Unit Test</SelectItem>
                    <SelectItem value="half-yearly">Half Yearly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration (min) *
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  className="col-span-3"
                  placeholder="e.g., 90"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxMarks" className="text-right">
                  Max Marks *
                </Label>
                <Input
                  id="maxMarks"
                  type="number"
                  value={formData.maxMarks}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxMarks: e.target.value,
                    }))
                  }
                  className="col-span-3"
                  placeholder="e.g., 100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="passingMarks" className="text-right">
                  Passing Marks *
                </Label>
                <Input
                  id="passingMarks"
                  type="number"
                  value={formData.passingMarks}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      passingMarks: e.target.value,
                    }))
                  }
                  className="col-span-3"
                  placeholder="e.g., 33"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingType ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Exam Types Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {examTypes.map((type) => (
          <Card key={type.id} className={!type.isActive ? "opacity-60" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">{type.name}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={type.isActive ? "default" : "secondary"}>
                  {type.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground text-sm">
                {type.description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <Badge variant="outline">{type.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{type.duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Marks:</span>
                  <span>{type.maxMarks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Passing:</span>
                  <span>{type.passingMarks}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(type.id)}
                >
                  {type.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(type)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(type.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
