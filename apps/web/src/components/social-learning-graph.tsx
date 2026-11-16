"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRightLeft,
  BookOpen,
  Brain,
  Crown,
  Filter,
  Flame,
  GitBranch,
  GitMerge,
  GraduationCap,
  Layers,
  Lightbulb,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Network,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

// Types
interface Student {
  id: string;
  name: string;
  grade: string;
  avatar: string;
  subjects: string[];
  strengths: string[];
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading";
  influenceScore: number;
  collaborationCount: number;
  mentorshipScore: number;
  knowledgeContributions: number;
  isMentor?: boolean;
  isExpert?: boolean;
}

interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  type: "study" | "mentor" | "collaboration" | "friend" | "knowledge";
  strength: number;
  lastInteraction: Date;
  interactions: number;
}

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: string[];
  compatibilityScore: number;
  meetingFrequency: "daily" | "weekly" | "biweekly";
  nextMeeting: Date;
  isRecommended?: boolean;
}

interface KnowledgeNode {
  id: string;
  name: string;
  category: string;
  contributors: string[];
  connections: string[];
  depth: number;
}

interface PeerMatch {
  studentId: string;
  matchScore: number;
  complementingSkills: string[];
  sharedInterests: string[];
  learningStyleCompatibility: number;
  recommendationReason: string;
}

interface AnalyticsMetric {
  label: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
}

// Mock Data
const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Alexandra Chen",
    grade: "11",
    avatar: "AC",
    subjects: ["Mathematics", "Physics", "Computer Science"],
    strengths: ["Problem Solving", "Algorithm Design", "Data Analysis"],
    learningStyle: "visual",
    influenceScore: 92,
    collaborationCount: 47,
    mentorshipScore: 88,
    knowledgeContributions: 156,
    isMentor: true,
    isExpert: true,
  },
  {
    id: "s2",
    name: "Marcus Johnson",
    grade: "12",
    avatar: "MJ",
    subjects: ["English Literature", "History", "Philosophy"],
    strengths: ["Critical Thinking", "Essay Writing", "Debate"],
    learningStyle: "reading",
    influenceScore: 85,
    collaborationCount: 38,
    mentorshipScore: 91,
    knowledgeContributions: 203,
    isMentor: true,
  },
  {
    id: "s3",
    name: "Sophia Williams",
    grade: "10",
    avatar: "SW",
    subjects: ["Biology", "Chemistry", "Environmental Science"],
    strengths: ["Research", "Lab Work", "Data Collection"],
    learningStyle: "kinesthetic",
    influenceScore: 78,
    collaborationCount: 29,
    mentorshipScore: 65,
    knowledgeContributions: 89,
  },
  {
    id: "s4",
    name: "David Park",
    grade: "11",
    avatar: "DP",
    subjects: ["Computer Science", "Mathematics", "Economics"],
    strengths: ["Programming", "Statistical Analysis", "Game Theory"],
    learningStyle: "visual",
    influenceScore: 81,
    collaborationCount: 42,
    mentorshipScore: 72,
    knowledgeContributions: 134,
    isExpert: true,
  },
  {
    id: "s5",
    name: "Emma Rodriguez",
    grade: "12",
    avatar: "ER",
    subjects: ["Art", "Digital Media", "Design"],
    strengths: ["Visual Design", "UI/UX", "Creative Thinking"],
    learningStyle: "visual",
    influenceScore: 88,
    collaborationCount: 51,
    mentorshipScore: 79,
    knowledgeContributions: 178,
    isMentor: true,
  },
  {
    id: "s6",
    name: "James Liu",
    grade: "10",
    avatar: "JL",
    subjects: ["Physics", "Mathematics", "Engineering"],
    strengths: ["Mechanical Design", "CAD", "Problem Solving"],
    learningStyle: "kinesthetic",
    influenceScore: 73,
    collaborationCount: 24,
    mentorshipScore: 58,
    knowledgeContributions: 67,
  },
  {
    id: "s7",
    name: "Olivia Martinez",
    grade: "11",
    avatar: "OM",
    subjects: ["Psychology", "Sociology", "Statistics"],
    strengths: ["Research Methods", "Data Analysis", "Survey Design"],
    learningStyle: "reading",
    influenceScore: 79,
    collaborationCount: 35,
    mentorshipScore: 71,
    knowledgeContributions: 112,
  },
  {
    id: "s8",
    name: "Noah Thompson",
    grade: "12",
    avatar: "NT",
    subjects: ["Economics", "Political Science", "History"],
    strengths: ["Policy Analysis", "Debate", "Research"],
    learningStyle: "auditory",
    influenceScore: 86,
    collaborationCount: 44,
    mentorshipScore: 84,
    knowledgeContributions: 145,
    isMentor: true,
  },
  {
    id: "s9",
    name: "Aisha Patel",
    grade: "10",
    avatar: "AP",
    subjects: ["Chemistry", "Mathematics", "Biology"],
    strengths: ["Organic Chemistry", "Calculus", "Lab Techniques"],
    learningStyle: "kinesthetic",
    influenceScore: 76,
    collaborationCount: 31,
    mentorshipScore: 68,
    knowledgeContributions: 94,
  },
  {
    id: "s10",
    name: "Lucas Kim",
    grade: "11",
    avatar: "LK",
    subjects: ["Computer Science", "Physics", "Music"],
    strengths: ["Machine Learning", "Audio Processing", "Programming"],
    learningStyle: "visual",
    influenceScore: 83,
    collaborationCount: 39,
    mentorshipScore: 75,
    knowledgeContributions: 127,
    isExpert: true,
  },
];

