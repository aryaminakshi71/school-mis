import { AnimatePresence, motion } from "framer-motion";
import {
  BellOff,
  Check,
  CheckCheck,
  ChevronLeft,
  Clock,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Phone,
  Pin,
  Plus,
  Search,
  Send,
  Smile,
  VideoIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: "text" | "image" | "file" | "audio";
  attachments?: Attachment[];
  timestamp: string;
  isRead: boolean;
  isDelivered: boolean;
  replyTo?: string;
  reactions?: Reaction[];
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface Conversation {
  id: string;
  type: "direct" | "group";
  name: string;
  avatar?: string;
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isOnline?: boolean;
  lastSeen?: string;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role?: "admin" | "member";
  isOnline?: boolean;
}

interface CommunicationHubProps {
  className?: string;
}

const defaultConversations: Conversation[] = [
  {
    id: "1",
    type: "direct",
    name: "Mrs. Sharma",
    avatar: "https://i.pravatar.cc/150?u=teacher1",
    participants: [{ id: "t1", name: "Mrs. Sharma" }],
    lastMessage: {
      id: "m1",
      senderId: "t1",
      senderName: "Mrs. Sharma",
      content: "Please submit the assignment by tomorrow",
      type: "text",
      timestamp: "2024-03-28T10:30:00",
      isRead: false,
      isDelivered: true,
    },
    unreadCount: 2,
    isPinned: true,
    isMuted: false,
    isOnline: true,
  },
  {
    id: "2",
    type: "group",
    name: "Class 10-A Parents",
    participants: [
      { id: "p1", name: "Mr. Kumar", role: "admin" },
      { id: "p2", name: "Mrs. Patel", role: "member" },
      { id: "p3", name: "Mr. Singh", role: "member" },
    ],
    lastMessage: {
      id: "m2",
      senderId: "p1",
      senderName: "Mr. Kumar",
      content: "PTM is scheduled for next Friday",
      type: "text",
      timestamp: "2024-03-28T09:15:00",
      isRead: true,
      isDelivered: true,
    },
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
  },
  {
    id: "3",
    type: "direct",
    name: "Principal",
    avatar: "https://i.pravatar.cc/150?u=principal",
    participants: [{ id: "principal", name: "Principal" }],
    lastMessage: {
      id: "m3",
      senderId: "principal",
      senderName: "Principal",
      content: "Thank you for your contribution to the annual day",
      type: "text",
      timestamp: "2024-03-27T16:45:00",
      isRead: true,
      isDelivered: true,
    },
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
  },
  {
    id: "4",
    type: "group",
    name: "Science Club",
    participants: [
      { id: "s1", name: "Rahul", role: "admin" },
      { id: "s2", name: "Priya", role: "member" },
      { id: "s3", name: "Amit", role: "member" },
    ],
    lastMessage: {
      id: "m4",
      senderId: "s1",
      senderName: "Rahul",
      content: "Meeting at 4 PM today",
      type: "text",
      timestamp: "2024-03-28T11:00:00",
      isRead: false,
      isDelivered: true,
    },
    unreadCount: 5,
    isPinned: false,
    isMuted: false,
  },
  {
    id: "5",
    type: "direct",
    name: "Sports Coach",
    avatar: "https://i.pravatar.cc/150?u=coach",
    participants: [{ id: "coach", name: "Sports Coach" }],
    lastMessage: {
      id: "m5",
      senderId: "coach",
      senderName: "Sports Coach",
      content: "Practice cancelled due to rain",
      type: "text",
      timestamp: "2024-03-28T08:30:00",
      isRead: true,
      isDelivered: true,
    },
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
  },
];

const defaultMessages: Message[] = [
  {
    id: "1",
    senderId: "t1",
    senderName: "Mrs. Sharma",
    content: "Hello! I wanted to discuss Rahul's progress in Mathematics.",
    type: "text",
    timestamp: "2024-03-28T10:25:00",
    isRead: true,
    isDelivered: true,
  },
  {
    id: "2",
    senderId: "me",
    senderName: "You",
    content: "Yes, please tell me. Is there any concern?",
    type: "text",
    timestamp: "2024-03-28T10:27:00",
    isRead: true,
    isDelivered: true,
  },
  {
    id: "3",
    senderId: "t1",
    senderName: "Mrs. Sharma",
    content:
      "He's doing well overall, but he missed the last assignment. Please submit the assignment by tomorrow",
    type: "text",
    timestamp: "2024-03-28T10:30:00",
    isRead: false,
    isDelivered: true,
  },
];

const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export function CommunicationHub({ className }: CommunicationHubProps) {
  const [conversations, setConversations] =
    useState<Conversation[]>(defaultConversations);
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(
    (c) => c.id === activeConversation,
  );

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !activeConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: "You",
      content: inputMessage,
      type: "text",
      timestamp: new Date().toISOString(),
      isRead: false,
      isDelivered: false,
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === newMessage.id ? { ...m, isDelivered: true } : m,
        ),
      );
    }, 1000);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className={`flex h-full bg-white dark:bg-gray-900 ${className || ""}`}>
      {/* Sidebar */}
      <div
        className={`${activeConversation ? "hidden md:flex" : "flex"} w-full flex-col border-gray-200 border-r md:w-80 dark:border-gray-800`}
      >
        {/* Header */}
        <div className="border-gray-200 border-b p-4 dark:border-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-xl dark:text-white">
              Messages
            </h2>
            <button className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="w-full rounded-lg border-0 bg-gray-100 py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-primary dark:bg-gray-800"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setActiveConversation(conversation.id)}
              className={`flex w-full items-start gap-3 border-gray-100 border-b p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 ${
                activeConversation === conversation.id
                  ? "border-l-4 border-l-primary bg-primary/5"
                  : ""
              }`}
            >
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 font-semibold text-white">
                  {conversation.avatar ? (
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    conversation.name[0]
                  )}
                </div>
                {conversation.isOnline && (
                  <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-900" />
                )}
              </div>

              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="truncate font-semibold text-gray-900 dark:text-white">
                    {conversation.name}
                  </h3>
                  {conversation.lastMessage && (
                    <span className="text-gray-500 text-xs dark:text-gray-400">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  )}
                </div>

                {conversation.lastMessage && (
                  <p
                    className={`truncate text-sm ${
                      conversation.unreadCount > 0
                        ? "font-medium text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {conversation.lastMessage.senderId === "me" && "You: "}
                    {conversation.lastMessage.content}
                  </p>
                )}

                <div className="mt-1 flex items-center gap-2">
                  {conversation.unreadCount > 0 && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-white text-xs">
                      {conversation.unreadCount}
                    </span>
                  )}
                  {conversation.isPinned && (
                    <Pin className="h-3 w-3 text-primary" />
                  )}
                  {conversation.isMuted && (
                    <BellOff className="h-3 w-3 text-gray-400" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activeConversation && currentConversation ? (
        <div className="flex flex-1 flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-gray-200 border-b p-4 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveConversation(null)}
                className="-ml-2 rounded-lg p-2 hover:bg-gray-100 md:hidden dark:hover:bg-gray-800"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 font-semibold text-white">
                  {currentConversation.avatar ? (
                    <img
                      src={currentConversation.avatar}
                      alt={currentConversation.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    currentConversation.name[0]
                  )}
                </div>
                {currentConversation.isOnline && (
                  <div className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 dark:border-gray-900" />
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {currentConversation.name}
                </h3>
                <p className="text-gray-500 text-xs dark:text-gray-400">
                  {currentConversation.isOnline
                    ? "Online"
                    : currentConversation.lastSeen
                      ? `Last seen ${formatTime(currentConversation.lastSeen)}`
                      : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <VideoIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message, index) => {
              const isMe = message.senderId === "me";
              const showDate =
                index === 0 ||
                formatDate(message.timestamp) !==
                  formatDate(messages[index - 1].timestamp);

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="my-4 flex justify-center">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-500 text-xs dark:bg-gray-800 dark:text-gray-400">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        isMe
                          ? "rounded-2xl rounded-tr-sm bg-primary text-white"
                          : "rounded-2xl rounded-tl-sm bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                      } px-4 py-2`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div
                        className={`mt-1 flex items-center justify-end gap-1 ${
                          isMe ? "text-white/70" : "text-gray-400"
                        }`}
                      >
                        <span className="text-xs">
                          {formatTime(message.timestamp)}
                        </span>
                        {isMe && (
                          <>
                            {message.isRead ? (
                              <CheckCheck className="h-3 w-3" />
                            ) : message.isDelivered ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div
                      className={`mt-1 flex gap-1 ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.reactions.map((reaction, idx) => (
                        <button
                          key={idx}
                          className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          {reaction.emoji} {reaction.count}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2 text-gray-500 text-sm dark:text-gray-400">
                <div className="flex gap-1">
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
                <span>{typingUsers.join(", ")} typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-gray-200 border-t p-4 dark:border-gray-800">
            <div className="flex items-end gap-2">
              <button className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <Paperclip className="h-5 w-5 text-gray-500" />
              </button>

              <div className="relative flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setInputMessage(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  rows={1}
                  className="max-h-32 w-full resize-none rounded-xl border-0 bg-gray-100 px-4 py-2.5 focus:ring-2 focus:ring-primary dark:bg-gray-800"
                  style={{ minHeight: "44px" }}
                />

                {/* Emoji Picker Toggle */}
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-2 bottom-2 rounded-lg p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Smile className="h-5 w-5 text-gray-500" />
                </button>

                {/* Emoji Picker */}
                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 bottom-full mb-2 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="grid grid-cols-6 gap-1">
                        {quickReactions.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              setInputMessage((prev) => prev + emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="rounded-lg p-2 text-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim()}
                className="rounded-xl bg-primary p-2 text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden flex-1 items-center justify-center bg-gray-50 md:flex dark:bg-gray-900">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
              <MessageSquare className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 text-xl dark:text-white">
              Select a conversation
            </h3>
            <p className="max-w-xs text-gray-500 dark:text-gray-400">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
