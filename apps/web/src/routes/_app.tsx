import { Outlet, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { useTheme } from "../lib/theme-context";
import { useAuth } from "../lib/auth-context";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  DollarSign,
  Bus,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  Settings,
  User,
  FileText,
  MessageSquare,
  MessageCircle,
} from "lucide-react";

export default function AppLayout() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/app" },
    { icon: Users, label: "Students", href: "/app/students" },
    { icon: GraduationCap, label: "Teachers", href: "/app/teachers" },
    { icon: BookOpen, label: "Classes", href: "/app/classes" },
    { icon: Calendar, label: "Attendance", href: "/app/attendance" },
    { icon: FileText, label: "Exams", href: "/app/exams" },
    { icon: DollarSign, label: "Fees", href: "/app/fees" },
    { icon: BookOpen, label: "Library", href: "/app/library" },
    { icon: Bus, label: "Transport", href: "/app/transport" },
    { icon: MessageCircle, label: "Parent Portal", href: "/app/parent-portal" },
    { icon: MessageSquare, label: "Notifications", href: "/app/notifications" },
    { icon: User, label: "Profile", href: "/app/profile" },
    { icon: Settings, label: "Settings", href: "/app/settings" },
  ];

  const isActive = (href: string) => {
    if (href === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <a href="/" className="flex items-center gap-2 font-bold text-xl">
              <span className="text-blue-600">School MIS</span>
            </a>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0) || "U"}
              </div>
              <span className="text-sm text-gray-700">
                {user?.name || "User"}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`${sidebarOpen ? "block" : "hidden"} fixed inset-0 z-50 md:hidden`}
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-lg">Menu</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                    isActive(item.href)
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <aside className="hidden md:block w-64 bg-white border-r min-h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
