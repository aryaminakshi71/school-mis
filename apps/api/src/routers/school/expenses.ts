/**
 * Expenses Router
 *
 * oRPC router for school expenses and staff salary management.
 */

import { expenses } from "@school/storage";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../lib/db.js";
import { orgAuthed, pub } from "../../procedures/index.js";

export const expensesRouter = {
  // List all expenses
  list: pub
    .route({
      method: "GET",
      path: "/expenses",
      summary: "Get all expenses",
      tags: ["Expenses"],
    })
    .output(z.any())
    .handler(async () => {
      const db = getDb();
      const result = await db
        .select()
        .from(expenses)
        .orderBy(desc(expenses.date));
      return { expenses: result };
    }),

  // Get expense by ID
  byId: pub
    .route({
      method: "GET",
      path: "/expenses/{id}",
      summary: "Get expense by ID",
      tags: ["Expenses"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(expenses)
        .where(eq(expenses.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  // Create new expense
  create: orgAuthed
    .route({
      method: "POST",
      path: "/expenses",
      summary: "Create new expense",
      tags: ["Expenses"],
    })
    .input(
      z.object({
        category: z.string().min(1),
        description: z.string().min(1),
        amount: z.number().positive(),
        date: z.string(),
        paymentMethod: z.string().optional(),
        paidTo: z.string().optional(),
        status: z
          .enum(["pending", "approved", "paid", "cancelled"])
          .default("pending"),
      }),
    )
    .output(z.any())
    .handler(async ({ input, context }) => {
      const db = getDb();
      const result = await db
        .insert(expenses)
        .values({
          category: input.category,
          description: input.description,
          amount: String(input.amount),
          date: input.date,
          paymentMethod: input.paymentMethod ?? null,
          paidTo: input.paidTo ?? null,
          status: input.status,
          createdBy: context.user?.id ?? null,
        })
        .returning();
      return result[0];
    }),

  // Update expense
  update: orgAuthed
    .route({
      method: "PATCH",
      path: "/expenses/{id}",
      summary: "Update expense",
      tags: ["Expenses"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        category: z.string().optional(),
        description: z.string().optional(),
        amount: z.number().positive().optional(),
        date: z.string().optional(),
        paymentMethod: z.string().optional(),
        paidTo: z.string().optional(),
        status: z.enum(["pending", "approved", "paid", "cancelled"]).optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const { id, ...updates } = input;

      const setFields: Record<string, unknown> = {};
      if (updates.category !== undefined) setFields.category = updates.category;
      if (updates.description !== undefined)
        setFields.description = updates.description;
      if (updates.amount !== undefined)
        setFields.amount = String(updates.amount);
      if (updates.date !== undefined) setFields.date = updates.date;
      if (updates.paymentMethod !== undefined)
        setFields.paymentMethod = updates.paymentMethod;
      if (updates.paidTo !== undefined) setFields.paidTo = updates.paidTo;
      if (updates.status !== undefined) setFields.status = updates.status;
      setFields.updatedAt = new Date();

      const result = await db
        .update(expenses)
        .set(setFields)
        .where(eq(expenses.id, id))
        .returning();
      return result[0];
    }),

  // Delete expense
  delete: orgAuthed
    .route({
      method: "DELETE",
      path: "/expenses/{id}",
      summary: "Delete expense",
      tags: ["Expenses"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.boolean())
    .handler(async ({ input }) => {
      const db = getDb();
      await db.delete(expenses).where(eq(expenses.id, input.id));
      return true;
    }),

  // Get expenses summary (total by category)
  summary: pub
    .route({
      method: "GET",
      path: "/expenses/summary",
      summary: "Get expenses summary by category",
      tags: ["Expenses"],
    })
    .output(z.any())
    .handler(async () => {
      const db = getDb();
      const result = await db
        .select({
          category: expenses.category,
          total: expenses.amount,
        })
        .from(expenses);

      const summaryMap = new Map<string, { total: number; count: number }>();

      for (const exp of result) {
        const existing = summaryMap.get(exp.category) || { total: 0, count: 0 };
        summaryMap.set(exp.category, {
          total: existing.total + Number(exp.total),
          count: existing.count + 1,
        });
      }

      return Array.from(summaryMap.entries()).map(([category, data]) => ({
        category,
        total: String(data.total),
        count: data.count,
      }));
    }),
};
