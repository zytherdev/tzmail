import { IAttachment, IEmailOptions, IEmailSendResult } from '../core/interfaces/email.interface';
export interface IBullMQBackoffOptions {
    type: 'fixed' | 'exponential';
    delay: number;
    jitter?: number;
}
export interface IEmailQueueJobOptions {
    /** Stable business key. It is hashed before being used as a Redis job ID. */
    idempotencyKey?: string;
    delay?: number;
    priority?: number;
    attempts?: number;
    backoff?: IBullMQBackoffOptions;
}
export interface IBullMQRateLimiterOptions {
    max: number;
    duration: number;
}
export interface IBullMQWorkerMetricsOptions {
    /** Number of one-minute data points retained in Redis for completed/failed jobs. */
    maxDataPoints: number;
}
export interface IBullMQEmailQueueConfig {
    /** Redis/ioredis connection options. Keep credentials in a secret manager. */
    connection: Record<string, unknown>;
    queueName?: string;
    prefix?: string;
    concurrency?: number;
    limiter?: IBullMQRateLimiterOptions;
    workerMetrics?: IBullMQWorkerMetricsOptions;
    maxPayloadBytes?: number;
    maxBulkSize?: number;
    defaultJobOptions?: {
        attempts?: number;
        backoff?: IBullMQBackoffOptions;
        removeOnComplete?: boolean | number | {
            age?: number;
            count?: number;
        };
        removeOnFail?: boolean | number | {
            age?: number;
            count?: number;
        };
    };
}
export interface IEmailQueueSender {
    sendEmail(options: IEmailOptions): Promise<IEmailSendResult>;
}
export interface IQueuedEmailJob {
    id?: string;
}
export type ISerializedEmailAttachment = Omit<IAttachment, 'content'> & {
    contentBase64?: string;
};
export interface IEmailQueueJobData {
    version: 1;
    email: Omit<IEmailOptions, 'template' | 'templateData' | 'attachments'> & {
        attachments?: ISerializedEmailAttachment[];
    };
}
export interface IBullMQJobLike {
    id?: string | number;
    name: string;
    data: IEmailQueueJobData;
}
export interface IBullMQQueueMetrics {
    data: number[];
    count: number;
    meta: {
        count: number;
        prevTS: number;
        prevCount: number;
    };
}
export interface IBullMQQueueEventPayload {
    jobId?: string;
    prev?: string;
    failedReason?: string;
    returnvalue?: unknown;
    data?: unknown;
    [key: string]: unknown;
}
export interface IBullMQQueueEventsLike {
    on(event: string, listener: (payload: IBullMQQueueEventPayload) => void): this;
    close(): Promise<void>;
}
interface IBullMQQueueLike {
    add(name: string, data: IEmailQueueJobData, options?: Record<string, unknown>): Promise<IQueuedEmailJob>;
    addBulk(jobs: Array<{
        name: string;
        data: IEmailQueueJobData;
        opts?: Record<string, unknown>;
    }>): Promise<IQueuedEmailJob[]>;
    close(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    getJobCounts(...types: string[]): Promise<Record<string, number>>;
    exportPrometheusMetrics?(globalVariables?: Record<string, string>): Promise<string>;
    getMetrics?(type: 'completed' | 'failed', start?: number, end?: number): Promise<IBullMQQueueMetrics>;
}
interface IBullMQWorkerLike {
    close(): Promise<void>;
}
export interface IBullMQRuntime {
    Queue: new (name: string, options: Record<string, unknown>) => IBullMQQueueLike;
    Worker: new (name: string, processor: (job: IBullMQJobLike) => Promise<IEmailSendResult>, options: Record<string, unknown>) => IBullMQWorkerLike;
    UnrecoverableError: new (message: string) => Error;
    QueueEvents?: new (name: string, options: Record<string, unknown>) => IBullMQQueueEventsLike;
}
/**
 * Redis-backed asynchronous email delivery using BullMQ. This class may be
 * instantiated in producer and worker processes with the same queue settings.
 */
export declare class BullMQEmailQueue {
    private readonly config;
    readonly queueName: string;
    private readonly runtime;
    private readonly queue;
    private readonly workers;
    private readonly queueEvents;
    private readonly maxPayloadBytes;
    private readonly maxBulkSize;
    private closed;
    constructor(config: IBullMQEmailQueueConfig, runtime?: IBullMQRuntime);
    /** Add one email job. Template rendering happens before enqueue so jobs stay serializable. */
    enqueueEmail(options: IEmailOptions, job?: IEmailQueueJobOptions): Promise<IQueuedEmailJob>;
    /** Add a bounded batch with one Redis bulk operation. BullMQ/Redis bulk calls can partially add jobs on failure. */
    enqueueBulk(items: Array<{
        email: IEmailOptions;
        job?: IEmailQueueJobOptions;
    }>): Promise<IQueuedEmailJob[]>;
    /** Start a BullMQ Worker. Run this in dedicated worker processes for horizontal scaling. */
    startWorker(sender: IEmailQueueSender, options?: {
        concurrency?: number;
        limiter?: IBullMQRateLimiterOptions;
        metrics?: IBullMQWorkerMetricsOptions;
    }): IBullMQWorkerLike;
    pause(): Promise<void>;
    resume(): Promise<void>;
    getJobCounts(): Promise<Record<string, number>>;
    /** Export queue counts in Prometheus text exposition format. */
    exportPrometheusMetrics(globalVariables?: Record<string, string>): Promise<string>;
    /** Read BullMQ's per-minute completed/failed worker metrics from Redis. */
    getMetrics(type: 'completed' | 'failed', start?: number, end?: number): Promise<IBullMQQueueMetrics>;
    /** Listen to lifecycle events across all workers using BullMQ QueueEvents. */
    createQueueEvents(): IBullMQQueueEventsLike;
    /** Gracefully wait for active workers and release the BullMQ queue connection. */
    close(): Promise<void>;
    private serializeEmail;
    private assertOpen;
}
export {};
//# sourceMappingURL=bullmq-email-queue.d.ts.map