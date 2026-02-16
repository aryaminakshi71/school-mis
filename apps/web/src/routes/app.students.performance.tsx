import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { createFileRoute } from "@tanstack/react-router";
import { Award, Download, FileText, Search, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/app/students/performance")({
  component: StudentPerformancePage,
});

const subFeatures = [
  { name: "All Students", href: "/app/students" },
  { name: "Admission", href: "/app/students/admission" },
  { name: "Attendance", href: "/app/students/attendance" },
  { name: "Performance", href: "/app/students/performance", active: true },
  { name: "Discipline", href: "/app/students/discipline" },
  { name: "Transfer TC", href: "/app/students/transfer" },
  { name: "Alumni", href: "/app/students/alumni" },
];

const performanceData = [
  {
    id: "STU001",
    name: "Aryan Sharma",
    class: "10-A",
    marks: 85,
    grade: "A",
    rank: 3,
    status: "excellent",
  },
  {
    id: "STU002",
    name: "Priya Patel",
    class: "9-B",
    marks: 92,
    grade: "A+",
    rank: 1,
    status: "outstanding",
  },
  {
    id: "STU003",
    name: "Rahul Singh",
    class: "11-A",
    marks: 78,
    grade: "B+",
    rank: 8,
    status: "good",
  },
  {
    id: "STU004",
    name: "Ananya Gupta",
    class: "8-A",
    marks: 88,
    grade: "A",
    rank: 2,
    status: "excellent",
  },
  {
    id: "STU005",
    name: "Vikram Kumar",
    class: "12-B",
    marks: 72,
    grade: "B",
    rank: 12,
    status: "average",
  },
];

function StudentPerformancePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl text-foreground">
            Student Performance
          </h1>
          <p className="mt-1 text-muted-foreground">
            View and analyze student academic performance and grades.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline" className="border-border">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {subFeatures.map((feature) => (
          <a
            key={feature.name}
            href={feature.href}
            className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium text-sm ${
              feature.active
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground hover:bg-muted"
            }`}
          >
            {feature.name}
          </a>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Class Average
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">82.4%</div>
            <p className="text-muted-foreground text-xs">
              All classes combined
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Top Performers
            </CardTitle>
            <Award className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">47</div>
            <p className="text-muted-foreground text-xs">
              Students with A grade
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Needs Improvement
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">23</div>
            <p className="text-muted-foreground text-xs">Below 60% marks</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Exams Completed
            </CardTitle>
            <FileText className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">12</div>
            <p className="text-muted-foreground text-xs">This academic year</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-border border-b p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-md flex-1 items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="border-0 bg-transparent text-sm focus-visible:ring-0"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-border text-sm">
                Select Exam
              </Button>
              <Button variant="outline" className="border-border text-sm">
                Filter by Class
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Student ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Class</th>
                <th className="px-6 py-3">Marks %</th>
                <th className="px-6 py-3">Grade</th>
                <th className="px-6 py-3">Class Rank</th>
                <th className="px-6 py-3">Progress</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((student) => (
                <tr
                  key={student.id}
                  className="border-b bg-card hover:bg-muted"
                >
                  <td className="px-6 py-4 font-medium text-foreground">
                    {student.id}
                  </td>
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.class}</td>
                  <td className="px-6 py-4 font-medium">{student.marks}%</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-primary/10 text-primary">
                      {student.grade}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">#{student.rank}</td>
                  <td className="px-6 py-4">
                    <div className="w-24">
                      <Progress value={student.marks} className="h-2" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        student.status === "outstanding"
                          ? "bg-primary/10 text-primary"
                          : student.status === "excellent"
                            ? "bg-success/15 text-success"
                            : student.status === "good"
                              ? "bg-primary/10 text-primary"
                              : "bg-warning/15 text-warning"
                      }
                    >
                      {student.status.charAt(0).toUpperCase() +
                        student.status.slice(1)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
