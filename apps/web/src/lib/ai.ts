import { isAIConfigured, requestStructuredAi } from "./platform-ai-client";

function toNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function toStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const normalized = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
  return normalized.length > 0 ? normalized : fallback;
}

export async function predictStudentPerformance(input: {
  studentId: string;
  pastScores: number[];
  attendance: number;
  studyHours: number;
  assignmentsCompleted: number;
}): Promise<{
  predictedScore: number;
  trend: "improving" | "stable" | "declining";
  riskLevel: "low" | "medium" | "high";
  recommendations: string[];
}> {
  const avgScore =
    input.pastScores.length > 0
      ? input.pastScores.reduce((a, b) => a + b, 0) / input.pastScores.length
      : 0;
  const scoreDiff =
    input.pastScores.length >= 2
      ? input.pastScores[input.pastScores.length - 1] -
        input.pastScores[input.pastScores.length - 2]
      : 0;

  const fallback = {
    predictedScore: Math.round(avgScore + scoreDiff * 0.5),
    trend:
      scoreDiff > 2
        ? "improving"
        : scoreDiff < -2
          ? "declining"
          : ("stable" as "improving" | "stable" | "declining"),
    riskLevel:
      input.attendance < 75 || avgScore < 50
        ? "high"
        : input.attendance < 85 || avgScore < 65
          ? "medium"
          : ("low" as "low" | "medium" | "high"),
    recommendations: ["Improve attendance", "Complete assignments on time"],
  };

  if (!isAIConfigured()) return fallback;

  const result = await requestStructuredAi(
    "Predict student performance. Return JSON with predictedScore, trend (improving/stable/declining), riskLevel (low/medium/high), recommendations array.",
    `Student: ${input.studentId}, Scores: ${input.pastScores.join(", ")}, Attendance: ${input.attendance}%, Study hours: ${input.studyHours}/week, Assignments: ${input.assignmentsCompleted}%`,
  );

  if (!result) return fallback;

  return {
    predictedScore: toNumber(result.predictedScore, fallback.predictedScore),
    trend: (result.trend || fallback.trend) as
      | "improving"
      | "stable"
      | "declining",
    riskLevel: (result.riskLevel || fallback.riskLevel) as
      | "low"
      | "medium"
      | "high",
    recommendations: toStringArray(
      result.recommendations,
      fallback.recommendations,
    ),
  };
}

export async function generatePersonalizedLearningPath(input: {
  studentId: string;
  currentGrade: number;
  targetGrade: number;
  subjects: string[];
  availableTime: number;
}): Promise<{
  path: Array<{
    topic: string;
    priority: number;
    estimatedHours: number;
    resources: string[];
  }>;
  estimatedWeeks: number;
  focusAreas: string[];
}> {
  const gap = input.targetGrade - input.currentGrade;
  const fallback = {
    path: input.subjects.slice(0, 5).map((s) => ({
      topic: s,
      priority: 1,
      estimatedHours: 2,
      resources: ["Textbook", "Online videos"],
    })),
    estimatedWeeks: Math.max(4, gap * 2),
    focusAreas: input.subjects,
  };

  if (!isAIConfigured()) return fallback;

  const result = await requestStructuredAi(
    "Generate personalized learning path. Return JSON with path array (topic, priority, estimatedHours, resources), estimatedWeeks, focusAreas array.",
    `Student: ${input.studentId}, Current: ${input.currentGrade}%, Target: ${input.targetGrade}%, Subjects: ${input.subjects.join(", ")}, Time: ${input.availableTime}h/week`,
  );

  if (!result) return fallback;

  return {
    path: result.path || fallback.path,
    estimatedWeeks: toNumber(result.estimatedWeeks, fallback.estimatedWeeks),
    focusAreas: toStringArray(result.focusAreas, fallback.focusAreas),
  };
}

