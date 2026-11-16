export type { AnalyticsData, DashboardMetrics } from "./analytics.service";
export { analyticsService, useAnalytics } from "./analytics.service";
export { api, useApi, useMutation } from "./api.service";
export type { CalendarEvent, EventType } from "./calendar.service";
export { getMonthData, useCalendar } from "./calendar.service";
export type { Document, DocumentCategory } from "./document.service";
export {
  documentService,
  formatFileSize,
  useDocuments,
} from "./document.service";
export type { Assignment, Exam, ExamType, QuestionType } from "./exam.service";
export { examService, useExams } from "./exam.service";
export {
  BADGES,
  gamificationService,
  LEVELS,
  useGamification,
} from "./gamification.service";
export type { Language, LanguageInfo } from "./i18n.service";
export { languages, useLanguage } from "./i18n.service";
export {
  ChatInterface,
  messagingService,
  useMessaging,
} from "./messaging.service";
export type { Notification, NotificationType } from "./notification.service";
export { notificationService, useNotifications } from "./notification.service";
export type {
  FeePayment,
  PaymentGateway,
  PaymentMethod,
  PaymentResponse,
} from "./payment.service";
export { paymentService, usePayment } from "./payment.service";
export { themes, useTheme } from "./theme.service";
export type {
  Bus,
  GeoLocation,
  Route,
  StudentTransportInfo,
} from "./transport.service";
export { transportService, useTransport } from "./transport.service";
export type { WidgetConfig, WidgetType } from "./widget.service";
export {
  availableWidgets,
  useWidgetConfig,
  WidgetContainer,
} from "./widget.service";
