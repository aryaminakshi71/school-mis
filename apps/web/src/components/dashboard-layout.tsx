import * as React from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  DollarSign,
  Bus,
  FileText,
  MessageSquare,
  Package,
  BarChart3,
  Settings,
  Home,
  ChevronRight,
  LogOut,
  Search,
  Menu,
  X,
  Bell,
  Plus,
  User,
  Moon,
  Sun,
  Building,
  ClipboardList,
  Calculator,
  Award,
  Gift,
  Megaphone,
  Car,
  MapPinHouse,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

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

  const getBreadcrumbs = () => {
    const paths = currentPath.split("/").filter(Boolean);
    if (paths.length === 0) return [];

    const breadcrumbs = [{ title: "Home", href: "/app", icon: Home }];

    const moduleMap: Record<
      string,
      { title: string; icon: React.ElementType }
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

    let currentPath = "/app";
    paths.forEach((path) => {
      currentPath += `/${path}`;
      if (path in moduleMap) {
        breadcrumbs.push({
          title: moduleMap[path].title,
          href: currentPath,
          icon: moduleMap[path].icon,
        });
      } else if (path !== "app") {
        breadcrumbs.push({
          title:
            path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
          href: currentPath,
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
          "fixed inset-y-0 left-0 z-50 flex flex-col w-[16rem] bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 h-16 px-4 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-lg">
            SM
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground">School MIS</span>
            <span className="text-xs text-muted-foreground">
              Management System
            </span>
          </div>
          <button
            className="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 mb-2">
            <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-hover",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-semibold",
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

          <div className="my-4 border-t border-sidebar-border" />

          <div className="px-3 mb-2">
            <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-hover",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-hover transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role || "Admin"}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Back to Home
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/app/profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/app/settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
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
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-[16rem]">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumbs */}
              <nav className="hidden md:flex items-center gap-1 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    {index > 0 && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="font-medium text-foreground flex items-center gap-2">
                        {crumb.icon && <crumb.icon className="w-4 h-4" />}
                        {crumb.title}
                      </span>
                    ) : (
                      <a
                        href={crumb.href}
                        className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                      >
                        {crumb.icon && <crumb.icon className="w-4 h-4" />}
                        {crumb.title}
                      </a>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-input hover:bg-muted transition-colors cursor-pointer w-64">
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Search...</span>
                <kbd className="ml-auto text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded border">
                  ⌘K
                </kbd>
              </div>

              {/* Quick Add */}
              <Button size="sm" className="hidden sm:flex">
                <Plus className="w-4 h-4 mr-1" />
                Quick Add
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
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
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="font-medium">
                          Fee payment received
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ₹45,500 from 23 students
                      </p>
                      <span className="text-xs text-muted-foreground">
                        2 hours ago
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-info" />
                        <span className="font-medium">New admission</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Aryan Sharma - Class 9-A
                      </p>
                      <span className="text-xs text-muted-foreground">
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
              <button className="lg:hidden p-1">
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
