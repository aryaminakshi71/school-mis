import { useState, useCallback, useEffect } from "react";
import { GripVertical, X, Maximize2, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

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
  { id: "w1", type: "attendance-chart", title: "Attendance", visible: true, position: 0, size: "medium" },
  { id: "w2", type: "fee-summary", title: "Fee Summary", visible: true, position: 1, size: "small" },
  { id: "w3", type: "upcoming-exams", title: "Upcoming Exams", visible: true, position: 2, size: "small" },
  { id: "w4", type: "homework", title: "Homework", visible: true, position: 3, size: "medium" },
  { id: "w5", type: "announcements", title: "Announcements", visible: true, position: 4, size: "large" },
  { id: "w6", type: "timetable", title: "Today's Timetable", visible: true, position: 5, size: "medium" },
  { id: "w7", type: "performance-chart", title: "Performance", visible: true, position: 6, size: "large" },
  { id: "w8", type: "library-books", title: "Library", visible: true, position: 7, size: "small" },
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
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => loadWidgetConfig(userId));
  const [isEditing, setIsEditing] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  useEffect(() => {
    saveWidgetConfig(userId, widgets);
  }, [widgets, userId]);

  const updateWidget = useCallback((id: string, updates: Partial<WidgetConfig>) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w))
    );
  }, []);

  const removeWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const addWidget = useCallback((type: WidgetType) => {
    const newWidget: WidgetConfig = {
      id: `w_${Date.now()}`,
      type,
      title: type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      visible: true,
      position: widgets.length,
      size: "medium",
    };
    setWidgets((prev) => [...prev, newWidget]);
  }, [widgets.length]);

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
    widgets: widgets.filter((w) => w.visible).sort((a, b) => a.position - b.position),
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

export function WidgetContainer({ config, children, onRemove, onRefresh }: WidgetContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 ${
        isExpanded ? "fixed inset-4 z-50" : ""
      } ${config.size === "large" ? "col-span-2" : "col-span-1"}`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
          <h3 className="font-medium text-gray-900">{config.title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onRefresh}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-500"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-500"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 rounded hover:bg-red-100 text-gray-500 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4 max-h-[400px] overflow-y-auto">{children}</div>
    </div>
  );
}

export const availableWidgets: Array<{ type: WidgetType; title: string; description: string }> = [
  { type: "attendance-chart", title: "Attendance Chart", description: "Visual attendance overview" },
  { type: "fee-summary", title: "Fee Summary", description: "Fee payment status" },
  { type: "upcoming-exams", title: "Upcoming Exams", description: "Schedule of upcoming exams" },
  { type: "homework", title: "Homework", description: "Pending homework tasks" },
  { type: "announcements", title: "Announcements", description: "School announcements" },
  { type: "timetable", title: "Timetable", description: "Today's class schedule" },
  { type: "performance-chart", title: "Performance", description: "Academic performance metrics" },
  { type: "library-books", title: "Library", description: "Borrowed books" },
  { type: "transport-status", title: "Transport", description: "Bus location and status" },
  { type: "leave-balance", title: "Leave Balance", description: "Available leave days" },
  { type: "messages", title: "Messages", description: "Recent messages" },
  { type: "quick-actions", title: "Quick Actions", description: "Common actions" },
];

export default useWidgetConfig;
