import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  CheckCircle,
  ChevronRight,
  Clock,
  Compass,
  FileText,
  GitBranch,
  Hexagon,
  Layers,
  Link2,
  Lock,
  Medal,
  Network,
  Puzzle,
  Radar,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Unlock,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

// Types
interface Competency {
  id: string;
  name: string;
  description: string;
  category: string;
  level: "novice" | "developing" | "proficient" | "advanced" | "expert";
  progress: number;
  requiredLevel: "proficient";
  evidence: Evidence[];
  prerequisites: string[];
  nextCompetencies: string[];
  skills: Skill[];
  rubric: RubricLevel[];
  badge?: Badge;
}

interface Skill {
  id: string;
  name: string;
  description: string;
  masteryLevel: number;
  maxMastery: number;
  completed: boolean;
  completedAt?: string;
}

interface RubricLevel {
  level: "novice" | "developing" | "proficient" | "advanced" | "expert";
  description: string;
  criteria: string[];
  examples: string[];
}

interface Evidence {
  id: string;
  type: "assignment" | "project" | "assessment" | "portfolio" | "peer_review";
  title: string;
  description: string;
  date: string;
  score: number;
  maxScore: number;
  artifacts: string[];
  evaluator: string;
  verified: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  unlocked: boolean;
  unlockedAt?: string;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  targetCompetencies: string[];
  estimatedHours: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  personalized: boolean;
  aiRecommended: boolean;
  progress: number;
  completed: boolean;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  requiredCompetencies: string[];
  completed: boolean;
  completedAt?: string;
  reward: string;
}

interface GapAnalysis {
  competencyId: string;
  competencyName: string;
  currentLevel: string;
  targetLevel: string;
  gap: number;
  priority: "high" | "medium" | "low";
  recommendedActions: string[];
  estimatedTime: number;
}

interface MicroCredential {
  id: string;
  name: string;
  description: string;
  issuer: string;
  competencies: string[];
  issuedAt?: string;
  expiresAt?: string;
  verified: boolean;
  blockchainHash?: string;
  imageUrl?: string;
}

interface StudentCompetencyProfile {
  id: string;
  name: string;
  grade: string;
  totalCompetencies: number;
  masteredCompetencies: number;
  totalSkills: number;
  masteredSkills: number;
  averageMastery: number;
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading";
  strengths: string[];
  areasForGrowth: string[];
  careerInterests: string[];
}

// Default Data
const defaultProfile: StudentCompetencyProfile = {
  id: "STU001",
  name: "Emma Johnson",
  grade: "11",
  totalCompetencies: 24,
  masteredCompetencies: 16,
  totalSkills: 156,
  masteredSkills: 112,
  averageMastery: 78,
  learningStyle: "visual",
  strengths: ["Critical Thinking", "Problem Solving", "Collaboration"],
  areasForGrowth: ["Public Speaking", "Time Management"],
  careerInterests: ["Software Engineering", "Data Science", "UX Design"],
};

