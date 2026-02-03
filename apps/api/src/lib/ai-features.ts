/**
 * School MIS AI Features
 *
 * AI-powered features for School MIS:
 * - Student performance prediction
 * - Attendance pattern analysis
 * - Grade prediction
 * - Personalized learning recommendations
 */

import { createAIClient, predictScore, generateSuggestions, analyzeText } from "./ai";

const ai = createAIClient({ provider: "openai" });

/**
 * Predict student performance
 */
export async function predictStudentPerformance(
  studentData: {
    name: string;
    currentGrades?: Record<string, number>;
    attendance?: number;
    pastPerformance?: string;
  }
): Promise<{ score: number; reasoning: string; recommendations: string[] }> {
  if (!ai) {
    return { score: 50, reasoning: "AI not configured", recommendations: [] };
  }

  const context = `Student: ${studentData.name}, Grades: ${JSON.stringify(studentData.currentGrades || {})}, Attendance: ${studentData.attendance || "N/A"}%`;
  const prediction = await predictScore(ai, context, "success");
  const recommendations = await generateSuggestions(ai, "School-MIS", context, "improvements");

  return {
    score: prediction.score,
    reasoning: prediction.reasoning,
    recommendations,
  };
}

/**
 * Analyze attendance patterns
 */
export async function analyzeAttendancePattern(
  attendanceData: {
    studentId: string;
    attendanceRecords: Array<{ date: string; present: boolean }>;
  }
): Promise<{ pattern: string; risk: "low" | "medium" | "high" }> {
  if (!ai) {
    return { pattern: "No pattern detected", risk: "low" };
  }

  const attendanceSummary = attendanceData.attendanceRecords
    .map((r) => `${r.date}: ${r.present ? "present" : "absent"}`)
    .join("\n");

  const analysis = await analyzeText(ai, attendanceSummary, "summary");
  const presentCount = attendanceData.attendanceRecords.filter((r) => r.present).length;
  const totalCount = attendanceData.attendanceRecords.length;
  const attendanceRate = (presentCount / totalCount) * 100;

  return {
    pattern: analysis.summary || "No pattern detected",
    risk: attendanceRate < 70 ? "high" : attendanceRate < 85 ? "medium" : "low",
  };
}
