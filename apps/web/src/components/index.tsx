"use client";

/**
 * Component Lazy Loading Index
 *
 * Use these lazy-loaded components instead of direct imports
 * to reduce initial bundle size and improve performance
 */

import { Loader2 } from "lucide-react";
import { Suspense, lazy } from "react";

// Loading fallback component
export function ComponentLoader() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

// ============================================================================
// CORE COMPONENTS (Always loaded - keep these direct imports)
// ============================================================================

export { DashboardLayout } from "./dashboard-layout";
export { ErrorBoundary } from "./error-boundary";
export {
  GlobalLoadingIndicator,
  LoadingOverlay,
  PageLoader,
  SkeletonCard,
  SkeletonTable,
} from "./loading-states";
export { ThemeProvider } from "./theme-provider";

// ============================================================================
// LAZY LOADED COMPONENTS (Load on demand)
// ============================================================================

// Academic Management
export const AdmissionManagement = lazy(() =>
  import("./admission-management").then((m) => ({
    default: m.AdmissionManagement,
  })),
);
export const AssignmentManager = lazy(() =>
  import("./assignment-manager").then((m) => ({
    default: m.AssignmentManager,
  })),
);
export const AutoGradingSystem = lazy(() =>
  import("./auto-grading-system").then((m) => ({
    default: m.AutoGradingSystem,
  })),
);
export const SmartTimetable = lazy(() =>
  import("./smart-timetable").then((m) => ({ default: m.SmartTimetable })),
);
export const PredictiveAnalytics = lazy(() =>
  import("./predictive-analytics").then((m) => ({
    default: m.PredictiveAnalytics,
  })),
);

// AI & Machine Learning
export const AIChatbot = lazy(() =>
  import("./ai-chatbot").then((m) => ({ default: m.AIChatbot })),
);
export const AIAssistant = lazy(() =>
  import("./ai-assistant").then((m) => ({ default: m.AIAssistant })),
);
export const AIAntiCheating = lazy(() =>
  import("./ai-anti-cheating").then((m) => ({ default: m.AIAntiCheating })),
);
export const AIContentGenerator = lazy(() =>
  import("./ai-content-generator").then((m) => ({
    default: m.AIContentGenerator,
  })),
);
// AIExamProctoring component file does not exist
// export const AIExamProctoring = lazy(() =>
//   import("./ai-exam-proctoring").then((m) => ({ default: m.AIExamProctoring })),
// );
export const AIEssayGrader = lazy(() =>
  import("./ai-essay-grader").then((m) => ({ default: m.AIEssayGrader })),
);
export const AIMeetingSummarizer = lazy(() =>
  import("./ai-meeting-summarizer").then((m) => ({
    default: m.AIMeetingSummarizer,
  })),
);
export const AIPeerReview = lazy(() =>
  import("./ai-peer-review").then((m) => ({ default: m.AIPeerReview })),
);
export const AITeachingAssistant = lazy(() =>
  import("./ai-teaching-assistant").then((m) => ({
    default: m.AITeachingAssistant,
  })),
);
export const CareerGuidance = lazy(() =>
  import("./career-guidance").then((m) => ({ default: m.CareerGuidance })),
);
export const PersonalizedLearning = lazy(() =>
  import("./personalized-learning").then((m) => ({
    default: m.PersonalizedLearning,
  })),
);

// AI & Future Tech (Heavy components - definitely lazy load)
export const NeuroAdaptiveLearning = lazy(() =>
  import("./neuro-adaptive-learning").then((m) => ({
    default: m.NeuroAdaptiveLearning,
  })),
);
export const PredictiveMentalHealth = lazy(() =>
  import("./predictive-mental-health").then((m) => ({
    default: m.PredictiveMentalHealthMonitoring,
  })),
);
export const CognitiveLoadMonitor = lazy(() =>
  import("./cognitive-load-monitor").then((m) => ({
    default: m.CognitiveLoadMonitor,
  })),
);
export const PredictiveDropoutPrevention = lazy(() =>
  import("./predictive-dropout-prevention").then((m) => ({
    default: m.PredictiveDropoutPrevention,
  })),
);
export const SmartMicrolearning = lazy(() =>
  import("./smart-microlearning").then((m) => ({
    default: m.SmartMicrolearning,
  })),
);
export const EmotionalAIChatbot = lazy(() =>
  import("./emotional-ai-chatbot").then((m) => ({
    default: m.EmotionalAIChatbot,
  })),
);

