import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { DataTable } from "@/components/dashboard/data-table"
import { gradeRecords, students, type GradeRecord } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Download, FileText, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/app/gradebook")({
    component: GradebookPage,
})

function GradebookPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [subjectFilter, setSubjectFilter] = useState<string>("all")
    const [isAddGradeOpen, setIsAddGradeOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

    const subjects = [...new Set(gradeRecords.map((r) => r.subject))]

    const filteredRecords = gradeRecords.filter((record) => {
        const matchesSearch =
            record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.subject.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSubject = subjectFilter === "all" || record.subject === subjectFilter
        return matchesSearch && matchesSubject
    })

    function getLetterGrade(score: number): string {
        if (score >= 90) return "A"
        if (score >= 80) return "B"
        if (score >= 70) return "C"
        if (score >= 60) return "D"
        return "F"
    }

    // Group records by student for the summary view
    const studentSummaries = students.map((student) => {
        const studentGrades = gradeRecords.filter((r) => r.studentId === student.id)
        const avgScore =
            studentGrades.length > 0
                ? studentGrades.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0) /
                studentGrades.length
                : 0

        return {
            ...student,
            gradesCount: studentGrades.length,
            avgScore: avgScore.toFixed(1),
            avgGrade: getLetterGrade(avgScore),
            trend: avgScore >= 80 ? "up" : avgScore < 60 ? "down" : "stable",
        }
    })

    const gradeColumns = [
        {
            key: "studentName",
            header: "Student",
            render: (record: GradeRecord) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <span className="text-xs font-medium">
                            {record.studentName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </span>
                    </div>
                    <span className="font-medium text-foreground">{record.studentName}</span>
                </div>
            ),
        },
        {
            key: "subject",
            header: "Subject",
        },
        {
            key: "examType",
            header: "Exam Type",
        },
        {
            key: "score",
            header: "Score",
            render: (record: GradeRecord) => (
                <span className="text-foreground">
                    {record.score}/{record.maxScore}
                </span>
            ),
        },
        {
            key: "percentage",
            header: "Percentage",
            render: (record: GradeRecord) => {
                const percentage = (record.score / record.maxScore) * 100
                return (
                    <span
                        className={cn(
                            "font-medium",
                            percentage >= 80
                                ? "text-primary"
                                : percentage >= 60
                                    ? "text-accent"
                                    : "text-destructive"
                        )}
                    >
                        {percentage.toFixed(0)}%
                    </span>
                )
            },
        },
        {
            key: "grade",
            header: "Grade",
            render: (record: GradeRecord) => (
                <span
                    className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                        record.grade.startsWith("A")
                            ? "bg-primary/10 text-primary"
                            : record.grade.startsWith("B")
                                ? "bg-chart-3/10 text-chart-3"
                                : record.grade.startsWith("C")
                                    ? "bg-accent/10 text-accent"
                                    : "bg-destructive/10 text-destructive"
                    )}
                >
                    {record.grade}
                </span>
            ),
        },
        {
            key: "date",
            header: "Date",
        },
    ]

    const summaryColumns = [
        {
            key: "name",
            header: "Student",
            render: (student: (typeof studentSummaries)[0]) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <span className="text-sm font-medium">
                            {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </span>
                    </div>
                    <div>
                        <p className="font-medium text-foreground">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                            Grade {student.grade}-{student.section}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "gradesCount",
            header: "Exams Taken",
        },
        {
            key: "avgScore",
            header: "Average Score",
            render: (student: (typeof studentSummaries)[0]) => (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{student.avgScore}%</span>
                    {student.trend === "up" && <TrendingUp className="h-4 w-4 text-primary" />}
                    {student.trend === "down" && (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                </div>
            ),
        },
        {
            key: "avgGrade",
            header: "Grade",
            render: (student: (typeof studentSummaries)[0]) => (
                <span
                    className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                        student.avgGrade === "A"
                            ? "bg-primary/10 text-primary"
                            : student.avgGrade === "B"
                                ? "bg-chart-3/10 text-chart-3"
                                : student.avgGrade === "C"
                                    ? "bg-accent/10 text-accent"
                                    : "bg-destructive/10 text-destructive"
                    )}
                >
                    {student.avgGrade}
                </span>
            ),
        },
        {
            key: "actions",
            header: "",
            render: (student: (typeof studentSummaries)[0]) => (
                <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(student.id)}>
                    View Details
                </Button>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gradebook</h1>
                    <p className="text-muted-foreground">
                        Manage grades and generate reports
                    </p>
                </div>
            </div>

            <Tabs defaultValue="grades" className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <TabsList className="bg-secondary">
                        <TabsTrigger value="grades">All Grades</TabsTrigger>
                        <TabsTrigger value="summary">Student Summary</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Report
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                        <Dialog open={isAddGradeOpen} onOpenChange={setIsAddGradeOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Grade
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Add New Grade</DialogTitle>
                                    <DialogDescription>
                                        Enter the grade details for a student exam.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="student">Student</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select student" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {students.map((student) => (
                                                    <SelectItem key={student.id} value={student.id}>
                                                        {student.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
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
                                        <div className="space-y-2">
                                            <Label htmlFor="examType">Exam Type</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Quiz">Quiz</SelectItem>
                                                    <SelectItem value="Midterm">Midterm</SelectItem>
                                                    <SelectItem value="Final">Final</SelectItem>
                                                    <SelectItem value="Assignment">Assignment</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="score">Score</Label>
                                            <Input id="score" type="number" placeholder="85" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="maxScore">Max Score</Label>
                                            <Input id="maxScore" type="number" placeholder="100" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input id="date" type="date" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddGradeOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={() => setIsAddGradeOpen(false)}>Add Grade</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <TabsContent value="grades" className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search grades..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-secondary border-border"
                            />
                        </div>
                        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                            <SelectTrigger className="w-40 bg-secondary border-border">
                                <SelectValue placeholder="All Subjects" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subjects</SelectItem>
                                {subjects.map((subject) => (
                                    <SelectItem key={subject} value={subject}>
                                        {subject}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DataTable columns={gradeColumns} data={filteredRecords} />
                </TabsContent>

                <TabsContent value="summary" className="space-y-4">
                    <DataTable columns={summaryColumns} data={studentSummaries} />
                </TabsContent>
            </Tabs>

            {/* Student Detail Dialog */}
            <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Student Grade Details</DialogTitle>
                    </DialogHeader>
                    {selectedStudent && (
                        <div className="space-y-4">
                            {(() => {
                                const student = students.find((s) => s.id === selectedStudent)
                                const studentGrades = gradeRecords.filter(
                                    (r) => r.studentId === selectedStudent
                                )

                                if (!student) return null

                                return (
                                    <>
                                        <div className="flex items-center gap-4 pb-4 border-b border-border">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                                <span className="text-lg font-medium">
                                                    {student.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">{student.name}</h3>
                                                <p className="text-muted-foreground">
                                                    Grade {student.grade}-{student.section} | {student.rollNumber}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {studentGrades.map((grade) => (
                                                <div
                                                    key={grade.id}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                                                >
                                                    <div>
                                                        <p className="font-medium">{grade.subject}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {grade.examType} - {grade.date}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium">
                                                            {grade.score}/{grade.maxScore}
                                                        </p>
                                                        <span
                                                            className={cn(
                                                                "text-sm",
                                                                grade.grade.startsWith("A")
                                                                    ? "text-primary"
                                                                    : grade.grade.startsWith("B")
                                                                        ? "text-chart-3"
                                                                        : "text-accent"
                                                            )}
                                                        >
                                                            {grade.grade}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )
                            })()}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                            Close
                        </Button>
                        <Button>
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Report Card
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
