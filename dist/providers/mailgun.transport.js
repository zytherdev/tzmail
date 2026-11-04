"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailgunTransport = void 0;
const provider_utils_1 = require("./provider-utils");
class MailgunTransport {
    config;
    apiUrl;
    fetchImpl;
    constructor(config, fetchImpl = fetch) {
        this.config = config;
        (0, provider_utils_1.validateApiConfig)(config);
        if (!config.domain.trim() || /[\u0000-\u001f\u007f]/.test(config.domain)) {
            throw new Error('Mailgun domain is required and must not contain control characters');
        }
        const defaultApiUrl = config.region === 'eu' ? 'https://api.eu.mailgun.net' : 'https://api.mailgun.net';
        this.apiUrl = (config.apiUrl ?? defaultApiUrl).replace(/\/+$/, '');
        const parsedUrl = new URL(this.apiUrl);
        if (parsedUrl.protocol !== 'https:' && parsedUrl.hostname !== 'localhost' && parsedUrl.hostname !== '127.0.0.1') {
            throw new Error('Mailgun apiUrl must use HTTPS');
        }
        this.fetchImpl = fetchImpl;
    }
    async sendMail(message) {
        const recipients = (0, provider_utils_1.splitAddresses)(message.to);
        if (recipients.length === 0)
            throw new Error('Mailgun requires at least one recipient');
        const from = message.from ?? this.config.defaultFrom;
        const body = new FormData();
        body.set('from', from);
        for (const recipient of recipients)
            body.append('to', recipient);
        for (const recipient of (0, provider_utils_1.splitAddresses)(message.cc))
            body.append('cc', recipient);
        for (const recipient of (0, provider_utils_1.splitAddresses)(message.bcc))
            body.append('bcc', recipient);
        body.set('subject', message.subject);
        if (message.text !== undefined)
            body.set('text', message.text);
        if (message.text === undefined && message.html === undefined) {
            throw new Error('Mailgun requires a text or HTML body');
        }
        let html = message.html;
        for (const attachment of message.attachments ?? []) {
            const data = await (0, provider_utils_1.attachmentToBuffer)(attachment, this.config.maxAttachmentBytes);
            const file = new Blob([new Uint8Array(data)], { type: attachment.contentType ?? 'application/octet-stream' });
            body.append(attachment.cid ? 'inline' : 'attachment', file, attachment.filename);
            if (attachment.cid && html !== undefined) {
                html = html.split(`cid:${attachment.cid}`).join(`cid:${attachment.filename}`);
            }
        }
        if (html !== undefined)
            body.set('html', html);
        const url = `${this.apiUrl}/v3/${encodeURIComponent(this.config.domain)}/messages`;
        const response = await this.fetchImpl(url, {
            method: 'POST',
            headers: {
                authorization: `Basic ${Buffer.from(`api:${this.config.apiKey}`).toString('base64')}`
            },
            body,
            redirect: 'error',
            signal: AbortSignal.timeout(this.config.requestTimeoutMs ?? 30_000)
        });
        const responseBody = await response.text();
        if (response.status !== 200) {
            const error = new Error(`Mailgun API returned HTTP ${response.status}${responseBody ? `: ${responseBody}` : ''}`);
            Object.assign(error, { statusCode: response.status, responseBody });
            throw error;
        }
        let result;
        try {
            result = responseBody ? JSON.parse(responseBody) : {};
        }
        catch {
            throw new Error('Mailgun API returned an invalid JSON response');
        }
        const accepted = [...recipients, ...(0, provider_utils_1.splitAddresses)(message.cc), ...(0, provider_utils_1.splitAddresses)(message.bcc)];
        return {
            ...(result.id ? { messageId: result.id } : {}),
            response: result.message ?? '200 Accepted',
            accepted,
            rejected: []
        };
    }
}
exports.MailgunTransport = MailgunTransport;
