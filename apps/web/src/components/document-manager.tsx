import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Download,
  File,
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  FolderPlus,
  Grid,
  Home,
  Image,
  List,
  Lock,
  Presentation,
  Search,
  Share2,
  SortAsc,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

interface Document {
  id: string;
  name: string;
  type: "file" | "folder";
  mimeType?: string;
  size?: number;
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
  parentId: string | null;
  isShared?: boolean;
  isStarred?: boolean;
  isLocked?: boolean;
  thumbnail?: string;
  version?: number;
  tags?: string[];
}

interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  size: number;
  createdAt: string;
  createdBy: string;
  comment?: string;
}

interface DocumentManagerProps {
  className?: string;
}

const defaultDocuments: Document[] = [
  {
    id: "1",
    name: "School Documents",
    type: "folder",
    createdAt: "2024-01-15",
    modifiedAt: "2024-03-28",
    createdBy: "Admin",
    parentId: null,
    isStarred: true,
  },
  {
    id: "2",
    name: "Academic Records",
    type: "folder",
    createdAt: "2024-01-20",
    modifiedAt: "2024-03-25",
    createdBy: "Admin",
    parentId: null,
  },
  {
    id: "3",
    name: "Student Handbook 2024.pdf",
    type: "file",
    mimeType: "application/pdf",
    size: 2540000,
    createdAt: "2024-02-01",
    modifiedAt: "2024-03-15",
    createdBy: "Principal",
    parentId: null,
    isShared: true,
    version: 3,
  },
  {
    id: "4",
    name: "Class 10 Syllabus.docx",
    type: "file",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 1250000,
    createdAt: "2024-02-15",
    modifiedAt: "2024-03-20",
    createdBy: "Academic Coordinator",
    parentId: null,
    isStarred: true,
    version: 5,
  },
  {
    id: "5",
    name: "Exam Schedule.xlsx",
    type: "file",
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 450000,
    createdAt: "2024-03-01",
    modifiedAt: "2024-03-28",
    createdBy: "Exam Coordinator",
    parentId: null,
    version: 2,
  },
  {
    id: "6",
    name: "Annual Day Photos",
    type: "folder",
    createdAt: "2024-03-10",
    modifiedAt: "2024-03-10",
    createdBy: "Admin",
    parentId: null,
  },
  {
    id: "7",
    name: "School Logo.png",
    type: "file",
    mimeType: "image/png",
    size: 125000,
    createdAt: "2024-01-10",
    modifiedAt: "2024-01-10",
    createdBy: "Designer",
    parentId: null,
  },
  {
    id: "8",
    name: "Fee Structure 2024-25.pdf",
    type: "file",
    mimeType: "application/pdf",
    size: 890000,
    createdAt: "2024-03-05",
    modifiedAt: "2024-03-05",
    createdBy: "Accounts",
    parentId: null,
    isLocked: true,
    version: 1,
  },
];

