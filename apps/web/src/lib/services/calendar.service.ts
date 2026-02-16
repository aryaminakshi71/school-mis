import { useCallback, useEffect, useState } from "react";

export type EventType =
  | "exam"
  | "homework"
  | "holiday"
  | "meeting"
  | "activity"
  | "leave";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  color: string;
  location?: string;
  reminder?: boolean;
  reminderMinutes?: number;
  relatedId?: string;
  relatedType?: "student" | "class" | "subject";
}

export interface CalendarFilter {
  types: EventType[];
  dateRange: { start: Date; end: Date };
  search?: string;
}

const eventColors: Record<EventType, string> = {
  exam: "#ef4444",
  homework: "#f97316",
  holiday: "#22c55e",
  meeting: "#3b82f6",
  activity: "#8b5cf6",
  leave: "#ec4899",
};

function loadEvents(userId: string): CalendarEvent[] {
  const saved = localStorage.getItem(`calendar_events_${userId}`);
  if (saved) {
    try {
      return JSON.parse(saved).map((e: any) => ({
        ...e,
        startDate: new Date(e.startDate),
        endDate: new Date(e.endDate),
      }));
    } catch {
      return [];
    }
  }
  return [];
}

function saveEvents(userId: string, events: CalendarEvent[]) {
  localStorage.setItem(`calendar_events_${userId}`, JSON.stringify(events));
}

export function useCalendar(userId: string = "current_user") {
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    loadEvents(userId),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">(
    "month",
  );
  const [filter, setFilter] = useState<CalendarFilter>({
    types: ["exam", "homework", "holiday", "meeting", "activity", "leave"],
    dateRange: {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    },
  });

  useEffect(() => {
    saveEvents(userId, events);
  }, [events, userId]);

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setEvents((prev) => [...prev, newEvent]);
    return newEvent;
  }, []);

  const updateEvent = useCallback(
    (id: string, updates: Partial<CalendarEvent>) => {
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      );
    },
    [],
  );

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const getEventsForDate = useCallback(
    (date: Date): CalendarEvent[] => {
      return events.filter(
        (e) =>
          e.startDate.toDateString() === date.toDateString() ||
          (e.startDate <= date && e.endDate >= date),
      );
    },
    [events],
  );

  const getEventsForMonth = useCallback(
    (year: number, month: number): CalendarEvent[] => {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0);
      return events.filter(
        (e) =>
          (e.startDate >= start && e.startDate <= end) ||
          (e.endDate >= start && e.endDate <= end) ||
          (e.startDate <= start && e.endDate >= end),
      );
    },
    [events],
  );

  const getUpcomingEvents = useCallback(
    (limit: number = 5): CalendarEvent[] => {
      const now = new Date();
      return events
        .filter((e) => e.startDate >= now)
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
        .slice(0, limit);
    },
    [events],
  );

  const toggleTypeFilter = useCallback((type: EventType) => {
    setFilter((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  }, []);

  const filteredEvents = events.filter(
    (e) =>
      filter.types.includes(e.type) &&
      e.startDate >= filter.dateRange.start &&
      e.startDate <= filter.dateRange.end &&
      (!filter.search ||
        e.title.toLowerCase().includes(filter.search.toLowerCase())),
  );

  const addExam = useCallback(
    (title: string, date: Date, description?: string) => {
      return addEvent({
        title,
        description,
        type: "exam",
        startDate: date,
        endDate: date,
        allDay: true,
        color: eventColors.exam,
      });
    },
    [addEvent],
  );

  const addHomework = useCallback(
    (title: string, dueDate: Date, subject: string) => {
      return addEvent({
        title: `${title} - ${subject}`,
        type: "homework",
        startDate: dueDate,
        endDate: dueDate,
        allDay: false,
        color: eventColors.homework,
        reminder: true,
        reminderMinutes: 60,
      });
    },
    [addEvent],
  );

  const addHoliday = useCallback(
    (title: string, startDate: Date, endDate: Date) => {
      return addEvent({
        title,
        type: "holiday",
        startDate,
        endDate,
        allDay: true,
        color: eventColors.holiday,
      });
    },
    [addEvent],
  );

  return {
    events: filteredEvents,
    allEvents: events,
    selectedDate,
    setSelectedDate,
    view,
    setView,
    filter,
    setFilter,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    getEventsForMonth,
    getUpcomingEvents,
    toggleTypeFilter,
    addExam,
    addHomework,
    addHoliday,
    eventColors,
  };
}

export function getMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days: (Date | null)[] = [];

  for (let i = 0; i < startPadding; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  return {
    days,
    startPadding,
    daysInMonth,
    monthName: firstDay.toLocaleString("default", { month: "long" }),
    year,
    month,
  };
}

export default useCalendar;
