
import { ITemplateConfig } from '../../core/interfaces/template.interface';
import { ITheme, IThemeColorToken, IThemeColors, IThemeEmailStyles } from '../themes/theme.interface';
import { MonokaiTheme } from '../themes/monokai.theme';
import { accessibleTextColor, contrastRatio, readableTextColor } from './color-accessibility';

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!));
}

function safeHref(value: string, allowMailto = false): string {
  if (typeof value !== 'string' || !value.trim() || /[\u0000-\u0020"'<>\\]/.test(value)) throw new Error('Unsafe URL in template');
  let url: URL;
  try { url = new URL(value); } catch { throw new Error('Template URLs must be absolute'); }
  const schemes = allowMailto ? ['http:', 'https:', 'mailto:'] : ['http:', 'https:'];
  if (!schemes.includes(url.protocol.toLowerCase())) throw new Error('Unsafe URL scheme in template');
  return escapeHtml(value);
}


const DEFAULT_EMAIL_STYLES: IThemeEmailStyles = {
  maxWidthPx: 600,
  container: { borderColor: 'border', borderWidth: '1px', borderRadius: '8px', boxShadow: 'none' },
  header: { accentColor: 'border', accentWidth: '1px', horizontalPadding: '24px', logoColor: 'text', imageBorderRadius: '0px' },
  body: { accentColor: 'none', accentWidth: '0px', borderRadius: '0px', boxShadow: 'none', horizontalPadding: '24px', lineHeight: 1.6 },
  button: { appearance: 'solid', borderRadius: '6px', borderWidth: '0px', boxShadow: 'none' },
  footer: { accentColor: 'border', accentWidth: '1px' }
};

function colorFor(token: IThemeColorToken, colors: IThemeColors): string | undefined {
  return token === 'none' ? undefined : colors[token];
}

function borderFor(token: IThemeColorToken, width: string, colors: IThemeColors): string {
  const color = colorFor(token, colors);
  return !color || !width || Number.parseFloat(width) <= 0 ? 'none' : `${width} solid ${color}`;
}

export class TemplateBuilder {
  private template: string = '';
  private theme: ITheme;
  private config: ITemplateConfig;
  private variant: 'light' | 'dark';

  constructor(theme: ITheme, config: ITemplateConfig, variant: 'light' | 'dark') {
    this.theme = theme;
    this.config = config;
    this.variant = variant;
  }

  private get emailStyles(): IThemeEmailStyles {
    return this.theme.emailStyles ?? DEFAULT_EMAIL_STYLES;
  }

  buildPreheader(): this {
    const preheader = this.config.preheader;
    if (!preheader) return this;
    this.template += `<div aria-hidden="true" style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;max-height:0;max-width:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;">${escapeHtml(preheader)}</div>`;
    return this;
  }

  private headerAlignment(): 'left' | 'center' {
    return ['corporate', 'editorial', 'forest', 'citrus', 'midnight'].includes(this.theme.id) ? 'left' : 'center';
  }

  private footerAlignment(): 'left' | 'center' {
    return ['corporate', 'editorial', 'forest', 'citrus'].includes(this.theme.id) ? 'left' : 'center';
  }

  private isEditorialLayout(): boolean {
    return ['corporate', 'editorial', 'citrus', 'midnight'].includes(this.theme.id);
  }

  private visualPlan(): { header: 'split' | 'stacked' | 'editorial' | 'compact' | 'hero' | 'rail' | 'band'; body: 'card' | 'editorial' | 'technical' | 'open' | 'inset' | 'callout' | 'frame'; footer: 'split' | 'editorial' | 'compact' | 'stacked' | 'bar' | 'minimal' } {
    const plans: Record<string, { header: 'split' | 'stacked' | 'editorial' | 'compact' | 'hero' | 'rail' | 'band'; body: 'card' | 'editorial' | 'technical' | 'open' | 'inset' | 'callout' | 'frame'; footer: 'split' | 'editorial' | 'compact' | 'stacked' | 'bar' | 'minimal' }> = {
      system: { header: 'compact', body: 'open', footer: 'minimal' },
      monokai: { header: 'rail', body: 'technical', footer: 'bar' },
      modern: { header: 'split', body: 'card', footer: 'split' },
      corporate: { header: 'editorial', body: 'editorial', footer: 'editorial' },
      minimal: { header: 'compact', body: 'frame', footer: 'compact' },
      aurora: { header: 'hero', body: 'inset', footer: 'stacked' },
      ocean: { header: 'band', body: 'callout', footer: 'bar' },
      sunset: { header: 'stacked', body: 'frame', footer: 'split' },
      lavender: { header: 'split', body: 'inset', footer: 'minimal' },
      forest: { header: 'editorial', body: 'editorial', footer: 'stacked' },
      editorial: { header: 'editorial', body: 'open', footer: 'editorial' },
      pastel: { header: 'band', body: 'card', footer: 'split' },
      neobrutal: { header: 'rail', body: 'frame', footer: 'bar' },
      glass: { header: 'compact', body: 'inset', footer: 'minimal' },
      midnight: { header: 'hero', body: 'callout', footer: 'editorial' },
      saas: { header: 'split', body: 'inset', footer: 'split' },
      citrus: { header: 'editorial', body: 'frame', footer: 'bar' },
      berry: { header: 'band', body: 'card', footer: 'stacked' },
      paper: { header: 'hero', body: 'editorial', footer: 'minimal' },
      neon: { header: 'rail', body: 'frame', footer: 'bar' },
      alpine: { header: 'split', body: 'callout', footer: 'split' },
      orbit: { header: 'band', body: 'inset', footer: 'bar' },
      linen: { header: 'stacked', body: 'open', footer: 'editorial' },
      bloom: { header: 'stacked', body: 'card', footer: 'stacked' },
      slate: { header: 'hero', body: 'technical', footer: 'minimal' },
      marigold: { header: 'stacked', body: 'callout', footer: 'bar' },
      inkwell: { header: 'compact', body: 'editorial', footer: 'bar' },
      tide: { header: 'band', body: 'open', footer: 'minimal' },
      clay: { header: 'editorial', body: 'card', footer: 'compact' },
      cloud: { header: 'split', body: 'open', footer: 'stacked' },
      campus: { header: 'rail', body: 'inset', footer: 'editorial' },
      noir: { header: 'hero', body: 'frame', footer: 'bar' },
      mint: { header: 'band', body: 'technical', footer: 'split' },
      saffron: { header: 'split', body: 'callout', footer: 'minimal' }
    };
    return plans[this.theme.id] || { header: 'stacked', body: 'open', footer: 'stacked' };
  }

  private headerLayout(): 'split' | 'stacked' | 'editorial' | 'compact' | 'hero' | 'rail' | 'band' {
    return this.visualPlan().header;
  }

  private bodyLayout(): 'card' | 'editorial' | 'technical' | 'open' | 'inset' | 'callout' | 'frame' {
    return this.visualPlan().body;
  }

  private footerLayout(): 'split' | 'editorial' | 'compact' | 'stacked' | 'bar' | 'minimal' {
    return this.visualPlan().footer;
  }

  buildHeader(content?: string): this {
    if (!this.config.header?.show) return this;

    const colors = this.variant === 'light' ? this.theme.light : this.theme.dark;
    const styles = this.emailStyles.header;
    const headerBorder = borderFor(styles.accentColor, styles.accentWidth, colors);
    const headerBackground = this.config.header?.backgroundColor || colors.background;
    const headerTextColor = readableTextColor(this.config.header?.textColor || colors.text, headerBackground, colors.text);
    const alignment = this.headerAlignment();
    const headerStyles = `
      background-color: ${headerBackground};
      color: ${headerTextColor};
      padding: 18px ${styles.horizontalPadding};
      border-bottom: ${headerBorder};
      font-family: ${this.theme.typography.fontFamily};
      text-align: ${alignment};
    `;
    const layout = this.headerLayout();
    const logoHtml = this.buildLogo(layout === 'split' || layout === 'rail' ? 'left' : alignment);
    const heroHtml = this.config.header?.heroImageUrl
      ? `<table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td align="${alignment}" style="padding:0 0 ${this.theme.spacing.md} 0;"><img src="${safeHref(this.config.header.heroImageUrl)}" alt="${escapeHtml(this.config.header.heroAlt || '')}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;border-radius:${['paper', 'editorial'].includes(this.theme.id) ? '0px' : styles.imageBorderRadius};" /></td></tr></table>`
      : '';
    const headerContentHtml = content ? `<div style="font-size:13px;line-height:1.4;color:${headerTextColor};text-align:${alignment};">${escapeHtml(content)}</div>` : '';
    const composedHeader = (layout === 'split' || layout === 'rail') && content
      ? `<table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td valign="middle" align="left" style="width:${layout === 'rail' ? '34%' : '42%'};">${logoHtml}</td><td valign="middle" align="right" style="width:${layout === 'rail' ? '66%' : '58%'};padding-left:16px;${layout === 'rail' ? `border-left:2px solid ${colors.primary};` : ''}">${headerContentHtml}</td></tr></table>`
      : layout === 'band'
        ? `<div style="border:1px solid ${colors.border};border-radius:${styles.imageBorderRadius};padding:14px 18px;">${logoHtml}${content ? `<div style="padding-top:8px;text-align:${alignment};">${headerContentHtml}</div>` : ''}</div>`
      : layout === 'editorial'
        ? `${logoHtml}${content ? `<div style="padding-top:${this.theme.spacing.sm};text-align:${alignment};">${headerContentHtml}</div>` : ''}`
        : `${logoHtml}${content ? `<div style="padding-top:${this.theme.spacing.sm};text-align:${alignment};">${headerContentHtml}</div>` : ''}`;

    this.template += `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="${headerBackground}" style="width:100%;background-color:${headerBackground};">
        <tr>
          <td class="email-header-cell" style="${escapeHtml(headerStyles)}" align="${alignment}">
            ${heroHtml}
            ${composedHeader}
          </td>
        </tr>
      </table>
    `;
    return this;
  }

  private buildLogo(alignment: 'left' | 'center' = this.headerAlignment()): string {
    const logo = this.config.header?.logo;
    if (!logo) return '';

    const colors = this.variant === 'light' ? this.theme.light : this.theme.dark;
    const styles = this.emailStyles.header;
    if (logo.type === 'text') {
      const logoBackground = this.config.header?.backgroundColor || colors.background;
      const preferredColor = this.config.header?.textColor || colors[styles.logoColor];
      const logoColor = readableTextColor(preferredColor, logoBackground, colors.text);
      const textStyles = `
        display: inline-block;
        max-width: 100%;
        font-family: ${styles.logoFontFamily || this.theme.typography.fontFamily};
        font-size: 18px;
        font-weight: ${this.theme.typography.fontWeights.medium};
        line-height: 1.2;
        color: ${logoColor};
        text-transform: ${styles.logoTextTransform || 'none'};
        letter-spacing: ${styles.logoLetterSpacing || 'normal'};
        ${this.isEditorialLayout() ? `border-bottom: 2px solid ${colors.primary}; padding-bottom: 6px;` : ''}
        ${this.theme.id === 'neobrutal' ? `border: 2px solid ${colors.primary}; padding: 8px 12px; box-shadow: 4px 4px 0 ${colors.border};` : ''}
      `;
      return `<div style="${escapeHtml(textStyles)}">${escapeHtml(logo.text || 'Logo')}</div>`;
    }

    if (logo.type === 'image') {
      const themeHeight = ['minimal', 'system', 'glass', 'noir'].includes(this.theme.id) ? 26 : ['corporate', 'editorial', 'paper', 'linen', 'campus', 'inkwell'].includes(this.theme.id) ? 32 : 36;
      const imageHeight = logo.size === 'small' ? 22 : logo.size === 'large' ? 52 : themeHeight;
      const imageMargin = alignment === 'center' ? '0 auto' : '0';
      return `<img src="${safeHref(logo.imageUrl || '')}" alt="${escapeHtml(logo.alt || 'Logo')}" height="${imageHeight}" style="display:block;width:auto;height:${imageHeight}px;max-width:100%;border:0;border-radius:${styles.imageBorderRadius};margin:${imageMargin};" />`;
    }
    return '';
  }

  buildBody(content: string): this {
    const colors = this.variant === 'light' ? this.theme.light : this.theme.dark;
    const styles = this.emailStyles.body;
    const bodyBackground = this.config.body?.backgroundColor || colors.background;
    const bodyTextColor = readableTextColor(this.config.body?.textColor || colors.text, bodyBackground, colors.text);
    const accentBorder = borderFor(styles.accentColor, styles.accentWidth, colors);
    let processedContent = content;
    if (this.theme.id === 'corporate') processedContent = this.formatCorporateContent(content, bodyBackground, bodyTextColor);
    else if (this.theme.id === 'minimal') processedContent = this.formatMinimalContent(content, bodyTextColor);
    else if (this.theme.id === 'monokai' && content.includes('<code>')) processedContent = this.highlightCode(content, bodyBackground, bodyTextColor);

    const bodyLayout = this.bodyLayout();
    const framedContent = bodyLayout === 'card'
        ? `<div style="border:1px solid ${colors.border};border-radius:${styles.borderRadius};padding:18px;">${processedContent}</div>`
      : bodyLayout === 'editorial'
        ? `<div style="border-top:1px solid ${colors.border};padding-top:16px;">${processedContent}</div>`
        : bodyLayout === 'technical'
          ? `<div style="border:1px solid ${colors.border};border-left:3px solid ${colors.primary};padding:16px 18px;background-color:${bodyBackground};">${processedContent}</div>`
          : bodyLayout === 'inset'
            ? `<div style="background-color:${colors.border};padding:4px;border-radius:${styles.borderRadius};"><div style="background-color:${bodyBackground};padding:18px;border-radius:${styles.borderRadius};">${processedContent}</div></div>`
            : bodyLayout === 'callout'
              ? `<div style="border-left:4px solid ${colors.primary};background-color:${colors.border};padding:18px 20px;">${processedContent}</div>`
              : bodyLayout === 'frame'
                ? `<div style="border:1px solid ${colors.primary};padding:18px 20px;border-radius:${styles.borderRadius};">${processedContent}</div>`
                : processedContent;

    const bodyStyles = `
      padding: 24px ${styles.horizontalPadding};
      background-color: ${bodyBackground};
      color: ${bodyTextColor};
      font-family: ${this.theme.typography.fontFamily};
      font-size: ${this.theme.typography.fontSizes.medium};
      line-height: ${styles.lineHeight};
      border-left: ${bodyLayout === 'open' ? accentBorder : '0'};
      border-radius: ${bodyLayout === 'open' ? styles.borderRadius : '0'};
      box-shadow: ${bodyLayout === 'open' ? styles.boxShadow : 'none'};
      word-wrap: break-word;
      overflow-wrap: break-word;
    `;
    this.template += `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="${bodyBackground}" style="width:100%;background-color:${bodyBackground};">
        <tr><td class="email-body" style="${escapeHtml(bodyStyles)}">${framedContent}</td></tr>
      </table>
    `;
    return this;
  }

  private formatCorporateContent(content: string, background: string, textColor: string): string {
    const colors = this.variant === 'light' ? this.theme.light : this.theme.dark;
    const quoteColor = contrastRatio(colors.textMuted, background) >= 4.5 ? colors.textMuted : textColor;
    return content
      .replace(/<blockquote(?:\s[^>]*)?>([\s\S]*?)<\/blockquote>/gi, (_match, quote) => `<blockquote style="border-left:3px solid ${colors.primary};margin:${this.theme.spacing.md} 0;padding:${this.theme.spacing.md};font-style:italic;color:${quoteColor};">${quote}</blockquote>`)
      .replace(/<highlight(?:\s[^>]*)?>([\s\S]*?)<\/highlight>/gi, (_match, text) => `<span style="background-color:${colors.border};padding:0 ${this.theme.spacing.xs};font-weight:bold;color:${readableTextColor(colors.text, colors.border, textColor)};">${text}</span>`);
  }

  private formatMinimalContent(content: string, textColor: string): string {
    const headingSizes: Record<string, string> = { '1': '24px', '2': '20px', '3': '18px', '4': '16px', '5': '14px', '6': '13px' };
    return content
      .replace(/<h([1-6])(?:\s[^>]*)?>/gi, (_match, level: string) => `<h${level} style="font-size:${headingSizes[level]};font-weight:${this.theme.typography.fontWeights.medium};margin:${this.theme.spacing.lg} 0 ${this.theme.spacing.md};line-height:1.3;color:${textColor};">`)
      .replace(/<p(?:\s[^>]*)?>/gi, `<p style="margin:0 0 ${this.theme.spacing.md};">`);
  }

  private highlightCode(content: string, background: string, textColor: string): string {
    const colors = this.variant === 'light' ? this.theme.light : this.theme.dark;
    const monokai = this.theme as MonokaiTheme;
    const radius = this.emailStyles.body.borderRadius;
    const codeStyles = `margin:${this.theme.spacing.md} 0;background-color:${background};color:${textColor};padding:${this.theme.spacing.md};border:1px solid ${colors.border};border-radius:${radius};font-family:${this.theme.typography.fontFamily};font-size:13px;line-height:1.5;white-space:pre-wrap;word-wrap:break-word;`;
    return content.replace(/<code(?:\s[^>]*)?>([\s\S]*?)<\/code>/gi, (_match, code) => `<pre style="${escapeHtml(codeStyles)}">${this.applySyntaxHighlighting(code, monokai, background, textColor)}</pre>`);
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
      const preferredColor = token.startsWith('"') || token.startsWith("'") ? monokai.codeHighlight.string
        : /^\d+$/.test(token) ? monokai.codeHighlight.number
          : keywords.has(token) ? monokai.codeHighlight.keyword : monokai.codeHighlight.function;
      const color = contrastRatio(preferredColor, background) >= 4.5 ? preferredColor : textColor;
      result += `<span style="color:${color};">${escapeHtml(token)}</span>`;
      lastIndex = index + token.length;
    }
    return result + escapeHtml(code.slice(lastIndex));
  }

  buildButton(text: string, url: string, variant: 'primary' | 'secondary' | 'success' | 'danger' = 'primary'): this {
    const colors = this.variant === 'light' ? this.theme.light : this.theme.dark;
    if (!['primary', 'secondary', 'success', 'danger'].includes(variant)) throw new Error('Invalid CTA variant');
    const safeUrl = safeHref(url, true);
    const buttonColor = variant === 'primary' ? colors.primary : variant === 'secondary' ? colors.secondary : variant === 'success' ? colors.success : colors.error;
    const button = this.emailStyles.button;
    const isOutline = button.appearance === 'outline';
    const alignment = this.config.body?.buttonAlignment || this.config.body?.alignment || 'left';
    const buttonTextColor = isOutline
      ? contrastRatio(buttonColor, colors.background) >= 4.5 ? buttonColor : colors.text
      : accessibleTextColor(buttonColor);
    const buttonStyles = `
      display: inline-block;
      box-sizing: border-box;
      max-width: 100%;
      padding: 11px 18px;
      background-color: ${isOutline ? colors.background : buttonColor};
      border: ${button.borderWidth} solid ${isOutline ? buttonColor : 'transparent'};
      border-radius: ${button.borderRadius};
      box-shadow: ${button.boxShadow};
      color: ${buttonTextColor};
      font-family: ${this.theme.typography.fontFamily};
      font-size: 13px;
      font-weight: ${this.theme.typography.fontWeights.bold};
      line-height: 1.3;
      letter-spacing: ${button.letterSpacing || 'normal'};
      text-transform: ${button.textTransform || 'none'};
      text-decoration: none !important;
    `;
    this.template += `
      <table width="100%" class="button-wrap" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tr><td align="${alignment}" style="padding:12px 8px;text-align:${alignment};">
          <table class="button" align="${alignment}" cellpadding="0" cellspacing="0" role="presentation" style="margin:${alignment === 'center' ? '0 auto' : alignment === 'right' ? '0 0 0 auto' : '0'};">
            <tr><td align="${alignment}"><a class="button-link" href="${safeUrl}" style="${escapeHtml(buttonStyles)}">${escapeHtml(text)}</a></td></tr>
          </table>
        </td></tr>
      </table>
    `;
    return this;
  }

  buildFooter(): this {
    if (!this.config.footer?.show) return this;
    const colors = this.variant === 'light' ? this.theme.light : this.theme.dark;
    const styles = this.emailStyles.footer;
    const footerBorder = borderFor(styles.accentColor, styles.accentWidth, colors);
    const footerBackground = this.config.footer?.backgroundColor || colors.background;
    const defaultFooterTextColor = contrastRatio(colors.textMuted, footerBackground) >= 4.5 ? colors.textMuted : colors.text;
    const footerTextColor = readableTextColor(this.config.footer?.textColor || defaultFooterTextColor, footerBackground, colors.text);
    const footerAlignment = this.footerAlignment();
    const footerLayout = this.footerLayout();
    const copyrightStyles = escapeHtml(`padding-top:12px;font-family:${this.theme.typography.fontFamily};font-size:${this.theme.typography.fontSizes.small};line-height:1.5;color:${footerTextColor};text-align:center;`);
    const unsubscribeCellStyles = escapeHtml(`padding-top:6px;text-align:center;font-family:${this.theme.typography.fontFamily};font-size:${this.theme.typography.fontSizes.small};line-height:1.5;`);
    const footerStyles = `
      background-color: ${footerBackground};
      border-top: ${footerBorder};
      padding: 20px 24px;
      text-align: ${footerAlignment};
      font-family: ${this.theme.typography.fontFamily};
      font-size: ${this.theme.typography.fontSizes.small};
      line-height: 1.5;
      color: ${footerTextColor};
    `;
    const footerLinks = this.buildFooterLinks();
    const socialLinks = this.buildSocialLinks();
    const footerMeta = `${this.config.footer?.copyrightText ? `
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr><td style="${copyrightStyles}text-align:${footerAlignment};">
                ${escapeHtml(this.config.footer.copyrightText)}
              </td></tr>
            </table>
          ` : ''}
          ${this.config.footer?.unsubscribeText ? `
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr><td style="${unsubscribeCellStyles}text-align:${footerAlignment};">
                ${this.config.footer.unsubscribeUrl
                  ? `<a href="${safeHref(this.config.footer.unsubscribeUrl, true)}" style="color:${footerTextColor};${this.linkDecorationStyle()}">${escapeHtml(this.config.footer.unsubscribeText)}</a>`
                  : escapeHtml(this.config.footer.unsubscribeText)}
              </td></tr>
            </table>
          ` : ''}`;
    const footerContent = footerLayout === 'split'
      ? `<table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td valign="top" align="left" style="width:58%;">${footerLinks}${socialLinks}</td><td valign="top" align="right" style="width:42%;">${footerMeta}</td></tr></table>`
      : footerLayout === 'editorial'
        ? `<div style="border-top:1px solid ${colors.border};padding-top:14px;">${footerLinks}${socialLinks}${footerMeta}</div>`
        : footerLayout === 'bar'
          ? `<table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td valign="middle" align="left" style="width:65%;">${footerLinks}${socialLinks}</td><td valign="middle" align="right" style="width:35%;font-size:11px;">${footerMeta}</td></tr></table>`
        : footerLayout === 'compact'
          ? `${footerLinks}${footerMeta}`
          : footerLayout === 'minimal'
            ? `${footerMeta}${footerLinks}`
          : `${footerLinks}${socialLinks}${footerMeta}`;
    this.template += `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="${footerBackground}" style="width:100%;background-color:${footerBackground};">
        <tr><td class="email-footer-cell" bgcolor="${footerBackground}" style="${escapeHtml(footerStyles)}" align="${footerAlignment}">
          ${footerContent}
        </td></tr>
      </table>
    `;
    return this;
  }

  private buildFooterLinks(): string {
    if (!this.config.footer?.links?.length) return '';
    const colors = this.variant === 'light' ? this.theme.light : this.theme.dark;
    const footerBackground = this.config.footer.backgroundColor || colors.background;
    const preferredLinkColor = contrastRatio(colors.textMuted, footerBackground) >= 4.5 ? colors.textMuted : colors.text;
    const linkColor = readableTextColor(this.config.footer.textColor || preferredLinkColor, footerBackground, colors.text);
    const linkStyles = `color:${linkColor};${this.linkDecorationStyle()}font-family:${this.theme.typography.fontFamily};font-size:${this.theme.typography.fontSizes.small};line-height:1.5;`;
    const alignment = this.footerAlignment();
    const separator = this.isEditorialLayout() ? `border-left:1px solid ${colors.border};` : '';
    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tr><td style="padding-bottom:12px;" align="${alignment}">
          <table class="footer-links" align="${alignment}" cellpadding="0" cellspacing="0" role="presentation">
            <tr>${this.config.footer.links.map((link, index) => `
              <td class="footer-link-cell" style="padding:0 8px;${index ? separator : ''}">
                <a href="${safeHref(link.url, true)}" style="${escapeHtml(linkStyles)}">${escapeHtml(link.text)}</a>
              </td>
            `).join('')}</tr>
          </table>
        </td></tr>
      </table>
    `;
  }

  private linkDecorationStyle(): string {
    const decoration = this.config.linkDecoration === 'underline' ? 'underline' : 'none';
    return `text-decoration:${decoration} !important;`;
  }

  private buildSocialLinks(): string {
    if (!this.config.footer?.socialLinks?.length) return '';
    
    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding: ${this.theme.spacing.md} 0;">
            
            <table cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                ${this.config.footer.socialLinks.map(link => `
                  <td style="padding: 0 6px;">
                    <a href="${safeHref(link.url)}" target="_blank" rel="noopener noreferrer" style="${this.linkDecorationStyle()}">
                      <img 
                        src="${this.getSocialIcon(link.platform)}"
                        width="20"
                        height="20"
                        alt="${escapeHtml(link.platform)}"
                        style="display: block; border: 0;"
                      />
                    </a>
                  </td>
                `).join('')}
              </tr>
            </table>

          </td>
        </tr>
      </table>
    `;
  }

  private getSocialIcon(platform: string): string {
    const icons: Record<string, string> = {
      facebook: 'https://cdn.simpleicons.org/facebook/1877F2',
      linkedin: 'https://cdn.simpleicons.org/linkedin/0A66C2',
      twitter: 'https://cdn.simpleicons.org/x/1DA1F2',
      github: 'https://cdn.simpleicons.org/github/000000',
      instagram: 'https://cdn.simpleicons.org/instagram/E4405F',
      youtube: 'https://cdn.simpleicons.org/youtube/FF0000',
      discord: 'https://cdn.simpleicons.org/discord/5865F2',
      reddit: 'https://cdn.simpleicons.org/reddit/FF4500',
      pinterest: 'https://cdn.simpleicons.org/pinterest/BD081C',
      tiktok: 'https://cdn.simpleicons.org/tiktok/000000',
      gitlab: 'https://cdn.simpleicons.org/gitlab/FC6D26',
      stackoverflow: 'https://cdn.simpleicons.org/stackoverflow/F58025',
      medium: 'https://cdn.simpleicons.org/medium/000000',
      dribbble: 'https://cdn.simpleicons.org/dribbble/EA4C89',
      behance: 'https://cdn.simpleicons.org/behance/1769FF',
      telegram: 'https://cdn.simpleicons.org/telegram/26A5E4'
    };

    return icons[platform] || 'https://cdn.simpleicons.org/virginmedia/5865F2';
  }

  build(): string {
    const colors = this.variant === 'light' ? this.theme.light : this.theme.dark;
    const styles = this.emailStyles;
    const direction = this.config.direction || 'ltr';
    if (!['ltr', 'rtl', 'auto'].includes(direction)) throw new Error('Invalid template text direction');
    const maxWidth = Number.isFinite(styles.maxWidthPx) ? Math.min(800, Math.max(320, Math.round(styles.maxWidthPx))) : 600;
    const containerBorder = borderFor(styles.container.borderColor, styles.container.borderWidth, colors);
    const pageBackground = this.variant === 'light' ? '#f3f4f6' : '#090d15';
    const containerStyles = `
      width: 100%;
      max-width: ${maxWidth}px;
      margin: 0 auto;
      background-color: ${colors.background};
      border: ${containerBorder};
      border-radius: ${styles.container.borderRadius};
      box-shadow: ${styles.container.boxShadow};
      border-collapse: separate;
    `;
    return `
      <!DOCTYPE html>
      <html lang="${escapeHtml(this.config.language || 'en')}" dir="${escapeHtml(direction)}">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="color-scheme" content="${this.variant}">
          <meta name="supported-color-schemes" content="${this.variant}">
          <meta name="x-apple-disable-message-reformatting">
          <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
          <title>Email template</title>
          <style>
            :root { color-scheme:${this.variant}; supported-color-schemes:${this.variant}; }
            body { margin:0 !important; padding:0 !important; width:100% !important; background-color:${pageBackground}; }
            table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
            img { border:0; max-width:100%; height:auto; }
            .container { width:100%; max-width:${maxWidth}px; }
            .button { max-width:100%; }
            @media only screen and (max-width: 600px) {
              .outer-cell { padding:10px 8px !important; }
              .container { width:100% !important; max-width:100% !important; }
              .email-header-cell { padding-left:16px !important; padding-right:16px !important; }
              .email-body { padding-left:16px !important; padding-right:16px !important; }
              .email-footer-cell { padding-left:16px !important; padding-right:16px !important; }
              table.button { display:block !important; width:100% !important; }
              .button-link { box-sizing:border-box !important; display:block !important; width:100% !important; text-align:center !important; }
              .footer-links { width:100% !important; }
              .footer-link-cell { box-sizing:border-box !important; display:block !important; width:100% !important; padding:5px 0 !important; text-align:center !important; }
            }
          </style>
        </head>
        <body style="margin:0;padding:0;background-color:${pageBackground};">
          <table class="email-page" width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="${pageBackground}" style="width:100%;background-color:${pageBackground};">
            <tr><td class="outer-cell" align="center" style="padding:20px 12px;">
              <table class="container" width="${maxWidth}" cellpadding="0" cellspacing="0" role="presentation" bgcolor="${colors.background}" style="${escapeHtml(containerStyles)}">
                <tr><td class="container-content" style="padding:0;">
                  ${this.template}
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
      </html>
    `;
  }
}
