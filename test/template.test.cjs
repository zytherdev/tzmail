const test = require('node:test');
const assert = require('node:assert/strict');
const { TemplateService } = require('../dist/services/template.service.js');
const { TemplateFactory } = require('../dist/factories/template-factory.js');
const { ThemeType } = require('../dist/core/enums/theme.enum.js');

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function plainConfig(overrides = {}) {
  return {
    header: { show: true, logo: { type: 'text', text: 'Acme <b>Mail</b>' } },
    body: { title: 'Welcome <img src=x onerror=alert(1)>', message: 'A & B <script>alert(1)</script>' },
    footer: { show: true, copyrightText: '© Acme <b>2026</b>' },
    ...overrides
  };
}

test('preview renders the captured config, escapes text, and does not trust caller _meta/template', async t => {
  const service = new TemplateService();
  t.after(() => service.dispose());
  const html = await service.previewTemplate(ThemeType.SYSTEM, 'light', plainConfig(), {
    template: { config: { body: { title: 'injected config' } } },
    _meta: { isPreview: false, templateName: 'forged' }
  });
  assert.match(html, /Welcome &lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html, /A &amp; B &lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /Acme &lt;b&gt;Mail&lt;\/b&gt;/);
  assert.match(html, /© Acme &lt;b&gt;2026&lt;\/b&gt;/);
  assert.doesNotMatch(html, /injected config|forged/);
});

