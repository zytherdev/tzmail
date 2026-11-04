# tzmail

`@zyther/tzmail` is a TypeScript/Node.js library for generating templates and sending messages via SMTP, SendGrid, Amazon SES, or Mailgun. It includes ready-made themes, basic validation, bounded caching, attachments, and independent provider factories.

> **Scope:** tzmail is a templates, transports, and sending queue layer, not a complete campaign platform. For high volume, use a durable queue, define idempotency and retries, and coordinate limits with the provider. SMTP or an API accepting the message does not guarantee inbox delivery.

## Requirements and installation

- Node.js 20 or later.
- `nodemailer` 6.9, 7, or 8, installed as a peer dependency.
- To use Amazon SES, also install the optional peer `@aws-sdk/client-sesv2`; SendGrid and Mailgun use Node's native `fetch` and do not need the vendor SDKs.
- To use the asynchronous queue, install the optional peer `bullmq` and provide a compatible Redis instance.

```bash
npm install @zyther/tzmail nodemailer
# Optional, only if using the queue:
npm install bullmq
```

## Quick start

Use environment variables or a secret manager for credentials; do not store SMTP passwords in source code.

```typescript
import {
  EmailFactory,
  ThemeType,
  type IEmailConfig,
  type ITemplateConfig
} from '@zyther/tzmail';

const smtp: IEmailConfig = {
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false, // Implicit TLS usually uses 465; 587 usually negotiates STARTTLS
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASSWORD!
  },
  defaultFrom: 'Acme <noreply@example.com>'
};

// create() is suitable for services/tenants with isolated configurations.
const mailer = EmailFactory.create(smtp);
const templateConfig: ITemplateConfig = {
  header: { show: true, logo: { type: 'text', text: 'Acme' } },
  body: {
    title: 'Welcome!',
    message: 'Your account is ready.',
    buttonText: 'Open account',
    buttonUrl: 'https://example.com/account'
  },
  footer: { show: true, unsubscribeText: 'Unsubscribe' }
};

const template = mailer.getTemplateService().createTemplate(
  ThemeType.MODERN,
  'light',
  templateConfig
);

const result = await mailer.sendEmail({
  to: 'pessoa@example.com',
  subject: 'Your account is ready',
  template
});

if (result.status !== 'success') {
  // Log operational metadata according to the application's policy.
  // Avoid sending message bodies, credentials, or personal data to logs.
  console.error('Email send failed', result.status, result.errorStage);
}

// During graceful process/worker shutdown:
mailer.close();
```

## SMTP and throughput

`IEmailConfig` exposes the main SMTP and Nodemailer pool options. `pool`, `maxConnections`, `maxMessages`, `rateDelta`, and `rateLimit` control the pool and sending rate **for a single instance/process**:

```typescript
const smtp: IEmailConfig = {
  host: process.env.SMTP_HOST!,
  port: 587,
  secure: false,
  auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASSWORD! },
  defaultFrom: 'Acme <noreply@example.com>',
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1_000,
  rateLimit: 50,
  connectionTimeout: 30_000,
  greetingTimeout: 30_000,
  socketTimeout: 60_000
};

const mailer = EmailFactory.create(smtp);
await mailer.verifyTransport(); // validates the connection/credentials; does not send email
```

`auth` supports `login` credentials (username/password), `oauth2` credentials (for example, `user`, `clientId`, `clientSecret`, `refreshToken`, or `accessToken`), and Nodemailer's `custom` mechanism. Store tokens, callbacks, and secrets in a secret manager; the password example above is not required for OAuth2.

Choose limits according to your SMTP provider. Adding replicas multiplies connections and local limits; apply distributed control/a queue and quotas in the system that coordinates the workers.

`EmailFactory.create(config, templateOptions?, attachmentOptions?)` creates an isolated instance. `EmailFactory.initialize(...)`/`getInstance()` remain available for a process-wide singleton; a second initialization with different settings throws an error instead of silently reusing the first SMTP configuration. Close each created instance with `close()` during shutdown.

## Asynchronous queue with BullMQ

