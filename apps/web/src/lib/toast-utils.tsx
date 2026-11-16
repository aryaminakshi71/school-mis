import { AlertCircle, CheckCircle, Info, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
    icon: <CheckCircle className="h-4 w-4" />,
  });
};

export const showErrorToast = (message: string, description?: string) => {
  toast.error(message, {
    description,
    icon: <XCircle className="h-4 w-4" />,
  });
};

export const showWarningToast = (message: string, description?: string) => {
  toast.warning(message, {
    description,
    icon: <AlertCircle className="h-4 w-4" />,
  });
};

export const showInfoToast = (message: string, description?: string) => {
  toast.info(message, {
    description,
    icon: <Info className="h-4 w-4" />,
  });
};

export const showLoadingToast = (message: string, description?: string) => {
  return toast.loading(message, {
    description,
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
  });
};

export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};

// Action-specific toast helpers
export const actionToasts = {
  // Authentication
  loginSuccess: () => showSuccessToast("Login successful", "Welcome back!"),
  loginError: () =>
    showErrorToast("Login failed", "Please check your credentials"),
  logoutSuccess: () => showSuccessToast("Logged out", "See you next time!"),

  // Data operations
  saveSuccess: (item: string) => showSuccessToast(`${item} saved successfully`),
  saveError: (item: string) =>
    showErrorToast(`Failed to save ${item}`, "Please try again"),
  deleteSuccess: (item: string) =>
    showSuccessToast(`${item} deleted successfully`),
  deleteError: (item: string) =>
    showErrorToast(`Failed to delete ${item}`, "Please try again"),
  updateSuccess: (item: string) =>
    showSuccessToast(`${item} updated successfully`),
  updateError: (item: string) =>
    showErrorToast(`Failed to update ${item}`, "Please try again"),

  // Attendance
  attendanceMarked: () =>
    showSuccessToast("Attendance marked", "Your attendance has been recorded"),
  attendanceError: () =>
    showErrorToast("Attendance error", "Failed to mark attendance"),

  // Grades
  gradeSubmitted: () =>
    showSuccessToast("Grade submitted", "Student grade has been recorded"),
  gradeError: () =>
    showErrorToast("Grade submission failed", "Please try again"),

  // Assignments
  assignmentSubmitted: () =>
    showSuccessToast("Assignment submitted", "Your work has been saved"),
  assignmentError: () =>
    showErrorToast("Submission failed", "Please try again"),

  // Fees
  paymentSuccess: (amount: string) =>
    showSuccessToast("Payment successful", `₹${amount} has been paid`),
  paymentError: () =>
    showErrorToast("Payment failed", "Please check your payment details"),

  // Network
  offline: () =>
    showWarningToast("You are offline", "Some features may not work"),
  online: () => showSuccessToast("Back online", "Connection restored"),
  syncStarted: () => showInfoToast("Syncing data", "Please wait..."),
  syncComplete: () =>
    showSuccessToast("Sync complete", "All data is up to date"),

  // Queue
  actionQueued: (action: string) =>
    showInfoToast("Action queued", `${action} will be executed when online`),
  queueProcessing: () => showLoadingToast("Processing queued actions"),
  queueComplete: () => showSuccessToast("All actions completed"),

  // General
  operationSuccess: (operation: string) =>
    showSuccessToast(`${operation} completed`),
  operationError: (operation: string) =>
    showErrorToast(`${operation} failed`, "Please try again"),
  networkError: () =>
    showErrorToast("Network error", "Please check your connection"),
  serverError: () => showErrorToast("Server error", "Please try again later"),
};
