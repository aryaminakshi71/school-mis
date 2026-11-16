import { R2Bucket } from "@cloudflare/workers-types";

export interface BackupConfig {
  bucket: R2Bucket;
  prefix?: string;
  encryptionKey?: string;
}

export interface BackupMetadata {
  id: string;
  timestamp: string;
  type: "full" | "incremental" | "scheduled";
  size: number;
  tables: string[];
  status: "pending" | "in_progress" | "completed" | "failed";
  checksum: string;
  retentionDays: number;
}

export interface BackupOptions {
  type?: "full" | "incremental";
  tables?: string[];
  compress?: boolean;
  encrypt?: boolean;
  retentionDays?: number;
}

export interface RestoreOptions {
  backupId: string;
  tables?: string[];
  verify?: boolean;
  dryRun?: boolean;
}

export class BackupService {
  private bucket: R2Bucket;
  private prefix: string;
  private encryptionKey?: string;

  constructor(config: BackupConfig) {
    this.bucket = config.bucket;
    this.prefix = config.prefix || "backups";
    this.encryptionKey = config.encryptionKey;
  }

  async createBackup(
    db: any,
    options: BackupOptions = {},
  ): Promise<BackupMetadata> {
    const backupId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const metadata: BackupMetadata = {
      id: backupId,
      timestamp,
      type: options.type || "full",
      size: 0,
      tables: options.tables || [],
      status: "in_progress",
      checksum: "",
      retentionDays: options.retentionDays || 30,
    };

    try {
      // Export data from database
      const data = await this.exportData(db, options.tables);

      // Compress if enabled
      let processedData = data;
      if (options.compress !== false) {
        processedData = await this.compress(data);
      }

      // Encrypt if enabled
      if (options.encrypt !== false && this.encryptionKey) {
        processedData = await this.encrypt(processedData, this.encryptionKey);
      }

      // Calculate checksum
      metadata.checksum = await this.calculateChecksum(processedData);
      metadata.size = processedData.byteLength;

      // Upload to R2
      const key = `${this.prefix}/${backupId}.json${options.compress !== false ? ".gz" : ""}${options.encrypt !== false && this.encryptionKey ? ".enc" : ""}`;
      await this.bucket.put(key, processedData, {
        customMetadata: {
          id: metadata.id,
          type: metadata.type,
          status: metadata.status,
          size: metadata.size.toString(),
          checksum: metadata.checksum,
          timestamp,
          retentionDays: metadata.retentionDays.toString(),
          tables: JSON.stringify(metadata.tables),
        },
      });

      // Save metadata
      await this.saveMetadata(metadata);

      metadata.status = "completed";
      return metadata;
    } catch (error) {
      metadata.status = "failed";
      throw error;
    }
  }

  async restoreBackup(
    db: any,
    options: RestoreOptions,
  ): Promise<{ success: boolean; restored: string[] }> {
    const { backupId, tables, verify = true, dryRun = false } = options;

    // Retrieve backup
    const key = await this.findBackupKey(backupId);
    if (!key) {
      throw new Error(`Backup ${backupId} not found`);
    }

    const object = await this.bucket.get(key);
    if (!object) {
      throw new Error(`Backup ${backupId} not found in storage`);
    }

    let data = await object.arrayBuffer();

    // Decrypt if needed
    if (this.encryptionKey && key.includes(".enc")) {
      data = await this.decrypt(data, this.encryptionKey);
    }

    // Decompress if needed
    if (key.includes(".gz")) {
      data = await this.decompress(data);
    }

    // Verify checksum
    if (verify) {
      const metadata = await this.getMetadata(backupId);
      if (!metadata) {
        throw new Error("Backup verification failed: metadata not found");
      }
      const checksum = await this.calculateChecksum(data);
      if (checksum !== metadata.checksum) {
        throw new Error("Backup verification failed: checksum mismatch");
      }
    }

    if (dryRun) {
      return { success: true, restored: [] };
    }

    // Import data
    const parsed = JSON.parse(new TextDecoder().decode(data));
    const restored = await this.importData(db, parsed, tables);

    return { success: true, restored };
  }

