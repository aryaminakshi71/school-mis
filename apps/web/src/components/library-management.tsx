import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BarChart3,
  Book,
  BookOpen,
  Calendar,
  CheckCircle,
  Library,
  Plus,
  Search,
  Star,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
  location: string;
  cover?: string;
  description?: string;
  rating: number;
  borrowCount: number;
  addedAt: string;
}

interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  class: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  status: "borrowed" | "returned" | "overdue";
  fine?: number;
}

interface Student {
  id: string;
  name: string;
  class: string;
  rollNumber: string;
  booksBorrowed: number;
  maxBooks: number;
  fineDue: number;
}

interface Category {
  id: string;
  name: string;
  bookCount: number;
  color: string;
}

interface LibraryManagementProps {
  className?: string;
}

const defaultBooks: Book[] = [
  {
    id: "1",
    title: "NCERT Mathematics - Class 10",
    author: "NCERT",
    isbn: "978-81-7450-634-4",
    category: "Mathematics",
    publisher: "NCERT",
    publicationYear: 2023,
    totalCopies: 50,
    availableCopies: 32,
    location: "Shelf A-12",
    description: "Comprehensive mathematics textbook for Class 10 students",
    rating: 4.5,
    borrowCount: 124,
    addedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Concepts of Physics - Vol 1",
    author: "H.C. Verma",
    isbn: "978-81-7709-187-8",
    category: "Physics",
    publisher: "Bharati Bhawan",
    publicationYear: 2022,
    totalCopies: 40,
    availableCopies: 15,
    location: "Shelf B-05",
    description: "Essential physics concepts for competitive exams",
    rating: 4.8,
    borrowCount: 256,
    addedAt: "2024-02-01",
  },
  {
    id: "3",
    title: "R.D. Sharma Mathematics",
    author: "R.D. Sharma",
    isbn: "978-93-5072-182-2",
    category: "Mathematics",
    publisher: "Dhanpat Rai",
    publicationYear: 2023,
    totalCopies: 60,
    availableCopies: 28,
    location: "Shelf A-13",
    description: "Practice problems and solutions for mathematics",
    rating: 4.6,
    borrowCount: 189,
    addedAt: "2024-01-20",
  },
  {
    id: "4",
    title: "Biology - Class 12",
    author: "NCERT",
    isbn: "978-81-7450-639-9",
    category: "Biology",
    publisher: "NCERT",
    publicationYear: 2023,
    totalCopies: 45,
    availableCopies: 38,
    location: "Shelf C-08",
    description: "Complete biology textbook for Class 12",
    rating: 4.3,
    borrowCount: 98,
    addedAt: "2024-01-25",
  },
  {
    id: "5",
    title: "Great Expectations",
    author: "Charles Dickens",
    isbn: "978-0-141-43956-3",
    category: "Literature",
    publisher: "Penguin Classics",
    publicationYear: 2021,
    totalCopies: 20,
    availableCopies: 12,
    location: "Shelf D-02",
    description: "Classic English literature novel",
    rating: 4.7,
    borrowCount: 67,
    addedAt: "2024-02-10",
  },
];

const defaultBorrowRecords: BorrowRecord[] = [
  {
    id: "1",
    bookId: "2",
    bookTitle: "Concepts of Physics - Vol 1",
    studentId: "STU001",
    studentName: "Rahul Kumar",
    class: "11-A",
    borrowedAt: "2024-03-15",
    dueDate: "2024-03-29",
    status: "borrowed",
  },
  {
    id: "2",
    bookId: "1",
    bookTitle: "NCERT Mathematics - Class 10",
    studentId: "STU002",
    studentName: "Priya Sharma",
    class: "10-B",
    borrowedAt: "2024-03-20",
    dueDate: "2024-04-03",
    status: "overdue",
    fine: 15,
  },
  {
    id: "3",
    bookId: "5",
    bookTitle: "Great Expectations",
    studentId: "STU003",
    studentName: "Amit Singh",
    class: "9-A",
    borrowedAt: "2024-03-10",
    dueDate: "2024-03-24",
    returnedAt: "2024-03-23",
    status: "returned",
  },
];

const defaultCategories: Category[] = [
  { id: "1", name: "Mathematics", bookCount: 150, color: "#3b82f6" },
  { id: "2", name: "Physics", bookCount: 120, color: "#8b5cf6" },
  { id: "3", name: "Chemistry", bookCount: 110, color: "#10b981" },
  { id: "4", name: "Biology", bookCount: 95, color: "#f59e0b" },
  { id: "5", name: "Literature", bookCount: 200, color: "#ec4899" },
  { id: "6", name: "History", bookCount: 80, color: "#06b6d4" },
];

