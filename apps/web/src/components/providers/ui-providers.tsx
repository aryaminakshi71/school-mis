import {
  CommandPaletteProvider,
  LoadingProvider,
  OnboardingProvider,
  ThemeProvider,
  ToastProvider,
} from "@/lib/ui-hooks";
import { ReactNode } from "react";
import { PostHogProvider } from "./posthog-provider";

interface UIProvidersProps {
  children: ReactNode;
}

export function UIProviders({ children }: UIProvidersProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <LoadingProvider>
          <CommandPaletteProvider>
            <OnboardingProvider>
              <PostHogProvider>{children}</PostHogProvider>
            </OnboardingProvider>
          </CommandPaletteProvider>
        </LoadingProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
