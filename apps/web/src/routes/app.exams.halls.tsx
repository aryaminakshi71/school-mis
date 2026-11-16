/**
 * Hall Allocation Management - Assign examination halls and seating arrangements
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
  Edit,
  FileText,
  MapPin,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/exams/halls")({
  component: HallAllocationPage,
});

// Sub-features navigation
const subFeatures = [
  { name: "Dashboard", href: "/app/exams", icon: FileText },
  { name: "Exam Types", href: "/app/exams/types", icon: BookOpen },
  { name: "Schedule", href: "/app/exams/schedule", icon: Calendar },
  {
    name: "Hall Allocation",
    href: "/app/exams/halls",
    icon: MapPin,
    active: true,
  },
  { name: "Marks Entry", href: "/app/exams/marks", icon: BookOpen },
  { name: "Results", href: "/app/exams/results", icon: BookOpen },
  { name: "Report Cards", href: "/app/exams/reports", icon: FileText },
];

interface Hall {
  id: string;
  name: string;
  capacity: number;
  location: string;
  facilities: string[];
  isAvailable: boolean;
}

interface Allocation {
  id: string;
  examId: string;
  examName: string;
  hallId: string;
  hallName: string;
  date: string;
  timeSlot: string;
  allocatedSeats: number;
  totalStudents: number;
  status: "allocated" | "confirmed" | "in-progress" | "completed";
}

function HallAllocationPage() {
  const [halls, setHalls] = useState<Hall[]>([
    {
      id: "1",
      name: "Hall A-101",
      capacity: 50,
      location: "Ground Floor, Block A",
      facilities: ["Projector", "Whiteboard", "AC"],
      isAvailable: true,
    },
    {
      id: "2",
      name: "Hall B-102",
      capacity: 40,
      location: "First Floor, Block B",
      facilities: ["Whiteboard", "AC"],
      isAvailable: true,
    },
    {
      id: "3",
      name: "Hall C-201",
      capacity: 60,
      location: "Second Floor, Block C",
      facilities: ["Projector", "Whiteboard", "AC", "Sound System"],
      isAvailable: true,
    },
  ]);

  const [allocations, setAllocations] = useState<Allocation[]>([
    {
      id: "1",
      examId: "EX001",
      examName: "Mathematics UT-3",
      hallId: "1",
      hallName: "Hall A-101",
      date: "2026-01-25",
      timeSlot: "09:00 - 11:00",
      allocatedSeats: 45,
      totalStudents: 42,
      status: "allocated",
    },
    {
      id: "2",
      examId: "EX002",
      examName: "Science UT-3",
      hallId: "2",
      hallName: "Hall B-102",
      date: "2026-01-27",
      timeSlot: "09:00 - 11:00",
      allocatedSeats: 38,
      totalStudents: 38,
      status: "confirmed",
    },
  ]);

  const [isAllocationDialogOpen, setIsAllocationDialogOpen] = useState(false);
  const [isHallDialogOpen, setIsHallDialogOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<Allocation | null>(
    null,
  );
  const [allocationForm, setAllocationForm] = useState({
    examId: "",
    examName: "",
    hallId: "",
    date: "",
    timeSlot: "",
    totalStudents: "",
  });

  const [hallForm, setHallForm] = useState({
    name: "",
    capacity: "",
    location: "",
    facilities: "",
  });

  const availableExams = [
    { id: "EX001", name: "Mathematics UT-3", students: 42 },
    { id: "EX002", name: "Science UT-3", students: 38 },
    { id: "EX003", name: "English Half-Yearly", students: 35 },
  ];

  const handleAllocationSubmit = () => {
    if (
      !allocationForm.examId ||
      !allocationForm.hallId ||
      !allocationForm.date ||
      !allocationForm.timeSlot ||
      !allocationForm.totalStudents
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const selectedHall = halls.find((h) => h.id === allocationForm.hallId);
    const selectedExam = availableExams.find(
      (e) => e.id === allocationForm.examId,
    );

    if (!selectedHall || !selectedExam) {
      toast.error("Invalid hall or exam selection");
      return;
    }

    if (parseInt(allocationForm.totalStudents) > selectedHall.capacity) {
      toast.error("Student count exceeds hall capacity");
      return;
    }

    const newAllocation: Allocation = {
      id: editingAllocation?.id || Date.now().toString(),
      examId: allocationForm.examId,
      examName: selectedExam.name,
      hallId: allocationForm.hallId,
      hallName: selectedHall.name,
      date: allocationForm.date,
      timeSlot: allocationForm.timeSlot,
      allocatedSeats: selectedHall.capacity,
      totalStudents: parseInt(allocationForm.totalStudents),
      status: "allocated",
    };

    if (editingAllocation) {
      setAllocations((prev) =>
        prev.map((allocation) =>
          allocation.id === editingAllocation.id ? newAllocation : allocation,
        ),
      );
      toast.success("Hall allocation updated successfully");
    } else {
      setAllocations((prev) => [...prev, newAllocation]);
      toast.success("Hall allocated successfully");
    }

    setIsAllocationDialogOpen(false);
    setEditingAllocation(null);
    setAllocationForm({
      examId: "",
      examName: "",
      hallId: "",
      date: "",
      timeSlot: "",
      totalStudents: "",
    });
  };

  const handleHallSubmit = () => {
    if (!hallForm.name || !hallForm.capacity || !hallForm.location) {
      toast.error("Please fill all required fields");
      return;
    }

    const newHall: Hall = {
      id: Date.now().toString(),
      name: hallForm.name,
      capacity: parseInt(hallForm.capacity),
      location: hallForm.location,
      facilities: hallForm.facilities.split(",").map((f) => f.trim()),
      isAvailable: true,
    };

    setHalls((prev) => [...prev, newHall]);
    toast.success("Hall added successfully");

    setIsHallDialogOpen(false);
    setHallForm({
      name: "",
      capacity: "",
      location: "",
      facilities: "",
    });
  };

  const handleEditAllocation = (allocation: Allocation) => {
    setEditingAllocation(allocation);
    setAllocationForm({
      examId: allocation.examId,
      examName: allocation.examName,
      hallId: allocation.hallId,
      date: allocation.date,
      timeSlot: allocation.timeSlot,
      totalStudents: allocation.totalStudents.toString(),
    });
    setIsAllocationDialogOpen(true);
  };

  const handleDeleteAllocation = (id: string) => {
    setAllocations((prev) => prev.filter((allocation) => allocation.id !== id));
    toast.success("Hall allocation deleted successfully");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "allocated":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
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
          <h1 className="font-bold text-3xl">Hall Allocation</h1>
          <p className="text-muted-foreground">
            Assign examination halls and manage seating arrangements
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isHallDialogOpen} onOpenChange={setIsHallDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Hall
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Hall</DialogTitle>
                <DialogDescription>
                  Add a new examination hall to the system
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hallName" className="text-right">
                    Name *
                  </Label>
                  <Input
                    id="hallName"
                    value={hallForm.name}
                    onChange={(e) =>
                      setHallForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="col-span-3"
                    placeholder="e.g., Hall A-101"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">
                    Capacity *
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={hallForm.capacity}
                    onChange={(e) =>
                      setHallForm((prev) => ({
                        ...prev,
                        capacity: e.target.value,
                      }))
                    }
                    className="col-span-3"
                    placeholder="e.g., 50"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={hallForm.location}
                    onChange={(e) =>
                      setHallForm((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="col-span-3"
                    placeholder="e.g., Ground Floor, Block A"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="facilities" className="text-right">
                    Facilities
                  </Label>
                  <Input
                    id="facilities"
                    value={hallForm.facilities}
                    onChange={(e) =>
                      setHallForm((prev) => ({
                        ...prev,
                        facilities: e.target.value,
                      }))
                    }
                    className="col-span-3"
                    placeholder="e.g., Projector, Whiteboard, AC"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsHallDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleHallSubmit}>Add Hall</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isAllocationDialogOpen}
            onOpenChange={setIsAllocationDialogOpen}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setEditingAllocation(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Allocate Hall
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAllocation ? "Edit Hall Allocation" : "Allocate Hall"}
                </DialogTitle>
                <DialogDescription>
                  Assign a hall for an examination
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="exam" className="text-right">
                    Exam *
                  </Label>
                  <Select
                    value={allocationForm.examId}
                    onValueChange={(value) => {
                      const exam = availableExams.find((e) => e.id === value);
                      setAllocationForm((prev) => ({
                        ...prev,
                        examId: value,
                        examName: exam?.name || "",
                        totalStudents: exam?.students.toString() || "",
                      }));
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableExams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.name} ({exam.students} students)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hall" className="text-right">
                    Hall *
                  </Label>
                  <Select
                    value={allocationForm.hallId}
                    onValueChange={(value) =>
                      setAllocationForm((prev) => ({ ...prev, hallId: value }))
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select hall" />
                    </SelectTrigger>
                    <SelectContent>
                      {halls
                        .filter((h) => h.isAvailable)
                        .map((hall) => (
                          <SelectItem key={hall.id} value={hall.id}>
                            {hall.name} (Capacity: {hall.capacity})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={allocationForm.date}
                    onChange={(e) =>
                      setAllocationForm((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="timeSlot" className="text-right">
                    Time Slot *
                  </Label>
                  <Input
                    id="timeSlot"
                    value={allocationForm.timeSlot}
                    onChange={(e) =>
                      setAllocationForm((prev) => ({
                        ...prev,
                        timeSlot: e.target.value,
                      }))
                    }
                    className="col-span-3"
                    placeholder="e.g., 09:00 - 11:00"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAllocationDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAllocationSubmit}>
                  {editingAllocation ? "Update" : "Allocate"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Halls</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{halls.length}</div>
            <p className="text-muted-foreground text-xs">
              {halls.filter((h) => h.isAvailable).length} available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Capacity
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {halls.reduce((sum, h) => sum + h.capacity, 0)}
            </div>
            <p className="text-muted-foreground text-xs">Seating capacity</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Active Allocations
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{allocations.length}</div>
            <p className="text-muted-foreground text-xs">
              Halls allocated for exams
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Available Halls */}
        <Card>
          <CardHeader>
            <CardTitle>Available Halls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {halls
                .filter((h) => h.isAvailable)
                .map((hall) => (
                  <div key={hall.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-medium">{hall.name}</h4>
                      <Badge variant="outline">Available</Badge>
                    </div>
                    <p className="mb-2 text-muted-foreground text-sm">
                      {hall.location}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span>Capacity: {hall.capacity} students</span>
                      <div className="flex flex-wrap gap-1">
                        {hall.facilities.map((facility, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Allocations */}
        <Card>
          <CardHeader>
            <CardTitle>Current Allocations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allocations.map((allocation) => (
                <div key={allocation.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium">{allocation.examName}</h4>
                    <Badge className={getStatusColor(allocation.status)}>
                      {allocation.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-muted-foreground text-sm">
                    <p>Hall: {allocation.hallName}</p>
                    <p>
                      Date: {allocation.date} • {allocation.timeSlot}
                    </p>
                    <p>
                      Students: {allocation.totalStudents} /{" "}
                      {allocation.allocatedSeats}
                    </p>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAllocation(allocation)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAllocation(allocation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
