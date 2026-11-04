import { ISendGridConfig } from '../core/interfaces/email.interface';
import { ITransportMessage, ITransportSendInfo, IEmailTransport } from './provider.interface';
import { attachmentToBuffer, parseMailboxes, validateApiConfig } from './provider-utils';

export class SendGridTransport implements IEmailTransport {
  private readonly apiUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly config: ISendGridConfig, fetchImpl: typeof fetch = fetch) {
    validateApiConfig(config);
    this.apiUrl = (config.apiUrl ?? 'https://api.sendgrid.com').replace(/\/+$/, '');
    const parsedUrl = new URL(this.apiUrl);
    if (parsedUrl.protocol !== 'https:' && parsedUrl.hostname !== 'localhost' && parsedUrl.hostname !== '127.0.0.1') {
      throw new Error('SendGrid apiUrl must use HTTPS');
    }
    this.fetchImpl = fetchImpl;
  }

  async sendMail(message: ITransportMessage): Promise<ITransportSendInfo> {
    const recipients = parseMailboxes(message.to);
    if (recipients.length === 0) throw new Error('SendGrid requires at least one recipient');
    const from = parseMailboxes(message.from ?? this.config.defaultFrom)[0];
    if (!from) throw new Error('SendGrid requires a sender');

    const content = [
      ...(message.text !== undefined ? [{ type: 'text/plain', value: message.text }] : []),
      ...(message.html !== undefined ? [{ type: 'text/html', value: message.html }] : [])
    ];
    if (content.length === 0) throw new Error('SendGrid requires a text or HTML body');

    const attachments = await Promise.all((message.attachments ?? []).map(async (attachment) => ({
      content: (await attachmentToBuffer(attachment, this.config.maxAttachmentBytes)).toString('base64'),
      filename: attachment.filename,
      type: attachment.contentType ?? 'application/octet-stream',
      disposition: attachment.cid ? 'inline' : 'attachment',
      ...(attachment.cid ? { content_id: attachment.cid } : {})
    })));

    const payload = {
      personalizations: [{
        to: recipients,
        ...(message.cc ? { cc: parseMailboxes(message.cc) } : {}),
        ...(message.bcc ? { bcc: parseMailboxes(message.bcc) } : {})
      }],
      from,
      subject: message.subject,
      content,
      ...(attachments.length > 0 ? { attachments } : {})
    };

    const response = await this.fetchImpl(`${this.apiUrl}/v3/mail/send`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${this.config.apiKey}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload),
      redirect: 'error',
      signal: AbortSignal.timeout(this.config.requestTimeoutMs ?? 30_000)
    });

    if (response.status !== 202) {
      const responseBody = await response.text();
      const error = new Error(`SendGrid API returned HTTP ${response.status}${responseBody ? `: ${responseBody}` : ''}`);
      Object.assign(error, { statusCode: response.status, responseBody });
      throw error;
    }

    const accepted = [...recipients, ...parseMailboxes(message.cc), ...parseMailboxes(message.bcc)].map(({ email, name }) =>
      name ? { address: email, name } : email
    );
    const messageId = response.headers.get('x-message-id') ?? undefined;
    return {
      ...(messageId ? { messageId } : {}),
      response: '202 Accepted',
      accepted,
      rejected: []
    };
  }
}
