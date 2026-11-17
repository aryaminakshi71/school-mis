import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Building,
  Calculator,
  Car,
  CheckCircle,
  DollarSign,
  GraduationCap,
  Home,
  LayoutDashboard,
  Mail,
  MessageCircle,
  MessageSquare,
  Package,
  Settings,
  Shield,
  Smartphone,
  Users,
  Users as UsersIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export const Route = createFileRoute("/")({
  head: () => {
    const baseUrl =
      import.meta.env.VITE_PUBLIC_SITE_URL || "http://localhost:3000";
    const canonical = baseUrl.replace(/\/$/, "") + "/";
    return {
      meta: [
        { title: "SchoolAI - School Operating System" },
        {
          name: "description",
          content:
            "All-in-one school management system for students, staff, academics, finance, and operations.",
        },
        { name: "robots", content: "index, follow" },
        {
          property: "og:title",
          content: "SchoolAI - School Operating System",
        },
        {
          property: "og:description",
          content:
            "All-in-one school management system for students, staff, academics, finance, and operations.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "SchoolAI - School Operating System",
        },
        {
          name: "twitter:description",
          content:
            "All-in-one school management system for students, staff, academics, finance, and operations.",
        },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },

  component: HomePage,
});

const rolePortals = [
  {
    title: "Admin Dashboard",
    href: "/app",
    icon: LayoutDashboard,
    color: "blue",
    description:
      "Complete system access - all modules, users, settings, and reports. Main control center for administrators.",
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
    color: "bg-primary/10 text-primary",
  },
  {
    icon: MessageCircle,
    name: "WhatsApp",
    desc: "Twilio WhatsApp Business",
    color: "bg-success/15 text-success",
  },
  {
    icon: Mail,
    name: "Email",
    desc: "SMTP, SendGrid, Mailgun",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: MessageSquare,
    name: "Push",
    desc: "Mobile & Web Push",
    color: "bg-warning/15 text-warning",
  },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-muted">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="font-bold text-primary text-xl transition-colors hover:text-primary-dark"
              >
                SchoolAI
              </Link>
              <div className="hidden items-center gap-6 md:flex">
                <a
                  href="#portals"
                  className="font-medium text-muted-foreground text-sm hover:text-primary"
                >
                  Portals
                </a>
                <a
                  href="#modules"
                  className="font-medium text-muted-foreground text-sm hover:text-primary"
                >
                  Modules
                </a>
                <a
                  href="#features"
                  className="font-medium text-muted-foreground text-sm hover:text-primary"
                >
                  Features
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="font-medium text-muted-foreground text-sm transition-colors hover:text-primary"
              >
                Login
              </Link>
              <Link
                to="/app"
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground text-sm shadow-md transition-all hover:bg-primary-dark hover:shadow-lg"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 font-bold text-4xl text-foreground md:text-5xl">
              Complete School Management System
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-muted-foreground text-xl">
              All-in-one solution for managing students, staff, academics, fees,
              exams, transport, library, inventory, hostels, and more.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/app"
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary-dark hover:shadow-xl"
              >
                <LayoutDashboard className="h-5 w-5" />
                Go to Admin Dashboard
              </Link>
              <a
                href="#portals"
                className="flex items-center justify-center gap-2 rounded-lg border-2 border-border px-6 py-3 font-medium text-foreground transition-all hover:border-primary-light hover:bg-muted"
              >
                Explore Portals
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Portals */}
      <section id="portals" className="bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl text-foreground">
              Role-Based Portals
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Each user gets a personalized dashboard with relevant features and
              permissions. Login to access your specific portal.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rolePortals.map((portal) => (
              <Card
                key={portal.title}
                className="group transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader>
                  <div
                    className={`h-12 w-12 rounded-xl bg-${portal.color}-100 mb-3 flex items-center justify-center transition-transform group-hover:scale-110`}
                  >
                    <portal.icon
                      className={`h-6 w-6 text-${portal.color}-600`}
                    />
                  </div>
                  <CardTitle className="text-lg">{portal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground text-sm">
                    {portal.description}
                  </p>
                  <div className="mb-4 space-y-2">
                    {portal.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-muted-foreground text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to={portal.href}
                    className="group flex items-center gap-1.5 font-semibold text-primary text-sm transition-colors hover:text-primary-dark"
                  >
                    Access Portal{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="border-b py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="p-4 text-center">
              <div className="font-bold text-3xl text-primary">16</div>
              <div className="mt-1 text-muted-foreground text-sm">
                Core Modules
              </div>
            </div>
            <div className="p-4 text-center">
              <div className="font-bold text-3xl text-success">90+</div>
              <div className="mt-1 text-muted-foreground text-sm">Features</div>
            </div>
            <div className="p-4 text-center">
              <div className="font-bold text-3xl text-primary">6</div>
              <div className="mt-1 text-muted-foreground text-sm">Portals</div>
            </div>
            <div className="p-4 text-center">
              <div className="font-bold text-3xl text-warning">4</div>
              <div className="mt-1 text-muted-foreground text-sm">
                Communication Channels
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Modules */}
      <section id="modules" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl text-foreground">
              All Modules
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Complete school management with 16 core modules and 90+ features.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allModules.map((category) => (
              <Card
                key={category.name}
                className="transition-shadow hover:shadow-md"
              >
                <CardContent className="pt-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light/20">
                      <category.icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {category.name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {category.modules.map((module, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-muted px-2 py-0.5 text-muted-foreground text-xs"
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
      <section id="features" className="border-t bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl text-foreground">
              Multi-Channel Communication
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Send notifications to parents and students via SMS, WhatsApp,
              Email, and Push.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-4">
            {communicationChannels.map((channel) => (
              <Card key={channel.name} className="text-center">
                <CardContent className="pt-6">
                  <div
                    className={`h-16 w-16 rounded-full ${channel.color} mx-auto mb-4 flex items-center justify-center`}
                  >
                    <channel.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground text-lg">
                    {channel.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {channel.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl text-foreground">
              Why Choose SchoolAI?
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="p-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light/20">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                Secure & Reliable
              </h3>
              <p className="text-muted-foreground text-sm">
                Role-based access control with secure authentication
              </p>
            </div>
            <div className="p-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/15">
                <Smartphone className="h-6 w-6 text-success" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                Mobile Friendly
              </h3>
              <p className="text-muted-foreground text-sm">
                Access from any device, anywhere, anytime
              </p>
            </div>
            <div className="p-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                Parent Portal
              </h3>
              <p className="text-muted-foreground text-sm">
                Keep parents informed with real-time updates
              </p>
            </div>
            <div className="p-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-warning/15">
                <BarChart3 className="h-6 w-6 text-warning" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                Detailed Reports
              </h3>
              <p className="text-muted-foreground text-sm">
                Comprehensive analytics and export options
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-12 text-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-bold text-lg">SchoolAI</h3>
              <p className="text-muted-foreground text-sm">
                Complete school management solution for modern educational
                institutions.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Quick Links</h4>
              <div className="space-y-2">
                <a
                  href="/app"
                  className="block text-muted-foreground text-sm hover:text-background"
                >
                  Dashboard
                </a>
                <a
                  href="/app/students"
                  className="block text-muted-foreground text-sm hover:text-background"
                >
                  Students
                </a>
                <a
                  href="/app/fees"
                  className="block text-muted-foreground text-sm hover:text-background"
                >
                  Fees
                </a>
              </div>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Portals</h4>
              <div className="space-y-2">
                <a
                  href="/app/student-portal"
                  className="block text-muted-foreground text-sm hover:text-background"
                >
                  Student Portal
                </a>
                <a
                  href="/app/parent-portal"
                  className="block text-muted-foreground text-sm hover:text-background"
                >
                  Parent Portal
                </a>
                <a
                  href="/app/teacher-portal"
                  className="block text-muted-foreground text-sm hover:text-background"
                >
                  Teacher Portal
                </a>
              </div>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Getting Started</h4>
              <div className="space-y-2 text-muted-foreground text-sm">
                <p>Demo Credentials:</p>
                <p className="rounded bg-foreground/90 px-2 py-1 font-mono">
                  admin@school.edu / admin123
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-border border-t pt-8 text-center text-muted-foreground text-sm">
            © 2026 SchoolAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
