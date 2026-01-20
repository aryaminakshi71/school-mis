/**
 * App Router
 *
 * Composed router with all domain routers.
 * Split into separate files to avoid TypeScript TS7056 limits.
 */

import { healthRouter } from "./health.js";
import * as schoolRouters from "./school/index.js";

export const appRouter = {
  health: healthRouter,
  // School Management Routers (19 features)
  students: schoolRouters.studentsRouter,
  attendance: schoolRouters.attendanceRouter,
  classes: schoolRouters.classesRouter,
  teachers: schoolRouters.teachersRouter,
  staff: schoolRouters.staffRouter,
  subjects: schoolRouters.subjectsRouter,
  sessions: schoolRouters.sessionsRouter,
  fees: schoolRouters.feesRouter,
  transport: schoolRouters.transportRouter,
  library: schoolRouters.libraryRouter,
  dailyWorks: schoolRouters.dailyWorksRouter,
  assignments: schoolRouters.assignmentsRouter,
  exams: schoolRouters.examsRouter,
  reportCards: schoolRouters.reportCardsRouter,
  timetable: schoolRouters.timetableRouter,
  holidays: schoolRouters.holidaysRouter,
  birthdays: schoolRouters.birthdaysRouter,
  circulars: schoolRouters.circularsRouter,
  gallery: schoolRouters.galleryRouter,
  gatePasses: schoolRouters.gatePassRouter,
  healthRecords: schoolRouters.healthRouter,
  sms: schoolRouters.smsRouter,
  directory: schoolRouters.directoryRouter,
};

export type AppRouter = typeof appRouter;
