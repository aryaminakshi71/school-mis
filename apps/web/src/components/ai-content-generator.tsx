import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Code,
  Copy,
  Download,
  Edit3,
  Eye,
  FileQuestion,
  FileText,
  FileType,
  GraduationCap,
  History,
  LayoutTemplate,
  Loader2,
  Presentation,
  RotateCcw,
  Save,
  School,
  Send,
  Share2,
  Sparkles,
  Star,
  Target,
  Trash2,
  TrendingUp,
  User,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";

// Types
interface ContentType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

interface Template {
  id: string;
  name: string;
  type: string;
  description: string;
  thumbnail: string;
  rating: number;
  usageCount: number;
}

interface AISuggestion {
  id: string;
  text: string;
  category: string;
}

interface GeneratedContent {
  id: string;
  type: string;
  title: string;
  content: string;
  metadata: {
    subject: string;
    difficulty: string;
    learningStyle: string;
    gradeLevel: string;
    estimatedTime: string;
    wordCount: number;
  };
  quality: {
    overall: number;
    accuracy: number;
    engagement: number;
    difficulty: number;
    comprehensiveness: number;
  };
  createdAt: Date;
  version: number;
}

interface Version {
  id: string;
  version: number;
  createdAt: Date;
  changes: string;
  content: string;
}

// Mock Data
const contentTypes: ContentType[] = [
  {
    id: "lesson",
    name: "Lesson Plan",
    icon: <BookOpen className="h-5 w-5" />,
    description:
      "Create structured lesson plans with objectives and activities",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "quiz",
    name: "Quiz",
    icon: <FileQuestion className="h-5 w-5" />,
    description: "Generate quizzes with various question types",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "worksheet",
    name: "Worksheet",
    icon: <FileText className="h-5 w-5" />,
    description: "Create practice worksheets and exercises",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "presentation",
    name: "Presentation",
    icon: <Presentation className="h-5 w-5" />,
    description: "Build engaging presentation slides",
    color: "from-orange-500 to-red-500",
  },
];

const subjects = [
  "Mathematics",
  "Science",
  "English Language Arts",
  "History",
  "Geography",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Art",
  "Music",
  "Physical Education",
  "Foreign Languages",
  "Economics",
  "Psychology",
];

const difficultyLevels = [
  { id: "beginner", name: "Beginner", color: "bg-green-500" },
  { id: "intermediate", name: "Intermediate", color: "bg-yellow-500" },
  { id: "advanced", name: "Advanced", color: "bg-orange-500" },
  { id: "expert", name: "Expert", color: "bg-red-500" },
];

const learningStyles = [
  {
    id: "visual",
    name: "Visual",
    icon: <Eye className="h-4 w-4" />,
    description: "Learn through images and spatial understanding",
  },
  {
    id: "auditory",
    name: "Auditory",
    icon: <Brain className="h-4 w-4" />,
    description: "Learn through listening and discussions",
  },
  {
    id: "kinesthetic",
    name: "Kinesthetic",
    icon: <Zap className="h-4 w-4" />,
    description: "Learn through hands-on activities",
  },
  {
    id: "reading",
    name: "Reading/Writing",
    icon: <BookOpen className="h-4 w-4" />,
    description: "Learn through reading and note-taking",
  },
];

const gradeLevels = [
  "Kindergarten",
  "Elementary (1-5)",
  "Middle School (6-8)",
  "High School (9-12)",
  "Undergraduate",
  "Graduate",
];

const templates: Template[] = [
  {
    id: "1",
    name: "Interactive Science Lab",
    type: "lesson",
    description: "Hands-on science experiment with safety protocols",
    thumbnail: "🔬",
    rating: 4.8,
    usageCount: 1250,
  },
  {
    id: "2",
    name: "Math Problem Set",
    type: "worksheet",
    description: "Graduated difficulty math problems with solutions",
    thumbnail: "📐",
    rating: 4.6,
    usageCount: 980,
  },
  {
    id: "3",
    name: "Literature Analysis",
    type: "lesson",
    description: "Critical thinking questions for literature study",
    thumbnail: "📚",
    rating: 4.9,
    usageCount: 1500,
  },
  {
    id: "4",
    name: "Multiple Choice Quiz",
    type: "quiz",
    description: "Standardized test format with explanations",
    thumbnail: "✅",
    rating: 4.5,
    usageCount: 2100,
  },
  {
    id: "5",
    name: "Historical Timeline",
    type: "presentation",
    description: "Visual timeline with key events and figures",
    thumbnail: "📅",
    rating: 4.7,
    usageCount: 890,
  },
  {
    id: "6",
    name: "Coding Exercise",
    type: "worksheet",
    description: "Progressive programming challenges",
    thumbnail: "💻",
    rating: 4.8,
    usageCount: 750,
  },
];

