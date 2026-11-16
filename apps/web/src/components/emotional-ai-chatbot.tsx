import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  CloudRain,
  Frown,
  Headphones,
  Heart,
  History,
  Lightbulb,
  Lock,
  Meh,
  MessageCircle,
  Mic,
  Paperclip,
  Phone,
  Send,
  Shield,
  Smile,
  Sparkles,
  Sun,
  Target,
  Thermometer,
  TrendingUp,
  Unlock,
  User,
  Waves,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type EmotionType =
  | "joy"
  | "sadness"
  | "anxiety"
  | "anger"
  | "fear"
  | "neutral"
  | "stress"
  | "hope"
  | "confusion";

export type MessageSender = "user" | "ai" | "system";

export type CrisisLevel = "none" | "low" | "moderate" | "high" | "critical";

export interface EmotionData {
  type: EmotionType;
  intensity: number;
  confidence: number;
  timestamp: Date;
  triggers?: string[];
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  content: string;
  timestamp: Date;
  emotions?: EmotionData[];
  sentimentScore: number;
  isCrisis?: boolean;
  crisisLevel?: CrisisLevel;
  suggestedResponses?: string[];
  resources?: MentalHealthResource[];
  isAnonymous: boolean;
  sessionId: string;
  metadata?: {
    wordCount?: number;
    responseTime?: number;
    topicTags?: string[];
  };
}

export interface ConversationSession {
  id: string;
  userId: string;
  userName: string;
  startedAt: Date;
  endedAt?: Date;
  messages: ChatMessage[];
  emotionTimeline: EmotionData[];
  overallSentiment: number;
  crisisIncidents: number;
  topicsDiscussed: string[];
  isAnonymous: boolean;
  counselorAssigned?: string;
  status: "active" | "paused" | "completed" | "escalated";
  sessionGoal?: string;
  progressNotes?: string[];
}

export interface MentalHealthResource {
  id: string;
  title: string;
  type: "article" | "video" | "exercise" | "hotline" | "support-group" | "app";
  category: string;
  description: string;
  url?: string;
  estimatedTime?: string;
  crisisOnly?: boolean;
  tags: string[];
}

export interface EmotionMoodEntry {
  id: string;
  date: Date;
  overallMood: number;
  dominantEmotion: EmotionType;
  emotions: Record<EmotionType, number>;
  journalEntry?: string;
  stressLevel: number;
  energyLevel: number;
  sleepQuality?: number;
  notes?: string;
}

export interface CrisisProtocol {
  id: string;
  level: CrisisLevel;
  triggerKeywords: string[];
  autoResponse: string;
  actions: string[];
  resources: string[];
  notifyCounselor: boolean;
  requireImmediate: boolean;
}

interface EmotionalAIChatbotProps {
  userId?: string;
  userName?: string;
  userRole?: "student" | "counselor" | "admin";
  onSendMessage?: (
    message: Omit<ChatMessage, "id" | "timestamp">,
  ) => Promise<string>;
  onEscalateCrisis?: (sessionId: string, level: CrisisLevel) => Promise<void>;
  onRequestCounselor?: (sessionId: string) => Promise<void>;
  onLogMood?: (entry: Omit<EmotionMoodEntry, "id" | "date">) => Promise<void>;
  onExportChat?: (sessionId: string) => Promise<string>;
}

const emotionColors: Record<
  EmotionType,
  { bg: string; text: string; border: string; gradient: string }
> = {
  joy: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    gradient: "from-amber-400 to-orange-400",
  },
  sadness: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    gradient: "from-blue-400 to-indigo-400",
  },
  anxiety: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    gradient: "from-purple-400 to-violet-400",
  },
  anger: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    gradient: "from-red-400 to-rose-400",
  },
  fear: {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
    gradient: "from-slate-400 to-gray-400",
  },
  neutral: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    gradient: "from-teal-400 to-cyan-400",
  },
  stress: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    gradient: "from-orange-400 to-amber-400",
  },
  hope: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    gradient: "from-emerald-400 to-green-400",
  },
  confusion: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    gradient: "from-cyan-400 to-sky-400",
  },
};

const emotionIcons: Record<EmotionType, React.ElementType> = {
  joy: Smile,
  sadness: CloudRain,
  anxiety: Zap,
  anger: Thermometer,
  fear: AlertCircle,
  neutral: Wind,
  stress: Waves,
  hope: Sun,
  confusion: Lightbulb,
};

const crisisProtocols: CrisisProtocol[] = [
  {
    id: "CP1",
    level: "low",
    triggerKeywords: ["worried", "nervous", "unsure"],
    autoResponse:
      "I hear that you're feeling a bit uncertain. That's completely okay - many people feel this way. Would you like to explore what's on your mind?",
    actions: ["Provide supportive response", "Offer coping resources"],
    resources: ["Breathing exercises", "Anxiety management tips"],
    notifyCounselor: false,
    requireImmediate: false,
  },
  {
    id: "CP2",
    level: "moderate",
    triggerKeywords: ["stressed", "overwhelmed", "can't cope"],
    autoResponse:
      "It sounds like you're going through a really tough time right now. I'm here to listen and help. Would talking to a counselor be helpful for you?",
    actions: ["Escalate to counselor suggestion", "Provide crisis resources"],
    resources: [
      "Crisis hotline",
      "Counseling services",
      "Stress management techniques",
    ],
    notifyCounselor: true,
    requireImmediate: false,
  },
  {
    id: "CP3",
    level: "high",
    triggerKeywords: ["hurt myself", "suicide", "ending it", "no point"],
    autoResponse:
      "I'm really concerned about what you're sharing. Your safety is the most important thing right now. Please reach out to a crisis counselor immediately - they are trained to help.",
    actions: [
      "Immediate counselor notification",
      "Display crisis hotlines",
      "Suggest emergency services",
    ],
    resources: [
      "24/7 Crisis Hotline: 988",
      "Emergency Services: 911",
      "School Crisis Team",
    ],
    notifyCounselor: true,
    requireImmediate: true,
  },
  {
    id: "CP4",
    level: "critical",
    triggerKeywords: [
      "going to hurt myself",
      "kill myself",
      "end my life",
      "suicide plan",
    ],
    autoResponse:
      "This is an emergency situation. You are not alone, and help is available right now. Please call 988 (Suicide & Crisis Lifeline) or 911 immediately. Someone is always there to help you.",
    actions: [
      "Immediate emergency protocol",
      "Auto-notify crisis team",
      "Lock session for review",
    ],
    resources: ["Call 988 NOW", "Call 911", "Go to nearest emergency room"],
    notifyCounselor: true,
    requireImmediate: true,
  },
];

