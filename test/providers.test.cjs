const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { EmailFactory } = require('../dist/factories/email-factory.js');
const { EmailService } = require('../dist/services/email.service.js');
const { MailgunTransport } = require('../dist/providers/mailgun.transport.js');
const { SendGridTransport } = require('../dist/providers/sendgrid.transport.js');

function response(status, body = '', headers = {}) {
  return new Response(body, { status, headers });
}

async function withSlowLocalServer(run) {
  const timers = new Set();
  const server = createServer((request, res) => {
    const timer = setTimeout(() => {
      timers.delete(timer);
      if (!res.destroyed) {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ id: '<delayed@example.com>', message: 'Queued' }));
      }
    }, 300);
    timers.add(timer);
    request.on('aborted', () => {
      clearTimeout(timer);
      timers.delete(timer);
    });
    res.on('close', () => {
      clearTimeout(timer);
      timers.delete(timer);
    });
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Failed to create local test server');

  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    for (const timer of timers) clearTimeout(timer);
    server.close();
    server.closeAllConnections();
  }
}

test('SendGrid sends a v3 payload with parsed recipients, Base64 attachments and accepted metadata', async () => {
  let request;
  const transport = new SendGridTransport({
    apiKey: 'sg-secret-test',
    defaultFrom: 'Acme <noreply@example.com>',
    maxAttachmentBytes: 100
  }, async (url, init) => {
    request = { url, init };
    return response(202, '', { 'x-message-id': 'sg-message-123' });
  });

  const result = await transport.sendMail({
    to: ['Ana Silva <ana@example.com>', 'bruno@example.com'],
    cc: 'finance@example.com',
    subject: 'Invoice',
    text: 'Attached.',
    attachments: [{ filename: 'invoice.txt', content: Buffer.from('invoice'), contentType: 'text/plain' }]
  });

  const payload = JSON.parse(request.init.body);
  assert.equal(request.url, 'https://api.sendgrid.com/v3/mail/send');
  assert.equal(request.init.headers.authorization, 'Bearer sg-secret-test');
  assert.equal(payload.from.email, 'noreply@example.com');
  assert.equal(payload.from.name, 'Acme');
  assert.deepEqual(payload.personalizations[0].to, [
    { email: 'ana@example.com', name: 'Ana Silva' },
    { email: 'bruno@example.com' }
  ]);
  assert.deepEqual(payload.personalizations[0].cc, [{ email: 'finance@example.com' }]);
  assert.equal(payload.attachments[0].content, Buffer.from('invoice').toString('base64'));
  assert.equal(payload.attachments[0].filename, 'invoice.txt');
  assert.equal(result.messageId, 'sg-message-123');
  assert.equal(result.response, '202 Accepted');
  assert.deepEqual(result.rejected, []);
  assert.equal(result.accepted.length, 3);
});

test('SendGrid rejects non-202 API responses without exposing the API key', async () => {
  const transport = new SendGridTransport({ apiKey: 'never-log-this', defaultFrom: 'sender@example.com' }, async () =>
    response(401, '{"errors":[{"message":"unauthorized"}]}'));

  await assert.rejects(
    transport.sendMail({ to: 'user@example.com', subject: 'Test', text: 'Body' }),
    (error) => error.statusCode === 401 && !error.message.includes('never-log-this')
  );
});

test('SendGrid enforces configured attachment size before making a request', async () => {
  let requests = 0;
  const transport = new SendGridTransport({ apiKey: 'key', defaultFrom: 'sender@example.com', maxAttachmentBytes: 2 }, async () => {
    requests += 1;
    return response(202);
  });

  await assert.rejects(transport.sendMail({
    to: 'user@example.com',
    subject: 'Test',
    text: 'Body',
    attachments: [{ filename: 'large.bin', content: Buffer.from('123') }]
  }), /maxAttachmentBytes/);
  assert.equal(requests, 0);
});

test('Mailgun posts multipart fields and attachments to the regional endpoint', async () => {
  let request;
  const transport = new MailgunTransport({
    apiKey: 'mg-secret-test',
    domain: 'mg.example.com',
    region: 'eu',
    defaultFrom: 'Acme <noreply@example.com>'
  }, async (url, init) => {
    request = { url, init };
    return response(200, JSON.stringify({ id: '<mg-123@example.com>', message: 'Queued. Thank you.' }));
  });

  const result = await transport.sendMail({
    to: ['ana@example.com', 'bruno@example.com'],
    cc: 'finance@example.com',
    subject: 'Report',
    html: '<p>See report</p><img src="cid:logo">',
    attachments: [
      { filename: 'report.pdf', content: Buffer.from('pdf-data'), contentType: 'application/pdf' },
      { filename: 'logo.png', content: Buffer.from('png-data'), contentType: 'image/png', cid: 'logo' }
    ]
  });

  const form = request.init.body;
  assert.equal(request.url, 'https://api.eu.mailgun.net/v3/mg.example.com/messages');
  assert.equal(request.init.method, 'POST');
  assert.match(request.init.headers.authorization, /^Basic /);
  assert.deepEqual(form.getAll('to'), ['ana@example.com', 'bruno@example.com']);
  assert.equal(form.get('from'), 'Acme <noreply@example.com>');
  assert.equal(form.get('subject'), 'Report');
  assert.equal(form.get('html'), '<p>See report</p><img src="cid:logo.png">');
  assert.equal(form.getAll('attachment').length, 1);
  assert.equal(form.getAll('inline').length, 1);
  assert.equal(form.get('inline').name, 'logo.png');
  assert.equal(form.get('attachment').name, 'report.pdf');
  assert.equal(Buffer.from(await form.get('attachment').arrayBuffer()).toString(), 'pdf-data');
  assert.equal(result.messageId, '<mg-123@example.com>');
  assert.equal(result.response, 'Queued. Thank you.');
  assert.deepEqual(result.rejected, []);
  assert.equal(result.accepted.length, 3);
});

