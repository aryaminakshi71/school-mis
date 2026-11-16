import OpenAI from "openai";

interface AIChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface StudentPerformanceData {
  studentId: string;
  name: string;
  grades: Array<{
    subject: string;
    marks: number;
    maxMarks: number;
  }>;
  attendance: number;
  behaviorScore: number;
  participationLevel: "high" | "medium" | "low";
}

export class AIService {
  private openai: OpenAI;
  private conversationHistory: Map<string, AIChatMessage[]> = new Map();

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });
  }

  // AI Chat Assistant for general queries
  async chat(
    userId: string,
    message: string,
    context?: {
      userRole: "student" | "teacher" | "parent" | "admin";
      studentId?: string;
    },
  ): Promise<string> {
    // Get or initialize conversation history
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, []);
    }
    const history = this.conversationHistory.get(userId)!;

    // Add user message
    history.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Prepare system prompt based on user role
    const systemPrompt = this.getSystemPrompt(context?.userRole);

    // Call OpenAI API
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          ...history.slice(-10).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const assistantMessage =
        response.choices[0]?.message?.content ||
        "I'm not sure how to help with that.";

      // Add assistant response to history
      history.push({
        role: "assistant",
        content: assistantMessage,
        timestamp: new Date(),
      });

      // Keep only last 20 messages
      if (history.length > 20) {
        this.conversationHistory.set(userId, history.slice(-20));
      }

      return assistantMessage;
    } catch (error) {
      console.error("AI Chat Error:", error);
      return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
    }
  }

  // Get system prompt based on user role
  private getSystemPrompt(role?: string): string {
    const basePrompt = `You are an AI assistant for School MIS, a comprehensive school management system. 
You help users with questions about:
- School operations and procedures
- Academic information
- Administrative tasks
- Technical support for the platform

Always be helpful, professional, and concise. If you don't know something, admit it and suggest contacting the school administration.`;

    switch (role) {
      case "student":
        return `${basePrompt}
You are assisting a student. Focus on:
- Homework help and explanations
- Study tips and resources
- Understanding school rules
- Extracurricular activities
- Academic planning`;

      case "parent":
        return `${basePrompt}
You are assisting a parent. Focus on:
- Child's academic progress
- Fee payments and financial queries
- School events and meetings
- Communication with teachers
- Understanding school policies`;

      case "teacher":
        return `${basePrompt}
You are assisting a teacher. Focus on:
- Lesson planning ideas
- Grading and assessment strategies
- Student performance analysis
- Classroom management tips
- Using the MIS platform effectively`;

      case "admin":
        return `${basePrompt}
You are assisting a school administrator. Focus on:
- School management best practices
- Data analysis and reporting
- Policy implementation
- Resource optimization
- Staff management`;

      default:
        return basePrompt;
    }
  }

  // AI Homework Helper
  async helpWithHomework(
    subject: string,
    question: string,
    grade: string,
  ): Promise<{
    explanation: string;
    steps: string[];
    hints: string[];
    resources: string[];
  }> {
    const prompt = `You are a helpful tutor for a ${grade} grade student studying ${subject}.

The student asks: "${question}"

Provide a helpful response in this JSON format:
{
  "explanation": "Clear explanation of the concept/solution",
  "steps": ["Step 1", "Step 2", "Step 3"],
  "hints": ["Hint 1", "Hint 2"],
  "resources": ["Resource 1", "Resource 2"]
}

Make it educational but age-appropriate for ${grade} level. Don't just give the answer - guide them through the learning process.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content || "{}";
      return JSON.parse(content);
    } catch (error) {
      console.error("Homework Helper Error:", error);
      return {
        explanation:
          "I'm sorry, I couldn't process that question. Please try rephrasing it.",
        steps: [],
        hints: ["Try breaking the problem into smaller parts"],
        resources: ["Ask your teacher for clarification"],
      };
    }
  }

  // Predict Student Performance
  async predictStudentPerformance(
    studentData: StudentPerformanceData,
  ): Promise<{
    riskLevel: "low" | "medium" | "high";
    prediction: string;
    recommendations: string[];
    interventionNeeded: boolean;
  }> {
    const prompt = `Analyze this student data and provide insights:

Student: ${studentData.name}
Grades: ${JSON.stringify(studentData.grades)}
Attendance: ${studentData.attendance}%
Behavior Score: ${studentData.behaviorScore}/100
Participation: ${studentData.participationLevel}

Provide response in JSON format:
{
  "riskLevel": "low" | "medium" | "high",
  "prediction": "Detailed prediction text",
  "recommendations": ["Rec 1", "Rec 2", "Rec 3"],
  "interventionNeeded": true/false
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content || "{}";
      return JSON.parse(content);
    } catch (error) {
      console.error("Performance Prediction Error:", error);
      return {
        riskLevel: "medium",
        prediction: "Unable to make prediction at this time.",
        recommendations: [
          "Monitor attendance closely",
          "Schedule regular check-ins",
        ],
        interventionNeeded: true,
      };
    }
  }

  // Auto-Grade Essay/Written Assignment
  async autoGradeEssay(
    essay: string,
    rubric: {
      criteria: string[];
      maxScore: number;
    },
  ): Promise<{
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    detailedFeedback: Record<string, string>;
  }> {
    const prompt = `Grade this essay/assignment based on the provided rubric.

Rubric Criteria: ${rubric.criteria.join(", ")}
Max Score: ${rubric.maxScore}

Assignment Text:
"""
${essay}
"""

Provide response in JSON format:
{
  "score": number,
  "feedback": "overall feedback",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "detailedFeedback": {
    "criterion1": "feedback for criterion1",
    "criterion2": "feedback for criterion2"
  }
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content || "{}";
      return JSON.parse(content);
    } catch (error) {
      console.error("Auto-Grading Error:", error);
      return {
        score: 0,
        feedback: "Unable to grade at this time. Please try again.",
        strengths: [],
        improvements: ["Please submit for manual review"],
        detailedFeedback: {},
      };
    }
  }

  // Generate Study Plan
  async generateStudyPlan(
    studentId: string,
    subjects: string[],
    weakAreas: string[],
    availableHours: number,
    examDate: string,
  ): Promise<{
    schedule: Array<{
      day: string;
      subjects: Array<{
        subject: string;
        duration: number;
        focus: string;
      }>;
    }>;
    tips: string[];
    resources: string[];
  }> {
    const prompt = `Create a personalized study plan for a student preparing for exams.

Subjects: ${subjects.join(", ")}
Weak Areas: ${weakAreas.join(", ")}
Available Hours per Day: ${availableHours}
Exam Date: ${examDate}

Provide a 7-day study schedule in JSON format:
{
  "schedule": [
    {
      "day": "Monday",
      "subjects": [
        { "subject": "Subject Name", "duration": 60, "focus": "What to study" }
      ]
    }
  ],
  "tips": ["Study tip 1", "Study tip 2"],
  "resources": ["Resource 1", "Resource 2"]
}

Focus more time on weak areas while reviewing strong subjects.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content || "{}";
      return JSON.parse(content);
    } catch (error) {
      console.error("Study Plan Error:", error);
      return {
        schedule: [],
        tips: [
          "Break study sessions into 25-minute chunks",
          "Take regular breaks",
        ],
        resources: ["Textbooks", "Online resources"],
      };
    }
  }

  // Analyze Attendance Patterns
  async analyzeAttendancePatterns(
    attendanceData: Array<{
      date: string;
      present: boolean;
      reason?: string;
    }>,
  ): Promise<{
    pattern: string;
    concerns: string[];
    recommendations: string[];
    trend: "improving" | "declining" | "stable";
  }> {
    const prompt = `Analyze this student attendance data:
${JSON.stringify(attendanceData)}

Provide insights in JSON format:
{
  "pattern": "observed pattern",
  "concerns": ["concern 1", "concern 2"],
  "recommendations": ["rec 1", "rec 2"],
  "trend": "improving" | "declining" | "stable"
}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content || "{}";
      return JSON.parse(content);
    } catch (error) {
      return {
        pattern: "Unable to analyze",
        concerns: [],
        recommendations: ["Monitor attendance regularly"],
        trend: "stable",
      };
    }
  }

  // Clear conversation history
  clearHistory(userId: string) {
    this.conversationHistory.delete(userId);
  }
}

export const aiService = new AIService();
export default aiService;
