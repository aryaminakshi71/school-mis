"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Brain,
  Clock,
  Dna,
  Eye,
  FlaskConical,
  Focus,
  GitBranch,
  Lightbulb,
  Microscope,
  Palette,
  Share2,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types for Learning DNA Profile
export interface CognitivePreference {
  type: "visual" | "auditory" | "kinesthetic" | "reading" | "logical";
  strength: number;
  description: string;
}

export interface NeuroplasticityIndicator {
  metric: string;
  value: number;
  trend: "improving" | "stable" | "declining";
  lastUpdated: Date;
}

export interface LearningTimeWindow {
  timeOfDay: string;
  startHour: number;
  endHour: number;
  efficiency: number;
  cognitiveLoad: number;
  recommendation: string;
}

export interface MemoryRetentionPattern {
  interval: string;
  retentionRate: number;
  optimalReviewTime: Date;
  subject: string;
}

export interface AttentionSpanProfile {
  duration: number;
  peakFocusTime: number;
  recoveryNeeded: number;
  distractionTriggers: string[];
  focusQuality: number;
}

export interface LearningPreference {
  social: number;
  solitary: number;
  collaborative: number;
  competitive: number;
}

export interface ThinkingStyle {
  creative: number;
  analytical: number;
  critical: number;
  intuitive: number;
}

export interface GeneticMarker {
  id: string;
  name: string;
  value: number;
  category: "cognitive" | "behavioral" | "neurological" | "emotional";
  significance: "high" | "medium" | "low";
  description: string;
}

export interface LearningDNAProfile {
  id: string;
  studentId: string;
  studentName: string;
  geneticMarkers: GeneticMarker[];
  cognitivePreferences: CognitivePreference[];
  neuroplasticityIndicators: NeuroplasticityIndicator[];
  optimalTimeWindows: LearningTimeWindow[];
  memoryPatterns: MemoryRetentionPattern[];
  attentionSpan: AttentionSpanProfile;
  socialPreference: LearningPreference;
  thinkingStyle: ThinkingStyle;
  createdAt: Date;
  updatedAt: Date;
  confidence: number;
}

interface LearningDNAProfilesProps {
  userRole?: "student" | "teacher" | "admin" | "researcher";
  userId?: string;
  onProfileUpdate?: (profile: Partial<LearningDNAProfile>) => void;
  onGenerateInsights?: (studentId: string) => Promise<string[]>;
}