const mockConnections: Connection[] = [
  {
    id: "c1",
    sourceId: "s1",
    targetId: "s4",
    type: "collaboration",
    strength: 0.9,
    lastInteraction: new Date(Date.now() - 86400000 * 2),
    interactions: 45,
  },
  {
    id: "c2",
    sourceId: "s1",
    targetId: "s10",
    type: "mentor",
    strength: 0.85,
    lastInteraction: new Date(Date.now() - 86400000 * 5),
    interactions: 23,
  },
  {
    id: "c3",
    sourceId: "s2",
    targetId: "s8",
    type: "study",
    strength: 0.8,
    lastInteraction: new Date(Date.now() - 86400000 * 1),
    interactions: 67,
  },
  {
    id: "c4",
    sourceId: "s3",
    targetId: "s9",
    type: "collaboration",
    strength: 0.75,
    lastInteraction: new Date(Date.now() - 86400000 * 3),
    interactions: 34,
  },
  {
    id: "c5",
    sourceId: "s4",
    targetId: "s10",
    type: "knowledge",
    strength: 0.88,
    lastInteraction: new Date(Date.now() - 86400000 * 4),
    interactions: 52,
  },
  {
    id: "c6",
    sourceId: "s5",
    targetId: "s1",
    type: "friend",
    strength: 0.7,
    lastInteraction: new Date(Date.now() - 86400000 * 7),
    interactions: 28,
  },
  {
    id: "c7",
    sourceId: "s6",
    targetId: "s1",
    type: "mentor",
    strength: 0.82,
    lastInteraction: new Date(Date.now() - 86400000 * 6),
    interactions: 19,
  },
  {
    id: "c8",
    sourceId: "s7",
    targetId: "s2",
    type: "study",
    strength: 0.78,
    lastInteraction: new Date(Date.now() - 86400000 * 2),
    interactions: 41,
  },
  {
    id: "c9",
    sourceId: "s8",
    targetId: "s2",
    type: "collaboration",
    strength: 0.86,
    lastInteraction: new Date(Date.now() - 86400000 * 1),
    interactions: 73,
  },
  {
    id: "c10",
    sourceId: "s9",
    targetId: "s3",
    type: "friend",
    strength: 0.72,
    lastInteraction: new Date(Date.now() - 86400000 * 4),
    interactions: 31,
  },
  {
    id: "c11",
    sourceId: "s10",
    targetId: "s4",
    type: "study",
    strength: 0.84,
    lastInteraction: new Date(Date.now() - 86400000 * 3),
    interactions: 48,
  },
  {
    id: "c12",
    sourceId: "s1",
    targetId: "s2",
    type: "knowledge",
    strength: 0.65,
    lastInteraction: new Date(Date.now() - 86400000 * 8),
    interactions: 15,
  },
  {
    id: "c13",
    sourceId: "s5",
    targetId: "s10",
    type: "collaboration",
    strength: 0.77,
    lastInteraction: new Date(Date.now() - 86400000 * 5),
    interactions: 36,
  },
  {
    id: "c14",
    sourceId: "s7",
    targetId: "s9",
    type: "mentor",
    strength: 0.79,
    lastInteraction: new Date(Date.now() - 86400000 * 6),
    interactions: 22,
  },
  {
    id: "c15",
    sourceId: "s6",
    targetId: "s8",
    type: "study",
    strength: 0.68,
    lastInteraction: new Date(Date.now() - 86400000 * 9),
    interactions: 12,
  },
];

const mockStudyGroups: StudyGroup[] = [
  {
    id: "sg1",
    name: "Quantum Computing Circle",
    subject: "Computer Science",
    members: ["s1", "s4", "s10"],
    compatibilityScore: 96,
    meetingFrequency: "weekly",
    nextMeeting: new Date(Date.now() + 86400000 * 2),
    isRecommended: true,
  },
  {
    id: "sg2",
    name: "Literary Analysis Lab",
    subject: "English Literature",
    members: ["s2", "s8", "s7"],
    compatibilityScore: 91,
    meetingFrequency: "biweekly",
    nextMeeting: new Date(Date.now() + 86400000 * 5),
    isRecommended: true,
  },
  {
    id: "sg3",
    name: "BioChem Research Squad",
    subject: "Biology & Chemistry",
    members: ["s3", "s9", "s6"],
    compatibilityScore: 88,
    meetingFrequency: "weekly",
    nextMeeting: new Date(Date.now() + 86400000 * 3),
  },
  {
    id: "sg4",
    name: "Creative Tech Fusion",
    subject: "Design & Technology",
    members: ["s5", "s1", "s10"],
    compatibilityScore: 94,
    meetingFrequency: "biweekly",
    nextMeeting: new Date(Date.now() + 86400000 * 7),
    isRecommended: true,
  },
];

