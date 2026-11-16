import { AnimatePresence, motion } from "framer-motion";
import { Brain, Calculator, CheckCircle, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export type QuestionType = "mcq" | "true-false" | "fill-blank" | "matching";

export interface AutoGradedQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  marks: number;
  studentAnswer?: string | string[];
  explanation?: string;
  aiConfidence?: number;
}

export interface AutoGradedExam {
  id: string;
  title: string;
  subject: string;
  class: string;
  questions: AutoGradedQuestion[];
  totalMarks: number;
  duration: number; // in minutes
  studentResults?: StudentResult[];
}

export interface StudentResult {
  studentId: string;
  studentName: string;
  answers: Record<string, string | string[]>;
  submittedAt: Date;
  autoGraded: boolean;
  marksObtained: number;
  percentage: number;
  grade: string;
  aiAnalysis?: AIAnalysis;
}

export interface AIAnalysis {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  confidence: number;
  timeSpent: Record<string, number>; // questionId -> seconds
}

interface AutoGradingSystemProps {
  mode: "setup" | "take" | "review";
  exam?: AutoGradedExam;
  studentId?: string;
  studentName?: string;
  onSubmit?: (answers: Record<string, string | string[]>) => void;
  onGradeComplete?: (results: StudentResult) => void;
}

const mockExam: AutoGradedExam = {
  id: "exam-1",
  title: "Mathematics Quiz - Algebra",
  subject: "Mathematics",
  class: "10-A",
  totalMarks: 50,
  duration: 30,
  questions: [
    {
      id: "q1",
      type: "mcq",
      question: "What is the value of x in the equation 2x + 5 = 15?",
      options: ["5", "10", "15", "20"],
      correctAnswer: "5",
      marks: 10,
      explanation:
        "Subtract 5 from both sides: 2x = 10, then divide by 2: x = 5",
      aiConfidence: 0.98,
    },
    {
      id: "q2",
      type: "mcq",
      question: "Which of the following is a quadratic equation?",
      options: ["x + 2 = 5", "x² + 3x + 2 = 0", "2x = 8", "x/2 = 4"],
      correctAnswer: "x² + 3x + 2 = 0",
      marks: 10,
      explanation:
        "A quadratic equation has the form ax² + bx + c = 0 where a ≠ 0",
      aiConfidence: 0.99,
    },
    {
      id: "q3",
      type: "true-false",
      question: "The square root of 16 is ±4",
      options: ["True", "False"],
      correctAnswer: "True",
      marks: 10,
      explanation: "Both 4 and -4 squared equal 16, so √16 = ±4",
      aiConfidence: 0.95,
    },
    {
      id: "q4",
      type: "fill-blank",
      question: "The formula for the area of a circle is A = _____",
      correctAnswer: "πr²",
      marks: 10,
      explanation: "Area of circle = π × radius²",
      aiConfidence: 1.0,
    },
    {
      id: "q5",
      type: "mcq",
      question: "If a = 3 and b = 4, what is the value of a² + b²?",
      options: ["7", "25", "12", "9"],
      correctAnswer: "25",
      marks: 10,
      explanation: "3² + 4² = 9 + 16 = 25",
      aiConfidence: 0.97,
    },
  ],
};

