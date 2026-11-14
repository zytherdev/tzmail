
export { EmailFactory } from './factories/email-factory';
export { TemplateFactory } from './factories/template-factory';
export { ITemplate, ITemplateConfig } from './core/interfaces/template.interface';
export { SOCIAL_PLATFORM_INFO } from './core/social-platforms';
export type { SocialPlatform } from './core/social-platforms';
export { ThemeType } from './core/enums/theme.enum';
export { ITheme, IThemeColorToken, IThemeEmailStyles, IThemeTextTransform } from './templates/themes/theme.interface';
export type { IThemeComposition, ThemeAlignment, ThemeSurface, HeaderComposition, BodyComposition, FooterComposition } from './templates/themes/theme-composition';
export { TemplateService, ITemplateServiceOptions } from './services/template.service';
export { EmailService } from './services/email.service';
export { AttachmentService, IAttachmentServiceOptions } from './services/attachment.service';
export {
  IAmazonSesConfig,
  IAttachment,
  IEmailAuth,
  IEmailConfig,
  IEmailOptions,
  IEmailSendResult,
  IMailgunConfig,
  ISendGridConfig
} from './core/interfaces/email.interface';
export { IEmailTransport, ITransportMessage, ITransportSendInfo } from './providers/provider.interface';
export {
  BullMQEmailQueue,
  IBullMQBackoffOptions,
  IBullMQEmailQueueConfig,
  IBullMQJobLike,
  IBullMQQueueEventPayload,
  IBullMQQueueEventsLike,
  IBullMQQueueMetrics,
  IBullMQRateLimiterOptions,
  IBullMQRuntime,
  IBullMQWorkerMetricsOptions,
  IEmailQueueJobData,
  IEmailQueueJobOptions,
  IEmailQueueSender,
  ISerializedEmailAttachment,
  IQueuedEmailJob
} from './queues/bullmq-email-queue';
export { TemplateBuilder } from './templates/base/template-builder';
export { CorporateTheme } from './templates/themes/corporate.theme';
export { MinimalTheme } from './templates/themes/minimal.theme';
export { ModernTheme } from './templates/themes/modern.theme';
export { MonokaiTheme } from './templates/themes/monokai.theme';
export { SystemTheme } from './templates/themes/system.theme';
export { AuroraTheme } from './templates/themes/aurora.theme';
export { OceanTheme } from './templates/themes/ocean.theme';
export { SunsetTheme } from './templates/themes/sunset.theme';
export { LavenderTheme } from './templates/themes/lavender.theme';
export { ForestTheme } from './templates/themes/forest.theme';
export { EditorialTheme } from './templates/themes/editorial.theme';
export { PastelTheme } from './templates/themes/pastel.theme';
export { NeoBrutalTheme } from './templates/themes/neobrutal.theme';
export { GlassTheme } from './templates/themes/glass.theme';
export { MidnightTheme } from './templates/themes/midnight.theme';
export { SaaSTheme } from './templates/themes/saas.theme';
export { CitrusTheme } from './templates/themes/citrus.theme';
export { BerryTheme } from './templates/themes/berry.theme';
export { PaperTheme } from './templates/themes/paper.theme';
export { NeonTheme } from './templates/themes/neon.theme';
export { AlpineTheme } from './templates/themes/alpine.theme';
export { OrbitTheme } from './templates/themes/orbit.theme';
export { LinenTheme } from './templates/themes/linen.theme';
export { BloomTheme } from './templates/themes/bloom.theme';
export { SlateTheme } from './templates/themes/slate.theme';
export { MarigoldTheme } from './templates/themes/marigold.theme';
export { InkwellTheme } from './templates/themes/inkwell.theme';
export { TideTheme } from './templates/themes/tide.theme';
export { ClayTheme } from './templates/themes/clay.theme';
export { CloudTheme } from './templates/themes/cloud.theme';
export { CampusTheme } from './templates/themes/campus.theme';
export { NoirTheme } from './templates/themes/noir.theme';
export { MintTheme } from './templates/themes/mint.theme';
export { SaffronTheme } from './templates/themes/saffron.theme';
