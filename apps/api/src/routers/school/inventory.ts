/**
 * Inventory Router
 *
 * oRPC router for inventory and stock management.
 */

import {
  inventoryCategories,
  inventoryItems,
  inventoryTransactions,
} from "@school/storage";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../lib/db.js";
import { orgAuthed, pub } from "../../procedures/index.js";

export const inventoryRouter = {
  // List categories
  listCategories: pub
    .route({
      method: "GET",
      path: "/inventory/categories",
      summary: "Get inventory categories",
      tags: ["Inventory"],
    })
    .output(z.any())
    .handler(async () => {
      const db = getDb();
      const categories = await db
        .select()
        .from(inventoryCategories)
        .orderBy(inventoryCategories.name);
      return categories;
    }),

  // Create category
  createCategory: orgAuthed
    .route({
      method: "POST",
      path: "/inventory/categories",
      summary: "Create inventory category",
      tags: ["Inventory"],
    })
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        parentId: z.string().uuid().optional(),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const [category] = await db
        .insert(inventoryCategories)
        .values({
          name: input.name,
          description: input.description ?? null,
          parentId: input.parentId ?? null,
        })
        .returning();
      return category;
    }),

  // List items
  listItems: pub
    .route({
      method: "GET",
      path: "/inventory/items",
      summary: "Get inventory items",
      tags: ["Inventory"],
    })
    .input(
      z.object({
        categoryId: z.string().uuid().optional(),
        status: z.enum(["active", "discontinued"]).optional(),
        lowStock: z.boolean().optional(),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();

      let query = db.select().from(inventoryItems);

      if (input.categoryId) {
        query = query.where(eq(inventoryItems.categoryId, input.categoryId)) as typeof query;
      }
      if (input.status) {
        query = query.where(eq(inventoryItems.status, input.status)) as typeof query;
      }

      const items = await query.orderBy(desc(inventoryItems.updatedAt));

      if (input.lowStock) {
        return items.filter((item) => (item.quantity ?? 0) <= (item.minQuantity ?? 0));
      }

      return items;
    }),

  // Get item by ID
  getItem: pub
    .route({
      method: "GET",
      path: "/inventory/items/{id}",
      summary: "Get inventory item by ID",
      tags: ["Inventory"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const [item] = await db
        .select()
        .from(inventoryItems)
        .where(eq(inventoryItems.id, input.id))
        .limit(1);
      return item ?? null;
    }),

  // Create item
  createItem: orgAuthed
    .route({
      method: "POST",
      path: "/inventory/items",
      summary: "Create inventory item",
      tags: ["Inventory"],
    })
    .input(
      z.object({
        categoryId: z.string().uuid().optional(),
        name: z.string().min(1),
        description: z.string().optional(),
        sku: z.string().optional(),
        quantity: z.number().optional().default(0),
        unit: z.string().optional().default("pcs"),
        minQuantity: z.number().optional().default(0),
        unitPrice: z.number().positive().optional(),
        location: z.string().optional(),
        supplier: z.string().optional(),
        status: z.enum(["active", "discontinued"]).optional().default("active"),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const [item] = await db
        .insert(inventoryItems)
        .values({
          categoryId: input.categoryId ?? null,
          name: input.name,
          description: input.description ?? null,
          sku: input.sku ?? null,
          quantity: input.quantity,
          unit: input.unit,
          minQuantity: input.minQuantity,
          unitPrice: input.unitPrice ? String(input.unitPrice) : null,
          location: input.location ?? null,
          supplier: input.supplier ?? null,
          status: input.status,
        })
        .returning();
      return item;
    }),

  // Update item
  updateItem: orgAuthed
    .route({
      method: "PATCH",
      path: "/inventory/items/{id}",
      summary: "Update inventory item",
      tags: ["Inventory"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        categoryId: z.string().uuid().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        sku: z.string().optional(),
        quantity: z.number().optional(),
        unit: z.string().optional(),
        minQuantity: z.number().optional(),
        unitPrice: z.number().positive().optional(),
        location: z.string().optional(),
        supplier: z.string().optional(),
        status: z.enum(["active", "discontinued"]).optional(),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const { id, ...updates } = input;

      const setFields: Record<string, unknown> = { updatedAt: new Date() };
      if (updates.categoryId !== undefined) setFields.categoryId = updates.categoryId;
      if (updates.name !== undefined) setFields.name = updates.name;
      if (updates.description !== undefined) setFields.description = updates.description;
      if (updates.sku !== undefined) setFields.sku = updates.sku;
      if (updates.quantity !== undefined) setFields.quantity = updates.quantity;
      if (updates.unit !== undefined) setFields.unit = updates.unit;
      if (updates.minQuantity !== undefined) setFields.minQuantity = updates.minQuantity;
      if (updates.unitPrice !== undefined) setFields.unitPrice = String(updates.unitPrice);
      if (updates.location !== undefined) setFields.location = updates.location;
      if (updates.supplier !== undefined) setFields.supplier = updates.supplier;
      if (updates.status !== undefined) setFields.status = updates.status;

      const [item] = await db
        .update(inventoryItems)
        .set(setFields)
        .where(eq(inventoryItems.id, id))
        .returning();

      return item;
    }),

  // Delete item
  deleteItem: orgAuthed
    .route({
      method: "DELETE",
      path: "/inventory/items/{id}",
      summary: "Delete inventory item",
      tags: ["Inventory"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.boolean())
    .handler(async ({ input }) => {
      const db = getDb();
      await db.delete(inventoryItems).where(eq(inventoryItems.id, input.id));
      return true;
    }),

  // Record transaction (purchase, usage, adjustment)
  recordTransaction: orgAuthed
    .route({
      method: "POST",
      path: "/inventory/transactions",
      summary: "Record inventory transaction",
      tags: ["Inventory"],
    })
    .input(
      z.object({
        itemId: z.string().uuid(),
        type: z.enum(["purchase", "usage", "adjustment", "transfer"]),
        quantity: z.number(),
        unitPrice: z.number().positive().optional(),
        reference: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .output(z.any())
    .handler(async ({ input, context }) => {
      const db = getDb();

      // Get current item
      const [item] = await db
        .select()
        .from(inventoryItems)
        .where(eq(inventoryItems.id, input.itemId))
        .limit(1);

      if (!item) throw new Error("Item not found");

      // Calculate new quantity
      const newQuantity = (item.quantity ?? 0) + input.quantity;
      if (newQuantity < 0) throw new Error("Insufficient quantity");

      // Record transaction
      const [transaction] = await db
        .insert(inventoryTransactions)
        .values({
          itemId: input.itemId,
          type: input.type,
          quantity: input.quantity,
          unitPrice: input.unitPrice ? String(input.unitPrice) : null,
          reference: input.reference ?? null,
          notes: input.notes ?? null,
          performedBy: context.user?.id ?? null,
        })
        .returning();

      // Update item quantity
      await db
        .update(inventoryItems)
        .set({ quantity: newQuantity, updatedAt: new Date() })
        .where(eq(inventoryItems.id, input.itemId));

      return { id: transaction.id };
    }),

  // Get low stock alerts
  lowStockAlerts: pub
    .route({
      method: "GET",
      path: "/inventory/alerts/low-stock",
      summary: "Get low stock alerts",
      tags: ["Inventory"],
    })
    .output(z.any())
    .handler(async () => {
      const db = getDb();

      const items = await db
        .select()
        .from(inventoryItems)
        .where(eq(inventoryItems.status, "active"));

      const lowStock = items.filter((item) => (item.quantity ?? 0) <= (item.minQuantity ?? 0));

      const categories = await db.select().from(inventoryCategories);
      const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

      return lowStock.map((item) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        minQuantity: item.minQuantity,
        unit: item.unit,
        categoryName: item.categoryId ? categoryMap.get(item.categoryId) ?? null : null,
      }));
    }),
};
