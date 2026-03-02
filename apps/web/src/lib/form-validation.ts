/**
 * Form Validation Utilities
 *
 * Shared Zod schemas and validation helpers
 */

import { z } from "zod";

// Common validation patterns
export const emailSchema = z.string().email("Invalid email address");
export const phoneSchema = z
  .string()
  .regex(
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
    "Invalid phone number",
  );
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Student schemas
export const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: emailSchema.optional().or(z.literal("")),
  phone: phoneSchema.optional().or(z.literal("")),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().optional(),
  classId: z.string().min(1, "Class is required"),
  admissionNumber: z.string().optional(),
  fatherName: z.string().optional(),
  fatherPhone: phoneSchema.optional().or(z.literal("")),
  motherName: z.string().optional(),
  motherPhone: phoneSchema.optional().or(z.literal("")),
});

export const studentUpdateSchema = studentSchema.partial();

// Teacher schemas
export const teacherSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: emailSchema.optional().or(z.literal("")),
  phone: phoneSchema.optional().or(z.literal("")),
  employeeId: z.string().min(1, "Employee ID is required"),
  qualification: z.string().optional(),
  subjectSpecialization: z.string().optional(),
  experience: z.string().optional(),
  dateOfJoining: z.string().optional(),
});

export const teacherUpdateSchema = teacherSchema.partial();

// Class schemas
export const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  section: z.string().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1").optional(),
  classTeacherId: z.string().optional(),
  academicYear: z.string().optional(),
});

export const classUpdateSchema = classSchema.partial();

// Fee schemas
export const feePaymentSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  paymentDate: z.string().min(1, "Payment date is required"),
  paymentMethod: z.enum(["cash", "card", "online", "cheque"]).optional(),
  feeCategoryId: z.string().optional(),
  remarks: z.string().optional(),
});

// Exam schemas
export const examSchema = z.object({
  title: z.string().min(1, "Exam title is required"),
  examType: z.string().min(1, "Exam type is required"),
  classId: z.string().optional(),
  subjectId: z.string().optional(),
  examDate: z.string().min(1, "Exam date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  totalMarks: z.number().min(0).optional(),
  passingMarks: z.number().min(0).optional(),
});

// Attendance schemas
export const attendanceSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  classId: z.string().min(1, "Class is required"),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["present", "absent", "late", "excused"]),
  remarks: z.string().optional(),
});

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z.enum(["admin", "teacher", "staff", "parent", "student"]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  filters: z.record(z.string(), z.unknown()).optional(),
});

// Export type inference helpers
export type StudentFormData = z.infer<typeof studentSchema>;
export type TeacherFormData = z.infer<typeof teacherSchema>;
export type ClassFormData = z.infer<typeof classSchema>;
export type FeePaymentFormData = z.infer<typeof feePaymentSchema>;
export type ExamFormData = z.infer<typeof examSchema>;
export type AttendanceFormData = z.infer<typeof attendanceSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Validates form data and returns formatted errors
 */
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
):
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((error) => {
    const path = error.path.join(".");
    errors[path] = error.message;
  });

  return { success: false, errors };
}

/**
 * Gets first error message for a field
 */
export function getFieldError(
  errors: Record<string, string>,
  field: string,
): string | undefined {
  return errors[field];
}
