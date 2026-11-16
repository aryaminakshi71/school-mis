import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Class {
  id: string;
  name: string;
  section?: string;
}

interface Subject {
  id: string;
  name: string;
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
}

interface TimetableEntry {
  id: string;
  classId: string;
  className: string;
  section?: string;
  dayOfWeek: number;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  subjectName: string;
  teacherId?: string;
  teacherName?: string;
  roomNumber?: string;
}

const daysOfWeek = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

const timetableSchema = z.object({
  classId: z.string().min(1, "Class is required"),
  dayOfWeek: z.number().min(1).max(7),
  periodNumber: z.number().min(1).max(10),
  subjectId: z.string().min(1, "Subject is required"),
  teacherId: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  roomNumber: z.string().optional(),
});

type TimetableFormData = z.infer<typeof timetableSchema>;

export function TimetableManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      return api.classes.list();
    },
  });

  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      return api.subjects.list();
    },
  });

  const { data: teachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      return api.teachers.list();
    },
  });

  const { data: timetable, isLoading } = useQuery({
    queryKey: ["timetable", selectedClass],
    queryFn: async () => {
      return api.timetable.list(selectedClass || undefined);
    },
    enabled: !!selectedClass,
  });

  const form = useForm<TimetableFormData>({
    resolver: zodResolver(timetableSchema),
    defaultValues: {
      classId: "",
      dayOfWeek: 1,
      periodNumber: 1,
      subjectId: "",
      teacherId: "",
      startTime: "",
      endTime: "",
      roomNumber: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TimetableFormData) => {
      return api.timetable.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable", selectedClass] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Timetable entry created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create timetable entry",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: TimetableFormData & { id: string }) => {
      return api.timetable.update(data.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable", selectedClass] });
      setIsDialogOpen(false);
      setEditingEntry(null);
      form.reset();
      toast({
        title: "Success",
        description: "Timetable entry updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update timetable entry",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.timetable.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable", selectedClass] });
      toast({
        title: "Success",
        description: "Timetable entry deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete timetable entry",
      });
    },
  });

  const onSubmit = (data: TimetableFormData) => {
    if (editingEntry) {
      updateMutation.mutate({ ...data, id: editingEntry.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    form.reset({
      classId: entry.classId,
      dayOfWeek: entry.dayOfWeek,
      periodNumber: entry.periodNumber,
      subjectId: entry.subjectId,
      teacherId: entry.teacherId || "",
      startTime: entry.startTime,
      endTime: entry.endTime,
      roomNumber: entry.roomNumber || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this timetable entry?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingEntry(null);
    form.reset({
      classId: selectedClass,
      dayOfWeek: 1,
      periodNumber: 1,
      subjectId: "",
      teacherId: "",
      startTime: "",
      endTime: "",
      roomNumber: "",
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timetable Management
          </CardTitle>
          <div className="flex gap-2">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classes?.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} {cls.section && `- ${cls.section}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddNew} disabled={!selectedClass}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Period
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingEntry
                      ? "Edit Timetable Entry"
                      : "Add Timetable Entry"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="classId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {classes?.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id}>
                                  {cls.name} {cls.section && `- ${cls.section}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dayOfWeek"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Day</FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(parseInt(value))
                              }
                              value={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {daysOfWeek.map((day) => (
                                  <SelectItem
                                    key={day.value}
                                    value={day.value.toString()}
                                  >
                                    {day.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="periodNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Period</FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(parseInt(value))
                              }
                              value={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from(
                                  { length: 10 },
                                  (_, i) => i + 1,
                                ).map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    Period {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subjectId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subjects?.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id}>
                                  {subject.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="teacherId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teacher (Optional)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select teacher" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">None</SelectItem>
                              {teachers?.map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  {teacher.firstName} {teacher.lastName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="roomNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Number (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Room 101" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingEntry ? "Update" : "Create"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {!selectedClass ? (
            <div className="py-8 text-center text-muted-foreground">
              Please select a class to view or manage the timetable
            </div>
          ) : isLoading ? (
            <div className="py-8 text-center">Loading timetable...</div>
          ) : !timetable || timetable.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No timetable entries found. Click "Add Period" to create one.
            </div>
          ) : (
            <div className="space-y-6">
              {timetable.map((day) => (
                <Card key={day.dayOfWeek}>
                  <CardHeader className="py-3">
                    <CardTitle className="text-lg">{day.dayName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {day.periods
                        .sort((a, b) => a.periodNumber - b.periodNumber)
                        .map((period) => (
                          <div
                            key={period.id}
                            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-4">
                              <div className="rounded bg-primary/10 px-3 py-1 font-semibold text-primary">
                                P{period.periodNumber}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {period.subjectName}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  {period.startTime} - {period.endTime}
                                  {period.teacherName &&
                                    ` • ${period.teacherName}`}
                                  {period.roomNumber &&
                                    ` • ${period.roomNumber}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleEdit({
                                    ...period,
                                    dayOfWeek: day.dayOfWeek,
                                    classId: period.classId || selectedClass,
                                    className:
                                      period.className ||
                                      classes?.find(
                                        (c) =>
                                          c.id ===
                                          (period.classId || selectedClass),
                                      )?.name ||
                                      "",
                                    subjectId: period.subjectId || "",
                                    subjectName: period.subjectName || "",
                                  })
                                }
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(period.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
