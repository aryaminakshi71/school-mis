import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import {
  Download,
  GraduationCap,
  Mail,
  Phone,
  Search,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/app/students/alumni")({
  component: AlumniPage,
});

const subFeatures = [
  { name: "All Students", href: "/app/students" },
  { name: "Admission", href: "/app/students/admission" },
  { name: "Attendance", href: "/app/students/attendance" },
  { name: "Performance", href: "/app/students/performance" },
  { name: "Discipline", href: "/app/students/discipline" },
  { name: "Transfer TC", href: "/app/students/transfer" },
  { name: "Alumni", href: "/app/students/alumni", active: true },
];

const alumniData = [
  {
    id: "ALM001",
    name: "Amit Kumar",
    batch: "2025",
    currentStatus: "Engineering Student",
    contact: "+91 98765 43210",
    email: "amit@email.com",
  },
  {
    id: "ALM002",
    name: "Priya Sharma",
    batch: "2025",
    currentStatus: "Medical Student",
    contact: "+91 98765 43211",
    email: "priya@email.com",
  },
  {
    id: "ALM003",
    name: "Rahul Patel",
    batch: "2024",
    currentStatus: "Software Engineer",
    contact: "+91 98765 43212",
    email: "rahul@email.com",
  },
  {
    id: "ALM004",
    name: "Sneha Gupta",
    batch: "2024",
    currentStatus: "Business Analyst",
    contact: "+91 98765 43213",
    email: "sneha@email.com",
  },
];

function AlumniPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl text-foreground">Alumni Network</h1>
          <p className="mt-1 text-muted-foreground">
            Connect with former students and track their achievements.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border">
            <Download className="mr-2 h-4 w-4" />
            Export Directory
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <GraduationCap className="mr-2 h-4 w-4" />
            Add Alumni
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
              Total Alumni
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">1,247</div>
            <p className="text-muted-foreground text-xs">Since inception</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Recent Graduates
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">156</div>
            <p className="text-muted-foreground text-xs">Batch 2025</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Higher Education
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">68%</div>
            <p className="text-muted-foreground text-xs">
              Pursuing further studies
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Employed
            </CardTitle>
            <Users className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-foreground">32%</div>
            <p className="text-muted-foreground text-xs">
              Working professionals
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-border border-b p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-md flex-1 items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alumni..."
                className="border-0 bg-transparent text-sm focus-visible:ring-0"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-border text-sm">
                Filter by Batch
              </Button>
              <Button variant="outline" className="border-border text-sm">
                Filter by Status
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Alumni ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Batch</th>
                <th className="px-6 py-3">Current Status</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alumniData.map((alumnus) => (
                <tr
                  key={alumnus.id}
                  className="border-b bg-card hover:bg-muted"
                >
                  <td className="px-6 py-4 font-medium text-foreground">
                    {alumnus.id}
                  </td>
                  <td className="px-6 py-4">{alumnus.name}</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-primary/10 text-primary">
                      {alumnus.batch}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">{alumnus.currentStatus}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Phone className="h-3 w-3" />
                      {alumnus.contact}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary"
                      >
                        View
                      </Button>
                    </div>
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
