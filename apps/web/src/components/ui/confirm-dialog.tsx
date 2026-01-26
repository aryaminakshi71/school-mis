/**
 * Confirmation Dialog Component
 * 
 * Reusable confirmation dialog for destructive actions
 */

import {
  AlertTriangle,
  Trash2,
  X,
  CheckCircle,
  Info,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ConfirmDialogVariant = "danger" | "warning" | "info" | "success";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  variant?: ConfirmDialogVariant;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const variantConfig: Record<
  ConfirmDialogVariant,
  {
    icon: React.ComponentType<{ className?: string }>;
    confirmButtonClass: string;
    iconColor: string;
  }
> = {
  danger: {
    icon: Trash2,
    confirmButtonClass: "bg-red-600 hover:bg-red-700 text-white",
    iconColor: "text-red-600",
  },
  warning: {
    icon: AlertTriangle,
    confirmButtonClass: "bg-yellow-600 hover:bg-yellow-700 text-white",
    iconColor: "text-yellow-600",
  },
  info: {
    icon: Info,
    confirmButtonClass: "bg-blue-600 hover:bg-blue-700 text-white",
    iconColor: "text-blue-600",
  },
  success: {
    icon: CheckCircle,
    confirmButtonClass: "bg-green-600 hover:bg-green-700 text-white",
    iconColor: "text-green-600",
  },
};

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  variant = "danger",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  icon,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const Icon = icon || config.icon;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      // Error handling is done by the caller
      console.error("Confirm action failed:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 ${config.iconColor}`}>
              <Icon className="w-6 h-6" />
            </div>
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={config.confirmButtonClass}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Hook for using confirmation dialog
 */
export function useConfirmDialog() {
  const [open, setOpen] = React.useState(false);
  const [config, setConfig] = React.useState<Omit<
    ConfirmDialogProps,
    "open" | "onOpenChange"
  > | null>(null);
  const [resolvePromise, setResolvePromise] = React.useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = React.useCallback(
    (
      title: string,
      description: string,
      options?: {
        variant?: ConfirmDialogVariant;
        confirmText?: string;
        cancelText?: string;
        icon?: React.ReactNode;
      }
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfig({
          title,
          description,
          variant: options?.variant || "danger",
          confirmText: options?.confirmText,
          cancelText: options?.cancelText,
          icon: options?.icon,
          onConfirm: () => {
            resolve(true);
            setOpen(false);
          },
        });
        setResolvePromise(() => resolve);
        setOpen(true);
      });
    },
    []
  );

  const handleCancel = () => {
    setOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
    }
  };

  const dialog = config ? (
    <ConfirmDialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen && resolvePromise) {
          resolvePromise(false);
        }
      }}
      {...config}
    />
  ) : null;

  return { confirm, dialog };
}

// Add React import for the hook
import React from "react";
