import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle,
  Database,
  Fingerprint,
  Lock,
  Mic,
  MicOff,
  RefreshCw,
  Shield,
  ShieldCheck,
  ShieldOff,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface VoiceBiometricAuthProps {
  userId: string;
  isEnrolled: boolean;
  onEnroll: (
    voiceSamples: Blob[],
  ) => Promise<{ success: boolean; voiceprintId?: string; error?: string }>;
  onVerify: (voiceSample: Blob) => Promise<{
    success: boolean;
    confidence: number;
    isLive: boolean;
    error?: string;
  }>;
  onDeleteVoiceprint: () => Promise<void>;
  onSetupVoicePassword: (phrase: string) => Promise<void>;
  recentVerifications?: Array<{
    id: string;
    timestamp: Date;
    success: boolean;
    confidence: number;
    method: "voice" | "voice+password";
  }>;
}

type AuthMode =
  | "enrollment"
  | "verification"
  | "dashboard"
  | "password-setup"
  | "liveness-check";
type EnrollmentStep = "intro" | "recording" | "processing" | "complete";
type VerificationStep = "ready" | "recording" | "analyzing" | "result";

const VOICE_PHRASES = [
  "My voice is my password",
  "Secure access granted",
  "Identity verified",
  "Biometric authentication",
  "Voice print recognized",
];