// DNA Helix Animation Component
const DNAHelix = ({ markers }: { markers: GeneticMarker[] }) => {
  return (
    <div className="relative h-96 w-full overflow-hidden rounded-xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* DNA Strands */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="strand1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="strand2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Animated DNA Strands */}
        {[...Array(20)].map((_, i) => {
          const y = i * 20;
          const offset1 = Math.sin(i * 0.5 + 0) * 80;
          const offset2 = Math.sin(i * 0.5 + Math.PI) * 80;

          return (
            <g key={i}>
              {/* Connection lines */}
              <motion.line
                x1={200 + offset1}
                y1={y}
                x2={200 + offset2}
                y2={y}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />

              {/* Strand 1 nodes */}
              <motion.circle
                cx={200 + offset1}
                cy={y}
                r="6"
                fill="url(#strand1)"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />

              {/* Strand 2 nodes */}
              <motion.circle
                cx={200 + offset2}
                cy={y}
                r="6"
                fill="url(#strand2)"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1 + 1,
                }}
              />
            </g>
          );
        })}

        {/* Main strands */}
        <motion.path
          d="M 200 0 Q 280 100 200 200 Q 120 300 200 400"
          fill="none"
          stroke="url(#strand1)"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        <motion.path
          d="M 200 0 Q 120 100 200 200 Q 280 300 200 400"
          fill="none"
          stroke="url(#strand2)"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>

      {/* Genetic Markers Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 p-8">
          {markers.slice(0, 4).map((marker, idx) => (
            <motion.div
              key={marker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-md"
            >
              <div className="mb-2 flex items-center gap-2">
                <Dna className="h-4 w-4 text-indigo-400" />
                <span className="text-indigo-300 text-xs uppercase tracking-wider">
                  {marker.category}
                </span>
              </div>
              <p className="font-semibold text-sm text-white">{marker.name}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${marker.value}%` }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                  />
                </div>
                <span className="text-white/80 text-xs">{marker.value}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-indigo-400"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

// Circular Progress for Cognitive Metrics
const CircularProgress = ({
  value,
  max,
  label,
  icon: Icon,
  color,
}: {
  value: number;
  max: number;
  label: string;
  icon: React.ElementType;
  color: string;
}) => {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-24">
        <svg className="-rotate-90 h-full w-full">
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          <motion.circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="h-8 w-8" style={{ color }} />
        </div>
      </div>
      <p className="mt-2 font-bold text-2xl text-slate-900">{value}</p>
      <p className="text-slate-600 text-sm">{label}</p>
    </div>
  );
};

// Learning Timeline Component
const LearningTimeline = ({
  windows,
}: {
  windows: LearningTimeWindow[];
}) => {
  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-slate-200" />
      {windows.map((window, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative mb-6 flex items-start gap-4"
        >
          <div
            className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full font-bold text-white ${
              window.efficiency > 80
                ? "bg-green-500"
                : window.efficiency > 60
                  ? "bg-amber-500"
                  : "bg-slate-500"
            }`}
          >
            <Clock className="h-6 w-6" />
          </div>
          <div className="flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-semibold text-slate-900">
                {window.timeOfDay}
              </h4>
              <Badge
                variant={window.efficiency > 80 ? "success" : "warning"}
                className="text-xs"
              >
                {window.efficiency}% Efficiency
              </Badge>
            </div>
            <p className="mb-3 text-slate-600 text-sm">
              {window.recommendation}
            </p>
            <div className="flex items-center gap-4 text-slate-500 text-xs">
              <span className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                Cognitive Load: {window.cognitiveLoad}%
              </span>
              <span className="flex items-center gap-1">
                <Timer className="h-3 w-3" />
                {window.startHour}:00 - {window.endHour}:00
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Memory Retention Curve
const MemoryRetentionCurve = ({
  patterns,
}: {
  patterns: MemoryRetentionPattern[];
}) => {
  return (
    <div className="space-y-4">
      {patterns.map((pattern, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="rounded-lg border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-600" />
              <span className="font-semibold text-slate-900">
                {pattern.subject}
              </span>
            </div>
            <Badge variant="outline">{pattern.interval}</Badge>
          </div>

          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-slate-600">Retention Rate</span>
              <span className="font-semibold text-indigo-700">
                {pattern.retentionRate}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${pattern.retentionRate}%` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Target className="h-4 w-4 text-amber-500" />
            <span>
              Next review: {pattern.optimalReviewTime.toLocaleDateString()}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Social vs Solitary Balance
const SocialSolitaryBalance = ({
  preference,
}: {
  preference: LearningPreference;
}) => {
  const total = preference.social + preference.solitary;
  const socialPercent = (preference.social / total) * 100;

  return (
    <div className="space-y-6">
      {/* Balance Bar */}
      <div className="relative">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <span className="font-medium text-slate-900">Social</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900">Solitary</span>
            <User className="h-5 w-5 text-purple-600" />
          </div>
        </div>

        <div className="flex h-4 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${socialPercent}%` }}
            transition={{ duration: 1 }}
          />
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${100 - socialPercent}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>

        <div className="mt-2 flex justify-between text-slate-600 text-sm">
          <span>{preference.social}% Social</span>
          <span>{preference.solitary}% Solitary</span>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-indigo-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-indigo-600" />
            <span className="font-medium text-slate-900">Collaborative</span>
          </div>
          <p className="font-bold text-2xl text-indigo-700">
            {preference.collaborative}%
          </p>
          <p className="mt-1 text-slate-600 text-xs">
            Prefers group projects and discussions
          </p>
        </div>

        <div className="rounded-lg bg-purple-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-slate-900">Competitive</span>
          </div>
          <p className="font-bold text-2xl text-purple-700">
            {preference.competitive}%
          </p>
          <p className="mt-1 text-slate-600 text-xs">
            Thrives in competitive environments
          </p>
        </div>
      </div>
    </div>
  );
};

