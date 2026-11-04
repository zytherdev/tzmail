const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { EmailService } = require('../dist/services/email.service.js');
const { AttachmentService } = require('../dist/services/attachment.service.js');
const { EmailFactory } = require('../dist/factories/email-factory.js');

function fakeTransporter(sendMail) {
  return { sendMail };
}

const message = { to: [' user@example.com ', 'second@example.com'], subject: '  Hello  ', text: 'Body' };

test('sends normalized message and reports successful transport metadata', async () => {
  let sentOptions;
  const service = new EmailService(fakeTransporter(async (options) => {
    sentOptions = options;
    return {
      messageId: '<test-1@example.com>',
      response: '250 accepted',
      accepted: ['user@example.com', 'second@example.com'],
      rejected: []
    };
  }), 'noreply@example.com');

  const result = await service.send(message);
  assert.equal(result.success, true);
  assert.equal(result.status, 'success');
  assert.equal(result.messageId, '<test-1@example.com>');
  assert.deepEqual(result.accepted, ['user@example.com', 'second@example.com']);
  assert.equal(sentOptions.to, 'user@example.com, second@example.com');
  assert.equal(sentOptions.subject, 'Hello');
  assert.equal(sentOptions.from, 'noreply@example.com');
});

test('rejects header control characters before invoking SMTP', async () => {
  let sendCalls = 0;
  const service = new EmailService(fakeTransporter(async () => { sendCalls += 1; }));
  const result = await service.send({ ...message, subject: 'Hello\r\nBcc: victim@example.com' });

  assert.equal(result.success, false);
  assert.equal(result.errorStage, 'validation');
  assert.match(result.error.message, /header control characters/);
  assert.equal(sendCalls, 0);
});

test('reports resolved partial delivery without claiming total success', async () => {
  const service = new EmailService(fakeTransporter(async () => ({
    accepted: ['user@example.com'],
    rejected: ['bad@example.com'],
    response: '250 accepted some recipients'
  })));

  const result = await service.send({ ...message, to: 'user@example.com' });
  assert.equal(result.success, false);
  assert.equal(result.status, 'partial');
  assert.deepEqual(result.accepted, ['user@example.com']);
  assert.deepEqual(result.rejected, ['bad@example.com']);
});

test('retains SMTP errors and reports partial SMTP rejection when exposed', async () => {
  const smtpError = Object.assign(new Error('SMTP rejected some recipients'), {
    accepted: ['user@example.com'],
    rejected: ['bad@example.com'],
    response: '450 temporary rejection'
  });
  const service = new EmailService(fakeTransporter(async () => { throw smtpError; }));

  const result = await service.send({ ...message, to: 'user@example.com' });
  assert.equal(result.success, false);
  assert.equal(result.status, 'partial');
  assert.equal(result.errorStage, 'smtp');
  assert.equal(result.error, smtpError);
  assert.deepEqual(result.accepted, ['user@example.com']);
  assert.deepEqual(result.rejected, ['bad@example.com']);
});

test('returns render failures consistently and does not call the transporter', async () => {
  const renderError = new Error('render failed');
  let sendCalls = 0;
  const service = new EmailService(fakeTransporter(async () => { sendCalls += 1; }));
  const result = await service.send({
    ...message,
    to: 'user@example.com',
    template: { render: async () => { throw renderError; } }
  });

  assert.equal(result.success, false);
  assert.equal(result.status, 'failure');
  assert.equal(result.errorStage, 'render');
  assert.equal(result.error, renderError);
  assert.equal(sendCalls, 0);
});

test('passes per-message templateData to the renderer', async () => {
  let renderedData;
  const service = new EmailService(fakeTransporter(async () => ({ accepted: ['user@example.com'], rejected: [] })));
  const result = await service.send({
    ...message,
    to: 'user@example.com',
    templateData: { firstName: 'Ana' },
    template: { render: async (data) => { renderedData = data.templateData; return '<p>Hello</p>'; } }
  });
  assert.equal(result.success, true);
  assert.deepEqual(renderedData, { firstName: 'Ana' });
});

