import { createHash } from 'crypto';
import { createRequire } from 'module';
import nodemailer from 'nodemailer';
import {
  IAmazonSesConfig,
  IEmailConfig,
  IEmailOptions,
  IEmailSendResult,
  IMailgunConfig,
  ISendGridConfig
} from '../core/interfaces/email.interface';
import { EmailService } from '../services/email.service';
import { ITemplateServiceOptions, TemplateService } from '../services/template.service';
import { AttachmentService, IAttachmentServiceOptions } from '../services/attachment.service';
import { ThemeType } from '../core/enums/theme.enum';
import { ITemplateConfig } from '../core/interfaces/template.interface';
import { IEmailTransport } from '../providers/provider.interface';
import { NodemailerTransport } from '../providers/nodemailer.transport';
import { SendGridTransport } from '../providers/sendgrid.transport';
import { MailgunTransport } from '../providers/mailgun.transport';
import { BullMQEmailQueue, IBullMQEmailQueueConfig } from '../queues/bullmq-email-queue';

const loadOptionalModule = createRequire(__filename);

export class EmailFactory {
  private static instance?: EmailFactory;
  private static singletonFingerprint?: string;
  private emailService: EmailService;
  private templateService: TemplateService;
  private attachmentService: AttachmentService;

  private constructor(
    transport: IEmailTransport,
    defaultFrom?: string,
    templateOptions?: ITemplateServiceOptions,
    attachmentOptions?: IAttachmentServiceOptions,
    errorStage: 'smtp' | 'provider' = 'smtp'
  ) {
    this.emailService = new EmailService(transport, defaultFrom, errorStage);
    this.templateService = new TemplateService(templateOptions);
    this.attachmentService = new AttachmentService(attachmentOptions);
  }

  /**
   * Returns the process singleton. A later call with different settings fails
   * explicitly rather than silently continuing with the first configuration.
   */
  static initialize(config: IEmailConfig, templateOptions?: ITemplateServiceOptions, attachmentOptions?: IAttachmentServiceOptions): EmailFactory {
    const fingerprint = this.fingerprint(config, templateOptions, attachmentOptions);
    if (!this.instance) {
      this.instance = new EmailFactory(
        new NodemailerTransport(nodemailer.createTransport(config)),
        config.defaultFrom,
        templateOptions,
        attachmentOptions
      );
      this.singletonFingerprint = fingerprint;
    } else if (this.singletonFingerprint !== fingerprint) {
      throw new Error('EmailFactory is already initialized with a different configuration; use EmailFactory.create() for an independent instance.');
    }
    return this.instance;
  }

  /** Creates an independent factory instance without changing the singleton. */
  static create(config: IEmailConfig, templateOptions?: ITemplateServiceOptions, attachmentOptions?: IAttachmentServiceOptions): EmailFactory {
    return new EmailFactory(
      new NodemailerTransport(nodemailer.createTransport(config)),
      config.defaultFrom,
      templateOptions,
      attachmentOptions
    );
  }

  /** Creates an independent SendGrid Web API v3 client; no provider state is shared between instances. */
  static createSendGrid(config: ISendGridConfig, templateOptions?: ITemplateServiceOptions, attachmentOptions?: IAttachmentServiceOptions): EmailFactory {
    return new EmailFactory(new SendGridTransport(config), config.defaultFrom, templateOptions, attachmentOptions, 'provider');
  }

  /** Creates an independent Mailgun Messages API client. */
  static createMailgun(config: IMailgunConfig, templateOptions?: ITemplateServiceOptions, attachmentOptions?: IAttachmentServiceOptions): EmailFactory {
    return new EmailFactory(new MailgunTransport(config), config.defaultFrom, templateOptions, attachmentOptions, 'provider');
  }

