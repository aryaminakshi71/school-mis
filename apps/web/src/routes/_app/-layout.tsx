/**
 * App Layout - Consistent UI with Sidebar & Breadcrumbs
 */

import { Outlet, useLocation, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  User,
  Settings,
  ChevronRight,
  LogOut,
  Search,
  Menu,
  X,
  Home,
  Plus,
  Package,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const getBreadcrumbs = (pathname: string) => {
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ label: "Home", href: "/app", icon: Home }];

  if (paths.length === 0) return breadcrumbs;

  const moduleMap: Record<string, { label: string; icon: any }> = {
    students: { label: "Students", icon: Users },
    teachers: { label: "Staff", icon: GraduationCap },
    classes: { label: "Classes", icon: BookOpen },
    attendance: { label: "Attendance", icon: Calendar },
    exams: { label: "Exams", icon: FileText },
    fees: { label: "Fees", icon: DollarSign },
    library: { label: "Library", icon: BookOpen },
    transport: { label: "Transport", icon: Bus },
    notifications: { label: "Notifications", icon: MessageSquare },
    inventory: { label: "Inventory", icon: Package },
    reports: { label: "Reports", icon: BarChart3 },
    "parent-portal": { label: "Parent Portal", icon: Users },
    "student-portal": { label: "Student Portal", icon: GraduationCap },
    "teacher-portal": { label: "Teacher Portal", icon: Users },
    profile: { label: "Profile", icon: User },
    settings: { label: "Settings", icon: Settings },
  };

  let currentPath = "/app";
  paths.forEach((path, index) => {
    currentPath += `/${path}`;
    if (path in moduleMap) {
      breadcrumbs.push({
        label: moduleMap[path].label,
        href: currentPath,
        icon: moduleMap[path].icon,
      });
    } else if (index === paths.length - 1) {
      breadcrumbs.push({
        label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
        href: currentPath,
      });
    }
  });

  return breadcrumbs;
};

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/app" },
  { icon: Users, label: "Students", href: "/app/students" },
  { icon: GraduationCap, label: "Staff", href: "/app/teachers" },
  { icon: BookOpen, label: "Classes", href: "/app/classes" },
  { icon: Calendar, label: "Attendance", href: "/app/attendance" },
  { icon: FileText, label: "Exams", href: "/app/exams" },
  { icon: DollarSign, label: "Fees", href: "/app/fees" },
  { icon: BookOpen, label: "Library", href: "/app/library" },
  { icon: Bus, label: "Transport", href: "/app/transport" },
  { icon: Package, label: "Inventory", href: "/app/inventory" },
  { icon: BarChart3, label: "Reports", href: "/app/reports" },
];

const secondaryNavItems: NavItem[] = [
  {
    icon: MessageSquare,
    label: "Notifications",
    href: "/app/notifications",
    badge: "3",
  },
  { icon: Users, label: "Parent Portal", href: "/app/parent-portal" },
  { icon: GraduationCap, label: "Student Portal", href: "/app/student-portal" },
  { icon: Users, label: "Teacher Portal", href: "/app/teacher-portal" },
  { icon: User, label: "Profile", href: "/app/profile" },
  { icon: Settings, label: "Settings", href: "/app/settings" },
];

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <a
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-gray-100 hover:text-gray-900",
      )}
    >
      <item.icon className="h-4 w-4" />
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
    </a>
  );
}

export default function AppLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const breadcrumbs = getBreadcrumbs(location.pathname);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r shadow-sm transform transition-transform lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center border-b px-4 bg-blue-600 text-white">
          <a
            href="/"
            className="flex items-center gap-2 font-bold hover:opacity-90 transition-opacity"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
              <span className="text-sm font-bold">SM</span>
            </div>
            <span className="hidden sm:inline">School MIS</span>
          </a>
          <a
            href="/"
            className="ml-auto text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors hidden sm:flex items-center gap-1"
          >
            <Home className="w-3 h-3" />
            Back to Home
          </a>
          <button
            className="ml-auto lg:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="grid gap-1 px-2">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={
                  currentPath === item.href ||
                  currentPath.startsWith(item.href + "/")
                }
              />
            ))}
          </nav>

          <div className="my-4 border-t" />

          <nav className="grid gap-1 px-2">
            {secondaryNavItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={
                  currentPath === item.href ||
                  currentPath.startsWith(item.href + "/")
                }
              />
            ))}
          </nav>
        </div>

        <div className="border-t p-4 bg-gray-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 hover:bg-white"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">
                    {user?.name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.role || "Admin"}
                  </span>
                </div>
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <a href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/app/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/app/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/login" })}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:px-6 shadow-sm">
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hidden sm:flex items-center gap-1"
              title="Go back"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              <span className="text-sm">Back</span>
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-gray-900">
                    {crumb.label}
                  </span>
                ) : (
                  <a
                    href={crumb.href}
                    className="text-gray-500 hover:text-gray-900 flex items-center gap-1"
                  >
                    {crumb.icon && <crumb.icon className="h-3 w-3" />}
                    {crumb.label}
                  </a>
                )}
              </div>
            ))}
          </nav>

          <div className="flex-1" />

          <button
            className={cn(
              "hidden md:flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900",
              "cursor-pointer px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 hover:bg-white",
            )}
          >
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="pointer-events-none ml-1 hidden h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          <Button
            size="sm"
            className="hidden sm:flex bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add New
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6 bg-gray-50">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
