import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { useOffline } from "../lib/offline-context";

export type BroadcastChannel = "sms" | "email" | "push" | "whatsapp";

export interface BroadcastMessage {
  id: string;
  title: string;
  content: string;
  channels: BroadcastChannel[];
  recipients: string[];
  scheduledAt?: Date;
  sentAt?: Date;
  status: "draft" | "scheduled" | "sending" | "sent" | "failed";
  stats?: {
    delivered: number;
    failed: number;
    pending: number;
  };
}

interface BroadcastMessagingProps {
  recipients: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    role: "student" | "teacher" | "parent";
    class?: string;
  }[];
  onSendBroadcast: (
    message: Omit<BroadcastMessage, "id" | "status" | "sentAt">,
  ) => Promise<void>;
}

const channelConfig = {
  sms: {
    label: "SMS",
    icon: Smartphone,
    color: "bg-blue-500",
    description: "Text message",
  },
  email: {
    label: "Email",
    icon: Mail,
    color: "bg-purple-500",
    description: "Email notification",
  },
  push: {
    label: "Push",
    icon: Bell,
    color: "bg-orange-500",
    description: "App notification",
  },
  whatsapp: {
    label: "WhatsApp",
    icon: MessageSquare,
    color: "bg-green-500",
    description: "WhatsApp message",
  },
};