const defaultCompetencies: Competency[] = [
  {
    id: "comp-1",
    name: "Algebraic Reasoning",
    description:
      "Apply algebraic concepts to solve complex mathematical problems",
    category: "Mathematics",
    level: "advanced",
    progress: 85,
    requiredLevel: "proficient",
    prerequisites: [],
    nextCompetencies: ["comp-2", "comp-3"],
    skills: [
      {
        id: "skill-1",
        name: "Linear Equations",
        description: "Solve linear equations with one variable",
        masteryLevel: 100,
        maxMastery: 100,
        completed: true,
        completedAt: "2024-02-15",
      },
      {
        id: "skill-2",
        name: "Quadratic Functions",
        description: "Analyze and graph quadratic functions",
        masteryLevel: 90,
        maxMastery: 100,
        completed: true,
        completedAt: "2024-03-01",
      },
      {
        id: "skill-3",
        name: "Systems of Equations",
        description: "Solve systems of linear and nonlinear equations",
        masteryLevel: 75,
        maxMastery: 100,
        completed: false,
      },
    ],
    rubric: [
      {
        level: "novice",
        description: "Can solve basic linear equations with guidance",
        criteria: ["Identifies variables", "Follows step-by-step procedures"],
        examples: ["Solving 2x + 3 = 7"],
      },
      {
        level: "developing",
        description:
          "Solves linear equations and simple quadratics independently",
        criteria: ["Checks solutions", "Shows work clearly"],
        examples: ["Factoring simple quadratics"],
      },
      {
        level: "proficient",
        description: "Applies multiple strategies to solve complex equations",
        criteria: ["Chooses appropriate methods", "Explains reasoning"],
        examples: ["Solving systems with 3 variables"],
      },
      {
        level: "advanced",
        description:
          "Solves complex systems and applies to real-world problems",
        criteria: ["Creates mathematical models", "Justifies solutions"],
        examples: ["Optimization problems"],
      },
      {
        level: "expert",
        description: "Innovates new approaches and teaches others",
        criteria: ["Develops novel solutions", "Mentors peers"],
        examples: ["Creating tutorials", "Research projects"],
      },
    ],
    evidence: [
      {
        id: "ev-1",
        type: "assessment",
        title: "Algebra Unit Test",
        description: "Comprehensive test covering all algebraic concepts",
        date: "2024-03-15",
        score: 88,
        maxScore: 100,
        artifacts: ["/assessments/algebra-test.pdf"],
        evaluator: "Ms. Johnson",
        verified: true,
      },
      {
        id: "ev-2",
        type: "project",
        title: "Real-World Algebra Project",
        description: "Applied algebra to model population growth",
        date: "2024-03-20",
        score: 92,
        maxScore: 100,
        artifacts: ["/projects/population-model.pdf"],
        evaluator: "Ms. Johnson",
        verified: true,
      },
    ],
    badge: {
      id: "badge-1",
      name: "Algebra Master",
      description: "Demonstrated mastery of algebraic concepts",
      icon: "calculator",
      color: "#6366f1",
      tier: "gold",
      unlocked: true,
      unlockedAt: "2024-03-15",
    },
  },
  {
    id: "comp-2",
    name: "Calculus Foundations",
    description: "Understand limits, derivatives, and basic integration",
    category: "Mathematics",
    level: "developing",
    progress: 45,
    requiredLevel: "proficient",
    prerequisites: ["comp-1"],
    nextCompetencies: ["comp-4"],
    skills: [
      {
        id: "skill-4",
        name: "Limits",
        description:
          "Evaluate limits numerically, graphically, and algebraically",
        masteryLevel: 70,
        maxMastery: 100,
        completed: false,
      },
      {
        id: "skill-5",
        name: "Derivatives",
        description: "Calculate derivatives using various rules",
        masteryLevel: 30,
        maxMastery: 100,
        completed: false,
      },
    ],
    rubric: [
      {
        level: "novice",
        description: "Understands the concept of a limit",
        criteria: ["Can evaluate simple limits"],
        examples: ["Direct substitution"],
      },
      {
        level: "developing",
        description: "Calculates derivatives of basic functions",
        criteria: ["Applies power rule", "Understands notation"],
        examples: ["Finding slopes of curves"],
      },
      {
        level: "proficient",
        description: "Uses derivatives to solve optimization problems",
        criteria: ["Chain rule", "Product/quotient rules"],
        examples: ["Maximization problems"],
      },
      {
        level: "advanced",
        description: "Applies calculus to physics and economics",
        criteria: ["Related rates", "Implicit differentiation"],
        examples: ["Motion problems"],
      },
      {
        level: "expert",
        description: "Develops proofs and novel applications",
        criteria: ["Rigorous proofs", "Research applications"],
        examples: ["Epsilon-delta proofs"],
      },
    ],
    evidence: [],
  },
  {
    id: "comp-3",
    name: "Scientific Inquiry",
    description: "Design and conduct scientific investigations",
    category: "Science",
    level: "proficient",
    progress: 72,
    requiredLevel: "proficient",
    prerequisites: [],
    nextCompetencies: ["comp-5"],
    skills: [
      {
        id: "skill-6",
        name: "Hypothesis Formation",
        description: "Develop testable hypotheses",
        masteryLevel: 100,
        maxMastery: 100,
        completed: true,
        completedAt: "2024-02-20",
      },
      {
        id: "skill-7",
        name: "Experimental Design",
        description: "Design controlled experiments",
        masteryLevel: 85,
        maxMastery: 100,
        completed: true,
        completedAt: "2024-03-05",
      },
      {
        id: "skill-8",
        name: "Data Analysis",
        description: "Analyze and interpret experimental data",
        masteryLevel: 60,
        maxMastery: 100,
        completed: false,
      },
    ],
    rubric: [
      {
        level: "novice",
        description: "Follows provided experimental procedures",
        criteria: ["Gathers data", "Records observations"],
        examples: ["Simple lab activities"],
      },
      {
        level: "developing",
        description: "Modifies procedures and identifies variables",
        criteria: ["Independent/dependent variables", "Controls"],
        examples: ["Designing fair tests"],
      },
      {
        level: "proficient",
        description: "Designs original investigations",
        criteria: ["Multiple trials", "Error analysis"],
        examples: ["Research projects"],
      },
      {
        level: "advanced",
        description: "Evaluates experimental limitations",
        criteria: ["Statistical analysis", "Peer review"],
        examples: ["Published research"],
      },
      {
        level: "expert",
        description: "Innovates methodology and mentors others",
        criteria: ["Novel techniques", "Scientific publications"],
        examples: ["Research mentorship"],
      },
    ],
    evidence: [
      {
        id: "ev-3",
        type: "project",
        title: "Photosynthesis Investigation",
        description: "Designed and conducted experiment on light effects",
        date: "2024-03-10",
        score: 85,
        maxScore: 100,
        artifacts: ["/projects/photosynthesis-lab.pdf"],
        evaluator: "Dr. Chen",
        verified: true,
      },
    ],
  },
  {
    id: "comp-4",
    name: "Advanced Programming",
    description: "Develop complex software applications with best practices",
    category: "Computer Science",
    level: "proficient",
    progress: 68,
    requiredLevel: "proficient",
    prerequisites: ["comp-2"],
    nextCompetencies: [],
    skills: [
      {
        id: "skill-9",
        name: "Data Structures",
        description: "Implement and use arrays, lists, trees, and graphs",
        masteryLevel: 80,
        maxMastery: 100,
        completed: false,
      },
      {
        id: "skill-10",
        name: "Algorithms",
        description: "Design and analyze efficient algorithms",
        masteryLevel: 65,
        maxMastery: 100,
        completed: false,
      },
      {
        id: "skill-11",
        name: "Software Design",
        description: "Apply OOP principles and design patterns",
        masteryLevel: 70,
        maxMastery: 100,
        completed: false,
      },
    ],
    rubric: [
      {
        level: "novice",
        description: "Writes simple programs with guidance",
        criteria: ["Basic syntax", "Sequential logic"],
        examples: ["Hello world programs"],
      },
      {
        level: "developing",
        description: "Creates functions and handles errors",
        criteria: ["Modular code", "Debugging skills"],
        examples: ["Calculator programs"],
      },
      {
        level: "proficient",
        description: "Builds complex applications with documentation",
        criteria: ["OOP principles", "Version control"],
        examples: ["Web applications"],
      },
      {
        level: "advanced",
        description: "Optimizes performance and ensures security",
        criteria: ["Complexity analysis", "Security practices"],
        examples: ["Database systems"],
      },
      {
        level: "expert",
        description: "Architects enterprise systems",
        criteria: ["System design", "Team leadership"],
        examples: ["Open source contributions"],
      },
    ],
    evidence: [
      {
        id: "ev-4",
        type: "project",
        title: "E-Commerce Platform",
        description: "Full-stack web application with React and Node.js",
        date: "2024-03-25",
        score: 88,
        maxScore: 100,
        artifacts: ["/projects/ecommerce-demo.mp4"],
        evaluator: "Mr. Williams",
        verified: true,
      },
    ],
  },
  {
    id: "comp-5",
    name: "Research & Synthesis",
    description:
      "Conduct research and synthesize information from multiple sources",
    category: "English",
    level: "advanced",
    progress: 82,
    requiredLevel: "proficient",
    prerequisites: ["comp-3"],
    nextCompetencies: [],
    skills: [
      {
        id: "skill-12",
        name: "Source Evaluation",
        description: "Assess credibility and relevance of sources",
        masteryLevel: 90,
        maxMastery: 100,
        completed: true,
        completedAt: "2024-02-28",
      },
      {
        id: "skill-13",
        name: "Citation",
        description: "Use proper citation formats (APA, MLA, Chicago)",
        masteryLevel: 85,
        maxMastery: 100,
        completed: true,
        completedAt: "2024-03-08",
      },
      {
        id: "skill-14",
        name: "Argument Synthesis",
        description: "Combine multiple perspectives into coherent arguments",
        masteryLevel: 75,
        maxMastery: 100,
        completed: false,
      },
    ],
    rubric: [
      {
        level: "novice",
        description: "Uses sources with significant guidance",
        criteria: ["Basic citations", "Quotes sources"],
        examples: ["Simple research papers"],
      },
      {
        level: "developing",
        description: "Paraphrases and summarizes sources",
        criteria: ["Avoids plagiarism", "Basic synthesis"],
        examples: ["Literature reviews"],
      },
      {
        level: "proficient",
        description: "Evaluates sources and constructs arguments",
        criteria: ["Critical evaluation", "Thesis development"],
        examples: ["Argumentative essays"],
      },
      {
        level: "advanced",
        description: "Synthesizes complex interdisciplinary research",
        criteria: ["Multiple perspectives", "Original insights"],
        examples: ["Research publications"],
      },
      {
        level: "expert",
        description: "Publishes peer-reviewed work",
        criteria: ["Original research", "Expert peer review"],
        examples: ["Journal articles"],
      },
    ],
    evidence: [
      {
        id: "ev-5",
        type: "portfolio",
        title: "Climate Change Research Paper",
        description:
          "Interdisciplinary research synthesizing science and policy",
        date: "2024-03-22",
        score: 90,
        maxScore: 100,
        artifacts: ["/portfolio/climate-paper.pdf"],
        evaluator: "Ms. Rodriguez",
        verified: true,
      },
    ],
  },
];