const mockKnowledgeNodes: KnowledgeNode[] = [
  {
    id: "k1",
    name: "Machine Learning",
    category: "CS",
    contributors: ["s1", "s4", "s10"],
    connections: ["k2", "k5"],
    depth: 1,
  },
  {
    id: "k2",
    name: "Neural Networks",
    category: "CS",
    contributors: ["s1", "s10"],
    connections: ["k1", "k3"],
    depth: 2,
  },
  {
    id: "k3",
    name: "Deep Learning",
    category: "CS",
    contributors: ["s4", "s10"],
    connections: ["k2", "k4"],
    depth: 3,
  },
  {
    id: "k4",
    name: "Computer Vision",
    category: "CS",
    contributors: ["s5", "s10"],
    connections: ["k3", "k6"],
    depth: 3,
  },
  {
    id: "k5",
    name: "Statistics",
    category: "Math",
    contributors: ["s1", "s7"],
    connections: ["k1", "k7"],
    depth: 1,
  },
  {
    id: "k6",
    name: "Image Processing",
    category: "CS",
    contributors: ["s5"],
    connections: ["k4"],
    depth: 4,
  },
  {
    id: "k7",
    name: "Data Analysis",
    category: "Math",
    contributors: ["s1", "s7", "s4"],
    connections: ["k5", "k8"],
    depth: 2,
  },
  {
    id: "k8",
    name: "Research Methods",
    category: "General",
    contributors: ["s7", "s2", "s8"],
    connections: ["k7", "k9"],
    depth: 2,
  },
  {
    id: "k9",
    name: "Academic Writing",
    category: "Literature",
    contributors: ["s2", "s8"],
    connections: ["k8"],
    depth: 3,
  },
];

const mockPeerMatches: PeerMatch[] = [
  {
    studentId: "s6",
    matchScore: 94,
    complementingSkills: ["Mechanical Design", "CAD"],
    sharedInterests: ["Physics", "Engineering"],
    learningStyleCompatibility: 0.92,
    recommendationReason:
      "Your problem-solving skills complement James's engineering focus perfectly",
  },
  {
    studentId: "s9",
    matchScore: 89,
    complementingSkills: ["Organic Chemistry", "Lab Techniques"],
    sharedInterests: ["Chemistry", "Mathematics"],
    learningStyleCompatibility: 0.87,
    recommendationReason:
      "Strong overlap in STEM subjects with complementary lab skills",
  },
  {
    studentId: "s7",
    matchScore: 86,
    complementingSkills: ["Research Methods", "Survey Design"],
    sharedInterests: ["Data Analysis", "Statistics"],
    learningStyleCompatibility: 0.85,
    recommendationReason: "Excellent match for collaborative research projects",
  },
];

const mockAnalytics: AnalyticsMetric[] = [
  { label: "Active Connections", value: 127, change: 23, trend: "up" },
  { label: "Knowledge Exchanges", value: 892, change: 156, trend: "up" },
  { label: "Collaboration Hours", value: 345, change: 42, trend: "up" },
  { label: "Network Influence", value: 82, change: 5, trend: "stable" },
];

// Utility Functions
const getConnectionColor = (type: Connection["type"]): string => {
  const colors: Record<Connection["type"], string> = {
    study: "#6366f1",
    mentor: "#f59e0b",
    collaboration: "#10b981",
    friend: "#ec4899",
    knowledge: "#8b5cf6",
  };
  return colors[type];
};

const getLearningStyleIcon = (style: Student["learningStyle"]) => {
  const icons: Record<Student["learningStyle"], React.ReactNode> = {
    visual: <Layers className="h-3 w-3" />,
    auditory: <MessageCircle className="h-3 w-3" />,
    kinesthetic: <Zap className="h-3 w-3" />,
    reading: <BookOpen className="h-3 w-3" />,
  };
  return icons[style];
};

const getLearningStyleColor = (style: Student["learningStyle"]): string => {
  const colors: Record<Student["learningStyle"], string> = {
    visual: "bg-indigo-100 text-indigo-700",
    auditory: "bg-amber-100 text-amber-700",
    kinesthetic: "bg-emerald-100 text-emerald-700",
    reading: "bg-blue-100 text-blue-700",
  };
  return colors[style];
};

