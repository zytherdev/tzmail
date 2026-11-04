import { IMailgunConfig } from '../core/interfaces/email.interface';
import { ITransportMessage, ITransportSendInfo, IEmailTransport } from './provider.interface';
import { attachmentToBuffer, splitAddresses, validateApiConfig } from './provider-utils';

export class MailgunTransport implements IEmailTransport {
  private readonly apiUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly config: IMailgunConfig, fetchImpl: typeof fetch = fetch) {
    validateApiConfig(config);
    if (!config.domain.trim() || /[\u0000-\u001f\u007f]/.test(config.domain)) {
      throw new Error('Mailgun domain is required and must not contain control characters');
    }
    const defaultApiUrl = config.region === 'eu' ? 'https://api.eu.mailgun.net' : 'https://api.mailgun.net';
    this.apiUrl = (config.apiUrl ?? defaultApiUrl).replace(/\/+$/, '');
    const parsedUrl = new URL(this.apiUrl);
    if (parsedUrl.protocol !== 'https:' && parsedUrl.hostname !== 'localhost' && parsedUrl.hostname !== '127.0.0.1') {
      throw new Error('Mailgun apiUrl must use HTTPS');
    }
    this.fetchImpl = fetchImpl;
  }

  async sendMail(message: ITransportMessage): Promise<ITransportSendInfo> {
    const recipients = splitAddresses(message.to);
    if (recipients.length === 0) throw new Error('Mailgun requires at least one recipient');
    const from = message.from ?? this.config.defaultFrom;
    const body = new FormData();
    body.set('from', from);
    for (const recipient of recipients) body.append('to', recipient);
    for (const recipient of splitAddresses(message.cc)) body.append('cc', recipient);
    for (const recipient of splitAddresses(message.bcc)) body.append('bcc', recipient);
    body.set('subject', message.subject);
    if (message.text !== undefined) body.set('text', message.text);
    if (message.text === undefined && message.html === undefined) {
      throw new Error('Mailgun requires a text or HTML body');
    }

    let html = message.html;
    for (const attachment of message.attachments ?? []) {
      const data = await attachmentToBuffer(attachment, this.config.maxAttachmentBytes);
      const file = new Blob([new Uint8Array(data)], { type: attachment.contentType ?? 'application/octet-stream' });
      body.append(attachment.cid ? 'inline' : 'attachment', file, attachment.filename);
      if (attachment.cid && html !== undefined) {
        html = html.split(`cid:${attachment.cid}`).join(`cid:${attachment.filename}`);
      }
    }
    if (html !== undefined) body.set('html', html);

    const url = `${this.apiUrl}/v3/${encodeURIComponent(this.config.domain)}/messages`;
    const response = await this.fetchImpl(url, {
      method: 'POST',
      headers: {
        authorization: `Basic ${Buffer.from(`api:${this.config.apiKey}`).toString('base64')}`
      },
      body,
      redirect: 'error',
      signal: AbortSignal.timeout(this.config.requestTimeoutMs ?? 30_000)
    });
    const responseBody = await response.text();
    if (response.status !== 200) {
      const error = new Error(`Mailgun API returned HTTP ${response.status}${responseBody ? `: ${responseBody}` : ''}`);
      Object.assign(error, { statusCode: response.status, responseBody });
      throw error;
    }

    let result: { id?: string; message?: string };
    try {
      result = responseBody ? JSON.parse(responseBody) as { id?: string; message?: string } : {};
    } catch {
      throw new Error('Mailgun API returned an invalid JSON response');
    }
    const accepted = [...recipients, ...splitAddresses(message.cc), ...splitAddresses(message.bcc)];
    return {
      ...(result.id ? { messageId: result.id } : {}),
      response: result.message ?? '200 Accepted',
      accepted,
      rejected: []
    };
  }
}