export function LibraryManagement({ className }: LibraryManagementProps) {
  const [activeTab, setActiveTab] = useState<
    "catalog" | "borrowed" | "students" | "analytics"
  >("catalog");
  const [books, setBooks] = useState<Book[]>(defaultBooks);
  const [borrowRecords, setBorrowRecords] =
    useState<BorrowRecord[]>(defaultBorrowRecords);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const totalBooks = books.reduce((acc, book) => acc + book.totalCopies, 0);
  const availableBooks = books.reduce(
    (acc, book) => acc + book.availableCopies,
    0,
  );
  const borrowedBooks = totalBooks - availableBooks;
  const overdueBooks = borrowRecords.filter(
    (r) => r.status === "overdue",
  ).length;

  const filteredBooks = books.filter(
    (book) =>
      (book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery)) &&
      (!selectedCategory || book.category === selectedCategory),
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      borrowed:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      returned:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Library className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
              Library Management
            </h2>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              {totalBooks} books • {availableBooks} available
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddBookModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Book
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Total Books
              </p>
              <p className="font-bold text-2xl text-gray-900 dark:text-white">
                {totalBooks}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Available
              </p>
              <p className="font-bold text-2xl text-gray-900 dark:text-white">
                {availableBooks}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Borrowed
              </p>
              <p className="font-bold text-2xl text-gray-900 dark:text-white">
                {borrowedBooks}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <Book className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Overdue
              </p>
              <p className="font-bold text-2xl text-red-600 dark:text-red-400">
                {overdueBooks}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {[
          { id: "catalog", label: "Book Catalog", icon: Library },
          { id: "borrowed", label: "Borrowed Books", icon: BookOpen },
          { id: "students", label: "Students", icon: Users },
          { id: "analytics", label: "Analytics", icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 font-medium text-sm transition-all ${
              activeTab === tab.id
                ? "bg-white text-primary shadow-sm dark:bg-gray-700"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "catalog" && (
          <motion.div
            key="catalog"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                  !selectedCategory
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                All Categories
              </button>
              {defaultCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                    selectedCategory === category.name
                      ? "text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                  style={
                    selectedCategory === category.name
                      ? { backgroundColor: category.color }
                      : {}
                  }
                >
                  {category.name}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs ${
                      selectedCategory === category.name
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {category.bookCount}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-10 focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            {/* Book Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book) => (
                <motion.div
                  key={book.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedBook(book)}
                  className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex gap-4">
                    {/* Book Cover Placeholder */}
                    <div className="flex h-32 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                      <BookOpen className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 font-semibold text-gray-900 text-sm dark:text-white">
                        {book.title}
                      </h3>
                      <p className="mt-1 text-gray-600 text-sm dark:text-gray-400">
                        {book.author}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className="rounded-full px-2 py-0.5 text-xs"
                          style={{
                            backgroundColor: defaultCategories.find(
                              (c) => c.name === book.category,
                            )?.color,
                            color: "white",
                          }}
                        >
                          {book.category}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {book.publicationYear}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <span className="font-medium text-sm">
                          {book.rating}
                        </span>
                        <span className="text-gray-500 text-xs">
                          ({book.borrowCount} borrows)
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className={`font-medium text-xs ${
                            book.availableCopies > 5
                              ? "text-green-600"
                              : book.availableCopies > 0
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {book.availableCopies} of {book.totalCopies} available
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "borrowed" && (
          <motion.div
            key="borrowed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="border-gray-200 border-b p-4 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search borrow records..."
                    className="w-full rounded-lg border-0 bg-gray-100 py-2 pr-4 pl-9 text-sm dark:bg-gray-700"
                  />
                </div>
                <select className="rounded-lg border-0 bg-gray-100 px-3 py-2 text-sm dark:bg-gray-700">
                  <option>All Status</option>
                  <option>Borrowed</option>
                  <option>Overdue</option>
                  <option>Returned</option>
                </select>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {borrowRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {record.bookTitle}
                        </h4>
                        <div className="mt-1 flex items-center gap-4 text-gray-600 text-sm dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {record.studentName} ({record.class})
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {new Date(record.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        {record.fine && record.fine > 0 && (
                          <p className="mt-1 text-red-600 text-sm">
                            Fine: ₹{record.fine}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 font-medium text-xs ${getStatusColor(record.status)}`}
                      >
                        {record.status.charAt(0).toUpperCase() +
                          record.status.slice(1)}
                      </span>
                      {record.status === "borrowed" && (
                        <button className="rounded-lg bg-green-100 px-3 py-1 text-green-700 text-xs hover:bg-green-200">
                          Return
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {/* Most Borrowed Books */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <TrendingUp className="h-5 w-5 text-primary" />
                Most Borrowed Books
              </h3>
              <div className="space-y-3">
                {books
                  .sort((a, b) => b.borrowCount - a.borrowCount)
                  .slice(0, 5)
                  .map((book, index) => (
                    <div key={book.id} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 font-medium text-sm dark:bg-gray-700">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-900 text-sm dark:text-white">
                          {book.title}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {book.borrowCount} borrows
                        </p>
                      </div>
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${(book.borrowCount / 300) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <BarChart3 className="h-5 w-5 text-primary" />
                Books by Category
              </h3>
              <div className="space-y-3">
                {defaultCategories.map((category) => (
                  <div key={category.id} className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 text-sm dark:text-white">
                          {category.name}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {category.bookCount}
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(category.bookCount / 200) * 100}%`,
                            backgroundColor: category.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
