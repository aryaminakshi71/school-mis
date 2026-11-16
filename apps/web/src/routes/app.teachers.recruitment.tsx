/**
 * Staff Recruitment Management - Job Postings, Applications, Shortlisting
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { exportToCSV } from "@/lib/export-utils";
import { useSearch } from "@/lib/search-utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Plus,
  Search,
  Trash,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/teachers/recruitment")({
  component: RecruitmentPage,
});

const subFeatures = [
  { name: "All Staff", href: "/app/teachers", icon: Users },
  {
    name: "Recruitment",
    href: "/app/teachers/recruitment",
    icon: UserPlus,
    active: true,
  },
  { name: "Payroll", href: "/app/teachers/payroll", icon: DollarSign },
  { name: "Attendance", href: "/app/teachers/attendance", icon: Calendar },
  { name: "Leave", href: "/app/teachers/leave", icon: Clock },
  { name: "Performance", href: "/app/teachers/performance", icon: Award },
  { name: "Training", href: "/app/teachers/training", icon: Award },
];

function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["teachers", "recruitment"],
    queryFn: api.teachers.getRecruitment,
  });

  const jobPostings = data?.jobPostings ?? [];
  const applications = data?.applications ?? [];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredJobs,
    hasActiveFilters,
    clearSearch,
  } = useSearch({
    data: jobPostings,
    searchFields: ["title", "department", "id"],
    searchQuery: "",
  });

  const filteredApplications =
    selectedStatus === "all"
      ? applications
      : applications.filter((a) => a.status === selectedStatus);

  const handleExport = () => {
    const exportData: Record<string, unknown>[] =
      activeTab === "jobs"
        ? filteredJobs.map((j) => ({
            "Job ID": j.id,
            Title: j.title,
            Department: j.department,
            Positions: j.positions,
            Type: j.type,
            Salary: j.salary,
            Posted: j.postedDate,
            Closing: j.closingDate,
            Status: j.status,
            Applications: j.applications,
          }))
        : filteredApplications.map((a) => ({
            "Application ID": a.id,
            Candidate: a.candidate,
            "Job Title": a.jobTitle,
            Experience: a.experience,
            Qualification: a.qualification,
            Applied: a.appliedDate,
            Status: a.status,
          }));

    exportToCSV(
      exportData,
      `recruitment-${activeTab}-${new Date().toISOString().split("T")[0]}`,
    );
    toast.success("Data exported successfully");
  };

  const stats = [
    {
      title: "Active Jobs",
      value: "3",
      change: "+1 this month",
      icon: Briefcase,
      color: "blue",
    },
    {
      title: "Total Applications",
      value: "143",
      change: "+28 this week",
      icon: FileText,
      color: "green",
    },
    {
      title: "Shortlisted",
      value: "22",
      change: "+5 this week",
      icon: CheckCircle,
      color: "yellow",
    },
    {
      title: "Positions Filled",
      value: "1",
      change: "This month",
      icon: Users,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Staff Recruitment
          </h1>
          <p className="text-muted-foreground">
            Manage job postings, applications, and hiring process.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
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
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
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
              <CardTitle className="font-medium text-sm">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 bg-${stat.color}-100`}>
                <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stat.value}</div>
              <p className="text-muted-foreground text-xs">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "jobs"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Job Postings
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`border-b-2 px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "applications"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Applications
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {activeTab === "jobs" ? (
            <div className="relative">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[300px] pl-9"
              />
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="-translate-y-1/2 absolute top-1/2 right-2 h-6 px-2 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
          ) : (
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex h-10 w-[180px] items-center justify-between rounded-lg border border-input bg-card px-3 py-2 text-sm"
            >
              <option value="all">All Applications</option>
              <option value="new">New</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
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
            {activeTab === "jobs" ? "Job Postings" : "Applications"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === "jobs" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-muted-foreground text-sm">
                    <th className="pb-3 font-medium">Job ID</th>
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Department</th>
                    <th className="pb-3 font-medium">Positions</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Salary Range</th>
                    <th className="pb-3 font-medium">Posted Date</th>
                    <th className="pb-3 font-medium">Closing Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Applications</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="border-b last:border-0">
                      <td className="py-3 text-sm">{job.id}</td>
                      <td className="py-3 font-medium">{job.title}</td>
                      <td className="py-3 text-sm">{job.department}</td>
                      <td className="py-3 text-sm">{job.positions}</td>
                      <td className="py-3 text-sm">{job.type}</td>
                      <td className="py-3 font-medium text-sm">{job.salary}</td>
                      <td className="py-3 text-sm">{job.postedDate}</td>
                      <td className="py-3 text-sm">{job.closingDate}</td>
                      <td className="py-3">
                        <Badge
                          variant={
                            job.status === "active" ? "success" : "outline"
                          }
                        >
                          {job.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm">
                        <span className="font-medium">{job.applications}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          ({job.shortlisted} shortlisted)
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-muted-foreground text-sm">
                    <th className="pb-3 font-medium">Application ID</th>
                    <th className="pb-3 font-medium">Candidate</th>
                    <th className="pb-3 font-medium">Job Title</th>
                    <th className="pb-3 font-medium">Experience</th>
                    <th className="pb-3 font-medium">Qualification</th>
                    <th className="pb-3 font-medium">Applied Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="border-b last:border-0">
                      <td className="py-3 text-sm">{app.id}</td>
                      <td className="py-3 font-medium">{app.candidate}</td>
                      <td className="py-3 text-sm">{app.jobTitle}</td>
                      <td className="py-3 text-sm">{app.experience}</td>
                      <td className="py-3 text-sm">{app.qualification}</td>
                      <td className="py-3 text-sm">{app.appliedDate}</td>
                      <td className="py-3">
                        <Badge
                          variant={
                            app.status === "shortlisted"
                              ? "success"
                              : app.status === "under_review"
                                ? "default"
                                : app.status === "new"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {app.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
