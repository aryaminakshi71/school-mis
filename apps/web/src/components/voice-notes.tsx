import { motion } from "framer-motion";
import {
  AlertCircle,
  Loader2,
  Mic,
  Pause,
  Play,
  Send,
  Square,
  Trash2,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface VoiceNote {
  id: string;
  url: string;
  duration: number;
  timestamp: Date;
  transcript?: string;
}

interface VoiceNotesProps {
  onSend: (voiceNote: Omit<VoiceNote, "id" | "timestamp">) => Promise<void>;
  maxDuration?: number; // in seconds
  entityType?: "student" | "teacher" | "parent";
  entityName?: string;
}

export function VoiceNotes({
  onSend,
  maxDuration = 300,
  entityType = "student",
  entityName,
}: VoiceNotesProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [permissionDenied, setPermissionDenied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setPermissionDenied(false);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration - 1) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      setPermissionDenied(true);
    }
  }, [maxDuration]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isRecording]);

  const togglePlayback = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setTranscript("");
  };

  const transcribeAudio = async () => {
    if (!audioBlob) return;

    setIsTranscribing(true);

    // Check if browser supports Speech Recognition API
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      // For demo, simulate transcription
      setTimeout(() => {
        setTranscript(
          `Voice note from teacher regarding ${entityName}'s recent performance in class. The student has shown significant improvement in mathematics and is actively participating in discussions.`,
        );
        setIsTranscribing(false);
      }, 2000);
    } else {
      setIsTranscribing(false);
      setTranscript(
        "Speech recognition not supported in this browser. Please type your message.",
      );
    }
  };

  const sendVoiceNote = async () => {
    if (!audioBlob) return;

    setIsSending(true);
    try {
      await onSend({
        url: audioUrl!,
        duration: recordingTime,
        transcript: transcript || undefined,
      });

      deleteRecording();
    } catch (error) {
      console.error("Failed to send voice note:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-gray-200 border-b p-4 dark:border-gray-800">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
          <Mic className="h-5 w-5 text-primary" />
          Voice Notes
        </h3>
        <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
          Record voice feedback for {entityName}
        </p>
      </div>

      <div className="p-4">
        {permissionDenied ? (
          <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
            <div>
              <p className="font-medium text-red-900 text-sm dark:text-red-300">
                Microphone Access Required
              </p>
              <p className="mt-1 text-red-700 text-sm dark:text-red-400">
                Please allow microphone access in your browser settings to
                record voice notes.
              </p>
            </div>
          </div>
        ) : !audioBlob ? (
          <div className="flex flex-col items-center py-8">
            {/* Recording Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-all ${
                isRecording
                  ? "animate-pulse bg-red-500 hover:bg-red-600"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isRecording ? (
                <Square className="h-8 w-8 text-white" />
              ) : (
                <Mic className="h-8 w-8 text-white" />
              )}

              {/* Recording Ring Animation */}
              {isRecording && (
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-red-500"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </button>

            {/* Timer */}
            <div className="mt-4 text-center">
              <p
                className={`font-bold font-mono text-2xl ${isRecording ? "text-red-500" : "text-gray-900 dark:text-gray-100"}`}
              >
                {formatTime(recordingTime)}
              </p>
              <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
                {isRecording ? "Recording..." : "Tap to record"}
              </p>
              {isRecording && (
                <p className="mt-1 text-gray-400 text-xs">
                  Max: {formatTime(maxDuration)}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Audio Player */}
            <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <button
                onClick={togglePlayback}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>

              <div className="flex-1">
                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: isPlaying ? "100%" : "0%" }}
                  />
                </div>
                <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
                  {formatTime(recordingTime)}
                </p>
              </div>

              <button
                onClick={deleteRecording}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <audio
              ref={audioRef}
              src={audioUrl!}
              onEnded={handleAudioEnded}
              className="hidden"
            />

            {/* Transcription */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="font-medium text-gray-700 text-sm dark:text-gray-300">
                  Transcript (Optional)
                </label>
                <button
                  onClick={transcribeAudio}
                  disabled={isTranscribing}
                  className="text-primary text-xs hover:text-primary/80 disabled:opacity-50"
                >
                  {isTranscribing ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Transcribing...
                    </span>
                  ) : (
                    "Auto-transcribe"
                  )}
                </button>
              </div>
              <textarea
                value={transcript}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setTranscript(e.target.value)
                }
                placeholder="Add transcript or notes..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={sendVoiceNote}
              disabled={isSending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send Voice Note
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Tips */}
      {!isRecording && !audioBlob && (
        <div className="px-4 pb-4">
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <p className="text-blue-700 text-xs dark:text-blue-300">
              💡 Tip: Speak clearly and keep your voice note under 5 minutes for
              best results.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoiceNotes;