// VR/AR & Futuristic
export const VRLearningModules = lazy(() =>
  import("./vr-learning-modules").then((m) => ({
    default: m.VRLearningModules,
  })),
);
export const DigitalTwinCampus = lazy(() => import("./digital-twin-campus"));
export const HolographicRemoteTeaching = lazy(() =>
  import("./holographic-remote-teaching").then((m) => ({
    default: m.HolographicRemoteTeaching,
  })),
);
export const BrainComputerInterface = lazy(
  () => import("./brain-computer-interface"),
);
export const SpatialAudioClassrooms = lazy(
  () => import("./spatial-audio-classrooms"),
);
export const QuantumSecureCommunications = lazy(() =>
  import("./quantum-secure-communications").then((m) => ({
    default: m.QuantumSecureCommunications,
  })),
);
export const VoiceBiometricAuth = lazy(() =>
  import("./voice-biometric-auth").then((m) => ({
    default: m.VoiceBiometricAuth,
  })),
);

// Web3 & Blockchain
export const BlockchainCertificates = lazy(() =>
  import("./blockchain-certificates").then((m) => ({
    default: m.BlockchainCertificates,
  })),
);
export const MetaverseCampus = lazy(() =>
  import("./metaverse-campus").then((m) => ({
    default: m.MetaverseCampus,
  })),
);
export const DecentralizedIdentity = lazy(
  () => import("./decentralized-identity"),
);
export const FederatedLearning = lazy(() =>
  import("./federated-learning").then((m) => ({
    default: m.FederatedLearning,
  })),
);

// Analytics & Dashboards
export const BIDashboard = lazy(() =>
  import("./bi-dashboard").then((m) => ({ default: m.BIDashboard })),
);
export const AnalyticsDashboard = lazy(() =>
  import("./analytics-dashboard").then((m) => ({
    default: m.AnalyticsDashboard,
  })),
);
export const RealTimeDashboard = lazy(() =>
  import("./real-time-dashboard").then((m) => ({
    default: m.RealTimeDashboard,
  })),
);
export const BehavioralAnalyticsDashboard = lazy(() =>
  import("./behavioral-analytics-dashboard").then((m) => ({
    default: m.BehavioralAnalyticsDashboard,
  })),
);
export const SocialLearningGraph = lazy(() =>
  import("./social-learning-graph").then((m) => ({
    default: m.SocialLearningGraph,
  })),
);
export const LearningDNAProfiles = lazy(() =>
  import("./learning-dna-profiles").then((m) => ({
    default: m.LearningDNAProfiles,
  })),
);
export const CompetencyBasedProgression = lazy(() =>
  import("./competency-based-progression").then((m) => ({
    default: m.CompetencyBasedProgression,
  })),
);
export const CrossDisciplinaryProjects = lazy(
  () => import("./cross-disciplinary-projects"),
);

// Communication
export const CommunicationHub = lazy(() =>
  import("./communication-hub").then((m) => ({
    default: m.CommunicationHub,
  })),
);
export const RealTimeChat = lazy(() =>
  import("./real-time-chat").then((m) => ({ default: m.RealTimeChat })),
);
export const VideoConference = lazy(() =>
  import("./video-conference").then((m) => ({ default: m.VideoConference })),
);
export const AdvancedVideoConferencing = lazy(() =>
  import("./advanced-video-conferencing").then((m) => ({
    default: m.AdvancedVideoConferencing,
  })),
);
export const BroadcastMessaging = lazy(() =>
  import("./broadcast-messaging").then((m) => ({
    default: m.BroadcastMessaging,
  })),
);
export const WhatsAppIntegration = lazy(() =>
  import("./whatsapp-integration").then((m) => ({
    default: m.WhatsAppIntegration,
  })),
);
export const VoiceNotes = lazy(() =>
  import("./voice-notes").then((m) => ({ default: m.VoiceNotes })),
);
export const RealTimeTranslation = lazy(() =>
  import("./real-time-translation").then((m) => ({
    default: m.RealTimeTranslation,
  })),
);

