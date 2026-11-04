import * as fs from 'fs';
import * as path from 'path';
import { IAttachment } from '../core/interfaces/email.interface';

export interface IAttachmentServiceOptions {
  /** Restrict path attachments to this directory, resolved through realpath. */
  allowedRoot?: string;
  /** Optional maximum byte size for path- and buffer-backed attachments. */
  maxSizeBytes?: number;
}

/**
 * Creates Nodemailer attachment descriptors. Path attachments remain paths so
 * Nodemailer can stream large files instead of loading them into memory.
 * If allowedRoot is omitted, callers are responsible for supplying trusted paths.
 */
export class AttachmentService {
  private readonly maxSizeBytes?: number;

  constructor(private readonly options: IAttachmentServiceOptions = {}) {
    if (options.maxSizeBytes !== undefined &&
      (!Number.isFinite(options.maxSizeBytes) || options.maxSizeBytes < 0)) {
      throw new Error('maxSizeBytes must be a finite non-negative number');
    }
    this.maxSizeBytes = options.maxSizeBytes;
  }

  /** Add an attachment as a file path, preserving streaming behavior. */
  async addFromPath(filePath: string, options?: Partial<IAttachment>): Promise<IAttachment> {
    if (typeof filePath !== 'string' || filePath.trim() === '') {
      throw new Error('filePath must be a non-empty string');
    }

    let attachmentPath = filePath;
    let stats: fs.Stats;

    if (this.options.allowedRoot !== undefined) {
      const [rootRealPath, fileRealPath] = await Promise.all([
        fs.promises.realpath(this.options.allowedRoot),
        fs.promises.realpath(filePath)
      ]);
      const relativePath = path.relative(rootRealPath, fileRealPath);
      if (relativePath === '..' || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
        throw new Error('Attachment path is outside allowedRoot');
      }
      attachmentPath = fileRealPath;
      stats = await fs.promises.stat(fileRealPath);
    } else {
      stats = await fs.promises.stat(filePath);
    }

    if (!stats.isFile()) {
      throw new Error('Attachment path is not a file');
    }
    this.assertSize(stats.size);

    return {
      filename: options?.filename || path.basename(filePath),
      path: attachmentPath,
      contentType: options?.contentType,
      cid: options?.cid
    };
  }

  async addFromBuffer(
    buffer: Buffer,
    filename: string,
    options?: Partial<IAttachment>
  ): Promise<IAttachment> {
    if (!Buffer.isBuffer(buffer)) {
      throw new Error('buffer must be a Buffer');
    }
    if (typeof filename !== 'string' || filename.trim() === '') {
      throw new Error('filename must be a non-empty string');
    }
    this.assertSize(buffer.length);

    return {
      filename,
      content: buffer,
      contentType: options?.contentType,
      cid: options?.cid
    };
  }

  /** URL attachments are deliberately not fetched by this service. */
  addFromUrl(url: string, filename: string): Promise<IAttachment> {
    void url;
    void filename;
    throw new Error('addFromUrl is not supported; fetch and validate content in the application before adding an attachment');
  }

  private assertSize(size: number): void {
    if (this.maxSizeBytes !== undefined && size > this.maxSizeBytes) {
      throw new Error(`Attachment exceeds configured maxSizeBytes (${this.maxSizeBytes})`);
    }
  }
}
