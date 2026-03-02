/**
 * Confirmation Dialog Component
 *
 * Reusable confirmation dialog for destructive actions
 */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle, Info, Trash2 } from "lucide-react";
import React, { useCallback, useState } from "react";

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
  icon?: React.ComponentType<{ className?: string }>;
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
    confirmButtonClass:
      "bg-destructive hover:bg-destructive  text-destructive-foreground",
    iconColor: "text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    confirmButtonClass: "bg-warning hover:bg-warning  text-warning-foreground",
    iconColor: "text-warning",
  },
  info: {
    icon: Info,
    confirmButtonClass:
      "bg-primary hover:bg-primary/90 text-primary-foreground",
    iconColor: "text-primary",
  },
  success: {
    icon: CheckCircle,
    confirmButtonClass: "bg-success hover:bg-success  text-success-foreground",
    iconColor: "text-success",
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
              <Icon className="h-6 w-6" />
            </div>
            <DialogTitle className="font-semibold text-lg">{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-muted-foreground">
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
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-border border-t-transparent" />
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
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<Omit<
    ConfirmDialogProps,
    "open" | "onOpenChange"
  > | null>(null);
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = useCallback(
    (
      title: string,
      description: string,
      options?: {
        variant?: ConfirmDialogVariant;
        confirmText?: string;
        cancelText?: string;
        icon?: React.ComponentType<{ className?: string }>;
      },
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
    [],
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