// Management Systems
export const TransportManagement = lazy(() =>
  import("./transport-management").then((m) => ({
    default: m.TransportManagement,
  })),
);
export const LibraryManagement = lazy(() =>
  import("./library-management").then((m) => ({
    default: m.LibraryManagement,
  })),
);
export const VisitorManagement = lazy(() =>
  import("./visitor-management").then((m) => ({
    default: m.VisitorManagement,
  })),
);
export const InventoryManagement = lazy(() =>
  import("./inventory-management").then((m) => ({
    default: m.InventoryManagement,
  })),
);
export const EventManagement = lazy(() =>
  import("./event-management").then((m) => ({ default: m.EventManagement })),
);
export const HostelManagement = lazy(() =>
  import("./hostel-management").then((m) => ({
    default: m.HostelManagement,
  })),
);
export const CanteenManagement = lazy(() =>
  import("./canteen-management").then((m) => ({
    default: m.CanteenManagement,
  })),
);
export const MedicalRecords = lazy(() =>
  import("./medical-records").then((m) => ({ default: m.MedicalRecords })),
);
export const SportsManagement = lazy(() =>
  import("./sports-management").then((m) => ({
    default: m.SportsManagement,
  })),
);
export const AlumniNetwork = lazy(() =>
  import("./alumni-network").then((m) => ({ default: m.AlumniNetwork })),
);
export const MentalHealthCounseling = lazy(() =>
  import("./mental-health-counseling").then((m) => ({
    default: m.MentalHealthCounseling,
  })),
);
export const IncidentReporting = lazy(() =>
  import("./incident-reporting").then((m) => ({
    default: m.IncidentReportingSystem,
  })),
);
export const EmergencyManagement = lazy(() =>
  import("./emergency-management").then((m) => ({
    default: m.EmergencyManagement,
  })),
);

// Financial & HR
export const PayrollManagement = lazy(() =>
  import("./payroll-management").then((m) => ({
    default: m.PayrollManagement,
  })),
);
export const ScholarshipManagement = lazy(() =>
  import("./scholarship-management").then((m) => ({
    default: m.ScholarshipManagement,
  })),
);
export const MobilePaymentGateway = lazy(() =>
  import("./mobile-payment-gateway").then((m) => ({
    default: m.MobilePaymentGateway,
  })),
);
export const RealTimeFees = lazy(() =>
  import("./real-time-fees").then((m) => ({ default: m.RealTimeFees })),
);

// Student & Parent Features
export const ParentTeacherScheduling = lazy(() =>
  import("./parent-teacher-scheduling").then((m) => ({
    default: m.ParentTeacherScheduling,
  })),
);
export const FacilityBooking = lazy(() =>
  import("./facility-booking").then((m) => ({
    default: m.FacilityBookingSystem,
  })),
);
export const LostAndFound = lazy(() =>
  import("./lost-and-found").then((m) => ({ default: m.LostAndFound })),
);
export const DigitalPortfolio = lazy(() =>
  import("./digital-portfolio").then((m) => ({
    default: m.DigitalPortfolioComponent,
  })),
);
export const PeerLearningMarketplace = lazy(() =>
  import("./peer-learning-marketplace").then((m) => ({
    default: m.PeerLearningMarketplace,
  })),
);
export const GamificationSystem = lazy(() =>
  import("./gamification-system").then((m) => ({
    default: m.GamificationSystem,
  })),
);

// Security & Auth
export const RoleBasedAccess = lazy(() =>
  import("./role-based-access").then((m) => ({
    default: m.RoleBasedAccessControl,
  })),
);
export const TwoFactorAuth = lazy(() =>
  import("./two-factor-auth").then((m) => ({
    default: m.TwoFactorAuth,
  })),
);
export const BiometricAttendance = lazy(() =>
  import("./biometric-attendance").then((m) => ({
    default: m.BiometricAttendance,
  })),
);

// Utilities
export const GlobalSearch = lazy(() =>
  import("./global-search").then((m) => ({ default: m.GlobalSearch })),
);
export const CommandPalette = lazy(() =>
  import("./command-palette").then((m) => ({
    default: m.CommandPalette,
  })),
);
export const NotificationCenter = lazy(() =>
  import("./notification-center").then((m) => ({
    default: m.NotificationCenter,
  })),
);
export const DocumentManager = lazy(() =>
  import("./document-manager").then((m) => ({
    default: m.DocumentManager,
  })),
);
export const IntegrationManager = lazy(() =>
  import("./integration-manager").then((m) => ({
    default: m.IntegrationManager,
  })),
);
export const SubstituteTeacherSystem = lazy(() =>
  import("./substitute-teacher-system").then((m) => ({
    default: m.SubstituteTeacherSystem,
  })),
);