const mockAISuggestions: AISuggestion[] = [
  { id: "1", text: "Introduction to Photosynthesis", category: "Biology" },
  {
    id: "2",
    text: "Quadratic Equations and Their Applications",
    category: "Mathematics",
  },
  {
    id: "3",
    text: "The French Revolution: Causes and Effects",
    category: "History",
  },
  {
    id: "4",
    text: "Basic Python Programming Concepts",
    category: "Computer Science",
  },
  {
    id: "5",
    text: "Atomic Structure and Periodic Table",
    category: "Chemistry",
  },
  { id: "6", text: "Shakespeare's Romeo and Juliet", category: "English" },
];

const mockGeneratedContent: GeneratedContent = {
  id: "content-1",
  type: "lesson",
  title: "Introduction to Photosynthesis",
  content: `<h1>Introduction to Photosynthesis</h1>

<h2>Learning Objectives</h2>
<ul>
  <li>Understand the basic process of photosynthesis</li>
  <li>Identify the reactants and products of photosynthesis</li>
  <li>Explain the importance of chlorophyll and chloroplasts</li>
  <li>Describe the role of photosynthesis in the ecosystem</li>
</ul>

<h2>Introduction (10 minutes)</h2>
<p>Photosynthesis is one of the most important biological processes on Earth. It is the process by which plants, algae, and some bacteria convert light energy into chemical energy stored in glucose. This process not only sustains plant life but also provides the oxygen we breathe and forms the foundation of most food chains on our planet.</p>

<h2>The Photosynthesis Equation</h2>
<div class="equation">
  <strong>6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂</strong>
</div>

<h2>Key Components</h2>
<h3>1. Chloroplasts</h3>
<p>Chloroplasts are the organelles where photosynthesis takes place. They contain chlorophyll, a green pigment that captures light energy.</p>

<h3>2. Light-Dependent Reactions</h3>
<p>Occur in the thylakoid membranes and convert light energy into ATP and NADPH.</p>

<h3>3. Light-Independent Reactions (Calvin Cycle)</h3>
<p>Take place in the stroma and use ATP and NADPH to convert CO₂ into glucose.</p>

<h2>Activities</h2>
<h3>Activity 1: Virtual Lab (15 minutes)</h3>
<p>Students will use an interactive simulation to observe how changing light intensity, CO₂ levels, and temperature affects the rate of photosynthesis.</p>

<h3>Activity 2: Diagram Drawing (10 minutes)</h3>
<p>Students will create a labeled diagram of a chloroplast showing where each stage of photosynthesis occurs.</p>

<h2>Assessment</h2>
<ol>
  <li>What are the three main ingredients needed for photosynthesis?</li>
  <li>Why is chlorophyll green?</li>
  <li>Explain the difference between light-dependent and light-independent reactions.</li>
  <li>How does photosynthesis benefit animals, including humans?</li>
</ol>

<h2>Extension</h2>
<p>Research C4 and CAM plants and explain how they have adapted to survive in hot, dry environments.</p>`,
  metadata: {
    subject: "Biology",
    difficulty: "intermediate",
    learningStyle: "visual",
    gradeLevel: "High School (9-12)",
    estimatedTime: "45 minutes",
    wordCount: 450,
  },
  quality: {
    overall: 92,
    accuracy: 95,
    engagement: 88,
    difficulty: 90,
    comprehensiveness: 94,
  },
  createdAt: new Date(),
  version: 1,
};

