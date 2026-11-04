export { EmailFactory } from './factories/email-factory';
export { TemplateFactory } from './factories/template-factory';
export { ITemplate, ITemplateConfig } from './core/interfaces/template.interface';
export { ThemeType } from './core/enums/theme.enum';
export { ITheme } from './templates/themes/theme.interface';
export { TemplateService, ITemplateServiceOptions } from './services/template.service';
export { EmailService } from './services/email.service';
export { AttachmentService, IAttachmentServiceOptions } from './services/attachment.service';
export { IAmazonSesConfig, IAttachment, IEmailAuth, IEmailConfig, IEmailOptions, IEmailSendResult, IMailgunConfig, ISendGridConfig } from './core/interfaces/email.interface';
export { IEmailTransport, ITransportMessage, ITransportSendInfo } from './providers/provider.interface';
export { BullMQEmailQueue, IBullMQBackoffOptions, IBullMQEmailQueueConfig, IBullMQJobLike, IBullMQQueueEventPayload, IBullMQQueueEventsLike, IBullMQQueueMetrics, IBullMQRateLimiterOptions, IBullMQRuntime, IBullMQWorkerMetricsOptions, IEmailQueueJobData, IEmailQueueJobOptions, IEmailQueueSender, ISerializedEmailAttachment, IQueuedEmailJob } from './queues/bullmq-email-queue';
export { TemplateBuilder } from './templates/base/template-builder';
export { CorporateTheme } from './templates/themes/corporate.theme';
export { MinimalTheme } from './templates/themes/minimal.theme';
export { ModernTheme } from './templates/themes/modern.theme';
export { MonokaiTheme } from './templates/themes/monokai.theme';
export { SystemTheme } from './templates/themes/system.theme';
//# sourceMappingURL=index.d.ts.map