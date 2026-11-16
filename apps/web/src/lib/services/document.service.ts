import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "qrcode";

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

  // Generate PDF from HTML element
  async generatePDF(
    elementId: string,
    filename: string,
    options?: {
      orientation?: "portrait" | "landscape";
      format?: "a4" | "letter";
    },
  ) {
    const element = document.getElementById(elementId);
    if (!element) throw new Error("Element not found");

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF(
      options?.orientation || "portrait",
      "mm",
      options?.format || "a4",
    );

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);

    return pdf;
  }

  // Generate Student ID Card PDF
  async generateStudentIDCard(student: any) {
    const doc = new jsPDF("portrait", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.text("Student ID Card", pageWidth / 2, margin + 10, {
      align: "center",
    });

    // Student Photo Placeholder
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, margin + 20, 40, 50);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Photo", margin + 20, margin + 45, { align: "center" });

    // Student Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const detailsX = margin + 50;
    let detailsY = margin + 25;

    doc.text(
      `Name: ${student.firstName} ${student.lastName}`,
      detailsX,
      detailsY,
    );
    detailsY += 8;
    doc.text(`Admission No: ${student.admissionNumber}`, detailsX, detailsY);
    detailsY += 8;
    doc.text(`Class: ${student.className}`, detailsX, detailsY);
    detailsY += 8;
    doc.text(`Roll No: ${student.rollNumber}`, detailsX, detailsY);
    detailsY += 8;
    doc.text(`Blood Group: ${student.bloodGroup || "N/A"}`, detailsX, detailsY);
    detailsY += 8;
    doc.text(`Contact: ${student.phone || "N/A"}`, detailsX, detailsY);

    // QR Code
    const qrData = JSON.stringify({
      id: student.id,
      admissionNumber: student.admissionNumber,
      type: "student",
    });
    const qrCanvas = document.createElement("canvas");
    await QRCode.toCanvas(qrCanvas, qrData, { width: 50 });
    const qrDataUrl = qrCanvas.toDataURL("image/png");
    doc.addImage(
      qrDataUrl,
      "PNG",
      pageWidth - margin - 50,
      margin + 20,
      50,
      50,
    );

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "This card is the property of the school. If found, please return to the school office.",
      pageWidth / 2,
      pageWidth - 20,
      { align: "center" },
    );

    doc.save(`ID_Card_${student.admissionNumber}.pdf`);
  }

  // Generate Fee Receipt PDF
  async generateFeeReceipt(receipt: any) {
    const doc = new jsPDF("portrait", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // Header
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.text("FEE RECEIPT", pageWidth / 2, margin, { align: "center" });

    // School Info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("School MIS", pageWidth / 2, margin + 8, { align: "center" });

    // Receipt Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let y = margin + 25;

    doc.text(`Receipt No: ${receipt.receiptNumber}`, margin, y);
    doc.text(
      `Date: ${new Date(receipt.paymentDate).toLocaleDateString()}`,
      pageWidth - margin - 50,
      y,
    );
    y += 10;

    doc.text(`Student Name: ${receipt.studentName}`, margin, y);
    y += 10;
    doc.text(`Class: ${receipt.className}`, margin, y);
    y += 10;
    doc.text(`Admission No: ${receipt.admissionNumber}`, margin, y);
    y += 15;

    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Fee Details Table
    doc.setFontSize(11);
    doc.text("Fee Category", margin, y);
    doc.text("Amount (₹)", pageWidth - margin - 30, y);
    y += 8;

    receipt.fees.forEach((fee: any) => {
      doc.text(fee.category, margin, y);
      doc.text(fee.amount.toFixed(2), pageWidth - margin - 30, y);
      y += 6;
    });

    y += 5;
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Total
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount:", margin, y);
    doc.text(`₹${receipt.totalAmount.toFixed(2)}`, pageWidth - margin - 30, y);
    doc.setFont("helvetica", "normal");
    y += 10;

    doc.text(`Payment Method: ${receipt.paymentMethod}`, margin, y);
    y += 10;
    doc.text(`Transaction ID: ${receipt.transactionId || "N/A"}`, margin, y);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "This is a computer generated receipt and does not require signature.",
      pageWidth / 2,
      280,
      { align: "center" },
    );

    doc.save(`Fee_Receipt_${receipt.receiptNumber}.pdf`);
  }

  // Generate QR Code
  async generateQRCode(
    data: string,
    options?: { width?: number; color?: string },
  ) {
    const canvas = document.createElement("canvas");
    await QRCode.toCanvas(canvas, data, {
      width: options?.width || 200,
      color: {
        dark: options?.color || "#000000",
        light: "#ffffff",
      },
    });
    return canvas.toDataURL("image/png");
  }

  // Generate Student QR ID
  async generateStudentQR(studentId: string, admissionNumber: string) {
    const data = JSON.stringify({
      id: studentId,
      admissionNumber,
      type: "student",
      timestamp: Date.now(),
    });
    return this.generateQRCode(data, { width: 300, color: "#4f46e5" });
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

export { categoryIcons, categoryLabels, formatFileSize };
export default documentService;
