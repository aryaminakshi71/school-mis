import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VideoConferenceProps {
  meetingId: string;
  userName: string;
  userRole: "teacher" | "student" | "parent";
  onClose: () => void;
}

interface Participant {
  id: string;
  name: string;
  role: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing: boolean;
  isHost: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  isSystem?: boolean;
}

export function VideoConference({
  meetingId,
  userName,
  userRole,
  onClose,
}: VideoConferenceProps) {
  const [isJoined, setIsJoined] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [localVideo, setLocalVideo] = useState(true);
  const [localAudio, setLocalAudio] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "1",
      name: userName,
      role: userRole,
      isVideoOn: true,
      isAudioOn: true,
      isScreenSharing: false,
      isHost: userRole === "teacher",
    },
    {
      id: "2",
      name: "Mr. Rajesh Kumar",
      role: "teacher",
      isVideoOn: true,
      isAudioOn: true,
      isScreenSharing: false,
      isHost: true,
    },
    {
      id: "3",
      name: "Priya Patel",
      role: "parent",
      isVideoOn: false,
      isAudioOn: true,
      isScreenSharing: false,
      isHost: false,
    },
  ]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "System",
      message: "Meeting started",
      timestamp: new Date(),
      isSystem: true,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [meetingLinkCopied, setMeetingLinkCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isJoined && videoRef.current) {
      startLocalVideo();
    }
  }, [isJoined]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const startLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: localVideo,
        audio: localAudio,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Failed to access camera:", error);
    }
  };

  const toggleVideo = () => {
    setLocalVideo(!localVideo);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !localVideo;
      });
    }
  };

  const toggleAudio = () => {
    setLocalAudio(!localAudio);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !localAudio;
      });
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
        }

        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          startLocalVideo();
        };

        setIsScreenSharing(true);
      } catch (error) {
        console.error("Screen share failed:", error);
      }
    } else {
      setIsScreenSharing(false);
      startLocalVideo();
    }
  };

  const joinMeeting = async () => {
    setIsConnecting(true);

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsJoined(true);
    setIsConnecting(false);

    // Add system message
    addChatMessage("System", `${userName} joined the meeting`, true);
  };

  const leaveMeeting = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    addChatMessage("System", `${userName} left the meeting`, true);
    onClose();
  };

  const addChatMessage = (
    sender: string,
    message: string,
    isSystem = false,
  ) => {
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender,
        message,
        timestamp: new Date(),
        isSystem,
      },
    ]);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    addChatMessage(userName, newMessage);
    setNewMessage("");
  };

  const copyMeetingLink = () => {
    const link = `${window.location.origin}/meeting/${meetingId}`;
    navigator.clipboard.writeText(link);
    setMeetingLinkCopied(true);
    setTimeout(() => setMeetingLinkCopied(false), 2000);
  };

  if (!isJoined) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 p-4"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
        >
          <div className="space-y-6 p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Video className="h-10 w-10 text-primary" />
              </div>
              <h2 className="font-bold text-gray-900 text-xl dark:text-gray-100">
                Ready to Join?
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Parent-Teacher Meeting
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                <span className="text-gray-600 text-sm dark:text-gray-400">
                  Meeting ID
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {meetingId}
                  </span>
                  <button
                    onClick={copyMeetingLink}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300"
                  >
                    {meetingLinkCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                <span className="text-gray-600 text-sm dark:text-gray-400">
                  Your Name
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {userName}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={joinMeeting}
                disabled={isConnecting}
                className="flex-1 rounded-xl bg-primary px-4 py-3 font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isConnecting ? "Connecting..." : "Join Meeting"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex bg-gray-900"
    >
      {/* Main Video Area */}
      <div className="flex flex-1 flex-col">
        {/* Video Grid */}
        <div className="grid flex-1 grid-cols-2 gap-4 p-4">
          {/* Local Video */}
          <div className="relative overflow-hidden rounded-xl bg-gray-800">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            {!localVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-600">
                  <span className="font-bold text-2xl text-white">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-white text-xs">
              {userName} (You)
            </div>
          </div>

          {/* Remote Videos (simulated) */}
          {participants
            .filter((p) => p.id !== "1")
            .map((participant, index) => (
              <div
                key={participant.id}
                className="relative overflow-hidden rounded-xl bg-gray-800"
              >
                {!participant.isVideoOn ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/40">
                      <span className="font-bold text-2xl text-white">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                    <span className="text-gray-500">Video Stream</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/50 px-2 py-1 text-white text-xs">
                  {participant.name}
                  {participant.isHost && (
                    <span className="rounded bg-primary px-1 text-[10px] text-white">
                      Host
                    </span>
                  )}
                </div>
                {!participant.isAudioOn && (
                  <div className="absolute top-2 right-2 rounded bg-red-500/80 p-1">
                    <MicOff className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Controls */}
        <div className="flex h-20 items-center justify-center gap-4 border-gray-700 border-t bg-gray-800 px-4">
          <button
            onClick={toggleAudio}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
              localAudio
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {localAudio ? (
              <Mic className="h-5 w-5 text-white" />
            ) : (
              <MicOff className="h-5 w-5 text-white" />
            )}
          </button>

          <button
            onClick={toggleVideo}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
              localVideo
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {localVideo ? (
              <Video className="h-5 w-5 text-white" />
            ) : (
              <VideoOff className="h-5 w-5 text-white" />
            )}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
              isScreenSharing
                ? "bg-primary hover:bg-primary/90"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <MonitorUp className="h-5 w-5 text-white" />
          </button>

          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
              showParticipants
                ? "bg-primary hover:bg-primary/90"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <Users className="h-5 w-5 text-white" />
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
              showChat
                ? "bg-primary hover:bg-primary/90"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <MessageSquare className="h-5 w-5 text-white" />
          </button>

          <button
            onClick={leaveMeeting}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 transition-colors hover:bg-red-600"
          >
            <PhoneOff className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(showChat || showParticipants) && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="overflow-hidden border-gray-700 border-l bg-gray-800"
          >
            {showParticipants && (
              <div className="flex h-full flex-col">
                <div className="border-gray-700 border-b p-4">
                  <h3 className="flex items-center gap-2 font-semibold text-white">
                    <Users className="h-5 w-5" />
                    Participants ({participants.length})
                  </h3>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-700/50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                        <span className="font-medium text-primary">
                          {participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-white">
                          {participant.name}
                        </p>
                        <p className="text-gray-400 text-xs capitalize">
                          {participant.role}
                        </p>
                      </div>
                      {participant.isHost && (
                        <span className="rounded bg-primary/20 px-2 py-0.5 text-primary text-xs">
                          Host
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showChat && (
              <div className="flex h-full flex-col">
                <div className="border-gray-700 border-b p-4">
                  <h3 className="flex items-center gap-2 font-semibold text-white">
                    <MessageSquare className="h-5 w-5" />
                    Chat
                  </h3>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`${msg.isSystem ? "text-center" : ""}`}
                    >
                      {msg.isSystem ? (
                        <span className="text-gray-500 text-xs">
                          {msg.message}
                        </span>
                      ) : (
                        <div
                          className={`flex ${msg.sender === userName ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 ${
                              msg.sender === userName
                                ? "bg-primary text-white"
                                : "bg-gray-700 text-white"
                            }`}
                          >
                            {msg.sender !== userName && (
                              <p className="mb-1 text-gray-300 text-xs">
                                {msg.sender}
                              </p>
                            )}
                            <p className="text-sm">{msg.message}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form
                  onSubmit={sendMessage}
                  className="border-gray-700 border-t p-4"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewMessage(e.target.value)
                      }
                      placeholder="Type a message..."
                      className="flex-1 rounded-lg bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default VideoConference;