// Network Graph Component
interface NetworkGraphProps {
  students: Student[];
  connections: Connection[];
  selectedStudent: string | null;
  onSelectStudent: (id: string | null) => void;
  viewMode: "all" | "mentorship" | "collaboration" | "knowledge";
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({
  students,
  connections,
  selectedStudent,
  onSelectStudent,
  viewMode,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);

  // Filter connections based on view mode
  const filteredConnections = useMemo(() => {
    if (viewMode === "all") return connections;
    return connections.filter((c) => {
      if (viewMode === "mentorship") return c.type === "mentor";
      if (viewMode === "collaboration")
        return c.type === "collaboration" || c.type === "study";
      if (viewMode === "knowledge") return c.type === "knowledge";
      return true;
    });
  }, [connections, viewMode]);

  // Get filtered students based on connections
  const filteredStudents = useMemo(() => {
    if (viewMode === "all") return students;
    const connectedIds = new Set<string>();
    filteredConnections.forEach((c) => {
      connectedIds.add(c.sourceId);
      connectedIds.add(c.targetId);
    });
    return students.filter((s) => connectedIds.has(s.id));
  }, [students, filteredConnections, viewMode]);

  // Calculate node positions using force-directed layout simulation
  const nodePositions = useMemo(() => {
    const positions: Record<
      string,
      { x: number; y: number; vx: number; vy: number }
    > = {};
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(dimensions.width, dimensions.height) * 0.35;

    filteredStudents.forEach((student, index) => {
      const angle = (index / filteredStudents.length) * 2 * Math.PI;
      positions[student.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        vx: 0,
        vy: 0,
      };
    });

    // Simple force-directed simulation
    for (let iteration = 0; iteration < 50; iteration++) {
      // Repulsion between nodes
      filteredStudents.forEach((s1) => {
        filteredStudents.forEach((s2) => {
          if (s1.id === s2.id) return;
          const dx = positions[s2.id].x - positions[s1.id].x;
          const dy = positions[s2.id].y - positions[s1.id].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 2000 / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          positions[s1.id].vx -= fx;
          positions[s1.id].vy -= fy;
        });
      });

      // Attraction along edges
      filteredConnections.forEach((conn) => {
        if (!positions[conn.sourceId] || !positions[conn.targetId]) return;
        const dx = positions[conn.targetId].x - positions[conn.sourceId].x;
        const dy = positions[conn.targetId].y - positions[conn.sourceId].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - 100) * 0.01;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        positions[conn.sourceId].vx += fx;
        positions[conn.sourceId].vy += fy;
        positions[conn.targetId].vx -= fx;
        positions[conn.targetId].vy -= fy;
      });

      // Center gravity
      filteredStudents.forEach((student) => {
        const dx = centerX - positions[student.id].x;
        const dy = centerY - positions[student.id].y;
        positions[student.id].vx += dx * 0.001;
        positions[student.id].vy += dy * 0.001;
      });

      // Apply velocity with damping
      filteredStudents.forEach((student) => {
        positions[student.id].x += positions[student.id].vx * 0.5;
        positions[student.id].y += positions[student.id].vy * 0.5;
        positions[student.id].vx *= 0.8;
        positions[student.id].vy *= 0.8;

        // Keep within bounds
        positions[student.id].x = Math.max(
          60,
          Math.min(dimensions.width - 60, positions[student.id].x),
        );
        positions[student.id].y = Math.max(
          60,
          Math.min(dimensions.height - 60, positions[student.id].y),
        );
      });
    }

    return positions;
  }, [filteredStudents, filteredConnections, dimensions]);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleNodeClick = (studentId: string) => {
    onSelectStudent(selectedStudent === studentId ? null : studentId);
  };

