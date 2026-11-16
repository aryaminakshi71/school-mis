import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Grid,
  Hand,
  LayoutGrid,
  MessageSquare,
  Mic,
  MicOff,
  MoreVertical,
  PhoneOff,
  Plus,
  ScreenShare,
  Smile,
  Users,
  Video,
  VideoIcon,
  VideoOff,
} from "lucide-react";
import { useState } from "react";

interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  host: {
    id: string;
    name: string;
    avatar?: string;
  };
  participants: Participant[];
  status: "scheduled" | "live" | "ended" | "cancelled";
  meetingLink: string;
  isRecording: boolean;
  isRecurring: boolean;
  recordingUrl?: string;
  chatEnabled: boolean;
  waitingRoom: boolean;
  settings: MeetingSettings;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: "host" | "co-host" | "participant";
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  joinedAt: string;
}

interface MeetingSettings {
  allowJoinBeforeHost: boolean;
  muteParticipantsOnEntry: boolean;
  waitingRoom: boolean;
  chatEnabled: boolean;
  screenSharingEnabled: boolean;
  recordingEnabled: boolean;
  virtualBackgroundEnabled: boolean;
  breakoutRoomsEnabled: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: "text" | "file";
  fileUrl?: string;
  fileName?: string;
}

interface VideoConferencingProps {
  className?: string;
}

const defaultMeetings: Meeting[] = [
  {
    id: "1",
    title: "Parent-Teacher Conference - Rahul Kumar",
    description: "Discuss academic progress and areas for improvement",
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
    host: { id: "t1", name: "Mrs. Sharma", avatar: "" },
    participants: [
      {
        id: "p1",
        name: "Mr. Kumar (Parent)",
        role: "participant",
        isMuted: true,
        isVideoOff: false,
        isScreenSharing: false,
        isHandRaised: false,
        joinedAt: "",
      },
    ],
    status: "scheduled",
    meetingLink: "https://meet.school-mis.com/parent-teacher-001",
    isRecording: false,
    isRecurring: false,
    chatEnabled: true,
    waitingRoom: true,
    settings: {
      allowJoinBeforeHost: false,
      muteParticipantsOnEntry: true,
      waitingRoom: true,
      chatEnabled: true,
      screenSharingEnabled: true,
      recordingEnabled: true,
      virtualBackgroundEnabled: true,
      breakoutRoomsEnabled: false,
    },
  },
  {
    id: "2",
    title: "Staff Meeting - Monthly Review",
    description: "Monthly staff review and planning session",
    startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 1.5).toISOString(),
    host: { id: "principal", name: "Principal", avatar: "" },
    participants: [
      {
        id: "t1",
        name: "Mrs. Sharma",
        role: "participant",
        isMuted: false,
        isVideoOff: false,
        isScreenSharing: false,
        isHandRaised: false,
        joinedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      },
      {
        id: "t2",
        name: "Mr. Patel",
        role: "participant",
        isMuted: true,
        isVideoOff: false,
        isScreenSharing: false,
        isHandRaised: false,
        joinedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      },
      {
        id: "t3",
        name: "Ms. Gupta",
        role: "co-host",
        isMuted: false,
        isVideoOff: false,
        isScreenSharing: true,
        isHandRaised: false,
        joinedAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
      },
    ],
    status: "live",
    meetingLink: "https://meet.school-mis.com/staff-meeting-002",
    isRecording: true,
    isRecurring: true,
    chatEnabled: true,
    waitingRoom: false,
    settings: {
      allowJoinBeforeHost: true,
      muteParticipantsOnEntry: false,
      waitingRoom: false,
      chatEnabled: true,
      screenSharingEnabled: true,
      recordingEnabled: true,
      virtualBackgroundEnabled: true,
      breakoutRoomsEnabled: true,
    },
  },
  {
    id: "3",
    title: "Class 10-A - Mathematics Doubt Session",
    description: "Interactive doubt clearing session for upcoming exams",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    endTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    host: { id: "t1", name: "Mrs. Sharma", avatar: "" },
    participants: [
      {
        id: "s1",
        name: "Rahul Kumar",
        role: "participant",
        isMuted: true,
        isVideoOff: false,
        isScreenSharing: false,
        isHandRaised: false,
        joinedAt: "",
      },
      {
        id: "s2",
        name: "Priya Sharma",
        role: "participant",
        isMuted: true,
        isVideoOff: false,
        isScreenSharing: false,
        isHandRaised: false,
        joinedAt: "",
      },
      {
        id: "s3",
        name: "Amit Singh",
        role: "participant",
        isMuted: true,
        isVideoOff: true,
        isScreenSharing: false,
        isHandRaised: false,
        joinedAt: "",
      },
    ],
    status: "ended",
    meetingLink: "https://meet.school-mis.com/math-doubt-003",
    isRecording: true,
    isRecurring: false,
    recordingUrl: "https://recordings.school-mis.com/math-doubt-003-rec.mp4",
    chatEnabled: true,
    waitingRoom: false,
    settings: {
      allowJoinBeforeHost: false,
      muteParticipantsOnEntry: true,
      waitingRoom: false,
      chatEnabled: true,
      screenSharingEnabled: true,
      recordingEnabled: true,
      virtualBackgroundEnabled: true,
      breakoutRoomsEnabled: false,
    },
  },
];

