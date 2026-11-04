import { ITemplate } from './template.interface';
export interface IEmailOptions {
    to: string | string[];
    subject: string;
    from?: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: IAttachment[];
    template?: ITemplate;
    /** Primitive named values interpolated into `{{variable}}` placeholders. */
    templateData?: Record<string, unknown>;
    text?: string;
    html?: string;
}
export interface IAttachment {
    filename: string;
    content?: string | Buffer;
    path?: string;
    contentType?: string;
    cid?: string;
}
/**
 * Typed outcome of an email attempt. `success` is true only when the transport
 * did not report rejected recipients. `partial` means that at least one
 * recipient was accepted and at least one rejected; a failure result must not
 * be interpreted as successful delivery. `error` retains the original thrown
 * validation, rendering or transport error, when present.
 */
export interface IEmailSendResult {
    success: boolean;
    status: 'success' | 'partial' | 'failure';
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
    error?: unknown;
    errorStage?: 'validation' | 'render' | 'smtp' | 'provider';
}
export type IEmailAuth = {
    user: string;
    pass: string;
    type?: 'login' | 'Login' | 'LOGIN';
} | {
    user: string;
    type: 'oauth2' | 'OAuth2' | 'OAUTH2';
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
    accessToken?: string;
    accessUrl?: string;
    expires?: number;
    timeout?: number;
    privateKey?: string | {
        key: string;
        passphrase: string;
    };
    serviceClient?: string;
    provisionCallback?: (user: string, renew: boolean, callback: (error: Error | null, accessToken: string, expires: number) => void) => void;
} | {
    user: string;
    pass: string;
    type: 'custom' | 'Custom' | 'CUSTOM';
    method: string;
};
export interface IEmailConfig {
    host: string;
    port: number;
    secure: boolean;
    /** Reuse SMTP connections; set true with pool sizing for sustained throughput. */
    pool?: boolean;
    maxConnections?: number;
    maxMessages?: number;
    /** Shared rate limiter window and message limit (requires pool: true). */
    rateDelta?: number;
    rateLimit?: number;
    connectionTimeout?: number;
    greetingTimeout?: number;
    socketTimeout?: number;
    auth: IEmailAuth;
    defaultFrom?: string;
}
/** SendGrid Web API v3 settings. API keys should come from a secret manager. */
export interface ISendGridConfig {
    apiKey: string;
    defaultFrom: string;
    /** Optional API base URL, for example the regional EU API endpoint. */
    apiUrl?: string;
    requestTimeoutMs?: number;
    /** Optional per-attachment memory guard; API attachments are encoded in memory. */
    maxAttachmentBytes?: number;
}
/** Mailgun Messages API settings. */
export interface IMailgunConfig {
    apiKey: string;
    domain: string;
    defaultFrom: string;
    region?: 'us' | 'eu';
    /** Optional custom API base URL, useful for regional or controlled endpoints. */
    apiUrl?: string;
    requestTimeoutMs?: number;
    /** Optional per-attachment memory guard; API attachments are uploaded in memory. */
    maxAttachmentBytes?: number;
}
/** Amazon SES v2 settings; when credentials are omitted, the AWS SDK default credential chain is used. */
export interface IAmazonSesConfig {
    region: string;
    defaultFrom?: string;
    credentials?: {
        accessKeyId: string;
        secretAccessKey: string;
        sessionToken?: string;
    };
}
//# sourceMappingURL=email.interface.d.ts.map