import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  CheckCircle,
  Copy,
  Lock,
  Mail,
  Shield,
  Smartphone,
} from "lucide-react";
import { useState } from "react";

export type TwoFactorMethod = "app" | "sms" | "email";

interface TwoFactorAuthProps {
  userId: string;
  isEnabled: boolean;
  preferredMethod: TwoFactorMethod;
  onEnable: (method: TwoFactorMethod, secret: string) => Promise<void>;
  onDisable: () => Promise<void>;
  onVerify: (code: string) => Promise<boolean>;
}

export function TwoFactorAuth({
  userId,
  isEnabled,
  preferredMethod,
  onEnable,
  onDisable,
  onVerify,
}: TwoFactorAuthProps) {
  const [showSetup, setShowSetup] = useState(false);
  const [setupStep, setSetupStep] = useState<"method" | "verify" | "complete">(
    "method",
  );
  const [selectedMethod, setSelectedMethod] =
    useState<TwoFactorMethod>(preferredMethod);
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);

  const generateSecret = () => {
    // Generate random secret for demo
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let result = "";
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  };

  const startSetup = () => {
    const newSecret = generateSecret();
    setSecret(newSecret);
    setSetupStep("verify");
  };

  const verifyCode = async () => {
    setIsVerifying(true);
    try {
      const isValid = await onVerify(verificationCode);
      if (isValid) {
        const codes = generateBackupCodes();
        setBackupCodes(codes);
        await onEnable(selectedMethod, secret);
        setSetupStep("complete");
      } else {
        alert("Invalid verification code. Please try again.");
      }
    } catch (error) {
      alert("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleDisable = async () => {
    await onDisable();
    setShowDisableConfirm(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-gray-200 border-b p-6 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
            <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-xl dark:text-gray-100">
              Two-Factor Authentication
            </h2>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              Add an extra layer of security to your account
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isEnabled ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-300">
                  2FA is Enabled
                </p>
                <p className="text-green-700 text-sm dark:text-green-400">
                  Your account is protected with{" "}
                  {preferredMethod === "app"
                    ? "Authenticator App"
                    : preferredMethod === "sms"
                      ? "SMS"
                      : "Email"}{" "}
                  verification
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Security Settings
              </h3>

              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {preferredMethod === "app" && (
                      <Smartphone className="h-5 w-5 text-gray-400" />
                    )}
                    {preferredMethod === "sms" && (
                      <Smartphone className="h-5 w-5 text-gray-400" />
                    )}
                    {preferredMethod === "email" && (
                      <Mail className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {preferredMethod === "app" && "Authenticator App"}
                        {preferredMethod === "sms" && "SMS Verification"}
                        {preferredMethod === "email" && "Email Verification"}
                      </p>
                      <p className="text-gray-500 text-sm">Current method</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSetup(true)}
                    className="text-primary text-sm hover:text-primary/80"
                  >
                    Change
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowDisableConfirm(true)}
                className="w-full rounded-xl border border-red-300 px-4 py-3 text-red-600 transition-colors hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Disable 2FA
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-300">
                  2FA is Not Enabled
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Enable two-factor authentication to protect your account
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSetup(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90"
            >
              <Lock className="h-5 w-5" />
              Enable 2FA
            </button>
          </div>
        )}
      </div>

      {/* Setup Modal */}
      <AnimatePresence>
        {showSetup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
            >
              <div className="border-gray-200 border-b p-6 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 text-lg dark:text-gray-100">
                  Setup Two-Factor Authentication
                </h3>
              </div>

              <div className="p-6">
                {setupStep === "method" && (
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm dark:text-gray-400">
                      Choose your preferred 2FA method:
                    </p>

                    <div className="space-y-3">
                      <button
                        onClick={() => setSelectedMethod("app")}
                        className={`w-full rounded-xl border-2 p-4 text-left transition-colors ${
                          selectedMethod === "app"
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-6 w-6 text-primary" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              Authenticator App
                            </p>
                            <p className="text-gray-500 text-sm">
                              Use Google Authenticator or similar apps
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setSelectedMethod("sms")}
                        className={`w-full rounded-xl border-2 p-4 text-left transition-colors ${
                          selectedMethod === "sms"
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-6 w-6 text-primary" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              SMS Verification
                            </p>
                            <p className="text-gray-500 text-sm">
                              Receive codes via text message
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setSelectedMethod("email")}
                        className={`w-full rounded-xl border-2 p-4 text-left transition-colors ${
                          selectedMethod === "email"
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Mail className="h-6 w-6 text-primary" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              Email Verification
                            </p>
                            <p className="text-gray-500 text-sm">
                              Receive codes via email
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>

                    <button
                      onClick={startSetup}
                      className="w-full rounded-xl bg-primary py-3 text-white hover:bg-primary/90"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {setupStep === "verify" && (
                  <div className="space-y-4">
                    {selectedMethod === "app" && (
                      <>
                        <div className="text-center">
                          <div className="mx-auto mb-4 flex h-48 w-48 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <div className="text-center">
                              <div className="mb-2 text-4xl">📱</div>
                              <p className="text-gray-500 text-xs">
                                Scan QR Code
                              </p>
                            </div>
                          </div>
                          <p className="mb-2 text-gray-600 text-sm dark:text-gray-400">
                            Scan this QR code with your authenticator app
                          </p>
                          <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                            <code className="font-mono text-sm">
                              {secret.slice(0, 16)}...
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(secret);
                                alert("Secret copied!");
                              }}
                              className="p-1 text-gray-400 hover:text-primary"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {(selectedMethod === "sms" ||
                      selectedMethod === "email") && (
                      <div className="py-4 text-center">
                        <div className="mb-2 text-4xl">
                          {selectedMethod === "sms" ? "📱" : "📧"}
                        </div>
                        <p className="text-gray-600 text-sm dark:text-gray-400">
                          We've sent a verification code to your{" "}
                          {selectedMethod}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                        Enter verification code
                      </label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setVerificationCode(e.target.value)
                        }
                        placeholder="000000"
                        maxLength={6}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-2xl tracking-widest focus:ring-2 focus:ring-primary dark:border-gray-700"
                      />
                    </div>

                    <button
                      onClick={verifyCode}
                      disabled={verificationCode.length < 6 || isVerifying}
                      className="w-full rounded-xl bg-primary py-3 text-white hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isVerifying ? "Verifying..." : "Verify"}
                    </button>
                  </div>
                )}

                {setupStep === "complete" && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg dark:text-gray-100">
                        2FA Enabled Successfully!
                      </h4>
                    </div>

                    <div className="rounded-xl bg-yellow-50 p-4 dark:bg-yellow-900/20">
                      <div className="mb-3 flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600" />
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                          Save these backup codes in a safe place. You'll need
                          them if you lose access to your 2FA device.
                        </p>
                      </div>

                      <div className="mb-3 grid grid-cols-2 gap-2">
                        {backupCodes.map((code, idx) => (
                          <code
                            key={idx}
                            className="rounded bg-white px-2 py-1 font-mono text-sm dark:bg-gray-800"
                          >
                            {code}
                          </code>
                        ))}
                      </div>

                      <button
                        onClick={copyBackupCodes}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        {copiedCodes ? (
                          <>
                            <Check className="h-4 w-4 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy All Codes
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setShowSetup(false);
                        setSetupStep("method");
                      }}
                      className="w-full rounded-xl bg-primary py-3 text-white"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disable Confirmation */}
      <AnimatePresence>
        {showDisableConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900"
            >
              <div className="mb-4 flex items-center gap-3 text-red-600">
                <AlertTriangle className="h-8 w-8" />
                <h3 className="font-bold text-lg">Disable 2FA?</h3>
              </div>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                This will make your account less secure. Are you sure you want
                to continue?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDisableConfirm(false)}
                  className="flex-1 rounded-lg border border-gray-300 py-2 dark:border-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisable}
                  className="flex-1 rounded-lg bg-red-500 py-2 text-white hover:bg-red-600"
                >
                  Disable
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TwoFactorAuth;
