import { Reorder, motion } from "framer-motion";
import {
  GripVertical,
  LayoutGrid,
  Plus,
  RotateCcw,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";
import { type WidgetConfig, useWidgets } from "../lib/widget-config-context";

const widgetIcons: Record<string, string> = {
  BarChart: "📊",
  Calendar: "📅",
  DollarSign: "💰",
  FileText: "📝",
  Gift: "🎁",
  CalendarDays: "🗓️",
  CheckSquare: "☑️",
  Activity: "📈",
  TrendingUp: "📉",
  Bell: "🔔",
  Zap: "⚡",
};

function WidgetCard({
  widget,
  onRemove,
  onEdit,
}: {
  widget: WidgetConfig;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  const sizeClasses = {
    small: "col-span-1",
    medium: "col-span-1 md:col-span-2",
    large: "col-span-1 md:col-span-2 lg:col-span-3",
  };

  return (
    <div
      className={`${sizeClasses[widget.size]} group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800`}
    >
      <div className="flex items-center justify-between border-gray-100 border-b px-4 py-3 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 cursor-grab text-gray-400 active:cursor-grabbing" />
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {widget.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(widget.id)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => onRemove(widget.id)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="p-4">
        {/* Widget content placeholder */}
        <div className="flex h-32 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <p className="text-gray-400 text-sm dark:text-gray-500">
            {widget.type} widget content
          </p>
        </div>
      </div>
    </div>
  );
}

export function DashboardWidgetManager() {
  const {
    widgets,
    availableWidgets,
    addWidget,
    removeWidget,
    reorderWidgets,
    resetToDefault,
  } = useWidgets();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWidget, setEditingWidget] = useState<string | null>(null);

  const handleReorder = (newOrder: WidgetConfig[]) => {
    reorderWidgets(newOrder);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold text-gray-900 text-lg dark:text-gray-100">
          <LayoutGrid className="h-5 w-5" />
          Dashboard Widgets
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Widget
          </button>
          <button
            onClick={resetToDefault}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            title="Reset to default"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Widget Grid */}
      <Reorder.Group
        axis="y"
        values={widgets}
        onReorder={handleReorder}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {widgets.map((widget) => (
          <Reorder.Item key={widget.id} value={widget} className="contents">
            <WidgetCard
              widget={widget}
              onRemove={removeWidget}
              onEdit={setEditingWidget}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Add Widget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900"
          >
            <div className="flex items-center justify-between border-gray-200 border-b px-6 py-4 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 text-lg dark:text-gray-100">
                Add Widget
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-500 text-sm dark:text-gray-400">
                Choose a widget to add to your dashboard
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {availableWidgets.map((widget) => (
                  <button
                    key={widget.type}
                    onClick={() => {
                      addWidget(widget.type);
                      setShowAddModal(false);
                    }}
                    className="flex items-start gap-3 rounded-xl border border-transparent bg-gray-50 p-4 text-left transition-colors hover:border-primary/20 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-2xl dark:bg-primary/20">
                      {widgetIcons[widget.icon] || "📦"}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {widget.title}
                      </h4>
                      <p className="mt-0.5 text-gray-500 text-sm dark:text-gray-400">
                        {widget.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Widget Modal */}
      {editingWidget && (
        <WidgetEditModal
          widgetId={editingWidget}
          onClose={() => setEditingWidget(null)}
        />
      )}
    </div>
  );
}

function WidgetEditModal({
  widgetId,
  onClose,
}: { widgetId: string; onClose: () => void }) {
  const { widgets, updateWidget } = useWidgets();
  const widget = widgets.find((w) => w.id === widgetId);

  if (!widget) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900"
      >
        <div className="flex items-center justify-between border-gray-200 border-b px-6 py-4 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 text-lg dark:text-gray-100">
            Edit Widget
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
              Widget Title
            </label>
            <input
              type="text"
              value={widget.title}
              onChange={(e) =>
                updateWidget(widgetId, { title: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
              Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["small", "medium", "large"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updateWidget(widgetId, { size })}
                  className={`rounded-lg border px-4 py-2 transition-colors ${
                    widget.size === size
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-gray-200 border-t bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardWidgetManager;
