import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Car,
  ClipboardList,
  DollarSign,
  MessageSquare,
  Plus,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  onClick: () => void;
}

export function QuickActionsWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Hide widget on scroll down, show on scroll up
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const actions: QuickAction[] = [
    {
      id: "add-student",
      label: "Add Student",
      icon: UserPlus,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () =>
        navigate({ to: "/app/students", search: { action: "add" } }),
    },
    {
      id: "mark-attendance",
      label: "Mark Attendance",
      icon: ClipboardList,
      color: "bg-green-500 hover:bg-green-600",
      onClick: () => navigate({ to: "/app/attendance" }),
    },
    {
      id: "collect-fee",
      label: "Collect Fee",
      icon: DollarSign,
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () =>
        navigate({ to: "/app/fees", search: { action: "collect" } }),
    },
    {
      id: "issue-book",
      label: "Issue Book",
      icon: BookOpen,
      color: "bg-orange-500 hover:bg-orange-600",
      onClick: () =>
        navigate({ to: "/app/library", search: { action: "issue" } }),
    },
    {
      id: "add-transport",
      label: "Add Route",
      icon: Car,
      color: "bg-pink-500 hover:bg-pink-600",
      onClick: () =>
        navigate({ to: "/app/transport", search: { action: "add" } }),
    },
    {
      id: "send-message",
      label: "Send Message",
      icon: MessageSquare,
      color: "bg-teal-500 hover:bg-teal-600",
      onClick: () => navigate({ to: "/app/chat" }),
    },
  ];

  return (
    <div
      className={cn(
        "fixed right-6 bottom-6 z-40 flex flex-col items-end gap-3 transition-transform duration-300",
        !isVisible && "translate-y-20",
        isOpen && "translate-y-0",
      )}
      data-tour="quick-actions"
    >
      {/* Action Buttons */}
      <div
        className={cn(
          "flex flex-col-reverse gap-2 transition-all duration-300",
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-10 opacity-0",
        )}
      >
        {actions.map((action, index) => (
          <div
            key={action.id}
            className="flex items-center gap-3"
            style={{
              transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
            }}
          >
            <span className="whitespace-nowrap rounded-lg bg-white px-3 py-1 font-medium text-gray-700 text-sm shadow-sm">
              {action.label}
            </span>
            <Button
              size="icon"
              className={cn(
                "h-12 w-12 rounded-full text-white shadow-lg transition-transform hover:scale-110",
                action.color,
              )}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
            >
              <action.icon className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>

      {/* Main Toggle Button */}
      <Button
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-xl transition-all duration-300",
          isOpen
            ? "rotate-45 bg-red-500 hover:bg-red-600"
            : "bg-primary hover:scale-105 hover:bg-primary/90",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Plus className="h-6 w-6 text-white" />
      </Button>

      {/* Keyboard Hint */}
      {isOpen && (
        <div className="rounded bg-background/80 px-2 py-1 text-muted-foreground text-xs backdrop-blur-sm">
          Click backdrop or press ESC to close
        </div>
      )}
    </div>
  );
}