  return (
    <div className="relative h-full min-h-[500px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Definitions for gradients and filters */}
        <defs>
          <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.6" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="28"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3, 0 6"
              fill="currentColor"
              opacity="0.6"
            />
          </marker>
        </defs>

        {/* Connections */}
        <g className="connections">
          {filteredConnections.map((conn, idx) => {
            const source = nodePositions[conn.sourceId];
            const target = nodePositions[conn.targetId];
            if (!source || !target) return null;

            const isHighlighted =
              selectedStudent === conn.sourceId ||
              selectedStudent === conn.targetId ||
              hoveredNode === conn.sourceId ||
              hoveredNode === conn.targetId;
            const color = getConnectionColor(conn.type);

            return (
              <motion.line
                key={conn.id}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: isHighlighted ? 0.8 : 0.3,
                  strokeWidth: isHighlighted ? 3 : 1.5,
                }}
                transition={{ duration: 0.8, delay: idx * 0.05 }}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={color}
                strokeLinecap="round"
                markerEnd={
                  conn.type === "mentor" || conn.type === "knowledge"
                    ? "url(#arrowhead)"
                    : undefined
                }
                style={{ color }}
              />
            );
          })}
        </g>

        {/* Knowledge Flow Particles */}
        {viewMode === "knowledge" &&
          filteredConnections.map((conn) => {
            const source = nodePositions[conn.sourceId];
            const target = nodePositions[conn.targetId];
            if (!source || !target) return null;

            return (
              <g key={`particle-${conn.id}`}>
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={i}
                    r="3"
                    fill={getConnectionColor(conn.type)}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      cx: [source.x, target.x],
                      cy: [source.y, target.y],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.6,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ))}
              </g>
            );
          })}

        {/* Nodes */}
        <g className="nodes">
          {filteredStudents.map((student, idx) => {
            const pos = nodePositions[student.id];
            if (!pos) return null;

            const isSelected = selectedStudent === student.id;
            const isHovered = hoveredNode === student.id;
            const isConnected = filteredConnections.some(
              (c) =>
                (c.sourceId === student.id || c.targetId === student.id) &&
                selectedStudent &&
                (c.sourceId === selectedStudent ||
                  c.targetId === selectedStudent),
            );

            const nodeRadius = 24 + (student.influenceScore / 100) * 12;
            const shouldHighlight =
              isSelected || isHovered || (selectedStudent && isConnected);

            return (
              <g
                key={student.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer"
                onClick={() => handleNodeClick(student.id)}
                onMouseEnter={() => setHoveredNode(student.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Outer glow for selected/highlighted */}
                {(isSelected || shouldHighlight) && (
                  <motion.circle
                    r={nodeRadius + 8}
                    fill="none"
                    stroke={getConnectionColor("collaboration")}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.5, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Main node circle */}
                <motion.circle
                  r={nodeRadius}
                  fill={
                    student.isMentor
                      ? "#f59e0b"
                      : student.isExpert
                        ? "#8b5cf6"
                        : "#6366f1"
                  }
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isSelected ? 1.1 : isHovered ? 1.05 : 1,
                    opacity:
                      selectedStudent && !shouldHighlight && !isSelected
                        ? 0.4
                        : 1,
                  }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  filter={isSelected || isHovered ? "url(#glow)" : undefined}
                  className="drop-shadow-lg"
                />

                {/* Inner circle */}
                <circle r={nodeRadius - 4} fill="white" opacity="0.9" />

                {/* Avatar text */}
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="#1e293b"
                >
                  {student.avatar}
                </text>

                {/* Role indicator */}
                {student.isMentor && (
                  <g
                    transform={`translate(${nodeRadius - 8}, -${nodeRadius - 8})`}
                  >
                    <circle r="8" fill="#f59e0b" />
                    <Crown className="h-3 w-3" color="white" />
                  </g>
                )}
                {student.isExpert && !student.isMentor && (
                  <g
                    transform={`translate(${nodeRadius - 8}, -${nodeRadius - 8})`}
                  >
                    <circle r="8" fill="#8b5cf6" />
                    <Sparkles className="h-3 w-3" color="white" />
                  </g>
                )}

                {/* Label */}
                <motion.text
                  y={nodeRadius + 20}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="500"
                  fill="#475569"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: selectedStudent && !shouldHighlight ? 0.3 : 1,
                  }}
                >
                  {student.name.split(" ")[0]}
                </motion.text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-lg backdrop-blur-sm">
        <div className="mb-2 font-semibold text-slate-700 text-xs">
          Connection Types
        </div>
        <div className="space-y-1.5">
          {[
            { type: "study", label: "Study Partner", color: "#6366f1" },
            { type: "mentor", label: "Mentorship", color: "#f59e0b" },
            { type: "collaboration", label: "Collaboration", color: "#10b981" },
            { type: "knowledge", label: "Knowledge Flow", color: "#8b5cf6" },
          ].map(({ type, label, color }) => (
            <div key={type} className="flex items-center gap-2 text-xs">
              <div
                className="h-0.5 w-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Node Legend */}
      <div className="absolute right-4 bottom-4 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-lg backdrop-blur-sm">
        <div className="mb-2 font-semibold text-slate-700 text-xs">
          Node Types
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500">
              <Crown className="h-2.5 w-2.5 text-white" />
            </div>
            <span className="text-slate-600">Mentor</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-500">
              <Sparkles className="h-2.5 w-2.5 text-white" />
            </div>
            <span className="text-slate-600">Subject Expert</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="h-4 w-4 rounded-full bg-indigo-500" />
            <span className="text-slate-600">Active Learner</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Knowledge Flow Visualization
const KnowledgeFlowChart: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(mockKnowledgeNodes.map((k) => k.category)));
    return cats;
  }, []);

  const filteredNodes = useMemo(() => {
    if (!selectedCategory) return mockKnowledgeNodes;
    return mockKnowledgeNodes.filter((n) => n.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`rounded-full px-3 py-1.5 font-medium text-xs transition-colors ${
            !selectedCategory
              ? "bg-slate-800 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-3 py-1.5 font-medium text-xs transition-colors ${
              selectedCategory === cat
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative h-64 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
        <div className="grid h-full grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((depth) => {
            const nodesAtDepth = filteredNodes.filter((n) => n.depth === depth);
            return (
              <div key={depth} className="flex flex-col justify-center gap-3">
                <div className="mb-2 text-center font-semibold text-slate-400 text-xs">
                  Level {depth}
                </div>
                {nodesAtDepth.map((node, idx) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group cursor-pointer rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          node.category === "CS"
                            ? "bg-indigo-500"
                            : node.category === "Math"
                              ? "bg-emerald-500"
                              : node.category === "Literature"
                                ? "bg-amber-500"
                                : "bg-slate-500"
                        }`}
                      />
                      <span className="font-medium text-slate-700 text-xs group-hover:text-slate-900">
                        {node.name}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1">
                      {node.contributors.slice(0, 3).map((c, i) => (
                        <div
                          key={i}
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 font-bold text-[8px] text-slate-600"
                        >
                          {mockStudents
                            .find((s) => s.id === c)
                            ?.avatar.slice(0, 1)}
                        </div>
                      ))}
                      {node.contributors.length > 3 && (
                        <span className="text-[8px] text-slate-400">
                          +{node.contributors.length - 3}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Connection Lines SVG */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {filteredNodes.map((node) => {
            return node.connections.map((targetId) => {
              const target = filteredNodes.find((n) => n.id === targetId);
              if (!target || target.depth <= node.depth) return null;

              // Simplified visualization - in real app would calculate exact positions
              return (
                <motion.path
                  key={`${node.id}-${targetId}`}
                  d={`M ${(node.depth - 0.5) * 25}%,50 L ${(target.depth - 0.5) * 25}%,50`}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1 }}
                />
              );
            });
          })}
        </svg>
      </div>
    </div>
  );
};

// Study Group Recommendations
const StudyGroupRecommendations: React.FC = () => {
  return (
    <div className="space-y-4">
      {mockStudyGroups.map((group, idx) => (
        <motion.div
          key={group.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`cursor-pointer rounded-xl border bg-white p-4 transition-all hover:shadow-lg ${
            group.isRecommended
              ? "border-indigo-300 bg-indigo-50/30"
              : "border-slate-200"
          }`}
        >
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  group.isRecommended ? "bg-indigo-500" : "bg-slate-200"
                }`}
              >
                <Users
                  className={`h-5 w-5 ${group.isRecommended ? "text-white" : "text-slate-600"}`}
                />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">{group.name}</h4>
                <p className="text-slate-500 text-sm">{group.subject}</p>
              </div>
            </div>
            {group.isRecommended && (
              <Badge variant="success" className="text-xs">
                <Sparkles className="mr-1 h-3 w-3" />
                Recommended
              </Badge>
            )}
          </div>

          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4 text-emerald-500" />
                <span className="font-medium text-slate-700 text-sm">
                  {group.compatibilityScore}% Match
                </span>
              </div>
              <div className="text-slate-500 text-sm">
                Meets {group.meetingFrequency}
              </div>
            </div>
            <div className="text-slate-400 text-xs">
              Next: {group.nextMeeting.toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="-space-x-2 flex">
              {group.members.map((memberId, i) => {
                const student = mockStudents.find((s) => s.id === memberId);
                if (!student) return null;
                return (
                  <div
                    key={memberId}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-indigo-400 to-purple-500 font-bold text-white text-xs"
                    title={student.name}
                  >
                    {student.avatar.slice(0, 1)}
                  </div>
                );
              })}
            </div>
            <button className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-slate-800">
              Join Group
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Peer Matchmaking Panel
const PeerMatchmaking: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Top Peer Matches</h3>
        <button className="font-medium text-indigo-600 text-sm hover:text-indigo-700">
          View All
        </button>
      </div>

      {mockPeerMatches.map((match, idx) => {
        const student = mockStudents.find((s) => s.id === match.studentId);
        if (!student) return null;

        return (
          <motion.div
            key={match.studentId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 font-bold text-white">
                {student.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">
                    {student.name}
                  </h4>
                  <Badge variant="success" className="text-xs">
                    {match.matchScore}% Match
                  </Badge>
                </div>
                <p className="mb-2 text-slate-500 text-sm">
                  Grade {student.grade}
                </p>
                <p className="mb-2 text-slate-600 text-xs">
                  {match.recommendationReason}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {match.complementingSkills.slice(0, 2).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 text-xs">
                    {match.sharedInterests.length} shared interests
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-slate-100 border-t pt-3">
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${getLearningStyleColor(student.learningStyle)}`}
                >
                  {getLearningStyleIcon(student.learningStyle)}
                  <span className="capitalize">{student.learningStyle}</span>
                </div>
                <span className="text-slate-400 text-xs">
                  {Math.round(match.learningStyleCompatibility * 100)}%
                  compatible
                </span>
              </div>
              <button className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white text-xs opacity-0 transition-colors hover:bg-indigo-700 group-hover:opacity-100">
                Connect
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Analytics Dashboard
const CollaborationAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {mockAnalytics.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-slate-500 text-xs">{metric.label}</span>
              <Badge
                variant={
                  metric.trend === "up"
                    ? "success"
                    : metric.trend === "down"
                      ? "destructive"
                      : "secondary"
                }
                className="text-xs"
              >
                {metric.trend === "up"
                  ? "↑"
                  : metric.trend === "down"
                    ? "↓"
                    : "→"}{" "}
                {metric.change}
              </Badge>
            </div>
            <div className="font-bold text-2xl text-slate-900">
              {metric.value.toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Influence Map */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
          <Flame className="h-4 w-4 text-amber-500" />
          Top Knowledge Contributors
        </h4>
        <div className="space-y-3">
          {mockStudents
            .sort((a, b) => b.knowledgeContributions - a.knowledgeContributions)
            .slice(0, 5)
            .map((student, idx) => (
              <div key={student.id} className="flex items-center gap-3">
                <div className="w-6 font-semibold text-slate-400 text-sm">
                  #{idx + 1}
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 font-bold text-white text-xs">
                  {student.avatar.slice(0, 1)}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium text-slate-900 text-sm">
                      {student.name}
                    </span>
                    <span className="text-slate-600 text-sm">
                      {student.knowledgeContributions}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(student.knowledgeContributions / 250) * 100}%`,
                      }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Learning Style Distribution */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
          <Brain className="h-4 w-4 text-violet-500" />
          Learning Styles in Network
        </h4>
        <div className="space-y-3">
          {["visual", "auditory", "kinesthetic", "reading"].map((style) => {
            const count = mockStudents.filter(
              (s) => s.learningStyle === style,
            ).length;
            const percentage = (count / mockStudents.length) * 100;
            return (
              <div key={style} className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${getLearningStyleColor(style as Student["learningStyle"])}`}
                >
                  {getLearningStyleIcon(style as Student["learningStyle"])}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium text-slate-700 text-sm capitalize">
                      {style}
                    </span>
                    <span className="text-slate-500 text-sm">
                      {count} students
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${
                        style === "visual"
                          ? "bg-indigo-500"
                          : style === "auditory"
                            ? "bg-amber-500"
                            : style === "kinesthetic"
                              ? "bg-emerald-500"
                              : "bg-blue-500"
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Student Detail Panel
const StudentDetailPanel: React.FC<{
  student: Student;
  connections: Connection[];
  onClose: () => void;
}> = ({ student, connections, onClose }) => {
  const studentConnections = connections.filter(
    (c) => c.sourceId === student.id || c.targetId === student.id,
  );

  const connectedStudents = studentConnections
    .map((conn) => {
      const otherId =
        conn.sourceId === student.id ? conn.targetId : conn.sourceId;
      return {
        student: mockStudents.find((s) => s.id === otherId),
        connection: conn,
      };
    })
    .filter(
      (item): item is { student: Student; connection: Connection } =>
        !!item.student,
    );

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="absolute top-0 right-0 z-20 h-full w-80 overflow-y-auto border-slate-200 border-l bg-white shadow-2xl"
    >
      <div className="sticky top-0 flex items-center justify-between border-slate-200 border-b bg-white p-4">
        <h3 className="font-semibold text-slate-900">Student Profile</h3>
        <button
          onClick={onClose}
          className="rounded-lg p-2 transition-colors hover:bg-slate-100"
        >
          <MoreHorizontal className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 font-bold text-white text-xl">
            {student.avatar}
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900">{student.name}</h2>
            <p className="text-slate-500 text-sm">Grade {student.grade}</p>
            <div className="mt-1 flex items-center gap-2">
              {student.isMentor && (
                <Badge variant="warning" className="text-xs">
                  <Crown className="mr-1 h-3 w-3" />
                  Mentor
                </Badge>
              )}
              {student.isExpert && (
                <Badge variant="default" className="text-xs">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Expert
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-slate-500 text-xs">
              <TrendingUp className="h-3 w-3" />
              Influence
            </div>
            <div className="font-bold text-lg text-slate-900">
              {student.influenceScore}
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-slate-500 text-xs">
              <Users className="h-3 w-3" />
              Collaborations
            </div>
            <div className="font-bold text-lg text-slate-900">
              {student.collaborationCount}
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-slate-500 text-xs">
              <GraduationCap className="h-3 w-3" />
              Mentorship
            </div>
            <div className="font-bold text-lg text-slate-900">
              {student.mentorshipScore}
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-slate-500 text-xs">
              <Lightbulb className="h-3 w-3" />
              Contributions
            </div>
            <div className="font-bold text-lg text-slate-900">
              {student.knowledgeContributions}
            </div>
          </div>
        </div>

        {/* Learning Style */}
        <div className="mb-6">
          <h4 className="mb-2 font-semibold text-slate-900 text-sm">
            Learning Style
          </h4>
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${getLearningStyleColor(student.learningStyle)}`}
          >
            {getLearningStyleIcon(student.learningStyle)}
            <span className="capitalize">{student.learningStyle} Learner</span>
          </div>
        </div>

        {/* Subjects & Strengths */}
        <div className="mb-6">
          <h4 className="mb-2 font-semibold text-slate-900 text-sm">
            Subjects
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {student.subjects.map((subject) => (
              <Badge key={subject} variant="secondary" className="text-xs">
                {subject}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="mb-2 font-semibold text-slate-900 text-sm">
            Strengths
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {student.strengths.map((strength) => (
              <span
                key={strength}
                className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700 text-xs"
              >
                {strength}
              </span>
            ))}
          </div>
        </div>

        {/* Connections */}
        <div>
          <h4 className="mb-3 font-semibold text-slate-900 text-sm">
            Network Connections ({connectedStudents.length})
          </h4>
          <div className="space-y-2">
            {connectedStudents.map(({ student: connected, connection }) => (
              <div
                key={connected.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-600 text-xs">
                  {connected.avatar.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-slate-900 text-sm">
                    {connected.name}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <span className="capitalize">{connection.type}</span>
                    <span>•</span>
                    <span>{connection.interactions} interactions</span>
                  </div>
                </div>
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: getConnectionColor(connection.type),
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-2 border-slate-200 border-t pt-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 font-medium text-sm text-white transition-colors hover:bg-indigo-700">
            <MessageCircle className="h-4 w-4" />
            Start Conversation
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 font-medium text-slate-700 text-sm transition-colors hover:bg-slate-200">
            <GitMerge className="h-4 w-4" />
            Suggest Collaboration
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
export function SocialLearningGraph() {
  const [activeTab, setActiveTab] = useState<
    "network" | "groups" | "matches" | "analytics" | "knowledge"
  >("network");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<
    "all" | "mentorship" | "collaboration" | "knowledge"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return mockStudents;
    return mockStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.subjects.some((sub) =>
          sub.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );
  }, [searchQuery]);

  const selectedStudentData = useMemo(() => {
    return mockStudents.find((s) => s.id === selectedStudent) || null;
  }, [selectedStudent]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-slate-200 border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <Network className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-xl">
              Social Learning Graph
            </h1>
            <p className="text-slate-500 text-sm">
              Visualize connections, discover peers, optimize collaboration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Find students, subjects..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="w-64 rounded-lg border border-slate-200 bg-slate-100 py-2 pr-4 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* View Mode Filter */}
          {activeTab === "network" && (
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              {[
                { id: "all", label: "All", icon: Network },
                { id: "mentorship", label: "Mentors", icon: Crown },
                { id: "collaboration", label: "Collab", icon: Users },
                { id: "knowledge", label: "Knowledge", icon: GitBranch },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id as typeof viewMode)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium text-xs transition-all ${
                    viewMode === id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          )}

          <button className="rounded-lg p-2 transition-colors hover:bg-slate-100">
            <Filter className="h-5 w-5 text-slate-600" />
          </button>
          <button className="rounded-lg p-2 transition-colors hover:bg-slate-100">
            <RefreshCw className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="flex w-64 flex-col border-slate-200 border-r bg-white">
          <div className="space-y-1 p-4">
            {[
              {
                id: "network",
                label: "Network Map",
                icon: Network,
                count: null,
              },
              { id: "groups", label: "Study Groups", icon: Users, count: 4 },
              {
                id: "matches",
                label: "Peer Matches",
                icon: ArrowRightLeft,
                count: 12,
              },
              {
                id: "knowledge",
                label: "Knowledge Flow",
                icon: GitBranch,
                count: null,
              },
              {
                id: "analytics",
                label: "Analytics",
                icon: TrendingUp,
                count: null,
              },
            ].map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id as typeof activeTab);
                  setSelectedStudent(null);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all ${
                  activeTab === id
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </div>
                {count && (
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-slate-700 text-xs">
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-auto border-slate-200 border-t p-4">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-4 text-white">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="font-semibold text-sm">Pro Tip</span>
              </div>
              <p className="text-white/80 text-xs">
                Click on any node in the network to view detailed student
                profile and connection history.
              </p>
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "network" && (
              <motion.div
                key="network"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <NetworkGraph
                  students={filteredStudents}
                  connections={mockConnections}
                  selectedStudent={selectedStudent}
                  onSelectStudent={setSelectedStudent}
                  viewMode={viewMode}
                />

                <AnimatePresence>
                  {selectedStudentData && (
                    <StudentDetailPanel
                      student={selectedStudentData}
                      connections={mockConnections}
                      onClose={() => setSelectedStudent(null)}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === "groups" && (
              <motion.div
                key="groups"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 overflow-y-auto p-6"
              >
                <div className="mx-auto max-w-4xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-2xl text-slate-900">
                        Study Group Recommendations
                      </h2>
                      <p className="text-slate-500">
                        AI-powered study groups based on compatibility and
                        learning goals
                      </p>
                    </div>
                    <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700">
                      <Plus className="h-4 w-4" />
                      Create Group
                    </button>
                  </div>
                  <StudyGroupRecommendations />
                </div>
              </motion.div>
            )}

            {activeTab === "matches" && (
              <motion.div
                key="matches"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 overflow-y-auto p-6"
              >
                <div className="mx-auto max-w-4xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-2xl text-slate-900">
                        Peer Learning Matchmaking
                      </h2>
                      <p className="text-slate-500">
                        Discover complementary study partners based on skills
                        and learning styles
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <PeerMatchmaking />
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-indigo-500" />
                          How Matching Works
                        </CardTitle>
                        <CardDescription>
                          Our algorithm considers multiple factors to find your
                          ideal learning partners
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          {
                            icon: Brain,
                            title: "Learning Style Compatibility",
                            desc: "Matches visual learners with complementary auditory or kinesthetic partners",
                          },
                          {
                            icon: Share2,
                            title: "Skill Complementarity",
                            desc: "Pairs students with complementary strengths for mutual growth",
                          },
                          {
                            icon: GitMerge,
                            title: "Subject Overlap",
                            desc: "Identifies shared academic interests and course overlaps",
                          },
                          {
                            icon: TrendingUp,
                            title: "Collaboration History",
                            desc: "Analyzes past successful partnerships and network effects",
                          },
                        ].map(({ icon: Icon, title, desc }) => (
                          <div key={title} className="flex gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                              <Icon className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900">
                                {title}
                              </h4>
                              <p className="text-slate-500 text-sm">{desc}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "knowledge" && (
              <motion.div
                key="knowledge"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 overflow-y-auto p-6"
              >
                <div className="mx-auto max-w-5xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-2xl text-slate-900">
                        Knowledge Flow Visualization
                      </h2>
                      <p className="text-slate-500">
                        Track how knowledge spreads through your learning
                        community
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <Link2 className="mr-1 h-3 w-3" />
                        156 Knowledge Nodes
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <GitBranch className="mr-1 h-3 w-3" />
                        892 Connections
                      </Badge>
                    </div>
                  </div>
                  <KnowledgeFlowChart />
                </div>
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 overflow-y-auto p-6"
              >
                <div className="mx-auto max-w-5xl">
                  <div className="mb-6">
                    <h2 className="font-bold text-2xl text-slate-900">
                      Collaboration Analytics
                    </h2>
                    <p className="text-slate-500">
                      Insights into your learning network and community dynamics
                    </p>
                  </div>
                  <CollaborationAnalytics />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
