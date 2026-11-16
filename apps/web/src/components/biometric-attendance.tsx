import { motion } from "framer-motion";
import {
  AlertCircle,
  Camera,
  Check,
  Loader2,
  RefreshCw,
  Scan,
  UserCheck,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface BiometricAttendanceProps {
  onVerify: (faceData: string) => Promise<{
    success: boolean;
    userId?: string;
    name?: string;
    error?: string;
  }>;
  mode?: "check-in" | "check-out";
  entityType?: "student" | "teacher" | "staff";
}

export function BiometricAttendance({
  onVerify,
  mode = "check-in",
  entityType = "student",
}: BiometricAttendanceProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    name?: string;
    error?: string;
    timestamp?: Date;
  } | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCapturing(true);
      setPermissionDenied(false);
      setCameraError(false);
    } catch (error) {
      console.error("Camera access denied:", error);
      setPermissionDenied(true);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCapturing(false);
  }, []);

  const captureFace = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw face detection overlay (simulated)
    ctx.strokeStyle = "#10B981";
    ctx.lineWidth = 3;
    ctx.strokeRect(
      canvas.width * 0.3,
      canvas.height * 0.2,
      canvas.width * 0.4,
      canvas.height * 0.6,
    );

    // Add scanning effect
    const gradient = ctx.createLinearGradient(
      0,
      canvas.height * 0.2,
      0,
      canvas.height * 0.8,
    );
    gradient.addColorStop(0, "rgba(16, 185, 129, 0)");
    gradient.addColorStop(0.5, "rgba(16, 185, 129, 0.3)");
    gradient.addColorStop(1, "rgba(16, 185, 129, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(
      canvas.width * 0.3,
      canvas.height * 0.2,
      canvas.width * 0.4,
      canvas.height * 0.6,
    );

    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(imageData);

    stopCamera();
  }, [stopCamera]);

  const verifyFace = useCallback(async () => {
    if (!capturedImage) return;

    setIsVerifying(true);

    try {
      // In a real implementation, this would send the face data to a backend
      // that uses face recognition APIs (like AWS Rekognition, Azure Face API, etc.)
      const result = await onVerify(capturedImage);

      setVerificationResult({
        success: result.success,
        name: result.name,
        error: result.error,
        timestamp: new Date(),
      });
    } catch (error) {
      setVerificationResult({
        success: false,
        error: "Verification failed. Please try again.",
        timestamp: new Date(),
      });
    } finally {
      setIsVerifying(false);
    }
  }, [capturedImage, onVerify]);

  const resetCapture = () => {
    setCapturedImage(null);
    setVerificationResult(null);
    startCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-gray-200 border-b p-4 dark:border-gray-800">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
          <Scan className="h-5 w-5 text-primary" />
          Biometric {mode === "check-in" ? "Check-in" : "Check-out"}
        </h3>
        <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
          Face recognition for {entityType} attendance
        </p>
      </div>

      <div className="p-4">
        {permissionDenied ? (
          <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
            <div>
              <p className="font-medium text-red-900 text-sm dark:text-red-300">
                Camera Access Required
              </p>
              <p className="mt-1 text-red-700 text-sm dark:text-red-400">
                Please allow camera access in your browser settings to use
                biometric attendance.
              </p>
            </div>
          </div>
        ) : verificationResult ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-xl p-6 text-center ${
              verificationResult.success
                ? "border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                : "border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
            }`}
          >
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                verificationResult.success ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {verificationResult.success ? (
                <Check className="h-8 w-8 text-white" />
              ) : (
                <X className="h-8 w-8 text-white" />
              )}
            </div>

            <h4
              className={`font-bold text-lg ${
                verificationResult.success
                  ? "text-green-900 dark:text-green-300"
                  : "text-red-900 dark:text-red-300"
              }`}
            >
              {verificationResult.success
                ? "Verification Successful!"
                : "Verification Failed"}
            </h4>

            {verificationResult.success && verificationResult.name && (
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                Welcome,{" "}
                <span className="font-semibold">{verificationResult.name}</span>
              </p>
            )}

            {verificationResult.timestamp && (
              <p className="mt-2 text-gray-500 text-sm dark:text-gray-400">
                {mode === "check-in" ? "Checked in at" : "Checked out at"}:{" "}
                {verificationResult.timestamp.toLocaleTimeString()}
              </p>
            )}

            {!verificationResult.success && verificationResult.error && (
              <p className="mt-2 text-red-600 text-sm dark:text-red-400">
                {verificationResult.error}
              </p>
            )}

            <button
              onClick={resetCapture}
              className="mx-auto mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
            >
              <RefreshCw className="h-4 w-4" />
              Scan Again
            </button>
          </motion.div>
        ) : capturedImage ? (
          <div className="space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
              <img
                src={capturedImage}
                alt="Captured face"
                className="h-full w-full object-cover"
              />

              {/* Face detection overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-64 w-48 rounded-lg border-4 border-primary">
                  <div className="-top-8 -translate-x-1/2 absolute left-1/2 transform rounded bg-primary px-2 py-1 text-white text-xs">
                    Face Detected
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCapturedImage(null);
                  startCamera();
                }}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Retake
              </button>
              <button
                onClick={verifyFace}
                disabled={isVerifying}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <UserCheck className="h-5 w-5" />
                    Verify
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {!isCapturing ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Camera className="h-10 w-10 text-gray-400" />
                </div>
                <h4 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
                  Ready to Scan
                </h4>
                <p className="mx-auto mb-4 max-w-xs text-gray-500 text-sm dark:text-gray-400">
                  Position your face in front of the camera for biometric
                  verification
                </p>
                <button
                  onClick={startCamera}
                  className="rounded-xl bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90"
                >
                  Start Camera
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-900">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                  />

                  {/* Face guide overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-64 w-48 rounded-lg border-4 border-white/50">
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-primary/20"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />

                      {/* Corner markers */}
                      <div className="-top-2 -left-2 absolute h-4 w-4 border-primary border-t-4 border-l-4" />
                      <div className="-top-2 -right-2 absolute h-4 w-4 border-primary border-t-4 border-r-4" />
                      <div className="-bottom-2 -left-2 absolute h-4 w-4 border-primary border-b-4 border-l-4" />
                      <div className="-bottom-2 -right-2 absolute h-4 w-4 border-primary border-r-4 border-b-4" />
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="absolute right-4 bottom-4 left-4 text-center">
                    <p className="inline-block rounded-lg bg-black/50 px-3 py-1.5 font-medium text-sm text-white">
                      Position your face within the frame
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={stopCamera}
                    className="flex-1 rounded-xl border border-gray-300 px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={captureFace}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-white transition-colors hover:bg-primary/90"
                  >
                    <Camera className="h-5 w-5" />
                    Capture
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Instructions */}
      {!isCapturing && !capturedImage && !verificationResult && (
        <div className="px-4 pb-4">
          <div className="space-y-2 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <p className="font-medium text-blue-900 text-xs dark:text-blue-300">
              📋 Instructions for best results:
            </p>
            <ul className="ml-4 list-disc space-y-1 text-blue-700 text-xs dark:text-blue-400">
              <li>Ensure good lighting on your face</li>
              <li>Remove glasses, masks, or hats</li>
              <li>Look directly at the camera</li>
              <li>Keep your face steady during capture</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default BiometricAttendance;
