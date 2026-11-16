/**
 * Fee Collection Management - Track and manage fee payments
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createFileRoute } from "@tanstack/react-router";
import {
  Calculator,
  CheckCircle,
  FileText,
  PieChart,
  Receipt,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/fees/collection")({
  component: CollectionPage,
});

// Sub-features navigation
const subFeatures = [
  { name: "Dashboard", href: "/app/fees", icon: PieChart },
  { name: "Fee Structure", href: "/app/fees/structure", icon: FileText },
  {
    name: "Collection",
    href: "/app/fees/collection",
    icon: Receipt,
    active: true,
  },
  { name: "Online Payment", href: "/app/fees/payment", icon: Calculator },
  { name: "Expenses", href: "/app/fees/expenses", icon: Calculator },
  { name: "Salary", href: "/app/fees/salary", icon: Calculator },
  { name: "Budget", href: "/app/fees/budget", icon: Calculator },
  { name: "Reports", href: "/app/fees/reports", icon: FileText },
];

interface StudentFee {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  totalFees: number;
  paidAmount: number;
  pendingAmount: number;
  lastPayment: string;
  status: "paid" | "partial" | "pending";
}

function CollectionPage() {
  const [students, setStudents] = useState<StudentFee[]>([
    {
      id: "1",
      studentId: "STU001",
      studentName: "Rahul Sharma",
      class: "10-A",
      totalFees: 44000,
      paidAmount: 39000,
      pendingAmount: 5000,
      lastPayment: "2026-03-01",
      status: "partial",
    },
    {
      id: "2",
      studentId: "STU002",
      studentName: "Priya Singh",
      class: "9-B",
      totalFees: 44000,
      paidAmount: 44000,
      pendingAmount: 0,
      lastPayment: "2026-02-15",
      status: "paid",
    },
    {
      id: "3",
      studentId: "STU003",
      studentName: "Amit Kumar",
      class: "8-A",
      totalFees: 44000,
      paidAmount: 25000,
      pendingAmount: 19000,
      lastPayment: "2026-01-20",
      status: "partial",
    },
    {
      id: "4",
      studentId: "STU004",
      studentName: "Sneha Patel",
      class: "10-B",
      totalFees: 44000,
      paidAmount: 0,
      pendingAmount: 44000,
      lastPayment: "Never",
      status: "pending",
    },
  ]);

  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentFee | null>(
    null,
  );
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handleRecordPayment = () => {
    if (!selectedStudent || !paymentAmount) {
      toast.error("Please enter payment amount");
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount <= 0 || amount > selectedStudent.pendingAmount) {
      toast.error("Invalid payment amount");
      return;
    }

    setStudents((prev) =>
      prev.map((student) =>
        student.id === selectedStudent.id
          ? {
              ...student,
              paidAmount: student.paidAmount + amount,
              pendingAmount: student.pendingAmount - amount,
              lastPayment: new Date().toISOString().split("T")[0],
              status: student.pendingAmount - amount === 0 ? "paid" : "partial",
            }
          : student,
      ),
    );

    setIsPaymentDialogOpen(false);
    setSelectedStudent(null);
    setPaymentAmount("");
    toast.success("Payment recorded successfully");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalCollected = students.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalPending = students.reduce((sum, s) => sum + s.pendingAmount, 0);
  const collectionRate = Math.round(
    (totalCollected / (totalCollected + totalPending)) * 100,
  );

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
          <h1 className="font-bold text-3xl">Fee Collection</h1>
          <p className="text-muted-foreground">
            Track and manage student fee payments
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Collected
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ₹{totalCollected.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              From {students.filter((s) => s.status !== "pending").length}{" "}
              students
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
              ₹{totalPending.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">Outstanding fees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Collection Rate
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{collectionRate}%</div>
            <p className="text-muted-foreground text-xs">Overall completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Fee Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center space-x-4">
                  <User className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{student.studentName}</p>
                    <p className="text-muted-foreground text-sm">
                      {student.class} • {student.studentId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">
                      ₹{student.totalFees.toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Paid: ₹{student.paidAmount.toLocaleString()}
                    </p>
                    <p className="text-red-600 text-sm">
                      Pending: ₹{student.pendingAmount.toLocaleString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(student.status)}>
                    {student.status}
                  </Badge>
                  {student.pendingAmount > 0 && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsPaymentDialogOpen(true);
                      }}
                    >
                      Record Payment
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a fee payment for {selectedStudent?.studentName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount *
              </Label>
              <Input
                id="amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="col-span-3"
                placeholder="Enter payment amount"
                max={selectedStudent?.pendingAmount}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="method" className="text-right">
                Payment Method
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="online">Online Transfer</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRecordPayment}>Record Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
