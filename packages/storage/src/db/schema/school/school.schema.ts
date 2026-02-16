import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  integer,
  jsonb,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Enums
export const SessionStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ARCHIVED: "archived",
} as const;

export const FeePaymentStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const AttendanceStatus = {
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  EXCUSED: "excused",
} as const;

export const ExamType = {
  PT1: "pt1",
  PT2: "pt2",
  HALF_YEARLY: "half_yearly",
  FINAL: "final",
} as const;

export const TransportStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  MAINTENANCE: "maintenance",
} as const;

// Sessions Table
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  isActive: boolean("is_active").default(false),
  status: varchar("status", { length: 20 }).default(SessionStatus.ACTIVE),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Classes Table
export const classes = pgTable("classes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  section: text("section"),
  sessionId: uuid("session_id").references(() => sessions.id),
  classTeacherId: uuid("class_teacher_id"),
  capacity: integer("capacity"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Students Table
export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),
  admissionNumber: text("admission_number").unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  dateOfBirth: date("date_of_birth"),
  gender: text("gender"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  aadharNumber: text("aadhar_number"),
  bloodGroup: text("blood_group"),
  photo: text("photo"),
  classId: uuid("class_id").references(() => classes.id),
  sessionId: uuid("session_id").references(() => sessions.id),
  transportRouteId: uuid("transport_route_id"),
  fatherName: text("father_name"),
  fatherPhone: text("father_phone"),
  motherName: text("mother_name"),
  motherPhone: text("mother_phone"),
  guardianName: text("guardian_name"),
  guardianPhone: text("guardian_phone"),
  status: boolean("status").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Teachers Table
export const teachers = pgTable("teachers", {
  id: uuid("id").defaultRandom().primaryKey(),
  employeeId: text("employee_id").unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique(),
  phone: text("phone"),
  dateOfBirth: date("date_of_birth"),
  gender: text("gender"),
  qualification: text("qualification"),
  experience: integer("experience"),
  address: text("address"),
  subjectSpecialization: text("subject_specialization"),
  photo: text("photo"),
  status: boolean("status").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Staff Table
export const staff = pgTable("staff", {
  id: uuid("id").defaultRandom().primaryKey(),
  employeeId: text("employee_id").unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique(),
  phone: text("phone"),
  designation: text("designation"),
  department: text("department"),
  dateOfBirth: date("date_of_birth"),
  address: text("address"),
  photo: text("photo"),
  status: boolean("status").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Daily Works Table
export const dailyWorks = pgTable("daily_works", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  classId: uuid("class_id").references(() => classes.id),
  subjectId: uuid("subject_id"),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  workDate: date("work_date").notNull(),
  workType: text("work_type").notNull(), // homework, classwork, assignment
  attachments: jsonb("attachments"),
  status: varchar("status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subjects Table
export const subjects = pgTable("subjects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  code: text("code").unique(),
  classId: uuid("class_id").references(() => classes.id),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Exam Schedule (Datesheet) Table
export const examSchedules = pgTable("exam_schedules", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  examType: varchar("exam_type", { length: 20 }).notNull(), // pt1, pt2, half_yearly, final
  sessionId: uuid("session_id").references(() => sessions.id),
  classId: uuid("class_id").references(() => classes.id),
  subjectId: uuid("subject_id").references(() => subjects.id),
  examDate: date("exam_date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  totalMarks: integer("total_marks"),
  passingMarks: integer("passing_marks"),
  roomNumber: text("room_number"),
  status: varchar("status", { length: 20 }).default("scheduled"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Report Cards Table
export const reportCards = pgTable("report_cards", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .references(() => students.id)
    .notNull(),
  classId: uuid("class_id")
    .references(() => classes.id)
    .notNull(),
  sessionId: uuid("session_id")
    .references(() => sessions.id)
    .notNull(),
  examType: varchar("exam_type", { length: 20 }).notNull(),
  totalMarks: decimal("total_marks", { precision: 5, scale: 2 }),
  obtainedMarks: decimal("obtained_marks", { precision: 5, scale: 2 }),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  grade: text("grade"),
  rank: integer("rank"),
  attendance: integer("attendance"),
  conduct: text("conduct"),
  remarks: text("remarks"),
  promotedToClassId: uuid("promoted_to_class_id"),
  status: varchar("status", { length: 20 }).default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Report Card Details (Individual Subject Marks)
export const reportCardDetails = pgTable("report_card_details", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportCardId: uuid("report_card_id")
    .references(() => reportCards.id)
    .notNull(),
  subjectId: uuid("subject_id")
    .references(() => subjects.id)
    .notNull(),
  maxMarks: integer("max_marks").notNull(),
  obtainedMarks: decimal("obtained_marks", {
    precision: 5,
    scale: 2,
  }).notNull(),
  grade: text("grade"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fee Categories Table
export const feeCategories = pgTable("fee_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // tuition, transport, misc, exam, library
  isRecurring: boolean("is_recurring").default(false),
  frequency: text("frequency"), // monthly, quarterly, yearly
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fee Structure Table
export const feeStructures = pgTable("fee_structures", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id")
    .references(() => feeCategories.id)
    .notNull(),
  classId: uuid("class_id").references(() => classes.id),
  sessionId: uuid("session_id")
    .references(() => sessions.id)
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: date("due_date"),
  lateFee: decimal("late_fee", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student Fee Allocations
export const studentFeeAllocations = pgTable("student_fee_allocations", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .references(() => students.id)
    .notNull(),
  feeStructureId: uuid("fee_structure_id")
    .references(() => feeStructures.id)
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  waived: boolean("waived").default(false),
  status: varchar("status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fee Payments Table
export const feePayments = pgTable("fee_payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .references(() => students.id)
    .notNull(),
  allocationId: uuid("allocation_id")
    .references(() => studentFeeAllocations.id)
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: timestamp("payment_date").defaultNow(),
  paymentMethod: text("payment_method"),
  transactionId: text("transaction_id"),
  receiptNumber: text("receipt_number").unique(),
  status: varchar("status", { length: 20 }).default(FeePaymentStatus.PENDING),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fee Payment History (for tracking all changes)
export const feePaymentHistory = pgTable("fee_payment_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  paymentId: uuid("payment_id")
    .references(() => feePayments.id)
    .notNull(),
  action: text("action").notNull(),
  previousData: jsonb("previous_data"),
  newData: jsonb("new_data"),
  performedBy: uuid("performed_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Holidays Table
export const holidays = pgTable("holidays", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: date("date").notNull(),
  type: text("type").notNull(), // national, festival, vacation
  isRecurring: boolean("is_recurring").default(false),
  sessionId: uuid("session_id").references(() => sessions.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attendance Table
export const attendance = pgTable("attendance", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .references(() => students.id)
    .notNull(),
  classId: uuid("class_id")
    .references(() => classes.id)
    .notNull(),
  sessionId: uuid("session_id")
    .references(() => sessions.id)
    .notNull(),
  date: date("date").notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  checkInTime: time("check_in_time"),
  checkOutTime: time("check_out_time"),
  remarks: text("remarks"),
  markedBy: uuid("marked_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attendance Summary
export const attendanceSummaries = pgTable("attendance_summaries", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .references(() => students.id)
    .notNull(),
  classId: uuid("class_id")
    .references(() => classes.id)
    .notNull(),
  sessionId: uuid("session_id")
    .references(() => sessions.id)
    .notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  totalDays: integer("total_days").default(0),
  presentDays: integer("present_days").default(0),
  absentDays: integer("absent_days").default(0),
  lateDays: integer("late_days").default(0),
  excusedDays: integer("excused_days").default(0),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transport Routes Table
export const transportRoutes = pgTable("transport_routes", {
  id: uuid("id").defaultRandom().primaryKey(),
  routeNumber: text("route_number").unique(),
  routeName: text("route_name").notNull(),
  startPoint: text("start_point").notNull(),
  endPoint: text("end_point").notNull(),
  distance: decimal("distance", { precision: 5, scale: 2 }),
  estimatedTime: integer("estimated_time"), // in minutes
  status: varchar("status", { length: 20 }).default(TransportStatus.ACTIVE),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vehicles Table
export const vehicles = pgTable("vehicles", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleNumber: text("vehicle_number").unique(),
  vehicleType: text("vehicle_type").notNull(), // bus, van, mini bus
  capacity: integer("capacity").notNull(),
  routeId: uuid("route_id").references(() => transportRoutes.id),
  status: varchar("status", { length: 20 }).default(TransportStatus.ACTIVE),
  insuranceExpiry: date("insurance_expiry"),
  fitnessExpiry: date("fitness_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Drivers Table
export const drivers = pgTable("drivers", {
  id: uuid("id").defaultRandom().primaryKey(),
  employeeId: text("employee_id").unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  licenseNumber: text("license_number"),
  licenseExpiry: date("license_expiry"),
  address: text("address"),
  photo: text("photo"),
  status: boolean("status").default(true),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Conductors Table
export const conductors = pgTable("conductors", {
  id: uuid("id").defaultRandom().primaryKey(),
  employeeId: text("employee_id").unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  photo: text("photo"),
  status: boolean("status").default(true),
  routeId: uuid("route_id").references(() => transportRoutes.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// GPS Tracking Table
export const gpsTracking = pgTable("gps_tracking", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id)
    .notNull(),
  driverId: uuid("driver_id").references(() => drivers.id),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  speed: decimal("speed", { precision: 5, scale: 2 }),
  timestamp: timestamp("timestamp").defaultNow(),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Health Records Table
export const healthRecords = pgTable("health_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .references(() => students.id)
    .notNull(),
  visitDate: date("visit_date").notNull(),
  visitType: text("visit_type").notNull(), // exam, routine, emergency
  symptoms: text("symptoms"),
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  medication: text("medication"),
  doctorName: text("doctor_name"),
  temperature: decimal("temperature", { precision: 4, scale: 1 }),
  bloodPressure: text("blood_pressure"),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  height: decimal("height", { precision: 5, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Health Statistics Summary
export const healthSummaries = pgTable("health_summaries", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .references(() => students.id)
    .notNull(),
  sessionId: uuid("session_id")
    .references(() => sessions.id)
    .notNull(),
  totalVisits: integer("total_visits").default(0),
  examVisits: integer("exam_visits").default(0),
  emergencyVisits: integer("emergency_visits").default(0),
  routineVisits: integer("routine_visits").default(0),
  sickLeaves: integer("sick_leaves").default(0),
  lastCheckupDate: date("last_checkup_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Library Books Table
export const libraryBooks = pgTable("library_books", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookNumber: text("book_number").unique(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  publisher: text("publisher"),
  edition: text("edition"),
  isbn: text("isbn"),
  category: text("category"),
  shelfNumber: text("shelf_number"),
  rackNumber: text("rack_number"),
  totalCopies: integer("total_copies").notNull(),
  availableCopies: integer("available_copies").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 20 }).default("available"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Book Issues Table
export const bookIssues = pgTable("book_issues", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookId: uuid("book_id")
    .references(() => libraryBooks.id)
    .notNull(),
  studentId: uuid("student_id").references(() => students.id),
  staffId: uuid("staff_id").references(() => staff.id),
  issueDate: date("issue_date").notNull(),
  dueDate: date("due_date").notNull(),
  returnDate: date("return_date"),
  condition: text("condition"), // good, damaged, lost
  fine: decimal("fine", { precision: 10, scale: 2 }).default("0"),
  status: varchar("status", { length: 20 }).default("issued"),
  issuedBy: uuid("issued_by"),
  returnedTo: uuid("returned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Timetable Table
export const timetables = pgTable("timetables", {
  id: uuid("id").defaultRandom().primaryKey(),
  classId: uuid("class_id")
    .references(() => classes.id)
    .notNull(),
  sessionId: uuid("session_id")
    .references(() => sessions.id)
    .notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 1=Monday, 7=Sunday
  periodNumber: integer("period_number").notNull(),
  subjectId: uuid("subject_id")
    .references(() => subjects.id)
    .notNull(),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  roomNumber: text("room_number"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assignments Table
export const assignments = pgTable("assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  classId: uuid("class_id")
    .references(() => classes.id)
    .notNull(),
  subjectId: uuid("subject_id")
    .references(() => subjects.id)
    .notNull(),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  dueDate: timestamp("due_date").notNull(),
  maxMarks: integer("max_marks"),
  submissionType: text("submission_type").default("online"), // online, offline
  attachments: jsonb("attachments"),
  status: varchar("status", { length: 20 }).default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assignment Submissions Table
export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  assignmentId: uuid("assignment_id")
    .references(() => assignments.id)
    .notNull(),
  studentId: uuid("student_id")
    .references(() => students.id)
    .notNull(),
  submittedDate: timestamp("submitted_date").defaultNow(),
  content: text("content"),
  attachments: jsonb("attachments"),
  marks: decimal("marks", { precision: 5, scale: 2 }),
  feedback: text("feedback"),
  status: varchar("status", { length: 20 }).default("submitted"), // submitted, graded, late
  gradedBy: uuid("graded_by"),
  gradedAt: timestamp("graded_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Circulars Table
export const circulars = pgTable("circulars", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  circularNumber: text("circular_number").unique(),
  date: date("date").notNull(),
  type: text("type").notNull(), // general, exam, holiday, fee, transport
  priority: text("priority").default("normal"), // urgent, normal
  targetAudience: jsonb("target_audience"), // students, parents, staff, all
  attachments: jsonb("attachments"),
  publishedBy: uuid("published_by"),
  publishedAt: timestamp("published_at"),
  status: varchar("status", { length: 20 }).default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gallery Table
export const gallery = pgTable("gallery", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: date("date").notNull(),
  category: text("category"), // events, sports, functions, daily-activities
  location: text("location"),
  coverImage: text("cover_image"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gallery Images Table
export const galleryImages = pgTable("gallery_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  galleryId: uuid("gallery_id")
    .references(() => gallery.id)
    .notNull(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  order: integer("order").default(0),
  uploadedBy: uuid("uploaded_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Gate Pass Table
export const gatePasses = pgTable("gate_passes", {
  id: uuid("id").defaultRandom().primaryKey(),
  passNumber: text("pass_number").unique(),
  studentId: uuid("student_id")
    .references(() => students.id)
    .notNull(),
  requestedBy: uuid("requested_by").notNull(), // parent, staff
  reason: text("reason").notNull(),
  exitDate: date("exit_date").notNull(),
  exitTime: time("exit_time").notNull(),
  expectedReturnDate: date("expected_return_date"),
  expectedReturnTime: time("expected_return_time"),
  actualReturnDate: date("actual_return_date"),
  actualReturnTime: time("actual_return_time"),
  guardianName: text("guardian_name"),
  guardianPhone: text("guardian_phone"),
  guardianRelation: text("guardian_relation"),
  status: varchar("status", { length: 20 }).default("pending"), // pending, approved, rejected, used, cancelled
  approvedBy: uuid("approved_by"),
  approvedAt: timestamp("approved_at"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SMS Log Table
export const smsLogs = pgTable("sms_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  recipientType: text("recipient_type").notNull(), // student, parent, staff, teacher
  recipientId: uuid("recipient_id").notNull(),
  phoneNumber: text("phone_number").notNull(),
  message: text("message").notNull(),
  templateId: text("template_id"),
  status: varchar("status", { length: 20 }).default("pending"), // pending, sent, delivered, failed
  gatewayResponse: jsonb("gateway_response"),
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

// SMS Templates Table
export const smsTemplates = pgTable("sms_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  templateId: text("template_id").unique(),
  content: text("content").notNull(),
  type: text("type").notNull(), // attendance, fee, exam, general, alert
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Directory (Contacts) Table
export const directory = pgTable("directory", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  role: text("role").notNull(), // teacher, staff, parent, student, admin
  department: text("department"),
  designation: text("designation"),
  photo: text("photo"),
  address: text("address"),
  isActive: boolean("is_active").default(true),
  lastContactedAt: timestamp("last_contacted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Birthday Calendar (View)
export const birthdays = pgTable("birthdays", {
  id: uuid("id").primaryKey(),
  personType: text("person_type").notNull(), // student, teacher, staff
  personId: uuid("person_id").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  dateOfBirth: date("date_of_birth").notNull(),
  monthDay: text("month_day").notNull(), // MM-DD format for easy lookup
  photo: text("photo"),
});

// Relations
export const sessionsRelations = relations(sessions, ({ many }) => ({
  classes: many(classes),
  students: many(students),
  examSchedules: many(examSchedules),
  feeStructures: many(feeStructures),
  holidays: many(holidays),
  attendance: many(attendance),
  healthSummaries: many(healthSummaries),
  timetables: many(timetables),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  session: one(sessions, {
    fields: [classes.sessionId],
    references: [sessions.id],
  }),
  students: many(students),
  teachers: many(teachers),
  subjects: many(subjects),
  dailyWorks: many(dailyWorks),
  examSchedules: many(examSchedules),
  reportCards: many(reportCards),
  attendance: many(attendance),
  attendanceSummaries: many(attendanceSummaries),
  transportRoutes: many(transportRoutes),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  class: one(classes, {
    fields: [students.classId],
    references: [classes.id],
  }),
  session: one(sessions, {
    fields: [students.sessionId],
    references: [sessions.id],
  }),
  feePayments: many(feePayments),
  studentFeeAllocations: many(studentFeeAllocations),
  attendance: many(attendance),
  attendanceSummaries: many(attendanceSummaries),
  reportCards: many(reportCards),
  healthRecords: many(healthRecords),
  healthSummaries: many(healthSummaries),
  bookIssues: many(bookIssues),
  assignmentSubmissions: many(assignmentSubmissions),
  gatePasses: many(gatePasses),
}));

export const teachersRelations = relations(teachers, ({ many }) => ({
  subjects: many(subjects),
  dailyWorks: many(dailyWorks),
  assignments: many(assignments),
  timetables: many(timetables),
  classTeacher: many(classes, { relationName: "classTeacher" }),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  class: one(classes, {
    fields: [subjects.classId],
    references: [classes.id],
  }),
  teacher: one(teachers, {
    fields: [subjects.teacherId],
    references: [teachers.id],
  }),
  examSchedules: many(examSchedules),
  reportCardDetails: many(reportCardDetails),
  assignments: many(assignments),
  timetables: many(timetables),
}));

export const feeStructuresRelations = relations(
  feeStructures,
  ({ one, many }) => ({
    category: one(feeCategories, {
      fields: [feeStructures.categoryId],
      references: [feeCategories.id],
    }),
    session: one(sessions, {
      fields: [feeStructures.sessionId],
      references: [sessions.id],
    }),
    class: one(classes, {
      fields: [feeStructures.classId],
      references: [classes.id],
    }),
    studentAllocations: many(studentFeeAllocations),
  }),
);

export const studentFeeAllocationsRelations = relations(
  studentFeeAllocations,
  ({ one, many }) => ({
    student: one(students, {
      fields: [studentFeeAllocations.studentId],
      references: [students.id],
    }),
    feeStructure: one(feeStructures, {
      fields: [studentFeeAllocations.feeStructureId],
      references: [feeStructures.id],
    }),
    payments: many(feePayments),
  }),
);

export const feePaymentsRelations = relations(feePayments, ({ one }) => ({
  student: one(students, {
    fields: [feePayments.studentId],
    references: [students.id],
  }),
  allocation: one(studentFeeAllocations, {
    fields: [feePayments.allocationId],
    references: [studentFeeAllocations.id],
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.id],
  }),
  class: one(classes, {
    fields: [attendance.classId],
    references: [classes.id],
  }),
  session: one(sessions, {
    fields: [attendance.sessionId],
    references: [sessions.id],
  }),
}));

export const transportRoutesRelations = relations(
  transportRoutes,
  ({ many }) => ({
    vehicles: many(vehicles),
    conductors: many(conductors),
  }),
);

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  route: one(transportRoutes, {
    fields: [vehicles.routeId],
    references: [transportRoutes.id],
  }),
  driver: one(drivers, {
    fields: [vehicles.id],
    references: [drivers.vehicleId],
  }),
  gpsTracking: many(gpsTracking),
}));

export const driversRelations = relations(drivers, ({ one, many }) => ({
  vehicle: one(vehicles, {
    fields: [drivers.vehicleId],
    references: [vehicles.id],
  }),
  gpsTracking: many(gpsTracking),
}));

export const healthRecordsRelations = relations(healthRecords, ({ one }) => ({
  student: one(students, {
    fields: [healthRecords.studentId],
    references: [students.id],
  }),
}));

export const libraryBooksRelations = relations(libraryBooks, ({ many }) => ({
  bookIssues: many(bookIssues),
}));

export const bookIssuesRelations = relations(bookIssues, ({ one }) => ({
  book: one(libraryBooks, {
    fields: [bookIssues.bookId],
    references: [libraryBooks.id],
  }),
  student: one(students, {
    fields: [bookIssues.studentId],
    references: [students.id],
  }),
  staff: one(staff, {
    fields: [bookIssues.staffId],
    references: [staff.id],
  }),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  class: one(classes, {
    fields: [assignments.classId],
    references: [classes.id],
  }),
  subject: one(subjects, {
    fields: [assignments.subjectId],
    references: [subjects.id],
  }),
  teacher: one(teachers, {
    fields: [assignments.teacherId],
    references: [teachers.id],
  }),
  submissions: many(assignmentSubmissions),
}));

export const assignmentSubmissionsRelations = relations(
  assignmentSubmissions,
  ({ one }) => ({
    assignment: one(assignments, {
      fields: [assignmentSubmissions.assignmentId],
      references: [assignments.id],
    }),
    student: one(students, {
      fields: [assignmentSubmissions.studentId],
      references: [students.id],
    }),
  }),
);

export const circularsRelations = relations(circulars, ({ many }) => ({
  gallery: many(gallery),
}));

export const galleryRelations = relations(gallery, ({ many }) => ({
  images: many(galleryImages),
}));

export const galleryImagesRelations = relations(galleryImages, ({ one }) => ({
  gallery: one(gallery, {
    fields: [galleryImages.galleryId],
    references: [gallery.id],
  }),
}));

export const gatePassesRelations = relations(gatePasses, ({ one }) => ({
  student: one(students, {
    fields: [gatePasses.studentId],
    references: [students.id],
  }),
}));

export const smsLogsRelations = relations(smsLogs, ({ many }) => ({
  templates: many(smsTemplates),
}));

export const smsTemplatesRelations = relations(smsTemplates, ({ many }) => ({
  logs: many(smsLogs),
}));

export const reportCardsRelations = relations(reportCards, ({ one, many }) => ({
  student: one(students, {
    fields: [reportCards.studentId],
    references: [students.id],
  }),
  class: one(classes, {
    fields: [reportCards.classId],
    references: [classes.id],
  }),
  session: one(sessions, {
    fields: [reportCards.sessionId],
    references: [sessions.id],
  }),
  details: many(reportCardDetails),
}));

export const reportCardDetailsRelations = relations(
  reportCardDetails,
  ({ one }) => ({
    reportCard: one(reportCards, {
      fields: [reportCardDetails.reportCardId],
      references: [reportCards.id],
    }),
    subject: one(subjects, {
      fields: [reportCardDetails.subjectId],
      references: [subjects.id],
    }),
  }),
);

export const dailyWorksRelations = relations(dailyWorks, ({ one }) => ({
  class: one(classes, {
    fields: [dailyWorks.classId],
    references: [classes.id],
  }),
  teacher: one(teachers, {
    fields: [dailyWorks.teacherId],
    references: [teachers.id],
  }),
}));

export const timetablesRelations = relations(timetables, ({ one }) => ({
  class: one(classes, {
    fields: [timetables.classId],
    references: [classes.id],
  }),
  session: one(sessions, {
    fields: [timetables.sessionId],
    references: [sessions.id],
  }),
  subject: one(subjects, {
    fields: [timetables.subjectId],
    references: [subjects.id],
  }),
  teacher: one(teachers, {
    fields: [timetables.teacherId],
    references: [teachers.id],
  }),
}));

export const holidaysRelations = relations(holidays, ({ one }) => ({
  session: one(sessions, {
    fields: [holidays.sessionId],
    references: [sessions.id],
  }),
}));

export const examSchedulesRelations = relations(examSchedules, ({ one }) => ({
  session: one(sessions, {
    fields: [examSchedules.sessionId],
    references: [sessions.id],
  }),
  class: one(classes, {
    fields: [examSchedules.classId],
    references: [classes.id],
  }),
  subject: one(subjects, {
    fields: [examSchedules.subjectId],
    references: [subjects.id],
  }),
}));

export const feeCategoriesRelations = relations(feeCategories, ({ many }) => ({
  structures: many(feeStructures),
}));

export const attendanceSummariesRelations = relations(
  attendanceSummaries,
  ({ one }) => ({
    student: one(students, {
      fields: [attendanceSummaries.studentId],
      references: [students.id],
    }),
    class: one(classes, {
      fields: [attendanceSummaries.classId],
      references: [classes.id],
    }),
    session: one(sessions, {
      fields: [attendanceSummaries.sessionId],
      references: [sessions.id],
    }),
  }),
);

export const healthSummariesRelations = relations(
  healthSummaries,
  ({ one }) => ({
    student: one(students, {
      fields: [healthSummaries.studentId],
      references: [students.id],
    }),
    session: one(sessions, {
      fields: [healthSummaries.sessionId],
      references: [sessions.id],
    }),
  }),
);

export const staffRelations = relations(staff, ({ many }) => ({
  bookIssues: many(bookIssues),
}));

export const conductorsRelations = relations(conductors, ({ one }) => ({
  route: one(transportRoutes, {
    fields: [conductors.routeId],
    references: [transportRoutes.id],
  }),
}));

export const gpsTrackingRelations = relations(gpsTracking, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [gpsTracking.vehicleId],
    references: [vehicles.id],
  }),
  driver: one(drivers, {
    fields: [gpsTracking.driverId],
    references: [drivers.id],
  }),
}));

export const feePaymentHistoryRelations = relations(
  feePaymentHistory,
  ({ one }) => ({
    payment: one(feePayments, {
      fields: [feePaymentHistory.paymentId],
      references: [feePayments.id],
    }),
  }),
);

export const directoryRelations = relations(directory, ({ many }) => ({
  birthdays: many(birthdays),
}));

// Expenses Table
export const expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: date("date").notNull(),
  paymentMethod: text("payment_method"),
  paidTo: text("paid_to"),
  status: varchar("status", { length: 20 }).default("pending"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
