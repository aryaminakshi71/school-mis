"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock,
  FileText,
  Filter,
  FlaskConical,
  FolderKanban,
  GitBranch,
  GitMerge,
  Globe,
  GraduationCap,
  Grid3X3,
  Hammer,
  Layers,
  Link,
  MoreHorizontal,
  Network,
  Palette,
  Plus,
  Rocket,
  Scale,
  Search,
  Share2,
  Target,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

// --- Types & Interfaces ---

interface Subject {
  id: string;
  name: string;
  color: string;
  icon: React.ElementType;
  description: string;
}

interface DisciplineNode {
  id: string;
  subjectId: string;
  name: string;
  x: number;
  y: number;
  connections: string[];
  projectCount: number;
  color: string;
}

interface CrossProject {
  id: string;
  title: string;
  description: string;
  subjects: string[];
  disciplines: string[];
  status: "planning" | "active" | "review" | "completed";
  progress: number;
  collaborators: Collaborator[];
  mentors: Mentor[];
  resources: Resource[];
  rubrics: AssessmentRubric[];
  integrationPoints: IntegrationPoint[];
  timeline: TimelineEvent[];
  createdAt: Date;
  dueDate: Date;
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  role: string;
  subjects: string[];
  contributions: number;
}

interface Mentor {
  id: string;
  name: string;
  department: string;
  avatar: string;
  expertise: string[];
  availability: string;
}

interface Resource {
  id: string;
  type: "document" | "dataset" | "tool" | "link" | "template";
  name: string;
  subject: string;
  sharedBy: string;
  accessCount: number;
  lastAccessed: Date;
}

interface AssessmentRubric {
  id: string;
  subject: string;
  criteria: string;
  weight: number;
  levels: {
    excellent: string;
    proficient: string;
    developing: string;
    beginning: string;
  };
}

interface IntegrationPoint {
  id: string;
  fromSubject: string;
  toSubject: string;
  description: string;
  type: "methodology" | "concept" | "skill" | "tool";
  strength: number;
}

interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: "milestone" | "review" | "deadline" | "collaboration";
  completed: boolean;
}

// --- Mock Data ---

const subjects: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    color: "#6366f1",
    icon: Grid3X3,
    description: "Quantitative analysis & modeling",
  },
  {
    id: "science",
    name: "Science",
    color: "#10b981",
    icon: FlaskConical,
    description: "Scientific inquiry & experimentation",
  },
  {
    id: "lit",
    name: "Literature",
    color: "#f59e0b",
    icon: BookOpen,
    description: "Critical analysis & communication",
  },
  {
    id: "arts",
    name: "Arts",
    color: "#ec4899",
    icon: Palette,
    description: "Creative expression & design",
  },
  {
    id: "tech",
    name: "Technology",
    color: "#06b6d4",
    icon: Zap,
    description: "Digital tools & innovation",
  },
  {
    id: "social",
    name: "Social Studies",
    color: "#8b5cf6",
    icon: Globe,
    description: "Societal context & ethics",
  },
];

const disciplineNodes: DisciplineNode[] = [
  {
    id: "n1",
    subjectId: "math",
    name: "Statistics",
    x: 20,
    y: 30,
    connections: ["n5", "n8", "n12"],
    projectCount: 8,
    color: "#6366f1",
  },
  {
    id: "n2",
    subjectId: "math",
    name: "Geometry",
    x: 15,
    y: 50,
    connections: ["n6", "n9"],
    projectCount: 5,
    color: "#6366f1",
  },
  {
    id: "n3",
    subjectId: "science",
    name: "Biology",
    x: 35,
    y: 25,
    connections: ["n5", "n7", "n11"],
    projectCount: 12,
    color: "#10b981",
  },
  {
    id: "n4",
    subjectId: "science",
    name: "Physics",
    x: 40,
    y: 45,
    connections: ["n2", "n6", "n8"],
    projectCount: 9,
    color: "#10b981",
  },
  {
    id: "n5",
    subjectId: "tech",
    name: "Data Science",
    x: 55,
    y: 30,
    connections: ["n1", "n3", "n12"],
    projectCount: 15,
    color: "#06b6d4",
  },
  {
    id: "n6",
    subjectId: "tech",
    name: "Engineering",
    x: 50,
    y: 55,
    connections: ["n2", "n4", "n9"],
    projectCount: 11,
    color: "#06b6d4",
  },
  {
    id: "n7",
    subjectId: "arts",
    name: "Design",
    x: 70,
    y: 20,
    connections: ["n3", "n10"],
    projectCount: 14,
    color: "#ec4899",
  },
  {
    id: "n8",
    subjectId: "arts",
    name: "Digital Media",
    x: 75,
    y: 40,
    connections: ["n1", "n4", "n11"],
    projectCount: 10,
    color: "#ec4899",
  },
  {
    id: "n9",
    subjectId: "lit",
    name: "Technical Writing",
    x: 30,
    y: 70,
    connections: ["n2", "n6"],
    projectCount: 6,
    color: "#f59e0b",
  },
  {
    id: "n10",
    subjectId: "lit",
    name: "Storytelling",
    x: 65,
    y: 65,
    connections: ["n7", "n11"],
    projectCount: 7,
    color: "#f59e0b",
  },
  {
    id: "n11",
    subjectId: "social",
    name: "Ethics",
    x: 50,
    y: 80,
    connections: ["n3", "n8", "n10"],
    projectCount: 8,
    color: "#8b5cf6",
  },
  {
    id: "n12",
    subjectId: "social",
    name: "Economics",
    x: 80,
    y: 55,
    connections: ["n1", "n5"],
    projectCount: 9,
    color: "#8b5cf6",
  },
];

