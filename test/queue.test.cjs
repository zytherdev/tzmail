const test = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { BullMQEmailQueue } = require('../dist/queues/bullmq-email-queue.js');

class FakeQueue {
  static instances = [];

  constructor(name, options) {
    this.name = name;
    this.options = options;
    this.addCalls = [];
    this.bulkCalls = [];
    this.closeCalls = 0;
    this.pauseCalls = 0;
    this.resumeCalls = 0;
    this.metricsCalls = [];
    this.prometheusLabels = undefined;
    FakeQueue.instances.push(this);
  }

  async add(name, data, options) {
    this.addCalls.push({ name, data, options });
    return { id: options?.jobId ?? `generated-${this.addCalls.length}` };
  }

  async addBulk(jobs) {
    this.bulkCalls.push(jobs);
    return jobs.map((job, index) => ({ id: job.opts?.jobId ?? `bulk-${index}` }));
  }

  async close() { this.closeCalls += 1; }
  async pause() { this.pauseCalls += 1; }
  async resume() { this.resumeCalls += 1; }
  async getJobCounts(...types) { return Object.fromEntries(types.map((type) => [type, type === 'wait' ? 2 : 0])); }
  async exportPrometheusMetrics(labels) {
    this.prometheusLabels = labels;
    return '# HELP bullmq_job_count Number of jobs by state\n';
  }
  async getMetrics(type, start, end) {
    this.metricsCalls.push({ type, start, end });
    return { data: [2, 3], count: 5, meta: { count: 5, prevTS: 0, prevCount: 0 } };
  }
}

class FakeWorker {
  static instances = [];

  constructor(name, processor, options) {
    this.name = name;
    this.processor = processor;
    this.options = options;
    this.closeCalls = 0;
    FakeWorker.instances.push(this);
  }

  async close() { this.closeCalls += 1; }
}

class FakeQueueEvents {
  static instances = [];

  constructor(name, options) {
    this.name = name;
    this.options = options;
    this.listeners = new Map();
    this.closeCalls = 0;
    FakeQueueEvents.instances.push(this);
  }

  on(event, listener) {
    this.listeners.set(event, listener);
    return this;
  }

  emit(event, payload) { this.listeners.get(event)?.(payload); }
  async close() { this.closeCalls += 1; }
}

class FakeUnrecoverableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnrecoverableError';
  }
}

const runtime = {
  Queue: FakeQueue,
  Worker: FakeWorker,
  UnrecoverableError: FakeUnrecoverableError,
  QueueEvents: FakeQueueEvents
};

function createQueue(overrides = {}) {
  FakeQueue.instances = [];
  FakeWorker.instances = [];
  FakeQueueEvents.instances = [];
  return new BullMQEmailQueue({
    connection: { host: 'redis.test', port: 6379 },
    ...overrides
  }, runtime);
}

function emailJobData(email) {
  return { version: 1, email };
}

test('BullMQ queue sets retry and retention defaults and serializes rendered templates and buffers', async () => {
  const queue = createQueue({ queueName: 'mail-queue', maxPayloadBytes: 20_000 });
  const underlying = FakeQueue.instances[0];
  assert.equal(underlying.name, 'mail-queue');
  assert.deepEqual(underlying.options.defaultJobOptions, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 1_000, jitter: 0.2 },
    removeOnComplete: { age: 86_400, count: 10_000 },
    removeOnFail: { age: 604_800, count: 50_000 }
  });

  let renderedInput;
  const result = await queue.enqueueEmail({
    to: 'ana@example.com',
    subject: 'Hello',
    templateData: { firstName: 'Ana' },
    template: { render: async (data) => { renderedInput = data.templateData; return '<p>Olá Ana</p>'; } },
    attachments: [{ filename: 'report.txt', content: Buffer.from('report'), contentType: 'text/plain' }]
  }, {
    idempotencyKey: 'tenant-1:receipt-42',
    delay: 250,
    priority: 2
  });

  assert.deepEqual(renderedInput, { firstName: 'Ana' });
  const call = underlying.addCalls[0];
  assert.equal(call.name, 'send-email');
  assert.equal(call.data.version, 1);
  assert.equal(call.data.email.html, '<p>Olá Ana</p>');
  assert.equal(Object.hasOwn(call.data.email, 'template'), false);
  assert.equal(Object.hasOwn(call.data.email, 'templateData'), false);
  assert.equal(call.data.email.attachments[0].contentBase64, Buffer.from('report').toString('base64'));
  assert.equal(Object.hasOwn(call.data.email.attachments[0], 'content'), false);
  assert.deepEqual(call.options, {
    delay: 250,
    priority: 2,
    jobId: `email-${createHash('sha256').update('tenant-1:receipt-42').digest('hex')}`
  });
  assert.equal(result.id, call.options.jobId);
  assert.equal(call.options.jobId.includes('tenant-1'), false);
  await queue.close();
});

