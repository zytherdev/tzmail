import { readFile, stat } from 'fs/promises';
import { IAttachment } from '../core/interfaces/email.interface';

export interface IProviderMailbox {
  email: string;
  name?: string;
}

/** Splits a header address list without splitting commas inside quotes or angle brackets. */
export function splitAddresses(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  const entries = Array.isArray(value) ? value : [value];
  const result: string[] = [];

  for (const entry of entries) {
    let start = 0;
    let quoted = false;
    let angleDepth = 0;
    for (let index = 0; index < entry.length; index += 1) {
      const char = entry[index];
      if (char === '"' && entry[index - 1] !== '\\') quoted = !quoted;
      if (!quoted && char === '<') angleDepth += 1;
      if (!quoted && char === '>' && angleDepth > 0) angleDepth -= 1;
      if (!quoted && angleDepth === 0 && char === ',') {
        const address = entry.slice(start, index).trim();
        if (address) result.push(address);
        start = index + 1;
      }
    }
    const address = entry.slice(start).trim();
    if (address) result.push(address);
  }

  return result;
}

export function parseMailbox(value: string): IProviderMailbox {
  const normalized = value.trim();
  const match = /^(.*?)\s*<([^<>]+)>$/.exec(normalized);
  if (!match) return { email: normalized };

  const name = match[1].trim().replace(/^"|"$/g, '');
  return name ? { email: match[2].trim(), name } : { email: match[2].trim() };
}

export function parseMailboxes(value: string | string[] | undefined): IProviderMailbox[] {
  return splitAddresses(value).map(parseMailbox);
}

export async function attachmentToBuffer(attachment: IAttachment, maxAttachmentBytes?: number): Promise<Buffer> {
  let content: Buffer;
  if (attachment.content !== undefined) {
    content = Buffer.isBuffer(attachment.content)
      ? attachment.content
      : Buffer.from(attachment.content);
  } else if (attachment.path) {
    if (maxAttachmentBytes !== undefined) {
      const fileInfo = await stat(attachment.path);
      if (fileInfo.size > maxAttachmentBytes) {
        throw new Error(`Attachment exceeds configured maxAttachmentBytes (${maxAttachmentBytes})`);
      }
    }
    content = await readFile(attachment.path);
  } else {
    throw new Error(`Attachment "${attachment.filename}" requires content or path`);
  }

  if (maxAttachmentBytes !== undefined && content.length > maxAttachmentBytes) {
    throw new Error(`Attachment exceeds configured maxAttachmentBytes (${maxAttachmentBytes})`);
  }
  if (!attachment.filename || /[\u0000-\u001f\u007f]/.test(attachment.filename)) {
    throw new Error('Attachment filename must be non-empty and contain no control characters');
  }
  return content;
}

export function validateApiConfig(options: {
  apiKey: string;
  defaultFrom: string;
  requestTimeoutMs?: number;
  maxAttachmentBytes?: number;
}): void {
  if (!options.apiKey.trim()) throw new Error('Provider apiKey is required');
  if (!options.defaultFrom.trim()) throw new Error('Provider defaultFrom is required');
  if (options.requestTimeoutMs !== undefined && (!Number.isSafeInteger(options.requestTimeoutMs) || options.requestTimeoutMs <= 0)) {
    throw new Error('requestTimeoutMs must be a positive safe integer');
  }
  if (options.maxAttachmentBytes !== undefined && (!Number.isSafeInteger(options.maxAttachmentBytes) || options.maxAttachmentBytes <= 0)) {
    throw new Error('maxAttachmentBytes must be a positive safe integer');
  }
}
