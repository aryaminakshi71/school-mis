import {
  classesService,
  dashboardService,
  studentsService,
  teachersService,
} from "../db-service";
import {
  attendanceService,
  examsService,
  feesService,
  libraryService,
  transportService,
} from "./services";

export * from "./date-utils";
export * from "./services";

export const dbApi = {
  students: studentsService,
  teachers: teachersService,
  classes: classesService,
  fees: feesService,
  exams: examsService,
  attendance: attendanceService,
  library: libraryService,
  transport: transportService,
  dashboard: dashboardService,
};

export default dbApi;
