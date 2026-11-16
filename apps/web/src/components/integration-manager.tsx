import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BarChart3,
  Check,
  CreditCard,
  Database,
  Mail,
  MessageSquare,
  Plug,
  X,
} from "lucide-react";
import { useState } from "react";

export type IntegrationType =
  | "google"
  | "microsoft"
  | "payment"
  | "sms"
  | "email"
  | "analytics";

export interface Integration {
  id: IntegrationType;
  name: string;
  description: string;
  icon: any;
  status: "connected" | "disconnected" | "error";
  lastSync?: Date;
  config?: Record<string, any>;
  features: string[];
}

interface IntegrationManagerProps {
  integrations: Integration[];
  onConnect: (
    id: IntegrationType,
    config: Record<string, any>,
  ) => Promise<void>;
  onDisconnect: (id: IntegrationType) => Promise<void>;
  onSync: (id: IntegrationType) => Promise<void>;
}

const INTEGRATIONS: Integration[] = [
  {
    id: "google",
    name: "Google Workspace",
    description: "Sync with Google Calendar, Gmail, and Google Drive",
    icon: "G",
    status: "disconnected",
    features: [
      "Calendar sync",
      "SSO login",
      "Drive storage",
      "Gmail notifications",
    ],
  },
  {
    id: "microsoft",
    name: "Microsoft 365",
    description: "Connect with Outlook, Teams, and OneDrive",
    icon: "M",
    status: "disconnected",
    features: [
      "Outlook calendar",
      "Teams integration",
      "OneDrive storage",
      "SSO login",
    ],
  },
  {
    id: "payment",
    name: "Payment Gateway",
    description: "Razorpay, Stripe, and Paytm integration",
    icon: CreditCard,
    status: "disconnected",
    features: [
      "Online fee payment",
      "Auto-reconciliation",
      "Payment tracking",
      "Receipt generation",
    ],
  },
  {
    id: "sms",
    name: "SMS Gateway",
    description: "Twilio, Exotel, and MSG91 integration",
    icon: MessageSquare,
    status: "disconnected",
    features: [
      "Bulk SMS",
      "OTP delivery",
      "Attendance alerts",
      "Fee reminders",
    ],
  },
  {
    id: "email",
    name: "Email Service",
    description: "SendGrid, AWS SES, and Mailgun integration",
    icon: Mail,
    status: "disconnected",
    features: ["Bulk email", "Templates", "Analytics", "Delivery tracking"],
  },
  {
    id: "analytics",
    name: "BI Tools",
    description: "Power BI, Tableau, and Google Data Studio",
    icon: BarChart3,
    status: "disconnected",
    features: [
      "Advanced reports",
      "Custom dashboards",
      "Data export",
      "API access",
    ],
  },
];