const defaultLearningPaths: LearningPath[] = [
  {
    id: "path-1",
    name: "STEM Excellence Pathway",
    description:
      "Comprehensive journey through advanced mathematics and sciences",
    targetCompetencies: ["comp-1", "comp-2", "comp-3", "comp-4"],
    estimatedHours: 240,
    difficulty: "advanced",
    personalized: true,
    aiRecommended: true,
    progress: 65,
    completed: false,
    milestones: [
      {
        id: "m-1",
        title: "Algebra Mastery",
        description: "Complete all algebraic competencies",
        requiredCompetencies: ["comp-1"],
        completed: true,
        completedAt: "2024-03-15",
        reward: "Algebra Master Badge",
      },
      {
        id: "m-2",
        title: "Scientific Method Expert",
        description: "Demonstrate proficiency in scientific inquiry",
        requiredCompetencies: ["comp-3"],
        completed: true,
        completedAt: "2024-03-20",
        reward: "Research Certificate",
      },
      {
        id: "m-3",
        title: "Calculus Ready",
        description: "Prepare for advanced calculus studies",
        requiredCompetencies: ["comp-1", "comp-2"],
        completed: false,
        reward: "Calculus Prep Badge",
      },
    ],
  },
  {
    id: "path-2",
    name: "Research & Communication Track",
    description: "Develop advanced research and communication skills",
    targetCompetencies: ["comp-5"],
    estimatedHours: 80,
    difficulty: "intermediate",
    personalized: true,
    aiRecommended: false,
    progress: 82,
    completed: false,
    milestones: [
      {
        id: "m-4",
        title: "Research Fundamentals",
        description: "Master basic research skills",
        requiredCompetencies: ["comp-5"],
        completed: true,
        completedAt: "2024-03-10",
        reward: "Researcher Badge",
      },
    ],
  },
];

