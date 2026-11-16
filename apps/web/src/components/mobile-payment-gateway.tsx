import { motion } from "framer-motion";
import {
  Building2,
  Check,
  CreditCard,
  GraduationCap,
  Loader2,
  QrCode,
  Receipt,
  Shield,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useOffline } from "../lib/offline-context";
import { loadScript } from "../lib/utils";

export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

export interface PaymentDetails {
  amount: number;
  studentId: string;
  studentName: string;
  class: string;
  feeType: string;
  dueDate: string;
}

interface MobilePaymentGatewayProps {
  paymentDetails: PaymentDetails;
  onSuccess: (paymentId: string, method: PaymentMethod) => void;
  onFailure: (error: string) => void;
  onClose: () => void;
}

const paymentMethods = [
  {
    id: "upi" as PaymentMethod,
    label: "UPI",
    icon: QrCode,
    description: "Google Pay, PhonePe, Paytm",
  },
  {
    id: "card" as PaymentMethod,
    label: "Card",
    icon: CreditCard,
    description: "Credit/Debit Card",
  },
  {
    id: "netbanking" as PaymentMethod,
    label: "Net Banking",
    icon: Building2,
    description: "All major banks",
  },
  {
    id: "wallet" as PaymentMethod,
    label: "Wallet",
    icon: Wallet,
    description: "Paytm, PhonePe, Amazon Pay",
  },
];