export function AutoGradingSystem({
  mode,
  exam = mockExam,
  studentId = "stu-1",
  studentName = "Rahul Sharma",
  onSubmit,
  onGradeComplete,
}: AutoGradingSystemProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gradingResult, setGradingResult] = useState<StudentResult | null>(
    null,
  );
  const [showingExplanation, setShowingExplanation] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (mode === "take" && timeRemaining > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, timeRemaining, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);

    // Auto-grade the exam
    let totalMarks = 0;
    const questionResults: AutoGradedQuestion[] = exam.questions.map((q) => {
      const studentAnswer = answers[q.id];
      let isCorrect = false;

      if (Array.isArray(q.correctAnswer)) {
        isCorrect =
          Array.isArray(studentAnswer) &&
          q.correctAnswer.every((ans) => studentAnswer.includes(ans)) &&
          studentAnswer.length === q.correctAnswer.length;
      } else {
        isCorrect = studentAnswer === q.correctAnswer;
      }

      const marksObtained = isCorrect ? q.marks : 0;
      totalMarks += marksObtained;

      return {
        ...q,
        studentAnswer,
      };
    });

    const percentage = (totalMarks / exam.totalMarks) * 100;
    const grade =
      percentage >= 90
        ? "A+"
        : percentage >= 80
          ? "A"
          : percentage >= 70
            ? "B"
            : percentage >= 60
              ? "C"
              : percentage >= 50
                ? "D"
                : "F";

    const result: StudentResult = {
      studentId,
      studentName,
      answers,
      submittedAt: new Date(),
      autoGraded: true,
      marksObtained: totalMarks,
      percentage,
      grade,
      aiAnalysis: {
        strengths:
          percentage > 70
            ? ["Good understanding of algebra", "Accurate calculations"]
            : [],
        weaknesses:
          percentage < 70
            ? ["Need practice with equations", "Review quadratic concepts"]
            : [],
        suggestions: [
          "Practice more problems",
          "Review textbook chapter 3",
          "Attend extra classes",
        ],
        confidence: 0.95,
        timeSpent: {},
      },
    };

    setGradingResult(result);
    onGradeComplete?.(result);
    onSubmit?.(answers);
  };

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      "A+": "text-green-600 bg-green-100 dark:bg-green-900/30",
      A: "text-green-600 bg-green-100 dark:bg-green-900/30",
      B: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
      C: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
      D: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
      F: "text-red-600 bg-red-100 dark:bg-red-900/30",
    };
    return colors[grade] || colors.F;
  };

  if (mode === "review" && gradingResult) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-gray-200 border-b p-6 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-xl dark:text-gray-100">
                Exam Results
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{exam.title}</p>
            </div>
            <div
              className={`rounded-lg px-4 py-2 font-bold text-2xl ${getGradeColor(gradingResult.grade)}`}
            >
              {gradingResult.grade}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800">
              <p className="font-bold text-3xl text-gray-900 dark:text-gray-100">
                {gradingResult.marksObtained}
              </p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Marks Obtained
              </p>
              <p className="text-gray-400 text-xs">out of {exam.totalMarks}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800">
              <p className="font-bold text-3xl text-gray-900 dark:text-gray-100">
                {gradingResult.percentage.toFixed(1)}%
              </p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Percentage
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800">
              <p className="font-bold text-3xl text-gray-900 dark:text-gray-100">
                {
                  exam.questions.filter((q) => {
                    const ans = gradingResult.answers[q.id];
                    return ans === q.correctAnswer;
                  }).length
                }
              </p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Correct Answers
              </p>
              <p className="text-gray-400 text-xs">
                out of {exam.questions.length}
              </p>
            </div>
          </div>

          {/* AI Analysis */}
          {gradingResult.aiAnalysis && (
            <div className="mb-6 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="mb-3 flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-300">
                  AI Analysis
                </h3>
                <span className="rounded-full bg-blue-200 px-2 py-0.5 text-blue-800 text-xs dark:bg-blue-800 dark:text-blue-200">
                  {(gradingResult.aiAnalysis.confidence * 100).toFixed(0)}%
                  confidence
                </span>
              </div>

              <div className="space-y-3">
                {gradingResult.aiAnalysis.strengths.length > 0 && (
                  <div>
                    <p className="mb-1 font-medium text-green-700 text-sm dark:text-green-400">
                      💪 Strengths
                    </p>
                    <ul className="space-y-1 text-gray-600 text-sm dark:text-gray-400">
                      {gradingResult.aiAnalysis.strengths.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {gradingResult.aiAnalysis.weaknesses.length > 0 && (
                  <div>
                    <p className="mb-1 font-medium text-red-700 text-sm dark:text-red-400">
                      📚 Areas to Improve
                    </p>
                    <ul className="space-y-1 text-gray-600 text-sm dark:text-gray-400">
                      {gradingResult.aiAnalysis.weaknesses.map((w, i) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <p className="mb-1 font-medium text-blue-700 text-sm dark:text-blue-400">
                    💡 Suggestions
                  </p>
                  <ul className="space-y-1 text-gray-600 text-sm dark:text-gray-400">
                    {gradingResult.aiAnalysis.suggestions.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Question Review */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Question Review
            </h3>
            {exam.questions.map((q, index) => {
              const studentAnswer = gradingResult.answers[q.id];
              const isCorrect = studentAnswer === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`rounded-xl border-2 p-4 ${
                    isCorrect
                      ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10"
                      : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {index + 1}. {q.question}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <span className="text-gray-500">Your answer: </span>
                          <span
                            className={
                              isCorrect
                                ? "font-medium text-green-600"
                                : "text-red-600"
                            }
                          >
                            {Array.isArray(studentAnswer)
                              ? studentAnswer.join(", ")
                              : studentAnswer || "Not answered"}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm">
                            <span className="text-gray-500">
                              Correct answer:{" "}
                            </span>
                            <span className="font-medium text-green-600">
                              {Array.isArray(q.correctAnswer)
                                ? q.correctAnswer.join(", ")
                                : q.correctAnswer}
                            </span>
                          </p>
                        )}
                      </div>

                      {q.explanation && (
                        <button
                          onClick={() =>
                            setShowingExplanation(
                              showingExplanation === q.id ? null : q.id,
                            )
                          }
                          className="mt-2 text-primary text-sm hover:text-primary/80"
                        >
                          {showingExplanation === q.id
                            ? "Hide explanation"
                            : "Show explanation"}
                        </button>
                      )}

                      <AnimatePresence>
                        {showingExplanation === q.id && q.explanation && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 rounded-lg bg-blue-100 p-3 text-blue-800 text-sm dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            💡 {q.explanation}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="ml-4">
                      {isCorrect ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                  </div>

                  <div className="mt-2 text-gray-500 text-sm">
                    Marks: {isCorrect ? q.marks : 0}/{q.marks}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "take") {
    const question = exam.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / exam.questions.length) * 100;

    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="border-gray-200 border-b p-6 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-xl dark:text-gray-100">
                {exam.title}
              </h2>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {exam.subject} • {exam.class}
              </p>
            </div>
            <div
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-bold font-mono ${
                timeRemaining < 60
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              <Clock className="h-5 w-5" />
              {formatTime(timeRemaining)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-gray-500 text-sm">
              Question {currentQuestion + 1} of {exam.questions.length}
            </p>
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <div className="mb-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-sm">
                {question.marks} marks
              </span>
              {question.type === "mcq" && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 text-sm dark:bg-gray-800 dark:text-gray-400">
                  Multiple Choice
                </span>
              )}
            </div>
            <p className="text-gray-900 text-lg dark:text-gray-100">
              {question.question}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {question.type === "mcq" &&
              question.options?.map((option, idx) => {
                const isSelected = answers[question.id] === option;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(question.id, option)}
                    className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {option}
                    </span>
                  </button>
                );
              })}

            {question.type === "true-false" &&
              question.options?.map((option, idx) => {
                const isSelected = answers[question.id] === option;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(question.id, option)}
                    className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {option}
                    </span>
                  </button>
                );
              })}

            {question.type === "fill-blank" && (
              <input
                type="text"
                value={(answers[question.id] as string) || ""}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                placeholder="Type your answer here..."
                className="w-full rounded-xl border-2 border-gray-200 bg-white p-4 text-gray-900 focus:border-primary focus:ring-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            )}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={() =>
                setCurrentQuestion((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestion === 0}
              className="rounded-xl border border-gray-300 px-6 py-3 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Previous
            </button>

            {currentQuestion < exam.questions.length - 1 ? (
              <button
                onClick={() =>
                  setCurrentQuestion((prev) =>
                    Math.min(exam.questions.length - 1, prev + 1),
                  )
                }
                className="rounded-xl bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="rounded-xl bg-green-500 px-6 py-3 text-white transition-colors hover:bg-green-600"
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Setup mode
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="py-12 text-center">
        <Calculator className="mx-auto mb-4 h-16 w-16 text-primary" />
        <h2 className="mb-2 font-bold text-gray-900 text-xl dark:text-gray-100">
          Auto-Grading System
        </h2>
        <p className="mx-auto mb-6 max-w-md text-gray-500 dark:text-gray-400">
          Create automatically graded exams with instant results and AI-powered
          analysis
        </p>
        <div className="flex justify-center gap-4 text-gray-500 text-sm">
          <span className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Multiple Choice
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            True/False
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Fill in Blanks
          </span>
        </div>
      </div>
    </div>
  );
}

export default AutoGradingSystem;