test('enqueueBulk uses one bulk call, preserves per-job options, and rejects duplicate idempotency keys', async () => {
  const queue = createQueue({ maxBulkSize: 2 });
  const underlying = FakeQueue.instances[0];
  const ids = await queue.enqueueBulk([
    { email: { to: 'a@example.com', subject: 'A', text: 'one' }, job: { idempotencyKey: 'a' } },
    { email: { to: 'b@example.com', subject: 'B', html: '<p>two</p>' }, job: { attempts: 3, backoff: { type: 'fixed', delay: 500 } } }
  ]);

  assert.equal(underlying.bulkCalls.length, 1);
  assert.equal(underlying.bulkCalls[0].length, 2);
  assert.equal(underlying.bulkCalls[0][0].opts.jobId.startsWith('email-'), true);
  assert.deepEqual(underlying.bulkCalls[0][1].opts, { attempts: 3, backoff: { type: 'fixed', delay: 500 } });
  assert.deepEqual(ids.map((job) => job.id), [underlying.bulkCalls[0][0].opts.jobId, 'bulk-1']);

  await assert.rejects(queue.enqueueBulk([
    { email: { to: 'a@example.com', subject: 'A', text: 'one' }, job: { idempotencyKey: 'same' } },
    { email: { to: 'b@example.com', subject: 'B', text: 'two' }, job: { idempotencyKey: 'same' } }
  ]), /must be unique/);
  await assert.rejects(queue.enqueueBulk([
    { email: { to: 'a@example.com', subject: 'A', text: 'one' } },
    { email: { to: 'b@example.com', subject: 'B', text: 'two' } },
    { email: { to: 'c@example.com', subject: 'C', text: 'three' } }
  ]), /maxBulkSize/);
  assert.equal(underlying.bulkCalls.length, 1);
  await queue.close();
});

test('BullMQ worker decodes attachments, passes concurrency and limiter, and returns successful result', async () => {
  const queue = createQueue({
    concurrency: 7,
    limiter: { max: 25, duration: 1_000 },
    workerMetrics: { maxDataPoints: 20_160 }
  });
  const mailerCalls = [];
  const worker = queue.startWorker({
    sendEmail: async (email) => {
      mailerCalls.push(email);
      return { success: true, status: 'success', messageId: 'msg-1' };
    }
  });

  assert.equal(worker.name, 'tzmail-email');
  assert.equal(worker.options.concurrency, 7);
  assert.deepEqual(worker.options.limiter, { max: 25, duration: 1_000 });
  assert.deepEqual(worker.options.metrics, { maxDataPoints: 20_160 });
  const result = await worker.processor({
    id: 'job-1',
    name: 'send-email',
    data: emailJobData({
      to: 'ana@example.com', subject: 'Report', text: 'Hello',
      attachments: [{ filename: 'report.txt', contentBase64: Buffer.from('data').toString('base64') }]
    })
  });
  assert.equal(result.messageId, 'msg-1');
  assert.equal(Buffer.isBuffer(mailerCalls[0].attachments[0].content), true);
  assert.equal(mailerCalls[0].attachments[0].content.toString(), 'data');
  assert.equal(mailerCalls[0].attachments[0].filename, 'report.txt');
  await queue.close();
  assert.equal(worker.closeCalls, 1);
  assert.equal(FakeQueue.instances[0].closeCalls, 1);
});

test('BullMQ queue exports Prometheus metrics and reads per-minute completed/failed metrics', async () => {
  const queue = createQueue({ queueName: 'transactional-email' });
  const output = await queue.exportPrometheusMetrics({ env: 'production', service: 'tzmail' });
  const completed = await queue.getMetrics('completed', 0, -1);
  await queue.getMetrics('failed');
  const underlying = FakeQueue.instances[0];

  assert.match(output, /bullmq_job_count/);
  assert.deepEqual(underlying.prometheusLabels, { env: 'production', service: 'tzmail' });
  assert.deepEqual(completed, { data: [2, 3], count: 5, meta: { count: 5, prevTS: 0, prevCount: 0 } });
  assert.deepEqual(underlying.metricsCalls, [
    { type: 'completed', start: 0, end: -1 },
    { type: 'failed', start: 0, end: -1 }
  ]);
  await queue.close();
});

