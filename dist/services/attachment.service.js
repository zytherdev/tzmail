"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Creates Nodemailer attachment descriptors. Path attachments remain paths so
 * Nodemailer can stream large files instead of loading them into memory.
 * If allowedRoot is omitted, callers are responsible for supplying trusted paths.
 */
class AttachmentService {
    options;
    maxSizeBytes;
    constructor(options = {}) {
        this.options = options;
        if (options.maxSizeBytes !== undefined &&
            (!Number.isFinite(options.maxSizeBytes) || options.maxSizeBytes < 0)) {
            throw new Error('maxSizeBytes must be a finite non-negative number');
        }
        this.maxSizeBytes = options.maxSizeBytes;
    }
    /** Add an attachment as a file path, preserving streaming behavior. */
    async addFromPath(filePath, options) {
        if (typeof filePath !== 'string' || filePath.trim() === '') {
            throw new Error('filePath must be a non-empty string');
        }
        let attachmentPath = filePath;
        let stats;
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
        }
        else {
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
    async addFromBuffer(buffer, filename, options) {
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
    addFromUrl(url, filename) {
        void url;
        void filename;
        throw new Error('addFromUrl is not supported; fetch and validate content in the application before adding an attachment');
    }
    assertSize(size) {
        if (this.maxSizeBytes !== undefined && size > this.maxSizeBytes) {
            throw new Error(`Attachment exceeds configured maxSizeBytes (${this.maxSizeBytes})`);
        }
    }
}
exports.AttachmentService = AttachmentService;
