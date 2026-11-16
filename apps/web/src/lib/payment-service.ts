import { addBreadcrumb, captureException } from "./sentry";

// Helper function for adding breadcrumbs with consistent format
function logBreadcrumb(
  message: string,
  category: string,
  level: "info" | "warning" | "error" = "info",
) {
  addBreadcrumb({
    message,
    category,
    level,
  });
}

// Helper to capture exception with context
function captureExceptionWithContext(
  error: Error,
  context: Record<string, any>,
) {
  captureException(error, {
    extra: context,
  });
}

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentIntentId?: string;
  error?: string;
  status: "pending" | "completed" | "failed" | "cancelled";
}

export interface RefundData {
  transactionId: string;
  amount?: number; // Partial refund if specified
  reason: string;
}

class PaymentService {
  private stripePublishableKey: string;
  private razorpayKeyId: string;

  constructor() {
    this.stripePublishableKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
    this.razorpayKeyId = process.env.VITE_RAZORPAY_KEY_ID || "";
  }

  // Stripe Integration
  async createStripePaymentIntent(data: PaymentData): Promise<PaymentResult> {
    try {
      logBreadcrumb("Creating Stripe payment intent", "payment", "info");

      const response = await fetch("/api/payments/stripe/create-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Stripe API error: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        success: true,
        paymentIntentId: result.paymentIntentId,
        status: "pending",
      };
    } catch (error) {
      captureExceptionWithContext(error as Error, {
        paymentMethod: "stripe",
        amount: data.amount,
      });
      return {
        success: false,
        error: (error as Error).message,
        status: "failed",
      };
    }
  }

  async confirmStripePayment(
    paymentIntentId: string,
    paymentMethodId: string,
  ): Promise<PaymentResult> {
    try {
      logBreadcrumb("Confirming Stripe payment", "payment", "info");

      const response = await fetch("/api/payments/stripe/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentIntentId, paymentMethodId }),
      });

      if (!response.ok) {
        throw new Error(`Stripe confirmation error: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        success: result.success,
        transactionId: result.transactionId,
        status: result.status,
      };
    } catch (error) {
      captureExceptionWithContext(error as Error, {
        paymentMethod: "stripe",
        paymentIntentId,
      });
      return {
        success: false,
        error: (error as Error).message,
        status: "failed",
      };
    }
  }

  // Razorpay Integration (for Indian market)
  async createRazorpayOrder(
    data: PaymentData,
  ): Promise<PaymentResult & { orderId?: string }> {
    try {
      logBreadcrumb("Creating Razorpay order", "payment", "info");

      const response = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          amount: Math.round(data.amount * 100), // Convert to paisa
        }),
      });

      if (!response.ok) {
        throw new Error(`Razorpay API error: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        success: true,
        orderId: result.orderId,
        status: "pending",
      };
    } catch (error) {
      captureExceptionWithContext(error as Error, {
        paymentMethod: "razorpay",
        amount: data.amount,
      });
      return {
        success: false,
        error: (error as Error).message,
        status: "failed",
      };
    }
  }

  async verifyRazorpayPayment(
    orderId: string,
    paymentId: string,
    signature: string,
  ): Promise<PaymentResult> {
    try {
      logBreadcrumb("Verifying Razorpay payment", "payment", "info");

      const response = await fetch("/api/payments/razorpay/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, paymentId, signature }),
      });

      if (!response.ok) {
        throw new Error(`Razorpay verification error: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        success: result.success,
        transactionId: result.transactionId,
        status: result.status,
      };
    } catch (error) {
      captureExceptionWithContext(error as Error, {
        paymentMethod: "razorpay",
        orderId,
      });
      return {
        success: false,
        error: (error as Error).message,
        status: "failed",
      };
    }
  }

  // PayPal Integration
  async createPayPalOrder(
    data: PaymentData,
  ): Promise<PaymentResult & { paypalOrderId?: string }> {
    try {
      logBreadcrumb("Creating PayPal order", "payment", "info");

      const response = await fetch("/api/payments/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`PayPal API error: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        success: true,
        paypalOrderId: result.paypalOrderId,
        status: "pending",
      };
    } catch (error) {
      captureExceptionWithContext(error as Error, {
        paymentMethod: "paypal",
        amount: data.amount,
      });
      return {
        success: false,
        error: (error as Error).message,
        status: "failed",
      };
    }
  }

  async capturePayPalPayment(paypalOrderId: string): Promise<PaymentResult> {
    try {
      logBreadcrumb("Capturing PayPal payment", "payment", "info");

      const response = await fetch("/api/payments/paypal/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paypalOrderId }),
      });

      if (!response.ok) {
        throw new Error(`PayPal capture error: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        success: result.success,
        transactionId: result.transactionId,
        status: result.status,
      };
    } catch (error) {
      captureExceptionWithContext(error as Error, {
        paymentMethod: "paypal",
        paypalOrderId,
      });
      return {
        success: false,
        error: (error as Error).message,
        status: "failed",
      };
    }
  }

  // Refund functionality
  async processRefund(data: RefundData): Promise<PaymentResult> {
    try {
      logBreadcrumb("Processing refund", "payment", "info");

      const response = await fetch("/api/payments/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Refund API error: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        success: result.success,
        transactionId: result.refundId,
        status: "completed",
      };
    } catch (error) {
      captureExceptionWithContext(error as Error, {
        operation: "refund",
        transactionId: data.transactionId,
      });
      return {
        success: false,
        error: (error as Error).message,
        status: "failed",
      };
    }
  }

  // Fee collection specific methods
  async collectSchoolFees(
    studentId: string,
    feeType: "tuition" | "exam" | "transport" | "other",
    amount: number,
    dueDate: string,
    description: string,
  ): Promise<PaymentResult> {
    const paymentData: PaymentData = {
      amount,
      currency: "INR", // Default to INR, can be configurable
      description: `${feeType} fees: ${description}`,
      customerEmail: "", // Would be fetched from student record
      customerName: "", // Would be fetched from student record
      metadata: {
        studentId,
        feeType,
        dueDate,
        description,
      },
    };

    // Use Razorpay for Indian schools by default
    return this.createRazorpayOrder(paymentData);
  }

  async sendPaymentReminder(
    studentId: string,
    amount: number,
    dueDate: string,
    feeType: string,
  ): Promise<void> {
    try {
      await fetch("/api/payments/send-reminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          amount,
          dueDate,
          feeType,
        }),
      });
    } catch (error) {
      captureExceptionWithContext(error as Error, {
        operation: "payment_reminder",
        studentId,
      });
    }
  }

  // Get payment history
  async getPaymentHistory(studentId?: string, limit = 50): Promise<any[]> {
    try {
      const params = new URLSearchParams();
      if (studentId) params.append("studentId", studentId);
      params.append("limit", limit.toString());

      const response = await fetch(`/api/payments/history?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch payment history");
      }

      return await response.json();
    } catch (error) {
      captureExceptionWithContext(error as Error, {
        operation: "get_payment_history",
        studentId,
      });
      return [];
    }
  }
}

export const paymentService = new PaymentService();