const mockProjects: CrossProject[] = [
  {
    id: "p1",
    title: "Sustainable City Design",
    description:
      "Design a sustainable urban environment integrating environmental science, engineering principles, economic viability, and artistic urban planning.",
    subjects: ["science", "tech", "arts", "social"],
    disciplines: ["Biology", "Engineering", "Design", "Economics"],
    status: "active",
    progress: 65,
    collaborators: [
      {
        id: "c1",
        name: "Alex Chen",
        avatar: "AC",
        role: "Lead Designer",
        subjects: ["arts", "tech"],
        contributions: 23,
      },
      {
        id: "c2",
        name: "Jordan Smith",
        avatar: "JS",
        role: "Environmental Analyst",
        subjects: ["science"],
        contributions: 18,
      },
      {
        id: "c3",
        name: "Maya Patel",
        avatar: "MP",
        role: "Economic Modeler",
        subjects: ["social", "math"],
        contributions: 15,
      },
      {
        id: "c4",
        name: "Ryan Lee",
        avatar: "RL",
        role: "Engineering Consultant",
        subjects: ["tech", "science"],
        contributions: 20,
      },
    ],
    mentors: [
      {
        id: "m1",
        name: "Dr. Sarah Williams",
        department: "Environmental Science",
        avatar: "SW",
        expertise: ["Urban Ecology", "Sustainability"],
        availability: "Mon, Wed 2-4pm",
      },
      {
        id: "m2",
        name: "Prof. James Chen",
        department: "Engineering",
        avatar: "JC",
        expertise: ["Structural Design", "CAD"],
        availability: "Tue, Thu 10am-12pm",
      },
      {
        id: "m3",
        name: "Ms. Olivia Park",
        department: "Economics",
        avatar: "OP",
        expertise: ["Urban Economics", "Cost Analysis"],
        availability: "Fri 1-3pm",
      },
    ],
    resources: [
      {
        id: "r1",
        type: "dataset",
        name: "City Demographics 2024",
        subject: "social",
        sharedBy: "Maya Patel",
        accessCount: 45,
        lastAccessed: new Date(Date.now() - 86400000),
      },
      {
        id: "r2",
        type: "tool",
        name: "AutoCAD Student License",
        subject: "tech",
        sharedBy: "Ryan Lee",
        accessCount: 32,
        lastAccessed: new Date(Date.now() - 172800000),
      },
      {
        id: "r3",
        type: "document",
        name: "Sustainability Guidelines",
        subject: "science",
        sharedBy: "Dr. Williams",
        accessCount: 67,
        lastAccessed: new Date(Date.now() - 43200000),
      },
      {
        id: "r4",
        type: "template",
        name: "Project Proposal Template",
        subject: "lit",
        sharedBy: "Alex Chen",
        accessCount: 28,
        lastAccessed: new Date(Date.now() - 259200000),
      },
    ],
    rubrics: [
      {
        id: "rub1",
        subject: "Science",
        criteria: "Environmental Impact Analysis",
        weight: 25,
        levels: {
          excellent:
            "Comprehensive analysis with quantified carbon footprint reduction",
          proficient: "Thorough analysis with some quantified data",
          developing: "Basic analysis with qualitative assessments",
          beginning: "Minimal environmental consideration",
        },
      },
      {
        id: "rub2",
        subject: "Technology",
        criteria: "Engineering Feasibility",
        weight: 25,
        levels: {
          excellent: "Fully feasible with detailed technical specifications",
          proficient: "Mostly feasible with minor technical gaps",
          developing: "Partially feasible with significant gaps",
          beginning: "Lacks technical feasibility assessment",
        },
      },
      {
        id: "rub3",
        subject: "Arts",
        criteria: "Design Innovation",
        weight: 20,
        levels: {
          excellent: "Highly innovative design with novel solutions",
          proficient: "Creative design with some innovative elements",
          developing: "Standard design with minor creative touches",
          beginning: "Basic design lacking creativity",
        },
      },
      {
        id: "rub4",
        subject: "Social Studies",
        criteria: "Economic Viability",
        weight: 30,
        levels: {
          excellent: "Detailed cost-benefit analysis with ROI projections",
          proficient: "Good economic analysis with cost estimates",
          developing: "Basic cost considerations",
          beginning: "Little to no economic analysis",
        },
      },
    ],
    integrationPoints: [
      {
        id: "ip1",
        fromSubject: "science",
        toSubject: "tech",
        description: "Apply ecological principles to engineering design",
        type: "methodology",
        strength: 0.9,
      },
      {
        id: "ip2",
        fromSubject: "arts",
        toSubject: "tech",
        description: "Use design thinking in CAD modeling",
        type: "skill",
        strength: 0.85,
      },
      {
        id: "ip3",
        fromSubject: "social",
        toSubject: "science",
        description: "Consider economic constraints on environmental goals",
        type: "concept",
        strength: 0.8,
      },
    ],
    timeline: [
      {
        id: "t1",
        date: new Date(Date.now() - 1209600000),
        title: "Project Kickoff",
        description: "Team formation and initial planning",
        type: "milestone",
        completed: true,
      },
      {
        id: "t2",
        date: new Date(Date.now() - 604800000),
        title: "Research Phase Complete",
        description: "All background research finalized",
        type: "milestone",
        completed: true,
      },
      {
        id: "t3",
        date: new Date(Date.now() - 259200000),
        title: "Design Review",
        description: "First iteration of design presented",
        type: "review",
        completed: true,
      },
      {
        id: "t4",
        date: new Date(Date.now() + 604800000),
        title: "Integration Workshop",
        description: "Cross-disciplinary collaboration session",
        type: "collaboration",
        completed: false,
      },
      {
        id: "t5",
        date: new Date(Date.now() + 1209600000),
        title: "Final Presentation",
        description: "Project showcase to stakeholders",
        type: "deadline",
        completed: false,
      },
    ],
    createdAt: new Date(Date.now() - 1814400000),
    dueDate: new Date(Date.now() + 1209600000),
  },
  {
    id: "p2",
    title: "AI Ethics in Healthcare",
    description:
      "Investigate the ethical implications of AI implementation in medical diagnosis, considering technical capabilities, societal impacts, and philosophical frameworks.",
    subjects: ["tech", "social", "lit", "science"],
    disciplines: ["Data Science", "Ethics", "Technical Writing", "Biology"],
    status: "planning",
    progress: 25,
    collaborators: [
      {
        id: "c5",
        name: "Sam Taylor",
        avatar: "ST",
        role: "AI Researcher",
        subjects: ["tech", "math"],
        contributions: 12,
      },
      {
        id: "c6",
        name: "Priya Sharma",
        avatar: "PS",
        role: "Ethics Lead",
        subjects: ["social", "lit"],
        contributions: 15,
      },
      {
        id: "c7",
        name: "Marcus Johnson",
        avatar: "MJ",
        role: "Medical Consultant",
        subjects: ["science"],
        contributions: 8,
      },
    ],
    mentors: [
      {
        id: "m4",
        name: "Dr. Alan Turing",
        department: "Computer Science",
        avatar: "AT",
        expertise: ["Machine Learning", "AI Systems"],
        availability: "Mon, Thu 3-5pm",
      },
      {
        id: "m5",
        name: "Dr. Maria Ethics",
        department: "Philosophy",
        avatar: "ME",
        expertise: ["Bioethics", "AI Ethics"],
        availability: "Wed, Fri 1-3pm",
      },
    ],
    resources: [
      {
        id: "r5",
        type: "dataset",
        name: "Medical AI Datasets",
        subject: "tech",
        sharedBy: "Sam Taylor",
        accessCount: 23,
        lastAccessed: new Date(Date.now() - 86400000),
      },
      {
        id: "r6",
        type: "document",
        name: "Ethics Framework Guide",
        subject: "social",
        sharedBy: "Dr. Ethics",
        accessCount: 34,
        lastAccessed: new Date(Date.now() - 172800000),
      },
    ],
    rubrics: [
      {
        id: "rub5",
        subject: "Technology",
        criteria: "Technical Understanding",
        weight: 30,
        levels: {
          excellent:
            "Deep understanding of AI algorithms and their limitations",
          proficient: "Good grasp of AI concepts and applications",
          developing: "Basic understanding of AI technology",
          beginning: "Limited technical knowledge",
        },
      },
      {
        id: "rub6",
        subject: "Social Studies",
        criteria: "Ethical Analysis",
        weight: 40,
        levels: {
          excellent: "Comprehensive ethical framework with nuanced analysis",
          proficient: "Strong ethical analysis with clear reasoning",
          developing: "Basic ethical considerations",
          beginning: "Minimal ethical analysis",
        },
      },
    ],
    integrationPoints: [
      {
        id: "ip4",
        fromSubject: "tech",
        toSubject: "social",
        description: "Evaluate AI capabilities through ethical lens",
        type: "methodology",
        strength: 0.95,
      },
      {
        id: "ip5",
        fromSubject: "lit",
        toSubject: "tech",
        description: "Communicate complex AI concepts clearly",
        type: "skill",
        strength: 0.9,
      },
    ],
    timeline: [
      {
        id: "t6",
        date: new Date(Date.now() - 604800000),
        title: "Topic Selection",
        description: "AI in healthcare chosen as focus",
        type: "milestone",
        completed: true,
      },
      {
        id: "t7",
        date: new Date(Date.now() + 172800000),
        title: "Literature Review",
        description: "Complete background research",
        type: "milestone",
        completed: false,
      },
    ],
    createdAt: new Date(Date.now() - 604800000),
    dueDate: new Date(Date.now() + 2419200000),
  },
  {
    id: "p3",
    title: "Mathematical Art Exhibition",
    description:
      "Create a gallery showcasing the beauty of mathematics through visual art, exploring geometric patterns, fractals, and data visualization.",
    subjects: ["math", "arts", "tech"],
    disciplines: ["Geometry", "Statistics", "Digital Media", "Design"],
    status: "review",
    progress: 90,
    collaborators: [
      {
        id: "c8",
        name: "Emma Wilson",
        avatar: "EW",
        role: "Artist",
        subjects: ["arts"],
        contributions: 30,
      },
      {
        id: "c9",
        name: "David Park",
        avatar: "DP",
        role: "Mathematician",
        subjects: ["math", "tech"],
        contributions: 28,
      },
      {
        id: "c10",
        name: "Lisa Chen",
        avatar: "LC",
        role: "Curator",
        subjects: ["arts", "lit"],
        contributions: 22,
      },
    ],
    mentors: [
      {
        id: "m6",
        name: "Prof. Art Math",
        department: "Mathematics",
        avatar: "AM",
        expertise: ["Geometric Art", "Fractals"],
        availability: "Tue, Thu 2-4pm",
      },
    ],
    resources: [
      {
        id: "r7",
        type: "tool",
        name: "Processing IDE",
        subject: "tech",
        sharedBy: "David Park",
        accessCount: 56,
        lastAccessed: new Date(Date.now() - 86400000),
      },
      {
        id: "r8",
        type: "link",
        name: "Math Art Gallery Inspiration",
        subject: "arts",
        sharedBy: "Emma Wilson",
        accessCount: 42,
        lastAccessed: new Date(Date.now() - 172800000),
      },
    ],
    rubrics: [
      {
        id: "rub7",
        subject: "Mathematics",
        criteria: "Mathematical Accuracy",
        weight: 35,
        levels: {
          excellent: "Perfect mathematical representations with proofs",
          proficient: "Accurate mathematical concepts",
          developing: "Mostly correct with minor errors",
          beginning: "Significant mathematical inaccuracies",
        },
      },
      {
        id: "rub8",
        subject: "Arts",
        criteria: "Artistic Merit",
        weight: 35,
        levels: {
          excellent: "Gallery-ready professional artwork",
          proficient: "High-quality artistic presentation",
          developing: "Adequate artistic execution",
          beginning: "Basic artistic representation",
        },
      },
    ],
    integrationPoints: [
      {
        id: "ip6",
        fromSubject: "math",
        toSubject: "arts",
        description: "Visualize mathematical concepts artistically",
        type: "concept",
        strength: 0.95,
      },
      {
        id: "ip7",
        fromSubject: "tech",
        toSubject: "arts",
        description: "Use digital tools for art creation",
        type: "tool",
        strength: 0.9,
      },
    ],
    timeline: [
      {
        id: "t8",
        date: new Date(Date.now() - 2592000000),
        title: "Concept Development",
        description: "Theme and scope defined",
        type: "milestone",
        completed: true,
      },
      {
        id: "t9",
        date: new Date(Date.now() - 1209600000),
        title: "Artwork Creation",
        description: "All pieces completed",
        type: "milestone",
        completed: true,
      },
      {
        id: "t10",
        date: new Date(Date.now()),
        title: "Final Review",
        description: "Pre-exhibition assessment",
        type: "review",
        completed: true,
      },
    ],
    createdAt: new Date(Date.now() - 2592000000),
    dueDate: new Date(Date.now() + 172800000),
  },
];

