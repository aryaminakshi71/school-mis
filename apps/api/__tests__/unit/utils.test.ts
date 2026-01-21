import { describe, it, expect } from "bun:test";

describe("Utilities", () => {
  it("should format currency correctly", () => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    };

    expect(formatCurrency(100)).toBe("$100.00");
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("should format percentage correctly", () => {
    const formatPercent = (value: number) => {
      return `${value.toFixed(1)}%`;
    };

    expect(formatPercent(95.5)).toBe("95.5%");
    expect(formatPercent(100)).toBe("100.0%");
    expect(formatPercent(0)).toBe("0.0%");
  });

  it("should truncate text correctly", () => {
    const truncate = (text: string, length: number) => {
      if (text.length <= length) return text;
      return text.slice(0, length) + "...";
    };

    expect(truncate("Hello World", 5)).toBe("Hello...");
    expect(truncate("Hi", 10)).toBe("Hi");
    expect(truncate("Exactly 10", 10)).toBe("Exactly 10");
  });
});

describe("Validators", () => {
  it("should validate email correctly", () => {
    const isValidEmail = (email: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user.name@domain.org")).toBe(true);
    expect(isValidEmail("invalid")).toBe(false);
    expect(isValidEmail("invalid@")).toBe(false);
    expect(isValidEmail("@domain.com")).toBe(false);
  });

  it("should validate phone number correctly", () => {
    const isValidPhone = (phone: string) => {
      const regex = /^\+?[\d\s-()]{10,}$/;
      return regex.test(phone);
    };

    expect(isValidPhone("555-0101234")).toBe(true);
    expect(isValidPhone("+1 555 010 1234")).toBe(true);
    expect(isValidPhone("123")).toBe(false);
  });
});

describe("Date Formatters", () => {
  it("should format date for display", () => {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const date = new Date("2024-01-15");
    expect(formatDate(date)).toBe("January 15, 2024");
  });

  it("should format date for input", () => {
    const formatDateInput = (date: Date) => {
      return date.toISOString().split("T")[0];
    };

    const date = new Date("2024-01-15");
    expect(formatDateInput(date)).toBe("2024-01-15");
  });
});
