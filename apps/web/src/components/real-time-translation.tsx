import { AnimatePresence, motion, useAnimation } from "framer-motion";
import {
  BookOpen,
  Brain,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Globe,
  History,
  Languages,
  Maximize2,
  MessageSquare,
  Mic,
  Minimize2,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  Sparkles,
  StopCircle,
  TrendingUp,
  Users,
  Volume2,
  Wifi,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// Types
interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  supported: boolean;
}

interface TranslationSession {
  id: string;
  sourceLang: string;
  targetLang: string;
  mode: "speech" | "text" | "chat";
  startTime: Date;
  status: "active" | "paused" | "completed";
  messages: TranslatedMessage[];
  quality: number;
  culturalNotes: string[];
}

interface TranslatedMessage {
  id: string;
  original: string;
  translated: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
  quality: number;
  confidence: number;
  culturalContext?: string;
  audioUrl?: string;
}

interface GlossaryTerm {
  id: string;
  term: string;
  translations: Record<string, string>;
  context: string;
  category: string;
}

interface QualityMetrics {
  overall: number;
  accuracy: number;
  fluency: number;
  cultural: number;
  contextual: number;
}

// Mock data
const languages: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    supported: true,
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    supported: true,
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    supported: true,
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    supported: true,
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    flag: "🇮🇹",
    supported: true,
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    flag: "🇵🇹",
    supported: true,
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    flag: "🇷🇺",
    supported: true,
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    supported: true,
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    supported: true,
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    flag: "🇰🇷",
    supported: true,
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    supported: true,
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    supported: true,
  },
  {
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    flag: "🇹🇷",
    supported: true,
  },
  {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    flag: "🇳🇱",
    supported: true,
  },
  {
    code: "pl",
    name: "Polish",
    nativeName: "Polski",
    flag: "🇵🇱",
    supported: true,
  },
];

const glossaryTerms: GlossaryTerm[] = [
  {
    id: "1",
    term: "assignment",
    translations: { es: "tarea", fr: "devoir", de: "Aufgabe" },
    context: "Homework or task given to students",
    category: "Academic",
  },
  {
    id: "2",
    term: "grade",
    translations: { es: "calificación", fr: "note", de: "Note" },
    context: "Student performance evaluation",
    category: "Academic",
  },
  {
    id: "3",
    term: "semester",
    translations: { es: "semestre", fr: "semestre", de: "Semester" },
    context: "Academic term",
    category: "Academic",
  },
];

const culturalContexts: Record<string, string[]> = {
  en: [
    "Direct communication style",
    "Informal greetings common in educational settings",
  ],
  es: [
    "Formal vs. informal address (tú/usted)",
    "Warm, relationship-oriented communication",
  ],
  fr: ["Formal academic language preferred", "Precise terminology valued"],
  de: ["Direct and structured communication", "Formality in academic contexts"],
  ja: ["Hierarchical respect levels", "Indirect communication patterns"],
  ar: ["Religious and cultural references", "Gender-specific addressing"],
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const waveVariants = {
  animate: (i: number) => ({
    scaleY: [1, 2, 1],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      delay: i * 0.1,
    },
  }),
};

