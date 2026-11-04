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
export declare class AttachmentService {
    private readonly options;
    private readonly maxSizeBytes?;
    constructor(options?: IAttachmentServiceOptions);
    /** Add an attachment as a file path, preserving streaming behavior. */
    addFromPath(filePath: string, options?: Partial<IAttachment>): Promise<IAttachment>;
    addFromBuffer(buffer: Buffer, filename: string, options?: Partial<IAttachment>): Promise<IAttachment>;
    /** URL attachments are deliberately not fetched by this service. */
    addFromUrl(url: string, filename: string): Promise<IAttachment>;
    private assertSize;
}
//# sourceMappingURL=attachment.service.d.ts.map