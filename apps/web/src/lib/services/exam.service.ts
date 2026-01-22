export type ExamType = "objective" | "subjective" | "practical" | "assignment";
export type QuestionType =
  | "mcq"
  | "true-false"
  | "short-answer"
  | "long-answer"
  | "fill-blank"
  | "matching";

export interface Question {
  id: string;
  examId: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  marks: number;
  negativeMarks?: number;
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  category?: string;
  hint?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  type: ExamType;
  classId: string;
  subjectId: string;
  createdBy: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  instructions: string;
  questions: Question[];
  status: "draft" | "scheduled" | "active" | "completed" | "cancelled";
  allowRetake: boolean;
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResults: boolean;
  createdAt: Date;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  answers: Record<string, string | string[]>;
  score: number;
  totalMarks: number;
  percentage: number;
  status: "pending" | "completed" | "graded";
  startedAt: Date;
  submittedAt?: Date;
  gradedAt?: Date;
  gradedBy?: string;
  feedback?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classId: string;
  subjectId: string;
  createdBy: string;
  dueDate: Date;
  maxMarks: number;
  instructions: string;
  attachments?: string[];
  status: "draft" | "published" | "closed";
  submissions: number;
  totalStudents: number;
  createdAt: Date;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: Date;
  content: string;
  attachments?: string[];
  marks?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: Date;
  status: "submitted" | "graded" | "late";
}

function loadExams(): Exam[] {
  const saved = localStorage.getItem("school_exams");
  if (saved) {
    try {
      return JSON.parse(saved).map((e: any) => ({
        ...e,
        startDate: new Date(e.startDate),
        endDate: new Date(e.endDate),
        createdAt: new Date(e.createdAt),
      }));
    } catch {
      return [];
    }
  }
  return [];
}

function saveExams(exams: Exam[]) {
  localStorage.setItem("school_exams", JSON.stringify(exams));
}

function loadSubmissions(): ExamSubmission[] {
  const saved = localStorage.getItem("exam_submissions");
  if (saved) {
    try {
      return JSON.parse(saved).map((s: any) => ({
        ...s,
        startedAt: new Date(s.startedAt),
        submittedAt: s.submittedAt ? new Date(s.submittedAt) : undefined,
        gradedAt: s.gradedAt ? new Date(s.gradedAt) : undefined,
      }));
    } catch {
      return [];
    }
  }
  return [];
}

function saveSubmissions(submissions: ExamSubmission[]) {
  localStorage.setItem("exam_submissions", JSON.stringify(submissions));
}

class ExamService {
  private exams: Exam[] = [];
  private submissions: ExamSubmission[] = [];
  private assignments: Assignment[] = [];
  private assignmentSubmissions: AssignmentSubmission[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    this.exams = loadExams();
    this.submissions = loadSubmissions();
    this.loadAssignments();
  }

  private loadAssignments() {
    const saved = localStorage.getItem("school_assignments");
    if (saved) {
      try {
        this.assignments = JSON.parse(saved).map((a: any) => ({
          ...a,
          dueDate: new Date(a.dueDate),
          createdAt: new Date(a.createdAt),
        }));
      } catch {
        this.assignments = [];
      }
    }
    this.loadAssignmentSubmissions();
  }

  private loadAssignmentSubmissions() {
    const saved = localStorage.getItem("assignment_submissions");
    if (saved) {
      try {
        this.assignmentSubmissions = JSON.parse(saved).map((s: any) => ({
          ...s,
          submittedAt: new Date(s.submittedAt),
          gradedAt: s.gradedAt ? new Date(s.gradedAt) : undefined,
        }));
      } catch {
        this.assignmentSubmissions = [];
      }
    }
  }

  private saveAssignments() {
    localStorage.setItem(
      "school_assignments",
      JSON.stringify(this.assignments),
    );
  }

  private saveAssignmentSubmissions() {
    localStorage.setItem(
      "assignment_submissions",
      JSON.stringify(this.assignmentSubmissions),
    );
  }