export async function analyzeAttendancePattern(input: {
  studentId: string;
  attendanceHistory: number[];
  recentAbsences: number;
  reasons: string[];
}): Promise<{
  pattern: "consistent" | "irregular" | "declining";
  riskScore: number;
  triggers: string[];
  interventions: string[];
}> {
  const avgAttendance =
    input.attendanceHistory.length > 0
      ? input.attendanceHistory.reduce((a, b) => a + b, 0) /
        input.attendanceHistory.length
      : 90;

  const fallback = {
    pattern:
      input.recentAbsences > 3
        ? "declining"
        : avgAttendance > 85
          ? "consistent"
          : ("irregular" as "consistent" | "irregular" | "declining"),
    riskScore:
      input.recentAbsences > 5 ? 80 : input.recentAbsences > 2 ? 50 : 20,
    triggers: ["Monday absences", "Post-holiday periods"],
    interventions: ["Parent meeting", "Attendance incentives"],
  };

  if (!isAIConfigured()) return fallback;

  const result = await requestStructuredAi(
    "Analyze attendance pattern. Return JSON with pattern (consistent/irregular/declining), riskScore (0-100), triggers array, interventions array.",
    `Student: ${input.studentId}, History: ${input.attendanceHistory.join(", ")}%, Recent absences: ${input.recentAbsences}, Reasons: ${input.reasons.join(", ")}`,
  );

  if (!result) return fallback;

  return {
    pattern: (result.pattern || fallback.pattern) as
      | "consistent"
      | "irregular"
      | "declining",
    riskScore: toNumber(result.riskScore, fallback.riskScore),
    triggers: toStringArray(result.triggers, fallback.triggers),
    interventions: toStringArray(result.interventions, fallback.interventions),
  };
}

export async function recommendTeachingStrategies(input: {
  studentId: string;
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading";
  performanceData: number[];
  subject: string;
}): Promise<{
  strategies: string[];
  resources: string[];
  approach: string;
}> {
  const avgPerformance =
    input.performanceData.length > 0
      ? input.performanceData.reduce((a, b) => a + b, 0) /
        input.performanceData.length
      : 60;

  const styleStrategies: Record<string, string[]> = {
    visual: ["Use diagrams and charts", "Video tutorials", "Color-coded notes"],
    auditory: [
      "Discussion-based learning",
      "Audiobooks",
      "Verbal explanations",
    ],
    kinesthetic: [
      "Hands-on activities",
      "Role-play",
      "Interactive simulations",
    ],
    reading: [
      "Written materials",
      "Reading comprehension exercises",
      "Note-taking",
    ],
  };

  const fallback = {
    strategies: styleStrategies[input.learningStyle] || styleStrategies.visual,
    resources: ["Educational videos", "Practice worksheets", "Online quizzes"],
    approach:
      avgPerformance > 70
        ? "Challenge with advanced content"
        : "Focus on fundamentals",
  };

  if (!isAIConfigured()) return fallback;

  const result = await requestStructuredAi(
    "Recommend teaching strategies. Return JSON with strategies array, resources array, approach.",
    `Student: ${input.studentId}, Style: ${input.learningStyle}, Performance: ${input.performanceData.join(", ")}, Subject: ${input.subject}`,
  );

  if (!result) return fallback;

  return {
    strategies: toStringArray(result.strategies, fallback.strategies),
    resources: toStringArray(result.resources, fallback.resources),
    approach: result.approach || fallback.approach,
  };
}

export async function predictAtRiskStudents(input: {
  classId: string;
  students: Array<{
    id: string;
    attendance: number;
    avgScore: number;
    assignmentsCompleted: number;
  }>;
}): Promise<{
  atRiskStudents: Array<{
    studentId: string;
    riskScore: number;
    reasons: string[];
  }>;
  classInsights: string[];
}> {
  const atRisk = input.students
    .filter(
      (s) =>
        s.attendance < 75 || s.avgScore < 50 || s.assignmentsCompleted < 60,
    )
    .map((s) => {
      let riskScore = 0;
      if (s.attendance < 75) riskScore += 30;
      if (s.avgScore < 50) riskScore += 40;
      if (s.assignmentsCompleted < 60) riskScore += 30;
      return {
        studentId: s.id,
        riskScore,
        reasons: [
          s.attendance < 75 ? "Low attendance" : "",
          s.avgScore < 50 ? "Low grades" : "",
          s.assignmentsCompleted < 60 ? "Incomplete assignments" : "",
        ].filter(Boolean),
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore);

  const fallback = {
    atRiskStudents: atRisk.slice(0, 10),
    classInsights: ["Review attendance policy", "Offer tutoring sessions"],
  };

  if (!isAIConfigured()) return fallback;

  const result = await requestStructuredAi(
    "Predict at-risk students. Return JSON with atRiskStudents array (studentId, riskScore, reasons) and classInsights array.",
    `Class: ${input.classId}, Students: ${JSON.stringify(input.students)}`,
  );

  if (!result) return fallback;

  return {
    atRiskStudents: result.atRiskStudents || fallback.atRiskStudents,
    classInsights: toStringArray(result.classInsights, fallback.classInsights),
  };
}
