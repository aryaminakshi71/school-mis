/**
 * App Router
 *
 * Composed router with all domain routers.
 * Split into separate files to avoid TypeScript TS7056 limits.
 */

import { healthRouter } from "./health.js";
import { metricsRouter } from "./metrics.js";
import * as schoolRouters from "./school/index.js";

export const appRouter = {
  health: healthRouter,
  metrics: metricsRouter,
  // School Management Routers (22 features)
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
  expenses: schoolRouters.expensesRouter,
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
  // New features
  chat: schoolRouters.chatRouter,
  analytics: schoolRouters.analyticsRouter,
  inventory: schoolRouters.inventoryRouter,
};

export type AppRouter = typeof appRouter;
