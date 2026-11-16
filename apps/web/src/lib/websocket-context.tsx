import { useQueryClient } from "@tanstack/react-query";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

interface AttendanceUpdate {
  studentId: string;
  classId: string;
  date: string;
  status: "present" | "absent" | "late";
  markedBy: string;
  timestamp: Date;
}

interface GradeUpdate {
  studentId: string;
  subjectId: string;
  examType: string;
  obtainedMarks: number;
  maxMarks: number;
  teacherId: string;
  timestamp: Date;
}

interface FeePaymentUpdate {
  studentId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: "completed" | "failed" | "pending";
  timestamp: Date;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface WebSocketContextType {
  // Notifications
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;

  // Connection status
  isConnected: boolean;
  connectionQuality: "good" | "poor" | "offline";

  // Real-time updates
  lastAttendanceUpdate: AttendanceUpdate | null;
  lastGradeUpdate: GradeUpdate | null;
  lastFeeUpdate: FeePaymentUpdate | null;

  // Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (recipientId: string, message: string) => void;
  markChatMessageAsRead: (messageId: string) => void;

  // Subscription management
  subscribeToUpdates: (types: string[]) => void;
  unsubscribeFromUpdates: (types: string[]) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<
    "good" | "poor" | "offline"
  >("offline");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastAttendanceUpdate, setLastAttendanceUpdate] =
    useState<AttendanceUpdate | null>(null);
  const [lastGradeUpdate, setLastGradeUpdate] = useState<GradeUpdate | null>(
    null,
  );
  const [lastFeeUpdate, setLastFeeUpdate] = useState<FeePaymentUpdate | null>(
    null,
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [subscribedTypes, setSubscribedTypes] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const maxReconnectAttempts = 5;

  const connectWebSocket = useCallback(() => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      setConnectionQuality("offline");
      return;
    }

    try {
      const websocket = new WebSocket("ws://localhost:3001/ws");

      websocket.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setConnectionQuality("good");
        setReconnectAttempts(0);

        // Resubscribe to previously subscribed types
        if (subscribedTypes.length > 0) {
          websocket.send(
            JSON.stringify({
              type: "subscribe",
              data: { types: subscribedTypes },
            }),
          );
        }

        toast.success("Connected to real-time updates");
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      websocket.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        setIsConnected(false);
        setConnectionQuality("offline");

        if (!event.wasClean && reconnectAttempts < maxReconnectAttempts) {
          setReconnectAttempts((prev) => prev + 1);
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          setTimeout(connectWebSocket, delay);
        }
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionQuality("poor");
      };

      // Connection quality monitoring via ping messages
      const pingInterval = setInterval(() => {
        // Measure connection quality based on ping response time
        const startTime = Date.now();
        if (websocket.readyState === WebSocket.OPEN) {
          websocket.send(JSON.stringify({ type: "ping" }));

          // Set up pong listener
          const originalOnMessage = websocket.onmessage;
          const pongHandler = (event: MessageEvent) => {
            try {
              const data = JSON.parse(event.data);
              if (data.type === "pong") {
                const pingTime = Date.now() - startTime;
                setConnectionQuality(pingTime < 100 ? "good" : "poor");
                websocket.onmessage = originalOnMessage;
              }
            } catch {
              // Not a JSON message, restore original handler
              websocket.onmessage = originalOnMessage;
              if (originalOnMessage) {
                const handler = originalOnMessage;
                handler.bind(websocket)(event);
              }
            }
          };
          websocket.onmessage = pongHandler;
        }
      }, 30000); // Ping every 30 seconds

      setWs(websocket);

      // Store interval for cleanup
      (websocket as any)._pingInterval = pingInterval;
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      setConnectionQuality("offline");
    }
  }, [reconnectAttempts, subscribedTypes]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws) {
        // Clear ping interval
        if ((ws as any)._pingInterval) {
          clearInterval((ws as any)._pingInterval);
        }
        ws.close();
      }
    };
  }, [connectWebSocket]);

  const handleWebSocketMessage = useCallback(
    (data: any) => {
      switch (data.type) {
        case "notification":
          const newNotification: Notification = {
            id: data.id || Date.now().toString(),
            type: data.notificationType || "info",
            title: data.title,
            message: data.message,
            timestamp: new Date(data.timestamp || Date.now()),
            read: false,
            data: data.data,
          };
          setNotifications((prev) => [newNotification, ...prev]);

          // Show toast for important notifications
          if (
            data.notificationType === "error" ||
            data.notificationType === "warning"
          ) {
            if (data.notificationType === "error") {
              toast.error(data.title, { description: data.message });
            } else {
              toast.warning(data.title, { description: data.message });
            }
          } else {
            toast.info(data.title, { description: data.message });
          }
          break;

        case "attendance_update":
          const attendanceUpdate: AttendanceUpdate = {
            studentId: data.studentId,
            classId: data.classId,
            date: data.date,
            status: data.status,
            markedBy: data.markedBy,
            timestamp: new Date(data.timestamp || Date.now()),
          };
          setLastAttendanceUpdate(attendanceUpdate);

          // Invalidate attendance queries
          queryClient.invalidateQueries({ queryKey: ["attendance"] });
          queryClient.invalidateQueries({ queryKey: ["attendance-today"] });

          // Show notification
          toast.success("Attendance Updated", {
            description: `Student attendance marked as ${data.status}`,
          });
          break;

        case "grade_update":
          const gradeUpdate: GradeUpdate = {
            studentId: data.studentId,
            subjectId: data.subjectId,
            examType: data.examType,
            obtainedMarks: data.obtainedMarks,
            maxMarks: data.maxMarks,
            teacherId: data.teacherId,
            timestamp: new Date(data.timestamp || Date.now()),
          };
          setLastGradeUpdate(gradeUpdate);

          // Invalidate grade queries
          queryClient.invalidateQueries({ queryKey: ["grades"] });
          queryClient.invalidateQueries({ queryKey: ["student-grades"] });

          toast.success("Grade Updated", {
            description: `${data.examType} grade posted: ${data.obtainedMarks}/${data.maxMarks}`,
          });
          break;

        case "fee_payment_update":
          const feeUpdate: FeePaymentUpdate = {
            studentId: data.studentId,
            amount: data.amount,
            paymentMethod: data.paymentMethod,
            transactionId: data.transactionId,
            status: data.status,
            timestamp: new Date(data.timestamp || Date.now()),
          };
          setLastFeeUpdate(feeUpdate);

          // Invalidate fee queries
          queryClient.invalidateQueries({ queryKey: ["fees"] });
          queryClient.invalidateQueries({ queryKey: ["fee-payments"] });

          const statusMessage =
            data.status === "completed"
              ? "Payment successful"
              : data.status === "failed"
                ? "Payment failed"
                : "Payment pending";
          toast[
            data.status === "completed"
              ? "success"
              : data.status === "failed"
                ? "error"
                : "info"
          ]("Fee Payment Update", {
            description: `${statusMessage}: ₹${data.amount}`,
          });
          break;

        case "chat_message":
          const chatMessage: ChatMessage = {
            id: data.id,
            senderId: data.senderId,
            senderName: data.senderName,
            recipientId: data.recipientId,
            message: data.message,
            timestamp: new Date(data.timestamp || Date.now()),
            read: false,
          };
          setChatMessages((prev) => [...prev, chatMessage]);

          // Show notification for new messages
          if (data.senderId !== "current-user-id") {
            // Replace with actual current user ID
            toast.info(`New message from ${data.senderName}`, {
              description:
                data.message.length > 50
                  ? data.message.substring(0, 50) + "..."
                  : data.message,
            });
          }
          break;

        case "dashboard_update":
          // Invalidate dashboard queries
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
          queryClient.invalidateQueries({ queryKey: ["stats"] });
          break;

        case "pong":
          // Connection quality is measured in onping handler
          break;

        default:
          console.log("Unknown message type:", data.type);
      }
    },
    [queryClient],
  );

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  const sendChatMessage = useCallback(
    (recipientId: string, message: string) => {
      if (!ws || !isConnected) {
        toast.error("Cannot send message", {
          description: "Not connected to chat service",
        });
        return;
      }

      const chatMessage = {
        type: "chat_message",
        data: {
          recipientId,
          message,
          timestamp: new Date().toISOString(),
        },
      };

      ws.send(JSON.stringify(chatMessage));
    },
    [ws, isConnected],
  );

  const markChatMessageAsRead = useCallback(
    (messageId: string) => {
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, read: true } : msg,
        ),
      );

      // Send read receipt
      if (ws && isConnected) {
        ws.send(
          JSON.stringify({
            type: "message_read",
            data: { messageId },
          }),
        );
      }
    },
    [ws, isConnected],
  );

  const subscribeToUpdates = useCallback(
    (types: string[]) => {
      setSubscribedTypes((prev) => [...new Set([...prev, ...types])]);

      if (ws && isConnected) {
        ws.send(
          JSON.stringify({
            type: "subscribe",
            data: { types },
          }),
        );
      }
    },
    [ws, isConnected],
  );

  const unsubscribeFromUpdates = useCallback(
    (types: string[]) => {
      setSubscribedTypes((prev) =>
        prev.filter((type) => !types.includes(type)),
      );

      if (ws && isConnected) {
        ws.send(
          JSON.stringify({
            type: "unsubscribe",
            data: { types },
          }),
        );
      }
    },
    [ws, isConnected],
  );

  const value: WebSocketContextType = {
    notifications,
    markAsRead,
    markAllAsRead,
    isConnected,
    connectionQuality,
    lastAttendanceUpdate,
    lastGradeUpdate,
    lastFeeUpdate,
    chatMessages,
    sendChatMessage,
    markChatMessageAsRead,
    subscribeToUpdates,
    unsubscribeFromUpdates,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