const defaultGaps: GapAnalysis[] = [
  {
    competencyId: "comp-2",
    competencyName: "Calculus Foundations",
    currentLevel: "developing",
    targetLevel: "proficient",
    gap: 55,
    priority: "high",
    recommendedActions: [
      "Complete derivative practice modules",
      "Attend after-school calculus workshop",
      "Schedule peer tutoring sessions",
    ],
    estimatedTime: 20,
  },
  {
    competencyId: "comp-4",
    competencyName: "Advanced Programming",
    currentLevel: "proficient",
    targetLevel: "advanced",
    gap: 32,
    priority: "medium",
    recommendedActions: [
      "Complete algorithm challenges on coding platform",
      "Contribute to open-source projects",
      "Build a portfolio project with complex data structures",
    ],
    estimatedTime: 30,
  },
];

const defaultMicroCredentials: MicroCredential[] = [
  {
    id: "mc-1",
    name: "Algebraic Reasoning Specialist",
    description: "Verified mastery of algebraic concepts",
    issuer: "National Mathematics Association",
    competencies: ["comp-1"],
    issuedAt: "2024-03-15",
    expiresAt: "2027-03-15",
    verified: true,
    blockchainHash: "0x8f3a...b2c1",
  },
  {
    id: "mc-2",
    name: "Scientific Researcher",
    description: "Competency in scientific methodology",
    issuer: "STEM Education Consortium",
    competencies: ["comp-3"],
    issuedAt: "2024-03-20",
    verified: true,
    blockchainHash: "0x2d5e...a9f4",
  },
];

// Helper functions
const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    novice: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    developing:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    proficient:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    advanced:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    expert:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };
  return colors[level] || colors.novice;
};

const getTierColor = (tier: string) => {
  const colors: Record<string, string> = {
    bronze: "from-amber-700 to-amber-600",
    silver: "from-gray-400 to-gray-300",
    gold: "from-yellow-400 to-yellow-300",
    platinum: "from-cyan-400 to-cyan-300",
    diamond: "from-violet-500 to-purple-400",
  };
  return colors[tier] || colors.bronze;
};

const getLevelProgress = (level: string) => {
  const progress: Record<string, number> = {
    novice: 20,
    developing: 40,
    proficient: 60,
    advanced: 80,
    expert: 100,
  };
  return progress[level] || 0;
};

interface CompetencyBasedProgressionProps {
  studentId?: string;
  className?: string;
}

