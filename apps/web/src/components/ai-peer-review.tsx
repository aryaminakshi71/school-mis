import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Award,
  BarChart3,
  Brain,
  CheckCircle,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  FileText,
  Fingerprint,
  Lightbulb,
  RefreshCw,
  Scale,
  Search,
  Settings,
  Sparkles,
  Star,
  Target,
  ThumbsUp,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export type ReviewMode = "anonymous" | "identified" | "double-blind";
export type ReviewStatus =
  | "pending"
  | "assigned"
  | "in-progress"
  | "submitted"
  | "completed"
  | "flagged";
export type ReviewQuality = "excellent" | "good" | "adequate" | "poor";
export type Sentiment = "positive" | "neutral" | "negative";

export interface StudentProfile {
  id: string;
  name: string;
  avatar?: string;
  skills: string[];
  knowledgeAreas: string[];
  grade: string;
  pastReviewsGiven: number;
  pastReviewsReceived: number;
  averageReviewQuality: number;
  reviewAccuracy: number;
  availability: string[];
  courses: string[];
  languages: string[];
  personalityTraits: string[];
  workStyle: "analytical" | "creative" | "collaborative" | "independent";
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  rubricId: string;
  submissions: Submission[];
  dueDate: Date;
  reviewDueDate: Date;
  minReviewsPerSubmission: number;
  maxReviewsPerSubmission: number;
  reviewMode: ReviewMode;
  autoAssign: boolean;
  aiAssist: boolean;
  status: "open" | "in-progress" | "completed" | "archived";
  createdAt: Date;
}

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  content: string;
  attachments: string[];
  submittedAt: Date;
  wordCount: number;
  status: "pending" | "assigned" | "reviewing" | "completed";
  assignedReviewers: ReviewAssignment[];
  reviewsReceived: Review[];
  finalScore?: number;
  insights?: ReviewInsights;
}

export interface ReviewAssignment {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerSkills: string[];
  matchScore: number;
  matchReasons: string[];
  status: ReviewStatus;
  assignedAt: Date;
  dueDate: Date;
  completedAt?: Date;
}

export interface Review {
  id: string;
  submissionId: string;
  reviewerId: string;
  reviewerName: string;
  isAnonymous: boolean;
  rubricScores: RubricScore[];
  overallComments: string;
  strengths: string[];
  improvements: string[];
  sentiment: Sentiment;
  sentimentScore: number;
  quality: ReviewQuality;
  aiConfidence: number;
  submittedAt: Date;
  helpfulVotes: number;
  unhelpfulVotes: number;
  isFlagged: boolean;
  flagReason?: string;
}

export interface RubricScore {
  criterionId: string;
  criterionName: string;
  score: number;
  maxScore: number;
  comments: string;
  highlightedSections: string[];
}

export interface ReviewInsights {
  averageScore: number;
  scoreDistribution: { score: number; count: number }[];
  commonStrengths: { text: string; frequency: number }[];
  commonImprovements: { text: string; frequency: number }[];
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
    averageSentiment: number;
  };
  qualityDistribution: {
    excellent: number;
    good: number;
    adequate: number;
    poor: number;
  };
  consensusLevel: number;
  aiSummary: string;
  actionItems: string[];
  skillGaps: string[];
  progressMetrics: {
    comparedToPrevious: number;
    trend: "improving" | "stable" | "declining";
  };
}

export interface ReviewRubric {
  id: string;
  name: string;
  description: string;
  criteria: ReviewCriterion[];
  aiGenerated: boolean;
  aiConfidence: number;
  generatedAt?: Date;
}

export interface ReviewCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  skillTag: string;
  levels: CriterionLevel[];
  aiSuggestions: string[];
}

export interface CriterionLevel {
  level: number;
  label: string;
  description: string;
  minPoints: number;
  maxPoints: number;
  example?: string;
}

export interface MatchingResult {
  submissionId: string;
  reviewerId: string;
  score: number;
  breakdown: {
    skillMatch: number;
    knowledgeMatch: number;
    workloadBalance: number;
    diversityBonus: number;
    pastPerformance: number;
  };
  confidence: number;
  reasoning: string[];
}

export interface QualityMetrics {
  totalReviews: number;
  averageQuality: number;
  flaggedReviews: number;
  consensusLevel: number;
  aiInterventions: number;
  reviewerAccuracy: { reviewerId: string; accuracy: number }[];
}

interface AIPeerReviewProps {
  userRole?: "teacher" | "student" | "admin";
  userId?: string;
  onCreateAssignment?: (
    assignment: Omit<Assignment, "id" | "submissions" | "createdAt" | "status">,
  ) => Promise<string>;
  onAssignReviewers?: (
    submissionId: string,
    reviewers: Omit<ReviewAssignment, "id" | "assignedAt">[],
  ) => Promise<void>;
  onSubmitReview?: (
    review: Omit<
      Review,
      "id" | "submittedAt" | "helpfulVotes" | "unhelpfulVotes"
    >,
  ) => Promise<void>;
  onGenerateRubric?: (assignmentId: string) => Promise<ReviewRubric>;
  onFlagReview?: (reviewId: string, reason: string) => Promise<void>;
}

