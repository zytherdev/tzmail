import { IAmazonSesConfig, IEmailConfig, IEmailOptions, IEmailSendResult, IMailgunConfig, ISendGridConfig } from '../core/interfaces/email.interface';
import { ITemplateServiceOptions, TemplateService } from '../services/template.service';
import { AttachmentService, IAttachmentServiceOptions } from '../services/attachment.service';
import { ThemeType } from '../core/enums/theme.enum';
import { ITemplateConfig } from '../core/interfaces/template.interface';
import { IEmailTransport } from '../providers/provider.interface';
import { BullMQEmailQueue, IBullMQEmailQueueConfig } from '../queues/bullmq-email-queue';
export declare class EmailFactory {
    private static instance?;
    private static singletonFingerprint?;
    private emailService;
    private templateService;
    private attachmentService;
    private constructor();
    /**
     * Returns the process singleton. A later call with different settings fails
     * explicitly rather than silently continuing with the first configuration.
     */
    static initialize(config: IEmailConfig, templateOptions?: ITemplateServiceOptions, attachmentOptions?: IAttachmentServiceOptions): EmailFactory;
    /** Creates an independent factory instance without changing the singleton. */
    static create(config: IEmailConfig, templateOptions?: ITemplateServiceOptions, attachmentOptions?: IAttachmentServiceOptions): EmailFactory;
    /** Creates an independent SendGrid Web API v3 client; no provider state is shared between instances. */
    static createSendGrid(config: ISendGridConfig, templateOptions?: ITemplateServiceOptions, attachmentOptions?: IAttachmentServiceOptions): EmailFactory;
    /** Creates an independent Mailgun Messages API client. */
    static createMailgun(config: IMailgunConfig, templateOptions?: ITemplateServiceOptions, attachmentOptions?: IAttachmentServiceOptions): EmailFactory;
    /** Creates an Amazon SES v2 transport using the AWS SDK credential provider chain unless credentials are supplied. */
    static createSES(config: IAmazonSesConfig, templateOptions?: ITemplateServiceOptions, attachmentOptions?: IAttachmentServiceOptions): EmailFactory;
    /** Creates an instance around a user-supplied transport adapter. */
    static createWithTransport(transport: IEmailTransport, defaultFrom?: string, templateOptions?: ITemplateServiceOptions, attachmentOptions?: IAttachmentServiceOptions): EmailFactory;
    /** Creates an optional Redis-backed BullMQ producer/worker integration. */
    static createBullMQQueue(config: IBullMQEmailQueueConfig): BullMQEmailQueue;
    static getInstance(): EmailFactory;
    sendEmail(options: IEmailOptions): Promise<IEmailSendResult>;
    getTemplateService(): TemplateService;
    getAttachmentService(): AttachmentService;
    /** Verify connectivity when supported by the selected transport; API transports may not provide a safe check. */
    verifyTransport(): Promise<true>;
    /** Release pooled SMTP connections and the template cache cleanup timer. */
    close(): void;
    previewTemplate(themeType: ThemeType, variant: 'light' | 'dark', config: ITemplateConfig, data: any): Promise<string>;
    getThemeInfo(themeType: ThemeType): {
        name: string;
        description: string;
        features: string[];
        availableVariants: ("light" | "dark")[];
        defaultConfig: Partial<ITemplateConfig>;
    };
    listThemes(): ThemeType[];
    getTemplateStats(): {
        totalTemplates: number;
        cachedTemplates: number;
        totalHits: number;
        cacheRequests: number;
        templatesByTheme: Record<ThemeType, number>;
        cacheHitRate: number;
    };
    /** Hashes canonicalized settings so credentials are never exposed in errors/logs. */
    private static fingerprint;
}
//# sourceMappingURL=email-factory.d.ts.map