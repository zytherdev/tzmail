"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullMQEmailQueue = void 0;
const crypto_1 = require("crypto");
const module_1 = require("module");
const loadOptionalModule = (0, module_1.createRequire)(__filename);
function loadBullMQRuntime() {
    try {
        return loadOptionalModule('bullmq');
    }
    catch (error) {
        throw new Error('BullMQ support requires the optional package bullmq. Install it with: npm install bullmq', { cause: error });
    }
}
function assertPositiveInteger(name, value) {
    if (value !== undefined && (!Number.isSafeInteger(value) || value <= 0)) {
        throw new Error(`${name} must be a positive safe integer`);
    }
}
function assertJobOptions(options) {
    assertPositiveInteger('attempts', options.attempts);
    if (options.delay !== undefined && (!Number.isSafeInteger(options.delay) || options.delay < 0)) {
        throw new Error('delay must be a non-negative safe integer');
    }
    if (options.priority !== undefined && (!Number.isSafeInteger(options.priority) || options.priority < 0)) {
        throw new Error('priority must be a non-negative safe integer');
    }
    if (options.backoff) {
        assertPositiveInteger('backoff.delay', options.backoff.delay);
        if (options.backoff.jitter !== undefined && (options.backoff.jitter < 0 || options.backoff.jitter > 1)) {
            throw new Error('backoff.jitter must be between 0 and 1');
        }
    }
    if (options.idempotencyKey !== undefined && !options.idempotencyKey.trim()) {
        throw new Error('idempotencyKey must not be empty');
    }
}
function jobOptions(options) {
    const { idempotencyKey, ...bullOptions } = options;
    return {
        ...bullOptions,
        ...(idempotencyKey ? { jobId: `email-${(0, crypto_1.createHash)('sha256').update(idempotencyKey).digest('hex')}` } : {})
    };
}
function serializeAttachment(attachment) {
    const { content, ...metadata } = attachment;
    if (content === undefined)
        return metadata;
    const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
    return { ...metadata, contentBase64: buffer.toString('base64') };
}
function deserializeEmail(data) {
    if (data?.version !== 1 || !data.email || typeof data.email !== 'object') {
        throw new Error('Unsupported or malformed tzmail queue job payload');
    }
    const { attachments, ...message } = data.email;
    return {
        ...message,
        ...(attachments ? {
            attachments: attachments.map(({ contentBase64, ...attachment }) => ({
                ...attachment,
                ...(contentBase64 !== undefined ? { content: Buffer.from(contentBase64, 'base64') } : {})
            }))
        } : {})
    };
}
/**
 * Redis-backed asynchronous email delivery using BullMQ. This class may be
 * instantiated in producer and worker processes with the same queue settings.
 */