const mentalHealthResources: MentalHealthResource[] = [
  {
    id: "R1",
    title: "5-4-3-2-1 Grounding Technique",
    type: "exercise",
    category: "Anxiety Relief",
    description:
      "A simple mindfulness exercise to help you stay present during anxious moments.",
    estimatedTime: "5 minutes",
    tags: ["anxiety", "grounding", "mindfulness", "quick"],
  },
  {
    id: "R2",
    title: "Box Breathing Guide",
    type: "exercise",
    category: "Stress Management",
    description:
      "Learn the box breathing technique to calm your nervous system in stressful situations.",
    estimatedTime: "3 minutes",
    tags: ["breathing", "stress", "relaxation", "quick"],
  },
  {
    id: "R3",
    title: "Understanding Test Anxiety",
    type: "article",
    category: "Academic Stress",
    description: "Learn strategies to manage performance anxiety before exams.",
    estimatedTime: "8 minutes",
    tags: ["academic", "test-anxiety", "performance", "students"],
  },
  {
    id: "R4",
    title: "National Suicide Prevention Lifeline",
    type: "hotline",
    category: "Crisis Support",
    description: "24/7 free and confidential support for people in distress.",
    url: "tel:988",
    crisisOnly: true,
    tags: ["crisis", "24-7", "confidential", "suicide-prevention"],
  },
  {
    id: "R5",
    title: "Crisis Text Line",
    type: "hotline",
    category: "Crisis Support",
    description: "Text HOME to 741741 to connect with a Crisis Counselor.",
    crisisOnly: true,
    tags: ["crisis", "text", "24-7", "confidential"],
  },
  {
    id: "R6",
    title: "Mindfulness Meditation for Students",
    type: "video",
    category: "Mindfulness",
    description:
      "10-minute guided meditation specifically designed for students.",
    estimatedTime: "10 minutes",
    tags: ["meditation", "mindfulness", "stress-relief", "video"],
  },
  {
    id: "R7",
    title: "Sleep Hygiene Checklist",
    type: "article",
    category: "Sleep & Wellness",
    description: "Improve your sleep quality with these evidence-based tips.",
    estimatedTime: "5 minutes",
    tags: ["sleep", "wellness", "health", "checklist"],
  },
  {
    id: "R8",
    title: "Building Resilience",
    type: "article",
    category: "Personal Growth",
    description:
      "Learn how to bounce back from challenges and build emotional strength.",
    estimatedTime: "12 minutes",
    tags: ["resilience", "growth", "coping", "strength"],
  },
];

const suggestedResponses = [
  "I'm feeling overwhelmed with schoolwork",
  "I've been having trouble sleeping",
  "I had a fight with my friend",
  "I'm worried about my grades",
  "I feel anxious about the test tomorrow",
  "I need help managing stress",
  "I'm feeling sad lately",
  "I want to learn relaxation techniques",
];

