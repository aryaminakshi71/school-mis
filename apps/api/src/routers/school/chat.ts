/**
 * Chat Router
 *
 * oRPC router for real-time messaging and conversations.
 */

import {
  conversationParticipants,
  conversations,
  messages,
} from "@school/storage";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../lib/db.js";
import { orgAuthed } from "../../procedures/index.js";

export const chatRouter = {
  // List conversations for a user
  listConversations: orgAuthed
    .route({
      method: "GET",
      path: "/chat/conversations",
      summary: "Get user's conversations",
      tags: ["Chat"],
    })
    .output(z.any())
    .handler(async ({ context }) => {
      const db = getDb();
      const userId = context.user?.id;

      if (!userId) return [];

      const userConversations = await db
        .select({
          conversationId: conversationParticipants.conversationId,
        })
        .from(conversationParticipants)
        .where(eq(conversationParticipants.userId, userId));

      const conversationIds = userConversations.map((c) => c.conversationId);

      if (conversationIds.length === 0) return [];

      const convs = await db
        .select()
        .from(conversations)
        .where(sql`${conversations.id} IN ${conversationIds}`)
        .orderBy(desc(conversations.updatedAt));

      const result = await Promise.all(
        convs.map(async (conv) => {
          const [lastMsg] = await db
            .select()
            .from(messages)
            .where(eq(messages.conversationId, conv.id))
            .orderBy(desc(messages.createdAt))
            .limit(1);

          const participants = await db
            .select()
            .from(conversationParticipants)
            .where(eq(conversationParticipants.conversationId, conv.id));

          const unreadCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(messages)
            .where(
              and(
                eq(messages.conversationId, conv.id),
                eq(messages.isRead, false),
                sql`${messages.senderId} != ${userId}`,
              ),
            );

          return {
            id: conv.id,
            type: conv.type,
            name: conv.name,
            lastMessage: lastMsg?.content ?? null,
            lastMessageAt: lastMsg?.createdAt?.toISOString() ?? null,
            unreadCount: unreadCount[0]?.count ?? 0,
            participants,
          };
        }),
      );

      return result;
    }),

  // Get messages in a conversation
  getMessages: orgAuthed
    .route({
      method: "GET",
      path: "/chat/conversations/{id}/messages",
      summary: "Get messages in a conversation",
      tags: ["Chat"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
      }),
    )
    .output(z.any())
    .handler(async ({ input }) => {
      const db = getDb();
      const msgs = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, input.id))
        .orderBy(desc(messages.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return msgs;
    }),

  // Send a message
  sendMessage: orgAuthed
    .route({
      method: "POST",
      path: "/chat/messages",
      summary: "Send a message",
      tags: ["Chat"],
    })
    .input(
      z.object({
        conversationId: z.string().uuid(),
        content: z.string().min(1),
        type: z.enum(["text", "image", "file"]).default("text"),
      }),
    )
    .output(z.any())
    .handler(async ({ input, context }) => {
      const db = getDb();
      const userId = context.user?.id;

      const [msg] = await db
        .insert(messages)
        .values({
          conversationId: input.conversationId,
          senderId: userId ?? "",
          content: input.content,
          type: input.type,
        })
        .returning();

      // Update conversation updatedAt
      await db
        .update(conversations)
        .set({ updatedAt: new Date() })
        .where(eq(conversations.id, input.conversationId));

      return msg;
    }),

  // Create a new conversation
  createConversation: orgAuthed
    .route({
      method: "POST",
      path: "/chat/conversations",
      summary: "Create a new conversation",
      tags: ["Chat"],
    })
    .input(
      z.object({
        type: z.enum(["direct", "group"]).default("direct"),
        name: z.string().optional(),
        participantIds: z.array(z.string().uuid()).min(1),
      }),
    )
    .output(z.any())
    .handler(async ({ input, context }) => {
      const db = getDb();
      const userId = context.user?.id;

      const [conv] = await db
        .insert(conversations)
        .values({
          type: input.type,
          name: input.name ?? null,
          createdBy: userId ?? null,
        })
        .returning();

      // Add all participants including the creator
      const allParticipants = [...new Set([userId, ...input.participantIds])];

      await db.insert(conversationParticipants).values(
        allParticipants.map((pId) => ({
          conversationId: conv.id,
          userId: pId,
        })),
      );

      return conv;
    }),

  // Mark messages as read
  markAsRead: orgAuthed
    .route({
      method: "POST",
      path: "/chat/conversations/{id}/read",
      summary: "Mark messages as read",
      tags: ["Chat"],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.boolean())
    .handler(async ({ input, context }) => {
      const db = getDb();
      const userId = context.user?.id;

      await db
        .update(messages)
        .set({ isRead: true })
        .where(
          and(
            eq(messages.conversationId, input.id),
            sql`${messages.senderId} != ${userId}`,
          ),
        );

      return true;
    }),
};
