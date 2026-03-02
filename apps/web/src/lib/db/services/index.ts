export { attendanceService } from "./attendance.service";
export { classesService, type Class } from "./classes.service";
export { dashboardService, type DashboardStats } from "./dashboard.service";
export { examsService } from "./exams.service";
export {
  feesService,
  type FeePayment,
  type FeePaymentCreateInput,
  mapFeePaymentRow,
} from "./fees.service";
export {
  libraryService,
  mapBookIssueRow,
  type BookIssueRow,
  type BookIssue,
  type LibraryBook,
} from "./library.service";
export {
  transportService,
  type GPSLocation,
  type TransportRoute,
  type Vehicle,
} from "./transport.service";
export { studentsService, type Student } from "./students.service";
export { teachersService, type Teacher } from "./teachers.service";
