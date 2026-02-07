/**
 * Teachers Router
 *
 * oRPC router for teacher management.
 */

import { z } from "zod";
import { pub, orgAuthed } from "../../procedures/index.js";
import { getDb } from "../../lib/db.js";
import { teachers } from "@school/storage";
import { desc, eq } from "drizzle-orm";

export const teachersRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/teachers",
      summary: "Get all teachers",
      tags: ["Teachers"],
    })
    .output(z.object({ teachers: z.array(z.any()) }))
    .handler(async () => {
      const db = getDb();
      const allTeachers = await db
        .select()
        .from(teachers)
        .orderBy(desc(teachers.createdAt));

      return {
        teachers: allTeachers.map((t) => ({
          ...t,
          status: t.status ? "active" : "inactive",
          salary: 45000 + Math.floor(Math.random() * 20000), // Mock salary
          attendance: 85 + Math.floor(Math.random() * 10), // Mock attendance
        })),
      };
    }),

  get: pub
    .route({
      method: 'GET',
      path: '/teachers/{id}',
      summary: 'Get single teacher',
      tags: ['Teachers'],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),

  create: orgAuthed
    .route({
      method: 'POST',
      path: '/teachers',
      summary: 'Create teacher',
      tags: ['Teachers'],
    })
    .input(
      z.object({
        employeeId: z.string().optional(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        qualification: z.string().optional(),
        experience: z.number().int().optional(),
        subjectSpecialization: z.string().optional(),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: 'new-id', ...input })),

  update: orgAuthed
    .route({
      method: 'PUT',
      path: '/teachers/{id}',
      summary: 'Update teacher',
      tags: ['Teachers'],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        qualification: z.string().optional(),
        experience: z.number().int().optional(),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => input),

  delete: orgAuthed
    .route({
      method: 'DELETE',
      path: '/teachers/{id}',
      summary: 'Delete teacher',
      tags: ['Teachers'],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({ success: z.boolean() }))
    .handler(async () => ({ success: true })),
};
