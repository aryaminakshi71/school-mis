import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Building,
  Calendar,
  Car,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  DollarSign,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Plus,
  Search,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import * as React from "react";
import { useAuth } from "../lib/auth-context";
import { cn } from "../lib/utils";
import { ModeToggle } from "./theme-provider";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: "default" | "success" | "warning" | "error" | "info";
}

const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/app", icon: LayoutDashboard },
  {
    title: "Students",
    href: "/app/students",
    icon: Users,
    badge: "1,247",
    badgeColor: "info",
  },
  { title: "Staff", href: "/app/teachers", icon: GraduationCap, badge: "86" },
  { title: "Classes", href: "/app/classes", icon: Building, badge: "42" },
  {
    title: "Attendance",
    href: "/app/attendance",
    icon: Calendar,
    badge: "94.2%",
    badgeColor: "success",
  },
  { title: "Exams", href: "/app/exams", icon: Award, badge: "12" },
  {
    title: "Fees",
    href: "/app/fees",
    icon: DollarSign,
    badge: "₹12.5L",
    badgeColor: "success",
  },
  { title: "Library", href: "/app/library", icon: BookOpen, badge: "15.4K" },
  { title: "Transport", href: "/app/transport", icon: Car, badge: "12" },
  { title: "Inventory", href: "/app/inventory", icon: Package },
  { title: "Reports", href: "/app/reports", icon: BarChart3 },
  {
    title: "Notifications",
    href: "/app/notifications",
    icon: MessageSquare,
    badge: "3",
    badgeColor: "error",
  },
];

const secondaryNavItems: NavItem[] = [
  { title: "Parent Portal", href: "/app/parent-portal", icon: Users },
  { title: "Student Portal", href: "/app/student-portal", icon: GraduationCap },
  { title: "Teacher Portal", href: "/app/teacher-portal", icon: BookOpen },
  { title: "Staff Portal", href: "/app/staff-portal", icon: ClipboardList },
  { title: "Settings", href: "/app/settings", icon: Settings },
];

function getBadgeColorClass(color?: string) {
  switch (color) {
    case "success":
      return "bg-success-light text-success";
    case "warning":
      return "bg-warning-light text-warning";
    case "error":
      return "bg-error-light text-error";
    case "info":
      return "bg-info-light text-info";
    default:
      return "bg-muted text-muted-foreground";
  }
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  const getBreadcrumbs = (): Array<{
    title: string;
    href: string;
    icon?: React.ElementType;
  }> => {
    const paths = currentPath.split("/").filter(Boolean);
    if (paths.length === 0) return [];

    const breadcrumbs: Array<{
      title: string;
      href: string;
      icon?: React.ElementType;
    }> = [{ title: "Home", href: "/app", icon: Home }];

    const moduleMap: Record<
      string,
      { title: string; icon?: React.ElementType }
    > = {
      students: { title: "Students", icon: Users },
      teachers: { title: "Staff", icon: GraduationCap },
      classes: { title: "Classes", icon: Building },
      attendance: { title: "Attendance", icon: Calendar },
      exams: { title: "Exams", icon: Award },
      fees: { title: "Fees", icon: DollarSign },
      library: { title: "Library", icon: BookOpen },
      transport: { title: "Transport", icon: Car },
      inventory: { title: "Inventory", icon: Package },
      reports: { title: "Reports", icon: BarChart3 },
      notifications: { title: "Notifications", icon: MessageSquare },
      "parent-portal": { title: "Parent Portal", icon: Users },
      "student-portal": { title: "Student Portal", icon: GraduationCap },
      "teacher-portal": { title: "Teacher Portal", icon: BookOpen },
      "staff-portal": { title: "Staff Portal", icon: ClipboardList },
      profile: { title: "Profile", icon: User },
      settings: { title: "Settings", icon: Settings },
    };

    let buildPath = "/app";
    paths.forEach((path) => {
      buildPath += `/${path}`;
      if (path in moduleMap) {
        breadcrumbs.push({
          title: moduleMap[path].title,
          href: buildPath,
          icon: moduleMap[path].icon,
        });
      } else if (path !== "app") {
        breadcrumbs.push({
          title:
            path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
          href: buildPath,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "??";

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[16rem] flex-col border-sidebar-border border-r bg-sidebar transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-sidebar-border border-b px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-lg text-primary-foreground">
            SM
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground">SchoolAI</span>
            <span className="text-muted-foreground text-xs">
              Management System
            </span>
          </div>
          <button
            className="ml-auto text-muted-foreground hover:text-foreground lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="mb-2 px-3">
            <span className="px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Main Menu
            </span>
          </div>
          <ul className="space-y-1 px-3">
            {mainNavItems.map((item) => {
              const isActive =
                currentPath === item.href ||
                currentPath.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-sm transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-hover",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-semibold text-xs",
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : getBadgeColorClass(item.badgeColor),
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-4 border-sidebar-border border-t" />

          <div className="mb-2 px-3">
            <span className="px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Portals & More
            </span>
          </div>
          <ul className="space-y-1 px-3">
            {secondaryNavItems.map((item) => {
              const isActive =
                currentPath === item.href ||
                currentPath.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-sm transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-hover",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="border-sidebar-border border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-hover">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="truncate font-medium text-foreground text-sm">
                    {user?.name || "User"}
                  </p>
                  <p className="text-muted-foreground text-xs capitalize">
                    {user?.role || "Admin"}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Back to Home
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/app/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/app/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  navigate({ to: "/login" });
                }}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-[16rem]">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 border-border border-b bg-background/80 backdrop-blur-lg">
          <div className="flex h-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button
                className="rounded-lg p-2 transition-colors hover:bg-accent lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Breadcrumbs */}
              <nav className="hidden items-center gap-1 text-sm md:flex">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    {index > 0 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="flex items-center gap-2 font-medium text-foreground">
                        {crumb.icon && <crumb.icon className="h-4 w-4" />}
                        {crumb.title}
                      </span>
                    ) : (
                      <a
                        href={crumb.href}
                        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {crumb.icon && <crumb.icon className="h-4 w-4" />}
                        {crumb.title}
                      </a>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden w-64 cursor-pointer items-center gap-2 rounded-lg border border-input bg-muted/50 px-3 py-2 transition-colors hover:bg-muted md:flex">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Search...</span>
                <kbd className="ml-auto rounded border bg-background px-1.5 py-0.5 text-muted-foreground text-xs">
                  ⌘K
                </kbd>
              </div>

              {/* Quick Add */}
              <Button size="sm" className="hidden sm:flex">
                <Plus className="mr-1 h-4 w-4" />
                Quick Add
              </Button>

              {/* Dark Mode Toggle */}
              <ModeToggle />

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative rounded-lg p-2 transition-colors hover:bg-accent">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Notifications
                    <Button variant="ghost" size="sm" className="text-xs">
                      Mark all as read
                    </Button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-96 overflow-y-auto">
                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="font-medium">
                          Fee payment received
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        ₹45,500 from 23 students
                      </p>
                      <span className="text-muted-foreground text-xs">
                        2 hours ago
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-info" />
                        <span className="font-medium">New admission</span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Aryan Sharma - Class 9-A
                      </p>
                      <span className="text-muted-foreground text-xs">
                        10 min ago
                      </span>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-primary">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Avatar (mobile) */}
              <button className="p-1 lg:hidden">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
