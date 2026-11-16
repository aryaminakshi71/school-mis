import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Brain,
  CheckCircle,
  FileText,
  PenTool,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";
import { useState } from "react";

export interface EssayRubric {
  id: string;
  name: string;
  criteria: RubricCriterion[];
  maxScore: number;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  levels: RubricLevel[];
}

export interface RubricLevel {
  level: number;
  description: string;
  points: number;
}

export interface EssaySubmission {
  id: string;
  studentId: string;
  studentName: string;
  essayTitle: string;
  content: string;
  wordCount: number;
  submittedAt: Date;
  subject: string;
  assignmentId: string;
  status: "pending" | "grading" | "graded" | "reviewed";
}

export interface EssayFeedback {
  id: string;
  submissionId: string;
  overallScore: number;
  percentage: number;
  grade: string;
  criterionScores: CriterionScore[];
  generalComments: string;
  strengths: string[];
  improvements: string[];
  grammarIssues: GrammarIssue[];
  plagiarismScore: number;
  aiConfidence: number;
  gradedAt: Date;
  gradedBy: "ai" | "teacher" | "hybrid";
  teacherReview?: TeacherReview;
}

export interface CriterionScore {
  criterionId: string;
  criterionName: string;
  score: number;
  maxScore: number;
  comments: string;
  highlightedSections: TextHighlight[];
}

export interface TextHighlight {
  startIndex: number;
  endIndex: number;
  type: "strength" | "improvement" | "grammar" | "citation";
  comment: string;
}

export interface GrammarIssue {
  type: "spelling" | "grammar" | "punctuation" | "style";
  message: string;
  position: number;
  suggestion: string;
}

export interface TeacherReview {
  teacherId: string;
  teacherName: string;
  reviewedAt: Date;
  adjustedScore?: number;
  additionalComments?: string;
  approved: boolean;
}

interface AIEssayGraderProps {
  onGradeEssay?: (
    submissionId: string,
    feedback: Partial<EssayFeedback>,
  ) => Promise<void>;
  onTeacherReview?: (
    feedbackId: string,
    review: TeacherReview,
  ) => Promise<void>;
  onRequestPlagiarismCheck?: (submissionId: string) => Promise<void>;
}