// Creative vs Analytical Balance
const ThinkingStyleBalance = ({
  style,
}: {
  style: ThinkingStyle;
}) => {
  const maxValue = Math.max(
    style.creative,
    style.analytical,
    style.critical,
    style.intuitive,
  );

  return (
    <div className="space-y-4">
      {[
        {
          key: "creative",
          label: "Creative",
          icon: Palette,
          color: "bg-pink-500",
          value: style.creative,
        },
        {
          key: "analytical",
          label: "Analytical",
          icon: BarChart3,
          color: "bg-blue-500",
          value: style.analytical,
        },
        {
          key: "critical",
          label: "Critical",
          icon: Microscope,
          color: "bg-amber-500",
          value: style.critical,
        },
        {
          key: "intuitive",
          label: "Intuitive",
          icon: Sparkles,
          color: "bg-purple-500",
          value: style.intuitive,
        },
      ].map((item, idx) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-center gap-4"
        >
          <div className={`rounded-lg p-2 ${item.color} bg-opacity-10`}>
            <item.icon
              className={`h-5 w-5 ${item.color.replace("bg-", "text-")}`}
            />
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-medium text-slate-900">{item.label}</span>
              <span className="font-semibold text-slate-700 text-sm">
                {item.value}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <motion.div
                className={`h-full ${item.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      ))}

      {/* Dominant Style Badge */}
      <div className="mt-6 rounded-lg border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
        <p className="mb-2 text-slate-600 text-sm">Dominant Thinking Style</p>
        <div className="flex items-center gap-3">
          <Badge className="px-4 py-2 text-lg">
            {style.creative === maxValue && "Creative Thinker"}
            {style.analytical === maxValue && "Analytical Thinker"}
            {style.critical === maxValue && "Critical Thinker"}
            {style.intuitive === maxValue && "Intuitive Thinker"}
          </Badge>
          <span className="text-slate-600 text-sm">
            {style.creative === maxValue &&
              "Excels at generating novel ideas and artistic expression"}
            {style.analytical === maxValue &&
              "Strong at logical reasoning and data-driven decisions"}
            {style.critical === maxValue &&
              "Excellent at evaluating arguments and identifying flaws"}
            {style.intuitive === maxValue &&
              "Natural at pattern recognition and gut-based insights"}
          </span>
        </div>
      </div>
    </div>
  );
};

export function LearningDNAProfiles({
  userRole = "student",
  userId = "S001",
  onProfileUpdate,
  onGenerateInsights,
}: LearningDNAProfilesProps) {
  const [activeTab, setActiveTab] = useState<
    "profile" | "cognitive" | "neuroplasticity" | "analytics"
  >("profile");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);

  // Mock Learning DNA Profile Data
  const [profile] = useState<LearningDNAProfile>({
    id: "DNA-001",
    studentId: userId,
    studentName: "Alexandra Chen",
    geneticMarkers: [
      {
        id: "GM-001",
        name: "BDNF Expression",
        value: 78,
        category: "neurological",
        significance: "high",
        description: "Brain-derived neurotrophic factor - learning capacity",
      },
      {
        id: "GM-002",
        name: "COMT Val158Met",
        value: 65,
        category: "cognitive",
        significance: "high",
        description: "Dopamine regulation - attention and memory",
      },
      {
        id: "GM-003",
        name: "5-HTTLPR",
        value: 82,
        category: "emotional",
        significance: "medium",
        description: "Serotonin transporter - stress resilience",
      },
      {
        id: "GM-004",
        name: "DRD4-7R",
        value: 54,
        category: "behavioral",
        significance: "medium",
        description: "Dopamine receptor - novelty seeking",
      },
      {
        id: "GM-005",
        name: "APOE ε4",
        value: 32,
        category: "neurological",
        significance: "low",
        description: "Memory consolidation marker",
      },
    ],
    cognitivePreferences: [
      { type: "visual", strength: 85, description: "Strong visual processing" },
      {
        type: "logical",
        strength: 78,
        description: "Excellent logical reasoning",
      },
      {
        type: "kinesthetic",
        strength: 62,
        description: "Moderate hands-on learning",
      },
      { type: "reading", strength: 70, description: "Good text comprehension" },
      {
        type: "auditory",
        strength: 55,
        description: "Average auditory learning",
      },
    ],
    neuroplasticityIndicators: [
      {
        metric: "Synaptic Flexibility",
        value: 82,
        trend: "improving",
        lastUpdated: new Date(),
      },
      {
        metric: "Myelination Rate",
        value: 74,
        trend: "stable",
        lastUpdated: new Date(),
      },
      {
        metric: "Neurogenesis Index",
        value: 68,
        trend: "improving",
        lastUpdated: new Date(),
      },
      {
        metric: "Cognitive Reserve",
        value: 79,
        trend: "stable",
        lastUpdated: new Date(),
      },
    ],
    optimalTimeWindows: [
      {
        timeOfDay: "Morning Peak",
        startHour: 8,
        endHour: 11,
        efficiency: 92,
        cognitiveLoad: 35,
        recommendation:
          "Best time for complex problem-solving and analytical tasks",
      },
      {
        timeOfDay: "Midday Moderate",
        startHour: 13,
        endHour: 15,
        efficiency: 75,
        cognitiveLoad: 52,
        recommendation: "Ideal for collaborative work and discussions",
      },
      {
        timeOfDay: "Afternoon Focus",
        startHour: 16,
        endHour: 18,
        efficiency: 68,
        cognitiveLoad: 45,
        recommendation: "Good for creative tasks and brainstorming",
      },
      {
        timeOfDay: "Evening Review",
        startHour: 19,
        endHour: 21,
        efficiency: 55,
        cognitiveLoad: 28,
        recommendation: "Perfect for review and light reading",
      },
    ],
    memoryPatterns: [
      {
        interval: "Immediate (1 day)",
        retentionRate: 95,
        optimalReviewTime: new Date(Date.now() + 86400000),
        subject: "Mathematics",
      },
      {
        interval: "Short-term (3 days)",
        retentionRate: 82,
        optimalReviewTime: new Date(Date.now() + 259200000),
        subject: "Science",
      },
      {
        interval: "Medium-term (1 week)",
        retentionRate: 71,
        optimalReviewTime: new Date(Date.now() + 604800000),
        subject: "History",
      },
      {
        interval: "Long-term (1 month)",
        retentionRate: 58,
        optimalReviewTime: new Date(Date.now() + 2592000000),
        subject: "Languages",
      },
    ],
    attentionSpan: {
      duration: 28,
      peakFocusTime: 12,
      recoveryNeeded: 5,
      distractionTriggers: [
        "Notifications",
        "Background noise",
        "Visual clutter",
      ],
      focusQuality: 84,
    },
    socialPreference: {
      social: 65,
      solitary: 35,
      collaborative: 72,
      competitive: 48,
    },
    thinkingStyle: {
      creative: 78,
      analytical: 85,
      critical: 72,
      intuitive: 64,
    },
    createdAt: new Date(Date.now() - 7776000000),
    updatedAt: new Date(),
    confidence: 87,
  });

  const generateInsights = async () => {
    setIsAnalyzing(true);

    if (onGenerateInsights) {
      const generated = await onGenerateInsights(profile.studentId);
      setInsights(generated);
    } else {
      // Generate mock insights
      setTimeout(() => {
        setInsights([
          "Your BDNF expression suggests excellent capacity for learning new skills",
          "Morning hours show 92% efficiency - schedule challenging tasks before 11 AM",
          "Visual preference at 85% indicates diagram-based learning will be most effective",
          "Attention span of 28 minutes suggests optimal Pomodoro-style sessions",
          "Analytical thinking dominance (85%) makes you excellent at STEM subjects",
        ]);
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-green-100 text-green-800 border-green-300";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "declining":
        return <TrendingUp className="h-4 w-4 rotate-180 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 font-bold text-3xl text-slate-900"
          >
            <Dna className="h-8 w-8 text-indigo-600" />
            Learning DNA Profiles
          </motion.h2>
          <p className="mt-1 text-slate-600">
            Genetic-style analysis of cognitive learning patterns
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="mr-4 text-right">
            <p className="text-slate-600 text-sm">Profile Confidence</p>
            <p className="font-bold text-2xl text-indigo-600">
              {profile.confidence}%
            </p>
          </div>
          <button
            onClick={generateInsights}
            disabled={isAnalyzing}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <FlaskConical className="h-5 w-5" />
                </motion.div>
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Insights
              </>
            )}
          </button>
        </div>
      </div>

      {/* Student Info Card */}
      <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600">
              <span className="font-bold text-2xl text-white">
                {profile.studentName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-xl">
                {profile.studentName}
              </h3>
              <p className="text-slate-600">Student ID: {profile.studentId}</p>
              <div className="mt-2 flex items-center gap-4">
                <Badge variant="outline">Learning Profile Active</Badge>
                <span className="text-slate-500 text-sm">
                  Last updated: {profile.updatedAt.toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-600 text-sm">Genetic Markers</p>
              <p className="font-bold text-3xl text-indigo-700">
                {profile.geneticMarkers.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Dna className="h-4 w-4" />
            DNA Profile
          </TabsTrigger>
          <TabsTrigger value="cognitive" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Cognitive
          </TabsTrigger>
          <TabsTrigger
            value="neuroplasticity"
            className="flex items-center gap-2"
          >
            <GitBranch className="h-4 w-4" />
            Neuroplasticity
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* DNA Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* DNA Helix Visualization */}
          <DNAHelix markers={profile.geneticMarkers} />

          {/* Genetic Markers Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Microscope className="h-5 w-5 text-indigo-600" />
                Genetic Markers Analysis
              </CardTitle>
              <CardDescription>
                Key genetic indicators influencing learning capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {profile.geneticMarkers.map((marker, idx) => (
                  <motion.div
                    key={marker.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`rounded-lg border p-4 ${getSignificanceColor(
                      marker.significance,
                    )}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold">{marker.name}</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {marker.significance}
                      </Badge>
                    </div>
                    <div className="mb-2">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Expression Level</span>
                        <span className="font-semibold">{marker.value}%</span>
                      </div>
                      <Progress value={marker.value} className="h-2" />
                    </div>
                    <p className="text-xs opacity-80">{marker.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generated Insights */}
          {insights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <Lightbulb className="h-5 w-5 text-amber-600" />
                    AI-Generated Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {insights.map((insight, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 text-amber-900"
                      >
                        <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                        <span>{insight}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* Cognitive Tab */}
        <TabsContent value="cognitive" className="space-y-6">
          {/* Cognitive Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                Cognitive Preference Analysis
              </CardTitle>
              <CardDescription>
                Distribution of learning modality preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
                {profile.cognitivePreferences.map((pref, idx) => (
                  <CircularProgress
                    key={pref.type}
                    value={pref.strength}
                    max={100}
                    label={
                      pref.type.charAt(0).toUpperCase() + pref.type.slice(1)
                    }
                    icon={
                      pref.type === "visual"
                        ? Eye
                        : pref.type === "auditory"
                          ? Activity
                          : pref.type === "kinesthetic"
                            ? Zap
                            : pref.type === "reading"
                              ? Focus
                              : BarChart3
                    }
                    color={
                      pref.type === "visual"
                        ? "#6366f1"
                        : pref.type === "auditory"
                          ? "#10b981"
                          : pref.type === "kinesthetic"
                            ? "#f59e0b"
                            : pref.type === "reading"
                              ? "#8b5cf6"
                              : "#ec4899"
                    }
                  />
                ))}
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Social vs Solitary */}
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h4 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                    <Users className="h-5 w-5 text-indigo-600" />
                    Social vs Solitary Learning
                  </h4>
                  <SocialSolitaryBalance
                    preference={profile.socialPreference}
                  />
                </div>

                {/* Thinking Style */}
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h4 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                    <GitBranch className="h-5 w-5 text-purple-600" />
                    Thinking Style Balance
                  </h4>
                  <ThinkingStyleBalance style={profile.thinkingStyle} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Neuroplasticity Tab */}
        <TabsContent value="neuroplasticity" className="space-y-6">
          {/* Neuroplasticity Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-indigo-600" />
                Neuroplasticity Indicators
              </CardTitle>
              <CardDescription>
                Brain's capacity to reorganize and form new neural connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {profile.neuroplasticityIndicators.map((indicator, idx) => (
                  <motion.div
                    key={indicator.metric}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="rounded-lg border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-6"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-indigo-100 p-2">
                          <Brain className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {indicator.metric}
                          </h4>
                          <p className="text-slate-500 text-xs">
                            Last updated:{" "}
                            {indicator.lastUpdated.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {getTrendIcon(indicator.trend)}
                    </div>

                    <div className="mb-3">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-slate-600">Index Value</span>
                        <span className="font-bold text-indigo-700">
                          {indicator.value}
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                        <motion.div
                          className={`h-full ${
                            indicator.trend === "improving"
                              ? "bg-green-500"
                              : indicator.trend === "declining"
                                ? "bg-red-500"
                                : "bg-amber-500"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${indicator.value}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Badge
                        variant={
                          indicator.trend === "improving"
                            ? "success"
                            : indicator.trend === "declining"
                              ? "destructive"
                              : "warning"
                        }
                        className="text-xs capitalize"
                      >
                        {indicator.trend}
                      </Badge>
                      <span className="text-slate-600">
                        {indicator.trend === "improving" &&
                          "Positive progression detected"}
                        {indicator.trend === "stable" &&
                          "Maintaining baseline levels"}
                        {indicator.trend === "declining" &&
                          "Attention recommended"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Attention Span Analytics */}
              <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                  <Focus className="h-5 w-5 text-amber-600" />
                  Attention Span Analytics
                </h4>
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-amber-50 p-4 text-center">
                    <p className="font-bold text-3xl text-amber-700">
                      {profile.attentionSpan.duration}
                    </p>
                    <p className="text-slate-600 text-sm">Avg. Minutes</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <p className="font-bold text-3xl text-green-700">
                      {profile.attentionSpan.peakFocusTime}
                    </p>
                    <p className="text-slate-600 text-sm">Peak Minutes</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4 text-center">
                    <p className="font-bold text-3xl text-blue-700">
                      {profile.attentionSpan.focusQuality}%
                    </p>
                    <p className="text-slate-600 text-sm">Focus Quality</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="font-medium text-slate-900">
                    Distraction Triggers:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.attentionSpan.distractionTriggers.map(
                      (trigger, idx) => (
                        <Badge key={idx} variant="outline" className="text-sm">
                          {trigger}
                        </Badge>
                      ),
                    )}
                  </div>
                  <p className="mt-2 text-slate-600 text-sm">
                    Recovery time needed: {profile.attentionSpan.recoveryNeeded}{" "}
                    minutes between sessions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Optimal Learning Time Windows */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                Optimal Learning Time Windows
              </CardTitle>
              <CardDescription>
                Personalized schedule based on cognitive efficiency patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LearningTimeline windows={profile.optimalTimeWindows} />
            </CardContent>
          </Card>

          {/* Memory Retention Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Memory Retention Patterns
              </CardTitle>
              <CardDescription>
                Spaced repetition schedule optimized for your retention curve
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MemoryRetentionCurve patterns={profile.memoryPatterns} />
            </CardContent>
          </Card>

          {/* Summary Statistics */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="mb-1 text-slate-600 text-sm">Visual Learning</p>
                <p className="font-bold text-3xl text-indigo-600">
                  {
                    profile.cognitivePreferences.find(
                      (p) => p.type === "visual",
                    )?.strength
                  }
                  %
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="mb-1 text-slate-600 text-sm">Best Time</p>
                <p className="font-bold text-green-600 text-xl">
                  {profile.optimalTimeWindows[0]?.timeOfDay}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="mb-1 text-slate-600 text-sm">Attention Span</p>
                <p className="font-bold text-3xl text-amber-600">
                  {profile.attentionSpan.duration}m
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="mb-1 text-slate-600 text-sm">Social Preference</p>
                <p className="font-bold text-3xl text-purple-600">
                  {profile.socialPreference.social}%
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LearningDNAProfiles;
