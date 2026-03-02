import { z } from "zod";

export const StudentSchema = z.object({
  id: z.string(),
  admissionNumber: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  classId: z.string().optional().default(""),
  className: z.string().optional().default(""),
  rollNumber: z.number().optional().default(0),
  fatherName: z.string().optional().default(""),
  fatherPhone: z.string().optional().default(""),
  motherName: z.string().optional(),
  motherPhone: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  attendance: z.number().optional().default(0),
  status: z.enum(["active", "inactive"]).default("active"),
  createdAt: z.string().optional().default(""),
});

export const TeacherSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  qualification: z.string().optional().default(""),
  subject: z.string().optional().default(""),
  salary: z.number().optional().default(0),
  attendance: z.number().optional().default(0),
  status: z.enum(["active", "on_leave", "inactive"]).default("active"),
  createdAt: z.string().optional().default(""),
});

export const ClassSchema = z.object({
  id: z.string(),
  name: z.string(),
  section: z.string().optional().default(""),
  capacity: z.number().optional().default(0),
  students: z.number().optional().default(0),
  classTeacher: z.string().optional().default(""),
});

export const FeePaymentSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  studentName: z.string().optional().default(""),
  className: z.string().optional().default(""),
  amount: z.number(),
  paymentMethod: z.string().optional().default(""),
  status: z.enum(["paid", "pending", "overdue", "completed"]),
  date: z.string().optional().default(""),
});

export const ExamSchema = z.object({
  id: z.string(),
  name: z.string(),
  className: z.string(),
  subject: z.string(),
  date: z.string(),
  status: z.enum(["scheduled", "completed", "pending_results"]),
});

export const AttendanceRecordSchema = z.object({
  id: z.string(),
  className: z.string(),
  total: z.number(),
  present: z.number(),
  absent: z.number(),
  percentage: z.number(),
  date: z.string(),
});

export const GradeRecordSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  studentName: z.string(),
  subject: z.string(),
  examType: z.string(),
  score: z.number(),
  maxScore: z.number(),
  grade: z.string(),
  date: z.string(),
});

export const ExpenseSchema = z.object({
  id: z.string(),
  category: z.string(),
  description: z.string().optional().default(""),
  amount: z.number(),
  date: z.string(),
});

export const ExpenseStatsSchema = z.object({
  totalExpenses: z.number(),
  monthlyExpenses: z.number().optional(),
});

export const FeeStructureSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  classId: z.string().optional(),
  sessionId: z.string(),
  amount: z.number(),
  dueDate: z.string().optional(),
});

export const FeeCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.string(),
  isRecurring: z.boolean().optional(),
});

export const SubjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string().optional(),
});

export const TransportRouteSchema = z.object({
  id: z.string(),
  routeName: z.string(),
  routeNumber: z.string().optional(),
  startPoint: z.string().optional(),
  endPoint: z.string().optional(),
});

export const TransportVehicleSchema = z.object({
  id: z.string(),
  vehicleNumber: z.string(),
  vehicleType: z.string().optional(),
  capacity: z.number().optional(),
  routeId: z.string().optional(),
});

export const LibraryBookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  category: z.string().optional(),
  availableCopies: z.number().optional(),
});

export const LibraryTransactionSchema = z.object({
  id: z.string(),
  bookId: z.string(),
  studentId: z.string().optional(),
  status: z.string(),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
});

export const StudentsListResponseSchema = z.object({
  students: z.array(StudentSchema),
  pagination: z
    .object({
      total: z.number().optional(),
      page: z.number().optional(),
      limit: z.number().optional(),
      totalPages: z.number().optional(),
    })
    .optional(),
});

export const TeachersListResponseSchema = z.object({
  teachers: z.array(TeacherSchema),
});

export const ClassesListResponseSchema = z.object({
  classes: z.array(ClassSchema),
});

export const FeesListResponseSchema = z.object({
  fees: z.array(FeePaymentSchema),
});