export function EmotionalAIChatbot({
  userId = "S001",
  userName = "Alex",
  userRole = "student",
  onSendMessage,
  onEscalateCrisis,
  onRequestCounselor,
  onLogMood,
}: EmotionalAIChatbotProps) {
  const [activeTab, setActiveTab] = useState<
    "chat" | "mood" | "history" | "resources"
  >("chat");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [currentSession, setCurrentSession] = useState<ConversationSession>({
    id: `CS${Date.now()}`,
    userId,
    userName: isAnonymous ? "Anonymous" : userName,
    startedAt: new Date(),
    messages: [],
    emotionTimeline: [],
    overallSentiment: 0,
    crisisIncidents: 0,
    topicsDiscussed: [],
    isAnonymous,
    status: "active",
    sessionGoal: "General emotional support and check-in",
  });
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const [currentCrisisLevel, setCurrentCrisisLevel] =
    useState<CrisisLevel>("none");
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [selectedEmotion, setSelectedEmotion] =
    useState<EmotionType>("neutral");
  const [emotionIntensity, setEmotionIntensity] = useState(5);
  const [moodJournalEntry, setMoodJournalEntry] = useState("");
  const [pastSessions, setPastSessions] = useState<ConversationSession[]>([]);
  const [selectedPastSession, setSelectedPastSession] =
    useState<ConversationSession | null>(null);
  const [showResourcePanel, setShowResourcePanel] = useState(false);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [moodHistory] = useState<EmotionMoodEntry[]>([
    {
      id: "M001",
      date: new Date(Date.now() - 86400000),
      overallMood: 6,
      dominantEmotion: "anxiety",
      emotions: {
        joy: 4,
        sadness: 3,
        anxiety: 8,
        anger: 2,
        fear: 5,
        neutral: 5,
        stress: 7,
        hope: 6,
        confusion: 4,
      },
      stressLevel: 7,
      energyLevel: 5,
      sleepQuality: 6,
      journalEntry: "Feeling nervous about upcoming presentations",
    },
    {
      id: "M002",
      date: new Date(Date.now() - 172800000),
      overallMood: 7,
      dominantEmotion: "neutral",
      emotions: {
        joy: 6,
        sadness: 3,
        anxiety: 4,
        anger: 2,
        fear: 3,
        neutral: 7,
        stress: 5,
        hope: 7,
        confusion: 3,
      },
      stressLevel: 5,
      energyLevel: 7,
      sleepQuality: 7,
    },
    {
      id: "M003",
      date: new Date(Date.now() - 259200000),
      overallMood: 5,
      dominantEmotion: "sadness",
      emotions: {
        joy: 3,
        sadness: 7,
        anxiety: 6,
        anger: 3,
        fear: 4,
        neutral: 5,
        stress: 6,
        hope: 4,
        confusion: 5,
      },
      stressLevel: 6,
      energyLevel: 4,
      sleepQuality: 5,
      journalEntry: "Rough day, but talking to friends helped",
    },
    {
      id: "M004",
      date: new Date(Date.now() - 345600000),
      overallMood: 8,
      dominantEmotion: "joy",
      emotions: {
        joy: 8,
        sadness: 2,
        anxiety: 3,
        anger: 1,
        fear: 2,
        neutral: 5,
        stress: 3,
        hope: 8,
        confusion: 2,
      },
      stressLevel: 3,
      energyLevel: 8,
      sleepQuality: 8,
      journalEntry: "Great day! Finished project early",
    },
    {
      id: "M005",
      date: new Date(Date.now() - 432000000),
      overallMood: 6,
      dominantEmotion: "stress",
      emotions: {
        joy: 5,
        sadness: 4,
        anxiety: 6,
        anger: 4,
        fear: 4,
        neutral: 6,
        stress: 7,
        hope: 5,
        confusion: 5,
      },
      stressLevel: 7,
      energyLevel: 6,
      sleepQuality: 6,
    },
    {
      id: "M006",
      date: new Date(Date.now() - 518400000),
      overallMood: 7,
      dominantEmotion: "hope",
      emotions: {
        joy: 7,
        sadness: 2,
        anxiety: 4,
        anger: 1,
        fear: 2,
        neutral: 6,
        stress: 4,
        hope: 8,
        confusion: 3,
      },
      stressLevel: 4,
      energyLevel: 7,
      sleepQuality: 7,
      journalEntry: "Feeling optimistic about the week ahead",
    },
    {
      id: "M007",
      date: new Date(Date.now() - 604800000),
      overallMood: 5,
      dominantEmotion: "confusion",
      emotions: {
        joy: 4,
        sadness: 4,
        anxiety: 5,
        anger: 3,
        fear: 4,
        neutral: 5,
        stress: 5,
        hope: 5,
        confusion: 7,
      },
      stressLevel: 5,
      energyLevel: 5,
      sleepQuality: 6,
    },
  ]);

  const detectCrisisLevel = (text: string): CrisisLevel => {
    const lowerText = text.toLowerCase();

    for (const protocol of crisisProtocols) {
      if (protocol.level === "critical") {
        for (const keyword of protocol.triggerKeywords) {
          if (lowerText.includes(keyword)) return "critical";
        }
      }
    }

    for (const protocol of crisisProtocols) {
      if (protocol.level === "high") {
        for (const keyword of protocol.triggerKeywords) {
          if (lowerText.includes(keyword)) return "high";
        }
      }
    }

    for (const protocol of crisisProtocols) {
      if (protocol.level === "moderate") {
        for (const keyword of protocol.triggerKeywords) {
          if (lowerText.includes(keyword)) return "moderate";
        }
      }
    }

    for (const protocol of crisisProtocols) {
      if (protocol.level === "low") {
        for (const keyword of protocol.triggerKeywords) {
          if (lowerText.includes(keyword)) return "low";
        }
      }
    }

    return "none";
  };

  const analyzeEmotions = (text: string): EmotionData[] => {
    const emotions: EmotionData[] = [];
    const lowerText = text.toLowerCase();

    const emotionKeywords: Record<EmotionType, string[]> = {
      joy: [
        "happy",
        "excited",
        "great",
        "wonderful",
        "amazing",
        "good",
        "joy",
        "love",
        "fantastic",
      ],
      sadness: [
        "sad",
        "depressed",
        "down",
        "blue",
        "crying",
        "upset",
        "hurt",
        "grief",
        "loss",
      ],
      anxiety: [
        "anxious",
        "nervous",
        "worried",
        "stress",
        "panic",
        "fearful",
        "scared",
        "uneasy",
      ],
      anger: [
        "angry",
        "mad",
        "furious",
        "annoyed",
        "irritated",
        "frustrated",
        "rage",
        "hate",
      ],
      fear: [
        "afraid",
        "terrified",
        "scared",
        "frightened",
        "phobia",
        "dread",
        "horror",
      ],
      neutral: ["okay", "fine", "alright", "neutral", "normal", "average"],
      stress: [
        "overwhelmed",
        "pressure",
        "tense",
        "burned out",
        "exhausted",
        "strained",
      ],
      hope: [
        "hopeful",
        "optimistic",
        "confident",
        "positive",
        "looking forward",
        "believe",
      ],
      confusion: [
        "confused",
        "lost",
        "unclear",
        "unsure",
        "puzzled",
        "bewildered",
        "uncertain",
      ],
    };

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      let count = 0;
      for (const keyword of keywords) {
        const regex = new RegExp(keyword, "gi");
        const matches = lowerText.match(regex);
        if (matches) count += matches.length;
      }

      if (count > 0) {
        const intensity = Math.min(count * 2 + 3, 10);
        emotions.push({
          type: emotion as EmotionType,
          intensity,
          confidence: Math.min(0.5 + count * 0.1, 0.95),
          timestamp: new Date(),
        });
      }
    }

    if (emotions.length === 0) {
      emotions.push({
        type: "neutral",
        intensity: 5,
        confidence: 0.7,
        timestamp: new Date(),
      });
    }

    return emotions.sort((a, b) => b.intensity - a.intensity);
  };

  const generateAIResponse = (
    userMessage: string,
    crisisLevel: CrisisLevel,
    emotions: EmotionData[],
  ): string => {
    if (crisisLevel === "critical" || crisisLevel === "high") {
      const protocol = crisisProtocols.find((p) => p.level === crisisLevel);
      return (
        protocol?.autoResponse ||
        "I'm concerned about what you're sharing. Please reach out for immediate help."
      );
    }

    const dominantEmotion = emotions[0]?.type || "neutral";
    const responses: Record<EmotionType, string[]> = {
      joy: [
        "That's wonderful to hear! What's making you feel so positive today?",
        "I'm so glad you're feeling this way! Would you like to share more about what's going well?",
        "It's great that you're experiencing joy. These moments are worth celebrating!",
      ],
      sadness: [
        "I'm really sorry you're feeling this way. It's okay to feel sad, and I'm here to listen.",
        "Thank you for sharing that with me. Would you like to talk more about what's making you feel sad?",
        "I hear you, and your feelings are valid. Sometimes it helps to talk things through.",
      ],
      anxiety: [
        "I can hear the anxiety in your message. That's a difficult feeling to carry. Would you like to explore some coping strategies?",
        "Anxiety can be really challenging. You're not alone in this. What specifically is making you feel anxious?",
        "Thank you for trusting me with this. Let's work through these anxious feelings together.",
      ],
      anger: [
        "It sounds like something has really upset you. Your feelings are understandable.",
        "Anger is a natural emotion. Would talking about what happened help?",
        "I can sense your frustration. Sometimes it helps to take a breath and process what you're feeling.",
      ],
      fear: [
        "That sounds scary. It's brave of you to share this. What are you most afraid of right now?",
        "Fear can be overwhelming. I'm here to support you through this.",
        "Thank you for being open about your fears. We can work on strategies to help you feel safer.",
      ],
      neutral: [
        "Thank you for sharing. Is there anything specific on your mind today?",
        "I'm here to listen. How has your day been so far?",
        "Sometimes neutral feelings are a sign to check in with ourselves. What would be most helpful right now?",
      ],
      stress: [
        "Stress can really weigh us down. What's contributing to your stress right now?",
        "It sounds like you're carrying a lot. Would you like to explore ways to manage this stress?",
        "I hear you - stress is tough. Let's talk about what might help you feel more balanced.",
      ],
      hope: [
        "That's a beautiful perspective. Hope can be such a powerful force.",
        "I'm glad you're feeling hopeful! What's giving you this sense of optimism?",
        "Hope is so important. What are you looking forward to?",
      ],
      confusion: [
        "It's okay to feel confused - that often means we're grappling with something complex.",
        "Confusion can be frustrating. Would breaking things down help clarify what's unclear?",
        "Sometimes confusion is the first step to understanding. What specifically feels unclear?",
      ],
    };

    const emotionResponses = responses[dominantEmotion];
    return emotionResponses[
      Math.floor(Math.random() * emotionResponses.length)
    ];
  };

  const getSuggestedResponses = (lastMessage: string): string[] => {
    const crisisLevel = detectCrisisLevel(lastMessage);

    if (crisisLevel === "critical" || crisisLevel === "high") {
      return [
        "I need to talk to someone now",
        "Can you connect me with a counselor?",
        "Where can I get immediate help?",
      ];
    }

    if (crisisLevel === "moderate") {
      return [
        "Yes, I think talking to a counselor would help",
        "I'm not sure what to do",
        "Can you help me find resources?",
      ];
    }

    return suggestedResponses.slice(0, 4);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession.messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const crisisLevel = detectCrisisLevel(inputMessage);
    const emotions = analyzeEmotions(inputMessage);
    const sentimentScore =
      emotions.reduce((acc, e) => {
        const positiveEmotions = ["joy", "hope", "neutral"];
        const score = positiveEmotions.includes(e.type)
          ? e.intensity
          : -e.intensity;
        return acc + score;
      }, 0) / emotions.length;

    const userMessage: ChatMessage = {
      id: `M${Date.now()}`,
      sender: "user",
      content: inputMessage,
      timestamp: new Date(),
      emotions,
      sentimentScore,
      isCrisis: crisisLevel !== "none",
      crisisLevel,
      isAnonymous,
      sessionId: currentSession.id,
      metadata: {
        wordCount: inputMessage.split(" ").length,
        topicTags: emotions.map((e) => e.type),
      },
    };

    setCurrentSession((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      emotionTimeline: [...prev.emotionTimeline, ...emotions],
      overallSentiment:
        (prev.overallSentiment * prev.messages.length + sentimentScore) /
        (prev.messages.length + 1),
      crisisIncidents:
        crisisLevel !== "none"
          ? prev.crisisIncidents + 1
          : prev.crisisIncidents,
      topicsDiscussed: [
        ...new Set([...prev.topicsDiscussed, ...emotions.map((e) => e.type)]),
      ],
    }));

    setInputMessage("");
    setIsTyping(true);

    if (crisisLevel !== "none") {
      setCurrentCrisisLevel(crisisLevel);
      setShowCrisisAlert(true);

      if (crisisLevel === "critical" || crisisLevel === "high") {
        if (onEscalateCrisis) {
          await onEscalateCrisis(currentSession.id, crisisLevel);
        }
        setCurrentSession((prev) => ({ ...prev, status: "escalated" }));
      }
    }

    setTimeout(async () => {
      const aiResponse = generateAIResponse(
        inputMessage,
        crisisLevel,
        emotions,
      );
      const suggested = getSuggestedResponses(inputMessage);
      const relevantResources = mentalHealthResources
        .filter(
          (r) =>
            emotions.some((e) => r.tags.includes(e.type)) ||
            (crisisLevel !== "none" && r.crisisOnly),
        )
        .slice(0, 3);

      const aiMessage: ChatMessage = {
        id: `A${Date.now()}`,
        sender: "ai",
        content: aiResponse,
        timestamp: new Date(),
        sentimentScore: 0.6,
        suggestedResponses: suggested,
        resources: relevantResources,
        isAnonymous,
        sessionId: currentSession.id,
      };

      setCurrentSession((prev) => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
      }));

      setIsTyping(false);
    }, 1500);
  };

  const handleLogMood = async () => {
    const emotions: Record<EmotionType, number> = {
      joy: 5,
      sadness: 5,
      anxiety: 5,
      anger: 5,
      fear: 5,
      neutral: 5,
      stress: 5,
      hope: 5,
      confusion: 5,
    };
    emotions[selectedEmotion] = emotionIntensity;

    const entry: Omit<EmotionMoodEntry, "id" | "date"> = {
      overallMood: emotionIntensity,
      dominantEmotion: selectedEmotion,
      emotions,
      journalEntry: moodJournalEntry,
      stressLevel: Math.floor(Math.random() * 5) + 5,
      energyLevel: Math.floor(Math.random() * 5) + 5,
      sleepQuality: Math.floor(Math.random() * 5) + 5,
    };

    if (onLogMood) {
      await onLogMood(entry);
    }

    setShowMoodTracker(false);
    setMoodJournalEntry("");
    setEmotionIntensity(5);
    setSelectedEmotion("neutral");
  };

  const handleRequestCounselor = async () => {
    if (onRequestCounselor) {
      await onRequestCounselor(currentSession.id);
    }

    const systemMessage: ChatMessage = {
      id: `S${Date.now()}`,
      sender: "system",
      content:
        "A counselor has been notified and will join this conversation shortly. Please hold on - you're not alone.",
      timestamp: new Date(),
      sentimentScore: 0.5,
      isAnonymous,
      sessionId: currentSession.id,
    };

    setCurrentSession((prev) => ({
      ...prev,
      messages: [...prev.messages, systemMessage],
      counselorAssigned: "Pending Assignment",
      status: "escalated",
    }));
  };

  const getSentimentColor = (score: number) => {
    if (score >= 0.5) return "text-emerald-600";
    if (score >= 0) return "text-amber-600";
    if (score >= -0.3) return "text-orange-600";
    return "text-red-600";
  };

  const getSentimentBg = (score: number) => {
    if (score >= 0.5) return "bg-emerald-100";
    if (score >= 0) return "bg-amber-100";
    if (score >= -0.3) return "bg-orange-100";
    return "bg-red-100";
  };

  const getCrisisColor = (level: CrisisLevel) => {
    switch (level) {
      case "critical":
        return "bg-red-600 text-white";
      case "high":
        return "bg-red-500 text-white";
      case "moderate":
        return "bg-orange-500 text-white";
      case "low":
        return "bg-amber-500 text-white";
      default:
        return "bg-teal-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 font-sans">
      <div className="mx-auto max-w-7xl p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 shadow-lg shadow-teal-200">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-3xl text-slate-800">
                  Emotional AI Companion
                </h1>
                <p className="mt-1 text-slate-600">
                  A safe space to express, understand, and grow
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all ${
                  isAnonymous
                    ? "bg-slate-800 text-white shadow-lg shadow-slate-200"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-teal-300"
                }`}
              >
                {isAnonymous ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}
                <span className="font-medium text-sm">
                  {isAnonymous ? "Anonymous Mode" : "Identified"}
                </span>
              </button>

              <button
                onClick={() => setShowMoodTracker(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 px-4 py-2 text-white shadow-lg shadow-rose-200 transition-all hover:shadow-xl"
              >
                <Heart className="h-4 w-4" />
                <span className="font-medium text-sm">Log Mood</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-slate-100 border-b p-4">
                <h3 className="flex items-center gap-2 font-semibold text-slate-800">
                  <Sparkles className="h-4 w-4 text-teal-500" />
                  Navigation
                </h3>
              </div>
              <nav className="space-y-1 p-2">
                {[
                  { id: "chat", label: "Chat Session", icon: MessageCircle },
                  { id: "mood", label: "Mood Tracker", icon: TrendingUp },
                  { id: "history", label: "History", icon: History },
                  { id: "resources", label: "Resources", icon: BookOpen },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                      activeTab === tab.id
                        ? "border border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                    {tab.id === "chat" &&
                      currentSession.messages.length > 0 && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-teal-500" />
                      )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
                <Target className="h-4 w-4 text-teal-500" />
                Session Overview
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Status</span>
                  <span
                    className={`rounded-full px-2 py-1 font-medium text-xs ${
                      currentSession.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : currentSession.status === "escalated"
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {currentSession.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Messages</span>
                  <span className="font-medium text-slate-800">
                    {currentSession.messages.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Duration</span>
                  <span className="font-medium text-slate-800">
                    {Math.floor(
                      (Date.now() - currentSession.startedAt.getTime()) / 60000,
                    )}
                    m
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Sentiment</span>
                  <div
                    className={`flex items-center gap-1 rounded-full px-2 py-1 ${getSentimentBg(currentSession.overallSentiment)}`}
                  >
                    {currentSession.overallSentiment > 0 ? (
                      <Smile
                        className={`h-3 w-3 ${getSentimentColor(currentSession.overallSentiment)}`}
                      />
                    ) : currentSession.overallSentiment < -0.3 ? (
                      <Frown
                        className={`h-3 w-3 ${getSentimentColor(currentSession.overallSentiment)}`}
                      />
                    ) : (
                      <Meh
                        className={`h-3 w-3 ${getSentimentColor(currentSession.overallSentiment)}`}
                      />
                    )}
                    <span
                      className={`font-medium text-xs ${getSentimentColor(currentSession.overallSentiment)}`}
                    >
                      {currentSession.overallSentiment.toFixed(1)}
                    </span>
                  </div>
                </div>
                {currentSession.crisisIncidents > 0 && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium text-sm">
                        {currentSession.crisisIncidents} concern
                        {currentSession.crisisIncidents > 1 ? "s" : ""} flagged
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 p-4 text-white shadow-lg">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Headphones className="h-4 w-4" />
                Need Human Support?
              </h3>
              <p className="mb-4 text-sm text-teal-100">
                Connect with a licensed counselor anytime you need additional
                support.
              </p>
              <button
                onClick={handleRequestCounselor}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/20 py-2 font-medium text-sm backdrop-blur-sm transition-all hover:bg-white/30"
              >
                <User className="h-4 w-4" />
                Request Counselor
              </button>
            </div>
          </div>

          <div className="col-span-9">
            {activeTab === "chat" && (
              <div className="flex h-[calc(100vh-200px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                {showCrisisAlert && currentCrisisLevel !== "none" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`p-4 ${getCrisisColor(currentCrisisLevel)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6" />
                        <div>
                          <p className="font-semibold">
                            {currentCrisisLevel === "critical"
                              ? "Emergency Support Needed"
                              : currentCrisisLevel === "high"
                                ? "Crisis Support Available"
                                : "Additional Support Recommended"}
                          </p>
                          <p className="text-sm opacity-90">
                            {currentCrisisLevel === "critical"
                              ? "Please call 988 or 911 immediately. You matter."
                              : "A counselor has been notified and resources are available."}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {(currentCrisisLevel === "critical" ||
                          currentCrisisLevel === "high") && (
                          <a
                            href="tel:988"
                            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-red-600 text-sm transition-colors hover:bg-red-50"
                          >
                            <Phone className="h-4 w-4" />
                            Call 988
                          </a>
                        )}
                        <button
                          onClick={() => setShowCrisisAlert(false)}
                          className="rounded-lg p-2 transition-colors hover:bg-white/20"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {(currentCrisisLevel === "critical" ||
                      currentCrisisLevel === "high") && (
                      <div className="mt-4 flex gap-3">
                        <a
                          href="tel:911"
                          className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 font-medium text-sm transition-colors hover:bg-white/30"
                        >
                          <Phone className="h-4 w-4" />
                          Emergency: 911
                        </a>
                        <button className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 font-medium text-sm transition-colors hover:bg-white/30">
                          <Calendar className="h-4 w-4" />
                          Find Crisis Center
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                <div className="flex-1 space-y-4 overflow-y-auto p-6">
                  {currentSession.messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center"
                    >
                      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-cyan-100">
                        <Sparkles className="h-12 w-12 text-teal-600" />
                      </div>
                      <h3 className="mb-2 font-semibold text-slate-800 text-xl">
                        Welcome to Your Safe Space
                      </h3>
                      <p className="mx-auto mb-8 max-w-md text-slate-600">
                        I'm here to listen, support, and help you navigate your
                        feelings. Everything you share is confidential.
                      </p>

                      <div className="mx-auto max-w-lg">
                        <p className="mb-3 text-slate-500 text-sm">
                          Try saying:
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {suggestedResponses
                            .slice(0, 5)
                            .map((response, idx) => (
                              <button
                                key={idx}
                                onClick={() => setInputMessage(response)}
                                className="rounded-full bg-slate-100 px-4 py-2 text-slate-700 text-sm transition-all hover:bg-teal-50 hover:text-teal-700"
                              >
                                {response}
                              </button>
                            ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {currentSession.messages.map((message, idx) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            message.sender === "user"
                              ? "items-end"
                              : "items-start"
                          }`}
                        >
                          <div
                            className={`flex items-start gap-3 ${
                              message.sender === "user"
                                ? "flex-row-reverse"
                                : ""
                            }`}
                          >
                            <div
                              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                                message.sender === "user"
                                  ? "bg-gradient-to-br from-teal-400 to-cyan-500"
                                  : message.sender === "ai"
                                    ? "bg-gradient-to-br from-violet-400 to-purple-500"
                                    : "bg-gradient-to-br from-amber-400 to-orange-500"
                              }`}
                            >
                              {message.sender === "user" ? (
                                <User className="h-5 w-5 text-white" />
                              ) : message.sender === "ai" ? (
                                <Brain className="h-5 w-5 text-white" />
                              ) : (
                                <Shield className="h-5 w-5 text-white" />
                              )}
                            </div>

                            <div
                              className={`rounded-2xl p-4 ${
                                message.sender === "user"
                                  ? "rounded-br-md bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                                  : message.sender === "ai"
                                    ? "rounded-bl-md border border-slate-200 bg-white text-slate-800 shadow-sm"
                                    : "rounded-bl-md border border-amber-200 bg-amber-50 text-amber-800"
                              }`}
                            >
                              <p className="leading-relaxed">
                                {message.content}
                              </p>

                              {message.emotions &&
                                message.emotions.length > 0 &&
                                message.sender === "user" && (
                                  <div className="mt-3 flex flex-wrap gap-1">
                                    {message.emotions
                                      .slice(0, 2)
                                      .map((emotion, eIdx) => {
                                        const EmotionIcon =
                                          emotionIcons[emotion.type];
                                        return (
                                          <span
                                            key={eIdx}
                                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                                              message.sender === "user"
                                                ? "bg-white/20 text-white"
                                                : `${emotionColors[emotion.type].bg} ${emotionColors[emotion.type].text}`
                                            }`}
                                          >
                                            <EmotionIcon className="h-3 w-3" />
                                            {emotion.type} ({emotion.intensity}
                                            /10)
                                          </span>
                                        );
                                      })}
                                  </div>
                                )}

                              {message.isCrisis && message.crisisLevel && (
                                <div
                                  className={`mt-3 rounded-lg p-2 ${
                                    message.crisisLevel === "critical" ||
                                    message.crisisLevel === "high"
                                      ? "border border-red-300 bg-red-100/50"
                                      : "border border-amber-300 bg-amber-100/50"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 text-xs">
                                    <AlertTriangle className="h-3 w-3" />
                                    <span className="font-medium">
                                      {message.crisisLevel
                                        .charAt(0)
                                        .toUpperCase() +
                                        message.crisisLevel.slice(1)}{" "}
                                      priority
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div
                            className={`mt-1 flex items-center gap-2 text-slate-400 text-xs ${
                              message.sender === "user" ? "justify-end" : ""
                            }`}
                          >
                            <span>
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {message.isAnonymous && (
                              <span className="flex items-center gap-1">
                                <Lock className="h-3 w-3" />
                                Anonymous
                              </span>
                            )}
                          </div>

                          {message.suggestedResponses &&
                            message.suggestedResponses.length > 0 && (
                              <div className="mt-3 flex flex-col gap-2">
                                {message.suggestedResponses.map(
                                  (response, rIdx) => (
                                    <button
                                      key={rIdx}
                                      onClick={() => setInputMessage(response)}
                                      className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-left text-slate-700 text-sm transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                                    >
                                      {response}
                                      <ChevronRight className="ml-2 inline-block h-4 w-4 opacity-50" />
                                    </button>
                                  ),
                                )}
                              </div>
                            )}

                          {message.resources &&
                            message.resources.length > 0 && (
                              <div className="mt-4 space-y-2">
                                <p className="font-medium text-slate-500 text-xs">
                                  Helpful Resources:
                                </p>
                                {message.resources.map((resource) => (
                                  <div
                                    key={resource.id}
                                    className="rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 p-3"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100">
                                        <BookOpen className="h-4 w-4 text-violet-600" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium text-sm text-violet-900">
                                          {resource.title}
                                        </p>
                                        <p className="mt-1 text-violet-700 text-xs">
                                          {resource.description}
                                        </p>
                                        {resource.estimatedTime && (
                                          <div className="mt-2 flex items-center gap-1 text-violet-600 text-xs">
                                            <Clock className="h-3 w-3" />
                                            {resource.estimatedTime}
                                          </div>
                                        )}
                                        {resource.url && (
                                          <a
                                            href={resource.url}
                                            className="mt-2 inline-flex items-center gap-1 font-medium text-violet-700 text-xs hover:text-violet-900"
                                          >
                                            Access Resource →
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-slate-400"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-purple-500">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex gap-1">
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                      <span className="text-sm">Empathizing...</span>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <div className="border-slate-200 border-t bg-slate-50/50 p-4">
                  <div className="flex items-center gap-3">
                    <button className="p-2 text-slate-400 transition-colors hover:text-teal-600">
                      <Mic className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-slate-400 transition-colors hover:text-teal-600">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setInputMessage(e.target.value)
                        }
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        placeholder="Share how you're feeling..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="-translate-y-1/2 absolute top-1/2 right-2 rounded-lg bg-teal-500 p-2 text-white transition-all hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-center text-slate-400 text-xs">
                    This conversation is{" "}
                    {isAnonymous ? "completely anonymous" : "confidential"} and
                    secure. In a crisis, call 988 or 911 immediately.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "mood" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                  <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 text-xl">
                    <TrendingUp className="h-5 w-5 text-teal-500" />
                    Your Emotional Journey
                  </h3>

                  <div className="mb-8 h-64">
                    <div className="flex h-full items-end justify-between gap-2">
                      {moodHistory.map((entry, idx) => {
                        const height = (entry.overallMood / 10) * 100;
                        const EmotionIcon = emotionIcons[entry.dominantEmotion];
                        return (
                          <div
                            key={entry.id}
                            className="flex flex-1 flex-col items-center gap-2"
                          >
                            <div className="relative w-full">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className={`w-full rounded-t-lg ${
                                  entry.overallMood >= 7
                                    ? "bg-gradient-to-t from-emerald-400 to-emerald-300"
                                    : entry.overallMood >= 5
                                      ? "bg-gradient-to-t from-amber-400 to-amber-300"
                                      : "bg-gradient-to-t from-rose-400 to-rose-300"
                                }`}
                              />
                              <div className="-top-6 -translate-x-1/2 absolute left-1/2">
                                <EmotionIcon
                                  className={`h-4 w-4 ${
                                    emotionColors[entry.dominantEmotion].text
                                  }`}
                                />
                              </div>
                            </div>
                            <span className="text-slate-500 text-xs">
                              {entry.date.toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-6 grid grid-cols-4 gap-4">
                    {[
                      {
                        label: "Avg Mood",
                        value: (
                          moodHistory.reduce(
                            (acc, e) => acc + e.overallMood,
                            0,
                          ) / moodHistory.length
                        ).toFixed(1),
                        color: "text-teal-600",
                      },
                      {
                        label: "Entries",
                        value: moodHistory.length,
                        color: "text-violet-600",
                      },
                      {
                        label: "Best Day",
                        value: Math.max(
                          ...moodHistory.map((e) => e.overallMood),
                        ),
                        color: "text-emerald-600",
                      },
                      {
                        label: "Trend",
                        value: "↗ Improving",
                        color: "text-amber-600",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl bg-slate-50 p-4 text-center"
                      >
                        <p className={`font-bold text-2xl ${stat.color}`}>
                          {stat.value}
                        </p>
                        <p className="text-slate-600 text-sm">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 font-semibold text-slate-800">
                      <History className="h-4 w-4 text-teal-500" />
                      Recent Check-ins
                    </h4>
                    {moodHistory.slice(0, 5).map((entry) => {
                      const EmotionIcon = emotionIcons[entry.dominantEmotion];
                      return (
                        <div
                          key={entry.id}
                          className="flex items-center gap-4 rounded-xl bg-slate-50 p-4"
                        >
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full ${emotionColors[entry.dominantEmotion].bg}`}
                          >
                            <EmotionIcon
                              className={`h-6 w-6 ${emotionColors[entry.dominantEmotion].text}`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800 capitalize">
                                {entry.dominantEmotion}
                              </span>
                              <span className="text-slate-500 text-sm">
                                {entry.date.toLocaleDateString([], {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            {entry.journalEntry && (
                              <p className="mt-1 text-slate-600 text-sm">
                                {entry.journalEntry}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div
                              className={`font-bold text-2xl ${
                                entry.overallMood >= 7
                                  ? "text-emerald-600"
                                  : entry.overallMood >= 5
                                    ? "text-amber-600"
                                    : "text-rose-600"
                              }`}
                            >
                              {entry.overallMood}/10
                            </div>
                            <div className="mt-1 flex gap-2 text-slate-500 text-xs">
                              <span>😰 {entry.stressLevel}</span>
                              <span>⚡ {entry.energyLevel}</span>
                              <span>😴 {entry.sleepQuality}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 text-xl">
                  <History className="h-5 w-5 text-teal-500" />
                  Conversation History
                </h3>

                {pastSessions.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                      <History className="h-10 w-10 text-slate-400" />
                    </div>
                    <p className="text-slate-600">No past sessions yet</p>
                    <p className="mt-1 text-slate-500 text-sm">
                      Your conversation history will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pastSessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => setSelectedPastSession(session)}
                        className="cursor-pointer rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-800">
                              Session on{" "}
                              {session.startedAt.toLocaleDateString()}
                            </p>
                            <p className="text-slate-600 text-sm">
                              {session.messages.length} messages •{" "}
                              {session.topicsDiscussed.length} topics
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${getSentimentBg(session.overallSentiment)} ${getSentimentColor(session.overallSentiment)}`}
                            >
                              Sentiment: {session.overallSentiment.toFixed(1)}
                            </span>
                            {session.isAnonymous && (
                              <Lock className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "resources" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                  <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 text-xl">
                    <BookOpen className="h-5 w-5 text-teal-500" />
                    Mental Health Resources
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {mentalHealthResources
                      .filter((r) => !r.crisisOnly)
                      .map((resource) => (
                        <motion.div
                          key={resource.id}
                          whileHover={{ scale: 1.02 }}
                          className="cursor-pointer rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 transition-all hover:border-teal-300"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-100 to-cyan-100">
                              {resource.type === "exercise" ? (
                                <Zap className="h-5 w-5 text-teal-600" />
                              ) : resource.type === "article" ? (
                                <BookOpen className="h-5 w-5 text-teal-600" />
                              ) : resource.type === "video" ? (
                                <BarChart3 className="h-5 w-5 text-teal-600" />
                              ) : (
                                <Headphones className="h-5 w-5 text-teal-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-800">
                                {resource.title}
                              </h4>
                              <p className="mt-1 text-slate-600 text-sm">
                                {resource.description}
                              </p>
                              <div className="mt-3 flex items-center gap-3">
                                <span className="rounded-full bg-teal-100 px-2 py-1 text-teal-700 text-xs">
                                  {resource.category}
                                </span>
                                {resource.estimatedTime && (
                                  <span className="flex items-center gap-1 text-slate-500 text-xs">
                                    <Clock className="h-3 w-3" />
                                    {resource.estimatedTime}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>

                  <div className="mt-8 rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-6">
                    <h4 className="mb-4 flex items-center gap-2 font-semibold text-rose-800">
                      <AlertTriangle className="h-5 w-5" />
                      Crisis Resources - Available 24/7
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {mentalHealthResources
                        .filter((r) => r.crisisOnly)
                        .map((resource) => (
                          <a
                            key={resource.id}
                            href={resource.url || "#"}
                            className="rounded-xl border border-rose-200 bg-white p-4 transition-all hover:border-rose-400"
                          >
                            <h5 className="font-medium text-rose-800">
                              {resource.title}
                            </h5>
                            <p className="mt-1 text-rose-600 text-sm">
                              {resource.description}
                            </p>
                          </a>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showMoodTracker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setShowMoodTracker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="border-slate-100 border-b p-6">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-semibold text-slate-800 text-xl">
                    <Heart className="h-6 w-6 text-rose-500" />
                    How are you feeling right now?
                  </h3>
                  <button
                    onClick={() => setShowMoodTracker(false)}
                    className="rounded-lg p-2 transition-colors hover:bg-slate-100"
                  >
                    <X className="h-5 w-5 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div>
                  <label className="mb-3 block font-medium text-slate-700 text-sm">
                    Select your dominant emotion
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(emotionIcons).map(([emotion, Icon]) => (
                      <button
                        key={emotion}
                        onClick={() =>
                          setSelectedEmotion(emotion as EmotionType)
                        }
                        className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                          selectedEmotion === emotion
                            ? `border-teal-500 ${emotionColors[emotion as EmotionType].bg}`
                            : "border-slate-200 hover:border-teal-300"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${selectedEmotion === emotion ? emotionColors[emotion as EmotionType].text : "text-slate-400"}`}
                        />
                        <span
                          className={`text-xs capitalize ${selectedEmotion === emotion ? "font-medium text-slate-800" : "text-slate-600"}`}
                        >
                          {emotion}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="font-medium text-slate-700 text-sm">
                      Intensity
                    </label>
                    <span className="font-bold text-2xl text-teal-600">
                      {emotionIntensity}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={emotionIntensity}
                    onChange={(e) =>
                      setEmotionIntensity(parseInt(e.target.value))
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                  />
                  <div className="mt-1 flex justify-between text-slate-500 text-xs">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Intense</span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700 text-sm">
                    Journal Entry (Optional)
                  </label>
                  <textarea
                    value={moodJournalEntry}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setMoodJournalEntry(e.target.value)
                    }
                    placeholder="What's on your mind? Writing can help process emotions..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 border-slate-100 border-t p-6">
                <button
                  onClick={handleLogMood}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 py-3 font-medium text-white transition-all hover:shadow-lg"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Log Mood Entry
                </button>
                <button
                  onClick={() => setShowMoodTracker(false)}
                  className="rounded-xl border border-slate-200 px-6 py-3 font-medium text-slate-700 transition-all hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPastSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setSelectedPastSession(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="border-slate-100 border-b p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-xl">
                      Session on{" "}
                      {selectedPastSession.startedAt.toLocaleDateString()}
                    </h3>
                    <p className="mt-1 text-slate-600">
                      {selectedPastSession.messages.length} messages •{" "}
                      {selectedPastSession.topicsDiscussed.length} topics
                      discussed
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPastSession(null)}
                    className="rounded-lg p-2 transition-colors hover:bg-slate-100"
                  >
                    <X className="h-5 w-5 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 p-6">
                {selectedPastSession.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl p-4 ${
                        message.sender === "user"
                          ? "rounded-br-md bg-teal-500 text-white"
                          : "rounded-bl-md bg-slate-100 text-slate-800"
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="mt-2 block text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EmotionalAIChatbot;
