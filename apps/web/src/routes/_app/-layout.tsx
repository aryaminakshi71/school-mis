/**
 * App Layout - Consistent UI with Sidebar & Breadcrumbs
 */

import { Outlet, useLocation, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
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
    <Link
      to={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm",
      )}
    >
      <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-gray-500")} />
      <span className="font-medium">{item.label}</span>
      {item.badge && (
        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
          {item.badge}
        </span>
      )}
    </Link>
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
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-gray-200 shadow-xl transform transition-transform lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b px-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 text-white shadow-lg">
          <Link
            to="/app"
            className="flex items-center gap-2 font-bold hover:opacity-90 transition-opacity"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm shadow-md">
              <span className="text-sm font-bold">SM</span>
            </div>
            <span className="hidden sm:inline text-lg">School MIS</span>
          </Link>
          <Link
            to="/app"
            className="ml-auto text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all duration-200 hidden sm:flex items-center gap-1.5 font-medium shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <button
            className="ml-auto lg:hidden text-white p-1.5 hover:bg-white/20 rounded-lg transition-colors"
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
                <Link to="/app">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Landing Page
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/app/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/app/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
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
        <header className="flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6 shadow-md">
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <Link
              to="/app"
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 flex items-center gap-1.5 transition-colors group"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-4 w-4 group-hover:text-blue-600 transition-colors" />
              <span className="text-sm font-medium hidden sm:inline group-hover:text-blue-600 transition-colors">Dashboard</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1.5 text-sm bg-gray-50 px-3 py-1.5 rounded-lg">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                    {crumb.icon && <crumb.icon className="h-3.5 w-3.5 text-blue-600" />}
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.href}
                    className="text-gray-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors font-medium"
                  >
                    {crumb.icon && <crumb.icon className="h-3.5 w-3.5" />}
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="flex-1" />

          <button
            className={cn(
              "hidden md:flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900",
              "cursor-pointer px-4 py-2 rounded-lg border border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all",
            )}
          >
            <Search className="h-4 w-4" />
            <span className="text-gray-500">Search...</span>
            <kbd className="pointer-events-none ml-1 hidden h-5 select-none items-center gap-1 rounded border bg-gray-50 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          <Button
            size="sm"
            className="hidden sm:flex bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add New
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
