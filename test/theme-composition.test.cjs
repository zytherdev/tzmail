const test = require('node:test');
const assert = require('node:assert/strict');
const { TemplateFactory, TemplateBuilder, ThemeType } = require('../dist/index.js');

const config = {
  header: { show: true, logo: { type: 'text', text: 'Northstar' } },
  body: { title: 'A different direction.', message: 'Space for the idea. Clarity for the next step.', buttonText: 'Read the chapter', buttonUrl: 'https://example.com/chapter' },
  footer: { show: true, links: [{ text: 'Help', url: 'https://example.com/help' }], copyrightText: '© Northstar', unsubscribeText: 'Unsubscribe', unsubscribeUrl: 'https://example.com/unsubscribe' }
};

test('all built-in themes use explicit structural defaults and place the CTA before the body closes', async () => {
  for (const type of TemplateFactory.listThemes()) {
    const theme = TemplateFactory.getTheme(type);
    const design = theme.composition;
    const html = await TemplateFactory.createTemplate(type, 'light', config).render({ headerContent: 'Product & community' });
    assert.match(html, new RegExp(`class="email-header-cell" align="${design.header.alignment}"`));
    assert.match(html, new RegExp(`<table class="button"[^>]*align="${design.body.alignment}"`));
    assert.match(html, new RegExp(`class="email-footer-cell"[^>]*align="${design.footer.alignment}"`));
    const bodyStart = html.indexOf('<table class="theme-body');
    const footerStart = html.indexOf('<table class="theme-footer');
    assert.ok(bodyStart < html.indexOf('class="button-link"') && html.indexOf('class="button-link"') < footerStart);
    assert.doesNotMatch(html, /class="button-wrap"/, 'CTA should not be a detached sibling between body and footer');
    assert.doesNotMatch(html, /<img\b|cdn\.simpleicons|placehold\.co/);
    assert.equal(theme.typography.fontSizes.xlarge, `${design.body.titleSize}px`);
    assert.ok(TemplateFactory.getThemeInfo(type).features.includes('No images required'));
  }
});

test('caller alignment overrides win across all compositions', async () => {
  for (const type of TemplateFactory.listThemes()) {
    for (const alignment of ['left', 'center', 'right']) {
      const html = await TemplateFactory.createTemplate(type, 'dark', {
        ...config,
        header: { ...config.header, alignment },
        body: { ...config.body, alignment },
        footer: { ...config.footer, alignment }
      }).render({ headerContent: 'Caller alignment' });
      assert.match(html, new RegExp(`class="email-header-cell" align="${alignment}"`));
      assert.match(html, new RegExp(`<td align="${alignment}" style="padding: 0; text-align: ${alignment};`));
      assert.match(html, new RegExp(`<table class="button"[^>]*align="${alignment}"`));
      assert.match(html, new RegExp(`class="email-footer-cell"[^>]*align="${alignment}"`));
      assert.match(html, /\.layout-column \{ display:block !important;width:100% !important/);
    }
  }
});

test('header/footer background overrides and unsafe interpolated footer URLs remain fail-closed', async () => {
  const html = await TemplateFactory.createTemplate(ThemeType.NEOBRUTAL, 'dark', {
    ...config,
    header: { ...config.header, backgroundColor: '#112233', textColor: '#112233', alignment: 'right' },
    footer: { ...config.footer, backgroundColor: '#112233', textColor: '#112233', alignment: 'right' }
  }).render({ headerContent: 'Contrast survives overrides' });
  assert.match(html, /data-surface="#112233"/);
  assert.doesNotMatch(html, /color:#112233;[^>]*>Contrast survives/);
  await assert.rejects(() => TemplateFactory.createTemplate(ThemeType.MODERN, 'light', {
    ...config,
    footer: { ...config.footer, links: [{ text: 'Unsafe', url: '{{target}}' }] }
  }).render({ templateData: { target: 'javascript:alert(1)' } }), /Unsafe URL scheme/);
});

test('custom themes without composition still render and explicit trusted HTML is not guessed apart', async () => {
  const base = TemplateFactory.getTheme(ThemeType.MODERN);
  const custom = { ...base, composition: undefined, emailStyles: undefined };
  const html = new TemplateBuilder(custom, config, 'light').buildHeader('Custom theme').buildBody('<h2>Trusted title</h2><p>Trusted body</p>').buildButton('Continue', 'https://example.com').buildFooter().build();
  assert.match(html, /data-header-layout="quiet"/);
  assert.match(html, /data-body-layout="story"/);
  assert.match(html, /<h2>Trusted title<\/h2>/);
  assert.match(html, /data-footer-layout="minimal"/);
  const columnsTheme = TemplateFactory.listThemes().find(type => TemplateFactory.getTheme(type).composition.body.layout === 'columns');
  assert.ok(columnsTheme);
  const trusted = await TemplateFactory.createTemplate(columnsTheme, 'light', { body: { html: '<h2>Do not split</h2><p>Custom HTML</p>' } }).render({});
  assert.match(trusted, /<h2>Do not split<\/h2>/);
  assert.match(trusted, /data-body-layout="story"/);
  assert.doesNotMatch(trusted, /class="layout-column body-title-column"/);
});

test('header/footer omission, textual social links and explicit underline are respected', async () => {
  const html = await TemplateFactory.createTemplate(ThemeType.EDITORIAL, 'light', {
    body: config.body,
    header: { show: false }, footer: { show: false }
  }).render({});
  assert.doesNotMatch(html, /data-header-layout|data-footer-layout/);
  const socials = await TemplateFactory.createTemplate(ThemeType.EDITORIAL, 'dark', {
    body: { title: 'Socials', message: 'No remote icons.' },
    linkDecoration: 'underline',
    footer: { show: true, socialLinks: [{ platform: 'github', url: 'https://github.com/example' }] }
  }).render({});
  assert.match(socials, />github<\/a>/);
  assert.match(socials, /text-decoration:underline !important/);
  assert.doesNotMatch(socials, /<img\b/);
});

test('equivalent CSS backgrounds retain readable text across header, body and footer', async () => {
  const { contrastRatio, normalizeCssColor } = require('../dist/templates/base/color-accessibility.js');
  for (const backgroundColor of ['white', 'rgb(255, 255, 255)', 'rgb(100% 100% 100%)', 'hsl(0, 0%, 100%)', '#fff', '#ffff', '#ffffffff']) {
    const html = await TemplateFactory.createTemplate(ThemeType.MINIMAL, 'light', {
      ...config,
      header: { ...config.header, backgroundColor },
      body: { ...config.body, backgroundColor },
      footer: { ...config.footer, backgroundColor }
    }).render({ headerContent: 'Equivalent white surface' });
    const title = html.match(/<h2 style="([^"]+)">/)?.[1];
    const textColor = title?.match(/color:\s*([^;]+);/)?.[1];
    assert.ok(contrastRatio(textColor, backgroundColor) >= 4.5, `${backgroundColor} should retain readable body text`);
    assert.match(html, /data-surface="#ffffff"/);
    const logoStyle = html.match(/<div style="([^"]+)" data-logo-surface="#ffffff"/)?.[1];
    assert.ok(contrastRatio(logoStyle?.match(/color:\s*([^;]+);/)?.[1], backgroundColor) >= 4.5);
    const footerStyle = html.match(/class="email-footer-cell"[^>]*style="([^"]+)"/)?.[1];
    assert.ok(contrastRatio(footerStyle?.match(/color:\s*([^;]+);/)?.[1], backgroundColor) >= 4.5);
  }
  assert.equal(normalizeCssColor('rgba(255, 255, 255, 0)', '#123456'), '#123456');
  assert.equal(normalizeCssColor('#fff0', '#123456'), '#123456');
  assert.equal(normalizeCssColor('hsla(0 0% 100% / 50%)', '#000000'), '#808080');
  assert.ok(contrastRatio('black', 'white') > 20.9);
});

