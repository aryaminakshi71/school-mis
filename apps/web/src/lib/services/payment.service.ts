export type PaymentGateway = "razorpay" | "stripe";

export interface PaymentConfig {
  gateway: PaymentGateway;
  razorpayKeyId?: string;
  stripePublicKey?: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  orderId?: string;
  amount?: number;
  currency?: string;
  status?: "pending" | "success" | "failed" | "cancelled";
  errorMessage?: string;
  paymentMethod?: string;
  timestamp?: Date;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "netbanking" | "wallet" | "upi";
  last4?: string;
  bank?: string;
  wallet?: string;
  upiId?: string;
  isDefault: boolean;
}

export interface SavedCard {
  id: string;
  network: "visa" | "mastercard" | "amex" | "rupay";
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface FeePayment {
  id: string;
  studentId: string;
  feeId: string;
  amount: number;
  paymentDate: Date;
  transactionId: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  receiptUrl?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

class PaymentService {
  private config: PaymentConfig = { gateway: "razorpay" };
  private savedMethods: PaymentMethod[] = [];
  private savedCards: SavedCard[] = [];

  constructor() {
    this.loadPaymentMethods();
  }

  private loadPaymentMethods() {
    const saved = localStorage.getItem("payment_methods");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.savedMethods = parsed.methods || [];
        this.savedCards = parsed.cards || [];
      } catch {
        this.savedMethods = [];
        this.savedCards = [];
      }
    }
  }

  private savePaymentMethods() {
    localStorage.setItem(
      "payment_methods",
      JSON.stringify({ methods: this.savedMethods, cards: this.savedCards }),
    );
  }

  configure(config: PaymentConfig) {
    this.config = { ...this.config, ...config };
  }

  async loadRazorpayScript(): Promise<boolean> {
    if (window.Razorpay) return true;

    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    if (this.config.gateway === "razorpay") {
      return this.initiateRazorpayPayment(request);
    } else {
      return this.initiateStripePayment(request);
    }
  }

  private async initiateRazorpayPayment(
    request: PaymentRequest,
  ): Promise<PaymentResponse> {
    const loaded = await this.loadRazorpayScript();
    if (!loaded) {
      return { success: false, errorMessage: "Failed to load Razorpay SDK" };
    }

    if (!this.config.razorpayKeyId) {
      return { success: false, errorMessage: "Razorpay key not configured" };
    }

    return new Promise((resolve) => {
      const options = {
        key: this.config.razorpayKeyId,
        amount: request.amount * 100,
        currency: request.currency,
        name: "School MIS",
        description: request.description,
        order_id: request.orderId,
        prefill: {
          name: request.customerName,
          email: request.customerEmail,
          contact: request.customerPhone || "",
        },
        notes: {
          student_id: request.metadata?.studentId || "",
          fee_id: request.metadata?.feeId || "",
        },
        theme: {
          color: "#2563eb",
        },
        handler: (response: any) => {
          resolve({
            success: true,
            transactionId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            amount: request.amount,
            currency: request.currency,
            status: "success",
            paymentMethod: "razorpay",
            timestamp: new Date(),
          });
        },
        modal: {
          ondismiss: () => {
            resolve({
              success: false,
              status: "cancelled",
              errorMessage: "Payment cancelled by user",
            });
          },
        },
      };

      try {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        resolve({
          success: false,
          errorMessage: "Failed to open payment window",
        });
      }
    });
  }

  private async initiateStripePayment(
    request: PaymentRequest,
  ): Promise<PaymentResponse> {
    if (!this.config.stripePublicKey) {
      return { success: false, errorMessage: "Stripe key not configured" };
    }

    return {
      success: false,
      errorMessage:
        "Stripe integration requires server-side implementation. Please configure backend API.",
    };
  }