const defaultChatMessages: ChatMessage[] = [
  {
    id: "1",
    senderId: "principal",
    senderName: "Principal",
    message:
      "Welcome everyone to our monthly staff meeting. Let's start with attendance.",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    type: "text",
  },
  {
    id: "2",
    senderId: "t3",
    senderName: "Ms. Gupta",
    message: "I'll be presenting the exam results analysis today.",
    timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    type: "text",
  },
  {
    id: "3",
    senderId: "t1",
    senderName: "Mrs. Sharma",
    message: "Looking forward to the presentation!",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    type: "text",
  },
];

export function AdvancedVideoConferencing({
  className,
}: VideoConferencingProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "live" | "past">(
    "upcoming",
  );
  const [meetings, setMeetings] = useState<Meeting[]>(defaultMeetings);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(defaultChatMessages);
  const [newMessage, setNewMessage] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);

  const upcomingMeetings = meetings.filter((m) => m.status === "scheduled");
  const liveMeetings = meetings.filter((m) => m.status === "live");
  const pastMeetings = meetings.filter(
    (m) => m.status === "ended" || m.status === "cancelled",
  );

  const joinMeeting = (meeting: Meeting) => {
    setActiveMeeting(meeting);
    setIsInMeeting(true);
  };

  const leaveMeeting = () => {
    setIsInMeeting(false);
    setActiveMeeting(null);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: "You",
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
    };
    setChatMessages([...chatMessages, message]);
    setNewMessage("");
  };

  if (isInMeeting && activeMeeting) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-gray-900">
        {/* Meeting Header */}
        <div className="flex items-center justify-between bg-gray-800/50 p-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-white">{activeMeeting.title}</h3>
            {activeMeeting.isRecording && (
              <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-1 text-red-400 text-xs">
                <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                REC
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setViewMode(viewMode === "grid" ? "speaker" : "grid")
              }
              className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10"
            >
              {viewMode === "grid" ? (
                <LayoutGrid className="h-5 w-5" />
              ) : (
                <Grid className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10"
            >
              <Users className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className={`rounded-lg p-2 transition-colors ${showChat ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10"}`}
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            <button
              onClick={leaveMeeting}
              className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
            >
              <PhoneOff className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Video Area */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-4">
            <div
              className={`grid h-full gap-4 ${viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"}`}
            >
              {/* Host Video */}
              <div className="relative overflow-hidden rounded-2xl bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-4xl">
                    {activeMeeting.host.name[0]}
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                  <Mic className="h-4 w-4" />
                  {activeMeeting.host.name} (Host)
                </div>
              </div>

              {/* Participant Videos */}
              {activeMeeting.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="relative overflow-hidden rounded-2xl bg-gray-800"
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-600">
                    {participant.isVideoOff ? (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-600 text-3xl">
                        {participant.name[0]}
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl">
                        {participant.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                    {participant.isMuted ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                    {participant.name}
                    {participant.isHandRaised && (
                      <Hand className="h-4 w-4 text-yellow-400" />
                    )}
                  </div>
                  {participant.isScreenSharing && (
                    <div className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-green-500/80 px-3 py-1 text-white text-xs">
                      <ScreenShare className="h-3 w-3" />
                      Sharing
                    </div>
                  )}
                </div>
              ))}

              {/* Self Video */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-blue-500 bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/20 text-3xl text-blue-400">
                    You
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                  {isMuted ? (
                    <MicOff className="h-4 w-4 text-red-400" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                  You
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Chat & Participants */}
          {(showChat || showParticipants) && (
            <div className="flex w-80 flex-col border-gray-700 border-l bg-gray-800/50 backdrop-blur">
              {showParticipants && (
                <div className="flex-1 overflow-y-auto p-4">
                  <h4 className="mb-3 font-medium text-white">
                    Participants ({activeMeeting.participants.length + 1})
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 rounded-lg bg-white/5 p-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm text-white">
                        {activeMeeting.host.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">
                          {activeMeeting.host.name}
                        </p>
                        <p className="text-gray-400 text-xs">Host</p>
                      </div>
                      <Mic className="h-4 w-4 text-gray-400" />
                    </div>
                    {activeMeeting.participants.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 rounded-lg bg-white/5 p-2"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-sm text-white">
                          {p.name[0]}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">{p.name}</p>
                          <p className="text-gray-400 text-xs">{p.role}</p>
                        </div>
                        {p.isMuted ? (
                          <MicOff className="h-4 w-4 text-red-400" />
                        ) : (
                          <Mic className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showChat && (
                <>
                  <div className="flex-1 space-y-3 overflow-y-auto p-4">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`${msg.senderId === "me" ? "ml-auto" : ""} max-w-[80%]`}
                      >
                        <div
                          className={`rounded-2xl p-3 ${msg.senderId === "me" ? "bg-blue-600 text-white" : "bg-white/10 text-white"}`}
                        >
                          {msg.senderId !== "me" && (
                            <p className="mb-1 text-gray-400 text-xs">
                              {msg.senderName}
                            </p>
                          )}
                          <p className="text-sm">{msg.message}</p>
                        </div>
                        <p className="mt-1 text-gray-500 text-xs">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-gray-700 border-t p-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewMessage(e.target.value)
                        }
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 rounded-full bg-gray-700 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={sendMessage}
                        className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className="bg-gray-800/50 p-4 backdrop-blur">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`rounded-full p-4 transition-colors ${isMuted ? "bg-red-500 text-white" : "bg-gray-700 text-white hover:bg-gray-600"}`}
            >
              {isMuted ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`rounded-full p-4 transition-colors ${isVideoOff ? "bg-red-500 text-white" : "bg-gray-700 text-white hover:bg-gray-600"}`}
            >
              {isVideoOff ? (
                <VideoOff className="h-6 w-6" />
              ) : (
                <VideoIcon className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`rounded-full p-4 transition-colors ${isScreenSharing ? "bg-green-500 text-white" : "bg-gray-700 text-white hover:bg-gray-600"}`}
            >
              <ScreenShare className="h-6 w-6" />
            </button>
            <button
              onClick={() => {}}
              className="rounded-full bg-gray-700 p-4 text-white hover:bg-gray-600"
            >
              <Smile className="h-6 w-6" />
            </button>
            <button
              onClick={leaveMeeting}
              className="rounded-full bg-red-500 px-6 py-4 font-medium text-white hover:bg-red-600"
            >
              Leave Meeting
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
            <Video className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
              Video Conferencing
            </h2>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              {liveMeetings.length} live • {upcomingMeetings.length} upcoming •{" "}
              {pastMeetings.length} past
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Meeting
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => {}}
          className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Video className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900 dark:text-white">
              Instant Meeting
            </p>
            <p className="text-gray-500 text-sm">Start a meeting now</p>
          </div>
        </button>
        <button
          onClick={() => {}}
          className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900 dark:text-white">
              Schedule
            </p>
            <p className="text-gray-500 text-sm">Plan for later</p>
          </div>
        </button>
        <button
          onClick={() => {}}
          className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <ScreenShare className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900 dark:text-white">
              Screen Share
            </p>
            <p className="text-gray-500 text-sm">Share your screen</p>
          </div>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {[
          {
            id: "upcoming",
            label: `Upcoming (${upcomingMeetings.length})`,
            icon: Calendar,
          },
          {
            id: "live",
            label: `Live Now (${liveMeetings.length})`,
            icon: Video,
          },
          {
            id: "past",
            label: `Past Meetings (${pastMeetings.length})`,
            icon: Clock,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 font-medium text-sm transition-all ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm dark:bg-gray-700"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Meeting List */}
      <div className="space-y-4">
        {(activeTab === "upcoming"
          ? upcomingMeetings
          : activeTab === "live"
            ? liveMeetings
            : pastMeetings
        ).map((meeting) => (
          <motion.div
            key={meeting.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {meeting.title}
                    </h4>
                    <span
                      className={`rounded-full px-2 py-0.5 font-medium text-xs ${
                        meeting.status === "live"
                          ? "bg-green-100 text-green-700"
                          : meeting.status === "scheduled"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {meeting.status}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-500 text-sm">
                    {meeting.description}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-gray-600 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(meeting.startTime).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(meeting.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(meeting.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {meeting.participants.length + 1} participants
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {meeting.isRecurring && (
                      <span className="rounded-full bg-purple-100 px-2 py-1 text-purple-700 text-xs dark:bg-purple-900/30 dark:text-purple-400">
                        Recurring
                      </span>
                    )}
                    {meeting.recordingUrl && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-green-700 text-xs dark:bg-green-900/30 dark:text-green-400">
                        Recording Available
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {meeting.status === "live" && (
                  <button
                    onClick={() => joinMeeting(meeting)}
                    className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
                  >
                    Join Now
                  </button>
                )}
                {meeting.status === "scheduled" && (
                  <button
                    onClick={() => joinMeeting(meeting)}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                  >
                    Start
                  </button>
                )}
                <button className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { Send } from "lucide-react";