const mockVersions: Version[] = [
  {
    id: "v1",
    version: 1,
    createdAt: new Date(Date.now() - 86400000 * 2),
    changes: "Initial generation",
    content: "",
  },
  {
    id: "v2",
    version: 2,
    createdAt: new Date(Date.now() - 86400000),
    changes: "Added more activities and assessment questions",
    content: "",
  },
  {
    id: "v3",
    version: 3,
    createdAt: new Date(),
    changes: "Improved visual elements and added extension section",
    content: "",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
  hover: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 17 },
  },
};

export function AIContentGenerator() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [learningStyle, setLearningStyle] = useState<string[]>(["visual"]);
  const [gradeLevel, setGradeLevel] = useState("High School (9-12)");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const [activeTab, setActiveTab] = useState<
    "preview" | "edit" | "templates" | "versions" | "metrics"
  >("preview");
  const [editedContent, setEditedContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [showExportModal, setShowExportModal] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI content assistant. How can I help you create engaging educational content today?",
    },
  ]);

  const handleTopicChange = (value: string) => {
    setTopic(value);
    if (value.length > 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: AISuggestion) => {
    setTopic(suggestion.text);
    setSelectedSubject(suggestion.category);
    setShowSuggestions(false);
  };

  const toggleLearningStyle = (styleId: string) => {
    setLearningStyle((prev) =>
      prev.includes(styleId)
        ? prev.filter((s) => s !== styleId)
        : [...prev, styleId],
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setGeneratedContent(mockGeneratedContent);
    setEditedContent(mockGeneratedContent.content);
    setIsGenerating(false);
    setStep(3);
  };

  const handleExport = (format: string) => {
    // Export functionality placeholder
    setShowExportModal(false);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setChatHistory((prev) => [...prev, { role: "user", content: chatMessage }]);

    // Simulate AI response
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I can help you refine this content. Would you like me to add more interactive elements, adjust the difficulty level, or suggest additional assessment questions?",
        },
      ]);
    }, 1000);

    setChatMessage("");
  };

  const renderStep1 = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Content Type Selection */}
      <motion.div variants={itemVariants}>
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-2xl text-slate-800">
          <Sparkles className="h-6 w-6 text-purple-500" />
          Select Content Type
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {contentTypes.map((type) => (
            <motion.button
              key={type.id}
              variants={cardVariants}
              whileHover="hover"
              onClick={() => setSelectedType(type.id)}
              className={cn(
                "relative rounded-2xl border-2 p-6 text-left transition-all duration-300",
                selectedType === type.id
                  ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-200"
                  : "border-slate-200 bg-white hover:border-purple-300 hover:shadow-md",
              )}
            >
              <div
                className={cn(
                  "mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
                  type.color,
                )}
              >
                <div className="text-white">{type.icon}</div>
              </div>
              <h3 className="mb-1 font-semibold text-slate-800">{type.name}</h3>
              <p className="text-slate-500 text-sm">{type.description}</p>
              {selectedType === type.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500"
                >
                  <Check className="h-4 w-4 text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Subject & Topic */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="flex items-center gap-2 font-semibold text-2xl text-slate-800">
          <Target className="h-6 w-6 text-blue-500" />
          Subject & Topic
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-slate-700">
              Subject
            </Label>
            <div className="relative">
              <select
                id="subject"
                value={selectedSubject}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedSubject(e.target.value)
                }
                className="w-full cursor-pointer appearance-none rounded-xl border-2 border-slate-200 bg-white p-3 text-slate-700 transition-colors focus:border-purple-500 focus:outline-none"
              >
                <option value="">Select a subject...</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              <ChevronRight className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-4 h-5 w-5 rotate-90 text-slate-400" />
            </div>
          </div>

          <div className="relative space-y-2">
            <Label htmlFor="topic" className="text-slate-700">
              Topic
            </Label>
            <div className="relative">
              <Input
                id="topic"
                value={topic}
                onChange={(e) => handleTopicChange(e.target.value)}
                placeholder="Enter topic or learning objective..."
                className="w-full rounded-xl border-2 border-slate-200 bg-white p-3 pr-12 text-slate-700 transition-colors focus:border-purple-500 focus:outline-none"
              />
              <Wand2 className="-translate-y-1/2 absolute top-1/2 right-4 h-5 w-5 text-purple-500" />
            </div>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 left-0 z-20 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
                >
                  <div className="border-slate-100 border-b bg-gradient-to-r from-purple-50 to-pink-50 p-3">
                    <span className="flex items-center gap-2 font-medium text-purple-700 text-sm">
                      <Sparkles className="h-4 w-4" />
                      AI Suggestions
                    </span>
                  </div>
                  {mockAISuggestions
                    .filter(
                      (s) =>
                        s.text.toLowerCase().includes(topic.toLowerCase()) ||
                        s.category.toLowerCase().includes(topic.toLowerCase()),
                    )
                    .map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="group flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-slate-50"
                      >
                        <div>
                          <p className="font-medium text-slate-700 group-hover:text-purple-600">
                            {suggestion.text}
                          </p>
                          <p className="text-slate-500 text-sm">
                            {suggestion.category}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-purple-500" />
                      </button>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Difficulty & Grade Level */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="flex items-center gap-2 font-semibold text-2xl text-slate-800">
          <GraduationCap className="h-6 w-6 text-emerald-500" />
          Difficulty & Grade Level
        </h2>

        <div className="space-y-4">
          <div>
            <Label className="mb-3 block text-slate-700">
              Difficulty Level
            </Label>
            <div className="flex flex-wrap gap-3">
              {difficultyLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setDifficulty(level.id)}
                  className={cn(
                    "rounded-xl border-2 px-6 py-3 font-medium transition-all duration-300",
                    difficulty === level.id
                      ? "border-slate-800 bg-slate-800 text-white shadow-lg"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", level.color)} />
                    {level.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="grade" className="mb-3 block text-slate-700">
              Grade Level
            </Label>
            <div className="relative">
              <select
                id="grade"
                value={gradeLevel}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setGradeLevel(e.target.value)
                }
                className="w-full cursor-pointer appearance-none rounded-xl border-2 border-slate-200 bg-white p-3 text-slate-700 transition-colors focus:border-purple-500 focus:outline-none md:w-1/2"
              >
                {gradeLevels.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              <ChevronRight className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-4 h-5 w-5 rotate-90 text-slate-400 md:left-[calc(50%-2rem)]" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Learning Style */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="flex items-center gap-2 font-semibold text-2xl text-slate-800">
          <Brain className="h-6 w-6 text-pink-500" />
          Learning Style Preferences
        </h2>
        <p className="text-slate-600">
          Select one or more learning styles to customize the content
        </p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {learningStyles.map((style) => (
            <motion.button
              key={style.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleLearningStyle(style.id)}
              className={cn(
                "rounded-xl border-2 p-4 text-left transition-all duration-300",
                learningStyle.includes(style.id)
                  ? "border-pink-500 bg-pink-50"
                  : "border-slate-200 bg-white hover:border-pink-200",
              )}
            >
              <div
                className={cn(
                  "mb-2 flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  learningStyle.includes(style.id)
                    ? "bg-pink-500 text-white"
                    : "bg-slate-100 text-slate-600",
                )}
              >
                {style.icon}
              </div>
              <h4 className="mb-1 font-medium text-slate-800">{style.name}</h4>
              <p className="text-slate-500 text-xs">{style.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Template Selection */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold text-2xl text-slate-800">
            <LayoutTemplate className="h-6 w-6 text-orange-500" />
            Start from Template
          </h2>
          <span className="text-slate-500 text-sm">Optional</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ y: -4 }}
              onClick={() =>
                setSelectedTemplate(
                  selectedTemplate?.id === template.id ? null : template,
                )
              }
              className={cn(
                "cursor-pointer rounded-xl border-2 p-4 transition-all duration-300",
                selectedTemplate?.id === template.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-slate-200 bg-white hover:border-orange-200",
              )}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{template.thumbnail}</div>
                <div className="flex-1">
                  <h4 className="mb-1 font-semibold text-slate-800">
                    {template.name}
                  </h4>
                  <p className="mb-2 text-slate-500 text-sm">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 text-yellow-600">
                      <Star className="h-4 w-4 fill-current" />
                      {template.rating}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">
                      {template.usageCount.toLocaleString()} uses
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Generate Button */}
      <motion.div variants={itemVariants} className="pt-4">
        <Button
          onClick={() => setStep(2)}
          disabled={!selectedType || !topic}
          className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 font-semibold text-lg text-white shadow-lg shadow-purple-200 transition-all hover:shadow-purple-300 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
        >
          <Wand2 className="mr-2 h-5 w-5" />
          Continue to Preview
        </Button>
      </motion.div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Summary Card */}
      <Card className="border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Content Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="space-y-1">
            <p className="text-slate-500 text-sm">Type</p>
            <p className="font-semibold text-slate-800">
              {contentTypes.find((t) => t.id === selectedType)?.name}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 text-sm">Topic</p>
            <p className="font-semibold text-slate-800">{topic}</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 text-sm">Subject</p>
            <p className="font-semibold text-slate-800">{selectedSubject}</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 text-sm">Difficulty</p>
            <p className="font-semibold text-slate-800">
              {difficultyLevels.find((d) => d.id === difficulty)?.name}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Generation Preview */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-8 text-center">
          <div className="mx-auto max-w-md space-y-6">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-200">
              <Sparkles className="h-12 w-12 text-white" />
            </div>

            <div>
              <h3 className="mb-2 font-bold text-2xl text-slate-800">
                Ready to Generate
              </h3>
              <p className="text-slate-600">
                Our AI will create a comprehensive{" "}
                {contentTypes
                  .find((t) => t.id === selectedType)
                  ?.name.toLowerCase()}
                about <strong>{topic}</strong> tailored to{" "}
                {difficultyLevels
                  .find((d) => d.id === difficulty)
                  ?.name.toLowerCase()}{" "}
                {gradeLevel.toLowerCase()} students.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {learningStyle.map((style) => (
                <span
                  key={style}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700 text-sm shadow-sm"
                >
                  {learningStyles.find((l) => l.id === style)?.name}
                </span>
              ))}
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 font-semibold text-lg text-white shadow-lg transition-all hover:shadow-xl md:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Content
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(1)}
          className="rounded-xl border-2 border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Back to Configuration
        </Button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => {
    if (!generatedContent) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        {/* Header Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-2xl text-slate-800">
              {generatedContent.title}
            </h2>
            <span className="rounded-full bg-purple-100 px-3 py-1 font-medium text-purple-700 text-sm">
              v{generatedContent.version}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowExportModal(true)}
              className="rounded-xl border-2 border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={() => setChatOpen(true)}
              className="rounded-xl border-2 border-purple-300 px-4 py-2 font-medium text-purple-700 hover:bg-purple-50"
            >
              <Bot className="mr-2 h-4 w-4" />
              AI Assistant
            </Button>
            <Button className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 font-medium text-white shadow-md transition-all hover:shadow-lg">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-slate-200 border-b">
          {[
            { id: "preview", label: "Preview", icon: Eye },
            { id: "edit", label: "Edit", icon: Edit3 },
            { id: "templates", label: "Templates", icon: LayoutTemplate },
            { id: "versions", label: "Versions", icon: History },
            { id: "metrics", label: "Quality Metrics", icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "-mb-[2px] flex items-center gap-2 border-b-2 px-4 py-3 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-slate-500 hover:text-slate-700",
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-3"
            >
              {/* Main Content */}
              <div className="space-y-6 lg:col-span-2">
                <Card className="overflow-hidden border-2 border-slate-200">
                  <CardContent className="p-8">
                    <div
                      className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-li:text-slate-600 prose-p:text-slate-600 prose-strong:text-slate-800"
                      dangerouslySetInnerHTML={{
                        __html: generatedContent.content,
                      }}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Metadata */}
                <Card className="border-2 border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Content Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between border-slate-100 border-b py-2">
                      <span className="text-slate-500">Subject</span>
                      <span className="font-medium text-slate-800">
                        {generatedContent.metadata.subject}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-slate-100 border-b py-2">
                      <span className="text-slate-500">Grade Level</span>
                      <span className="font-medium text-slate-800">
                        {generatedContent.metadata.gradeLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-slate-100 border-b py-2">
                      <span className="text-slate-500">Difficulty</span>
                      <span className="font-medium text-slate-800 capitalize">
                        {generatedContent.metadata.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-slate-100 border-b py-2">
                      <span className="text-slate-500">Est. Time</span>
                      <span className="font-medium text-slate-800">
                        {generatedContent.metadata.estimatedTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500">Word Count</span>
                      <span className="font-medium text-slate-800">
                        {generatedContent.metadata.wordCount}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-2 border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Content
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === "edit" && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-2 border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Edit Content</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Undo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditedContent(generatedContent.content)}
                    >
                      Reset
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={editedContent}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setEditedContent(e.target.value)
                    }
                    className="h-[600px] w-full resize-none rounded-xl border-2 border-slate-200 bg-white p-4 font-mono text-slate-700 text-sm leading-relaxed focus:border-purple-500 focus:outline-none"
                    placeholder="Edit your content here..."
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-slate-500 text-sm">
                    {editedContent.length} characters
                  </p>
                  <Button
                    onClick={() => {
                      setGeneratedContent({
                        ...generatedContent,
                        content: editedContent,
                        version: generatedContent.version + 1,
                      });
                    }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {activeTab === "templates" && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer border-2 border-slate-200 transition-colors hover:border-orange-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-5xl">{template.thumbnail}</div>
                        <div className="flex-1">
                          <h3 className="mb-1 font-semibold text-slate-800">
                            {template.name}
                          </h3>
                          <p className="mb-3 text-slate-500 text-sm">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1 text-yellow-600">
                              <Star className="h-4 w-4 fill-current" />
                              {template.rating}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500">
                              {template.usageCount.toLocaleString()} uses
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "versions" && (
            <motion.div
              key="versions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle>Version History</CardTitle>
                  <CardDescription>
                    Track changes and restore previous versions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockVersions.map((version, index) => (
                    <div
                      key={version.id}
                      className={cn(
                        "flex items-center justify-between rounded-xl border-2 p-4",
                        index === 0
                          ? "border-purple-300 bg-purple-50"
                          : "border-slate-200 bg-white",
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                          v{version.version}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            Version {version.version}
                          </p>
                          <p className="text-slate-500 text-sm">
                            {version.changes}
                          </p>
                          <p className="mt-1 text-slate-400 text-xs">
                            {version.createdAt.toLocaleDateString()} at{" "}
                            {version.createdAt.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      {index !== 0 && (
                        <Button variant="outline" size="sm">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
                        </Button>
                      )}
                      {index === 0 && (
                        <span className="rounded-full bg-purple-500 px-3 py-1 font-medium text-sm text-white">
                          Current
                        </span>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "metrics" && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
            >
              {/* Overall Score */}
              <Card className="border-2 border-slate-200 md:col-span-2">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center gap-8 md:flex-row">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                      <span className="font-bold text-4xl text-white">
                        {generatedContent.quality.overall}
                      </span>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="mb-2 font-bold text-2xl text-slate-800">
                          Overall Quality Score
                        </h3>
                        <p className="text-slate-600">
                          This content has been analyzed across multiple
                          dimensions including accuracy, engagement, difficulty
                          calibration, and comprehensiveness.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.quality.overall >= 90 && (
                          <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700 text-sm">
                            Excellent
                          </span>
                        )}
                        <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 text-sm">
                          AI Generated
                        </span>
                        <span className="rounded-full bg-purple-100 px-3 py-1 font-medium text-purple-700 text-sm">
                          Peer Reviewed
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Metrics */}
              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-2xl text-slate-800">
                      {generatedContent.quality.accuracy}%
                    </span>
                    <span className="text-slate-500 text-sm">
                      Factual correctness
                    </span>
                  </div>
                  <Progress
                    value={generatedContent.quality.accuracy}
                    className="h-3"
                  />
                  <p className="text-slate-600 text-sm">
                    Content has been verified against educational standards and
                    curriculum requirements.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-2xl text-slate-800">
                      {generatedContent.quality.engagement}%
                    </span>
                    <span className="text-slate-500 text-sm">
                      Student interest
                    </span>
                  </div>
                  <Progress
                    value={generatedContent.quality.engagement}
                    className="h-3"
                  />
                  <p className="text-slate-600 text-sm">
                    Measures interactive elements, variety of activities, and
                    student appeal.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Difficulty
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-2xl text-slate-800">
                      {generatedContent.quality.difficulty}%
                    </span>
                    <span className="text-slate-500 text-sm">
                      Level calibration
                    </span>
                  </div>
                  <Progress
                    value={generatedContent.quality.difficulty}
                    className="h-3"
                  />
                  <p className="text-slate-600 text-sm">
                    Appropriate challenge level matched to grade and skill
                    requirements.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    Comprehensiveness
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-2xl text-slate-800">
                      {generatedContent.quality.comprehensiveness}%
                    </span>
                    <span className="text-slate-500 text-sm">
                      Topic coverage
                    </span>
                  </div>
                  <Progress
                    value={generatedContent.quality.comprehensiveness}
                    className="h-3"
                  />
                  <p className="text-slate-600 text-sm">
                    Depth and breadth of topic coverage including learning
                    objectives.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-30 border-slate-200 border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800 text-xl">
                  AI Content Generator
                </h1>
                <p className="text-slate-500 text-sm">
                  Create engaging educational content with AI
                </p>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="hidden items-center gap-2 md:flex">
              {[
                { id: 1, label: "Configure" },
                { id: 2, label: "Preview" },
                { id: 3, label: "Generate" },
              ].map((s) => (
                <div key={s.id} className="flex items-center">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full font-semibold text-sm transition-colors",
                      step >= s.id
                        ? "bg-purple-500 text-white"
                        : "bg-slate-200 text-slate-500",
                    )}
                  >
                    {s.id}
                  </div>
                  <span
                    className={cn(
                      "ml-2 hidden font-medium text-sm lg:block",
                      step >= s.id ? "text-slate-800" : "text-slate-400",
                    )}
                  >
                    {s.label}
                  </span>
                  {s.id < 3 && (
                    <ChevronRight className="mx-2 h-4 w-4 text-slate-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {renderStep1()}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {renderStep2()}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {renderStep3()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="border-slate-200 border-b p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-xl">
                    Export Content
                  </h3>
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-slate-100"
                  >
                    <X className="h-5 w-5 text-slate-500" />
                  </button>
                </div>
              </div>
              <div className="space-y-4 p-6">
                {[
                  {
                    id: "pdf",
                    name: "PDF Document",
                    icon: FileType,
                    description: "High-quality printable document",
                  },
                  {
                    id: "html",
                    name: "HTML File",
                    icon: Code,
                    description: "Web-ready format with styling",
                  },
                  {
                    id: "lms",
                    name: "LMS Package",
                    icon: School,
                    description: "SCORM-compatible for learning platforms",
                  },
                  {
                    id: "docx",
                    name: "Word Document",
                    icon: FileText,
                    description: "Editable Microsoft Word format",
                  },
                ].map((format) => (
                  <button
                    key={format.id}
                    onClick={() => handleExport(format.id)}
                    className="group flex w-full items-center gap-4 rounded-xl border-2 border-slate-200 p-4 text-left transition-all hover:border-purple-300 hover:bg-purple-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-purple-100">
                      <format.icon className="h-6 w-6 text-slate-600 group-hover:text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">
                        {format.name}
                      </h4>
                      <p className="text-slate-500 text-sm">
                        {format.description}
                      </p>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-slate-400 group-hover:text-purple-500" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Assistant */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center sm:p-8"
            onClick={() => setChatOpen(false)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="border-slate-200 border-b bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">AI Assistant</h3>
                      <p className="text-sm text-white/80">
                        Ask me anything about your content
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="h-96 space-y-4 overflow-y-auto bg-slate-50 p-4">
                {chatHistory.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "flex-row-reverse" : "",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                        message.role === "user"
                          ? "bg-purple-500"
                          : "bg-gradient-to-br from-purple-500 to-pink-500",
                      )}
                    >
                      {message.role === "user" ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl p-3",
                        message.role === "user"
                          ? "rounded-tr-none bg-purple-500 text-white"
                          : "rounded-tl-none bg-white text-slate-800 shadow-sm",
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <form
                onSubmit={handleChatSubmit}
                className="border-slate-200 border-t bg-white p-4"
              >
                <div className="flex gap-2">
                  <Input
                    value={chatMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setChatMessage(e.target.value)
                    }
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
