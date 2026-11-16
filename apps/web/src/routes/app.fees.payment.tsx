/**
 * Online Payment Gateway - Secure fee payment processing
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import {
  Calculator,
  CheckCircle,
  CreditCard,
  FileText,
  Loader2,
  PieChart,
  Receipt,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/fees/payment")({
  component: PaymentPage,
});

// Sub-features navigation
const subFeatures = [
  { name: "Dashboard", href: "/app/fees", icon: PieChart },
  { name: "Fee Structure", href: "/app/fees/structure", icon: FileText },
  { name: "Collection", href: "/app/fees/collection", icon: Receipt },
  {
    name: "Online Payment",
    href: "/app/fees/payment",
    icon: CreditCard,
    active: true,
  },
  { name: "Expenses", href: "/app/fees/expenses", icon: Calculator },
  { name: "Salary", href: "/app/fees/salary", icon: Calculator },
  { name: "Budget", href: "/app/fees/budget", icon: Calculator },
  { name: "Reports", href: "/app/fees/reports", icon: FileText },
];

interface PaymentTransaction {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  feeType: string;
  status: "pending" | "completed" | "failed";
  paymentMethod: "card" | "upi" | "netbanking" | "wallet";
  transactionId?: string;
  createdAt: string;
}

function PaymentPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([
    {
      id: "TXN001",
      studentId: "STU001",
      studentName: "Rahul Sharma",
      amount: 25000,
      feeType: "Tuition Fee",
      status: "completed",
      paymentMethod: "card",
      transactionId: "TXN_123456789",
      createdAt: "2026-03-10",
    },
    {
      id: "TXN002",
      studentId: "STU002",
      studentName: "Priya Singh",
      amount: 12000,
      feeType: "Transport Fee",
      status: "pending",
      paymentMethod: "upi",
      createdAt: "2026-03-10",
    },
    {
      id: "TXN003",
      studentId: "STU003",
      studentName: "Amit Kumar",
      amount: 5000,
      feeType: "Exam Fee",
      status: "failed",
      paymentMethod: "netbanking",
      createdAt: "2026-03-09",
    },
  ]);

  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<PaymentTransaction | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const handleProcessPayment = async (transaction: PaymentTransaction) => {
    setProcessingPayment(true);
    setSelectedTransaction(transaction);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transaction.id
          ? {
              ...t,
              status: "completed" as const,
              transactionId: `TXN_${Date.now()}`,
            }
          : t,
      ),
    );

    setProcessingPayment(false);
    setSelectedTransaction(null);
    toast.success("Payment processed successfully");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return "💳";
      case "upi":
        return "📱";
      case "netbanking":
        return "🏦";
      case "wallet":
        return "👛";
      default:
        return "💰";
    }
  };

  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Sub-features Navigation */}
      <div className="flex flex-wrap gap-2">
        {subFeatures.map((feature) => (
          <Button
            key={feature.href}
            variant={feature.active ? "default" : "outline"}
            size="sm"
            asChild
          >
            <a href={feature.href}>
              <feature.icon className="mr-2 h-4 w-4" />
              {feature.name}
            </a>
          </Button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Online Payments</h1>
          <p className="text-muted-foreground">
            Secure fee collection through multiple payment methods
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ₹{totalRevenue.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              From completed transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Pending Amount
            </CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ₹{pendingAmount.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {Math.round(
                (transactions.filter((t) => t.status === "completed").length /
                  transactions.length) *
                  100,
              )}
              %
            </div>
            <p className="text-muted-foreground text-xs">
              Payment success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getMethodIcon(transaction.paymentMethod)}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.studentName}</p>
                    <p className="text-muted-foreground text-sm">
                      {transaction.feeType} • {transaction.studentId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">
                      ₹{transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {transaction.createdAt}
                    </p>
                  </div>
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                  {transaction.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleProcessPayment(transaction)}
                      disabled={
                        processingPayment &&
                        selectedTransaction?.id === transaction.id
                      }
                    >
                      {processingPayment &&
                      selectedTransaction?.id === transaction.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Process"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