const getFileIcon = (mimeType?: string) => {
  if (!mimeType) return File;
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.includes("spreadsheet")) return FileSpreadsheet;
  if (mimeType.includes("presentation")) return Presentation;
  if (mimeType.includes("pdf")) return FileText;
  if (mimeType.includes("audio")) return FileAudio;
  if (mimeType.includes("video")) return FileVideo;
  if (mimeType.includes("code") || mimeType.includes("text")) return FileCode;
  return File;
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "-";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function DocumentManager({ className }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>(defaultDocuments);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: Document | null;
  } | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<
    "all" | "folders" | "files" | "starred"
  >("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentDocuments = documents.filter(
    (doc) =>
      doc.parentId === currentFolder &&
      (filterType === "all" ||
        (filterType === "folders" && doc.type === "folder") ||
        (filterType === "files" && doc.type === "file") ||
        (filterType === "starred" && doc.isStarred)) &&
      (searchQuery === "" ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const sortedDocuments = [...currentDocuments].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "date") {
      comparison =
        new Date(a.modifiedAt).getTime() - new Date(b.modifiedAt).getTime();
    } else if (sortBy === "size") {
      comparison = (a.size || 0) - (b.size || 0);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleItemClick = (item: Document, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Toggle selection
      const newSelected = new Set(selectedItems);
      if (newSelected.has(item.id)) {
        newSelected.delete(item.id);
      } else {
        newSelected.add(item.id);
      }
      setSelectedItems(newSelected);
    } else if (item.type === "folder") {
      setCurrentFolder(item.id);
      setSelectedItems(new Set());
    }
  };

  const handleContextMenu = (e: React.MouseEvent, item: Document) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const toggleStar = (id: string) => {
    setDocuments(
      documents.map((doc) =>
        doc.id === id ? { ...doc, isStarred: !doc.isStarred } : doc,
      ),
    );
  };

  const deleteItem = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
    setContextMenu(null);
  };

  const uploadFiles = (files: FileList | null) => {
    if (!files) return;

    const newDocs: Document[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: "file",
      mimeType: file.type,
      size: file.size,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      createdBy: "Current User",
      parentId: currentFolder,
      version: 1,
    }));

    setDocuments([...documents, ...newDocs]);
    setShowUploadModal(false);
  };

  const createFolder = (name: string) => {
    const newFolder: Document = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type: "folder",
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      createdBy: "Current User",
      parentId: currentFolder,
    };
    setDocuments([...documents, newFolder]);
    setShowNewFolderModal(false);
  };

  const getBreadcrumb = () => {
    const breadcrumb: Document[] = [];
    let current = currentFolder;
    while (current) {
      const folder = documents.find((d) => d.id === current);
      if (folder) {
        breadcrumb.unshift(folder);
        current = folder.parentId;
      } else {
        break;
      }
    }
    return breadcrumb;
  };

  return (
    <div className={`flex h-full flex-col ${className || ""}`}>
      {/* Toolbar */}
      <div className="flex flex-col justify-between gap-4 border-gray-200 border-b p-4 sm:flex-row sm:items-center dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-2">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-sm">
            <button
              onClick={() => setCurrentFolder(null)}
              className="rounded-lg p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Home className="h-4 w-4 text-gray-500" />
            </button>
            {getBreadcrumb().map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <button
                  onClick={() => setCurrentFolder(folder.id)}
                  className="rounded-lg px-2 py-1 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {folder.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="w-64 rounded-lg border-0 bg-gray-100 py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-primary dark:bg-gray-800"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded p-1.5 ${viewMode === "list" ? "bg-white shadow-sm dark:bg-gray-700" : ""}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded p-1.5 ${viewMode === "grid" ? "bg-white shadow-sm dark:bg-gray-700" : ""}`}
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>

          {/* New Folder */}
          <button
            onClick={() => setShowNewFolderModal(true)}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <FolderPlus className="h-4 w-4" />
            <span className="hidden sm:inline">New Folder</span>
          </button>

          {/* Upload */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-white transition-colors hover:bg-primary/90"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-gray-200 border-b px-4 py-2 dark:border-gray-700">
        {[
          { id: "all", label: "All", icon: Folder },
          { id: "folders", label: "Folders", icon: Folder },
          { id: "files", label: "Files", icon: File },
          { id: "starred", label: "Starred", icon: Star },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setFilterType(filter.id as any)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
              filterType === filter.id
                ? "bg-primary/10 text-primary"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <filter.icon className="h-3.5 w-3.5" />
            {filter.label}
          </button>
        ))}

        <div className="mx-2 h-4 w-px bg-gray-300 dark:bg-gray-600" />

        <button
          onClick={() => {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          }}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-gray-600 text-sm transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <SortAsc
            className={`h-3.5 w-3.5 ${sortOrder === "desc" ? "rotate-180" : ""}`}
          />
          {sortBy === "name" ? "Name" : sortBy === "date" ? "Date" : "Size"}
        </button>

        <select
          value={sortBy}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSortBy(e.target.value as any)
          }
          className="border-0 bg-transparent text-gray-600 text-sm focus:ring-0 dark:text-gray-400"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="size">Sort by Size</option>
        </select>

        {selectedItems.size > 0 && (
          <>
            <div className="mx-2 h-4 w-px bg-gray-300 dark:bg-gray-600" />
            <span className="text-gray-600 text-sm dark:text-gray-400">
              {selectedItems.size} selected
            </span>
            <button
              onClick={() => setSelectedItems(new Set())}
              className="text-red-500 text-sm hover:text-red-600"
            >
              Clear
            </button>
          </>
        )}
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-auto p-4">
        {sortedDocuments.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <Folder className="mb-4 h-16 w-16 opacity-50" />
            <p className="font-medium text-lg">No documents found</p>
            <p className="text-sm">
              Upload files or create a folder to get started
            </p>
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-1">
            {/* Header */}
            <div className="flex items-center gap-4 border-gray-200 border-b px-4 py-2 font-medium text-gray-500 text-sm dark:border-gray-700 dark:text-gray-400">
              <div className="w-8" />
              <div className="flex-1">Name</div>
              <div className="hidden w-32 sm:block">Modified</div>
              <div className="hidden w-24 md:block">Size</div>
              <div className="hidden w-32 lg:block">Owner</div>
              <div className="w-8" />
            </div>

            {/* Items */}
            {sortedDocuments.map((item) => {
              const Icon =
                item.type === "folder" ? Folder : getFileIcon(item.mimeType);
              const isSelected = selectedItems.has(item.id);

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                    handleItemClick(item, e)
                  }
                  onContextMenu={(e: React.MouseEvent<HTMLDivElement>) =>
                    handleContextMenu(e, item)
                  }
                  className={`flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 transition-colors ${
                    isSelected
                      ? "border border-primary/30 bg-primary/10"
                      : "border border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <div className="flex w-8 justify-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        item.type === "folder"
                          ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </span>
                      {item.isLocked && (
                        <Lock className="h-3.5 w-3.5 text-gray-400" />
                      )}
                      {item.isShared && (
                        <Share2 className="h-3.5 w-3.5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs sm:hidden dark:text-gray-400">
                      <span>{formatDate(item.modifiedAt)}</span>
                      <span>•</span>
                      <span>{formatFileSize(item.size)}</span>
                    </div>
                  </div>

                  <div className="hidden w-32 text-gray-600 text-sm sm:block dark:text-gray-400">
                    {formatDate(item.modifiedAt)}
                  </div>

                  <div className="hidden w-24 text-gray-600 text-sm md:block dark:text-gray-400">
                    {formatFileSize(item.size)}
                  </div>

                  <div className="hidden w-32 text-gray-600 text-sm lg:block dark:text-gray-400">
                    {item.createdBy}
                  </div>

                  <div className="flex w-8 items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(item.id);
                      }}
                      className={`rounded-full p-1 transition-colors ${
                        item.isStarred
                          ? "text-yellow-500 hover:text-yellow-600"
                          : "text-gray-300 hover:text-gray-400"
                      }`}
                    >
                      <Star
                        className={`h-4 w-4 ${item.isStarred ? "fill-current" : ""}`}
                      />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {sortedDocuments.map((item) => {
              const Icon =
                item.type === "folder" ? Folder : getFileIcon(item.mimeType);
              const isSelected = selectedItems.has(item.id);

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                    handleItemClick(item, e)
                  }
                  onContextMenu={(e: React.MouseEvent<HTMLDivElement>) =>
                    handleContextMenu(e, item)
                  }
                  className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`mb-3 flex h-16 w-16 items-center justify-center rounded-2xl ${
                        item.type === "folder"
                          ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                    <p className="mb-1 line-clamp-2 font-medium text-gray-900 text-sm dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-gray-500 text-xs dark:text-gray-400">
                      {formatDate(item.modifiedAt)}
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      {item.isLocked && (
                        <Lock className="h-3 w-3 text-gray-400" />
                      )}
                      {item.isShared && (
                        <Share2 className="h-3 w-3 text-blue-500" />
                      )}
                      {item.isStarred && (
                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="fixed z-50 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-xl dark:border-gray-700 dark:bg-gray-800"
          >
            <button
              onClick={() => {
                if (contextMenu.item) toggleStar(contextMenu.item.id);
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Star className="h-4 w-4" />
              {contextMenu.item?.isStarred ? "Remove Star" : "Add Star"}
            </button>
            <button
              onClick={() => {
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button
              onClick={() => {
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <div className="my-1 border-gray-200 border-t dark:border-gray-700" />
            <button
              onClick={() => {
                if (contextMenu.item) deleteItem(contextMenu.item.id);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 text-sm hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </motion.div>
        </>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
                  Upload Files
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-xl border-2 border-gray-300 border-dashed p-8 text-center transition-colors hover:border-primary dark:border-gray-600"
              >
                <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">
                  Click to select files or drag and drop
                </p>
                <p className="mt-2 text-gray-400 text-sm">
                  Supports all file types up to 100MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => uploadFiles(e.target.files)}
                className="hidden"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Folder Modal */}
      <AnimatePresence>
        {showNewFolderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
                  New Folder
                </h3>
                <button
                  onClick={() => setShowNewFolderModal(false)}
                  className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.elements.namedItem(
                    "folderName",
                  ) as HTMLInputElement;
                  if (input.value) {
                    createFolder(input.value);
                  }
                }}
              >
                <input
                  name="folderName"
                  type="text"
                  placeholder="Folder name"
                  autoFocus
                  className="mb-4 w-full rounded-lg border-0 bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-primary dark:bg-gray-700"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewFolderModal(false)}
                    className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Storage Info */}
      <div className="border-gray-200 border-t px-4 py-3 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-400">
              {sortedDocuments.length} items
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {selectedItems.size} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400">Storage:</span>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="h-full w-3/5 rounded-full bg-primary" />
            </div>
            <span className="text-gray-600 dark:text-gray-400">6GB / 10GB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
