import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  Calendar,
  DollarSign,
  Download,
  Filter,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AnalyticsDashboard } from "../components/analytics-dashboard";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth-context";
import { exportToCSV } from "../lib/export-utils";

export const Route = createFileRoute("/app/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { user, hasRole } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async (reportName: string, type: string) => {
    console.log("Generating report:", reportName);
    try {
      setLoading(true);
      toast.info(`Generating ${reportName}...`);

      let data: any[] = [];
      let filename = reportName.toLowerCase().replace(/\s+/g, "-");

      switch (reportName) {
        case "Admission Report":
        case "Student Reports":
          const students = await api.students.list();
          data = students.map((s: any) => ({
            "Admission No": s.admissionNumber,
            Name: `${s.firstName} ${s.lastName}`,
            Class: s.className,
            "Roll No": s.rollNumber,
            "Father Name": s.fatherName,
            Phone: s.phone,
            Status: s.status,
          }));
          break;

        case "Fee Collection":
          const fees = await api.fees.list();
          data = fees.map((f: any) => ({
            "Receipt ID": f.id,
            Student: f.studentName,
            Class: f.className,
            Amount: f.amount,
            Date: new Date(f.createdAt).toLocaleDateString(),
            Status: f.status,
          }));
          break;

        case "Staff Directory":
          const teachers = await api.teachers.list();
          data = teachers.map((t: any) => ({
            ID: t.employeeId,
            Name: `${t.firstName} ${t.lastName}`,
            Subject: t.subject,
            Qualification: t.qualification,
            Phone: t.phone,
            Email: t.email,
          }));
          break;

        default:
          toast.info("This report type is coming soon!");
          setLoading(false);
          return;
      }

      if (data.length > 0) {
        exportToCSV(
          data,
          `${filename}-${new Date().toISOString().split("T")[0]}`,
        );
        toast.success(`${reportName} downloaded successfully`);
      } else {
        toast.warning("No data found for this report");
      }
    } catch (error) {
      console.error("Report generation failed:", error);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  if (!hasRole(["admin", "accountant", "teacher"])) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <BarChart3 className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 font-bold text-foreground text-xl">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You don't have permission to view reports.
          </p>
        </div>
      </div>
    );
  }

  const reportCategories = [
    {
      title: "Student Reports",
      icon: Users,
      color: "bg-primary/10 text-primary",
      reports: [
        {
          name: "Admission Report",
          description: "New admissions this month",
          type: "student",
        },
        {
          name: "Attendance Report",
          description: "Monthly attendance summary",
          type: "student",
        },
        {
          name: "Performance Report",
          description: "Grades and progress",
          type: "student",
        },
        {
          name: "TC Issued",
          description: "Transfer certificates",
          type: "student",
        },
      ],
    },
    {
      title: "Financial Reports",
      icon: DollarSign,
      color: "bg-success/15 text-success",
      reports: [
        {
          name: "Fee Collection",
          description: "Fee collection summary",
          type: "finance",
        },
        {
          name: "Expense Report",
          description: "Monthly expenses",
          type: "finance",
        },
        {
          name: "Salary Payment",
          description: "Staff salary details",
          type: "finance",
        },
        {
          name: "Due Fees",
          description: "Pending fee collection",
          type: "finance",
        },
      ],
    },
    {
      title: "Academic Reports",
      icon: BookOpen,
      color: "bg-primary/10 text-primary",
      reports: [
        {
          name: "Exam Results",
          description: "All exam results",
          type: "academic",
        },
        {
          name: "Class Performance",
          description: "Class-wise analysis",
          type: "academic",
        },
        {
          name: "Subject-wise Analysis",
          description: "Subject performance",
          type: "academic",
        },
        {
          name: "Top Performers",
          description: "Top scoring students",
          type: "academic",
        },
      ],
    },
    {
      title: "Staff Reports",
      icon: Calendar,
      color: "bg-warning/15 text-warning",
      reports: [
        {
          name: "Staff Directory",
          description: "All staff details",
          type: "staff",
        },
        {
          name: "Attendance Report",
          description: "Staff attendance",
          type: "staff",
        },
        { name: "Leave Report", description: "Leave summary", type: "staff" },
        {
          name: "Payroll Report",
          description: "Salary statistics",
          type: "staff",
        },
      ],
    },
  ];

  const recentReports = [
    {
      name: "Monthly Fee Collection - Jan 2026",
      type: "finance",
      date: "2026-01-20",
      size: "245 KB",
    },
    {
      name: "Class 10 Attendance Report",
      type: "student",
      date: "2026-01-19",
      size: "128 KB",
    },
    {
      name: "Exam Results - UT3",
      type: "academic",
      date: "2026-01-18",
      size: "512 KB",
    },
    {
      name: "Staff Salary Report - Dec 2025",
      type: "staff",
      date: "2026-01-15",
      size: "89 KB",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-foreground">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground">
          Generate reports and view analytics dashboard
        </p>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex gap-4">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-muted-foreground text-sm">
                  Total Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <span className="font-bold text-2xl">156</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-muted-foreground text-sm">
                  Generated This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-success" />
                  <span className="font-bold text-2xl">24</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-muted-foreground text-sm">
                  Reports Downloaded
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Download className="h-8 w-8 text-primary" />
                  <span className="font-bold text-2xl">89</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-muted-foreground text-sm">
                  Scheduled Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Calendar className="h-8 w-8 text-warning" />
                  <span className="font-bold text-2xl">5</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {reportCategories.map((category, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${category.color}`}
                    >
                      <category.icon className="h-4 w-4" />
                    </div>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.reports.map((report, rIdx) => (
                      <button
                        key={rIdx}
                        onClick={() =>
                          handleGenerateReport(report.name, report.type)
                        }
                        disabled={loading}
                        className="flex w-full items-center justify-between rounded-lg bg-muted p-3 text-left transition-colors hover:bg-muted disabled:opacity-50"
                      >
                        <div>
                          <p className="font-medium text-sm">{report.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {report.description}
                          </p>
                        </div>
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg bg-muted p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          report.type === "finance"
                            ? "bg-success/15"
                            : report.type === "student"
                              ? "bg-primary/10"
                              : report.type === "academic"
                                ? "bg-primary/10"
                                : "bg-warning/15"
                        }`}
                      >
                        <BarChart3
                          className={`h-5 w-5 ${
                            report.type === "finance"
                              ? "text-success"
                              : report.type === "student"
                                ? "text-primary"
                                : report.type === "academic"
                                  ? "text-primary"
                                  : "text-warning"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{report.name}</p>
                        <p className="text-muted-foreground text-xs">
                          Generated on {report.date} • {report.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