export function AIEssayGrader({
  onGradeEssay,
  onTeacherReview,
  onRequestPlagiarismCheck,
}: AIEssayGraderProps) {
  const [activeTab, setActiveTab] = useState<"queue" | "grading" | "completed">(
    "queue",
  );
  const [selectedSubmission, setSelectedSubmission] =
    useState<EssaySubmission | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<EssayFeedback | null>(
    null,
  );
  const [isGrading, setIsGrading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRubric, setSelectedRubric] =
    useState<string>("academic-essay");
  const [highlightedText, setHighlightedText] = useState<string>("");
  const [customComment, setCustomComment] = useState("");
  const [submissions, setSubmissions] = useState<EssaySubmission[]>([
    {
      id: "1",
      studentId: "S001",
      studentName: "Emma Johnson",
      essayTitle: "The Impact of Climate Change on Coastal Communities",
      content: `Climate change represents one of the most pressing challenges facing coastal communities worldwide. Rising sea levels, increasingly severe storms, and ocean acidification threaten not only the physical infrastructure of these regions but also the livelihoods and cultural heritage of millions of people.

The scientific evidence is overwhelming. Over the past century, global sea levels have risen by approximately 20 centimeters, with the rate of increase accelerating in recent decades. This phenomenon, driven primarily by thermal expansion of warming ocean waters and melting ice sheets, poses an existential threat to low-lying coastal areas.

Coastal communities face multifaceted challenges. Infrastructure damage from storm surges and flooding requires billions of dollars in annual adaptation costs. Fisheries, which support millions of jobs globally, are being disrupted by changing ocean temperatures and chemistry. Tourism-dependent economies suffer when beaches erode and coral reefs bleach.

Adaptation strategies must be comprehensive and immediate. Nature-based solutions, such as restoring mangrove forests and coral reefs, can provide natural barriers against storm surges while supporting biodiversity. Hard infrastructure, including sea walls and flood barriers, protects critical assets but requires careful planning to avoid unintended ecological consequences.

The socioeconomic implications extend beyond immediate physical threats. Climate-induced migration is already occurring, with communities in low-lying island nations facing displacement. This creates complex legal and ethical questions about climate justice and responsibility.

International cooperation is essential. The Paris Agreement provides a framework for global action, but implementation must be accelerated. Developed nations must support adaptation efforts in vulnerable regions through technology transfer and climate finance.

The window for effective action is narrowing. Coastal communities cannot wait for perfect solutions; they need immediate support to build resilience and adapt to changing conditions. The choices we make today will determine whether these communities thrive or become climate refugees of tomorrow.`,
      wordCount: 285,
      submittedAt: new Date(Date.now() - 86400000),
      subject: "Environmental Science",
      assignmentId: "A001",
      status: "pending",
    },
    {
      id: "2",
      studentId: "S002",
      studentName: "Marcus Chen",
      essayTitle: "Artificial Intelligence in Education: Promise and Peril",
      content: `The integration of artificial intelligence into educational systems promises to revolutionize how we teach and learn. From personalized learning pathways to automated grading systems, AI technologies offer unprecedented opportunities to enhance educational outcomes. However, this transformation also raises significant concerns about privacy, equity, and the fundamental nature of human learning.

Personalized learning represents perhaps the most compelling application of AI in education. By analyzing student performance data, AI systems can identify individual learning patterns and adapt content delivery accordingly. Students struggling with specific concepts receive additional support, while those excelling can access more challenging material. This approach has the potential to address the long-standing challenge of meeting diverse student needs within traditional classroom settings.

Adaptive assessment systems powered by AI can provide immediate feedback, allowing students to learn from mistakes in real-time. Unlike traditional testing, which often occurs days or weeks after learning, AI-enabled assessments can pinpoint exactly where understanding breaks down and suggest targeted interventions.

However, the implementation of AI in education is not without serious concerns. Data privacy stands at the forefront of these issues. AI systems require vast amounts of student data to function effectively, raising questions about who owns this data and how it is protected. Breaches of educational databases could expose sensitive information about minors, with potentially devastating consequences.

Algorithmic bias presents another critical challenge. If AI training data reflects existing educational inequities, these systems may perpetuate or even amplify disparities. Students from underrepresented backgrounds could face systematic disadvantages as AI systems learn from biased historical patterns.

The role of human teachers in an AI-enhanced educational landscape requires careful consideration. While AI can handle routine tasks and provide personalized support, the relational and inspirational aspects of teaching remain uniquely human. The most promising models integrate AI as a tool to augment teacher capabilities rather than replace human educators.

Looking forward, the ethical development of educational AI must prioritize student welfare and educational equity. Transparent algorithms, robust data protection, and inclusive design processes are essential. The goal should be technology that serves educational values rather than reshaping education to serve technological capabilities.

In conclusion, artificial intelligence offers powerful tools for enhancing education, but these must be deployed thoughtfully and ethically. The future of education will likely involve a partnership between human educators and AI systems, each contributing their unique strengths to support student learning and development.`,
      wordCount: 342,
      submittedAt: new Date(Date.now() - 172800000),
      subject: "Computer Science",
      assignmentId: "A002",
      status: "grading",
    },
  ]);

  const rubrics: EssayRubric[] = [
    {
      id: "academic-essay",
      name: "Academic Essay",
      maxScore: 100,
      criteria: [
        {
          id: "content",
          name: "Content & Argumentation",
          description: "Quality of ideas, evidence, and reasoning",
          weight: 30,
          levels: [
            {
              level: 4,
              description:
                "Exceptional depth, original insights, compelling evidence",
              points: 30,
            },
            {
              level: 3,
              description: "Strong ideas, good evidence, clear reasoning",
              points: 24,
            },
            {
              level: 2,
              description: "Adequate ideas, some evidence, basic reasoning",
              points: 18,
            },
            {
              level: 1,
              description: "Weak ideas, insufficient evidence, poor reasoning",
              points: 12,
            },
          ],
        },
        {
          id: "organization",
          name: "Organization & Structure",
          description: "Logical flow, transitions, paragraph structure",
          weight: 20,
          levels: [
            {
              level: 4,
              description:
                "Seamless flow, excellent transitions, clear structure",
              points: 20,
            },
            {
              level: 3,
              description: "Good flow, adequate transitions, clear paragraphs",
              points: 16,
            },
            {
              level: 2,
              description:
                "Some flow issues, weak transitions, adequate structure",
              points: 12,
            },
            {
              level: 1,
              description: "Poor flow, no transitions, unclear structure",
              points: 8,
            },
          ],
        },
        {
          id: "language",
          name: "Language & Style",
          description: "Vocabulary, sentence variety, tone",
          weight: 25,
          levels: [
            {
              level: 4,
              description:
                "Sophisticated vocabulary, varied sentences, consistent tone",
              points: 25,
            },
            {
              level: 3,
              description: "Good vocabulary, some variety, appropriate tone",
              points: 20,
            },
            {
              level: 2,
              description:
                "Basic vocabulary, repetitive sentences, adequate tone",
              points: 15,
            },
            {
              level: 1,
              description:
                "Limited vocabulary, poor sentences, inappropriate tone",
              points: 10,
            },
          ],
        },
        {
          id: "mechanics",
          name: "Grammar & Mechanics",
          description: "Spelling, punctuation, grammar",
          weight: 15,
          levels: [
            {
              level: 4,
              description: "No errors, impeccable grammar",
              points: 15,
            },
            {
              level: 3,
              description: "Minor errors, good grammar overall",
              points: 12,
            },
            {
              level: 2,
              description: "Some errors, adequate grammar",
              points: 9,
            },
            {
              level: 1,
              description: "Frequent errors, poor grammar",
              points: 6,
            },
          ],
        },
        {
          id: "citations",
          name: "Citations & References",
          description: "Proper citation format, credible sources",
          weight: 10,
          levels: [
            {
              level: 4,
              description: "Perfect citations, excellent sources",
              points: 10,
            },
            {
              level: 3,
              description: "Good citations, credible sources",
              points: 8,
            },
            {
              level: 2,
              description: "Some citation issues, adequate sources",
              points: 6,
            },
            {
              level: 1,
              description: "Poor citations, weak sources",
              points: 4,
            },
          ],
        },
      ],
    },
  ];

  const generateAIFeedback = (submission: EssaySubmission): EssayFeedback => {
    const rubric = rubrics.find((r) => r.id === selectedRubric) || rubrics[0];
    const baseScore = 85;
    const variation = Math.random() * 10 - 5;
    const overallScore = Math.min(
      100,
      Math.max(0, Math.round(baseScore + variation)),
    );
    const percentage = overallScore;

    let grade = "F";
    if (overallScore >= 90) grade = "A";
    else if (overallScore >= 80) grade = "B";
    else if (overallScore >= 70) grade = "C";
    else if (overallScore >= 60) grade = "D";

    const criterionScores: CriterionScore[] = rubric.criteria.map(
      (criterion) => {
        const maxScore = criterion.weight;
        const score = Math.round((overallScore / 100) * maxScore);
        const percentage = (score / maxScore) * 100;

        let comments = "";
        if (percentage >= 90)
          comments = `Excellent work on ${criterion.name.toLowerCase()}. ${criterion.description} is demonstrated at a high level.`;
        else if (percentage >= 80)
          comments = `Good ${criterion.name.toLowerCase()}. Some areas could be strengthened for improvement.`;
        else if (percentage >= 70)
          comments = `Adequate ${criterion.name.toLowerCase()}. Review the rubric requirements and consider revisions.`;
        else
          comments = `${criterion.name} needs significant improvement. Please review the feedback carefully.`;

        return {
          criterionId: criterion.id,
          criterionName: criterion.name,
          score,
          maxScore,
          comments,
          highlightedSections: [],
        };
      },
    );

    return {
      id: `F-${submission.id}`,
      submissionId: submission.id,
      overallScore,
      percentage,
      grade,
      criterionScores,
      generalComments: `This essay demonstrates ${overallScore >= 80 ? "strong" : overallScore >= 70 ? "good" : "developing"} understanding of the topic. The writing shows ${overallScore >= 85 ? "sophisticated" : "adequate"} engagement with the subject matter.`,
      strengths: [
        "Clear thesis statement and argumentation",
        "Good use of evidence to support claims",
        "Appropriate academic tone throughout",
        "Strong conclusion that synthesizes main points",
      ],
      improvements: [
        "Consider adding more specific examples",
        "Some transitions between paragraphs could be smoother",
        "Expand on counterarguments for greater depth",
      ],
      grammarIssues: [
        {
          type: "grammar",
          message: "Subject-verb agreement in paragraph 3",
          position: 450,
          suggestion: "Review the sentence structure",
        },
      ],
      plagiarismScore: Math.round(Math.random() * 15),
      aiConfidence: 92,
      gradedAt: new Date(),
      gradedBy: "ai",
    };
  };

  const handleGradeEssay = async () => {
    if (!selectedSubmission) return;

    setIsGrading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const feedback = generateAIFeedback(selectedSubmission);
    setCurrentFeedback(feedback);

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === selectedSubmission.id ? { ...s, status: "graded" } : s,
      ),
    );

    if (onGradeEssay) {
      await onGradeEssay(selectedSubmission.id, feedback);
    }

    setIsGrading(false);
  };

  const handleTeacherReview = async (
    approved: boolean,
    adjustedScore?: number,
  ) => {
    if (!currentFeedback) return;

    const review: TeacherReview = {
      teacherId: "T001",
      teacherName: "Dr. Sarah Johnson",
      reviewedAt: new Date(),
      adjustedScore,
      additionalComments: customComment || undefined,
      approved,
    };

    setCurrentFeedback((prev) =>
      prev ? { ...prev, teacherReview: review, gradedBy: "hybrid" } : null,
    );

    if (onTeacherReview) {
      await onTeacherReview(currentFeedback.id, review);
    }

    setCustomComment("");
  };

  const filteredSubmissions = submissions.filter(
    (s) =>
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.essayTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const gradingCount = submissions.filter((s) => s.status === "grading").length;
  const completedCount = submissions.filter(
    (s) => s.status === "graded" || s.status === "reviewed",
  ).length;

  return (
    <div className="space-y-6" style={{ fontFamily: "Georgia, serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="font-bold text-3xl text-slate-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            AI Essay Grader
          </h2>
          <p className="mt-1 text-slate-600">
            Automated essay assessment with detailed feedback
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedRubric}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSelectedRubric(e.target.value)
            }
            className="rounded-lg border-2 border-amber-200 bg-white px-4 py-2 focus:border-amber-400 focus:outline-none"
          >
            {rubrics.map((rubric) => (
              <option key={rubric.id} value={rubric.id}>
                {rubric.name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 rounded-lg bg-indigo-100 px-4 py-2 text-indigo-700">
            <Brain className="h-5 w-5" />
            <span className="font-medium">AI Confidence: 92%</span>
          </div>
        </div>
      </div>

      {!selectedSubmission ? (
        <>
          <div className="flex gap-2 border-slate-200 border-b-2">
            {[
              { id: "queue", label: "Grading Queue", count: pendingCount },
              { id: "grading", label: "In Progress", count: gradingCount },
              { id: "completed", label: "Completed", count: completedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-600 border-b-2 text-indigo-600"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                {tab.label}
                <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-slate-700 text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="border-slate-200 border-b bg-slate-50 p-4">
              <input
                type="text"
                placeholder="Search submissions..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-2 focus:border-indigo-400 focus:outline-none"
              />
            </div>

            <div className="divide-y divide-slate-200">
              <AnimatePresence mode="popLayout">
                {filteredSubmissions
                  .filter((s) => {
                    if (activeTab === "queue") return s.status === "pending";
                    if (activeTab === "grading") return s.status === "grading";
                    return s.status === "graded" || s.status === "reviewed";
                  })
                  .map((submission) => (
                    <motion.div
                      key={submission.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      onClick={() => setSelectedSubmission(submission)}
                      className="cursor-pointer p-6 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <h3
                              className="font-semibold text-lg text-slate-900"
                              style={{ fontFamily: "Georgia, serif" }}
                            >
                              {submission.essayTitle}
                            </h3>
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                submission.status === "pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : submission.status === "grading"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {submission.status === "pending"
                                ? "Pending"
                                : submission.status === "grading"
                                  ? "Grading..."
                                  : "Graded"}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-slate-600 text-sm">
                            <span className="flex items-center gap-1">
                              <PenTool className="h-4 w-4" />
                              {submission.studentName}
                            </span>
                            <span>{submission.subject}</span>
                            <span>{submission.wordCount} words</span>
                            <span>
                              Submitted{" "}
                              {submission.submittedAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {submission.status === "pending" && (
                            <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700">
                              <Sparkles className="h-4 w-4" />
                              Grade with AI
                            </button>
                          )}
                          {submission.status === "graded" && (
                            <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700">
                              <CheckCircle className="h-4 w-4" />
                              Review
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>

              {filteredSubmissions.filter((s) => {
                if (activeTab === "queue") return s.status === "pending";
                if (activeTab === "grading") return s.status === "grading";
                return s.status === "graded" || s.status === "reviewed";
              }).length === 0 && (
                <div className="p-12 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                  <p className="text-slate-500">No essays in this queue</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          <div className="space-y-6 lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="border-slate-200 border-b bg-gradient-to-r from-slate-50 to-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className="mb-2 font-bold text-2xl text-slate-900"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {selectedSubmission.essayTitle}
                    </h3>
                    <div className="flex items-center gap-4 text-slate-600 text-sm">
                      <span className="flex items-center gap-1">
                        <PenTool className="h-4 w-4" />
                        {selectedSubmission.studentName}
                      </span>
                      <span>{selectedSubmission.subject}</span>
                      <span>{selectedSubmission.wordCount} words</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedSubmission(null);
                      setCurrentFeedback(null);
                      setHighlightedText("");
                    }}
                    className="px-4 py-2 text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Back to Queue
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div
                  className="prose max-w-none text-slate-700 leading-relaxed"
                  onMouseUp={() => {
                    const selection = window.getSelection()?.toString();
                    if (selection && selection.length > 0) {
                      setHighlightedText(selection);
                    }
                  }}
                >
                  {selectedSubmission.content
                    .split("\n\n")
                    .map((paragraph, idx) => (
                      <p key={idx} className="mb-4 text-base">
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>

              {highlightedText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-amber-200 border-t bg-amber-50 p-4"
                >
                  <p className="mb-2 text-amber-800 text-sm">
                    Selected text: "{highlightedText.substring(0, 100)}..."
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setHighlightedText("")}
                      className="px-3 py-1 text-amber-700 text-sm hover:text-amber-900"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {!currentFeedback && selectedSubmission.status === "pending" && (
              <div className="flex justify-center">
                <button
                  onClick={handleGradeEssay}
                  disabled={isGrading}
                  className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-semibold text-lg text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
                >
                  {isGrading ? (
                    <>
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      AI Analyzing Essay...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-6 w-6" />
                      Start AI Grading
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {currentFeedback && (
              <>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white">
                    <div className="mb-4 flex items-center justify-between">
                      <Award className="h-8 w-8" />
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        <span className="text-sm">
                          {currentFeedback.aiConfidence}% confidence
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="mb-2 font-bold text-5xl">
                        {currentFeedback.grade}
                      </div>
                      <div className="font-semibold text-3xl">
                        {currentFeedback.overallScore}/100
                      </div>
                      <div className="mt-1 text-sm opacity-80">
                        Plagiarism: {currentFeedback.plagiarismScore}%
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="mb-4 font-semibold text-slate-900">
                      Criterion Scores
                    </h4>
                    <div className="space-y-4">
                      {currentFeedback.criterionScores.map((criterion) => (
                        <div key={criterion.criterionId}>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="font-medium text-slate-700 text-sm">
                              {criterion.criterionName}
                            </span>
                            <span className="font-semibold text-slate-900 text-sm">
                              {criterion.score}/{criterion.maxScore}
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-200">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                              style={{
                                width: `${(criterion.score / criterion.maxScore) * 100}%`,
                              }}
                            />
                          </div>
                          <p className="mt-1 text-slate-500 text-xs">
                            {criterion.comments}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="border-green-200 border-b bg-green-50 p-4">
                    <h4 className="flex items-center gap-2 font-semibold text-green-900">
                      <Target className="h-5 w-5" />
                      Strengths
                    </h4>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      {currentFeedback.strengths.map((strength, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-slate-700 text-sm"
                        >
                          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="border-amber-200 border-b bg-amber-50 p-4">
                    <h4 className="flex items-center gap-2 font-semibold text-amber-900">
                      <Sparkles className="h-5 w-5" />
                      Areas for Improvement
                    </h4>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      {currentFeedback.improvements.map((improvement, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-slate-700 text-sm"
                        >
                          <PenTool className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="border-slate-200 border-b p-4">
                    <h4 className="font-semibold text-slate-900">
                      Teacher Review
                    </h4>
                  </div>
                  <div className="space-y-4 p-4">
                    <textarea
                      value={customComment}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setCustomComment(e.target.value)
                      }
                      placeholder="Add your comments or adjustments..."
                      className="w-full rounded-lg border-2 border-slate-200 px-4 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTeacherReview(true)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleTeacherReview(false)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-600 px-4 py-2 text-white transition-colors hover:bg-slate-700"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Request Revision
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!currentFeedback && (
              <div className="rounded-xl border-2 border-slate-300 border-dashed bg-slate-50 p-8 text-center">
                <Brain className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                <p className="mb-2 font-medium text-slate-600">
                  AI Grading Not Started
                </p>
                <p className="text-slate-500 text-sm">
                  Click "Start AI Grading" to generate detailed feedback
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
