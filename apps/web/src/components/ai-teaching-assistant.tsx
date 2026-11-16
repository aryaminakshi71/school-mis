import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  Calculator,
  CheckCircle,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Edit3,
  FileText,
  Flame,
  FolderOpen,
  Globe,
  GraduationCap,
  Hash,
  Headphones,
  HelpCircle,
  History,
  Lightbulb,
  Link,
  Maximize2,
  MessageCircle,
  Mic,
  MicOff,
  MoreVertical,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Share2,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  TrendingUp,
  User,
  Users,
  X,
  ZoomIn,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  isStreaming?: boolean;
  feedback?: "positive" | "negative" | null;
  metadata?: {
    model?: string;
    tokens?: number;
    confidence?: number;
    citations?: string[];
  };
}

export interface Attachment {
  id: string;
  type: "image" | "document" | "equation" | "graph" | "audio";
  url: string;
  name: string;
  size: number;
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  topic: string;
  gradeLevel: string;
  duration: number;
  objectives: string[];
  materials: string[];
  sections: LessonSection[];
  assessment: string[];
  standards: string[];
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  aiGenerated: boolean;
  tags: string[];
  status: "draft" | "published" | "archived";
}

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  duration: number;
  activities: Activity[];
  resources: Resource[];
}

export interface Activity {
  id: string;
  type:
    | "discussion"
    | "quiz"
    | "hands-on"
    | "presentation"
    | "break"
    | "group-work";
  title: string;
  description: string;
  duration: number;
  materials?: string[];
}

export interface Resource {
  id: string;
  type: "video" | "pdf" | "link" | "image" | "interactive";
  title: string;
  url: string;
  description?: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  topics: Topic[];
  curriculumId: string;
  totalLessons: number;
  totalTopics: number;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  subtopics: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number;
  prerequisiteIds: string[];
}

export interface Explanation {
  id: string;
  topic: string;
  content: string;
  difficulty: "simple" | "moderate" | "detailed" | "advanced";
  examples: Example[];
  visualAids: VisualAid[];
  createdAt: Date;
}

export interface Example {
  id: string;
  title: string;
  problem: string;
  solution: string;
  explanation: string;
  type: "worked" | "practice" | "real-world" | "challenge";
}

export interface VisualAid {
  id: string;
  type: "diagram" | "graph" | "animation" | "video" | "interactive";
  title: string;
  description: string;
  url?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  subject: string | null;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  isArchived: boolean;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  relevance: number;
  lastUpdated: Date;
  author: string;
}

export interface AITeachingAssistantProps {
  studentId?: string;
  className?: string;
}

export interface VoiceInputState {
  isRecording: boolean;
  transcript: string;
  confidence: number;
  duration: number;
}

export interface SessionAnalytics {
  totalSessions: number;
  totalMessages: number;
  avgSessionLength: number;
  favoriteSubjects: { subject: string; count: number }[];
  questionsAsked: { topic: string; count: number }[];
  learningStreak: number;
  lastActiveDate: Date;
}

// ============================================================================
// Mock Data
// ============================================================================

const SUBJECTS: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    icon: "calculator",
    color: "#6366f1",
    curriculumId: "curr-001",
    totalLessons: 156,
    totalTopics: 42,
    topics: [
      {
        id: "algebra",
        name: "Algebra",
        description:
          "Study of mathematical symbols and rules for manipulating them",
        subtopics: [
          "Linear Equations",
          "Quadratic Equations",
          "Polynomials",
          "Factorization",
        ],
        difficulty: "intermediate",
        estimatedTime: 240,
        prerequisiteIds: [],
      },
      {
        id: "geometry",
        name: "Geometry",
        description: "Study of shapes, sizes, and properties of figures",
        subtopics: [
          "Triangles",
          "Circles",
          "Congruence",
          "Coordinate Geometry",
        ],
        difficulty: "intermediate",
        estimatedTime: 180,
        prerequisiteIds: ["algebra"],
      },
      {
        id: "calculus",
        name: "Calculus",
        description: "Study of continuous change",
        subtopics: ["Limits", "Derivatives", "Integrals", "Applications"],
        difficulty: "advanced",
        estimatedTime: 300,
        prerequisiteIds: ["algebra", "geometry"],
      },
    ],
  },
  {
    id: "physics",
    name: "Physics",
    icon: "atom",
    color: "#f59e0b",
    curriculumId: "curr-002",
    totalLessons: 128,
    totalTopics: 35,
    topics: [
      {
        id: "mechanics",
        name: "Mechanics",
        description: "Study of motion and forces",
        subtopics: ["Kinematics", "Dynamics", "Energy", "Momentum"],
        difficulty: "intermediate",
        estimatedTime: 200,
        prerequisiteIds: ["algebra"],
      },
      {
        id: "thermodynamics",
        name: "Thermodynamics",
        description: "Study of heat and energy transfer",
        subtopics: ["Laws of Thermodynamics", "Heat Transfer", "Entropy"],
        difficulty: "advanced",
        estimatedTime: 150,
        prerequisiteIds: ["mechanics"],
      },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: "flask",
    color: "#10b981",
    curriculumId: "curr-003",
    totalLessons: 144,
    totalTopics: 38,
    topics: [
      {
        id: "organic",
        name: "Organic Chemistry",
        description: "Study of carbon compounds",
        subtopics: [
          "Hydrocarbons",
          "Functional Groups",
          "Reactions",
          "Polymers",
        ],
        difficulty: "advanced",
        estimatedTime: 280,
        prerequisiteIds: [],
      },
      {
        id: "inorganic",
        name: "Inorganic Chemistry",
        description: "Study of non-carbon compounds",
        subtopics: [
          "Periodic Table",
          "Chemical Bonding",
          "Coordination Compounds",
        ],
        difficulty: "intermediate",
        estimatedTime: 180,
        prerequisiteIds: [],
      },
    ],
  },
  {
    id: "biology",
    name: "Biology",
    icon: "microscope",
    color: "#ec4899",
    curriculumId: "curr-004",
    totalLessons: 120,
    totalTopics: 32,
    topics: [
      {
        id: "genetics",
        name: "Genetics",
        description: "Study of heredity and variation",
        subtopics: ["DNA", "Genes", "Inheritance", "Mutations"],
        difficulty: "intermediate",
        estimatedTime: 160,
        prerequisiteIds: [],
      },
      {
        id: "evolution",
        name: "Evolution",
        description: "Study of biological change over time",
        subtopics: ["Natural Selection", "Speciation", "Adaptation"],
        difficulty: "intermediate",
        estimatedTime: 120,
        prerequisiteIds: ["genetics"],
      },
    ],
  },
  {
    id: "english",
    name: "English",
    icon: "book-text",
    color: "#8b5cf6",
    curriculumId: "curr-005",
    totalLessons: 98,
    totalTopics: 28,
    topics: [
      {
        id: "grammar",
        name: "Grammar",
        description: "Study of language structure",
        subtopics: [
          "Parts of Speech",
          "Tenses",
          "Sentence Structure",
          "Punctuation",
        ],
        difficulty: "beginner",
        estimatedTime: 140,
        prerequisiteIds: [],
      },
      {
        id: "literature",
        name: "Literature",
        description: "Study of written works",
        subtopics: ["Poetry", "Prose", "Drama", "Literary Devices"],
        difficulty: "intermediate",
        estimatedTime: 200,
        prerequisiteIds: [],
      },
    ],
  },
  {
    id: "history",
    name: "History",
    icon: "landmark",
    color: "#f97316",
    curriculumId: "curr-006",
    totalLessons: 86,
    totalTopics: 24,
    topics: [
      {
        id: "ancient",
        name: "Ancient Civilizations",
        description: "Study of early human societies",
        subtopics: ["Mesopotamia", "Egypt", "Greece", "Rome"],
        difficulty: "beginner",
        estimatedTime: 120,
        prerequisiteIds: [],
      },
    ],
  },
];