  /** Creates an Amazon SES v2 transport using the AWS SDK credential provider chain unless credentials are supplied. */
  static createSES(config: IAmazonSesConfig, templateOptions?: ITemplateServiceOptions, attachmentOptions?: IAttachmentServiceOptions): EmailFactory {
    if (!config.region.trim()) throw new Error('Amazon SES region is required');
    let awsSes: {
      SESv2Client: new (options: Record<string, unknown>) => unknown;
      SendEmailCommand: unknown;
    };
    try {
      awsSes = loadOptionalModule('@aws-sdk/client-sesv2') as typeof awsSes;
    } catch (error) {
      throw new Error('Amazon SES support requires optional package @aws-sdk/client-sesv2. Install it with: npm install @aws-sdk/client-sesv2', { cause: error });
    }
    const sesClient = new awsSes.SESv2Client({
      region: config.region,
      ...(config.credentials ? { credentials: config.credentials } : {})
    });
    const transporter = nodemailer.createTransport({
      SES: { sesClient, SendEmailCommand: awsSes.SendEmailCommand }
    } as never);
    return new EmailFactory(
      new NodemailerTransport(transporter, () => (sesClient as { destroy?: () => void }).destroy?.()),
      config.defaultFrom,
      templateOptions,
      attachmentOptions,
      'provider'
    );
  }

  /** Creates an instance around a user-supplied transport adapter. */
  static createWithTransport(
    transport: IEmailTransport,
    defaultFrom?: string,
    templateOptions?: ITemplateServiceOptions,
    attachmentOptions?: IAttachmentServiceOptions
  ): EmailFactory {
    return new EmailFactory(transport, defaultFrom, templateOptions, attachmentOptions, 'provider');
  }

  /** Creates an optional Redis-backed BullMQ producer/worker integration. */
  static createBullMQQueue(config: IBullMQEmailQueueConfig): BullMQEmailQueue {
    return new BullMQEmailQueue(config);
  }

  static getInstance(): EmailFactory {
    if (!this.instance) {
      throw new Error('EmailFactory not initialized. Call initialize() first.');
    }
    return this.instance;
  }

  async sendEmail(options: IEmailOptions): Promise<IEmailSendResult> {
    return this.emailService.send(options);
  }

  getTemplateService(): TemplateService {
    return this.templateService;
  }

  getAttachmentService(): AttachmentService {
    return this.attachmentService;
  }

  /** Verify connectivity when supported by the selected transport; API transports may not provide a safe check. */
  async verifyTransport(): Promise<true> {
    return this.emailService.verify();
  }

  /** Release pooled SMTP connections and the template cache cleanup timer. */
  close(): void {
    this.emailService.close();
    this.templateService.dispose();
    if (EmailFactory.instance === this) {
      EmailFactory.instance = undefined;
      EmailFactory.singletonFingerprint = undefined;
    }
  }

  async previewTemplate(
    themeType: ThemeType,
    variant: 'light' | 'dark',
    config: ITemplateConfig,
    data: any
  ): Promise<string> {
    return this.templateService.previewTemplate(themeType, variant, config, data);
  }

  getThemeInfo(themeType: ThemeType) {
    return this.templateService.getThemeInfo(themeType);
  }

  listThemes() {
    return this.templateService.listThemes();
  }

  getTemplateStats() {
    return this.templateService.getTemplateStats();
  }

  /** Hashes canonicalized settings so credentials are never exposed in errors/logs. */
  private static fingerprint(config: IEmailConfig, templateOptions?: ITemplateServiceOptions, attachmentOptions?: IAttachmentServiceOptions): string {
    const canonicalize = (value: any, ancestors = new Set<object>()): string => {
      if (value === undefined) return 'undefined';
      if (value === null || typeof value !== 'object') {
        if (typeof value === 'function') return `function:${value.toString()}`;
        if (typeof value === 'bigint') return `bigint:${value.toString()}`;
        return JSON.stringify(value) ?? String(value);
      }
      if (ancestors.has(value)) return '[Circular]';
      ancestors.add(value);
      let result: string;
      if (Array.isArray(value)) {
        result = `[${value.map((item) => canonicalize(item, ancestors)).join(',')}]`;
      } else if (value instanceof Date) {
        result = `date:${value.toISOString()}`;
      } else {
        result = `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key], ancestors)}`).join(',')}}`;
      }
      ancestors.delete(value);
      return result;
    };

    const serialized = `${canonicalize(config)}|${canonicalize(templateOptions)}|${canonicalize(attachmentOptions)}`;
    return createHash('sha256').update(serialized).digest('hex');
  }
}
