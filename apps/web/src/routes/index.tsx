import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Calendar,
  DollarSign,
  GraduationCap,
  BookOpen,
  Bus,
  FileText,
  MessageSquare,
  BarChart3,
  Package,
  Settings,
  Home,
  LogIn,
  ArrowRight,
  CheckCircle,
  Shield,
  Smartphone,
  Mail,
  MessageCircle,
  User,
  Award,
  Building,
  Calculator,
  Car,
  Users as UsersIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const rolePortals = [
  {
    title: "Admin Portal",
    href: "/app",
    icon: Shield,
    color: "blue",
    description:
      "Complete system access - all modules, users, settings, and reports",
    features: [
      "All Modules",
      "User Management",
      "System Settings",
      "Full Reports",
    ],
  },
  {
    title: "Student Portal",
    href: "/app/student-portal",
    icon: GraduationCap,
    color: "green",
    description:
      "Personal dashboard for students - marks, attendance, homework",
    features: ["My Profile", "Attendance", "Exam Results", "Homework"],
  },
  {
    title: "Parent Portal",
    href: "/app/parent-portal",
    icon: UsersIcon,
    color: "purple",
    description:
      "Track child's progress - attendance, fees, exams, communication",
    features: ["Child Dashboard", "Fee Status", "Attendance", "Teacher Chat"],
  },
  {
    title: "Teacher Portal",
    href: "/app/teacher-portal",
    icon: BookOpen,
    color: "orange",
    description: "Class management - attendance, marks, assignments, timetable",
    features: ["My Classes", "Mark Attendance", "Upload Marks", "Assignments"],
  },
  {
    title: "Staff Portal",
    href: "/app/teachers",
    icon: GraduationCap,
    color: "red",
    description:
      "Administrative access - payroll, attendance, leave management",
    features: ["Payroll", "Attendance", "Leave Request", "Performance"],
  },
  {
    title: "Accountant Portal",
    href: "/app/fees",
    icon: Calculator,
    color: "teal",
    description: "Financial management - fees, expenses, salary, reports",
    features: ["Fee Collection", "Expenses", "Salary Processing", "Reports"],
  },
];

const allModules = [
  {
    name: "Student Management",
    icon: Users,
    modules: [
      "Admission",
      "Attendance",
      "Performance",
      "Discipline",
      "TC",
      "Alumni",
    ],
  },
  {
    name: "Staff Management",
    icon: GraduationCap,
    modules: [
      "Recruitment",
      "Payroll",
      "Attendance",
      "Leave",
      "Performance",
      "Training",
    ],
  },
  {
    name: "Academic Management",
    icon: BookOpen,
    modules: [
      "Classes",
      "Subjects",
      "Timetable",
      "Exams",
      "Marks",
      "Assignments",
    ],
  },
  {
    name: "Fee & Finance",
    icon: DollarSign,
    modules: [
      "Fee Structure",
      "Collection",
      "Online Payment",
      "Expenses",
      "Salary",
      "Budget",
    ],
  },
  {
    name: "Exam & Results",
    icon: Award,
    modules: [
      "Schedule",
      "Hall Allocation",
      "Marks Entry",
      "Results",
      "Report Cards",
      "Certificates",
    ],
  },
  {
    name: "Library",
    icon: BookOpen,
    modules: [
      "Books Catalog",
      "Issue/Return",
      "Fines",
      "Reservations",
      "Stock",
      "Library Card",
    ],
  },
  {
    name: "Transport",
    icon: Car,
    modules: [
      "Routes",
      "Vehicles",
      "Drivers",
      "GPS Tracking",
      "Parent App",
      "Fee Collection",
    ],
  },
  {
    name: "Communication",
    icon: MessageSquare,
    modules: [
      "SMS",
      "WhatsApp",
      "Email",
      "Push Notifications",
      "Circulars",
      "Templates",
    ],
  },
  {
    name: "Inventory",
    icon: Package,
    modules: [
      "Items",
      "Purchase",
      "Stock",
      "Consumption",
      "Suppliers",
      "Reports",
    ],
  },
  {
    name: "Front Office",
    icon: Building,
    modules: [
      "Visitor Management",
      "Enquiry",
      "Call Log",
      "Postal",
      "Gate Pass",
      "Complaints",
    ],
  },
  {
    name: "Reports & Analytics",
    icon: BarChart3,
    modules: [
      "Student Reports",
      "Staff Reports",
      "Financial Reports",
      "Academic Reports",
      "Custom Reports",
      "Dashboards",
    ],
  },
  {
    name: "Hostel",
    icon: Home,
    modules: [
      "Rooms",
      "Students",
      "Mess",
      "Complaints",
      "Inventory",
      "Notices",
    ],
  },
  {
    name: "Settings & Admin",
    icon: Settings,
    modules: ["School Profile", "Sessions", "Users", "Roles", "Backup", "Logs"],
  },
];

