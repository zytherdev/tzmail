
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

  buildHeader(content?: string): this {
    if (!this.config.header?.show) return this;

    const colors = this.variant === 'light' ? this.theme.light : this.theme.dark;
    const styles = this.emailStyles.header;
    const headerBorder = borderFor(styles.accentColor, styles.accentWidth, colors);
    const headerBackground = this.config.header?.backgroundColor || colors.background;
    const headerTextColor = readableTextColor(this.config.header?.textColor || colors.text, headerBackground, colors.text);
    const headerStyles = `
      background-color: ${headerBackground};
      color: ${headerTextColor};
      padding: ${this.theme.spacing.lg} ${styles.horizontalPadding};
      border-bottom: ${headerBorder};
      font-family: ${this.theme.typography.fontFamily};
    `;
    const logoHtml = this.buildLogo();

    this.template += `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="${headerBackground}" style="width:100%;background-color:${headerBackground};">
        <tr>
          <td class="email-header-cell" style="${escapeHtml(headerStyles)}" align="center">
            ${logoHtml}
            ${content ? `
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="padding-top:${this.theme.spacing.md};font-size:${this.theme.typography.fontSizes.medium};line-height:1.4;">
                  ${escapeHtml(content)}
                </td></tr>
              </table>
            ` : ''}
          </td>
        </tr>
      </table>
    `;
    return this;
  }

  private buildLogo(): string {
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
        font-size: ${this.theme.typography.fontSizes.xlarge};
        font-weight: ${this.theme.typography.fontWeights.bold};
        line-height: 1.2;
        color: ${logoColor};
        text-transform: ${styles.logoTextTransform || 'none'};
        letter-spacing: ${styles.logoLetterSpacing || 'normal'};
      `;
      return `<div style="${escapeHtml(textStyles)}">${escapeHtml(logo.text || 'Logo')}</div>`;
    }

    if (logo.type === 'image') {
      const imageHeight = logo.size === 'small' ? 30 : logo.size === 'large' ? 100 : 60;
      return `<img src="${safeHref(logo.imageUrl || '')}" alt="${escapeHtml(logo.alt || 'Logo')}" height="${imageHeight}" style="display:block;width:auto;height:${imageHeight}px;max-width:100%;border:0;border-radius:${styles.imageBorderRadius};margin:0 auto;" />`;
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

    const bodyStyles = `
      padding: ${this.theme.spacing.xl} ${styles.horizontalPadding};
      background-color: ${bodyBackground};
      color: ${bodyTextColor};
      font-family: ${this.theme.typography.fontFamily};
      font-size: ${this.theme.typography.fontSizes.medium};
      line-height: ${styles.lineHeight};
      border-left: ${accentBorder};
      border-radius: ${styles.borderRadius};
      box-shadow: ${styles.boxShadow};
      word-wrap: break-word;
      overflow-wrap: break-word;
    `;
    this.template += `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="${bodyBackground}" style="width:100%;background-color:${bodyBackground};">
        <tr><td class="email-body" style="${escapeHtml(bodyStyles)}">${processedContent}</td></tr>
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
    const alignment = this.config.body?.alignment || 'left';
    const buttonTextColor = isOutline
      ? contrastRatio(buttonColor, colors.background) >= 4.5 ? buttonColor : colors.text
      : accessibleTextColor(buttonColor);
    const buttonStyles = `
      display: inline-block;
      box-sizing: border-box;
      max-width: 100%;
      padding: 13px 24px;
      background-color: ${isOutline ? colors.background : buttonColor};
      border: ${button.borderWidth} solid ${isOutline ? buttonColor : 'transparent'};
      border-radius: ${button.borderRadius};
      box-shadow: ${button.boxShadow};
      color: ${buttonTextColor};
      font-family: ${this.theme.typography.fontFamily};
      font-size: ${this.theme.typography.fontSizes.medium};
      font-weight: ${this.theme.typography.fontWeights.bold};
      line-height: 1.3;
      letter-spacing: ${button.letterSpacing || 'normal'};
      text-transform: ${button.textTransform || 'none'};
      text-decoration: none !important;
    `;
    this.template += `
      <table width="100%" class="button-wrap" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tr><td align="${alignment}" style="padding:${this.theme.spacing.sm} 8px;">
          <table class="button" align="${alignment}" cellpadding="0" cellspacing="0" role="presentation">
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
    const copyrightStyles = escapeHtml(`padding-top:${this.theme.spacing.md};font-family:${this.theme.typography.fontFamily};font-size:${this.theme.typography.fontSizes.small};line-height:1.5;color:${footerTextColor};text-align:center;`);
    const unsubscribeCellStyles = escapeHtml(`padding-top:${this.theme.spacing.sm};text-align:center;font-family:${this.theme.typography.fontFamily};font-size:${this.theme.typography.fontSizes.small};line-height:1.5;`);
    const footerStyles = `
      background-color: ${footerBackground};
      border-top: ${footerBorder};
      padding: ${this.theme.spacing.lg} ${this.theme.spacing.xl};
      text-align: center;
      font-family: ${this.theme.typography.fontFamily};
      font-size: ${this.theme.typography.fontSizes.small};
      line-height: 1.5;
      color: ${footerTextColor};
    `;
    const footerLinks = this.buildFooterLinks();
    const socialLinks = this.buildSocialLinks();
    this.template += `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="${footerBackground}" style="width:100%;background-color:${footerBackground};">
        <tr><td class="email-footer-cell" bgcolor="${footerBackground}" style="${escapeHtml(footerStyles)}" align="center">
          ${footerLinks}
          ${socialLinks}
          ${this.config.footer?.copyrightText ? `
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr><td style="${copyrightStyles}">
                ${escapeHtml(this.config.footer.copyrightText)}
              </td></tr>
            </table>
          ` : ''}
          ${this.config.footer?.unsubscribeText ? `
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr><td style="${unsubscribeCellStyles}">
                ${this.config.footer.unsubscribeUrl
                  ? `<a href="${safeHref(this.config.footer.unsubscribeUrl, true)}" style="color:${footerTextColor};${this.linkDecorationStyle()}">${escapeHtml(this.config.footer.unsubscribeText)}</a>`
                  : escapeHtml(this.config.footer.unsubscribeText)}
              </td></tr>
            </table>
          ` : ''}
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
    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tr><td style="padding-bottom:${this.theme.spacing.md};" align="center">
          <table class="footer-links" cellpadding="0" cellspacing="0" role="presentation">
            <tr>${this.config.footer.links.map(link => `
              <td class="footer-link-cell" style="padding:0 8px;">
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
