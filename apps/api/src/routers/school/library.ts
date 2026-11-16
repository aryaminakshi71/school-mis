/**
 * Library Router
 *
 * oRPC router for library management.
 */

import { libraryBooks } from "@school/storage";
import { and, like } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../lib/db.js";
import { orgAuthed, pub } from "../../procedures/index.js";

export const libraryRouter = {
  listBooks: pub
    .route({
      method: "GET",
      path: "/library/books",
      summary: "Get books",
      tags: ["Library"],
    })
    .input(
      z.object({
        search: z.string().optional(),
        category: z.string().optional(),
      }),
    )
    .output(z.object({ books: z.array(z.any()) }))
    .handler(async ({ input }) => {
      const db = getDb();
      const { search, category } = input;

      const conditions = [];
      if (search) {
        conditions.push(like(libraryBooks.title, `%${search}%`));
      }
      if (category) {
        conditions.push(like(libraryBooks.category, `%${category}%`));
      }

      const books = await db
        .select()
        .from(libraryBooks)
        .where(and(...conditions))
        .orderBy(libraryBooks.title);

      return { books };
    }),
  getBook: pub
    .route({
      method: "GET",
      path: "/library/books/{id}",
      summary: "Get book",
      tags: ["Library"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),
  createBook: orgAuthed
    .route({
      method: "POST",
      path: "/library/books",
      summary: "Add book",
      tags: ["Library"],
    })
    .input(
      z.object({
        title: z.string(),
        author: z.string(),
        isbn: z.string().optional(),
        totalCopies: z.number(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: "new-id", ...input })),
  listIssues: pub
    .route({
      method: "GET",
      path: "/library/issues",
      summary: "Get issues",
      tags: ["Library"],
    })
    .input(
      z.object({
        studentId: z.string().uuid().optional(),
        status: z.string().optional(),
      }),
    )
    .output(z.array(z.any()))
    .handler(async () => []),
  issueBook: orgAuthed
    .route({
      method: "POST",
      path: "/library/issues",
      summary: "Issue book",
      tags: ["Library"],
    })
    .input(
      z.object({
        bookId: z.string().uuid(),
        studentId: z.string().uuid().optional(),
        staffId: z.string().uuid().optional(),
        dueDate: z.string(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: "new-id", ...input })),
  returnBook: orgAuthed
    .route({
      method: "PUT",
      path: "/library/issues/{id}/return",
      summary: "Return book",
      tags: ["Library"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        condition: z.string().optional(),
        fine: z.number().optional(),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: input.id, status: "returned" })),
};
