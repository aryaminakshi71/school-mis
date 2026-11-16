import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/ui-hooks";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";

const toastIcons = {
  default: Info,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  default: "border-gray-200 bg-white text-gray-900",
  success: "border-green-200 bg-green-50 text-green-900",
  error: "border-red-200 bg-red-50 text-red-900",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type || "default"];

        return (
          <div
            key={toast.id}
            className={cn(
              "relative flex items-start gap-3 rounded-lg border p-4 shadow-lg",
              "transform transition-all duration-300 ease-in-out",
              "slide-in-from-right-full animate-in",
              toastStyles[toast.type || "default"],
            )}
          >
            <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />

            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm">{toast.title}</p>
              {toast.description && (
                <p className="mt-1 text-sm opacity-90">{toast.description}</p>
              )}

              {toast.action && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                >
                  {toast.action.label}
                </Button>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 opacity-60 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Progress bar */}
            {toast.duration && toast.duration > 0 && (
              <div
                className="absolute bottom-0 left-0 h-1 rounded-b-lg bg-current opacity-20"
                style={{
                  width: "100%",
                  animation: `shrink ${toast.duration}ms linear forwards`,
                }}
              />
            )}
          </div>
        );
      })}

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
