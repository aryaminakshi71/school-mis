import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BookOpen,
  Plus,
  Book,
  Clock,
  AlertCircle,
  BookCheck,
  Edit,
  Send,
  Search,
  Download,
} from "lucide-react";
import { useSearch } from "@/lib/search-utils";
import { exportToCSV } from "@/lib/export-utils";
import { useListPageShortcuts } from "@/lib/keyboard-shortcuts";
import { handleError } from "@/lib/error-handler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/app/library")({
  component: LibraryPage,
});

function LibraryPage() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"books" | "issues">("books");

  // Search functionality
  const {
    searchQuery: booksSearchQuery,
    setSearchQuery: setBooksSearchQuery,
    filteredData: filteredBooks,
    hasActiveFilters: hasBooksFilters,
    clearSearch: clearBooksSearch,
  } = useSearch({
    data: mockBooks,
    searchFields: ["title", "author", "category"],
  });

  const {
    searchQuery: issuesSearchQuery,
    setSearchQuery: setIssuesSearchQuery,
    filteredData: filteredIssues,
    hasActiveFilters: hasIssuesFilters,
    clearSearch: clearIssuesSearch,
  } = useSearch({
    data: mockIssues,
    searchFields: ["book", "student", "id"],
  });

  // Export functionality
  const handleExport = () => {
    try {
      if (activeTab === "books") {
        const exportData = mockBooks.map((b) => ({
          "Title": b.title,
          "Author": b.author,
          "Category": b.category,
          "Available": b.available.toString(),
          "Total": b.total.toString(),
        }));
        exportToCSV(exportData, `library-books-export-${new Date().toISOString().split("T")[0]}`);
        toast.success("Books exported successfully");
      } else {
        const exportData = mockIssues.map((i) => ({
          "Book": i.book,
          "Student": i.student,
          "Issue Date": i.issueDate,
          "Due Date": i.dueDate,
          "Status": i.status,
        }));
        exportToCSV(exportData, `library-issues-export-${new Date().toISOString().split("T")[0]}`);
        toast.success("Book issues exported successfully");
      }
    } catch (err) {
      toast.error(handleError(err));
    }
  };

  // Keyboard shortcuts
  useListPageShortcuts(
    () => setShowModal(true),
    () => window.location.reload(),
    () => handleExport()
  );

  const mockBooks = [
    {
      id: "1",
      title: "Mathematics Class 9",
      author: "R.D. Sharma",
      category: "Textbook",
      available: 5,
      total: 10,
    },
    {
      id: "2",
      title: "Physics Class 10",
      author: "H.C. Verma",
      category: "Textbook",
      available: 3,
      total: 8,
    },
    {
      id: "3",
      title: "Chemistry Standard 11",
      author: "O.P. Tandon",
      category: "Textbook",
      available: 7,
      total: 10,
    },
    {
      id: "4",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      category: "Novel",
      available: 2,
      total: 5,
    },
    {
      id: "5",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      category: "Novel",
      available: 4,
      total: 6,
    },
  ];

  const mockIssues = [
    {
      id: "1",
      book: "Mathematics Class 9",
      student: "John Smith",
      issueDate: "2026-01-10",
      dueDate: "2026-01-24",
      status: "active",
    },
    {
      id: "2",
      book: "Physics Class 10",
      student: "Emma Wilson",
      issueDate: "2026-01-08",
      dueDate: "2026-01-22",
      status: "active",
    },
    {
      id: "3",
      book: "Chemistry Standard 11",
      student: "James Brown",
      issueDate: "2026-01-05",
      dueDate: "2026-01-19",
      status: "overdue",
    },
  ];

  const stats = {
    totalBooks: mockBooks.reduce((sum, b) => sum + b.total, 0),
    available: mockBooks.reduce((sum, b) => sum + b.available, 0),
    issued: mockBooks.reduce((sum, b) => sum + (b.total - b.available), 0),
    overdue: mockIssues.filter((i) => i.status === "overdue").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Library Management
          </h1>
          <p className="text-gray-600">Manage books and book issues</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={activeTab === "books" ? mockBooks.length === 0 : mockIssues.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Book className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-blue-700 text-sm font-medium">Total Books</p>
          </div>
          <p className="text-2xl font-bold text-blue-800">{stats.totalBooks}</p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-green-700 text-sm font-medium">Available</p>
          </div>
          <p className="text-2xl font-bold text-green-800">{stats.available}</p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <BookCheck className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-yellow-700 text-sm font-medium">Issued</p>
          </div>
          <p className="text-2xl font-bold text-yellow-800">{stats.issued}</p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-red-700 text-sm font-medium">Overdue</p>
          </div>
          <p className="text-2xl font-bold text-red-800">{stats.overdue}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
        <div className="border-b flex">
          <button
            onClick={() => setActiveTab("books")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${activeTab === "books" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
          >
            <Book className="w-4 h-4" />
            All Books
          </button>
          <button
            onClick={() => setActiveTab("issues")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${activeTab === "issues" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
          >
            <Clock className="w-4 h-4" />
            Book Issues
          </button>
        </div>

        {activeTab === "books" ? (
          <div>
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search books... (Press / to focus)"
                  value={booksSearchQuery}
                  onChange={(e) => setBooksSearchQuery(e.target.value)}
                  className="pl-9"
                />
                {hasBooksFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearBooksSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Available
                  </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    {hasBooksFilters ? "No books found" : "No books available"}
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                <tr key={book.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">
                    {book.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {book.author}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {book.category}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${book.available > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {book.available} / {book.total}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm mr-3">
                      Issue
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        ) : (
          <div>
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search issues... (Press / to focus)"
                  value={issuesSearchQuery}
                  onChange={(e) => setIssuesSearchQuery(e.target.value)}
                  className="pl-9"
                />
                {hasIssuesFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearIssuesSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
            <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Book
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Issue Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Due Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    {hasIssuesFilters ? "No issues found" : "No book issues"}
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => (
                <tr key={issue.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">
                    {issue.book}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {issue.student}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {issue.issueDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {issue.dueDate}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${issue.status === "overdue" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                    >
                      {issue.status === "overdue" ? "Overdue" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm mr-3">
                      Return
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm">
                      Remind
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
