import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Edit, Trash2, BookOpen, Users, User } from "lucide-react";

interface ClassData {
  id: string;
  name: string;
  section: string | null;
  capacity: number | null;
  students: number;
  classTeacher: string;
  createdAt: string;
}

export const Route = createFileRoute("/app/classes")({
  component: ClassesPage,
});

async function fetchClasses(): Promise<ClassData[]> {
  const res = await fetch("/api/classes");
  if (!res.ok) throw new Error("Failed to fetch classes");
  const data = await res.json();
  return data.classes || [];
}

async function createClass(data: Record<string, unknown>): Promise<ClassData> {
  const res = await fetch("/api/classes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create class");
  }
  return res.json();
}

async function updateClass(
  id: string,
  data: Record<string, unknown>,
): Promise<ClassData> {
  const res = await fetch(`/api/classes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update class");
  }
  return res.json();
}

async function deleteClass(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/classes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete class");
  return res.json();
}

function ClassesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const queryClient = useQueryClient();

  const {
    data: classes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const createMutation = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Class created successfully");
      setShowModal(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      updateClass(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Class updated successfully");
      setShowModal(false);
      setEditingClass(null);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Class deleted successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    if (editingClass) {
      updateMutation.mutate({ id: editingClass.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (cls: ClassData) => {
    setEditingClass(cls);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    toast.promise(
      new Promise((resolve) => {
        if (confirm("Are you sure you want to delete this class?")) {
          deleteMutation.mutate(id);
          resolve(true);
        }
      }),
      {
        loading: "Deleting class...",
        success: "Class deleted successfully",
        error: "Failed to delete class",
      },
    );
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClass(null);
  };

  const totalStudents =
    classes?.reduce((sum: number, c: ClassData) => sum + c.students, 0) || 0;
  const totalCapacity =
    classes?.reduce(
      (sum: number, c: ClassData) => sum + (c.capacity || 0),
      0,
    ) || 0;
  const availableSeats = totalCapacity - totalStudents;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600">Manage classes and sections</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Class
        </button>
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
        <div className="bg-white rounded-lg border p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading classes...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg border p-8 text-center text-red-600">
          Error loading classes. Please try again.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes?.map((cls: ClassData) => (
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
                  className={`h-2 rounded-full ${
                    cls.students / (cls.capacity || 40) > 0.9
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
                <button
                  onClick={() => handleDelete(cls.id)}
                  className="px-3 py-2 border rounded-lg hover:bg-red-50 text-red-600 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {classes?.length === 0 && (
            <div className="col-span-full bg-white rounded-lg border p-8 text-center text-gray-600">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gray-400" />
              </div>
              <p>No classes found. Add your first class!</p>
            </div>
          )}
        </div>
      )}

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
                  <option>Sarah Johnson</option>
                  <option>Michael Chen</option>
                  <option>Emily Davis</option>
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
