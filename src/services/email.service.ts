import { IEmailOptions, IEmailSendResult } from '../core/interfaces/email.interface';
import { IEmailTransport, ITransportMessage } from '../providers/provider.interface';

/**
 * EmailService sends messages through a provider-neutral transport.
 * `send` always reports validation, render and transport failures in a typed
 * result; callers should inspect `status` and `rejected` rather than treating
 * any resolved promise as proof that every recipient received the message.
 */
export class EmailService {
  constructor(
    private transporter: IEmailTransport,
    private defaultFrom?: string,
    private errorStage: 'smtp' | 'provider' = 'smtp'
  ) {}

  /**
   * Validates and normalizes basic message fields, then sends the message.
   * Header fields must be non-empty and contain no control characters; deeper
   * address syntax and deliverability policy are delegated to the selected transport/provider.
   */
  async send(options: IEmailOptions): Promise<IEmailSendResult> {
    let mailOptions: ITransportMessage;

    try {
      mailOptions = {
        from: this.normalizeOptionalText(options.from ?? this.defaultFrom, 'from'),
        to: this.normalizeRecipients(options.to, 'to'),
        cc: this.normalizeOptionalRecipients(options.cc, 'cc'),
        bcc: this.normalizeOptionalRecipients(options.bcc, 'bcc'),
        subject: this.normalizeRequiredText(options.subject, 'subject'),
        text: this.normalizeBody(options.text, 'text'),
        html: this.normalizeBody(options.html, 'html'),
        attachments: options.attachments
      };
    } catch (error) {
      return { success: false, status: 'failure', error, errorStage: 'validation' };
    }

    if (mailOptions.html === undefined && options.template) {
      try {
        mailOptions.html = await options.template.render(options);
      } catch (error) {
        return { success: false, status: 'failure', error, errorStage: 'render' };
      }
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      const accepted = this.recipientList(info?.accepted);
      const rejected = this.recipientList(info?.rejected);
      const status = rejected.length > 0
        ? (accepted.length > 0 ? 'partial' : 'failure')
        : 'success';

      return {
        success: status === 'success',
        status,
        messageId: info?.messageId,
        response: info?.response,
        ...(info?.accepted !== undefined ? { accepted } : {}),
        ...(info?.rejected !== undefined ? { rejected } : {})
      };
    } catch (error) {
      const details = error as {
        accepted?: unknown;
        rejected?: unknown;
        messageId?: string;
        response?: string;
      } | null;
      const accepted = this.recipientList(details?.accepted);
      const rejected = this.recipientList(details?.rejected);
      const partial = accepted.length > 0 && rejected.length > 0;

      return {
        success: false,
        status: partial ? 'partial' : 'failure',
        error,
        errorStage: this.errorStage,
        ...(details?.messageId !== undefined ? { messageId: details.messageId } : {}),
        ...(details?.response !== undefined ? { response: details.response } : {}),
        ...(details?.accepted !== undefined ? { accepted } : {}),
        ...(details?.rejected !== undefined ? { rejected } : {})
      };
    }
  }

  /** Verify SMTP configuration/connectivity without delivering a message. */
  async verify(): Promise<true> {
    if (!this.transporter.verify) {
      throw new Error('This API transport does not expose a non-delivery verification operation.');
    }
    return this.transporter.verify();
  }

  /** Close pooled connections during graceful application shutdown. */
  close(): void {
    this.transporter.close?.();
  }

  private normalizeRecipients(value: string | string[], field: string): string {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        throw new Error(`${field} must contain at least one recipient`);
      }
      const recipients = value.map((entry) => this.normalizeRequiredText(entry, field));
      return recipients.join(', ');
    }
    return this.normalizeRequiredText(value, field);
  }

  private normalizeOptionalRecipients(value: string | string[] | undefined, field: string): string | undefined {
    if (value === undefined) return undefined;
    return this.normalizeRecipients(value, field);
  }

  private normalizeRequiredText(value: unknown, field: string): string {
    const normalized = this.normalizeOptionalText(value, field);
    if (normalized === undefined) {
      throw new Error(`${field} is required`);
    }
    return normalized;
  }

  private normalizeOptionalText(value: unknown, field: string): string | undefined {
    if (value === undefined) return undefined;
    if (typeof value !== 'string') {
      throw new Error(`${field} must be a string`);
    }
    const normalized = value.trim();
    if (!normalized) {
      throw new Error(`${field} must not be empty`);
    }
    if (/[\u0000-\u001f\u007f]/.test(normalized)) {
      throw new Error(`${field} must not contain header control characters`);
    }
    return normalized;
  }

  private normalizeBody(value: unknown, field: string): string | undefined {
    if (value === undefined) return undefined;
    if (typeof value !== 'string') {
      throw new Error(`${field} must be a string`);
    }
    return value;
  }

  private recipientList(value: unknown): Array<string | { address: string; name: string }> {
    return Array.isArray(value) ? value : [];
  }
}