test('rejects paths outside allowedRoot, including symlink escapes', async (t) => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'tzmail-root-'));
  const allowedRoot = path.join(tempRoot, 'allowed');
  const outsideRoot = path.join(tempRoot, 'outside');
  await fs.mkdir(allowedRoot);
  await fs.mkdir(outsideRoot);
  const insideFile = path.join(allowedRoot, 'inside.txt');
  const outsideFile = path.join(outsideRoot, 'outside.txt');
  await fs.writeFile(insideFile, 'in');
  await fs.writeFile(outsideFile, 'out');
  const attachments = new AttachmentService({ allowedRoot });

  try {
    const attached = await attachments.addFromPath(insideFile);
    assert.equal(attached.path, await fs.realpath(insideFile));
    await assert.rejects(attachments.addFromPath(outsideFile), /outside allowedRoot/);

    const link = path.join(allowedRoot, 'escape.txt');
    try {
      await fs.symlink(outsideFile, link);
      await assert.rejects(attachments.addFromPath(link), /outside allowedRoot/);
    } catch (error) {
      if (error.code === 'EPERM' || error.code === 'EACCES' || error.code === 'ENOSYS') {
        t.skip(`symlinks unavailable: ${error.code}`);
      } else {
        throw error;
      }
    }
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
});

test('enforces configured size limits while allowing empty buffers and retaining file paths', async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'tzmail-size-'));
  const file = path.join(tempRoot, 'large.bin');
  await fs.writeFile(file, Buffer.from('12345'));
  const attachments = new AttachmentService({ allowedRoot: tempRoot, maxSizeBytes: 4 });

  try {
    await assert.rejects(attachments.addFromPath(file), /maxSizeBytes/);
    await assert.rejects(attachments.addFromBuffer(Buffer.from('12345'), 'large.bin'), /maxSizeBytes/);
    const empty = await attachments.addFromBuffer(Buffer.alloc(0), 'empty.bin');
    assert.equal(empty.content.length, 0);

    const unlimited = new AttachmentService();
    const pathAttachment = await unlimited.addFromPath(file);
    assert.equal(pathAttachment.path, file);
    assert.equal(Object.hasOwn(pathAttachment, 'content'), false);
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
});

test('verifies SMTP connectivity and closes the transport through EmailService', async () => {
  let closed = 0;
  const service = new EmailService({
    sendMail: async () => ({}),
    verify: async () => true,
    close: () => { closed += 1; }
  });

  assert.equal(await service.verify(), true);
  service.close();
  assert.equal(closed, 1);
});

test('supports pooled transport settings and resets the singleton after graceful close', () => {
  const baseConfig = {
    host: '127.0.0.1',
    port: 2525,
    secure: false,
    pool: true,
    maxConnections: 2,
    maxMessages: 50,
    rateDelta: 1000,
    rateLimit: 20,
    auth: { user: 'test', pass: 'test' }
  };
  const first = EmailFactory.initialize(baseConfig);
  assert.equal(EmailFactory.getInstance(), first);
  assert.throws(() => EmailFactory.initialize({ ...baseConfig, port: 2526 }), /different configuration/);
  first.close();

  const second = EmailFactory.initialize({ ...baseConfig, port: 2526 });
  assert.notEqual(second, first);
  second.close();
});

test('accepts OAuth2 authentication configuration without attempting network access', () => {
  const mailer = EmailFactory.create({
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
      type: 'oauth2',
      user: 'mailer@example.com',
      clientId: 'client-id',
      clientSecret: 'client-secret',
      refreshToken: 'refresh-token'
    }
  });
  assert.doesNotThrow(() => mailer.close());
});

test('EmailFactory passes allowedRoot attachment policy to its attachment service', async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'tzmail-factory-'));
  const allowedRoot = path.join(tempRoot, 'allowed');
  const outsideRoot = path.join(tempRoot, 'outside');
  await fs.mkdir(allowedRoot);
  await fs.mkdir(outsideRoot);
  const insideFile = path.join(allowedRoot, 'inside.txt');
  const outsideFile = path.join(outsideRoot, 'outside.txt');
  await fs.writeFile(insideFile, 'inside');
  await fs.writeFile(outsideFile, 'outside');
  const mailer = EmailFactory.create({
    host: '127.0.0.1', port: 2525, secure: false,
    auth: { user: 'test', pass: 'test' }
  }, undefined, { allowedRoot });

  try {
    assert.equal((await mailer.getAttachmentService().addFromPath(insideFile)).path, await fs.realpath(insideFile));
    await assert.rejects(mailer.getAttachmentService().addFromPath(outsideFile), /outside allowedRoot/);
  } finally {
    mailer.close();
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
});
