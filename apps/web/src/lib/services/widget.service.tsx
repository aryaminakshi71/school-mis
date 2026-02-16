import { GripVertical, Maximize2, RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  visible: boolean;
  position: number;
  size: "small" | "medium" | "large";
  settings?: Record<string, unknown>;
}

export type WidgetType =
  | "attendance-chart"
  | "fee-summary"
  | "upcoming-exams"
  | "homework"
  | "announcements"
  | "timetable"
  | "performance-chart"
  | "library-books"
  | "transport-status"
  | "leave-balance"
  | "messages"
  | "quick-actions";

export interface WidgetComponentProps {
  config: WidgetConfig;
  onRefresh: () => void;
  onSettingsChange: (settings: Record<string, unknown>) => void;
}

const defaultWidgets: WidgetConfig[] = [
  {
    id: "w1",
    type: "attendance-chart",
    title: "Attendance",
    visible: true,
    position: 0,
    size: "medium",
  },
  {
    id: "w2",
    type: "fee-summary",
    title: "Fee Summary",
    visible: true,
    position: 1,
    size: "small",
  },
  {
    id: "w3",
    type: "upcoming-exams",
    title: "Upcoming Exams",
    visible: true,
    position: 2,
    size: "small",
  },
  {
    id: "w4",
    type: "homework",
    title: "Homework",
    visible: true,
    position: 3,
    size: "medium",
  },
  {
    id: "w5",
    type: "announcements",
    title: "Announcements",
    visible: true,
    position: 4,
    size: "large",
  },
  {
    id: "w6",
    type: "timetable",
    title: "Today's Timetable",
    visible: true,
    position: 5,
    size: "medium",
  },
  {
    id: "w7",
    type: "performance-chart",
    title: "Performance",
    visible: true,
    position: 6,
    size: "large",
  },
  {
    id: "w8",
    type: "library-books",
    title: "Library",
    visible: true,
    position: 7,
    size: "small",
  },
];

function loadWidgetConfig(userId: string): WidgetConfig[] {
  if (typeof window === "undefined") return [...defaultWidgets];
  const saved = localStorage.getItem(`widgets_${userId}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [...defaultWidgets];
    }
  }
  return [...defaultWidgets];
}

function saveWidgetConfig(userId: string, widgets: WidgetConfig[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`widgets_${userId}`, JSON.stringify(widgets));
}

export function useWidgetConfig(userId: string) {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() =>
    loadWidgetConfig(userId),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  useEffect(() => {
    saveWidgetConfig(userId, widgets);
  }, [widgets, userId]);

  const updateWidget = useCallback(
    (id: string, updates: Partial<WidgetConfig>) => {
      setWidgets((prev) =>
        prev.map((w) => (w.id === id ? { ...w, ...updates } : w)),
      );
    },
    [],
  );

  const toggleVisibility = useCallback((id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w)),
    );
  }, []);

  const removeWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const addWidget = useCallback(
    (type: WidgetType) => {
      const newWidget: WidgetConfig = {
        id: `w_${Date.now()}`,
        type,
        title: type
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
        visible: true,
        position: widgets.length,
        size: "medium",
      };
      setWidgets((prev) => [...prev, newWidget]);
    },
    [widgets.length],
  );

  const resetWidgets = useCallback(() => {
    setWidgets([...defaultWidgets]);
  }, []);

  const reorderWidgets = useCallback((fromIndex: number, toIndex: number) => {
    setWidgets((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, removed);
      return updated.map((w, i) => ({ ...w, position: i }));
    });
  }, []);

  return {
    widgets: widgets
      .filter((w) => w.visible)
      .sort((a, b) => a.position - b.position),
    allWidgets: widgets,
    isEditing,
    setIsEditing,
    draggedWidget,
    setDraggedWidget,
    updateWidget,
    toggleVisibility,
    removeWidget,
    addWidget,
    resetWidgets,
    reorderWidgets,
  };
}

interface WidgetContainerProps {
  config: WidgetConfig;
  children: React.ReactNode;
  onRemove: () => void;
  onRefresh: () => void;
}

export function WidgetContainer({
  config,
  children,
  onRemove,
  onRefresh,
}: WidgetContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 ${
        isExpanded ? "fixed inset-4 z-50" : ""
      } ${config.size === "large" ? "col-span-2" : "col-span-1"}`}
    >
      <div className="flex items-center justify-between border-border border-b bg-muted px-4 py-3">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 cursor-move text-muted-foreground" />
          <h3 className="font-medium text-foreground">{config.title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onRefresh}
            className="rounded p-1.5 text-muted-foreground hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded p-1.5 text-muted-foreground hover:bg-muted"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <button
            onClick={onRemove}
            className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="max-h-[400px] overflow-y-auto p-4">{children}</div>
    </div>
  );
}

export const availableWidgets: Array<{
  type: WidgetType;
  title: string;
  description: string;
}> = [
  {
    type: "attendance-chart",
    title: "Attendance Chart",
    description: "Visual attendance overview",
  },
  {
    type: "fee-summary",
    title: "Fee Summary",
    description: "Fee payment status",
  },
  {
    type: "upcoming-exams",
    title: "Upcoming Exams",
    description: "Schedule of upcoming exams",
  },
  {
    type: "homework",
    title: "Homework",
    description: "Pending homework tasks",
  },
  {
    type: "announcements",
    title: "Announcements",
    description: "School announcements",
  },
  {
    type: "timetable",
    title: "Timetable",
    description: "Today's class schedule",
  },
  {
    type: "performance-chart",
    title: "Performance",
    description: "Academic performance metrics",
  },
  { type: "library-books", title: "Library", description: "Borrowed books" },
  {
    type: "transport-status",
    title: "Transport",
    description: "Bus location and status",
  },
  {
    type: "leave-balance",
    title: "Leave Balance",
    description: "Available leave days",
  },
  { type: "messages", title: "Messages", description: "Recent messages" },
  {
    type: "quick-actions",
    title: "Quick Actions",
    description: "Common actions",
  },
];

export default useWidgetConfig;