const MOCK_SESSIONS: ChatSession[] = [
  {
    id: "sess-1",
    title: "Quadratic Equations Help",
    subject: "Mathematics",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "How do I solve x² - 5x + 6 = 0?",
        timestamp: new Date("2024-01-15T10:30:00"),
      },
      {
        id: "msg-2",
        role: "assistant",
        content:
          "To solve x² - 5x + 6 = 0, you can factor it:\n\nx² - 5x + 6 = (x - 2)(x - 3) = 0\n\nTherefore, x = 2 or x = 3.\n\nYou can verify by substituting back: (2)² - 5(2) + 6 = 4 - 10 + 6 = 0 ✓",
        timestamp: new Date("2024-01-15T10:30:05"),
        metadata: {
          model: "GPT-4",
          tokens: 89,
          confidence: 0.98,
        },
      },
    ],
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-15T10:30:05"),
    isFavorite: true,
    isArchived: false,
  },
  {
    id: "sess-2",
    title: "Newton's Laws of Motion",
    subject: "Physics",
    messages: [
      {
        id: "msg-3",
        role: "user",
        content: "Can you explain Newton's three laws with examples?",
        timestamp: new Date("2024-01-14T14:20:00"),
      },
      {
        id: "msg-4",
        role: "assistant",
        content:
          "**Newton's Three Laws of Motion:**\n\n**1. First Law (Inertia):** An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.\n\n*Example:* A book stays on the table until you push it. A car keeps moving until brakes stop it.\n\n**2. Second Law:** F = ma (Force equals mass times acceleration)\n\n*Example:* A shopping cart is easier to push when empty (less mass) than when full.\n\n**3. Third Law:** For every action, there is an equal and opposite reaction.\n\n*Example:* When you jump, you push down on the ground, and the ground pushes you up.",
        timestamp: new Date("2024-01-14T14:20:08"),
        metadata: {
          model: "GPT-4",
          tokens: 156,
          confidence: 0.95,
        },
      },
    ],
    createdAt: new Date("2024-01-14T14:20:00"),
    updatedAt: new Date("2024-01-14T14:20:08"),
    isFavorite: false,
    isArchived: false,
  },
  {
    id: "sess-3",
    title: "Photosynthesis Process",
    subject: "Biology",
    messages: [
      {
        id: "msg-5",
        role: "user",
        content: "Explain the photosynthesis equation and process",
        timestamp: new Date("2024-01-13T09:15:00"),
      },
      {
        id: "msg-6",
        role: "assistant",
        content:
          "**Photosynthesis Equation:**\n\n6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\n\n**The Process (Two Stages):**\n\n**1. Light-Dependent Reactions (in Thylakoids):**\n- Light energy splits water (photolysis)\n- Produces ATP and NADPH\n- Releases oxygen as a byproduct\n\n**2. Calvin Cycle (in Stroma):**\n- Uses ATP and NADPH from Stage 1\n- Fixes CO₂ from the air\n- Produces glucose (sugar)\n\n**Key Points:**\n- Occurs in chloroplasts\n- Converts light energy to chemical energy\n- Essential for most life on Earth",
        timestamp: new Date("2024-01-13T09:15:06"),
        metadata: {
          model: "GPT-4",
          tokens: 142,
          confidence: 0.97,
        },
      },
    ],
    createdAt: new Date("2024-01-13T09:15:00"),
    updatedAt: new Date("2024-01-13T09:15:06"),
    isFavorite: true,
    isArchived: false,
  },
];

const KNOWLEDGE_BASE: KnowledgeBaseArticle[] = [
  {
    id: "kb-1",
    title: "Understanding Quadratic Functions",
    content:
      "A quadratic function is a polynomial function of degree 2, written in the form f(x) = ax² + bx + c where a ≠ 0...",
    category: "Mathematics",
    tags: ["algebra", "quadratics", "functions"],
    relevance: 0.95,
    lastUpdated: new Date("2024-01-10"),
    author: "Dr. Sarah Chen",
  },
  {
    id: "kb-2",
    title: "The Scientific Method Explained",
    content:
      "The scientific method is a systematic procedure for collecting and analyzing evidence...",
    category: "Science",
    tags: ["methodology", "research", "experiments"],
    relevance: 0.88,
    lastUpdated: new Date("2024-01-08"),
    author: "Prof. Michael Rivera",
  },
  {
    id: "kb-3",
    title: "Essay Writing: The Five-Paragraph Structure",
    content:
      "The five-paragraph essay is a format of essay having five paragraphs: one introductory paragraph...",
    category: "English",
    tags: ["writing", "essays", "composition"],
    relevance: 0.92,
    lastUpdated: new Date("2024-01-12"),
    author: "Ms. Emily Watson",
  },
];

const AI_RESPONSES: Record<string, string[]> = {
  math: [
    "Let's break this down step by step. First, identify what type of problem this is...",
    "Great question! Here's how to approach this using the [method name] method...",
    "This is a classic example of [concept]. Let me walk you through it...",
    "Think of it this way: [analogy]. Mathematically, this means...",
  ],
  physics: [
    "From a physics perspective, we need to consider [principle]...",
    "Let's apply Newton's laws / conservation of energy to this problem...",
    "This phenomenon can be explained by [theory/concept]...",
    "Imagine this scenario: [real-world example]...",
  ],
  chemistry: [
    "At the molecular level, what's happening is...",
    "Let's look at the chemical equation for this reaction...",
    "This follows the principle of [chemical law]...",
    "The key here is understanding electron configuration / bonding...",
  ],
  biology: [
    "Biologically speaking, this process involves...",
    "At the cellular level, here's what happens...",
    "From an evolutionary perspective...",
    "Think of the body as a system where...",
  ],
  english: [
    "From a literary analysis standpoint...",
    "The key grammatical concept here is...",
    "When analyzing this text, consider...",
    "A good essay structure would be...",
  ],
  general: [
    "That's an interesting question! Let me help you understand this...",
    "I'd be happy to explain this concept...",
    "Let me break this down into manageable parts...",
    "Here's a clear explanation with examples...",
  ],
};

// ============================================================================
// Component
// ============================================================================

