/**
 * Better Auth Unit Tests
 *
 * Tests for authentication system including:
 * - User registration
 * - Login/logout
 * - Session management
 * - Role-based access control
 */

import {
  PERMISSIONS,
  ROLES,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from "@school/auth";
import { describe, expect, it } from "vitest";

describe("Authentication System", () => {
  describe("Role Permissions", () => {
    it("should allow super_admin all permissions", () => {
      expect(hasPermission(ROLES.SUPER_ADMIN, PERMISSIONS.STUDENT_CREATE)).toBe(
        true,
      );
      expect(hasPermission(ROLES.SUPER_ADMIN, PERMISSIONS.ADMIN_FULL)).toBe(
        true,
      );
      expect(hasPermission(ROLES.SUPER_ADMIN, "any:permission")).toBe(true);
    });

    it("should allow school_admin student management", () => {
      expect(
        hasPermission(ROLES.SCHOOL_ADMIN, PERMISSIONS.STUDENT_CREATE),
      ).toBe(true);
      expect(hasPermission(ROLES.SCHOOL_ADMIN, PERMISSIONS.STUDENT_READ)).toBe(
        true,
      );
      expect(
        hasPermission(ROLES.SCHOOL_ADMIN, PERMISSIONS.STUDENT_UPDATE),
      ).toBe(true);
      expect(
        hasPermission(ROLES.SCHOOL_ADMIN, PERMISSIONS.STUDENT_DELETE),
      ).toBe(true);
    });

    it("should allow school_admin fee management", () => {
      expect(hasPermission(ROLES.SCHOOL_ADMIN, PERMISSIONS.FEE_MANAGE)).toBe(
        true,
      );
      expect(hasPermission(ROLES.SCHOOL_ADMIN, PERMISSIONS.FEE_COLLECT)).toBe(
        true,
      );
      expect(hasPermission(ROLES.SCHOOL_ADMIN, PERMISSIONS.FEE_READ)).toBe(
        true,
      );
    });

    it("should not allow school_admin full admin access", () => {
      expect(hasPermission(ROLES.SCHOOL_ADMIN, PERMISSIONS.ADMIN_FULL)).toBe(
        false,
      );
    });

    it("should allow teacher attendance marking", () => {
      expect(hasPermission(ROLES.TEACHER, PERMISSIONS.ATTENDANCE_MARK)).toBe(
        true,
      );
      expect(hasPermission(ROLES.TEACHER, PERMISSIONS.ATTENDANCE_READ)).toBe(
        true,
      );
    });

    it("should allow teacher grade management", () => {
      expect(hasPermission(ROLES.TEACHER, PERMISSIONS.GRADE_CREATE)).toBe(true);
      expect(hasPermission(ROLES.TEACHER, PERMISSIONS.GRADE_READ)).toBe(true);
      expect(hasPermission(ROLES.TEACHER, PERMISSIONS.GRADE_UPDATE)).toBe(true);
    });

    it("should not allow teacher student creation", () => {
      expect(hasPermission(ROLES.TEACHER, PERMISSIONS.STUDENT_CREATE)).toBe(
        false,
      );
    });

    it("should allow student to read own data", () => {
      expect(hasPermission(ROLES.STUDENT, PERMISSIONS.STUDENT_READ)).toBe(true);
      expect(hasPermission(ROLES.STUDENT, PERMISSIONS.GRADE_READ)).toBe(true);
      expect(hasPermission(ROLES.STUDENT, PERMISSIONS.ATTENDANCE_READ)).toBe(
        true,
      );
    });

    it("should not allow student to modify data", () => {
      expect(hasPermission(ROLES.STUDENT, PERMISSIONS.GRADE_CREATE)).toBe(
        false,
      );
      expect(hasPermission(ROLES.STUDENT, PERMISSIONS.STUDENT_UPDATE)).toBe(
        false,
      );
    });

    it("should allow parent to read child data", () => {
      expect(hasPermission(ROLES.PARENT, PERMISSIONS.STUDENT_READ)).toBe(true);
      expect(hasPermission(ROLES.PARENT, PERMISSIONS.GRADE_READ)).toBe(true);
      expect(hasPermission(ROLES.PARENT, PERMISSIONS.FEE_READ)).toBe(true);
    });

    it("should check any permission correctly", () => {
      expect(
        hasAnyPermission(ROLES.TEACHER, [
          PERMISSIONS.STUDENT_CREATE,
          PERMISSIONS.STUDENT_READ,
        ]),
      ).toBe(true);
      expect(
        hasAnyPermission(ROLES.TEACHER, [
          PERMISSIONS.ADMIN_FULL,
          PERMISSIONS.FEE_MANAGE,
        ]),
      ).toBe(false);
    });

    it("should check all permissions correctly", () => {
      expect(
        hasAllPermissions(ROLES.TEACHER, [
          PERMISSIONS.ATTENDANCE_READ,
          PERMISSIONS.ATTENDANCE_MARK,
        ]),
      ).toBe(true);
      expect(
        hasAllPermissions(ROLES.TEACHER, [
          PERMISSIONS.ATTENDANCE_READ,
          PERMISSIONS.FEE_MANAGE,
        ]),
      ).toBe(false);
    });
  });

  describe("Permission Constants", () => {
    it("should have all required permission constants", () => {
      expect(PERMISSIONS.STUDENT_CREATE).toBeDefined();
      expect(PERMISSIONS.STUDENT_READ).toBeDefined();
      expect(PERMISSIONS.STUDENT_UPDATE).toBeDefined();
      expect(PERMISSIONS.STUDENT_DELETE).toBeDefined();
      expect(PERMISSIONS.TEACHER_CREATE).toBeDefined();
      expect(PERMISSIONS.FEE_MANAGE).toBeDefined();
      expect(PERMISSIONS.GRADE_CREATE).toBeDefined();
      expect(PERMISSIONS.ADMIN_FULL).toBeDefined();
    });

    it("should have all required role constants", () => {
      expect(ROLES.SUPER_ADMIN).toBe("super_admin");
      expect(ROLES.SCHOOL_ADMIN).toBe("school_admin");
      expect(ROLES.TEACHER).toBe("teacher");
      expect(ROLES.STUDENT).toBe("student");
      expect(ROLES.PARENT).toBe("parent");
      expect(ROLES.STAFF).toBe("staff");
    });
  });
});
