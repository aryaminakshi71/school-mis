import { createFileRoute } from "@tanstack/react-router";
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <a href="/app/fees" className="text-blue-600 hover:underline">
          ← Back to Fees
        </a>
        <button
          onClick={handlePrint}
          disabled={isGenerating}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isGenerating ? "Generating..." : "🖨️ Print Receipt"}
        </button>
      </div>

      <div
        id="receipt"
        className="bg-white border p-8 rounded-lg shadow-lg print:shadow-none print:border-none"
      >
        <div className="text-center border-b pb-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {receiptData.schoolName}
          </h1>
          <p className="text-gray-600">{receiptData.schoolAddress}</p>
          <div className="mt-2 inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
            Fee Receipt
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Receipt No.</p>
            <p className="font-medium">{receiptData.receiptNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{receiptData.date}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Student Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium">{receiptData.studentName}</p>
            </div>
            <div>
              <p className="text-gray-500">Class</p>
              <p className="font-medium">{receiptData.class}</p>
            </div>
            <div>
              <p className="text-gray-500">Father Name</p>
              <p className="font-medium">{receiptData.fatherName}</p>
            </div>
            <div>
              <p className="text-gray-500">Payment Method</p>
              <p className="font-medium">{receiptData.paymentMethod}</p>
            </div>
          </div>
        </div>

        <table className="w-full mb-6">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 text-sm font-medium text-gray-600">
                Particulars
              </th>
              <th className="text-right py-2 text-sm font-medium text-gray-600">
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

        <div className="text-center pt-6 border-t">
          <p className="text-sm text-gray-500">Thank you for your payment!</p>
          <p className="text-xs text-gray-400 mt-2">
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
