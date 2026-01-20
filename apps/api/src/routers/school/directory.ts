/**
 * Directory Router
 *
 * API routes for staff/teacher directory
 */

import { z } from "zod";
import { eq, and, desc, like, asc } from "drizzle-orm";
import { orgAuthed } from "../../procedures";
import { getDb, schema } from "../../lib/db";

export const directoryRouter = {
  /**
   * Get directory entries
   */
  list: orgAuthed
    .route({
      method: "GET",
      path: "/directory",
      summary: "Get directory",
      tags: ["Directory"],
    })
    .input(
      z
        .object({
          role: z.string().optional(),
          department: z.string().optional(),
          search: z.string().optional(),
          status: z.boolean().optional(),
        })
        .optional(),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb(context);
      const orgId = context.organization.id;

      const conditions = [];
      if (input?.role) conditions.push(eq(schema.directory.role, input.role));
      if (input?.department)
        conditions.push(eq(schema.directory.department, input.department));
      if (input?.status !== undefined)
        conditions.push(eq(schema.directory.isActive, input.status));
      if (input?.search) {
        conditions.push(like(schema.directory.name, `%${input.search}%`));
      }

      const directory = await db
        .select()
        .from(schema.directory)
        .where(and(...conditions))
        .orderBy(asc(schema.directory.name));

      return { directory };
    }),

  /**
   * Get directory entry by ID
   */
  getById: orgAuthed
    .route({
      method: "GET",
      path: "/directory/:id",
      summary: "Get directory entry",
      tags: ["Directory"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb(context);
      const orgId = context.organization.id;

      const [entry] = await db
        .select()
        .from(schema.directory)
        .where(eq(schema.directory.id, input.id));

      return { entry };
    }),

  /**
   * Create directory entry
   */
  create: orgAuthed
    .route({
      method: "POST",
      path: "/directory",
      summary: "Create directory entry",
      tags: ["Directory"],
    })
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        role: z.string().min(1),
        department: z.string().optional(),
        designation: z.string().optional(),
        photo: z.string().optional(),
        address: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb(context);
      const orgId = context.organization.id;

      const [entry] = await db
        .insert(schema.directory)
        .values(input)
        .returning();

      return { entry };
    }),

  /**
   * Update directory entry
   */
  update: orgAuthed
    .route({
      method: "PUT",
      path: "/directory/:id",
      summary: "Update directory entry",
      tags: ["Directory"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        data: z.object({
          name: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          role: z.string().optional(),
          department: z.string().optional(),
          designation: z.string().optional(),
          photo: z.string().optional(),
          address: z.string().optional(),
          isActive: z.boolean().optional(),
        }),
      }),
    )
    .output(z.any())
    .handler(async ({ context, input }) => {
      const db = getDb(context);
      const orgId = context.organization.id;

      const [entry] = await db
        .update(schema.directory)
        .set({
          ...input.data,
          updatedAt: new Date(),
        })
        .where(eq(schema.directory.id, input.id))
        .returning();

      return { entry };
    }),

  /**
   * Get teachers list
   */
  teachers: orgAuthed
    .route({
      method: "GET",
      path: "/directory/teachers",
      summary: "Get teachers list",
      tags: ["Directory"],
    })
    .output(z.any())
    .handler(async ({ context }) => {
      const db = getDb(context);
      const orgId = context.organization.id;

      const teachers = await db
        .select({
          id: schema.teachers.id,
          employeeId: schema.teachers.employeeId,
          firstName: schema.teachers.firstName,
          lastName: schema.teachers.lastName,
          email: schema.teachers.email,
          phone: schema.teachers.phone,
          qualification: schema.teachers.qualification,
          subjectSpecialization: schema.teachers.subjectSpecialization,
          status: schema.teachers.status,
        })
        .from(schema.teachers)
        .where(eq(schema.teachers.status, true))
        .orderBy(asc(schema.teachers.firstName));

      return { teachers };
    }),

  /**
   * Get staff list
   */
  staff: orgAuthed
    .route({
      method: "GET",
      path: "/directory/staff",
      summary: "Get staff list",
      tags: ["Directory"],
    })
    .output(z.any())
    .handler(async ({ context }) => {
      const db = getDb(context);
      const orgId = context.organization.id;

      const staff = await db
        .select({
          id: schema.staff.id,
          employeeId: schema.staff.employeeId,
          firstName: schema.staff.firstName,
          lastName: schema.staff.lastName,
          email: schema.staff.email,
          phone: schema.staff.phone,
          designation: schema.staff.designation,
          department: schema.staff.department,
          status: schema.staff.status,
        })
        .from(schema.staff)
        .where(eq(schema.staff.status, true))
        .orderBy(asc(schema.staff.firstName));

      return { staff };
    }),
};
