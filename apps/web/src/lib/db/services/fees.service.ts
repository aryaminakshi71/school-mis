import { db, feePayments } from "@school/storage";
import { desc, eq, sql } from "drizzle-orm";

export interface FeePayment {
  id: string;
  studentId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod?: string;
  status: "pending" | "completed" | "failed";
  receiptNumber: string;
}

export type FeePaymentCreateInput = Omit<FeePayment, "id" | "receiptNumber"> & {
  allocationId: string;
};

export const mapFeePaymentRow = (
  row: typeof feePayments.$inferSelect,
): FeePayment => ({
  id: row.id,
  studentId: row.studentId,
  amount: Number(row.amount || 0),
  paymentDate: row.paymentDate || new Date(),
  paymentMethod: row.paymentMethod || undefined,
  status: (row.status || "pending") as "pending" | "completed" | "failed",
  receiptNumber: row.receiptNumber || "",
});

export const feesService = {
  async list(studentId?: string): Promise<FeePayment[]> {
    const baseQuery = db
      .select()
      .from(feePayments)
      .orderBy(desc(feePayments.paymentDate));

    const result = studentId
      ? await baseQuery.where(eq(feePayments.studentId, studentId))
      : await baseQuery;

    return result.map(mapFeePaymentRow);
  },

  async getStats(): Promise<{ totalCollected: number; pending: number }> {
    const [completed, pending] = await Promise.all([
      db
        .select({ total: sql<number>`sum(${feePayments.amount})` })
        .from(feePayments)
        .where(eq(feePayments.status, "completed")),
      db
        .select({ total: sql<number>`sum(${feePayments.amount})` })
        .from(feePayments)
        .where(eq(feePayments.status, "pending")),
    ]);

    return {
      totalCollected: Number(completed[0]?.total || 0),
      pending: Number(pending[0]?.total || 0),
    };
  },

  async create(data: FeePaymentCreateInput): Promise<FeePayment> {
    const receiptNumber = `RCP${Date.now()}`;
    const result = await db
      .insert(feePayments)
      .values({
        studentId: data.studentId,
        allocationId: data.allocationId,
        amount: data.amount.toString(),
        paymentDate: data.paymentDate,
        paymentMethod: data.paymentMethod,
        status: data.status || "pending",
        receiptNumber,
      })
      .returning();

    const created = result[0];
    if (!created) {
      throw new Error("Failed to create fee payment");
    }

    return mapFeePaymentRow(created);
  },
};
