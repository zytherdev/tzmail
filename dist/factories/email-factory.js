"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailFactory = void 0;
const crypto_1 = require("crypto");
const module_1 = require("module");
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_service_1 = require("../services/email.service");
const template_service_1 = require("../services/template.service");
const attachment_service_1 = require("../services/attachment.service");
const nodemailer_transport_1 = require("../providers/nodemailer.transport");
const sendgrid_transport_1 = require("../providers/sendgrid.transport");
const mailgun_transport_1 = require("../providers/mailgun.transport");
const bullmq_email_queue_1 = require("../queues/bullmq-email-queue");
const loadOptionalModule = (0, module_1.createRequire)(__filename);
class EmailFactory {
    static instance;
    static singletonFingerprint;
    emailService;
    templateService;
    attachmentService;
    constructor(transport, defaultFrom, templateOptions, attachmentOptions, errorStage = 'smtp') {
        this.emailService = new email_service_1.EmailService(transport, defaultFrom, errorStage);
        this.templateService = new template_service_1.TemplateService(templateOptions);
        this.attachmentService = new attachment_service_1.AttachmentService(attachmentOptions);
    }
    /**
     * Returns the process singleton. A later call with different settings fails
     * explicitly rather than silently continuing with the first configuration.
     */
    static initialize(config, templateOptions, attachmentOptions) {
        const fingerprint = this.fingerprint(config, templateOptions, attachmentOptions);
        if (!this.instance) {
            this.instance = new EmailFactory(new nodemailer_transport_1.NodemailerTransport(nodemailer_1.default.createTransport(config)), config.defaultFrom, templateOptions, attachmentOptions);
            this.singletonFingerprint = fingerprint;
        }
        else if (this.singletonFingerprint !== fingerprint) {
            throw new Error('EmailFactory is already initialized with a different configuration; use EmailFactory.create() for an independent instance.');
        }
        return this.instance;
    }
    /** Creates an independent factory instance without changing the singleton. */
    static create(config, templateOptions, attachmentOptions) {
        return new EmailFactory(new nodemailer_transport_1.NodemailerTransport(nodemailer_1.default.createTransport(config)), config.defaultFrom, templateOptions, attachmentOptions);
    }
    /** Creates an independent SendGrid Web API v3 client; no provider state is shared between instances. */
    static createSendGrid(config, templateOptions, attachmentOptions) {
        return new EmailFactory(new sendgrid_transport_1.SendGridTransport(config), config.defaultFrom, templateOptions, attachmentOptions, 'provider');
    }
    /** Creates an independent Mailgun Messages API client. */
    static createMailgun(config, templateOptions, attachmentOptions) {
        return new EmailFactory(new mailgun_transport_1.MailgunTransport(config), config.defaultFrom, templateOptions, attachmentOptions, 'provider');
    }
    /** Creates an Amazon SES v2 transport using the AWS SDK credential provider chain unless credentials are supplied. */
    static createSES(config, templateOptions, attachmentOptions) {
        if (!config.region.trim())
            throw new Error('Amazon SES region is required');
        let awsSes;
        try {
            awsSes = loadOptionalModule('@aws-sdk/client-sesv2');
        }
        catch (error) {
            throw new Error('Amazon SES support requires optional package @aws-sdk/client-sesv2. Install it with: npm install @aws-sdk/client-sesv2', { cause: error });
        }
        const sesClient = new awsSes.SESv2Client({
            region: config.region,
            ...(config.credentials ? { credentials: config.credentials } : {})
        });
        const transporter = nodemailer_1.default.createTransport({
            SES: { sesClient, SendEmailCommand: awsSes.SendEmailCommand }
        });
        return new EmailFactory(new nodemailer_transport_1.NodemailerTransport(transporter, () => sesClient.destroy?.()), config.defaultFrom, templateOptions, attachmentOptions, 'provider');
    }
    /** Creates an instance around a user-supplied transport adapter. */
    static createWithTransport(transport, defaultFrom, templateOptions, attachmentOptions) {
        return new EmailFactory(transport, defaultFrom, templateOptions, attachmentOptions, 'provider');
    }
    /** Creates an optional Redis-backed BullMQ producer/worker integration. */
    static createBullMQQueue(config) {
        return new bullmq_email_queue_1.BullMQEmailQueue(config);
    }
    static getInstance() {
        if (!this.instance) {
            throw new Error('EmailFactory not initialized. Call initialize() first.');
        }
        return this.instance;
    }
    async sendEmail(options) {
        return this.emailService.send(options);
    }
    getTemplateService() {
        return this.templateService;
    }
    getAttachmentService() {
        return this.attachmentService;
    }
    /** Verify connectivity when supported by the selected transport; API transports may not provide a safe check. */
    async verifyTransport() {
        return this.emailService.verify();
    }
    /** Release pooled SMTP connections and the template cache cleanup timer. */
    close() {
        this.emailService.close();
        this.templateService.dispose();
        if (EmailFactory.instance === this) {
            EmailFactory.instance = undefined;
            EmailFactory.singletonFingerprint = undefined;
        }
    }
    async previewTemplate(themeType, variant, config, data) {
        return this.templateService.previewTemplate(themeType, variant, config, data);
    }
    getThemeInfo(themeType) {
        return this.templateService.getThemeInfo(themeType);
    }
    listThemes() {
        return this.templateService.listThemes();
    }
    getTemplateStats() {
        return this.templateService.getTemplateStats();
    }
    /** Hashes canonicalized settings so credentials are never exposed in errors/logs. */
    static fingerprint(config, templateOptions, attachmentOptions) {
        const canonicalize = (value, ancestors = new Set()) => {
            if (value === undefined)
                return 'undefined';
            if (value === null || typeof value !== 'object') {
                if (typeof value === 'function')
                    return `function:${value.toString()}`;
                if (typeof value === 'bigint')
                    return `bigint:${value.toString()}`;
                return JSON.stringify(value) ?? String(value);
            }
            if (ancestors.has(value))
                return '[Circular]';
            ancestors.add(value);
            let result;
            if (Array.isArray(value)) {
                result = `[${value.map((item) => canonicalize(item, ancestors)).join(',')}]`;
            }
            else if (value instanceof Date) {
                result = `date:${value.toISOString()}`;
            }
            else {
                result = `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key], ancestors)}`).join(',')}}`;
            }
            ancestors.delete(value);
            return result;
        };
        const serialized = `${canonicalize(config)}|${canonicalize(templateOptions)}|${canonicalize(attachmentOptions)}`;
        return (0, crypto_1.createHash)('sha256').update(serialized).digest('hex');
    }
}
exports.EmailFactory = EmailFactory;
