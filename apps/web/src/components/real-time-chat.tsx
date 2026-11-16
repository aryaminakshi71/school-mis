import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useWebSocket } from "@/lib/websocket-context";
import { MessageCircle, Send, Users, Wifi, WifiOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface OnlineUser {
  id: string;
  name: string;
  role: string;
  isOnline: boolean;
}

export const RealTimeChat = () => {
  const { isConnected, chatMessages, sendChatMessage, markChatMessageAsRead } =
    useWebSocket();
  const [message, setMessage] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<string>("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock online users - replace with real data
  const [onlineUsers] = useState<OnlineUser[]>([
    { id: "all", name: "All Users", role: "Group", isOnline: true },
    { id: "teacher-1", name: "Ms. Johnson", role: "Teacher", isOnline: true },
    { id: "teacher-2", name: "Mr. Smith", role: "Teacher", isOnline: false },
    { id: "admin-1", name: "Mrs. Davis", role: "Admin", isOnline: true },
    { id: "staff-1", name: "Mr. Wilson", role: "Staff", isOnline: true },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    if (!isConnected) {
      toast.error("Cannot send message", {
        description: "Not connected to chat service",
      });
      return;
    }

    sendChatMessage(selectedRecipient, message.trim());
    setMessage("");

    toast.success("Message sent");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredMessages = chatMessages.filter(
    (msg) =>
      selectedRecipient === "all" ||
      msg.senderId === selectedRecipient ||
      msg.recipientId === selectedRecipient ||
      msg.recipientId === "current-user-id", // Replace with actual current user ID
  );

  const unreadCount = chatMessages.filter(
    (msg) => !msg.read && msg.recipientId === "current-user-id",
  ).length;

  return (
    <div className="grid h-[600px] gap-6 md:grid-cols-3">
      {/* Users List */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Online Users
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {onlineUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedRecipient(user.id)}
                className={`cursor-pointer rounded-lg p-3 transition-colors ${
                  selectedRecipient === user.id
                    ? "border-blue-300 bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      user.isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-muted-foreground text-xs">{user.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex flex-col md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {selectedRecipient === "all"
                ? "Group Chat"
                : onlineUsers.find((u) => u.id === selectedRecipient)?.name ||
                  "Chat"}
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <Wifi className="h-3 w-3" />
                  Live
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <WifiOff className="h-3 w-3" />
                  Offline
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredMessages.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <MessageCircle className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>No messages yet</p>
                <p className="text-sm">Start a conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === "current-user-id" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                        msg.senderId === "current-user-id"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {selectedRecipient === "all" &&
                        msg.senderId !== "current-user-id" && (
                          <p className="mb-1 font-medium text-xs opacity-75">
                            {msg.senderName}
                          </p>
                        )}
                      <p className="text-sm">{msg.message}</p>
                      <p
                        className={`mt-1 text-xs ${
                          msg.senderId === "current-user-id"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString()}
                        {!msg.read && msg.recipientId === "current-user-id" && (
                          <span className="ml-1 text-xs">•</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setMessage(e.target.value)
                }
                onKeyPress={handleKeyPress}
                placeholder={`Message ${selectedRecipient === "all" ? "group" : onlineUsers.find((u) => u.id === selectedRecipient)?.name || "user"}...`}
                disabled={!isConnected}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || !isConnected}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {!isConnected && (
              <p className="mt-2 text-muted-foreground text-xs">
                Connect to send messages
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