export function AIPeerReview({
  userRole = "teacher",
  userId = "T001",
  onCreateAssignment,
  onAssignReviewers,
  onSubmitReview,
  onGenerateRubric,
  onFlagReview,
}: AIPeerReviewProps) {
  const [activeTab, setActiveTab] = useState<
    "assignments" | "pending" | "completed" | "insights" | "settings"
  >("assignments");
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [isGeneratingRubric, setIsGeneratingRubric] = useState(false);
  const [isAssigningReviewers, setIsAssigningReviewers] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<ReviewStatus | "all">("all");
  const [showAnonymous, setShowAnonymous] = useState(false);
  const [activeReviewMode, setActiveReviewMode] =
    useState<ReviewMode>("anonymous");
  const [sortBy, setSortBy] = useState<"date" | "quality" | "consensus">(
    "date",
  );

  const [students] = useState<StudentProfile[]>([
    {
      id: "S001",
      name: "Emma Chen",
      skills: ["Critical Analysis", "Essay Writing", "Research", "Peer Review"],
      knowledgeAreas: ["Literature", "History", "Philosophy"],
      grade: "11",
      pastReviewsGiven: 23,
      pastReviewsReceived: 18,
      averageReviewQuality: 4.7,
      reviewAccuracy: 0.89,
      availability: ["Mon", "Wed", "Fri"],
      courses: ["English Literature", "AP History", "Philosophy 101"],
      languages: ["English", "Mandarin"],
      personalityTraits: ["analytical", "detail-oriented", "patient"],
      workStyle: "analytical",
    },
    {
      id: "S002",
      name: "Marcus Johnson",
      skills: [
        "Technical Writing",
        "Code Review",
        "Mathematics",
        "Data Analysis",
      ],
      knowledgeAreas: ["Computer Science", "Mathematics", "Physics"],
      grade: "12",
      pastReviewsGiven: 31,
      pastReviewsReceived: 25,
      averageReviewQuality: 4.9,
      reviewAccuracy: 0.94,
      availability: ["Tue", "Thu", "Sat"],
      courses: ["AP Computer Science", "Calculus BC", "Physics"],
      languages: ["English", "Spanish"],
      personalityTraits: ["logical", "systematic", "helpful"],
      workStyle: "analytical",
    },
    {
      id: "S003",
      name: "Sophia Williams",
      skills: [
        "Creative Writing",
        "Visual Design",
        "Presentation",
        "Peer Review",
      ],
      knowledgeAreas: ["Arts", "Literature", "Media Studies"],
      grade: "10",
      pastReviewsGiven: 15,
      pastReviewsReceived: 12,
      averageReviewQuality: 4.5,
      reviewAccuracy: 0.82,
      availability: ["Mon", "Tue", "Thu"],
      courses: ["Creative Writing", "Art History", "Film Studies"],
      languages: ["English"],
      personalityTraits: ["creative", "expressive", "supportive"],
      workStyle: "creative",
    },
    {
      id: "S004",
      name: "Alex Kim",
      skills: [
        "Scientific Writing",
        "Lab Reports",
        "Research Methods",
        "Data Visualization",
      ],
      knowledgeAreas: ["Biology", "Chemistry", "Environmental Science"],
      grade: "11",
      pastReviewsGiven: 19,
      pastReviewsReceived: 16,
      averageReviewQuality: 4.6,
      reviewAccuracy: 0.87,
      availability: ["Wed", "Fri", "Sun"],
      courses: ["AP Biology", "Chemistry", "Environmental Science"],
      languages: ["English", "Korean"],
      personalityTraits: ["methodical", "thorough", "insightful"],
      workStyle: "analytical",
    },
    {
      id: "S005",
      name: "Jordan Patel",
      skills: ["Argumentation", "Debate", "Research", "Public Speaking"],
      knowledgeAreas: ["Political Science", "Economics", "Law"],
      grade: "12",
      pastReviewsGiven: 28,
      pastReviewsReceived: 22,
      averageReviewQuality: 4.8,
      reviewAccuracy: 0.91,
      availability: ["Mon", "Tue", "Wed"],
      courses: ["AP Government", "Economics", "Debate Club"],
      languages: ["English", "Hindi", "Gujarati"],
      personalityTraits: ["persuasive", "articulate", "critical"],
      workStyle: "collaborative",
    },
  ]);

  const [rubrics, setRubrics] = useState<ReviewRubric[]>([
    {
      id: "R001",
      name: "Academic Essay Review",
      description: "Comprehensive rubric for peer review of academic essays",
      aiGenerated: true,
      aiConfidence: 94,
      generatedAt: new Date(Date.now() - 604800000),
      criteria: [
        {
          id: "C001",
          name: "Thesis & Argumentation",
          description: "Clear thesis and logical argument development",
          weight: 25,
          skillTag: "Critical Analysis",
          levels: [
            {
              level: 4,
              label: "Exceptional",
              description:
                "Clear, compelling thesis with sophisticated arguments",
              minPoints: 22,
              maxPoints: 25,
              example:
                "Thesis clearly stated, arguments are well-developed and persuasive",
            },
            {
              level: 3,
              label: "Proficient",
              description: "Clear thesis with solid supporting arguments",
              minPoints: 18,
              maxPoints: 21,
            },
            {
              level: 2,
              label: "Developing",
              description: "Thesis present but arguments need development",
              minPoints: 14,
              maxPoints: 17,
            },
            {
              level: 1,
              label: "Beginning",
              description: "Unclear thesis or weak arguments",
              minPoints: 10,
              maxPoints: 13,
            },
          ],
          aiSuggestions: [
            "Look for a clear position statement in the introduction",
            "Check if each paragraph supports the main argument",
            "Assess the logical flow between arguments",
          ],
        },
        {
          id: "C002",
          name: "Evidence & Support",
          description: "Quality and relevance of supporting evidence",
          weight: 25,
          skillTag: "Research",
          levels: [
            {
              level: 4,
              label: "Exceptional",
              description:
                "Strong, relevant evidence from credible sources throughout",
              minPoints: 22,
              maxPoints: 25,
            },
            {
              level: 3,
              label: "Proficient",
              description: "Good evidence, mostly relevant and well-integrated",
              minPoints: 18,
              maxPoints: 21,
            },
            {
              level: 2,
              label: "Developing",
              description: "Some evidence present but needs better integration",
              minPoints: 14,
              maxPoints: 17,
            },
            {
              level: 1,
              label: "Beginning",
              description: "Insufficient or irrelevant evidence",
              minPoints: 10,
              maxPoints: 13,
            },
          ],
          aiSuggestions: [
            "Verify that claims are backed by specific examples",
            "Check the credibility and relevance of sources",
            "Look for proper citation format",
          ],
        },
        {
          id: "C003",
          name: "Organization & Structure",
          description: "Logical organization and clear structure",
          weight: 20,
          skillTag: "Essay Writing",
          levels: [
            {
              level: 4,
              label: "Exceptional",
              description:
                "Seamless flow with excellent transitions and paragraph structure",
              minPoints: 18,
              maxPoints: 20,
            },
            {
              level: 3,
              label: "Proficient",
              description: "Good organization with clear transitions",
              minPoints: 14,
              maxPoints: 17,
            },
            {
              level: 2,
              label: "Developing",
              description: "Some organization but transitions need work",
              minPoints: 10,
              maxPoints: 13,
            },
            {
              level: 1,
              label: "Beginning",
              description: "Poor organization, hard to follow",
              minPoints: 8,
              maxPoints: 9,
            },
          ],
          aiSuggestions: [
            "Check for a clear introduction, body, and conclusion",
            "Look for topic sentences in each paragraph",
            "Assess the flow between paragraphs",
          ],
        },
        {
          id: "C004",
          name: "Writing Quality",
          description: "Grammar, style, and clarity of expression",
          weight: 15,
          skillTag: "Communication",
          levels: [
            {
              level: 4,
              label: "Exceptional",
              description:
                "Excellent grammar, varied sentence structure, sophisticated vocabulary",
              minPoints: 13,
              maxPoints: 15,
            },
            {
              level: 3,
              label: "Proficient",
              description: "Good grammar and clear expression",
              minPoints: 11,
              maxPoints: 12,
            },
            {
              level: 2,
              label: "Developing",
              description: "Some grammar issues but meaning is clear",
              minPoints: 8,
              maxPoints: 10,
            },
            {
              level: 1,
              label: "Beginning",
              description: "Frequent errors that impede understanding",
              minPoints: 6,
              maxPoints: 7,
            },
          ],
          aiSuggestions: [
            "Check for subject-verb agreement",
            "Look for run-on sentences or fragments",
            "Assess vocabulary appropriateness",
          ],
        },
        {
          id: "C005",
          name: "Critical Thinking",
          description: "Depth of analysis and critical engagement",
          weight: 15,
          skillTag: "Critical Analysis",
          levels: [
            {
              level: 4,
              label: "Exceptional",
              description: "Deep analysis with original insights",
              minPoints: 13,
              maxPoints: 15,
            },
            {
              level: 3,
              label: "Proficient",
              description: "Good analysis with solid critical engagement",
              minPoints: 11,
              maxPoints: 12,
            },
            {
              level: 2,
              label: "Developing",
              description: "Some analysis but superficial at times",
              minPoints: 8,
              maxPoints: 10,
            },
            {
              level: 1,
              label: "Beginning",
              description: "Limited analysis, mostly descriptive",
              minPoints: 6,
              maxPoints: 7,
            },
          ],
          aiSuggestions: [
            "Look for connections between ideas",
            "Check for consideration of counterarguments",
            "Assess the depth of insight",
          ],
        },
      ],
    },
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "A001",
      title: "Climate Change Impact Analysis",
      description:
        "Write a 1500-word essay analyzing the impact of climate change on coastal communities",
      subject: "Environmental Science",
      rubricId: "R001",
      submissions: [
        {
          id: "SUB001",
          studentId: "S001",
          studentName: "Emma Chen",
          content: `Climate change represents one of the most pressing challenges...`,
          attachments: ["references.pdf"],
          submittedAt: new Date(Date.now() - 172800000),
          wordCount: 1580,
          status: "completed",
          assignedReviewers: [
            {
              id: "RA001",
              reviewerId: "S002",
              reviewerName: "Marcus Johnson",
              reviewerSkills: ["Technical Writing", "Data Analysis"],
              matchScore: 87,
              matchReasons: [
                "Strong skill match in technical analysis",
                "High accuracy rating (94%)",
                "Complementary knowledge areas",
              ],
              status: "completed",
              assignedAt: new Date(Date.now() - 165600000),
              dueDate: new Date(Date.now() + 86400000),
              completedAt: new Date(Date.now() - 86400000),
            },
            {
              id: "RA002",
              reviewerId: "S005",
              reviewerName: "Jordan Patel",
              reviewerSkills: ["Argumentation", "Research"],
              matchScore: 82,
              matchReasons: [
                "Strong in argumentation",
                "Good research skills match",
                "Available during deadline",
              ],
              status: "completed",
              assignedAt: new Date(Date.now() - 165600000),
              dueDate: new Date(Date.now() + 86400000),
              completedAt: new Date(Date.now() - 43200000),
            },
          ],
          reviewsReceived: [
            {
              id: "REV001",
              submissionId: "SUB001",
              reviewerId: "S002",
              reviewerName: "Anonymous Reviewer A",
              isAnonymous: true,
              rubricScores: [
                {
                  criterionId: "C001",
                  criterionName: "Thesis & Argumentation",
                  score: 23,
                  maxScore: 25,
                  comments:
                    "Strong thesis statement with well-developed arguments. Consider strengthening the counterargument section.",
                  highlightedSections: [
                    "Thesis paragraph shows clarity",
                    "Counterargument could be more robust",
                  ],
                },
                {
                  criterionId: "C002",
                  criterionName: "Evidence & Support",
                  score: 24,
                  maxScore: 25,
                  comments:
                    "Excellent use of scientific data and credible sources. The statistics are compelling.",
                  highlightedSections: [
                    "Statistics section",
                    "Source citations",
                  ],
                },
                {
                  criterionId: "C003",
                  criterionName: "Organization & Structure",
                  score: 19,
                  maxScore: 20,
                  comments:
                    "Very well organized. Smooth transitions between sections.",
                  highlightedSections: [],
                },
                {
                  criterionId: "C004",
                  criterionName: "Writing Quality",
                  score: 14,
                  maxScore: 15,
                  comments:
                    "Clear and professional writing style. Minor grammar issues in paragraph 3.",
                  highlightedSections: ["Paragraph 3: grammar check needed"],
                },
                {
                  criterionId: "C005",
                  criterionName: "Critical Thinking",
                  score: 13,
                  maxScore: 15,
                  comments:
                    "Good analysis showing critical engagement. Could deepen the discussion of socioeconomic implications.",
                  highlightedSections: ["Socioeconomic section could expand"],
                },
              ],
              overallComments:
                "Excellent essay with strong research and clear arguments. The scientific evidence is compelling and well-integrated. Minor improvements in counterargument handling and grammar would make this outstanding.",
              strengths: [
                "Strong thesis statement",
                "Compelling scientific evidence",
                "Clear organizational structure",
                "Professional writing tone",
              ],
              improvements: [
                "Strengthen counterargument section",
                "Fix grammar in paragraph 3",
                "Expand socioeconomic analysis",
              ],
              sentiment: "positive",
              sentimentScore: 0.78,
              quality: "excellent",
              aiConfidence: 92,
              submittedAt: new Date(Date.now() - 86400000),
              helpfulVotes: 8,
              unhelpfulVotes: 0,
              isFlagged: false,
            },
            {
              id: "REV002",
              submissionId: "SUB001",
              reviewerId: "S005",
              reviewerName: "Anonymous Reviewer B",
              isAnonymous: true,
              rubricScores: [
                {
                  criterionId: "C001",
                  criterionName: "Thesis & Argumentation",
                  score: 22,
                  maxScore: 25,
                  comments:
                    "Clear thesis but could be more nuanced. Arguments are solid.",
                  highlightedSections: [],
                },
                {
                  criterionId: "C002",
                  criterionName: "Evidence & Support",
                  score: 23,
                  maxScore: 25,
                  comments:
                    "Good evidence selection. Consider adding more recent sources.",
                  highlightedSections: ["Recent sources needed"],
                },
                {
                  criterionId: "C003",
                  criterionName: "Organization & Structure",
                  score: 18,
                  maxScore: 20,
                  comments:
                    "Well-structured with logical flow. Introduction could be more engaging.",
                  highlightedSections: ["Introduction hook suggestion"],
                },
                {
                  criterionId: "C004",
                  criterionName: "Writing Quality",
                  score: 13,
                  maxScore: 15,
                  comments:
                    "Good clarity overall. Watch for passive voice overuse.",
                  highlightedSections: ["Passive voice in paragraphs 2, 4"],
                },
                {
                  criterionId: "C005",
                  criterionName: "Critical Thinking",
                  score: 14,
                  maxScore: 15,
                  comments:
                    "Shows strong critical thinking. Good analysis of policy implications.",
                  highlightedSections: ["Policy analysis section"],
                },
              ],
              overallComments:
                "Well-written essay demonstrating strong research skills and critical thinking. The policy analysis section is particularly strong. Focus on making the introduction more engaging and updating some sources for next time.",
              strengths: [
                "Strong policy analysis",
                "Good research foundation",
                "Critical thinking demonstrated",
                "Clear writing style",
              ],
              improvements: [
                "More engaging introduction",
                "Update to more recent sources",
                "Reduce passive voice usage",
              ],
              sentiment: "positive",
              sentimentScore: 0.72,
              quality: "excellent",
              aiConfidence: 89,
              submittedAt: new Date(Date.now() - 43200000),
              helpfulVotes: 6,
              unhelpfulVotes: 0,
              isFlagged: false,
            },
          ],
          finalScore: 91,
          insights: {
            averageScore: 91,
            scoreDistribution: [
              { score: 90, count: 2 },
              { score: 92, count: 0 },
            ],
            commonStrengths: [
              { text: "Strong thesis statement", frequency: 2 },
              { text: "Compelling scientific evidence", frequency: 1 },
              { text: "Clear organizational structure", frequency: 2 },
              { text: "Critical thinking demonstrated", frequency: 1 },
            ],
            commonImprovements: [
              { text: "Strengthen counterargument section", frequency: 1 },
              { text: "Fix grammar issues", frequency: 2 },
              { text: "More engaging introduction", frequency: 1 },
            ],
            sentimentAnalysis: {
              positive: 2,
              neutral: 0,
              negative: 0,
              averageSentiment: 0.75,
            },
            qualityDistribution: {
              excellent: 2,
              good: 0,
              adequate: 0,
              poor: 0,
            },
            consensusLevel: 0.88,
            aiSummary:
              "Two excellent reviews show strong consensus (88%) on essay quality. Both reviewers praise the thesis strength and research quality. Minor improvements suggested around counterarguments and grammar.",
            actionItems: [
              "Address grammar issues in paragraph 3",
              "Strengthen counterargument section",
              "Update introduction for better engagement",
            ],
            skillGaps: [],
            progressMetrics: {
              comparedToPrevious: 5,
              trend: "improving",
            },
          },
        },
        {
          id: "SUB002",
          studentId: "S003",
          studentName: "Sophia Williams",
          content: `The role of artificial intelligence in modern education...`,
          attachments: [],
          submittedAt: new Date(Date.now() - 86400000),
          wordCount: 1420,
          status: "reviewing",
          assignedReviewers: [
            {
              id: "RA003",
              reviewerId: "S001",
              reviewerName: "Emma Chen",
              reviewerSkills: ["Critical Analysis", "Essay Writing"],
              matchScore: 85,
              matchReasons: [
                "Strong in essay writing skills",
                "Complementary creative perspective",
                "Good past performance",
              ],
              status: "in-progress",
              assignedAt: new Date(Date.now() - 79200000),
              dueDate: new Date(Date.now() + 43200000),
            },
            {
              id: "RA004",
              reviewerId: "S004",
              reviewerName: "Alex Kim",
              reviewerSkills: ["Scientific Writing", "Research Methods"],
              matchScore: 79,
              matchReasons: [
                "Strong research methodology skills",
                "Analytical approach matches",
                "Available timeframe",
              ],
              status: "assigned",
              assignedAt: new Date(Date.now() - 79200000),
              dueDate: new Date(Date.now() + 43200000),
            },
          ],
          reviewsReceived: [],
        },
      ],
      dueDate: new Date(Date.now() - 86400000),
      reviewDueDate: new Date(Date.now() + 86400000),
      minReviewsPerSubmission: 2,
      maxReviewsPerSubmission: 3,
      reviewMode: "anonymous",
      autoAssign: true,
      aiAssist: true,
      status: "in-progress",
      createdAt: new Date(Date.now() - 1209600000),
    },
    {
      id: "A002",
      title: "Renaissance Art Analysis",
      description:
        "Analyze the techniques and historical context of Renaissance art",
      subject: "Art History",
      rubricId: "R001",
      submissions: [],
      dueDate: new Date(Date.now() + 604800000),
      reviewDueDate: new Date(Date.now() + 950400000),
      minReviewsPerSubmission: 2,
      maxReviewsPerSubmission: 3,
      reviewMode: "double-blind",
      autoAssign: true,
      aiAssist: true,
      status: "open",
      createdAt: new Date(Date.now() - 604800000),
    },
  ]);

  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    minReviewsPerSubmission: 2,
    maxReviewsPerSubmission: 3,
    reviewMode: "anonymous",
    autoAssign: true,
    aiAssist: true,
  });

  const [newReview, setNewReview] = useState<Partial<Review>>({
    isAnonymous: true,
    rubricScores: [],
    strengths: [],
    improvements: [],
  });

  const [currentRubricScores, setCurrentRubricScores] = useState<RubricScore[]>(
    [],
  );

  const [qualityMetrics] = useState<QualityMetrics>({
    totalReviews: 156,
    averageQuality: 4.6,
    flaggedReviews: 3,
    consensusLevel: 0.84,
    aiInterventions: 12,
    reviewerAccuracy: [
      { reviewerId: "S002", accuracy: 0.94 },
      { reviewerId: "S005", accuracy: 0.91 },
      { reviewerId: "S001", accuracy: 0.89 },
      { reviewerId: "S004", accuracy: 0.87 },
    ],
  });

  useEffect(() => {
    if (selectedSubmission && selectedAssignment) {
      const rubric = rubrics.find((r) => r.id === selectedAssignment.rubricId);
      if (rubric) {
        setCurrentRubricScores(
          rubric.criteria.map((c) => ({
            criterionId: c.id,
            criterionName: c.name,
            score: 0,
            maxScore: c.weight,
            comments: "",
            highlightedSections: [],
          })),
        );
      }
    }
  }, [selectedSubmission, selectedAssignment]);

  const calculateMatchingScore = (
    reviewer: StudentProfile,
    submission: Submission,
    assignment: Assignment,
  ): MatchingResult => {
    const rubric = rubrics.find((r) => r.id === assignment.rubricId);
    const requiredSkills =
      rubric?.criteria.map((c) => c.skillTag.toLowerCase()) || [];

    const matchingSkills = reviewer.skills.filter((skill) =>
      requiredSkills.some((req) =>
        req.toLowerCase().includes(skill.toLowerCase()),
      ),
    );
    const skillMatch =
      (matchingSkills.length / Math.max(requiredSkills.length, 1)) * 100;

    const matchingKnowledge = reviewer.knowledgeAreas.filter((area) =>
      assignment.subject.toLowerCase().includes(area.toLowerCase()),
    );
    const knowledgeMatch =
      (matchingKnowledge.length / Math.max(reviewer.knowledgeAreas.length, 1)) *
      100;

    const workloadScore = Math.max(0, 100 - reviewer.pastReviewsGiven * 2);

    const diversityBonus = 15;

    const pastPerformance = reviewer.averageReviewQuality * 20;

    const totalScore = Math.round(
      skillMatch * 0.35 +
        knowledgeMatch * 0.25 +
        workloadScore * 0.15 +
        diversityBonus * 0.1 +
        pastPerformance * 0.15,
    );

    return {
      submissionId: submission.id,
      reviewerId: reviewer.id,
      score: Math.min(100, totalScore),
      breakdown: {
        skillMatch,
        knowledgeMatch,
        workloadBalance: workloadScore,
        diversityBonus,
        pastPerformance,
      },
      confidence: 0.85,
      reasoning: [
        `${matchingSkills.length} matching skills found`,
        `${matchingKnowledge.length} knowledge areas aligned`,
        `Past accuracy: ${(reviewer.reviewAccuracy * 100).toFixed(0)}%`,
        `Quality rating: ${reviewer.averageReviewQuality}/5`,
      ],
    };
  };

  const generateAIRubric = async (
    assignmentId: string,
  ): Promise<ReviewRubric> => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) throw new Error("Assignment not found");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const aiRubric: ReviewRubric = {
      id: `AI-R-${Date.now()}`,
      name: `AI-Generated: ${assignment.subject} Review Rubric`,
      description: `Automatically generated rubric for ${assignment.title}`,
      aiGenerated: true,
      aiConfidence: 91,
      generatedAt: new Date(),
      criteria: [
        {
          id: `AI-C-${Date.now()}-1`,
          name: "Content Understanding",
          description: "Demonstrates understanding of core concepts",
          weight: 30,
          skillTag: "Subject Knowledge",
          levels: [
            {
              level: 4,
              label: "Mastery",
              description: "Exceptional understanding with original insights",
              minPoints: 27,
              maxPoints: 30,
              example:
                "Shows deep understanding and applies concepts in novel ways",
            },
            {
              level: 3,
              label: "Proficient",
              description: "Strong understanding of key concepts",
              minPoints: 21,
              maxPoints: 26,
            },
            {
              level: 2,
              label: "Developing",
              description: "Basic understanding with some gaps",
              minPoints: 15,
              maxPoints: 20,
            },
            {
              level: 1,
              label: "Beginning",
              description: "Limited or incorrect understanding",
              minPoints: 10,
              maxPoints: 14,
            },
          ],
          aiSuggestions: [
            "Check for accurate use of subject-specific terminology",
            "Look for connections between different concepts",
            "Assess depth of understanding vs surface knowledge",
          ],
        },
        {
          id: `AI-C-${Date.now()}-2`,
          name: "Critical Analysis",
          description: "Quality of analysis and evaluation",
          weight: 25,
          skillTag: "Critical Thinking",
          levels: [
            {
              level: 4,
              label: "Sophisticated",
              description: "Deep analysis with multiple perspectives",
              minPoints: 22,
              maxPoints: 25,
            },
            {
              level: 3,
              label: "Effective",
              description: "Good analysis with clear reasoning",
              minPoints: 18,
              maxPoints: 21,
            },
            {
              level: 2,
              label: "Basic",
              description: "Some analysis but lacks depth",
              minPoints: 13,
              maxPoints: 17,
            },
            {
              level: 1,
              label: "Limited",
              description: "Minimal or no analysis",
              minPoints: 8,
              maxPoints: 12,
            },
          ],
          aiSuggestions: [
            "Look for evidence of critical thinking",
            "Check for evaluation of sources and claims",
            "Assess the depth of insight provided",
          ],
        },
        {
          id: `AI-C-${Date.now()}-3`,
          name: "Communication",
          description: "Clarity and effectiveness of communication",
          weight: 20,
          skillTag: "Communication",
          levels: [
            {
              level: 4,
              label: "Exceptional",
              description: "Crystal clear, engaging, professional",
              minPoints: 18,
              maxPoints: 20,
            },
            {
              level: 3,
              label: "Clear",
              description: "Good clarity and organization",
              minPoints: 14,
              maxPoints: 17,
            },
            {
              level: 2,
              label: "Adequate",
              description: "Understandable but could be clearer",
              minPoints: 10,
              maxPoints: 13,
            },
            {
              level: 1,
              label: "Unclear",
              description: "Difficult to understand",
              minPoints: 6,
              maxPoints: 9,
            },
          ],
          aiSuggestions: [
            "Check for clear structure and logical flow",
            "Assess vocabulary appropriateness",
            "Look for engaging and clear presentation",
          ],
        },
        {
          id: `AI-C-${Date.now()}-4`,
          name: "Use of Evidence",
          description: "Quality and integration of supporting evidence",
          weight: 15,
          skillTag: "Research",
          levels: [
            {
              level: 4,
              label: "Strong",
              description: "Compelling, well-integrated evidence",
              minPoints: 13,
              maxPoints: 15,
            },
            {
              level: 3,
              label: "Good",
              description: "Relevant evidence, good integration",
              minPoints: 11,
              maxPoints: 12,
            },
            {
              level: 2,
              label: "Adequate",
              description: "Some evidence, basic integration",
              minPoints: 8,
              maxPoints: 10,
            },
            {
              level: 1,
              label: "Weak",
              description: "Insufficient or irrelevant evidence",
              minPoints: 5,
              maxPoints: 7,
            },
          ],
          aiSuggestions: [
            "Verify credibility of sources",
            "Check if evidence supports claims",
            "Assess integration of evidence into arguments",
          ],
        },
        {
          id: `AI-C-${Date.now()}-5`,
          name: "Originality",
          description: "Original thought and creative engagement",
          weight: 10,
          skillTag: "Creativity",
          levels: [
            {
              level: 4,
              label: "Highly Original",
              description: "Novel insights and unique perspective",
              minPoints: 9,
              maxPoints: 10,
            },
            {
              level: 3,
              label: "Original",
              description: "Some original thinking",
              minPoints: 7,
              maxPoints: 8,
            },
            {
              level: 2,
              label: "Some Originality",
              description: "Limited original thought",
              minPoints: 5,
              maxPoints: 6,
            },
            {
              level: 1,
              label: "Unoriginal",
              description: "Mostly derivative or copied",
              minPoints: 3,
              maxPoints: 4,
            },
          ],
          aiSuggestions: [
            "Look for novel insights or connections",
            "Check for unique perspective or approach",
            "Assess creative engagement with material",
          ],
        },
      ],
    };

    return aiRubric;
  };

  const analyzeSentiment = (
    text: string,
  ): { sentiment: Sentiment; score: number } => {
    const positiveWords = [
      "excellent",
      "strong",
      "good",
      "great",
      "well",
      "clear",
      "effective",
      "compelling",
      "impressive",
      "outstanding",
    ];
    const negativeWords = [
      "poor",
      "weak",
      "inadequate",
      "unclear",
      "difficult",
      "problem",
      "issue",
      "missing",
      "lacking",
      "insufficient",
    ];

    const textLower = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach((word) => {
      const regex = new RegExp(word, "g");
      const matches = textLower.match(regex);
      if (matches) positiveCount += matches.length;
    });

    negativeWords.forEach((word) => {
      const regex = new RegExp(word, "g");
      const matches = textLower.match(regex);
      if (matches) negativeCount += matches.length;
    });

    const total = positiveCount + negativeCount;
    if (total === 0) return { sentiment: "neutral", score: 0.5 };

    const score = positiveCount / total;

    if (score > 0.6) return { sentiment: "positive", score };
    if (score < 0.4) return { sentiment: "negative", score: 1 - score };
    return { sentiment: "neutral", score };
  };

  const assessQuality = (review: Partial<Review>): ReviewQuality => {
    const criteriaCount = review.rubricScores?.length || 0;
    const commentsLength = review.overallComments?.length || 0;
    const strengthsCount = review.strengths?.length || 0;
    const improvementsCount = review.improvements?.length || 0;

    const score =
      criteriaCount * 5 +
      Math.min(commentsLength / 10, 20) +
      strengthsCount * 3 +
      improvementsCount * 3;

    if (score >= 60) return "excellent";
    if (score >= 45) return "good";
    if (score >= 30) return "adequate";
    return "poor";
  };

  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.subject) return;

    const assignment: Omit<
      Assignment,
      "id" | "submissions" | "createdAt" | "status"
    > = {
      title: newAssignment.title,
      description: newAssignment.description || "",
      subject: newAssignment.subject,
      dueDate: newAssignment.dueDate || new Date(Date.now() + 604800000),
      reviewDueDate:
        newAssignment.reviewDueDate || new Date(Date.now() + 950400000),
      rubricId: newAssignment.rubricId || rubrics[0]?.id || "",
      minReviewsPerSubmission: newAssignment.minReviewsPerSubmission || 2,
      maxReviewsPerSubmission: newAssignment.maxReviewsPerSubmission || 3,
      reviewMode: newAssignment.reviewMode || "anonymous",
      autoAssign: newAssignment.autoAssign ?? true,
      aiAssist: newAssignment.aiAssist ?? true,
    };

    const id = onCreateAssignment
      ? await onCreateAssignment(assignment)
      : `A${Date.now()}`;

    setAssignments((prev) => [
      ...prev,
      {
        ...assignment,
        id,
        submissions: [],
        createdAt: new Date(),
        status: "open",
      } as Assignment,
    ]);

    setIsCreatingAssignment(false);
    setNewAssignment({
      minReviewsPerSubmission: 2,
      maxReviewsPerSubmission: 3,
      reviewMode: "anonymous",
      autoAssign: true,
      aiAssist: true,
    });
  };

  const handleGenerateRubric = async (assignmentId: string) => {
    setIsGeneratingRubric(true);

    try {
      let rubric: ReviewRubric;

      if (onGenerateRubric) {
        rubric = await onGenerateRubric(assignmentId);
      } else {
        rubric = await generateAIRubric(assignmentId);
      }

      setRubrics((prev) => [...prev, rubric]);
      setNewAssignment((prev) => ({ ...prev, rubricId: rubric.id }));
    } catch (error) {
      console.error("Failed to generate rubric:", error);
    } finally {
      setIsGeneratingRubric(false);
    }
  };

  const handleAutoAssignReviewers = async (submission: Submission) => {
    if (!selectedAssignment) return;

    setIsAssigningReviewers(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const availableStudents = students.filter(
      (s) => s.id !== submission.studentId,
    );

    const matchingResults = availableStudents.map((student) =>
      calculateMatchingScore(student, submission, selectedAssignment),
    );

    matchingResults.sort((a, b) => b.score - a.score);

    const topMatches = matchingResults.slice(0, 2);

    const newReviewers: ReviewAssignment[] = topMatches.map((match, idx) => ({
      id: `RA-${Date.now()}-${idx}`,
      reviewerId: match.reviewerId,
      reviewerName: students.find((s) => s.id === match.reviewerId)?.name || "",
      reviewerSkills:
        students.find((s) => s.id === match.reviewerId)?.skills || [],
      matchScore: match.score,
      matchReasons: match.reasoning,
      status: "assigned",
      assignedAt: new Date(),
      dueDate: selectedAssignment.reviewDueDate,
    }));

    if (onAssignReviewers) {
      await onAssignReviewers(
        submission.id,
        newReviewers.map((r) => ({
          reviewerId: r.reviewerId,
          reviewerName: r.reviewerName,
          reviewerSkills: r.reviewerSkills,
          matchScore: r.matchScore,
          matchReasons: r.matchReasons,
          status: r.status,
          dueDate: r.dueDate,
        })),
      );
    }

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === selectedAssignment.id
          ? {
              ...a,
              submissions: a.submissions.map((s) =>
                s.id === submission.id
                  ? {
                      ...s,
                      assignedReviewers: newReviewers,
                      status: "reviewing",
                    }
                  : s,
              ),
            }
          : a,
      ),
    );

    setIsAssigningReviewers(false);
  };

  const handleSubmitReview = async () => {
    if (!selectedSubmission || !selectedAssignment) return;

    setIsSubmittingReview(true);

    const sentimentAnalysis = analyzeSentiment(newReview.overallComments || "");
    const quality = assessQuality({
      ...newReview,
      rubricScores: currentRubricScores,
    });

    const review: Review = {
      id: `REV-${Date.now()}`,
      submissionId: selectedSubmission.id,
      reviewerId: userId,
      reviewerName: "You",
      isAnonymous: newReview.isAnonymous ?? true,
      rubricScores: currentRubricScores,
      overallComments: newReview.overallComments || "",
      strengths: newReview.strengths || [],
      improvements: newReview.improvements || [],
      sentiment: sentimentAnalysis.sentiment,
      sentimentScore: sentimentAnalysis.score,
      quality,
      aiConfidence: 88,
      submittedAt: new Date(),
      helpfulVotes: 0,
      unhelpfulVotes: 0,
      isFlagged: false,
    };

    if (onSubmitReview) {
      await onSubmitReview(review);
    }

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === selectedAssignment.id
          ? {
              ...a,
              submissions: a.submissions.map((s) =>
                s.id === selectedSubmission.id
                  ? {
                      ...s,
                      reviewsReceived: [...s.reviewsReceived, review],
                      status:
                        s.reviewsReceived.length + 1 >=
                        a.minReviewsPerSubmission
                          ? "completed"
                          : "reviewing",
                    }
                  : s,
              ),
            }
          : a,
      ),
    );

    setIsSubmittingReview(false);
    setSelectedSubmission(null);
    setNewReview({
      isAnonymous: true,
      rubricScores: [],
      strengths: [],
      improvements: [],
    });
    setCurrentRubricScores([]);
  };

  const handleFlagReview = async (reviewId: string, reason: string) => {
    if (onFlagReview) {
      await onFlagReview(reviewId, reason);
    }

    setAssignments((prev) =>
      prev.map((a) => ({
        ...a,
        submissions: a.submissions.map((s) => ({
          ...s,
          reviewsReceived: s.reviewsReceived.map((r) =>
            r.id === reviewId
              ? { ...r, isFlagged: true, flagReason: reason }
              : r,
          ),
        })),
      })),
    );
  };

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      filterSubject === "all" || a.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const allSubjects = Array.from(new Set(assignments.map((a) => a.subject)));

  const totalSubmissions = assignments.reduce(
    (sum, a) => sum + a.submissions.length,
    0,
  );
  const completedSubmissions = assignments.reduce(
    (sum, a) =>
      sum + a.submissions.filter((s) => s.status === "completed").length,
    0,
  );
  const pendingReviews = assignments.reduce(
    (sum, a) =>
      sum +
      a.submissions.filter(
        (s) => s.status === "assigned" || s.status === "reviewing",
      ).length,
    0,
  );

  const getReviewModeIcon = (mode: ReviewMode) => {
    switch (mode) {
      case "anonymous":
        return <EyeOff className="h-5 w-5" />;
      case "identified":
        return <Eye className="h-5 w-5" />;
      case "double-blind":
        return <Fingerprint className="h-5 w-5" />;
    }
  };

  const getReviewModeLabel = (mode: ReviewMode) => {
    switch (mode) {
      case "anonymous":
        return "Anonymous";
      case "identified":
        return "Identified";
      case "double-blind":
        return "Double-Blind";
    }
  };

  const getSentimentColor = (sentiment: Sentiment) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-100";
      case "neutral":
        return "text-slate-600 bg-slate-100";
      case "negative":
        return "text-red-600 bg-red-100";
    }
  };

  const getQualityColor = (quality: ReviewQuality) => {
    switch (quality) {
      case "excellent":
        return "text-emerald-600 bg-emerald-100";
      case "good":
        return "text-blue-600 bg-blue-100";
      case "adequate":
        return "text-amber-600 bg-amber-100";
      case "poor":
        return "text-red-600 bg-red-100";
    }
  };

  const getStatusColor = (status: ReviewStatus) => {
    switch (status) {
      case "pending":
        return "bg-slate-100 text-slate-700";
      case "assigned":
        return "bg-amber-100 text-amber-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "submitted":
        return "bg-purple-100 text-purple-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "flagged":
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <Brain className="h-8 w-8 text-indigo-600" />
            AI Peer Review System
          </h2>
          <p className="mt-1 text-slate-600">
            Intelligent peer review with AI-powered matching, rubrics, and
            quality control
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-indigo-100 px-4 py-2 text-indigo-700">
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">AI Assisted</span>
          </div>
          {userRole === "teacher" && (
            <button
              onClick={() => setIsCreatingAssignment(true)}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
            >
              <FileText className="h-5 w-5" />
              New Assignment
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Total Assignments",
            value: assignments.length,
            color: "bg-indigo-500",
            icon: FileText,
          },
          {
            label: "Submissions",
            value: totalSubmissions,
            color: "bg-blue-500",
            icon: Users,
          },
          {
            label: "Pending Reviews",
            value: pendingReviews,
            color: "bg-amber-500",
            icon: Clock,
          },
          {
            label: "Avg Review Quality",
            value: qualityMetrics.averageQuality.toFixed(1),
            color: "bg-emerald-500",
            icon: Star,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center gap-2">
              <stat.icon
                className={`h-4 w-4 ${stat.color.replace("bg-", "text-")}`}
              />
              <span className="text-slate-600 text-sm">{stat.label}</span>
            </div>
            <p className="font-bold text-2xl text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-slate-200 border-b">
        {[
          { id: "assignments", label: "Assignments", icon: FileText },
          { id: "pending", label: "My Reviews", icon: Clock },
          { id: "completed", label: "Completed", icon: CheckCircle },
          { id: "insights", label: "Insights", icon: BarChart3 },
          ...(userRole === "teacher"
            ? [{ id: "settings", label: "Settings", icon: Settings }]
            : []),
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-indigo-600 border-b-2 text-indigo-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "assignments" && (
        <>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-slate-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterSubject}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterSubject(e.target.value)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Subjects</option>
              {allSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredAssignments.map((assignment) => (
                <motion.div
                  key={assignment.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md"
                >
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="font-bold text-slate-900 text-xl">
                            {assignment.title}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              assignment.status === "open"
                                ? "bg-green-100 text-green-700"
                                : assignment.status === "in-progress"
                                  ? "bg-blue-100 text-blue-700"
                                  : assignment.status === "completed"
                                    ? "bg-slate-100 text-slate-700"
                                    : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {assignment.status.toUpperCase()}
                          </span>
                          <span className="flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 text-indigo-700 text-xs">
                            {getReviewModeIcon(assignment.reviewMode)}
                            {getReviewModeLabel(assignment.reviewMode)}
                          </span>
                          {assignment.aiAssist && (
                            <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-purple-700 text-xs">
                              <Sparkles className="h-3 w-3" />
                              AI-Assisted
                            </span>
                          )}
                        </div>
                        <p className="mb-2 text-slate-600">
                          {assignment.description}
                        </p>
                        <div className="flex items-center gap-4 text-slate-500 text-sm">
                          <span className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {assignment.subject}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Due {assignment.dueDate.toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {assignment.submissions.length} submissions
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            {assignment.minReviewsPerSubmission}-
                            {assignment.maxReviewsPerSubmission} reviews each
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedAssignment(assignment)}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
                      >
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    {assignment.submissions.length > 0 && (
                      <div className="mt-4 border-slate-200 border-t pt-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-semibold text-slate-900">
                            Recent Submissions
                          </h4>
                          <span className="text-slate-500 text-sm">
                            {
                              assignment.submissions.filter(
                                (s) => s.status === "completed",
                              ).length
                            }{" "}
                            of {assignment.submissions.length} completed
                          </span>
                        </div>
                        <div className="space-y-2">
                          {assignment.submissions
                            .slice(0, 3)
                            .map((submission) => (
                              <div
                                key={submission.id}
                                className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                                    <Users className="h-4 w-4 text-indigo-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-slate-900">
                                      {submission.studentName}
                                    </p>
                                    <p className="text-slate-500 text-sm">
                                      {submission.wordCount} words •{" "}
                                      {submission.submittedAt.toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`rounded-full px-2 py-1 text-xs ${
                                      submission.status === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : submission.status === "reviewing"
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-amber-100 text-amber-700"
                                    }`}
                                  >
                                    {submission.status === "completed"
                                      ? `Score: ${submission.finalScore}`
                                      : submission.status === "reviewing"
                                        ? `${submission.reviewsReceived.length}/${assignment.minReviewsPerSubmission} reviews`
                                        : "Pending Assignment"}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {activeTab === "pending" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-lg text-slate-900">
              <Clock className="h-5 w-5 text-amber-600" />
              Reviews Assigned to You
            </h3>

            {assignments
              .flatMap((a) =>
                a.submissions
                  .filter(
                    (s) =>
                      s.assignedReviewers.some(
                        (r) =>
                          r.reviewerId === userId && r.status !== "completed",
                      ) &&
                      s.reviewsReceived.every((r) => r.reviewerId !== userId),
                  )
                  .map((s) => ({ ...s, assignment: a })),
              )
              .map((submission) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-lg border-indigo-500 border-l-4 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {submission.assignment.title}
                      </h4>
                      <p className="mb-2 text-slate-600 text-sm">
                        Submission by {submission.studentName}
                      </p>
                      <div className="flex items-center gap-4 text-slate-500 text-sm">
                        <span>{submission.wordCount} words</span>
                        <span>
                          Submitted{" "}
                          {submission.submittedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedAssignment(submission.assignment);
                        setSelectedSubmission(submission);
                      }}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
                    >
                      Start Review
                    </button>
                  </div>
                </motion.div>
              ))}

            {assignments.filter((a) =>
              a.submissions.some(
                (s) =>
                  s.assignedReviewers.some(
                    (r) => r.reviewerId === userId && r.status !== "completed",
                  ) && s.reviewsReceived.every((r) => r.reviewerId !== userId),
              ),
            ).length === 0 && (
              <div className="py-8 text-center">
                <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
                <p className="text-slate-600">
                  No pending reviews assigned to you
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "completed" && (
        <div className="space-y-4">
          {assignments
            .flatMap((a) =>
              a.submissions
                .filter((s) => s.status === "completed")
                .map((s) => ({ ...s, assignment: a })),
            )
            .map((submission) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {submission.assignment.title}
                    </h4>
                    <p className="text-slate-600 text-sm">
                      {submission.studentName} • {submission.wordCount} words
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    <span className="font-bold text-slate-900 text-xl">
                      {submission.finalScore}
                    </span>
                  </div>
                </div>

                {submission.insights && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="text-slate-600 text-sm">Consensus:</span>
                      <div className="h-2 flex-1 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-indigo-500"
                          style={{
                            width: `${submission.insights.consensusLevel * 100}%`,
                          }}
                        />
                      </div>
                      <span className="font-medium text-slate-900 text-sm">
                        {(submission.insights.consensusLevel * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="mb-2 flex items-center gap-2 font-medium text-slate-900">
                          <ThumbsUp className="h-4 w-4 text-green-500" />
                          Key Strengths
                        </h5>
                        <ul className="space-y-1">
                          {submission.insights.commonStrengths
                            .slice(0, 3)
                            .map((s, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-slate-600 text-sm"
                              >
                                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                {s.text}
                              </li>
                            ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="mb-2 flex items-center gap-2 font-medium text-slate-900">
                          <Lightbulb className="h-4 w-4 text-amber-500" />
                          Areas to Improve
                        </h5>
                        <ul className="space-y-1">
                          {submission.insights.commonImprovements
                            .slice(0, 3)
                            .map((imp, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-slate-600 text-sm"
                              >
                                <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                                {imp.text}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-lg bg-indigo-50 p-3">
                      <p className="text-indigo-800 text-sm">
                        <span className="font-semibold">AI Summary:</span>{" "}
                        {submission.insights.aiSummary}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedAssignment(submission.assignment);
                        setSelectedSubmission(submission);
                      }}
                      className="font-medium text-indigo-600 text-sm hover:text-indigo-800"
                    >
                      View Full Analysis →
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
        </div>
      )}

      {activeTab === "insights" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-lg text-slate-900">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Review Quality Distribution
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Excellent", count: 89, color: "bg-emerald-500" },
                  { label: "Good", count: 52, color: "bg-blue-500" },
                  { label: "Adequate", count: 12, color: "bg-amber-500" },
                  { label: "Poor", count: 3, color: "bg-red-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="w-20 text-slate-600 text-sm">
                      {item.label}
                    </span>
                    <div className="h-4 flex-1 rounded-full bg-slate-200">
                      <div
                        className={`h-4 rounded-full ${item.color}`}
                        style={{
                          width: `${(item.count / qualityMetrics.totalReviews) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-12 text-right font-medium text-slate-900 text-sm">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-lg text-slate-900">
                <Scale className="h-5 w-5 text-indigo-600" />
                Consensus Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <span className="text-slate-600">
                    Average Consensus Level
                  </span>
                  <span className="font-bold text-indigo-600 text-xl">
                    {(qualityMetrics.consensusLevel * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <span className="text-slate-600">AI Interventions</span>
                  <span className="font-bold text-amber-600 text-xl">
                    {qualityMetrics.aiInterventions}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <span className="text-slate-600">Flagged Reviews</span>
                  <span className="font-bold text-red-600 text-xl">
                    {qualityMetrics.flaggedReviews}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-lg text-slate-900">
              <Star className="h-5 w-5 text-indigo-600" />
              Top Reviewers by Accuracy
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {qualityMetrics.reviewerAccuracy.map((reviewer) => {
                const student = students.find(
                  (s) => s.id === reviewer.reviewerId,
                );
                return (
                  <div
                    key={reviewer.reviewerId}
                    className="rounded-lg bg-slate-50 p-4"
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {student?.name}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {student?.grade}th Grade
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 text-sm">Accuracy</span>
                      <span className="font-bold text-emerald-600">
                        {(reviewer.accuracy * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-lg text-slate-900">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Sentiment Analysis Overview
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="mb-1 font-bold text-3xl text-green-600">67%</p>
                <p className="text-green-800 text-sm">Positive Feedback</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 text-center">
                <p className="mb-1 font-bold text-3xl text-slate-600">28%</p>
                <p className="text-slate-700 text-sm">Neutral Feedback</p>
              </div>
              <div className="rounded-lg bg-red-50 p-4 text-center">
                <p className="mb-1 font-bold text-3xl text-red-600">5%</p>
                <p className="text-red-800 text-sm">Negative Feedback</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "settings" && userRole === "teacher" && (
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-md">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-lg text-slate-900">
            <Settings className="h-5 w-5 text-indigo-600" />
            Peer Review Settings
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="font-semibold text-slate-900">
                  Default Review Mode
                </p>
                <p className="text-slate-600 text-sm">
                  Set the default anonymity mode for new assignments
                </p>
              </div>
              <select
                value={activeReviewMode}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setActiveReviewMode(e.target.value as ReviewMode)
                }
                className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="anonymous">Anonymous</option>
                <option value="identified">Identified</option>
                <option value="double-blind">Double-Blind</option>
              </select>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="font-semibold text-slate-900">
                  AI-Assisted Reviews
                </p>
                <p className="text-slate-600 text-sm">
                  Enable AI suggestions and quality checks during reviews
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  defaultChecked
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="font-semibold text-slate-900">
                  Auto-Assign Reviewers
                </p>
                <p className="text-slate-600 text-sm">
                  Automatically match reviewers using AI algorithm
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  defaultChecked
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="font-semibold text-slate-900">Quality Control</p>
                <p className="text-slate-600 text-sm">
                  Flag reviews that don&apos;t meet quality standards
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  defaultChecked
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="font-semibold text-slate-900">
                  Sentiment Analysis
                </p>
                <p className="text-slate-600 text-sm">
                  Analyze review tone and sentiment for feedback quality
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  defaultChecked
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {selectedAssignment && !selectedSubmission && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedAssignment(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="relative h-24 bg-gradient-to-br from-indigo-500 to-purple-600">
              <button
                onClick={() => setSelectedAssignment(null)}
                className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="-mt-8 p-6">
              <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="mb-2 font-bold text-2xl text-slate-900">
                      {selectedAssignment.title}
                    </h3>
                    <p className="mb-3 text-slate-600">
                      {selectedAssignment.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700 text-sm">
                        {selectedAssignment.subject}
                      </span>
                      <span className="flex items-center gap-1 text-slate-600 text-sm">
                        {getReviewModeIcon(selectedAssignment.reviewMode)}
                        {getReviewModeLabel(selectedAssignment.reviewMode)}
                      </span>
                      {selectedAssignment.aiAssist && (
                        <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-purple-700 text-sm">
                          <Sparkles className="h-3 w-3" />
                          AI-Assisted
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-sm">Submission Due</p>
                    <p className="font-semibold text-slate-900">
                      {selectedAssignment.dueDate.toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-slate-500 text-sm">Review Due</p>
                    <p className="font-semibold text-slate-900">
                      {selectedAssignment.reviewDueDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <p className="font-bold text-2xl text-slate-900">
                      {selectedAssignment.submissions.length}
                    </p>
                    <p className="text-slate-600 text-sm">Submissions</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <p className="font-bold text-2xl text-slate-900">
                      {selectedAssignment.minReviewsPerSubmission}-
                      {selectedAssignment.maxReviewsPerSubmission}
                    </p>
                    <p className="text-slate-600 text-sm">Reviews Each</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 text-center">
                    <p className="font-bold text-2xl text-slate-900">
                      {
                        selectedAssignment.submissions.filter(
                          (s) => s.status === "completed",
                        ).length
                      }
                    </p>
                    <p className="text-slate-600 text-sm">Completed</p>
                  </div>
                </div>
              </div>

              <h4 className="mb-4 font-semibold text-slate-900">
                All Submissions
              </h4>
              <div className="space-y-3">
                {selectedAssignment.submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="rounded-lg border-indigo-500 border-l-4 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                          <Users className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {submission.studentName}
                          </p>
                          <p className="text-slate-500 text-sm">
                            {submission.wordCount} words • Submitted{" "}
                            {submission.submittedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
                            submission.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : submission.status === "reviewing"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {submission.status === "completed"
                            ? `Score: ${submission.finalScore}`
                            : submission.status === "reviewing"
                              ? `${submission.reviewsReceived.length}/${selectedAssignment.minReviewsPerSubmission} reviews`
                              : "Pending Assignment"}
                        </span>

                        {userRole === "teacher" &&
                          submission.status !== "completed" &&
                          submission.assignedReviewers.length === 0 && (
                            <button
                              onClick={() =>
                                handleAutoAssignReviewers(submission)
                              }
                              disabled={isAssigningReviewers}
                              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                            >
                              {isAssigningReviewers ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Sparkles className="h-4 w-4" />
                              )}
                              Auto-Assign Reviewers
                            </button>
                          )}

                        {submission.assignedReviewers.length > 0 && (
                          <div className="text-slate-500 text-sm">
                            {submission.assignedReviewers.length} reviewer
                            {submission.assignedReviewers.length !== 1
                              ? "s"
                              : ""}{" "}
                            assigned
                          </div>
                        )}
                      </div>
                    </div>

                    {submission.assignedReviewers.length > 0 && (
                      <div className="mt-3 pl-12">
                        <div className="space-y-2">
                          {submission.assignedReviewers.map((reviewer) => (
                            <div
                              key={reviewer.id}
                              className="flex items-center justify-between rounded-lg bg-white p-2"
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100">
                                  <Users className="h-3 w-3 text-indigo-600" />
                                </div>
                                <span className="font-medium text-slate-900 text-sm">
                                  {showAnonymous ||
                                  !selectedAssignment.reviewMode.includes(
                                    "anonymous",
                                  )
                                    ? reviewer.reviewerName
                                    : "Anonymous Reviewer"}
                                </span>
                                <span className="text-slate-500 text-xs">
                                  Match Score: {reviewer.matchScore}%
                                </span>
                              </div>
                              <span
                                className={`rounded-full px-2 py-1 text-xs ${getStatusColor(
                                  reviewer.status,
                                )}`}
                              >
                                {reviewer.status.toUpperCase()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {submission.reviewsReceived.length > 0 && (
                      <div className="mt-3 pl-12">
                        <h5 className="mb-2 font-semibold text-slate-900 text-sm">
                          Received Reviews
                        </h5>
                        <div className="space-y-2">
                          {submission.reviewsReceived.map((review) => (
                            <button
                              key={review.id}
                              onClick={() => setSelectedReview(review)}
                              className="w-full rounded-lg bg-white p-3 text-left transition-colors hover:bg-slate-100"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-slate-900 text-sm">
                                    {review.isAnonymous && !showAnonymous
                                      ? "Anonymous Reviewer"
                                      : review.reviewerName}
                                  </span>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-xs ${getQualityColor(
                                      review.quality,
                                    )}`}
                                  >
                                    {review.quality.toUpperCase()}
                                  </span>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-xs ${getSentimentColor(
                                      review.sentiment,
                                    )}`}
                                  >
                                    {review.sentiment}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                  <ThumbsUp className="h-4 w-4" />
                                  {review.helpfulVotes}
                                  {review.isFlagged && (
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {selectedReview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedReview(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-900 text-xl">
                    Review Details
                  </h3>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${getQualityColor(
                      selectedReview.quality,
                    )}`}
                  >
                    {selectedReview.quality.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="rounded-full p-2 hover:bg-slate-100"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex items-center gap-4 text-slate-500 text-sm">
                <span>
                  Submitted {selectedReview.submittedAt.toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Brain className="h-4 w-4" />
                  AI Confidence: {selectedReview.aiConfidence}%
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {selectedReview.helpfulVotes} helpful votes
                </span>
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-slate-900">
                  Rubric Scores
                </h4>
                <div className="space-y-3">
                  {selectedReview.rubricScores.map((score) => (
                    <div
                      key={score.criterionId}
                      className="rounded-lg bg-slate-50 p-3"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-medium text-slate-900">
                          {score.criterionName}
                        </span>
                        <span className="font-semibold text-indigo-600">
                          {score.score}/{score.maxScore}
                        </span>
                      </div>
                      <div className="mb-2 h-2 w-full rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-indigo-500"
                          style={{
                            width: `${(score.score / score.maxScore) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-slate-600 text-sm">{score.comments}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-slate-900">
                  Overall Comments
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  {selectedReview.overallComments}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {selectedReview.strengths.map((strength, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-slate-600 text-sm"
                      >
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-1">
                    {selectedReview.improvements.map((imp, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-slate-600 text-sm"
                      >
                        <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-4 border-slate-200 border-t pt-4">
                <span
                  className={`rounded-full px-3 py-1 text-sm ${getSentimentColor(
                    selectedReview.sentiment,
                  )}`}
                >
                  Sentiment: {selectedReview.sentiment} (
                  {(selectedReview.sentimentScore * 100).toFixed(0)}%)
                </span>

                {userRole === "teacher" && !selectedReview.isFlagged && (
                  <button
                    onClick={() => {
                      handleFlagReview(
                        selectedReview.id,
                        "Insufficient detail",
                      );
                      setSelectedReview(null);
                    }}
                    className="flex items-center gap-2 rounded-lg px-3 py-1 text-red-600 transition-colors hover:bg-red-50"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Flag Review
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {selectedSubmission && selectedAssignment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            setSelectedSubmission(null);
            setNewReview({
              isAnonymous: true,
              rubricScores: [],
              strengths: [],
              improvements: [],
            });
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b bg-gradient-to-r from-indigo-50 to-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-xl">
                    Submit Peer Review
                  </h3>
                  <p className="text-slate-600">
                    {selectedAssignment.title} •{" "}
                    {selectedSubmission.studentName}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedSubmission(null);
                    setNewReview({
                      isAnonymous: true,
                      rubricScores: [],
                      strengths: [],
                      improvements: [],
                    });
                  }}
                  className="rounded-full p-2 transition-colors hover:bg-slate-200"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div className="rounded-lg bg-indigo-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold text-indigo-900">
                    AI-Assisted Review
                  </span>
                </div>
                <p className="text-indigo-700 text-sm">
                  Our AI will analyze your review for quality, provide sentiment
                  feedback, and suggest improvements to help you give better
                  peer feedback.
                </p>
              </div>

              <div>
                <h4 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                  <Scale className="h-5 w-5 text-indigo-600" />
                  Rubric Evaluation
                </h4>
                <div className="space-y-4">
                  {currentRubricScores.map((score, idx) => {
                    const criterion = rubrics
                      .find((r) => r.id === selectedAssignment.rubricId)
                      ?.criteria.find((c) => c.id === score.criterionId);

                    return (
                      <div
                        key={score.criterionId}
                        className="rounded-lg bg-slate-50 p-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {score.criterionName}
                            </p>
                            <p className="text-slate-600 text-sm">
                              {criterion?.description}
                            </p>
                          </div>
                          <span className="font-bold text-indigo-600 text-lg">
                            {score.score}/{score.maxScore}
                          </span>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max={score.maxScore}
                          value={score.score}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const newScore = parseInt(e.target.value);
                            setCurrentRubricScores((prev) =>
                              prev.map((s, i) =>
                                i === idx ? { ...s, score: newScore } : s,
                              ),
                            );
                          }}
                          className="mb-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-300 accent-indigo-600"
                        />

                        <textarea
                          value={score.comments}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>,
                          ) => {
                            const newComments = e.target.value;
                            setCurrentRubricScores((prev) =>
                              prev.map((s, i) =>
                                i === idx ? { ...s, comments: newComments } : s,
                              ),
                            );
                          }}
                          placeholder={`Provide feedback on ${score.criterionName.toLowerCase()}...`}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          rows={2}
                        />

                        {selectedAssignment.aiAssist &&
                          criterion?.aiSuggestions && (
                            <div className="mt-2 rounded-lg bg-indigo-50 p-2">
                              <p className="mb-1 font-medium text-indigo-700 text-xs">
                                AI Suggestions:
                              </p>
                              <ul className="space-y-0.5 text-indigo-600 text-xs">
                                {criterion.aiSuggestions.map(
                                  (suggestion, sIdx) => (
                                    <li
                                      key={sIdx}
                                      className="flex items-start gap-1"
                                    >
                                      <Lightbulb className="mt-0.5 h-3 w-3 flex-shrink-0" />
                                      {suggestion}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-900">
                  Overall Comments
                </label>
                <textarea
                  value={newReview.overallComments || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewReview((prev) => ({
                      ...prev,
                      overallComments: e.target.value,
                    }))
                  }
                  placeholder="Provide your overall assessment of the submission..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block font-semibold text-slate-900">
                    Key Strengths
                  </label>
                  <div className="space-y-2">
                    {(newReview.strengths || []).map((strength, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={strength}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const newStrengths = [
                              ...(newReview.strengths || []),
                            ];
                            newStrengths[idx] = e.target.value;
                            setNewReview((prev) => ({
                              ...prev,
                              strengths: newStrengths,
                            }));
                          }}
                          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder={`Strength ${idx + 1}`}
                        />
                        <button
                          onClick={() => {
                            const newStrengths = (
                              newReview.strengths || []
                            ).filter((_, i) => i !== idx);
                            setNewReview((prev) => ({
                              ...prev,
                              strengths: newStrengths,
                            }));
                          }}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setNewReview((prev) => ({
                          ...prev,
                          strengths: [...(prev.strengths || []), ""],
                        }))
                      }
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-indigo-600 text-sm hover:bg-indigo-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                      Add Strength
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-slate-900">
                    Areas for Improvement
                  </label>
                  <div className="space-y-2">
                    {(newReview.improvements || []).map((improvement, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={improvement}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const newImprovements = [
                              ...(newReview.improvements || []),
                            ];
                            newImprovements[idx] = e.target.value;
                            setNewReview((prev) => ({
                              ...prev,
                              improvements: newImprovements,
                            }));
                          }}
                          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder={`Improvement ${idx + 1}`}
                        />
                        <button
                          onClick={() => {
                            const newImprovements = (
                              newReview.improvements || []
                            ).filter((_, i) => i !== idx);
                            setNewReview((prev) => ({
                              ...prev,
                              improvements: newImprovements,
                            }));
                          }}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setNewReview((prev) => ({
                          ...prev,
                          improvements: [...(prev.improvements || []), ""],
                        }))
                      }
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-indigo-600 text-sm hover:bg-indigo-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                      Add Improvement
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={newReview.isAnonymous}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewReview((prev) => ({
                      ...prev,
                      isAnonymous: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="anonymous"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <EyeOff className="h-4 w-4 text-slate-600" />
                  <span className="text-slate-700">
                    Submit anonymously (
                    {getReviewModeLabel(selectedAssignment.reviewMode)} mode)
                  </span>
                </label>
              </div>

              <div className="flex gap-3 border-slate-200 border-t pt-4">
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmittingReview ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Analyzing & Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Submit Review
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedSubmission(null);
                    setNewReview({
                      isAnonymous: true,
                      rubricScores: [],
                      strengths: [],
                      improvements: [],
                    });
                  }}
                  className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {isCreatingAssignment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsCreatingAssignment(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b bg-gradient-to-r from-indigo-50 to-white p-6">
              <h3 className="font-bold text-indigo-900 text-xl">
                Create New Assignment
              </h3>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  value={newAssignment.title || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewAssignment((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="e.g., Climate Change Impact Analysis"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700 text-sm">
                  Description
                </label>
                <textarea
                  value={newAssignment.description || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewAssignment((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe the assignment and what students should submit..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={newAssignment.subject || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewAssignment((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="e.g., Environmental Science"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Rubric
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={newAssignment.rubricId || ""}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setNewAssignment((prev) => ({
                          ...prev,
                          rubricId: e.target.value,
                        }))
                      }
                      className="flex-1 rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select a rubric...</option>
                      {rubrics.map((rubric) => (
                        <option key={rubric.id} value={rubric.id}>
                          {rubric.name} {rubric.aiGenerated && "(AI-Generated)"}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleGenerateRubric("new")}
                      disabled={isGeneratingRubric}
                      className="rounded-lg bg-purple-100 px-3 py-2 text-purple-700 transition-colors hover:bg-purple-200 disabled:opacity-50"
                    >
                      {isGeneratingRubric ? (
                        <RefreshCw className="h-5 w-5 animate-spin" />
                      ) : (
                        <Sparkles className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Submission Due Date
                  </label>
                  <input
                    type="datetime-local"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewAssignment((prev) => ({
                        ...prev,
                        dueDate: new Date(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Reviews Due Date
                  </label>
                  <input
                    type="datetime-local"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewAssignment((prev) => ({
                        ...prev,
                        reviewDueDate: new Date(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Min Reviews per Submission
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newAssignment.minReviewsPerSubmission || 2}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewAssignment((prev) => ({
                        ...prev,
                        minReviewsPerSubmission: parseInt(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">
                    Max Reviews per Submission
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newAssignment.maxReviewsPerSubmission || 3}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewAssignment((prev) => ({
                        ...prev,
                        maxReviewsPerSubmission: parseInt(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-medium text-slate-700 text-sm">
                  Review Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "anonymous", label: "Anonymous", icon: EyeOff },
                    { id: "identified", label: "Identified", icon: Eye },
                    {
                      id: "double-blind",
                      label: "Double-Blind",
                      icon: Fingerprint,
                    },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() =>
                        setNewAssignment((prev) => ({
                          ...prev,
                          reviewMode: mode.id as ReviewMode,
                        }))
                      }
                      className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                        newAssignment.reviewMode === mode.id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 hover:border-indigo-300"
                      }`}
                    >
                      <mode.icon
                        className={`h-6 w-6 ${
                          newAssignment.reviewMode === mode.id
                            ? "text-indigo-600"
                            : "text-slate-400"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          newAssignment.reviewMode === mode.id
                            ? "text-indigo-900"
                            : "text-slate-700"
                        }`}
                      >
                        {mode.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-slate-900">AI Assistance</p>
                    <p className="text-slate-600 text-sm">
                      Enable AI suggestions and quality checks
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={newAssignment.aiAssist}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewAssignment((prev) => ({
                        ...prev,
                        aiAssist: e.target.checked,
                      }))
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                </label>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="font-medium text-slate-900">
                      Auto-Assign Reviewers
                    </p>
                    <p className="text-slate-600 text-sm">
                      Automatically match reviewers using AI algorithm
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={newAssignment.autoAssign}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewAssignment((prev) => ({
                        ...prev,
                        autoAssign: e.target.checked,
                      }))
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                </label>
              </div>
            </div>
            <div className="flex gap-3 border-slate-200 border-t p-6">
              <button
                onClick={handleCreateAssignment}
                disabled={!newAssignment.title || !newAssignment.subject}
                className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
              >
                Create Assignment
              </button>
              <button
                onClick={() => setIsCreatingAssignment(false)}
                className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default AIPeerReview;