test('legacy custom typography, padding and outline tokens survive the optional composition fallback', () => {
  const base = TemplateFactory.getTheme(ThemeType.MODERN);
  const legacy = {
    ...base, composition: undefined,
    typography: { fontFamily: 'Georgia, serif', fontSizes: { small: '12px', medium: '20px', large: '32px', xlarge: '52px' }, fontWeights: { normal: 400, medium: 500, bold: 900 } },
    emailStyles: {
      ...base.emailStyles,
      body: { ...base.emailStyles.body, horizontalPadding: '61px' },
      button: { ...base.emailStyles.button, appearance: 'outline', borderWidth: '5px', borderRadius: '17px' }
    }
  };
  const html = new TemplateBuilder(legacy, config, 'light').buildHeader().buildMessage('Legacy title', 'Legacy copy', 20).buildButton('Continue', 'https://example.com').buildFooter().build();
  assert.match(html, /font-family: Georgia, serif; font-size: 52px; font-weight: 900;/);
  assert.match(html, /padding:32px 61px;/);
  assert.match(html, /data-button-style="outline"/);
  assert.match(html, /border:5px solid/);
  assert.match(html, /border-radius:17px;/);
});

test('explicit text-logo sizes override theme defaults and section alignment rejects invalid values', async () => {
  const sizes = { small: 18, medium: 26, large: 38 };
  for (const [size, pixels] of Object.entries(sizes)) {
    const html = await TemplateFactory.createTemplate(ThemeType.OCEAN, 'light', {
      ...config, header: { ...config.header, logo: { type: 'text', text: 'Sized brand', size } }
    }).render({});
    const logoIndex = html.indexOf('>Sized brand</div>');
    const block = html.slice(html.lastIndexOf('<div style=', logoIndex), logoIndex);
    assert.ok(block.includes(`font-size:${pixels}px;`));
  }
  await assert.rejects(() => TemplateFactory.createTemplate(ThemeType.MODERN, 'light', { ...config, header: { ...config.header, alignment: 'diagonal' } }).render({}), /Invalid section alignment/);
});