BullMQ is an optional peer. Install it and configure Redis before creating the queue. Producer processes only need to add jobs; run `startWorker()` in dedicated workers and use the same `queueName`, `prefix`, and Redis connection. Workers can be scaled horizontally. `concurrency` controls simultaneous jobs per worker, while `limiter` applies a shared per-queue rate across BullMQ workers.

```typescript
import { EmailFactory, type IEmailConfig } from '@zyther/tzmail';

const queue = EmailFactory.createBullMQQueue({
  connection: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === 'true' ? {} : undefined
  },
  queueName: 'transactional-email',
  concurrency: 10,
  limiter: { max: 100, duration: 1_000 },
  // BullMQ data points per minute: 14 days = 14 * 24 * 60 points.
  workerMetrics: { maxDataPoints: 20_160 },
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 1_000, jitter: 0.2 }
  }
});

// Producer/API process:
const job = await queue.enqueueEmail({
  to: 'ana@example.com',
  subject: 'Receipt',
  text: 'Payment confirmed.'
}, { idempotencyKey: 'receipt-order-123' });
console.log('Job ID:', job.id);

// Or enqueue a batch, sent to Redis via addBulk:
await queue.enqueueBulk([
  { email: { to: 'a@example.com', subject: 'Hello', text: 'A' }, job: { idempotencyKey: 'batch-a' } },
  { email: { to: 'b@example.com', subject: 'Hello', text: 'B' }, job: { idempotencyKey: 'batch-b' } }
]);
```

Expose `exportPrometheusMetrics()` on an internal `/metrics` endpoint; it returns the text format expected by Prometheus and can accept low-cardinality global labels:

```typescript
import { createServer } from 'node:http';

const metricsServer = createServer(async (req, res) => {
  if (req.method !== 'GET' || req.url !== '/metrics') {
    res.writeHead(404).end();
    return;
  }
  try {
    const body = await queue.exportPrometheusMetrics({
      env: process.env.NODE_ENV ?? 'production',
      service: 'tzmail'
    });
    res.writeHead(200, {
      'content-type': 'text/plain; version=0.0.4; charset=utf-8',
      'content-length': String(Buffer.byteLength(body))
    });
    res.end(body);
  } catch {
    res.writeHead(500).end('Metrics unavailable');
  }
});
metricsServer.listen(9464, '0.0.0.0');
```

Configure Prometheus to scrape `mail-metrics:9464` every 15 seconds. A dedicated exporter per queue avoids duplicate count series when multiple replicas query the same Redis instance. In Grafana, create dashboards for waiting, active, and failed jobs, and alerts for growing backlogs/failures. Do not use email addresses, job IDs, or other unbounded values as labels.

In a worker process, create the transport as usual and start the consumer with the same queue configuration:

```typescript
const mailer = EmailFactory.createSendGrid({
  apiKey: process.env.SENDGRID_API_KEY!,
  defaultFrom: 'Acme <noreply@example.com>'
});
queue.startWorker(mailer, { concurrency: 20 }); // inherits workerMetrics from the configuration

// Global events from all workers; use them for real-time logging/alerts.
const events = queue.createQueueEvents();
events.on('completed', ({ jobId }) => logger.info({ jobId }, 'email job completed'));
events.on('failed', ({ jobId, failedReason }) => logger.error({ jobId, failedReason }, 'email job failed'));

// During graceful shutdown, wait for active jobs before closing the transport:
await queue.close();
mailer.close();
```

`enqueueEmail()` accepts `idempotencyKey` to deduplicate jobs while the previous job is still retained in the queue; the key is transformed into a Redis ID without exposing the original value. Jobs removed after completion/failure are no longer deduplicated. `enqueueBulk()` accepts up to 1,000 messages by default; a partial failure during bulk insertion may leave some jobs enqueued, so use idempotency keys and check the queue before retrying the batch. `getJobCounts()` returns counts of waiting, active, completed, failed, delayed, and paused jobs. `getMetrics('completed' | 'failed')` reads throughput series in one-minute intervals stored in Redis; all workers in the queue must use the same `workerMetrics.maxDataPoints`.

