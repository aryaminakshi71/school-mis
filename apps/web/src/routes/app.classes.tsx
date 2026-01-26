import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Edit, Trash2, BookOpen, Search, Download, AlertCircle } from "lucide-react";
import { api, type Class } from "@/lib/api";
import { useSearch } from "@/lib/search-utils";
import { exportToCSV } from "@/lib/export-utils";
import { useListPageShortcuts } from "@/lib/keyboard-shortcuts";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { handleError } from "@/lib/error-handler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      try {
        return await api.classes.list();
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
  } = useSearch({
    data: classes,
    searchFields: ["name", "section", "classTeacher"],
  });

  // Keyboard shortcuts
  useListPageShortcuts(
    () => setShowModal(true),
    () => queryClient.invalidateQueries({ queryKey: ["classes"] }),
    () => handleExport()
  );

  // Export functionality
  const handleExport = () => {
    try {
      const exportData = filteredClasses.map((c) => ({
        "Class Name": c.name,
        "Section": c.section || "",
        "Class Teacher": c.classTeacher || "",
        "Students": c.students.toString(),
        "Capacity": (c.capacity || 40).toString(),
        "Available Seats": ((c.capacity || 40) - c.students).toString(),
      }));

      exportToCSV(exportData, `classes-export-${new Date().toISOString().split("T")[0]}`);
      toast.success("Classes exported successfully");
    } catch (err) {
      toast.error(handleError(err));
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: Omit<Class, "id" | "students">) => api.classes.create(data),
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
      }
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
    classes?.reduce(
      (sum: number, c: Class) => sum + (c.capacity || 0),
      0,
    ) || 0;
  const availableSeats = totalCapacity - totalStudents;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600">Manage classes and sections</p>
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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-blue-700 text-sm font-medium">Total Classes</p>
          <p className="text-2xl font-bold text-blue-800">
            {classes?.length || 0}
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-green-700 text-sm font-medium">Total Students</p>
          <p className="text-2xl font-bold text-green-800">{totalStudents}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-yellow-700 text-sm font-medium">Available Seats</p>
          <p className="text-2xl font-bold text-yellow-800">{availableSeats}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Classes</h3>
              <p className="text-sm text-gray-600 mb-4">{handleError(error)}</p>
              <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["classes"] })}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : filteredClasses.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {hasActiveFilters ? "No classes found" : "No classes yet"}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((cls: Class) => (
            <div
              key={cls.id}
              className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{cls.name}</h3>
                <span className="text-sm text-gray-500">
                  Section {cls.section || "-"}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Class Teacher</span>
                  <span className="font-medium">{cls.classTeacher}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Students</span>
                  <span className="font-medium">
                    {cls.students} / {cls.capacity || 40}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full ${cls.students / (cls.capacity || 40) > 0.9
                      ? "bg-red-500"
                      : cls.students / (cls.capacity || 40) > 0.7
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  style={{
                    width: `${(cls.students / (cls.capacity || 40)) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(cls)}
                  className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(cls.id, cls.name)}
                  className="px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {dialog}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingClass ? "Edit Class" : "Add Class"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Name
                  </label>
                  <select
                    name="name"
                    defaultValue={editingClass?.name || ""}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option>Class 9</option>
                    <option>Class 10</option>
                    <option>Class 11</option>
                    <option>Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section
                  </label>
                  <select
                    name="section"
                    defaultValue={editingClass?.section || ""}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Teacher
                </label>
                <select
                  name="classTeacher"
                  defaultValue={editingClass?.classTeacher || ""}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Teacher</option>
                  <option>Dr. Rajesh Kumar</option>
                  <option>Mrs. Priya Sharma</option>
                  <option>Mr. Amit Singh</option>
                  <option>Ms. Ananya Gupta</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  defaultValue={editingClass?.capacity || 40}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