  async createOrder(
    amount: number,
    currency: string = "INR",
    metadata?: Record<string, string>,
  ): Promise<{ orderId: string; amount: number } | null> {
    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency, metadata }),
      });

      if (!response.ok) throw new Error("Failed to create order");

      const data = await response.json();
      return { orderId: data.orderId, amount: data.amount };
    } catch (error) {
      console.error("Failed to create payment order:", error);
      return null;
    }
  }

  async verifyPayment(transactionId: string): Promise<boolean> {
    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId }),
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  async processFeePayment(
    studentId: string,
    feeId: string,
    amount: number,
    paymentMethod: string = "online",
  ): Promise<PaymentResponse> {
    const order = await this.createOrder(amount, "INR", { studentId, feeId });
    if (!order) {
      return { success: false, errorMessage: "Failed to create payment order" };
    }

    const request: PaymentRequest = {
      amount: order.amount / 100,
      currency: "INR",
      orderId: order.orderId,
      description: `Fee Payment - ${feeId}`,
      customerName: "Student/Parent",
      customerEmail: "parent@school.com",
      customerPhone: "+919999999999",
      metadata: { studentId, feeId },
    };

    const result = await this.initiatePayment(request);

    if (result.success) {
      await this.savePaymentRecord({
        id: `pay_${Date.now()}`,
        studentId,
        feeId,
        amount: result.amount || amount,
        paymentDate: new Date(),
        transactionId: result.transactionId || "",
        status: "completed",
        paymentMethod,
      });
    }

    return result;
  }

  private async savePaymentRecord(payment: FeePayment) {
    const payments = this.getPaymentHistory();
    payments.push(payment);
    localStorage.setItem("fee_payments", JSON.stringify(payments));
  }

  getPaymentHistory(): FeePayment[] {
    const saved = localStorage.getItem("fee_payments");
    if (saved) {
      try {
        return JSON.parse(saved).map((p: any) => ({
          ...p,
          paymentDate: new Date(p.paymentDate),
        }));
      } catch {
        return [];
      }
    }
    return [];
  }

  addSavedCard(card: SavedCard) {
    this.savedCards.push(card);
    this.savePaymentMethods();
  }

  removeSavedCard(cardId: string) {
    this.savedCards = this.savedCards.filter((c) => c.id !== cardId);
    this.savePaymentMethods();
  }

  setDefaultCard(cardId: string) {
    this.savedCards = this.savedCards.map((c) => ({
      ...c,
      isDefault: c.id === cardId,
    }));
    this.savePaymentMethods();
  }

  getSavedCards(): SavedCard[] {
    return [...this.savedCards];
  }

  async refundPayment(
    transactionId: string,
    amount?: number,
  ): Promise<{ success: boolean; refundId?: string; error?: string }> {
    try {
      const response = await fetch("/api/payments/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, amount }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message };
      }

      const data = await response.json();
      return { success: true, refundId: data.refundId };
    } catch (error) {
      return { success: false, error: "Refund failed" };
    }
  }

  getTransactionSummary(): {
    totalTransactions: number;
    totalAmount: number;
    successful: number;
    failed: number;
    pending: number;
  } {
    const payments = this.getPaymentHistory();
    return {
      totalTransactions: payments.length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      successful: payments.filter((p) => p.status === "completed").length,
      failed: payments.filter((p) => p.status === "failed").length,
      pending: payments.filter((p) => p.status === "pending").length,
    };
  }
}

export const paymentService = new PaymentService();

export function usePayment() {
  return {
    initiatePayment: paymentService.initiatePayment.bind(paymentService),
    processFeePayment: paymentService.processFeePayment.bind(paymentService),
    createOrder: paymentService.createOrder.bind(paymentService),
    verifyPayment: paymentService.verifyPayment.bind(paymentService),
    getPaymentHistory: paymentService.getPaymentHistory.bind(paymentService),
    getSavedCards: paymentService.getSavedCards.bind(paymentService),
    addSavedCard: paymentService.addSavedCard.bind(paymentService),
    removeSavedCard: paymentService.removeSavedCard.bind(paymentService),
    setDefaultCard: paymentService.setDefaultCard.bind(paymentService),
    refundPayment: paymentService.refundPayment.bind(paymentService),
    getTransactionSummary:
      paymentService.getTransactionSummary.bind(paymentService),
    configure: paymentService.configure.bind(paymentService),
  };
}

export default paymentService;
