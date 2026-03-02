import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { SkeletonCard } from "@/components/ui/skeleton";
import { type Class, api } from "@/lib/api";
import { handleError } from "@/lib/error-handler";
import { exportToCSV } from "@/lib/export-utils";
import { useListPageShortcuts } from "@/lib/keyboard-shortcuts";
import { useSearch } from "@/lib/search-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  BookOpen,
  Download,
  Edit,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/classes")({
  component: ClassesPage,
});

function ClassesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const queryClient = useQueryClient();
  const { confirm, dialog } = useConfirmDialog();

  const {
    data: classes = [],
    isLoading,
    error,
  } = useQuery<Class[]>({
    queryKey: ["classes"],
    queryFn: async () => {
      try {
        return (await api.classes.list()) as Class[];
      } catch (err) {
        toast.error(handleError(err));
        throw err;
      }
    },
  });

  // Search functionality
  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredClasses,
    hasActiveFilters,
    clearSearch,
  } = useSearch<Class>({
    data: classes,
    searchFields: ["name", "section", "classTeacher"],
  });

  // Keyboard shortcuts
  useListPageShortcuts(
    () => setShowModal(true),
    () => queryClient.invalidateQueries({ queryKey: ["classes"] }),
    () => handleExport(),
  );

  // Export functionality
  const handleExport = () => {
    try {
      const exportData = filteredClasses.map((c) => ({
        "Class Name": c.name,
        Section: c.section || "",
        "Class Teacher": c.classTeacher || "",
        Students: c.students.toString(),
        Capacity: (c.capacity || 40).toString(),
        "Available Seats": ((c.capacity || 40) - c.students).toString(),
      }));

      exportToCSV(
        exportData,
        `classes-export-${new Date().toISOString().split("T")[0]}`,
      );
      toast.success("Classes exported successfully");
    } catch (err) {
      toast.error(handleError(err));
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: Omit<Class, "id" | "students">) =>
      api.classes.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Class created successfully");
      setShowModal(false);
    },
    onError: (error: Error) => toast.error(handleError(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Class> }) =>
      api.classes.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Class updated successfully");
      setShowModal(false);
      setEditingClass(null);
    },
    onError: (error: Error) => toast.error(handleError(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.classes.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Class deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(handleError(error));
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      section: formData.get("section") as string,
      classTeacher: formData.get("classTeacher") as string,
      capacity: parseInt(formData.get("capacity") as string) || 40,
    };

    if (editingClass) {
      updateMutation.mutate({ id: editingClass.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (cls: Class) => {
    setEditingClass(cls);
    setShowModal(true);
  };

  const handleDelete = async (id: string, className: string) => {
    const confirmed = await confirm(
      "Delete Class",
      `Are you sure you want to delete ${className}? This action cannot be undone. All students in this class will need to be reassigned.`,
      {
        variant: "danger",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
    );
    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClass(null);
  };

  const totalStudents =
    classes?.reduce((sum: number, c: Class) => sum + c.students, 0) || 0;
  const totalCapacity =
    classes?.reduce((sum: number, c: Class) => sum + (c.capacity || 0), 0) || 0;
  const availableSeats = totalCapacity - totalStudents;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl text-foreground">Classes</h1>
          <p className="text-muted-foreground">Manage classes and sections</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isLoading || filteredClasses.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export ({filteredClasses.length})
          </Button>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search classes... (Press / to focus)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
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
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-primary/10 p-4">
          <p className="font-medium text-primary text-sm">Total Classes</p>
          <p className="font-bold text-2xl text-primary">
            {classes?.length || 0}
          </p>
        </div>
        <div className="rounded-lg bg-success/15 p-4">
          <p className="font-medium text-sm text-success">Total Students</p>
          <p className="font-bold text-2xl text-success">{totalStudents}</p>
        </div>
        <div className="rounded-lg bg-warning/15 p-4">
          <p className="font-medium text-sm text-warning">Available Seats</p>
          <p className="font-bold text-2xl text-warning">{availableSeats}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="py-12 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
              <h3 className="mb-2 font-semibold text-lg">
                Error Loading Classes
              </h3>
              <p className="mb-4 text-muted-foreground text-sm">
                {handleError(error)}
              </p>
              <Button
                onClick={() =>
                  queryClient.invalidateQueries({ queryKey: ["classes"] })
                }
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : filteredClasses.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="py-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-semibold text-lg">
                {hasActiveFilters ? "No classes found" : "No classes yet"}
              </h3>
              <p className="mb-4 text-muted-foreground text-sm">
                {hasActiveFilters
                  ? "Try adjusting your search"
                  : "Get started by adding your first class"}
              </p>
              {hasActiveFilters ? (
                <Button variant="outline" onClick={clearSearch}>
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={() => setShowModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Class
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((cls: Class) => (
            <div
              key={cls.id}
              className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-lg">{cls.name}</h3>
                <span className="text-muted-foreground text-sm">
                  Section {cls.section || "-"}
                </span>
              </div>
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Class Teacher</span>
                  <span className="font-medium">{cls.classTeacher}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Students</span>
                  <span className="font-medium">
                    {cls.students} / {cls.capacity || 40}
                  </span>
                </div>
              </div>
              <div className="mb-4 h-2 w-full rounded-full bg-muted">
                <div
                  className={`h-2 rounded-full ${
                    cls.students / (cls.capacity || 40) > 0.9
                      ? "bg-destructive"
                      : cls.students / (cls.capacity || 40) > 0.7
                        ? "bg-warning"
                        : "bg-success"
                  }`}
                  style={{
                    width: `${(cls.students / (cls.capacity || 40)) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(cls)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary py-2 text-primary-foreground text-sm transition-colors hover:bg-primary/90"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(cls.id, cls.name)}
                  className="px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {dialog}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-card p-6">
            <h2 className="mb-4 font-bold text-xl">
              {editingClass ? "Edit Class" : "Add Class"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-medium text-foreground text-sm">
                    Class Name
                  </label>
                  <select
                    name="name"
                    defaultValue={editingClass?.name || ""}
                    required
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select</option>
                    <option>Class 9</option>
                    <option>Class 10</option>
                    <option>Class 11</option>
                    <option>Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-foreground text-sm">
                    Section
                  </label>
                  <select
                    name="section"
                    defaultValue={editingClass?.section || ""}
                    required
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select</option>
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="mb-1 block font-medium text-foreground text-sm">
                  Class Teacher
                </label>
                <select
                  name="classTeacher"
                  defaultValue={editingClass?.classTeacher || ""}
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Teacher</option>
                  <option>Dr. Rajesh Kumar</option>
                  <option>Mrs. Priya Sharma</option>
                  <option>Mr. Amit Singh</option>
                  <option>Ms. Ananya Gupta</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="mb-1 block font-medium text-foreground text-sm">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  defaultValue={editingClass?.capacity || 40}
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg border px-4 py-2 hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingClass
                      ? "Update"
                      : "Create Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
