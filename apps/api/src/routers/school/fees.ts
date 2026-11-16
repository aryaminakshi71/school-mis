/**
 * Fees Router
 *
 * oRPC router for fee management.
 */

import {
  feeCategories,
  feePayments,
  feeStructures,
  studentFeeAllocations,
  students,
} from "@school/storage";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../lib/db.js";
import { orgAuthed, pub } from "../../procedures/index.js";

export const feesRouter = {
  // Main fees list (for API client compatibility)
  list: pub
    .route({
      method: "GET",
      path: "/fees",
      summary: "Get all fee payments",
      tags: ["Fees"],
    })
    .output(z.object({ fees: z.array(z.any()) }))
    .handler(async () => {
      const db = getDb();
      const fees = await db
        .select({
          id: feePayments.id,
          studentId: feePayments.studentId,
          studentName: sql`${students.firstName} || ' ' || ${students.lastName}`,
          allocationId: feePayments.allocationId,
          categoryName: feeCategories.name,
          amount: feePayments.amount,
          paymentMethod: feePayments.paymentMethod,
          transactionId: feePayments.transactionId,
          status: feePayments.status,
          paymentDate: feePayments.paymentDate,
          createdAt: feePayments.createdAt,
        })
        .from(feePayments)
        .leftJoin(
          studentFeeAllocations,
          eq(feePayments.allocationId, studentFeeAllocations.id),
        )
        .leftJoin(students, eq(feePayments.studentId, students.id))
        .leftJoin(
          feeStructures,
          eq(studentFeeAllocations.feeStructureId, feeStructures.id),
        )
        .leftJoin(feeCategories, eq(feeStructures.categoryId, feeCategories.id))
        .orderBy(desc(feePayments.paymentDate));

      return { fees };
    }),

  // Fee Categories
  listCategories: pub
    .route({
      method: "GET",
      path: "/fee-categories",
      summary: "Get fee categories",
      tags: ["Fees"],
    })
    .output(z.array(z.any()))
    .handler(async () => {
      const db = getDb();
      const categories = await db
        .select()
        .from(feeCategories)
        .orderBy(feeCategories.name);

      return categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        type: cat.type,
        isRecurring: cat.isRecurring,
        createdAt: cat.createdAt,
      }));
    }),

  createCategory: orgAuthed
    .route({
      method: "POST",
      path: "/fee-categories",
      summary: "Create fee category",
      tags: ["Fees"],
    })
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        type: z.string(),
        isRecurring: z.boolean().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const [newCategory] = await db
        .insert(feeCategories)
        .values(input)
        .returning();

      return {
        id: newCategory.id,
        name: newCategory.name,
        description: newCategory.description,
        type: newCategory.type,
        isRecurring: newCategory.isRecurring,
        createdAt: newCategory.createdAt,
      };
    }),

  // Fee Structures
  listStructures: pub
    .route({
      method: "GET",
      path: "/fee-structures",
      summary: "Get fee structures",
      tags: ["Fees"],
    })
    .input(
      z.object({
        classId: z.string().uuid().optional(),
        sessionId: z.string().uuid().optional(),
      }),
    )
    .output(z.array(z.any()))
    .handler(async ({ input }) => {
      const db = getDb();
      const { classId, sessionId } = input;

      const conditions = [];
      if (classId) conditions.push(eq(feeStructures.classId, classId));
      if (sessionId) conditions.push(eq(feeStructures.sessionId, sessionId));

      const structures = await db
        .select({
          id: feeStructures.id,
          categoryId: feeStructures.categoryId,
          categoryName: feeCategories.name,
          classId: feeStructures.classId,
          sessionId: feeStructures.sessionId,
          amount: feeStructures.amount,
          lateFee: feeStructures.lateFee,
          dueDate: feeStructures.dueDate,
          createdAt: feeStructures.createdAt,
        })
        .from(feeStructures)
        .leftJoin(feeCategories, eq(feeStructures.categoryId, feeCategories.id))
        .where(and(...conditions))
        .orderBy(feeStructures.createdAt);

      return structures;
    }),

  createStructure: orgAuthed
    .route({
      method: "POST",
      path: "/fee-structures",
      summary: "Create fee structure",
      tags: ["Fees"],
    })
    .input(
      z.object({
        categoryId: z.string().uuid(),
        classId: z.string().uuid().optional(),
        sessionId: z.string().uuid(),
        amount: z.number(),
        lateFee: z.number().optional(),
        dueDate: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const [newStructure] = await db
        .insert(feeStructures)
        .values({
          ...input,
          amount: input.amount.toString(),
          lateFee: input.lateFee?.toString(),
        })
        .returning();

      return {
        id: newStructure.id,
        categoryId: newStructure.categoryId,
        classId: newStructure.classId,
        sessionId: newStructure.sessionId,
        amount: newStructure.amount,
        lateFee: newStructure.lateFee,
        dueDate: newStructure.dueDate,
        createdAt: newStructure.createdAt,
      };
    }),

  // Student Allocations
  listAllocations: pub
    .route({
      method: "GET",
      path: "/student-fee-allocations",
      summary: "Get student allocations",
      tags: ["Fees"],
    })
    .input(
      z.object({
        studentId: z.string().uuid().optional(),
        classId: z.string().uuid().optional(),
      }),
    )
    .output(z.array(z.any()))
    .handler(async ({ input }) => {
      const db = getDb();
      const { studentId, classId } = input;

      const conditions = [];
      if (studentId)
        conditions.push(eq(studentFeeAllocations.studentId, studentId));
      if (classId) conditions.push(eq(students.classId, classId));

      const allocations = await db
        .select({
          id: studentFeeAllocations.id,
          studentId: studentFeeAllocations.studentId,
          studentName: sql`${students.firstName} || ' ' || ${students.lastName}`,
          feeStructureId: studentFeeAllocations.feeStructureId,
          categoryName: feeCategories.name,
          amount: studentFeeAllocations.amount,
          discount: studentFeeAllocations.discount,
          finalAmount: sql`${studentFeeAllocations.amount} - COALESCE(${studentFeeAllocations.discount}, 0)`,
          status: studentFeeAllocations.status,
          createdAt: studentFeeAllocations.createdAt,
        })
        .from(studentFeeAllocations)
        .leftJoin(students, eq(studentFeeAllocations.studentId, students.id))
        .leftJoin(
          feeStructures,
          eq(studentFeeAllocations.feeStructureId, feeStructures.id),
        )
        .leftJoin(feeCategories, eq(feeStructures.categoryId, feeCategories.id))
        .where(and(...conditions))
        .orderBy(studentFeeAllocations.createdAt);

      return allocations;
    }),

  createAllocation: orgAuthed
    .route({
      method: "POST",
      path: "/student-fee-allocations",
      summary: "Create allocation",
      tags: ["Fees"],
    })
    .input(
      z.object({
        studentId: z.string().uuid(),
        feeStructureId: z.string().uuid(),
        amount: z.number(),
        discount: z.number().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const [newAllocation] = await db
        .insert(studentFeeAllocations)
        .values({
          ...input,
          amount: input.amount.toString(),
          discount: input.discount?.toString(),
          status: "pending",
        })
        .returning();

      return {
        id: newAllocation.id,
        studentId: newAllocation.studentId,
        feeStructureId: newAllocation.feeStructureId,
        amount: newAllocation.amount,
        discount: newAllocation.discount,
        status: newAllocation.status,
        createdAt: newAllocation.createdAt,
      };
    }),

  // Payments
  listPayments: pub
    .route({
      method: "GET",
      path: "/fee-payments",
      summary: "Get payments",
      tags: ["Fees"],
    })
    .input(
      z.object({
        studentId: z.string().uuid().optional(),
        status: z.string().optional(),
      }),
    )
    .output(z.array(z.any()))
    .handler(async ({ input }) => {
      const db = getDb();
      const { studentId, status } = input;

      const conditions = [];
      if (studentId) conditions.push(eq(feePayments.studentId, studentId));
      if (status) conditions.push(eq(feePayments.status, status));

      const payments = await db
        .select({
          id: feePayments.id,
          studentId: feePayments.studentId,
          studentName: sql`${students.firstName} || ' ' || ${students.lastName}`,
          allocationId: feePayments.allocationId,
          categoryName: feeCategories.name,
          amount: feePayments.amount,
          paymentMethod: feePayments.paymentMethod,
          transactionId: feePayments.transactionId,
          status: feePayments.status,
          paymentDate: feePayments.paymentDate,
          createdAt: feePayments.createdAt,
        })
        .from(feePayments)
        .leftJoin(
          studentFeeAllocations,
          eq(feePayments.allocationId, studentFeeAllocations.id),
        )
        .leftJoin(students, eq(feePayments.studentId, students.id))
        .leftJoin(
          feeStructures,
          eq(studentFeeAllocations.feeStructureId, feeStructures.id),
        )
        .leftJoin(feeCategories, eq(feeStructures.categoryId, feeCategories.id))
        .where(and(...conditions))
        .orderBy(desc(feePayments.paymentDate));

      return payments;
    }),

  createPayment: orgAuthed
    .route({
      method: "POST",
      path: "/fee-payments",
      summary: "Create payment",
      tags: ["Fees"],
    })
    .input(
      z.object({
        studentId: z.string().uuid(),
        allocationId: z.string().uuid(),
        amount: z.number(),
        paymentMethod: z.string().optional(),
        transactionId: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const [newPayment] = await db
        .insert(feePayments)
        .values({
          ...input,
          amount: input.amount.toString(),
          status: "completed",
          paymentDate: new Date(),
        })
        .returning();

      return {
        id: newPayment.id,
        studentId: newPayment.studentId,
        allocationId: newPayment.allocationId,
        amount: newPayment.amount,
        paymentMethod: newPayment.paymentMethod,
        transactionId: newPayment.transactionId,
        status: newPayment.status,
        paymentDate: newPayment.paymentDate,
        createdAt: newPayment.createdAt,
      };
    }),

  getPaymentHistory: pub
    .route({
      method: "GET",
      path: "/fee-payments/{id}/history",
      summary: "Get payment history",
      tags: ["Fees"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.array(z.any()))
    .handler(async ({ input }) => {
      const db = getDb();
      const { id } = input;

      const history = await db
        .select({
          id: feePayments.id,
          studentId: feePayments.studentId,
          studentName: sql`${students.firstName} || ' ' || ${students.lastName}`,
          allocationId: feePayments.allocationId,
          categoryName: feeCategories.name,
          amount: feePayments.amount,
          paymentMethod: feePayments.paymentMethod,
          transactionId: feePayments.transactionId,
          status: feePayments.status,
          paymentDate: feePayments.paymentDate,
          createdAt: feePayments.createdAt,
        })
        .from(feePayments)
        .leftJoin(
          studentFeeAllocations,
          eq(feePayments.allocationId, studentFeeAllocations.id),
        )
        .leftJoin(students, eq(feePayments.studentId, students.id))
        .leftJoin(
          feeStructures,
          eq(studentFeeAllocations.feeStructureId, feeStructures.id),
        )
        .leftJoin(feeCategories, eq(feeStructures.categoryId, feeCategories.id))
        .where(eq(feePayments.studentId, id))
        .orderBy(desc(feePayments.paymentDate));

      return history;
    }),
};
