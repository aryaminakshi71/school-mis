import {
  SAC_EDUCATION,
  amountInWords,
  calculateGst,
  formatINR,
} from "@/lib/gst";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app/fees/receipt/$id")({
  component: ReceiptPage,
});

interface PaymentData {
  payment: {
    id: string;
    amount: string;
    paymentDate: string;
    paymentMethod?: string;
    receiptNumber?: string;
    transactionId?: string;
    gstRate?: string;
    cgstAmount?: string;
    sgstAmount?: string;
    igstAmount?: string;
    hsnSac?: string;
    placeOfSupply?: string;
  } | null;
  student: {
    firstName?: string;
    lastName?: string;
    admissionNumber?: string;
    className?: string;
    fatherName?: string;
  } | null;
  allocation: { totalAmount?: string; feeStructureId?: string } | null;
}

function ReceiptPage() {
  const { id } = Route.useParams();
  const [data, setData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/fees/payments/${id}`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || "Failed to load receipt");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading receipt…</div>;
  if (error || !data?.payment) {
    return (
      <div className="mx-auto max-w-2xl p-8">
        <p className="text-red-600">{error || "Receipt not found"}</p>
        <Link to="/app/fees" className="text-primary hover:underline">
          ← Back to Fees
        </Link>
      </div>
    );
  }

  const { payment, student } = data;
  const base = Number(payment.amount) || 0;
  const gstRate = Number(payment.gstRate) || 0;
  const isInterState =
    (payment.placeOfSupply || "").toUpperCase() !== "HARYANA";
  const gst = gstRate > 0 ? calculateGst(base, gstRate, isInterState) : null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link to="/app/fees" className="text-primary hover:underline">
          ← Back to Fees
        </Link>
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Print / Save PDF
        </button>
      </div>

      <div className="rounded-lg border bg-white p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">SchoolAI</h1>
            <p className="text-sm text-gray-600">Fee Receipt</p>
          </div>
          <div className="text-right text-sm">
            <div>
              <span className="text-gray-500">Receipt:</span>{" "}
              {payment.receiptNumber || payment.id.slice(0, 8)}
            </div>
            <div>
              <span className="text-gray-500">Date:</span>{" "}
              {payment.paymentDate
                ? new Date(payment.paymentDate).toLocaleDateString("en-IN")
                : "-"}
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Student</div>
            <div className="font-medium">
              {student?.firstName} {student?.lastName}
            </div>
            {student?.admissionNumber && (
              <div className="text-gray-500">
                Adm: {student.admissionNumber}
              </div>
            )}
            {student?.fatherName && (
              <div className="text-gray-500">Father: {student.fatherName}</div>
            )}
          </div>
          <div>
            <div className="text-gray-500">Method</div>
            <div className="font-medium">{payment.paymentMethod || "-"}</div>
            {payment.transactionId && (
              <div className="text-gray-500">Txn: {payment.transactionId}</div>
            )}
            {student?.className && (
              <div className="text-gray-500">Class: {student.className}</div>
            )}
          </div>
        </div>

        <table className="mb-4 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-2">Description</th>
              <th className="py-2">SAC</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Tuition / Fee payment</td>
              <td className="py-2">{payment.hsnSac || SAC_EDUCATION}</td>
              <td className="py-2 text-right">{formatINR(base)}</td>
            </tr>
            {gst && (
              <>
                <tr>
                  <td className="py-1" />
                  <td className="py-1 text-gray-500">
                    CGST ({(gstRate / 2).toFixed(1)}%)
                  </td>
                  <td className="py-1 text-right">{formatINR(gst.cgst)}</td>
                </tr>
                <tr>
                  <td className="py-1" />
                  <td className="py-1 text-gray-500">
                    SGST ({(gstRate / 2).toFixed(1)}%)
                  </td>
                  <td className="py-1 text-right">{formatINR(gst.sgst)}</td>
                </tr>
                {gst.igst > 0 && (
                  <tr>
                    <td className="py-1" />
                    <td className="py-1 text-gray-500">IGST ({gstRate}%)</td>
                    <td className="py-1 text-right">{formatINR(gst.igst)}</td>
                  </tr>
                )}
              </>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t font-bold">
              <td className="py-2" colSpan={2}>
                Total Paid
              </td>
              <td className="py-2 text-right">
                {formatINR(gst ? gst.total : base)}
              </td>
            </tr>
          </tfoot>
        </table>

        <p className="text-sm text-gray-600">
          {amountInWords(gst ? gst.total : base)}
        </p>
        <p className="mt-6 text-xs text-gray-400">
          This is a computer-generated receipt. GST is shown only where
          applicable to the fee type.
        </p>
      </div>
    </div>
  );
}