test('QueueEvents receives global worker events and is closed with the queue', async () => {
  const queue = createQueue({ queueName: 'transactional-email', prefix: 'prod' });
  const events = queue.createQueueEvents();
  let completion;
  events.on('completed', (payload) => { completion = payload; });
  events.emit('completed', { jobId: 'email-123', returnvalue: { status: 'success' } });

  assert.deepEqual(completion, { jobId: 'email-123', returnvalue: { status: 'success' } });
  assert.equal(FakeQueueEvents.instances[0].name, 'transactional-email');
  assert.equal(FakeQueueEvents.instances[0].options.prefix, 'prod');
  await queue.close();
  assert.equal(FakeQueueEvents.instances[0].closeCalls, 1);
});

test('BullMQ worker does not automatically retry partial delivery and does retry provider failures', async () => {
  const queue = createQueue();
  let response = { success: false, status: 'partial', accepted: ['ok@example.com'], rejected: ['bad@example.com'] };
  let worker = queue.startWorker({ sendEmail: async () => response });
  await assert.rejects(worker.processor({ name: 'send-email', data: emailJobData({ to: 'a@example.com', subject: 'Test', text: 'Body' }) }),
    (error) => error instanceof FakeUnrecoverableError && /only some recipients/.test(error.message));

  const providerError = new Error('temporary provider failure');
  response = { success: false, status: 'failure', errorStage: 'provider', error: providerError };
  worker = queue.startWorker({ sendEmail: async () => response });
  await assert.rejects(worker.processor({ name: 'send-email', data: emailJobData({ to: 'a@example.com', subject: 'Test', text: 'Body' }) }),
    (error) => error === providerError);

  response = { success: false, status: 'failure', errorStage: 'validation', error: new Error('bad data') };
  worker = queue.startWorker({ sendEmail: async () => response });
  await assert.rejects(worker.processor({ name: 'send-email', data: emailJobData({ to: 'a@example.com', subject: 'Test', text: 'Body' }) }),
    (error) => error instanceof FakeUnrecoverableError && /validation stage/.test(error.message));
  await queue.close();
});

test('BullMQ worker marks malformed jobs unrecoverable and queue supports pause/resume', async () => {
  const queue = createQueue();
  const worker = queue.startWorker({ sendEmail: async () => ({ success: true, status: 'success' }) });
  await assert.rejects(worker.processor({ name: 'send-email', data: { version: 9 } }), FakeUnrecoverableError);

  await queue.pause();
  await queue.resume();
  assert.deepEqual(await queue.getJobCounts(), {
    wait: 2, active: 0, completed: 0, failed: 0, delayed: 0, paused: 0
  });
  const underlying = FakeQueue.instances[0];
  assert.equal(underlying.pauseCalls, 1);
  assert.equal(underlying.resumeCalls, 1);
  await queue.close();
});

test('BullMQ queue stops accepting operations after close', async () => {
  const queue = createQueue();
  await queue.close();
  await assert.rejects(queue.enqueueEmail({ to: 'a@example.com', subject: 'Test', text: 'Body' }), /is closed/);
  assert.throws(() => queue.startWorker({ sendEmail: async () => ({ success: true, status: 'success' }) }), /is closed/);
});

test('BullMQ queue validates Redis, payload, batch and job option limits before enqueue', async () => {
  assert.throws(() => new BullMQEmailQueue({ connection: {}, queueName: 'bad:name' }, runtime), /queueName/);
  assert.throws(() => new BullMQEmailQueue({ connection: {}, concurrency: 0 }, runtime), /concurrency/);
  const queue = createQueue({ maxPayloadBytes: 100 });
  const underlying = FakeQueue.instances[0];
  await assert.rejects(queue.enqueueEmail({ to: 'a@example.com', subject: 'large', text: 'x'.repeat(300) }), /maxPayloadBytes/);
  await assert.rejects(queue.enqueueEmail({ to: 'a@example.com', subject: 'test', text: 'body' }, { delay: -1 }), /delay/);
  await assert.rejects(queue.enqueueEmail({ to: 'a@example.com', subject: 'test', text: 'body' }, { idempotencyKey: '   ' }), /must not be empty/);
  assert.equal(underlying.addCalls.length, 0);
  await queue.close();
});
