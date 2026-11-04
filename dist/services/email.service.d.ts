import { IEmailOptions, IEmailSendResult } from '../core/interfaces/email.interface';
import { IEmailTransport } from '../providers/provider.interface';
/**
 * EmailService sends messages through a provider-neutral transport.
 * `send` always reports validation, render and transport failures in a typed
 * result; callers should inspect `status` and `rejected` rather than treating
 * any resolved promise as proof that every recipient received the message.
 */
export declare class EmailService {
    private transporter;
    private defaultFrom?;
    private errorStage;
    constructor(transporter: IEmailTransport, defaultFrom?: string | undefined, errorStage?: 'smtp' | 'provider');
    /**
     * Validates and normalizes basic message fields, then sends the message.
     * Header fields must be non-empty and contain no control characters; deeper
     * address syntax and deliverability policy are delegated to the selected transport/provider.
     */
    send(options: IEmailOptions): Promise<IEmailSendResult>;
    /** Verify SMTP configuration/connectivity without delivering a message. */
    verify(): Promise<true>;
    /** Close pooled connections during graceful application shutdown. */
    close(): void;
    private normalizeRecipients;
    private normalizeOptionalRecipients;
    private normalizeRequiredText;
    private normalizeOptionalText;
    private normalizeBody;
    private recipientList;
}
//# sourceMappingURL=email.service.d.ts.map