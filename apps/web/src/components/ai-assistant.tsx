import { Bot, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistant = ({ isOpen, onClose }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI assistant. I can help you with:\n\n• Student performance analysis\n• Attendance insights\n• Fee collection strategies\n• Exam scheduling\n• Report generation\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual API call)
      const response = await generateAIResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (query: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000),
    );

    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("attendance") && lowerQuery.includes("low")) {
      return `Based on recent attendance data, here are students with attendance below 75%:\n\n1. **Rahul Sharma (Class 10-A)** - 68% attendance\n   - Missed 12 out of 40 classes\n   - Pattern: Mostly absent on Mondays\n   - Recommendation: Schedule parent-teacher meeting\n\n2. **Priya Patel (Class 9-B)** - 72% attendance\n   - Missed 8 out of 28 classes\n   - Pattern: Sick leaves\n   - Recommendation: Medical check-up suggested\n\nWould you like me to generate a detailed report or send notifications to parents?`;
    }

    if (lowerQuery.includes("performance") || lowerQuery.includes("grades")) {
      return `Here's a performance analysis for Class 10-A:\n\n📊 **Overall Class Performance:**\n- Average: 78.5%\n- Highest: 95% (Ananya Gupta)\n- Lowest: 45% (Rohit Kumar)\n\n📈 **Subject-wise Trends:**\n- Mathematics: Improving (avg +5% from last term)\n- Science: Stable (avg 82%)\n- English: Needs attention (avg 68%)\n\n🎯 **Recommendations:**\n1. Extra classes for English\n2. Peer tutoring program\n3. Progress tracking meetings\n\nWould you like me to identify at-risk students or generate improvement plans?`;
    }

    if (lowerQuery.includes("fees") || lowerQuery.includes("payment")) {
      return `Current fee collection status:\n\n💰 **Collection Summary:**\n- Total Expected: ₹2,450,000\n- Collected: ₹2,180,000 (89%)\n- Outstanding: ₹270,000\n\n📅 **Overdue Payments:**\n- 15+ days: ₹85,000 (12 students)\n- 30+ days: ₹45,000 (8 students)\n- 60+ days: ₹25,000 (5 students)\n\n📊 **Payment Methods:**\n- Online: 65%\n- Cash: 25%\n- Cheque: 10%\n\n💡 **Suggestions:**\n1. Send payment reminders\n2. Offer installment plans\n3. Set up auto-debit for regular payers\n\nWould you like me to generate collection reports or send automated reminders?`;
    }

    if (lowerQuery.includes("schedule") || lowerQuery.includes("exam")) {
      return `Exam scheduling optimization:\n\n📅 **Current Schedule Conflicts:**\n- Class 10-A: Math & Science overlap\n- Class 9-B: 3 exams on same day\n\n⚡ **AI Recommendations:**\n1. **Reschedule Math exam** to Friday afternoon\n2. **Split Science practicals** across two days\n3. **Add buffer time** between exams\n\n📊 **Predicted Impact:**\n- Reduce stress by 30%\n- Improve average scores by 5-8%\n- Better attendance during exam period\n\nWould you like me to generate the optimized schedule or check for room availability?`;
    }

    // Generic responses
    if (lowerQuery.includes("report")) {
      return `I can generate various reports:\n\n📋 **Available Reports:**\n• Student Performance Report\n• Attendance Summary\n• Fee Collection Report\n• Teacher Evaluation\n• Infrastructure Usage\n• Parent Feedback Analysis\n\n📊 **Custom Reports:**\n• Date range filtering\n• Class/section wise\n• Subject specific\n• Trend analysis\n\nWhat type of report would you like me to create?`;
    }

    if (lowerQuery.includes("help") || lowerQuery.includes("what can you do")) {
      return `I'm here to help with:\n\n🎓 **Academic Management:**\n• Student performance tracking\n• Exam scheduling & results\n• Curriculum planning\n\n👥 **Attendance & Discipline:**\n• Real-time attendance monitoring\n• Pattern analysis\n• Automated notifications\n\n💰 **Financial Management:**\n• Fee collection tracking\n• Payment reminders\n• Budget analysis\n\n📊 **Reporting & Analytics:**\n• Custom report generation\n• Trend analysis\n• Predictive insights\n\n🏫 **Administrative Tasks:**\n• Timetable optimization\n• Resource allocation\n• Communication automation\n\nWhat would you like to work on?`;
    }

    return `I understand you're asking about "${query}". Let me help you with that.\n\nCould you please provide more details about what you'd like to know? For example:\n• Student performance analysis\n• Attendance monitoring\n• Fee collection status\n• Exam scheduling\n• Report generation\n\nOr ask me a specific question about your school data!`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <Card className="h-[500px] w-96 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Assistant
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex h-full flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="mt-1 text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-current" />
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-current"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-current"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInput(e.target.value)
                }
                placeholder="Ask me anything about your school..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