export function CompetencyBasedProgression({
  studentId,
  className,
}: CompetencyBasedProgressionProps) {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "skill-tree"
    | "competencies"
    | "gaps"
    | "credentials"
    | "portfolio"
  >("overview");
  const [profile] = useState<StudentCompetencyProfile>(defaultProfile);
  const [competencies] = useState<Competency[]>(defaultCompetencies);
  const [learningPaths] = useState<LearningPath[]>(defaultLearningPaths);
  const [gaps] = useState<GapAnalysis[]>(defaultGaps);
  const [microCredentials] = useState<MicroCredential[]>(
    defaultMicroCredentials,
  );
  const [selectedCompetency, setSelectedCompetency] =
    useState<Competency | null>(null);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [showRubricModal, setShowRubricModal] = useState(false);

  const masteredCount = competencies.filter(
    (c) => c.level === "advanced" || c.level === "expert",
  ).length;
  const inProgressCount = competencies.filter(
    (c) => c.level === "developing" || c.level === "proficient",
  ).length;
  const totalSkillsMastered = competencies.reduce(
    (sum, c) => sum + c.skills.filter((s) => s.completed).length,
    0,
  );

  const categoryGroups = useMemo(() => {
    const groups: Record<string, Competency[]> = {};
    competencies.forEach((c) => {
      if (!groups[c.category]) groups[c.category] = [];
      groups[c.category].push(c);
    });
    return groups;
  }, [competencies]);

  const renderSkillTree = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 text-lg dark:text-white">
            <GitBranch className="h-5 w-5 text-violet-500" />
            Competency Skill Tree
          </h3>
          <p className="mb-6 text-gray-600 text-sm dark:text-gray-400">
            Visualize how competencies connect and unlock new learning
            opportunities
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {competencies.map((comp, index) => {
              const isUnlocked =
                comp.prerequisites.length === 0 ||
                comp.prerequisites.every((pre) => {
                  const preComp = competencies.find((c) => c.id === pre);
                  return (
                    preComp &&
                    (preComp.level === "proficient" ||
                      preComp.level === "advanced" ||
                      preComp.level === "expert")
                  );
                });

              return (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    isUnlocked
                      ? "border-violet-200 bg-white hover:shadow-lg dark:border-violet-800 dark:bg-gray-800"
                      : "border-gray-200 bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-800/50"
                  }`}
                  onClick={() => setSelectedCompetency(comp)}
                >
                  {/* Connection lines */}
                  {comp.prerequisites.length > 0 && (
                    <div className="-top-4 absolute left-1/2 h-4 w-0.5 bg-gray-300 dark:bg-gray-600" />
                  )}

                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        isUnlocked
                          ? getLevelColor(comp.level)
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      {isUnlocked ? (
                        <Target className="h-5 w-5" />
                      ) : (
                        <Lock className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm dark:text-white">
                        {comp.name}
                      </h4>
                      <p className="mt-1 text-gray-500 text-xs dark:text-gray-400">
                        {comp.category}
                      </p>
                      <div className="mt-2">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-gray-500">{comp.level}</span>
                          <span className="font-medium">{comp.progress}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${comp.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className={`h-full rounded-full ${
                              comp.level === "expert"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                : comp.level === "advanced"
                                  ? "bg-gradient-to-r from-purple-500 to-violet-500"
                                  : comp.level === "proficient"
                                    ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                    : "bg-gradient-to-r from-yellow-500 to-orange-500"
                            }`}
                          />
                        </div>
                      </div>
                      {comp.badge?.unlocked && (
                        <div className="mt-2 flex items-center gap-1">
                          <Award className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-yellow-600 dark:text-yellow-400">
                            {comp.badge.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prerequisites indicator */}
                  {comp.prerequisites.length > 0 && (
                    <div className="mt-3 border-gray-100 border-t pt-3 dark:border-gray-700">
                      <p className="text-gray-500 text-xs">
                        Requires:{" "}
                        {comp.prerequisites
                          .map(
                            (pre) =>
                              competencies.find((c) => c.id === pre)?.name,
                          )
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  {/* Next unlocks */}
                  {comp.nextCompetencies.length > 0 && comp.progress >= 80 && (
                    <div className="mt-2 flex items-center gap-1 text-violet-600 text-xs">
                      <Unlock className="h-3 w-3" />
                      <span>
                        Unlocks {comp.nextCompetencies.length} new competencies
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          {["novice", "developing", "proficient", "advanced", "expert"].map(
            (level) => (
              <div key={level} className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${getLevelColor(level).split(" ")[0]}`}
                />
                <span className="text-gray-600 capitalize dark:text-gray-400">
                  {level}
                </span>
              </div>
            ),
          )}
        </div>
      </motion.div>
    );
  };

  const renderCompetencyDetail = (comp: Competency) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={() => setSelectedCompetency(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white dark:bg-gray-800"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 border-gray-200 border-b bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 font-medium text-xs ${getLevelColor(comp.level)}`}
                  >
                    {comp.level}
                  </span>
                  <span className="text-gray-500 text-sm">{comp.category}</span>
                </div>
                <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
                  {comp.name}
                </h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  {comp.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedCompetency(null)}
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Progress */}
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-sm">Overall Progress</span>
                <span className="font-bold text-lg text-violet-600">
                  {comp.progress}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${comp.progress}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8 p-6">
            {/* Skills */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 text-lg dark:text-white">
                <Puzzle className="h-5 w-5 text-violet-500" />
                Skills & Mastery
              </h3>
              <div className="space-y-3">
                {comp.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className={`rounded-xl border p-4 ${
                      skill.completed
                        ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                        : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {skill.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {skill.name}
                          </h4>
                          <p className="text-gray-500 text-sm dark:text-gray-400">
                            {skill.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-sm">
                          {skill.masteryLevel}/{skill.maxMastery}
                        </span>
                        {skill.completedAt && (
                          <p className="text-gray-500 text-xs">
                            {skill.completedAt}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`h-full rounded-full ${
                          skill.completed ? "bg-green-500" : "bg-violet-500"
                        }`}
                        style={{
                          width: `${(skill.masteryLevel / skill.maxMastery) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rubric */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 text-lg dark:text-white">
                  <FileText className="h-5 w-5 text-violet-500" />
                  Competency Rubric
                </h3>
                <button
                  onClick={() => setShowRubricModal(!showRubricModal)}
                  className="text-sm text-violet-600 hover:underline"
                >
                  {showRubricModal ? "Collapse" : "Expand All"}
                </button>
              </div>
              <div className="space-y-2">
                {comp.rubric.map((level, index) => (
                  <motion.div
                    key={level.level}
                    initial={false}
                    animate={{ height: showRubricModal ? "auto" : "60px" }}
                    className={`rounded-xl border p-4 ${
                      comp.level === level.level
                        ? "border-violet-300 bg-violet-50 dark:border-violet-700 dark:bg-violet-900/20"
                        : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <span
                        className={`rounded-full px-2 py-1 font-medium text-xs ${getLevelColor(level.level)}`}
                      >
                        {level.level}
                      </span>
                      {comp.level === level.level && (
                        <span className="font-medium text-violet-600 text-xs">
                          Current Level
                        </span>
                      )}
                    </div>
                    <p className="mb-2 text-gray-700 text-sm dark:text-gray-300">
                      {level.description}
                    </p>
                    {showRubricModal && (
                      <div className="mt-3 space-y-2 border-gray-200 border-t pt-3 dark:border-gray-700">
                        <div>
                          <p className="mb-1 font-medium text-gray-500 text-xs uppercase tracking-wide">
                            Criteria
                          </p>
                          <ul className="list-inside list-disc text-gray-600 text-sm dark:text-gray-400">
                            {level.criteria.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="mb-1 font-medium text-gray-500 text-xs uppercase tracking-wide">
                            Examples
                          </p>
                          <ul className="list-inside list-disc text-gray-600 text-sm dark:text-gray-400">
                            {level.examples.map((e, i) => (
                              <li key={i}>{e}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Evidence */}
            {comp.evidence.length > 0 && (
              <div>
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 text-lg dark:text-white">
                  <Briefcase className="h-5 w-5 text-violet-500" />
                  Evidence of Learning
                </h3>
                <div className="space-y-3">
                  {comp.evidence.map((ev) => (
                    <div
                      key={ev.id}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                            {ev.type === "assessment" ? (
                              <FileText className="h-5 w-5 text-violet-600" />
                            ) : ev.type === "project" ? (
                              <Briefcase className="h-5 w-5 text-violet-600" />
                            ) : (
                              <BookOpen className="h-5 w-5 text-violet-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {ev.title}
                            </h4>
                            <p className="text-gray-500 text-sm">
                              {ev.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-lg text-violet-600">
                            {ev.score}/{ev.maxScore}
                          </span>
                          <p className="text-gray-500 text-xs">
                            {ev.evaluator}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-gray-500 text-sm">
                        <span>{ev.date}</span>
                        {ev.verified && (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            Verified
                          </span>
                        )}
                        <span className="capitalize">
                          {ev.type.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const renderGapAnalysis = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 dark:border-amber-800 dark:from-amber-900/20 dark:to-orange-900/20">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-900 text-lg dark:text-white">
            <Radar className="h-5 w-5 text-amber-600" />
            Gap Analysis Dashboard
          </h3>
          <p className="text-gray-600 text-sm dark:text-gray-400">
            Identify skill gaps and get personalized recommendations to reach
            your goals
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {gaps.map((gap, index) => (
            <motion.div
              key={gap.competencyId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {gap.competencyName}
                  </h4>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${getLevelColor(gap.currentLevel)}`}
                    >
                      {gap.currentLevel}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${getLevelColor(gap.targetLevel)}`}
                    >
                      {gap.targetLevel}
                    </span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 font-medium text-xs ${
                    gap.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : gap.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {gap.priority} priority
                </span>
              </div>

              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Gap to close
                  </span>
                  <span className="font-medium">{gap.gap}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${gap.gap}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 font-medium text-gray-700 text-sm dark:text-gray-300">
                  Recommended Actions ({gap.estimatedTime} hours estimated)
                </p>
                <ul className="space-y-2">
                  {gap.recommendedActions.map((action, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-gray-600 text-sm dark:text-gray-400"
                    >
                      <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 border-gray-100 border-t pt-4 dark:border-gray-700">
                <button className="w-full rounded-lg bg-violet-100 py-2 font-medium text-sm text-violet-700 transition-colors hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:hover:bg-violet-900/50">
                  Start Learning Path
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skills Radar Chart Placeholder */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 text-lg dark:text-white">
            <Network className="h-5 w-5 text-violet-500" />
            Skills Distribution
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {["Mathematics", "Science", "English", "CS", "Arts"].map(
              (subject) => {
                const score =
                  subject === "Mathematics"
                    ? 85
                    : subject === "Science"
                      ? 78
                      : subject === "English"
                        ? 82
                        : subject === "CS"
                          ? 70
                          : 75;
                return (
                  <div key={subject} className="text-center">
                    <div className="relative mx-auto mb-2 h-24 w-24">
                      <svg className="-rotate-90 h-full w-full transform">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeLinecap="round"
                          className="text-violet-500"
                          strokeDasharray={`${score * 2.51} 251`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-bold text-gray-900 text-xl dark:text-white">
                          {score}%
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm dark:text-gray-400">
                      {subject}
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderMicroCredentials = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-900 text-lg dark:text-white">
                <Shield className="h-5 w-5 text-blue-600" />
                Micro-Credentials & Digital Badges
              </h3>
              <p className="text-gray-600 text-sm dark:text-gray-400">
                Blockchain-verified credentials showcasing your competencies
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-3xl text-blue-600">
                {microCredentials.length}
              </p>
              <p className="text-gray-600 text-sm">Credentials Earned</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {microCredentials.map((cred, index) => (
            <motion.div
              key={cred.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Certificate Header */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                    <Medal className="h-6 w-6" />
                  </div>
                  {cred.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-1 text-xs">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-xl">{cred.name}</h4>
                <p className="mt-1 text-blue-100 text-sm">{cred.issuer}</p>
              </div>

              {/* Certificate Body */}
              <div className="p-6">
                <p className="mb-4 text-gray-600 text-sm dark:text-gray-400">
                  {cred.description}
                </p>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Issued</span>
                    <span className="text-gray-900 dark:text-white">
                      {cred.issuedAt}
                    </span>
                  </div>
                  {cred.expiresAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Expires</span>
                      <span className="text-gray-900 dark:text-white">
                        {cred.expiresAt}
                      </span>
                    </div>
                  )}
                </div>

                {/* Blockchain verification */}
                {cred.blockchainHash && (
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    <div className="mb-1 flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500 text-xs">
                        Blockchain Hash
                      </span>
                    </div>
                    <p className="truncate font-mono text-gray-600 text-xs dark:text-gray-400">
                      {cred.blockchainHash}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded-lg bg-blue-100 py-2 font-medium text-blue-700 text-sm transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                    View Credential
                  </button>
                  <button className="flex-1 rounded-lg border border-gray-300 py-2 text-gray-700 text-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Available Credentials */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 font-semibold text-gray-900 text-lg dark:text-white">
            Available to Earn
          </h3>
          <div className="space-y-3">
            {[
              {
                name: "Calculus Mastery",
                progress: 45,
                requirements: "Complete Calculus Foundations competency",
              },
              {
                name: "Full-Stack Developer",
                progress: 68,
                requirements:
                  "Complete Advanced Programming with portfolio project",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-600">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </h4>
                    <p className="text-gray-500 text-xs">{item.requirements}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-medium text-sm text-violet-600">
                    {item.progress}%
                  </span>
                  <div className="mt-1 h-1.5 w-24 rounded-full bg-gray-200 dark:bg-gray-600">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderLearningPaths = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 text-lg dark:text-white">
            <Compass className="h-5 w-5 text-violet-500" />
            Personalized Learning Paths
          </h3>
          <button className="rounded-lg bg-violet-100 px-4 py-2 font-medium text-sm text-violet-700 transition-colors hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:hover:bg-violet-900/50">
            Create Custom Path
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {learningPaths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Path Header */}
              <div className="border-gray-100 border-b p-6 dark:border-gray-700">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {path.aiRecommended && (
                      <span className="flex items-center gap-1 rounded-full bg-violet-100 px-2 py-1 text-violet-700 text-xs dark:bg-violet-900/30 dark:text-violet-400">
                        <Sparkles className="h-3 w-3" />
                        AI Recommended
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        path.difficulty === "beginner"
                          ? "bg-green-100 text-green-700"
                          : path.difficulty === "intermediate"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {path.difficulty}
                    </span>
                  </div>
                  {path.personalized && (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700 text-xs dark:bg-blue-900/30 dark:text-blue-400">
                      Personalized
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-gray-900 text-xl dark:text-white">
                  {path.name}
                </h4>
                <p className="mt-1 text-gray-600 text-sm dark:text-gray-400">
                  {path.description}
                </p>
              </div>

              {/* Progress */}
              <div className="bg-gray-50 px-6 py-4 dark:bg-gray-700/30">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-600 text-sm dark:text-gray-400">
                    Progress
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {path.progress}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${path.progress}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
                  />
                </div>
                <div className="mt-3 flex items-center gap-4 text-gray-500 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {path.estimatedHours} hours
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {path.targetCompetencies.length} competencies
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    {path.milestones.filter((m) => m.completed).length}/
                    {path.milestones.length} milestones
                  </span>
                </div>
              </div>

              {/* Milestones */}
              <div className="p-6">
                <h5 className="mb-3 font-semibold text-gray-700 text-sm dark:text-gray-300">
                  Milestones
                </h5>
                <div className="space-y-3">
                  {path.milestones.map((milestone, mIndex) => (
                    <div
                      key={milestone.id}
                      className={`flex items-center gap-3 rounded-lg p-3 ${
                        milestone.completed
                          ? "bg-green-50 dark:bg-green-900/20"
                          : "bg-gray-50 dark:bg-gray-700/50"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          milestone.completed
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-500 dark:bg-gray-600"
                        }`}
                      >
                        {milestone.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="font-bold text-xs">
                            {mIndex + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${milestone.completed ? "text-green-700 dark:text-green-400" : "text-gray-900 dark:text-white"}`}
                        >
                          {milestone.title}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {milestone.description}
                        </p>
                      </div>
                      {milestone.completed && milestone.reward && (
                        <span className="flex items-center gap-1 text-green-600 text-xs">
                          <Award className="h-3 w-3" />
                          {milestone.reward}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6">
                <button className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 py-3 font-medium text-white transition-opacity hover:opacity-90">
                  Continue Learning
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
            <Hexagon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
              Competency-Based Progression
            </h2>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              Mastery-based learning with personalized pathways
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-violet-50 px-4 py-2 text-center dark:bg-violet-900/30">
            <div className="font-bold text-2xl text-violet-600 dark:text-violet-400">
              {masteredCount}/{competencies.length}
            </div>
            <div className="text-gray-600 text-xs dark:text-gray-400">
              Competencies
            </div>
          </div>
          <div className="rounded-xl bg-green-50 px-4 py-2 text-center dark:bg-green-900/30">
            <div className="font-bold text-2xl text-green-600 dark:text-green-400">
              {totalSkillsMastered}
            </div>
            <div className="text-gray-600 text-xs dark:text-gray-400">
              Skills Mastered
            </div>
          </div>
          <div className="rounded-xl bg-blue-50 px-4 py-2 text-center dark:bg-blue-900/30">
            <div className="font-bold text-2xl text-blue-600 dark:text-blue-400">
              {profile.averageMastery}%
            </div>
            <div className="text-gray-600 text-xs dark:text-gray-400">
              Avg Mastery
            </div>
          </div>
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 font-bold text-white text-xl">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
                {profile.name}
              </h3>
              <p className="text-gray-500">Grade {profile.grade}</p>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700/50">
              <div className="mb-1 flex items-center justify-center gap-1 text-gray-500 text-sm">
                <Brain className="h-4 w-4" />
                Learning Style
              </div>
              <p className="font-semibold text-gray-900 capitalize dark:text-white">
                {profile.learningStyle}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700/50">
              <div className="mb-1 flex items-center justify-center gap-1 text-gray-500 text-sm">
                <Star className="h-4 w-4" />
                Strengths
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {profile.strengths.length}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700/50">
              <div className="mb-1 flex items-center justify-center gap-1 text-gray-500 text-sm">
                <TrendingUp className="h-4 w-4" />
                Growth Areas
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {profile.areasForGrowth.length}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700/50">
              <div className="mb-1 flex items-center justify-center gap-1 text-gray-500 text-sm">
                <Briefcase className="h-4 w-4" />
                Interests
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {profile.careerInterests.length}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.strengths.map((strength) => (
            <span
              key={strength}
              className="rounded-full bg-green-100 px-3 py-1 text-green-700 text-sm dark:bg-green-900/30 dark:text-green-400"
            >
              {strength}
            </span>
          ))}
          {profile.areasForGrowth.map((area) => (
            <span
              key={area}
              className="rounded-full bg-amber-100 px-3 py-1 text-amber-700 text-sm dark:bg-amber-900/30 dark:text-amber-400"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {[
          { id: "overview", label: "Overview", icon: Target },
          { id: "skill-tree", label: "Skill Tree", icon: GitBranch },
          { id: "competencies", label: "Competencies", icon: Layers },
          { id: "gaps", label: "Gap Analysis", icon: Radar },
          { id: "credentials", label: "Credentials", icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 font-medium text-sm transition-all ${
              activeTab === tab.id
                ? "bg-white text-violet-600 shadow-sm dark:bg-gray-700"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Progress Summary */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                  <BarChart3 className="h-5 w-5 text-violet-500" />
                  Mastery Progress
                </h3>
                <div className="space-y-3">
                  {[
                    "novice",
                    "developing",
                    "proficient",
                    "advanced",
                    "expert",
                  ].map((level) => {
                    const count = competencies.filter(
                      (c) => c.level === level,
                    ).length;
                    const percentage = (count / competencies.length) * 100;
                    return (
                      <div key={level}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-gray-600 capitalize dark:text-gray-400">
                            {level}
                          </span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className={`h-full rounded-full ${getLevelColor(level).split(" ")[0]}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  {competencies
                    .filter((c) => c.badge?.unlocked)
                    .slice(0, 3)
                    .map((comp) => (
                      <div
                        key={comp.id}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                      >
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${comp.badge?.color}20` }}
                        >
                          <Award
                            className="h-5 w-5"
                            style={{ color: comp.badge?.color }}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm dark:text-white">
                            {comp.badge?.name}
                          </p>
                          <p className="text-gray-500 text-xs">{comp.name}</p>
                        </div>
                        <div className="text-gray-400 text-xs">
                          {comp.badge?.unlockedAt}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Learning Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm dark:text-gray-400">
                      Hours this week
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      12.5 hrs
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm dark:text-gray-400">
                      Competencies advanced
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      3
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm dark:text-gray-400">
                      Skills completed
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      8
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm dark:text-gray-400">
                      Evidence submitted
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      5
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Learning Paths Preview */}
            {renderLearningPaths()}
          </motion.div>
        )}

        {activeTab === "skill-tree" && renderSkillTree()}

        {activeTab === "competencies" && (
          <motion.div
            key="competencies"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {Object.entries(categoryGroups).map(([category, comps]) => (
              <div
                key={category}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="border-gray-200 border-b bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/50">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {category}
                  </h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {comps.map((comp) => (
                    <div
                      key={comp.id}
                      onClick={() => setSelectedCompetency(comp)}
                      className="cursor-pointer p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-2 py-1 font-medium text-xs ${getLevelColor(comp.level)}`}
                          >
                            {comp.level}
                          </span>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {comp.name}
                            </h4>
                            <p className="text-gray-500 text-sm">
                              {comp.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-lg text-violet-600">
                            {comp.progress}%
                          </span>
                          <div className="mt-1 h-1.5 w-24 rounded-full bg-gray-200 dark:bg-gray-600">
                            <div
                              className="h-full rounded-full bg-violet-500"
                              style={{ width: `${comp.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-gray-500 text-sm">
                        <span className="flex items-center gap-1">
                          <Puzzle className="h-4 w-4" />
                          {comp.skills.filter((s) => s.completed).length}/
                          {comp.skills.length} skills
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {comp.evidence.length} evidence items
                        </span>
                        {comp.badge?.unlocked && (
                          <span className="flex items-center gap-1 text-yellow-600">
                            <Award className="h-4 w-4" />
                            Badge earned
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === "gaps" && renderGapAnalysis()}

        {activeTab === "credentials" && renderMicroCredentials()}
      </AnimatePresence>

      {/* Competency Detail Modal */}
      <AnimatePresence>
        {selectedCompetency && renderCompetencyDetail(selectedCompetency)}
      </AnimatePresence>
    </div>
  );
}