The default options are 5 attempts, exponential backoff with jitter, retention of completed jobs for up to 24 hours/10,000 items, and failed jobs for up to 7 days/50,000 items. These can be changed in `defaultJobOptions` or per job. BullMQ retries worker failures; a transport failure after remote acceptance but before the response can therefore duplicate a send. Job idempotency prevents duplicate enqueueing while a job is retained, but does not provide exactly-once delivery by the provider. Validation/rendering errors and partial deliveries are marked as unrecoverable. Partial deliveries are not retried automatically, to avoid resending to recipients who have already been accepted; review these failed jobs and handle rejected recipients through a dedicated flow.

The template is rendered before entering the queue, to avoid serializing closures/functions. `Buffer` content is converted to Base64 and stored in Redis. Attachment `path` remains a local path that must be accessible to all workers. The default maximum serialized size is 10 MiB per job (`maxPayloadBytes`); increase it cautiously, since large attachments consume Redis and memory. The payload contains email addresses and content: protect Redis with TLS, authentication, network controls, and appropriate retention. `close()` waits for active workers and closes the queue; call it during graceful shutdown.

See also the official BullMQ documentation on [retries and backoff](https://docs.bullmq.io/guide/retrying-failing-jobs), [job IDs](https://docs.bullmq.io/guide/jobs/job-ids), [bulk insertion](https://docs.bullmq.io/guide/queues/adding-bulks), [rate limiting](https://docs.bullmq.io/guide/rate-limiting), and [graceful worker shutdown](https://docs.bullmq.io/guide/workers/graceful-shutdown).

## Email providers

Provider factories create independent instances, so you can, for example, maintain a transactional sender through SES and a marketing sender through SendGrid in the same process. There is no shared singleton state across keys or tenants.

### SendGrid Web API

The adapter uses the official v3 API via `fetch` (it does not require `@sendgrid/mail`). The sender must be verified in SendGrid. API attachments are Base64-encoded and held in memory during the call; configure `maxAttachmentBytes` to limit the size of each file.

```typescript
const sendgrid = EmailFactory.createSendGrid({
  apiKey: process.env.SENDGRID_API_KEY!,
  defaultFrom: 'Acme <noreply@example.com>',
  requestTimeoutMs: 30_000,
  maxAttachmentBytes: 10 * 1024 * 1024
});

const result = await sendgrid.sendEmail({
  to: ['ana@example.com', 'bruno@example.com'],
  subject: 'Account update',
  text: 'Your account has been updated.'
});
sendgrid.close();
```

Use `apiUrl` if the account is configured for a regional endpoint. The default is `https://api.sendgrid.com`. References: [Mail Send API](https://www.twilio.com/docs/sendgrid/api-reference/mail-send/mail-send) and [attachments in the official SDK](https://github.com/sendgrid/sendgrid-nodejs/blob/main/docs/use-cases/attachments.md).

### Mailgun Messages API

The adapter uses the Messages API via `fetch` and multipart/form-data; it does not require `mailgun.js`. Set the sending domain and account region. `apiUrl` should only be customized for a custom or controlled endpoint.

```typescript
const mailgun = EmailFactory.createMailgun({
  apiKey: process.env.MAILGUN_API_KEY!,
  domain: process.env.MAILGUN_DOMAIN!,
  region: 'eu', // omit or use 'us' for the US API
  defaultFrom: 'Acme <noreply@example.com>',
  requestTimeoutMs: 30_000,
  maxAttachmentBytes: 10 * 1024 * 1024
});

await mailgun.sendEmail({
  to: 'ana@example.com',
  subject: 'Hello',
  html: '<p>Message sent via Mailgun.</p>'
});
mailgun.close();
```

The adapter uses `https://api.mailgun.net` in the US and `https://api.eu.mailgun.net` for `region: 'eu'`. Attachments are prepared in memory before the POST; set an appropriate limit. For inline images, Mailgun derives the Content-ID from the file name; when `cid` is provided, the adapter converts `cid:<value>` references in the HTML to `cid:<filename>`. See the [official Messages API](https://documentation.mailgun.com/docs/mailgun/api-reference/send/mailgun/messages).

### Amazon SES v2

Install the official SDK only if you are going to use SES:

```bash
npm install @aws-sdk/client-sesv2
```

```typescript
const ses = EmailFactory.createSES({
  region: process.env.AWS_REGION ?? 'us-east-1',
  defaultFrom: 'Acme <noreply@example.com>'
  // Without explicit credentials, the AWS SDK uses the default credential chain,
  // such as an IAM role, environment variables, or local credentials.
});

await ses.sendEmail({
  to: 'ana@example.com',
  subject: 'Receipt',
  text: 'Payment confirmed.'
});
ses.close();
```

The adapter uses Nodemailer's SESv2 transport. The sender identity must be verified and the role/credential must have the `ses:SendEmail` permission. The SES transport does not enforce rate limits on its own; use the BullMQ queue or your own coordination to respect the account quota. Nodemailer documents that the SES transport builds the full message in memory, including attachments. See [SES transport](https://nodemailer.com/transports/ses) and [AWS SDK credentials](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/ses-examples-sending-email.html).

### Custom transports and verification

`EmailFactory.createWithTransport(transport, defaultFrom?, templateOptions?, attachmentOptions?)` lets you connect a custom adapter that implements `IEmailTransport`. `verifyTransport()` works when the transport offers a non-destructive check; SendGrid and Mailgun do not send test requests because the sending API does not provide a safe health check with minimal permissions. For these providers, validate the key and permissions in the deployment environment and monitor actual send responses.

All factories accept the same optional template and attachment options. The default `requestTimeoutMs` for the SendGrid and Mailgun APIs is 30 seconds. `maxAttachmentBytes` is optional and limits each individual attachment; SendGrid/Mailgun files and SES messages may be buffered in memory. For large files, use conservative limits and SMTP transport when appropriate.

## Templates and themes

Available themes: `ThemeType.MODERN`, `CORPORATE`, `MINIMAL`, `MONOKAI`, and `SYSTEM`, each with a `light` or `dark` variant.

```typescript
const service = mailer.getTemplateService();

const html = await service.previewTemplate(
  ThemeType.CORPORATE,
  'light',
  {
    header: { show: true, logo: { type: 'text', text: 'Acme' } },
    body: { title: 'Hello, Ana', message: 'See what is new.' },
    footer: {
      show: true,
      links: [{ text: 'Privacy', url: 'https://example.com/privacy' }],
      unsubscribeText: 'Unsubscribe',
      unsubscribeUrl: 'https://example.com/unsubscribe?token=...'
    }
  },
  {}
);
```

`ITemplateServiceOptions` options include:

| Option | Default | Description |
| --- | ---: | --- |
| `cache` | `true` | In-memory cache by configuration. Can be disabled per call with `{ cache: false }`. |
| `cacheTTL` | `3600` | TTL in seconds; `0` disables storage. |
| `maxCacheEntries` | `100` | Positive limit on cached entries; approximate LRU eviction. |
| `maxHistoryEntries` | `100` | Limit on IDs in the history. |
| `maxVersionsPerTemplate` | `10` | Versions retained per template. |
| `validateConfig` | `true` | Validates template options before rendering. |

```typescript
import { TemplateService } from '@zyther/tzmail';

const service = new TemplateService({
  cache: true,
  cacheTTL: 900,
  maxCacheEntries: 500,
  maxHistoryEntries: 200
});
```

The cache and history are local to the process, not distributed. Call `service.dispose()` when you create `TemplateService` directly and no longer need it. `EmailFactory.close()` stops the associated service timer.
`getTemplateStats()` returns `totalTemplates`, `cachedTemplates`, `totalHits`, `cacheRequests`, `cacheHitRate`, and counts by theme; requests that bypass/disable the cache are not included in the hit rate.

### HTML and URL policy

- `title`, `message`, logo name, button/link/footer text, and textual metadata are escaped by the renderer.
- `body.content` is the only configuration field treated as **trusted HTML** to allow custom markup. Do not pass user-provided HTML without sanitizing it with a policy appropriate to the application.
- `TemplateBuilder.buildBody()` is a low-level API and also expects trusted HTML; prefer `TemplateService` for validation and interpolation.
- `IEmailOptions.html` is also passed through as HTML supplied by the caller; treat it as trusted content or sanitize it before sending.
- Action and link URLs accept absolute `https:`, `http:`, or `mailto:` URLs; images/logos and social links accept `https:`/`http:`. Schemes such as `javascript:` and `data:` and attributes containing injection characters are rejected.
- Colors and some style values are validated. The library's validation does not replace business validation or sanitization of custom HTML.

For per-recipient customization, use `{{placeholder}}` in template text and pass `templateData` in the message. Nested keys are supported (`{{user.firstName}}`); leaf values must be primitives (`string`, `number`, `boolean`, or `null`), and a placeholder without a value causes rendering to fail instead of sending incomplete text. Values inserted into text are escaped; insertions into `body.content` are escaped before being added to the trusted HTML; URLs are validated after interpolation.

```typescript
await mailer.sendEmail({
  to: 'ana@example.com',
  subject: 'Welcome',
  template,
  templateData: {
    user: { firstName: 'Ana' },
    accountId: 'acct-123',
    actionUrl: 'https://example.com/account/acct-123'
  }
});
```

For example, use `title: 'Hello, {{user.firstName}}'` and `buttonUrl: '{{actionUrl}}'` in the template configuration. The dynamic URL must still comply with the allowed schemes.

## Attachments

Attachments specified by path remain as paths so Nodemailer can stream them without loading entire large files into memory. In production, prefer restricting the allowed root and enforcing a size limit:

```typescript
const mailer = EmailFactory.create(
  smtp,
  { cache: true, cacheTTL: 900 },
  { allowedRoot: '/srv/app/mail-attachments', maxSizeBytes: 10 * 1024 * 1024 }
);

const attachment = await mailer.getAttachmentService().addFromPath(
  '/srv/app/mail-attachments/report.pdf'
);
await mailer.sendEmail({
  to: 'finance@example.com',
  subject: 'Report',
  text: 'Please find the report attached.',
  attachments: [attachment]
});
```

`allowedRoot` resolves real paths and rejects paths outside the root, including symlink escapes at validation time. Keep the root and its directories unwritable by untrusted users to reduce the risk of the file being swapped between validation and reading. If it is not set, the application is responsible for ensuring that paths are trusted. `maxSizeBytes` is optional; buffer attachments are also checked. `addFromUrl()` does not download URLs and remains unimplemented.

## Results and error handling

`sendEmail()` always returns an `IEmailSendResult`; validation, rendering, and transport are identified by `errorStage`:

```typescript
type IEmailSendResult = {
  success: boolean;
  status: 'success' | 'partial' | 'failure';
  messageId?: string;
  response?: string;
  accepted?: Array<string | { address: string; name: string }>;
  rejected?: Array<string | { address: string; name: string }>;
  error?: unknown;
  errorStage?: 'validation' | 'render' | 'smtp' | 'provider';
};
```

`success` is `true` only when the transport reports no rejected recipients. `partial` means partial acceptance and rejection; route these cases to explicit handling/retry in the application. An API or server accepting the message does not prove final delivery, that it was read, or that it avoided spam.

## Development and validation

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm pack --dry-run
```

Tests use the native `node:test` runner and fake transports; they do not send real emails. The GitHub Actions pipeline runs lint, typecheck, build/tests, and package inspection on pushes, pull requests, and before publishing an npm release.

## Production considerations

1. Use `BullMQEmailQueue` or another durable queue/outbox with workers, idempotency, and retries with backoff; do not automatically retry sends without a duplicate-prevention strategy.
2. Configure SPF, DKIM, DMARC, sending domain/reputation, quotas, and bounce/unsubscribe handling with the provider and in the application.
3. Keep secrets out of the repository and rotate them; do not log message content or link tokens.
4. Size `maxConnections`/`rateLimit` according to the provider and the number of replicas. Nodemailer pool limits are local; the BullMQ limiter is shared by the queue.
5. Monitor `status`, `errorStage`, `accepted`/`rejected`, latency, and queues with redacted logs and custom metrics.

## License

ISC. See `LICENSE`/repository metadata for the applicable terms.
