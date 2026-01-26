import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { classSchedules, teachers, type ClassSchedule } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Plus, Clock, MapPin, User } from "lucide-react"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/app/schedule")({
    component: SchedulePage,
})

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const timeSlots = [
    "08:00",
    "08:50",
    "09:40",
    "10:40",
    "11:30",
    "12:20",
    "13:10",
    "14:00",
]

const subjectColors: Record<string, string> = {
    Mathematics: "bg-primary/20 border-primary/30 text-primary",
    English: "bg-chart-3/20 border-chart-3/30 text-chart-3",
    Science: "bg-accent/20 border-accent/30 text-accent",
    History: "bg-chart-4/20 border-chart-4/30 text-chart-4",
    Physics: "bg-chart-5/20 border-chart-5/30 text-chart-5",
}

function SchedulePage() {
    const [selectedGrade, setSelectedGrade] = useState("10")
    const [selectedSection, setSelectedSection] = useState("A")
    const [isAddClassOpen, setIsAddClassOpen] = useState(false)
    const [selectedClass, setSelectedClass] = useState<ClassSchedule | null>(null)

    const filteredSchedule = classSchedules.filter(
        (schedule) => schedule.grade === selectedGrade && schedule.section === selectedSection
    )

    const getClassForSlot = (day: string, time: string) => {
        return filteredSchedule.find(
            (schedule) => schedule.day === day && schedule.startTime === time
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
                    <p className="text-muted-foreground">
                        Manage timetables and schedules
                    </p>
                </div>
            </div>

            {/* Header Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                        <SelectTrigger className="w-32 bg-secondary border-border">
                            <SelectValue placeholder="Grade" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="9">Grade 9</SelectItem>
                            <SelectItem value="10">Grade 10</SelectItem>
                            <SelectItem value="11">Grade 11</SelectItem>
                            <SelectItem value="12">Grade 12</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={selectedSection} onValueChange={setSelectedSection}>
                        <SelectTrigger className="w-32 bg-secondary border-border">
                            <SelectValue placeholder="Section" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="A">Section A</SelectItem>
                            <SelectItem value="B">Section B</SelectItem>
                            <SelectItem value="C">Section C</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Class
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Add New Class</DialogTitle>
                            <DialogDescription>
                                Schedule a new class for the selected grade and section.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="day">Day</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select day" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {days.map((day) => (
                                                <SelectItem key={day} value={day}>
                                                    {day}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="Science">Science</SelectItem>
                                            <SelectItem value="History">History</SelectItem>
                                            <SelectItem value="Physics">Physics</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startTime">Start Time</Label>
                                    <Input id="startTime" type="time" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endTime">End Time</Label>
                                    <Input id="endTime" type="time" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="teacher">Teacher</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select teacher" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teachers.map((teacher) => (
                                            <SelectItem key={teacher.id} value={teacher.id}>
                                                {teacher.name} - {teacher.subject}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="room">Room</Label>
                                <Input id="room" placeholder="e.g., Room 101, Lab 1" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddClassOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => setIsAddClassOpen(false)}>Add Class</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Grade/Section Display */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                    Grade {selectedGrade}-{selectedSection} Weekly Schedule
                </h2>
                <p className="text-sm text-muted-foreground">
                    Click on any class to view details
                </p>
            </div>

            {/* Schedule Grid */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        {/* Header Row */}
                        <div className="grid grid-cols-6 border-b border-border bg-secondary/50">
                            <div className="p-4 text-sm font-medium text-muted-foreground">
                                Time
                            </div>
                            {days.map((day) => (
                                <div
                                    key={day}
                                    className="p-4 text-sm font-medium text-center text-foreground"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Time Slots */}
                        {timeSlots.map((time, index) => (
                            <div
                                key={time}
                                className={cn(
                                    "grid grid-cols-6",
                                    index < timeSlots.length - 1 && "border-b border-border"
                                )}
                            >
                                <div className="p-4 text-sm text-muted-foreground flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {time}
                                </div>
                                {days.map((day) => {
                                    const classItem = getClassForSlot(day, time)
                                    return (
                                        <div key={`${day}-${time}`} className="p-2 min-h-[80px]">
                                            {classItem ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedClass(classItem)}
                                                    className={cn(
                                                        "w-full h-full p-3 rounded-lg border text-left transition-all hover:scale-[1.02]",
                                                        subjectColors[classItem.subject] ||
                                                        "bg-secondary border-border"
                                                    )}
                                                >
                                                    <p className="font-medium text-sm">{classItem.subject}</p>
                                                    <p className="text-xs opacity-80 mt-1">
                                                        {classItem.startTime} - {classItem.endTime}
                                                    </p>
                                                    <p className="text-xs opacity-70 mt-1 truncate">
                                                        {classItem.room}
                                                    </p>
                                                </button>
                                            ) : (
                                                <div className="w-full h-full rounded-lg border border-dashed border-border/50" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Class Detail Dialog */}
            <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Class Details</DialogTitle>
                    </DialogHeader>
                    {selectedClass && (
                        <div className="space-y-4">
                            <div
                                className={cn(
                                    "p-4 rounded-lg border",
                                    subjectColors[selectedClass.subject] || "bg-secondary border-border"
                                )}
                            >
                                <h3 className="text-lg font-semibold">{selectedClass.subject}</h3>
                                <p className="text-sm opacity-80">
                                    {selectedClass.day}, {selectedClass.startTime} -{" "}
                                    {selectedClass.endTime}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Teacher</p>
                                        <p className="font-medium">{selectedClass.teacher}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Room</p>
                                        <p className="font-medium">{selectedClass.room}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Duration</p>
                                        <p className="font-medium">45 minutes</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedClass(null)}>
                            Close
                        </Button>
                        <Button variant="destructive" size="sm">
                            Remove Class
                        </Button>
                        <Button>Edit Class</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
