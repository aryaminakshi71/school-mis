import { describe, it } from "@jest/globals";
import { by, expect as detoxExpect, element } from "detox";

describe("School MIS Mobile App", () => {
  it("should open the app and show the home screen", async () => {
    await detoxExpect(element(by.text("Home"))).toBeVisible();
  });

  it("should navigate to Students tab", async () => {
    await element(by.text("Students")).tap();
    await detoxExpect(element(by.text("Students"))).toBeVisible();
  });

  it("should navigate to Attendance tab", async () => {
    await element(by.text("Attendance")).tap();
    await detoxExpect(element(by.text("Attendance"))).toBeVisible();
  });

  it("should navigate to Grades tab", async () => {
    await element(by.text("Grades")).tap();
    await detoxExpect(element(by.text("Grades"))).toBeVisible();
  });

  it("should navigate to Profile tab", async () => {
    await element(by.text("Profile")).tap();
    await detoxExpect(element(by.text("Profile"))).toBeVisible();
  });
});