export const AttendanceListResponseSchema = z.object({
  attendance: z.array(AttendanceRecordSchema),
});

export const ExpensesListResponseSchema = z.object({
  expenses: z.array(ExpenseSchema),
});

export const FeeStructuresListResponseSchema = z.object({
  structures: z.array(FeeStructureSchema),
});

export const FeeCategoriesListResponseSchema = z.object({
  categories: z.array(FeeCategorySchema),
});

export const ExamsListResponseSchema = z.object({
  exams: z.array(ExamSchema),
});

export const GradesListResponseSchema = z.object({
  grades: z.array(GradeRecordSchema),
});

export const SubjectsListResponseSchema = z.object({
  subjects: z.array(SubjectSchema),
});

export const TransportRoutesListResponseSchema = z.object({
  routes: z.array(TransportRouteSchema),
});

export const TransportVehiclesListResponseSchema = z.object({
  vehicles: z.array(TransportVehicleSchema),
});

export const LibraryBooksListResponseSchema = z.object({
  books: z.array(LibraryBookSchema),
});

export const LibraryTransactionsListResponseSchema = z.object({
  transactions: z.array(LibraryTransactionSchema),
});

export type StudentDto = z.infer<typeof StudentSchema>;
export type TeacherDto = z.infer<typeof TeacherSchema>;
export type ClassDto = z.infer<typeof ClassSchema>;
export type FeePaymentDto = z.infer<typeof FeePaymentSchema>;
export type ExamDto = z.infer<typeof ExamSchema>;
export type AttendanceRecordDto = z.infer<typeof AttendanceRecordSchema>;
export type GradeRecordDto = z.infer<typeof GradeRecordSchema>;
export type ExpenseDto = z.infer<typeof ExpenseSchema>;
export type ExpenseStatsDto = z.infer<typeof ExpenseStatsSchema>;
export type FeeStructureDto = z.infer<typeof FeeStructureSchema>;
export type FeeCategoryDto = z.infer<typeof FeeCategorySchema>;
export type SubjectDto = z.infer<typeof SubjectSchema>;
export type TransportRouteDto = z.infer<typeof TransportRouteSchema>;
export type TransportVehicleDto = z.infer<typeof TransportVehicleSchema>;
export type LibraryBookDto = z.infer<typeof LibraryBookSchema>;
export type LibraryTransactionDto = z.infer<typeof LibraryTransactionSchema>;

export type StudentsListResponseDto = z.infer<
  typeof StudentsListResponseSchema
>;
export type TeachersListResponseDto = z.infer<
  typeof TeachersListResponseSchema
>;
export type ClassesListResponseDto = z.infer<typeof ClassesListResponseSchema>;
export type FeesListResponseDto = z.infer<typeof FeesListResponseSchema>;
export type AttendanceListResponseDto = z.infer<
  typeof AttendanceListResponseSchema
>;
export type ExpensesListResponseDto = z.infer<
  typeof ExpensesListResponseSchema
>;
export type FeeStructuresListResponseDto = z.infer<
  typeof FeeStructuresListResponseSchema
>;
export type FeeCategoriesListResponseDto = z.infer<
  typeof FeeCategoriesListResponseSchema
>;
export type ExamsListResponseDto = z.infer<typeof ExamsListResponseSchema>;
export type GradesListResponseDto = z.infer<typeof GradesListResponseSchema>;
export type SubjectsListResponseDto = z.infer<
  typeof SubjectsListResponseSchema
>;
export type TransportRoutesListResponseDto = z.infer<
  typeof TransportRoutesListResponseSchema
>;
export type TransportVehiclesListResponseDto = z.infer<
  typeof TransportVehiclesListResponseSchema
>;
export type LibraryBooksListResponseDto = z.infer<
  typeof LibraryBooksListResponseSchema
>;
export type LibraryTransactionsListResponseDto = z.infer<
  typeof LibraryTransactionsListResponseSchema
>;
