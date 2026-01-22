export { useApi, useMutation, api } from "./api.service";
export { useNotifications, notificationService } from "./notification.service";
export type { NotificationType, Notification } from "./notification.service";
export {
  useWidgetConfig,
  WidgetContainer,
  availableWidgets,
} from "./widget.service";
export type { WidgetConfig, WidgetType } from "./widget.service";
export { useTheme, themes } from "./theme.service";
export { useCalendar, getMonthData } from "./calendar.service";
export type { CalendarEvent, EventType } from "./calendar.service";
export {
  useMessaging,
  ChatInterface,
  messagingService,
} from "./messaging.service";
export { useLanguage, languages } from "./i18n.service";
export type { Language, LanguageInfo } from "./i18n.service";
export { usePayment, paymentService } from "./payment.service";
export type {
  PaymentGateway,
  PaymentResponse,
  PaymentMethod,
  FeePayment,
} from "./payment.service";
export {
  useDocuments,
  documentService,
  formatFileSize,
} from "./document.service";
export type { DocumentCategory, Document } from "./document.service";
export { useExams, examService } from "./exam.service";
export type { ExamType, QuestionType, Exam, Assignment } from "./exam.service";
export { useTransport, transportService } from "./transport.service";
export type {
  Bus,
  Route,
  StudentTransportInfo,
  GeoLocation,
} from "./transport.service";
export {
  useGamification,
  gamificationService,
  BADGES,
  LEVELS,
} from "./gamification.service";
export { useAnalytics, analyticsService } from "./analytics.service";
export type { AnalyticsData, DashboardMetrics } from "./analytics.service";