export function BroadcastMessaging({
  recipients,
  onSendBroadcast,
}: BroadcastMessagingProps) {
  const [selectedChannels, setSelectedChannels] = useState<BroadcastChannel[]>([
    "whatsapp",
  ]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [recipientFilter, setRecipientFilter] = useState<
    "all" | "students" | "teachers" | "parents"
  >("all");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { isOnline, queueAction } = useOffline();

  const filteredRecipients = recipients.filter((r) => {
    if (recipientFilter === "all") return true;
    return r.role === recipientFilter.slice(0, -1); // 'students' -> 'student'
  });

  const toggleChannel = (channel: BroadcastChannel) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel],
    );
  };

  const selectAllRecipients = () => {
    setSelectedRecipients(filteredRecipients.map((r) => r.id));
  };

  const clearRecipients = () => {
    setSelectedRecipients([]);
  };

  const handleSend = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    if (selectedRecipients.length === 0) {
      alert("Please select at least one recipient");
      return;
    }

    if (!isOnline) {
      // Queue for later
      queueAction({
        type: "create",
        entity: "broadcast",
        data: {
          title,
          content,
          channels: selectedChannels,
          recipients: selectedRecipients,
          scheduledAt: isScheduled ? new Date(scheduledTime) : undefined,
        },
      });
      alert("Broadcast queued for sending when online");
      return;
    }

    setIsSending(true);
    try {
      await onSendBroadcast({
        title,
        content,
        channels: selectedChannels,
        recipients: selectedRecipients,
        scheduledAt: isScheduled ? new Date(scheduledTime) : undefined,
      });

      // Reset form
      setTitle("");
      setContent("");
      setSelectedRecipients([]);
      setIsScheduled(false);
      setScheduledTime("");
      alert("Broadcast sent successfully!");
    } catch (error) {
      console.error("Failed to send broadcast:", error);
      alert("Failed to send broadcast. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const characterCount = content.length;
  const smsCount = Math.ceil(characterCount / 160);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-gray-200 border-b p-6 dark:border-gray-800">
        <h2 className="flex items-center gap-2 font-bold text-gray-900 text-xl dark:text-gray-100">
          <Send className="h-6 w-6 text-primary" />
          Broadcast Messaging
        </h2>
        <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
          Send messages to multiple recipients at once
        </p>
      </div>

      <div className="space-y-6 p-6">
        {/* Channels */}
        <div>
          <label className="mb-3 block font-medium text-gray-700 text-sm dark:text-gray-300">
            Select Channels ({selectedChannels.length} selected)
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              Object.entries(channelConfig) as [
                BroadcastChannel,
                typeof channelConfig.sms,
              ][]
            ).map(([channel, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={channel}
                  onClick={() => toggleChannel(channel)}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    selectedChannels.includes(channel)
                      ? "border-primary bg-primary/5 dark:bg-primary/10"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  }`}
                >
                  <div
                    className={`h-10 w-10 ${config.color} mb-2 flex items-center justify-center rounded-lg`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <p
                    className={`font-medium ${selectedChannels.includes(channel) ? "text-primary" : "text-gray-900 dark:text-gray-100"}`}
                  >
                    {config.label}
                  </p>
                  <p className="mt-0.5 text-gray-500 text-xs dark:text-gray-400">
                    {config.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recipients */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="block font-medium text-gray-700 text-sm dark:text-gray-300">
              Select Recipients ({selectedRecipients.length} selected)
            </label>
            <div className="flex items-center gap-2">
              <select
                value={recipientFilter}
                onChange={(e) => {
                  setRecipientFilter(e.target.value as typeof recipientFilter);
                  setSelectedRecipients([]);
                }}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <option value="all">All</option>
                <option value="students">Students</option>
                <option value="teachers">Teachers</option>
                <option value="parents">Parents</option>
              </select>
              <button
                onClick={selectAllRecipients}
                className="text-primary text-xs hover:text-primary/80"
              >
                Select All
              </button>
              <button
                onClick={clearRecipients}
                className="text-gray-500 text-xs hover:text-gray-700"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-gray-200 p-2 dark:border-gray-700">
            {filteredRecipients.map((recipient) => (
              <label
                key={recipient.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <input
                  type="checkbox"
                  checked={selectedRecipients.includes(recipient.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRecipients([
                        ...selectedRecipients,
                        recipient.id,
                      ]);
                    } else {
                      setSelectedRecipients(
                        selectedRecipients.filter((id) => id !== recipient.id),
                      );
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm dark:text-gray-100">
                    {recipient.name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {recipient.role.charAt(0).toUpperCase() +
                      recipient.role.slice(1)}
                    {recipient.class && ` • ${recipient.class}`}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Message Content */}
        <div className="space-y-4">
          <div>
            <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
              Message Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              placeholder="Enter message title"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block font-medium text-gray-700 text-sm dark:text-gray-300">
                Message Content
              </label>
              <div className="flex items-center gap-2">
                {selectedChannels.includes("sms") && (
                  <span
                    className={`text-xs ${smsCount > 1 ? "text-orange-500" : "text-gray-500"}`}
                  >
                    {characterCount}/160 ({smsCount} SMS)
                  </span>
                )}
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-primary text-xs hover:text-primary/80"
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setContent(e.target.value)
              }
              placeholder="Enter your message here..."
              rows={6}
              className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Preview */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
              >
                <p className="mb-2 font-medium text-gray-500 text-xs dark:text-gray-400">
                  Preview:
                </p>
                <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-700">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {title || "Message Title"}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-gray-600 text-sm dark:text-gray-300">
                    {content || "Your message content will appear here..."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scheduling */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="schedule"
            checked={isScheduled}
            onChange={(e) => setIsScheduled(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label
            htmlFor="schedule"
            className="text-gray-700 text-sm dark:text-gray-300"
          >
            Schedule for later
          </label>
        </div>

        <AnimatePresence>
          {isScheduled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setScheduledTime(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={
            isSending ||
            selectedRecipients.length === 0 ||
            !title.trim() ||
            !content.trim()
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending to {selectedRecipients.length} recipients...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              {isScheduled
                ? "Schedule Broadcast"
                : `Send to ${selectedRecipients.length} recipients`}
            </>
          )}
        </button>

        {!isOnline && (
          <div className="flex items-start gap-2 rounded-xl bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-500" />
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              You're offline. This broadcast will be queued and sent when you
              reconnect.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BroadcastMessaging;
