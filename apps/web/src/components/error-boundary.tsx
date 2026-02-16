/**
 * Global Error Boundary
 *
 * Catches React errors and displays a user-friendly error page
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getErrorDetails } from "@/lib/error-handler";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    const errorDetails = getErrorDetails(error);
    console.error("ErrorBoundary caught an error:", {
      ...errorDetails,
      componentStack: errorInfo.componentStack,
    });

    // Send to error tracking service (e.g., Sentry)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/app";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error } = this.state;
      const isDevelopment = process.env.NODE_ENV === "development";

      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted via-background to-muted p-4">
          <Card className="w-full max-w-2xl shadow-lg">
            <CardHeader className="pb-4 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-2xl text-foreground">
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                We're sorry, but something unexpected happened. Our team has
                been notified and is working on a fix.
              </p>

              {isDevelopment && error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                  <p className="mb-2 font-semibold text-destructive text-sm">
                    Error Details (Development Only):
                  </p>
                  <pre className="max-h-48 overflow-auto text-destructive text-xs">
                    {error.toString()}
                    {this.state.errorInfo?.componentStack && (
                      <div className="mt-2 border-destructive/30 border-t pt-2">
                        {this.state.errorInfo.componentStack}
                      </div>
                    )}
                  </pre>
                </div>
              )}

              <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Page
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                  <Home className="h-4 w-4" />
                  Go to Dashboard
                </Button>
              </div>

              {isDevelopment && (
                <div className="mt-4 border-t pt-4 text-center">
                  <p className="text-muted-foreground text-xs">
                    This error boundary is only visible in development mode.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
