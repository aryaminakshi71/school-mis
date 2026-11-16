import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Download,
  MessageSquare,
  Mic,
  MicOff,
  Pause,
  Play,
  RefreshCw,
  Send,
  Trash2,
  Volume2,
} from "lucide-react";
import { useRef, useState } from "react";

interface VoiceNote {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  audioUrl: string;
  duration: number;
  transcript?: string;
  transcriptStatus: "pending" | "processing" | "completed" | "error";
  timestamp: string;
  isListened: boolean;
  context?: string;
}

interface VoiceNotesSystemProps {
  className?: string;
}

const defaultVoiceNotes: VoiceNote[] = [
  {
    id: "1",
    senderId: "t1",
    senderName: "Mrs. Sharma",
    audioUrl: "#",
    duration: 45,
    transcript:
      "Hi Rahul's parents, I wanted to discuss his recent test performance. He's shown great improvement in Mathematics but needs a bit more practice in Geometry. Could you please ensure he completes the homework assignments this week?",
    transcriptStatus: "completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isListened: true,
    context: "Class 10-A",
  },
  {
    id: "2",
    senderId: "principal",
    senderName: "Principal",
    audioUrl: "#",
    duration: 120,
    transcript:
      "Dear parents, this is a reminder about the upcoming Annual Day celebrations. We would love to have your support and participation. Please confirm your attendance by replying to this message.",
    transcriptStatus: "completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isListened: false,
  },
  {
    id: "3",
    senderId: "t2",
    senderName: "Mr. Patel",
    audioUrl: "#",
    duration: 30,
    transcriptStatus: "processing",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isListened: false,
    context: "Science Club",
  },
];

