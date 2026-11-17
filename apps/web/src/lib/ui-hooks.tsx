/**
 * Enhanced UI Components and Hooks for SchoolOS
 *
 * Provides:
 * - Dark mode management
 * - Command palette (Cmd+K)
 * - Toast notifications
 * - Loading states
 * - Quick actions
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

// ============================================================================
// DARK MODE MANAGEMENT
// ============================================================================

interface ThemeContextType {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  resolvedTheme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("theme") as "light" | "dark" | "system") ||
        "system"
      );
    }
    return "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const resolved = theme === "system" ? systemTheme : theme;

    setResolvedTheme(resolved);
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        setResolvedTheme(mediaQuery.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "light";
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "light"
        : "dark";
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, resolvedTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

// ============================================================================
// COMMAND PALETTE (Cmd+K)
// ============================================================================

interface Command {
  id: string;
  title: string;
  shortcut?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action: () => void;
  section?: string;
}

interface CommandPaletteContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
  commands: Command[];
  registerCommand: (command: Command) => void;
  unregisterCommand: (id: string) => void;
}

const CommandPaletteContext = createContext<
  CommandPaletteContextType | undefined
>(undefined);

export function CommandPaletteProvider({
  children,
}: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [commands, setCommands] = useState<Command[]>([]);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const registerCommand = useCallback((command: Command) => {
    setCommands((prev) => [
      ...prev.filter((c) => c.id !== command.id),
      command,
    ]);
  }, []);

  const unregisterCommand = useCallback((id: string) => {
    setCommands((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, toggle]);

  return (
    <CommandPaletteContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggle,
        commands,
        registerCommand,
        unregisterCommand,
      }}
    >
      {children}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext);
  if (!context)
    throw new Error(
      "useCommandPalette must be used within CommandPaletteProvider",
    );
  return context;
}

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: "default" | "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, toast: Partial<Toast>) => void;
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
  ) => Promise<T>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id, duration: toast.duration ?? 5000 };
    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateToast = useCallback((id: string, toast: Partial<Toast>) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...toast } : t)),
    );
  }, []);

  const promise = useCallback(
    async <T,>(
      promise: Promise<T>,
      messages: { loading: string; success: string; error: string },
    ): Promise<T> => {
      const id = addToast({
        title: messages.loading,
        type: "info",
        duration: 0, // Don't auto-dismiss loading toast
      });

      try {
        const result = await promise;
        updateToast(id, {
          title: messages.success,
          type: "success",
          duration: 3000,
        });
        return result;
      } catch (error) {
        updateToast(id, {
          title: messages.error,
          description: error instanceof Error ? error.message : undefined,
          type: "error",
          duration: 5000,
        });
        throw error;
      }
    },
    [addToast, updateToast],
  );

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, updateToast, promise }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

// ============================================================================
// LOADING STATES
// ============================================================================

interface LoadingState {
  id: string;
  message: string;
  progress?: number;
}

interface LoadingContextType {
  loadingStates: LoadingState[];
  startLoading: (id: string, message: string) => void;
  updateLoading: (id: string, progress: number) => void;
  stopLoading: (id: string) => void;
  isLoading: (id?: string) => boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>([]);

  const startLoading = useCallback((id: string, message: string) => {
    setLoadingStates((prev) => [
      ...prev.filter((s) => s.id !== id),
      { id, message },
    ]);
  }, []);

  const updateLoading = useCallback((id: string, progress: number) => {
    setLoadingStates((prev) =>
      prev.map((s) => (s.id === id ? { ...s, progress } : s)),
    );
  }, []);

  const stopLoading = useCallback((id: string) => {
    setLoadingStates((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const isLoading = useCallback(
    (id?: string) => {
      if (id) return loadingStates.some((s) => s.id === id);
      return loadingStates.length > 0;
    },
    [loadingStates],
  );

  return (
    <LoadingContext.Provider
      value={{
        loadingStates,
        startLoading,
        updateLoading,
        stopLoading,
        isLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context)
    throw new Error("useLoading must be used within LoadingProvider");
  return context;
}

// ============================================================================
// ONBOARDING
// ============================================================================

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector
  position?: "top" | "bottom" | "left" | "right";
}

interface OnboardingContextType {
  isActive: boolean;
  currentStep: number;
  steps: OnboardingStep[];
  start: () => void;
  next: () => void;
  previous: () => void;
  skip: () => void;
  complete: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

const defaultSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to SchoolOS",
    description: "Let's take a quick tour of the system.",
    target: "body",
    position: "bottom",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description:
      "Get a quick overview of your school's performance and activities.",
    target: "[data-tour='dashboard']",
    position: "right",
  },
  {
    id: "students",
    title: "Student Management",
    description: "Manage student records, admissions, and profiles.",
    target: "[data-tour='students']",
    position: "right",
  },
  {
    id: "attendance",
    title: "Attendance",
    description: "Track daily attendance and generate reports.",
    target: "[data-tour='attendance']",
    position: "right",
  },
  {
    id: "quick-actions",
    title: "Quick Actions",
    description: "Access frequently used features from the floating menu.",
    target: "[data-tour='quick-actions']",
    position: "left",
  },
];

export function OnboardingProvider({
  children,
  steps = defaultSteps,
}: {
  children: React.ReactNode;
  steps?: OnboardingStep[];
}) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("has-seen-onboarding");
    if (!hasSeenOnboarding) {
      setIsActive(true);
    }
  }, []);

  const start = useCallback(() => {
    setIsActive(true);
    setCurrentStep(0);
  }, []);

  const next = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      complete();
    }
  }, [currentStep, steps.length]);

  const previous = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const skip = useCallback(() => {
    setIsActive(false);
    localStorage.setItem("has-seen-onboarding", "true");
  }, []);

  const complete = useCallback(() => {
    setIsActive(false);
    localStorage.setItem("has-seen-onboarding", "true");
    localStorage.setItem("onboarding-completed", new Date().toISOString());
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        isActive,
        currentStep,
        steps,
        start,
        next,
        previous,
        skip,
        complete,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context)
    throw new Error("useOnboarding must be used within OnboardingProvider");
  return context;
}

// ============================================================================
// RESPONSIVE BREAKPOINTS
// ============================================================================

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 768px)");
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1025px)");
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers?: {
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
    alt?: boolean;
  },
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();
      const ctrlMatch = modifiers?.ctrl ? event.ctrlKey : !event.ctrlKey;
      const metaMatch = modifiers?.meta ? event.metaKey : !event.metaKey;
      const shiftMatch = modifiers?.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = modifiers?.alt ? event.altKey : !event.altKey;

      if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, modifiers]);
}

// ============================================================================
// FOCUS MANAGEMENT
// ============================================================================

export function useFocusTrap(active: boolean) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    firstElement?.focus();
    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  return containerRef;
}

// ============================================================================
// SCROLL MANAGEMENT
// ============================================================================

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollPosition;
}

export function useScrollToTop() {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return scrollToTop;
}

// Re-export useAuth from auth-context for convenience
export { useAuth } from "./auth-context";
