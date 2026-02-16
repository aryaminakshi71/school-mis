import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/app/fees/receipt/$id")({
  component: ReceiptPage,
});

function ReceiptPage() {
  const params = Route.useParams();
  const [isGenerating, setIsGenerating] = useState(false);

  const receiptData = {
    receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
    date: new Date().toLocaleDateString("en-IN"),
    studentName: "John Smith",
    class: "Class 9-A",
    fatherName: "James Smith",
    feeType: "Tuition Fee - January 2026",
    amount: "₹5,000",
    paymentMethod: "Cash",
    schoolName: "School MIS",
    schoolAddress: "123 Education Lane, City - 12345",
  };

  const handlePrint = () => {
    setIsGenerating(true);
    setTimeout(() => {
      window.print();
      setIsGenerating(false);
    }, 500);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/app/fees" className="text-primary hover:underline">
          ← Back to Fees
        </Link>
        <button
          onClick={handlePrint}
          disabled={isGenerating}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {isGenerating ? "Generating..." : "🖨️ Print Receipt"}
        </button>
      </div>

      <div
        id="receipt"
        className="rounded-lg border bg-card p-8 shadow-lg print:border-none print:shadow-none"
      >
        <div className="mb-6 border-b pb-6 text-center">
          <h1 className="font-bold text-2xl text-foreground">
            {receiptData.schoolName}
          </h1>
          <p className="text-muted-foreground">{receiptData.schoolAddress}</p>
          <div className="mt-2 inline-block rounded-full bg-primary/10 px-4 py-1 font-medium text-primary text-sm">
            Fee Receipt
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground text-sm">Receipt No.</p>
            <p className="font-medium">{receiptData.receiptNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm">Date</p>
            <p className="font-medium">{receiptData.date}</p>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-muted p-4">
          <h3 className="mb-3 font-medium text-foreground">Student Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{receiptData.studentName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Class</p>
              <p className="font-medium">{receiptData.class}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Father Name</p>
              <p className="font-medium">{receiptData.fatherName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Method</p>
              <p className="font-medium">{receiptData.paymentMethod}</p>
            </div>
          </div>
        </div>

        <table className="mb-6 w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left font-medium text-muted-foreground text-sm">
                Particulars
              </th>
              <th className="py-2 text-right font-medium text-muted-foreground text-sm">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3">{receiptData.feeType}</td>
              <td className="py-3 text-right font-medium">
                {receiptData.amount}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="py-3 font-bold">Total</td>
              <td className="py-3 text-right font-bold text-lg">
                {receiptData.amount}
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="border-t pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Thank you for your payment!
          </p>
          <p className="mt-2 text-muted-foreground text-xs">
            This is a computer-generated receipt.
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt, #receipt * {
            visibility: visible;
          }
          #receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
