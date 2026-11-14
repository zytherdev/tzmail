const fs = require('node:fs');
const path = require('node:path');
const { TemplateFactory } = require('../dist/factories/template-factory.js');

const galleryPath = path.join(__dirname, '..', 'examples', 'theme-gallery.html');
const sampleConfig = {
  language: 'en',
  preheader: 'A more thoughtful way to share what matters.',
  header: { show: true, logo: { type: 'text', text: 'northstar' } },
  body: {
    title: 'A more thoughtful arrival.',
    message: 'A meaningful update deserves more than a box of text. Give the idea room, the message clarity, and the next step a clear purpose.',
    buttonText: 'Explore what comes next',
    buttonUrl: 'https://example.com/chapter'
  },
  footer: {
    show: true,
    links: [{ text: 'Help', url: 'https://example.com/help' }, { text: 'Preferences', url: 'https://example.com/preferences' }],
    copyrightText: '© 2026 Northstar. Made to connect.',
    unsubscribeText: 'Unsubscribe',
    unsubscribeUrl: 'https://example.com/unsubscribe'
  }
};

async function main() {
  const themes = await Promise.all(TemplateFactory.listThemes().map(async type => {
    const theme = TemplateFactory.getTheme(type);
    const design = theme.composition;
    if (!design) throw new Error(`${type} is missing its structural redesign`);
    const previews = {};
    for (const mode of ['light', 'dark']) {
      previews[mode] = await TemplateFactory.createTemplate(type, mode, sampleConfig).render({ headerContent: 'Product & community' });
    }
    return {
      type, name: theme.name, direction: design.name, description: design.description,
      headerMode: design.header.layout, bodyMode: design.body.layout, footerMode: design.footer.layout,
      alignment: design.body.alignment, buttonAlignment: design.body.alignment,
      colors: { light: theme.light, dark: theme.dark }, previews
    };
  }));
  const html = fs.readFileSync(galleryPath, 'utf8');
  const dataBlock = /(<script id="gallery-data" type="application\/json">)[\s\S]*?(<\/script>)/;
  if (!dataBlock.test(html)) throw new Error('Gallery data block was not found; refusing to overwrite the page.');
  const payload = JSON.stringify(themes).replace(/</g, '\\u003c');
  fs.writeFileSync(galleryPath, html.replace(dataBlock, `$1${payload}$2`));
  console.log(`Updated ${galleryPath}: ${themes.length} redesigned themes, ${themes.length * 2} image-free previews.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
