
import { ITemplateConfig } from '../../core/interfaces/template.interface';
import { ITheme } from '../themes/theme.interface';
import { MonokaiTheme } from '../themes/monokai.theme';
import { ModernTheme } from '../themes/modern.theme';
import { CorporateTheme } from '../themes/corporate.theme';
import { MinimalTheme } from '../themes/minimal.theme';

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

  buildHeader(content?: string): this {
    if (!this.config.header?.show) return this;

    const colors = this.variant === 'light' ? this.theme.light : this.theme.dark;
    const isMonokai = this.theme.id === 'monokai';
    const isModern = this.theme.id === 'modern';
    const isCorporate = this.theme.id === 'corporate';
    const isMinimal = this.theme.id === 'minimal';
    
    let headerStyles = `
      background-color: ${this.config.header?.backgroundColor || colors.background};
      color: ${this.config.header?.textColor || colors.text};
      padding: ${this.theme.spacing.lg} ${this.theme.spacing.xl};
    `;
    
    // styles específicos para tema Corporate
    if (isCorporate) {
      const corporate = this.theme as CorporateTheme;
      headerStyles += `
        border-bottom: ${corporate.borderStyle.width.medium} solid ${corporate.corporateColors.gold};
        box-shadow: ${corporate.elevation.shadow};
        text-transform: ${corporate.branding.textTransform.uppercase};
        letter-spacing: ${corporate.branding.letterSpacing.wide};
      `;
    }
    
    // styles específicos para tema Minimal
    if (isMinimal) {
      const minimal = this.theme as MinimalTheme;
      headerStyles += `
        border-bottom: ${minimal.borderStyle.width.thin} solid ${colors.border};
        padding: ${minimal.spacing.lg} ${minimal.spacing.xl};
      `;
    }
    
    // styles existentes para outros temas
    else if (isModern) {
      headerStyles += `
        border-bottom: 1px solid ${colors.border};
        backdrop-filter: blur(${(this.theme as ModernTheme).glassmorphism.blur});
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      `;
    } else if (isMonokai) {
      headerStyles += `
        border-bottom: 2px solid ${colors.primary};
        box-shadow: ${(this.theme as MonokaiTheme).effects.shadow};
        transition: ${(this.theme as MonokaiTheme).effects.transition};
      `;
    } else {
      headerStyles += `
        border-bottom: 1px solid ${colors.border};
      `;
    }
    
    const logoHtml = this.buildLogo();
    
    this.template += `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="${headerStyles}" align="center">
            
            ${logoHtml}

            ${content ? `
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="
                    padding-top: ${this.theme.spacing.md};
                    ${isCorporate ? 'font-family: serif;' : ''}
                    ${isMinimal ? 'font-weight: 300;' : ''}
                  ">
                    ${escapeHtml(content)}
                  </td>
                </tr>
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
    const isMonokai = this.theme.id === 'monokai';
    const isModern = this.theme.id === 'modern';
    const isCorporate = this.theme.id === 'corporate';
    const isMinimal = this.theme.id === 'minimal';

    if (logo.type === 'text') {
      let textStyles = `
        font-size: ${this.theme.typography.fontSizes.xlarge};
        font-weight: ${this.theme.typography.fontWeights.bold};
        color: ${colors.primary};
      `;
      
      // styles para tema Corporate
      if (isCorporate) {
        const corporate = this.theme as CorporateTheme;
        textStyles += `
          font-family: 'Playfair Display', serif;
          letter-spacing: ${corporate.branding.letterSpacing.wider};
          text-transform: ${corporate.branding.textTransform.uppercase};
          color: ${corporate.corporateColors.gold};
        `;
      }
      
      // styles para tema Minimal
      else if (isMinimal) {
        textStyles += `
          font-weight: 500;
          letter-spacing: -0.5px;
          color: ${colors.text};
        `;
      }
      
      // styles existentes
      else if (isMonokai) {
        textStyles += `
          letter-spacing: -0.5px;
          text-shadow: ${(this.theme as MonokaiTheme).effects.glow};
        `;
      } else if (isModern) {
        textStyles += `
          background: ${(this.theme as ModernTheme).gradients.primary};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        `;
      }
      
      return `<div style="${textStyles}">${escapeHtml(logo.text || 'Logo')}</div>`;
    }

    if (logo.type === 'image') {
      let imageStyles = `
        height: ${logo.size === 'small' ? '30px' : logo.size === 'large' ? '100px' : '60px'};
        width: auto;
      `;
      
      if (isModern) {
        imageStyles += `
          border-radius: ${(this.theme as ModernTheme).borderStyle.radius.small};
          transition: ${(this.theme as ModernTheme).animations.hover};
        `;
      } else if (isCorporate) {
        imageStyles += `
          border-radius: ${(this.theme as CorporateTheme).borderStyle.radius.small};
        `;
      }
      
      return `<img src="${safeHref(logo.imageUrl || '')}" alt="${escapeHtml(logo.alt || 'Logo')}" style="${imageStyles}" />`;
    }

    return '';
  }

  buildBody(content: string): this {
    const colors = this.variant === 'light' ? this.theme.light : this.theme.dark;
    const isMonokai = this.theme.id === 'monokai';
    const isModern = this.theme.id === 'modern';
    const isCorporate = this.theme.id === 'corporate';
    const isMinimal = this.theme.id === 'minimal';
    
    let bodyStyles = `
      padding: ${this.theme.spacing.xl}!important;
      background-color: ${colors.background};
      color: ${colors.text};
      font-family: ${this.theme.typography.fontFamily};
      font-size: ${this.theme.typography.fontSizes.medium};
      line-height: ${isMinimal ? 1.7 : 1.6};
    `;
    
    // styles para tema Corporate
    if (isCorporate) {
      const corporate = this.theme as CorporateTheme;
      bodyStyles += `
        border-left: 4px solid ${corporate.corporateColors.gold};
        margin: ${this.theme.spacing.md} 0;
        box-shadow: ${corporate.elevation.card};
      `;
    }
    
    // styles para tema Minimal
    else if (isMinimal) {
      bodyStyles += `
        padding: ${this.theme.spacing.xl} ${this.theme.spacing.lg}!important;
        max-width: ${(this.theme as MinimalTheme).layout.contentWidth};
        margin: 0 auto;
      `;
    }
    
    // styles existentes
    else if (isModern) {
      bodyStyles += `
        border-radius: ${(this.theme as ModernTheme).borderStyle.radius.medium};
        margin: ${this.theme.spacing.md};
      `;
    } else if (isMonokai) {
      bodyStyles += `
        border-left: 4px solid ${colors.primary};
        margin: ${this.theme.spacing.md} 0;
      `;
    }
    
    // Processar conteúdo com formatação específica
    let processedContent = content;
    
    if (isCorporate) {
      processedContent = this.formatCorporateContent(content);
    } else if (isMinimal) {
      processedContent = this.formatMinimalContent(content);
    } else if (isMonokai && content.includes('<code>')) {
      processedContent = this.highlightCode(content);
    }
    
    this.template += `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #ffffff; padding: 10px;">
      <tr>
        <td style="${bodyStyles}">
          ${processedContent}
        </td>
      </tr>
    </table>
    `;

    return this;
  }

  private formatCorporateContent(content: string): string {
    // add els corporativos como citações e destaques
    return content
      .replace(/<blockquote>(.*?)<\/blockquote>/g, (match, quote) => {
        const corporate = this.theme as CorporateTheme;
        return `<blockquote style="
          border-left: 4px solid ${corporate.corporateColors.gold};
          margin: ${this.theme.spacing.md} 0;
          padding: ${this.theme.spacing.md}!important;
          font-style: italic;
          color: ${corporate.light.textMuted};
        ">${quote}</blockquote>`;
      })
      .replace(/<highlight>(.*?)<\/highlight>/g, (match, text) => {
        const corporate = this.theme as CorporateTheme;
        return `<span style="
          background: linear-gradient(120deg, ${corporate.corporateColors.gold}20 0%, ${corporate.corporateColors.gold}20 40%, transparent 60%);
          padding: 0 ${this.theme.spacing.xs}!important;
          font-weight: bold;
        ">${text}</span>`;
      });
  }

  private formatMinimalContent(content: string): string {
    const minimal = this.theme as MinimalTheme;
    
    // fmt minimalista - remove styles desnecessários
    return content
      .replace(/<h[1-6]>/g, (match) => {
        const level = match.match(/h([1-6])/)?.[1] || '2';
        const size = {
          '1': '24px',
          '2': '20px',
          '3': '18px',
          '4': '16px',
          '5': '14px',
          '6': '13px'
        }[level];
        
        return `<h${level} style="
          font-size: ${size};
          font-weight: 500;
          margin: ${minimal.spacing.lg} 0 ${minimal.spacing.md} 0;
          line-height: 1.3;
        ">`;
      })
      .replace(/<p>/g, `<p style="margin: 0 0 ${minimal.layout.paragraphSpacing} 0;">`);
  }

  private highlightCode(content: string): string {
    const monokai = this.theme as MonokaiTheme;
    
    return content.replace(/<code>(.*?)<\/code>/g, (match, code) => {
      return `<pre style="
        background: ${monokai.dark.background};
        color: ${monokai.dark.text};
        padding: ${this.theme.spacing.md}!important;
        border-radius: ${monokai.borderStyle.radius};
        overflow-x: auto;
        font-family: ${this.theme.typography.fontFamily};
        font-size: 13px;
        line-height: 1.5;
      "><code>${this.applySyntaxHighlighting(code, monokai)}</code></pre>`;
    });
  }

  private applySyntaxHighlighting(code: string, monokai: MonokaiTheme): string {
    // smp highlighting para demonstração
    const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'return', 'import', 'from'];
    let highlighted = code;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span style="color: ${monokai.codeHighlight.keyword}">$1</span>`);
    });
    
    // strs
    highlighted = highlighted.replace(/'([^']*)'/g, `<span style="color: ${monokai.codeHighlight.string}">'$1'</span>`);
    highlighted = highlighted.replace(/"([^"]*)"/g, `<span style="color: ${monokai.codeHighlight.string}">"$1"</span>`);
    
    // nums
    highlighted = highlighted.replace(/\b(\d+)\b/g, `<span style="color: ${monokai.codeHighlight.number}">$1</span>`);
    
    // funcs
    highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, `<span style="color: ${monokai.codeHighlight.function}">$1</span>(`);
    
    return highlighted;
  }

  buildButton(text: string, url: string, variant: 'primary' | 'secondary' | 'success' | 'danger' = 'primary'): this {
    const colors = this.variant === 'light' ? this.theme.light : this.theme.dark;
    const isModern = this.theme.id === 'modern';
    const isMonokai = this.theme.id === 'monokai';
    const isCorporate = this.theme.id === 'corporate';
    const isMinimal = this.theme.id === 'minimal';
    
    if (!['primary', 'secondary', 'success', 'danger'].includes(variant)) throw new Error('Invalid CTA variant');
    const safeUrl = safeHref(url, true);
    const buttonColor = variant === 'primary' ? colors.primary : variant === 'secondary' ? colors.secondary : variant === 'success' ? '#16a34a' : '#dc2626';
    let buttonStyles = `
      display: inline-block;
      padding: 12px 24px!important;
      background-color: ${buttonColor};
      color: white;
      text-decoration: none;
      font-weight: ${this.theme.typography.fontWeights.medium};
      margin: ${this.theme.spacing.md} 0;
    `;
    
    // styles para tema Corporate
    if (isCorporate) {
      const corporate = this.theme as CorporateTheme;
      buttonStyles += `
        border-radius: ${corporate.borderStyle.radius.small};
        text-transform: ${corporate.branding.textTransform.uppercase};
        letter-spacing: ${corporate.branding.letterSpacing.wide};
        transition: all 0.3s ease;
        &:hover {
          transform: translateY(-2px);
          box-shadow: ${corporate.elevation.hover};
        }
      `;
    }
    
    // styles para tema Minimal
    else if (isMinimal) {
      buttonStyles += `
        border-radius: 0;
        border: 1px solid ${buttonColor};
        background-color: transparent;
        color: ${buttonColor};
        padding: 10px 20px!important;
        transition: all 0.2s ease;
        &:hover {
          background-color: ${buttonColor};
          color: white;
        }
      `;
    }
    
    // styles existentes
    else if (isModern) {
      buttonStyles += `
        background: ${(this.theme as ModernTheme).gradients.primary};
        border-radius: ${(this.theme as ModernTheme).borderStyle.radius.medium};
        transition: ${(this.theme as ModernTheme).animations.hover};
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      `;
    } else if (isMonokai) {
      buttonStyles += `
        border: 2px solid ${buttonColor};
        border-radius: ${(this.theme as MonokaiTheme).borderStyle.radius};
        transition: ${(this.theme as MonokaiTheme).effects.transition};
        &:hover {
          transform: translateY(-2px);
          box-shadow: ${(this.theme as MonokaiTheme).effects.glow};
        }
      `;
    } else {
      buttonStyles += `
        border-radius: 4px;
      `;
    }
    
    this.template += `
      <table width="100%" style="padding: 10px;" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            
            <table cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="${buttonStyles}">
                  <a href="${safeUrl}" style="
                    text-decoration: none;
                    color: inherit;
                    display: inline-block;
                    font-weight: ${this.theme.typography.fontWeights.bold};
                    padding: 12px 24px;
                  ">
                    ${escapeHtml(text)}
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
    `;
    
    return this;
  }

  buildFooter(): this {
    if (!this.config.footer?.show) return this;

    const colors = this.variant === 'light' ? this.theme.light : this.theme.dark;
    const isModern = this.theme.id === 'modern';
    const isMonokai = this.theme.id === 'monokai';
    const isCorporate = this.theme.id === 'corporate';
    const isMinimal = this.theme.id === 'minimal';
    
    let footerStyles = `
      background-color: ${this.config.footer?.backgroundColor || colors.background};
      border-top: 1px solid ${colors.border};
      padding: ${this.theme.spacing.lg} ${this.theme.spacing.xl}!important;
      text-align: center;
      font-size: ${this.theme.typography.fontSizes.small};
      color: ${this.config.footer?.textColor || colors.textMuted};
    `;
    
    // styles para tema Corporate
    if (isCorporate) {
      const corporate = this.theme as CorporateTheme;
      footerStyles += `
        border-top: 2px solid ${corporate.corporateColors.gold};
        font-size: 11px;
        letter-spacing: ${corporate.branding.letterSpacing.normal};
      `;
    }
    
    // styles para tema Minimal
    else if (isMinimal) {
      footerStyles += `
        border-top: 1px solid ${colors.border};
        padding: ${(this.theme as MinimalTheme).spacing.lg}!important;
        font-size: 12px;
      `;
    }
    
    // styles existentes
    else if (isModern) {
      footerStyles += `
        backdrop-filter: blur(${(this.theme as ModernTheme).glassmorphism.blur});
        border-radius: ${(this.theme as ModernTheme).borderStyle.radius.small};
      `;
    } else if (isMonokai) {
      footerStyles += `
        border-top-width: 2px;
        border-top-color: ${colors.primary};
      `;
    }
    
    const footerLinks = this.buildFooterLinks();
    const socialLinks = this.buildSocialLinks();

    this.template += `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="${footerStyles}" align="center">

            ${footerLinks}

            ${socialLinks}

            ${this.config.footer?.copyrightText ? `
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="
                    padding-top: ${this.theme.spacing.md};
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    color: ${colors.textMuted};
                    text-align: center;
                  ">
                    ${escapeHtml(this.config.footer.copyrightText)}
                  </td>
                </tr>
              </table>
            ` : ''}

            ${this.config.footer?.unsubscribeText ? `
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="
                    padding-top: ${this.theme.spacing.sm};
                    text-align: center;
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                  ">
                    ${this.config.footer.unsubscribeUrl
                      ? `<a href="${safeHref(this.config.footer.unsubscribeUrl, true)}" style="color: ${colors.textMuted}; text-decoration: underline;">${escapeHtml(this.config.footer.unsubscribeText)}</a>`
                      : escapeHtml(this.config.footer.unsubscribeText)}
                  </td>
                </tr>
              </table>
            ` : ''}

          </td>
        </tr>
      </table>
    `;
    
    return this;
  }

  private buildFooterLinks(): string {
    if (!this.config.footer?.links?.length) return '';
    
    const colors = this.variant === 'light' ? this.theme.light : this.theme.dark;
    const isModern = this.theme.id === 'modern';
    const isCorporate = this.theme.id === 'corporate';
    const isMinimal = this.theme.id === 'minimal';
    
    let linkStyles = `
      color: ${colors.textMuted};
      text-decoration: none;
      margin: 0 ${this.theme.spacing.sm};
    `;
    
    if (isModern) {
      linkStyles += `
        transition: ${(this.theme as ModernTheme).animations.hover};
        &:hover {
          color: ${colors.primary};
          transform: translateY(-1px);
        }
      `;
    } else if (isCorporate) {
      linkStyles += `
        text-transform: uppercase;
        font-size: 11px;
        letter-spacing: 0.5px;
        &:hover {
          color: ${(this.theme as CorporateTheme).corporateColors.gold};
        }
      `;
    } else if (isMinimal) {
      linkStyles += `
        &:hover {
          text-decoration: underline;
        }
      `;
    }
    
    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="padding-bottom: ${this.theme.spacing.lg};" align="center">
            
            <table cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                ${this.config.footer.links.map(link => `
                  <td style="padding: 0 8px;">
                    <a href="${safeHref(link.url, true)}" style="${linkStyles}">
                      ${escapeHtml(link.text)}
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
                    <a href="${safeHref(link.url)}" target="_blank" rel="noopener noreferrer">
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
    const isModern = this.theme.id === 'modern';
    const isMonokai = this.theme.id === 'monokai';
    const isCorporate = this.theme.id === 'corporate';
    const isMinimal = this.theme.id === 'minimal';
    
    const wrapperStyles = 'margin: 0; padding: 0;';
    let containerStyles = `max-width: ${isMinimal ? '640px' : '600px'}; margin: 0 auto;`;
    
    if (isModern) {
      containerStyles += `
        border-radius: ${(this.theme as ModernTheme).borderStyle.radius.large};
        overflow: hidden;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
      `;
    } else if (isMonokai) {
      containerStyles += `
        border: 1px solid ${this.theme.light.border};
        border-radius: ${(this.theme as MonokaiTheme).borderStyle.radius};
      `;
    } else if (isCorporate) {
      containerStyles += `
        border: 1px solid ${this.theme.light.border};
        box-shadow: ${(this.theme as CorporateTheme).elevation.card};
      `;
    } else if (isMinimal) {
      containerStyles += `
        border: none;
      `;
    }
    
    const backgroundColor = this.variant === 'light' ? '#f5f5f5' : '#1a1a1a';
    const finalBackgroundColor = isMinimal ? (this.variant === 'light' ? '#ffffff' : '#000000') : backgroundColor;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
              }
              .button {
                display: block !important;
                width: 100% !important;
              }
            }
          </style>
        </head>
        <body style="${wrapperStyles}">
          <div class="container" style="${containerStyles} background-color: ${finalBackgroundColor};">
            ${this.template}
          </div>
        </body>
      </html>
    `;
  }
}