test('all 15 themes render in light and dark mode with responsive email markup', async t => {
  const service = new TemplateService();
  t.after(() => service.dispose());
  const expectedThemes = [
    'system', 'monokai', 'modern', 'corporate', 'minimal',
    'aurora', 'ocean', 'sunset', 'lavender', 'forest',
    'editorial', 'pastel', 'neobrutal', 'glass', 'midnight'
  ];
  assert.deepEqual(TemplateFactory.listThemes().map(String), expectedThemes);

  const config = plainConfig({
    body: { title: 'Welcome', message: 'Your account is ready.', buttonText: 'Open account', buttonUrl: 'https://example.com/account' },
    footer: { show: true, links: [{ text: 'Privacy', url: 'https://example.com/privacy' }] }
  });
  for (const themeType of TemplateFactory.listThemes()) {
    const theme = TemplateFactory.getTheme(themeType);
    assert.ok(theme, `theme ${themeType} should be registered`);
    assert.equal(TemplateFactory.getThemeInfo(themeType).name, theme.name);
    for (const variant of ['light', 'dark']) {
      const html = await service.previewTemplate(themeType, variant, config, {});
      assert.match(html, /name="viewport"/);
      assert.match(html, /@media only screen and \(max-width: 600px\)/);
      assert.match(html, /table class="button"/);
      assert.match(html, /class="footer-link-cell"/);
      assert.ok(html.includes(theme[variant].background), `${themeType}/${variant} should use its theme surface color`);
      assert.ok(html.includes(`background-color: ${theme[variant].primary}`), `${themeType}/${variant} should use its CTA palette`);
      assert.match(html, /color: #(000000|ffffff);/);
    }
  }
});

test('dangerous and injected URLs are rejected; supported HTTPS and mailto links work', async t => {
  const service = new TemplateService();
  t.after(() => service.dispose());
  assert.throws(() => service.createTemplate(ThemeType.SYSTEM, 'light', plainConfig({
    body: { buttonText: 'Click', buttonUrl: 'javascript:alert(1)' }
  })), /unsafe URL scheme/i);
  assert.throws(() => service.createTemplate(ThemeType.SYSTEM, 'light', plainConfig({
    footer: { show: true, links: [{ text: 'x', url: 'https://example.com/" onclick="alert(1)' }] }
  })), /valid URL/i);
  const html = await service.previewTemplate(ThemeType.SYSTEM, 'light', plainConfig({
    body: { buttonText: 'Email us', buttonUrl: 'mailto:support@example.com?subject=Hello' },
    footer: { show: true, links: [{ text: 'Contact', url: 'mailto:hello@example.com' }] }
  }), {});
  assert.match(html, /href="mailto:support@example.com\?subject=Hello"/);
  assert.match(html, /href="mailto:hello@example.com"/);
});

test('cache can be bypassed locally, expires on cache hit, and TTL zero disables storage', async t => {
  const service = new TemplateService({ cache: true, cacheTTL: 0.02 });
  t.after(() => service.dispose());
  const config = plainConfig({ body: { title: 'cache case' } });
  const first = service.createTemplate(ThemeType.SYSTEM, 'light', config);
  const id = first.getId();
  assert.equal(service.getTemplateStats().cachedTemplates, 1);
  assert.equal(service.getTemplateStats().totalHits, 0);
  const bypassed = service.createTemplate(ThemeType.SYSTEM, 'light', config, { cache: false });
  assert.equal(bypassed.getId(), id);
  assert.equal(service.getTemplateDetails(id).usageCount, 0);
  service.createTemplate(ThemeType.SYSTEM, 'light', config);
  assert.equal(service.getTemplateDetails(id).usageCount, 1);
  assert.equal(service.getTemplateStats().cacheRequests, 2);
  assert.equal(service.getTemplateStats().cacheHitRate, 50);
  await wait(35);
  service.createTemplate(ThemeType.SYSTEM, 'light', config);
  assert.equal(service.getTemplateDetails(id).usageCount, 0);
  const uncached = new TemplateService({ cache: true, cacheTTL: 0 });
  try {
    uncached.createTemplate(ThemeType.SYSTEM, 'light', config);
    assert.equal(uncached.getTemplateStats().cachedTemplates, 0);
  } finally { uncached.dispose(); }
});

test('invalid imported configuration and invalid history indices fail safely', t => {
  const service = new TemplateService();
  t.after(() => service.dispose());
  assert.throws(() => service.importTemplate(JSON.stringify({
    theme: 'system', variant: 'light', config: { layout: 'untrusted' }
  })), /Invalid layout/);
  assert.throws(() => service.importTemplate(JSON.stringify({ theme: 'system', variant: 'sideways', config: {} })), /Invalid template data/);
  assert.equal(service.restoreTemplateVersion('missing', -1), null);
});

test('dispose clears the cleanup timer and returns defensive config snapshots', () => {
  const service = new TemplateService();
  const template = service.createTemplate(ThemeType.SYSTEM, 'light', plainConfig());
  const timer = service.cleanupTimer;
  template.config.header.logo.text = 'mutated by caller';
  assert.equal(service.getTemplateHistory(template.getId())[0].config.header.logo.text, 'Acme <b>Mail</b>');
  service.dispose();
  assert.equal(timer._destroyed, true);
});

test('interpolates per-message templateData and escapes variable values in trusted HTML and text fields', async t => {
  const service = new TemplateService();
  t.after(() => service.dispose());
  const templateData = {
    user: { name: '<img src=x onerror=alert(1)>' },
    accountId: '42',
    token: 'safe-token'
  };
  const html = await service.previewTemplate(ThemeType.SYSTEM, 'light', {
    header: { show: true, logo: { type: 'text', text: 'Acme {{user.name}}' } },
    body: {
      title: 'Hello {{user.name}}',
      message: 'Account {{accountId}}',
      buttonText: 'Open {{accountId}}',
      buttonUrl: 'https://example.com/account/{{accountId}}'
    },
    footer: {
      show: true,
      links: [{ text: 'Profile {{user.name}}', url: 'https://example.com/users/{{accountId}}' }],
      unsubscribeText: 'Unsubscribe',
      unsubscribeUrl: 'https://example.com/unsubscribe?token={{token}}'
    }
  }, { templateData });
  const customHtml = await service.previewTemplate(ThemeType.SYSTEM, 'light', {
    body: { content: '<p>Custom {{user.name}}</p>' }
  }, { templateData });

  assert.match(html, /Hello &lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html, /Account 42/);
  assert.match(customHtml, /<p>Custom &lt;img src=x onerror=alert\(1\)&gt;<\/p>/);
  assert.match(html, /href="https:\/\/example.com\/account\/42"/);
  assert.match(html, /href="https:\/\/example.com\/users\/42"/);
  assert.match(html, /href="https:\/\/example.com\/unsubscribe\?token=safe-token"/);
  assert.doesNotMatch(html + customHtml, /<img src=x onerror=alert\(1\)>/);
});

test('fails closed when a template placeholder has no value', async t => {
  const service = new TemplateService();
  t.after(() => service.dispose());
  await assert.rejects(
    service.previewTemplate(ThemeType.SYSTEM, 'light', { body: { title: 'Hello {{missing}}' } }, {}),
    /Missing template variable: missing/
  );
});