class BullMQEmailQueue {
    config;
    queueName;
    runtime;
    queue;
    workers = new Set();
    queueEvents = new Set();
    maxPayloadBytes;
    maxBulkSize;
    closed = false;
    constructor(config, runtime) {
        this.config = config;
        if (!config.connection || typeof config.connection !== 'object') {
            throw new Error('BullMQ Redis connection options are required');
        }
        this.queueName = config.queueName ?? 'tzmail-email';
        if (!/^[A-Za-z0-9_-]{1,128}$/.test(this.queueName)) {
            throw new Error('queueName must contain only letters, numbers, underscores or hyphens, with a maximum length of 128');
        }
        assertPositiveInteger('concurrency', config.concurrency);
        assertPositiveInteger('maxPayloadBytes', config.maxPayloadBytes);
        assertPositiveInteger('maxBulkSize', config.maxBulkSize);
        assertPositiveInteger('defaultJobOptions.attempts', config.defaultJobOptions?.attempts);
        assertPositiveInteger('workerMetrics.maxDataPoints', config.workerMetrics?.maxDataPoints);
        if (config.defaultJobOptions?.backoff)
            assertJobOptions({ backoff: config.defaultJobOptions.backoff });
        if (config.limiter) {
            assertPositiveInteger('limiter.max', config.limiter.max);
            assertPositiveInteger('limiter.duration', config.limiter.duration);
        }
        this.maxPayloadBytes = config.maxPayloadBytes ?? 10 * 1024 * 1024;
        this.maxBulkSize = config.maxBulkSize ?? 1_000;
        this.runtime = runtime ?? loadBullMQRuntime();
        this.queue = new this.runtime.Queue(this.queueName, {
            connection: config.connection,
            ...(config.prefix ? { prefix: config.prefix } : {}),
            defaultJobOptions: {
                attempts: 5,
                backoff: { type: 'exponential', delay: 1_000, jitter: 0.2 },
                removeOnComplete: { age: 86_400, count: 10_000 },
                removeOnFail: { age: 604_800, count: 50_000 },
                ...config.defaultJobOptions
            }
        });
    }
    /** Add one email job. Template rendering happens before enqueue so jobs stay serializable. */
    async enqueueEmail(options, job = {}) {
        this.assertOpen();
        assertJobOptions(job);
        const data = await this.serializeEmail(options);
        return this.queue.add('send-email', data, jobOptions(job));
    }
    /** Add a bounded batch with one Redis bulk operation. BullMQ/Redis bulk calls can partially add jobs on failure. */
    async enqueueBulk(items) {
        this.assertOpen();
        if (!Array.isArray(items))
            throw new Error('items must be an array');
        if (items.length === 0)
            return [];
        if (items.length > this.maxBulkSize) {
            throw new Error(`Bulk exceeds configured maxBulkSize (${this.maxBulkSize})`);
        }
        if (items.some((item) => !item || !item.email)) {
            throw new Error('Each bulk item requires an email message');
        }
        const keys = items.map((item) => item.job?.idempotencyKey).filter((key) => key !== undefined);
        if (new Set(keys).size !== keys.length) {
            throw new Error('idempotencyKey values must be unique within one bulk request');
        }
        const jobs = await Promise.all(items.map(async (item) => {
            const options = item.job ?? {};
            assertJobOptions(options);
            return {
                name: 'send-email',
                data: await this.serializeEmail(item.email),
                opts: jobOptions(options)
            };
        }));
        return this.queue.addBulk(jobs);
    }
    /** Start a BullMQ Worker. Run this in dedicated worker processes for horizontal scaling. */
    startWorker(sender, options = {}) {
        this.assertOpen();
        const concurrency = options.concurrency ?? this.config.concurrency ?? 5;
        assertPositiveInteger('concurrency', concurrency);
        const limiter = options.limiter ?? this.config.limiter;
        const metrics = options.metrics ?? this.config.workerMetrics;
        if (limiter) {
            assertPositiveInteger('limiter.max', limiter.max);
            assertPositiveInteger('limiter.duration', limiter.duration);
        }
        assertPositiveInteger('metrics.maxDataPoints', metrics?.maxDataPoints);
        const worker = new this.runtime.Worker(this.queueName, async (job) => {
            let email;
            try {
                email = deserializeEmail(job.data);
            }
            catch (error) {
                throw new this.runtime.UnrecoverableError(error instanceof Error ? error.message : 'Malformed email job payload');
            }
            const result = await sender.sendEmail(email);
            if (result.status === 'success')
                return result;
            if (result.status === 'partial') {
                throw new this.runtime.UnrecoverableError('Email was accepted for only some recipients; automatic retry is disabled to avoid duplicate delivery.');
            }
            if (result.errorStage === 'validation' || result.errorStage === 'render') {
                throw new this.runtime.UnrecoverableError(`Email job failed at ${result.errorStage} stage.`);
            }
            if (result.error instanceof Error)
                throw result.error;
            throw new Error(`Email job failed at ${result.errorStage ?? 'unknown'} stage.`);
        }, {
            connection: this.config.connection,
            ...(this.config.prefix ? { prefix: this.config.prefix } : {}),
            concurrency,
            ...(limiter ? { limiter } : {}),
            ...(metrics ? { metrics } : {})
        });
        this.workers.add(worker);
        return worker;
    }
    pause() {
        this.assertOpen();
        return this.queue.pause();
    }
    resume() {
        this.assertOpen();
        return this.queue.resume();
    }
    getJobCounts() {
        this.assertOpen();
        return this.queue.getJobCounts('wait', 'active', 'completed', 'failed', 'delayed', 'paused');
    }
    /** Export queue counts in Prometheus text exposition format. */
    async exportPrometheusMetrics(globalVariables) {
        this.assertOpen();
        if (!this.queue.exportPrometheusMetrics) {
            throw new Error('The installed BullMQ version does not support exportPrometheusMetrics().');
        }
        return this.queue.exportPrometheusMetrics(globalVariables);
    }
    /** Read BullMQ's per-minute completed/failed worker metrics from Redis. */
    async getMetrics(type, start = 0, end = -1) {
        this.assertOpen();
        if (!this.queue.getMetrics) {
            throw new Error('The installed BullMQ version does not support getMetrics().');
        }
        return this.queue.getMetrics(type, start, end);
    }
    /** Listen to lifecycle events across all workers using BullMQ QueueEvents. */
    createQueueEvents() {
        this.assertOpen();
        if (!this.runtime.QueueEvents) {
            throw new Error('The installed BullMQ runtime does not expose QueueEvents.');
        }
        const events = new this.runtime.QueueEvents(this.queueName, {
            connection: this.config.connection,
            ...(this.config.prefix ? { prefix: this.config.prefix } : {})
        });
        this.queueEvents.add(events);
        return events;
    }
    /** Gracefully wait for active workers and release the BullMQ queue connection. */
    async close() {
        if (this.closed)
            return;
        this.closed = true;
        const workerResults = await Promise.allSettled([
            ...[...this.workers].map((worker) => worker.close()),
            ...[...this.queueEvents].map((events) => events.close())
        ]);
        this.workers.clear();
        this.queueEvents.clear();
        const errors = workerResults.flatMap((result) => result.status === 'rejected' ? [result.reason] : []);
        try {
            await this.queue.close();
        }
        catch (error) {
            errors.push(error);
        }
        if (errors.length > 0) {
            throw new AggregateError(errors, 'One or more BullMQ resources failed to close cleanly.');
        }
    }
    async serializeEmail(options) {
        if (!options || typeof options !== 'object')
            throw new Error('Email options are required');
        const template = options.template;
        const attachments = options.attachments;
        const message = { ...options };
        delete message.template;
        delete message.templateData;
        delete message.attachments;
        let html = message.html;
        if (html === undefined && template) {
            html = await template.render(options);
        }
        const serializedAttachments = attachments?.map(serializeAttachment);
        const email = {
            ...message,
            ...(html !== undefined ? { html } : {}),
            ...(serializedAttachments ? { attachments: serializedAttachments } : {})
        };
        let payload;
        try {
            payload = JSON.stringify({ version: 1, email });
        }
        catch (error) {
            throw new Error('Email job payload must be JSON serializable; template functions are rendered before enqueue.', { cause: error });
        }
        if (Buffer.byteLength(payload, 'utf8') > this.maxPayloadBytes) {
            throw new Error(`Email job payload exceeds configured maxPayloadBytes (${this.maxPayloadBytes})`);
        }
        return JSON.parse(payload);
    }
    assertOpen() {
        if (this.closed)
            throw new Error('BullMQEmailQueue is closed. Create a new instance to resume queue operations.');
    }
}
exports.BullMQEmailQueue = BullMQEmailQueue;
