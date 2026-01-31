/**
 * Staff Training & Development - Training programs, certifications, skill development
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  UserPlus,
  DollarSign,
  Calendar,
  Award,
  Search,
  Plus,
  BookOpen,
  GraduationCap,
  Certificate,
  Download,
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  Filter,
  Target,
  BarChart3,
  MoreVertical,
  Eye,
  Edit,
  ExternalLink,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/lib/search-utils";
import { exportToCSV } from "@/lib/export-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/app/teachers/training")({
  component: TrainingPage,
});

const subFeatures = [
  { name: "All Staff", href: "/app/teachers", icon: Users },
  { name: "Recruitment", href: "/app/teachers/recruitment", icon: UserPlus },
  { name: "Payroll", href: "/app/teachers/payroll", icon: DollarSign },
  { name: "Attendance", href: "/app/teachers/attendance", icon: Calendar },
  { name: "Leave", href: "/app/teachers/leave", icon: Clock },
  { name: "Performance", href: "/app/teachers/performance", icon: Award },
  { name: "Training", href: "/app/teachers/training", icon: Award, active: true },
];

// Mock data for training programs
const trainingPrograms = [
  {
    id: "TR-001",
    name: "Digital Teaching Methods",
    category: "Pedagogy",
    duration: "2 weeks",
    startDate: "2026-02-01",
    endDate: "2026-02-14",
    mode: "online",
    enrolled: 25,
    completed: 0,
    status: "upcoming",
  },
  {
    id: "TR-002",
    name: "Classroom Management",
    category: "Skills",
    duration: "1 week",
    startDate: "2026-01-20",
    endDate: "2026-01-26",
    mode: "offline",
    enrolled: 30,
    completed: 28,
    status: "active",
  },
  {
    id: "TR-003",
    name: "Student Psychology",
    category: "Psychology",
    duration: "3 days",
    startDate: "2025-12-15",
    endDate: "2025-12-17",
    mode: "online",
    enrolled: 40,
    completed: 38,
    status: "completed",
  },
  {
    id: "TR-004",
    name: "Leadership for HODs",
    category: "Leadership",
    duration: "1 week",
    startDate: "2026-03-01",
    endDate: "2026-03-07",
    mode: "hybrid",
    enrolled: 12,
    completed: 0,
    status: "upcoming",
  },
];

// Mock data for employee certifications
const certifications = [
  {
    id: "CERT-001",
    employee: "Ramesh Kumar",
    certification: "Digital Teaching Certificate",
    issuedBy: "EdTech Academy",
    issueDate: "2025-08-15",
    expiryDate: "2027-08-15",
    status: "valid",
  },
  {
    id: "CERT-002",
    employee: "Priya Sharma",
    certification: "STEM Teaching Specialist",
    issuedBy: "STEM Institute",
    issueDate: "2025-06-20",
    expiryDate: "2027-06-20",
    status: "valid",
  },
  {
    id: "CERT-003",
    employee: "Amit Patel",
    certification: "Educational Leadership",
    issuedBy: "Leadership Academy",
    issueDate: "2024-12-10",
    expiryDate: "2026-12-10",
    status: "expiring_soon",
  },
  {
    id: "CERT-004",
    employee: "Sneha Gupta",
    certification: "Advanced Mathematics Teaching",
    issuedBy: "Math Educators Assoc.",
    issueDate: "2025-09-01",
    expiryDate: "2027-09-01",
    status: "valid",
  },
];

// Mock data for skill matrix
const skillMatrix = [
  { skill: "Digital Teaching", employees: 45, proficiency: 78 },
  { skill: "Classroom Management", employees: 50, proficiency: 92 },
  { skill: "Curriculum Design", employees: 30, proficiency: 65 },
  { skill: "Assessment Techniques", employees: 40, proficiency: 85 },
  { skill: "Student Counseling", employees: 25, proficiency: 70 },
];

function TrainingPage() {
  const [activeTab, setActiveTab] = useState("programs");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredPrograms,
    hasActiveFilters,
    clearSearch,
  } = useSearch({
    data: trainingPrograms,
    searchFields: ["name", "id", "category"],
    searchQuery: "",
  });

  const filteredByCategory = selectedCategory === "all"
    ? filteredPrograms
    : filteredPrograms.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const activePrograms = filteredPrograms.filter((p) => p.status === "active").length;
  const completedTrainings = filteredPrograms.reduce((sum, p) => sum + p.completed, 0);
  const totalEnrolled = filteredPrograms.reduce((sum, p) => sum + p.enrolled, 0);

  const handleExport = () => {
    const exportData = filteredByCategory.map((p) => ({
      "Program ID": p.id,
      "Name": p.name,
      "Category": p.category,
      "Duration": p.duration,
      "Start Date": p.startDate,
      "End Date": p.endDate,
      "Mode": p.mode,
      "Enrolled": p.enrolled,
      "Completed": p.completed,
      "Status": p.status,
    }));

    exportToCSV(exportData, `training-programs-${new Date().toISOString().split("T")[0]}`);
    toast.success("Training data exported");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "upcoming":
        return <Badge variant="default">Upcoming</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = [
    { title: "Active Programs", value: activePrograms.toString(), change: "Currently running", icon: PlayCircle, color: "green" },
    { title: "Total Enrolled", value: totalEnrolled.toString(), change: "Across all programs", icon: Users, color: "blue" },
    { title: "Completed", value: completedTrainings.toString(), change: "Trainings finished", icon: CheckCircle, color: "purple" },
    { title: "Avg Completion", value: "87%", change: "Success rate", icon: TrendingUp, color: "yellow" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Training & Development</h1>
          <p className="text-muted-foreground">Manage training programs, track certifications, and develop staff skills.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Program
          </Button>
        </div>
      </div>

      {/* Sub-features Navigation */}
      <div className="border-b">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {subFeatures.map((feature) => (
            <a
              key={feature.name}
              href={feature.href}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                feature.active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <feature.icon className="h-4 w-4" />
              {feature.name}
            </a>
          ))}
        </nav>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("programs")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "programs"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Training Programs
        </button>
        <button
          onClick={() => setActiveTab("certifications")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "certifications"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Certifications
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "skills"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Skill Matrix
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {activeTab === "programs" && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[300px]"
                />
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs">
                    Clear
                  </Button>
                )}
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex h-10 w-[150px] items-center justify-between rounded-lg border border-input bg-white px-3 py-2 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="pedagogy">Pedagogy</option>
                <option value="skills">Skills</option>
                <option value="psychology">Psychology</option>
                <option value="leadership">Leadership</option>
              </select>
            </>
          )}
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === "programs" && "Training Programs"}
            {activeTab === "certifications" && "Staff Certifications"}
            {activeTab === "skills" && "Organization Skill Matrix"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === "programs" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Program ID</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Duration</th>
                    <th className="pb-3 font-medium">Start - End</th>
                    <th className="pb-3 font-medium">Mode</th>
                    <th className="pb-3 font-medium">Enrolled</th>
                    <th className="pb-3 font-medium">Completed</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredByCategory.map((program) => (
                    <tr key={program.id} className="border-b last:border-0">
                      <td className="py-3 text-sm">{program.id}</td>
                      <td className="py-3 font-medium">{program.name}</td>
                      <td className="py-3 text-sm">
                        <Badge variant="outline">{program.category}</Badge>
                      </td>
                      <td className="py-3 text-sm">{program.duration}</td>
                      <td className="py-3 text-sm">
                        {program.startDate} <br />
                        <span className="text-muted-foreground">to {program.endDate}</span>
                      </td>
                      <td className="py-3 text-sm">
                        <Badge variant={program.mode === "online" ? "success" : program.mode === "offline" ? "default" : "outline"}>
                          {program.mode}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm">{program.enrolled}</td>
                      <td className="py-3 text-sm font-medium">
                        {program.completed}/{program.enrolled}
                      </td>
                      <td className="py-3">{getStatusBadge(program.status)}</td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "certifications" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Cert ID</th>
                    <th className="pb-3 font-medium">Employee</th>
                    <th className="pb-3 font-medium">Certification</th>
                    <th className="pb-3 font-medium">Issued By</th>
                    <th className="pb-3 font-medium">Issue Date</th>
                    <th className="pb-3 font-medium">Expiry Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certifications.map((cert) => (
                    <tr key={cert.id} className="border-b last:border-0">
                      <td className="py-3 text-sm">{cert.id}</td>
                      <td className="py-3 font-medium">{cert.employee}</td>
                      <td className="py-3 text-sm">{cert.certification}</td>
                      <td className="py-3 text-sm">{cert.issuedBy}</td>
                      <td className="py-3 text-sm">{cert.issueDate}</td>
                      <td className="py-3 text-sm">{cert.expiryDate}</td>
                      <td className="py-3">
                        <Badge
                          variant={cert.status === "valid" ? "success" : cert.status === "expiring_soon" ? "warning" : "destructive"}
                        >
                          {cert.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Certificate className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Skill</th>
                    <th className="pb-3 font-medium">Employees with Skill</th>
                    <th className="pb-3 font-medium">Avg Proficiency</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {skillMatrix.map((skill) => (
                    <tr key={skill.skill} className="border-b last:border-0">
                      <td className="py-3 font-medium">{skill.skill}</td>
                      <td className="py-3 text-sm">{skill.employees} staff</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                          <span className="text-sm">{skill.proficiency}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Course Library</p>
              <p className="text-sm text-muted-foreground">Browse courses</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-green-100">
              <GraduationCap className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Learning Paths</p>
              <p className="text-sm text-muted-foreground">Structured programs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Certificate className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium">Issue Certificate</p>
              <p className="text-sm text-muted-foreground">Generate certs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">Skill Gaps</p>
              <p className="text-sm text-muted-foreground">Identify needs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