// Smart Campus & IoT
export const IoTSmartCampus = lazy(() =>
  import("./iot-smart-campus").then((m) => ({ default: m.IoTSmartCampus })),
);
export const CafeteriaPreordering = lazy(() =>
  import("./cafeteria-preordering").then((m) => ({
    default: m.CafeteriaPreOrdering,
  })),
);
export const ParkingManagement = lazy(() =>
  import("./parking-management").then((m) => ({
    default: m.ParkingManagement,
  })),
);
export const KeyLockerManagement = lazy(() =>
  import("./key-locker-management").then((m) => ({
    default: m.KeyLockerManagement,
  })),
);

// Real-time Features
export const RealTimeAttendance = lazy(() =>
  import("./real-time-attendance").then((m) => ({
    default: m.RealTimeAttendance,
  })),
);
export const RealTimeGrades = lazy(() =>
  import("./real-time-grades").then((m) => ({ default: m.RealTimeGrades })),
);

// Widgets & UI Components
export const DashboardWidgetManager = lazy(() =>
  import("./dashboard-widget-manager").then((m) => ({
    default: m.DashboardWidgetManager,
  })),
);
export const QuickActionsWidget = lazy(() =>
  import("./quick-actions-widget").then((m) => ({
    default: m.QuickActionsWidget,
  })),
);
export const NotificationQuickActions = lazy(() =>
  import("./notification-quick-actions").then((m) => ({
    default: m.NotificationQuickActions,
  })),
);
export const PhotoUpload = lazy(() =>
  import("./photo-upload").then((m) => ({ default: m.PhotoUpload })),
);
export const LanguageSelector = lazy(() =>
  import("./language-selector").then((m) => ({
    default: m.LanguageSelector,
  })),
);
export const OnboardingTour = lazy(() =>
  import("./onboarding-tour").then((m) => ({
    default: m.OnboardingTour,
  })),
);

// ============================================================================
// WRAPPER COMPONENT FOR LAZY LOADING
// ============================================================================

interface LazyComponentProps {
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  props?: Record<string, any>;
}

export function LazyComponent({
  component: Component,
  props = {},
}: LazyComponentProps) {
  return (
    <Suspense fallback={<ComponentLoader />}>
      <Component {...props} />
    </Suspense>
  );
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/*
BEFORE (slow initial load):
import { AIChatbot } from "./components";

function App() {
  return <AIChatbot />;
}

AFTER (fast initial load):
import { AIChatbot, LazyComponent } from "./components";

function App() {
  return <LazyComponent component={AIChatbot} />;
}

OR use directly with Suspense:
import { AIChatbot, ComponentLoader } from "./components";

function App() {
  return (
    <Suspense fallback={<ComponentLoader />}>
      <AIChatbot />
    </Suspense>
  );
}
*/

// ============================================================================
// BUNDLE SIZE OPTIMIZATION NOTES
// ============================================================================

export const optimizationNotes = {
  // Components that should ALWAYS be lazy loaded:
  alwaysLazy: [
    "AIAntiCheating",
    "AIContentGenerator",
    "AIMeetingSummarizer",
    "AIPeerReview",
    "NeuroAdaptiveLearning",
    "PredictiveMentalHealth",
    "VRLearningModules",
    "DigitalTwinCampus",
    "MetaverseCampus",
    "BlockchainCertificates",
    "FederatedLearning",
    "BrainComputerInterface",
    "HolographicRemoteTeaching",
    "QuantumSecureCommunications",
  ],

  // Components that can be eagerly loaded (small, frequently used):
  eagerLoad: [
    "DashboardLayout",
    "ErrorBoundary",
    "LoadingStates",
    "ThemeProvider",
    "NotificationCenter",
    "CommandPalette",
  ],

  estimatedSavings: "~40-50% reduction in initial bundle size",

  implementation: "Wrap heavy components in Suspense with lazy()",
};