  createExam(exam: Omit<Exam, "id" | "createdAt">): Exam {
    const newExam: Exam = {
      ...exam,
      id: `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };
    this.exams.push(newExam);
    saveExams(this.exams);
    return newExam;
  }

  updateExam(id: string, updates: Partial<Exam>): Exam | null {
    const exam = this.exams.find((e) => e.id === id);
    if (exam) {
      Object.assign(exam, updates);
      saveExams(this.exams);
      return exam;
    }
    return null;
  }

  deleteExam(id: string): boolean {
    const index = this.exams.findIndex((e) => e.id === id);
    if (index !== -1) {
      this.exams.splice(index, 1);
      saveExams(this.exams);
      return true;
    }
    return false;
  }

  getExams(filters?: {
    classId?: string;
    subjectId?: string;
    status?: Exam["status"];
  }): Exam[] {
    let result = this.exams;
    if (filters?.classId) {
      result = result.filter((e) => e.classId === filters.classId);
    }
    if (filters?.subjectId) {
      result = result.filter((e) => e.subjectId === filters.subjectId);
    }
    if (filters?.status) {
      result = result.filter((e) => e.status === filters.status);
    }
    return result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  getExamById(id: string): Exam | undefined {
    return this.exams.find((e) => e.id === id);
  }

  startExam(examId: string, studentId: string): ExamSubmission | null {
    const exam = this.exams.find((e) => e.id === examId);
    if (!exam || exam.status !== "active") return null;

    const existingSubmission = this.submissions.find(
      (s) => s.examId === examId && s.studentId === studentId,
    );

    if (existingSubmission && !exam.allowRetake) {
      return existingSubmission;
    }

    if (existingSubmission && existingSubmission.status !== "pending") {
      const attemptCount = this.submissions.filter(
        (s) => s.examId === examId && s.studentId === studentId,
      ).length;
      if (attemptCount >= exam.maxAttempts) {
        return null;
      }
    }

    const submission: ExamSubmission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      examId,
      studentId,
      answers: {},
      score: 0,
      totalMarks: exam.totalMarks,
      percentage: 0,
      status: "pending",
      startedAt: new Date(),
    };

    this.submissions.push(submission);
    saveSubmissions(this.submissions);
    return submission;
  }

  submitExam(
    submissionId: string,
    answers: Record<string, string | string[]>,
  ): ExamSubmission | null {
    const submission = this.submissions.find((s) => s.id === submissionId);
    if (!submission || submission.status !== "pending") return null;

    const exam = this.exams.find((e) => e.id === submission.examId);
    if (!exam) return null;

    submission.answers = answers;
    submission.submittedAt = new Date();

    const result = this.calculateScore(exam, answers);
    submission.score = result.score;
    submission.percentage = result.percentage;
    submission.status = exam.type === "objective" ? "graded" : "pending";

    if (submission.status === "graded") {
      submission.gradedAt = new Date();
    }

    saveSubmissions(this.submissions);
    return submission;
  }

  private calculateScore(
    exam: Exam,
    answers: Record<string, string | string[]>,
  ): { score: number; percentage: number } {
    let score = 0;
    let totalMarks = 0;

    exam.questions.forEach((question) => {
      totalMarks += question.marks;
      const userAnswer = answers[question.id];

      if (userAnswer === undefined || userAnswer === null) {
        return;
      }

      let isCorrect = false;

      if (Array.isArray(question.correctAnswer)) {
        isCorrect =
          Array.isArray(userAnswer) &&
          question.correctAnswer.length === userAnswer.length &&
          question.correctAnswer.every((a) => userAnswer.includes(a));
      } else {
        isCorrect =
          String(userAnswer).toLowerCase().trim() ===
          String(question.correctAnswer).toLowerCase().trim();
      }

      if (isCorrect) {
        score += question.marks;
      } else if (question.negativeMarks) {
        score -= question.negativeMarks;
      }
    });

    return {
      score: Math.max(0, score),
      percentage: totalMarks > 0 ? (score / totalMarks) * 100 : 0,
    };
  }

  gradeSubmission(
    submissionId: string,
    score: number,
    feedback?: string,
    gradedBy?: string,
  ): ExamSubmission | null {
    const submission = this.submissions.find((s) => s.id === submissionId);
    if (!submission) return null;

    submission.score = score;
    submission.percentage = (score / submission.totalMarks) * 100;
    submission.status = "graded";
    submission.gradedAt = new Date();
    submission.feedback = feedback;
    submission.gradedBy = gradedBy;

    saveSubmissions(this.submissions);
    return submission;
  }

  getSubmissions(examId: string): ExamSubmission[] {
    return this.submissions.filter((s) => s.examId === examId);
  }

  getStudentSubmissions(studentId: string): ExamSubmission[] {
    return this.submissions.filter((s) => s.studentId === studentId);
  }

  createAssignment(
    assignment: Omit<
      Assignment,
      "id" | "createdAt" | "submissions" | "totalStudents"
    >,
  ): Assignment {
    const newAssignment: Assignment = {
      ...assignment,
      id: `assign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      submissions: 0,
      totalStudents: 40,
      createdAt: new Date(),
    };
    this.assignments.push(newAssignment);
    this.saveAssignments();
    return newAssignment;
  }