test('Mailgun rejects provider errors and refuses insecure non-local API URLs', async () => {
  const transport = new MailgunTransport({ apiKey: 'key', domain: 'mg.example.com', defaultFrom: 'sender@example.com' }, async () =>
    response(429, '{"message":"rate limited"}'));
  await assert.rejects(
    transport.sendMail({ to: 'user@example.com', subject: 'Test', text: 'Body' }),
    (error) => error.statusCode === 429 && error.message.includes('rate limited')
  );

  assert.throws(() => new MailgunTransport({
    apiKey: 'key', domain: 'mg.example.com', defaultFrom: 'sender@example.com', apiUrl: 'http://api.example.com'
  }), /must use HTTPS/);
});

test('factory instances for different providers are independent and custom transport failures use provider stage', async () => {
  const sendgrid = EmailFactory.createSendGrid({ apiKey: 'sg-key', defaultFrom: 'sender@example.com' });
  const mailgun = EmailFactory.createMailgun({ apiKey: 'mg-key', domain: 'mg.example.com', defaultFrom: 'sender@example.com' });
  assert.notEqual(sendgrid, mailgun);
  sendgrid.close();
  mailgun.close();

  const mailer = EmailFactory.createWithTransport({ sendMail: async () => { throw new Error('provider unavailable'); } });
  const result = await mailer.sendEmail({ to: 'user@example.com', subject: 'Test', text: 'Body' });
  assert.equal(result.success, false);
  assert.equal(result.errorStage, 'provider');
  mailer.close();
});

test('provider EmailService verification is explicit when a transport has no safe check', async () => {
  const service = new EmailService({ sendMail: async () => ({}) }, undefined, 'provider');
  await assert.rejects(service.verify(), /does not expose a non-delivery verification/);
});

test('SES validates region before loading its optional AWS SDK package', () => {
  assert.throws(() => EmailFactory.createSES({ region: '', defaultFrom: 'sender@example.com' }), /region is required/);
});

test('SendGrid propagates a network failure from fetch without converting it to provider success', async () => {
  const networkError = new TypeError('fetch failed: connection reset');
  const transport = new SendGridTransport({ apiKey: 'sg-key', defaultFrom: 'sender@example.com' }, async () => {
    throw networkError;
  });

  await assert.rejects(
    transport.sendMail({ to: 'user@example.com', subject: 'Test', text: 'Body' }),
    (error) => error === networkError
  );
});

test('Mailgun propagates a network failure from fetch without converting it to provider success', async () => {
  const networkError = new TypeError('fetch failed: socket closed');
  const transport = new MailgunTransport({
    apiKey: 'mg-key', domain: 'mg.example.com', defaultFrom: 'sender@example.com'
  }, async () => { throw networkError; });

  await assert.rejects(
    transport.sendMail({ to: 'user@example.com', subject: 'Test', text: 'Body' }),
    (error) => error === networkError
  );
});

test('SendGrid aborts a stalled HTTP request at requestTimeoutMs', async () => {
  await withSlowLocalServer(async (apiUrl) => {
    const transport = new SendGridTransport({
      apiKey: 'sg-key', defaultFrom: 'sender@example.com', apiUrl, requestTimeoutMs: 50
    });

    await assert.rejects(
      transport.sendMail({ to: 'user@example.com', subject: 'Test', text: 'Body' }),
      (error) => error.name === 'TimeoutError' || error.name === 'AbortError'
    );
  });
});

test('Mailgun aborts a stalled HTTP request at requestTimeoutMs', async () => {
  await withSlowLocalServer(async (apiUrl) => {
    const transport = new MailgunTransport({
      apiKey: 'mg-key', domain: 'mg.example.com', defaultFrom: 'sender@example.com', apiUrl, requestTimeoutMs: 50
    });

    await assert.rejects(
      transport.sendMail({ to: 'user@example.com', subject: 'Test', text: 'Body' }),
      (error) => error.name === 'TimeoutError' || error.name === 'AbortError'
    );
  });
});
