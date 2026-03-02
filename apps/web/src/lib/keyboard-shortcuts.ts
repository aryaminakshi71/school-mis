/**
 * Keyboard Shortcuts Utilities
 *
 * Global keyboard shortcuts for the application
 */

import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: (event?: KeyboardEvent) => void;
  description?: string;
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcut(
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey : true;
        const metaMatch = shortcut.meta ? event.metaKey : true;
        const shiftMatch = shortcut.shift ? event.shiftKey : true;
        const altMatch = shortcut.alt ? event.altKey : true;

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.action(event);
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts, enabled]);
}

/**
 * Global keyboard shortcuts hook
 */
export function useGlobalShortcuts() {
  const navigate = useNavigate();

  useKeyboardShortcut([
    {
      key: "k",
      ctrl: true,
      meta: true,
      action: () => {
        // Open global search (implement search modal)
        const event = new CustomEvent("openSearch");
        window.dispatchEvent(event);
      },
      description: "Open global search",
    },
    {
      key: "n",
      ctrl: true,
      meta: true,
      action: () => {
        // Navigate to new item based on current page
        const path = window.location.pathname;
        if (path.includes("/students")) {
          navigate({ to: "/app/students", search: { action: "new" } });
        } else if (path.includes("/teachers")) {
          navigate({ to: "/app/teachers", search: { action: "new" } });
        }
      },
      description: "Create new item",
    },
    {
      key: "Escape",
      action: () => {
        // Close modals/dialogs
        const event = new CustomEvent("closeModals");
        window.dispatchEvent(event);
      },
      description: "Close modals",
    },
    {
      key: "/",
      action: () => {
        // Focus search input if available
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[type="search"], input[placeholder*="Search"]',
        );
        if (searchInput) {
          searchInput.focus();
        }
      },
      description: "Focus search",
    },
  ]);
}

/**
 * Common shortcuts for list pages
 */
export function useListPageShortcuts(
  onCreateNew?: () => void,
  onRefresh?: () => void,
  onExport?: () => void,
) {
  useKeyboardShortcut([
    {
      key: "n",
      ctrl: true,
      meta: true,
      action: () => onCreateNew?.(),
      description: "Create new",
    },
    {
      key: "r",
      ctrl: true,
      meta: true,
      action: () => onRefresh?.(),
      description: "Refresh",
    },
    {
      key: "e",
      ctrl: true,
      meta: true,
      action: () => onExport?.(),
      description: "Export",
    },
  ]);
}

/**
 * Shortcuts for forms
 */
export function useFormShortcuts(onSubmit?: () => void, onCancel?: () => void) {
  useKeyboardShortcut([
    {
      key: "s",
      ctrl: true,
      meta: true,
      action: (event) => {
        event?.preventDefault();
        onSubmit?.();
      },
      description: "Save",
    },
    {
      key: "Escape",
      action: () => onCancel?.(),
      description: "Cancel",
    },
  ]);
}

/**
 * Get keyboard shortcut display text
 */
export function getShortcutDisplay(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  if (shortcut.ctrl || shortcut.meta) {
    parts.push(navigator.platform.includes("Mac") ? "⌘" : "Ctrl");
  }
  if (shortcut.shift) parts.push("Shift");
  if (shortcut.alt) parts.push("Alt");
  parts.push(shortcut.key.toUpperCase());
  return parts.join(" + ");
}
