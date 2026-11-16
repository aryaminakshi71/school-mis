import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  CheckCircle,
  Download,
  ExternalLink,
  Globe,
  Lock,
  QrCode,
  RefreshCw,
  Search,
  Shield,
  User,
  Verified,
  X,
} from "lucide-react";
import { useState } from "react";

export type CertificateType =
  | "diploma"
  | "transcript"
  | "achievement"
  | "participation"
  | "completion"
  | "honor"
  | "competency";
export type VerificationStatus = "verified" | "pending" | "failed" | "revoked";
export type BlockchainNetwork =
  | "ethereum"
  | "polygon"
  | "solana"
  | "hyperledger";

export interface BlockchainCertificate {
  id: string;
  certificateId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  type: CertificateType;
  title: string;
  description: string;
  issueDate: Date;
  expiryDate?: Date;
  issuer: {
    name: string;
    address: string;
    signature: string;
  };
  recipient: {
    name: string;
    walletAddress?: string;
    email: string;
  };
  credentials: {
    grade?: string;
    gpa?: number;
    honors?: string[];
    achievements?: string[];
    courses?: string[];
    skills?: string[];
  };
  blockchain: {
    network: BlockchainNetwork;
    transactionHash: string;
    blockNumber: number;
    contractAddress: string;
    timestamp: Date;
    gasUsed: number;
  };
  ipfs: {
    hash: string;
    url: string;
    metadataHash: string;
  };
  verification: {
    status: VerificationStatus;
    lastVerified?: Date;
    verifiedBy?: string;
    qrCodeUrl: string;
  };
  metadata: {
    version: string;
    language: string;
    format: "pdf" | "json" | "both";
    size: number;
  };
  shareableLink: string;
  isRevoked: boolean;
  revokedAt?: Date;
  revokedReason?: string;
}

export interface VerificationRequest {
  id: string;
  certificateId: string;
  requestedBy: string;
  requestedAt: Date;
  status: "pending" | "approved" | "rejected";
  purpose: string;
  verifiedData?: {
    isValid: boolean;
    blockchainConfirmed: boolean;
    issuerValid: boolean;
    notRevoked: boolean;
    timestamp: Date;
  };
}

export interface IssuerProfile {
  id: string;
  name: string;
  type: "school" | "university" | "organization";
  walletAddress: string;
  publicKey: string;
  reputation: number;
  certificatesIssued: number;
  isVerified: boolean;
  registeredAt: Date;
}

interface BlockchainCertificatesProps {
  userRole?: "admin" | "teacher" | "student" | "verifier";
  userId?: string;
  onIssueCertificate?: (
    certificate: Omit<
      BlockchainCertificate,
      | "id"
      | "blockchain"
      | "ipfs"
      | "verification"
      | "shareableLink"
      | "isRevoked"
    >,
  ) => Promise<BlockchainCertificate>;
  onVerifyCertificate?: (certificateId: string) => Promise<boolean>;
  onRevokeCertificate?: (
    certificateId: string,
    reason: string,
  ) => Promise<void>;
  onDownloadCertificate?: (
    certificateId: string,
    format: "pdf" | "json",
  ) => Promise<void>;
  onShareCertificate?: (
    certificateId: string,
    platform: string,
  ) => Promise<string>;
}

