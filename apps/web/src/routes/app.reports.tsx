import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  Calendar,
  Download,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import { exportToCSV } from "../lib/export-utils";
import { toast } from "sonner";
import { useState } from "react";

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
            "Name": `${s.firstName} ${s.lastName}`,
            "Class": s.className,
            "Roll No": s.rollNumber,
            "Father Name": s.fatherName,
            "Phone": s.phone,
            "Status": s.status
          }));
          break;

        case "Fee Collection":
          const fees = await api.fees.list();
          data = fees.map((f: any) => ({
            "Receipt ID": f.id,
            "Student": f.studentName,
            "Class": f.className,
            "Amount": f.amount,
            "Date": new Date(f.createdAt).toLocaleDateString(),
            "Status": f.status
          }));
          break;

        case "Staff Directory":
          const teachers = await api.teachers.list();
          data = teachers.map((t: any) => ({
            "ID": t.employeeId,
            "Name": `${t.firstName} ${t.lastName}`,
            "Subject": t.subject,
            "Qualification": t.qualification,
            "Phone": t.phone,
            "Email": t.email
          }));
          break;

        default:
          toast.info("This report type is coming soon!");
          setLoading(false);
          return;
      }

      if (data.length > 0) {
        exportToCSV(data, `${filename}-${new Date().toISOString().split("T")[0]}`);
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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
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
      color: "bg-blue-100 text-blue-600",
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
      color: "bg-green-100 text-green-600",
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
      color: "bg-purple-100 text-purple-600",
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
      color: "bg-orange-100 text-orange-600",
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
        <h1 className="text-2xl font-bold text-gray-900">
          Reports & Analytics
        </h1>
        <p className="text-gray-600">
          Generate and download various school reports
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Date Range
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold">156</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Generated This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold">24</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Reports Downloaded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Download className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold">89</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Scheduled Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold">5</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {reportCategories.map((category, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color}`}
                >
                  <category.icon className="w-4 h-4" />
                </div>
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.reports.map((report, rIdx) => (
                  <button
                    key={rIdx}
                    onClick={() => handleGenerateReport(report.name, report.type)}
                    disabled={loading}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left disabled:opacity-50"
                  >
                    <div>
                      <p className="font-medium text-sm">{report.name}</p>
                      <p className="text-xs text-gray-500">
                        {report.description}
                      </p>
                    </div>
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${report.type === "finance"
                      ? "bg-green-100"
                      : report.type === "student"
                        ? "bg-blue-100"
                        : report.type === "academic"
                          ? "bg-purple-100"
                          : "bg-orange-100"
                      }`}
                  >
                    <BarChart3
                      className={`w-5 h-5 ${report.type === "finance"
                        ? "text-green-600"
                        : report.type === "student"
                          ? "text-blue-600"
                          : report.type === "academic"
                            ? "text-purple-600"
                            : "text-orange-600"
                        }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{report.name}</p>
                    <p className="text-xs text-gray-500">
                      Generated on {report.date} • {report.size}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
