/**
 * Library Management - Books and Transactions with Real Data
 */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { handleError } from "@/lib/error-handler";
import { exportToCSV } from "@/lib/export-utils";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  Book,
  BookCheck,
  BookOpen,
  Clock,
  Download,
  Loader2,
  Plus,
  Search,
  Send,
  Undo2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/library")({
  component: LibraryPage,
});

function LibraryPage() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"books" | "issues">("books");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialogs
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isIssueBookOpen, setIsIssueBookOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Forms
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "Textbook",
    publisher: "",
    totalCopies: "1",
    location: "",
  });

  const [issueForm, setIssueForm] = useState({
    bookId: "",
    studentId: "",
    dueDate: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksData, transactionsData, studentsData] = await Promise.all([
        api.library.books.list(),
        api.library.transactions.list(),
        api.students.list(),
      ]);
      setBooks(booksData);
      setTransactions(transactionsData);
      setStudents(studentsData);
    } catch (error) {
      console.error("Failed to fetch library data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeTransactions = transactions.filter((t) => t.status === "issued");
  const overdueTransactions = transactions.filter((t) => {
    if (t.status !== "issued") return false;
    return new Date(t.dueDate) < new Date();
  });

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title || !bookForm.author) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      setSubmitting(true);
      await api.library.books.create({
        title: bookForm.title,
        author: bookForm.author,
        isbn: bookForm.isbn || undefined,
        category: bookForm.category || undefined,
        publisher: bookForm.publisher || undefined,
        location: bookForm.location || undefined,
        totalCopies: Number(bookForm.totalCopies),
        availableCopies: Number(bookForm.totalCopies),
      });
      toast.success("Book added successfully");
      setIsAddBookOpen(false);
      setBookForm({
        title: "",
        author: "",
        isbn: "",
        category: "Textbook",
        publisher: "",
        totalCopies: "1",
        location: "",
      });
      fetchData();
    } catch (error) {
      toast.error("Failed to add book");
    } finally {
      setSubmitting(false);
    }
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.bookId || !issueForm.studentId || !issueForm.dueDate) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      await api.library.issue({
        bookId: issueForm.bookId,
        studentId: issueForm.studentId,
        dueDate: issueForm.dueDate,
      });
      toast.success("Book issued successfully");
      setIsIssueBookOpen(false);
      setIssueForm({ bookId: "", studentId: "", dueDate: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to issue book");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnBook = async (transactionId: string) => {
    try {
      await api.library.return(transactionId);
      toast.success("Book returned successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to return book");
    }
  };

  const handleExport = () => {
    try {
      if (activeTab === "books") {
        const exportData = books.map((b) => ({
          Title: b.title,
          Author: b.author || "",
          ISBN: b.isbn || "",
          Category: b.category || "",
          Available: String(b.availableCopies),
          Total: String(b.totalCopies),
        }));
        exportToCSV(
          exportData,
          `library-books-export-${new Date().toISOString().split("T")[0]}`,
        );
        toast.success("Books exported successfully");
      } else {
        const exportData = transactions.map((t) => ({
          "Book ID": t.bookId,
          "Student ID": t.studentId,
          "Issue Date": t.issueDate,
          "Due Date": t.dueDate,
          "Return Date": t.returnDate || "",
          Status: t.status,
        }));
        exportToCSV(
          exportData,
          `library-issues-export-${new Date().toISOString().split("T")[0]}`,
        );
        toast.success("Issues exported successfully");
      }
    } catch (err) {
      toast.error(handleError(err));
    }
  };

  const stats = {
    totalBooks: books.reduce((sum, b) => sum + (b.totalCopies || 0), 0),
    available: books.reduce((sum, b) => sum + (b.availableCopies || 0), 0),
    issued: activeTransactions.length,
    overdue: overdueTransactions.length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="fade-in animate-in space-y-6 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-foreground tracking-tight">
            Library Management
          </h1>
          <p className="text-muted-foreground">Manage books and book issues</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={books.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isIssueBookOpen} onOpenChange={setIsIssueBookOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Send className="mr-2 h-4 w-4" />
                Issue Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Issue Book</DialogTitle>
                <DialogDescription>
                  Issue a book to a student.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleIssueBook} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Select Book *</Label>
                  <Select
                    value={issueForm.bookId}
                    onValueChange={(val) =>
                      setIssueForm({ ...issueForm, bookId: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a book" />
                    </SelectTrigger>
                    <SelectContent>
                      {books
                        .filter((b) => b.availableCopies > 0)
                        .map((book) => (
                          <SelectItem key={book.id} value={book.id}>
                            {book.title} ({book.availableCopies} available)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Select Student *</Label>
                  <Select
                    value={issueForm.studentId}
                    onValueChange={(val) =>
                      setIssueForm({ ...issueForm, studentId: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Due Date *</Label>
                  <Input
                    type="date"
                    value={issueForm.dueDate}
                    onChange={(e) =>
                      setIssueForm({ ...issueForm, dueDate: e.target.value })
                    }
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsIssueBookOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Issue Book
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>
                  Add a book to the library catalog.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddBook} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    placeholder="Book title"
                    value={bookForm.title}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Author *</Label>
                    <Input
                      placeholder="Author name"
                      value={bookForm.author}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, author: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ISBN</Label>
                    <Input
                      placeholder="ISBN number"
                      value={bookForm.isbn}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, isbn: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={bookForm.category}
                      onValueChange={(val) =>
                        setBookForm({ ...bookForm, category: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Textbook">Textbook</SelectItem>
                        <SelectItem value="Novel">Novel</SelectItem>
                        <SelectItem value="Reference">Reference</SelectItem>
                        <SelectItem value="Magazine">Magazine</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Total Copies</Label>
                    <Input
                      type="number"
                      min="1"
                      value={bookForm.totalCopies}
                      onChange={(e) =>
                        setBookForm({
                          ...bookForm,
                          totalCopies: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Publisher</Label>
                  <Input
                    placeholder="Publisher name"
                    value={bookForm.publisher}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, publisher: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location / Shelf</Label>
                  <Input
                    placeholder="e.g., Shelf A-12"
                    value={bookForm.location}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, location: e.target.value })
                    }
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddBookOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add Book
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Book className="h-5 w-5 text-primary" />
            </div>
            <p className="font-medium text-primary text-sm">Total Books</p>
          </div>
          <p className="font-bold text-2xl text-primary">{stats.totalBooks}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15">
              <BookOpen className="h-5 w-5 text-success" />
            </div>
            <p className="font-medium text-sm text-success">Available</p>
          </div>
          <p className="font-bold text-2xl text-success">{stats.available}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/15">
              <BookCheck className="h-5 w-5 text-warning" />
            </div>
            <p className="font-medium text-sm text-warning">Issued</p>
          </div>
          <p className="font-bold text-2xl text-warning">{stats.issued}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <p className="font-medium text-destructive text-sm">Overdue</p>
          </div>
          <p className="font-bold text-2xl text-destructive">{stats.overdue}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("books")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm ${activeTab === "books" ? "border-primary border-b-2 text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Book className="h-4 w-4" />
            All Books
          </button>
          <button
            onClick={() => setActiveTab("issues")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm ${activeTab === "issues" ? "border-primary border-b-2 text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Clock className="h-4 w-4" />
            Book Issues ({activeTransactions.length})
          </button>
        </div>

        {activeTab === "books" ? (
          <div>
            <div className="border-b p-4">
              <div className="relative max-w-md">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search books by title, author, or ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            {filteredBooks.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Book className="mx-auto mb-3 h-10 w-10 opacity-20" />
                <p>No books found.</p>
                <p className="text-sm">Click "Add Book" to add one.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                        Author
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                        ISBN
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                        Available
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map((book) => (
                      <tr key={book.id} className="border-t hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium text-sm">
                          {book.title}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-sm">
                          {book.author || "-"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-sm">
                          {book.category || "-"}
                        </td>
                        <td className="px-4 py-3 font-mono text-muted-foreground text-sm">
                          {book.isbn || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`rounded-full px-2 py-1 font-medium text-xs ${book.availableCopies > 0 ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"}`}
                          >
                            {book.availableCopies} / {book.totalCopies}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={book.availableCopies === 0}
                            onClick={() => {
                              setIssueForm({ ...issueForm, bookId: book.id });
                              setIsIssueBookOpen(true);
                            }}
                          >
                            Issue
                          </Button>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div>
            {activeTransactions.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Clock className="mx-auto mb-3 h-10 w-10 opacity-20" />
                <p>No active book issues.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                        Book
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                        Student
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                        Issue Date
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                        Due Date
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTransactions.map((issue) => {
                      const book = books.find((b) => b.id === issue.bookId);
                      const student = students.find(
                        (s) => s.id === issue.studentId,
                      );
                      const isOverdue = new Date(issue.dueDate) < new Date();

                      return (
                        <tr
                          key={issue.id}
                          className="border-t hover:bg-muted/30"
                        >
                          <td className="px-4 py-3 font-medium text-sm">
                            {book?.title || "Unknown Book"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-sm">
                            {student
                              ? `${student.firstName} ${student.lastName}`
                              : "Unknown Student"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-sm">
                            {new Date(issue.issueDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-sm">
                            {new Date(issue.dueDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-1 font-medium text-xs ${isOverdue ? "bg-destructive/10 text-destructive" : "bg-success/15 text-success"}`}
                            >
                              {isOverdue ? "Overdue" : "Active"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReturnBook(issue.id)}
                            >
                              <Undo2 className="mr-1 h-4 w-4" />
                              Return
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
