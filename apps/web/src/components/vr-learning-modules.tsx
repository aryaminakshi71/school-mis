import { AnimatePresence, motion } from "framer-motion";
import {
  Box,
  CheckCircle,
  Clock,
  Compass,
  Glasses,
  Headphones,
  Layers,
  Monitor,
  Play,
  RefreshCw,
  ScanEye,
  Search,
  Smartphone,
  Star,
  Target,
  Users,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";

export type XRType =
  | "vr"
  | "ar"
  | "mr"
  | "360-video"
  | "3d-model"
  | "simulation"
  | "interactive-lab";
export type DifficultyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";
export type CompletionStatus =
  | "not-started"
  | "in-progress"
  | "completed"
  | "mastered";

export interface XRModule {
  id: string;
  title: string;
  description: string;
  type: XRType;
  subject: string;
  topic: string;
  gradeLevel: string;
  difficulty: DifficultyLevel;
  duration: number;
  thumbnail: string;
  previewUrl?: string;
  contentUrl: string;
  format: "webxr" | "unity-webgl" | "video" | "iframe" | "app-link";
  isDownloadable: boolean;
  fileSize?: number;
  requirements: XRRequirements;
  learningObjectives: string[];
  skills: string[];
  prerequisites: string[];
  rating: number;
  reviews: number;
  completions: number;
  avgTimeSpent: number;
  achievements: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface XRRequirements {
  headset?: string[];
  browser?: string[];
  os?: string[];
  minSpecs?: {
    memory?: string;
    graphics?: string;
    processor?: string;
  };
  controllers?: boolean;
  handTracking?: boolean;
  roomScale?: boolean;
  mobileCompatible: boolean;
  webCompatible: boolean;
}

export interface StudentProgress {
  studentId: string;
  moduleId: string;
  status: CompletionStatus;
  startedAt?: Date;
  completedAt?: Date;
  timeSpent: number;
  score?: number;
  achievements: string[];
  interactions: InteractionLog[];
  feedback?: ModuleFeedback;
}

export interface InteractionLog {
  timestamp: Date;
  type: "view" | "interaction" | "quiz" | "completion" | "achievement";
  details: string;
  duration?: number;
}

export interface ModuleFeedback {
  rating: number;
  immersion: number;
  educationalValue: number;
  easeOfUse: number;
  engagement: number;
  comments: string;
  wouldRecommend: boolean;
  improvements: string[];
  submittedAt: Date;
}

export interface XRAnalytics {
  moduleId: string;
  totalViews: number;
  uniqueStudents: number;
  avgCompletionRate: number;
  avgTimeSpent: number;
  avgRating: number;
  topInteractions: string[];
  commonIssues: string[];
  popularPaths: string[];
  retentionRate: number;
}

export interface VRDevice {
  id: string;
  name: string;
  type: "headset" | "controller" | "sensor" | "tablet" | "phone";
  model: string;
  status: "available" | "in-use" | "charging" | "maintenance" | "offline";
  location: string;
  lastUser?: string;
  batteryLevel?: number;
  checkoutTime?: Date;
  dueBack?: Date;
  condition: "excellent" | "good" | "fair" | "poor";
  specs: {
    resolution?: string;
    refreshRate?: string;
    fov?: string;
    tracking?: string;
  };
}

interface VRLearningModulesProps {
  userRole?: "student" | "teacher" | "admin" | "developer";
  userId?: string;
  onLaunchModule?: (moduleId: string) => Promise<void>;
  onTrackProgress?: (progress: Partial<StudentProgress>) => Promise<void>;
  onSubmitFeedback?: (
    moduleId: string,
    feedback: Omit<ModuleFeedback, "submittedAt">,
  ) => Promise<void>;
  onCheckoutDevice?: (deviceId: string, userId: string) => Promise<void>;
  onReturnDevice?: (deviceId: string) => Promise<void>;
}

export function VRLearningModules({
  userRole = "student",
  userId = "S001",
  onLaunchModule,
  onTrackProgress,
  onSubmitFeedback,
  onCheckoutDevice,
  onReturnDevice,
}: VRLearningModulesProps) {
  const [activeTab, setActiveTab] = useState<
    "browse" | "my-progress" | "devices" | "analytics"
  >("browse");
  const [selectedModule, setSelectedModule] = useState<XRModule | null>(null);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<XRType | "all">("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<
    DifficultyLevel | "all"
  >("all");
  const [isLaunching, setIsLaunching] = useState(false);

  const [modules] = useState<XRModule[]>([
    {
      id: "XR001",
      title: "Journey Through the Human Body",
      description:
        "Explore the human circulatory, respiratory, and digestive systems in immersive 3D. Navigate through blood vessels, observe cellular processes, and understand organ functions up close.",
      type: "vr",
      subject: "Biology",
      topic: "Human Anatomy",
      gradeLevel: "9-12",
      difficulty: "intermediate",
      duration: 45,
      thumbnail: "/xr/body-vr-thumb.jpg",
      previewUrl: "https://example.com/preview/body-vr",
      contentUrl: "https://xr.school.edu/modules/body-vr",
      format: "webxr",
      isDownloadable: true,
      fileSize: 156000000,
      requirements: {
        headset: ["Meta Quest 2/3", "Pico 4", "Web Browser"],
        browser: ["Chrome 90+", "Firefox 88+", "Edge 90+"],
        mobileCompatible: true,
        webCompatible: true,
        handTracking: true,
        controllers: true,
      },
      learningObjectives: [
        "Understand the structure and function of major organ systems",
        "Visualize cellular processes in 3D",
        "Navigate through anatomical structures",
      ],
      skills: [
        "Anatomical Visualization",
        "Systems Thinking",
        "Spatial Reasoning",
      ],
      prerequisites: [
        "Basic Biology Knowledge",
        "Cell Structure Understanding",
      ],
      rating: 4.8,
      reviews: 234,
      completions: 567,
      avgTimeSpent: 42,
      achievements: ["Cell Explorer", "Organ Navigator", "System Master"],
      createdBy: "Dr. Sarah Chen",
      createdAt: new Date(Date.now() - 7776000000),
      updatedAt: new Date(Date.now() - 2592000000),
      tags: ["biology", "anatomy", "medical", "interactive"],
    },
    {
      id: "XR002",
      title: "Ancient Rome: Walk the Streets",
      description:
        "Step back in time to Ancient Rome circa 100 AD. Explore the Colosseum, Forum, and Pantheon as they appeared in their prime. Interact with historical figures and experience daily Roman life.",
      type: "ar",
      subject: "History",
      topic: "Ancient Civilizations",
      gradeLevel: "6-12",
      difficulty: "beginner",
      duration: 30,
      thumbnail: "/xr/rome-ar-thumb.jpg",
      previewUrl: "https://example.com/preview/rome-ar",
      contentUrl: "https://xr.school.edu/modules/rome-ar",
      format: "webxr",
      isDownloadable: false,
      requirements: {
        browser: ["Chrome 90+", "Safari 14+", "ARKit/ARCore capable devices"],
        mobileCompatible: true,
        webCompatible: true,
        handTracking: false,
        controllers: false,
      },
      learningObjectives: [
        "Experience Ancient Roman architecture and urban planning",
        "Understand social structures and daily life",
        "Explore historical landmarks in context",
      ],
      skills: [
        "Historical Empathy",
        "Cultural Understanding",
        "Spatial Awareness",
      ],
      prerequisites: [],
      rating: 4.9,
      reviews: 412,
      completions: 892,
      avgTimeSpent: 28,
      achievements: ["Time Traveler", "Architect Admirer", "Roman Citizen"],
      createdBy: "Prof. Marcus Williams",
      createdAt: new Date(Date.now() - 15552000000),
      updatedAt: new Date(Date.now() - 5184000000),
      tags: ["history", "rome", "architecture", "cultural"],
    },
    {
      id: "XR003",
      title: "Virtual Chemistry Lab: Molecular Reactions",
      description:
        "Conduct chemistry experiments in a safe virtual environment. Mix chemicals, observe reactions at the molecular level, and understand bonding patterns through interactive 3D visualizations.",
      type: "simulation",
      subject: "Chemistry",
      topic: "Molecular Interactions",
      gradeLevel: "10-12",
      difficulty: "advanced",
      duration: 60,
      thumbnail: "/xr/chemistry-sim-thumb.jpg",
      contentUrl: "https://xr.school.edu/modules/chemistry-sim",
      format: "unity-webgl",
      isDownloadable: true,
      fileSize: 234000000,
      requirements: {
        browser: ["Chrome 90+", "Firefox 88+"],
        minSpecs: {
          memory: "8GB RAM",
          graphics: "WebGL 2.0 compatible",
          processor: "Intel i5 or equivalent",
        },
        mobileCompatible: false,
        webCompatible: true,
        handTracking: false,
        controllers: true,
      },
      learningObjectives: [
        "Visualize molecular structures in 3D",
        "Understand reaction mechanisms",
        "Practice lab safety procedures",
      ],
      skills: ["Lab Safety", "Molecular Visualization", "Chemical Reasoning"],
      prerequisites: ["Basic Chemistry", "Chemical Bonding Knowledge"],
      rating: 4.7,
      reviews: 189,
      completions: 423,
      avgTimeSpent: 55,
      achievements: ["Molecule Master", "Reaction Expert", "Safety Pro"],
      createdBy: "Dr. Emily Rodriguez",
      createdAt: new Date(Date.now() - 10368000000),
      updatedAt: new Date(Date.now() - 864000000),
      tags: ["chemistry", "lab", "simulation", "experiments"],
    },
    {
      id: "XR004",
      title: "Solar System Explorer 360°",
      description:
        "Take a virtual tour of our solar system. Visit each planet, explore moons, and witness cosmic phenomena. Includes real NASA data and imagery for an authentic space exploration experience.",
      type: "360-video",
      subject: "Astronomy",
      topic: "Solar System",
      gradeLevel: "4-12",
      difficulty: "beginner",
      duration: 25,
      thumbnail: "/xr/solar-360-thumb.jpg",
      contentUrl: "https://xr.school.edu/modules/solar-360",
      format: "video",
      isDownloadable: false,
      requirements: {
        headset: ["Any VR headset", "Cardboard", "Desktop/Phone"],
        mobileCompatible: true,
        webCompatible: true,
        handTracking: false,
        controllers: false,
      },
      learningObjectives: [
        "Identify planets and their characteristics",
        "Understand scale and distance in space",
        "Explore celestial bodies",
      ],
      skills: ["Spatial Scale Understanding", "Astronomical Knowledge"],
      prerequisites: [],
      rating: 4.6,
      reviews: 678,
      completions: 1456,
      avgTimeSpent: 22,
      achievements: ["Space Cadet", "Planet Walker", "Cosmic Explorer"],
      createdBy: "Astronomy Club",
      createdAt: new Date(Date.now() - 18144000000),
      updatedAt: new Date(Date.now() - 10368000000),
      tags: ["astronomy", "space", "nasa", "video"],
    },
    {
      id: "XR005",
      title: "Geometry in 3D: Interactive Shapes",
      description:
        "Manipulate 3D geometric shapes in augmented reality. Explore volumes, surface areas, and spatial relationships by interacting with floating geometric objects in your physical space.",
      type: "ar",
      subject: "Mathematics",
      topic: "Geometry",
      gradeLevel: "6-10",
      difficulty: "intermediate",
      duration: 20,
      thumbnail: "/xr/geometry-ar-thumb.jpg",
      contentUrl: "https://xr.school.edu/modules/geometry-ar",
      format: "webxr",
      isDownloadable: false,
      requirements: {
        browser: ["Chrome 90+", "Safari 14+"],
        mobileCompatible: true,
        webCompatible: true,
        handTracking: true,
        controllers: false,
      },
      learningObjectives: [
        "Visualize 3D geometric concepts",
        "Understand volume and surface area",
        "Explore spatial relationships",
      ],
      skills: [
        "Spatial Reasoning",
        "Geometric Visualization",
        "Mathematical Thinking",
      ],
      prerequisites: ["Basic Geometry Knowledge"],
      rating: 4.5,
      reviews: 345,
      completions: 789,
      avgTimeSpent: 18,
      achievements: ["Shape Shifter", "Volume Virtuoso", "Geometry Guru"],
      createdBy: "Math Department",
      createdAt: new Date(Date.now() - 12960000000),
      updatedAt: new Date(Date.now() - 4320000000),
      tags: ["mathematics", "geometry", "3d", "ar"],
    },
  ]);

  const [devices] = useState<VRDevice[]>([
    {
      id: "DEV001",
      name: "Meta Quest 3",
      type: "headset",
      model: "Quest 3 128GB",
      status: "available",
      location: "VR Lab - Charging Station 1",
      batteryLevel: 100,
      condition: "excellent",
      specs: {
        resolution: "4K+ Infinite Display",
        refreshRate: "90Hz/120Hz",
        fov: "110 degrees",
        tracking: "Inside-out 6DOF",
      },
    },
    {
      id: "DEV002",
      name: "Meta Quest 2",
      type: "headset",
      model: "Quest 2 128GB",
      status: "in-use",
      location: "VR Lab",
      lastUser: "S001",
      checkoutTime: new Date(Date.now() - 3600000),
      dueBack: new Date(Date.now() + 7200000),
      batteryLevel: 65,
      condition: "good",
      specs: {
        resolution: "1832 x 1920 per eye",
        refreshRate: "90Hz",
        fov: "100 degrees",
        tracking: "Inside-out 6DOF",
      },
    },
    {
      id: "DEV003",
      name: "Pico 4",
      type: "headset",
      model: "Pico 4 128GB",
      status: "charging",
      location: "VR Lab - Charging Station 2",
      batteryLevel: 45,
      condition: "excellent",
      specs: {
        resolution: "2160 x 2160 per eye",
        refreshRate: "90Hz",
        fov: "105 degrees",
        tracking: "Inside-out 6DOF",
      },
    },
  ]);

  const [progress] = useState<StudentProgress[]>([
    {
      studentId: "S001",
      moduleId: "XR001",
      status: "in-progress",
      startedAt: new Date(Date.now() - 86400000),
      timeSpent: 28,
      score: 78,
      achievements: ["Cell Explorer"],
      interactions: [
        {
          timestamp: new Date(Date.now() - 86400000),
          type: "view",
          details: "Started module",
        },
        {
          timestamp: new Date(Date.now() - 82800000),
          type: "interaction",
          details: "Explored circulatory system",
        },
        {
          timestamp: new Date(Date.now() - 79200000),
          type: "achievement",
          details: "Earned Cell Explorer badge",
        },
      ],
    },
    {
      studentId: "S001",
      moduleId: "XR002",
      status: "completed",
      startedAt: new Date(Date.now() - 172800000),
      completedAt: new Date(Date.now() - 165600000),
      timeSpent: 32,
      score: 95,
      achievements: ["Time Traveler", "Architect Admirer", "Roman Citizen"],
      interactions: [],
      feedback: {
        rating: 5,
        immersion: 5,
        educationalValue: 5,
        easeOfUse: 5,
        engagement: 5,
        comments:
          "Absolutely amazing! Felt like I was really there in Ancient Rome.",
        wouldRecommend: true,
        improvements: [],
        submittedAt: new Date(Date.now() - 160000000),
      },
    },
  ]);

  const [newFeedback, setNewFeedback] = useState<Partial<ModuleFeedback>>({
    rating: 5,
    immersion: 5,
    educationalValue: 5,
    easeOfUse: 5,
    engagement: 5,
    wouldRecommend: true,
  });

  const typeIcons: Record<XRType, any> = {
    vr: Glasses,
    ar: ScanEye,
    mr: Layers,
    "360-video": Video,
    "3d-model": Box,
    simulation: Target,
    "interactive-lab": Compass,
  };

  const typeLabels: Record<XRType, string> = {
    vr: "Virtual Reality",
    ar: "Augmented Reality",
    mr: "Mixed Reality",
    "360-video": "360° Video",
    "3d-model": "3D Model",
    simulation: "Simulation",
    "interactive-lab": "Interactive Lab",
  };

  const difficultyColors: Record<DifficultyLevel, string> = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-blue-100 text-blue-700",
    advanced: "bg-amber-100 text-amber-700",
    expert: "bg-red-100 text-red-700",
  };

  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || module.type === filterType;
    const matchesSubject =
      filterSubject === "all" || module.subject === filterSubject;
    const matchesDifficulty =
      filterDifficulty === "all" || module.difficulty === filterDifficulty;
    return matchesSearch && matchesType && matchesSubject && matchesDifficulty;
  });

  const subjects = Array.from(new Set(modules.map((m) => m.subject)));

  const handleLaunch = async () => {
    if (!selectedModule) return;

    setIsLaunching(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLaunching(false);
    setShowLaunchModal(false);

    window.open(selectedModule.contentUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <Glasses className="h-8 w-8 text-purple-600" />
            VR/AR Learning Modules
          </h2>
          <p className="mt-1 text-slate-600">
            Immersive educational experiences in virtual and augmented reality
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-200">
            <Monitor className="h-4 w-4" />
            Web Compatible
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-200">
            <Smartphone className="h-4 w-4" />
            Mobile AR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[
          {
            label: "Available Modules",
            value: modules.length,
            color: "bg-purple-500",
            icon: Box,
          },
          {
            label: "In Progress",
            value: progress.filter((p) => p.status === "in-progress").length,
            color: "bg-blue-500",
            icon: Clock,
          },
          {
            label: "Completed",
            value: progress.filter((p) => p.status === "completed").length,
            color: "bg-green-500",
            icon: CheckCircle,
          },
          {
            label: "Avg Rating",
            value: "4.7",
            color: "bg-amber-500",
            icon: Star,
          },
          {
            label: "VR Devices",
            value: devices.filter((d) => d.status === "available").length,
            color: "bg-pink-500",
            icon: Headphones,
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
          { id: "browse", label: "Browse Modules", icon: Box },
          { id: "my-progress", label: "My Progress", icon: Target },
          { id: "devices", label: "VR Devices", icon: Headphones },
          { id: "analytics", label: "Analytics", icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-purple-600 border-b-2 text-purple-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "browse" && (
        <>
          <div className="flex flex-wrap gap-4">
            <div className="relative min-w-[200px] flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-slate-400" />
              <input
                type="text"
                placeholder="Search VR/AR modules..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterType(e.target.value as any)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              {Object.entries(typeLabels).map(([type, label]) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={filterSubject}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterSubject(e.target.value)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <select
              value={filterDifficulty}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterDifficulty(e.target.value as any)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredModules.map((module) => {
                const Icon = typeIcons[module.type];
                return (
                  <motion.div
                    key={module.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-shadow hover:shadow-lg"
                  >
                    <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600">
                      <Icon className="h-16 w-16 text-white/80" />
                      <div className="absolute top-3 right-3 flex gap-2">
                        {module.requirements.mobileCompatible && (
                          <span className="rounded bg-white/20 px-2 py-1 text-white text-xs">
                            Mobile
                          </span>
                        )}
                        {module.requirements.webCompatible && (
                          <span className="rounded bg-white/20 px-2 py-1 text-white text-xs">
                            Web
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="mb-2 flex items-start justify-between">
                        <span className="rounded bg-purple-100 px-2 py-1 text-purple-700 text-xs">
                          {typeLabels[module.type]}
                        </span>
                        <span
                          className={`rounded px-2 py-1 text-xs ${difficultyColors[module.difficulty]}`}
                        >
                          {module.difficulty.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="mb-1 font-bold text-lg text-slate-900">
                        {module.title}
                      </h3>
                      <p className="mb-2 text-slate-600 text-sm">
                        {module.subject} • {module.gradeLevel}
                      </p>
                      <p className="mb-3 line-clamp-2 text-slate-700 text-sm">
                        {module.description}
                      </p>

                      <div className="mb-3 flex items-center gap-4 text-slate-500 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {module.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          {module.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {module.completions}
                        </span>
                      </div>

                      <div className="mb-3 flex flex-wrap gap-1">
                        {module.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedModule(module);
                          setShowLaunchModal(true);
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                      >
                        <Play className="h-4 w-4" />
                        Launch Experience
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </>
      )}

      {activeTab === "my-progress" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
              <h3 className="mb-4 font-semibold text-lg text-slate-900">
                Learning Statistics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-slate-600 text-sm">
                      Total Time in VR/AR
                    </span>
                    <span className="font-semibold text-slate-900">
                      {progress.reduce((sum, p) => sum + p.timeSpent, 0)} min
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-slate-600 text-sm">
                      Modules Completed
                    </span>
                    <span className="font-semibold text-slate-900">
                      {progress.filter((p) => p.status === "completed").length}{" "}
                      / {modules.length}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${(progress.filter((p) => p.status === "completed").length / modules.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-slate-600 text-sm">
                      Achievements Earned
                    </span>
                    <span className="font-semibold text-slate-900">
                      {progress.reduce(
                        (sum, p) => sum + p.achievements.length,
                        0,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
              <h3 className="mb-4 font-semibold text-lg text-slate-900">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {progress.slice(0, 3).map((p) => {
                  const module = modules.find((m) => m.id === p.moduleId);
                  return (
                    <div
                      key={p.moduleId}
                      className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          p.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {p.status === "completed" ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">
                          {module?.title}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {p.status === "completed"
                            ? `Completed ${p.completedAt?.toLocaleDateString()}`
                            : `In Progress - ${p.timeSpent} min`}
                        </p>
                      </div>
                      {p.score && (
                        <span className="font-semibold text-slate-900">
                          {p.score}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="border-slate-200 border-b bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">My Achievements</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                {progress
                  .flatMap((p) => p.achievements)
                  .map((achievement, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center"
                    >
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                        <Star className="h-6 w-6 text-amber-600" />
                      </div>
                      <p className="font-medium text-amber-900 text-sm">
                        {achievement}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "devices" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
            <h3 className="mb-2 font-semibold text-purple-900">
              VR Lab Information
            </h3>
            <p className="text-purple-700">
              Location: Science Building, Room 105
            </p>
            <p className="text-purple-700">Hours: Mon-Fri 8:00 AM - 6:00 PM</p>
            <p className="mt-2 text-purple-700">
              Check out devices for up to 3 hours at a time
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Headphones className="h-8 w-8 text-purple-600" />
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {device.name}
                      </h4>
                      <p className="text-slate-600 text-sm">{device.model}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      device.status === "available"
                        ? "bg-green-100 text-green-700"
                        : device.status === "in-use"
                          ? "bg-amber-100 text-amber-700"
                          : device.status === "charging"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {device.status.replace("-", " ").toUpperCase()}
                  </span>
                </div>

                {device.batteryLevel !== undefined && (
                  <div className="mb-4">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-slate-500 text-sm">Battery</span>
                      <span className="font-medium text-slate-900 text-sm">
                        {device.batteryLevel}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div
                        className={`h-2 rounded-full ${device.batteryLevel > 50 ? "bg-green-500" : device.batteryLevel > 20 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${device.batteryLevel}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <p className="text-slate-600">Location: {device.location}</p>
                  {device.lastUser && (
                    <p className="text-slate-600">
                      Current User: {device.lastUser}
                    </p>
                  )}
                  {device.dueBack && (
                    <p className="text-amber-600">
                      Due back: {device.dueBack.toLocaleTimeString()}
                    </p>
                  )}
                </div>

                {device.status === "available" && (
                  <button className="mt-4 w-full rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700">
                    Check Out Device
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {showLaunchModal && selectedModule && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowLaunchModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="relative h-48 bg-gradient-to-br from-purple-600 to-indigo-700">
              <div className="absolute inset-0 flex items-center justify-center">
                {(() => {
                  const Icon = typeIcons[selectedModule.type];
                  return <Icon className="h-20 w-20 text-white/30" />;
                })()}
              </div>
              <button
                onClick={() => setShowLaunchModal(false)}
                className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="-mt-8 p-6">
              <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
                <h3 className="mb-2 font-bold text-slate-900 text-xl">
                  {selectedModule.title}
                </h3>
                <p className="mb-4 text-slate-600">
                  {selectedModule.description}
                </p>

                <div className="mb-4 space-y-2">
                  <h4 className="font-semibold text-slate-900">
                    Learning Objectives
                  </h4>
                  <ul className="list-inside list-disc text-slate-600 text-sm">
                    {selectedModule.learningObjectives.map((obj, idx) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="mb-2 font-semibold text-slate-900">
                    Requirements
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedModule.requirements.headset && (
                      <span className="rounded bg-purple-100 px-2 py-1 text-purple-700 text-sm">
                        {selectedModule.requirements.headset[0]}
                      </span>
                    )}
                    {selectedModule.requirements.webCompatible && (
                      <span className="rounded bg-blue-100 px-2 py-1 text-blue-700 text-sm">
                        Web Browser
                      </span>
                    )}
                    {selectedModule.requirements.mobileCompatible && (
                      <span className="rounded bg-green-100 px-2 py-1 text-green-700 text-sm">
                        Mobile Compatible
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLaunch}
                disabled={isLaunching}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
              >
                {isLaunching ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Launching...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Launch {typeLabels[selectedModule.type]}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
