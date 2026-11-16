import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useAuth, useCommandPalette, useTheme } from "@/lib/ui-hooks";
import { useNavigate } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Building,
  Calendar,
  Car,
  Clock,
  DollarSign,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Moon,
  Package,
  Plus,
  Search,
  Settings,
  Sun,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface PaletteCommandItem {
  id: string;
  title: string;
  shortcut?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action: () => void;
  section: string;
  keywords?: string[];
}

export function CommandPalette() {
  const {
    isOpen,
    setIsOpen,
    commands: registeredCommands,
  } = useCommandPalette();
  const navigate = useNavigate();
  const { toggleTheme, resolvedTheme } = useTheme();
  const { logout } = useAuth();
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: PaletteCommandItem[] = useMemo(() => {
    const baseCommands: PaletteCommandItem[] = [
      // Navigation
      {
        id: "dashboard",
        title: "Go to Dashboard",
        shortcut: "G D",
        icon: LayoutDashboard,
        section: "Navigation",
        action: () => navigate({ to: "/app" }),
        keywords: ["home", "main", "overview"],
      },
      {
        id: "students",
        title: "Students Management",
        shortcut: "G S",
        icon: Users,
        section: "Navigation",
        action: () => navigate({ to: "/app/students" }),
        keywords: ["pupils", "learners", "children"],
      },
      {
        id: "staff",
        title: "Staff Management",
        shortcut: "G T",
        icon: GraduationCap,
        section: "Navigation",
        action: () => navigate({ to: "/app/teachers" }),
        keywords: ["teachers", "employees", "faculty"],
      },
      {
        id: "classes",
        title: "Classes",
        shortcut: "G C",
        icon: Building,
        section: "Navigation",
        action: () => navigate({ to: "/app/classes" }),
        keywords: ["classrooms", "sections", "rooms"],
      },
      {
        id: "attendance",
        title: "Attendance",
        shortcut: "G A",
        icon: Calendar,
        section: "Navigation",
        action: () => navigate({ to: "/app/attendance" }),
        keywords: ["presence", "absent", "daily"],
      },
      {
        id: "exams",
        title: "Exams",
        shortcut: "G E",
        icon: Award,
        section: "Navigation",
        action: () => navigate({ to: "/app/exams" }),
        keywords: ["tests", "assessments", "grades"],
      },
      {
        id: "fees",
        title: "Fees & Payments",
        shortcut: "G F",
        icon: DollarSign,
        section: "Navigation",
        action: () => navigate({ to: "/app/fees" }),
        keywords: ["payments", "money", "finance"],
      },
      {
        id: "library",
        title: "Library",
        shortcut: "G L",
        icon: BookOpen,
        section: "Navigation",
        action: () => navigate({ to: "/app/library" }),
        keywords: ["books", "catalog", "borrow"],
      },
      {
        id: "transport",
        title: "Transport",
        shortcut: "G R",
        icon: Car,
        section: "Navigation",
        action: () => navigate({ to: "/app/transport" }),
        keywords: ["buses", "vehicles", "routes"],
      },
      {
        id: "inventory",
        title: "Inventory",
        shortcut: "G I",
        icon: Package,
        section: "Navigation",
        action: () => navigate({ to: "/app/inventory" }),
        keywords: ["stock", "items", "assets"],
      },
      {
        id: "reports",
        title: "Reports",
        shortcut: "G P",
        icon: BarChart3,
        section: "Navigation",
        action: () => navigate({ to: "/app/reports" }),
        keywords: ["analytics", "statistics", "data"],
      },
      {
        id: "notifications",
        title: "Notifications",
        shortcut: "G N",
        icon: Bell,
        section: "Navigation",
        action: () => navigate({ to: "/app/notifications" }),
        keywords: ["alerts", "messages", "updates"],
      },

      // Quick Actions
      {
        id: "add-student",
        title: "Add New Student",
        icon: Plus,
        section: "Quick Actions",
        action: () =>
          navigate({ to: "/app/students", search: { action: "add" } }),
        keywords: ["create", "new", "enroll", "admission"],
      },
      {
        id: "add-staff",
        title: "Add New Staff",
        icon: Plus,
        section: "Quick Actions",
        action: () =>
          navigate({ to: "/app/teachers", search: { action: "add" } }),
        keywords: ["create", "new", "hire", "employee"],
      },
      {
        id: "mark-attendance",
        title: "Mark Today's Attendance",
        icon: Calendar,
        section: "Quick Actions",
        action: () => navigate({ to: "/app/attendance" }),
        keywords: ["daily", "present", "absent"],
      },
      {
        id: "collect-fee",
        title: "Collect Fee Payment",
        icon: DollarSign,
        section: "Quick Actions",
        action: () =>
          navigate({ to: "/app/fees", search: { action: "collect" } }),
        keywords: ["payment", "money", "receive"],
      },

      // Preferences
      {
        id: "toggle-theme",
        title: `Switch to ${resolvedTheme === "light" ? "Dark" : "Light"} Mode`,
        shortcut: "⌘ J",
        icon: resolvedTheme === "light" ? Moon : Sun,
        section: "Preferences",
        action: () => {
          toggleTheme();
        },
        keywords: ["theme", "mode", "color", "appearance"],
      },
      {
        id: "settings",
        title: "Settings",
        shortcut: "⌘ ,",
        icon: Settings,
        section: "Preferences",
        action: () => navigate({ to: "/app/settings" }),
        keywords: ["configuration", "options", "preferences"],
      },

      // Help
      {
        id: "help",
        title: "Help & Documentation",
        icon: HelpCircle,
        section: "Help",
        action: () => window.open("/api/docs", "_blank"),
        keywords: ["docs", "guide", "support", "documentation"],
      },

      // Account
      {
        id: "logout",
        title: "Logout",
        shortcut: "⇧ ⌘ Q",
        icon: LogOut,
        section: "Account",
        action: () => {
          logout();
          navigate({ to: "/login" });
        },
        keywords: ["signout", "exit", "leave"],
      },
    ];

    return [
      ...baseCommands,
      ...registeredCommands.map((c) => ({
        ...c,
        section: c.section || "Custom",
      })),
    ];
  }, [navigate, toggleTheme, resolvedTheme, logout, registeredCommands]);

  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;

    const searchLower = search.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(searchLower) ||
        cmd.keywords?.some((k) => k.toLowerCase().includes(searchLower)) ||
        cmd.section.toLowerCase().includes(searchLower),
    );
  }, [commands, search]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, PaletteCommandItem[]> = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.section]) groups[cmd.section] = [];
      groups[cmd.section].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      // Focus input after a short delay to allow dialog to mount
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSelect = (command: PaletteCommandItem) => {
    command.action();
    setIsOpen(false);
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <Command shouldFilter={false} className="rounded-lg border shadow-md">
        <CommandInput
          ref={inputRef}
          placeholder="Type a command or search..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList className="max-h-[60vh] overflow-y-auto">
          <CommandEmpty>No commands found.</CommandEmpty>

          {Object.entries(groupedCommands).map(([section, items]) => (
            <CommandGroup key={section} heading={section}>
              {items.map((command) => (
                <CommandItem
                  key={command.id}
                  onSelect={() => handleSelect(command)}
                  className="cursor-pointer"
                >
                  {command.icon && <command.icon className="mr-2 h-4 w-4" />}
                  <span>{command.title}</span>
                  {command.shortcut && (
                    <CommandShortcut>{command.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}

          <CommandSeparator />

          <CommandGroup heading="Tips">
            <CommandItem disabled className="text-muted-foreground text-xs">
              <Search className="mr-2 h-3 w-3" />
              Press ⌘K to open this menu anywhere
            </CommandItem>
            <CommandItem disabled className="text-muted-foreground text-xs">
              <Clock className="mr-2 h-3 w-3" />
              Use arrow keys to navigate, Enter to select
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
