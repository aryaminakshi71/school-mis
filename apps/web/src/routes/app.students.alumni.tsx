import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Users, Search, Download, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  { id: "ALM001", name: "Amit Kumar", batch: "2025", currentStatus: "Engineering Student", contact: "+91 98765 43210", email: "amit@email.com" },
  { id: "ALM002", name: "Priya Sharma", batch: "2025", currentStatus: "Medical Student", contact: "+91 98765 43211", email: "priya@email.com" },
  { id: "ALM003", name: "Rahul Patel", batch: "2024", currentStatus: "Software Engineer", contact: "+91 98765 43212", email: "rahul@email.com" },
  { id: "ALM004", name: "Sneha Gupta", batch: "2024", currentStatus: "Business Analyst", contact: "+91 98765 43213", email: "sneha@email.com" },
];

function AlumniPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alumni Network</h1>
          <p className="text-gray-500 mt-1">
            Connect with former students and track their achievements.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-300">
            <Download className="mr-2 h-4 w-4" />
            Export Directory
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
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
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              feature.active
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {feature.name}
          </a>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Alumni
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <p className="text-xs text-gray-500">Since inception</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Recent Graduates
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">156</div>
            <p className="text-xs text-gray-500">Batch 2025</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Higher Education
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">68%</div>
            <p className="text-xs text-gray-500">Pursuing further studies</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Employed
            </CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">32%</div>
            <p className="text-xs text-gray-500">Working professionals</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg flex-1 max-w-md">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search alumni..."
                className="border-0 bg-transparent focus-visible:ring-0 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-300 text-sm">
                Filter by Batch
              </Button>
              <Button variant="outline" className="border-gray-300 text-sm">
                Filter by Status
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
                <tr key={alumnus.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{alumnus.id}</td>
                  <td className="px-6 py-4">{alumnus.name}</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-blue-100 text-blue-700">{alumnus.batch}</Badge>
                  </td>
                  <td className="px-6 py-4">{alumnus.currentStatus}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      {alumnus.contact}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-blue-600">
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
