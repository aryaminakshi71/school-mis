/**
 * Classes Router
 *
 * oRPC router for class management.
 */

import { classes, students, teachers } from "@school/storage";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { ClassesListResponseSchema } from "../../contracts/school.js";
import { getDb } from "../../lib/db.js";
import { APIError, ErrorCode } from "../../lib/errors.js";
import { orgAuthed, pub } from "../../procedures/index.js";

export const classesRouter = {
  list: pub
    .route({
      method: "GET",
      path: "/classes",
      summary: "Get all classes",
      tags: ["Classes"],
    })
    .output(ClassesListResponseSchema)
    .handler(async () => {
      const db = getDb();

      const allClasses = await db
        .select({
          id: classes.id,
          name: classes.name,
          section: classes.section,
          capacity: classes.capacity,
          studentsCount: sql<number>`count(${students.id})`,
          classTeacher: sql<string>`concat(${teachers.firstName}, ' ', ${teachers.lastName})`,
        })
        .from(classes)
        .leftJoin(students, eq(classes.id, students.classId))
        .leftJoin(teachers, eq(classes.classTeacherId, teachers.id))
        .groupBy(classes.id, teachers.firstName, teachers.lastName)
        .orderBy(classes.name);

      return {
        classes: allClasses.map((c) => ({
          id: c.id,
          name: c.name,
          section: c.section ?? "",
          capacity: c.capacity ?? 0,
          students: c.studentsCount,
          classTeacher: c.classTeacher ?? "",
        })),
      };
    }),

  get: pub
    .route({
      method: "GET",
      path: "/classes/{id}",
      summary: "Get single class",
      tags: ["Classes"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),

  create: orgAuthed
    .route({
      method: "POST",
      path: "/classes",
      summary: "Create class",
      tags: ["Classes"],
    })
    .input(
      z.object({
        name: z.string().min(1),
        section: z.string().optional(),
        sessionId: z.string().uuid().optional(),
        capacity: z.number().int().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: "new-id", ...input })),

  update: orgAuthed
    .route({
      method: "PUT",
      path: "/classes/{id}",
      summary: "Update class",
      tags: ["Classes"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().optional(),
        section: z.string().optional(),
        capacity: z.number().int().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => input),

  delete: orgAuthed
    .route({
      method: "DELETE",
      path: "/classes/{id}",
      summary: "Delete class",
      tags: ["Classes"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input }) => {
      const db = getDb();

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(students)
        .where(eq(students.classId, input.id));

      if (count > 0) {
        throw new APIError(ErrorCode.CONFLICT, "Cannot delete class", 409, {
          dependencies: { students: count },
        });
      }

      await db.delete(classes).where(eq(classes.id, input.id));
      return { success: true };
    }),
};
