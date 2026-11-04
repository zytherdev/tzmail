import { IAttachment } from '../core/interfaces/email.interface';
export interface IProviderMailbox {
    email: string;
    name?: string;
}
/** Splits a header address list without splitting commas inside quotes or angle brackets. */
export declare function splitAddresses(value: string | string[] | undefined): string[];
export declare function parseMailbox(value: string): IProviderMailbox;
export declare function parseMailboxes(value: string | string[] | undefined): IProviderMailbox[];
export declare function attachmentToBuffer(attachment: IAttachment, maxAttachmentBytes?: number): Promise<Buffer>;
export declare function validateApiConfig(options: {
    apiKey: string;
    defaultFrom: string;
    requestTimeoutMs?: number;
    maxAttachmentBytes?: number;
}): void;
//# sourceMappingURL=provider-utils.d.ts.map