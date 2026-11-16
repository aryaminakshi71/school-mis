import { createServer } from "http";
import { Hono } from "hono";
import { Server } from "socket.io";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: Date;
  roomId: string;
  messageType: "text" | "image" | "file" | "voice";
  fileUrl?: string;
  fileName?: string;
  replyTo?: string;
  edited?: boolean;
  deleted?: boolean;
}

interface ChatRoom {
  id: string;
  name: string;
  type: "class" | "parent_teacher" | "staff" | "general";
  participants: string[];
  createdAt: Date;
  lastMessage?: ChatMessage;
  unreadCount: Record<string, number>;
}

export class ChatService {
  private io: Server;
  private rooms: Map<string, ChatRoom> = new Map();
  private messages: Map<string, ChatMessage[]> = new Map();
  private userSockets: Map<string, string> = new Map();

  constructor(app: Hono) {
    const httpServer = createServer(app.fetch as any);
    this.io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Join user to their personal room
      socket.on("join", (userId: string) => {
        this.userSockets.set(userId, socket.id);
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
      });

      // Join chat room
      socket.on("join-room", (roomId: string, userId: string) => {
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);

        // Send room history
        const roomMessages = this.messages.get(roomId) || [];
        socket.emit("room-history", roomMessages);
      });

      // Send message
      socket.on(
        "send-message",
        (data: {
          roomId: string;
          content: string;
          senderId: string;
          senderName: string;
          senderRole: string;
          messageType?: "text" | "image" | "file" | "voice";
          fileUrl?: string;
          fileName?: string;
          replyTo?: string;
        }) => {
          const message: ChatMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            senderId: data.senderId,
            senderName: data.senderName,
            senderRole: data.senderRole,
            content: data.content,
            timestamp: new Date(),
            roomId: data.roomId,
            messageType: data.messageType || "text",
            fileUrl: data.fileUrl,
            fileName: data.fileName,
            replyTo: data.replyTo,
          };

          // Store message
          if (!this.messages.has(data.roomId)) {
            this.messages.set(data.roomId, []);
          }
          this.messages.get(data.roomId)!.push(message);

          // Update room last message
          const room = this.rooms.get(data.roomId);
          if (room) {
            room.lastMessage = message;
            // Increment unread count for other participants
            room.participants.forEach((participantId) => {
              if (participantId !== data.senderId) {
                room.unreadCount[participantId] =
                  (room.unreadCount[participantId] || 0) + 1;
              }
            });
          }

          // Broadcast to room
          this.io.to(data.roomId).emit("new-message", message);

          // Send notification to offline users
          room?.participants.forEach((participantId) => {
            if (participantId !== data.senderId) {
              const userSocketId = this.userSockets.get(participantId);
              if (userSocketId) {
                this.io.to(userSocketId).emit("notification", {
                  type: "new_message",
                  roomId: data.roomId,
                  senderName: data.senderName,
                  preview: data.content.substring(0, 50),
                });
              }
            }
          });
        },
      );

      // Typing indicator
      socket.on(
        "typing",
        (data: { roomId: string; userId: string; userName: string }) => {
          socket.to(data.roomId).emit("user-typing", {
            userId: data.userId,
            userName: data.userName,
          });
        },
      );

      // Mark messages as read
      socket.on("mark-read", (data: { roomId: string; userId: string }) => {
        const room = this.rooms.get(data.roomId);
        if (room) {
          room.unreadCount[data.userId] = 0;
          this.io
            .to(data.roomId)
            .emit("messages-read", { userId: data.userId });
        }
      });

      // Edit message
      socket.on(
        "edit-message",
        (data: { messageId: string; roomId: string; newContent: string }) => {
          const roomMessages = this.messages.get(data.roomId);
          if (roomMessages) {
            const message = roomMessages.find((m) => m.id === data.messageId);
            if (message) {
              message.content = data.newContent;
              message.edited = true;
              this.io.to(data.roomId).emit("message-edited", message);
            }
          }
        },
      );

      // Delete message
      socket.on(
        "delete-message",
        (data: { messageId: string; roomId: string }) => {
          const roomMessages = this.messages.get(data.roomId);
          if (roomMessages) {
            const message = roomMessages.find((m) => m.id === data.messageId);
            if (message) {
              message.deleted = true;
              message.content = "This message was deleted";
              this.io.to(data.roomId).emit("message-deleted", data.messageId);
            }
          }
        },
      );

      // Disconnect
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        // Remove from user sockets map
        for (const [userId, socketId] of this.userSockets.entries()) {
          if (socketId === socket.id) {
            this.userSockets.delete(userId);
            break;
          }
        }
      });
    });
  }

  // Create chat room
  createRoom(
    name: string,
    type: ChatRoom["type"],
    participants: string[],
  ): ChatRoom {
    const room: ChatRoom = {
      id: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      participants,
      createdAt: new Date(),
      unreadCount: {},
    };

    this.rooms.set(room.id, room);
    return room;
  }

  // Get user's rooms
  getUserRooms(userId: string): ChatRoom[] {
    return Array.from(this.rooms.values()).filter((room) =>
      room.participants.includes(userId),
    );
  }

  // Get room messages
  getRoomMessages(
    roomId: string,
    limit: number = 50,
    offset: number = 0,
  ): ChatMessage[] {
    const messages = this.messages.get(roomId) || [];
    return messages
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(offset, offset + limit);
  }

  // Get unread count for user
  getUnreadCount(userId: string): number {
    let total = 0;
    for (const room of this.rooms.values()) {
      total += room.unreadCount[userId] || 0;
    }
    return total;
  }

  getIO(): Server {
    return this.io;
  }
}

// Pre-configured room types
export const createClassGroupChat = (
  chatService: ChatService,
  className: string,
  classId: string,
  teacherId: string,
  studentIds: string[],
) => {
  return chatService.createRoom(`Class ${className}`, "class", [
    teacherId,
    ...studentIds,
  ]);
};

export const createParentTeacherChat = (
  chatService: ChatService,
  teacherId: string,
  parentId: string,
  studentName: string,
) => {
  return chatService.createRoom(
    `${studentName} - PT Meeting`,
    "parent_teacher",
    [teacherId, parentId],
  );
};

export const createStaffRoom = (
  chatService: ChatService,
  roomName: string,
  staffIds: string[],
) => {
  return chatService.createRoom(roomName, "staff", staffIds);
};

export default ChatService;