export function AITeachingAssistant({ className }: AITeachingAssistantProps) {
  // State
  const [activeTab, setActiveTab] = useState<
    "chat" | "lesson-plans" | "history" | "knowledge"
  >("chat");
  const [currentSession, setCurrentSession] = useState<ChatSession>({
    id: "current",
    title: "New Conversation",
    subject: null,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
    isArchived: false,
  });
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [voiceInput, setVoiceInput] = useState<VoiceInputState>({
    isRecording: false,
    transcript: "",
    confidence: 0,
    duration: 0,
  });
  const [showKnowledgeSearch, setShowKnowledgeSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [knowledgeResults, setKnowledgeResults] = useState<
    KnowledgeBaseArticle[]
  >([]);
  const [sessionHistory, setSessionHistory] =
    useState<ChatSession[]>(MOCK_SESSIONS);
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [currentExplanation, setCurrentExplanation] =
    useState<Explanation | null>(null);
  const [analytics, setAnalytics] = useState<SessionAnalytics>({
    totalSessions: 24,
    totalMessages: 186,
    avgSessionLength: 12.5,
    favoriteSubjects: [
      { subject: "Mathematics", count: 8 },
      { subject: "Physics", count: 6 },
      { subject: "Chemistry", count: 5 },
    ],
    questionsAsked: [
      { topic: "Quadratic Equations", count: 12 },
      { topic: "Newton's Laws", count: 8 },
      { topic: "Chemical Bonding", count: 7 },
    ],
    learningStreak: 5,
    lastActiveDate: new Date(),
  });
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [showLessonPlanModal, setShowLessonPlanModal] = useState(false);
  const [selectedLessonPlan, setSelectedLessonPlan] =
    useState<LessonPlan | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const voiceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession.messages, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputMessage]);

  // Voice Input Simulation
  const startVoiceRecording = useCallback(() => {
    setVoiceInput({
      isRecording: true,
      transcript: "",
      confidence: 0,
      duration: 0,
    });

    let duration = 0;
    voiceIntervalRef.current = setInterval(() => {
      duration += 1;
      setVoiceInput((prev) => ({
        ...prev,
        duration,
        confidence: Math.min(0.95, prev.confidence + Math.random() * 0.1),
      }));
    }, 1000);

    // Simulate voice recognition completion after 5 seconds
    setTimeout(() => {
      if (voiceIntervalRef.current) {
        clearInterval(voiceIntervalRef.current);
      }
      const mockTranscripts = [
        "Explain how photosynthesis works in plants",
        "What's the difference between mitosis and meiosis?",
        "Help me solve this algebra problem step by step",
        "Explain Newton's third law with real examples",
      ];
      const randomTranscript =
        mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      setVoiceInput((prev) => ({
        ...prev,
        isRecording: false,
        transcript: randomTranscript,
        confidence: 0.87,
      }));
      setInputMessage(randomTranscript);
    }, 5000);
  }, []);

  const stopVoiceRecording = useCallback(() => {
    if (voiceIntervalRef.current) {
      clearInterval(voiceIntervalRef.current);
    }
    setVoiceInput((prev) => ({ ...prev, isRecording: false }));
  }, []);

  // Message Handling
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setCurrentSession((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      updatedAt: new Date(),
    }));

    setInputMessage("");
    setVoiceInput((prev) => ({ ...prev, transcript: "" }));
    setIsTyping(true);

    // Simulate AI response delay
    const responseDelay = 1500 + Math.random() * 1500;

    setTimeout(() => {
      const subjectKey = selectedSubject?.id || "general";
      const responses = AI_RESPONSES[subjectKey] || AI_RESPONSES.general;
      const baseResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const aiResponse: AIMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: generateAIResponse(userMessage.content, selectedSubject),
        timestamp: new Date(),
        metadata: {
          model: "EduGPT-4",
          tokens: Math.floor(Math.random() * 200) + 50,
          confidence: 0.9 + Math.random() * 0.09,
          citations: ["Textbook Chapter 4", "Curriculum Guide 2024"],
        },
      };

      setCurrentSession((prev) => ({
        ...prev,
        messages: [...prev.messages, aiResponse],
        updatedAt: new Date(),
      }));
      setIsTyping(false);
    }, responseDelay);
  }, [inputMessage, selectedSubject]);

  const generateAIResponse = (
    userQuestion: string,
    subject: Subject | null,
  ): string => {
    const subjectName = subject?.name || "general";

    const responses: Record<string, string> = {
      "how do": `Let me explain this step by step:\n\n1. **Understand the problem**: First, identify what you're being asked to find.\n\n2. **Identify the relevant concepts**: This relates to [key concept from ${subjectName}].\n\n3. **Apply the method**: Use the appropriate formula or technique.\n\n4. **Check your answer**: Verify that your solution makes sense.\n\nWould you like me to walk through a specific example?`,

      "what is": `**${userQuestion.replace(/what is/i, "").trim()}**\n\nThis is a fundamental concept in ${subjectName}. Here's a clear definition:\n\n[Definition with context]\n\n**Key characteristics:**\n• Point 1\n• Point 2\n• Point 3\n\n**Real-world example:** [Practical application]\n\nDo you want me to explore this deeper or provide practice problems?`,

      explain: `I'll break this down into understandable parts:\n\n## Overview\n[High-level explanation]\n\n## Key Components\n1. **First aspect**: Detailed explanation\n2. **Second aspect**: Detailed explanation\n3. **Third aspect**: Detailed explanation\n\n## Why It Matters\n[Connection to real-world applications or further learning]\n\nWould you like me to create a visual diagram or provide practice questions?`,

      solve: `Let's solve this together!\n\n**Given:** [Problem statement]\n\n**Step 1:** Identify what we know and what we need to find\n**Step 2:** Choose the appropriate method/formula\n**Step 3:** Apply the calculations\n**Step 4:** Verify the answer\n\n**Solution:**\n[Detailed working]\n\n**Answer:** [Final result]\n\nDo you understand each step? I can explain any part in more detail.`,

      difference: `Great question! Let me compare these concepts:\n\n| Aspect | Concept A | Concept B |\n|--------|-----------|-----------|\n| Definition | ... | ... |\n| Key Feature | ... | ... |\n| Example | ... | ... |\n\n**When to use each:**\n• Use Concept A when...\n• Use Concept B when...\n\nDoes this help clarify the distinction?`,

      default: `I'd be happy to help with that! Based on your question about **"${userQuestion}"**, here's what I can tell you:\n\n[Comprehensive explanation tailored to ${subjectName}]\n\n**Key points to remember:**\n• Important detail 1\n• Important detail 2\n• Important detail 3\n\n**Next steps:**\nWould you like me to:\n1. Provide practice problems?\n2. Create a study guide?\n3. Explain a related concept?\n4. Generate a visual diagram?`,
    };

    const lowerQuestion = userQuestion.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerQuestion.includes(key)) {
        return response;
      }
    }
    return responses.default;
  };

  // Knowledge Base Search
  const handleKnowledgeSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = KNOWLEDGE_BASE.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.toLowerCase()) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase()),
          ),
      );
      setKnowledgeResults(results);
    } else {
      setKnowledgeResults([]);
    }
  }, []);

  // Session Management
  const createNewSession = useCallback(() => {
    if (currentSession.messages.length > 0) {
      setSessionHistory((prev) => [currentSession, ...prev]);
    }
    setCurrentSession({
      id: `sess-${Date.now()}`,
      title: "New Conversation",
      subject: selectedSubject?.name || null,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false,
      isArchived: false,
    });
  }, [currentSession, selectedSubject]);

  const loadSession = useCallback((session: ChatSession) => {
    setCurrentSession(session);
    if (session.subject) {
      const subject = SUBJECTS.find((s) => s.name === session.subject);
      setSelectedSubject(subject || null);
    }
  }, []);

  const toggleFavorite = useCallback(
    (sessionId: string) => {
      setSessionHistory((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, isFavorite: !s.isFavorite } : s,
        ),
      );
      if (currentSession.id === sessionId) {
        setCurrentSession((prev) => ({
          ...prev,
          isFavorite: !prev.isFavorite,
        }));
      }
    },
    [currentSession.id],
  );

  const deleteSession = useCallback((sessionId: string) => {
    setSessionHistory((prev) => prev.filter((s) => s.id !== sessionId));
  }, []);

  // Lesson Plan Generation
  const generateLessonPlan = useCallback((subject: Subject, topic: Topic) => {
    const newPlan: LessonPlan = {
      id: `plan-${Date.now()}`,
      title: `Introduction to ${topic.name}`,
      subject: subject.name,
      topic: topic.name,
      gradeLevel: "10th Grade",
      duration: topic.estimatedTime,
      objectives: [
        `Understand the fundamental concepts of ${topic.name}`,
        `Apply ${topic.name} principles to solve problems`,
        `Analyze real-world applications of ${topic.name}`,
      ],
      materials: [
        "Textbook",
        "Presentation slides",
        "Practice worksheets",
        "Visual aids",
      ],
      sections: [
        {
          id: "sec-1",
          title: "Introduction",
          content: `Brief overview of ${topic.name} and its importance in ${subject.name}`,
          duration: 10,
          activities: [
            {
              id: "act-1",
              type: "discussion",
              title: "Hook Activity",
              description:
                "Engage students with a real-world scenario related to the topic",
              duration: 5,
            },
          ],
          resources: [
            {
              id: "res-1",
              type: "video",
              title: "Introduction Video",
              url: "#",
              description: "3-minute engaging video introducing the concept",
            },
          ],
        },
        {
          id: "sec-2",
          title: "Core Concepts",
          content: `Detailed explanation of ${topic.subtopics.join(", ")}`,
          duration: 20,
          activities: [
            {
              id: "act-2",
              type: "presentation",
              title: "Concept Presentation",
              description: "Interactive presentation with visual aids",
              duration: 15,
              materials: ["Presentation slides", "Whiteboard"],
            },
            {
              id: "act-3",
              type: "discussion",
              title: "Q&A Session",
              description: "Address student questions and clarify doubts",
              duration: 5,
            },
          ],
          resources: [
            {
              id: "res-2",
              type: "pdf",
              title: "Concept Notes",
              url: "#",
              description: "Detailed notes on core concepts",
            },
          ],
        },
        {
          id: "sec-3",
          title: "Practice & Application",
          content: "Guided practice problems and group activities",
          duration: 15,
          activities: [
            {
              id: "act-4",
              type: "hands-on",
              title: "Problem Solving",
              description:
                "Students work through practice problems with teacher guidance",
              duration: 10,
              materials: ["Worksheet", "Calculator"],
            },
            {
              id: "act-5",
              type: "group-work",
              title: "Group Discussion",
              description: "Peer learning and collaborative problem solving",
              duration: 5,
            },
          ],
          resources: [
            {
              id: "res-3",
              type: "interactive",
              title: "Practice Quiz",
              url: "#",
              description: "Interactive quiz for immediate feedback",
            },
          ],
        },
        {
          id: "sec-4",
          title: "Assessment & Wrap-up",
          content: "Quick assessment and summary of key takeaways",
          duration: 10,
          activities: [
            {
              id: "act-6",
              type: "quiz",
              title: "Exit Ticket",
              description: "Quick 3-question assessment to check understanding",
              duration: 5,
            },
            {
              id: "act-7",
              type: "break",
              title: "Summary",
              description: "Review key concepts and preview next lesson",
              duration: 5,
            },
          ],
          resources: [],
        },
      ],
      assessment: [
        "Formative: Observation during practice problems",
        "Summative: Exit ticket quiz",
        "Homework: Practice worksheet",
      ],
      standards: [
        "State Standard 10.MATH.1",
        "Common Core CCSS.MATH.CONTENT.HSA.CED.A.1",
      ],
      createdBy: "AI Teaching Assistant",
      createdAt: new Date(),
      lastModified: new Date(),
      aiGenerated: true,
      tags: [subject.name, topic.name, topic.difficulty, "AI-Generated"],
      status: "draft",
    };
    setLessonPlans((prev) => [newPlan, ...prev]);
    return newPlan;
  }, []);

  // Render Functions
  const renderTypingIndicator = () => (
    <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[#e8e4dc] bg-[#faf8f5] px-4 py-3">
      <div className="flex items-center gap-1">
        <div
          className="h-2 w-2 animate-bounce rounded-full bg-[#8b7355]"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="h-2 w-2 animate-bounce rounded-full bg-[#8b7355]"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="h-2 w-2 animate-bounce rounded-full bg-[#8b7355]"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <span className="ml-1 text-[#8b7355] text-xs">AI is thinking...</span>
    </div>
  );

  const renderMessage = (message: AIMessage, index: number) => {
    const isUser = message.role === "user";

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`flex max-w-[85%] gap-3 ${isUser ? "flex-row-reverse" : ""}`}
        >
          {/* Avatar */}
          <div
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl shadow-sm ${
              isUser
                ? "bg-gradient-to-br from-[#5d4e37] to-[#8b7355]"
                : "bg-gradient-to-br from-[#f4e4c1] to-[#e8d5a8]"
            }`}
          >
            {isUser ? (
              <User className="h-5 w-5 text-white" />
            ) : (
              <Brain className="h-5 w-5 text-[#5d4e37]" />
            )}
          </div>

          {/* Message Content */}
          <div className={`space-y-2 ${isUser ? "items-end" : ""}`}>
            <div
              className={`relative rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                isUser
                  ? "rounded-br-md bg-gradient-to-br from-[#5d4e37] to-[#8b7355] text-white"
                  : "rounded-bl-md border border-[#e8e4dc] bg-[#faf8f5] text-[#3d3229]"
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>

              {/* Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-2 rounded-lg bg-white/50 px-3 py-2 text-xs"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="max-w-[150px] truncate">
                        {attachment.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Metadata */}
              {message.metadata && !isUser && (
                <div className="mt-3 flex items-center gap-3 border-[#e8e4dc]/50 border-t pt-2 text-[#8b7355] text-xs">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {message.metadata.model}
                  </span>
                  <span>{message.metadata.tokens} tokens</span>
                  <span>
                    {Math.round((message.metadata.confidence || 0) * 100)}%
                    confidence
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!isUser && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setCurrentExplanation({
                      id: `exp-${Date.now()}`,
                      topic: "Detailed Explanation",
                      content: message.content,
                      difficulty: "detailed",
                      examples: [],
                      visualAids: [],
                      createdAt: new Date(),
                    })
                  }
                  className="rounded-lg p-1.5 text-[#8b7355] transition-colors hover:bg-[#f4e4c1]/30 hover:text-[#5d4e37]"
                  title="Expand explanation"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(message.content)}
                  className="rounded-lg p-1.5 text-[#8b7355] transition-colors hover:bg-[#f4e4c1]/30 hover:text-[#5d4e37]"
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {}}
                  className={`rounded-lg p-1.5 transition-colors ${
                    message.feedback === "positive"
                      ? "bg-green-50 text-green-600"
                      : "text-[#8b7355] hover:bg-[#f4e4c1]/30 hover:text-[#5d4e37]"
                  }`}
                  title="Helpful"
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {}}
                  className={`rounded-lg p-1.5 transition-colors ${
                    message.feedback === "negative"
                      ? "bg-red-50 text-red-600"
                      : "text-[#8b7355] hover:bg-[#f4e4c1]/30 hover:text-[#5d4e37]"
                  }`}
                  title="Not helpful"
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Timestamp */}
            <p
              className={`text-[#a89a8a] text-xs ${isUser ? "text-right" : ""}`}
            >
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div
      className={`min-h-screen bg-[#fdfbf7] text-[#3d3229] ${className || ""}`}
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Background Pattern */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235d4e37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1600px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f4e4c1] via-[#e8d5a8] to-[#d4c4a1] shadow-[#f4e4c1]/50 shadow-lg">
                <GraduationCap className="h-7 w-7 text-[#5d4e37]" />
              </div>
              <div>
                <h1 className="font-bold text-2xl text-[#3d3229] tracking-tight">
                  AI Teaching Assistant
                </h1>
                <p className="text-[#8b7355] text-sm">
                  Your personal learning companion • Available 24/7
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Analytics Badge */}
              <div className="flex items-center gap-2 rounded-xl border border-[#e8e4dc] bg-white px-4 py-2 shadow-sm">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-[#5d4e37] text-sm">
                  {analytics.learningStreak} day streak
                </span>
              </div>

              {/* Stats Summary */}
              <div className="hidden items-center gap-4 rounded-xl border border-[#e8e4dc] bg-white px-4 py-2 shadow-sm md:flex">
                <div className="flex items-center gap-1.5 text-[#8b7355] text-sm">
                  <MessageCircle className="h-4 w-4" />
                  <span className="font-medium text-[#5d4e37]">
                    {analytics.totalMessages}
                  </span>
                  <span>messages</span>
                </div>
                <div className="h-4 w-px bg-[#e8e4dc]" />
                <div className="flex items-center gap-1.5 text-[#8b7355] text-sm">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium text-[#5d4e37]">
                    {analytics.totalSessions}
                  </span>
                  <span>sessions</span>
                </div>
              </div>

              {/* Settings */}
              <button className="rounded-xl p-2.5 text-[#8b7355] shadow-sm transition-colors hover:bg-white hover:text-[#5d4e37]">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Sidebar - Navigation & Subject Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6 lg:col-span-3"
          >
            {/* Main Navigation */}
            <div className="rounded-2xl border border-[#e8e4dc] bg-white p-2 shadow-sm">
              <nav className="space-y-1">
                {[
                  { id: "chat", label: "Chat", icon: MessageCircle },
                  { id: "lesson-plans", label: "Lesson Plans", icon: BookOpen },
                  { id: "history", label: "History", icon: History },
                  { id: "knowledge", label: "Knowledge Base", icon: Lightbulb },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-sm transition-all ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-[#f4e4c1] to-[#e8d5a8] text-[#5d4e37] shadow-sm"
                        : "text-[#8b7355] hover:bg-[#fdfbf7] hover:text-[#5d4e37]"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                    {item.id === "history" && sessionHistory.length > 0 && (
                      <span className="ml-auto rounded-full bg-[#f4e4c1] px-2 py-0.5 text-[#5d4e37] text-xs">
                        {sessionHistory.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Subject Selector */}
            <div className="rounded-2xl border border-[#e8e4dc] bg-white p-4 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#5d4e37] text-sm">
                <FolderOpen className="h-4 w-4" />
                Select Subject
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedSubject(null)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                    !selectedSubject
                      ? "bg-[#f4e4c1] text-[#5d4e37]"
                      : "text-[#8b7355] hover:bg-[#fdfbf7]"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      !selectedSubject ? "bg-white" : "bg-[#f4e4c1]/50"
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                  </div>
                  <span className="flex-1 text-left">All Subjects</span>
                  {!selectedSubject && <CheckCircle className="h-4 w-4" />}
                </button>

                {SUBJECTS.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject)}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                      selectedSubject?.id === subject.id
                        ? "bg-[#f4e4c1] text-[#5d4e37]"
                        : "text-[#8b7355] hover:bg-[#fdfbf7]"
                    }`}
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor:
                          selectedSubject?.id === subject.id
                            ? "white"
                            : `${subject.color}15`,
                        color: subject.color,
                      }}
                    >
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{subject.name}</p>
                      <p className="text-xs opacity-70">
                        {subject.totalTopics} topics
                      </p>
                    </div>
                    {selectedSubject?.id === subject.id && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Quick Access */}
            {selectedSubject && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-2xl border border-[#e8e4dc] bg-white p-4 shadow-sm"
              >
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#5d4e37] text-sm">
                  <Hash className="h-4 w-4" />
                  {selectedSubject.name} Topics
                </h3>
                <div className="max-h-[300px] space-y-2 overflow-y-auto">
                  {selectedSubject.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="group cursor-pointer rounded-xl border border-transparent p-3 transition-colors hover:border-[#e8e4dc] hover:bg-[#fdfbf7]"
                      onClick={() => {
                        const plan = generateLessonPlan(selectedSubject, topic);
                        setSelectedLessonPlan(plan);
                        setShowLessonPlanModal(true);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-[#5d4e37] text-sm group-hover:text-[#8b6f47]">
                            {topic.name}
                          </p>
                          <p className="mt-1 line-clamp-2 text-[#8b7355] text-xs">
                            {topic.description}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs ${
                                topic.difficulty === "beginner"
                                  ? "bg-green-100 text-green-700"
                                  : topic.difficulty === "intermediate"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {topic.difficulty}
                            </span>
                            <span className="flex items-center gap-1 text-[#a89a8a] text-xs">
                              <Clock className="h-3 w-3" />
                              {Math.round(topic.estimatedTime / 60)}h
                            </span>
                          </div>
                        </div>
                        <button className="rounded-lg p-1.5 text-[#8b7355] opacity-0 transition-all hover:bg-[#f4e4c1] hover:text-[#5d4e37] group-hover:opacity-100">
                          <Sparkles className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Main Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6"
          >
            {activeTab === "chat" && (
              <div className="flex h-[calc(100vh-180px)] flex-col overflow-hidden rounded-2xl border border-[#e8e4dc] bg-white shadow-[#e8e4dc]/50 shadow-lg">
                {/* Chat Header */}
                <div className="flex items-center justify-between border-[#e8e4dc] border-b bg-gradient-to-r from-[#faf8f5] to-white px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f4e4c1] to-[#e8d5a8]">
                      <Brain className="h-5 w-5 text-[#5d4e37]" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-[#3d3229]">
                        {currentSession.title}
                      </h2>
                      <p className="text-[#8b7355] text-xs">
                        {selectedSubject
                          ? selectedSubject.name
                          : "General Learning Assistant"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={createNewSession}
                      className="flex items-center gap-2 rounded-xl bg-[#f4e4c1]/50 px-3 py-2 font-medium text-[#5d4e37] text-sm transition-colors hover:bg-[#f4e4c1]"
                    >
                      <Plus className="h-4 w-4" />
                      New Chat
                    </button>
                    <button
                      onClick={() => setShowKnowledgeSearch(true)}
                      className="rounded-xl p-2 text-[#8b7355] transition-colors hover:bg-[#f4e4c1]/50 hover:text-[#5d4e37]"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 space-y-6 overflow-y-auto bg-[#fdfbf7]/30 p-6">
                  {currentSession.messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f4e4c1] to-[#e8d5a8] shadow-[#f4e4c1]/30 shadow-lg">
                        <Sparkles className="h-10 w-10 text-[#5d4e37]" />
                      </div>
                      <h3 className="mb-3 font-semibold text-[#3d3229] text-xl">
                        Welcome to your AI Teaching Assistant
                      </h3>
                      <p className="mb-8 max-w-md text-[#8b7355] leading-relaxed">
                        I can help you with homework, explain complex concepts,
                        generate lesson plans, and guide your learning journey.
                        What would you like to learn today?
                      </p>

                      {/* Quick Actions */}
                      <div className="grid w-full max-w-md grid-cols-2 gap-3">
                        {[
                          {
                            icon: Calculator,
                            text: "Solve a math problem",
                            subject: "math",
                          },
                          {
                            icon: BookOpen,
                            text: "Explain a concept",
                            subject: "general",
                          },
                          {
                            icon: FileText,
                            text: "Generate study notes",
                            subject: "general",
                          },
                          {
                            icon: GraduationCap,
                            text: "Create lesson plan",
                            subject: "general",
                          },
                        ].map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              const subject = SUBJECTS.find(
                                (s) => s.id === action.subject,
                              );
                              if (subject) setSelectedSubject(subject);
                              setInputMessage(action.text);
                            }}
                            className="group flex items-center gap-3 rounded-xl border border-[#e8e4dc] bg-white p-4 text-left transition-all hover:border-[#d4c4a1] hover:bg-[#faf8f5]"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f4e4c1]/50 transition-colors group-hover:bg-[#f4e4c1]">
                              <action.icon className="h-5 w-5 text-[#5d4e37]" />
                            </div>
                            <span className="font-medium text-[#5d4e37] text-sm">
                              {action.text}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {currentSession.messages.map((message, index) =>
                        renderMessage(message, index),
                      )}
                      {isTyping && renderTypingIndicator()}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-[#e8e4dc] border-t bg-white p-4">
                  {/* Voice Recording Indicator */}
                  {voiceInput.isRecording && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-3 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500 delay-75" />
                          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500 delay-150" />
                        </div>
                        <span className="font-medium text-red-700 text-sm">
                          Recording... {voiceInput.duration}s
                        </span>
                      </div>
                      <button
                        onClick={stopVoiceRecording}
                        className="font-medium text-red-600 text-sm hover:text-red-800"
                      >
                        Stop
                      </button>
                    </motion.div>
                  )}

                  <div className="flex items-end gap-3">
                    {/* Voice Input Button */}
                    <button
                      onClick={
                        voiceInput.isRecording
                          ? stopVoiceRecording
                          : startVoiceRecording
                      }
                      className={`flex-shrink-0 rounded-xl p-3 transition-all ${
                        voiceInput.isRecording
                          ? "bg-red-100 text-red-600"
                          : "bg-[#f4e4c1]/50 text-[#8b7355] hover:bg-[#f4e4c1] hover:text-[#5d4e37]"
                      }`}
                    >
                      {voiceInput.isRecording ? (
                        <MicOff className="h-5 w-5" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </button>

                    {/* Text Input */}
                    <div className="relative flex-1">
                      <textarea
                        ref={textareaRef}
                        value={inputMessage}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setInputMessage(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Ask me anything about your studies..."
                        className="w-full resize-none rounded-xl border border-[#e8e4dc] bg-[#faf8f5] px-4 py-3 pr-12 text-[#3d3229] text-sm placeholder-[#a89a8a] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#d4c4a1]"
                        rows={1}
                        disabled={voiceInput.isRecording}
                      />
                      <button
                        onClick={() => setInputMessage("")}
                        className={`-translate-y-1/2 absolute top-1/2 right-3 p-1.5 text-[#a89a8a] transition-colors hover:text-[#8b7355] ${
                          !inputMessage ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Send Button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={
                        !inputMessage.trim() ||
                        isTyping ||
                        voiceInput.isRecording
                      }
                      className="flex-shrink-0 rounded-xl bg-gradient-to-br from-[#5d4e37] to-[#8b7355] p-3 text-white transition-all hover:shadow-[#5d4e37]/20 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isTyping ? (
                        <RefreshCw className="h-5 w-5 animate-spin" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-center text-[#a89a8a] text-xs">
                    Press Enter to send • Shift + Enter for new line
                  </p>
                </div>
              </div>
            )}

            {activeTab === "lesson-plans" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-[#3d3229] text-xl">
                    Lesson Plans
                  </h2>
                  <button
                    onClick={() => {
                      if (selectedSubject) {
                        const topic = selectedSubject.topics[0];
                        if (topic) {
                          const plan = generateLessonPlan(
                            selectedSubject,
                            topic,
                          );
                          setSelectedLessonPlan(plan);
                          setShowLessonPlanModal(true);
                        }
                      }
                    }}
                    disabled={!selectedSubject}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5d4e37] to-[#8b7355] px-4 py-2 font-medium text-sm text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate New Plan
                  </button>
                </div>

                {lessonPlans.length === 0 ? (
                  <div className="rounded-2xl border border-[#e8e4dc] bg-white p-12 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f4e4c1]/50">
                      <BookOpen className="h-8 w-8 text-[#8b7355]" />
                    </div>
                    <h3 className="mb-2 font-semibold text-[#3d3229] text-lg">
                      No lesson plans yet
                    </h3>
                    <p className="mx-auto mb-6 max-w-md text-[#8b7355] text-sm">
                      Select a subject and topic from the sidebar, then generate
                      AI-powered lesson plans tailored to your curriculum.
                    </p>
                    {!selectedSubject && (
                      <p className="text-[#a89a8a] text-sm">
                        Tip: Select a subject from the left sidebar to get
                        started
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {lessonPlans.map((plan) => (
                      <motion.div
                        key={plan.id}
                        layout
                        className="group cursor-pointer rounded-2xl border border-[#e8e4dc] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                        onClick={() => {
                          setSelectedLessonPlan(plan);
                          setShowLessonPlanModal(true);
                        }}
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <div className="mb-2 flex items-center gap-2">
                              <span className="rounded-full bg-[#f4e4c1] px-2 py-1 font-medium text-[#5d4e37] text-xs">
                                {plan.subject}
                              </span>
                              {plan.aiGenerated && (
                                <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-blue-700 text-xs">
                                  <Sparkles className="h-3 w-3" />
                                  AI
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-[#3d3229] transition-colors group-hover:text-[#8b6f47]">
                              {plan.title}
                            </h3>
                            <p className="text-[#8b7355] text-sm">
                              {plan.topic}
                            </p>
                          </div>
                          <button className="rounded-lg p-2 text-[#8b7355] opacity-0 transition-all hover:bg-[#f4e4c1] hover:text-[#5d4e37] group-hover:opacity-100">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mb-4 flex items-center gap-4 text-[#8b7355] text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {plan.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {plan.gradeLevel}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            {plan.sections.length} sections
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {plan.objectives.slice(0, 2).map((obj, idx) => (
                            <span
                              key={idx}
                              className="max-w-[150px] truncate rounded-lg bg-[#faf8f5] px-2 py-1 text-[#8b7355] text-xs"
                            >
                              {obj.slice(0, 30)}...
                            </span>
                          ))}
                          {plan.objectives.length > 2 && (
                            <span className="text-[#a89a8a] text-xs">
                              +{plan.objectives.length - 2} more
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-[#e8e4dc] border-t pt-4">
                          <span className="text-[#a89a8a] text-xs">
                            Created {plan.createdAt.toLocaleDateString()}
                          </span>
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              plan.status === "published"
                                ? "bg-green-100 text-green-700"
                                : plan.status === "draft"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {plan.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-[#3d3229] text-xl">
                    Chat History
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[#8b7355] text-sm">
                      {sessionHistory.length} sessions
                    </span>
                    <button
                      onClick={createNewSession}
                      className="flex items-center gap-2 rounded-xl bg-[#f4e4c1] px-3 py-2 font-medium text-[#5d4e37] text-sm transition-colors hover:bg-[#e8d5a8]"
                    >
                      <Plus className="h-4 w-4" />
                      New Session
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {sessionHistory.map((session) => (
                    <motion.div
                      key={session.id}
                      layout
                      className="group rounded-xl border border-[#e8e4dc] bg-white p-4 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => loadSession(session)}
                        >
                          <div className="mb-2 flex items-center gap-2">
                            {session.isFavorite && (
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            )}
                            <h3 className="font-semibold text-[#3d3229] transition-colors group-hover:text-[#8b6f47]">
                              {session.title}
                            </h3>
                            {session.subject && (
                              <span className="rounded-full bg-[#f4e4c1] px-2 py-0.5 text-[#5d4e37] text-xs">
                                {session.subject}
                              </span>
                            )}
                          </div>
                          <p className="mb-2 text-[#8b7355] text-sm">
                            {session.messages.length} messages • Last active{" "}
                            {session.updatedAt.toLocaleDateString()}
                          </p>
                          {session.messages.length > 0 && (
                            <p className="line-clamp-1 text-[#a89a8a] text-xs">
                              {session.messages[
                                session.messages.length - 1
                              ].content.slice(0, 100)}
                              ...
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => toggleFavorite(session.id)}
                            className="rounded-lg p-2 text-[#8b7355] transition-colors hover:bg-yellow-50 hover:text-yellow-500"
                          >
                            <Star
                              className={`h-4 w-4 ${session.isFavorite ? "fill-yellow-500 text-yellow-500" : ""}`}
                            />
                          </button>
                          <button
                            onClick={() => loadSession(session)}
                            className="rounded-lg p-2 text-[#8b7355] transition-colors hover:bg-[#f4e4c1] hover:text-[#5d4e37]"
                          >
                            <Maximize2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteSession(session.id)}
                            className="rounded-lg p-2 text-[#8b7355] transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {sessionHistory.length === 0 && (
                    <div className="py-12 text-center">
                      <History className="mx-auto mb-4 h-12 w-12 text-[#e8e4dc]" />
                      <p className="text-[#8b7355]">No chat history yet</p>
                      <p className="mt-1 text-[#a89a8a] text-sm">
                        Your conversations will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "knowledge" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#e8e4dc] bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f4e4c1] to-[#e8d5a8]">
                      <Search className="h-6 w-6 text-[#5d4e37]" />
                    </div>
                    <div>
                      <h2 className="font-bold text-[#3d3229] text-xl">
                        Knowledge Base
                      </h2>
                      <p className="text-[#8b7355] text-sm">
                        Search curriculum content, lesson materials, and
                        learning resources
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleKnowledgeSearch(e.target.value)}
                      placeholder="Search for topics, concepts, or resources..."
                      className="w-full rounded-xl border border-[#e8e4dc] bg-[#faf8f5] py-4 pr-4 pl-12 text-[#3d3229] placeholder-[#a89a8a] focus:outline-none focus:ring-2 focus:ring-[#d4c4a1]"
                    />
                    <Search className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 text-[#8b7355]" />
                  </div>

                  {searchQuery.length > 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4"
                    >
                      {knowledgeResults.length > 0 ? (
                        <div className="space-y-3">
                          <p className="mb-3 text-[#8b7355] text-sm">
                            Found {knowledgeResults.length} result
                            {knowledgeResults.length !== 1 ? "s" : ""}
                          </p>
                          {knowledgeResults.map((article) => (
                            <div
                              key={article.id}
                              className="cursor-pointer rounded-xl border border-[#e8e4dc] bg-[#faf8f5] p-4 transition-colors hover:border-[#d4c4a1]"
                            >
                              <div className="mb-2 flex items-start justify-between">
                                <h3 className="font-semibold text-[#3d3229]">
                                  {article.title}
                                </h3>
                                <span className="rounded-full bg-white px-2 py-1 text-[#8b7355] text-xs">
                                  {Math.round(article.relevance * 100)}% match
                                </span>
                              </div>
                              <p className="mb-3 line-clamp-2 text-[#8b7355] text-sm">
                                {article.content}
                              </p>
                              <div className="flex items-center gap-2">
                                {article.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full bg-white px-2 py-1 text-[#8b7355] text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center">
                          <HelpCircle className="mx-auto mb-3 h-12 w-12 text-[#e8e4dc]" />
                          <p className="text-[#8b7355]">No results found</p>
                          <p className="text-[#a89a8a] text-sm">
                            Try a different search term
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Popular Topics */}
                <div className="rounded-2xl border border-[#e8e4dc] bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#3d3229]">
                    <TrendingUp className="h-5 w-5 text-[#8b7355]" />
                    Popular Learning Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analytics.questionsAsked.map((item) => (
                      <button
                        key={item.topic}
                        className="rounded-full border border-[#e8e4dc] bg-[#faf8f5] px-4 py-2 text-[#5d4e37] text-sm transition-colors hover:border-[#d4c4a1] hover:bg-[#f4e4c1]"
                      >
                        {item.topic}
                        <span className="ml-2 text-[#8b7355] text-xs">
                          ({item.count})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Sidebar - Analytics & Quick Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 lg:col-span-3"
          >
            {/* Learning Analytics */}
            <div className="rounded-2xl border border-[#e8e4dc] bg-white p-5 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#3d3229]">
                <BarChart className="h-5 w-5 text-[#8b7355]" />
                Learning Analytics
              </h3>

              <div className="space-y-4">
                {/* Streak */}
                <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-red-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                    <Flame className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-orange-900">
                      {analytics.learningStreak} Days
                    </p>
                    <p className="text-orange-700 text-xs">Current streak</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#faf8f5] p-3">
                    <p className="font-bold text-2xl text-[#5d4e37]">
                      {analytics.totalSessions}
                    </p>
                    <p className="text-[#8b7355] text-xs">Total Sessions</p>
                  </div>
                  <div className="rounded-xl bg-[#faf8f5] p-3">
                    <p className="font-bold text-2xl text-[#5d4e37]">
                      {analytics.totalMessages}
                    </p>
                    <p className="text-[#8b7355] text-xs">Questions Asked</p>
                  </div>
                </div>

                {/* Subject Distribution */}
                <div>
                  <p className="mb-3 font-medium text-[#5d4e37] text-sm">
                    Favorite Subjects
                  </p>
                  <div className="space-y-2">
                    {analytics.favoriteSubjects.map((item) => (
                      <div
                        key={item.subject}
                        className="flex items-center gap-2"
                      >
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e8e4dc]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#f4e4c1] to-[#e8d5a8]"
                            style={{
                              width: `${(item.count / analytics.favoriteSubjects[0].count) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="w-20 truncate text-[#8b7355] text-xs">
                          {item.subject}
                        </span>
                        <span className="font-medium text-[#5d4e37] text-xs">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="rounded-2xl bg-gradient-to-br from-[#f4e4c1] to-[#e8d5a8] p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[#5d4e37]" />
                <h3 className="font-semibold text-[#5d4e37]">Pro Tips</h3>
              </div>
              <ul className="space-y-3 text-[#5d4e37] text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>Use voice input for quick questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>Select a subject for context-aware responses</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>Generate lesson plans from topics</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>Save important conversations to favorites</span>
                </li>
              </ul>
            </div>

            {/* Help & Support */}
            <div className="rounded-2xl border border-[#e8e4dc] bg-white p-5 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#3d3229]">
                <HelpCircle className="h-5 w-5 text-[#8b7355]" />
                Need Help?
              </h3>
              <div className="space-y-2">
                <button className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-[#faf8f5]">
                  <Headphones className="h-5 w-5 text-[#8b7355]" />
                  <span className="text-[#5d4e37] text-sm">
                    Contact Support
                  </span>
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-[#faf8f5]">
                  <BookOpen className="h-5 w-5 text-[#8b7355]" />
                  <span className="text-[#5d4e37] text-sm">
                    View Documentation
                  </span>
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-[#faf8f5]">
                  <Share2 className="h-5 w-5 text-[#8b7355]" />
                  <span className="text-[#5d4e37] text-sm">Share Feedback</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lesson Plan Modal */}
      <AnimatePresence>
        {showLessonPlanModal && selectedLessonPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setShowLessonPlanModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 flex items-start justify-between border-[#e8e4dc] border-b bg-white p-6">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-[#f4e4c1] px-2 py-1 font-medium text-[#5d4e37] text-xs">
                      {selectedLessonPlan.subject}
                    </span>
                    {selectedLessonPlan.aiGenerated && (
                      <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-blue-700 text-xs">
                        <Sparkles className="h-3 w-3" />
                        AI-Generated
                      </span>
                    )}
                  </div>
                  <h2 className="font-bold text-2xl text-[#3d3229]">
                    {selectedLessonPlan.title}
                  </h2>
                  <p className="mt-1 text-[#8b7355] text-sm">
                    {selectedLessonPlan.topic}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {}}
                    className="rounded-lg p-2 text-[#8b7355] transition-colors hover:bg-[#f4e4c1] hover:text-[#5d4e37]"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {}}
                    className="rounded-lg p-2 text-[#8b7355] transition-colors hover:bg-[#f4e4c1] hover:text-[#5d4e37]"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowLessonPlanModal(false)}
                    className="rounded-lg p-2 text-[#8b7355] transition-colors hover:bg-[#f4e4c1] hover:text-[#5d4e37]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="max-h-[calc(85vh-140px)] overflow-y-auto p-6">
                {/* Overview */}
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-[#faf8f5] p-4">
                    <p className="mb-1 text-[#8b7355] text-xs">Duration</p>
                    <p className="font-semibold text-[#3d3229]">
                      {selectedLessonPlan.duration} minutes
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#faf8f5] p-4">
                    <p className="mb-1 text-[#8b7355] text-xs">Grade Level</p>
                    <p className="font-semibold text-[#3d3229]">
                      {selectedLessonPlan.gradeLevel}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#faf8f5] p-4">
                    <p className="mb-1 text-[#8b7355] text-xs">Sections</p>
                    <p className="font-semibold text-[#3d3229]">
                      {selectedLessonPlan.sections.length}
                    </p>
                  </div>
                </div>

                {/* Objectives */}
                <div className="mb-6">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#3d3229]">
                    <Target className="h-5 w-5 text-[#8b7355]" />
                    Learning Objectives
                  </h3>
                  <ul className="space-y-2">
                    {selectedLessonPlan.objectives.map((objective, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-[#5d4e37] text-sm"
                      >
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Materials */}
                <div className="mb-6">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#3d3229]">
                    <FolderOpen className="h-5 w-5 text-[#8b7355]" />
                    Materials Needed
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLessonPlan.materials.map((material, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-[#f4e4c1]/30 px-3 py-1.5 text-[#5d4e37] text-sm"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sections */}
                <div className="mb-6">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#3d3229]">
                    <BookOpen className="h-5 w-5 text-[#8b7355]" />
                    Lesson Sections
                  </h3>
                  <div className="space-y-4">
                    {selectedLessonPlan.sections.map((section, idx) => (
                      <div
                        key={section.id}
                        className="rounded-xl border border-[#e8e4dc] p-4 transition-colors hover:border-[#d4c4a1]"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-semibold text-[#5d4e37]">
                            {idx + 1}. {section.title}
                          </h4>
                          <span className="flex items-center gap-1 text-[#8b7355] text-xs">
                            <Clock className="h-3 w-3" />
                            {section.duration} min
                          </span>
                        </div>
                        <p className="mb-3 text-[#8b7355] text-sm">
                          {section.content}
                        </p>

                        {section.activities.length > 0 && (
                          <div className="mb-3">
                            <p className="mb-2 font-medium text-[#5d4e37] text-xs">
                              Activities:
                            </p>
                            <div className="space-y-2">
                              {section.activities.map((activity) => (
                                <div
                                  key={activity.id}
                                  className="flex items-start gap-2 rounded-lg bg-[#faf8f5] p-2"
                                >
                                  <Play className="mt-0.5 h-4 w-4 text-[#8b7355]" />
                                  <div>
                                    <p className="font-medium text-[#5d4e37] text-sm">
                                      {activity.title}
                                    </p>
                                    <p className="text-[#8b7355] text-xs">
                                      {activity.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {section.resources.length > 0 && (
                          <div>
                            <p className="mb-2 font-medium text-[#5d4e37] text-xs">
                              Resources:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {section.resources.map((resource) => (
                                <button
                                  key={resource.id}
                                  className="flex items-center gap-1 rounded-lg border border-[#e8e4dc] bg-white px-3 py-1.5 text-[#5d4e37] text-sm transition-colors hover:border-[#d4c4a1]"
                                >
                                  <Link className="h-3 w-3" />
                                  {resource.title}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assessment */}
                <div className="mb-6">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#3d3229]">
                    <CheckCircle className="h-5 w-5 text-[#8b7355]" />
                    Assessment Methods
                  </h3>
                  <ul className="space-y-2">
                    {selectedLessonPlan.assessment.map((method, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-[#5d4e37] text-sm"
                      >
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#f4e4c1] font-medium text-[#5d4e37] text-xs">
                          {idx + 1}
                        </span>
                        {method}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Standards */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#3d3229]">
                    <GraduationCap className="h-5 w-5 text-[#8b7355]" />
                    Curriculum Standards
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLessonPlan.standards.map((standard, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700 text-sm"
                      >
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 flex items-center justify-between border-[#e8e4dc] border-t bg-white p-4">
                <div className="text-[#a89a8a] text-sm">
                  Created by {selectedLessonPlan.createdBy} on{" "}
                  {selectedLessonPlan.createdAt.toLocaleDateString()}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {}}
                    className="flex items-center gap-2 rounded-xl px-4 py-2 text-[#8b7355] transition-colors hover:bg-[#f4e4c1]/50"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {}}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5d4e37] to-[#8b7355] px-4 py-2 text-white transition-all hover:shadow-lg"
                  >
                    <Save className="h-4 w-4" />
                    Save Plan
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Additional Icon Components
function BarChart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function Target({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

// Export default
export default AITeachingAssistant;