  updateAssignment(
    id: string,
    updates: Partial<Assignment>,
  ): Assignment | null {
    const assignment = this.assignments.find((a) => a.id === id);
    if (assignment) {
      Object.assign(assignment, updates);
      this.saveAssignments();
      return assignment;
    }
    return null;
  }

  deleteAssignment(id: string): boolean {
    const index = this.assignments.findIndex((a) => a.id === id);
    if (index !== -1) {
      this.assignments.splice(index, 1);
      this.saveAssignments();
      return true;
    }
    return false;
  }

  getAssignments(filters?: {
    classId?: string;
    subjectId?: string;
    status?: Assignment["status"];
  }): Assignment[] {
    let result = this.assignments;
    if (filters?.classId) {
      result = result.filter((a) => a.classId === filters.classId);
    }
    if (filters?.subjectId) {
      result = result.filter((a) => a.subjectId === filters.subjectId);
    }
    if (filters?.status) {
      result = result.filter((a) => a.status === filters.status);
    }
    return result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  getAssignmentById(id: string): Assignment | undefined {
    return this.assignments.find((a) => a.id === id);
  }

  submitAssignment(
    assignmentId: string,
    studentId: string,
    studentName: string,
    content: string,
    attachments?: string[],
  ): AssignmentSubmission {
    const submission: AssignmentSubmission = {
      id: `asub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      assignmentId,
      studentId,
      studentName,
      submittedAt: new Date(),
      content,
      attachments,
      status: "submitted",
    };

    this.assignmentSubmissions.push(submission);
    this.saveAssignmentSubmissions();

    const assignment = this.assignments.find((a) => a.id === assignmentId);
    if (assignment) {
      assignment.submissions++;
      this.saveAssignments();
    }

    return submission;
  }

  gradeAssignmentSubmission(
    submissionId: string,
    marks: number,
    feedback?: string,
    gradedBy?: string,
  ): AssignmentSubmission | null {
    const submission = this.assignmentSubmissions.find(
      (s) => s.id === submissionId,
    );
    if (!submission) return null;

    submission.marks = marks;
    submission.feedback = feedback;
    submission.gradedBy = gradedBy;
    submission.gradedAt = new Date();
    submission.status = "graded";

    this.saveAssignmentSubmissions();
    return submission;
  }

  getAssignmentSubmissions(assignmentId: string): AssignmentSubmission[] {
    return this.assignmentSubmissions.filter(
      (s) => s.assignmentId === assignmentId,
    );
  }

  getExamStats(examId: string): {
    totalSubmissions: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    passRate: number;
  } {
    const submissions = this.getSubmissions(examId);
    const completed = submissions.filter((s) => s.status === "graded");

    if (completed.length === 0) {
      return {
        totalSubmissions: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passRate: 0,
      };
    }

    const scores = completed.map((s) => s.percentage);
    const exam = this.getExamById(examId);
    const passingMarks = exam
      ? (exam.passingMarks / exam.totalMarks) * 100
      : 40;

    return {
      totalSubmissions: submissions.length,
      averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      passRate:
        (scores.filter((s) => s >= passingMarks).length / scores.length) * 100,
    };
  }
}

export const examService = new ExamService();

export function useExams() {
  return {
    createExam: examService.createExam.bind(examService),
    updateExam: examService.updateExam.bind(examService),
    deleteExam: examService.deleteExam.bind(examService),
    getExams: examService.getExams.bind(examService),
    getExamById: examService.getExamById.bind(examService),
    startExam: examService.startExam.bind(examService),
    submitExam: examService.submitExam.bind(examService),
    gradeSubmission: examService.gradeSubmission.bind(examService),
    getSubmissions: examService.getSubmissions.bind(examService),
    getStudentSubmissions: examService.getStudentSubmissions.bind(examService),
    getExamStats: examService.getExamStats.bind(examService),
    createAssignment: examService.createAssignment.bind(examService),
    updateAssignment: examService.updateAssignment.bind(examService),
    deleteAssignment: examService.deleteAssignment.bind(examService),
    getAssignments: examService.getAssignments.bind(examService),
    getAssignmentById: examService.getAssignmentById.bind(examService),
    submitAssignment: examService.submitAssignment.bind(examService),
    gradeAssignmentSubmission:
      examService.gradeAssignmentSubmission.bind(examService),
    getAssignmentSubmissions:
      examService.getAssignmentSubmissions.bind(examService),
  };
}

export default examService;
