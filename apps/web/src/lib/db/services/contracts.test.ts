import { describe, expect, expectTypeOf, it } from "vitest";
import { attendanceService } from "./attendance.service";
import { feesService } from "./fees.service";
import type { BookIssueRow } from "./library.service";
import { mapBookIssueRow } from "./library.service";

describe("db service contracts", () => {
  it("requires allocationId for fee creation", () => {
    type CreateFeeInput = Parameters<typeof feesService.create>[0];
    type HasRequiredAllocation = CreateFeeInput extends { allocationId: string }
      ? true
      : false;

    expectTypeOf<HasRequiredAllocation>().toEqualTypeOf<true>();

    const sample: CreateFeeInput = {
      studentId: "student-1",
      allocationId: "alloc-1",
      amount: 1000,
      paymentDate: new Date("2026-03-02T00:00:00.000Z"),
      status: "pending",
      paymentMethod: "cash",
    };

    expect(sample.allocationId).toBe("alloc-1");
  });

  it("requires sessionId when marking attendance", () => {
    type MarkInput = Parameters<typeof attendanceService.mark>[0];
    type HasRequiredSession = MarkInput extends { sessionId: string }
      ? true
      : false;

    expectTypeOf<HasRequiredSession>().toEqualTypeOf<true>();

    const sample: MarkInput = {
      studentId: "student-1",
      classId: "class-1",
      sessionId: "session-1",
      date: new Date("2026-03-02T00:00:00.000Z"),
      status: "present",
    };

    expect(sample.sessionId).toBe("session-1");
  });

  it("maps book issue date fields to Date objects", () => {
    const row = {
      id: "issue-1",
      bookId: "book-1",
      studentId: "student-1",
      staffId: null,
      issueDate: "2026-03-01",
      dueDate: "2026-03-10",
      returnDate: null,
      condition: null,
      fine: "0",
      status: "issued",
    } as unknown as BookIssueRow;

    const mapped = mapBookIssueRow(row);

    expect(mapped.issueDate).toBeInstanceOf(Date);
    expect(mapped.dueDate).toBeInstanceOf(Date);
    expect(mapped.returnDate).toBeUndefined();
    expect(mapped.issueDate.toISOString()).toBe("2026-03-01T00:00:00.000Z");
    expect(mapped.dueDate.toISOString()).toBe("2026-03-10T00:00:00.000Z");
  });
});
