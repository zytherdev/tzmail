const test = require('node:test');
const assert = require('node:assert/strict');
const { TemplateService } = require('../dist/services/template.service.js');
const { TemplateFactory } = require('../dist/factories/template-factory.js');
const { ThemeType } = require('../dist/core/enums/theme.enum.js');

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function contrastRatio(foreground, background) {
  const luminance = color => {
    const hex = color.replace(/^#/, '');
    const normalized = hex.length === 3 ? [...hex].map(channel => channel + channel).join('') : hex;
    if (!/^[\da-f]{6}$/i.test(normalized)) return null;
    const channels = [0, 2, 4].map(offset => parseInt(normalized.slice(offset, offset + 2), 16) / 255);
    return channels.map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
      .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
  };
  const first = luminance(foreground);
  const second = luminance(background);
  if (first === null || second === null) return 0;
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

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
      assert.match(html, /class="container-content"/);
      assert.match(html, /<html lang="en" dir="ltr">/);
      assert.ok(theme.emailStyles, `${themeType} should define an email layout profile`);
      assert.ok(theme.emailStyles.maxWidthPx >= 560 && theme.emailStyles.maxWidthPx <= 640, `${themeType} should use a readable desktop width`);
      assert.ok(['solid', 'outline'].includes(theme.emailStyles.button.appearance));
      assert.ok(contrastRatio(theme[variant].text, theme[variant].background) >= 4.5, `${themeType}/${variant} body text should meet WCAG AA`);
      assert.ok(html.includes(theme[variant].background), `${themeType}/${variant} should use its theme surface color`);
      assert.ok(html.includes(theme[variant].primary), `${themeType}/${variant} should use its CTA palette`);
      assert.ok(html.includes(`background-color: ${theme[variant].background};`), `${themeType}/${variant} should pin its surface color for email clients`);
      assert.ok(html.includes(`color: ${theme[variant].text};`), `${themeType}/${variant} should pin readable text colors`);
      assert.doesNotMatch(html, /color:\s*inherit\s*;/i);
      assert.doesNotMatch(html, /background-color:\s*transparent\s*;/i);
      assert.match(html, /text-decoration:none/);
      if (theme.emailStyles.button.appearance === 'solid') assert.match(html, /color: #(000000|ffffff);/);
      assert.doesNotMatch(html, /backdrop-filter|linear-gradient|transition\s*:|:hover/i);

      const logoIndex = html.indexOf('Acme &lt;b&gt;Mail&lt;/b&gt;');
      const logoBlock = html.slice(html.lastIndexOf('<div style=', logoIndex), logoIndex);
      const logoColor = logoBlock.match(/color:\s*([^;]+);/)?.[1];
      assert.ok(contrastRatio(logoColor, theme[variant].background) >= 4.5, `${themeType}/${variant} logo should meet WCAG AA`);

      const buttonStart = html.indexOf('<a class="button-link"');
      const buttonEnd = html.indexOf('</a>', buttonStart);
      const buttonBlock = html.slice(buttonStart, buttonEnd);
      const buttonTextColor = buttonBlock.match(/[\s;]color:\s*([^;]+);/)?.[1];
      const buttonBackground = theme.emailStyles.button.appearance === 'outline' ? theme[variant].background : theme[variant].primary;
      assert.ok(contrastRatio(buttonTextColor, buttonBackground) >= 4.5, `${themeType}/${variant} CTA should meet WCAG AA`);

      const linkIndex = html.indexOf('>Privacy</a>');
      const linkBlock = html.slice(html.lastIndexOf('<a ', linkIndex), linkIndex);
      const linkColor = linkBlock.match(/color:\s*([^;]+);/)?.[1];
      assert.ok(contrastRatio(linkColor, theme[variant].background) >= 4.5, `${themeType}/${variant} footer link should meet WCAG AA`);
    }
  }
});