export function VoiceNotesSystem({ className }: VoiceNotesSystemProps) {
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>(defaultVoiceNotes);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [showTranscript, setShowTranscript] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unlistened">("all");
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const playbackInterval = useRef<NodeJS.Timeout | null>(null);

  const unlistenedCount = voiceNotes.filter((n) => !n.isListened).length;

  const filteredNotes =
    filter === "unlistened"
      ? voiceNotes.filter((n) => !n.isListened)
      : voiceNotes;

  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    recordingInterval.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    setIsRecording(false);

    // Add new voice note
    const newNote: VoiceNote = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: "You",
      audioUrl: "#",
      duration: recordingDuration,
      transcriptStatus: "processing",
      timestamp: new Date().toISOString(),
      isListened: true,
    };
    setVoiceNotes([newNote, ...voiceNotes]);
    setRecordingDuration(0);

    // Simulate transcription completion
    setTimeout(() => {
      setVoiceNotes((notes) =>
        notes.map((n) =>
          n.id === newNote.id
            ? {
                ...n,
                transcriptStatus: "completed",
                transcript:
                  "This is a test voice message. The AI transcription system has successfully converted your voice to text.",
              }
            : n,
        ),
      );
    }, 3000);
  };

  const cancelRecording = () => {
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    setIsRecording(false);
    setRecordingDuration(0);
  };

  const playNote = (id: string) => {
    if (currentPlaying === id) {
      if (playbackInterval.current) {
        clearInterval(playbackInterval.current);
      }
      setCurrentPlaying(null);
      setPlaybackProgress(0);
    } else {
      setCurrentPlaying(id);
      setPlaybackProgress(0);
      const note = voiceNotes.find((n) => n.id === id);
      if (note) {
        let progress = 0;
        playbackInterval.current = setInterval(() => {
          progress += 1;
          setPlaybackProgress((progress / note.duration) * 100);
          if (progress >= note.duration) {
            if (playbackInterval.current) {
              clearInterval(playbackInterval.current);
            }
            setCurrentPlaying(null);
            setPlaybackProgress(0);
          }
        }, 1000);
      }
    }
  };

  const markAsListened = (id: string) => {
    setVoiceNotes(
      voiceNotes.map((n) => (n.id === id ? { ...n, isListened: true } : n)),
    );
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Voice Notes
            </h3>
            <p className="text-gray-500 text-sm">
              {unlistenedCount} unlistened • {voiceNotes.length} total
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter(filter === "all" ? "unlistened" : "all")}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              filter === "unlistened"
                ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400"
            }`}
          >
            {filter === "unlistened" ? "Show All" : "Unlistened Only"}
          </button>
        </div>
      </div>

      {/* Recording Interface */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        {isRecording ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
              <span className="font-medium text-red-500">Recording</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full bg-pink-500"
                    animate={{
                      height: [4, 16 + Math.random() * 16, 4],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>
            </div>
            <span className="font-mono text-lg">
              {formatDuration(recordingDuration)}
            </span>
            <button
              onClick={stopRecording}
              className="rounded-full bg-green-500 p-3 text-white transition-colors hover:bg-green-600"
            >
              <Send className="h-5 w-5" />
            </button>
            <button
              onClick={cancelRecording}
              className="rounded-full bg-gray-200 p-3 text-gray-600 transition-colors hover:bg-gray-300 dark:bg-gray-700"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={startRecording}
              className="flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-white transition-colors hover:bg-pink-600"
            >
              <Mic className="h-5 w-5" />
              Record Voice Note
            </button>
            <p className="text-gray-500 text-sm">
              Press to start recording. Max duration: 5 minutes.
            </p>
          </div>
        )}
      </div>

      {/* Voice Notes List */}
      <div className="space-y-3">
        {filteredNotes.map((note) => (
          <motion.div
            key={note.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              if (!note.isListened) markAsListened(note.id);
            }}
            className={`cursor-pointer rounded-xl border bg-white p-4 transition-all dark:bg-gray-800 ${
              note.isListened
                ? "border-gray-200 dark:border-gray-700"
                : "border-pink-300 bg-pink-50/50 dark:border-pink-700 dark:bg-pink-900/10"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-400 to-gray-500 font-semibold text-white">
                {note.senderName[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {note.senderName}
                    </span>
                    {!note.isListened && (
                      <span className="h-2 w-2 rounded-full bg-pink-500" />
                    )}
                  </div>
                  <span className="text-gray-500 text-sm">
                    {formatTimestamp(note.timestamp)}
                  </span>
                </div>

                {/* Audio Player */}
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playNote(note.id);
                    }}
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                      currentPlaying === note.id
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {currentPlaying === note.id ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="ml-0.5 h-5 w-5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full rounded-full bg-pink-500 transition-all"
                        style={{
                          width:
                            currentPlaying === note.id
                              ? `${playbackProgress}%`
                              : "0%",
                        }}
                      />
                    </div>
                  </div>
                  <span className="font-mono text-gray-500 text-sm">
                    {formatDuration(note.duration)}
                  </span>
                </div>

                {/* Transcript */}
                {note.transcriptStatus === "completed" && note.transcript && (
                  <div className="mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTranscript(
                          showTranscript === note.id ? null : note.id,
                        );
                      }}
                      className="flex items-center gap-1 text-pink-600 text-sm hover:underline"
                    >
                      <MessageSquare className="h-4 w-4" />
                      {showTranscript === note.id
                        ? "Hide transcript"
                        : "Show transcript"}
                    </button>
                    <AnimatePresence>
                      {showTranscript === note.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                        >
                          <p className="text-gray-700 text-sm dark:text-gray-300">
                            {note.transcript}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button className="flex items-center gap-1 text-gray-500 text-xs hover:text-gray-700">
                              <Volume2 className="h-3 w-3" />
                              Read aloud
                            </button>
                            <button className="flex items-center gap-1 text-gray-500 text-xs hover:text-gray-700">
                              <Download className="h-3 w-3" />
                              Download text
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {note.transcriptStatus === "processing" && (
                  <div className="mt-3 flex items-center gap-2 text-gray-500 text-sm">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Transcribing voice to text...
                  </div>
                )}

                {note.transcriptStatus === "error" && (
                  <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    Transcription failed. Tap to retry.
                  </div>
                )}

                {/* Context */}
                {note.context && (
                  <span className="mt-3 inline-block rounded bg-gray-100 px-2 py-1 text-gray-600 text-xs dark:bg-gray-700 dark:text-gray-400">
                    {note.context}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          <MicOff className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <p>No voice notes found</p>
          <p className="text-sm">Record your first voice note to get started</p>
        </div>
      )}
    </div>
  );
}
