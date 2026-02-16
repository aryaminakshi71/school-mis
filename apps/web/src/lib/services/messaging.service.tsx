import {
  Image,
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Smile,
  Video,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: "text" | "image" | "file";
  attachment?: Attachment;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: string;
  lastMessage: Message;
  unreadCount: number;
  online: boolean;
}

export interface Attachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

class MessagingService {
  private conversations: Conversation[] = [];
  private messages: Map<string, Message[]> = new Map();
  private listeners: Set<(conversations: Conversation[]) => void> = new Set();

  constructor() {
    this.loadData();
  }

  private loadData() {
    const savedConversations = localStorage.getItem("school_conversations");
    const savedMessages = localStorage.getItem("school_messages");

    if (savedConversations) {
      try {
        this.conversations = JSON.parse(savedConversations).map((c: any) => ({
          ...c,
          lastMessage: {
            ...c.lastMessage,
            timestamp: new Date(c.lastMessage.timestamp),
          },
        }));
      } catch {
        this.conversations = [];
      }
    }

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        Object.entries(parsed).forEach(([key, msgs]: [string, any]) => {
          this.messages.set(
            key,
            msgs.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
          );
        });
      } catch {
        this.messages = new Map();
      }
    }
  }

  private saveData() {
    localStorage.setItem(
      "school_conversations",
      JSON.stringify(this.conversations),
    );
    localStorage.setItem(
      "school_messages",
      JSON.stringify(Object.fromEntries(this.messages)),
    );
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.conversations]));
  }

  addListener(listener: (conversations: Conversation[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getConversations(): Conversation[] {
    return [...this.conversations].sort(
      (a, b) =>
        new Date(b.lastMessage.timestamp).getTime() -
        new Date(a.lastMessage.timestamp).getTime(),
    );
  }

  getMessages(conversationId: string): Message[] {
    return this.messages.get(conversationId) || [];
  }

  sendMessage(
    conversationId: string,
    content: string,
    type: "text" | "image" | "file" = "text",
    attachment?: Attachment,
  ) {
    const conversation = this.conversations.find(
      (c) => c.id === conversationId,
    );
    if (!conversation) return null;

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: "current_user",
      receiverId: conversation.participantId,
      content,
      type,
      attachment,
      timestamp: new Date(),
      read: false,
    };

    const conversationMessages = this.messages.get(conversationId) || [];
    conversationMessages.push(newMessage);
    this.messages.set(conversationId, conversationMessages);

    conversation.lastMessage = newMessage;
    conversation.unreadCount += 1;

    this.saveData();
    this.notifyListeners();

    return newMessage;
  }

  markAsRead(conversationId: string) {
    const conversation = this.conversations.find(
      (c) => c.id === conversationId,
    );
    if (conversation) {
      conversation.unreadCount = 0;

      const messages = this.messages.get(conversationId);
      if (messages) {
        messages.forEach((m) => {
          if (m.receiverId === "current_user") {
            m.read = true;
          }
        });
      }

      this.saveData();
      this.notifyListeners();
    }
  }

  createConversation(
    participantId: string,
    participantName: string,
    participantRole: string,
  ): Conversation {
    const existing = this.conversations.find(
      (c) => c.participantId === participantId,
    );
    if (existing) return existing;

    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      participantId,
      participantName,
      participantRole,
      lastMessage: {
        id: "",
        senderId: "",
        receiverId: "",
        content: "Start a conversation",
        type: "text",
        timestamp: new Date(),
        read: true,
      },
      unreadCount: 0,
      online: false,
    };

    this.conversations.push(newConversation);
    this.messages.set(newConversation.id, []);
    this.saveData();
    this.notifyListeners();

    return newConversation;
  }

  deleteConversation(conversationId: string) {
    this.conversations = this.conversations.filter(
      (c) => c.id !== conversationId,
    );
    this.messages.delete(conversationId);
    this.saveData();
    this.notifyListeners();
  }

  getTotalUnreadCount(): number {
    return this.conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  }
}

export const messagingService = new MessagingService();

export function useMessaging(currentUserId: string = "current_user") {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const unsubscribe = messagingService.addListener((convs) => {
      setConversations(convs);
    });
    setConversations(messagingService.getConversations());
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (activeConversation) {
      setMessages(messagingService.getMessages(activeConversation));
      messagingService.markAsRead(activeConversation);
    }
  }, [activeConversation]);

  const sendMessage = useCallback(
    async (
      content: string,
      type: "text" | "image" | "file" = "text",
      attachment?: Attachment,
    ) => {
      if (!activeConversation || !content.trim()) return;

      setIsSending(true);
      try {
        const message = messagingService.sendMessage(
          activeConversation,
          content,
          type,
          attachment,
        );
        if (message) {
          setMessages((prev) => [...prev, message]);
        }
      } finally {
        setIsSending(false);
      }
    },
    [activeConversation],
  );

  const handleSend = useCallback(() => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput("");
    }
  }, [messageInput, sendMessage]);

  const createConversation = useCallback(
    (
      participantId: string,
      participantName: string,
      participantRole: string,
    ) => {
      return messagingService.createConversation(
        participantId,
        participantName,
        participantRole,
      );
    },
    [],
  );

  const deleteConversation = useCallback(
    (conversationId: string) => {
      messagingService.deleteConversation(conversationId);
      if (activeConversation === conversationId) {
        setActiveConversation(null);
      }
    },
    [activeConversation],
  );

  return {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    messageInput,
    setMessageInput,
    isSending,
    sendMessage,
    handleSend,
    createConversation,
    deleteConversation,
    totalUnread: messagingService.getTotalUnreadCount(),
  };
}

interface ChatInterfaceProps {
  conversationId: string;
  participantName: string;
  participantRole: string;
  onClose: () => void;
}

export function ChatInterface({
  conversationId,
  participantName,
  participantRole,
  onClose,
}: ChatInterfaceProps) {
  const { messages, messageInput, setMessageInput, handleSend, isSending } =
    useMessaging();

  return (
    <div className="flex h-96 flex-col rounded-xl border border-border bg-card shadow-lg">
      <div className="flex items-center justify-between border-border border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground">
            {participantName.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-foreground">{participantName}</p>
            <p className="text-muted-foreground text-xs">{participantRole}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Video className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => {
          const isOwn = message.senderId === "current_user";
          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-xl px-4 py-2 ${
                  isOwn
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`mt-1 text-xs ${isOwn ? "text-primary" : "text-muted-foreground"}`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 border-border border-t px-4 py-3">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Image className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Input
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          className="flex-1"
        />
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Smile className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          className="h-8 w-8"
          onClick={handleSend}
          disabled={isSending || !messageInput.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default messagingService;