export function MobilePaymentGateway({
  paymentDetails,
  onSuccess,
  onFailure,
  onClose,
}: MobilePaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<
    "method" | "details" | "processing" | "success"
  >("method");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const { isOnline, queueAction } = useOffline();

  const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank",
    "Indian Bank",
  ];

  const wallets = [
    { id: "paytm", name: "Paytm", balance: "₹2,450" },
    { id: "phonepe", name: "PhonePe", balance: "₹1,200" },
    { id: "amazonpay", name: "Amazon Pay", balance: "₹890" },
    { id: "mobikwik", name: "MobiKwik", balance: "₹0" },
  ];

  useEffect(() => {
    // Load Razorpay script
    loadScript("https://checkout.razorpay.com/v1/checkout.js").catch(
      console.error,
    );
  }, []);

  const handlePayment = async () => {
    if (!isOnline) {
      // Queue for later
      queueAction({
        type: "create",
        entity: "payment",
        data: {
          studentId: paymentDetails.studentId,
          amount: paymentDetails.amount,
          method: selectedMethod,
          feeType: paymentDetails.feeType,
        },
      });
      onClose();
      return;
    }

    setIsProcessing(true);
    setPaymentStep("processing");

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Generate payment ID
      const id = `PAY${Date.now()}`;
      setPaymentId(id);

      // Success
      setPaymentStep("success");
      setShowReceipt(true);
      onSuccess(id, selectedMethod);
    } catch (error) {
      setPaymentStep("method");
      onFailure("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  if (showReceipt) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
        >
          <div className="bg-green-500 px-6 py-4 text-center text-white">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="font-bold text-xl">Payment Successful!</h2>
            <p className="text-green-100">Transaction ID: {paymentId}</p>
          </div>

          <div className="space-y-4 p-6">
            <div className="border-gray-200 border-b pb-4 dark:border-gray-800">
              <p className="text-center font-bold text-3xl text-gray-900 dark:text-gray-100">
                ₹{paymentDetails.amount.toLocaleString()}
              </p>
              <p className="mt-1 text-center text-gray-500 dark:text-gray-400">
                Paid via{" "}
                {paymentMethods.find((m) => m.id === selectedMethod)?.label}
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Student
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {paymentDetails.studentName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Class</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {paymentDetails.class}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Fee Type
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {paymentDetails.feeType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Date</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => window.print()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <Receipt className="h-4 w-4" />
                Print Receipt
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-h-[90vh] w-full max-w-lg overflow-hidden overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-xl">Pay Fees</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-4 text-sm text-white/90">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {paymentDetails.studentName}
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4" />
              {paymentDetails.class}
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Amount Display */}
          <div className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800">
            <p className="text-gray-500 text-sm dark:text-gray-400">
              Amount to Pay
            </p>
            <p className="mt-1 font-bold text-4xl text-gray-900 dark:text-gray-100">
              ₹{paymentDetails.amount.toLocaleString()}
            </p>
            <p className="mt-2 text-gray-500 text-sm dark:text-gray-400">
              {paymentDetails.feeType} • Due: {paymentDetails.dueDate}
            </p>
          </div>

          {/* Payment Methods */}
          {paymentStep === "method" && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Select Payment Method
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        selectedMethod === method.id
                          ? "border-primary bg-primary/5 dark:bg-primary/10"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                      }`}
                    >
                      <Icon
                        className={`mb-2 h-6 w-6 ${selectedMethod === method.id ? "text-primary" : "text-gray-400"}`}
                      />
                      <p
                        className={`font-medium ${selectedMethod === method.id ? "text-primary" : "text-gray-900 dark:text-gray-100"}`}
                      >
                        {method.label}
                      </p>
                      <p className="mt-1 text-gray-500 text-xs dark:text-gray-400">
                        {method.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPaymentStep("details")}
                className="w-full rounded-xl bg-primary py-3 font-medium text-white transition-colors hover:bg-primary/90"
              >
                Continue
              </button>
            </div>
          )}

          {/* Payment Details */}
          {paymentStep === "details" && (
            <div className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <button
                  onClick={() => setPaymentStep("method")}
                  className="text-gray-500 text-sm hover:text-gray-700"
                >
                  ← Back
                </button>
              </div>

              {/* UPI Payment */}
              {selectedMethod === "upi" && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                      Enter UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUpiId(e.target.value)
                      }
                      placeholder="name@upi"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                  <p className="text-gray-500 text-xs dark:text-gray-400">
                    You will receive a payment request on your UPI app
                  </p>
                </div>
              )}

              {/* Card Payment */}
              {selectedMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(formatCardNumber(e.target.value))
                      }
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                        Expiry
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) =>
                          setCardExpiry(formatExpiry(e.target.value))
                        }
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) =>
                          setCardCvv(
                            e.target.value.replace(/\D/g, "").slice(0, 3),
                          )
                        }
                        placeholder="123"
                        maxLength={3}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking */}
              {selectedMethod === "netbanking" && (
                <div className="space-y-4">
                  <label className="block font-medium text-gray-700 text-sm dark:text-gray-300">
                    Select Bank
                  </label>
                  <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-gray-200 p-2 dark:border-gray-700">
                    {banks.map((bank) => (
                      <label
                        key={bank}
                        className="flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <input
                          type="radio"
                          name="bank"
                          value={bank}
                          checked={selectedBank === bank}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSelectedBank(e.target.value)
                          }
                          className="h-4 w-4 text-primary"
                        />
                        <span className="text-gray-900 text-sm dark:text-gray-100">
                          {bank}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Wallet */}
              {selectedMethod === "wallet" && (
                <div className="space-y-4">
                  <label className="block font-medium text-gray-700 text-sm dark:text-gray-300">
                    Select Wallet
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {wallets.map((wallet) => (
                      <button
                        key={wallet.id}
                        onClick={() => setSelectedWallet(wallet.id)}
                        className={`rounded-xl border-2 p-4 text-left transition-all ${
                          selectedWallet === wallet.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <Wallet className="mb-2 h-5 w-5 text-gray-400" />
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {wallet.name}
                        </p>
                        <p className="text-gray-500 text-xs dark:text-gray-400">
                          Balance: {wallet.balance}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-500 text-sm dark:text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Payments are secured with 256-bit encryption</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full rounded-xl bg-primary py-3 font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${paymentDetails.amount.toLocaleString()}`
                )}
              </button>
            </div>
          )}

          {/* Processing */}
          {paymentStep === "processing" && (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="font-medium text-gray-900 text-lg dark:text-gray-100">
                Processing Payment...
              </p>
              <p className="mt-2 text-gray-500 text-sm dark:text-gray-400">
                Please do not close this window
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default MobilePaymentGateway;