export function BlockchainCertificates({
  userRole = "student",
  userId = "S001",
  onIssueCertificate,
  onVerifyCertificate,
  onRevokeCertificate,
  onDownloadCertificate,
  onShareCertificate,
}: BlockchainCertificatesProps) {
  const [activeTab, setActiveTab] = useState<
    "my-certificates" | "verify" | "issue" | "analytics"
  >("my-certificates");
  const [selectedCertificate, setSelectedCertificate] =
    useState<BlockchainCertificate | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<CertificateType | "all">("all");
  const [verificationInput, setVerificationInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const [certificates] = useState<BlockchainCertificate[]>([
    {
      id: "BC001",
      certificateId: "CERT-2025-001",
      studentId: "S001",
      studentName: "Emma Johnson",
      studentEmail: "emma.johnson@student.school.edu",
      type: "diploma",
      title: "High School Diploma",
      description:
        "Graduation certificate for successful completion of high school curriculum with honors",
      issueDate: new Date(Date.now() - 7776000000),
      issuer: {
        name: "Lincoln High School",
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        signature: "0x8f3c...a2b1",
      },
      recipient: {
        name: "Emma Johnson",
        walletAddress: "0x1234...5678",
        email: "emma.johnson@student.school.edu",
      },
      credentials: {
        grade: "A",
        gpa: 3.85,
        honors: ["Summa Cum Laude", "STEM Excellence Award"],
        achievements: ["Dean's List 4 Years", "National Honor Society"],
        courses: ["Advanced Mathematics", "AP Physics", "Computer Science"],
        skills: ["Problem Solving", "Critical Thinking", "Leadership"],
      },
      blockchain: {
        network: "polygon",
        transactionHash: "0xabc123...def456",
        blockNumber: 45678901,
        contractAddress: "0x742d...0bEb",
        timestamp: new Date(Date.now() - 7776000000),
        gasUsed: 0.0025,
      },
      ipfs: {
        hash: "QmXyz123...abc789",
        url: "https://ipfs.io/ipfs/QmXyz123...abc789",
        metadataHash: "QmMetadata...hash456",
      },
      verification: {
        status: "verified",
        lastVerified: new Date(),
        verifiedBy: "Blockchain Network",
        qrCodeUrl:
          "https://api.qrserver.com/v1/create-qr-code/?data=verify:cert-2025-001",
      },
      metadata: {
        version: "1.0",
        language: "en",
        format: "pdf",
        size: 2457600,
      },
      shareableLink: "https://certs.school.edu/verify/cert-2025-001",
      isRevoked: false,
    },
    {
      id: "BC002",
      certificateId: "CERT-2024-042",
      studentId: "S001",
      studentName: "Emma Johnson",
      studentEmail: "emma.johnson@student.school.edu",
      type: "achievement",
      title: "National Science Fair Winner",
      description:
        "First place award in the National High School Science Fair for Environmental Innovation Project",
      issueDate: new Date(Date.now() - 15552000000),
      issuer: {
        name: "National Science Foundation",
        address: "0x9876...5432",
        signature: "0x3d4e...f5g6",
      },
      recipient: {
        name: "Emma Johnson",
        walletAddress: "0x1234...5678",
        email: "emma.johnson@student.school.edu",
      },
      credentials: {
        honors: ["1st Place - Environmental Science Category"],
        achievements: ["Sustainable Water Purification System"],
      },
      blockchain: {
        network: "ethereum",
        transactionHash: "0xdef789...abc012",
        blockNumber: 18901234,
        contractAddress: "0x9876...5432",
        timestamp: new Date(Date.now() - 15552000000),
        gasUsed: 0.0042,
      },
      ipfs: {
        hash: "QmAbc456...def012",
        url: "https://ipfs.io/ipfs/QmAbc456...def012",
        metadataHash: "QmAward...meta789",
      },
      verification: {
        status: "verified",
        lastVerified: new Date(),
        verifiedBy: "Ethereum Mainnet",
        qrCodeUrl:
          "https://api.qrserver.com/v1/create-qr-code/?data=verify:cert-2024-042",
      },
      metadata: {
        version: "1.0",
        language: "en",
        format: "both",
        size: 1843200,
      },
      shareableLink: "https://certs.school.edu/verify/cert-2024-042",
      isRevoked: false,
    },
    {
      id: "BC003",
      certificateId: "CERT-2024-128",
      studentId: "S001",
      studentName: "Emma Johnson",
      studentEmail: "emma.johnson@student.school.edu",
      type: "transcript",
      title: "Academic Transcript - Fall 2024",
      description:
        "Official academic transcript for Fall 2024 semester with blockchain verification",
      issueDate: new Date(Date.now() - 10368000000),
      expiryDate: new Date(Date.now() + 31536000000),
      issuer: {
        name: "Lincoln High School",
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        signature: "0x7h8i...j9k0",
      },
      recipient: {
        name: "Emma Johnson",
        walletAddress: "0x1234...5678",
        email: "emma.johnson@student.school.edu",
      },
      credentials: {
        gpa: 3.92,
        courses: [
          "AP Calculus BC",
          "AP Chemistry",
          "Computer Science Principles",
          "English Literature",
        ],
      },
      blockchain: {
        network: "polygon",
        transactionHash: "0xghi345...jkl678",
        blockNumber: 45679012,
        contractAddress: "0x742d...0bEb",
        timestamp: new Date(Date.now() - 10368000000),
        gasUsed: 0.0028,
      },
      ipfs: {
        hash: "QmTrans789...cript012",
        url: "https://ipfs.io/ipfs/QmTrans789...cript012",
        metadataHash: "QmGrade...hash345",
      },
      verification: {
        status: "verified",
        lastVerified: new Date(),
        verifiedBy: "Polygon Network",
        qrCodeUrl:
          "https://api.qrserver.com/v1/create-qr-code/?data=verify:cert-2024-128",
      },
      metadata: {
        version: "2.0",
        language: "en",
        format: "pdf",
        size: 1536000,
      },
      shareableLink: "https://certs.school.edu/verify/cert-2024-128",
      isRevoked: false,
    },
  ]);

  const [issuers] = useState<IssuerProfile[]>([
    {
      id: "ISS001",
      name: "Lincoln High School",
      type: "school",
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      publicKey: "0x04a1b2c3...",
      reputation: 98,
      certificatesIssued: 1247,
      isVerified: true,
      registeredAt: new Date(Date.now() - 63072000000),
    },
    {
      id: "ISS002",
      name: "National Science Foundation",
      type: "organization",
      walletAddress: "0x9876...5432",
      publicKey: "0x04d4e5f6...",
      reputation: 99,
      certificatesIssued: 5234,
      isVerified: true,
      registeredAt: new Date(Date.now() - 31536000000),
    },
  ]);

  const typeColors: Record<CertificateType, string> = {
    diploma: "bg-indigo-100 text-indigo-700",
    transcript: "bg-blue-100 text-blue-700",
    achievement: "bg-amber-100 text-amber-700",
    participation: "bg-green-100 text-green-700",
    completion: "bg-purple-100 text-purple-700",
    honor: "bg-pink-100 text-pink-700",
    competency: "bg-teal-100 text-teal-700",
  };

  const networkColors: Record<BlockchainNetwork, string> = {
    ethereum: "bg-blue-500",
    polygon: "bg-purple-500",
    solana: "bg-green-500",
    hyperledger: "bg-slate-500",
  };

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.certificateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || cert.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleVerify = async () => {
    if (!verificationInput.trim()) return;

    setIsVerifying(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResult = {
      isValid: true,
      certificateId: verificationInput,
      blockchainConfirmed: true,
      issuerValid: true,
      notRevoked: true,
      timestamp: new Date(),
      network: "polygon",
      blockNumber: 45678901,
      gasUsed: 0.0025,
    };

    setVerificationResult(mockResult);
    setIsVerifying(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <Shield className="h-8 w-8 text-indigo-600" />
            Blockchain Certificates
          </h2>
          <p className="mt-1 text-slate-600">
            Secure, verifiable digital credentials on blockchain
          </p>
        </div>
        {userRole === "admin" && (
          <button
            onClick={() => setShowIssueModal(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <Award className="h-5 w-5" />
            Issue Certificate
          </button>
        )}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[
          {
            label: "My Certificates",
            value: certificates.length,
            color: "bg-indigo-500",
            icon: Award,
          },
          {
            label: "Verified",
            value: certificates.filter(
              (c) => c.verification.status === "verified",
            ).length,
            color: "bg-green-500",
            icon: Verified,
          },
          {
            label: "Issuers",
            value: issuers.length,
            color: "bg-amber-500",
            icon: User,
          },
          {
            label: "Blockchain TXs",
            value: certificates.reduce((sum) => sum + 1, 0),
            color: "bg-purple-500",
            icon: Lock,
          },
          {
            label: "Network",
            value: "Polygon",
            color: "bg-blue-500",
            icon: Globe,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center gap-2">
              <stat.icon
                className={`h-4 w-4 ${stat.color.replace("bg-", "text-")}`}
              />
              <span className="text-slate-600 text-sm">{stat.label}</span>
            </div>
            <p className="font-bold text-2xl text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-slate-200 border-b">
        {[
          { id: "my-certificates", label: "My Certificates", icon: Award },
          { id: "verify", label: "Verify Certificate", icon: Verified },
          ...(userRole === "admin"
            ? [{ id: "issue", label: "Issue New", icon: Shield }]
            : []),
          { id: "analytics", label: "Analytics", icon: Lock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-indigo-600 border-b-2 text-indigo-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "my-certificates" && (
        <>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-slate-400" />
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterType(e.target.value as any)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              {Object.keys(typeColors).map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredCertificates.map((cert) => (
                <motion.div
                  key={cert.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onClick={() => setSelectedCertificate(cert)}
                  className="cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${typeColors[cert.type]}`}
                          >
                            {cert.type.toUpperCase()}
                          </span>
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              cert.verification.status === "verified"
                                ? "bg-green-100 text-green-700"
                                : cert.verification.status === "pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {cert.verification.status.toUpperCase()}
                          </span>
                          <span
                            className={`h-2 w-2 rounded-full ${networkColors[cert.blockchain.network]}`}
                          />
                        </div>
                        <h3 className="mb-1 font-bold text-slate-900 text-xl">
                          {cert.title}
                        </h3>
                        <p className="text-slate-600 text-sm">
                          {cert.certificateId}
                        </p>
                        <p className="text-slate-600">
                          Issued by {cert.issuer.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-500 text-sm">
                          {cert.issueDate.toLocaleDateString()}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-green-600">
                          <Lock className="h-4 w-4" />
                          <span className="text-sm">Blockchain Verified</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {cert.credentials.honors?.map((honor) => (
                        <span
                          key={honor}
                          className="rounded-full bg-amber-100 px-2 py-1 text-amber-700 text-xs"
                        >
                          {honor}
                        </span>
                      ))}
                      {cert.credentials.achievements?.map((achievement) => (
                        <span
                          key={achievement}
                          className="rounded-full bg-indigo-100 px-2 py-1 text-indigo-700 text-xs"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-slate-500 text-sm">
                      <span className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {cert.blockchain.network.toUpperCase()}
                      </span>
                      <span>
                        Block: {cert.blockchain.blockNumber.toLocaleString()}
                      </span>
                      <span className="max-w-xs truncate">
                        TX: {cert.blockchain.transactionHash.slice(0, 20)}...
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-slate-200 border-t bg-slate-50 px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 text-sm transition-colors hover:bg-slate-50">
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                      <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 text-sm transition-colors hover:bg-slate-50">
                        <ExternalLink className="h-4 w-4" />
                        Share
                      </button>
                    </div>
                    <button className="p-2 text-slate-400 transition-colors hover:text-slate-600">
                      <QrCode className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {activeTab === "verify" && (
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                <Shield className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="mb-2 font-bold text-2xl text-slate-900">
                Verify Certificate
              </h3>
              <p className="text-slate-600">
                Enter certificate ID or scan QR code to verify authenticity
              </p>
            </div>

            <div className="mb-6 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={verificationInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setVerificationInput(e.target.value)
                  }
                  placeholder="Enter certificate ID (e.g., CERT-2025-001)"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={handleVerify}
                disabled={!verificationInput.trim() || isVerifying}
                className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Verifying on Blockchain...
                  </span>
                ) : (
                  "Verify Certificate"
                )}
              </button>
            </div>

            {verificationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-6 ${
                  verificationResult.isValid
                    ? "border border-green-200 bg-green-50"
                    : "border border-red-200 bg-red-50"
                }`}
              >
                <div className="mb-4 flex items-center gap-3">
                  {verificationResult.isValid ? (
                    <>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-bold text-green-900 text-lg">
                          Certificate Verified
                        </h4>
                        <p className="text-green-700">
                          This certificate is authentic and valid
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <X className="h-8 w-8 text-red-600" />
                      <div>
                        <h4 className="font-bold text-lg text-red-900">
                          Verification Failed
                        </h4>
                        <p className="text-red-700">
                          This certificate could not be verified
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {verificationResult.isValid && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-white p-3">
                        <p className="text-slate-500 text-sm">
                          Blockchain Network
                        </p>
                        <p className="font-semibold text-slate-900 capitalize">
                          {verificationResult.network}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white p-3">
                        <p className="text-slate-500 text-sm">Block Number</p>
                        <p className="font-semibold text-slate-900">
                          {verificationResult.blockNumber.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800">
                        Transaction confirmed on blockchain
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800">
                        Issuer identity verified
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800">
                        Certificate not revoked
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      )}

      {selectedCertificate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedCertificate(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="relative h-32 bg-gradient-to-br from-indigo-600 to-purple-700">
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="h-16 w-16 text-white/30" />
              </div>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="-mt-8 p-6">
              <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${typeColors[selectedCertificate.type]}`}
                    >
                      {selectedCertificate.type.toUpperCase()}
                    </span>
                    <h3 className="mt-2 font-bold text-2xl text-slate-900">
                      {selectedCertificate.title}
                    </h3>
                    <p className="text-slate-600">
                      {selectedCertificate.certificateId}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-lg bg-slate-100">
                      <QrCode className="h-12 w-12 text-slate-400" />
                    </div>
                    <span className="text-slate-500 text-xs">
                      Scan to verify
                    </span>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="mb-1 text-slate-500 text-sm">Recipient</p>
                    <p className="font-semibold text-slate-900">
                      {selectedCertificate.recipient.name}
                    </p>
                    <p className="text-slate-600 text-sm">
                      {selectedCertificate.recipient.email}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="mb-1 text-slate-500 text-sm">Issuer</p>
                    <p className="font-semibold text-slate-900">
                      {selectedCertificate.issuer.name}
                    </p>
                    <p className="truncate font-mono text-slate-600 text-sm">
                      {selectedCertificate.issuer.address}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="mb-2 font-semibold text-slate-900">
                    Credentials
                  </h4>
                  {selectedCertificate.credentials.gpa && (
                    <p className="mb-2 text-slate-700">
                      GPA: {selectedCertificate.credentials.gpa}
                    </p>
                  )}
                  {selectedCertificate.credentials.honors &&
                    selectedCertificate.credentials.honors.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {selectedCertificate.credentials.honors.map((honor) => (
                          <span
                            key={honor}
                            className="rounded-full bg-amber-100 px-3 py-1 text-amber-700 text-sm"
                          >
                            {honor}
                          </span>
                        ))}
                      </div>
                    )}
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">
                      Blockchain Verification
                    </h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Network</span>
                      <span className="font-medium text-green-900 uppercase">
                        {selectedCertificate.blockchain.network}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Transaction Hash</span>
                      <span className="font-medium font-mono text-green-900 text-xs">
                        {selectedCertificate.blockchain.transactionHash.slice(
                          0,
                          20,
                        )}
                        ...
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Block Number</span>
                      <span className="font-medium text-green-900">
                        {selectedCertificate.blockchain.blockNumber.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Timestamp</span>
                      <span className="font-medium text-green-900">
                        {selectedCertificate.blockchain.timestamp.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white transition-colors hover:bg-indigo-700">
                  <Download className="h-5 w-5" />
                  Download PDF
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50">
                  <ExternalLink className="h-5 w-5" />
                  Share
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
