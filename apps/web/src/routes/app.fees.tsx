import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DollarSign,
  Plus,
  Search,
  CreditCard,
  FileText,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  amount: number;
  paidAmount: number;
  status: string;
  dueDate: string | null;
}

export const Route = createFileRoute("/app/fees")({
  component: FeesPage,
});

async function fetchFees(status?: string): Promise<FeeRecord[]> {
  const params = status ? `?status=${status}` : "";
  const res = await fetch(`/api/fees${params}`);
  if (!res.ok) throw new Error("Failed to fetch fees");
  const data = await res.json();
  return data.fees || [];
}

async function createInvoice(
  data: Record<string, unknown>,
): Promise<FeeRecord> {
  const res = await fetch("/api/fees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create invoice");
  }
  return res.json();
}

async function processPayment(
  allocationId: string,
  studentId: string,
  amount: number,
): Promise<{ success: boolean; receiptNumber: string }> {
  const res = await fetch(`/api/fees/${allocationId}/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, amount }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to process payment");
  }
  return res.json();
}

function FeesPage() {
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const queryClient = useQueryClient();

  const {
    data: fees,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fees", statusFilter],
    queryFn: () => fetchFees(statusFilter),
  });

  const createMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
      toast.success("Invoice created successfully");
      setShowModal(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const paymentMutation = useMutation({
    mutationFn: ({
      allocationId,
      studentId,
      amount,
    }: {
      allocationId: string;
      studentId: string;
      amount: number;
    }) => processPayment(allocationId, studentId, amount),
    onSuccess: (data: { receiptNumber: string }) => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
      toast.success(`Payment processed. Receipt: ${data.receiptNumber}`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    createMutation.mutate(data);
  };

  const handlePayment = (fee: FeeRecord) => {
    toast.promise(
      paymentMutation.mutateAsync({
        allocationId: fee.id,
        studentId: fee.studentId,
        amount: fee.amount - fee.paidAmount,
      }),
      {
        loading: "Processing payment...",
        success: "Payment successful!",
        error: "Payment failed",
      },
    );
  };

  const stats = {
    total: fees?.reduce((sum: number, f: FeeRecord) => sum + f.amount, 0) || 0,
    collected:
      fees?.reduce((sum: number, f: FeeRecord) => sum + f.paidAmount, 0) || 0,
    pending:
      fees
        ?.filter((f: FeeRecord) => f.status === "pending")
        .reduce(
          (sum: number, f: FeeRecord) => sum + (f.amount - f.paidAmount),
          0,
        ) || 0,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fees Management</h1>
          <p className="text-gray-600">Track and manage fee collections</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-blue-700 text-sm font-medium">Total Fees</p>
          </div>
          <p className="text-2xl font-bold text-blue-800">
            ₹{stats.total.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-green-700 text-sm font-medium">Collected</p>
          </div>
          <p className="text-2xl font-bold text-green-800">
            ₹{stats.collected.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-yellow-700 text-sm font-medium">Pending</p>
          </div>
          <p className="text-2xl font-bold text-yellow-800">
            ₹{stats.pending.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-red-700 text-sm font-medium">Overdue</p>
          </div>
          <p className="text-2xl font-bold text-red-800">₹0</p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fees...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg border p-8 text-center text-red-600">
          Error loading fees. Please try again.
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
          <div className="p-4 border-b flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Paid</option>
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Classes</option>
              <option>Class 9-A</option>
              <option>Class 9-B</option>
              <option>Class 10-A</option>
            </select>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Class
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Paid
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {fees?.map((fee: FeeRecord) => (
                <tr key={fee.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">
                    {fee.studentName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {fee.className}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    ₹{fee.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    ₹{fee.paidAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        fee.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : fee.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {fee.status !== "completed" && (
                        <button
                          onClick={() => handlePayment(fee)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <CreditCard className="w-4 h-4" />
                          Collect
                        </button>
                      )}
                      <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm">
                        <FileText className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {fees?.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-600"
                  >
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-gray-400" />
                    </div>
                    <p>No fee records found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Invoice</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student
                </label>
                <select
                  name="studentId"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Student</option>
                  <option value="1">John Smith</option>
                  <option value="2">Emma Wilson</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fee Type
                </label>
                <select
                  name="feeType"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="tuition">Tuition Fee</option>
                  <option value="transport">Transport Fee</option>
                  <option value="library">Library Fee</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