// --- Utility Functions ---

const getSubjectById = (id: string) => subjects.find((s) => s.id === id);

const getStatusColor = (status: CrossProject["status"]) => {
  const colors: Record<CrossProject["status"], string> = {
    planning: "bg-amber-100 text-amber-700",
    active: "bg-blue-100 text-blue-700",
    review: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
  };
  return colors[status];
};

const getResourceIcon = (type: Resource["type"]) => {
  const icons: Record<Resource["type"], React.ElementType> = {
    document: FileText,
    dataset: Grid3X3,
    tool: Hammer,
    link: Link,
    template: FileText,
  };
  return icons[type];
};

// --- Components ---

const IntegrationMap: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId],
    );
  };

  const filteredNodes = useMemo(() => {
    if (selectedSubjects.length === 0) return disciplineNodes;
    return disciplineNodes.filter((node) =>
      selectedSubjects.includes(node.subjectId),
    );
  }, [selectedSubjects]);

  return (
    <div className="relative">
      <Card className="overflow-hidden border-slate-200">
        <CardHeader className="border-slate-100 border-b bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Network className="h-5 w-5 text-indigo-600" />
                Discipline Integration Map
              </CardTitle>
              <CardDescription className="text-slate-600">
                Explore connections between subjects and find collaboration
                opportunities
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-slate-500 text-sm">Filter by subject</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Subject Filter */}
          <div className="flex flex-wrap gap-2 border-slate-100 border-b bg-slate-50/50 px-6 py-3">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => toggleSubject(subject.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-xs transition-all ${
                  selectedSubjects.includes(subject.id)
                    ? "ring-2 ring-offset-1"
                    : "hover:bg-slate-100"
                }`}
                style={{
                  backgroundColor: selectedSubjects.includes(subject.id)
                    ? `${subject.color}20`
                    : "#f1f5f9",
                  color: subject.color,
                  boxShadow: selectedSubjects.includes(subject.id)
                    ? `0 0 0 2px ${subject.color}`
                    : undefined,
                }}
              >
                <subject.icon className="h-3 w-3" />
                {subject.name}
              </button>
            ))}
            {selectedSubjects.length > 0 && (
              <button
                onClick={() => setSelectedSubjects([])}
                className="px-3 py-1.5 text-slate-500 text-xs hover:text-slate-700"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Interactive Map */}
          <div className="relative h-[500px] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.03]">
              <svg width="100%" height="100%">
                <defs>
                  <pattern
                    id="integrationGrid"
                    width="60"
                    height="60"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="1" cy="1" r="1" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#integrationGrid)" />
              </svg>
            </div>

            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter
                  id="nodeGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Connection Lines */}
              {filteredNodes.map((node) =>
                node.connections.map((targetId) => {
                  const target = disciplineNodes.find((n) => n.id === targetId);
                  if (!target) return null;
                  const isHighlighted =
                    hoveredNode === node.id || hoveredNode === targetId;

                  return (
                    <motion.line
                      key={`${node.id}-${targetId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isHighlighted ? node.color : "#cbd5e1"}
                      strokeWidth={isHighlighted ? 0.4 : 0.2}
                      strokeOpacity={isHighlighted ? 0.8 : 0.3}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  );
                }),
              )}

              {/* Nodes */}
              {filteredNodes.map((node, idx) => {
                const isHovered = hoveredNode === node.id;
                const subject = getSubjectById(node.subjectId);

                return (
                  <motion.g
                    key={node.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer"
                  >
                    {/* Pulse effect on hover */}
                    {isHovered && (
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r="6"
                        fill="none"
                        stroke={node.color}
                        strokeWidth="0.5"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      />
                    )}

                    {/* Main node */}
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={isHovered ? 4 : 3}
                      fill={node.color}
                      filter={isHovered ? "url(#nodeGlow)" : undefined}
                      animate={{ r: isHovered ? 4 : 3 }}
                      transition={{ duration: 0.2 }}
                    />

                    {/* Label */}
                    <motion.text
                      x={node.x}
                      y={node.y + 8}
                      textAnchor="middle"
                      fontSize="2.5"
                      fontWeight="500"
                      fill={isHovered ? "#1e293b" : "#64748b"}
                      className="pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 + 0.2 }}
                    >
                      {node.name}
                    </motion.text>

                    {/* Project count badge */}
                    {isHovered && (
                      <motion.g
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <rect
                          x={node.x - 8}
                          y={node.y - 12}
                          width="16"
                          height="5"
                          rx="2.5"
                          fill="white"
                          stroke={node.color}
                          strokeWidth="0.3"
                        />
                        <text
                          x={node.x}
                          y={node.y - 8.5}
                          textAnchor="middle"
                          fontSize="2"
                          fontWeight="600"
                          fill={node.color}
                        >
                          {node.projectCount} projects
                        </text>
                      </motion.g>
                    )}
                  </motion.g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
              <p className="mb-2 font-semibold text-slate-700 text-xs">
                Subjects
              </p>
              <div className="space-y-1.5">
                {subjects.map((subject) => (
                  <div key={subject.id} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <span className="text-slate-600 text-xs">
                      {subject.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="absolute right-4 bottom-4 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="font-bold text-2xl text-slate-900">
                    {filteredNodes.length}
                  </p>
                  <p className="text-slate-500 text-xs">Disciplines</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-2xl text-slate-900">
                    {filteredNodes.reduce(
                      (acc, n) => acc + n.connections.length,
                      0,
                    )}
                  </p>
                  <p className="text-slate-500 text-xs">Connections</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ProjectDiscovery: React.FC<{
  projects: CrossProject[];
  onSelectProject: (project: CrossProject) => void;
}> = ({ projects, onSelectProject }) => {
  const [filterStatus, setFilterStatus] = useState<
    CrossProject["status"] | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesStatus = filterStatus === "all" || p.status === filterStatus;
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subjects.some((s) =>
          getSubjectById(s)
            ?.name.toLowerCase()
            .includes(searchQuery.toLowerCase()),
        );
      return matchesStatus && matchesSearch;
    });
  }, [projects, filterStatus, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by title, description, or subject..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="flex gap-2">
          {["all", "planning", "active", "review", "completed"].map(
            (status) => (
              <button
                key={status}
                onClick={() =>
                  setFilterStatus(status as CrossProject["status"] | "all")
                }
                className={`rounded-lg px-3 py-2 font-medium text-xs transition-all ${
                  filterStatus === status
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer"
            >
              <Card className="h-full overflow-hidden border-slate-200 bg-white transition-all duration-300 hover:border-indigo-300 hover:shadow-lg">
                {/* Header with subject indicators */}
                <div className="relative h-2">
                  <div className="absolute inset-0 flex">
                    {project.subjects.map((subjectId, i) => {
                      const subject = getSubjectById(subjectId);
                      return (
                        <div
                          key={subjectId}
                          className="flex-1"
                          style={{ backgroundColor: subject?.color }}
                        />
                      );
                    })}
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="mb-2 flex items-start justify-between">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)}
                    </Badge>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <Users className="h-3 w-3" />
                      {project.collaborators.length}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2 font-semibold text-lg text-slate-900 transition-colors group-hover:text-indigo-600">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="mt-1 line-clamp-2 text-slate-600 text-sm">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Subject Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.subjects.map((subjectId) => {
                      const subject = getSubjectById(subjectId);
                      return (
                        <span
                          key={subjectId}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-xs"
                          style={{
                            backgroundColor: `${subject?.color}15`,
                            color: subject?.color,
                          }}
                        >
                          {subject?.icon && (
                            <subject.icon className="h-3 w-3" />
                          )}
                          {subject?.name}
                        </span>
                      );
                    })}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-medium text-slate-700">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      />
                    </div>
                  </div>

                  {/* Collaborator Avatars & Due Date */}
                  <div className="flex items-center justify-between border-slate-100 border-t pt-2">
                    <div className="-space-x-2 flex">
                      {project.collaborators.slice(0, 4).map((c) => (
                        <div
                          key={c.id}
                          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-indigo-400 to-purple-500 font-bold text-[10px] text-white"
                          title={c.name}
                        >
                          {c.avatar}
                        </div>
                      ))}
                      {project.collaborators.length > 4 && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 font-medium text-[10px] text-slate-600">
                          +{project.collaborators.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <Clock className="h-3 w-3" />
                      Due {project.dueDate.toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CollaborationSpace: React.FC<{ project: CrossProject }> = ({
  project,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <Badge className={getStatusColor(project.status)}>
                {project.status.charAt(0).toUpperCase() +
                  project.status.slice(1)}
              </Badge>
              <div className="flex items-center gap-1.5">
                {project.subjects.map((subjectId) => {
                  const subject = getSubjectById(subjectId);
                  return (
                    <span
                      key={subjectId}
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: subject?.color }}
                      title={subject?.name}
                    />
                  );
                })}
              </div>
            </div>
            <h1 className="mb-2 font-bold text-2xl text-slate-900">
              {project.title}
            </h1>
            <p className="max-w-3xl text-slate-600">{project.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-indigo-700">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button className="rounded-lg border border-slate-200 p-2 transition-colors hover:bg-slate-50">
              <MoreHorizontal className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="mb-1 flex items-center gap-2 text-slate-500 text-xs">
              <Target className="h-3.5 w-3.5" />
              Progress
            </div>
            <p className="font-bold text-2xl text-slate-900">
              {project.progress}%
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="mb-1 flex items-center gap-2 text-slate-500 text-xs">
              <Users className="h-3.5 w-3.5" />
              Team Size
            </div>
            <p className="font-bold text-2xl text-slate-900">
              {project.collaborators.length}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="mb-1 flex items-center gap-2 text-slate-500 text-xs">
              <GraduationCap className="h-3.5 w-3.5" />
              Mentors
            </div>
            <p className="font-bold text-2xl text-slate-900">
              {project.mentors.length}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="mb-1 flex items-center gap-2 text-slate-500 text-xs">
              <Clock className="h-3.5 w-3.5" />
              Days Left
            </div>
            <p className="font-bold text-2xl text-slate-900">
              {Math.ceil((project.dueDate.getTime() - Date.now()) / 86400000)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="rounded-xl border border-slate-200 bg-white p-1">
          <TabsTrigger
            value="overview"
            className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            <FolderKanban className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            <Users className="mr-2 h-4 w-4" />
            Team & Mentors
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            <Layers className="mr-2 h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger
            value="rubrics"
            className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            <Scale className="mr-2 h-4 w-4" />
            Assessment
          </TabsTrigger>
          <TabsTrigger
            value="integration"
            className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            <GitMerge className="mr-2 h-4 w-4" />
            Integration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Timeline */}
            <Card className="border-slate-200 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Workflow className="h-5 w-5 text-indigo-600" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.timeline.map((event, idx) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            event.completed
                              ? "bg-green-500 text-white"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {event.completed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <CircleDot className="h-4 w-4" />
                          )}
                        </div>
                        {idx < project.timeline.length - 1 && (
                          <div className="my-1 h-full w-0.5 bg-slate-200" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-slate-900">
                              {event.title}
                            </p>
                            <p className="mt-0.5 text-slate-600 text-sm">
                              {event.description}
                            </p>
                            <Badge
                              variant="secondary"
                              className="mt-2 text-xs capitalize"
                            >
                              {event.type}
                            </Badge>
                          </div>
                          <p className="text-slate-500 text-xs">
                            {event.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900 text-sm">
                    Subject Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.subjects.map((subjectId) => {
                      const subject = getSubjectById(subjectId);
                      return (
                        <div
                          key={subjectId}
                          className="flex items-center gap-3"
                        >
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${subject?.color}15` }}
                          >
                            {subject?.icon && (
                              <subject.icon
                                className="h-5 w-5"
                                style={{ color: subject?.color }}
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 text-sm">
                              {subject?.name}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {Math.round(100 / project.subjects.length)}%
                              weight
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900 text-sm">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.resources.slice(0, 3).map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-center gap-3 text-sm"
                      >
                        {React.createElement(getResourceIcon(resource.type), {
                          className: "w-4 h-4 text-slate-400",
                        })}
                        <span className="flex-1 truncate text-slate-600">
                          {resource.name}
                        </span>
                        <span className="text-slate-400 text-xs">
                          {resource.lastAccessed.toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Collaborators */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Collaborators
                </CardTitle>
                <CardDescription>
                  Students from different disciplines working together
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.collaborators.map((collaborator, idx) => (
                    <motion.div
                      key={collaborator.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-4 rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 font-bold text-white">
                        {collaborator.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-slate-900">
                              {collaborator.name}
                            </p>
                            <p className="text-slate-500 text-sm">
                              {collaborator.role}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {collaborator.contributions} contributions
                          </Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {collaborator.subjects.map((subjectId) => {
                            const subject = getSubjectById(subjectId);
                            return (
                              <span
                                key={subjectId}
                                className="rounded px-2 py-0.5 text-xs"
                                style={{
                                  backgroundColor: `${subject?.color}15`,
                                  color: subject?.color,
                                }}
                              >
                                {subject?.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mentors */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <GraduationCap className="h-5 w-5 text-amber-600" />
                  Department Mentors
                </CardTitle>
                <CardDescription>
                  Expert guidance from multiple departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.mentors.map((mentor, idx) => (
                    <motion.div
                      key={mentor.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 font-bold text-white">
                          {mentor.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {mentor.name}
                          </p>
                          <p className="text-amber-700 text-sm">
                            {mentor.department}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {mentor.expertise.map((exp, i) => (
                              <span
                                key={i}
                                className="rounded-full border border-amber-200 bg-white px-2 py-0.5 text-amber-800 text-xs"
                              >
                                {exp}
                              </span>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center gap-1.5 text-slate-500 text-xs">
                            <Clock className="h-3 w-3" />
                            Available: {mentor.availability}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Layers className="h-5 w-5 text-indigo-600" />
                    Cross-Disciplinary Resources
                  </CardTitle>
                  <CardDescription>
                    Shared materials from all participating subjects
                  </CardDescription>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-indigo-700">
                  <Plus className="h-4 w-4" />
                  Add Resource
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {project.resources.map((resource, idx) => {
                  const ResourceIcon = getResourceIcon(resource.type);
                  const subject = getSubjectById(resource.subject);

                  return (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${subject?.color}15` }}
                        >
                          <ResourceIcon
                            className="h-5 w-5"
                            style={{ color: subject?.color }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-slate-900 transition-colors group-hover:text-indigo-600">
                            {resource.name}
                          </p>
                          <p className="mt-0.5 text-slate-500 text-xs">
                            {subject?.name}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-slate-100 border-t pt-3">
                        <div className="flex items-center gap-1 text-slate-500 text-xs">
                          <Users className="h-3 w-3" />
                          {resource.accessCount} accesses
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <Clock className="h-3 w-3" />
                          {resource.lastAccessed.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-3 text-slate-500 text-xs">
                        Shared by{" "}
                        <span className="font-medium text-slate-700">
                          {resource.sharedBy}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rubrics" className="mt-6">
          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Scale className="h-5 w-5 text-indigo-600" />
                  Integrated Assessment Rubrics
                </CardTitle>
                <CardDescription>
                  Cross-disciplinary evaluation criteria combining all subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {project.rubrics.map((rubric, idx) => {
                    const subject =
                      getSubjectById(rubric.subject.toLowerCase()) ||
                      subjects.find((s) => s.name === rubric.subject);

                    return (
                      <motion.div
                        key={rubric.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="overflow-hidden rounded-xl border border-slate-200"
                      >
                        <div
                          className="flex items-center justify-between px-4 py-3"
                          style={{ backgroundColor: `${subject?.color}08` }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-8 w-8 items-center justify-center rounded-lg"
                              style={{ backgroundColor: `${subject?.color}20` }}
                            >
                              {subject?.icon && (
                                <subject.icon
                                  className="h-4 w-4"
                                  style={{ color: subject?.color }}
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {rubric.criteria}
                              </p>
                              <p className="text-slate-500 text-xs">
                                {subject?.name} • {rubric.weight}% weight
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: `${subject?.color}15`,
                              color: subject?.color,
                            }}
                          >
                            {rubric.weight}%
                          </Badge>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                            {Object.entries(rubric.levels).map(
                              ([level, description]) => (
                                <div
                                  key={level}
                                  className={`rounded-lg p-3 text-sm ${
                                    level === "excellent"
                                      ? "border border-green-200 bg-green-50"
                                      : level === "proficient"
                                        ? "border border-blue-200 bg-blue-50"
                                        : level === "developing"
                                          ? "border border-amber-200 bg-amber-50"
                                          : "border border-slate-200 bg-slate-50"
                                  }`}
                                >
                                  <p
                                    className={`mb-1 font-medium capitalize ${
                                      level === "excellent"
                                        ? "text-green-800"
                                        : level === "proficient"
                                          ? "text-blue-800"
                                          : level === "developing"
                                            ? "text-amber-800"
                                            : "text-slate-700"
                                    }`}
                                  >
                                    {level}
                                  </p>
                                  <p className="text-slate-600 text-xs">
                                    {description}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Total Weight Indicator */}
                <div className="mt-6 rounded-xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-slate-700 text-sm">
                      Total Assessment Weight
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {project.rubrics.reduce((acc, r) => acc + r.weight, 0)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integration" className="mt-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <GitMerge className="h-5 w-5 text-indigo-600" />
                Integration Points
              </CardTitle>
              <CardDescription>
                Connections and methodologies linking different disciplines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.integrationPoints.map((point, idx) => {
                  const fromSubject = getSubjectById(point.fromSubject);
                  const toSubject = getSubjectById(point.toSubject);

                  return (
                    <motion.div
                      key={point.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start gap-4">
                        {/* Connection visualization */}
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg"
                            style={{
                              backgroundColor: `${fromSubject?.color}15`,
                            }}
                          >
                            {fromSubject?.icon && (
                              <fromSubject.icon
                                className="h-5 w-5"
                                style={{ color: fromSubject?.color }}
                              />
                            )}
                          </div>
                          <div className="h-8 w-0.5 bg-slate-200" />
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${toSubject?.color}15` }}
                          >
                            {toSubject?.icon && (
                              <toSubject.icon
                                className="h-5 w-5"
                                style={{ color: toSubject?.color }}
                              />
                            )}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <span
                              className="font-medium"
                              style={{ color: fromSubject?.color }}
                            >
                              {fromSubject?.name}
                            </span>
                            <ArrowUpRight className="h-4 w-4 text-slate-400" />
                            <span
                              className="font-medium"
                              style={{ color: toSubject?.color }}
                            >
                              {toSubject?.name}
                            </span>
                            <Badge
                              variant="secondary"
                              className="ml-2 text-xs capitalize"
                            >
                              {point.type}
                            </Badge>
                          </div>
                          <p className="mb-3 text-slate-700">
                            {point.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-xs">
                              Integration Strength:
                            </span>
                            <div className="h-2 max-w-[200px] flex-1 overflow-hidden rounded-full bg-slate-100">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${point.strength * 100}%` }}
                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                              />
                            </div>
                            <span className="font-medium text-slate-700 text-xs">
                              {Math.round(point.strength * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// --- Main Component ---

export default function CrossDisciplinaryProjects() {
  const [view, setView] = useState<"discovery" | "collaboration">("discovery");
  const [selectedProject, setSelectedProject] = useState<CrossProject | null>(
    null,
  );

  const handleSelectProject = (project: CrossProject) => {
    setSelectedProject(project);
    setView("collaboration");
  };

  const handleBackToDiscovery = () => {
    setSelectedProject(null);
    setView("discovery");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-4 md:flex-row md:items-center"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20 shadow-lg">
                <GitBranch className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-3xl text-slate-900 tracking-tight">
                  Cross-Disciplinary Projects
                </h1>
                <p className="mt-1 text-slate-600">
                  Bridge subjects, collaborate across departments, create
                  integrated solutions
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {view === "collaboration" && (
              <button
                onClick={handleBackToDiscovery}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 transition-colors hover:text-slate-900"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Back to Projects
              </button>
            )}
            <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 font-medium text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800">
              <Plus className="h-4 w-4" />
              New Project
            </button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        {view === "discovery" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="mb-6 rounded-xl border border-slate-200 bg-white p-1">
                <TabsTrigger
                  value="projects"
                  className="rounded-lg px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                >
                  <FolderKanban className="mr-2 h-4 w-4" />
                  Project Discovery
                </TabsTrigger>
                <TabsTrigger
                  value="map"
                  className="rounded-lg px-6 data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                >
                  <Network className="mr-2 h-4 w-4" />
                  Integration Map
                </TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="mt-0">
                <ProjectDiscovery
                  projects={mockProjects}
                  onSelectProject={handleSelectProject}
                />
              </TabsContent>

              <TabsContent value="map" className="mt-0">
                <IntegrationMap />
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {view === "collaboration" && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CollaborationSpace project={selectedProject} />
          </motion.div>
        )}

        {/* Quick Stats Footer */}
        {view === "discovery" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {[
              {
                label: "Active Projects",
                value: mockProjects.filter((p) => p.status === "active").length,
                icon: Rocket,
                color: "text-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                label: "Cross-Disciplinary Teams",
                value: mockProjects.reduce(
                  (acc, p) => acc + p.collaborators.length,
                  0,
                ),
                icon: Users,
                color: "text-indigo-600",
                bgColor: "bg-indigo-50",
              },
              {
                label: "Department Mentors",
                value: mockProjects.reduce(
                  (acc, p) => acc + p.mentors.length,
                  0,
                ),
                icon: GraduationCap,
                color: "text-amber-600",
                bgColor: "bg-amber-50",
              },
              {
                label: "Shared Resources",
                value: mockProjects.reduce(
                  (acc, p) => acc + p.resources.length,
                  0,
                ),
                icon: Layers,
                color: "text-emerald-600",
                bgColor: "bg-emerald-50",
              },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div
                  className={`h-12 w-12 ${stat.bgColor} flex items-center justify-center rounded-xl`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="font-bold text-2xl text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-slate-500 text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