export function IntegrationManager({
  integrations: initialIntegrations,
  onConnect,
  onDisconnect,
  onSync,
}: IntegrationManagerProps) {
  const [integrations, setIntegrations] = useState<Integration[]>(
    initialIntegrations.length > 0 ? initialIntegrations : INTEGRATIONS,
  );
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [testStatus, setTestStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");

  const handleConnect = async () => {
    if (!selectedIntegration) return;

    setIsConnecting(true);
    setTestStatus("testing");

    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      await onConnect(selectedIntegration.id, configValues);

      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === selectedIntegration.id
            ? { ...i, status: "connected", lastSync: new Date() }
            : i,
        ),
      );

      setTestStatus("success");
      setTimeout(() => {
        setShowConfigModal(false);
        setSelectedIntegration(null);
        setConfigValues({});
        setTestStatus("idle");
      }, 1500);
    } catch (error) {
      setTestStatus("error");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (integration: Integration) => {
    if (confirm(`Are you sure you want to disconnect ${integration.name}?`)) {
      await onDisconnect(integration.id);
      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === integration.id
            ? { ...i, status: "disconnected", lastSync: undefined }
            : i,
        ),
      );
    }
  };

  const handleSync = async (integration: Integration) => {
    await onSync(integration.id);
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === integration.id ? { ...i, lastSync: new Date() } : i,
      ),
    );
  };

  const getConfigFields = (id: IntegrationType) => {
    const fields: Record<
      IntegrationType,
      { key: string; label: string; type: string; placeholder: string }[]
    > = {
      google: [
        {
          key: "clientId",
          label: "Client ID",
          type: "text",
          placeholder: "Enter Google Client ID",
        },
        {
          key: "clientSecret",
          label: "Client Secret",
          type: "password",
          placeholder: "Enter Client Secret",
        },
      ],
      microsoft: [
        {
          key: "tenantId",
          label: "Tenant ID",
          type: "text",
          placeholder: "Enter Microsoft Tenant ID",
        },
        {
          key: "clientId",
          label: "Client ID",
          type: "text",
          placeholder: "Enter Application ID",
        },
        {
          key: "clientSecret",
          label: "Client Secret",
          type: "password",
          placeholder: "Enter Secret",
        },
      ],
      payment: [
        { key: "provider", label: "Provider", type: "select", placeholder: "" },
        {
          key: "apiKey",
          label: "API Key",
          type: "password",
          placeholder: "Enter API Key",
        },
        {
          key: "secretKey",
          label: "Secret Key",
          type: "password",
          placeholder: "Enter Secret Key",
        },
      ],
      sms: [
        { key: "provider", label: "Provider", type: "select", placeholder: "" },
        {
          key: "apiKey",
          label: "API Key",
          type: "password",
          placeholder: "Enter API Key",
        },
        {
          key: "senderId",
          label: "Sender ID",
          type: "text",
          placeholder: "Enter 6-char Sender ID",
        },
      ],
      email: [
        { key: "provider", label: "Provider", type: "select", placeholder: "" },
        {
          key: "apiKey",
          label: "API Key",
          type: "password",
          placeholder: "Enter API Key",
        },
        {
          key: "fromEmail",
          label: "From Email",
          type: "email",
          placeholder: "noreply@school.edu",
        },
      ],
      analytics: [
        { key: "provider", label: "Provider", type: "select", placeholder: "" },
        {
          key: "apiKey",
          label: "API Key",
          type: "password",
          placeholder: "Enter API Key",
        },
        {
          key: "workspaceId",
          label: "Workspace ID",
          type: "text",
          placeholder: "Enter Workspace ID",
        },
      ],
    };
    return fields[id] || [];
  };

  const getProviderOptions = (id: IntegrationType) => {
    const options: Record<string, string[]> = {
      payment: ["Razorpay", "Stripe", "Paytm", "CCAvenue"],
      sms: ["Twilio", "Exotel", "MSG91", "Fast2SMS"],
      email: ["SendGrid", "AWS SES", "Mailgun", "Postmark"],
      analytics: ["Power BI", "Tableau", "Google Data Studio", "Metabase"],
    };
    return options[id] || [];
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-gray-200 border-b p-6 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Plug className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-xl dark:text-gray-100">
              Integrations
            </h2>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              Connect with external services
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            const isConnected = integration.status === "connected";

            return (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`rounded-xl border-2 p-4 transition-all ${
                  isConnected
                    ? "border-green-200 bg-green-50/50 dark:bg-green-900/10"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg font-bold text-xl ${
                        isConnected
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800"
                      }`}
                    >
                      {typeof Icon === "string" ? (
                        Icon
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {integration.name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 text-xs ${
                          isConnected ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {isConnected ? (
                          <>
                            <Check className="h-3 w-3" />
                            Connected
                          </>
                        ) : (
                          "Not connected"
                        )}
                      </span>
                    </div>
                  </div>

                  {isConnected ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSync(integration)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
                        title="Sync now"
                      >
                        <Database className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDisconnect(integration)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                        title="Disconnect"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedIntegration(integration);
                        setShowConfigModal(true);
                      }}
                      className="rounded-lg bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary/90"
                    >
                      Connect
                    </button>
                  )}
                </div>

                <p className="mb-3 text-gray-600 text-sm dark:text-gray-400">
                  {integration.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {integration.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className={`rounded-full px-2 py-1 text-xs ${
                        isConnected
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800"
                      }`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {isConnected && integration.lastSync && (
                  <p className="mt-3 text-gray-500 text-xs">
                    Last synced: {integration.lastSync.toLocaleString()}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Configuration Modal */}
      <AnimatePresence>
        {showConfigModal && selectedIntegration && (
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
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-lg dark:text-gray-100">
                  Connect {selectedIntegration.name}
                </h3>
                <button
                  onClick={() => {
                    setShowConfigModal(false);
                    setSelectedIntegration(null);
                    setConfigValues({});
                    setTestStatus("idle");
                  }}
                  className="rounded-lg p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {getConfigFields(selectedIntegration.id).map((field) => (
                  <div key={field.key}>
                    <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select
                        value={configValues[field.key] || ""}
                        onChange={(e) =>
                          setConfigValues({
                            ...configValues,
                            [field.key]: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
                      >
                        <option value="">Select {field.label}</option>
                        {getProviderOptions(selectedIntegration.id).map(
                          (option) => (
                            <option key={option} value={option.toLowerCase()}>
                              {option}
                            </option>
                          ),
                        )}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={configValues[field.key] || ""}
                        onChange={(e) =>
                          setConfigValues({
                            ...configValues,
                            [field.key]: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
                      />
                    )}
                  </div>
                ))}

                {testStatus === "success" && (
                  <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                    <Check className="h-5 w-5" />
                    Connection successful!
                  </div>
                )}

                {testStatus === "error" && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                    <AlertCircle className="h-5 w-5" />
                    Connection failed. Please check your credentials.
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowConfigModal(false);
                    setSelectedIntegration(null);
                    setConfigValues({});
                    setTestStatus("idle");
                  }}
                  className="flex-1 rounded-lg border border-gray-300 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnect}
                  disabled={
                    isConnecting || Object.keys(configValues).length === 0
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2 text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  {isConnecting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Testing...
                    </>
                  ) : testStatus === "success" ? (
                    <>
                      <Check className="h-4 w-4" />
                      Connected!
                    </>
                  ) : (
                    "Connect"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default IntegrationManager;
