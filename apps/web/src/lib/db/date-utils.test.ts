import { describe, expect, it } from "vitest";
import { fromPgDate, toPgDate } from "./date-utils";

describe("db date utils", () => {
  it("formats Date to postgres date string", () => {
    const date = new Date("2026-03-02T15:45:00.000Z");
    expect(toPgDate(date)).toBe("2026-03-02");
  });

  it("parses postgres date string to Date", () => {
    const parsed = fromPgDate("2026-03-02");
    expect(parsed).toBeInstanceOf(Date);
    expect(parsed?.toISOString()).toBe("2026-03-02T00:00:00.000Z");
  });

  it("returns undefined for nullish values", () => {
    expect(fromPgDate(undefined)).toBeUndefined();
    expect(fromPgDate(null)).toBeUndefined();
  });
});
