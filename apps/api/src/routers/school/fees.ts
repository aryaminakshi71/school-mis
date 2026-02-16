/**
 * Fees Router
 *
 * oRPC router for fee management.
 */

import { z } from "zod";
import { orgAuthed, pub } from "../../procedures/index.js";

export const feesRouter = {
  // Fee Categories
  listCategories: pub
    .route({
      method: "GET",
      path: "/fee-categories",
      summary: "Get fee categories",
      tags: ["Fees"],
    })
    .output(z.array(z.any()))
    .handler(async () => []),

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
    .handler(async ({ input }) => ({ id: "new-id", ...input })),

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
    .handler(async () => []),

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
        dueDate: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: "new-id", ...input })),

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
    .handler(async () => []),

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
    .handler(async ({ input }) => ({ id: "new-id", ...input })),

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
    .handler(async () => []),

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
    .handler(async ({ input }) => ({ id: "new-id", ...input })),

  getPaymentHistory: pub
    .route({
      method: "GET",
      path: "/fee-payments/{id}/history",
      summary: "Get payment history",
      tags: ["Fees"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.array(z.any()))
    .handler(async () => []),
};
