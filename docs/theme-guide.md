# Choosing and customizing a theme

## Browse the themes

Use the [interactive theme gallery](../examples/theme-gallery.html) to compare the library's 34 themes in light and dark appearances. The same English sample message is used throughout, so you can compare the complete header, content layout, call to action, footer, spacing, and colors. Search by theme name or layout, then open a full-size desktop or mobile preview. The gallery works offline.

Choose a theme for its complete visual character rather than its palette alone. For example, **Editorial** uses a literary, serif-led rhythm; **Neo Brutal** uses bold geometry and high-contrast color; **Mint** organizes the message as a compact two-column digest. Your actual brand name and message will replace the gallery's sample content.

List the available choices and inspect their descriptions in code:

```typescript
import { TemplateFactory, ThemeType } from '@zyther/tzmail';

for (const theme of TemplateFactory.listThemes()) {
  const info = TemplateFactory.getThemeInfo(theme);
  console.log(theme, info.name, info.description);
}
```

## Preview before sending

Use `previewTemplate()` while building or updating an email. It returns rendered HTML without sending a message:

```typescript
const service = mailer.getTemplateService();
const html = await service.previewTemplate(ThemeType.EDITORIAL, 'light', {
  header: {
    show: true,
    logo: { type: 'text', text: 'Field Notes' }
  },
  body: {
    title: 'A more thoughtful arrival.',
    message: 'Give the idea room, the message clarity, and the next step a clear purpose.',
    buttonText: 'Explore what comes next',
    buttonUrl: 'https://example.com/updates'
  },
  footer: {
    show: true,
    links: [{ text: 'Preferences', url: 'https://example.com/preferences' }],
    unsubscribeText: 'Unsubscribe',
    unsubscribeUrl: 'https://example.com/unsubscribe'
  }
});
```

Pass `'light'` or `'dark'` as the second argument. Built-in themes provide deliberate defaults for header, body, button, and footer alignment. To override them, set `header.alignment`, `body.alignment`, or `footer.alignment` to `'left'`, `'center'`, or `'right'`. The button follows body alignment unless `body.buttonAlignment` is supplied.

## Adjust section colors and links

Set `backgroundColor` and `textColor` on the header, body, or footer when the email needs brand-specific colors. The renderer checks contrast against the effective background and chooses a readable text color if the requested combination is too faint. Theme accents remain available for borders and buttons.

Footer navigation, social links, and unsubscribe links are plain text links by default. Set `linkDecoration: 'underline'` in the template configuration to underline footer links consistently.

The gallery does not rely on images. Text logos, header details, and layout remain complete when no remote assets are supplied. You can still provide an image logo or hero image when the content calls for one.

## Custom themes

Custom `ITheme` objects can provide a composition for a fully tailored layout. Existing custom themes do not have to add one: when `composition` is omitted, the library uses a conservative layout and continues to use the theme's existing font family, title size and weight, body padding, and button appearance settings.

A text logo uses the theme's default scale when its `size` is omitted. Set `size: 'small'`, `'medium'`, or `'large'` to choose an explicit logo size.

## Email-client expectations

The themes use table-based layouts and inline styles for broad email-client support. On narrow screens, multi-column sections stack and calls to action expand to the available width. Colors and rounded or offset details may appear differently in clients that apply their own dark-mode transformations or omit progressive CSS enhancements. Always preview a representative message with the email clients your audience uses before a large send.
