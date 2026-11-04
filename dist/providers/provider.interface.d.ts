import { IAttachment } from '../core/interfaces/email.interface';
export interface ITransportMessage {
    from?: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: IAttachment[];
}
export interface ITransportSendInfo {
    messageId?: string;
    response?: string;
    accepted?: Array<string | {
        address: string;
        name: string;
    }>;
    rejected?: Array<string | {
        address: string;
        name: string;
    }>;
}
/** Small common contract; provider transports may omit verify when their API has no safe health check. */
export interface IEmailTransport {
    sendMail(message: ITransportMessage): Promise<ITransportSendInfo>;
    verify?(): Promise<true>;
    close?(): void;
}
//# sourceMappingURL=provider.interface.d.ts.map