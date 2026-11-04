const fs = require('node:fs');
const path = require('node:path');
const { TemplateFactory } = require('../dist/factories/template-factory.js');

const galleryPath = path.join(__dirname, '..', 'examples', 'theme-gallery.html');
const config = {
  language: 'en',
  direction: 'ltr',
  preheader: 'A quick look at your latest Northstar update.',
  header: { show: true, logo: { type: 'text', text: 'northstar' } },
  body: {
    alignment: 'center',
    title: 'A clearer view of what matters.',
    message: 'Your latest update is ready. Explore the highlights, then pick up right where you left off.',
    buttonText: 'View your update',
    buttonUrl: 'https://example.com/update'
  },
  footer: {
    show: true,
    links: [
      { text: 'Help center', url: 'https://example.com/help' },
      { text: 'Preferences', url: 'https://example.com/preferences' }
    ],
    copyrightText: '© 2026 Northstar. Made for your inbox.',
    unsubscribeText: 'Unsubscribe',
    unsubscribeUrl: 'https://example.com/unsubscribe'
  }
};

async function main() {
  const themes = await Promise.all(TemplateFactory.listThemes().map(async (type) => {
    const theme = TemplateFactory.getTheme(type);
    const previews = {};
    for (const mode of ['light', 'dark']) {
      previews[mode] = await TemplateFactory.createTemplate(type, mode, config).render({});
    }
    return { type, name: theme.name, colors: { light: theme.light, dark: theme.dark }, previews };
  }));

  const html = fs.readFileSync(galleryPath, 'utf8');
  const dataBlock = /(<script id="gallery-data" type="application\/json">)[\s\S]*?(<\/script>)/;
  if (!dataBlock.test(html)) throw new Error('Gallery data block was not found; refusing to overwrite the page.');
  const payload = JSON.stringify(themes).replace(/</g, '\\u003c');
  const updated = html.replace(dataBlock, `$1${payload}$2`);
  fs.writeFileSync(galleryPath, updated);
  console.log(`Updated ${galleryPath} with ${themes.length} themes and ${themes.length * 2} rendered previews.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