export function RealTimeTranslation() {
  const [activeTab, setActiveTab] = useState<
    "speech" | "text" | "chat" | "glossary"
  >("speech");
  const [sourceLang, setSourceLang] = useState<string>("en");
  const [targetLang, setTargetLang] = useState<string>("es");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [messages, setMessages] = useState<TranslatedMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics>({
    overall: 96,
    accuracy: 98,
    fluency: 95,
    cultural: 94,
    contextual: 97,
  });
  const [showQualityPanel, setShowQualityPanel] = useState(false);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] =
    useState<GlossaryTerm | null>(null);
  const [newGlossaryTerm, setNewGlossaryTerm] = useState({
    term: "",
    translations: {},
    context: "",
    category: "",
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [culturalPreservation, setCulturalPreservation] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate speech recognition
  const startRecording = useCallback(() => {
    setIsRecording(true);
    controls.start("animate");

    // Simulate speech input after delay
    setTimeout(() => {
      const mockSpeech =
        "Welcome to the international education conference. I'm excited to discuss cross-cultural learning experiences.";
      handleTranslation(mockSpeech, "speech");
      setIsRecording(false);
    }, 3000);
  }, [sourceLang, targetLang, controls]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    controls.stop();
  }, [controls]);

  // Handle translation
  const handleTranslation = useCallback(
    (text: string, mode: "speech" | "text" | "chat") => {
      if (!text.trim()) return;

      setIsTranslating(true);

      // Simulate translation delay
      setTimeout(() => {
        const translatedText = generateMockTranslation(
          text,
          sourceLang,
          targetLang,
        );
        const culturalNote = culturalPreservation
          ? culturalContexts[targetLang]?.[
              Math.floor(Math.random() * culturalContexts[targetLang].length)
            ]
          : undefined;

        const newMessage: TranslatedMessage = {
          id: `msg-${Date.now()}`,
          original: text,
          translated: translatedText,
          sourceLang,
          targetLang,
          timestamp: new Date(),
          quality: Math.floor(Math.random() * 10) + 90,
          confidence: Math.floor(Math.random() * 10) + 90,
          culturalContext: culturalNote,
        };

        setMessages((prev) => [...prev, newMessage]);
        setIsTranslating(false);
        setInputText("");
        setChatInput("");

        // Auto-play audio if enabled
        if (audioEnabled) {
          speakTranslation(translatedText, targetLang);
        }
      }, 800);
    },
    [sourceLang, targetLang, culturalPreservation, audioEnabled],
  );

  // Mock translation generator
  const generateMockTranslation = (
    text: string,
    from: string,
    to: string,
  ): string => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        es: "Bienvenidos a la conferencia internacional de educación. Estoy emocionado de discutir experiencias de aprendizaje intercultural.",
        fr: "Bienvenue à la conférence internationale sur l'éducation. Je suis ravi de discuter des expériences d'apprentissage interculturel.",
        de: "Willkommen zur internationalen Bildungskonferenz. Ich freue mich darauf, über interkulturelle Lernerfahrungen zu sprechen.",
        ja: "国際教育会議へようこそ。異文化間の学習経験について議論できることを嬉しく思います。",
      },
    };
    return translations[from]?.[to] || `[Translated to ${to}]: ${text}`;
  };

  // Text-to-speech
  const speakTranslation = (text: string, lang: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Export translations
  const exportTranslations = () => {
    const data = messages.map((m) => ({
      timestamp: m.timestamp.toISOString(),
      source: m.original,
      translation: m.translated,
      sourceLang: languages.find((l) => l.code === m.sourceLang)?.name,
      targetLang: languages.find((l) => l.code === m.targetLang)?.name,
      quality: m.quality,
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translations-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  // Add glossary term
  const addGlossaryTerm = () => {
    if (newGlossaryTerm.term && newGlossaryTerm.context) {
      const term: GlossaryTerm = {
        id: `glossary-${Date.now()}`,
        term: newGlossaryTerm.term,
        translations: newGlossaryTerm.translations,
        context: newGlossaryTerm.context,
        category: newGlossaryTerm.category || "General",
      };
      glossaryTerms.push(term);
      setNewGlossaryTerm({
        term: "",
        translations: {},
        context: "",
        category: "",
      });
    }
  };

  // Swap languages
  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return "#10b981";
    if (score >= 80) return "#f59e0b";
    return "#ef4444";
  };

  const renderLanguageSelector = (
    value: string,
    onChange: (code: string) => void,
    label: string,
  ) => (
    <div className="relative">
      <label className="mb-1 block font-medium text-slate-400 text-xs">
        {label}
      </label>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex w-full items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-left transition-colors hover:bg-slate-800"
      >
        <span className="text-2xl">
          {languages.find((l) => l.code === value)?.flag}
        </span>
        <div className="flex-1">
          <p className="font-medium text-slate-200 text-sm">
            {languages.find((l) => l.code === value)?.name}
          </p>
          <p className="text-slate-500 text-xs">
            {languages.find((l) => l.code === value)?.nativeName}
          </p>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-500" />
      </motion.button>
    </div>
  );

  return (
    <div
      className={`${isFullscreen ? "fixed inset-0 z-50" : ""} min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100`}
    >
      {/* Background Pattern */}
      <motion.div
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1600px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 shadow-2xl shadow-emerald-500/30">
                  <Languages className="h-8 w-8 text-white" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-emerald-500 opacity-40 blur-xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              <div>
                <h1 className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text font-bold text-3xl text-transparent tracking-tight md:text-4xl">
                  LinguaFlow Pro
                </h1>
                <p className="mt-1 text-slate-400 text-sm md:text-base">
                  Real-Time Translation & Cultural Intelligence Platform
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.div
                className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 font-medium text-emerald-400 text-sm"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  className="h-2 w-2 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                50+ Languages Active
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-2 text-slate-400 transition-colors hover:text-white"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Sidebar */}
          <motion.div
            className="space-y-4 lg:col-span-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Language Configuration */}
            <motion.div variants={itemVariants}>
              <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
                <h2 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-200">
                  <Globe className="h-5 w-5 text-emerald-400" />
                  Language Pair
                </h2>

                <div className="space-y-4">
                  {renderLanguageSelector(sourceLang, setSourceLang, "From")}

                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={swapLanguages}
                      className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-2 text-slate-400 transition-colors hover:text-emerald-400"
                    >
                      <RefreshCw className="h-5 w-5" />
                    </motion.button>
                  </div>

                  {renderLanguageSelector(targetLang, setTargetLang, "To")}
                </div>

                {/* Quality Indicator */}
                <div className="mt-6 border-slate-800 border-t pt-6">
                  <div
                    className="flex cursor-pointer items-center justify-between"
                    onClick={() => setShowQualityPanel(!showQualityPanel)}
                  >
                    <span className="text-slate-400 text-sm">
                      Translation Quality
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-bold text-2xl"
                        style={{
                          color: getQualityColor(qualityMetrics.overall),
                        }}
                      >
                        {qualityMetrics.overall}%
                      </span>
                      {showQualityPanel ? (
                        <ChevronUp className="h-4 w-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {showQualityPanel && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 space-y-3 overflow-hidden"
                      >
                        {Object.entries(qualityMetrics)
                          .filter(([key]) => key !== "overall")
                          .map(([key, value]) => (
                            <div key={key} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400 capitalize">
                                  {key}
                                </span>
                                <span className="text-slate-300">{value}%</span>
                              </div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{
                                    backgroundColor: getQualityColor(value),
                                  }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${value}%` }}
                                  transition={{ duration: 0.8 }}
                                />
                              </div>
                            </div>
                          ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Settings */}
            <motion.div variants={itemVariants}>
              <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
                <h2 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-200">
                  <Settings className="h-5 w-5 text-cyan-400" />
                  Translation Settings
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-300 text-sm">
                        Voice Output
                      </span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAudioEnabled(!audioEnabled)}
                      className={`h-6 w-12 rounded-full transition-colors ${audioEnabled ? "bg-emerald-500" : "bg-slate-700"}`}
                    >
                      <motion.div
                        className="h-5 w-5 rounded-full bg-white shadow-lg"
                        animate={{ x: audioEnabled ? 24 : 2 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-300 text-sm">
                        Cultural Context
                      </span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setCulturalPreservation(!culturalPreservation)
                      }
                      className={`h-6 w-12 rounded-full transition-colors ${culturalPreservation ? "bg-emerald-500" : "bg-slate-700"}`}
                    >
                      <motion.div
                        className="h-5 w-5 rounded-full bg-white shadow-lg"
                        animate={{ x: culturalPreservation ? 24 : 2 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    </motion.button>
                  </div>

                  <div className="border-slate-800 border-t pt-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Sparkles className="h-3 w-3" />
                      <span>AI-Powered Neural Translation</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-slate-400 text-xs">
                      <Shield className="h-3 w-3" />
                      <span>End-to-End Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants}>
              <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
                <h2 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-200">
                  <TrendingUp className="h-5 w-5 text-violet-400" />
                  Session Stats
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-3">
                    <p className="text-slate-400 text-xs">Messages</p>
                    <p className="font-bold text-2xl text-white">
                      {messages.length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-3">
                    <p className="text-slate-400 text-xs">Avg Quality</p>
                    <p className="font-bold text-2xl text-emerald-400">
                      {messages.length > 0
                        ? Math.round(
                            messages.reduce((acc, m) => acc + m.quality, 0) /
                              messages.length,
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Panel */}
          <div className="space-y-6 lg:col-span-9">
            {/* Tabs */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {[
                { id: "speech", label: "Speech Translation", icon: Mic },
                { id: "text", label: "Text Translation", icon: MessageSquare },
                { id: "chat", label: "Chat Mode", icon: Users },
                { id: "glossary", label: "Glossary", icon: BookOpen },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`relative rounded-xl px-6 py-3 font-medium transition-all ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {/* Speech Translation Tab */}
              {activeTab === "speech" && (
                <motion.div
                  key="speech"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Recording Interface */}
                  <motion.div variants={itemVariants}>
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl">
                      <div className="text-center">
                        <motion.div
                          className="relative mb-6 inline-block"
                          animate={isRecording ? "animate" : ""}
                        >
                          <motion.button
                            onClick={
                              isRecording ? stopRecording : startRecording
                            }
                            className={`flex h-32 w-32 items-center justify-center rounded-full transition-colors ${
                              isRecording
                                ? "border-4 border-rose-500 bg-rose-500/20"
                                : "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/30"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isRecording ? (
                              <StopCircle className="h-12 w-12 text-rose-500" />
                            ) : (
                              <Mic className="h-12 w-12 text-white" />
                            )}
                          </motion.button>

                          {isRecording && (
                            <>
                              <motion.div
                                className="absolute inset-0 rounded-full border-4 border-rose-500"
                                variants={pulseVariants}
                                animate="animate"
                              />
                              <motion.div
                                className="absolute inset-0 rounded-full border-4 border-rose-500"
                                variants={pulseVariants}
                                animate="animate"
                                style={{ animationDelay: "0.5s" }}
                              />
                            </>
                          )}
                        </motion.div>

                        <h3 className="mb-2 font-semibold text-white text-xl">
                          {isRecording ? "Listening..." : "Tap to Speak"}
                        </h3>
                        <p className="text-slate-400">
                          {isRecording
                            ? `Recording in ${languages.find((l) => l.code === sourceLang)?.name}...`
                            : "Press the microphone button and start speaking"}
                        </p>

                        {isRecording && (
                          <div className="mt-6 flex h-12 items-center justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-2 rounded-full bg-emerald-500"
                                custom={i}
                                variants={waveVariants}
                                animate="animate"
                                style={{ height: 20 }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Recent Translations */}
                  <motion.div variants={itemVariants}>
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
                      <div className="mb-6 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 font-semibold text-lg text-slate-200">
                          <History className="h-5 w-5 text-cyan-400" />
                          Recent Translations
                        </h2>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={exportTranslations}
                            className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-slate-300 text-sm transition-colors hover:bg-slate-700"
                          >
                            <Download className="h-4 w-4" />
                            Export
                          </motion.button>
                        </div>
                      </div>

                      <div className="custom-scrollbar max-h-[400px] space-y-4 overflow-y-auto">
                        <AnimatePresence>
                          {messages.length === 0 ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="py-12 text-center"
                            >
                              <Languages className="mx-auto mb-3 h-12 w-12 text-slate-600" />
                              <p className="text-slate-400">
                                No translations yet
                              </p>
                              <p className="mt-1 text-slate-500 text-sm">
                                Start speaking to see translations
                              </p>
                            </motion.div>
                          ) : (
                            messages
                              .slice()
                              .reverse()
                              .map((message, index) => (
                                <motion.div
                                  key={message.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="group rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition-colors hover:border-slate-600"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700/50">
                                        <span className="text-lg">
                                          {
                                            languages.find(
                                              (l) =>
                                                l.code === message.sourceLang,
                                            )?.flag
                                          }
                                        </span>
                                      </div>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="mb-1 flex items-center gap-2">
                                        <span className="text-slate-500 text-xs">
                                          {message.timestamp.toLocaleTimeString()}
                                        </span>
                                        <span
                                          className="rounded-full border px-2 py-0.5 font-medium text-xs"
                                          style={{
                                            backgroundColor: `${getQualityColor(message.quality)}20`,
                                            borderColor: `${getQualityColor(message.quality)}40`,
                                            color: getQualityColor(
                                              message.quality,
                                            ),
                                          }}
                                        >
                                          {message.quality}% quality
                                        </span>
                                      </div>

                                      <p className="mb-2 text-slate-300 text-sm">
                                        {message.original}
                                      </p>

                                      <div className="mb-2 flex items-center gap-2">
                                        <div className="h-px w-6 bg-slate-600" />
                                        <span className="text-slate-500 text-xs">
                                          {
                                            languages.find(
                                              (l) =>
                                                l.code === message.targetLang,
                                            )?.flag
                                          }
                                        </span>
                                      </div>

                                      <p className="font-medium text-sm text-white">
                                        {message.translated}
                                      </p>

                                      {message.culturalContext && (
                                        <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                                          <div className="mb-1 flex items-center gap-2">
                                            <Sparkles className="h-3 w-3 text-amber-400" />
                                            <span className="font-medium text-amber-400 text-xs">
                                              Cultural Context
                                            </span>
                                          </div>
                                          <p className="text-slate-400 text-xs">
                                            {message.culturalContext}
                                          </p>
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex flex-shrink-0 flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() =>
                                          copyToClipboard(message.translated)
                                        }
                                        className="rounded-lg bg-slate-700/50 p-2 text-slate-400 transition-colors hover:text-white"
                                      >
                                        <Copy className="h-4 w-4" />
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() =>
                                          speakTranslation(
                                            message.translated,
                                            message.targetLang,
                                          )
                                        }
                                        className="rounded-lg bg-slate-700/50 p-2 text-slate-400 transition-colors hover:text-white"
                                      >
                                        <Volume2 className="h-4 w-4" />
                                      </motion.button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))
                          )}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Text Translation Tab */}
              {activeTab === "text" && (
                <motion.div
                  key="text"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <motion.div variants={itemVariants}>
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Input */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-400 text-sm">
                              {
                                languages.find((l) => l.code === sourceLang)
                                  ?.name
                              }
                            </span>
                            <span className="text-slate-500 text-xs">
                              {inputText.length} characters
                            </span>
                          </div>
                          <textarea
                            value={inputText}
                            onChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>,
                            ) => setInputText(e.target.value)}
                            placeholder="Enter text to translate..."
                            className="h-64 w-full resize-none rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 text-slate-200 placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
                          />
                        </div>

                        {/* Output */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-400 text-sm">
                              {
                                languages.find((l) => l.code === targetLang)
                                  ?.name
                              }
                            </span>
                            <div className="flex items-center gap-2">
                              {isTranslating && (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                >
                                  <RefreshCw className="h-4 w-4 text-emerald-400" />
                                </motion.div>
                              )}
                            </div>
                          </div>
                          <div className="h-64 w-full overflow-auto rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
                            {messages.length > 0 &&
                            messages[messages.length - 1].sourceLang ===
                              sourceLang &&
                            messages[messages.length - 1].targetLang ===
                              targetLang ? (
                              <div>
                                <p className="text-slate-200">
                                  {messages[messages.length - 1].translated}
                                </p>
                                {messages[messages.length - 1]
                                  .culturalContext && (
                                  <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                                    <div className="mb-1 flex items-center gap-2">
                                      <Sparkles className="h-3 w-3 text-amber-400" />
                                      <span className="font-medium text-amber-400 text-xs">
                                        Cultural Context
                                      </span>
                                    </div>
                                    <p className="text-slate-400 text-xs">
                                      {
                                        messages[messages.length - 1]
                                          .culturalContext
                                      }
                                    </p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-slate-500 italic">
                                Translation will appear here...
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-center">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleTranslation(inputText, "text")}
                          disabled={!inputText.trim() || isTranslating}
                          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 font-medium text-white shadow-emerald-500/25 shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isTranslating ? (
                            <>
                              <RefreshCw className="h-5 w-5 animate-spin" />
                              Translating...
                            </>
                          ) : (
                            <>
                              <Languages className="h-5 w-5" />
                              Translate
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Chat Mode Tab */}
              {activeTab === "chat" && (
                <motion.div
                  key="chat"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <motion.div variants={itemVariants}>
                    <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/60 shadow-2xl backdrop-blur-xl">
                      {/* Chat Header */}
                      <div className="flex items-center justify-between border-slate-700/50 border-b p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">
                              Multilingual Chat
                            </h3>
                            <p className="text-slate-400 text-xs">
                              {
                                languages.find((l) => l.code === sourceLang)
                                  ?.name
                              }{" "}
                              ↔{" "}
                              {
                                languages.find((l) => l.code === targetLang)
                                  ?.name
                              }
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wifi className="h-4 w-4 text-emerald-400" />
                          <span className="text-emerald-400 text-xs">
                            Live Translation
                          </span>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="h-[400px] space-y-4 overflow-y-auto p-4">
                        {messages.length === 0 ? (
                          <div className="py-12 text-center">
                            <MessageSquare className="mx-auto mb-3 h-12 w-12 text-slate-600" />
                            <p className="text-slate-400">
                              Start a conversation
                            </p>
                            <p className="mt-1 text-slate-500 text-sm">
                              Messages will be translated in real-time
                            </p>
                          </div>
                        ) : (
                          messages.map((message, index) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
                            >
                              <div
                                className={`max-w-[70%] space-y-1 ${index % 2 === 0 ? "items-start" : "items-end"}`}
                              >
                                <div
                                  className={`rounded-2xl p-3 ${
                                    index % 2 === 0
                                      ? "rounded-tl-none bg-slate-800"
                                      : "rounded-tr-none bg-gradient-to-r from-emerald-600 to-teal-600"
                                  }`}
                                >
                                  <p
                                    className={
                                      index % 2 === 0
                                        ? "text-slate-300 text-sm"
                                        : "text-sm text-white"
                                    }
                                  >
                                    {index % 2 === 0
                                      ? message.original
                                      : message.translated}
                                  </p>
                                </div>
                                <div
                                  className={`rounded-2xl p-3 ${
                                    index % 2 === 0
                                      ? "rounded-tl-none border border-emerald-500/20 bg-emerald-500/10"
                                      : "rounded-tr-none bg-slate-800/50"
                                  }`}
                                >
                                  <p
                                    className={`text-xs ${index % 2 === 0 ? "text-emerald-400" : "text-slate-500"}`}
                                  >
                                    {index % 2 === 0
                                      ? message.translated
                                      : message.original}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 px-1">
                                  <span className="text-slate-500 text-xs">
                                    {message.timestamp.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                  <span
                                    className="text-xs"
                                    style={{
                                      color: getQualityColor(message.quality),
                                    }}
                                  >
                                    {message.quality}% match
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Chat Input */}
                      <div className="border-slate-700/50 border-t p-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => setChatInput(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              handleTranslation(chatInput, "chat")
                            }
                            placeholder="Type a message..."
                            className="flex-1 rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTranslation(chatInput, "chat")}
                            disabled={!chatInput.trim()}
                            className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Zap className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Glossary Tab */}
              {activeTab === "glossary" && (
                <motion.div
                  key="glossary"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Add New Term */}
                  <motion.div variants={itemVariants}>
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
                      <h2 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-200">
                        <Plus className="h-5 w-5 text-emerald-400" />
                        Add New Term
                      </h2>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Term (e.g., 'assignment')"
                          value={newGlossaryTerm.term}
                          onChange={(e) =>
                            setNewGlossaryTerm({
                              ...newGlossaryTerm,
                              term: e.target.value,
                            })
                          }
                          className="rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Category (e.g., 'Academic')"
                          value={newGlossaryTerm.category}
                          onChange={(e) =>
                            setNewGlossaryTerm({
                              ...newGlossaryTerm,
                              category: e.target.value,
                            })
                          }
                          className="rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
                        />
                        <textarea
                          placeholder="Context/Usage"
                          value={newGlossaryTerm.context}
                          onChange={(e) =>
                            setNewGlossaryTerm({
                              ...newGlossaryTerm,
                              context: e.target.value,
                            })
                          }
                          className="h-20 resize-none rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none md:col-span-2"
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={addGlossaryTerm}
                        disabled={
                          !newGlossaryTerm.term || !newGlossaryTerm.context
                        }
                        className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2 font-medium text-white shadow-emerald-500/25 shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                        Add Term
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Glossary List */}
                  <motion.div variants={itemVariants}>
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
                      <h2 className="mb-4 flex items-center gap-2 font-semibold text-lg text-slate-200">
                        <BookOpen className="h-5 w-5 text-cyan-400" />
                        Terminology Glossary ({glossaryTerms.length} terms)
                      </h2>

                      <div className="custom-scrollbar max-h-[400px] space-y-3 overflow-y-auto">
                        {glossaryTerms.map((term) => (
                          <motion.div
                            key={term.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="cursor-pointer rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition-colors hover:border-slate-600"
                            onClick={() => setSelectedGlossaryTerm(term)}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="mb-1 flex items-center gap-2">
                                  <h3 className="font-medium text-white">
                                    {term.term}
                                  </h3>
                                  <span className="rounded-full bg-slate-700 px-2 py-0.5 text-slate-400 text-xs">
                                    {term.category}
                                  </span>
                                </div>
                                <p className="mb-2 text-slate-400 text-xs">
                                  {term.context}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(term.translations)
                                    .slice(0, 3)
                                    .map(([lang, translation]) => (
                                      <span
                                        key={lang}
                                        className="rounded-md bg-slate-700/50 px-2 py-1 text-slate-300 text-xs"
                                      >
                                        {
                                          languages.find((l) => l.code === lang)
                                            ?.flag
                                        }{" "}
                                        {translation}
                                      </span>
                                    ))}
                                </div>
                              </div>
                              <ChevronDown className="h-4 w-4 text-slate-500" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
