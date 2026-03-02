import { bookIssues, db, libraryBooks } from "@school/storage";
import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { NotFoundError } from "../../error-handler";
import { fromPgDate, toPgDate } from "../date-utils";

export interface LibraryBook {
  id: string;
  bookNumber: string;
  title: string;
  author: string;
  publisher?: string;
  edition?: string;
  isbn?: string;
  category?: string;
  shelfNumber?: string;
  rackNumber?: string;
  totalCopies: number;
  availableCopies: number;
  price?: number;
  status: string;
  createdAt: Date;
}

export interface BookIssue {
  id: string;
  bookId: string;
  studentId?: string;
  staffId?: string;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  condition?: string;
  fine?: number;
  status: string;
}

export type BookIssueRow = typeof bookIssues.$inferSelect;

export const mapBookIssueRow = (row: BookIssueRow): BookIssue => ({
  id: row.id,
  bookId: row.bookId,
  studentId: row.studentId || undefined,
  staffId: row.staffId || undefined,
  issueDate: fromPgDate(row.issueDate) || new Date(),
  dueDate: fromPgDate(row.dueDate) || new Date(),
  returnDate: fromPgDate(row.returnDate),
  condition: row.condition || undefined,
  fine: row.fine ? Number(row.fine) : undefined,
  status: row.status || "issued",
});

const mapLibraryBookRow = (
  row: typeof libraryBooks.$inferSelect,
): LibraryBook => ({
  id: row.id,
  bookNumber: row.bookNumber || "",
  title: row.title,
  author: row.author,
  publisher: row.publisher || undefined,
  edition: row.edition || undefined,
  isbn: row.isbn || undefined,
  category: row.category || undefined,
  shelfNumber: row.shelfNumber || undefined,
  rackNumber: row.rackNumber || undefined,
  totalCopies: row.totalCopies,
  availableCopies: row.availableCopies,
  price: row.price ? Number(row.price) : undefined,
  status: row.status || "available",
  createdAt: row.createdAt || new Date(),
});

export const libraryService = {
  async listBooks(limit?: number, offset?: number): Promise<LibraryBook[]> {
    const baseQuery = db
      .select()
      .from(libraryBooks)
      .orderBy(desc(libraryBooks.createdAt));

    const result =
      limit !== undefined && offset !== undefined
        ? await baseQuery.limit(limit).offset(offset)
        : limit !== undefined
          ? await baseQuery.limit(limit)
          : offset !== undefined
            ? await baseQuery.offset(offset)
            : await baseQuery;

    return result.map(mapLibraryBookRow);
  },

  async getBook(id: string): Promise<LibraryBook | null> {
    const result = await db
      .select()
      .from(libraryBooks)
      .where(eq(libraryBooks.id, id))
      .limit(1);

    return result[0] ? mapLibraryBookRow(result[0]) : null;
  },

  async issueBook(
    bookId: string,
    borrowerId: string,
    borrowerType: "student" | "staff",
    dueDate: Date,
  ): Promise<BookIssue> {
    const book = await this.getBook(bookId);
    if (!book) throw new NotFoundError("Book not found");
    if (book.availableCopies <= 0) {
      throw new Error("Book not available for issue");
    }

    const issueData: typeof bookIssues.$inferInsert = {
      bookId,
      issueDate: toPgDate(new Date()),
      dueDate: toPgDate(dueDate),
      status: "issued",
    };

    if (borrowerType === "student") {
      issueData.studentId = borrowerId;
    } else {
      issueData.staffId = borrowerId;
    }

    const result = await db.insert(bookIssues).values(issueData).returning();
    await db
      .update(libraryBooks)
      .set({ availableCopies: book.availableCopies - 1 })
      .where(eq(libraryBooks.id, bookId));

    if (!result[0]) throw new Error("Failed to issue book");
    return mapBookIssueRow(result[0]);
  },

  async returnBook(issueId: string, condition?: string): Promise<BookIssue> {
    const issueResult = await db
      .select()
      .from(bookIssues)
      .where(eq(bookIssues.id, issueId))
      .limit(1);

    const issue = issueResult[0];
    if (!issue) throw new NotFoundError("Issue record not found");

    const updateData: Partial<typeof bookIssues.$inferInsert> = {
      returnDate: toPgDate(new Date()),
      status: "returned",
    };
    if (condition) updateData.condition = condition;

    const today = new Date();
    const dueDate = new Date(issue.dueDate);
    if (today > dueDate) {
      const daysOverdue = Math.ceil(
        (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      updateData.fine = (daysOverdue * 5).toString();
    }

    const result = await db
      .update(bookIssues)
      .set(updateData)
      .where(eq(bookIssues.id, issueId))
      .returning();

    const book = await this.getBook(issue.bookId);
    if (book) {
      await db
        .update(libraryBooks)
        .set({ availableCopies: book.availableCopies + 1 })
        .where(eq(libraryBooks.id, issue.bookId));
    }

    if (!result[0]) throw new Error("Failed to return book");
    return mapBookIssueRow(result[0]);
  },

  async getStudentBooks(studentId: string): Promise<BookIssue[]> {
    const result = await db
      .select()
      .from(bookIssues)
      .where(
        and(
          eq(bookIssues.studentId, studentId),
          eq(bookIssues.status, "issued"),
        ),
      )
      .orderBy(desc(bookIssues.issueDate));

    return result.map(mapBookIssueRow);
  },

  async searchBooks(query: string): Promise<LibraryBook[]> {
    const searchTerm = `%${query}%`;
    const result = await db
      .select()
      .from(libraryBooks)
      .where(
        or(
          like(libraryBooks.title, searchTerm),
          like(libraryBooks.author, searchTerm),
          like(libraryBooks.isbn || sql`''`, searchTerm),
          like(libraryBooks.category || sql`''`, searchTerm),
        ),
      )
      .orderBy(desc(libraryBooks.createdAt));

    return result.map(mapLibraryBookRow);
  },
};
