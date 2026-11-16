/**
 * Exam Schedule Management - Plan and organize examination timetables
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Calendar } from "@/components/ui/calendar";
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
import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar as CalendarIcon,
  Edit,
  FileText,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/exams/schedule")({
  component: ExamSchedulePage,
});

// Sub-features navigation
const subFeatures = [
  { name: "Dashboard", href: "/app/exams", icon: FileText },
  { name: "Exam Types", href: "/app/exams/types", icon: BookOpen },
  {
    name: "Schedule",
    href: "/app/exams/schedule",
    icon: CalendarIcon,
    active: true,
  },
  { name: "Hall Allocation", href: "/app/exams/halls", icon: MapPin },
  { name: "Marks Entry", href: "/app/exams/marks", icon: BookOpen },
  { name: "Results", href: "/app/exams/results", icon: BookOpen },
  { name: "Report Cards", href: "/app/exams/reports", icon: FileText },
];

interface ExamSchedule {
  id: string;
  examName: string;
  subject: string;
  class: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  room: string;
  invigilator: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
}

function ExamSchedulePage() {
  const [schedules, setSchedules] = useState<ExamSchedule[]>([
    {
      id: "1",
      examName: "Mathematics UT-3",
      subject: "Mathematics",
      class: "Class 10-A",
      date: new Date("2026-01-25"),
      startTime: "09:00",
      endTime: "11:00",
      duration: 120,
      room: "Hall A-101",
      invigilator: "Mr. Sharma",
      status: "scheduled",
    },
    {
      id: "2",
      examName: "Science UT-3",
      subject: "Science",
      class: "Class 10-A",
      date: new Date("2026-01-27"),
      startTime: "09:00",
      endTime: "11:00",
      duration: 120,
      room: "Hall B-102",
      invigilator: "Ms. Patel",
      status: "scheduled",
    },
    {
      id: "3",
      examName: "English Half-Yearly",
      subject: "English",
      class: "Class 12-A",
      date: new Date("2026-01-30"),
      startTime: "13:00",
      endTime: "16:00",
      duration: 180,
      room: "Hall C-201",
      invigilator: "Mr. Kumar",
      status: "scheduled",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ExamSchedule | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [formData, setFormData] = useState({
    examName: "",
    subject: "",
    class: "",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
    invigilator: "",
  });

  const handleSubmit = () => {
    if (
      !formData.examName ||
      !formData.subject ||
      !formData.class ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.room
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60);

    const newSchedule: ExamSchedule = {
      id: editingSchedule?.id || Date.now().toString(),
      examName: formData.examName,
      subject: formData.subject,
      class: formData.class,
      date: new Date(formData.date),
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration,
      room: formData.room,
      invigilator: formData.invigilator,
      status: "scheduled",
    };

    if (editingSchedule) {
      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id === editingSchedule.id ? newSchedule : schedule,
        ),
      );
      toast.success("Exam schedule updated successfully");
    } else {
      setSchedules((prev) => [...prev, newSchedule]);
      toast.success("Exam scheduled successfully");
    }

    setIsDialogOpen(false);
    setEditingSchedule(null);
    setFormData({
      examName: "",
      subject: "",
      class: "",
      date: "",
      startTime: "",
      endTime: "",
      room: "",
      invigilator: "",
    });
  };

  const handleEdit = (schedule: ExamSchedule) => {
    setEditingSchedule(schedule);
    setFormData({
      examName: schedule.examName,
      subject: schedule.subject,
      class: schedule.class,
      date: schedule.date.toISOString().split("T")[0],
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      room: schedule.room,
      invigilator: schedule.invigilator,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
    toast.success("Exam schedule deleted successfully");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredSchedules = schedules.filter(
    (schedule) =>
      selectedDate &&
      schedule.date.toDateString() === selectedDate.toDateString(),
  );

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
          <h1 className="font-bold text-3xl">Exam Schedule</h1>
          <p className="text-muted-foreground">
            Plan and organize examination timetables
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSchedule(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? "Edit Exam Schedule" : "Schedule New Exam"}
              </DialogTitle>
              <DialogDescription>
                Set up the examination details and timing
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="examName" className="text-right">
                  Exam Name *
                </Label>
                <Input
                  id="examName"
                  value={formData.examName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      examName: e.target.value,
                    }))
                  }
                  className="col-span-3"
                  placeholder="e.g., Mathematics UT-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject *
                </Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="col-span-3"
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="class" className="text-right">
                  Class *
                </Label>
                <Input
                  id="class"
                  value={formData.class}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, class: e.target.value }))
                  }
                  className="col-span-3"
                  placeholder="e.g., Class 10-A"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="text-right">
                  Start Time *
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endTime" className="text-right">
                  End Time *
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room" className="text-right">
                  Room *
                </Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, room: e.target.value }))
                  }
                  className="col-span-3"
                  placeholder="e.g., Hall A-101"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="invigilator" className="text-right">
                  Invigilator
                </Label>
                <Input
                  id="invigilator"
                  value={formData.invigilator}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      invigilator: e.target.value,
                    }))
                  }
                  className="col-span-3"
                  placeholder="e.g., Mr. Sharma"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingSchedule ? "Update" : "Schedule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4 text-center text-muted-foreground">
              Calendar component coming soon
            </div>
          </CardContent>
        </Card>

        {/* Schedule List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate
                ? `Schedule for ${selectedDate.toDateString()}`
                : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSchedules.length === 0 ? (
              <p className="text-muted-foreground">
                No exams scheduled for this date
              </p>
            ) : (
              <div className="space-y-4">
                {filteredSchedules.map((schedule) => (
                  <div key={schedule.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-medium">{schedule.examName}</h4>
                      <Badge className={getStatusColor(schedule.status)}>
                        {schedule.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-muted-foreground text-sm">
                      <div>Subject: {schedule.subject}</div>
                      <div>Class: {schedule.class}</div>
                      <div>
                        Time: {schedule.startTime} - {schedule.endTime}
                      </div>
                      <div>Room: {schedule.room}</div>
                      <div>Invigilator: {schedule.invigilator}</div>
                      <div>Duration: {schedule.duration} min</div>
                    </div>
                    <div className="mt-3 flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(schedule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(schedule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Scheduled Exams */}
      <Card>
        <CardHeader>
          <CardTitle>All Scheduled Exams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center space-x-4">
                  <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{schedule.examName}</p>
                    <p className="text-muted-foreground text-sm">
                      {schedule.subject} • {schedule.class} •{" "}
                      {schedule.date.toDateString()}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {schedule.startTime} - {schedule.endTime} •{" "}
                      {schedule.room}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(schedule.status)}>
                    {schedule.status}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(schedule)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(schedule.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