export function VoiceBiometricAuth({
  userId,
  isEnrolled,
  onEnroll,
  onVerify,
  onDeleteVoiceprint,
  onSetupVoicePassword,
  recentVerifications = [],
}: VoiceBiometricAuthProps) {
  const [mode, setMode] = useState<AuthMode>(
    isEnrolled ? "dashboard" : "enrollment",
  );
  const [enrollmentStep, setEnrollmentStep] = useState<EnrollmentStep>("intro");
  const [verificationStep, setVerificationStep] =
    useState<VerificationStep>("ready");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [voiceSamples, setVoiceSamples] = useState<Blob[]>([]);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    confidence: number;
    isLive: boolean;
    error?: string;
  } | null>(null);
  const [voicePassword, setVoicePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [visualizerData, setVisualizerData] = useState<number[]>(
    new Array(64).fill(0),
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentPhrase = VOICE_PHRASES[currentPhraseIndex];

  const cleanupAudio = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    mediaRecorderRef.current = null;
  }, []);

  const visualizeAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const normalizedData = Array.from(dataArray)
      .slice(0, 64)
      .map((value) => value / 255);

    setVisualizerData(normalizedData);

    const averageLevel =
      normalizedData.reduce((a, b) => a + b, 0) / normalizedData.length;
    setAudioLevel(averageLevel * 100);

    animationFrameRef.current = requestAnimationFrame(visualizeAudio);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 128;
      analyserRef.current.smoothingTimeConstant = 0.8;

      sourceRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);

      visualizeAudio();

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setPermissionDenied(false);
    } catch (error) {
      console.error("Microphone access denied:", error);
      setPermissionDenied(true);
    }
  }, [visualizeAudio]);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const processEnrollment = useCallback(async () => {
    if (voiceSamples.length < 3) {
      const newSamples = [...voiceSamples];
      if (audioBlob) {
        newSamples.push(audioBlob);
      }
      setVoiceSamples(newSamples);
      setAudioBlob(null);

      if (newSamples.length < 3) {
        setCurrentPhraseIndex((prev) => (prev + 1) % VOICE_PHRASES.length);
        setEnrollmentStep("intro");
      } else {
        setEnrollmentStep("processing");
        try {
          const result = await onEnroll(newSamples);
          if (result.success) {
            setEnrollmentStep("complete");
          } else {
            alert(result.error || "Enrollment failed. Please try again.");
            setVoiceSamples([]);
            setEnrollmentStep("intro");
            setCurrentPhraseIndex(0);
          }
        } catch (error) {
          console.error("Enrollment error:", error);
          alert("Enrollment failed. Please try again.");
          setVoiceSamples([]);
          setEnrollmentStep("intro");
          setCurrentPhraseIndex(0);
        }
      }
    }
  }, [voiceSamples, audioBlob, onEnroll]);

  const processVerification = useCallback(async () => {
    if (!audioBlob) return;

    setVerificationStep("analyzing");
    cleanupAudio();

    try {
      const result = await onVerify(audioBlob);
      setVerificationResult(result);
      setVerificationStep("result");
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult({
        success: false,
        confidence: 0,
        isLive: false,
        error: "Verification failed. Please try again.",
      });
      setVerificationStep("result");
    }
  }, [audioBlob, onVerify, cleanupAudio]);

  const resetVerification = useCallback(() => {
    setVerificationStep("ready");
    setAudioBlob(null);
    setVerificationResult(null);
    setVisualizerData(new Array(64).fill(0));
    setAudioLevel(0);
  }, []);

  const resetEnrollment = useCallback(() => {
    setEnrollmentStep("intro");
    setVoiceSamples([]);
    setAudioBlob(null);
    setCurrentPhraseIndex(0);
    setVisualizerData(new Array(64).fill(0));
    setAudioLevel(0);
  }, []);

  const handleVoicePasswordSetup = useCallback(async () => {
    if (voicePassword.length < 4) {
      alert("Voice password must be at least 4 characters");
      return;
    }
    await onSetupVoicePassword(voicePassword);
    setMode("dashboard");
    setVoicePassword("");
  }, [voicePassword, onSetupVoicePassword]);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  const confidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-500";
    if (confidence >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const confidenceBg = (confidence: number) => {
    if (confidence >= 90) return "bg-green-500";
    if (confidence >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-2 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-600/20">
              <Fingerprint className="h-7 w-7 text-indigo-400" />
            </div>
            <div>
              <h1 className="font-bold text-3xl text-white tracking-tight">
                Voice Biometric Authentication
              </h1>
              <p className="text-slate-400">
                Secure your identity with voice recognition
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex gap-2 overflow-x-auto pb-2"
        >
          {[
            { id: "dashboard", label: "Dashboard", icon: Activity },
            {
              id: "enrollment",
              label: isEnrolled ? "Re-enroll Voice" : "Enroll Voice",
              icon: Mic,
            },
            { id: "verification", label: "Verify Identity", icon: ShieldCheck },
            { id: "password-setup", label: "Voice Password", icon: Lock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as AuthMode)}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 font-medium transition-all duration-300 ${
                mode === tab.id
                  ? "bg-indigo-600 text-white shadow-indigo-500/25 shadow-lg"
                  : "border border-slate-700/50 bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {/* Dashboard */}
          {mode === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-3"
            >
              {/* Status Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 lg:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-semibold text-white text-xl">
                    <Shield className="h-5 w-5 text-indigo-400" />
                    Security Status
                  </h2>
                  {isEnrolled ? (
                    <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 font-medium text-green-400 text-sm">
                      Protected
                    </span>
                  ) : (
                    <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 font-medium text-sm text-yellow-400">
                      Not Enrolled
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                      <Mic className="h-5 w-5 text-indigo-400" />
                    </div>
                    <p className="text-slate-400 text-sm">Voice Enrollment</p>
                    <p
                      className={`font-semibold text-lg ${isEnrolled ? "text-green-400" : "text-slate-500"}`}
                    >
                      {isEnrolled ? "Active" : "Not Set"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                      <Activity className="h-5 w-5 text-cyan-400" />
                    </div>
                    <p className="text-slate-400 text-sm">Liveness Detection</p>
                    <p className="font-semibold text-cyan-400 text-lg">
                      Enabled
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                      <Database className="h-5 w-5 text-purple-400" />
                    </div>
                    <p className="text-slate-400 text-sm">Voiceprint Samples</p>
                    <p className="font-semibold text-lg text-white">
                      {isEnrolled ? "3" : "0"}
                    </p>
                  </div>
                </div>

                {isEnrolled && (
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setMode("verification")}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition-colors hover:bg-indigo-500"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Test Verification
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 transition-colors hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Recent Verifications */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <h2 className="mb-4 flex items-center gap-2 font-semibold text-lg text-white">
                  <Activity className="h-5 w-5 text-cyan-400" />
                  Recent Activity
                </h2>

                {recentVerifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
                      <Activity className="h-6 w-6 text-slate-500" />
                    </div>
                    <p className="text-slate-500 text-sm">
                      No recent verifications
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentVerifications.slice(0, 5).map((record) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              record.success
                                ? "bg-green-500/10 text-green-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {record.success ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <AlertCircle className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-white">
                              {record.success ? "Verified" : "Failed"}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {record.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold text-sm ${confidenceColor(record.confidence)}`}
                          >
                            {record.confidence.toFixed(0)}%
                          </p>
                          <p className="text-slate-500 text-xs">
                            {record.method}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Enrollment */}
          {mode === "enrollment" && (
            <motion.div
              key="enrollment"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mx-auto max-w-3xl"
            >
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
                {enrollmentStep === "intro" && (
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-600/20"
                    >
                      <Mic className="h-10 w-10 text-indigo-400" />
                    </motion.div>

                    <h2 className="mb-3 font-bold text-2xl text-white">
                      Voice Enrollment
                    </h2>
                    <p className="mx-auto mb-8 max-w-md text-slate-400">
                      We need 3 voice samples to create your unique voiceprint.
                      Please read the phrase below clearly.
                    </p>

                    <div className="mb-8 rounded-xl border border-slate-700/50 bg-slate-800/50 p-6">
                      <p className="mb-2 text-slate-500 text-xs uppercase tracking-wider">
                        Sample {voiceSamples.length + 1} of 3
                      </p>
                      <p className="font-medium text-white text-xl">
                        &ldquo;{currentPhrase}&rdquo;
                      </p>
                    </div>

                    {permissionDenied ? (
                      <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                        <div className="mb-2 flex items-center gap-2 text-red-400">
                          <AlertCircle className="h-5 w-5" />
                          <span className="font-medium">
                            Microphone Access Required
                          </span>
                        </div>
                        <p className="text-red-300/80 text-sm">
                          Please allow microphone access to continue with voice
                          enrollment.
                        </p>
                      </div>
                    ) : null}

                    <button
                      onClick={() => {
                        setEnrollmentStep("recording");
                        startRecording();
                      }}
                      disabled={isRecording}
                      className="mx-auto flex items-center gap-3 rounded-xl bg-indigo-600 px-8 py-4 font-medium text-white transition-colors hover:bg-indigo-500"
                    >
                      <Mic className="h-5 w-5" />
                      Start Recording
                    </button>
                  </div>
                )}

                {enrollmentStep === "recording" && (
                  <div className="text-center">
                    <div className="mb-8">
                      <div className="relative mx-auto mb-6 h-48 w-48">
                        {/* Animated rings */}
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.2, 0.5],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-indigo-500/20"
                        />
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.1, 0.3],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-4 rounded-full bg-indigo-500/30"
                        />

                        {/* Center circle with audio level */}
                        <div className="absolute inset-8 flex items-center justify-center rounded-full border border-slate-700 bg-slate-800">
                          <div className="text-center">
                            <Mic className="mx-auto mb-1 h-8 w-8 text-red-400" />
                            <p className="font-bold text-2xl text-white">
                              {Math.round(audioLevel)}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Voiceprint visualization */}
                      <div className="mb-4 flex h-16 items-end justify-center gap-1">
                        {visualizerData.map((level, idx) => (
                          <motion.div
                            key={idx}
                            animate={{ height: `${level * 100}%` }}
                            transition={{ duration: 0.05 }}
                            className="w-1.5 rounded-full bg-gradient-to-t from-indigo-600 to-cyan-400"
                            style={{ opacity: 0.3 + level * 0.7 }}
                          />
                        ))}
                      </div>

                      <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                        <p className="font-medium text-lg text-white">
                          &ldquo;{currentPhrase}&rdquo;
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        stopRecording();
                        setEnrollmentStep("processing");
                        setTimeout(processEnrollment, 500);
                      }}
                      className="mx-auto flex items-center gap-2 rounded-xl bg-red-500 px-6 py-3 font-medium text-white transition-colors hover:bg-red-600"
                    >
                      <MicOff className="h-5 w-5" />
                      Stop Recording
                    </button>
                  </div>
                )}

                {enrollmentStep === "processing" && (
                  <div className="py-12 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500"
                    />
                    <h3 className="mb-2 font-semibold text-white text-xl">
                      Processing Voiceprint...
                    </h3>
                    <p className="text-slate-400">
                      Analyzing frequency patterns and creating your biometric
                      signature
                    </p>
                  </div>
                )}

                {enrollmentStep === "complete" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center"
                  >
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-green-500/30 bg-green-500/20">
                      <CheckCircle className="h-10 w-10 text-green-400" />
                    </div>
                    <h2 className="mb-3 font-bold text-2xl text-white">
                      Enrollment Complete!
                    </h2>
                    <p className="mx-auto mb-8 max-w-md text-slate-400">
                      Your voiceprint has been successfully created. You can now
                      use voice authentication.
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => {
                          resetEnrollment();
                          setMode("dashboard");
                        }}
                        className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-500"
                      >
                        Go to Dashboard
                      </button>
                      <button
                        onClick={() => {
                          resetEnrollment();
                          setMode("verification");
                        }}
                        className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-700"
                      >
                        Test Verification
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Verification */}
          {mode === "verification" && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mx-auto max-w-3xl"
            >
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
                {verificationStep === "ready" && (
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-600/20"
                    >
                      <ShieldCheck className="h-10 w-10 text-indigo-400" />
                    </motion.div>

                    <h2 className="mb-3 font-bold text-2xl text-white">
                      Voice Verification
                    </h2>
                    <p className="mx-auto mb-8 max-w-md text-slate-400">
                      Speak clearly to verify your identity. The system will
                      analyze your voice against your stored voiceprint.
                    </p>

                    <div className="mb-8 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/20">
                          <Shield className="h-6 w-6 text-indigo-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-white">
                            Security Features Active
                          </p>
                          <ul className="mt-1 space-y-1 text-slate-400 text-sm">
                            <li className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-400" />
                              Liveness detection enabled
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-400" />
                              Anti-spoofing protection
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {permissionDenied ? (
                      <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                        <div className="mb-2 flex items-center gap-2 text-red-400">
                          <AlertCircle className="h-5 w-5" />
                          <span className="font-medium">
                            Microphone Access Required
                          </span>
                        </div>
                        <p className="text-red-300/80 text-sm">
                          Please allow microphone access to verify your
                          identity.
                        </p>
                      </div>
                    ) : null}

                    <button
                      onClick={() => {
                        setVerificationStep("recording");
                        startRecording();
                      }}
                      className="mx-auto flex items-center gap-3 rounded-xl bg-indigo-600 px-8 py-4 font-medium text-white transition-colors hover:bg-indigo-500"
                    >
                      <Mic className="h-5 w-5" />
                      Start Verification
                    </button>
                  </div>
                )}

                {verificationStep === "recording" && (
                  <div className="text-center">
                    <div className="mb-8">
                      <div className="relative mx-auto mb-6 h-48 w-48">
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.2, 0.5],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-indigo-500/20"
                        />
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.1, 0.3],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-4 rounded-full bg-cyan-500/30"
                        />

                        <div className="absolute inset-8 flex items-center justify-center rounded-full border border-slate-700 bg-slate-800">
                          <div className="text-center">
                            <Mic className="mx-auto mb-1 h-8 w-8 text-red-400" />
                            <p className="font-bold text-2xl text-white">
                              {Math.round(audioLevel)}%
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 flex h-16 items-end justify-center gap-1">
                        {visualizerData.map((level, idx) => (
                          <motion.div
                            key={idx}
                            animate={{ height: `${level * 100}%` }}
                            transition={{ duration: 0.05 }}
                            className="w-1.5 rounded-full bg-gradient-to-t from-indigo-600 to-cyan-400"
                            style={{ opacity: 0.3 + level * 0.7 }}
                          />
                        ))}
                      </div>

                      <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                        <p className="mb-1 text-slate-400 text-sm">
                          Speak naturally to verify
                        </p>
                        <p className="font-medium text-lg text-white">
                          Say anything or use your voice password
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        stopRecording();
                        setTimeout(processVerification, 500);
                      }}
                      className="mx-auto flex items-center gap-2 rounded-xl bg-red-500 px-6 py-3 font-medium text-white transition-colors hover:bg-red-600"
                    >
                      <MicOff className="h-5 w-5" />
                      Stop & Analyze
                    </button>
                  </div>
                )}

                {verificationStep === "analyzing" && (
                  <div className="py-12 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500"
                    />
                    <h3 className="mb-2 font-semibold text-white text-xl">
                      Analyzing Voiceprint...
                    </h3>
                    <p className="text-slate-400">
                      Comparing voice patterns and checking liveness
                    </p>

                    <div className="mt-8 flex justify-center gap-2">
                      {["Frequency", "Pattern", "Liveness"].map((step, idx) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.5 }}
                          className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2"
                        >
                          <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                          <span className="text-slate-300 text-sm">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {verificationStep === "result" && verificationResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center"
                  >
                    <div
                      className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ${
                        verificationResult.success
                          ? "border border-green-500/30 bg-green-500/20"
                          : "border border-red-500/30 bg-red-500/20"
                      }`}
                    >
                      {verificationResult.success ? (
                        <ShieldCheck className="h-12 w-12 text-green-400" />
                      ) : (
                        <ShieldOff className="h-12 w-12 text-red-400" />
                      )}
                    </div>

                    <h2
                      className={`mb-2 font-bold text-2xl ${
                        verificationResult.success
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {verificationResult.success
                        ? "Identity Verified!"
                        : "Verification Failed"}
                    </h2>

                    {!verificationResult.isLive && (
                      <div className="mx-auto mb-6 max-w-md rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
                        <div className="mb-2 flex items-center gap-2 text-yellow-400">
                          <AlertTriangle className="h-5 w-5" />
                          <span className="font-medium">
                            Liveness Check Failed
                          </span>
                        </div>
                        <p className="text-sm text-yellow-300/80">
                          The system detected possible spoofing. Please ensure
                          you are speaking naturally.
                        </p>
                      </div>
                    )}

                    <div className="mx-auto mb-8 grid max-w-md grid-cols-3 gap-4">
                      <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                        <p className="mb-1 text-slate-500 text-xs">
                          Confidence
                        </p>
                        <p
                          className={`font-bold text-xl ${confidenceColor(verificationResult.confidence)}`}
                        >
                          {verificationResult.confidence.toFixed(1)}%
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                        <p className="mb-1 text-slate-500 text-xs">Liveness</p>
                        <p
                          className={`font-bold text-xl ${verificationResult.isLive ? "text-green-400" : "text-red-400"}`}
                        >
                          {verificationResult.isLive ? "PASS" : "FAIL"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                        <p className="mb-1 text-slate-500 text-xs">Status</p>
                        <p
                          className={`font-bold text-xl ${verificationResult.success ? "text-green-400" : "text-red-400"}`}
                        >
                          {verificationResult.success ? "MATCH" : "NO MATCH"}
                        </p>
                      </div>
                    </div>

                    {verificationResult.success && (
                      <div className="mx-auto mb-8 max-w-md">
                        <div className="h-3 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${verificationResult.confidence}%`,
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full ${confidenceBg(verificationResult.confidence)}`}
                          />
                        </div>
                        <p className="mt-2 text-slate-500 text-sm">
                          Match confidence score
                        </p>
                      </div>
                    )}

                    {verificationResult.error && (
                      <p className="mb-6 text-red-400">
                        {verificationResult.error}
                      </p>
                    )}

                    <div className="flex justify-center gap-3">
                      <button
                        onClick={resetVerification}
                        className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-700"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                      </button>
                      <button
                        onClick={() => setMode("dashboard")}
                        className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-500"
                      >
                        Back to Dashboard
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Password Setup */}
          {mode === "password-setup" && (
            <motion.div
              key="password-setup"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mx-auto max-w-2xl"
            >
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-600/20">
                    <Lock className="h-8 w-8 text-indigo-400" />
                  </div>
                  <h2 className="mb-2 font-bold text-2xl text-white">
                    Voice Password Setup
                  </h2>
                  <p className="text-slate-400">
                    Create a voice password for enhanced multi-factor
                    authentication
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6">
                    <label className="mb-3 block font-medium text-slate-300 text-sm">
                      Voice Password Phrase
                    </label>
                    <input
                      type="text"
                      value={voicePassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setVoicePassword(e.target.value)
                      }
                      placeholder="Enter a phrase you'll speak during verification"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="mt-2 text-slate-500 text-xs">
                      This phrase will be used alongside your voiceprint for
                      added security
                    </p>
                  </div>

                  <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="mt-0.5 h-5 w-5 text-indigo-400" />
                      <div>
                        <p className="mb-1 font-medium text-indigo-300">
                          Multi-Factor Authentication
                        </p>
                        <p className="text-indigo-200/80 text-sm">
                          When enabled, you&apos;ll need both your voiceprint
                          AND this phrase to access protected areas.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setMode("dashboard")}
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleVoicePasswordSetup}
                      disabled={voicePassword.length < 4}
                      className="flex-1 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Set Voice Password
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
              >
                <div className="mb-4 flex items-center gap-3 text-red-400">
                  <AlertTriangle className="h-8 w-8" />
                  <h3 className="font-bold text-xl">Delete Voiceprint?</h3>
                </div>
                <p className="mb-6 text-slate-400">
                  This will permanently remove your voice biometric data from
                  the system. You will need to re-enroll to use voice
                  authentication again.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-3 font-medium text-white transition-colors hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await onDeleteVoiceprint();
                      setShowDeleteConfirm(false);
                      setMode("enrollment");
                    }}
                    className="flex-1 rounded-xl bg-red-500 py-3 font-medium text-white transition-colors hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default VoiceBiometricAuth;
