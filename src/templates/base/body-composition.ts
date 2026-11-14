import { ITemplateConfig } from '../../core/interfaces/template.interface';
import { ITheme } from '../themes/theme.interface';
import { resolveThemeComposition, surfaceColor } from '../themes/theme-composition';
import { normalizeCssColor, readableTextColor } from './color-accessibility';

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
const table = (content: string, styles = '', extra = '') => `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" ${extra} style="width:100%;table-layout:fixed;${escapeHtml(styles)}">${content}</table>`;

export type BodyContent = { title: string; message: string; fontSize: number } | { html: string };

export function renderThemeBody(theme: ITheme, config: ITemplateConfig, variant: 'light' | 'dark', content: BodyContent, button: string): string {
  const colors = theme[variant];
  const design = resolveThemeComposition(theme);
  const body = design.body;
  const alignment = config.body?.alignment ?? body.alignment;
  const background = normalizeCssColor(config.body?.backgroundColor ?? surfaceColor(body.surface, colors), colors.background) ?? colors.background;
  const foreground = readableTextColor(config.body?.textColor ?? colors.text, background, colors.text);
  const rhythm = config.spacing === 'compact' ? 0.75 : config.spacing === 'relaxed' ? 1.25 : 1;
  const paddingY = Math.round(body.paddingY * rhythm);
  const paddingX = body.paddingX;
  const titleStyle = `margin: 0; color: ${foreground}; font-family: ${body.titleFont}; font-size: ${body.titleSize}px; font-weight: ${body.titleWeight}; line-height: ${body.titleLineHeight}; letter-spacing: ${body.titleTracking}; text-align: ${alignment}; overflow-wrap:anywhere; word-wrap:break-word; word-break:break-word;`;
  const fontSize = 'fontSize' in content ? content.fontSize : (config.body?.fontSize ?? Number.parseFloat(theme.typography.fontSizes.medium));
  const copyStyle = `margin: 0; color: ${foreground}; font-family: ${theme.typography.fontFamily}; font-size: ${fontSize}px; line-height: ${theme.emailStyles?.body.lineHeight ?? 1.65}; text-align: ${alignment};overflow-wrap:anywhere;word-break:break-word;`;
  const heading = 'title' in content ? `<h2 style="${escapeHtml(titleStyle)}">${escapeHtml(content.title)}</h2>` : '';
  const message = 'message' in content ? `<p style="${escapeHtml(copyStyle)}">${escapeHtml(content.message).replace(/\n/g, '<br>')}</p>` : content.html;
  const copy = table(`<tr><td align="${alignment}" style="padding: 0; text-align: ${alignment}; background-color: ${background}; color: ${foreground}; font-size: ${fontSize}px; font-family: ${escapeHtml(theme.typography.fontFamily)};">${message}</td></tr>`);
  const headingRow = heading ? `<tr><td align="${alignment}" style="padding:0 0 24px;">${heading}</td></tr>` : '';
  const action = button ? `<tr><td style="padding-top:28px;">${button}</td></tr>` : '';
  const measuredCopy = `<table width="${Math.min(body.measurePx, 540)}" align="${alignment}" cellpadding="0" cellspacing="0" role="presentation" class="copy-measure" style="width:100%;max-width:${body.measurePx}px;table-layout:fixed;"><tr><td>${copy}</td></tr></table>`;
  const flow = table(`${headingRow}<tr><td align="${alignment}">${measuredCopy}</td></tr>${action}`);
  const rule = (width: string, height: number, color = colors.primary) => `<table align="${alignment}" width="${width}" cellpadding="0" cellspacing="0" role="presentation" aria-hidden="true" style="width:${width};"><tr><td height="${height}" bgcolor="${color}" style="height:${height}px;line-height:${height}px;font-size:0;background-color:${color};">&nbsp;</td></tr></table>`;
  const layout = 'html' in content ? (body.layout === 'columns' ? 'story' : body.layout) : body.layout;
  let composition: string;
  switch (layout) {
    case 'columns':
      composition = table(`<tr>
        <td class="layout-column body-title-column" width="46%" valign="top" align="${alignment}" style="width:46%;padding:0 24px 0 0;">${heading}</td>
        <td class="layout-column body-copy-column" width="54%" valign="top" style="width:54%;border-left:1px solid ${colors.border};padding:8px 0 0 24px;">${table(`<tr><td>${copy}</td></tr>${action}`)}</td>
      </tr>`, '', 'class="body-columns"');
      break;
    case 'panel':
      composition = table(`<tr><td style="padding:24px;border:1px solid ${colors.border};border-top:8px solid ${colors.primary};border-radius:${theme.emailStyles?.body.borderRadius ?? '16px'};background-color:${background};">${flow}</td></tr>`, '', 'class="body-panel"');
      break;
    case 'accent-rail':
      composition = table(`<tr><td width="8" bgcolor="${colors.primary}" aria-hidden="true" style="width:8px;font-size:0;background-color:${colors.primary};">&nbsp;</td><td style="padding:0 0 0 28px;">${flow}</td></tr>`, '', 'class="body-accent-rail"');
      break;
    case 'manifesto':
      composition = table(`${headingRow}<tr><td align="${alignment}" style="padding:4px 0 28px;">${rule('72px', 6)}</td></tr><tr><td align="${alignment}">${measuredCopy}</td></tr>${action}`, '', 'class="body-manifesto"');
      break;
    case 'letter':
      composition = table(`${headingRow}<tr><td style="padding-top:8px;padding-bottom:28px;border-bottom:1px solid ${colors.border};" align="${alignment}">${measuredCopy}</td></tr>${action}`, '', 'class="body-letter"');
      break;
    case 'outline':
      composition = table(`<tr><td style="border:2px solid ${colors.primary};padding:28px;">${flow}</td></tr>`, '', 'class="body-outline"');
      break;
    case 'index':
      composition = table(`${heading ? `<tr><td style="padding:0 0 24px;border-bottom:3px solid ${colors.text};">${heading}</td></tr>` : ''}<tr><td style="padding-top:24px;">${table(`<tr><td width="32" valign="top" aria-hidden="true" style="width:32px;padding-top:7px;">${rule('12px', 12)}</td><td>${table(`<tr><td>${copy}</td></tr>${action}`)}</td></tr>`)}</td></tr>`, '', 'class="body-index"');
      break;
    default:
      composition = flow;
  }
  const legacy = !theme.composition && theme.emailStyles?.body;
  const legacyAccent = legacy && legacy.accentColor !== 'none' ? `border-left:${legacy.accentWidth} solid ${colors[legacy.accentColor]};` : '';
  const legacyEffects = legacy ? `border-radius:${legacy.borderRadius};box-shadow:${legacy.boxShadow};` : '';
  return `<table class="theme-body theme-body-${layout}" data-body-layout="${layout}" width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="${background}" style="width:100%;background-color:${background};">
    <tr><td class="email-body" data-surface="${background}" style="padding:${paddingY}px ${paddingX}px; background-color: ${background}; color: ${foreground}; font-family:${escapeHtml(theme.typography.fontFamily)};word-wrap:break-word;overflow-wrap:break-word;${escapeHtml(legacyAccent + legacyEffects)}">${composition}</td></tr>
  </table>`;
}