  async listBackups(): Promise<BackupMetadata[]> {
    const objects = await this.bucket.list({ prefix: `${this.prefix}/` });
    const backups: BackupMetadata[] = [];

    for (const object of objects.objects || []) {
      if (object.key.endsWith(".meta.json")) {
        const metadata = await this.getMetadataFromKey(object.key);
        if (metadata) {
          backups.push(metadata);
        }
      }
    }

    return backups.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  async deleteBackup(backupId: string): Promise<boolean> {
    const key = await this.findBackupKey(backupId);
    if (!key) {
      return false;
    }

    await this.bucket.delete(key);
    await this.bucket.delete(`${this.prefix}/${backupId}.meta.json`);

    return true;
  }

  async cleanupOldBackups(maxAgeDays: number = 30): Promise<number> {
    const backups = await this.listBackups();
    const now = new Date();
    let deleted = 0;

    for (const backup of backups) {
      const age =
        (now.getTime() - new Date(backup.timestamp).getTime()) /
        (1000 * 60 * 60 * 24);

      if (age > (backup.retentionDays || maxAgeDays)) {
        await this.deleteBackup(backup.id);
        deleted++;
      }
    }

    return deleted;
  }

  private async exportData(db: any, tables?: string[]): Promise<ArrayBuffer> {
    const data: Record<string, any[]> = {};

    const tablesToExport = tables || (await this.getAllTables(db));

    for (const table of tablesToExport) {
      data[table] = await db.query(`SELECT * FROM ${table}`);
    }

    return new TextEncoder().encode(JSON.stringify(data)).buffer;
  }

  private async importData(
    db: any,
    data: Record<string, any[]>,
    tables?: string[],
  ): Promise<string[]> {
    const restored: string[] = [];
    const tablesToImport = tables || Object.keys(data);

    for (const table of tablesToImport) {
      if (data[table]) {
        // Truncate and insert
        await db.query(`TRUNCATE TABLE ${table}`);

        for (const row of data[table]) {
          const columns = Object.keys(row);
          const values = Object.values(row);
          const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

          await db.query(
            `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`,
            values,
          );
        }

        restored.push(table);
      }
    }

    return restored;
  }

  private async compress(data: ArrayBuffer): Promise<ArrayBuffer> {
    const stream = new CompressionStream("gzip");
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();

    writer.write(data);
    writer.close();

    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;

    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    return result.buffer;
  }

  private async decompress(data: ArrayBuffer): Promise<ArrayBuffer> {
    const stream = new DecompressionStream("gzip");
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();

    writer.write(data);
    writer.close();

    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;

    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    return result.buffer;
  }

  private async encrypt(data: ArrayBuffer, key: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM" },
      false,
      ["encrypt"],
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      data,
    );

    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);

    return result.buffer;
  }

  private async decrypt(data: ArrayBuffer, key: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM" },
      false,
      ["decrypt"],
    );

    const dataArray = new Uint8Array(data);
    const iv = dataArray.slice(0, 12);
    const encrypted = dataArray.slice(12);

    return await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      encrypted,
    );
  }

  private async calculateChecksum(data: ArrayBuffer): Promise<string> {
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  private async saveMetadata(metadata: BackupMetadata): Promise<void> {
    const key = `${this.prefix}/${metadata.id}.meta.json`;
    await this.bucket.put(key, JSON.stringify(metadata), {
      httpMetadata: { contentType: "application/json" },
    });
  }

  private async getMetadata(backupId: string): Promise<BackupMetadata | null> {
    const key = `${this.prefix}/${backupId}.meta.json`;
    return this.getMetadataFromKey(key);
  }

  private async getMetadataFromKey(
    key: string,
  ): Promise<BackupMetadata | null> {
    const object = await this.bucket.get(key);
    if (!object) {
      return null;
    }

    const text = await object.text();
    return JSON.parse(text);
  }

  private async findBackupKey(backupId: string): Promise<string | null> {
    const objects = await this.bucket.list({
      prefix: `${this.prefix}/${backupId}`,
    });

    for (const object of objects.objects || []) {
      if (!object.key.endsWith(".meta.json")) {
        return object.key;
      }
    }

    return null;
  }

  private async getAllTables(db: any): Promise<string[]> {
    // This would depend on your database setup
    // For PostgreSQL with Drizzle:
    const result = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);

    return result.map((row: any) => row.table_name);
  }
}
