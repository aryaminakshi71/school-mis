import { motion } from "framer-motion";
import {
  Bot,
  Maximize2,
  Minimize2,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type ChatCategory =
  | "general"
  | "academic"
  | "career"
  | "admissions"
  | "fees"
  | "transport";

export interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  category?: ChatCategory;
  suggestions?: string[];
  isTyping?: boolean;
}

interface AIChatbotProps {
  userName: string;
  userRole: "student" | "teacher" | "parent" | "admin";
  onSendMessage: (message: string, category: ChatCategory) => Promise<string>;
}

const WELCOME_MESSAGE =
  "Hello! I'm your AI assistant. I can help you with:\n\n📚 Academic queries\n💼 Career guidance\n📝 Admission information\n💰 Fee-related questions\n🚌 Transport details\n\nWhat can I help you with today?";

const QUICK_SUGGESTIONS = {
  student: [
    "What are my grades?",
    "When is the next exam?",
    "How do I pay fees?",
    "Show my timetable",
    "Career guidance for science",
  ],
  parent: [
    "My child's attendance",
    "Fee payment status",
    "Upcoming parent-teacher meeting",
    "School bus routes",
    "Admission process",
  ],
  teacher: [
    "Today's schedule",
    "Mark attendance",
    "Upload assignment",
    "Student performance",
    "Leave application",
  ],
  admin: [
    "Daily reports",
    "Fee collection status",
    "Admission inquiries",
    "Staff attendance",
    "Inventory status",
  ],
};

export function AIChatbot({
  userName,
  userRole,
  onSendMessage,
}: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "bot",
      content: WELCOME_MESSAGE,
      timestamp: new Date(),
      suggestions: QUICK_SUGGESTIONS[userRole],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ChatCategory>("general");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: `typing-${Date.now()}`,
      type: "bot",
      content: "",
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      // Get AI response
      const response = await onSendMessage(userMessage.content, activeCategory);

      // Remove typing indicator and add actual response
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.isTyping);
        return [
          ...filtered,
          {
            id: `bot-${Date.now()}`,
            type: "bot",
            content: response,
            timestamp: new Date(),
            suggestions: QUICK_SUGGESTIONS[userRole],
          },
        ];
      });
    } catch (error) {
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.isTyping);
        return [
          ...filtered,
          {
            id: `error-${Date.now()}`,
            type: "bot",
            content:
              "I'm sorry, I couldn't process your request. Please try again or contact support.",
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const getCategoryIcon = (category: ChatCategory) => {
    const icons: Record<ChatCategory, string> = {
      general: "💬",
      academic: "📚",
      career: "💼",
      admissions: "📝",
      fees: "💰",
      transport: "🚌",
    };
    return icons[category];
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-colors hover:bg-primary/90"
      >
        <Bot className="h-7 w-7" />
        <span className="-top-1 -right-1 absolute h-4 w-4 animate-pulse rounded-full bg-red-500" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed right-6 bottom-6 z-50 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900 ${
        isMinimized ? "h-14 w-72" : "h-[500px] w-96"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-primary to-primary/80 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Assistant</h3>
            <p className="text-white/80 text-xs">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="rounded-lg p-1.5 transition-colors hover:bg-white/20"
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 transition-colors hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Category Tabs */}
          <div className="flex gap-1 overflow-x-auto border-gray-200 border-b px-2 py-2 dark:border-gray-800">
            {(
              [
                "general",
                "academic",
                "career",
                "admissions",
                "fees",
                "transport",
              ] as ChatCategory[]
            ).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <span>{getCategoryIcon(cat)}</span>
                <span className="capitalize">{cat}</span>
              </button>
            ))}
          </div>

          {/* Messages */}
          <div
            className="flex-1 space-y-4 overflow-y-auto p-4"
            style={{ height: "calc(100% - 180px)" }}
          >
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[85%] items-start gap-2 ${
                    message.type === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      message.type === "user"
                        ? "bg-primary text-white"
                        : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>

                  <div
                    className={`space-y-2 ${message.type === "user" ? "items-end" : ""}`}
                  >
                    <div
                      className={`rounded-2xl p-3 text-sm ${
                        message.type === "user"
                          ? "rounded-br-none bg-primary text-white"
                          : "rounded-bl-none bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                      }`}
                    >
                      {message.isTyping ? (
                        <div className="flex gap-1">
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">
                          {message.content}
                        </div>
                      )}
                    </div>

                    {message.suggestions && message.type === "bot" && (
                      <div className="flex flex-wrap gap-1">
                        {message.suggestions
                          .slice(0, 3)
                          .map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestion(suggestion)}
                              className="rounded-full border border-gray-200 bg-white px-2 py-1 text-xs transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                              <Sparkles className="mr-1 inline h-3 w-3" />
                              {suggestion}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-gray-200 border-t p-4 dark:border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInputMessage(e.target.value)
                }
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-900 text-sm focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-gray-400 text-xs">
              AI-powered responses • Available 24/7
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default AIChatbot;
