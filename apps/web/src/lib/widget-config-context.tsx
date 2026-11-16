import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

export type WidgetType =
  | "stats"
  | "attendance"
  | "fees"
  | "exams"
  | "birthdays"
  | "calendar"
  | "tasks"
  | "recent-activity"
  | "performance"
  | "notifications"
  | "quick-actions";

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  position: number;
  size: "small" | "medium" | "large";
  settings?: Record<string, any>;
}

export interface WidgetDefinition {
  type: WidgetType;
  title: string;
  description: string;
  icon: string;
  defaultSize: "small" | "medium" | "large";
  component: ReactNode;
}

const defaultWidgets: WidgetConfig[] = [
  {
    id: "stats-overview",
    type: "stats",
    title: "Overview",
    position: 0,
    size: "large",
  },
  {
    id: "attendance-chart",
    type: "attendance",
    title: "Attendance",
    position: 1,
    size: "medium",
  },
  {
    id: "fees-summary",
    type: "fees",
    title: "Fee Collection",
    position: 2,
    size: "medium",
  },
  {
    id: "upcoming-exams",
    type: "exams",
    title: "Upcoming Exams",
    position: 3,
    size: "small",
  },
  {
    id: "birthdays",
    type: "birthdays",
    title: "Today's Birthdays",
    position: 4,
    size: "small",
  },
  {
    id: "calendar",
    type: "calendar",
    title: "Calendar",
    position: 5,
    size: "medium",
  },
  {
    id: "pending-tasks",
    type: "tasks",
    title: "Pending Tasks",
    position: 6,
    size: "small",
  },
];

interface WidgetContextType {
  widgets: WidgetConfig[];
  availableWidgets: WidgetDefinition[];
  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<WidgetConfig>) => void;
  reorderWidgets: (newOrder: WidgetConfig[]) => void;
  resetToDefault: () => void;
}

const WidgetContext = createContext<WidgetContextType | null>(null);

export function WidgetProvider({ children }: { children: ReactNode }) {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    // Load from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboard-widgets");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return defaultWidgets;
        }
      }
    }
    return defaultWidgets;
  });

  const availableWidgets: WidgetDefinition[] = [
    {
      type: "stats",
      title: "Statistics Overview",
      description: "Key metrics and counts",
      icon: "BarChart",
      defaultSize: "large",
      component: null as any,
    },
    {
      type: "attendance",
      title: "Attendance Chart",
      description: "Daily attendance overview",
      icon: "Calendar",
      defaultSize: "medium",
      component: null as any,
    },
    {
      type: "fees",
      title: "Fee Collection",
      description: "Fee collection summary",
      icon: "DollarSign",
      defaultSize: "medium",
      component: null as any,
    },
    {
      type: "exams",
      title: "Upcoming Exams",
      description: "Exam schedule and alerts",
      icon: "FileText",
      defaultSize: "small",
      component: null as any,
    },
    {
      type: "birthdays",
      title: "Birthdays",
      description: "Today's birthdays",
      icon: "Gift",
      defaultSize: "small",
      component: null as any,
    },
    {
      type: "calendar",
      title: "Calendar",
      description: "School events and schedule",
      icon: "CalendarDays",
      defaultSize: "medium",
      component: null as any,
    },
    {
      type: "tasks",
      title: "Tasks",
      description: "Pending tasks and reminders",
      icon: "CheckSquare",
      defaultSize: "small",
      component: null as any,
    },
    {
      type: "recent-activity",
      title: "Recent Activity",
      description: "Latest actions and updates",
      icon: "Activity",
      defaultSize: "medium",
      component: null as any,
    },
    {
      type: "performance",
      title: "Performance",
      description: "Academic performance trends",
      icon: "TrendingUp",
      defaultSize: "large",
      component: null as any,
    },
    {
      type: "notifications",
      title: "Notifications",
      description: "Important alerts",
      icon: "Bell",
      defaultSize: "small",
      component: null as any,
    },
    {
      type: "quick-actions",
      title: "Quick Actions",
      description: "Frequently used actions",
      icon: "Zap",
      defaultSize: "small",
      component: null as any,
    },
  ];

  const saveWidgets = useCallback((newWidgets: WidgetConfig[]) => {
    setWidgets(newWidgets);
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboard-widgets", JSON.stringify(newWidgets));
    }
  }, []);

  const addWidget = useCallback(
    (type: WidgetType) => {
      const definition = availableWidgets.find((w) => w.type === type);
      if (!definition) return;

      const newWidget: WidgetConfig = {
        id: `${type}-${Date.now()}`,
        type,
        title: definition.title,
        position: widgets.length,
        size: definition.defaultSize,
      };

      saveWidgets([...widgets, newWidget]);
    },
    [widgets, availableWidgets, saveWidgets],
  );

  const removeWidget = useCallback(
    (id: string) => {
      const filtered = widgets.filter((w) => w.id !== id);
      const reordered = filtered.map((w, index) => ({ ...w, position: index }));
      saveWidgets(reordered);
    },
    [widgets, saveWidgets],
  );

  const updateWidget = useCallback(
    (id: string, updates: Partial<WidgetConfig>) => {
      const updated = widgets.map((w) =>
        w.id === id ? { ...w, ...updates } : w,
      );
      saveWidgets(updated);
    },
    [widgets, saveWidgets],
  );

  const reorderWidgets = useCallback(
    (newOrder: WidgetConfig[]) => {
      const reordered = newOrder.map((w, index) => ({ ...w, position: index }));
      saveWidgets(reordered);
    },
    [saveWidgets],
  );

  const resetToDefault = useCallback(() => {
    saveWidgets(defaultWidgets);
  }, [saveWidgets]);

  return (
    <WidgetContext.Provider
      value={{
        widgets,
        availableWidgets,
        addWidget,
        removeWidget,
        updateWidget,
        reorderWidgets,
        resetToDefault,
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
}

export function useWidgets() {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidgets must be used within a WidgetProvider");
  }
  return context;
}

export { defaultWidgets };
