import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWebSocket } from "@/lib/websocket-context";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FeePaymentUpdate {
  studentId: string;
  studentName: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: "completed" | "failed" | "pending";
  feeType: string;
  timestamp: Date;
}

interface FeeStats {
  totalCollected: number;
  pendingAmount: number;
  overdueAmount: number;
  monthlyTarget: number;
  collectionRate: number;
}

export const RealTimeFees = () => {
  const { isConnected, lastFeeUpdate, subscribeToUpdates } = useWebSocket();
  const [recentPayments, setRecentPayments] = useState<FeePaymentUpdate[]>([]);

  // Subscribe to fee payment updates
  useEffect(() => {
    subscribeToUpdates(["fee_payment_update"]);
  }, [subscribeToUpdates]);

  // Handle live fee payment updates
  useEffect(() => {
    if (lastFeeUpdate) {
      const update: FeePaymentUpdate = {
        studentId: lastFeeUpdate.studentId,
        studentName: `Student ${lastFeeUpdate.studentId.slice(-4)}`, // Mock name
        amount: lastFeeUpdate.amount,
        paymentMethod: lastFeeUpdate.paymentMethod,
        transactionId: lastFeeUpdate.transactionId,
        status: lastFeeUpdate.status,
        feeType: "Tuition Fee", // Mock fee type
        timestamp: lastFeeUpdate.timestamp,
      };

      setRecentPayments((prev) => [update, ...prev.slice(0, 9)]); // Keep last 10 payments
    }
  }, [lastFeeUpdate]);

  const {
    data: feeStats,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["fee-stats"],
    queryFn: async (): Promise<FeeStats> => {
      // Mock data - replace with real API call
      return {
        totalCollected: 285000,
        pendingAmount: 12500,
        overdueAmount: 8500,
        monthlyTarget: 300000,
        collectionRate: 95,
      };
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing fee data...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl">Live Fee Collection</h2>
          <p className="text-muted-foreground">
            Real-time fee payment tracking and collection analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Live" : "Offline"}
          </Badge>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Fee Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Collected
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ₹{feeStats?.totalCollected.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Pending Amount
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ₹{feeStats?.pendingAmount.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Overdue Amount
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ₹{feeStats?.overdueAmount.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">Past due date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Collection Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {feeStats?.collectionRate}%
            </div>
            <p className="text-muted-foreground text-xs">Of monthly target</p>
          </CardContent>
        </Card>
      </div>

      {/* Collection Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Collection Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progress to Target</span>
              <span>
                ₹{feeStats?.totalCollected.toLocaleString()} / ₹
                {feeStats?.monthlyTarget.toLocaleString()}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-200">
              <div
                className="h-3 rounded-full bg-blue-600 transition-all duration-500"
                style={{
                  width: `${Math.min(((feeStats?.totalCollected || 0) / (feeStats?.monthlyTarget || 1)) * 100, 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-muted-foreground text-xs">
              <span>{feeStats?.collectionRate}% achieved</span>
              <span>
                ₹
                {(feeStats?.monthlyTarget || 0) -
                  (feeStats?.totalCollected || 0)}{" "}
                remaining
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Payment Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Live Payment Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPayments.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">
              No recent payment activity
            </p>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((payment, index) => (
                <div
                  key={`${payment.transactionId}-${payment.timestamp.getTime()}`}
                  className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
                >
                  <div
                    className={`rounded-full p-1 ${
                      payment.status === "completed"
                        ? "bg-green-100"
                        : payment.status === "pending"
                          ? "bg-yellow-100"
                          : "bg-red-100"
                    }`}
                  >
                    {getStatusIcon(payment.status)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {payment.studentName} paid{" "}
                      <span className="font-semibold text-green-600">
                        ₹{payment.amount.toLocaleString()}
                      </span>
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {payment.feeType} • {payment.paymentMethod} •{" "}
                      {payment.transactionId}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {payment.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusColor(payment.status)}
                  >
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4 text-center">
              <div className="font-bold text-2xl text-green-600">65%</div>
              <p className="text-muted-foreground text-sm">Online Payment</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="font-bold text-2xl text-blue-600">25%</div>
              <p className="text-muted-foreground text-sm">Bank Transfer</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="font-bold text-2xl text-purple-600">10%</div>
              <p className="text-muted-foreground text-sm">Cash Payment</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