test('footer link decoration is off by default and can be enabled explicitly', async t => {
  const service = new TemplateService();
  t.after(() => service.dispose());
  const config = plainConfig({
    footer: {
      show: true,
      links: [{ text: 'Privacy', url: 'https://example.com/privacy' }],
      unsubscribeText: 'Unsubscribe',
      unsubscribeUrl: 'https://example.com/unsubscribe'
    }
  });
  const defaultHtml = await service.previewTemplate(ThemeType.SYSTEM, 'dark', config, {});
  const defaultLinks = defaultHtml.match(/<a\b[^>]*style="[^"]*"[^>]*>/g) || [];
  assert.ok(defaultLinks.length >= 2);
  assert.ok(defaultLinks.every(link => /text-decoration:none/.test(link)));

  const underlinedHtml = await service.previewTemplate(ThemeType.SYSTEM, 'dark', { ...config, linkDecoration: 'underline' }, {});
  const underlinedLinks = underlinedHtml.match(/<a\b[^>]*style="[^"]*"[^>]*>/g) || [];
  assert.ok(underlinedLinks.length >= 2);
  assert.ok(underlinedLinks.every(link => /text-decoration:underline/.test(link)));
  assert.throws(() => service.createTemplate(ThemeType.SYSTEM, 'light', { ...config, linkDecoration: 'wavy' }), /linkDecoration/i);
});

test('body copy and CTA share the requested left/center/right alignment', async t => {
  const service = new TemplateService();
  t.after(() => service.dispose());
  for (const alignment of ['left', 'center', 'right']) {
    const html = await service.previewTemplate(ThemeType.OCEAN, 'dark', plainConfig({
      body: { alignment, title: 'A title', message: 'Aligned copy', buttonText: 'Continue', buttonUrl: 'https://example.com/continue' }
    }), {});
    assert.match(html, new RegExp(`<td align="${alignment}" style="padding: 0; text-align: ${alignment};`));
    assert.match(html, new RegExp(`<table class="button" align="${alignment}"`));
    assert.match(html, new RegExp(`<tr><td align="${alignment}"><a class="button-link"`));
  }
});

test('body background and text color overrides are rendered explicitly', async t => {
  const service = new TemplateService();
  t.after(() => service.dispose());
  const html = await service.previewTemplate(ThemeType.OCEAN, 'dark', plainConfig({
    body: { backgroundColor: '#101820', textColor: '#ffffff', title: 'Custom palette', message: 'Readable copy' }
  }), {});
  assert.match(html, /bgcolor="#101820" style="width:100%;background-color:#101820;"/);
  assert.match(html, /color: #ffffff;/);
});

test('renders safe localized RTL output and escaped, interpolated inbox preheaders', async t => {
  const service = new TemplateService();
  t.after(() => service.dispose());
  const html = await service.previewTemplate(ThemeType.SYSTEM, 'light', plainConfig({
    language: 'pt-BR',
    direction: 'rtl',
    preheader: 'Olá, {{user.name}}'
  }), { templateData: { user: { name: '<Ana>' } } });
  assert.match(html, /<html lang="pt-BR" dir="rtl">/);
  assert.match(html, /mso-hide:all[^>]*>Olá, &lt;Ana&gt;<\/div>/);
  assert.doesNotMatch(html, /Olá, <Ana>/);
  assert.throws(() => service.createTemplate(ThemeType.SYSTEM, 'light', plainConfig({ language: 'en" onload="x' })), /language tag/i);
  assert.throws(() => service.createTemplate(ThemeType.SYSTEM, 'light', plainConfig({ direction: 'sideways' })), /text direction/i);
  assert.throws(() => service.createTemplate(ThemeType.SYSTEM, 'light', plainConfig({ preheader: 'x'.repeat(501) })), /500/);
});

test('escapes code text before Monokai syntax highlighting', async t => {
  const service = new TemplateService();
  t.after(() => service.dispose());
  const html = await service.previewTemplate(ThemeType.MONOKAI, 'dark', plainConfig({
    body: { content: "<p>Example:</p><code>const x = '<img src=x onerror=alert(1)>';</code>" }
  }), {});
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(html, /<img src=x onerror/);
  assert.match(html, /<pre style=/);
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