const communicationChannels = [
  {
    icon: Smartphone,
    name: "SMS",
    desc: "Twilio, MSG91, Fast2SMS",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: MessageCircle,
    name: "WhatsApp",
    desc: "Twilio WhatsApp Business",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Mail,
    name: "Email",
    desc: "SMTP, SendGrid, Mailgun",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: MessageSquare,
    name: "Push",
    desc: "Mobile & Web Push",
    color: "bg-orange-100 text-orange-600",
  },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <a href="/" className="text-xl font-bold text-blue-600">
                School MIS
              </a>
              <div className="hidden md:flex items-center gap-6">
                <a
                  href="#portals"
                  className="text-gray-600 hover:text-blue-600 text-sm font-medium"
                >
                  Portals
                </a>
                <a
                  href="#modules"
                  className="text-gray-600 hover:text-blue-600 text-sm font-medium"
                >
                  Modules
                </a>
                <a
                  href="#features"
                  className="text-gray-600 hover:text-blue-600 text-sm font-medium"
                >
                  Features
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="text-gray-600 hover:text-blue-600 font-medium text-sm"
              >
                Login
              </a>
              <a
                href="/app"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
              >
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Complete School Management System
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              All-in-one solution for managing students, staff, academics, fees,
              exams, transport, library, inventory, hostels, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/app"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
              >
                Go to Dashboard
              </a>
              <a
                href="#portals"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2"
              >
                Explore Portals
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Portals */}
      <section id="portals" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Role-Based Portals
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each user gets a personalized dashboard with relevant features and
              permissions. Login to access your specific portal.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rolePortals.map((portal) => (
              <Card
                key={portal.title}
                className="hover:shadow-lg transition-all duration-300 group"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-xl bg-${portal.color}-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <portal.icon
                      className={`w-6 h-6 text-${portal.color}-600`}
                    />
                  </div>
                  <CardTitle className="text-lg">{portal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {portal.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    {portal.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-500"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href={portal.href}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Access Portal <ArrowRight className="w-4 h-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-blue-600">16</div>
              <div className="text-sm text-gray-600 mt-1">Core Modules</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-green-600">90+</div>
              <div className="text-sm text-gray-600 mt-1">Features</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-purple-600">6</div>
              <div className="text-sm text-gray-600 mt-1">Portals</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-orange-600">4</div>
              <div className="text-sm text-gray-600 mt-1">
                Communication Channels
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Modules */}
      <section id="modules" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              All Modules
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete school management with 16 core modules and 90+ features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allModules.map((category) => (
              <Card
                key={category.name}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <category.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {category.name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {category.modules.map((module, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {module}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Communication Channels */}
      <section id="features" className="py-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Multi-Channel Communication
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Send notifications to parents and students via SMS, WhatsApp,
              Email, and Push.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {communicationChannels.map((channel) => (
              <Card key={channel.name} className="text-center">
                <CardContent className="pt-6">
                  <div
                    className={`w-16 h-16 rounded-full ${channel.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <channel.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {channel.name}
                  </h3>
                  <p className="text-sm text-gray-600">{channel.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose School MIS?
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Secure & Reliable
              </h3>
              <p className="text-sm text-gray-600">
                Role-based access control with secure authentication
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <Smartphone className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Mobile Friendly
              </h3>
              <p className="text-sm text-gray-600">
                Access from any device, anywhere, anytime
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Parent Portal
              </h3>
              <p className="text-sm text-gray-600">
                Keep parents informed with real-time updates
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Detailed Reports
              </h3>
              <p className="text-sm text-gray-600">
                Comprehensive analytics and export options
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">School MIS</h3>
              <p className="text-gray-400 text-sm">
                Complete school management solution for modern educational
                institutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a
                  href="/app"
                  className="text-gray-400 hover:text-white text-sm block"
                >
                  Dashboard
                </a>
                <a
                  href="/app/students"
                  className="text-gray-400 hover:text-white text-sm block"
                >
                  Students
                </a>
                <a
                  href="/app/fees"
                  className="text-gray-400 hover:text-white text-sm block"
                >
                  Fees
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Portals</h4>
              <div className="space-y-2">
                <a
                  href="/app/student-portal"
                  className="text-gray-400 hover:text-white text-sm block"
                >
                  Student Portal
                </a>
                <a
                  href="/app/parent-portal"
                  className="text-gray-400 hover:text-white text-sm block"
                >
                  Parent Portal
                </a>
                <a
                  href="/app/teacher-portal"
                  className="text-gray-400 hover:text-white text-sm block"
                >
                  Teacher Portal
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Getting Started</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Demo Credentials:</p>
                <p className="font-mono bg-gray-800 px-2 py-1 rounded">
                  admin@school.edu / admin123
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2026 School MIS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
