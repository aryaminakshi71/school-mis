/**
 * App Layout - Consistent UI with Sidebar & Breadcrumbs
 */

import { AIAssistant } from "@/components/ai-assistant";
import { GlobalSearch } from "@/components/global-search";
import { NotificationCenter } from "@/components/notification-center";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Bot,
  Bus,
  Calendar,
  ChevronRight,
  DollarSign,
  FileText,
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
import { useEffect, useState } from "react";

const getBreadcrumbs = (pathname: string) => {
  const paths = pathname.split("/").filter(Boolean);
  interface BreadcrumbItem {
    label: string;
    href: string;
    icon?: any;
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/app", icon: Home },
  ];

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
        "flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-all duration-200",
        isActive
          ? "bg-gradient-to-r from-primary to-primary/90 text-background shadow-md"
          : "text-foreground hover:bg-muted hover:text-foreground hover:shadow-sm",
      )}
    >
      <item.icon
        className={cn(
          "h-4 w-4",
          isActive ? "text-background" : "text-muted-foreground",
        )}
      />
      <span className="font-medium">{item.label}</span>
      {item.badge && (
        <span className="ml-auto rounded-full bg-destructive px-2 py-0.5 font-semibold text-destructive-foreground text-xs">
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
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const breadcrumbs = getBreadcrumbs(location.pathname);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
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
    <div className="flex h-screen w-full bg-muted">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col border-border border-r bg-card shadow-xl transition-transform lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b bg-gradient-to-r from-primary via-primary/80 to-primary/90 px-4 text-background shadow-lg">
          <Link
            to="/app"
            className="flex items-center gap-2 font-bold transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/20 shadow-md backdrop-blur-sm">
              <span className="font-bold text-sm">SM</span>
            </div>
            <span className="hidden text-lg sm:inline">SchoolAI</span>
          </Link>
          <Link
            to="/app"
            className="ml-auto hidden items-center gap-1.5 rounded-lg bg-card/20 px-3 py-1.5 font-medium text-xs shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-card/30 sm:flex"
          >
            <Home className="h-3.5 w-3.5" />
            Dashboard
          </Link>
          <button
            className="ml-auto rounded-lg p-1.5 text-background transition-colors hover:bg-card/20 lg:hidden"
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

        <div className="border-t bg-muted p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 hover:bg-card"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="flex flex-col items-start text-left">
                  <span className="font-medium text-sm">
                    {user?.name || "User"}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {user?.role || "Admin"}
                  </span>
                </span>
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
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 shadow-md lg:px-6">
          <button
            className="rounded-lg p-2 transition-colors hover:bg-muted lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <Link
              to="/app"
              className="group flex items-center gap-1.5 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-4 w-4 transition-colors group-hover:text-primary" />
              <span className="hidden font-medium text-sm transition-colors group-hover:text-primary sm:inline">
                Dashboard
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-sm md:flex">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    {crumb.icon && (
                      <crumb.icon className="h-3.5 w-3.5 text-primary" />
                    )}
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.href}
                    className="flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    {crumb.icon && <crumb.icon className="h-3.5 w-3.5" />}
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="flex-1" />

          <GlobalSearch />

          <NotificationCenter />

          <button
            className={cn(
              "hidden items-center gap-2 text-muted-foreground text-sm hover:text-foreground md:flex",
              "cursor-pointer rounded-lg border border-border bg-card px-4 py-2 transition-all hover:border-primary/30 hover:shadow-sm",
            )}
          >
            <Search className="h-4 w-4" />
            <span className="text-muted-foreground">Search...</span>
            <kbd className="pointer-events-none ml-1 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          <Button
            size="sm"
            className="hidden bg-gradient-to-r from-primary to-primary/90 text-background shadow-md transition-all hover:from-primary hover:to-primary/90 hover:shadow-lg sm:flex"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add New
          </Button>
        </header>

        <main className="flex-1 overflow-auto bg-gradient-to-br from-muted via-background to-muted p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* AI Assistant Button */}
      <Button
        onClick={() => setAiAssistantOpen(true)}
        className="fixed right-4 bottom-4 h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:from-purple-600 hover:to-pink-600"
        size="sm"
      >
        <Bot className="h-6 w-6" />
      </Button>

      {/* AI Assistant */}
      <AIAssistant
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
      />
    </div>
  );
}
