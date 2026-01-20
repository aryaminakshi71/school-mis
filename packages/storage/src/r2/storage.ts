/**
 * R2 Storage Utilities
 *
 * Utilities for file storage using Cloudflare R2
 */

export interface R2Config {
  bindingName: string;
  bucketName?: string;
  publicUrl?: string;
}

export interface UploadOptions {
  folder?: string;
  subFolder?: string;
  maxSize?: number;
  allowedMimeTypes?: string[];
  makePublic?: boolean;
}

export interface UploadResult {
  key: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url?: string;
}

export interface FileMetadata {
  originalFileName: string;
  uploadedAt: string;
  contentType: string;
  contentDisposition: string;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB default
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'audio/wav',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/zip',
];

export class R2Storage {
  private binding: R2Bucket | null = null;
  private config: R2Config;
  private publicUrl: string;

  constructor(config: R2Config) {
    this.config = config;
    this.publicUrl = config.publicUrl || `https://${config.bucketName || 'school-mis'}.r2.dev`;
  }

  private getBinding(): R2Bucket {
    if (!this.binding && typeof process !== 'undefined') {
      const envVar = (process.env as Record<string, unknown>)[`R2_${config.bindingName}`];
      if (envVar) {
        this.binding = envVar as unknown as R2Bucket;
      }
    }
    // Return a mock for development
    return {
      put: async () => ({ key: '', size: 0, httpEtag: '' }),
      get: async () => null,
      delete: async () => {},
      list: async () => ({ list_complete: true, objects: [] }),
    } as unknown as R2Bucket;
  }

  private sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_+/g, '_')
      .toLowerCase();
  }

  private generateKey(folder: string, fileName: string): string {
    const timestamp = Date.now();
    const randomId = crypto.randomUUID?.().slice(0, 8) || Math.random().toString(36).slice(0, 8);
    const sanitizedName = this.sanitizeFileName(fileName);
    const extension = fileName.split('.').pop() || 'bin';

    return `${folder}/${timestamp}-${randomId}-${sanitizedName}.${extension}`;
  }

  async uploadFile(
    file: File | Blob,
    fileName: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const binding = this.getBinding();
    const {
      folder = 'uploads',
      subFolder,
      maxSize = MAX_FILE_SIZE,
      allowedMimeTypes = ALLOWED_MIME_TYPES,
    } = options;

    if (file.size > maxSize) {
      throw new Error(`File size exceeds maximum of ${maxSize / 1024 / 1024}MB`);
    }

    if (allowedMimeTypes.length > 0 && file.type && !allowedMimeTypes.includes(file.type)) {
      throw new Error(`File type not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`);
    }

    const fullFolder = subFolder ? `${folder}/${subFolder}` : folder;
    const key = this.generateKey(fullFolder, fileName);

    await binding.put(key, file, {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
        contentDisposition: `attachment; filename="${fileName}"`,
      },
      customMetadata: {
        originalFileName: fileName,
        uploadedAt: new Date().toISOString(),
      },
    });

    return {
      key,
      fileName,
      fileSize: file.size,
      mimeType: file.type || 'application/octet-stream',
      url: `${this.publicUrl}/${key}`,
    };
  }

  async deleteFile(key: string): Promise<void> {
    const binding = this.getBinding();
    await binding.delete(key);
  }

  async getFile(key: string): Promise<R2ObjectBody | null> {
    const binding = this.getBinding();
    return binding.get(key);
  }

  async listFiles(prefix: string, limit = 100): Promise<R2Object[]> {
    const binding = this.getBinding();
    const result = await binding.list({ prefix, limit });
    return result.objects;
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    // R2 doesn't have built-in presigned URLs
    // Use public URL or implement via Cloudflare Worker
    return `${this.publicUrl}/${key}?X-Amz-Expires=${expiresIn}`;
  }

  getPublicUrl(key: string): string {
    return `${this.publicUrl}/${key}`;
  }
}

export function createR2Storage(config: R2Config): R2Storage {
  return new R2Storage(config);
}

export const r2Storage = createR2Storage({
  bindingName: 'SCHOOL_STORAGE',
  bucketName: process.env.R2_BUCKET_NAME || 'school-mis',
  publicUrl: process.env.R2_PUBLIC_URL || 'https://school-mis.r2.dev',
});

export const STORAGE_FOLDERS = {
  STUDENT_PHOTOS: 'students/photos',
  STUDENT_DOCUMENTS: 'students/documents',
  TEACHER_PHOTOS: 'teachers/photos',
  STAFF_PHOTOS: 'staff/photos',
  ASSIGNMENTS: 'assignments',
  SYLLABUS: 'syllabus',
  CIRCULARS: 'circulars',
  GALLERY: 'gallery',
  BOOKS: 'books',
  TRANSPORT_DOCUMENTS: 'transport/documents',
  CERTIFICATES: 'certificates',
  REPORTS: 'reports',
  TEMPORARY: 'tmp',
} as const;

export async function uploadWithCleanup(
  storage: R2Storage,
  oldKey: string | null,
  newFile: File,
  newFileName: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  if (oldKey) {
    await storage.deleteFile(oldKey);
  }

  return storage.uploadFile(newFile, newFileName, options);
}
