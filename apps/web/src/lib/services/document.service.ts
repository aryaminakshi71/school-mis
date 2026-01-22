export type DocumentCategory =
  | "admission"
  | "report-card"
  | "fee-receipt"
  | "id-card"
  | "transport-pass"
  | "leaving-certificate"
  | "character-certificate"
  | "transfer-certificate"
  | "medical"
  | "other";

export interface Document {
  id: string;
  name: string;
  category: DocumentCategory;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
  description?: string;
  tags?: string[];
  sharedWith?: string[];
}

export interface UploadProgress {
  documentId: string;
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "processing" | "completed" | "failed";
  error?: string;
}

export interface Folder {
  id: string;
  name: string;
  category: DocumentCategory;
  parentId?: string;
  documentCount: number;
  createdAt: Date;
}

const categoryLabels: Record<DocumentCategory, string> = {
  admission: "Admission Documents",
  "report-card": "Report Cards",
  "fee-receipt": "Fee Receipts",
  "id-card": "ID Cards",
  "transport-pass": "Transport Passes",
  "leaving-certificate": "Leaving Certificates",
  "character-certificate": "Character Certificates",
  "transfer-certificate": "Transfer Certificates",
  medical: "Medical Documents",
  other: "Other Documents",
};

const categoryIcons: Record<DocumentCategory, string> = {
  admission: "📋",
  "report-card": "📊",
  "fee-receipt": "🧾",
  "id-card": "🪪",
  "transport-pass": "🚌",
  "leaving-certificate": "📜",
  "character-certificate": "✍️",
  "transfer-certificate": "🔄",
  medical: "🏥",
  other: "📁",
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function loadDocuments(userId: string): Document[] {
  const saved = localStorage.getItem(`documents_${userId}`);
  if (saved) {
    try {
      return JSON.parse(saved).map((d: any) => ({
        ...d,
        uploadedAt: new Date(d.uploadedAt),
      }));
    } catch {
      return [];
    }
  }
  return [];
}

function saveDocuments(userId: string, documents: Document[]) {
  localStorage.setItem(`documents_${userId}`, JSON.stringify(documents));
}

class DocumentService {
  private documents: Document[] = [];
  private uploadQueue: UploadProgress[] = [];
  private listeners: Set<(documents: Document[]) => void> = new Set();
  private maxFileSize = 10 * 1024 * 1024;
  private allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  constructor() {
    this.loadDocumentsFromStorage();
  }

  private loadDocumentsFromStorage() {
    const userId = this.getCurrentUserId();
    this.documents = loadDocuments(userId);
  }

  private getCurrentUserId(): string {
    const savedUser = localStorage.getItem("school_mis_user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        return user.id || "default";
      } catch {
        return "default";
      }
    }
    return "default";
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.documents]));
  }

  addListener(listener: (documents: Document[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getDocuments(category?: DocumentCategory): Document[] {
    if (category) {
      return this.documents.filter((d) => d.category === category);
    }
    return [...this.documents].sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );
  }

  getDocumentById(id: string): Document | undefined {
    return this.documents.find((d) => d.id === id);
  }

  getDocumentsByCategory(): Record<DocumentCategory, Document[]> {
    const grouped: Record<string, Document[]> = {};
    this.documents.forEach((doc) => {
      if (!grouped[doc.category]) {
        grouped[doc.category] = [];
      }
      grouped[doc.category].push(doc);
    });
    return grouped as Record<DocumentCategory, Document[]>;
  }

  async uploadDocument(
    file: File,
    category: DocumentCategory,
    description?: string,
    tags?: string[],
  ): Promise<{ success: boolean; document?: Document; error?: string }> {
    const uploadId = `upload_${Date.now()}`;
    const uploadProgress: UploadProgress = {
      documentId: uploadId,
      fileName: file.name,
      progress: 0,
      status: "pending",
    };

    this.uploadQueue.push(uploadProgress);

    if (file.size > this.maxFileSize) {
      uploadProgress.status = "failed";
      uploadProgress.error = `File size exceeds ${formatFileSize(this.maxFileSize)}`;
      return { success: false, error: uploadProgress.error };
    }

    if (!this.allowedMimeTypes.includes(file.type)) {
      uploadProgress.status = "failed";
      uploadProgress.error =
        "File type not allowed. Please upload PDF, Image, or Word document.";
      return { success: false, error: uploadProgress.error };
    }

    uploadProgress.status = "uploading";

    try {
      const base64 = await this.fileToBase64(file);

      uploadProgress.progress = 50;
      uploadProgress.status = "processing";

      await new Promise((resolve) => setTimeout(resolve, 500));

      const document: Document = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        category,
        fileName: file.name,
        fileUrl: base64,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date(),
        uploadedBy: this.getCurrentUserId(),
        description,
        tags,
      };

      this.documents.push(document);
      saveDocuments(this.getCurrentUserId(), this.documents);

      uploadProgress.progress = 100;
      uploadProgress.status = "completed";
      uploadProgress.documentId = document.id;

      this.notifyListeners();

      return { success: true, document };
    } catch (error) {
      uploadProgress.status = "failed";
      uploadProgress.error = "Upload failed. Please try again.";
      return { success: false, error: uploadProgress.error };
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  deleteDocument(id: string): boolean {
    const index = this.documents.findIndex((d) => d.id === id);
    if (index !== -1) {
      this.documents.splice(index, 1);
      saveDocuments(this.getCurrentUserId(), this.documents);
      this.notifyListeners();
      return true;
    }
    return false;
  }

  updateDocument(
    id: string,
    updates: Partial<Omit<Document, "id" | "fileUrl" | "uploadedAt">>,
  ): Document | null {
    const document = this.documents.find((d) => d.id === id);
    if (document) {
      Object.assign(document, updates);
      saveDocuments(this.getCurrentUserId(), this.documents);
      this.notifyListeners();
      return document;
    }
    return null;
  }

  shareDocument(id: string, sharedWith: string[]): boolean {
    const document = this.documents.find((d) => d.id === id);
    if (document) {
      document.sharedWith = sharedWith;
      saveDocuments(this.getCurrentUserId(), this.documents);
      return true;
    }
    return false;
  }

  downloadDocument(id: string): void {
    const doc = this.documents.find((d) => d.id === id);
    if (doc) {
      const link = doc.fileUrl;
      const a = window.document.createElement("a");
      a.href = link;
      a.download = doc.fileName;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
    }
  }

  searchDocuments(query: string): Document[] {
    const lowerQuery = query.toLowerCase();
    return this.documents.filter(
      (d) =>
        d.name.toLowerCase().includes(lowerQuery) ||
        d.description?.toLowerCase().includes(lowerQuery) ||
        d.tags?.some((t) => t.toLowerCase().includes(lowerQuery)) ||
        categoryLabels[d.category].toLowerCase().includes(lowerQuery),
    );
  }

  getUploadQueue(): UploadProgress[] {
    return [...this.uploadQueue];
  }

  clearCompletedUploads() {
    this.uploadQueue = this.uploadQueue.filter((u) => u.status !== "completed");
  }

  getTotalStorageUsed(): number {
    return this.documents.reduce((sum, d) => sum + d.fileSize, 0);
  }

  getDocumentStats(): {
    totalDocuments: number;
    totalSize: number;
    byCategory: Record<DocumentCategory, number>;
    recentUploads: Document[];
  } {
    const byCategory: Record<string, number> = {};
    this.documents.forEach((d) => {
      byCategory[d.category] = (byCategory[d.category] || 0) + 1;
    });

    return {
      totalDocuments: this.documents.length,
      totalSize: this.getTotalStorageUsed(),
      byCategory: byCategory as Record<DocumentCategory, number>,
      recentUploads: this.documents
        .sort(
          (a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
        )
        .slice(0, 5),
    };
  }

  importDocuments(documents: Document[]) {
    this.documents.push(...documents);
    saveDocuments(this.getCurrentUserId(), this.documents);
    this.notifyListeners();
  }

  exportAllDocuments(): Blob {
    const data = JSON.stringify(this.documents, null, 2);
    return new Blob([data], { type: "application/json" });
  }
}

export const documentService = new DocumentService();

export function useDocuments() {
  return {
    documents: documentService.getDocuments(),
    uploadDocument: documentService.uploadDocument.bind(documentService),
    deleteDocument: documentService.deleteDocument.bind(documentService),
    updateDocument: documentService.updateDocument.bind(documentService),
    shareDocument: documentService.shareDocument.bind(documentService),
    downloadDocument: documentService.downloadDocument.bind(documentService),
    searchDocuments: documentService.searchDocuments.bind(documentService),
    getDocumentsByCategory:
      documentService.getDocumentsByCategory.bind(documentService),
    getDocumentById: documentService.getDocumentById.bind(documentService),
    getUploadQueue: documentService.getUploadQueue.bind(documentService),
    clearCompletedUploads:
      documentService.clearCompletedUploads.bind(documentService),
    getDocumentStats: documentService.getDocumentStats.bind(documentService),
    importDocuments: documentService.importDocuments.bind(documentService),
    exportAllDocuments:
      documentService.exportAllDocuments.bind(documentService),
  };
}

export { formatFileSize, categoryLabels, categoryIcons };
export default documentService;
