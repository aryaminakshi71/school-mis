import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOnboarding } from "@/lib/ui-hooks";
import { cn } from "@/lib/utils";
import { CheckCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function OnboardingTour() {
  const { isActive, currentStep, steps, next, previous, skip, complete } =
    useOnboarding();
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [arrowPosition, setArrowPosition] = useState<
    "top" | "bottom" | "left" | "right"
  >("top");
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];

  useEffect(() => {
    if (!isActive || !step) return;

    const updatePosition = () => {
      const target = document.querySelector(step.target);
      if (!target) {
        // If target not found, center on screen
        setPosition({
          top: window.innerHeight / 2,
          left: window.innerWidth / 2,
        });
        return;
      }

      const rect = target.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current?.offsetHeight || 200;
      const tooltipWidth = tooltipRef.current?.offsetWidth || 320;

      let top = 0;
      let left = 0;
      let arrow: "top" | "bottom" | "left" | "right" = "top";

      // Calculate position based on step.position or auto-detect
      const preferredPosition = step.position || "bottom";

      switch (preferredPosition) {
        case "bottom":
          top = rect.bottom + 16;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          arrow = "top";
          break;
        case "top":
          top = rect.top - tooltipHeight - 16;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          arrow = "bottom";
          break;
        case "left":
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - 16;
          arrow = "right";
          break;
        case "right":
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + 16;
          arrow = "left";
          break;
      }

      // Boundary detection
      if (left < 16) left = 16;
      if (left + tooltipWidth > window.innerWidth - 16) {
        left = window.innerWidth - tooltipWidth - 16;
      }
      if (top < 16) top = 16;
      if (top + tooltipHeight > window.innerHeight - 16) {
        top = window.innerHeight - tooltipHeight - 16;
      }

      setPosition({ top, left });
      setArrowPosition(arrow);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, { passive: true });

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isActive, currentStep, step]);

  // Highlight target element
  useEffect(() => {
    if (!isActive || !step) return;

    const target = document.querySelector(step.target);
    if (target) {
      target.classList.add("onboarding-highlight");
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return () => {
      if (target) {
        target.classList.remove("onboarding-highlight");
      }
    };
  }, [isActive, currentStep, step]);

  if (!isActive || !step) return null;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      {/* Backdrop */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-black/50" />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={cn(
          "fixed z-50 w-80 transition-all duration-300",
          !position && "opacity-0",
        )}
        style={{
          top: position?.top ?? 0,
          left: position?.left ?? 0,
        }}
      >
        {/* Arrow */}
        <div
          className={cn(
            "absolute h-3 w-3 rotate-45 bg-white",
            arrowPosition === "top" && "-top-1.5 -translate-x-1/2 left-1/2",
            arrowPosition === "bottom" &&
              "-bottom-1.5 -translate-x-1/2 left-1/2",
            arrowPosition === "left" && "-left-1.5 -translate-y-1/2 top-1/2",
            arrowPosition === "right" && "-right-1.5 -translate-y-1/2 top-1/2",
          )}
        />

        <Card className="relative p-6 shadow-2xl">
          {/* Progress bar */}
          <div className="absolute top-0 right-0 left-0 h-1 overflow-hidden rounded-t-lg bg-gray-100">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <span className="font-medium text-muted-foreground text-xs">
                Step {currentStep + 1} of {steps.length}
              </span>
              <h3 className="mt-1 font-semibold text-lg">{step.title}</h3>
            </div>
            <button
              onClick={skip}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <p className="mb-6 text-muted-foreground">{step.description}</p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={skip}
              className="text-muted-foreground"
            >
              Skip tour
            </Button>

            <div className="flex items-center gap-2">
              {!isFirstStep && (
                <Button variant="outline" size="sm" onClick={previous}>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back
                </Button>
              )}

              {isLastStep ? (
                <Button size="sm" onClick={complete}>
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Finish
                </Button>
              ) : (
                <Button size="sm" onClick={next}>
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* CSS for highlighting */}
      <style>{`
        .onboarding-highlight {
          position: relative;
          z-index: 51;
          box-shadow: 0 0 0 4px rgba(var(--primary), 0.3);
          border-radius: 4px;
          animation: pulse-ring 2s infinite;
        }

        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 4px rgba(var(--primary), 0.3);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(var(--primary), 0.1);
          }
          100% {
            box-shadow: 0 0 0 4px rgba(var(--primary), 0.3);
          }
        }
      `}</style>
    </>
  );
}
