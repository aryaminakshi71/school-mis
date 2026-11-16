import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  Bus,
  Calendar,
  ChevronRight,
  DollarSign,
  FileText,
  GraduationCap,
  Loader2,
  Search,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchResult {
  id: string;
  type:
    | "student"
    | "teacher"
    | "class"
    | "exam"
    | "fee"
    | "transport"
    | "attendance"
    | "notice";
  title: string;
  subtitle: string;
  link: string;
  icon: React.ReactNode;
  color: string;
}

const searchCategories = [
  { type: "student", label: "Students", icon: User, color: "bg-blue-500" },
  {
    type: "teacher",
    label: "Teachers",
    icon: GraduationCap,
    color: "bg-purple-500",
  },
  { type: "class", label: "Classes", icon: BookOpen, color: "bg-green-500" },
  { type: "exam", label: "Exams", icon: FileText, color: "bg-orange-500" },
  { type: "fee", label: "Fees", icon: DollarSign, color: "bg-emerald-500" },
  { type: "transport", label: "Transport", icon: Bus, color: "bg-cyan-500" },
  {
    type: "attendance",
    label: "Attendance",
    icon: Calendar,
    color: "bg-pink-500",
  },
  { type: "notice", label: "Notices", icon: Bell, color: "bg-yellow-500" },
];

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    type: "student",
    title: "Rahul Sharma",
    subtitle: "Grade 10-A | Roll: 15",
    link: "/app/students/1",
    icon: <User className="h-4 w-4" />,
    color: "bg-blue-500",
  },
  {
    id: "2",
    type: "student",
    title: "Priya Patel",
    subtitle: "Grade 9-B | Roll: 23",
    link: "/app/students/2",
    icon: <User className="h-4 w-4" />,
    color: "bg-blue-500",
  },
  {
    id: "3",
    type: "teacher",
    title: "Mr. Rajesh Kumar",
    subtitle: "Mathematics | Experience: 8 years",
    link: "/app/teachers/1",
    icon: <GraduationCap className="h-4 w-4" />,
    color: "bg-purple-500",
  },
  {
    id: "4",
    type: "class",
    title: "Class 10-A",
    subtitle: "45 Students | Class Teacher: Mrs. Gupta",
    link: "/app/classes/10a",
    icon: <BookOpen className="h-4 w-4" />,
    color: "bg-green-500",
  },
  {
    id: "5",
    type: "exam",
    title: "Mathematics Mid-Term",
    subtitle: "Oct 15, 2025 | Class 10",
    link: "/app/exams/1",
    icon: <FileText className="h-4 w-4" />,
    color: "bg-orange-500",
  },
  {
    id: "6",
    type: "fee",
    title: "Quarterly Fee - Rahul Sharma",
    subtitle: "₹12,500 | Due: Oct 30, 2025",
    link: "/app/fees/1",
    icon: <DollarSign className="h-4 w-4" />,
    color: "bg-emerald-500",
  },
  {
    id: "7",
    type: "transport",
    title: "Bus Route 5",
    subtitle: "Driver: Mr. Singh | 32 Students",
    link: "/app/transport/5",
    icon: <Bus className="h-4 w-4" />,
    color: "bg-cyan-500",
  },
  {
    id: "8",
    type: "attendance",
    title: "Attendance Report - Oct 2025",
    subtitle: "Overall: 92% | Class 10-A",
    link: "/app/attendance/reports",
    icon: <Calendar className="h-4 w-4" />,
    color: "bg-pink-500",
  },
  {
    id: "9",
    type: "notice",
    title: "Parent-Teacher Meeting",
    subtitle: "Scheduled: Nov 5, 2025 | All Classes",
    link: "/app/notices/1",
    icon: <Bell className="h-4 w-4" />,
    color: "bg-yellow-500",
  },
];

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Keyboard shortcut to open search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const filtered = mockSearchResults.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()),
      );
      setResults(filtered);
      setIsLoading(false);
      setSelectedIndex(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      navigate({ to: results[selectedIndex].link });
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate({ to: result.link });
    setIsOpen(false);
    setQuery("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-600 text-sm transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden items-center gap-1 rounded bg-gray-200 px-1.5 py-0.5 text-xs sm:inline-flex dark:bg-gray-700">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[20vh] backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          className="mx-4 w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-gray-200 border-b px-4 py-3 dark:border-gray-800">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Search students, teachers, classes, exams..."
              className="flex-1 border-none bg-transparent text-gray-900 text-lg placeholder-gray-400 outline-none dark:text-gray-100"
            />
            {isLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto">
            {query.length < 2 ? (
              <div className="p-6">
                <p className="mb-4 text-gray-500 text-sm dark:text-gray-400">
                  Search by category:
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {searchCategories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.type}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 text-sm transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <div
                          className={`h-8 w-8 ${cat.color} flex items-center justify-center rounded-lg text-white`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                      index === selectedIndex
                        ? "bg-primary/10 dark:bg-primary/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 ${result.color} flex shrink-0 items-center justify-center rounded-lg text-white`}
                    >
                      {result.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900 dark:text-gray-100">
                        {result.title}
                      </p>
                      <p className="truncate text-gray-500 text-sm dark:text-gray-400">
                        {result.subtitle}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400">
                  No results found for &quot;{query}&quot;
                </p>
                <p className="mt-1 text-gray-400 text-sm dark:text-gray-500">
                  Try searching for students, teachers, or classes
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-gray-200 border-t bg-gray-50 px-4 py-2 text-gray-500 text-xs dark:border-gray-800 dark:bg-gray-800/50">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-700">
                  ↑↓
                </kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-700">
                  ↵
                </kbd>
                to select
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-700">
                esc
              </kbd>
              to close
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default GlobalSearch;
