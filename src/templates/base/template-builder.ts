import { ITemplateConfig } from '../../core/interfaces/template.interface';
import { ITheme } from '../themes/theme.interface';
import { resolveThemeComposition, surfaceColor } from '../themes/theme-composition';
import { MonokaiTheme } from '../themes/monokai.theme';
import { accessibleTextColor, contrastRatio, normalizeCssColor, readableTextColor } from './color-accessibility';
import { renderThemeHeader } from './header-composition';
import { renderThemeFooter } from './footer-composition';
import { BodyContent, renderThemeBody } from './body-composition';

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!));
}
function safeHref(value: string): string {
  if (typeof value !== 'string' || !value.trim() || /[\u0000-\u0020"'<>\\]/.test(value)) throw new Error('Unsafe URL in template');
  let url: URL;
  try { url = new URL(value); } catch { throw new Error('Template URLs must be absolute'); }
  if (!['http:', 'https:', 'mailto:'].includes(url.protocol.toLowerCase())) throw new Error('Unsafe URL scheme in template');
  return escapeHtml(value);
}

/** Email-safe structure is composed from the theme, never from a fixed theme-id layout map. */
export class TemplateBuilder {
  private preheader = '';
  private header = '';
  private footer = '';
  private content: BodyContent = { html: '' };
  private button = '';

  constructor(private theme: ITheme, private config: ITemplateConfig, private variant: 'light' | 'dark') {}

  private get design() { return resolveThemeComposition(this.theme); }

  buildPreheader(): this {
    const preheader = this.config.preheader;
    if (preheader) this.preheader = `<div aria-hidden="true" style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;max-height:0;max-width:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;">${escapeHtml(preheader)}</div>`;
    return this;
  }

  buildHeader(content?: string): this {
    this.header = renderThemeHeader(this.theme, this.config, this.variant, content);
    return this;
  }

  buildMessage(title: string, message: string, fontSize: number): this {
    this.content = { title, message, fontSize };
    return this;
  }

  /** Explicitly trusted HTML still receives the theme's outer composition, not rewritten headings. */
  buildBody(content: string): this {
    const colors = this.theme[this.variant];
    const background = normalizeCssColor(this.config.body?.backgroundColor ?? surfaceColor(this.design.body.surface, colors), colors.background) ?? colors.background;
    const textColor = readableTextColor(this.config.body?.textColor ?? colors.text, background, colors.text);
    let html = content;
    if (this.theme.id === 'corporate') {
      const quoteColor = readableTextColor(colors.textMuted, background, textColor);
      html = html
        .replace(/<blockquote(?:\s[^>]*)?>([\s\S]*?)<\/blockquote>/gi, (_match, quote) => `<blockquote style="border-left:3px solid ${colors.primary};margin:24px 0;padding:16px 24px;font-style:italic;color:${quoteColor};">${quote}</blockquote>`)
        .replace(/<highlight(?:\s[^>]*)?>([\s\S]*?)<\/highlight>/gi, (_match, text) => `<span style="background-color:${colors.border};padding:0 4px;font-weight:bold;color:${readableTextColor(colors.text, colors.border, textColor)};">${text}</span>`);
    }
    if (this.theme.id === 'monokai' && html.includes('<code>')) html = this.highlightCode(html, background, textColor);
    this.content = { html };
    return this;
  }

  private highlightCode(content: string, background: string, textColor: string): string {
    const monokai = this.theme as MonokaiTheme;
    const colors = this.theme[this.variant];
    const style = `margin:24px 0;background-color:${background};color:${textColor};padding:20px;border:1px solid ${colors.border};font-family:${this.theme.typography.fontFamily};font-size:13px;line-height:1.6;white-space:pre-wrap;word-wrap:break-word;`;
    return content.replace(/<code(?:\s[^>]*)?>([\s\S]*?)<\/code>/gi, (_match, code) => `<pre style="${escapeHtml(style)}">${this.applySyntaxHighlighting(code, monokai, background, textColor)}</pre>`);
  }

  private applySyntaxHighlighting(code: string, monokai: MonokaiTheme, background: string, textColor: string): string {
    const keywords = new Set(['function', 'const', 'let', 'var', 'if', 'else', 'return', 'import', 'from']);
    const tokenPattern = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:function|const|let|var|if|else|return|import|from)\b|\b\d+\b|\b[A-Za-z_$][\w$]*(?=\s*\()/g;
    let result = '';
    let lastIndex = 0;
    for (const match of code.matchAll(tokenPattern)) {
      const token = match[0];
      const index = match.index ?? 0;
      result += escapeHtml(code.slice(lastIndex, index));
      const preferred = token.startsWith('"') || token.startsWith("'") ? monokai.codeHighlight.string
        : /^\d+$/.test(token) ? monokai.codeHighlight.number
          : keywords.has(token) ? monokai.codeHighlight.keyword : monokai.codeHighlight.function;
      const color = contrastRatio(preferred, background) >= 4.5 ? preferred : textColor;
      result += `<span style="color:${color};">${escapeHtml(token)}</span>`;
      lastIndex = index + token.length;
    }
    return result + escapeHtml(code.slice(lastIndex));
  }

  buildButton(text: string, url: string, variant: 'primary' | 'secondary' | 'success' | 'danger' = 'primary'): this {
    if (!['primary', 'secondary', 'success', 'danger'].includes(variant)) throw new Error('Invalid CTA variant');
    const href = safeHref(url);
    const colors = this.theme[this.variant];
    const color = variant === 'primary' ? colors.primary : variant === 'secondary' ? colors.secondary : variant === 'success' ? colors.success : colors.error;
    const style = this.design.button;
    const tokens = this.theme.emailStyles?.button;
    const surface = normalizeCssColor(this.config.body?.backgroundColor ?? surfaceColor(this.design.body.surface, colors), colors.background) ?? colors.background;
    const outline = ['outline', 'editorial'].includes(style.style);
    const background = outline ? surface : color;
    const foreground = outline ? readableTextColor(color, surface, colors.text) : accessibleTextColor(color);
    const alignment = this.config.body?.buttonAlignment ?? this.config.body?.alignment ?? this.design.body.alignment;
    const isEditorial = style.style === 'editorial';
    const borderWidth = !this.theme.composition ? tokens?.borderWidth ?? (outline ? '1px' : '0px') : outline || style.style === 'offset' ? '2px' : '0px';
    const border = isEditorial ? 'none' : `${borderWidth} solid ${color}`;
    const radius = style.style === 'pill' ? '999px' : style.style === 'offset' || isEditorial ? '0px' : tokens?.borderRadius ?? '8px';
    const shadow = !this.theme.composition ? tokens?.boxShadow ?? 'none' : style.style === 'offset' ? `4px 4px 0 ${colors.text}` : 'none';
    const css = `display:${style.fullWidth ? 'block' : 'inline-block'};box-sizing:border-box;max-width:100%;padding: ${style.paddingY}px ${style.paddingX}px; background-color: ${background}; border:${border};${isEditorial ? `border-bottom:2px solid ${color};` : ''}border-radius:${radius};box-shadow:${shadow};color: ${foreground}; font-family:${this.theme.typography.fontFamily};font-size:15px;font-weight:700;line-height:1.3;letter-spacing:${tokens?.letterSpacing ?? '0'};text-transform:${tokens?.textTransform ?? 'none'};text-decoration:none !important;`;
    this.button = `<table class="button" align="${alignment}" data-button-style="${style.style}" ${style.fullWidth ? 'width="100%"' : ''} cellpadding="0" cellspacing="0" role="presentation" style="${style.fullWidth ? 'width:100%;' : ''}margin:${alignment === 'center' ? '0 auto' : alignment === 'right' ? '0 0 0 auto' : '0'};">
      <tr><td align="${alignment}"><a class="button-link" href="${href}" style="${escapeHtml(css)}">${escapeHtml(text)}</a></td></tr>
    </table>`;
    return this;
  }

  buildFooter(): this {
    this.footer = renderThemeFooter(this.theme, this.config, this.variant);
    return this;
  }

  build(): string {
    const colors = this.theme[this.variant];
    const styles = this.theme.emailStyles;
    const direction = this.config.direction ?? 'ltr';
    if (!['ltr', 'rtl', 'auto'].includes(direction)) throw new Error('Invalid template text direction');
    const maxWidth = Math.min(800, Math.max(320, styles?.maxWidthPx ?? 600));
    const borderColor = styles?.container.borderColor === 'none' ? '' : colors[styles?.container.borderColor ?? 'border'];
    const border = borderColor ? `${styles?.container.borderWidth ?? '1px'} solid ${borderColor}` : 'none';
    const customRadius = this.config.borderRadius ? { none: '0px', small: '4px', medium: '12px', large: '24px' }[this.config.borderRadius] : undefined;
    const radius = customRadius ?? styles?.container.borderRadius ?? '0px';
    const canvas = this.design.canvas[this.variant];
    const body = renderThemeBody(this.theme, this.config, this.variant, this.content, this.button);
    const containerStyles = `width:100%;max-width:${maxWidth}px;margin:0 auto;background-color: ${colors.background};border:${border};border-radius:${radius};box-shadow:${styles?.container.boxShadow ?? 'none'};border-collapse:separate;table-layout:fixed;overflow:hidden;`;
    return `<!DOCTYPE html>
<html lang="${escapeHtml(this.config.language ?? 'en')}" dir="${escapeHtml(direction)}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="${this.variant}"><meta name="supported-color-schemes" content="${this.variant}">
  <meta name="x-apple-disable-message-reformatting"><meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>Email template</title>
  <style>
    :root { color-scheme:${this.variant}; supported-color-schemes:${this.variant}; }
    body { margin:0 !important;padding:0 !important;width:100% !important;background-color:${canvas}; }
    table { mso-table-lspace:0pt;mso-table-rspace:0pt; }
    img { border:0;max-width:100%;height:auto; }
    .container { width:100%;max-width:${maxWidth}px; }
    .theme-header,.theme-body,.theme-footer { table-layout:fixed; }
    .button-link { overflow-wrap:anywhere;word-break:break-word; }
    .button { max-width:100%; }
    @media only screen and (max-width: 600px) {
      .outer-cell { padding:16px 8px !important; }
      .container { width:100% !important;max-width:100% !important; }
      .email-header-cell,.email-body,.email-footer-cell { padding-left:20px !important;padding-right:20px !important; }
      .layout-column { display:block !important;width:100% !important;box-sizing:border-box !important; }
      .layout-column + .layout-column { margin-top:20px !important; }
      .body-copy-column { border-left:0 !important;padding-left:0 !important; }
      .body-title-column { padding-right:0 !important; }
      .footer-meta-column,.footer-ledger-nav { border-left:0 !important;padding-left:0 !important; }
      .copy-measure { width:100% !important;max-width:100% !important; }
      .button { width:100% !important; }
      .button-link { box-sizing:border-box !important;display:block !important;width:100% !important;text-align:center !important; }
      .footer-links { width:100% !important; }
      .footer-link-cell { box-sizing:border-box !important;display:block !important;width:100% !important;padding:6px 0 !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${canvas};">
  <table class="email-page" width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="${canvas}" style="width:100%;background-color:${canvas};">
    <tr><td class="outer-cell" align="center" style="padding:40px 16px;">
      <table class="container" width="${maxWidth}" cellpadding="0" cellspacing="0" role="presentation" bgcolor="${colors.background}" style="${escapeHtml(containerStyles)}">
        <tr><td class="container-content" style="padding:0;">${this.preheader}${this.header}${body}${this.footer}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
  }
}
